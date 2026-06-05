import sqlite3
import re

# قراءة الملف
with open('RAW-09082018.Txt', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

lines = content.split('\n')

# إنشاء قاعدة بيانات جديدة
conn = sqlite3.connect('calls.db')
cursor = conn.cursor()

# حذف الجدول القديم وإعادة إنشائه
cursor.execute('DROP TABLE IF EXISTS calls')
cursor.execute('''
    CREATE TABLE calls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        duration_seconds INTEGER,
        extension TEXT,
        direction TEXT,
        dialed_number TEXT,
        call_id TEXT,
        source_device TEXT,
        source_name TEXT,
        dest_device TEXT,
        dest_name TEXT,
        cost REAL,
        is_connected BOOLEAN
    )
''')

saved = 0

for line in lines:
    line = line.strip()
    if not line.startswith('2018/'):
        continue
    
    parts = line.split(',')
    if len(parts) < 15:
        continue
    
    try:
        # التصحيح: الأجزاء الصحيحة حسب تنسيق ملفك
        # 0 = التاريخ (2018/08/08 15:28:18)
        # 2 = المدة (00:01:37)
        # 4 = الملحق (1701)  <-- هذا هو المهم
        # 5 = الاتجاه (O أو I)
        # 6 = الرقم المطلوب (1193)
        # 9 = معرف المكالمة (1011890)
        # 11 = الجهاز المصدر (E1701)
        # 12 = اسم المصدر (NadaAlEnzi)
        # 13 = الجهاز الهدف (E1193)
        # 14 = اسم الهدف (TariqAlanazi)
        
        timestamp = parts[0].strip()
        
        # تحويل المدة إلى ثواني
        duration_str = parts[2].strip()
        duration_seconds = 0
        if ':' in duration_str:
            h, m, s = map(int, duration_str.split(':'))
            duration_seconds = h * 3600 + m * 60 + s
        
        # التصحيح: الملحق من الجزء 4
        extension = parts[4].strip() if len(parts) > 4 else ""
        
        # التصحيح: الاتجاه من الجزء 5
        direction = parts[5].strip() if len(parts) > 5 else ""
        
        # الرقم المطلوب من الجزء 6
        dialed_number = parts[6].strip() if len(parts) > 6 else ""
        
        # معرف المكالمة من الجزء 9
        call_id = parts[9].strip() if len(parts) > 9 else ""
        
        # المصدر والهدف
        source_device = parts[11].strip() if len(parts) > 11 else ""
        source_name = parts[12].strip() if len(parts) > 12 else ""
        dest_device = parts[13].strip() if len(parts) > 13 else ""
        dest_name = parts[14].strip() if len(parts) > 14 else ""
        
        # حساب التكلفة
        cost = 0.0
        if direction == 'O' and duration_seconds > 0:
            cost = round((duration_seconds / 60) * 0.15, 3)
        
        # طباعة للتأكد
        if duration_seconds > 0:
            print(f"✅ {timestamp} | ملحق:{extension} | اتجاه:{direction} | مدة:{duration_seconds}ث | تكلفة:{cost}")
        
        cursor.execute('''
            INSERT INTO calls (timestamp, duration_seconds, extension, direction, dialed_number, 
                              call_id, source_device, source_name, dest_device, dest_name, cost, is_connected)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (timestamp, duration_seconds, extension, direction, dialed_number,
              call_id, source_device, source_name, dest_device, dest_name, cost, duration_seconds > 0))
        saved += 1
        
    except Exception as e:
        pass

conn.commit()
conn.close()

print(f"\n✅ تم حفظ {saved} مكالمة في قاعدة البيانات")