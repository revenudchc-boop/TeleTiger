"""
محاكي سنترال Avaya لإرسال بيانات SMDR إلى TeleTiger
يقوم بقراءة ملف SMDR وإرساله سطراً سطراً عبر الشبكة
"""

import socket
import time
import threading
from datetime import datetime
import random

class AvayaSimulator:
    def __init__(self, target_host='localhost', target_port=9000):
        self.target_host = target_host
        self.target_port = target_port
        self.socket = None
        self.is_running = False
        self.calls_sent = 0
    
    def connect(self):
        """الاتصال بمستمع TeleTiger"""
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.connect((self.target_host, self.target_port))
            print(f"✅ متصل بـ TeleTiger على {self.target_host}:{self.target_port}")
            return True
        except Exception as e:
            print(f"❌ فشل الاتصال: {e}")
            print("   تأكد من تشغيل TeleTiger أولاً (py app.py)")
            return False
    
    def send_line(self, line: str):
        """إرسال سطر SMDR واحد"""
        if not self.socket:
            return False
        try:
            self.socket.send((line + '\n').encode('utf-8'))
            self.calls_sent += 1
            return True
        except:
            return False
    
    def send_file(self, file_path: str, delay: float = 0.5):
        """إرسال ملف SMDR كامل"""
        if not self.connect():
            return
        
        print(f"\n📁 قراءة الملف: {file_path}")
        
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        
        print(f"📊 عدد السطور: {len(lines)}")
        print("🚀 بدء الإرسال...\n")
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
            
            # إرسال فقط الأسطر التي تبدأ بالتاريخ (مثل 2018/08/08)
            if line[0:4].isdigit() and len(line) > 10:
                if self.send_line(line):
                    # عرض مختصر للسطر المرسل
                    parts = line.split(',')
                    if len(parts) > 5:
                        print(f"📞 [{i+1}] {parts[0]} | ملحق:{parts[3]} | اتجاه:{parts[4]} | مدة:{parts[1]}")
                    else:
                        print(f"📞 [{i+1}] {line[:60]}...")
                else:
                    print(f"❌ فشل إرسال السطر {i+1}")
                
                time.sleep(delay)  # محاكاة وصول البيانات بشكل متسلسل
        
        print(f"\n✅ اكتمل الإرسال! تم إرسال {self.calls_sent} مكالمة")
        self.disconnect()
    
    def send_realtime(self, file_path: str, calls_per_second: float = 2):
        """إرسال المكالمات في الوقت الفعلي (محاكاة الزمن الحقيقي)"""
        if not self.connect():
            return
        
        delay = 1.0 / calls_per_second
        
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        
        print(f"🕐 إرسال في الوقت الفعلي: {calls_per_second} مكالمة/ثانية\n")
        
        for line in lines:
            line = line.strip()
            if line and line[0:4].isdigit():
                self.send_line(line)
                print(f"📞 {datetime.now().strftime('%H:%M:%S')} | {line[:50]}...")
                time.sleep(delay)
        
        print(f"\n✅ اكتمل! تم إرسال {self.calls_sent} مكالمة")
        self.disconnect()
    
    def send_custom_call(self, extension: str, direction: str, dialed: str, duration: int):
        """إرسال مكالمة مخصصة للاختبار"""
        timestamp = datetime.now().strftime("%Y/%m/%d %H:%M:%S")
        duration_str = f"00:00:{duration:02d}" if duration < 60 else f"00:{duration//60:02d}:{duration%60:02d}"
        
        # تنسيق Avaya SMDR
        line = f"{timestamp},{duration_str},0,{extension},{direction},{dialed},,,0,{random.randint(1000000,9999999)},0,E{extension},User,{dialed},Destination"
        
        if self.send_line(line):
            print(f"📞 مكالمة مخصصة: {timestamp} | {extension} | {direction} | {dialed} | {duration}ث")
            return True
        return False
    
    def disconnect(self):
        """قطع الاتصال"""
        if self.socket:
            self.socket.close()
            self.socket = None
            print("🔌 تم قطع الاتصال")


def show_menu():
    """عرض قائمة المحاكي"""
    print("\n" + "=" * 50)
    print("🖥️  محاكي سنترال Avaya")
    print("=" * 50)
    print("1. إرسال ملف SMDR كامل (مع تأخير)")
    print("2. إرسال ملف SMDR في الوقت الفعلي")
    print("3. إرسال مكالمة مخصصة للاختبار")
    print("4. إرسال سلسلة من المكالمات التجريبية")
    print("5. اختبار الاتصال فقط")
    print("0. خروج")
    print("=" * 50)


def send_test_calls(simulator):
    """إرسال سلسلة من المكالمات التجريبية"""
    test_calls = [
        ("1701", "O", "90512345678", 97),
        ("1163", "O", "90505420326", 186),
        ("1335", "O", "90551831719", 52),
        ("1002", "O", "90555555555", 30),
        ("1703", "I", "90512345678", 45),
    ]
    
    print("\n📞 إرسال مكالمات تجريبية...")
    for ext, direction, dialed, duration in test_calls:
        simulator.send_custom_call(ext, direction, dialed, duration)
        time.sleep(1)
    print("✅ اكتمل إرسال المكالمات التجريبية")


if __name__ == "__main__":
    print("🔄 محاكي سنترال Avaya")
    print("ملاحظة: تأكد من تشغيل TeleTiger أولاً (py app.py)\n")
    
    simulator = AvayaSimulator(target_host='localhost', target_port=9000)
    
    # ملف SMDR الموجود
    smdr_file = "RAW-09082018.Txt"
    
    while True:
        show_menu()
        choice = input("\nاختر خيار: ").strip()
        
        if choice == "1":
            simulator.send_file(smdr_file, delay=0.3)
        
        elif choice == "2":
            simulator.send_realtime(smdr_file, calls_per_second=3)
        
        elif choice == "3":
            ext = input("رقم الملحق: ")
            direction = input("الاتجاه (O/I): ")
            dialed = input("الرقم المطلوب: ")
            duration = int(input("المدة (ثواني): "))
            simulator.send_custom_call(ext, direction, dialed, duration)
        
        elif choice == "4":
            send_test_calls(simulator)
        
        elif choice == "5":
            simulator.connect()
            simulator.disconnect()
        
        elif choice == "0":
            print("👋 الخروج من المحاكي...")
            break
        
        else:
            print("❌ خيار غير صالح")