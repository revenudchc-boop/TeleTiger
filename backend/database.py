from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Optional
import os

from models import Base, CallRecordDB, RateTable, CallRecord

DB_PATH = os.path.join(os.path.dirname(__file__), 'calls.db')
engine = create_engine(f'sqlite:///{DB_PATH}', echo=False)
SessionLocal = sessionmaker(bind=engine)

Base.metadata.create_all(engine)

class DatabaseManager:
    @staticmethod
    def get_session() -> Session:
        return SessionLocal()
    
    @staticmethod
    def save_call(call: CallRecord) -> int:
        session = DatabaseManager.get_session()
        try:
            existing = session.query(CallRecordDB).filter_by(call_id=call.call_id).first()
            if existing:
                return existing.id
            
            db_call = CallRecordDB(
                timestamp=call.timestamp,
                duration=call.duration,
                duration_seconds=call.duration_seconds,
                extension=call.extension,
                direction=call.direction,
                dialed_number=call.dialed_number,
                call_id=call.call_id,
                source_device=call.source_device,
                source_name=call.source_name,
                dest_device=call.dest_device,
                dest_name=call.dest_name,
                cost=call.cost,
                is_connected=call.is_connected
            )
            session.add(db_call)
            session.commit()
            return db_call.id
        except Exception as e:
            session.rollback()
            print(f"خطأ في حفظ المكالمة: {e}")
            return -1
        finally:
            session.close()
    
    @staticmethod
    def get_calls(
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        extension: Optional[str] = None,
        direction: Optional[str] = None,
        limit: int = 1000
    ) -> List[CallRecord]:
        session = DatabaseManager.get_session()
        try:
            query = session.query(CallRecordDB)
            
            if start_date:
                query = query.filter(CallRecordDB.timestamp >= start_date)
            if end_date:
                query = query.filter(CallRecordDB.timestamp <= end_date)
            if extension:
                query = query.filter(CallRecordDB.extension == extension)
            if direction:
                query = query.filter(CallRecordDB.direction == direction)
            
            query = query.order_by(CallRecordDB.timestamp.desc()).limit(limit)
            
            results = []
            for db_call in query.all():
                results.append(CallRecord(
                    id=db_call.id,
                    timestamp=db_call.timestamp,
                    duration=db_call.duration,
                    duration_seconds=db_call.duration_seconds,
                    extension=db_call.extension,
                    direction=db_call.direction,
                    dialed_number=db_call.dialed_number,
                    call_id=db_call.call_id,
                    source_device=db_call.source_device,
                    source_name=db_call.source_name,
                    dest_device=db_call.dest_device,
                    dest_name=db_call.dest_name,
                    cost=db_call.cost,
                    is_connected=db_call.is_connected
                ))
            return results
        finally:
            session.close()
    
    @staticmethod
    def get_summary(start_date: str, end_date: str) -> dict:
        session = DatabaseManager.get_session()
        try:
            total_calls = session.query(CallRecordDB).filter(
                CallRecordDB.timestamp >= start_date,
                CallRecordDB.timestamp <= end_date
            ).count()
            
            outgoing = session.query(CallRecordDB).filter(
                CallRecordDB.timestamp >= start_date,
                CallRecordDB.timestamp <= end_date,
                CallRecordDB.direction == 'O'
            ).count()
            
            incoming = session.query(CallRecordDB).filter(
                CallRecordDB.timestamp >= start_date,
                CallRecordDB.timestamp <= end_date,
                CallRecordDB.direction == 'I'
            ).count()
            
            total_duration = session.query(func.sum(CallRecordDB.duration_seconds)).filter(
                CallRecordDB.timestamp >= start_date,
                CallRecordDB.timestamp <= end_date
            ).scalar() or 0
            
            total_cost = session.query(func.sum(CallRecordDB.cost)).filter(
                CallRecordDB.timestamp >= start_date,
                CallRecordDB.timestamp <= end_date
            ).scalar() or 0
            
            top_exts = session.query(
                CallRecordDB.extension, 
                func.count(CallRecordDB.id)
            ).filter(
                CallRecordDB.timestamp >= start_date,
                CallRecordDB.timestamp <= end_date,
                CallRecordDB.extension != '0',
                CallRecordDB.extension != ''
            ).group_by(CallRecordDB.extension).order_by(func.count(CallRecordDB.id).desc()).limit(10).all()
            
            return {
                'total_calls': total_calls,
                'total_outgoing': outgoing,
                'total_incoming': incoming,
                'total_duration_minutes': round(total_duration / 60, 1),
                'total_cost': round(total_cost, 2),
                'average_duration': round(total_duration / total_calls, 1) if total_calls > 0 else 0,
                'top_extensions': [(ext, count) for ext, count in top_exts],
                'calls_by_hour': {}
            }
        except Exception as e:
            print(f"خطأ: {e}")
            return {
                'total_calls': 0,
                'total_outgoing': 0,
                'total_incoming': 0,
                'total_duration_minutes': 0,
                'total_cost': 0,
                'average_duration': 0,
                'top_extensions': [],
                'calls_by_hour': {}
            }
        finally:
            session.close()
    
    @staticmethod
    def save_rate(prefix: str, rate: float, destination: str, call_type: str):
        session = DatabaseManager.get_session()
        try:
            rate_entry = RateTable(
                prefix=prefix,
                rate_per_minute=rate,
                destination=destination,
                call_type=call_type
            )
            session.add(rate_entry)
            session.commit()
        finally:
            session.close()
    
    @staticmethod
    def get_rate(phone_number: str) -> Optional[tuple]:
        session = DatabaseManager.get_session()
        try:
            rates = session.query(RateTable).all()
            matching = None
            max_len = 0
            
            for rate in rates:
                if phone_number.startswith(rate.prefix) and len(rate.prefix) > max_len:
                    matching = rate
                    max_len = len(rate.prefix)
            
            if matching:
                return (matching.rate_per_minute, matching.destination, matching.call_type)
            return None
        finally:
            session.close()
            
@staticmethod
def get_calls_with_details(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    extension: Optional[str] = None,
    direction: Optional[str] = None,
    limit: int = 500
) -> List[CallRecord]:
    """استرجاع المكالمات مع جميع التفاصيل"""
    session = DatabaseManager.get_session()
    try:
        query = session.query(CallRecordDB)
        
        if start_date:
            query = query.filter(CallRecordDB.timestamp >= start_date)
        if end_date:
            query = query.filter(CallRecordDB.timestamp <= end_date)
        if extension:
            query = query.filter(CallRecordDB.extension == extension)
        if direction:
            query = query.filter(CallRecordDB.direction == direction)
        
        query = query.order_by(CallRecordDB.timestamp.desc()).limit(limit)
        
        results = []
        for db_call in query.all():
            results.append(CallRecord(
                id=db_call.id,
                timestamp=db_call.timestamp,
                duration=db_call.duration,
                duration_seconds=db_call.duration_seconds,
                extension=db_call.extension,
                direction=db_call.direction,
                dialed_number=db_call.dialed_number,
                cost=db_call.cost,
                is_connected=db_call.is_connected,
                call_id=db_call.call_id,
                source_device=db_call.source_device,
                source_name=db_call.source_name,
                dest_device=db_call.dest_device,
                dest_name=db_call.dest_name,
                cli_number=db_call.cli_number,
                ddi_number=db_call.ddi_number,
                call_type=db_call.call_type
            ))
        return results
    finally:
        session.close()