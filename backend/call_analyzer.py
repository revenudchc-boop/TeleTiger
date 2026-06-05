from typing import List, Dict, Tuple
from collections import defaultdict, Counter
from datetime import datetime, timedelta
from models import CallRecord

class CallAnalyzer:
    """محلل متقدم للمكالمات"""
    
    def __init__(self, calls: List[CallRecord]):
        self.calls = calls
    
    def get_extension_activity(self) -> Dict[str, dict]:
        """تحليل نشاط كل ملحق"""
        activity = defaultdict(lambda: {
            'total_calls': 0,
            'total_outgoing': 0,
            'total_incoming': 0,
            'total_duration': 0,
            'total_cost': 0,
            'unique_numbers': set()
        })
        
        for call in self.calls:
            ext = call.extension
            activity[ext]['total_calls'] += 1
            activity[ext]['total_duration'] += call.duration_seconds
            activity[ext]['total_cost'] += call.cost
            
            if call.direction == 'O':
                activity[ext]['total_outgoing'] += 1
                if call.dialed_number:
                    activity[ext]['unique_numbers'].add(call.dialed_number)
            else:
                activity[ext]['total_incoming'] += 1
        
        for ext in activity:
            activity[ext]['unique_numbers'] = len(activity[ext]['unique_numbers'])
        
        return dict(activity)
    
    def get_peak_hours(self) -> Dict[int, int]:
        """تحديد ساعات الذروة"""
        hours = defaultdict(int)
        for call in self.calls:
            if hasattr(call.timestamp, 'hour'):
                hours[call.timestamp.hour] += 1
            else:
                try:
                    if isinstance(call.timestamp, str) and ' ' in call.timestamp:
                        dt = datetime.strptime(call.timestamp, "%Y/%m/%d %H:%M:%S")
                        hours[dt.hour] += 1
                except:
                    pass
        return dict(sorted(hours.items()))
    
    def get_duration_distribution(self) -> Dict[str, int]:
        """توزيع المكالمات حسب المدة"""
        distribution = {
            'short': 0,
            'medium': 0,
            'long': 0,
            'very_long': 0
        }
        
        for call in self.calls:
            d = call.duration_seconds
            if d < 30:
                distribution['short'] += 1
            elif d < 120:
                distribution['medium'] += 1
            elif d < 300:
                distribution['long'] += 1
            else:
                distribution['very_long'] += 1
        
        return distribution
    
    def get_transfer_analysis(self) -> Dict:
        """تحليل المكالمات المحولة"""
        transferred = [c for c in self.calls if c.source_device.startswith('V') or c.dest_device.startswith('V')]
        
        transfer_details = []
        for call in transferred:
            timestamp_str = call.timestamp if isinstance(call.timestamp, str) else call.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            transfer_details.append({
                'timestamp': timestamp_str,
                'from_user': call.source_name,
                'from_ext': call.extension,
                'to_user': call.dest_name,
                'to_device': call.dest_device,
                'duration': call.duration_seconds,
                'call_type': 'transferred'
            })
        
        return {
            'total_transferred': len(transferred),
            'percentage': (len(transferred) / len(self.calls) * 100) if self.calls else 0,
            'details': transfer_details
        }
    
    def get_cost_breakdown(self) -> Dict:
        """تحليل التكاليف"""
        total_cost = sum(c.cost for c in self.calls)
        
        cost_by_extension = defaultdict(float)
        for call in self.calls:
            cost_by_extension[call.extension] += call.cost
        
        cost_by_day = defaultdict(float)
        for call in self.calls:
            if hasattr(call.timestamp, 'strftime'):
                day_key = call.timestamp.strftime('%Y-%m-%d')
            else:
                day_key = call.timestamp.split()[0] if ' ' in call.timestamp else call.timestamp
            cost_by_day[day_key] += call.cost
        
        return {
            'total': total_cost,
            'average_per_call': total_cost / len(self.calls) if self.calls else 0,
            'by_extension': dict(sorted(cost_by_extension.items(), key=lambda x: x[1], reverse=True)[:10]),
            'by_day': dict(cost_by_day)
        }
    
    def get_user_ranking(self) -> List[Tuple[str, dict]]:
        """ترتيب المستخدمين حسب النشاط"""
        activity = self.get_extension_activity()
        ranking = sorted(activity.items(), key=lambda x: x[1]['total_calls'], reverse=True)
        return ranking[:20]
    
    def generate_full_report(self) -> Dict:
        """توليد تقرير كامل"""
        return {
            'summary': {
                'total_calls': len(self.calls),
                'total_duration_minutes': sum(c.duration_seconds for c in self.calls) / 60,
                'total_cost': sum(c.cost for c in self.calls),
                'avg_duration': sum(c.duration_seconds for c in self.calls) / len(self.calls) if self.calls else 0,
                'unique_extensions': len(set(c.extension for c in self.calls))
            },
            'extension_activity': self.get_extension_activity(),
            'peak_hours': self.get_peak_hours(),
            'duration_distribution': self.get_duration_distribution(),
            'transfer_analysis': self.get_transfer_analysis(),
            'cost_breakdown': self.get_cost_breakdown(),
            'user_ranking': self.get_user_ranking()
        }