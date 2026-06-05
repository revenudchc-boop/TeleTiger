import re
from datetime import datetime
from typing import Optional, List
from models import CallRecord

class SMDRParser:
    
    def parse_duration(self, duration_str: str) -> int:
        try:
            if ':' in duration_str:
                h, m, s = map(int, duration_str.split(':'))
                return h * 3600 + m * 60 + s
        except:
            pass
        return 0

    def determine_call_type(self, dialed_number: str, direction: str) -> str:
        """تحديد نوع المكالمة (داخلي/خارجي/دولي)"""
        if direction == 'I':
            return "واردة"
        if not dialed_number or dialed_number == '0':
            return "غير معروف"
        if len(dialed_number) <= 4 and dialed_number.isdigit():
            return "داخلي"
        if dialed_number.startswith('00'):
            return "دولي"
        if dialed_number.startswith('0'):
            return "خارجي (محلي)"
        return "خارجي"

    def parse_line(self, line: str) -> Optional[CallRecord]:
        line = line.strip()
        if not line or len(line) < 30:
            return None
        
        parts = line.split(',')
        if len(parts) < 15:
            return None
        
        try:
            # الحقول الأساسية
            timestamp = parts[0].strip()
            duration_str = parts[1].strip()
            duration_seconds = self.parse_duration(duration_str)
            
            # الملحق المصدر (index 3)
            extension = parts[3].strip()
            
            # الاتجاه (index 4)
            direction = parts[4].strip()
            
            # الرقم المطلوب (index 5)
            dialed_number = parts[5].strip()
            
            # معرف المكالمة (index 9)
            call_id = parts[9].strip() if len(parts) > 9 else ""
            
            # الجهاز واسم المصدر (index 11, 12)
            source_device = parts[11].strip() if len(parts) > 11 else ""
            source_name = parts[12].strip() if len(parts) > 12 else ""
            
            # الجهاز واسم الهدف (index 13, 14)
            dest_device = parts[13].strip() if len(parts) > 13 else ""
            dest_name = parts[14].strip() if len(parts) > 14 else ""
            
            # نوع المكالمة
            call_type = self.determine_call_type(dialed_number, direction)
            
            # حساب التكلفة (للمكالمات الصادرة فقط)
            cost = 0.0
            if direction == 'O' and duration_seconds > 0:
                cost = round((duration_seconds / 60) * 0.15, 3)
            
            # طباعة التأكيد
            print(f"✅ {timestamp} | ملحق:{extension} | اتجاه:{direction} | مدة:{duration_seconds}ث | رقم:{dialed_number} | نوع:{call_type} | تكلفة:{cost}")
            print(f"   📱 مصدر: {source_device}:{source_name} | هدف: {dest_device}:{dest_name} | معرف: {call_id}")
            
            return CallRecord(
                timestamp=timestamp,
                duration=duration_str,
                duration_seconds=duration_seconds,
                extension=extension,
                direction=direction,
                dialed_number=dialed_number,
                cost=cost,
                is_connected=duration_seconds > 0,
                call_id=call_id,
                source_device=source_device,
                source_name=source_name,
                dest_device=dest_device,
                dest_name=dest_name,
                cli_number=dialed_number,
                ddi_number="",
                call_type=call_type
            )
        except Exception as e:
            print(f"⚠️ خطأ في تحليل السطر: {e}")
            return None

    def parse_file(self, content: str) -> List[CallRecord]:
        calls = []
        for line in content.split('\n'):
            if line.strip() and line.count(',') >= 10:
                call = self.parse_line(line)
                if call:
                    calls.append(call)
        print(f"📁 تم تحليل {len(calls)} مكالمة")
        return calls