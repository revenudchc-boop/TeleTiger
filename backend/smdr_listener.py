import socket
import threading
import time
import asyncio
from database import DatabaseManager
from smdr_parser import SMDRParser
from config import Config

class SMDRListener:
    def __init__(self, host=None, port=None, ws_manager=None):
        self.host = host or Config.SMDR_LISTEN_HOST
        self.port = port or Config.SMDR_LISTEN_PORT
        self.server = None
        self.parser = SMDRParser()
        self.db = DatabaseManager()
        self.is_running = False
        self.ws_manager = ws_manager

    def start(self):
        try:
            self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self.server.bind((self.host, self.port))
            self.server.listen(5)
            self.is_running = True
            print(f"✅ SMDR Listener started on {self.host}:{self.port}")

            while self.is_running:
                try:
                    self.server.settimeout(1.0)
                    client_socket, address = self.server.accept()
                    print(f"📞 Connection from {address}")
                    client_handler = threading.Thread(target=self.handle_client, args=(client_socket,))
                    client_handler.daemon = True
                    client_handler.start()
                except socket.timeout:
                    continue
                except OSError as e:
                    if self.is_running:
                        print(f"⚠️ Socket error: {e}")
                    break
                except Exception as e:
                    print(f"⚠️ Error: {e}")
        except Exception as e:
            print(f"❌ Failed to start listener: {e}")
        finally:
            print("🛑 Listener stopped")

    def handle_client(self, client_socket):
        buffer = ""
        while True:
            try:
                data = client_socket.recv(4096).decode('utf-8', errors='ignore')
                if not data:
                    break
                buffer += data
                lines = buffer.split('\n')
                buffer = lines[-1]
                for line in lines[:-1]:
                    if line.strip():
                        self.process_line(line)
            except Exception as e:
                print(f"Error handling client: {e}")
                break
        try:
            client_socket.close()
        except:
            pass

    def process_line(self, line):
        # طباعة السطر الكامل بدون أي اختصار
        print(f"📝 RAW DATA FROM PBX (FULL): {line}")
        print(f"📏 طول السطر: {len(line)} حرف")
        print(f"🔢 عدد الفواصل: {line.count(',')}")
        
        # طباعة الأجزاء بشكل منفصل لسهولة القراءة
        parts = line.split(',')
        print(f"📊 عدد الأجزاء: {len(parts)}")
        for i, part in enumerate(parts):
            print(f"   الجزء {i}: '{part}'")
        
        print("-" * 50)
        
        call = self.parser.parse_line(line)
        if call:
            call_id = self.db.save_call(call)
            if call_id > 0:
                print(f"✅ Saved call: {call.extension} - {call.direction} - {call.duration_seconds}s")
                
                # ========== إرسال المكالمة عبر WebSocket ==========
                if self.ws_manager:
                    try:
                        call_dict = {
                            "id": call_id,
                            "timestamp": call.timestamp,
                            "duration": call.duration,
                            "duration_seconds": call.duration_seconds,
                            "extension": call.extension,
                            "direction": call.direction,
                            "dialed_number": call.dialed_number,
                            "cost": call.cost,
                            "call_id": call.call_id,
                            "source_device": call.source_device,
                            "source_name": call.source_name,
                            "dest_device": call.dest_device,
                            "dest_name": call.dest_name,
                            "cli_number": call.cli_number,
                            "ddi_number": call.ddi_number,
                            "call_type": call.call_type,
                            "ring_duration": call.ring_duration,
                            "hold_duration": call.hold_duration,
                            "account_code": call.account_code,
                            "trunk_used": call.trunk_used,
                            "continuation": call.continuation
                        }
                        asyncio.run(self.ws_manager.broadcast_new_call(call_dict))
                    except Exception as e:
                        print(f"⚠️ WebSocket broadcast error: {e}")
                # =================================================
            else:
                print(f"⚠️ Duplicate or error for call ID: {call.call_id}")
        else:
            print(f"⚠️ Failed to parse line")

    def stop(self):
        print("🛑 Stopping SMDR Listener...")
        self.is_running = False
        if self.server:
            try:
                self.server.close()
            except:
                pass
            self.server = None

if __name__ == "__main__":
    listener = SMDRListener()
    try:
        listener.start()
    except KeyboardInterrupt:
        print("\n🛑 Stopping SMDR Listener...")
        listener.stop()