// عنوان API
const API_URL = 'http://localhost:8000';

// ========== WebSocket للتحديث الفوري ==========
let ws = null;
let wsReconnectInterval = null;

function connectWebSocket() {
    if (ws && ws.readyState === WebSocket.OPEN) return;
    
    const wsUrl = `ws://${window.location.hostname}:8000/ws`;
    console.log('🔄 محاولة الاتصال بـ WebSocket:', wsUrl);
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = function() {
        console.log('✅ WebSocket متصل بنجاح');
        if (wsReconnectInterval) clearInterval(wsReconnectInterval);
    };
    
    ws.onmessage = function(event) {
        try {
            const message = JSON.parse(event.data);
            if (message.type === 'new_call') {
                console.log('📞 مكالمة جديدة واردة:', message.data);
                const activeTab = document.querySelector('.tab-pane.active');
                if (activeTab) {
                    if (activeTab.id === 'calls') {
                        loadCalls();
                    } else if (activeTab.id === 'dashboard') {
                        loadDashboard();
                        loadRecentCalls();
                    }
                }
                updateCallsCount();
            }
        } catch(e) {
            console.error('خطأ في معالجة رسالة WebSocket:', e);
        }
    };
    
    ws.onerror = function(error) {
        console.error('❌ WebSocket خطأ:', error);
    };
    
    ws.onclose = function() {
        console.log('🔌 WebSocket مغلق، محاولة إعادة الاتصال بعد 5 ثوانٍ...');
        if (!wsReconnectInterval) {
            wsReconnectInterval = setInterval(() => {
                connectWebSocket();
            }, 5000);
        }
    };
}

// ========== الوضع النهاري / الداكن ==========
let currentTheme = localStorage.getItem('theme') || 'dark';

function toggleTheme() {
    const themeBtn = document.getElementById('themeBtn');
    
    if (currentTheme === 'dark') {
        currentTheme = 'light';
        // تغيير ألوان الخلفية يدوياً
        document.body.style.background = "#f0f2f5";
        document.body.style.color = "#1a202c";
        
        // تغيير خلفية القائمة الجانبية
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.style.background = "#ffffff";
        
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        currentTheme = 'dark';
        // العودة إلى الوضع الداكن
        document.body.style.background = "linear-gradient(135deg, #0f0c29, #302b63, #24243e)";
        document.body.style.color = "";
        
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.style.background = "rgba(15, 20, 40, 0.95)";
        
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    localStorage.setItem('theme', currentTheme);
    console.log('Theme changed to:', currentTheme);
    
    // إعادة تحميل الصفحة بعد 0.3 ثانية لتطبيق جميع التغييرات
    setTimeout(() => {
        location.reload();
    }, 300);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeBtn = document.getElementById('themeBtn');
    
    console.log('Loading theme:', savedTheme);
    
    if (savedTheme === 'light') {
        currentTheme = 'light';
        document.body.classList.add('light-mode');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        currentTheme = 'dark';
        document.body.classList.remove('light-mode');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// استدعاء تحميل الوضع عند بدء التشغيل
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
});

// بدء الاتصال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();
    // ... باقي الكود الموجود في DOMContentLoaded ...
});

async function updateCallsCount() {
    try {
        const response = await fetch(`${API_URL}/api/summary?period=week`);
        const data = await response.json();
        const countSpan = document.querySelector('.nav-count');
        if (countSpan) countSpan.textContent = data.total_calls || 0;
    } catch(e) {
        console.error('خطأ في تحديث العداد:', e);
    }
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initUpload();
    initDates();
    loadDashboard();
    checkAPIStatus();
    
    // تحديث التاريخ
    updateDate();
    setInterval(updateDate, 1000);
});

// تحميل المكالمات
async function loadCalls() {
    const t = translations[currentLang];
    
    const extension = document.getElementById('filterExtension')?.value || '';
    const direction = document.getElementById('filterDirection')?.value || '';
    let startDate = document.getElementById('filterStartDate')?.value || '';
    let endDate = document.getElementById('filterEndDate')?.value || '';
    
    let url = `${API_URL}/api/calls?limit=500`;
    
    if (extension) url += `&extension=${extension}`;
    if (direction) url += `&direction=${direction}`;
    
    // فقط أضف التواريخ إذا كانت غير فارغة
    if (startDate && endDate) {
        startDate = startDate.replace(/-/g, '/');
        endDate = endDate.replace(/-/g, '/');
        url += `&start_date=${startDate}&end_date=${endDate}`;
    }
    
     
    const tbody = document.getElementById('callsTableBody');
    if (tbody) tbody.innerHTML = `<td><td colspan="14" class="loading-cell"><i class="fas fa-spinner fa-spin"></i> ${t.loading}<\/td><\/tr>`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const calls = data.calls || [];
        
        if (!tbody) return;
        
        if (calls.length === 0) {
            tbody.innerHTML = `<tr><td colspan="14" class="loading-cell">${t.noData}<\/td><\/tr>`;
            return;
        }
        
        tbody.innerHTML = calls.map(call => {
            // تحويل التاريخ
            let dateStr = call.timestamp;
            try {
                const date = new Date(call.timestamp.replace(/\//g, '-'));
                if (!isNaN(date.getTime())) {
                    dateStr = date.toLocaleString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            } catch(e) {}
            
            // تحويل المدة
            let duration = '0:00';
            if (call.duration_seconds > 0) {
                const mins = Math.floor(call.duration_seconds / 60);
                const secs = call.duration_seconds % 60;
                duration = `${mins}:${secs.toString().padStart(2, '0')}`;
            }
            
            // الاتجاه
            const directionIcon = call.direction === 'O' ? 
                `<span class="status-outgoing">📤 ${t.outgoing}</span>` : 
                `<span class="status-incoming">📥 ${t.incoming}</span>`;
            
            // الأرقام
            const dialedNumber = call.dialed_number && call.dialed_number !== '0' ? call.dialed_number : '---';
            const cliNumber = call.cli_number || '---';
            const ddiNumber = call.ddi_number || '---';
            
            // وقت الرنين
            const ringDuration = call.ring_duration ? `${call.ring_duration} ${currentLang === 'ar' ? 'ث' : 'sec'}` : '---';
            
            // المصدر والهدف
            const sourceDisplay = call.source_name || call.source_device || '---';
            const destDisplay = call.dest_name || call.dest_device || '---';
            
            // النوع ومعرف المكالمة
            const callType = call.call_type || '---';
            const callId = call.call_id || '---';
            
            // حالة المكالمة (is_connected)
            let connectedStatus = '';
            if (call.is_connected === true || call.is_connected === 1 || call.is_connected === '1') {
                connectedStatus = `<span class="status-connected">✅ ${t.completed}</span>`;
            } else if (call.is_connected === false || call.is_connected === 0 || call.is_connected === '0') {
                connectedStatus = `<span class="status-missed">❌ ${t.missed}</span>`;
            } else {
                connectedStatus = `<span class="status-unknown">⚪ ${t.unknown}</span>`;
            }
            
            return `
                <tr>
                    <td>${dateStr}${call.direction === 'O' ? ' 📤' : ' 📥'}</td>
                    <td>${duration}</td>
                    <td><strong>${call.extension || '---'}</strong></td>
                    <td>${directionIcon}</td>
                    <td>${dialedNumber}</td>
                    <td>${cliNumber}</td>
                    <td>${ddiNumber}</td>
                    <td>${ringDuration}</td>
                    <td>${call.cost?.toFixed(2) || '0.00'} ${currentLang === 'ar' ? 'ر.س' : 'SAR'}</td>
                    <td>${sourceDisplay}</td>
                    <td>${destDisplay}</td>
                    <td>${callType}</td>
                    <td>${connectedStatus}</td>
                    <td>${callId}</td>
                </tr>
            `;
        }).join('');
        
        console.log('✅ تم عرض المكالمات بنجاح، العدد:', calls.length);
        
    } catch (error) {
        console.error('❌ خطأ في loadCalls:', error);
        if (tbody) tbody.innerHTML = `<tr><td colspan="14" class="loading-cell">❌ خطأ: ${error.message} <br> ${t.error}<\/td><\/tr>`;
    }
}


// التنقل بين التبويبات
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const panes = document.querySelectorAll('.tab-pane');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    
    // استخدام الترجمة لعناوين التبويبات
    const titles = {
        dashboard: { title: translations[currentLang].dashboard, subtitle: translations[currentLang].pageSubtitle },
        upload: { title: translations[currentLang].upload, subtitle: 'تحميل وتحليل ملفات SMDR' },
        calls: { title: translations[currentLang].calls, subtitle: 'عرض وتصفية جميع المكالمات' },
        analyze: { title: translations[currentLang].analyze, subtitle: 'تحليل عميق للمكالمات والتكاليف' },
        reports: { title: translations[currentLang].reports, subtitle: 'إنشاء وتصدير تقارير مخصصة' },
        settings: { title: translations[currentLang].settings, subtitle: 'إعدادات النظام والتكامل' }
    };
    
    // تحديث الوصف الثانوي للتبويبات حسب اللغة
    titles.upload.subtitle = currentLang === 'ar' ? 'تحميل وتحليل ملفات SMDR' : 'Upload and analyze SMDR files';
    titles.calls.subtitle = currentLang === 'ar' ? 'عرض وتصفية جميع المكالمات' : 'View and filter all calls';
    titles.analyze.subtitle = currentLang === 'ar' ? 'تحليل عميق للمكالمات والتكاليف' : 'Deep analysis of calls and costs';
    titles.reports.subtitle = currentLang === 'ar' ? 'إنشاء وتصدير تقارير مخصصة' : 'Create and export custom reports';
    titles.settings.subtitle = currentLang === 'ar' ? 'إعدادات النظام والتكامل' : 'System and integration settings';
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.dataset.tab;
            
            // إزالة التحديد من جميع الأزرار والتبويبات
            navItems.forEach(nav => nav.classList.remove('active'));
            panes.forEach(pane => pane.classList.remove('active'));
            
            // تفعيل المحدد
            item.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // تحديث عنوان الصفحة
            if (titles[tabId]) {
                pageTitle.textContent = titles[tabId].title;
                pageSubtitle.textContent = titles[tabId].subtitle;
            }
            
            // تحميل البيانات حسب التبويب
            if (tabId === 'dashboard') loadDashboard();
            if (tabId === 'calls') loadCalls();
            if (tabId === 'analyze') loadAnalysis();
        });
    });
}

// تحديث التاريخ والوقت
function updateDate() {
    const dateDisplay = document.getElementById('currentDate');
    if (dateDisplay) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        dateDisplay.innerHTML = `<i class="fas fa-calendar-alt"></i> ${now.toLocaleDateString('ar-EG', options)}`;
    }
}

// التحقق من حالة API
async function checkAPIStatus() {
    const apiStatus = document.getElementById('apiStatus');
    try {
        const response = await fetch(`${API_URL}/`);
        if (response.ok) {
            apiStatus.innerHTML = '<i class="fas fa-circle" style="color: #10b981;"></i><span>API متصل</span>';
        } else {
            apiStatus.innerHTML = '<i class="fas fa-circle" style="color: #ef4444;"></i><span>API مفصول</span>';
        }
    } catch {
        apiStatus.innerHTML = '<i class="fas fa-circle" style="color: #ef4444;"></i><span>API مفصول</span>';
    }
}

// تحديث جميع البيانات
function refreshAll() {
    loadDashboard();
    loadCalls();
    loadAnalysis();
    const refreshBtn = document.querySelector('.btn-refresh i');
    if (refreshBtn) {
        refreshBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => { refreshBtn.style.transform = ''; }, 500);
    }
}

// رفع الملف
function initUpload() {
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('fileInput');
    
    if (dropzone) {
        dropzone.addEventListener('click', () => fileInput.click());
        
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = '#667eea';
            dropzone.style.background = 'rgba(102, 126, 234, 0.1)';
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            dropzone.style.background = '';
        });
        
        dropzone.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            dropzone.style.background = '';
            const file = e.dataTransfer.files[0];
            if (file) await uploadFile(file);
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files[0]) await uploadFile(e.target.files[0]);
        });
    }
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const progressDiv = document.getElementById('uploadProgress');
    const resultDiv = document.getElementById('uploadResult');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progressText');
    
    if (progressDiv) progressDiv.classList.remove('hidden');
    if (resultDiv) resultDiv.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <strong>✅ تم الرفع بنجاح!</strong>
                            <p>${data.message}</p>
                        </div>
                    </div>
                `;
                resultDiv.classList.remove('hidden');
                resultDiv.className = 'upload-result success show';
            }
            
            // تحديث الإحصائيات
            loadDashboard();
            loadCalls();
            
            // تحديث عدد المكالمات في الشريط الجانبي
            updateCallsCount();
        } else {
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <div>
                            <strong>❌ خطأ</strong>
                            <p>${data.detail || 'حدث خطأ أثناء رفع الملف'}</p>
                        </div>
                    </div>
                `;
                resultDiv.classList.remove('hidden');
            }
        }
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-wifi"></i>
                    <div>
                        <strong>⚠️ خطأ في الاتصال</strong>
                        <p>تأكد من تشغيل الخادم الخلفي على المنفذ 8000</p>
                    </div>
                </div>
            `;
            resultDiv.classList.remove('hidden');
        }
    } finally {
        if (progressDiv) {
            setTimeout(() => progressDiv.classList.add('hidden'), 1000);
        }
        setTimeout(() => {
            if (resultDiv) resultDiv.classList.add('hidden');
        }, 5000);
    }
}

async function updateCallsCount() {
    try {
        const response = await fetch(`${API_URL}/api/summary?period=week`);
        const data = await response.json();
        const countSpan = document.querySelector('.nav-count');
        if (countSpan) countSpan.textContent = data.total_calls || 0;
    } catch (error) {
        console.error('خطأ في تحديث العداد:', error);
    }
}

// تحميل لوحة التحكم
async function loadDashboard() {
    try {
        console.log('جاري تحميل لوحة التحكم...');
        
        // جلب الملخص من API
        const response = await fetch(`${API_URL}/api/summary?period=week`);
        
        if (!response.ok) {
            console.error('خطأ في الاستجابة:', response.status);
            return;
        }
        
        const data = await response.json();
        console.log('البيانات المستلمة:', data);
        
        // تحديث العناصر - تأكد من وجودها في الصفحة
        const totalCallsElem = document.getElementById('totalCalls');
        const outgoingCallsElem = document.getElementById('outgoingCalls');
        const incomingCallsElem = document.getElementById('incomingCalls');
        const totalDurationElem = document.getElementById('totalDuration');
        const totalCostElem = document.getElementById('totalCost');
        const avgDurationElem = document.getElementById('avgDuration');
        
        if (totalCallsElem) totalCallsElem.textContent = data.total_calls || 0;
        if (outgoingCallsElem) outgoingCallsElem.textContent = data.total_outgoing || 0;
        if (incomingCallsElem) incomingCallsElem.textContent = data.total_incoming || 0;
        if (totalDurationElem) totalDurationElem.textContent = (data.total_duration_minutes || 0).toFixed(0);
        if (totalCostElem) totalCostElem.textContent = (data.total_cost || 0).toFixed(2);
        if (avgDurationElem) avgDurationElem.textContent = (data.average_duration || 0).toFixed(0);
        
        // تحديث عدد المكالمات في الشريط الجانبي
        const navCount = document.querySelector('.nav-count');
        if (navCount) navCount.textContent = data.total_calls || 0;
        
        // عرض الرسوم البيانية
        if (data.top_extensions && data.top_extensions.length > 0) {
            renderExtensionChart(data.top_extensions);
        } else {
            console.log('لا توجد بيانات للملحقات');
        }
        
        if (data.calls_by_hour && Object.keys(data.calls_by_hour).length > 0) {
            renderHourChart(data.calls_by_hour);
        }
        
        // تحميل آخر المكالمات
        loadRecentCalls();
        
    } catch (error) {
        console.error('خطأ في تحميل لوحة التحكم:', error);
    }
}

async function loadRecentCalls() {
    const t = translations[currentLang];
    
    try {
        const response = await fetch(`${API_URL}/api/calls?limit=10`);
        
        if (!response.ok) {
            console.error('خطأ في جلب المكالمات:', response.status);
            return;
        }
        
        const data = await response.json();
        const calls = data.calls || [];
        const tbody = document.getElementById('recentCallsBody');
        
        if (!tbody) return;
        
        if (calls.length === 0) {
            tbody.innerHTML = `</tr><td colspan="14" class="loading-cell">📭 ${t.noData}<\/td><\/tr>`;
            return;
        }
        
        tbody.innerHTML = calls.map(call => {
            // تحويل التاريخ
            let dateTimeStr = call.timestamp;
            try {
                const date = new Date(call.timestamp.replace(/\//g, '-'));
                if (!isNaN(date.getTime())) {
                    dateTimeStr = date.toLocaleString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            } catch(e) {}
            
            // المدة
            let duration = '0:00';
            if (call.duration_seconds > 0) {
                const mins = Math.floor(call.duration_seconds / 60);
                const secs = call.duration_seconds % 60;
                duration = `${mins}:${secs.toString().padStart(2, '0')}`;
            }
            
            // الاتجاه
            const directionIcon = call.direction === 'O' ? 
                `<span class="status-outgoing">📤 ${t.outgoing}</span>` : 
                `<span class="status-incoming">📥 ${t.incoming}</span>`;
            
            // الحالة (is_connected)
            let connectedStatus = '';
            if (call.is_connected === true || call.is_connected === 1 || call.is_connected === '1') {
                connectedStatus = `<span class="status-connected">✅ ${t.completed}</span>`;
            } else if (call.is_connected === false || call.is_connected === 0 || call.is_connected === '0') {
                connectedStatus = `<span class="status-missed">❌ ${t.missed}</span>`;
            } else {
                connectedStatus = `<span class="status-unknown">⚪ ${t.unknown}</span>`;
            }
            
            const extension = call.extension || '---';
            const dialedNumber = call.dialed_number && call.dialed_number !== '0' ? call.dialed_number : '---';
            const cliNumber = call.cli_number || '---';
            const ddiNumber = call.ddi_number || '---';
            const ringDuration = call.ring_duration ? `${call.ring_duration} ${currentLang === 'ar' ? 'ث' : 'sec'}` : '---';
            const sourceDisplay = call.source_name || call.source_device || '---';
            const destDisplay = call.dest_name || call.dest_device || '---';
            const callType = call.call_type || '---';
            const callId = call.call_id || '---';
            const cost = call.cost?.toFixed(2) || '0.00';
            
            return `
                <tr>
                    <td>${dateTimeStr}${call.direction === 'O' ? ' 📤' : ' 📥'}</td>
                    <td>${duration}</td>
                    <td><strong>${extension}</strong></td>
                    <td>${directionIcon}</td>
                    <td>${dialedNumber}</td>
                    <td>${cliNumber}</td>
                    <td>${ddiNumber}</td>
                    <td>${ringDuration}</td>
                    <td>${cost} ${currentLang === 'ar' ? 'ر.س' : 'SAR'}</td>
                    <td>${sourceDisplay}</td>
                    <td>${destDisplay}</td>
                    <td>${callType}</td>
                    <td>${connectedStatus}</td>
                    <td>${callId}</td>
                </tr>
            `;
        }).join('');
        
    } catch (error) {
        console.error('خطأ في loadRecentCalls:', error);
        const tbody = document.getElementById('recentCallsBody');
        if (tbody) tbody.innerHTML = `<tr><td colspan="14" class="loading-cell">❌ ${t.error}<\/td><\/tr>`;
    }
}

function renderExtensionChart(extensions) {
    const container = document.getElementById('topExtensionsChart');
    if (!container) return;
    
    if (!extensions || extensions.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#a0aec0;padding:50px;">لا توجد بيانات كافية</div>';
        return;
    }
    
    const labels = extensions.slice(0, 10).map(e => e[0]);
    const values = extensions.slice(0, 10).map(e => e[1]);
    
    const options = {
        series: [{ name: 'عدد المكالمات', data: values }],
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false },
            background: 'transparent',
            animations: { enabled: true }
        },
        colors: ['#667eea'],
        plotOptions: {
            bar: {
                borderRadius: 10,
                horizontal: false,
                columnWidth: '60%'
            }
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: labels,
            labels: { style: { colors: '#a0aec0' } }
        },
        yaxis: {
            labels: { style: { colors: '#a0aec0' } }
        },
        grid: { borderColor: 'rgba(255,255,255,0.1)' }
    };
    
    if (window.extensionChart && typeof window.extensionChart.destroy === 'function') {
        window.extensionChart.destroy();
    }
    
    try {
        window.extensionChart = new ApexCharts(container, options);
        window.extensionChart.render();
    } catch (error) {
        console.error('خطأ في الرسم البياني للملحقات:', error);
    }
}

function renderHourChart(hours) {
    const container = document.getElementById('hourDistributionChart');
    if (!container) return;
    
    if (!hours || Object.keys(hours).length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#a0aec0;padding:50px;">لا توجد بيانات كافية</div>';
        return;
    }
    
    const labels = [];
    const values = [];
    for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
        values.push(hours[i] || 0);
    }
    
    const options = {
        series: [{ name: 'المكالمات', data: values }],
        chart: {
            type: 'area',
            height: 350,
            toolbar: { show: false },
            background: 'transparent',
            animations: { enabled: true }
        },
        colors: ['#764ba2'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3
            }
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: labels,
            labels: { style: { colors: '#a0aec0' } }
        },
        yaxis: {
            labels: { style: { colors: '#a0aec0' } }
        },
        grid: { borderColor: 'rgba(255,255,255,0.1)' }
    };
    
    if (window.hourChart && typeof window.hourChart.destroy === 'function') {
        window.hourChart.destroy();
    }
    
    try {
        window.hourChart = new ApexCharts(container, options);
        window.hourChart.render();
    } catch (error) {
        console.error('خطأ في الرسم البياني للساعات:', error);
    }
}



// تحليل متقدم
async function loadAnalysis() {
    try {
        const response = await fetch(`${API_URL}/api/analyze`);
        const report = await response.json();
        
        // رسم بياني لتوزيع المدة
        if (report.duration_distribution) {
            renderDurationChart(report.duration_distribution);
        }
        
        // إحصائيات التحويل
        const transferStats = document.getElementById('transferStats');
        if (transferStats && report.transfer_analysis) {
            transferStats.innerHTML = `
                <div class="stats-center">
                    <div class="stat-number">${report.transfer_analysis.total_transferred || 0}</div>
                    <div class="stat-label">مكالمة محولة</div>
                    <div class="stat-percent">${(report.transfer_analysis.percentage || 0).toFixed(1)}% من الإجمالي</div>
                </div>
            `;
        }
        
        // تفاصيل التكاليف
        const costDetails = document.getElementById('costDetails');
        if (costDetails && report.cost_breakdown) {
            costDetails.innerHTML = `
                <div class="cost-item">
                    <span>💰 إجمالي التكلفة</span>
                    <strong>${(report.cost_breakdown.total || 0).toFixed(2)} ر.س</strong>
                </div>
                <div class="cost-item">
                    <span>📊 متوسط التكلفة لكل مكالمة</span>
                    <strong>${(report.cost_breakdown.average_per_call || 0).toFixed(3)} ر.س</strong>
                </div>
                <div class="cost-details-title">أعلى 5 ملحقات تكلفة:</div>
                ${Object.entries(report.cost_breakdown.by_extension || {}).slice(0, 5).map(([ext, cost]) => `
                    <div class="cost-item small">
                        <span>ملحق ${ext}</span>
                        <span>${cost.toFixed(2)} ر.س</span>
                    </div>
                `).join('')}
            `;
        }
        
        // ترتيب المستخدمين
        const userRanking = document.getElementById('userRanking');
        if (userRanking && report.user_ranking) {
            userRanking.innerHTML = `
                <div class="ranking-header">
                    <span>#</span><span>الملحق</span><span>المكالمات</span><span>التكلفة</span>
                </div>
                ${report.user_ranking.slice(0, 15).map(([ext, data], index) => `
                    <div class="ranking-item">
                        <span class="rank">${index + 1}</span>
                        <span class="ext">${ext}</span>
                        <span class="calls">${data.total_calls}</span>
                        <span class="cost">${data.total_cost.toFixed(2)} ر.س</span>
                    </div>
                `).join('')}
            `;
        }
        
    } catch (error) {
        console.error('خطأ في تحميل التحليل:', error);
    }
}

function renderDurationChart(distribution) {
    const container = document.getElementById('durationChart');
    if (!container) return;
    
    const labels = {
        'short': 'قصيرة (< 30 ث)',
        'medium': 'متوسطة (30-120 ث)',
        'long': 'طويلة (2-5 دقائق)',
        'very_long': 'طويلة جداً (> 5 دقائق)'
    };
    
    // التحقق من وجود distribution وليس فارغاً
    if (!distribution || Object.keys(distribution).length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#a0aec0;padding:50px;">لا توجد بيانات كافية للرسم البياني</div>';
        return;
    }
    
    const options = {
        series: Object.values(distribution),
        chart: { 
            type: 'donut', 
            height: 300, 
            background: 'transparent',
            animations: { enabled: true }
        },
        labels: Object.keys(distribution).map(k => labels[k] || k),
        colors: ['#28a745', '#ffc107', '#fd7e14', '#dc3545'],
        legend: { 
            labels: { colors: '#a0aec0' }, 
            position: 'bottom',
            fontSize: '12px'
        },
        dataLabels: { style: { colors: ['white'] } },
        tooltip: { theme: 'dark' }
    };
    
    // التحقق من وجود chart سابق وتدميره بشكل آمن
    if (window.durationChart && typeof window.durationChart.destroy === 'function') {
        window.durationChart.destroy();
    }
    
    try {
        window.durationChart = new ApexCharts(container, options);
        window.durationChart.render();
    } catch (error) {
        console.error('خطأ في إنشاء الرسم البياني:', error);
        container.innerHTML = '<div style="text-align:center;color:#ef4444;padding:50px;">خطأ في تحميل الرسم البياني</div>';
    }
}

// تواريخ افتراضية
function initDates() {
    // ترك حقلي التاريخ فارغين لعرض جميع المكالمات
    const startDate = document.getElementById('filterStartDate');
    const endDate = document.getElementById('filterEndDate');
    const reportStart = document.getElementById('reportStart');
    const reportEnd = document.getElementById('reportEnd');
    
    // ترك الحقول فارغة لعرض جميع المكالمات
    if (startDate) startDate.value = '';
    if (endDate) endDate.value = '';
    if (reportStart) reportStart.value = '';
    if (reportEnd) reportEnd.value = '';
}

// وظائف التقارير
function generateReport() {
    const reportType = document.getElementById('reportType')?.value || 'summary';
    const startDate = document.getElementById('reportStart')?.value || '';
    const endDate = document.getElementById('reportEnd')?.value || '';
    const output = document.getElementById('reportOutput');
    
    if (output) {
        output.innerHTML = `
            <div class="report-generating">
                <i class="fas fa-spinner fa-spin"></i>
                <p>جاري إنشاء التقرير...</p>
            </div>
        `;
        
        setTimeout(() => {
            output.innerHTML = `
                <div class="report-content">
                    <h3>تقرير ${reportType === 'summary' ? 'عام' : reportType === 'extensions' ? 'حسب الملحق' : 'التكاليف'}</h3>
                    <p>الفترة: ${startDate || 'بداية'} إلى ${endDate || 'اليوم'}</p>
                    <div class="report-placeholder">
                        <i class="fas fa-chart-line"></i>
                        <p>جاري تطوير ميزة التقارير المتقدمة...</p>
                        <small>يمكنك تصدير البيانات من تبويب "المكالمات"</small>
                    </div>
                </div>
            `;
        }, 1000);
    }
}

function exportReport() {
    alert("سيتم إضافة تصدير PDF قريباً");
}

function exportToExcel() {
    loadCalls(); // تحديث البيانات أولاً
    setTimeout(() => {
        alert("📊 سيتم إضافة تصدير Excel قريباً\n\nيمكنك حالياً نسخ البيانات من الجدول يدوياً");
    }, 500);
}

function switchTab(tabId) {
    const navItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (navItem) navItem.click();
}

// ========== دوال إعدادات السنترال ==========

async function loadSettings() {
    try {
        const response = await fetch(`${API_URL}/api/settings`);
        const settings = await response.json();
        
        document.getElementById('listenHost').value = settings.listen_host || '0.0.0.0';
        document.getElementById('listenPort').value = settings.listen_port || 9000;
        document.getElementById('pbxType').value = settings.pbx_type || 'Avaya';
        document.getElementById('pbxIp').value = settings.pbx_ip || '';
        document.getElementById('pbxPort').value = settings.pbx_port || 9000;
        document.getElementById('defaultRate').value = settings.default_rate || 0.15;
        document.getElementById('currency').value = settings.currency || 'SAR';
        
        updateListenerStatus(settings.listener_running);
        updateServerStatus();
        
        addLog('info', 'تم تحميل الإعدادات');
    } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
        addLog('error', 'فشل في تحميل الإعدادات');
    }
}

async function saveSettings() {
    const settings = {
        listen_host: document.getElementById('listenHost').value,
        listen_port: parseInt(document.getElementById('listenPort').value),
        pbx_type: document.getElementById('pbxType').value,
        pbx_ip: document.getElementById('pbxIp').value,
        pbx_port: parseInt(document.getElementById('pbxPort').value),
        default_rate: parseFloat(document.getElementById('defaultRate').value),
        currency: document.getElementById('currency').value
    };
    
    try {
        const response = await fetch(`${API_URL}/api/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        
        if (response.ok) {
            addLog('success', '✅ تم حفظ الإعدادات بنجاح');
            alert('تم حفظ الإعدادات');
        } else {
            addLog('error', '❌ فشل في حفظ الإعدادات');
        }
    } catch (error) {
        addLog('error', '❌ خطأ في الاتصال');
    }
}

async function testListener() {
    addLog('info', '🔍 اختبار المستمع...');
    try {
        const response = await fetch(`${API_URL}/api/test-listener`);
        const result = await response.json();
        if (result.status === 'running') {
            addLog('success', '✅ المستمع يعمل على المنفذ ' + result.port);
            updateListenerStatus(true);
        } else {
            addLog('error', '❌ المستمع لا يعمل');
            updateListenerStatus(false);
        }
    } catch (error) {
        addLog('error', '❌ لا يمكن الاتصال بالخادم');
        updateListenerStatus(false);
    }
}

async function testPbxConnection() {
    const pbxIp = document.getElementById('pbxIp').value;
    const pbxPort = document.getElementById('pbxPort').value;
    
    addLog('info', `🔍 اختبار الاتصال بـ ${pbxIp}:${pbxPort}...`);
    
    try {
        const response = await fetch(`${API_URL}/api/test-pbx`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip: pbxIp, port: parseInt(pbxPort) })
        });
        const result = await response.json();
        
        if (result.reachable) {
            addLog('success', `✅ السنترال ${pbxIp} متاح على المنفذ ${pbxPort}`);
        } else {
            addLog('error', `❌ لا يمكن الوصول إلى ${pbxIp}:${pbxPort}`);
        }
    } catch (error) {
        addLog('error', '❌ فشل اختبار الاتصال');
    }
}

async function restartListener() {
    addLog('info', '🔄 جاري إعادة تشغيل المستمع...');
    try {
        const response = await fetch(`${API_URL}/api/restart-listener`, {
            method: 'POST'
        });
        const result = await response.json();
        if (result.status === 'restarted') {
            addLog('success', '✅ تم إعادة تشغيل المستمع بنجاح');
            updateListenerStatus(true);
        } else {
            addLog('error', '❌ فشل إعادة تشغيل المستمع');
        }
    } catch (error) {
        addLog('error', '❌ خطأ في إعادة التشغيل');
    }
}

async function updateServerStatus() {
    try {
        const response = await fetch(`${API_URL}/`);
        if (response.ok) {
            document.getElementById('serverStatus').textContent = 'متصل';
            document.getElementById('serverStatus').className = 'status-online';
        } else {
            document.getElementById('serverStatus').textContent = 'غير متصل';
            document.getElementById('serverStatus').className = 'status-offline';
        }
    } catch {
        document.getElementById('serverStatus').textContent = 'غير متصل';
        document.getElementById('serverStatus').className = 'status-offline';
    }
}

function updateListenerStatus(running) {
    const statusText = document.getElementById('listenerState');
    const statusDot = document.querySelector('#listenerStatus .status-dot');

    const t = translations[currentLang];

    if (running) {
        statusText.textContent = t.running;
        statusText.className = 'status-online';
        if (statusDot) statusDot.classList.add('active');
    } else {
        statusText.textContent = t.stopped;
        statusText.className = 'status-offline';
        if (statusDot) statusDot.classList.remove('active');
    }
}

function addLog(type, message) {
    const logContainer = document.getElementById('connectionLog');
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `[${timestamp}] ${message}`;
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // الاحتفاظ بآخر 50 سجل فقط
    while (logContainer.children.length > 50) {
        logContainer.removeChild(logContainer.firstChild);
    }
}

function clearLog() {
    const logContainer = document.getElementById('connectionLog');
    logContainer.innerHTML = '<div class="log-entry info">📋 تم مسح السجل</div>';
    addLog('info', 'تم مسح سجل الاتصال');
}

// تحديث حالة المستمع كل 10 ثوانٍ
setInterval(() => {
    testListener();
}, 10000);

// الحصول على عنوان IP المحلي للجهاز
async function getLocalIP() {
    try {
        const response = await fetch(`${API_URL}/api/local-ip`);
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('خطأ في الحصول على IP:', error);
        return 'غير متاح';
    }
}

// عرض IP في شاشة الإعدادات
async function displayLocalIP() {
    const ip = await getLocalIP();
    const ipDisplay = document.getElementById('localIpDisplay');
    if (ipDisplay) {
        ipDisplay.textContent = ip;
        ipDisplay.title = 'عنوان IP الخاص بهذا الجهاز - استخدمه في إعدادات السنترال';
    }
}

// تحديث IP عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    displayLocalIP();
});


// ========== دعم اللغة الإنجليزية ==========
let currentLang = localStorage.getItem('language') || 'ar'; // 'ar' or 'en'

const translations = {
    ar: {
        // القائمة الجانبية
        dashboard: 'لوحة التحكم',
        upload: 'رفع الملفات',
        calls: 'المكالمات',
        analyze: 'تحليل متقدم',
        reports: 'تقارير',
        settings: 'إعدادات',
        live: 'مباشر',
        
        // عنوان الصفحة
        pageTitle: 'لوحة التحكم',
        pageSubtitle: 'نظرة عامة على نشاط النظام',
        
        // الإحصائيات
        totalCalls: 'إجمالي المكالمات',
        outgoingCalls: 'مكالمات صادرة',
        incomingCalls: 'مكالمات واردة',
        totalDuration: 'إجمالي المدة (دقيقة)',
        totalCost: 'إجمالي التكلفة (ر.س)',
        avgDuration: 'متوسط المدة (ثانية)',
        
        // أزرار
        search: 'بحث',
        export: 'تصدير',
        save: 'حفظ',
        refresh: 'تحديث',
        restart: 'إعادة تشغيل',
        test: 'اختبار',
        viewAll: 'عرض الكل',
        uploadFile: 'اختيار ملف',
        generate: 'إنشاء التقرير',
        exportPDF: 'تصدير PDF',
        saveSettings: 'حفظ الإعدادات',
        clearLog: 'مسح السجل',
        testListener: 'اختبار المستمع',
        testConnection: 'اختبار اتصال السنترال',
        
        // حالات
        outgoing: 'صادرة',
        incoming: 'واردة',
        completed: 'مكتملة',
        missed: 'فائتة',
        unknown: 'غير معروف',
        connected: 'متصل',
        disconnected: 'مفصول',
        running: 'يعمل',
        stopped: 'متوقف',
        
        // عناوين الجدول
        datetime: 'التاريخ والوقت',
        duration: 'المدة',
        extension: 'الملحق',
        direction: 'الاتجاه',
        dialedNumber: 'الرقم المطلوب',
        cliNumber: 'رقم المتصل',
        ddiNumber: 'الرقم المباشر',
        ringDuration: 'وقت الرنين',
        cost: 'التكلفة',
        source: 'المصدر',
        destination: 'الهدف',
        type: 'النوع',
        status: 'الحالة',
        callId: 'معرف المكالمة',
        time: 'الوقت',
        
        // تحليل
        callDistribution: 'توزيع المكالمات حسب المدة',
        transferCalls: 'المكالمات التحويلية',
        costDetails: 'تفاصيل التكاليف',
        userRanking: 'ترتيب المستخدمين',
        
        // تقارير
        reportCustomize: 'تخصيص التقرير',
        reportType: 'نوع التقرير',
        summary: 'ملخص عام',
        byExtension: 'حسب الملحق',
        costAnalysis: 'تحليل التكاليف',
        hourly: 'توزيع ساعي',
        fromDate: 'من تاريخ',
        toDate: 'إلى تاريخ',
        
        // إعدادات
        pbxSettings: 'إعدادات الربط مع السنترال',
        smdrSettings: 'إعدادات مستمع SMDR',
        listenHost: 'عنوان IP للاستماع',
        listenPort: 'منفذ الاستماع',
        listenerStatus: 'حالة المستمع',
        pbxType: 'نوع السنترال',
        pbxIp: 'عنوان IP السنترال',
        pbxPort: 'منفذ إرسال السنترال',
        costSettings: 'إعدادات التكلفة',
        defaultRate: 'سعر الدقيقة الافتراضي (ريال)',
        currency: 'عملة الفواتير',
        connectionStatus: 'حالة الاتصال',
        serverStatus: 'حالة الخادم',
        lastCall: 'آخر مكالمة',
        connectionLog: 'سجل الاتصال',
        localIp: 'عنوان IP هذا الجهاز (تلقائي)',
        
        // رسائل
        loading: 'جاري التحميل...',
        noData: 'لا توجد بيانات',
        error: 'خطأ',
        success: 'نجاح',
        waiting: 'في انتظار المكالمات الجديدة...',
        ready: 'جاهز لاستقبال الاتصالات...',
        
        // تسميات إضافية للإعدادات
        defaultRateLabel: 'سعر الدقيقة الافتراضي (ريال)',
        currencyLabel: 'عملة الفواتير',
        listenHostLabel: 'عنوان IP للاستماع',
        listenPortLabel: 'منفذ الاستماع',
        listenerStatusLabel: 'حالة المستمع',
        pbxTypeLabel: 'نوع السنترال',
        pbxIpLabel: 'عنوان IP السنترال',
        pbxPortLabel: 'منفذ إرسال السنترال',
        localIpLabel: 'عنوان IP هذا الجهاز (تلقائي)',
        
        // عناوين بطاقات الإعدادات
        smdrSettingsTitle: 'إعدادات مستمع SMDR',
        pbxSettingsTitle: 'إعدادات السنترال',
        costSettingsTitle: 'إعدادات التكلفة',
        connectionStatusTitle: 'حالة الاتصال',
        
        // أزرار الإعدادات
        saveSettingsBtn: 'حفظ الإعدادات',
        refreshBtn: 'تحديث',
        restartListenerBtn: 'إعادة تشغيل المستمع',
        testListenerBtn: 'اختبار المستمع',
        testPbxBtn: 'اختبار اتصال السنترال',
        clearLogBtn: 'مسح السجل',
        
        // عناصر حالة الاتصال
        serverStatusLabel: 'حالة الخادم',
        listenerStateLabel: 'المستمع',
        lastCallLabel: 'آخر مكالمة',
        
        // مستخدم
        systemAdmin: 'مدير النظام',
        
        // رسائل الحالة
        apiConnected: 'API متصل',
        apiDisconnected: 'API مفصول',
        systemActive: 'النظام نشط',
        
        // إعدادات إضافية
        configureSmdr: 'تكوين اتصال SMDR مع سنترال الهاتف',
        
        // رؤوس جدول Dashboard
        timeHeader: 'الوقت'
    },
    
    en: {
        // Sidebar
        dashboard: 'Dashboard',
        upload: 'Upload',
        calls: 'Calls',
        analyze: 'Analytics',
        reports: 'Reports',
        settings: 'Settings',
        live: 'Live',
        
        // Page title
        pageTitle: 'Dashboard',
        pageSubtitle: 'System Activity Overview',
        
        // Stats
        totalCalls: 'Total Calls',
        outgoingCalls: 'Outgoing',
        incomingCalls: 'Incoming',
        totalDuration: 'Total Duration (min)',
        totalCost: 'Total Cost (SAR)',
        avgDuration: 'Avg Duration (sec)',
        
        // Buttons
        search: 'Search',
        export: 'Export',
        save: 'Save',
        refresh: 'Refresh',
        restart: 'Restart',
        test: 'Test',
        viewAll: 'View All',
        uploadFile: 'Select File',
        generate: 'Generate Report',
        exportPDF: 'Export PDF',
        saveSettings: 'Save Settings',
        clearLog: 'Clear Log',
        testListener: 'Test Listener',
        testConnection: 'Test PBX Connection',
        
        // Status
        outgoing: 'Outgoing',
        incoming: 'Incoming',
        completed: 'Completed',
        missed: 'Missed',
        unknown: 'Unknown',
        connected: 'Connected',
        disconnected: 'Disconnected',
        running: 'Running',
        stopped: 'Stopped',
        
        // Table headers
        datetime: 'Date & Time',
        duration: 'Duration',
        extension: 'Extension',
        direction: 'Direction',
        dialedNumber: 'Dialed Number',
        cliNumber: 'Caller ID',
        ddiNumber: 'DDI Number',
        ringDuration: 'Ring Time',
        cost: 'Cost',
        source: 'Source',
        destination: 'Destination',
        type: 'Type',
        status: 'Status',
        callId: 'Call ID',
        time: 'Time',
        
        // Analytics
        callDistribution: 'Call Duration Distribution',
        transferCalls: 'Transferred Calls',
        costDetails: 'Cost Breakdown',
        userRanking: 'User Ranking',
        
        // Reports
        reportCustomize: 'Customize Report',
        reportType: 'Report Type',
        summary: 'Summary',
        byExtension: 'By Extension',
        costAnalysis: 'Cost Analysis',
        hourly: 'Hourly Distribution',
        fromDate: 'From Date',
        toDate: 'To Date',
        
        // Settings
        pbxSettings: 'PBX Integration Settings',
        smdrSettings: 'SMDR Listener Settings',
        listenHost: 'Listen IP Address',
        listenPort: 'Listen Port',
        listenerStatus: 'Listener Status',
        pbxType: 'PBX Type',
        pbxIp: 'PBX IP Address',
        pbxPort: 'PBX Port',
        costSettings: 'Cost Settings',
        defaultRate: 'Default Rate per Minute (SAR)',
        currency: 'Currency',
        connectionStatus: 'Connection Status',
        serverStatus: 'Server Status',
        lastCall: 'Last Call',
        connectionLog: 'Connection Log',
        localIp: 'Local IP Address (Auto-detected)',
        
        // Messages
        loading: 'Loading...',
        noData: 'No data available',
        error: 'Error',
        success: 'Success',
        waiting: 'Waiting for new calls...',
        ready: 'Ready to receive connections...',
        
        // Additional settings labels
        defaultRateLabel: 'Default Rate per Minute (SAR)',
        currencyLabel: 'Currency',
        listenHostLabel: 'Listen IP Address',
        listenPortLabel: 'Listen Port',
        listenerStatusLabel: 'Listener Status',
        pbxTypeLabel: 'PBX Type',
        pbxIpLabel: 'PBX IP Address',
        pbxPortLabel: 'PBX Port',
        localIpLabel: 'Local IP Address (Auto-detected)',
        
        // Settings card titles
        smdrSettingsTitle: 'SMDR Listener Settings',
        pbxSettingsTitle: 'PBX Settings',
        costSettingsTitle: 'Cost Settings',
        connectionStatusTitle: 'Connection Status',
        
        // Settings buttons
        saveSettingsBtn: 'Save Settings',
        refreshBtn: 'Refresh',
        restartListenerBtn: 'Restart Listener',
        testListenerBtn: 'Test Listener',
        testPbxBtn: 'Test PBX Connection',
        clearLogBtn: 'Clear Log',
        
        // Connection status items
        serverStatusLabel: 'Server Status',
        listenerStateLabel: 'Listener',
        lastCallLabel: 'Last Call',
        
        // User
        systemAdmin: 'System Admin',
        
        // Status messages
        apiConnected: 'API Connected',
        apiDisconnected: 'API Disconnected',
        systemActive: 'System Active',
        
        // Additional settings
        configureSmdr: 'Configure SMDR connection with PBX',
        
        // Dashboard table headers
        timeHeader: 'Time'
    }
};

// دالة تبديل اللغة
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('language', currentLang);
    updateAllUI();
}

// دالة تحديث جميع عناصر الواجهة
function updateAllUI() {
    const t = translations[currentLang];
    
// في دالة updateAllUI()، استبدل جزء تحديث اتجاه الصفحة بهذا:

// تحديث اتجاه الصفحة
if (currentLang === 'ar') {
    document.body.style.direction = 'rtl';
    document.documentElement.lang = 'ar';
    document.body.setAttribute('dir', 'rtl');
} else {
    document.body.style.direction = 'ltr';
    document.documentElement.lang = 'en';
    document.body.setAttribute('dir', 'ltr');
}
    
    // تحديث نص زر اللغة
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        const langSpan = langBtn.querySelector('#langText');
        if (langSpan) langSpan.textContent = currentLang === 'ar' ? 'English' : 'العربية';
    }
    
    // تحديث القائمة الجانبية
    const navItems = document.querySelectorAll('.nav-item');
    const navMap = {
        dashboard: 'dashboard',
        upload: 'upload',
        calls: 'calls',
        analyze: 'analyze',
        reports: 'reports',
        settings: 'settings'
    };
	
	// تحديث عنوان الصفحة الحالية حسب التبويب النشط
const activeTabPane = document.querySelector('.tab-pane.active');
const currentPageTitle = document.getElementById('pageTitle');
const currentPageSubtitle = document.getElementById('pageSubtitle');

if (activeTabPane && currentPageTitle) {
    switch (activeTabPane.id) {
        case 'dashboard':
            currentPageTitle.textContent = t.dashboard;
            currentPageSubtitle.textContent = t.pageSubtitle;
            break;
        case 'upload':
            currentPageTitle.textContent = t.upload;
            currentPageSubtitle.textContent = currentLang === 'ar' ? 'تحميل وتحليل ملفات SMDR' : 'Upload and analyze SMDR files';
            break;
        case 'calls':
            currentPageTitle.textContent = t.calls;
            currentPageSubtitle.textContent = currentLang === 'ar' ? 'عرض وتصفية جميع المكالمات' : 'View and filter all calls';
            break;
        case 'analyze':
            currentPageTitle.textContent = t.analyze;
            currentPageSubtitle.textContent = currentLang === 'ar' ? 'تحليل عميق للمكالمات والتكاليف' : 'Deep analysis of calls and costs';
            break;
        case 'reports':
            currentPageTitle.textContent = t.reports;
            currentPageSubtitle.textContent = currentLang === 'ar' ? 'إنشاء وتصدير تقارير مخصصة' : 'Create and export custom reports';
            break;
        case 'settings':
            currentPageTitle.textContent = t.settings;
            currentPageSubtitle.textContent = currentLang === 'ar' ? 'إعدادات النظام والتكامل' : 'System and integration settings';
            break;
        default:
            currentPageTitle.textContent = t.dashboard;
            currentPageSubtitle.textContent = t.pageSubtitle;
    }
}
    
    navItems.forEach(item => {
        const tab = item.dataset.tab;
        const span = item.querySelector('span:first-of-type');
        if (span && navMap[tab] && translations[currentLang][navMap[tab]]) {
            span.textContent = translations[currentLang][navMap[tab]];
        }
    });
    
    // تحديث اسم المستخدم
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = t.systemAdmin;
    
    // تحديث حالة API في الشريط الجانبي
    const apiStatusIcon = document.querySelector('#apiStatus i');
    const apiStatusSpan = document.querySelector('#apiStatus span');
    if (apiStatusSpan) {
        const isConnected = apiStatusIcon?.style.color === 'rgb(16, 185, 129)';
        apiStatusSpan.textContent = isConnected ? t.apiConnected : t.apiDisconnected;
    }
    
    // تحديث حالة النظام في الشريط الجانبي
    const systemStatusSpan = document.querySelector('.system-status span');
    if (systemStatusSpan) systemStatusSpan.textContent = t.systemActive;
    
    // تحديث عنوان الصفحة
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    if (pageTitle) pageTitle.textContent = t.pageTitle;
    if (pageSubtitle) pageSubtitle.textContent = t.pageSubtitle;
    
    // تحديث إحصائيات لوحة التحكم
    const statLabels = document.querySelectorAll('.stat-info p');
    const statTexts = [t.totalCalls, t.outgoingCalls, t.incomingCalls, t.totalDuration, t.totalCost, t.avgDuration];
    statLabels.forEach((label, index) => {
        if (statTexts[index]) label.textContent = statTexts[index];
    });
    
    // تحديث أزرار التصفية في تبويب المكالمات
    const filterBtn = document.querySelector('.btn-filter');
    if (filterBtn) filterBtn.innerHTML = `<i class="fas fa-filter"></i> ${t.search}`;
    
    const exportBtn = document.querySelector('.btn-export');
    if (exportBtn) exportBtn.innerHTML = `<i class="fas fa-file-excel"></i> ${t.export}`;
    
    // تحديث خيارات الاتجاه في تبويب المكالمات
    const directionSelect = document.getElementById('filterDirection');
    if (directionSelect) {
        directionSelect.options[0].text = currentLang === 'ar' ? 'الكل' : 'All';
        directionSelect.options[1].text = t.outgoing;
        directionSelect.options[2].text = t.incoming;
    }
    
    // تحديث زر "عرض الكل" في لوحة التحكم
    const viewAllBtn = document.querySelector('.btn-view-all');
    if (viewAllBtn) {
        viewAllBtn.innerHTML = `${t.viewAll} <i class="fas fa-arrow-left"></i>`;
    }
    
    // تحديث تبويب رفع الملفات
    const uploadHeader = document.querySelector('#upload .upload-header h2');
    if (uploadHeader) uploadHeader.textContent = t.upload;
    
    const uploadSubtitle = document.querySelector('#upload .upload-header p');
    if (uploadSubtitle) uploadSubtitle.textContent = t.uploadSubtitle || (currentLang === 'ar' ? 'اسحب ملف السجلات هنا أو انقر للاختيار' : 'Drag and drop or click to select');
    
    const uploadBtn = document.querySelector('.btn-upload');
    if (uploadBtn) uploadBtn.innerHTML = `<i class="fas fa-folder-open"></i> ${t.uploadFile}`;
    
    // تحديث تبويب التحليل
    const analysisTitles = document.querySelectorAll('.analysis-card h3');
    if (analysisTitles[0]) analysisTitles[0].innerHTML = `<i class="fas fa-chart-pie"></i> ${t.callDistribution}`;
    if (analysisTitles[1]) analysisTitles[1].innerHTML = `<i class="fas fa-random"></i> ${t.transferCalls}`;
    if (analysisTitles[2]) analysisTitles[2].innerHTML = `<i class="fas fa-chart-line"></i> ${t.costDetails}`;
    if (analysisTitles[3]) analysisTitles[3].innerHTML = `<i class="fas fa-ranking-star"></i> ${t.userRanking}`;
    
    // تحديث إحصائيات التحويل في تحليل متقدم
    const transferStatLabel = document.querySelector('#transferStats .stat-label');
    if (transferStatLabel) transferStatLabel.textContent = currentLang === 'ar' ? 'مكالمة محولة' : 'Transferred Calls';
    
    const transferStatPercent = document.querySelector('#transferStats .stat-percent');
    if (transferStatPercent && transferStatPercent.innerHTML.includes('من الإجمالي')) {
        transferStatPercent.innerHTML = transferStatPercent.innerHTML.replace('من الإجمالي', currentLang === 'ar' ? 'من الإجمالي' : 'of total');
    }
    
    // تحديث تفاصيل التكاليف في تحليل متقدم
    const costDetailsTitle = document.querySelector('.cost-details-title');
    if (costDetailsTitle) {
        costDetailsTitle.textContent = currentLang === 'ar' ? 'أعلى 5 ملحقات تكلفة:' : 'Top 5 extensions by cost:';
    }
    
    // تحديث تبويب التقارير
    const reportTitle = document.querySelector('#reports .report-sidebar h3');
    if (reportTitle) reportTitle.innerHTML = `<i class="fas fa-sliders-h"></i> ${t.reportCustomize}`;
    
    const reportTypeLabel = document.querySelector('#reports .option-group:first-child label');
    if (reportTypeLabel) reportTypeLabel.textContent = t.reportType;
    
    const reportTypeSelect = document.getElementById('reportType');
    if (reportTypeSelect) {
        reportTypeSelect.options[0].text = t.summary;
        reportTypeSelect.options[1].text = t.byExtension;
        reportTypeSelect.options[2].text = t.costAnalysis;
        reportTypeSelect.options[3].text = t.hourly;
    }
    
    const fromDateLabel = document.querySelector('#reports .option-group:nth-child(2) label');
    if (fromDateLabel) fromDateLabel.textContent = t.fromDate;
    
    const toDateLabel = document.querySelector('#reports .option-group:nth-child(3) label');
    if (toDateLabel) toDateLabel.textContent = t.toDate;
    
    const generateBtn = document.querySelector('.btn-generate');
    if (generateBtn) generateBtn.innerHTML = `<i class="fas fa-chart-bar"></i> ${t.generate}`;
    
    const exportPdfBtn = document.querySelector('.btn-export-pdf');
    if (exportPdfBtn) exportPdfBtn.innerHTML = `<i class="fas fa-file-pdf"></i> ${t.exportPDF}`;
    
    // ========== تحديث تبويب الإعدادات ==========
    
    // العنوان الرئيسي
    const settingsHeader = document.querySelector('#settings .settings-header h2');
    if (settingsHeader) settingsHeader.innerHTML = `<i class="fas fa-microchip"></i> ${t.pbxSettings}`;
    
    // بطاقة إعدادات المستمع
    const smdrCard = document.querySelector('#settings .settings-card:first-child h3');
    if (smdrCard) smdrCard.innerHTML = `<i class="fas fa-headset"></i> ${t.smdrSettingsTitle}`;
    
    const listenHostLabel = document.querySelector('#settings .settings-card:first-child .setting-group:first-child label');
    if (listenHostLabel) listenHostLabel.textContent = t.listenHostLabel;
    
    const listenHostSmall = document.querySelector('#settings .settings-card:first-child .setting-group:first-child small');
    if (listenHostSmall) listenHostSmall.textContent = currentLang === 'ar' ? '0.0.0.0 للاستماع على جميع الواجهات' : '0.0.0.0 to listen on all interfaces';
    
    const listenPortLabel = document.querySelector('#settings .settings-card:first-child .setting-group:nth-child(2) label');
    if (listenPortLabel) listenPortLabel.textContent = t.listenPortLabel;
    
    const listenPortSmall = document.querySelector('#settings .settings-card:first-child .setting-group:nth-child(2) small');
    if (listenPortSmall) listenPortSmall.textContent = currentLang === 'ar' ? 'المنفذ الذي سيستمع عليه البرنامج (افتراضي: 9000)' : 'Port the program will listen on (default: 9000)';
    
    const listenerStatusLabel = document.querySelector('#settings .settings-card:first-child .setting-group:nth-child(3) label');
    if (listenerStatusLabel) listenerStatusLabel.textContent = t.listenerStatusLabel;
    
    const testListenerBtn = document.querySelector('#settings .settings-card:first-child .btn-test');
    if (testListenerBtn) testListenerBtn.innerHTML = `<i class="fas fa-plug"></i> ${t.testListenerBtn}`;
    
    // بطاقة إعدادات السنترال
    const pbxCard = document.querySelector('#settings .settings-card:nth-child(2) h3');
    if (pbxCard) pbxCard.innerHTML = `<i class="fas fa-exchange-alt"></i> ${t.pbxSettingsTitle}`;
    
    const pbxTypeLabel = document.querySelector('#settings .settings-card:nth-child(2) .setting-group:first-child label');
    if (pbxTypeLabel) pbxTypeLabel.textContent = t.pbxTypeLabel;
    
    const localIpLabel = document.querySelector('#settings .settings-card:nth-child(2) .setting-group:nth-child(2) label');
    if (localIpLabel) localIpLabel.innerHTML = `<i class="fas fa-desktop"></i> ${t.localIpLabel}`;
    
    const localIpSmall = document.querySelector('#settings .settings-card:nth-child(2) .setting-group:nth-child(2) small');
    if (localIpSmall) localIpSmall.textContent = currentLang === 'ar' ? 'استخدم هذا IP عند تكوين السنترال - سيتم اكتشافه تلقائياً' : 'Use this IP when configuring the PBX - auto-detected';
    
    const pbxIpLabel = document.querySelector('#settings .settings-card:nth-child(2) .setting-group:nth-child(3) label');
    if (pbxIpLabel) pbxIpLabel.textContent = t.pbxIpLabel;
    
    const pbxIpSmall = document.querySelector('#settings .settings-card:nth-child(2) .setting-group:nth-child(3) small');
    if (pbxIpSmall) pbxIpSmall.textContent = currentLang === 'ar' ? 'عنوان IP الخاص بسنترال الهاتف' : 'PBX phone system IP address';
    
    const pbxPortLabel = document.querySelector('#settings .settings-card:nth-child(2) .setting-group:nth-child(4) label');
    if (pbxPortLabel) pbxPortLabel.textContent = t.pbxPortLabel;
    
    const pbxPortSmall = document.querySelector('#settings .settings-card:nth-child(2) .setting-group:nth-child(4) small');
    if (pbxPortSmall) pbxPortSmall.textContent = currentLang === 'ar' ? 'المنفذ الذي يرسل منه السنترال البيانات' : 'Port the PBX sends data from';
    
    const testPbxBtn = document.querySelector('#settings .settings-card:nth-child(2) .btn-test');
    if (testPbxBtn) testPbxBtn.innerHTML = `<i class="fas fa-network-wired"></i> ${t.testPbxBtn}`;
    
    // بطاقة إعدادات التكلفة
    const costCard = document.querySelector('#settings .settings-card:nth-child(3) h3');
    if (costCard) costCard.innerHTML = `<i class="fas fa-coins"></i> ${t.costSettingsTitle}`;
    
    const defaultRateLabel = document.querySelector('#settings .settings-card:nth-child(3) .setting-group:first-child label');
    if (defaultRateLabel) defaultRateLabel.textContent = t.defaultRateLabel;
    
    const currencyLabel = document.querySelector('#settings .settings-card:nth-child(3) .setting-group:nth-child(2) label');
    if (currencyLabel) currencyLabel.textContent = t.currencyLabel;
    
    // بطاقة حالة الاتصال
    const statusCard = document.querySelector('#settings .settings-card:nth-child(4) h3');
    if (statusCard) statusCard.innerHTML = `<i class="fas fa-chart-line"></i> ${t.connectionStatusTitle}`;
    
    const serverStatusLabel = document.querySelector('#connectionStatus .status-item:first-child span:first-child');
    if (serverStatusLabel) serverStatusLabel.textContent = t.serverStatusLabel;
    
    const listenerStateLabel = document.querySelector('#connectionStatus .status-item:nth-child(2) span:first-child');
    if (listenerStateLabel) listenerStateLabel.textContent = t.listenerStateLabel;
    
    const lastCallLabel = document.querySelector('#connectionStatus .status-item:nth-child(3) span:first-child');
    if (lastCallLabel) lastCallLabel.textContent = t.lastCallLabel;
    
    // أزرار الإعدادات
    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn) saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t.saveSettingsBtn}`;
    
    const refreshSettingsBtn = document.querySelector('#settings .settings-card:last-child .btn-refresh');
    if (refreshSettingsBtn) refreshSettingsBtn.innerHTML = `<i class="fas fa-sync-alt"></i> ${t.refreshBtn}`;
    
    const restartBtn = document.querySelector('.btn-restart');
    if (restartBtn) restartBtn.innerHTML = `<i class="fas fa-power-off"></i> ${t.restartListenerBtn}`;
    
    const clearLogBtn = document.querySelector('.btn-clear-log');
    if (clearLogBtn) clearLogBtn.textContent = t.clearLogBtn;
    
    // سجل الاتصال - عنوان القسم
    const connectionLogTitle = document.querySelector('.connection-log h3');
    if (connectionLogTitle) connectionLogTitle.innerHTML = `<i class="fas fa-history"></i> ${t.connectionLog}`;
    
    // تحديث حالة الخادم والمستمع في الإعدادات
    const serverStatusSpan = document.getElementById('serverStatus');
    if (serverStatusSpan) {
        const isOnline = serverStatusSpan.classList.contains('status-online');
        serverStatusSpan.textContent = isOnline ? t.connected : t.disconnected;
    }
    
    const listenerStateSpan = document.getElementById('listenerState');
    if (listenerStateSpan) {
        const isRunning = listenerStateSpan.classList.contains('status-online');
        listenerStateSpan.textContent = isRunning ? t.running : t.stopped;
    }
    
	
	// تحديث جميع النصوص في شاشة الإعدادات - حل مباشر
const settingsCards = document.querySelectorAll('.settings-card');

// بطاقة إعدادات المستمع (الأولى)
if (settingsCards[0]) {
    const labels = settingsCards[0].querySelectorAll('.setting-group label');
    if (labels[0]) labels[0].textContent = currentLang === 'ar' ? 'عنوان IP للاستماع' : 'Listen IP Address';
    if (labels[1]) labels[1].textContent = currentLang === 'ar' ? 'منفذ الاستماع' : 'Listen Port';
    if (labels[2]) labels[2].textContent = currentLang === 'ar' ? 'حالة المستمع' : 'Listener Status';
}

// بطاقة إعدادات السنترال (الثانية)
if (settingsCards[1]) {
    const labels = settingsCards[1].querySelectorAll('.setting-group label');
    if (labels[0]) labels[0].textContent = currentLang === 'ar' ? 'نوع السنترال' : 'PBX Type';
    if (labels[1]) {
        const icon = labels[1].querySelector('i');
        if (icon) {
            labels[1].innerHTML = `<i class="fas fa-desktop"></i> ${currentLang === 'ar' ? 'عنوان IP هذا الجهاز (تلقائي)' : 'Local IP Address (Auto-detected)'}`;
        } else {
            labels[1].textContent = currentLang === 'ar' ? 'عنوان IP هذا الجهاز (تلقائي)' : 'Local IP Address (Auto-detected)';
        }
    }
    if (labels[2]) labels[2].textContent = currentLang === 'ar' ? 'عنوان IP السنترال' : 'PBX IP Address';
    if (labels[3]) labels[3].textContent = currentLang === 'ar' ? 'منفذ إرسال السنترال' : 'PBX Port';
}

// بطاقة إعدادات التكلفة (الثالثة)
if (settingsCards[2]) {
    const labels = settingsCards[2].querySelectorAll('.setting-group label');
    if (labels[0]) labels[0].textContent = currentLang === 'ar' ? 'سعر الدقيقة الافتراضي (ريال)' : 'Default Rate per Minute (SAR)';
    if (labels[1]) labels[1].textContent = currentLang === 'ar' ? 'عملة الفواتير' : 'Currency';
}

// تحديث النص السفلي لعنوان الإعدادات
const settingsHeaderDesc = document.querySelector('#settings .settings-header p');
if (settingsHeaderDesc) {
    settingsHeaderDesc.textContent = currentLang === 'ar' ? 'تكوين اتصال SMDR مع سنترال الهاتف' : 'Configure SMDR connection with PBX';
}
    // ========== تحديث رؤوس الجداول ==========
    
    // تحديث رؤوس جدول المكالمات الرئيسي
    const callsTableHeaders = [
        t.datetime, t.duration, t.extension, t.direction, t.dialedNumber,
        t.cliNumber, t.ddiNumber, t.ringDuration, t.cost, t.source, t.destination, t.type, t.status, t.callId
    ];
    const callsThElements = document.querySelectorAll('#callsTable thead th');
    callsThElements.forEach((th, index) => {
        if (callsTableHeaders[index]) {
            const icon = th.querySelector('i');
            const iconClass = icon ? icon.className : 'fas fa-clock';
            th.innerHTML = `<i class="${iconClass}"></i> ${callsTableHeaders[index]}`;
        }
    });
    
// تحديث رؤوس جدول آخر المكالمات في لوحة التحكم (14 عمود)
const recentTableHeaders = [
    t.datetime, t.duration, t.extension, t.direction, 
    t.dialedNumber, t.cliNumber, t.ddiNumber, t.ringDuration, 
    t.cost, t.source, t.destination, t.type, t.status, t.callId
];
const recentThElements = document.querySelectorAll('#recentCallsTable thead th');
recentThElements.forEach((th, index) => {
    if (recentTableHeaders[index]) {
        const icon = th.querySelector('i');
        const iconClass = icon ? icon.className : 'fas fa-clock';
        th.innerHTML = `<i class="${iconClass}"></i> ${recentTableHeaders[index]}`;
    }
});
    
    // تحديث سجل الاتصال - النص الافتراضي
    const logContainer = document.getElementById('connectionLog');
    if (logContainer && logContainer.children.length === 1) {
        const firstLog = logContainer.querySelector('.log-entry');
        if (firstLog && (firstLog.innerHTML.includes('جاهز') || firstLog.innerHTML.includes('Ready'))) {
            firstLog.innerHTML = `[${new Date().toLocaleTimeString()}] ${t.ready}`;
        }
    }
    
    // إعادة تحميل البيانات حسب التبويب النشط
    const activeTab = document.querySelector('.tab-pane.active');
    if (activeTab) {
        if (activeTab.id === 'calls') {
            if (typeof loadCalls === 'function') loadCalls();
        } else if (activeTab.id === 'dashboard') {
            if (typeof loadDashboard === 'function') loadDashboard();
            if (typeof loadRecentCalls === 'function') loadRecentCalls();
        } else if (activeTab.id === 'analyze') {
            if (typeof loadAnalysis === 'function') loadAnalysis();
        }
    }
}



// تحميل اللغة المحفوظة عند بدء التشغيل
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
        currentLang = savedLang;
        updateAllUI();
    }
});