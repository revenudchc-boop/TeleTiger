from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from typing import Optional

Base = declarative_base()

class CallRecordDB(Base):
    __tablename__ = 'calls'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # الحقول الأساسية
    timestamp = Column(String(30), nullable=False)
    duration = Column(String(10), nullable=False)
    duration_seconds = Column(Integer, default=0)
    extension = Column(String(20), nullable=False)
    direction = Column(String(1), nullable=False)
    dialed_number = Column(String(50), default='')
    cost = Column(Float, default=0.0)
    is_connected = Column(Boolean, default=True)
    
    # حقول SMDR المتقدمة
    call_id = Column(String(30), default='')           # معرف المكالمة الفريد
    source_device = Column(String(50), default='')     # الجهاز المصدر (E100)
    source_name = Column(String(100), default='')      # اسم المصدر (EXT100)
    dest_device = Column(String(50), default='')       # الجهاز الهدف (E101)
    dest_name = Column(String(100), default='')        # اسم الهدف (EXT101)
    cli_number = Column(String(50), default='')        # رقم المتصل (Caller ID)
    ddi_number = Column(String(50), default='')        # الرقم المطلوب
    call_type = Column(String(20), default='')         # داخلي/خارجي/دولي
    
    # حقول مستقبلية (للاستخدام لاحقاً)
    ring_duration = Column(Integer, default=0)         # وقت الرنين
    hold_duration = Column(Integer, default=0)         # وقت التعليق
    account_code = Column(String(50), default='')      # كود المحاسبة
    trunk_used = Column(String(20), default='')        # الخط المستخدم
    continuation = Column(Integer, default=0)          # جزء المكالمة

class CallRecord(BaseModel):
    id: Optional[int] = None
    timestamp: str
    duration: str
    duration_seconds: int
    extension: str
    direction: str
    dialed_number: str
    cost: float = 0.0
    is_connected: bool = True
    
    # حقول SMDR المتقدمة
    call_id: str = ""
    source_device: str = ""
    source_name: str = ""
    dest_device: str = ""
    dest_name: str = ""
    cli_number: str = ""
    ddi_number: str = ""
    call_type: str = ""
    
    # حقول مستقبلية
    ring_duration: int = 0
    hold_duration: int = 0
    account_code: str = ""
    trunk_used: str = ""
    continuation: int = 0

class RateTable(Base):
    __tablename__ = 'rates'
    
    id = Column(Integer, primary_key=True)
    prefix = Column(String(20))
    rate_per_minute = Column(Float)
    destination = Column(String(100))
    call_type = Column(String(20))

class SummaryReport(BaseModel):
    total_calls: int
    total_outgoing: int
    total_incoming: int
    total_duration_minutes: float
    total_cost: float
    average_duration: float
    top_extensions: list
    calls_by_hour: dict