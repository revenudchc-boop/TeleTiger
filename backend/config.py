# config.py - إعدادات الربط مع السنترال

class Config:
    # إعدادات مستمع SMDR
    SMDR_LISTEN_HOST = "0.0.0.0"      # استمع على جميع الواجهات (اتركها 0.0.0.0)
    SMDR_LISTEN_PORT = 9000            # منفذ الاستماع (افتراضي Avaya)
    
    # إعدادات السنترال (للتحقق من المصدر - اختياري)
    PBX_IP = "192.168.1.100"           # ضع عنوان IP السنترال الحقيقي هنا
    PBX_TYPE = "Avaya"                 # Avaya, Cisco, Panasonic, Generic
    
    # إعدادات قاعدة البيانات
    DB_PATH = "calls.db"
    
    # إعدادات التكلفة
    DEFAULT_RATE_PER_MINUTE = 0.15     # ريال/دقيقة