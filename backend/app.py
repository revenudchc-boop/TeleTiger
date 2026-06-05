from fastapi import FastAPI, UploadFile, File, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
from typing import Optional, List
from contextlib import asynccontextmanager
import os
import shutil
import threading
import json
import time
import socket
from smdr_listener import SMDRListener

from smdr_parser import SMDRParser
from call_analyzer import CallAnalyzer
from database import DatabaseManager
from models import CallRecord, SummaryReport

# ========== WebSocket Connection Manager ==========
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"🟢 WebSocket client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"🔴 WebSocket client disconnected. Total: {len(self.active_connections)}")

    async def broadcast_new_call(self, call_data: dict):
        if not self.active_connections:
            return
        for connection in self.active_connections:
            try:
                await connection.send_json({
                    "type": "new_call",
                    "data": call_data
                })
            except:
                pass

manager = ConnectionManager()

# ========== إعدادات المستمع ==========
@asynccontextmanager
async def lifespan(app: FastAPI):
    global smdr_listener, listener_thread
    smdr_listener = SMDRListener(host='0.0.0.0', port=9000, ws_manager=manager)
    listener_thread = threading.Thread(target=smdr_listener.start, daemon=True)
    listener_thread.start()
    print("🚀 SMDR Listener started on port 9000")
    yield
    print("🛑 Shutting down SMDR Listener...")
    smdr_listener.stop()

app = FastAPI(title="TeleTiger Call Management System", lifespan=lifespan)

# السماح بـ CORS للواجهة الأمامية
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# مجلد الملفات المؤقتة
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

parser = SMDRParser()
db = DatabaseManager()

@app.get("/")
async def root():
    """الصفحة الرئيسية"""
    return {"message": "TeleTiger Call Management System API", "status": "running"}

@app.post("/api/upload")
async def upload_smdr_file(file: UploadFile = File(...)):
    """رفع ملف SMDR وتحليله"""
    if not (file.filename.endswith('.txt') or file.filename.endswith('.Txt') or file.filename.endswith('.TXT')):
        raise HTTPException(status_code=400, detail="الملف يجب أن يكون من نوع txt")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        calls = parser.parse_file(content)
        
        saved_count = 0
        for call in calls:
            if db.save_call(call) > 0:
                saved_count += 1
        
        return {
            "status": "success",
            "message": f"تم تحليل {len(calls)} مكالمة، تم حفظ {saved_count} منها",
            "total_calls": len(calls),
            "saved": saved_count,
            "file_path": file_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"خطأ في معالجة الملف: {str(e)}")

@app.get("/api/calls")
async def get_calls(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    extension: Optional[str] = None,
    direction: Optional[str] = None,
    limit: int = 500
):
    # تحويل التواريخ إلى الصيغة الصحيحة لقاعدة البيانات
    if start_date:
        start_date = start_date.replace('-', '/') + " 00:00:00"
        print(f"📅 تاريخ البداية بعد التحويل: {start_date}")
    if end_date:
        end_date = end_date.replace('-', '/') + " 23:59:59"
        print(f"📅 تاريخ النهاية بعد التحويل: {end_date}")
    
    calls = db.get_calls(
        start_date=start_date,
        end_date=end_date,
        extension=extension,
        direction=direction,
        limit=limit
    )
    
    return {
        "calls": [call.model_dump() for call in calls],
        "total": len(calls)
    }

@app.get("/api/summary")
async def get_summary(
    period: str = "week",
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    from datetime import datetime, timedelta
    
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    if start_date and end_date:
        start = start_date.replace('-', '/') + " 00:00:00"
        end = end_date.replace('-', '/') + " 23:59:59"
    else:
        if period == "today":
            start = today.strftime("%Y/%m/%d") + " 00:00:00"
            end = today.strftime("%Y/%m/%d") + " 23:59:59"
        elif period == "yesterday":
            yesterday = today - timedelta(days=1)
            start = yesterday.strftime("%Y/%m/%d") + " 00:00:00"
            end = yesterday.strftime("%Y/%m/%d") + " 23:59:59"
        elif period == "week":
            start = (today - timedelta(days=7)).strftime("%Y/%m/%d") + " 00:00:00"
            end = today.strftime("%Y/%m/%d") + " 23:59:59"
        elif period == "month":
            start = (today - timedelta(days=30)).strftime("%Y/%m/%d") + " 00:00:00"
            end = today.strftime("%Y/%m/%d") + " 23:59:59"
        else:
            start = (today - timedelta(days=7)).strftime("%Y/%m/%d") + " 00:00:00"
            end = today.strftime("%Y/%m/%d") + " 23:59:59"
    
    print(f"🔍 ملخص من {start} إلى {end}")
    
    summary = db.get_summary(start, end)
    return summary

@app.get("/api/analyze")
async def analyze_calls(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """تحليل متقدم للمكالمات"""
    calls = db.get_calls(start_date=start_date, end_date=end_date, limit=10000)
    analyzer = CallAnalyzer(calls)
    report = analyzer.generate_full_report()
    return report

@app.post("/api/rates")
async def add_rate(prefix: str, rate: float, destination: str, call_type: str):
    """إضافة تعريفة جديدة"""
    db.save_rate(prefix, rate, destination, call_type)
    return {"status": "success", "message": f"تم إضافة تعريفة {prefix}"}

@app.get("/api/export")
async def export_calls(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    format: str = "json"
):
    """تصدير المكالمات إلى ملف"""
    calls = db.get_calls(start_date=start_date, end_date=end_date, limit=10000)
    
    if format == "csv":
        csv_content = "timestamp,duration_seconds,extension,direction,dialed_number,cost\n"
        for call in calls:
            csv_content += f"{call.timestamp},{call.duration_seconds},{call.extension},{call.direction},{call.dialed_number},{call.cost}\n"
        
        return JSONResponse(content={"csv": csv_content})
    else:
        return {"calls": [call.model_dump() for call in calls]}
        
# ========== واجهات API للإعدادات ==========

# ملف لحفظ الإعدادات
SETTINGS_FILE = "settings.json"

def load_settings_from_file():
    if os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE, 'r') as f:
            return json.load(f)
    return {
        "listen_host": "0.0.0.0",
        "listen_port": 9000,
        "pbx_type": "Avaya",
        "pbx_ip": "",
        "pbx_port": 9000,
        "default_rate": 0.15,
        "currency": "SAR"
    }

def save_settings_to_file(settings):
    with open(SETTINGS_FILE, 'w') as f:
        json.dump(settings, f)

@app.get("/api/settings")
async def get_settings():
    return load_settings_from_file()

@app.post("/api/settings")
async def update_settings(settings: dict):
    save_settings_to_file(settings)
    return {"status": "success"}

@app.get("/api/test-listener")
async def test_listener():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 9000))
    sock.close()
    return {"status": "running" if result == 0 else "stopped", "port": 9000}

@app.post("/api/test-pbx")
async def test_pbx_connection(data: dict):
    ip = data.get('ip')
    port = data.get('port')
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(3)
    result = sock.connect_ex((ip, port))
    sock.close()
    return {"reachable": result == 0, "ip": ip, "port": port}

# ========== دالة إعادة تشغيل المستمع ==========
@app.post("/api/restart-listener")
async def restart_listener():
    global smdr_listener, listener_thread
    settings = load_settings_from_file()
    
    smdr_listener.stop()
    time.sleep(2)
    
    smdr_listener = SMDRListener(
        host=settings.get('listen_host', '0.0.0.0'),
        port=settings.get('listen_port', 9000),
        ws_manager=manager
    )
    listener_thread = threading.Thread(target=smdr_listener.start, daemon=True)
    listener_thread.start()
    
    return {"status": "restarted"}

@app.get("/api/local-ip")
async def get_local_ip():
    """الحصول على عنوان IP المحلي للجهاز"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return {"ip": ip}
    except:
        try:
            hostname = socket.gethostname()
            ip = socket.gethostbyname(hostname)
            return {"ip": ip}
        except:
            return {"ip": "غير متاح"}

# ========== WebSocket Endpoint ==========
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)