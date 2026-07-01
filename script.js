let currentData1 = [];
let currentData2 = [];
let currentData3 = [];
let currentData4 = [];
let currentData5 = [];
let currentData6 = [];
let containersMap = new Map();

let currentVesselName = "";

let trshpPeriods1 = JSON.parse(localStorage.getItem("trshpPeriodsTab1")) || [];
let exprtPeriods1 = JSON.parse(localStorage.getItem("exprtPeriodsTab1")) || [];
let excludeLines1 = JSON.parse(localStorage.getItem("excludeLines1")) || [];

let strgePeriods2 = JSON.parse(localStorage.getItem("strgePeriodsTab2")) || [];
let exprtPeriods2 = JSON.parse(localStorage.getItem("exprtPeriodsTab2")) || [];
let excludeLines2 = JSON.parse(localStorage.getItem("excludeLines2")) || [];

let nextIdTrshp1 = trshpPeriods1.length > 0 ? Math.max(...trshpPeriods1.map(p => p.id)) + 1 : 1;
let nextIdExprt1 = exprtPeriods1.length > 0 ? Math.max(...exprtPeriods1.map(p => p.id)) + 1 : 1;
let nextIdStrge2 = strgePeriods2.length > 0 ? Math.max(...strgePeriods2.map(p => p.id)) + 1 : 1;
let nextIdExprt2 = exprtPeriods2.length > 0 ? Math.max(...exprtPeriods2.map(p => p.id)) + 1 : 1;

let exprtOnlyPeriods3 = JSON.parse(localStorage.getItem("exprtOnlyPeriodsTab3")) || [];
let excludeLines3 = JSON.parse(localStorage.getItem("excludeLines3")) || [];
let nextIdExprtOnly3 = exprtOnlyPeriods3.length > 0 ? Math.max(...exprtOnlyPeriods3.map(p => p.id)) + 1 : 1;

let emptyStrgePeriods4 = JSON.parse(localStorage.getItem("emptyStrgePeriodsTab4")) || [];
let excludeLines4 = JSON.parse(localStorage.getItem("excludeLines4")) || [];
let nextIdEmptyStrge4 = emptyStrgePeriods4.length > 0 ? Math.max(...emptyStrgePeriods4.map(p => p.id)) + 1 : 1;

// إعدادات تبويب TRSHP فقط
let trshpOnlyPeriods5 = JSON.parse(localStorage.getItem("trshpOnlyPeriodsTab5")) || [];
let excludeLines5 = JSON.parse(localStorage.getItem("excludeLines5")) || [];
let nextIdTrshpOnly5 = trshpOnlyPeriods5.length > 0 ? Math.max(...trshpOnlyPeriods5.map(p => p.id)) + 1 : 1;


let strgePeriods6 = JSON.parse(localStorage.getItem("strgePeriodsTab6")) || [];
let exprtPeriods6 = JSON.parse(localStorage.getItem("exprtPeriodsTab6")) || [];
let excludeLines6 = JSON.parse(localStorage.getItem("excludeLines6")) || [];

let nextIdStrge6 = strgePeriods6.length > 0 ? Math.max(...strgePeriods6.map(p => p.id)) + 1 : 1;
let nextIdExprt6 = exprtPeriods6.length > 0 ? Math.max(...exprtPeriods6.map(p => p.id)) + 1 : 1;

let selectedColumnsTab6 = JSON.parse(localStorage.getItem("selectedColumns_tab6")) || [];

// قائمة رئيسية موحدة للخطوط (مخزنة في LocalStorage)
// قائمة رئيسية موحدة للخطوط (تحديث تلقائي للقائمة الافتراضية)
let defaultLinesList = ["MSC", "ZIM", "VALOR", "YMl", "Msk", "CMA", "hlc", "COS", "coe", "ONE", "HMM"];
let savedList = localStorage.getItem("masterLinesList");
if (savedList) {
    masterLinesList = JSON.parse(savedList);
    // دمج الخطوط الجديدة مع القديمة (اختياري)
    defaultLinesList.forEach(line => {
        if (!masterLinesList.includes(line)) masterLinesList.push(line);
    });
    saveMasterLinesList();
} else {
    masterLinesList = defaultLinesList;
    saveMasterLinesList();
}

// ========== متغيرات التبويب 7 (IMPRT + FORWARD) ==========
let currentData7 = [];
let imprtForwardPeriods7 = JSON.parse(localStorage.getItem("imprtForwardPeriodsTab7")) || [];
let excludeLines7 = JSON.parse(localStorage.getItem("excludeLines7")) || [];
let nextIdImprtForward7 = imprtForwardPeriods7.length > 0 ? Math.max(...imprtForwardPeriods7.map(p => p.id)) + 1 : 1;
// دالة لحفظ القائمة الرئيسية
function saveMasterLinesList() {
    localStorage.setItem("masterLinesList", JSON.stringify(masterLinesList));
}

// دالة لإضافة خط جديد إلى القائمة الرئيسية
function addNewLineToMasterList(lineName) {
    if (!lineName || lineName.trim() === "") return false;
    let trimmedName = lineName.trim();
    if (!masterLinesList.includes(trimmedName)) {
        masterLinesList.push(trimmedName);
        saveMasterLinesList();
        updateAllLineSelects();
        return true;
    }
    return false;
}

// دالة لتحديث جميع القوائم المنسدلة
function updateAllLineSelects() {
    for (let i = 1; i <= 6; i++) {
        let excludeSelect = document.getElementById(`excludeLine${i}`);
        if (excludeSelect) {
            let currentValue = excludeSelect.value;
            updateSelectOptions(excludeSelect, masterLinesList);
            excludeSelect.value = currentValue;
        }
        
        let periodSelects = document.querySelectorAll(`.period-line-${i}`);
        periodSelects.forEach(select => {
            let currentValue = select.value;
            updateSelectOptions(select, masterLinesList);
            select.value = currentValue;
        });
    }
}

// دالة لتحديث خيارات الـ Select
function updateSelectOptions(selectElement, optionsList) {
    if (!selectElement) return;
    let currentValue = selectElement.value;
    selectElement.innerHTML = '';
    
    let allOption = document.createElement('option');
    allOption.value = '*';
    allOption.textContent = '* (الكل)';
    selectElement.appendChild(allOption);
    
    optionsList.forEach(line => {
        let option = document.createElement('option');
        option.value = line;
        option.textContent = line;
        selectElement.appendChild(option);
    });
    
    selectElement.value = currentValue;
}

// دالة لتهيئة جميع القوائم المنسدلة
function initializeAllSelects() {
    for (let i = 1; i <= 6; i++) {
        let excludeSelect = document.getElementById(`excludeLine${i}`);
        if (excludeSelect) {
            updateSelectOptions(excludeSelect, masterLinesList);
        }
    }
}
// ========== دوال حفظ وتحميل الملف ==========
function saveFileToLocalStorage(fileData, fileName) {
    try {
        localStorage.setItem("savedExcelFile", fileData);
        localStorage.setItem("savedExcelFileName", fileName);
        console.log("تم حفظ الملف:", fileName);
    } catch(e) {
        console.error("خطأ في حفظ الملف:", e);
    }
}


// دالة معالجة الملف عند التحميل
function processExcelFile(file) {
    let reader = new FileReader();
    reader.onload = function(evt) {
        try {
            // تنظيف البيانات القديمة
            currentData1 = [];
            currentData2 = [];
            currentData3 = [];
            currentData4 = [];
            currentData5 = [];
            currentData6 = [];
            currentData7 = [];  // ← أضف هذا

            containersMap.clear();
            
            let data = new Uint8Array(evt.target.result);
            let workbook = XLSX.read(data, { type: 'array' });
            let sheet = workbook.Sheets[workbook.SheetNames[0]];
            let rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
            
            for (let row of rows) {
                let equipId = row["Equip ID"];
                if (!equipId || equipId === "") continue;
                
                if (!containersMap.has(equipId)) {
				containersMap.set(equipId, {
					equipId: equipId,
					equipmentType: row["Equipment Type"] || "",
					lineId: row["Line ID"] || "",
					trshpList: [],
					exprtList: [],      // ← تغيير من exprt: null إلى exprtList: []
					strgeList: [],      // ← مصفوفة
					imprt: null,
					trshpReturn: null
				});
                }
                let c = containersMap.get(equipId);
                let cat = row["Category"];
                let drayStatus = row["Dray Status"] || "";
                
                if (cat === "TRSHP") {
                    c.trshpList.push(row);    // ← نضيف إلى المصفوفة
                    if (drayStatus === "RETURN") {
					c.trshpList.push(row);    // ← تغيير: من c.trshp = row إلى c.trshpList.push(row)
                    }
                }
                else if (cat === "EXPRT") {
    if (!c.exprtList) c.exprtList = [];
    c.exprtList.push(row);
}
                else if (cat === "STRGE") c.strge = row;
                else if (cat === "IMPRT") c.imprt = row;
            }
            
            processAndDisplay1();
            processAndDisplay2();
            processAndDisplay3();
            processAndDisplay4();
            processAndDisplay5();
            processAndDisplay6();
			processAndDisplay7();  // ← هنا المكان الصحيح

            
            document.getElementById("footerMsg").innerHTML = `✅ تم تحميل: ${file.name} | TRSHP+EXPRT: ${currentData1.length} | STRGE+EXPRT+IMPRT: ${currentData2.length} | EXPRT فقط: ${currentData3.length} | STRGE فارغ: ${currentData4.length} | TRSHP فقط: ${currentData5.length} | STRGE+EXPRT فقط: ${currentData6.length} | IMPRT+FORWARD: ${currentData7.length}`;
        } catch(err) {
            console.error(err);
            document.getElementById("footerMsg").innerHTML = `❌ خطأ: ${err.message}`;
        }
    };
    reader.readAsArrayBuffer(file);
}

// ========== تفضيلات الأعمدة المحفوظة ==========
let selectedColumns = {
    tab1: JSON.parse(localStorage.getItem("selectedColumns_tab1")) || [],
    tab2: JSON.parse(localStorage.getItem("selectedColumns_tab2")) || [],
    tab3: JSON.parse(localStorage.getItem("selectedColumns_tab3")) || [],
    tab4: JSON.parse(localStorage.getItem("selectedColumns_tab4")) || [],
    tab5: JSON.parse(localStorage.getItem("selectedColumns_tab5")) || [],
    tab6: JSON.parse(localStorage.getItem("selectedColumns_tab6")) || [],
    tab7: JSON.parse(localStorage.getItem("selectedColumns_tab7")) || []  // ← أضف هذا
};

// تعريف الأعمدة المتاحة للتبويب 1
const availableColumns = {
    tab1: [
        { name: "Container No.", label: "رقم الحاوية", default: true },
        { name: "Size", label: "الحجم", default: true },
        { name: "Is OOG", label: "OOG", default: false },
		{ name: "Is Refrigerated", label: "ثلاجه", default: false },
		{ name: "flex_04", label: "flex_04", default: false },  // ←←← أضف هذا
		{ name: "Is Bundled", label: "مجمّع", default: false },
        { name: "Is Hazardous", label: "خطر", default: false },
        { name: "IMDG Class", label: "IMDG", default: false },
        { name: "Type", label: "النوع", default: true },
        { name: "Line ID", label: "الخط", default: true },
        { name: "طريقة الحساب", label: "طريقة الحساب", default: false },
        { name: "Flex String 01", label: "Flex String 01", default: false },  // ←←← أضف هذا
        { name: "TRSHP Start", label: "بداية TRSHP", default: true },
        { name: "TRSHP End", label: "نهاية TRSHP", default: true },
        { name: "TRSHP Days", label: "أيام TRSHP", default: true },
        { name: "Overlap", label: "أيام مشتركة", default: false },
        { name: "TRSHP After Overlap", label: "TRSHP بعد الخصم", default: false },
        { name: "TRSHP Free", label: "سماح TRSHP", default: true },
        { name: "TRSHP Net", label: "صافي TRSHP", default: true },
        { name: "EXPRT Start", label: "بداية EXPRT", default: true },
        { name: "EXPRT End", label: "نهاية EXPRT", default: true },
        { name: "EXPRT Days", label: "أيام EXPRT", default: true },
        { name: "EXPRT Free", label: "سماح EXPRT", default: true },
        { name: "EXPRT Net", label: "صافي EXPRT", default: true },
        { name: "Total Net", label: "الإجمالي", default: true },
        { name: "Vessel Name", label: "اسم السفينة", default: false }
    ]
};

// تعريف الأعمدة المتاحة للتبويب 2
const availableColumnsTab2 = {
    tab2: [
        { name: "Container No.", label: "رقم الحاوية", default: true },
        { name: "Size", label: "الحجم", default: true },
        { name: "Is OOG", label: "OOG", default: false },
		{ name: "Is Refrigerated", label: "ثلاجه", default: false },
		{ name: "flex_04", label: "flex_04", default: false },  // ←←← أضف هذا
		{ name: "Is Bundled", label: "مجمّع", default: false },
        { name: "Is Hazardous", label: "خطر", default: false },
        { name: "IMDG Class", label: "IMDG", default: false },
        { name: "Type", label: "النوع", default: true },
        { name: "Line ID", label: "الخط", default: true },
        { name: "طريقة الحساب", label: "طريقة الحساب", default: false },
        { name: "Flex String 01", label: "Flex String 01", default: false },
        { name: "نوع IMPRT", label: "نوع IMPRT", default: false },
        { name: "IMPRT Start", label: "بداية IMPRT", default: true },
        { name: "IMPRT End", label: "نهاية IMPRT", default: true },
        { name: "IMPRT Days", label: "أيام IMPRT", default: true },
        { name: "STRGE Start", label: "بداية STRGE", default: true },
        { name: "STRGE End", label: "نهاية STRGE", default: true },
        { name: "STRGE Days", label: "أيام STRGE", default: true },
        { name: "Overlap Days", label: "أيام مشتركة", default: false },
        { name: "STRGE After Overlap", label: "STRGE بعد الخصم", default: false },
        { name: "STRGE Free", label: "سماح STRGE", default: true },
        { name: "STRGE Net", label: "صافي STRGE", default: true },
        { name: "EXPRT Start", label: "بداية EXPRT", default: true },
        { name: "EXPRT End", label: "نهاية EXPRT", default: true },
        { name: "EXPRT Days", label: "أيام EXPRT", default: true },
        { name: "EXPRT Free", label: "سماح EXPRT", default: true },
        { name: "EXPRT Net", label: "صافي EXPRT", default: true },
        { name: "Total Net", label: "الإجمالي", default: true },
        { name: "Vessel Name", label: "اسم السفينة", default: false }
    ]
};

// تعريف الأعمدة المتاحة للتبويب 3 (EXPRT فقط)
const availableColumnsTab3 = {
    tab3: [
        { name: "Container No.", label: "رقم الحاوية", default: true },
        { name: "Size", label: "الحجم", default: true },
        { name: "Is OOG", label: "OOG", default: false },
		{ name: "Is Refrigerated", label: "ثلاجه", default: false },
		{ name: "flex_04", label: "flex_04", default: false },  // ←←← أضف هذا
		{ name: "Is Bundled", label: "مجمّع", default: false },
        { name: "Is Hazardous", label: "خطر", default: false },
        { name: "IMDG Class", label: "IMDG", default: false },
        { name: "Type", label: "النوع", default: true },
        { name: "Line ID", label: "الخط", default: true },
        { name: "طريقة الحساب", label: "طريقة الحساب", default: false },
        { name: "Flex String 01", label: "Flex String 01", default: false },
        { name: "EXPRT Start", label: "بداية EXPRT", default: true },
        { name: "EXPRT End", label: "نهاية EXPRT", default: true },
        { name: "EXPRT Days", label: "أيام EXPRT", default: true },
        { name: "EXPRT Free", label: "سماح EXPRT", default: true },
        { name: "EXPRT Net", label: "صافي EXPRT", default: true },
        { name: "Total Net", label: "الإجمالي", default: true },
        { name: "Vessel Name", label: "اسم السفينة", default: false }
    ]
};

// تعريف الأعمدة المتاحة للتبويب 4 (STRGE فارغ)
const availableColumnsTab4 = {
    tab4: [
        { name: "Container No.", label: "رقم الحاوية", default: true },
        { name: "Size", label: "الحجم", default: true },
        { name: "Is OOG", label: "OOG", default: false },
		{ name: "Is Refrigerated", label: "ثلاجه", default: false },
		{ name: "flex_04", label: "flex_04", default: false },  // ←←← أضف هذا
		{ name: "Is Bundled", label: "مجمّع", default: false },
        { name: "Is Hazardous", label: "خطر", default: false },
        { name: "IMDG Class", label: "IMDG", default: false },
        { name: "Type", label: "النوع", default: true },
        { name: "Line ID", label: "الخط", default: true },
        { name: "طريقة الحساب", label: "طريقة الحساب", default: false },
        { name: "Flex String 01", label: "Flex String 01", default: false },
        { name: "IMPRT Start", label: "بداية IMPRT", default: true },
        { name: "IMPRT End", label: "نهاية IMPRT", default: true },
        { name: "IMPRT Days", label: "أيام IMPRT", default: true },
        { name: "STRGE Start", label: "بداية STRGE فارغ", default: true },
        { name: "STRGE End", label: "نهاية STRGE فارغ", default: true },
        { name: "STRGE Days", label: "أيام STRGE فارغ", default: true },
        { name: "STRGE Free", label: "سماح STRGE", default: true },
        { name: "STRGE Net", label: "صافي STRGE", default: true },
        { name: "Total Net", label: "الإجمالي", default: true },
        { name: "Vessel Name", label: "اسم السفينة", default: false }
    ]
};

const availableColumnsTab5 = {
    tab5: [
        { name: "Container No.", label: "رقم الحاوية", default: true },
        { name: "Size", label: "الحجم", default: true },
		{ name: "Freight Kind", label: "نوع الشحنة", default: true },  // ← أضف هذا
        { name: "Is OOG", label: "OOG", default: false },
        { name: "Is Refrigerated", label: "مبرد", default: false },
        { name: "O/B Loc Type", label: "نوع الموقع", default: true },  // ← تغيير من I/B إلى O/B
        { name: "Is Bundled", label: "مجمّع", default: false },
        { name: "Is Hazardous", label: "خطير", default: false },
        { name: "IMDG Class", label: "IMDG", default: false },
        { name: "Type", label: "النوع", default: true },
        { name: "Line ID", label: "الخط", default: true },
        { name: "طريقة الحساب", label: "طريقة الحساب", default: false },
        { name: "Flex String 01", label: "Flex String 01", default: false },
        { name: "flex_04", label: "flex_04", default: false },
        { name: "TRSHP Start", label: "بداية TRSHP", default: true },
        { name: "TRSHP End", label: "نهاية TRSHP", default: true },
        { name: "TRSHP Days", label: "أيام TRSHP", default: true },
        { name: "TRSHP Free", label: "سماح TRSHP", default: true },
        { name: "TRSHP Net", label: "صافي TRSHP", default: true },
        { name: "Total Net", label: "الإجمالي", default: true },
        { name: "Vessel Name", label: "اسم السفينة", default: false },
        { name: "Period Order", label: "رقم الفترة", default: false }
    ]
};

const availableColumnsTab6 = {
    tab6: [
        { name: "Container No.", label: "رقم الحاوية", default: true },
        { name: "Size", label: "الحجم", default: true },
        { name: "Is OOG", label: "OOG", default: false },
        { name: "Is Refrigerated", label: "مبرد", default: false },
        { name: "Is Bundled", label: "مجمّع", default: false },
        { name: "Is Hazardous", label: "خطير", default: false },
        { name: "IMDG Class", label: "IMDG", default: false },
        { name: "Type", label: "النوع", default: true },
        { name: "Line ID", label: "الخط", default: true },
        { name: "طريقة الحساب", label: "طريقة الحساب", default: false },
        { name: "Flex String 01", label: "Flex String 01", default: false },
        { name: "STRGE Start", label: "بداية STRGE", default: true },
        { name: "STRGE End", label: "نهاية STRGE", default: true },
        { name: "STRGE Days", label: "أيام STRGE", default: true },
        { name: "Overlap Days", label: "أيام مشتركة", default: false },
        { name: "STRGE After Overlap", label: "STRGE بعد الخصم", default: false },
        { name: "STRGE Free", label: "سماح STRGE", default: true },
        { name: "STRGE Net", label: "صافي STRGE", default: true },
        { name: "EXPRT Start", label: "بداية EXPRT", default: true },
        { name: "EXPRT End", label: "نهاية EXPRT", default: true },
        { name: "EXPRT Days", label: "أيام EXPRT", default: true },
        { name: "EXPRT Free", label: "سماح EXPRT", default: true },
        { name: "EXPRT Net", label: "صافي EXPRT", default: true },
        { name: "Total Net", label: "الإجمالي", default: true },
        { name: "Vessel Name", label: "اسم السفينة", default: false }
    ]
};

// ========== دوال اختيار الأعمدة لتبويب 7 ==========

const availableColumnsTab7 = {
    tab7: [
        { name: "رقم الحاوية", label: "رقم الحاوية", default: true },
        { name: "الحجم", label: "الحجم", default: true },
        { name: "OOG", label: "OOG", default: false },
        { name: "مبرد", label: "مبرد", default: false },
        { name: "خطير", label: "خطير", default: false },
        { name: "IMDG", label: "IMDG", default: false },
        { name: "النوع", label: "النوع", default: true },
        { name: "الخط", label: "الخط", default: true },
        { name: "نوع", label: "نوع الحركة", default: true },
        { name: "Start Time", label: "Start Time (الأصلي)", default: true },
        { name: "PaidThruDate", label: "PaidThruDate", default: true },        // ← جديد
        { name: "Start (Paid+1)", label: "Start (Paid+1)", default: true },    // ← جديد
        { name: "End", label: "End", default: true },
        { name: "Days", label: "عدد الأيام", default: true },
        { name: "Free", label: "أيام السماح", default: true },
        { name: "Net", label: "الصافي", default: true },
        { name: "Vessel Name", label: "اسم السفينة", default: true }
    ]
};

// دالة فتح نافذة اختيار الأعمدة لتبويب 7
function openColumnModalTab7() {
    let modal = document.getElementById('columnModal');
    let body = document.getElementById('columnModalBody');
    
    // تهيئة selectedColumns.tab7 إذا لم تكن موجودة
    if (!selectedColumns.tab7) {
        selectedColumns.tab7 = availableColumnsTab7.tab7.filter(c => c.default).map(c => c.name);
    }
    
    let html = `<div class="select-all">
        <label style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="selectAllColumns"> <strong>تحديد الكل</strong>
        </label>
    </div>`;
    
    let cols = availableColumnsTab7.tab7;
    if (cols) {
        cols.forEach(col => {
            let isChecked = selectedColumns.tab7.includes(col.name) || 
                           (selectedColumns.tab7.length === 0 && col.default);
            html += `
                <div class="column-option">
                    <input type="checkbox" class="col-checkbox" value="${col.name}" id="col_${col.name.replace(/ /g, '_')}" ${isChecked ? 'checked' : ''}>
                    <label for="col_${col.name.replace(/ /g, '_')}">${col.label}</label>
                </div>
            `;
        });
    }
    
    body.innerHTML = html;
    modal.classList.add('active');
    
    document.getElementById('selectAllColumns').onchange = (e) => {
        document.querySelectorAll('.col-checkbox').forEach(cb => cb.checked = e.target.checked);
    };
    
    document.getElementById('applyColumnSelection').onclick = () => {
        let selected = [];
        document.querySelectorAll('.col-checkbox:checked').forEach(cb => selected.push(cb.value));
        selectedColumns.tab7 = selected;
        localStorage.setItem(`selectedColumns_tab7`, JSON.stringify(selected));
        closeColumnModal();
        
        // إعادة عرض الجدول مع الأعمدة المختارة
        if (currentData7 && currentData7.length > 0) {
            renderTable7WithSelectedColumns('bodyTab7', currentData7, 'searchTab7', 'typeTab7', 'statsTab7');
        }
    };
}

// دالة عرض جدول تبويب 7 مع الأعمدة المختارة
function renderTable7WithSelectedColumns(tbodyId, data, searchId, typeId, statsId) {
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    
    let filtered = data.filter(item => {
        let matchSearch = item["رقم الحاوية"]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["النوع"] === type;
        return matchSearch && matchType;
    });
    
    let selected = selectedColumns.tab7;
    if (!selected || selected.length === 0) {
        selected = availableColumnsTab7.tab7.filter(c => c.default).map(c => c.name);
    }
    
    // تحديث رأس الجدول
    let thead = document.querySelector('#tableTab7 thead tr');
    if (thead) {
        thead.innerHTML = '';
        selected.forEach(colName => {
            let col = availableColumnsTab7.tab7.find(c => c.name === colName);
            let th = document.createElement('th');
            th.textContent = col ? col.label : colName;
            thead.appendChild(th);
        });
    }
    
    let tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        let colspan = selected.length;
        tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center; padding:40px;">⚠️ لا توجد بيانات</td></tr>`;
        return;
    }
    
    for (let item of filtered) {
        let row = tbody.insertRow();
        selected.forEach(colName => {
            let cell = row.insertCell();
            let value = item[colName];
            
            if (["OOG", "مبرد", "خطير"].includes(colName)) {
                cell.textContent = value || "❌";
            } else if (colName === "نوع") {
                if (value === "IMPRT + FORWARD") {
                    cell.innerHTML = '<span style="background:#ff6b6b; color:white; padding:2px 10px; border-radius:12px;">IMPRT + FORWARD</span>';
                } else if (value === "TRSHP + FORWARD") {
                    cell.innerHTML = '<span style="background:#ffa07a; color:#333; padding:2px 10px; border-radius:12px;">TRSHP + FORWARD</span>';
                } else {
                    cell.innerHTML = '<span style="background:#667eea; color:white; padding:2px 10px; border-radius:12px;">IMPRT (VESSEL)</span>';
                }
            } else if (colName === "رقم الحاوية") {
                cell.textContent = value || "—";
                cell.style.fontWeight = "bold";
            } else if (colName === "النوع") {
                cell.innerHTML = `<strong>${value || "—"}</strong>`;
            } else if (["Days", "Free", "Net"].includes(colName)) {
                cell.textContent = value || "—";
                if (colName === "Days") cell.style.background = "#e3f2fd";
                if (colName === "Free") cell.style.background = "#fff3cd";
                if (colName === "Net") {
                    cell.style.background = "#d4edda";
                    cell.style.fontWeight = "bold";
                }
            } else {
                cell.textContent = value || "—";
            }
        });
    }
    
    let statsDiv = document.getElementById(statsId);
    if (statsDiv && data.length > 0) {
        statsDiv.innerHTML = renderAdvancedStatsTab7(data);
        statsDiv.style.display = "flex";
    }
}
// ========== دوال حفظ وتحميل الملف ==========
function saveFileToLocalStorage(fileData, fileName) {
    try {
        localStorage.setItem("savedExcelFile", fileData);
        localStorage.setItem("savedExcelFileName", fileName);
        console.log("تم حفظ الملف:", fileName);
    } catch(e) {
        console.error("خطأ في حفظ الملف:", e);
    }
}

function loadLastFileFromStorage() {
    let savedFileData = localStorage.getItem("savedExcelFile");
    let savedFileName = localStorage.getItem("savedExcelFileName");
    
    if (savedFileData && savedFileName) {
        // تنظيف البيانات القديمة
        currentData1 = [];
        currentData2 = [];
        currentData3 = [];
        currentData4 = [];
        currentData5 = [];
        currentData6 = [];
        currentData7 = [];  // ← أضف هذا

        containersMap.clear();
        
        updateFileNameDisplay(savedFileName);
        
        let binaryString = atob(savedFileData);
        let bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        let workbook = XLSX.read(bytes, { type: 'array' });
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let rows = XLSX.utils.sheet_to_json(sheet, { defval: "", range: 4 });
        
        for (let row of rows) {
            let equipId = row["Equip ID"];
            if (!equipId || equipId === "") continue;
            
            if (!containersMap.has(equipId)) {
				containersMap.set(equipId, {
					equipId: equipId,
					equipmentType: row["Equipment Type"] || "",
					lineId: row["Line ID"] || "",
					trshpList: [],
					exprtList: [],      // ← صح: مصفوفة
					strge: null,
					imprt: null,
					trshpReturn: null
				});
            }
            let c = containersMap.get(equipId);
            let cat = row["Category"];
            let drayStatus = row["Dray Status"] || "";
            
            if (cat === "TRSHP") {
                c.trshpList.push(row);    // ← نضيف إلى المصفوفة
                if (drayStatus === "RETURN") {
                    c.trshpReturn = row;
                }
            }
            else if (cat === "EXPRT") {
    if (!c.exprtList) c.exprtList = [];
    c.exprtList.push(row);
}
            else if (cat === "STRGE") c.strge = row;
            else if (cat === "IMPRT") c.imprt = row;
        }
        
        processAndDisplay1();
        processAndDisplay2();
        processAndDisplay3();
        processAndDisplay4();
        processAndDisplay5();
        processAndDisplay6();
		processAndDisplay7();  // ← هنا المكان الصحيح

        updateHeaderInfo('1');
        
        setTimeout(function() {
            if (selectedColumns.tab1 && selectedColumns.tab1.length > 0) {
                renderTable1WithSelectedColumns("bodyTab1", currentData1, "searchTab1", "typeTab1", "statsTab1");
            }
            if (selectedColumns.tab2 && selectedColumns.tab2.length > 0 && typeof renderTable2WithSelectedColumns === 'function') {
                renderTable2WithSelectedColumns("bodyTab2", currentData2, "searchTab2", "typeTab2", "statsTab2");
            }
            if (selectedColumns.tab3 && selectedColumns.tab3.length > 0 && typeof renderTable3WithSelectedColumns === 'function') {
                renderTable3WithSelectedColumns("bodyTab3", currentData3, "searchTab3", "typeTab3", "statsTab3");
            }
            if (selectedColumns.tab4 && selectedColumns.tab4.length > 0 && typeof renderTable4WithSelectedColumns === 'function') {
                renderTable4WithSelectedColumns("bodyTab4", currentData4, "searchTab4", "typeTab4", "statsTab4");
            }
            if (selectedColumns.tab5 && selectedColumns.tab5.length > 0 && typeof renderTable5WithSelectedColumns === 'function') {
                renderTable5WithSelectedColumns("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
            }
            if (selectedColumns.tab6 && selectedColumns.tab6.length > 0 && typeof renderTable6WithSelectedColumns === 'function') {
                renderTable6WithSelectedColumns("bodyTab6", currentData6, "searchTab6", "typeTab6", "statsTab6");
            }
        }, 200);
        
        document.getElementById("footerMsg").innerHTML = `✅ تم تحميل الملف المحفوظ: ${savedFileName} | TRSHP+EXPRT: ${currentData1.length} | STRGE+EXPRT+IMPRT: ${currentData2.length} | EXPRT فقط: ${currentData3.length} | STRGE فارغ: ${currentData4.length} | TRSHP فقط: ${currentData5.length} | STRGE+EXPRT فقط: ${currentData6.length}`;
    } else {
        console.log("لا يوجد ملف محفوظ سابقاً");
    }
}

// ========== دوال تحويل التواريخ والحسابات ==========
function convertDate(dateStr) {
    if (!dateStr || dateStr === "") return "";
    let str = dateStr.toString().trim();
    let yearShort = str.substring(0, 2);
    let month = str.substring(3, 6);
    let day = str.substring(7, 9);
    let year = 2000 + parseInt(yearShort);
    let months = { "Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12" };
    let monthNum = months[month] || "01";
    return `${year}/${monthNum}/${day}`;
}

function diffDays(start, end) {
    if (!start || !end) return 0;
    let s = new Date(start), e = new Date(end);
    if (isNaN(s) || isNaN(e)) return 0;
    return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
}

function sortPeriods(periods) {
    return periods.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
}

function updateEndDates(periods) {
    let groups = {};
    for (let p of periods) {
        let key = `${p.lineId}|${p.drayStatus || ""}|${p.flexString01 || ""}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(p);
    }
    
    let result = [];
    for (let key in groups) {
        let sorted = sortPeriods([...groups[key]]);
        for (let i = 0; i < sorted.length; i++) {
            if (i < sorted.length - 1) {
                let nextStart = new Date(sorted[i + 1].startDate);
                let prevEnd = new Date(nextStart);
                prevEnd.setDate(prevEnd.getDate() - 1);
                sorted[i].endDate = prevEnd.toISOString().split('T')[0];
            } else {
                sorted[i].endDate = "";
            }
            result.push(sorted[i]);
        }
    }
    return result;
}

function getFreeDays(periods, lineId, periodDate, flexString01, drayStatus) {
    let matchingPeriods = periods.filter(p => {
        let lineMatch = (p.lineId === lineId || p.lineId === "*");
        
        let flexMatch = true;
        if (p.flexString01 === "TRUE") {
            flexMatch = (flexString01 === "TRUE");
        } else if (p.flexString01 === "FALSE") {
            flexMatch = (flexString01 !== "TRUE");
        }
        
        let drayMatch = true;
        if (p.drayStatus === "RETURN") {
            drayMatch = (drayStatus === "RETURN");
        } else if (p.drayStatus === "FORWARD") {
            drayMatch = (drayStatus === "FORWARD");
        } else if (p.drayStatus === "EMPTY") {
            drayMatch = (!drayStatus || drayStatus === "");
        }
        
        return lineMatch && flexMatch && drayMatch;
    });
    
    if (matchingPeriods.length === 0) return 0;
    
    let date = new Date(periodDate);
    let sorted = sortPeriods([...matchingPeriods]);
    
    for (let period of sorted) {
        let start = new Date(period.startDate);
        let end = period.endDate ? new Date(period.endDate) : null;
        if (end) {
            if (date >= start && date <= end) return period.freeDays;
        } else {
            if (date >= start) return period.freeDays;
        }
    }
    return 0;
}

function getEmptyStrgeFreeDays(periods, lineId, periodDate) {
    let matchingPeriods = periods.filter(p => {
        let lineMatch = (p.lineId === lineId || p.lineId === "*");
        return lineMatch;
    });
    
    if (matchingPeriods.length === 0) return 0;
    
    let date = new Date(periodDate);
    let sorted = sortPeriods([...matchingPeriods]);
    
    for (let period of sorted) {
        let start = new Date(period.startDate);
        let end = period.endDate ? new Date(period.endDate) : null;
        if (end) {
            if (date >= start && date <= end) return period.freeDays;
        } else {
            if (date >= start) return period.freeDays;
        }
    }
    return 0;
}

function isExcluded(lineId, excludeList) {
    return excludeList.includes(lineId);
}

function calculateDaysWithOverlapRemoved(start1, end1, start2, end2) {
    if (!start1 || !end1 || !start2 || !end2) return { net1: 0, net2: 0, overlap: 0 };
    let days1 = diffDays(start1, end1);
    let days2 = diffDays(start2, end2);
    let overlapStart = new Date(Math.max(new Date(start1), new Date(start2)));
    let overlapEnd = new Date(Math.min(new Date(end1), new Date(end2)));
    let overlapDays = 0;
    if (overlapStart <= overlapEnd) {
        overlapDays = diffDays(overlapStart.toISOString().split('T')[0], overlapEnd.toISOString().split('T')[0]);
    }
    let netDays1 = days1 - overlapDays;
    if (netDays1 < 0) netDays1 = 0;
    let netDays2 = days2;
    return { net1: netDays1, net2: netDays2, overlap: overlapDays };
}

function calculateWithOverlap(days1, free1, days2, free2) {
    let maxFree = Math.max(free1, free2);
    let deduction2 = Math.min(days2, free2);
    let net2 = days2 - deduction2;
    if (net2 < 0) net2 = 0;
    let remainingFree = maxFree - deduction2;
    if (remainingFree < 0) remainingFree = 0;
    let deduction1 = Math.min(days1, remainingFree);
    let net1 = days1 - deduction1;
    if (net1 < 0) net1 = 0;
    return { net1, net2, total: net1 + net2 };
}

function calculateIndependent(days1, free1, days2, free2) {
    let net1 = days1 - free1;
    if (net1 < 0) net1 = 0;
    let net2 = days2 - free2;
    if (net2 < 0) net2 = 0;
    return { net1, net2, total: net1 + net2 };
}

function renderAdvancedStats(data) {
    // ================================================
    // استبعاد الحالات: O/B Loc Type = TRUCK
    // ================================================
    let validData = data.filter(item => {
        // استبعاد إذا كان O/B Loc Type = TRUCK
        if (item["O/B Loc Type"] === "TRUCK") return false;
        
        let exprNet = item["EXPRT Net"];
        return typeof exprNet === "number" && !isNaN(exprNet);
    });
    
    // إذا لم توجد بيانات صالحة، اعرض رسالة
    if (validData.length === 0) {
        return `<div style="padding:20px; text-align:center;">لا توجد بيانات EXPRT صالحة</div>`;
    }
    
    let totalTrshpNet = validData.reduce((s, i) => s + (i["TRSHP Net"] || 0), 0);
    let totalExprtNet = validData.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    // ========== Flex String 01 ==========
    let flexTrueContainers = validData.filter(i => i["Flex String 01"] === "TRUE");
    let flexTrueExprtNet = flexTrueContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let flexTrueCount = flexTrueContainers.length;
    
    let flexFalseContainers = validData.filter(i => i["Flex String 01"] === "FALSE");
    let flexFalseExprtNet = flexFalseContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let flexFalseCount = flexFalseContainers.length;
    
    // ========== Dray Status ==========
    let exprtNoDray = validData.filter(i => (i["Dray Status"] || "") === "");
    let exprtNoDrayNet = exprtNoDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let exprtNoDrayCount = exprtNoDray.length;
    
    let exprtWithDray = validData.filter(i => (i["Dray Status"] || "") !== "");
    let exprtWithDrayNet = exprtWithDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let exprtWithDrayCount = exprtWithDray.length;
    
    // ========== Is OOG ==========
    let oogContainers = validData.filter(i => i["Is OOG"] === "true");
    let oogExprtNet = oogContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let oogCount = oogContainers.length;
    
    // ========== Is Hazardous ==========
    let hazardousContainers = validData.filter(i => i["Is Hazardous"] === "true");
    let hazardousExprtNet = hazardousContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let hazardousCount = hazardousContainers.length;
    
    // ========== إجمالي EXPRT بعد خصم Flex TRUE ==========
    let totalExprtNetAfterDeduction = totalExprtNet - flexTrueExprtNet;
    
    // ========== باقي الإحصائيات ==========
    let refrigeratedContainers = validData.filter(i => i["Is Refrigerated"] === "true");
    let rfExprtDays = refrigeratedContainers.reduce((s, i) => s + (i["EXPRT Days"] || 0), 0);
    let totalCount = validData.length;
    
    let size20Containers = validData.filter(i => i["Size"]?.toString().startsWith("2"));
    let size40Containers = validData.filter(i => i["Size"]?.toString().startsWith("4"));
    
    let size20Count = size20Containers.length;
    let size40Count = size40Containers.length;
    let size20TrshpNet = size20Containers.reduce((s, i) => s + (i["TRSHP Net"] || 0), 0);
    let size40TrshpNet = size40Containers.reduce((s, i) => s + (i["TRSHP Net"] || 0), 0);
    
    let refrigerated40 = refrigeratedContainers.filter(i => i["Size"]?.toString().startsWith("4"));
    let refrigerated40Count = refrigerated40.length;
    let refrigerated40Days = refrigerated40.reduce((s, i) => s + (i["EXPRT Days"] || 0), 0);
    
    // تفاصيل Dray Status حسب المقاس
    let size20NoDray = exprtNoDray.filter(i => i["Size"]?.toString().startsWith("2"));
    let size40NoDray = exprtNoDray.filter(i => i["Size"]?.toString().startsWith("4"));
    let size20NoDrayNet = size20NoDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let size40NoDrayNet = size40NoDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    let size20WithDray = exprtWithDray.filter(i => i["Size"]?.toString().startsWith("2"));
    let size40WithDray = exprtWithDray.filter(i => i["Size"]?.toString().startsWith("4"));
    let size20WithDrayNet = size20WithDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let size40WithDrayNet = size40WithDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    // تفاصيل OOG وحسب المقاس
    let oog20 = oogContainers.filter(i => i["Size"]?.toString().startsWith("2"));
    let oog40 = oogContainers.filter(i => i["Size"]?.toString().startsWith("4"));
    let oog20Net = oog20.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let oog40Net = oog40.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    // تفاصيل Hazardous حسب المقاس
    let hazardous20 = hazardousContainers.filter(i => i["Size"]?.toString().startsWith("2"));
    let hazardous40 = hazardousContainers.filter(i => i["Size"]?.toString().startsWith("4"));
    let hazardous20Net = hazardous20.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let hazardous40Net = hazardous40.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    // تفاصيل Flex حسب المقاس
    let flexTrue20 = flexTrueContainers.filter(i => i["Size"]?.toString().startsWith("2"));
    let flexTrue40 = flexTrueContainers.filter(i => i["Size"]?.toString().startsWith("4"));
    let flexTrue20Net = flexTrue20.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let flexTrue40Net = flexTrue40.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    return `
        <div style="display: flex; gap: 10px; margin: 0 25px 15px 25px; flex-wrap: wrap;">
            
            <!-- بطاقة 1: TRSHP -->
            <div style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 8px; padding: 8px 12px; text-align: center; color: white;">
                <div style="font-size: 11px;">🚛 إجمالي TRSHP</div>
                <div style="font-size: 22px; font-weight: bold;">${totalTrshpNet}</div>
                <div style="font-size: 9px;">صافي أيام الترانزيت</div>
                <div style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 9px;">
                    <div>📦 20 قدم: ${size20TrshpNet} يوم</div>
                    <div>📦 40 قدم: ${size40TrshpNet} يوم</div>
                </div>
            </div>
            
            <!-- بطاقة 2: EXPRT (بعد خصم Flex TRUE) مع إضافة OOG و Hazardous -->
            <div style="flex: 1; background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 8px; padding: 8px 12px; text-align: center; color: white;">
                <div style="font-size: 11px;">📤 إجمالي EXPRT (بعد الخصم)</div>
                <div style="font-size: 22px; font-weight: bold;">${totalExprtNetAfterDeduction}</div>
                <div style="font-size: 9px;">صافي أيام التصدير</div>
                <div style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 9px;">
                    <div style="font-weight: bold;">📋 بدون Dray Status:</div>
                    <div>📦 20 قدم: ${size20NoDrayNet} يوم</div>
                    <div>📦 40 قدم: ${size40NoDrayNet} يوم</div>
                    <div style="font-weight: bold; margin-top: 5px;">📐 OOG:</div>
                    <div>📦 20 قدم: ${oog20Net} يوم (${oog20.length} حاوية)</div>
                    <div>📦 40 قدم: ${oog40Net} يوم (${oog40.length} حاوية)</div>
                    <div style="font-weight: bold; margin-top: 5px;">⚠️ Hazardous:</div>
                    <div>📦 20 قدم: ${hazardous20Net} يوم (${hazardous20.length} حاوية)</div>
                    <div>📦 40 قدم: ${hazardous40Net} يوم (${hazardous40.length} حاوية)</div>
                </div>
            </div>
            
            <!-- بطاقة 3: Dray Status & Flex String (منفصلة) -->
            <div style="flex: 1; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
                <div style="background: #ff6b6b; color: white; padding: 6px; text-align: center; font-weight: bold; font-size: 10px;">
                    📊 تفاصيل Dray Status & Flex String
                </div>
                <div style="padding: 8px;">
                    <div style="margin-bottom: 8px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 4px; font-size: 10px;">🚚 Dray Status:</div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <div style="flex: 1; background: #fef3c7; border-radius: 6px; padding: 5px; text-align: center;">
                                <div style="font-size: 10px; color: #666;">🚚 مع Dray</div>
                                <div style="font-size: 16px; font-weight: bold; color: #ffc107;">${exprtWithDrayNet}</div>
                                <div style="font-size: 9px;">(${exprtWithDrayCount} حاوية)</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div style="font-weight: bold; color: #333; margin-bottom: 4px; font-size: 10px;">⭐ Flex String 01:</div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <div style="flex: 1; background: #ffebee; border-radius: 6px; padding: 5px; text-align: center;">
                                <div style="font-size: 10px; color: #666;">⭐ TRUE (خاص)</div>
                                <div style="font-size: 16px; font-weight: bold; color: #ff6b6b;">${flexTrueExprtNet}</div>
                                <div style="font-size: 9px;">${flexTrueCount} حاوية</div>
                                <div style="font-size: 8px; color: #888;">20:${flexTrue20Net} | 40:${flexTrue40Net}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- بطاقة 4: EXPRT ثلاجه -->
            <div style="flex: 1; background: linear-gradient(135deg, #4facfe, #00f2fe); border-radius: 8px; padding: 8px 12px; text-align: center; color: white;">
                <div style="font-size: 11px;">❄️ أيام EXPRT (ثلاجه)</div>
                <div style="font-size: 22px; font-weight: bold;">${rfExprtDays}</div>
                <div style="font-size: 9px;">للحاويات ثلاجه فقط</div>
                <div style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 9px;">
                    <div>📦 إجمالي العدد: ${refrigeratedContainers.length} حاوية</div>
                    <div>📦 40 قدم: ${refrigerated40Count} حاوية (${refrigerated40Days} يوم)</div>
                </div>
            </div>
            
            <!-- بطاقة 5: إجمالي الحاويات -->
            <div style="flex: 1; background: linear-gradient(135deg, #43e97b, #38f9d7); border-radius: 8px; padding: 8px 12px; text-align: center; color: white;">
                <div style="font-size: 11px;">📦 إجمالي الحاويات</div>
                <div style="font-size: 22px; font-weight: bold;">${totalCount}</div>
                <div style="font-size: 9px;">حاوية</div>
                <div style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 9px;">
                    <div>📦 20 قدم: ${size20Count} حاوية</div>
                    <div>📦 40 قدم: ${size40Count} حاوية</div>
                </div>
            </div>
        </div>
    `;
}

// ========== دالة عرض الجدول الرئيسية ==========
function renderTable1WithStats(tbodyId, data, searchId, typeId, statsId) {
    // التحقق من وجود البيانات
    if (!data || data.length === 0) {
        console.log("لا توجد بيانات للتبويب 1");
        return;
    }
    
    // التحقق من وجود العناصر
    let tbody = document.getElementById(tbodyId);
    let statsDiv = document.getElementById(statsId);
    let searchInput = document.getElementById(searchId);
    let typeSelect = document.getElementById(typeId);
    
    if (!tbody) {
        console.error("tbody غير موجود:", tbodyId);
        return;
    }
    
    // فلترة البيانات
    let search = searchInput ? searchInput.value.toLowerCase() : "";
    let type = typeSelect ? typeSelect.value : "";
    
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."] ? item["Container No."].toLowerCase().includes(search) : false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    // عرض الإحصائيات
    if (statsDiv) {
        statsDiv.innerHTML = renderAdvancedStats(data);
        statsDiv.style.display = "block";
    }
    
    // تفريغ الجدول
    tbody.innerHTML = "";
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="26" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات تطابق البحث<\/td><\/tr>`;
        return;
    }
    
    // عرض البيانات
for (let i = 0; i < filtered.length; i++) {
    let item = filtered[i];
    let row = tbody.insertRow();
    
    // ========== إضافة: الرقم التسلسلي ==========
    let cellSerial = row.insertCell();
    cellSerial.textContent = i + 1;
    cellSerial.style.fontWeight = "bold";
    cellSerial.style.backgroundColor = "#f8f9fa";
    cellSerial.style.width = "40px";
    cellSerial.style.textAlign = "center";
    // ========== نهاية الإضافة ==========
    
    // 1. Container No.
    let cell1 = row.insertCell();
    cell1.textContent = item["Container No."] || "—";
        cell1.style.fontWeight = "bold";
        
        // 2. Size
        let cell2 = row.insertCell();
        cell2.textContent = item["Size"] || "—";
        
        // 3. Is OOG
        let cell3 = row.insertCell();
        cell3.textContent = item["Is OOG"] === "true" ? "✅" : "❌";
        
        // 4. Is Refrigerated
        let cell4 = row.insertCell();
        cell4.textContent = item["Is Refrigerated"] === "true" ? "✅" : "❌";
        
		// بعد خلية Is Refrigerated
let cellFlex04 = row.insertCell();
cellFlex04.textContent = item["flex_04"] || "—";
		
        // 5. Is Bundled
        let cell5 = row.insertCell();
        cell5.textContent = item["Is Bundled"] === "true" ? "✅" : "❌";
        
        // 6. Is Hazardous
        let cell6 = row.insertCell();
        cell6.textContent = item["Is Hazardous"] === "true" ? "✅" : "❌";
        
        // 7. IMDG Class
        let cell7 = row.insertCell();
        cell7.textContent = item["IMDG Class"] || "—";
        
        // 8. Type
        let cell8 = row.insertCell();
        cell8.innerHTML = `<strong>${item["Type"] || "—"}</strong>`;
        
        // 9. Line ID
        let cell9 = row.insertCell();
        cell9.textContent = item["Line ID"] || "—";
        
        // 10. طريقة الحساب
        let cell10 = row.insertCell();
        let methodClass = item["طريقة الحساب"] === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
        cell10.innerHTML = `<span class="${methodClass}">${item["طريقة الحساب"] || "—"}</span>`;
        
        // 11. Flex String 01 (جديد)
        let cell11 = row.insertCell();
        let flexValue = item["Flex String 01"] || "—";
        if (flexValue === "TRUE") {
            cell11.innerHTML = `<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>`;
        } else if (flexValue === "FALSE") {
            cell11.innerHTML = `<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>`;
        } else {
            cell11.textContent = "—";
        }
        
// 12. TRSHP Start (انتقلت من 13 إلى 12)
let cell12 = row.insertCell();
cell12.textContent = item["TRSHP Start"] || "—";

// 13. TRSHP End
let cell13 = row.insertCell();
cell13.textContent = item["TRSHP End"] || "—";

// 14. TRSHP Days
let cell14 = row.insertCell();
cell14.textContent = item["TRSHP Days"] || "—";
cell14.style.background = "#e3f2fd";

// 15. Overlap
let cell15 = row.insertCell();
cell15.textContent = item["Overlap"] || "—";
cell15.style.background = "#f8d7da";

// 16. TRSHP After Overlap
let cell16 = row.insertCell();
cell16.textContent = item["TRSHP After Overlap"] || "—";
cell16.style.background = "#fff3cd";

// 17. TRSHP Free
let cell17 = row.insertCell();
cell17.textContent = item["TRSHP Free"] || "—";
cell17.style.background = "#fff3cd";

// 18. TRSHP Net
let cell18 = row.insertCell();
cell18.textContent = item["TRSHP Net"] || "—";
cell18.style.background = "#d4edda";

// 19. EXPRT Start
let cell19 = row.insertCell();
cell19.textContent = item["EXPRT Start"] || "—";

// 20. EXPRT End
let cell20 = row.insertCell();
cell20.textContent = item["EXPRT End"] || "—";

// 21. EXPRT Days
let cell21 = row.insertCell();
cell21.textContent = item["EXPRT Days"] || "—";
cell21.style.background = "#e3f2fd";

// 22. EXPRT Free
let cell22 = row.insertCell();
cell22.textContent = item["EXPRT Free"] || "—";
cell22.style.background = "#fff3cd";

// 23. EXPRT Net
let cell23 = row.insertCell();
cell23.textContent = item["EXPRT Net"] || "—";
cell23.style.background = "#d4edda";

// 24. Total Net
let cell24 = row.insertCell();
cell24.textContent = item["Total Net"] || "—";
cell24.style.background = "#cce5ff";
cell24.style.fontWeight = "bold";

// 25. Vessel Name (آخر عمود)
let cell25 = row.insertCell();
cell25.textContent = item["Vessel Name"] || "—";
    }
    
    // إظهار العناصر
    let filtersDiv = document.getElementById("filtersTab1");
    let wrapperDiv = document.getElementById("wrapperTab1");
    if (filtersDiv) filtersDiv.style.display = "flex";
    if (wrapperDiv) wrapperDiv.style.display = "block";
}

// ========== دالة عرض الجدول مع اختيار الأعمدة ==========
function renderTable1WithSelectedColumns(tbodyId, data, searchId, typeId, statsId) {
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."].toLowerCase().includes(search);
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    let selected = selectedColumns.tab1;
    if (selected.length === 0) {
        selected = availableColumns.tab1.filter(c => c.default).map(c => c.name);
    }
    
    let thead = document.querySelector('#tableTab1 thead tr');
    if (thead) {
        thead.innerHTML = '';
        selected.forEach(colName => {
            let col = availableColumns.tab1.find(c => c.name === colName);
            let th = document.createElement('th');
            th.textContent = col ? col.label : colName;
            thead.appendChild(th);
        });
    }
    
    let tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${selected.length}" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات<\/td><\/tr>`;
        return;
    }
    
    for (let item of filtered) {
        let row = tbody.insertRow();
        selected.forEach(colName => {
            let cell = row.insertCell();
            let value = item[colName];
            
            if (["Is OOG", "Is Refrigerated", "Is Bundled", "Is Hazardous"].includes(colName)) {
                cell.textContent = value === "true" ? "✅" : "❌";
            } else if (colName === "طريقة الحساب") {
                let methodClass = value === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
                cell.innerHTML = `<span class="${methodClass}">${value || "—"}</span>`;
            } else if (colName === "Container No.") {
                cell.textContent = value || "—";
                cell.style.fontWeight = "bold";
            } else if (colName === "Type") {
                cell.innerHTML = `<strong>${value || "—"}</strong>`;
            } else {
                cell.textContent = value || "—";
            }
            
            if (["TRSHP Days", "EXPRT Days"].includes(colName)) cell.style.background = "#e3f2fd";
            if (colName === "Overlap") cell.style.background = "#f8d7da";
            if (["TRSHP After Overlap", "TRSHP Free", "EXPRT Free"].includes(colName)) cell.style.background = "#fff3cd";
            if (["TRSHP Net", "EXPRT Net"].includes(colName)) cell.style.background = "#d4edda";
            if (colName === "Total Net") {
                cell.style.background = "#cce5ff";
                cell.style.fontWeight = "bold";
            }
        });
    }
    
    // الإحصائيات تبقى كما هي دون تغيير
    let statsDiv = document.getElementById(statsId);
    if (statsDiv && statsDiv.innerHTML === "") {
        statsDiv.innerHTML = renderAdvancedStats(data);
        statsDiv.style.display = "block";
    }
}

// ========== دوال نافذة اختيار الأعمدة ==========
function openColumnModal(tabId) {
    let modal = document.getElementById('columnModal');
    let body = document.getElementById('columnModalBody');
    
    let html = `<div class="select-all">
        <label style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="selectAllColumns"> <strong>تحديد الكل</strong>
        </label>
    </div>`;
    
    let cols = availableColumns[tabId];
    if (cols) {
        cols.forEach(col => {
            let isChecked = selectedColumns[tabId].includes(col.name) || 
                           (selectedColumns[tabId].length === 0 && col.default);
            html += `
                <div class="column-option">
                    <input type="checkbox" class="col-checkbox" value="${col.name}" id="col_${col.name.replace(/ /g, '_')}" ${isChecked ? 'checked' : ''}>
                    <label for="col_${col.name.replace(/ /g, '_')}">${col.label}</label>
                </div>
            `;
        });
    }
    
    body.innerHTML = html;
    modal.classList.add('active');
    
    document.getElementById('selectAllColumns').onchange = (e) => {
        document.querySelectorAll('.col-checkbox').forEach(cb => cb.checked = e.target.checked);
    };
    
    document.getElementById('applyColumnSelection').onclick = () => {
        let selected = [];
        document.querySelectorAll('.col-checkbox:checked').forEach(cb => selected.push(cb.value));
        selectedColumns[tabId] = selected;
        
        localStorage.setItem(`selectedColumns_${tabId}`, JSON.stringify(selected));
        console.log(`تم حفظ تفضيلات التبويب ${tabId}:`, selected);
        
        closeColumnModal();
        renderTable1WithSelectedColumns('bodyTab1', currentData1, 'searchTab1', 'typeTab1', 'statsTab1');
    };
}

function closeColumnModal() {
    document.getElementById('columnModal').classList.remove('active');
}

// ========== دوال معالجة البيانات ==========
document.getElementById("fileInput").addEventListener("change", function(e) {
    let file = e.target.files[0];
    if (!file) return;
    
    // تنظيف البيانات القديمة
    currentData1 = [];
    currentData2 = [];
    currentData3 = [];
    currentData4 = [];
    currentData5 = [];
    currentData6 = [];
    containersMap.clear();
    
    updateFileNameDisplay(file.name);
    
    let reader = new FileReader();
    reader.onload = function(evt) {
        let arrayBuffer = evt.target.result;
        
        // حفظ الملف في localStorage
        let binary = '';
        let bytes = new Uint8Array(arrayBuffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        let base64Data = btoa(binary);
        saveFileToLocalStorage(base64Data, file.name);
        
        let workbook = XLSX.read(arrayBuffer, { type: 'array' });
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let rows = XLSX.utils.sheet_to_json(sheet, { defval: "", range: 4 });
        
        for (let row of rows) {
            let equipId = row["Equip ID"];
            if (!equipId || equipId === "") continue;
            
            if (!containersMap.has(equipId)) {
                containersMap.set(equipId, {
                    equipId: equipId,
                    equipmentType: row["Equipment Type"] || "",
                    lineId: row["Line ID"] || "",
                    trshpList: [],
                    exprtList: [],      // ← تغيير: من exprt: null إلى exprtList: []
                    strge: null,
                    imprt: null,
                    trshpReturn: null
                });
            }
            let c = containersMap.get(equipId);
            let cat = row["Category"];
            let drayStatus = row["Dray Status"] || "";
            
            if (cat === "TRSHP") {
                c.trshpList.push(row);
                if (drayStatus === "RETURN") {
                    c.trshpReturn = row;
                }
            }
            else if (cat === "EXPRT") {
                if (!c.exprtList) c.exprtList = [];
                c.exprtList.push(row);
            }
            else if (cat === "STRGE") {
                c.strge = row;
            }
            else if (cat === "IMPRT") {
                c.imprt = row;
            }
        }
        
        // للتشخيص - تأكد من قراءة جميع EXPRT
        console.log("عدد الصفوف المقروءة:", rows.length);
        let testContainer = containersMap.get("UETU6230321");
        if (testContainer) {
            console.log("عدد EXPRT في exprtList:", testContainer.exprtList?.length);
        }
        
        processAndDisplay1();
        processAndDisplay2();
        processAndDisplay3();
        processAndDisplay4();
        processAndDisplay5();
        processAndDisplay6();
		        processAndDisplay7();  // ← هنا المكان الصحيح

        updateHeaderInfo('1');
        
        setTimeout(function() {
            applySavedColumnPreferences();
        }, 200);
        
        document.getElementById("footerMsg").innerHTML = `✅ تم تحميل: ${file.name} | TRSHP+EXPRT: ${currentData1.length} | STRGE+EXPRT+IMPRT: ${currentData2.length} | EXPRT فقط: ${currentData3.length} | STRGE فارغ: ${currentData4.length} | TRSHP فقط: ${currentData5.length} | STRGE+EXPRT فقط: ${currentData6.length} | IMPRT+FORWARD: ${currentData7.length}`;
    };
    reader.readAsArrayBuffer(file);
});

function processAndDisplay1() {
    let result = [];
    
    for (let [id, container] of containersMap.entries()) {
        let trshpArray = container.trshpList || [];
        let exprtList = container.exprtList || [];
        
        if (trshpArray.length === 0 || exprtList.length === 0) continue;
        
        // ترتيب فترات TRSHP حسب التاريخ
        let sortedTrshp = [...trshpArray].sort((a, b) => 
            new Date(convertDate(a["Start Time"])) - new Date(convertDate(b["Start Time"]))
        );
        
        // حساب السماح الكلي من أول VESSEL
        let totalFreeDays = 0;
        let lineId = container.lineId || "";
        
        for (let tr of sortedTrshp) {
            let ibLocType = tr["I/B Loc Type"] || "";
            if (ibLocType === "VESSEL") {
                let flexString01 = tr["Flex String 01"] || "";
                let drayStatus = tr["Dray Status"] || "";
                totalFreeDays = getFreeDays(trshpPeriods1, lineId, convertDate(tr["Start Time"]), flexString01, drayStatus);
                break;
            }
        }
        
        if (totalFreeDays === 0 && sortedTrshp.length > 0) {
            let firstTr = sortedTrshp[0];
            let flexString01 = firstTr["Flex String 01"] || "";
            let drayStatus = firstTr["Dray Status"] || "";
            totalFreeDays = getFreeDays(trshpPeriods1, lineId, convertDate(firstTr["Start Time"]), flexString01, drayStatus);
        }
        
        // ترتيب الفترات حسب I/B Loc Type: VESSEL أولاً ثم TRUCK
        let vesselPeriods = [];
        let truckPeriods = [];
        
        for (let tr of sortedTrshp) {
            let ibLocType = tr["I/B Loc Type"] || "";
            if (ibLocType === "VESSEL") {
                vesselPeriods.push(tr);
            } else {
                truckPeriods.push(tr);
            }
        }
        
        vesselPeriods.sort((a, b) => 
            new Date(convertDate(b["Start Time"])) - new Date(convertDate(a["Start Time"]))
        );
        truckPeriods.sort((a, b) => 
            new Date(convertDate(b["Start Time"])) - new Date(convertDate(a["Start Time"]))
        );
        
        let orderedForDeduction = [...vesselPeriods, ...truckPeriods];
        
        let remainingFree = totalFreeDays;
        let periodFreeMap = new Map();
        
        for (let tr of orderedForDeduction) {
            let trStart = convertDate(tr["Start Time"]);
            let trEnd = convertDate(tr["End Time"]);
            let trDays = diffDays(trStart, trEnd);
            
            let deduction = Math.min(trDays, remainingFree);
            periodFreeMap.set(tr, deduction);
            remainingFree -= deduction;
        }
        
        for (let tr of trshpArray) {
            let drayStatus = tr ? (tr["Dray Status"] || "") : "";
            let isReturn = (drayStatus === "RETURN");
            
            if (isReturn) continue;
            
            for (let ex of exprtList) {
                let isExcl = isExcluded(lineId, excludeLines1);
                
                let exDrayStatus = ex["Dray Status"] || "";
                let isReturnDray = (exDrayStatus === "RETURN");
                
                let trStart = convertDate(tr["Start Time"] || "");
                let trEnd = convertDate(tr["End Time"] || "");
                let exStart = convertDate(ex["Rule Start Time"] || "");
                let exEnd = convertDate(ex["Rule End Time"] || "");
                
                if (!trStart || !trEnd || !exStart || !exEnd) continue;
                
                let overlapResult = calculateDaysWithOverlapRemoved(trStart, trEnd, exStart, exEnd);
                let trDaysAfterOverlap = overlapResult.net1;
                let exDays = overlapResult.net2;
                let overlapDays = overlapResult.overlap;
                
                let flexString01 = tr["Flex String 01"] || "";
                
                let trFree = getFreeDays(trshpPeriods1, lineId, trStart, flexString01, drayStatus);
                
				// ===================================================
				// التعديل 1: حساب EXPRT Free بناءً على O/B Loc Type
				// ===================================================
				let obLocType = (ex["O/B Loc Type"] || "").trim().toUpperCase();
				let isTruck = (obLocType === "TRUCK");

				let exFree;
				if (isTruck) {
					// O/B Loc Type = TRUCK → لا سماح
					exFree = 0;
				} else {
					// أي حالة أخرى (VESSEL) → يطبق السماح
					exFree = getFreeDays(exprtPeriods1, lineId, exStart, flexString01, drayStatus);
				}
				// ===================================================
                
let trDaysTotal = diffDays(trStart, trEnd);

let trNet = 0, exNet = 0;

// ===================================================
// حساب TRSHP و EXPRT Net باستخدام طريقة السماح المناسبة
// ===================================================
if (isExcl) {
    // سماح مستقل
    let indResult = calculateIndependent(trDaysTotal, trFree, exDays, exFree, overlapDays);
    trNet = indResult.net1;
    exNet = indResult.net2;
} else {
    // تداخل سماح
    let overlapResultCalc = calculateWithOverlap(trDaysTotal, trFree, exDays, exFree);
    trNet = overlapResultCalc.net1;
    exNet = overlapResultCalc.net2;
}

// خصم الأيام المشتركة من TRSHP فقط
trNet = trNet - overlapDays;
if (trNet < 0) trNet = 0;
// لا تخصم الأيام المشتركة من EXPRT
// ===================================================
// ===================================================
                
                let resultCalc = { net1: trNet, net2: exNet, total: trNet + exNet };
                
                let method = isExcl ? "🚫 سماح مستقل" : "🔄 تداخل سماح";
                
                let equipType = container.equipmentType;
                let size = equipType.toString().match(/^(\d+)/)?.[1] || "";
                let vesselName = tr["I/B Carrier Name"] || "";
                let lineName = ex["Line ID"] || "";
                
                let isRefrigerated = ex["Is Refrigerated"] || "";
                let type = (isRefrigerated === "true" || equipType.includes("R1")) ? "RF" : "GP";
                let isOOG = ex["Is OOG"] || "";
                let isBundled = ex["Is Bundled"] || "";
                let isHazardous = ex["Is Hazardous"] || "";
                let imdgClass = ex["IMDG Class"] || "";
                
                let isVessel = (tr["I/B Loc Type"] || "") === "VESSEL";
                
                // ========== شرط إخفاء بيانات EXPRT ==========
                // إخفاء فقط إذا كانت VESSEL ويوجد فترات TRUCK أو TRSHP أخرى
                let hasOtherPeriods = false;
                for (let otherTr of trshpArray) {
                    if (otherTr !== tr) {
                        let otherType = otherTr["I/B Loc Type"] || "";
                        if (otherType === "TRUCK" || otherType === "TRSHP") {
                            hasOtherPeriods = true;
                            break;
                        }
                    }
                }
                
                let hideExprt = isVessel && hasOtherPeriods;
                
                result.push({
                    "Container No.": id,
                    "Size": size,
                    "Is OOG": isOOG,
                    "Is Refrigerated": isRefrigerated,
                    "flex_04": ex["Flex String 04"] || "",
                    "Is Bundled": isBundled,
                    "Is Hazardous": isHazardous,
                    "IMDG Class": imdgClass,
                    "Type": type,
                    "Line ID": lineName,
                    "طريقة الحساب": method,
                    "Flex String 01": flexString01,
					"O/B Loc Type": ex["O/B Loc Type"] || "",  // ← أضف هذا
                    "Vessel Name": isReturnDray ? "RETURN" : vesselName,
                    "TRSHP Start": trStart,
                    "TRSHP End": trEnd,
                    "TRSHP Days": trDaysTotal,
                    "Overlap": overlapDays,
                    "TRSHP After Overlap": trDaysAfterOverlap,
                    "TRSHP Free": trFree,
                    "TRSHP Net": trNet,
                    "EXPRT Start": hideExprt ? "—" : exStart,
                    "EXPRT End": hideExprt ? "—" : exEnd,
                    "EXPRT Days": hideExprt ? 0 : exDays,
                    "EXPRT Free": hideExprt ? 0 : exFree,
                    "EXPRT Net": hideExprt ? 0 : exNet,
                    "Total Net": hideExprt ? trNet : resultCalc.total
                });
            }
        }
    }
    
    currentData1 = result;
    renderTable1WithStats("bodyTab1", currentData1, "searchTab1", "typeTab1", "statsTab1");
    updateHeaderFromDisplayData('1', currentData1);
}

function processAndDisplay2() {
    let result = [];
    
    for (let [id, container] of containersMap.entries()) {
        let imprtData = container.imprt || container.trshpReturn;
        
        // ========== التعديل: تحويل إلى مصفوفة ==========
        let exprtList = container.exprtList || [];
        if (container.exprt && exprtList.length === 0) {
            exprtList = [container.exprt];
        }
        
        if (!imprtData || exprtList.length === 0) continue;
        
        let imStart = convertDate(imprtData["Start Time"] || "");
        let imEnd = convertDate(imprtData["End Time"] || "");
        
        if (!imStart || !imEnd) continue;
        
        let imDays = diffDays(imStart, imEnd);
        let imprtType = container.imprt ? "IMPRT" : "TRSHP-RETURN";
        
        // ========== التعديل: التكرار على كل EXPRT ==========
        for (let ex of exprtList) {
            let exStart = convertDate(ex["Rule Start Time"] || "");
            let exEnd = convertDate(ex["Rule End Time"] || "");
            
            if (!exStart || !exEnd) continue;
            
            let lineId = container.lineId || "";
            let isExcl = isExcluded(lineId, excludeLines2);
            let exDays = diffDays(exStart, exEnd);
            
            let exFlexString01 = ex["Flex String 01"] || "";
            let exDrayStatus = ex["Dray Status"] || "";
            
            // التحقق من Dray Status في EXPRT
            let isReturnDray = (exDrayStatus === "RETURN");
            
            let st = container.strge;
            let stStart = "", stEnd = "", stDays = 0, stFree = 0, stDaysAfterOverlap = 0, exDaysAfterOverlap = exDays, overlapDays = 0;
            
            // إذا كان Dray Status = RETURN، لا نحسب STRGE (نتركها فارغة)
            if (!isReturnDray && st) {
                stStart = convertDate(st["Start Time"] || "");
                stEnd = convertDate(st["End Time"] || "");
                if (stStart && stEnd) {
                    stDays = diffDays(stStart, stEnd);
                    
                    // استبعاد اليوم المشترك بين IMPRT و STRGE
                    if (imEnd && stStart && imEnd === stStart) {
                        stDays = stDays - 1;
                        if (stDays < 0) stDays = 0;
                    }
                    
                    let stDrayStatus = st["Dray Status"] || "";
                    let stFlexString01 = st["Flex String 01"] || "";
                    stFree = getFreeDays(strgePeriods2, lineId, stStart, stFlexString01, stDrayStatus);
                    
                    let overlapResult = calculateDaysWithOverlapRemoved(stStart, stEnd, exStart, exEnd);
                    stDaysAfterOverlap = overlapResult.net1;
                    
                    if (imEnd && stStart && imEnd === stStart) {
                        stDaysAfterOverlap = stDaysAfterOverlap - 1;
                        if (stDaysAfterOverlap < 0) stDaysAfterOverlap = 0;
                    }
                    
                    exDaysAfterOverlap = overlapResult.net2;
                    overlapDays = overlapResult.overlap;
                }
            } else if (isReturnDray) {
                // إذا كان Dray Status = RETURN، نترك القيم فارغة
                stStart = "—";
                stEnd = "—";
                stDays = "—";
                stFree = "—";
                stDaysAfterOverlap = "—";
                overlapDays = "—";
            }
            
            // باقي الكود كما هو (exFree, strgeNet, exprtNet, result.push...)
        
        // التحقق من حالة EXPRT مع Dray Status = RETURN

let exFree;
if (isReturnDray) {
    // إذا كان EXPRT و Dray Status = RETURN → لا سماح
    exFree = 0;
} else {
    // الحالات العادية: تطبق إعدادات السماح
    exFree = getFreeDays(exprtPeriods2, lineId, exStart, exFlexString01, exDrayStatus);
}
        
let strgeNet = 0, exprtNet = 0;

// إذا كان RETURN، اجعل الصافي = 0
if (isReturnDray) {
    strgeNet = 0;
    exprtNet = 0;
} else if (stStart && stEnd && stStart !== "—") {
    if (isExcl) {
        let indResult = calculateIndependent(stDaysAfterOverlap, stFree, exDaysAfterOverlap, exFree);
        strgeNet = indResult.net1;
        exprtNet = indResult.net2;
    } else {
        let overlapResultCalc = calculateWithOverlap(stDaysAfterOverlap, stFree, exDaysAfterOverlap, exFree);
        strgeNet = overlapResultCalc.net1;
        exprtNet = overlapResultCalc.net2;
    }
} else {
    exprtNet = exDaysAfterOverlap - exFree;
    if (exprtNet < 0) exprtNet = 0;
}
        
        let totalNet = strgeNet + exprtNet;
        let imprtType = container.imprt ? "IMPRT" : "TRSHP-RETURN";
        
        let equipType = container.equipmentType;
        let isRefrigerated = st ? st["Is Refrigerated"] : (imprtData ? imprtData["Is Refrigerated"] : "");
        let size = equipType.toString().match(/^(\d+)/)?.[1] || "";
        let type = (isRefrigerated === "true" || equipType.includes("R1")) ? "RF" : "GP";
        // اسم السفينة من IMPRT فقط (حدث الدخول)
		let vesselName = "";
		if (container.imprt) {
			vesselName = container.imprt["I/B Carrier Name"] || "";
		}
		if (!vesselName && imprtData) {
			vesselName = imprtData["I/B Carrier Name"] || "";
		}
		if (!vesselName) {
			vesselName = "—";
		}
        let method = isExcl ? "🚫 سماح مستقل" : "🔄 تداخل سماح";
        
		let isOOG = ex["Is OOG"] || "";
		let isRefrigeratedDisplay = ex["Is Refrigerated"] || "";
		let flexString01 = ex["Flex String 01"] || "";      // ← أضف هذا
		let flexString04 = ex["Flex String 04"] || "";      // ← أضف هذا
		let isBundled = ex["Is Bundled"] || "";
		let isHazardous = ex["Is Hazardous"] || "";
		let imdgClass = ex["IMDG Class"] || "";
        
        result.push({
            "Container No.": id,
            "Size": size,
            "Is OOG": isOOG,
            "Is Refrigerated": isRefrigeratedDisplay,
            "flex_04": ex["Flex String 04"] || "",
            "Is Bundled": isBundled,
            "Is Hazardous": isHazardous,
            "IMDG Class": imdgClass,
            "Type": type,
            "Line ID": lineId,
            "طريقة الحساب": method,
            "Flex String 01": flexString01,
            "نوع IMPRT": imprtType,
            "IMPRT Start": imStart,
            "IMPRT End": imEnd,
            "IMPRT Days": imDays,
            "STRGE Start": stStart === "" ? "—" : stStart,
            "STRGE End": stEnd === "" ? "—" : stEnd,
            "STRGE Days": stDays === 0 ? "—" : stDays,
            "Overlap Days": overlapDays === 0 ? "—" : overlapDays,
            "STRGE After Overlap": stDaysAfterOverlap === 0 ? "—" : stDaysAfterOverlap,
            "STRGE Free": stFree === 0 ? "—" : stFree,
            "STRGE Net": strgeNet,
            "EXPRT Start": exStart,
            "EXPRT End": exEnd,
            "EXPRT Days": exDaysAfterOverlap,
            "EXPRT Free": exFree,
            "EXPRT Net": exprtNet,
            "Total Net": totalNet,
            "Vessel Name": isReturnDray ? "RETURN" : vesselName
        });
        } // ← إغلاق حلقة for (of exprtList)
    } // ← إغلاق حلقة for (of containersMap)
    
    currentData2 = result;
    renderTable2("bodyTab2", currentData2, "searchTab2", "typeTab2", "statsTab2");
    updateHeaderFromDisplayData('2', currentData2);
} // ← إغلاق الدالةAndDisplay2

function processAndDisplay3() {
    console.log("=== processAndDisplay3 ===");
    console.log("containersMap size:", containersMap.size);
    
    let result = [];
    
    for (let [id, container] of containersMap.entries()) {
        console.log("فحص حاوية:", id);
        
        let trshpArray = container.trshpList || [];
        let hasTrshp = trshpArray.length > 0;
        console.log("  hasTrshp:", hasTrshp);
        
        // ========== التحقق من exprtList ==========
        let exprtList = container.exprtList || [];
        let hasExprt = exprtList.length > 0;
        console.log("  exprtList.length:", exprtList.length);
        console.log("  hasExprt:", hasExprt);
        
        // التحقق من وجود STRGE أو IMPRT أو TRSHP RETURN
        let hasStrge = (container.strge !== null && container.strge["Category"] === "STRGE");
        let hasImprt = (container.imprt !== null && container.imprt["Category"] === "IMPRT");
        let hasTrshpReturn = (container.trshpReturn !== null && container.trshpReturn["Category"] === "TRSHP" && container.trshpReturn["Dray Status"] === "RETURN");
        
        console.log("  hasStrge:", hasStrge);
        console.log("  hasImprt:", hasImprt);
        console.log("  hasTrshpReturn:", hasTrshpReturn);
        
        // شرط EXPRT فقط (بدون TRSHP وبدون STRGE وبدون IMPRT وبدون RETURN)
        let hasOnlyExprt = hasExprt && !hasTrshp && !hasStrge && !hasImprt && !hasTrshpReturn;
        console.log("  hasOnlyExprt:", hasOnlyExprt);
        
        if (!hasOnlyExprt) {
            console.log(`  ❌ حاوية ${id} غير مؤهلة للتبويب 3`);
            continue;
        }
        
        console.log(`  ✅ حاوية ${id} مؤهلة للتبويب 3`);
        
        // ========== التكرار على كل EXPRT في المصفوفة ==========
        for (let ex of exprtList) {
            console.log("    معالجة EXPRT:", ex["Rule Start Time"], "->", ex["Rule End Time"]);
            
            let lineId = container.lineId || "";
            let isExcl = isExcluded(lineId, excludeLines3);
            
            let exStart = convertDate(ex["Rule Start Time"] || "");
            let exEnd = convertDate(ex["Rule End Time"] || "");
            
            if (!exStart || !exEnd) {
                console.log("    ❌ تخطي: تواريخ غير صالحة");
                continue;
            }
            
            let exDays = diffDays(exStart, exEnd);
            let flexString01 = ex["Flex String 01"] || "";
            let drayStatus = ex["Dray Status"] || "";
            
            let exFree = getFreeDays(exprtOnlyPeriods3, lineId, exStart, flexString01, drayStatus);
            
            let exNet = exDays - exFree;
            if (exNet < 0) exNet = 0;
            
            let equipType = container.equipmentType;
            let isRefrigerated = ex["Is Refrigerated"] || "";
            let size = equipType.toString().match(/^(\d+)/)?.[1] || "";
            let type = (isRefrigerated === "true" || equipType.includes("R1")) ? "RF" : "GP";
            let vesselName = ex["O/B Carrier Name"] || ex["I/B Carrier Name"] || "";
            let method = isExcl ? "🚫 سماح مستقل" : "🔄 تداخل سماح";
            
            let isOOG = ex["Is OOG"] || "";
            let isBundled = ex["Is Bundled"] || "";
            let isHazardous = ex["Is Hazardous"] || "";
            let imdgClass = ex["IMDG Class"] || "";
            
            result.push({
                "Container No.": id,
                "Size": size,
                "Is OOG": isOOG,
                "Is Refrigerated": isRefrigerated,
                "flex_04": ex["Flex String 04"] || "",
                "Is Bundled": isBundled,
                "Is Hazardous": isHazardous,
                "IMDG Class": imdgClass,
                "Type": type,
                "Line ID": lineId,
                "Flex String 01": flexString01,
                "EXPRT Start": exStart,
                "EXPRT End": exEnd,
                "EXPRT Days": exDays,
                "EXPRT Free": exFree,
                "EXPRT Net": exNet,
                "Total Net": exNet,
                "Vessel Name": vesselName,
                "طريقة الحساب": method
            });
            
            console.log("    ✅ تم إضافة صف للنتائج");
        }
    }
    
    console.log("نتيجة النهائية:", result.length, "صف");
    
    currentData3 = result;
    renderTable3("bodyTab3", currentData3, "searchTab3", "typeTab3", "statsTab3");
    updateHeaderFromDisplayData('3', currentData3);
}

function processAndDisplay4() {
    let result = [];
    let tempMap = new Map();
    
    for (let [id, container] of containersMap.entries()) {
		// ========== التعديل: استبعاد الحاويات التي لها EXPRT (بما فيها exprtList) ==========
        let hasExprt = (container.exprtList && container.exprtList.length > 0) || container.exprt;
        if (hasExprt) continue;
        if (container.strge && container.strge["Freight Kind"] === "MTY") {
            if (container.exprt) continue;
            
            if (!tempMap.has(id)) {
                tempMap.set(id, {
                    imprt: null,
                    strgeList: [],
                    lineId: container.lineId,
                    equipmentType: container.equipmentType
                });
            }
            let data = tempMap.get(id);
			data.strgeList.push({
				start: convertDate(container.strge["Start Time"] || ""),
				end: convertDate(container.strge["Rule End Time"] || ""),
				rawData: container.strge
			});
        }
    }
    
for (let [id, container] of containersMap.entries()) {
    if (!tempMap.has(id)) continue;
    
    let data = tempMap.get(id);
    let imprtSource = null;
    
    //優先 استخدام IMPRT، وإذا لم يوجد استخدم TRSHP RETURN
    if (container.imprt) {
        imprtSource = container.imprt;
    } else if (container.trshpReturn) {
        imprtSource = container.trshpReturn;
    }
    
    if (imprtSource) {
        data.imprt = {
            start: convertDate(imprtSource["Start Time"] || ""),
            end: convertDate(imprtSource["End Time"] || ""),
            rawData: imprtSource
        };
    }
}
    
for (let [id, data] of tempMap.entries()) {
    // ←←← تعريف imStart و imEnd أولاً ←←←
    let imStart = data.imprt ? data.imprt.start : "";
    let imEnd = data.imprt ? data.imprt.end : "";
    let imDays = (imStart && imEnd) ? diffDays(imStart, imEnd) : 0;
    
    let totalStrgeDays = 0;
    let strgeStart = "";
    let strgeEnd = "";
    
    // حساب أيام STRGE مع استبعاد اليوم المشترك
// حساب أيام STRGE مع استبعاد اليوم المشترك
for (let st of data.strgeList) {
    if (st.start && st.end) {
        let days = diffDays(st.start, st.end);
        
        // استبعاد اليوم المشترك بين IMPRT و STRGE (مقارنة بالتاريخ)
        if (imEnd && st.start) {
            let imEndDate = new Date(imEnd);
            let stStartDate = new Date(st.start);
            if (imEndDate.getTime() === stStartDate.getTime()) {
                days = days - 1;
                if (days < 0) days = 0;
            }
        }
        
        totalStrgeDays += days;
        if (!strgeStart || st.start < strgeStart) strgeStart = st.start;
        if (!strgeEnd || st.end > strgeEnd) strgeEnd = st.end;
    }
}
    
    let lineId = data.lineId || "";
    let isExcl = isExcluded(lineId, excludeLines4);
    
    let strgeFree = 0;
    if (totalStrgeDays > 0 && strgeStart) {
        strgeFree = getEmptyStrgeFreeDays(emptyStrgePeriods4, lineId, strgeStart);
    }
    
    let strgeNet = totalStrgeDays - strgeFree;
    if (strgeNet < 0) strgeNet = 0;
    
    let totalNet = strgeNet;
        
        let equipType = data.equipmentType;
        let size = equipType.toString().match(/^(\d+)/)?.[1] || "";
        let type = "GP";
        let vesselName = data.imprt ? (data.imprt.rawData ? data.imprt.rawData["I/B Carrier Name"] || "" : "") : "";
if (!vesselName) vesselName = "—";
        let method = isExcl ? "🚫 سماح مستقل" : "🔄 سماح عادي";
        
		let sourceData = data.strgeList[0] ? data.strgeList[0].rawData : null;
		let isOOG = sourceData ? (sourceData["Is OOG"] || "") : "";
		let isRefrigeratedDisplay = sourceData ? (sourceData["Is Refrigerated"] || "") : "";
		let flexString04 = sourceData ? (sourceData["Flex String 04"] || "") : "";
		let isBundled = sourceData ? (sourceData["Is Bundled"] || "") : "";
		let isHazardous = sourceData ? (sourceData["Is Hazardous"] || "") : "";
		let imdgClass = sourceData ? (sourceData["IMDG Class"] || "") : "";

		result.push({
			"Container No.": id, "Size": size,
			"Is OOG": isOOG, "Is Refrigerated": isRefrigeratedDisplay,
			"flex_04": flexString04,  // ← تغيير المسمى
			"Is Bundled": isBundled, "Is Hazardous": isHazardous, "IMDG Class": imdgClass,
			"Type": type, "Line ID": lineId,
			"IMPRT Start": imStart, "IMPRT End": imEnd, "IMPRT Days": imDays,
			"STRGE Start": strgeStart, "STRGE End": strgeEnd, "STRGE Days": totalStrgeDays,
			"STRGE Free": strgeFree, "STRGE Net": strgeNet, "Total Net": totalNet,
			"Vessel Name": vesselName, "طريقة الحساب": method
		});
    }
    
    currentData4 = result;
renderTable4("bodyTab4", currentData4, "searchTab4", "typeTab4", "statsTab4");
updateHeaderFromDisplayData('4', currentData4);
}

// ========== دوال العرض للتبويبات الأخرى ==========
function renderTable2(tbodyId, data, searchId, typeId, statsId) {
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    let total = data.length;
    let totalNet = data.reduce((s, i) => s + (i["Total Net"] || 0), 0);
    let avg = total > 0 ? (totalNet / total).toFixed(1) : 0;
    
	let statsDiv = document.getElementById(statsId);
	if (statsDiv) {
		statsDiv.innerHTML = renderAdvancedStatsTab2(data);
		statsDiv.style.display = "block";
	}
    
    let tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="29" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات<\/td></tr>`;
    } else {
        for (let item of filtered) {
            let row = tbody.insertRow();
            let methodClass = item["طريقة الحساب"] === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
            let imprtTypeClass = item["نوع IMPRT"] === "TRSHP-RETURN" ? 'style="background:#fef3c7; color:#92400e;"' : 'style="background:#e0f2fe; color:#0369a1;"';
            
            // تعريف flexHtml لعمود Flex String 01
            let flexValue = item["Flex String 01"] || "—";
            let flexHtml = "—";
            if (flexValue === "TRUE") {
                flexHtml = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
            } else if (flexValue === "FALSE") {
                flexHtml = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
            }
            
            row.innerHTML = `
                <td style="font-weight:bold;">${item["Container No."] || "—"}<\/td>
                <td>${item["Size"] || "—"}<\/td>
                <td>${item["Is OOG"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Refrigerated"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Bundled"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Hazardous"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["IMDG Class"] || "—"}<\/td>
                <td><strong>${item["Type"] || "—"}</strong><\/td>
                <td>${item["Line ID"] || "—"}<\/td>
                <td><span class="${methodClass}">${item["طريقة الحساب"] || "—"}</span><\/td>
                <td>${flexHtml}<\/td>
                <td ${imprtTypeClass}>${item["نوع IMPRT"] || "—"}<\/td>
                <td class="imprt-cell">${item["IMPRT Start"] || "—"}<\/td>
                <td class="imprt-cell">${item["IMPRT End"] || "—"}<\/td>
                <td class="imprt-cell">${item["IMPRT Days"] || "—"}<\/td>
                <td>${item["STRGE Start"] || "—"}<\/td>
                <td>${item["STRGE End"] || "—"}<\/td>
                <td style="background:#e3f2fd;">${item["STRGE Days"] || "—"}<\/td>
                <td style="background:#f8d7da;">${item["Overlap Days"] || "—"}<\/td>
                <td style="background:#fff3cd;">${item["STRGE After Overlap"] || "—"}<\/td>
                <td style="background:#fff3cd;">${item["STRGE Free"] || "—"}<\/td>
                <td style="background:#d4edda;">${item["STRGE Net"] || "—"}<\/td>
                <td>${item["EXPRT Start"] || "—"}<\/td>
                <td>${item["EXPRT End"] || "—"}<\/td>
                <td style="background:#e3f2fd;">${item["EXPRT Days"] || "—"}<\/td>
                <td style="background:#fff3cd;">${item["EXPRT Free"] || "—"}<\/td>
                <td style="background:#d4edda;">${item["EXPRT Net"] || "—"}<\/td>
                <td style="background:#cce5ff; font-weight:bold;">${item["Total Net"] || "—"}<\/td>
                <td>${item["Vessel Name"] || "—"}<\/td>
            `;
        }
    }
    
    document.getElementById(statsId).style.display = "flex";
    document.getElementById("filtersTab2").style.display = "flex";
    document.getElementById("wrapperTab2").style.display = "block";
}

function renderTable3(tbodyId, data, searchId, typeId, statsId) {
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    let total = data.length;
    let totalNet = data.reduce((s, i) => s + (i["Total Net"] || 0), 0);
    let avg = total > 0 ? (totalNet / total).toFixed(1) : 0;
    
let statsDiv = document.getElementById(statsId);
if (statsDiv) {
    statsDiv.innerHTML = renderAdvancedStatsTab3(data);
    statsDiv.style.display = "block";
}
    
    let tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="18" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات<\/td></tr>`;
    } else {
        for (let item of filtered) {
            let row = tbody.insertRow();
            let methodClass = item["طريقة الحساب"] === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
            
            // تعريف flexHtml لعمود Flex String 01
            let flexValue = item["Flex String 01"] || "—";
            let flexHtml = "—";
            if (flexValue === "TRUE") {
                flexHtml = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
            } else if (flexValue === "FALSE") {
                flexHtml = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
            }
            
            row.innerHTML = `
                <td style="font-weight:bold;">${item["Container No."] || "—"}<\/td>
                <td>${item["Size"] || "—"}<\/td>
                <td>${item["Is OOG"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Refrigerated"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Bundled"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Hazardous"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["IMDG Class"] || "—"}<\/td>
                <td><strong>${item["Type"] || "—"}</strong><\/td>
                <td>${item["Line ID"] || "—"}<\/td>
                <td><span class="${methodClass}">${item["طريقة الحساب"] || "—"}</span><\/td>
                <td>${flexHtml}<\/td>
                <td>${item["EXPRT Start"] || "—"}<\/td>
                <td>${item["EXPRT End"] || "—"}<\/td>
                <td style="background:#e3f2fd;">${item["EXPRT Days"] || "—"}<\/td>
                <td style="background:#fff3cd;">${item["EXPRT Free"] || "—"}<\/td>
                <td style="background:#d4edda;">${item["EXPRT Net"] || "—"}<\/td>
                <td style="background:#cce5ff; font-weight:bold;">${item["Total Net"] || "—"}<\/td>
                <td>${item["Vessel Name"] || "—"}<\/td>
            `;
        }
    }
    
    document.getElementById(statsId).style.display = "flex";
    document.getElementById("filtersTab3").style.display = "flex";
    document.getElementById("wrapperTab3").style.display = "block";
}

function renderTable4(tbodyId, data, searchId, typeId, statsId) {
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    let total = data.length;
    let totalNet = data.reduce((s, i) => s + (i["Total Net"] || 0), 0);
    let avg = total > 0 ? (totalNet / total).toFixed(1) : 0;
    
let statsDiv = document.getElementById(statsId);
if (statsDiv) {
    statsDiv.innerHTML = renderAdvancedStatsTab4(data);
    statsDiv.style.display = "block";
}
    
    let tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<td><td colspan="21" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات<\/td><\/tr>`;
    } else {
        for (let item of filtered) {
            let row = tbody.insertRow();
            let methodClass = item["طريقة الحساب"] === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
            
            // تعريف flexHtml لعمود Flex String 01
            let flexValue = item["Flex String 01"] || "—";
            let flexHtml = "—";
            if (flexValue === "TRUE") {
                flexHtml = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
            } else if (flexValue === "FALSE") {
                flexHtml = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
            }
            
            row.innerHTML = `
                <td style="font-weight:bold;">${item["Container No."] || "—"}<\/td>
                <td>${item["Size"] || "—"}<\/td>
                <td>${item["Is OOG"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Refrigerated"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Bundled"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Hazardous"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["IMDG Class"] || "—"}<\/td>
                <td><strong>${item["Type"] || "—"}</strong><\/td>
                <td>${item["Line ID"] || "—"}<\/td>
                <td><span class="${methodClass}">${item["طريقة الحساب"] || "—"}</span><\/td>
                <td>${flexHtml}<\/td>
                <td class="imprt-cell">${item["IMPRT Start"] || "—"}<\/td>
                <td class="imprt-cell">${item["IMPRT End"] || "—"}<\/td>
                <td class="imprt-cell">${item["IMPRT Days"] || "—"}<\/td>
                <td>${item["STRGE Start"] || "—"}<\/td>
                <td>${item["STRGE End"] || "—"}<\/td>
                <td style="background:#e3f2fd;">${item["STRGE Days"] || "—"}<\/td>
                <td style="background:#fff3cd;">${item["STRGE Free"] || "—"}<\/td>
                <td style="background:#d4edda;">${item["STRGE Net"] || "—"}<\/td>
                <td style="background:#cce5ff; font-weight:bold;">${item["Total Net"] || "—"}<\/td>
                <td>${item["Vessel Name"] || "—"}<\/td>
            `;
        }
    }
    
    document.getElementById(statsId).style.display = "flex";
    document.getElementById("filtersTab4").style.display = "flex";
    document.getElementById("wrapperTab4").style.display = "block";
}

// ========== دوال إدارة الفترات ==========
function getPeriodsArray(tabId, category) {
    if (tabId === '1') {
        if (category === 'TRSHP') return trshpPeriods1;
        else return exprtPeriods1;
    } else if (tabId === '2') {
        if (category === 'STRGE') return strgePeriods2;
        else return exprtPeriods2;
    } else if (tabId === '3') {
        return exprtOnlyPeriods3;
    } else if (tabId === '4') {
        return emptyStrgePeriods4;
    } else if (tabId === '5') {
        return trshpOnlyPeriods5;
    } else if (tabId === '6') {
        if (category === 'STRGE') return strgePeriods6;
        else return exprtPeriods6;
    }
}  // ← تأكد من وجود هذا القوس

function setPeriodsArray(tabId, category, periods) {
    if (tabId === '1') {
        if (category === 'TRSHP') { trshpPeriods1 = periods; localStorage.setItem("trshpPeriodsTab1", JSON.stringify(trshpPeriods1)); }
        else { exprtPeriods1 = periods; localStorage.setItem("exprtPeriodsTab1", JSON.stringify(exprtPeriods1)); }
    } else if (tabId === '2') {
        if (category === 'STRGE') { strgePeriods2 = periods; localStorage.setItem("strgePeriodsTab2", JSON.stringify(strgePeriods2)); }
        else { exprtPeriods2 = periods; localStorage.setItem("exprtPeriodsTab2", JSON.stringify(exprtPeriods2)); }
    } else if (tabId === '3') {
        exprtOnlyPeriods3 = periods;
        localStorage.setItem("exprtOnlyPeriodsTab3", JSON.stringify(exprtOnlyPeriods3));
    } else if (tabId === '4') {
        emptyStrgePeriods4 = periods;
        localStorage.setItem("emptyStrgePeriodsTab4", JSON.stringify(emptyStrgePeriods4));
    } else if (tabId === '5') {
        trshpOnlyPeriods5 = periods;
        localStorage.setItem("trshpOnlyPeriodsTab5", JSON.stringify(trshpOnlyPeriods5));
    } else if (tabId === '6') {
        if (category === 'STRGE') { strgePeriods6 = periods; localStorage.setItem("strgePeriodsTab6", JSON.stringify(strgePeriods6)); }
        else { exprtPeriods6 = periods; localStorage.setItem("exprtPeriodsTab6", JSON.stringify(exprtPeriods6)); }
    }
}  // ← تأكد من وجود هذا القوس

function displayPeriodsList(containerId, periods, tabId) {
    let sorted = sortPeriods([...periods]);
    let html = `<table style="width:100%; font-size:12px; border:1px solid #ddd;">
        <thead>
            <tr style="background:#f1f3f5;">
                <th>Category</th>
                <th>Line ID</th>
                <th>Dray Status</th>
                <th>Flex String 01</th>
                <th>تاريخ البدء</th>
                <th>تاريخ النهاية</th>
                <th>أيام السماح</th>
                <th></th>
            </tr>
        </thead>
        <tbody>`;
    
    sorted.forEach(period => {
        let catClass = period.category === "TRSHP" ? "trshp" : (period.category === "EXPRT" ? "exprt" : "strge");
        let endDisplay = period.endDate || "مفتوحة";
        
        html += `<tr>
            <td><span class="category-badge ${catClass}">${period.category}</span></td>
            <td>
<select class="period-line-${tabId}" data-id="${period.id}" data-cat="${period.category}" style="padding:6px 10px; border-radius:6px;">
    <option value="*" ${period.lineId === "*" ? "selected" : ""}>* (الكل)</option>
    ${masterLinesList.map(line => `<option value="${line}" ${period.lineId === line ? "selected" : ""}>${line}</option>`).join('')}
</select>
            </td>
            <td>
                <select class="period-dray-${tabId}" data-id="${period.id}" data-cat="${period.category}" style="padding:6px 10px; border-radius:6px;">
                    <option value="">الكل</option>
                    <option value="EMPTY" ${period.drayStatus === "EMPTY" ? "selected" : ""}>فارغ</option>
                    <option value="RETURN" ${period.drayStatus === "RETURN" ? "selected" : ""}>RETURN</option>
                    <option value="FORWARD" ${period.drayStatus === "FORWARD" ? "selected" : ""}>FORWARD</option>
                </select>
            </td>
            <td>
                <select class="period-flex-${tabId}" data-id="${period.id}" data-cat="${period.category}" style="padding:6px 10px; border-radius:6px;">
                    <option value="">الكل</option>
                    <option value="TRUE" ${period.flexString01 === "TRUE" ? "selected" : ""}>TRUE (صادر خاص)</option>
                    <option value="FALSE" ${period.flexString01 === "FALSE" ? "selected" : ""}>FALSE (صادر عادي)</option>
                </select>
            </td>
            <td><input type="date" class="period-start-${tabId}" data-id="${period.id}" data-cat="${period.category}" value="${period.startDate || ''}" style="width:130px;"></td>
            <td style="background:#f8f9fa;">${endDisplay}</td>
            <td><input type="number" class="period-days-${tabId}" data-id="${period.id}" data-cat="${period.category}" value="${period.freeDays}" style="width:80px;"><td>
            <td><button onclick="window.deletePeriod('${tabId}', '${period.category}', ${period.id})" class="delete-btn">✖ حذف</button></td>
        </tr>`;
    });
    
    html += `</tbody></tr>`;
    document.getElementById(containerId).innerHTML = html;
    
    setTimeout(() => {
        document.querySelectorAll(`.period-line-${tabId}`).forEach(sel => {
            sel.onchange = e => {
                let id = parseInt(e.target.dataset.id);
                let category = e.target.dataset.cat;
                let periodsArr = getPeriodsArray(tabId, category);
                let p = periodsArr.find(p => p.id === id);
                if (p) {
                    p.lineId = e.target.value;
                    setPeriodsArray(tabId, category, periodsArr);
                    refreshPeriodsDisplay(tabId);
                }
            };
        });
        
        document.querySelectorAll(`.period-dray-${tabId}`).forEach(sel => {
            sel.onchange = e => {
                let id = parseInt(e.target.dataset.id);
                let category = e.target.dataset.cat;
                let periodsArr = getPeriodsArray(tabId, category);
                let p = periodsArr.find(p => p.id === id);
                if (p) {
                    p.drayStatus = e.target.value;
                    setPeriodsArray(tabId, category, periodsArr);
                    refreshPeriodsDisplay(tabId);
                }
            };
        });
        
        document.querySelectorAll(`.period-flex-${tabId}`).forEach(sel => {
            sel.onchange = e => {
                let id = parseInt(e.target.dataset.id);
                let category = e.target.dataset.cat;
                let periodsArr = getPeriodsArray(tabId, category);
                let p = periodsArr.find(p => p.id === id);
                if (p) {
                    p.flexString01 = e.target.value;
                    setPeriodsArray(tabId, category, periodsArr);
                    refreshPeriodsDisplay(tabId);
                }
            };
        });
        
        document.querySelectorAll(`.period-start-${tabId}`).forEach(inp => {
            inp.onchange = e => {
                let id = parseInt(e.target.dataset.id);
                let category = e.target.dataset.cat;
                let periodsArr = getPeriodsArray(tabId, category);
                let p = periodsArr.find(p => p.id === id);
                if (p) {
                    p.startDate = e.target.value;
                    setPeriodsArray(tabId, category, periodsArr);
                    refreshPeriodsDisplay(tabId);
                }
            };
        });
        
        document.querySelectorAll(`.period-days-${tabId}`).forEach(inp => {
            inp.onchange = e => {
                let id = parseInt(e.target.dataset.id);
                let category = e.target.dataset.cat;
                let periodsArr = getPeriodsArray(tabId, category);
                let p = periodsArr.find(p => p.id === id);
                if (p) {
                    p.freeDays = parseInt(e.target.value) || 0;
                    setPeriodsArray(tabId, category, periodsArr);
                    e.target.value = p.freeDays;
                }
            };
        });
    }, 100);
}

function refreshPeriodsDisplay(tabId) {
    if (tabId === '1') {
        displayPeriodsList('trshpPeriodsList1', trshpPeriods1, '1');
        displayPeriodsList('exprtPeriodsList1', exprtPeriods1, '1');
    } else if (tabId === '2') {
        displayPeriodsList('strgePeriodsList2', strgePeriods2, '2');
        displayPeriodsList('exprtPeriodsList2', exprtPeriods2, '2');
    } else if (tabId === '3') {
        displayPeriodsList('exprtOnlyPeriodsList3', exprtOnlyPeriods3, '3');
    } else if (tabId === '4') {
        displayPeriodsList('emptyStrgePeriodsList4', emptyStrgePeriods4, '4');
    } else if (tabId === '5') {
        displayPeriodsList('trshpOnlyPeriodsList5', trshpOnlyPeriods5, '5');
    } else if (tabId === '6') {   // ← أضف هذا الشرط
        displayPeriodsList('strgePeriodsList6', strgePeriods6, '6');
        displayPeriodsList('exprtPeriodsList6', exprtPeriods6, '6');
    }
}

window.deletePeriod = function(tabId, category, periodId) {
    let periodsArray = getPeriodsArray(tabId, category);
    periodsArray = periodsArray.filter(p => p.id !== periodId);
    let updated = updateEndDates(periodsArray);
    setPeriodsArray(tabId, category, updated);
    refreshPeriodsDisplay(tabId);
    if (containersMap.size > 0) { 
        if (tabId === '1') processAndDisplay1(); 
        else if (tabId === '2') processAndDisplay2();
        else if (tabId === '3') processAndDisplay3();
        else if (tabId === '4') processAndDisplay4();
        else if (tabId === '5') processAndDisplay5();
        else if (tabId === '6') processAndDisplay6();
    }
};  // ← تأكد من وجود هذا القوس مع الفاصلة المنقوطة

function addNewPeriod(tabId, category) {
    let periodsArray = getPeriodsArray(tabId, category);
    let newId = 1;
    
    if (tabId === '1') {
        if (category === 'TRSHP') { newId = nextIdTrshp1++; }
        else { newId = nextIdExprt1++; }
    } else if (tabId === '2') {
        if (category === 'STRGE') { newId = nextIdStrge2++; }
        else { newId = nextIdExprt2++; }
    } else if (tabId === '3') {
        newId = nextIdExprtOnly3++;
    } else if (tabId === '4') {
        newId = nextIdEmptyStrge4++;
    } else if (tabId === '5') {
        newId = nextIdTrshpOnly5++;
    } else if (tabId === '6') {
        if (category === 'STRGE') { newId = nextIdStrge6++; }
        else { newId = nextIdExprt6++; }
    }
    
    let defaultLineId = "*";
    let defaultDrayStatus = "";
    let defaultFlex = "";
    
    let sameGroupPeriods = periodsArray.filter(p => 
        p.lineId === defaultLineId && 
        (p.drayStatus || "") === defaultDrayStatus && 
        (p.flexString01 || "") === defaultFlex
    );
    
    let lastStart = null;
    if (sameGroupPeriods.length > 0) {
        let lastPeriod = sameGroupPeriods.reduce((max, p) => 
            new Date(p.startDate) > new Date(max.startDate) ? p : max, sameGroupPeriods[0]
        );
        let lastDate = new Date(lastPeriod.startDate);
        lastDate.setDate(lastDate.getDate() + 1);
        lastStart = lastDate.toISOString().split('T')[0];
    } else {
        lastStart = new Date().toISOString().split('T')[0];
    }
    
    let newPeriod = {
        id: newId,
        category: category,
        lineId: defaultLineId,
        drayStatus: defaultDrayStatus,
        flexString01: defaultFlex,
        startDate: lastStart,
        endDate: "",
        freeDays: 0
    };
    
    periodsArray.push(newPeriod);
    setPeriodsArray(tabId, category, periodsArray);
    refreshPeriodsDisplay(tabId);
}

// إضافة خط جديد لجميع التبويبات
document.getElementById("addGlobalLineBtn")?.addEventListener("click", () => {
    let newLine = document.getElementById("newGlobalLineName")?.value.trim();
    if (newLine) {
        if (addNewLineToMasterList(newLine)) {
            document.getElementById("newGlobalLineName").value = "";
            alert(`✅ تم إضافة الخط "${newLine}" بنجاح لجميع التبويبات`);
        } else {
            alert(`⚠️ الخط "${newLine}" موجود مسبقاً`);
        }
    } else {
        alert("❌ الرجاء كتابة اسم الخط");
    }
});

// تهيئة القوائم عند تحميل الصفحة
initializeAllSelects();

function displayExcludeList(containerId, excludes, tabId) {
    let html = '<div style="display:flex; flex-wrap:wrap; gap:10px;">';
    excludes.forEach((line, idx) => {
        html += `<span class="exclude-badge">🚫 ${line} <button onclick="window.removeExclude('${tabId}', ${idx})" style="background:none; border:none; color:#721c24; cursor:pointer;">✖</button></span>`;
    });
    html += '</div>';
    if (excludes.length === 0) html = '<span style="color:#6c757d;">لا توجد خطوط مستثناة</span>';
    document.getElementById(containerId).innerHTML = html;
}

window.removeExclude = function(tabId, idx) {
    if (tabId === '1') {
        excludeLines1.splice(idx, 1);
        localStorage.setItem("excludeLines1", JSON.stringify(excludeLines1));
        displayExcludeList('excludeList1', excludeLines1, '1');
        if (containersMap.size > 0) processAndDisplay1();
    } else if (tabId === '2') {
        excludeLines2.splice(idx, 1);
        localStorage.setItem("excludeLines2", JSON.stringify(excludeLines2));
        displayExcludeList('excludeList2', excludeLines2, '2');
        if (containersMap.size > 0) processAndDisplay2();
    } else if (tabId === '3') {
        excludeLines3.splice(idx, 1);
        localStorage.setItem("excludeLines3", JSON.stringify(excludeLines3));
        displayExcludeList('excludeList3', excludeLines3, '3');
        if (containersMap.size > 0) processAndDisplay3();
    } else if (tabId === '4') {
        excludeLines4.splice(idx, 1);
        localStorage.setItem("excludeLines4", JSON.stringify(excludeLines4));
        displayExcludeList('excludeList4', excludeLines4, '4');
        if (containersMap.size > 0) processAndDisplay4();
    }
};

// ========== الأحداث ==========
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        let activeTabId = btn.dataset.tab;
        let tabNumber = activeTabId.replace('tab', '');
        document.getElementById(activeTabId).classList.add("active");
        
        // تحديث الـ Header بناءً على البيانات المعروضة في التبويب النشط
        if (tabNumber === '1') updateHeaderFromDisplayData('1', currentData1);
        else if (tabNumber === '2') updateHeaderFromDisplayData('2', currentData2);
        else if (tabNumber === '3') updateHeaderFromDisplayData('3', currentData3);
        else if (tabNumber === '4') updateHeaderFromDisplayData('4', currentData4);
        else if (tabNumber === '5') updateHeaderFromDisplayData('5', currentData5);
        else if (tabNumber === '6') updateHeaderFromDisplayData('6', currentData6);
		else if (tabNumber === '7') updateHeaderFromDisplayData('7', currentData7);  // ← أضف هذا

    });
});

// تبويب 1
document.getElementById("settingsBtn1").onclick = () => { 
    document.getElementById("settingsPanel1").style.display = "block"; 
    refreshPeriodsDisplay('1'); 
};
document.getElementById("closeSettings1").onclick = () => { document.getElementById("settingsPanel1").style.display = "none"; };
document.getElementById("addTrshpPeriodBtn1").onclick = () => addNewPeriod('1', 'TRSHP');
document.getElementById("addExprtPeriodBtn1").onclick = () => addNewPeriod('1', 'EXPRT');
document.getElementById("savePeriodsBtn1").onclick = () => {
    let updatedTrshp = updateEndDates(trshpPeriods1);
    let updatedExprt = updateEndDates(exprtPeriods1);
    localStorage.setItem("trshpPeriodsTab1", JSON.stringify(updatedTrshp));
    localStorage.setItem("exprtPeriodsTab1", JSON.stringify(updatedExprt));
    localStorage.setItem("excludeLines1", JSON.stringify(excludeLines1));
    trshpPeriods1 = updatedTrshp;
    exprtPeriods1 = updatedExprt;
    document.getElementById("settingsPanel1").style.display = "none";
    if (containersMap.size > 0) processAndDisplay1();
    document.getElementById("footerMsg").innerHTML = `✅ تم حفظ إعدادات TRSHP/EXPRT`;
};
document.getElementById("addExcludeBtn1").onclick = () => {
    let line = document.getElementById("excludeLine1").value;
    if (line && !excludeLines1.includes(line)) {
        excludeLines1.push(line);
        localStorage.setItem("excludeLines1", JSON.stringify(excludeLines1));
        displayExcludeList('excludeList1', excludeLines1, '1');
        if (containersMap.size > 0) processAndDisplay1();
        document.getElementById("excludeLine1").value = "";
    }
};

// تبويب 2
document.getElementById("settingsBtn2").onclick = () => { 
    document.getElementById("settingsPanel2").style.display = "block"; 
    refreshPeriodsDisplay('2'); 
};
document.getElementById("closeSettings2").onclick = () => { document.getElementById("settingsPanel2").style.display = "none"; };
document.getElementById("addStrgePeriodBtn2").onclick = () => addNewPeriod('2', 'STRGE');
document.getElementById("addExprtPeriodBtn2").onclick = () => addNewPeriod('2', 'EXPRT');
document.getElementById("savePeriodsBtn2").onclick = () => {
    let updatedStrge = updateEndDates(strgePeriods2);
    let updatedExprt = updateEndDates(exprtPeriods2);
    localStorage.setItem("strgePeriodsTab2", JSON.stringify(updatedStrge));
    localStorage.setItem("exprtPeriodsTab2", JSON.stringify(updatedExprt));
    localStorage.setItem("excludeLines2", JSON.stringify(excludeLines2));
    strgePeriods2 = updatedStrge;
    exprtPeriods2 = updatedExprt;
    document.getElementById("settingsPanel2").style.display = "none";
    if (containersMap.size > 0) processAndDisplay2();
    document.getElementById("footerMsg").innerHTML = `✅ تم حفظ إعدادات STRGE/EXPRT`;
};
document.getElementById("addExcludeBtn2").onclick = () => {
    let line = document.getElementById("excludeLine2").value;
    if (line && !excludeLines2.includes(line)) {
        excludeLines2.push(line);
        localStorage.setItem("excludeLines2", JSON.stringify(excludeLines2));
        displayExcludeList('excludeList2', excludeLines2, '2');
        if (containersMap.size > 0) processAndDisplay2();
        document.getElementById("excludeLine2").value = "";
    }
};

// تبويب 3
document.getElementById("settingsBtn3").onclick = () => {
    document.getElementById("settingsPanel3").style.display = "block";
    displayPeriodsList('exprtOnlyPeriodsList3', exprtOnlyPeriods3, '3');
};
document.getElementById("closeSettings3").onclick = () => { document.getElementById("settingsPanel3").style.display = "none"; };
document.getElementById("addExprtOnlyPeriodBtn3").onclick = () => addNewPeriod('3', 'EXPRT');
document.getElementById("savePeriodsBtn3").onclick = () => {
    let updated = updateEndDates(exprtOnlyPeriods3);
    localStorage.setItem("exprtOnlyPeriodsTab3", JSON.stringify(updated));
    localStorage.setItem("excludeLines3", JSON.stringify(excludeLines3));
    exprtOnlyPeriods3 = updated;
    document.getElementById("settingsPanel3").style.display = "none";
    if (containersMap.size > 0) processAndDisplay3();
    document.getElementById("footerMsg").innerHTML = `✅ تم حفظ إعدادات EXPRT فقط`;
};
document.getElementById("addExcludeBtn3").onclick = () => {
    let line = document.getElementById("excludeLine3").value;
    if (line && !excludeLines3.includes(line)) {
        excludeLines3.push(line);
        localStorage.setItem("excludeLines3", JSON.stringify(excludeLines3));
        displayExcludeList('excludeList3', excludeLines3, '3');
        if (containersMap.size > 0) processAndDisplay3();
        document.getElementById("excludeLine3").value = "";
    }
};

// تبويب 4
document.getElementById("settingsBtn4").onclick = () => {
    document.getElementById("settingsPanel4").style.display = "block";
    displayPeriodsList('emptyStrgePeriodsList4', emptyStrgePeriods4, '4');
};
document.getElementById("closeSettings4").onclick = () => { document.getElementById("settingsPanel4").style.display = "none"; };
document.getElementById("addEmptyStrgePeriodBtn4").onclick = () => addNewPeriod('4', 'STRGE');
document.getElementById("savePeriodsBtn4").onclick = () => {
    let updated = updateEndDates(emptyStrgePeriods4);
    localStorage.setItem("emptyStrgePeriodsTab4", JSON.stringify(updated));
    localStorage.setItem("excludeLines4", JSON.stringify(excludeLines4));
    emptyStrgePeriods4 = updated;
    document.getElementById("settingsPanel4").style.display = "none";
    if (containersMap.size > 0) processAndDisplay4();
    document.getElementById("footerMsg").innerHTML = `✅ تم حفظ إعدادات STRGE فارغ`;
};
document.getElementById("addExcludeBtn4").onclick = () => {
    let line = document.getElementById("excludeLine4").value;
    if (line && !excludeLines4.includes(line)) {
        excludeLines4.push(line);
        localStorage.setItem("excludeLines4", JSON.stringify(excludeLines4));
        displayExcludeList('excludeList4', excludeLines4, '4');
        if (containersMap.size > 0) processAndDisplay4();
        document.getElementById("excludeLine4").value = "";
    }
};

// عرض قوائم الاستثناءات
displayExcludeList('excludeList1', excludeLines1, '1');
displayExcludeList('excludeList2', excludeLines2, '2');
displayExcludeList('excludeList3', excludeLines3, '3');
displayExcludeList('excludeList4', excludeLines4, '4');

// الفلاتر والبحث
document.getElementById("searchTab1")?.addEventListener("input", () => {
    if (selectedColumns.tab1 && selectedColumns.tab1.length > 0) {
        renderTable1WithSelectedColumns("bodyTab1", currentData1, "searchTab1", "typeTab1", "statsTab1");
    } else {
        renderTable1WithStats("bodyTab1", currentData1, "searchTab1", "typeTab1", "statsTab1");
    }
});
document.getElementById("typeTab1")?.addEventListener("change", () => {
    if (selectedColumns.tab1 && selectedColumns.tab1.length > 0) {
        renderTable1WithSelectedColumns("bodyTab1", currentData1, "searchTab1", "typeTab1", "statsTab1");
    } else {
        renderTable1WithStats("bodyTab1", currentData1, "searchTab1", "typeTab1", "statsTab1");
    }
});
["searchTab2", "typeTab2"].forEach(id => document.getElementById(id)?.addEventListener("input", () => renderTable2("bodyTab2", currentData2, "searchTab2", "typeTab2", "statsTab2")));
["searchTab3", "typeTab3"].forEach(id => document.getElementById(id)?.addEventListener("input", () => renderTable3("bodyTab3", currentData3, "searchTab3", "typeTab3", "statsTab3")));
["searchTab4", "typeTab4"].forEach(id => document.getElementById(id)?.addEventListener("input", () => renderTable4("bodyTab4", currentData4, "searchTab4", "typeTab4", "statsTab4")));

// أزرار التصدير
document.getElementById("exportBtn1").onclick = () => {
    let ws = XLSX.utils.json_to_sheet(currentData1);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TRSHP_EXPRT");
    XLSX.writeFile(wb, `تقرير_TRSHP_EXPRT_${new Date().toISOString().slice(0,19)}.xlsx`);
};
document.getElementById("exportBtn2").onclick = () => {
    let ws = XLSX.utils.json_to_sheet(currentData2);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "STRGE_EXPRT_IMPRT");
    XLSX.writeFile(wb, `تقرير_STRGE_EXPRT_IMPRT_${new Date().toISOString().slice(0,19)}.xlsx`);
};
document.getElementById("exportBtn3").onclick = () => {
    let ws = XLSX.utils.json_to_sheet(currentData3);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "EXPRT_ONLY");
    XLSX.writeFile(wb, `تقرير_EXPRT_ONLY_${new Date().toISOString().slice(0,19)}.xlsx`);
};
document.getElementById("exportBtn4").onclick = () => {
    let ws = XLSX.utils.json_to_sheet(currentData4);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "EMPTY_STRGE_IMPRT");
    XLSX.writeFile(wb, `تقرير_EMPTY_STRGE_IMPRT_${new Date().toISOString().slice(0,19)}.xlsx`);
};

// زر تصدير جميع التبويبات
// ========== تصدير جميع التبويبات إلى ملف Excel واحد ==========
document.getElementById("exportAllBtn").onclick = () => {
    try {
        let wb = XLSX.utils.book_new();
        
        // تبويب 1
        if (currentData1 && currentData1.length > 0) {
            let ws1 = XLSX.utils.json_to_sheet(currentData1);
            XLSX.utils.book_append_sheet(wb, ws1, "TRSHP_EXPRT");
        } else {
            let ws1 = XLSX.utils.json_to_sheet([{ "ملاحظة": "لا توجد بيانات في هذا التبويب" }]);
            XLSX.utils.book_append_sheet(wb, ws1, "TRSHP_EXPRT");
        }
        
        // تبويب 2
        if (currentData2 && currentData2.length > 0) {
            let ws2 = XLSX.utils.json_to_sheet(currentData2);
            XLSX.utils.book_append_sheet(wb, ws2, "STRGE_EXPRT_IMPRT");
        } else {
            let ws2 = XLSX.utils.json_to_sheet([{ "ملاحظة": "لا توجد بيانات في هذا التبويب" }]);
            XLSX.utils.book_append_sheet(wb, ws2, "STRGE_EXPRT_IMPRT");
        }
        
        // تبويب 3
        if (currentData3 && currentData3.length > 0) {
            let ws3 = XLSX.utils.json_to_sheet(currentData3);
            XLSX.utils.book_append_sheet(wb, ws3, "EXPRT_ONLY");
        } else {
            let ws3 = XLSX.utils.json_to_sheet([{ "ملاحظة": "لا توجد بيانات في هذا التبويب" }]);
            XLSX.utils.book_append_sheet(wb, ws3, "EXPRT_ONLY");
        }
        
        // تبويب 4
        if (currentData4 && currentData4.length > 0) {
            let ws4 = XLSX.utils.json_to_sheet(currentData4);
            XLSX.utils.book_append_sheet(wb, ws4, "EMPTY_STRGE");
        } else {
            let ws4 = XLSX.utils.json_to_sheet([{ "ملاحظة": "لا توجد بيانات في هذا التبويب" }]);
            XLSX.utils.book_append_sheet(wb, ws4, "EMPTY_STRGE");
        }
        
        // ========== تبويب 5 (مضاف جديد) ==========
        if (currentData5 && currentData5.length > 0) {
            let ws5 = XLSX.utils.json_to_sheet(currentData5);
            XLSX.utils.book_append_sheet(wb, ws5, "TRSHP_ONLY");
        } else {
            let ws5 = XLSX.utils.json_to_sheet([{ "ملاحظة": "لا توجد بيانات في هذا التبويب" }]);
            XLSX.utils.book_append_sheet(wb, ws5, "TRSHP_ONLY");
        }
		// تبويب 6
		if (currentData6 && currentData6.length > 0) {
			let ws6 = XLSX.utils.json_to_sheet(currentData6);
			XLSX.utils.book_append_sheet(wb, ws6, "STRGE_EXPRT_ONLY");
		} else {
			let ws6 = XLSX.utils.json_to_sheet([{ "ملاحظة": "لا توجد بيانات في هذا التبويب" }]);
			XLSX.utils.book_append_sheet(wb, ws6, "STRGE_EXPRT_ONLY");
		}
		// تبويب 7
if (currentData7 && currentData7.length > 0) {
    let ws7 = XLSX.utils.json_to_sheet(currentData7);
    XLSX.utils.book_append_sheet(wb, ws7, "IMPRT_FORWARD");
} else {
    let ws7 = XLSX.utils.json_to_sheet([{ "ملاحظة": "لا توجد بيانات في هذا التبويب" }]);
    XLSX.utils.book_append_sheet(wb, ws7, "IMPRT_FORWARD");
}
        
        // إحصائيات
        let statsData = [];
        if (currentData1.length > 0) {
            let totalTrshpNet = currentData1.reduce((s, i) => s + (i["TRSHP Net"] || 0), 0);
            let totalExprtNet = currentData1.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
            statsData.push({
                "التبويب": "TRSHP + EXPRT",
                "عدد الحاويات": currentData1.length,
                "إجمالي TRSHP": totalTrshpNet,
                "إجمالي EXPRT": totalExprtNet,
                "الإجمالي الكلي": totalTrshpNet + totalExprtNet
            });
        }
        if (currentData2.length > 0) {
            let totalStrgeNet = currentData2.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
            let totalExprtNet = currentData2.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
            statsData.push({
                "التبويب": "STRGE + EXPRT + IMPRT",
                "عدد الحاويات": currentData2.length,
                "إجمالي STRGE": totalStrgeNet,
                "إجمالي EXPRT": totalExprtNet,
                "الإجمالي الكلي": totalStrgeNet + totalExprtNet
            });
        }
        if (currentData3.length > 0) {
            statsData.push({
                "التبويب": "EXPRT فقط",
                "عدد الحاويات": currentData3.length,
                "إجمالي EXPRT": currentData3.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0),
                "الإجمالي الكلي": currentData3.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0)
            });
        }
        if (currentData4.length > 0) {
            statsData.push({
                "التبويب": "STRGE فارغ (MTY)",
                "عدد الحاويات": currentData4.length,
                "إجمالي STRGE": currentData4.reduce((s, i) => s + (i["STRGE Net"] || 0), 0),
                "الإجمالي الكلي": currentData4.reduce((s, i) => s + (i["STRGE Net"] || 0), 0)
            });
        }
        // ========== إحصائيات تبويب 5 (مضاف جديد) ==========
        if (currentData5.length > 0) {
            statsData.push({
                "التبويب": "TRSHP فقط",
                "عدد الحاويات": currentData5.length,
                "إجمالي TRSHP": currentData5.reduce((s, i) => s + (i["TRSHP Net"] || 0), 0),
                "الإجمالي الكلي": currentData5.reduce((s, i) => s + (i["TRSHP Net"] || 0), 0)
            });
        }
		
		if (currentData6.length > 0) {
			statsData.push({
				"التبويب": "STRGE + EXPRT فقط",
				"عدد الحاويات": currentData6.length,
				"إجمالي STRGE": currentData6.reduce((s, i) => s + (i["STRGE Net"] || 0), 0),
				"إجمالي EXPRT": currentData6.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0),
				"الإجمالي الكلي": currentData6.reduce((s, i) => s + (i["Total Net"] || 0), 0)
			});
			
			if (currentData7.length > 0) {
    statsData.push({
        "التبويب": "IMPRT + FORWARD",
        "عدد الحاويات": currentData7.length,
        "إجمالي FORWARD": currentData7.filter(i => i["نوع"] === "FORWARD").reduce((s, i) => s + (i["Net"] || 0), 0),
        "إجمالي IMPRT (VESSEL)": currentData7.filter(i => i["نوع"] === "IMPRT (VESSEL)").reduce((s, i) => s + (i["Net"] || 0), 0),
        "الإجمالي الكلي": currentData7.reduce((s, i) => s + (i["Net"] || 0), 0)
    });
}
}
        
        if (statsData.length > 0) {
            let wsStats = XLSX.utils.json_to_sheet(statsData);
            XLSX.utils.book_append_sheet(wb, wsStats, "الإحصائيات");
        }
        
        let fileName = `تقرير_جميع_التبويبات_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        localStorage.setItem("lastExportFileName", fileName);
        document.getElementById("footerMsg").innerHTML = `✅ تم تصدير جميع التبويبات إلى ملف: ${fileName}`;
        
    } catch(err) {
        console.error(err);
        document.getElementById("footerMsg").innerHTML = `❌ خطأ في التصدير: ${err.message}`;
    }
};

// زر اختيار الأعمدة
document.getElementById("selectColumnsBtn1").onclick = () => openColumnModal('tab1');

// تحميل آخر ملف عند فتح الصفحة
setTimeout(() => {
    loadLastFileFromStorage();
}, 500);



// ===== تطبيق تفضيلات الأعمدة المحفوظة تلقائياً عند تحميل الصفحة =====
// ========== تطبيق تفضيلات الأعمدة المحفوظة على جميع التبويبات ==========
function applySavedColumnPreferences() {
    // التبويب 1
    if (selectedColumns.tab1 && selectedColumns.tab1.length > 0 && currentData1.length > 0) {
        renderTable1WithSelectedColumns("bodyTab1", currentData1, "searchTab1", "typeTab1", "statsTab1");
    } else if (currentData1.length > 0) {
        renderTable1WithStats("bodyTab1", currentData1, "searchTab1", "typeTab1", "statsTab1");
    }
    
    // التبويب 2
    if (selectedColumns.tab2 && selectedColumns.tab2.length > 0 && currentData2.length > 0) {
        if (typeof renderTable2WithSelectedColumns === 'function') {
            renderTable2WithSelectedColumns("bodyTab2", currentData2, "searchTab2", "typeTab2", "statsTab2");
        }
    } else if (currentData2.length > 0) {
        renderTable2("bodyTab2", currentData2, "searchTab2", "typeTab2", "statsTab2");
    }
    
    // التبويب 3
    if (selectedColumns.tab3 && selectedColumns.tab3.length > 0 && currentData3.length > 0) {
        if (typeof renderTable3WithSelectedColumns === 'function') {
            renderTable3WithSelectedColumns("bodyTab3", currentData3, "searchTab3", "typeTab3", "statsTab3");
        }
    } else if (currentData3.length > 0) {
        renderTable3("bodyTab3", currentData3, "searchTab3", "typeTab3", "statsTab3");
    }
    
    // التبويب 4
    if (selectedColumns.tab4 && selectedColumns.tab4.length > 0 && currentData4.length > 0) {
        if (typeof renderTable4WithSelectedColumns === 'function') {
            renderTable4WithSelectedColumns("bodyTab4", currentData4, "searchTab4", "typeTab4", "statsTab4");
        }
    } else if (currentData4.length > 0) {
        renderTable4("bodyTab4", currentData4, "searchTab4", "typeTab4", "statsTab4");
    }
    
    // ←←← التبويب 5 ←←←
    if (selectedColumns.tab5 && selectedColumns.tab5.length > 0 && currentData5.length > 0) {
        if (typeof renderTable5WithSelectedColumns === 'function') {
            renderTable5WithSelectedColumns("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
        }
    } else if (currentData5.length > 0) {
        renderTable5("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
    }
	
	// التبويب 6
    if (selectedColumns.tab6 && selectedColumns.tab6.length > 0 && currentData6.length > 0) {
        renderTable6WithSelectedColumns("bodyTab6", currentData6, "searchTab6", "typeTab6", "statsTab6");
    } else if (currentData6.length > 0) {
        renderTable6("bodyTab6", currentData6, "searchTab6", "typeTab6", "statsTab6");
    }
}

// استدعاء الدالة بعد تحميل البيانات
// تعديل دالة معالجة الملف لإضافة تطبيق التفضيلات بعد التحميل
const originalProcessAndDisplay1 = processAndDisplay1;
window.processAndDisplay1 = function() {
    originalProcessAndDisplay1();
    // بعد عرض البيانات، تحقق من التفضيلات المحفوظة
    setTimeout(() => {
        if (selectedColumns.tab1 && selectedColumns.tab1.length > 0) {
            renderTable1WithSelectedColumns("bodyTab1", currentData1, "searchTab1", "typeTab1", "statsTab1");
        }
    }, 100);
};

// أو بشكل أبسط: استدعاء التفضيلات بعد تحميل الصفحة مباشرة
document.addEventListener("DOMContentLoaded", function() {
    // إذا كانت هناك بيانات بالفعل (مثلاً من تحميل سابق)
    if (currentData1.length > 0 && selectedColumns.tab1 && selectedColumns.tab1.length > 0) {
        renderTable1WithSelectedColumns("bodyTab1", currentData1, "searchTab1", "typeTab1", "statsTab1");
    }
});

// تحميل آخر ملف تم حفظه عند فتح الصفحة
setTimeout(() => {
    loadLastFileFromStorage();
}, 500);

// دالة لحفظ الملف مع اختيار المسار (تظهر نافذة حفظ المتصفح)
function exportAllWithPath() {
    try {
        let wb = XLSX.utils.book_new();
        
        // إضافة Sheets (نفس الكود أعلاه)
        if (currentData1 && currentData1.length > 0) {
            let ws1 = XLSX.utils.json_to_sheet(currentData1);
            XLSX.utils.book_append_sheet(wb, ws1, "TRSHP_EXPRT");
        }
        if (currentData2 && currentData2.length > 0) {
            let ws2 = XLSX.utils.json_to_sheet(currentData2);
            XLSX.utils.book_append_sheet(wb, ws2, "STRGE_EXPRT_IMPRT");
        }
        if (currentData3 && currentData3.length > 0) {
            let ws3 = XLSX.utils.json_to_sheet(currentData3);
            XLSX.utils.book_append_sheet(wb, ws3, "EXPRT_ONLY");
        }
        if (currentData4 && currentData4.length > 0) {
            let ws4 = XLSX.utils.json_to_sheet(currentData4);
            XLSX.utils.book_append_sheet(wb, ws4, "EMPTY_STRGE");
        }
        
        let fileName = `تقرير_جميع_التبويبات_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        localStorage.setItem("lastExportFileName", fileName);
        document.getElementById("footerMsg").innerHTML = `✅ تم التصدير إلى: ${fileName}`;
        
    } catch(err) {
        console.error(err);
        document.getElementById("footerMsg").innerHTML = `❌ خطأ: ${err.message}`;
    }
}

function printReport(tabId, title) {
    // الحصول على محتوى التبويب النشط
    let activeTab = document.getElementById(tabId);
    if (!activeTab) {
        console.error("التبويب غير موجود:", tabId);
        return;
    }
    
    // نسخ محتوى الإحصائيات والجدول
    let statsClone = activeTab.querySelector('.stats');
    let tableClone = activeTab.querySelector('table');
    
    if (!tableClone) {
        console.error("الجدول غير موجود");
        return;
    }
    
    // نسخ عميق للمحتوى
    let statsContent = statsClone ? statsClone.cloneNode(true) : null;
    let tableContent = tableClone.cloneNode(true);
    
    // ========== إعادة بناء الجدول مع الترقيم ==========
    if (tableContent) {
        // إزالة sticky
        let thead = tableContent.querySelector('thead');
        let allTh = tableContent.querySelectorAll('th');
        if (thead) thead.style.position = 'static';
        allTh.forEach(th => th.style.position = 'static');
        
        // إضافة عمود "م" في الرأس
        let headerRow = tableContent.querySelector('thead tr');
        if (headerRow) {
            let existingSerial = headerRow.querySelector('.serial-header');
            if (existingSerial) existingSerial.remove();
            
            let th = document.createElement('th');
            th.textContent = 'م';
            th.style.width = '35px';
            th.style.backgroundColor = '#0a3d62';
            th.style.color = 'white';
            th.style.textAlign = 'center';
            th.style.fontWeight = 'bold';
            th.style.border = '1px solid #0a3d62';
            th.classList.add('serial-header');
            headerRow.insertBefore(th, headerRow.firstChild);
        }
        
        // إضافة الأرقام التسلسلية
        let rows = tableContent.querySelectorAll('tbody tr');
        rows.forEach((row, idx) => {
            let existingCell = row.querySelector('.serial-cell');
            if (existingCell) existingCell.remove();
            
            let td = document.createElement('td');
            td.textContent = idx + 1;
            td.style.fontWeight = 'bold';
            td.style.backgroundColor = '#f8f9fa';
            td.style.textAlign = 'center';
            td.style.width = '35px';
            td.style.border = '1px solid #dee2e6';
            td.classList.add('serial-cell');
            row.insertBefore(td, row.firstChild);
        });
    }
    
    // الحصول على بيانات الرأس
// محاولة جلب البيانات من الصفحة
let headerCarrierName = document.getElementById("headerCarrierName")?.innerText;
let headerShippingDate = document.getElementById("headerShippingDate")?.innerText;
let headerLineId = document.getElementById("headerLineId")?.innerText;

// إذا لم يتم العثور على البيانات، استخدم القيم الافتراضية
if (!headerCarrierName || headerCarrierName === "—") {
    headerCarrierName = "MSC JADE";
}
if (!headerShippingDate || headerShippingDate === "—") {
    headerShippingDate = "2026/05/05";
}
if (!headerLineId || headerLineId === "—") {
    headerLineId = "MSC";
}

console.log("Carrier Name:", headerCarrierName);
console.log("Shipping Date:", headerShippingDate);
console.log("Line ID:", headerLineId);
    
    let currentDate = new Date().toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
        alert("الرجاء السماح للنوافذ المنبثقة لاستخدام خاصية الطباعة");
        return;
    }
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                * {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    box-sizing: border-box;
                }
                body {
                    padding: 15px;
                    margin: 0;
                    background: white;
                    direction: rtl;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                
                /* ========== رأس الصفحة (بدون position: fixed) ========== */
                .report-header {
                    text-align: center;
                    margin-bottom: 15px;
                    padding: 5px 0 10px 0;
                    border-bottom: 2px solid #0a3d62;
                    background: white;
                }
                .report-header h1 {
                    color: #0a3d62;
                    margin: 0;
                    font-size: 16px;
                }
                .report-title-line {
                    color: #1e6f5c;
                    font-size: 12px;
                    font-weight: bold;
                    margin: 5px 0 0 0;
                }
                
                .report-date {
                    text-align: left;
                    font-size: 10px;
                    color: #6c757d;
                    margin-bottom: 10px;
                }
                
                /* ========== الجدول ========== */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9px;
                    direction: ltr;
                }
                th {
                    background: #0a3d62;
                    color: white;
                    padding: 6px 4px;
                    border: 1px solid #0a3d62;
                    text-align: center;
                }
                td {
                    padding: 5px 4px;
                    border: 1px solid #dee2e6;
                    text-align: center;
                }
                
                /* عمود الترقيم */
                th:first-child, td:first-child {
                    width: 35px;
                }
                td:first-child {
                    background-color: #f8f9fa;
                    font-weight: bold;
                }
                
                /* الإحصائيات */
                .stats {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                    flex-wrap: wrap;
                }
                .stat-card {
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    padding: 6px;
                    text-align: center;
                    flex: 1;
                    background: #f8f9fa;
                }
                .stat-card .number {
                    font-size: 16px;
                    font-weight: bold;
                    color: #0a3d62;
                }
                .stat-card h3 {
                    font-size: 10px;
                    margin: 0;
                }
                
                /* ========== التوقيعات (بدون position: fixed) ========== */
                .signatures {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #0a3d62;
                }
                .signatures > div {
                    text-align: center;
                    flex: 1;
                }
                .signatures > div > div:first-child {
                    height: 35px;
                    border-bottom: 1px solid #000;
                    margin-bottom: 5px;
                }
                
                .footer {
                    margin-top: 15px;
                    text-align: center;
                    font-size: 9px;
                    color: #6c757d;
                    padding-top: 5px;
                }
                
                /* تكرار رأس الجدول في كل صفحة */
                thead {
                    display: table-header-group;
                }
                tr {
                    break-inside: avoid;
                }
                
                /* إعدادات الطباعة */
                @media print {
                    body {
                        margin: 0;
                        padding: 8px;
                    }
                    
                    /* إخفاء عناصر التحكم */
                    .upload-area, .tabs, .settings-btn, .filters, .btn-container,
                    .export-btn, .print-btn, .note, .settings-panel, .modal,
                    .file-label, .export-all-btn, #currentFileName {
                        display: none !important;
                    }
                    
                    @page {
                        size: A4 portrait;;
                        margin: 1cm;
                    }
                }
            </style>
        </head>
        <body>
			<div class="report-header">
				<h1>📦 تقرير أيام التخزين</h1>
				<div class="report-title-line">
					${title}
				</div>
			</div>
         
            <div class="report-date">📅 تاريخ الطباعة: ${currentDate}</div>
            
            <div id="statsPrint"></div>
            <div id="tablePrint"></div>
            
            <div class="signatures">
                <div>
                    <div></div>
                    <strong>Signature</strong>
                    <div style="margin-top:5px;">Head of Operations</div>
                </div>
                <div>
                    <div></div>
                    <strong>Signature</strong>
                    <div style="margin-top:5px;">Document Auditor</div>
                </div>
                <div>
                    <div></div>
                    <strong>Signature</strong>
                    <div style="margin-top:5px;">Line Clerk</div>
                </div>
            </div>
            
            <div class="footer">تم إنشاؤه بواسطة نظام التخزين - تقرير تلقائي</div>
            
            <script>
                if (${!!statsContent}) {
                    document.getElementById('statsPrint').innerHTML = ${JSON.stringify(statsContent ? statsContent.outerHTML : '')};
                }
                document.getElementById('tablePrint').innerHTML = ${JSON.stringify(tableContent.outerHTML)};
                
                window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                };
            <\/script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// تبويب 1
document.getElementById("printBtn1").onclick = function() {
    let carrier = document.getElementById("headerCarrierName")?.innerText || "—";
    let date = document.getElementById("headerShippingDate")?.innerText || "—";
    let line = document.getElementById("headerLineId")?.innerText || "—";
    printReport('tab1', `تقرير TRSHP + EXPRT | 🚢 ${carrier} | 📅 ${date} | 🏷️ ${line}`);
};

function renderTable2WithSelectedColumns(tbodyId, data, searchId, typeId, statsId) {
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    let selected = selectedColumns.tab2;
    if (selected.length === 0) {
        selected = availableColumnsTab2.tab2.filter(c => c.default).map(c => c.name);
    }
    
    let thead = document.querySelector('#tableTab2 thead tr');
    if (thead) {
        thead.innerHTML = '';
        selected.forEach(colName => {
            let col = availableColumnsTab2.tab2.find(c => c.name === colName);
            let th = document.createElement('th');
            th.textContent = col ? col.label : colName;
            thead.appendChild(th);
        });
    }
    
    let tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${selected.length}" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات<\/td><\/tr>`;
        return;
    }
    
    for (let item of filtered) {
        let row = tbody.insertRow();
        selected.forEach(colName => {
            let cell = row.insertCell();
            let value = item[colName];
            
            if (["Is OOG", "Is Refrigerated", "Is Bundled", "Is Hazardous"].includes(colName)) {
                cell.textContent = value === "true" ? "✅" : "❌";
            } else if (colName === "نوع IMPRT") {
                if (value === "IMPRT") {
                    cell.innerHTML = '<span style="background:#e0f2fe; padding:2px 8px; border-radius:12px;">📥 IMPRT</span>';
                } else {
                    cell.innerHTML = '<span style="background:#fef3c7; padding:2px 8px; border-radius:12px;">🔄 TRSHP-RETURN</span>';
                }
            } else if (colName === "Flex String 01") {
                if (value === "TRUE") {
                    cell.innerHTML = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
                } else if (value === "FALSE") {
                    cell.innerHTML = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
                } else {
                    cell.textContent = "—";
                }
            } else {
                cell.textContent = value || "—";
            }
        });
    }
    
    let statsDiv = document.getElementById(statsId);
    if (statsDiv && statsDiv.innerHTML === "") {
        statsDiv.innerHTML = renderAdvancedStatsTab2(data);
        statsDiv.style.display = "block";
    }
}

function openColumnModalTab2() {
    let modal = document.getElementById('columnModal');
    let body = document.getElementById('columnModalBody');
    
    let html = `<div class="select-all">
        <label style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="selectAllColumns"> <strong>تحديد الكل</strong>
        </label>
    </div>`;
    
    let cols = availableColumnsTab2.tab2;
    if (cols) {
        cols.forEach(col => {
            let isChecked = selectedColumns.tab2.includes(col.name) || 
                           (selectedColumns.tab2.length === 0 && col.default);
            html += `
                <div class="column-option">
                    <input type="checkbox" class="col-checkbox" value="${col.name}" id="col_${col.name.replace(/ /g, '_')}" ${isChecked ? 'checked' : ''}>
                    <label for="col_${col.name.replace(/ /g, '_')}">${col.label}</label>
                </div>
            `;
        });
    }
    
    body.innerHTML = html;
    modal.classList.add('active');
    
    document.getElementById('selectAllColumns').onchange = (e) => {
        document.querySelectorAll('.col-checkbox').forEach(cb => cb.checked = e.target.checked);
    };
    
    document.getElementById('applyColumnSelection').onclick = () => {
        let selected = [];
        document.querySelectorAll('.col-checkbox:checked').forEach(cb => selected.push(cb.value));
        selectedColumns.tab2 = selected;
        localStorage.setItem(`selectedColumns_tab2`, JSON.stringify(selected));
        closeColumnModal();
        renderTable2WithSelectedColumns('bodyTab2', currentData2, 'searchTab2', 'typeTab2', 'statsTab2');
    };
}

// تبويب 2
document.getElementById("printBtn2").onclick = () => {
    let carrier = document.getElementById("headerCarrierName")?.innerText || "—";
    let date = document.getElementById("headerShippingDate")?.innerText || "—";
    let line = document.getElementById("headerLineId")?.innerText || "—";
    printReport('tab2', `تقرير STRGE + EXPRT + IMPRT | 🚢 ${carrier} | 📅 ${date} | 🏷️ ${line}`);
};
document.getElementById("selectColumnsBtn2").onclick = () => openColumnModalTab2();

// فلترة التبويب 2 (تعديل لاستخدام الدوال الصحيحة)
document.getElementById("searchTab2")?.addEventListener("input", () => {
    if (selectedColumns.tab2 && selectedColumns.tab2.length > 0) {
        renderTable2WithSelectedColumns("bodyTab2", currentData2, "searchTab2", "typeTab2", "statsTab2");
    } else {
        renderTable2("bodyTab2", currentData2, "searchTab2", "typeTab2", "statsTab2");
    }
});
document.getElementById("typeTab2")?.addEventListener("change", () => {
    if (selectedColumns.tab2 && selectedColumns.tab2.length > 0) {
        renderTable2WithSelectedColumns("bodyTab2", currentData2, "searchTab2", "typeTab2", "statsTab2");
    } else {
        renderTable2("bodyTab2", currentData2, "searchTab2", "typeTab2", "statsTab2");
    }
});

function renderTable3WithSelectedColumns(tbodyId, data, searchId, typeId, statsId) {
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    let selected = selectedColumns.tab3;
    if (selected.length === 0) {
        selected = availableColumnsTab3.tab3.filter(c => c.default).map(c => c.name);
    }
    
    let thead = document.querySelector('#tableTab3 thead tr');
    if (thead) {
        thead.innerHTML = '';
        selected.forEach(colName => {
            let col = availableColumnsTab3.tab3.find(c => c.name === colName);
            let th = document.createElement('th');
            th.textContent = col ? col.label : colName;
            thead.appendChild(th);
        });
    }
    
    let tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${selected.length}" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات<\/td><\/tr>`;
        return;
    }
    
    for (let item of filtered) {
        let row = tbody.insertRow();
        selected.forEach(colName => {
            let cell = row.insertCell();
            let value = item[colName];
            
            if (["Is OOG", "Is Refrigerated", "Is Bundled", "Is Hazardous"].includes(colName)) {
                cell.textContent = value === "true" ? "✅" : "❌";
            } else if (colName === "Flex String 01") {
                if (value === "TRUE") {
                    cell.innerHTML = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
                } else if (value === "FALSE") {
                    cell.innerHTML = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
                } else {
                    cell.textContent = "—";
                }
            } else if (colName === "طريقة الحساب") {
                let methodClass = value === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
                cell.innerHTML = `<span class="${methodClass}">${value || "—"}</span>`;
            } else {
                cell.textContent = value || "—";
            }
        });
    }
    
    let statsDiv = document.getElementById(statsId);
    if (statsDiv && statsDiv.innerHTML === "") {
        statsDiv.innerHTML = renderAdvancedStatsTab3(data);
        statsDiv.style.display = "block";
    }
}

function renderTable4WithSelectedColumns(tbodyId, data, searchId, typeId, statsId) {
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    let selected = selectedColumns.tab4;
    if (selected.length === 0) {
        selected = availableColumnsTab4.tab4.filter(c => c.default).map(c => c.name);
    }
    
    let thead = document.querySelector('#tableTab4 thead tr');
    if (thead) {
        thead.innerHTML = '';
        selected.forEach(colName => {
            let col = availableColumnsTab4.tab4.find(c => c.name === colName);
            let th = document.createElement('th');
            th.textContent = col ? col.label : colName;
            thead.appendChild(th);
        });
    }
    
    let tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${selected.length}" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات<\/td><\/tr>`;
        return;
    }
    
    for (let item of filtered) {
        let row = tbody.insertRow();
        selected.forEach(colName => {
            let cell = row.insertCell();
            let value = item[colName];
            
            if (["Is OOG", "Is Refrigerated", "Is Bundled", "Is Hazardous"].includes(colName)) {
                cell.textContent = value === "true" ? "✅" : "❌";
            } else if (colName === "Flex String 01") {
                if (value === "TRUE") {
                    cell.innerHTML = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
                } else if (value === "FALSE") {
                    cell.innerHTML = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
                } else {
                    cell.textContent = "—";
                }
            } else if (colName === "طريقة الحساب") {
                let methodClass = value === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
                cell.innerHTML = `<span class="${methodClass}">${value || "—"}</span>`;
            } else {
                cell.textContent = value || "—";
            }
        });
    }
    
    let statsDiv = document.getElementById(statsId);
    if (statsDiv && statsDiv.innerHTML === "") {
        statsDiv.innerHTML = renderAdvancedStatsTab4(data);
        statsDiv.style.display = "block";
    }
}

function openColumnModalTab3() {
    let modal = document.getElementById('columnModal');
    let body = document.getElementById('columnModalBody');
    
    let html = `<div class="select-all">
        <label style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="selectAllColumns"> <strong>تحديد الكل</strong>
        </label>
    </div>`;
    
    let cols = availableColumnsTab3.tab3;
    if (cols) {
        cols.forEach(col => {
            let isChecked = selectedColumns.tab3.includes(col.name) || 
                           (selectedColumns.tab3.length === 0 && col.default);
            html += `
                <div class="column-option">
                    <input type="checkbox" class="col-checkbox" value="${col.name}" id="col_${col.name.replace(/ /g, '_')}" ${isChecked ? 'checked' : ''}>
                    <label for="col_${col.name.replace(/ /g, '_')}">${col.label}</label>
                </div>
            `;
        });
    }
    
    body.innerHTML = html;
    modal.classList.add('active');
    
    document.getElementById('selectAllColumns').onchange = (e) => {
        document.querySelectorAll('.col-checkbox').forEach(cb => cb.checked = e.target.checked);
    };
    
    document.getElementById('applyColumnSelection').onclick = () => {
        let selected = [];
        document.querySelectorAll('.col-checkbox:checked').forEach(cb => selected.push(cb.value));
        selectedColumns.tab3 = selected;
        localStorage.setItem(`selectedColumns_tab3`, JSON.stringify(selected));
        closeColumnModal();
        renderTable3WithSelectedColumns('bodyTab3', currentData3, 'searchTab3', 'typeTab3', 'statsTab3');
    };
}

function openColumnModalTab4() {
    let modal = document.getElementById('columnModal');
    let body = document.getElementById('columnModalBody');
    
    let html = `<div class="select-all">
        <label style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="selectAllColumns"> <strong>تحديد الكل</strong>
        </label>
    </div>`;
    
    let cols = availableColumnsTab4.tab4;
    if (cols) {
        cols.forEach(col => {
            let isChecked = selectedColumns.tab4.includes(col.name) || 
                           (selectedColumns.tab4.length === 0 && col.default);
            html += `
                <div class="column-option">
                    <input type="checkbox" class="col-checkbox" value="${col.name}" id="col_${col.name.replace(/ /g, '_')}" ${isChecked ? 'checked' : ''}>
                    <label for="col_${col.name.replace(/ /g, '_')}">${col.label}</label>
                </div>
            `;
        });
    }
    
    body.innerHTML = html;
    modal.classList.add('active');
    
    document.getElementById('selectAllColumns').onchange = (e) => {
        document.querySelectorAll('.col-checkbox').forEach(cb => cb.checked = e.target.checked);
    };
    
    document.getElementById('applyColumnSelection').onclick = () => {
        let selected = [];
        document.querySelectorAll('.col-checkbox:checked').forEach(cb => selected.push(cb.value));
        selectedColumns.tab4 = selected;
        localStorage.setItem(`selectedColumns_tab4`, JSON.stringify(selected));
        closeColumnModal();
        renderTable4WithSelectedColumns('bodyTab4', currentData4, 'searchTab4', 'typeTab4', 'statsTab4');
    };
}

// تبويب 3
document.getElementById("printBtn3").onclick = () => {
    let carrier = document.getElementById("headerCarrierName")?.innerText || "—";
    let date = document.getElementById("headerShippingDate")?.innerText || "—";
    let line = document.getElementById("headerLineId")?.innerText || "—";
    printReport('tab3', `تقرير EXPRT فقط | 🚢 ${carrier} | 📅 ${date} | 🏷️ ${line}`);
};
document.getElementById("selectColumnsBtn3").onclick = () => openColumnModalTab3();

// فلترة التبويب 3
document.getElementById("searchTab3")?.addEventListener("input", () => {
    if (selectedColumns.tab3 && selectedColumns.tab3.length > 0) {
        renderTable3WithSelectedColumns("bodyTab3", currentData3, "searchTab3", "typeTab3", "statsTab3");
    } else {
        renderTable3("bodyTab3", currentData3, "searchTab3", "typeTab3", "statsTab3");
    }
});
document.getElementById("typeTab3")?.addEventListener("change", () => {
    if (selectedColumns.tab3 && selectedColumns.tab3.length > 0) {
        renderTable3WithSelectedColumns("bodyTab3", currentData3, "searchTab3", "typeTab3", "statsTab3");
    } else {
        renderTable3("bodyTab3", currentData3, "searchTab3", "typeTab3", "statsTab3");
    }
});

// أزرار التبويب 4
document.getElementById("printBtn4").onclick = () => {
    let carrier = document.getElementById("headerCarrierName")?.innerText || "—";
    let date = document.getElementById("headerShippingDate")?.innerText || "—";
    let line = document.getElementById("headerLineId")?.innerText || "—";
    printReport('tab4', `تقرير STRGE فارغ (MTY) + IMPRT | 🚢 ${carrier} | 📅 ${date} | 🏷️ ${line}`);
};
document.getElementById("selectColumnsBtn4").onclick = () => openColumnModalTab4();

// فلترة التبويب 4
document.getElementById("searchTab4")?.addEventListener("input", () => {
    if (selectedColumns.tab4 && selectedColumns.tab4.length > 0) {
        renderTable4WithSelectedColumns("bodyTab4", currentData4, "searchTab4", "typeTab4", "statsTab4");
    } else {
        renderTable4("bodyTab4", currentData4, "searchTab4", "typeTab4", "statsTab4");
    }
});
document.getElementById("typeTab4")?.addEventListener("change", () => {
    if (selectedColumns.tab4 && selectedColumns.tab4.length > 0) {
        renderTable4WithSelectedColumns("bodyTab4", currentData4, "searchTab4", "typeTab4", "statsTab4");
    } else {
        renderTable4("bodyTab4", currentData4, "searchTab4", "typeTab4", "statsTab4");
    }
});

function renderAdvancedStatsTab2(data) {
    if (!data || data.length === 0) {
        return `<div style="padding:20px; text-align:center;">لا توجد بيانات</div>`;
    }
    
    // ========== تجميع الحاويات الفريدة حسب رقم الحاوية ==========
    let uniqueContainers = new Map();
    
    for (let item of data) {
        let containerNo = item["Container No."];
        if (!uniqueContainers.has(containerNo)) {
            uniqueContainers.set(containerNo, {
                "Container No.": containerNo,
                "Size": item["Size"],
                "Is Refrigerated": item["Is Refrigerated"],
                "Is OOG": item["Is OOG"],
                "Is Hazardous": item["Is Hazardous"],
                "Flex String 01": item["Flex String 01"],
                "Dray Status": item["Dray Status"] || "",
                "STRGE Net": item["STRGE Net"] || 0,
                "EXPRT Net": item["EXPRT Net"] || 0,
                "EXPRT Days": item["EXPRT Days"] || 0
            });
        } else {
            // دمج القيم إذا وجدت أكثر من فترة لنفس الحاوية
            let existing = uniqueContainers.get(containerNo);
            existing["STRGE Net"] += item["STRGE Net"] || 0;
            existing["EXPRT Net"] += item["EXPRT Net"] || 0;
            existing["EXPRT Days"] += item["EXPRT Days"] || 0;
        }
    }
    
    let uniqueData = Array.from(uniqueContainers.values());
    
    let totalStrgeNet = uniqueData.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let totalExprtNet = uniqueData.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    // Flex String 01
    let flexTrueContainers = uniqueData.filter(i => i["Flex String 01"] === "TRUE");
    let flexTrueExprtNet = flexTrueContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let flexTrueCount = flexTrueContainers.length;
    
    let flexFalseContainers = uniqueData.filter(i => i["Flex String 01"] === "FALSE");
    let flexFalseExprtNet = flexFalseContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let flexFalseCount = flexFalseContainers.length;
    
    // Dray Status
    let exprtNoDray = uniqueData.filter(i => (i["Dray Status"] || "") === "");
    let exprtNoDrayNet = exprtNoDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let exprtNoDrayCount = exprtNoDray.length;
    
    let exprtWithDray = uniqueData.filter(i => (i["Dray Status"] || "") !== "");
    let exprtWithDrayNet = exprtWithDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let exprtWithDrayCount = exprtWithDray.length;
    
    // OOG و Hazardous
    let oogContainers = uniqueData.filter(i => i["Is OOG"] === "true");
    let oogExprtNet = oogContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let oogCount = oogContainers.length;
    
    let hazardousContainers = uniqueData.filter(i => i["Is Hazardous"] === "true");
    let hazardousExprtNet = hazardousContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let hazardousCount = hazardousContainers.length;
    
    let refrigeratedContainers = uniqueData.filter(i => i["Is Refrigerated"] === "true");
    let rfExprtDays = refrigeratedContainers.reduce((s, i) => s + (i["EXPRT Days"] || 0), 0);
    let totalCount = uniqueData.length;  // ← عدد فريد وليس مكرر
    
    let size20Containers = uniqueData.filter(i => i["Size"]?.toString().startsWith("2"));
    let size40Containers = uniqueData.filter(i => i["Size"]?.toString().startsWith("4"));
    
    let size20Count = size20Containers.length;
    let size40Count = size40Containers.length;
    let size20StrgeNet = size20Containers.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let size40StrgeNet = size40Containers.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let size20ExprtNet = size20Containers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let size40ExprtNet = size40Containers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    let refrigerated40 = refrigeratedContainers.filter(i => i["Size"]?.toString().startsWith("4"));
    let refrigerated40Count = refrigerated40.length;
    let refrigerated40Days = refrigerated40.reduce((s, i) => s + (i["EXPRT Days"] || 0), 0);
    
    let totalExprtNetAfterDeduction = totalExprtNet - flexTrueExprtNet;
    
    // تفاصيل Dray Status حسب المقاس
    let size20NoDray = exprtNoDray.filter(i => i["Size"]?.toString().startsWith("2"));
    let size40NoDray = exprtNoDray.filter(i => i["Size"]?.toString().startsWith("4"));
    let size20NoDrayNet = size20NoDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let size40NoDrayNet = size40NoDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    let size20WithDray = exprtWithDray.filter(i => i["Size"]?.toString().startsWith("2"));
    let size40WithDray = exprtWithDray.filter(i => i["Size"]?.toString().startsWith("4"));
    let size20WithDrayNet = size20WithDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let size40WithDrayNet = size40WithDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    // تفاصيل Flex حسب المقاس
    let flexTrue20 = flexTrueContainers.filter(i => i["Size"]?.toString().startsWith("2"));
    let flexTrue40 = flexTrueContainers.filter(i => i["Size"]?.toString().startsWith("4"));
    let flexTrue20Net = flexTrue20.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let flexTrue40Net = flexTrue40.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    return `
        <div style="display: flex; gap: 15px; margin: 0 25px 20px 25px; flex-wrap: wrap;">
            
            <div style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📦 إجمالي STRGE</div>
                <div style="font-size: 28px; font-weight: bold;">${totalStrgeNet}</div>
                <div style="font-size: 12px;">صافي أيام التخزين</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 20 قدم: ${size20StrgeNet} يوم</div>
                    <div>📦 40 قدم: ${size40StrgeNet} يوم</div>
                </div>
            </div>
            
            <div style="flex: 1; background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📤 إجمالي EXPRT</div>
                <div style="font-size: 28px; font-weight: bold;">${totalExprtNet}</div>
                <div style="font-size: 12px;">صافي أيام التصدير</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 20 قدم: ${size20ExprtNet} يوم</div>
                    <div>📦 40 قدم: ${size40ExprtNet} يوم</div>
                </div>
            </div>
            
            <div style="flex: 1; background: linear-gradient(135deg, #4facfe, #00f2fe); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">❄️ أيام EXPRT (ثلاجه)</div>
                <div style="font-size: 28px; font-weight: bold;">${rfExprtDays}</div>
                <div style="font-size: 12px;">للحاويات ثلاجه فقط</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 العدد: ${refrigeratedContainers.length} حاوية</div>
                    <div>📦 40 قدم: ${refrigerated40Count} (${refrigerated40Days} يوم)</div>
                </div>
            </div>
            
            <div style="flex: 1; background: linear-gradient(135deg, #43e97b, #38f9d7); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📦 إجمالي الحاويات</div>
                <div style="font-size: 28px; font-weight: bold;">${totalCount}</div>
                <div style="font-size: 12px;">حاوية</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 20 قدم: ${size20Count} حاوية</div>
                    <div>📦 40 قدم: ${size40Count} حاوية</div>
                </div>
            </div>
        </div>
    `;
}

function renderAdvancedStatsTab3(data) {
    let totalExprtNet = data.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    // Flex String 01
    let flexTrueContainers = data.filter(i => i["Flex String 01"] === "TRUE");
    let flexTrueExprtNet = flexTrueContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let flexTrueCount = flexTrueContainers.length;
    
    let flexFalseContainers = data.filter(i => i["Flex String 01"] === "FALSE");
    let flexFalseExprtNet = flexFalseContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let flexFalseCount = flexFalseContainers.length;
    
    // Dray Status
    let exprtNoDray = data.filter(i => (i["Dray Status"] || "") === "");
    let exprtNoDrayNet = exprtNoDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let exprtNoDrayCount = exprtNoDray.length;
    
    let exprtWithDray = data.filter(i => (i["Dray Status"] || "") !== "");
    let exprtWithDrayNet = exprtWithDray.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let exprtWithDrayCount = exprtWithDray.length;
    
    // OOG و Hazardous
    let oogContainers = data.filter(i => i["Is OOG"] === "true");
    let oogExprtNet = oogContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let oogCount = oogContainers.length;
    
    let hazardousContainers = data.filter(i => i["Is Hazardous"] === "true");
    let hazardousExprtNet = hazardousContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let hazardousCount = hazardousContainers.length;
    
    let refrigeratedContainers = data.filter(i => i["Is Refrigerated"] === "true");
    let rfExprtDays = refrigeratedContainers.reduce((s, i) => s + (i["EXPRT Days"] || 0), 0);
    let totalCount = data.length;
    
    let size20Containers = data.filter(i => i["Size"]?.toString().startsWith("2"));
    let size40Containers = data.filter(i => i["Size"]?.toString().startsWith("4"));
    
    let size20Count = size20Containers.length;
    let size40Count = size40Containers.length;
    let size20ExprtNet = size20Containers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let size40ExprtNet = size40Containers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    let refrigerated40 = refrigeratedContainers.filter(i => i["Size"]?.toString().startsWith("4"));
    let refrigerated40Count = refrigerated40.length;
    let refrigerated40Days = refrigerated40.reduce((s, i) => s + (i["EXPRT Days"] || 0), 0);
    
    // تفاصيل Flex حسب المقاس
    let flexTrue20 = flexTrueContainers.filter(i => i["Size"]?.toString().startsWith("2"));
    let flexTrue40 = flexTrueContainers.filter(i => i["Size"]?.toString().startsWith("4"));
    let flexTrue20Net = flexTrue20.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let flexTrue40Net = flexTrue40.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    let totalExprtNetAfterDeduction = totalExprtNet - flexTrueExprtNet;
    
    return `
        <div style="display: flex; gap: 15px; margin: 0 25px 20px 25px; flex-wrap: wrap;">
            
            <div style="flex: 1; background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📤 إجمالي EXPRT</div>
                <div style="font-size: 28px; font-weight: bold;">${totalExprtNet}</div>
                <div style="font-size: 12px;">صافي أيام التصدير</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 20 قدم: ${size20ExprtNet} يوم</div>
                    <div>📦 40 قدم: ${size40ExprtNet} يوم</div>
                </div>
            </div>
            
            <div style="flex: 1; background: linear-gradient(135deg, #4facfe, #00f2fe); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">❄️ أيام EXPRT (ثلاجه)</div>
                <div style="font-size: 28px; font-weight: bold;">${rfExprtDays}</div>
                <div style="font-size: 12px;">للحاويات ثلاجه فقط</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 العدد: ${refrigeratedContainers.length} حاوية</div>
                    <div>📦 40 قدم: ${refrigerated40Count} (${refrigerated40Days} يوم)</div>
                </div>
            </div>
            
            <div style="flex: 1; background: linear-gradient(135deg, #43e97b, #38f9d7); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📦 إجمالي الحاويات</div>
                <div style="font-size: 28px; font-weight: bold;">${totalCount}</div>
                <div style="font-size: 12px;">حاوية</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 20 قدم: ${size20Count} حاوية</div>
                    <div>📦 40 قدم: ${size40Count} حاوية</div>
                </div>
            </div>
        </div>
    `;
}

function renderAdvancedStatsTab4(data) {
    let totalStrgeNet = data.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let totalCount = data.length;
    
    // Flex String 01
    let flexTrueContainers = data.filter(i => i["Flex String 01"] === "TRUE");
    let flexTrueStrgeNet = flexTrueContainers.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let flexTrueCount = flexTrueContainers.length;
    
    let flexFalseContainers = data.filter(i => i["Flex String 01"] === "FALSE");
    let flexFalseStrgeNet = flexFalseContainers.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let flexFalseCount = flexFalseContainers.length;
    
    // OOG و Hazardous
    let oogContainers = data.filter(i => i["Is OOG"] === "true");
    let oogStrgeNet = oogContainers.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let oogCount = oogContainers.length;
    
    let hazardousContainers = data.filter(i => i["Is Hazardous"] === "true");
    let hazardousStrgeNet = hazardousContainers.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let hazardousCount = hazardousContainers.length;
    
    let size20Containers = data.filter(i => i["Size"]?.toString().startsWith("2"));
    let size40Containers = data.filter(i => i["Size"]?.toString().startsWith("4"));
    
    let size20Count = size20Containers.length;
    let size40Count = size40Containers.length;
    let size20StrgeNet = size20Containers.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let size40StrgeNet = size40Containers.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    
    // تفاصيل Flex حسب المقاس
    let flexTrue20 = flexTrueContainers.filter(i => i["Size"]?.toString().startsWith("2"));
    let flexTrue40 = flexTrueContainers.filter(i => i["Size"]?.toString().startsWith("4"));
    let flexTrue20Net = flexTrue20.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let flexTrue40Net = flexTrue40.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    
    return `
        <div style="display: flex; gap: 15px; margin: 0 25px 20px 25px; flex-wrap: wrap;">
            
            <!-- بطاقة 1: STRGE فارغ -->
            <div style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📦 إجمالي STRGE فارغ</div>
                <div style="font-size: 28px; font-weight: bold;">${totalStrgeNet}</div>
                <div style="font-size: 12px;">صافي أيام التخزين</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 20 قدم: ${size20StrgeNet} يوم</div>
                    <div>📦 40 قدم: ${size40StrgeNet} يوم</div>
                    <div style="margin-top: 5px;">📐 OOG: ${oogStrgeNet} يوم (${oogCount})</div>
                    <div>⚠️ Hazardous: ${hazardousStrgeNet} يوم (${hazardousCount})</div>
                </div>
            </div>
            
            <!-- بطاقة 2: Flex String 01 -->
            <div style="flex: 1; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="background: #ff6b6b; color: white; padding: 12px; text-align: center; font-weight: bold;">⭐ Flex String 01</div>
                <div style="padding: 15px;">
                    <div style="display: flex; gap: 10px;">
                        <div style="flex:1; background:#ffebee; border-radius:8px; padding:8px; text-align:center;">
                            <div>⭐ TRUE (خاص)</div>
                            <div style="font-size:20px; font-weight:bold; color:#ff6b6b;">${flexTrueStrgeNet}</div>
                            <div>${flexTrueCount} حاوية</div>
                            <div style="font-size:10px;">20:${flexTrue20Net} | 40:${flexTrue40Net}</div>
                        </div>
                        <div style="flex:1; background:#e3f2fd; border-radius:8px; padding:8px; text-align:center;">
                            <div>📋 FALSE (عادي)</div>
                            <div style="font-size:20px; font-weight:bold; color:#4facfe;">${flexFalseStrgeNet}</div>
                            <div>${flexFalseCount} حاوية</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- بطاقة 3: إجمالي الحاويات -->
            <div style="flex: 1; background: linear-gradient(135deg, #43e97b, #38f9d7); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📦 إجمالي الحاويات</div>
                <div style="font-size: 28px; font-weight: bold;">${totalCount}</div>
                <div style="font-size: 12px;">حاوية</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 20 قدم: ${size20Count} حاوية</div>
                    <div>📦 40 قدم: ${size40Count} حاوية</div>
                    <div style="margin-top: 5px;">📐 OOG: ${oogCount}</div>
                    <div>⚠️ Hazardous: ${hazardousCount}</div>
                    <div>⭐ Flex TRUE: ${flexTrueCount}</div>
                    <div>📋 Flex FALSE: ${flexFalseCount}</div>
                </div>
            </div>
        </div>
    `;
}

function updateFileNameDisplay(fileName) {
    let fileNameDiv = document.getElementById("currentFileName");
    if (fileNameDiv) {
        if (fileName) {
            fileNameDiv.innerHTML = `📄 ${fileName}`;
            fileNameDiv.style.background = "#d4edda";
            fileNameDiv.style.color = "#155724";
        } else {
            fileNameDiv.innerHTML = `📄 لا يوجد ملف محمل`;
            fileNameDiv.style.background = "#e9ecef";
            fileNameDiv.style.color = "#0a3d62";
        }
    }
}

function processAndDisplay5() {
    console.log("=== بدء processAndDisplay5 (فصل السطور مع سماح واحد - TRUCK أولاً) ===");
    console.log("عدد الحاويات في containersMap:", containersMap.size);
    
    let result = [];
    
    for (let [id, container] of containersMap.entries()) {
        // الحصول على مصفوفة TRSHP
        let trshpArray = container.trshpList || [];
        
        let hasTrshp = trshpArray.length > 0;
        
        // ========== التعديل: التحقق من EXPRT مع Dray Status فارغ فقط ==========
        let hasExprt = false;
        if (container.exprtList && container.exprtList.length > 0) {
            for (let ex of container.exprtList) {
                let drayStatus = ex["Dray Status"] || "";
                // إذا كان Dray Status فارغًا، نعتبر أن الحاوية بها EXPRT غير مسموح (تستبعد)
                if (drayStatus === "") {
                    hasExprt = true;
                    break;
                }
            }
        }
        
        let hasStrge = (container.strge !== null && container.strge["Category"] === "STRGE");
        let hasImprt = (container.imprt !== null && container.imprt["Category"] === "IMPRT");
        let hasTrshpReturn = (container.trshpReturn !== null && container.trshpReturn["Category"] === "TRSHP" && container.trshpReturn["Dray Status"] === "RETURN");
        
        if (!hasTrshp) continue;
        
        // شرط TRSHP نقية (بدون EXPRT/STRGE/IMPRT/RETURN)
        let isPureTrshp = !hasExprt && !hasStrge && !hasImprt && !hasTrshpReturn;
        if (!isPureTrshp) {
            console.log(`❌ حاوية ${id} مستبعدة: لديها أنواع أخرى`);
            continue;
        }
        
        // ========== ترتيب الفترات: TRUCK أولاً ثم VESSEL ==========
        // فصل الفترات حسب النوع
        let truckPeriods = [];
        let vesselPeriods = [];
        
        for (let tr of trshpArray) {
            let drayStatus = tr["Dray Status"] || "";
            if (drayStatus !== "" && drayStatus !== null) continue;
            
            let trStart = convertDate(tr["Rule Start Time"] || "");
            let trEnd = convertDate(tr["Rule End Time"] || "");
            if (!trStart || !trEnd) continue;
            
            let obLocType = tr["O/B Loc Type"] || "";  // نستخدم O/B Loc Type للتصنيف
            
            let periodData = {
                rawData: tr,
                start: trStart,
                end: trEnd,
                days: diffDays(trStart, trEnd),
                ibLocType: tr["I/B Loc Type"] || "",
                obLocType: obLocType,
                vesselName: tr["I/B Carrier Name"] || tr["O/B Carrier Name"] || "",
                flexString01: tr["Flex String 01"] || "",
                flexString04: tr["Flex String 04"] || "",
                obCarrierName: tr["O/B Carrier Name"] || "",
                obCarrierATD: tr["O/B Carrier ATD"] || tr["O/B Carrier ATA"] || ""
            };
            
            if (obLocType === "TRUCK") {
                truckPeriods.push(periodData);
            } else if (obLocType === "VESSEL") {
                vesselPeriods.push(periodData);
            } else {
                // إذا لم نجد تصنيف، نضعه في المصفوفة المناسبة حسب I/B Loc Type
                let ibLocType = tr["I/B Loc Type"] || "";
                if (ibLocType === "TRUCK") {
                    truckPeriods.push(periodData);
                } else {
                    vesselPeriods.push(periodData);
                }
            }
        }
        
        // ترتيب كل مجموعة حسب التاريخ
        truckPeriods.sort((a, b) => new Date(a.start) - new Date(b.start));
        vesselPeriods.sort((a, b) => new Date(a.start) - new Date(b.start));
        
        // دمج الفترات: TRUCK أولاً ثم VESSEL
        let sortedPeriods = [...truckPeriods, ...vesselPeriods];
        
        if (sortedPeriods.length === 0) continue;
        
        // ========== حساب إجمالي الأيام والسماح الكلي ==========
        let totalDays = sortedPeriods.reduce((sum, p) => sum + p.days, 0);
        let lineId = container.lineId || "";
        let isExcl = isExcluded(lineId, excludeLines5);
        
        // حساب أيام السماح الكلي (مرة واحدة) من أول فترة (TRUCK)
        let firstPeriod = sortedPeriods[0];
        let freeDays = getFreeDays(trshpOnlyPeriods5, lineId, firstPeriod.start, firstPeriod.flexString01, "");
        
        // ========== توزيع السماح على الفترات بالتسلسل (TRUCK أولاً ثم VESSEL) ==========
        let remainingFree = freeDays;
        
for (let i = 0; i < sortedPeriods.length; i++) {
    let period = sortedPeriods[i];
    let days = period.days;
    
    let deduction = Math.min(days, remainingFree);
    let netDays = days - deduction;
    if (netDays < 0) netDays = 0;
    remainingFree -= deduction;
    
    let equipType = container.equipmentType;
    let size = equipType.toString().match(/^(\d+)/)?.[1] || "";
    let isRefrigerated = period.rawData["Is Refrigerated"] || "";
    let type = (isRefrigerated === "true" || equipType.includes("R1")) ? "RF" : "GP";
    let isOOG = period.rawData["Is OOG"] || "";
    let isBundled = period.rawData["Is Bundled"] || "";
    let isHazardous = period.rawData["Is Hazardous"] || "";
    let imdgClass = period.rawData["IMDG Class"] || "";
    let method = isExcl ? "🚫 سماح مستقل" : "🔄 سماح متسلسل";
    let displayType = period.obLocType || period.ibLocType || "—";
    
    // ========== أضف هذه الأسطر هنا ==========
let hasMultiplePeriods = (sortedPeriods.length > 1);

// ===================================================
// شرط إظهار الحاوية في تبويب 5
// ===================================================
// استخدم المتغيرات الموجودة (لا تعيد تعريفها)
// ===================================================
// isRefrigerated موجودة من الأعلى
// type موجود من الأعلى
// netDays موجود من الأعلى

let freightKind = period.rawData["Freight Kind"] || "";

// إذا كانت RF و Freight Kind = MTY و Is Refrigerated = false و netDays <= 0 → لا تظهر
let isInvalidRF = (type === "RF" && freightKind === "MTY" && isRefrigerated === "false" && netDays <= 0);

let shouldShow = (type === "RF" && !isInvalidRF) || hasMultiplePeriods || (type === "GP" && netDays > 0);
// ===================================================
// ===================================================
    // =====================================
    
    // لف result.push داخل شرط if
    if (shouldShow) {
        result.push({
            "Container No.": id,
            "Size": size,
			"Freight Kind": period.rawData["Freight Kind"] || "",  // ← أضف هذا
            "Is OOG": isOOG,
            "Is Refrigerated": isRefrigerated,
            "O/B Loc Type": displayType,
            "Is Bundled": isBundled,
            "Is Hazardous": isHazardous,
            "IMDG Class": imdgClass,
            "Type": type,
            "Line ID": lineId,
            "طريقة الحساب": method,
            "Flex String 01": period.flexString01,
            "flex_04": period.flexString04,
            "TRSHP Start": period.start,
            "TRSHP End": period.end,
            "TRSHP Days": days,
            "TRSHP Free": freeDays,   // السماح الكلي من الإعدادات
            "TRSHP Net": netDays,
            "Total Net": netDays,
            "Vessel Name": period.vesselName,
            "O/B Carrier Name": period.obCarrierName,
            "O/B Carrier ATD": period.obCarrierATD,
            "Period Order": i + 1,
            "Period Type": displayType
        });
    }  // <--- قوس إغلاق if
}  
	}// <--- قوس إغلاق for
    
    // ترتيب النتائج: حسب رقم الحاوية ثم حسب الترتيب (TRUCK ثم VESSEL)
    result.sort((a, b) => {
        let containerCompare = (a["Container No."] || "").localeCompare(b["Container No."] || "");
        if (containerCompare !== 0) return containerCompare;
        return (a["Period Order"] || 0) - (b["Period Order"] || 0);
    });
    
    currentData5 = result;
    console.log("عدد الفترات المعروضة (TRUCK أولاً ثم VESSEL):", currentData5.length);
    
    // تحديث رسالة الفوتر
    let footerMsg = document.getElementById("footerMsg");
    if (footerMsg) {
        let currentText = footerMsg.innerHTML;
        let cleanText = currentText.replace(/\s*\|\s*TRSHP فقط:\s*\d+/, '');
        footerMsg.innerHTML = cleanText + ` | TRSHP فقط: ${currentData5.length}`;
    }
    
    // التحقق من وجود عناصر الجدول
    let tbody = document.getElementById('bodyTab5');
    if (!tbody) {
        console.error("❌ عنصر bodyTab5 غير موجود في الصفحة!");
        return;
    }
    
    if (currentData5.length === 0) {
        tbody.innerHTML = `<tr><td colspan="19" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات TRSHP نقية (بدون Dray Status وبدون EXPRT/STRGE/IMPRT)<\/td></tr>`;
        
        let filtersDiv = document.getElementById("filtersTab5");
        let wrapperDiv = document.getElementById("wrapperTab5");
        if (filtersDiv) filtersDiv.style.display = "none";
        if (wrapperDiv) wrapperDiv.style.display = "none";
        return;
    }
    
    // عرض البيانات
    if (selectedColumns.tab5 && selectedColumns.tab5.length > 0) {
        renderTable5WithSelectedColumns("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
    } else {
        renderTable5("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
        updateHeaderFromDisplayData('5', currentData5);
    }
    
    // إظهار عناصر التبويب
    let filtersDiv = document.getElementById("filtersTab5");
    let wrapperDiv = document.getElementById("wrapperTab5");
    let statsDiv = document.getElementById("statsTab5");
    
    if (filtersDiv) filtersDiv.style.display = "flex";
    if (wrapperDiv) wrapperDiv.style.display = "block";
    if (statsDiv && currentData5.length > 0) {
        statsDiv.innerHTML = renderAdvancedStatsTab5(currentData5);
        statsDiv.style.display = "flex";
    }
    
    console.log(`✅ تمت معالجة وعرض ${currentData5.length} فترة TRSHP`);
}

// ========== دوال التبويب 5 (TRSHP فقط) المصححة ==========

function renderTable5(tbodyId, data, searchId, typeId, statsId) {
    console.log("renderTable5 called with data length:", data.length);
    
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    let statsDiv = document.getElementById(statsId);
    if (statsDiv && data.length > 0) {
        statsDiv.innerHTML = renderAdvancedStatsTab5(data);
        statsDiv.style.display = "flex";
    } else if (statsDiv) {
        statsDiv.style.display = "none";
    }
    
    let tbody = document.getElementById(tbodyId);
    if (!tbody) {
        console.error("tbody not found:", tbodyId);
        return;
    }
    tbody.innerHTML = "";
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="19" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات TRSHP بدون Dray Status وبدون IMPRT<\/td></tr>`;
        return;
    }
    
    for (let item of filtered) {
        let row = tbody.insertRow();
        let methodClass = item["طريقة الحساب"] === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
        
        let flexValue = item["Flex String 01"] || "—";
        let flexHtml = "—";
        if (flexValue === "TRUE") {
            flexHtml = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
        } else if (flexValue === "FALSE") {
            flexHtml = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
        }
        
        row.innerHTML = `
            <td style="font-weight:bold;">${item["Container No."] || "—"}<\/td>
            <td>${item["Size"] || "—"}<\/td>
			<td>${item["Freight Kind"] || "—"}</td>  <!-- ← أضف هذا -->
            <td>${item["Is OOG"] === "true" ? "✅" : "❌"}<\/td>
            <td>${item["Is Refrigerated"] === "true" ? "✅" : "❌"}<\/td>
            <td>${item["I/B Loc Type"] || "—"}<\/td>
            <td>${item["Is Bundled"] === "true" ? "✅" : "❌"}<\/td>
            <td>${item["Is Hazardous"] === "true" ? "✅" : "❌"}<\/td>
            <td>${item["IMDG Class"] || "—"}<\/td>
            <td><strong>${item["Type"] || "—"}</strong><\/td>
            <td>${item["Line ID"] || "—"}<\/td>
            <td><span class="${methodClass}">${item["طريقة الحساب"] || "—"}</span><\/td>
            <td>${flexHtml}<\/td>
            <td>${item["flex_04"] || "—"}<\/td>
            <td>${item["TRSHP Start"] || "—"}<\/td>
            <td>${item["TRSHP End"] || "—"}<\/td>
            <td style="background:#e3f2fd;">${item["TRSHP Days"] || "—"}<\/td>
            <td style="background:#fff3cd;">${item["TRSHP Free"] || "—"}<\/td>
            <td style="background:#d4edda;">${item["TRSHP Net"] || "—"}<\/td>
            <td style="background:#cce5ff; font-weight:bold;">${item["Total Net"] || "—"}<\/td>
            <td>${item["Vessel Name"] || "—"}<\/td>
        `;
    }
    
    let filtersDiv = document.getElementById("filtersTab5");
    let wrapperDiv = document.getElementById("wrapperTab5");
    if (filtersDiv) filtersDiv.style.display = "flex";
    if (wrapperDiv) wrapperDiv.style.display = "block";
}

function renderTable5WithSelectedColumns(tbodyId, data, searchId, typeId, statsId) {
    console.log("renderTable5WithSelectedColumns called, data length:", data.length);
    
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    let selected = selectedColumns.tab5;
    if (!selected || selected.length === 0) {
        selected = availableColumnsTab5.tab5.filter(c => c.default).map(c => c.name);
    }
    
    let thead = document.querySelector('#tableTab5 thead tr');
    if (thead) {
        thead.innerHTML = '';
        selected.forEach(colName => {
            let col = availableColumnsTab5.tab5.find(c => c.name === colName);
            let th = document.createElement('th');
            th.textContent = col ? col.label : colName;
            thead.appendChild(th);
        });
    }
    
    let tbody = document.getElementById(tbodyId);
    if (!tbody) {
        console.error("tbody not found:", tbodyId);
        return;
    }
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        let colspan = selected.length;
        tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات TRSHP بدون Dray Status وبدون IMPRT</td></tr>`;
        return;
    }
    
    for (let item of filtered) {
        let row = tbody.insertRow();
        selected.forEach(colName => {
            let cell = row.insertCell();
            let value = item[colName];
            
            if (["Is OOG", "Is Refrigerated", "Is Bundled", "Is Hazardous"].includes(colName)) {
                cell.textContent = value === "true" ? "✅" : "❌";
            } else if (colName === "طريقة الحساب") {
                let methodClass = value === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
                cell.innerHTML = `<span class="${methodClass}">${value || "—"}</span>`;
            } else if (colName === "Flex String 01") {
                if (value === "TRUE") {
                    cell.innerHTML = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
                } else if (value === "FALSE") {
                    cell.innerHTML = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
                } else {
                    cell.textContent = "—";
                }
            } else if (colName === "Container No.") {
                cell.textContent = value || "—";
                cell.style.fontWeight = "bold";
            } else if (colName === "Type") {
                cell.innerHTML = `<strong>${value || "—"}</strong>`;
            } else {
                cell.textContent = value || "—";
            }
        });
    }
    
    let statsDiv = document.getElementById(statsId);
    if (statsDiv && statsDiv.innerHTML === "" && data.length > 0) {
        statsDiv.innerHTML = renderAdvancedStatsTab5(data);
        statsDiv.style.display = "flex";
    }
}

function openColumnModalTab5() {
    let modal = document.getElementById('columnModal');
    let body = document.getElementById('columnModalBody');
    
    let html = `<div class="select-all">
        <label style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="selectAllColumns"> <strong>تحديد الكل</strong>
        </label>
    </div>`;
    
    let cols = availableColumnsTab5.tab5;
    if (cols) {
        cols.forEach(col => {
            let isChecked = selectedColumns.tab5?.includes(col.name) || 
                           (selectedColumns.tab5?.length === 0 && col.default);
            html += `
                <div class="column-option">
                    <input type="checkbox" class="col-checkbox" value="${col.name}" id="col_${col.name.replace(/ /g, '_')}" ${isChecked ? 'checked' : ''}>
                    <label for="col_${col.name.replace(/ /g, '_')}">${col.label}</label>
                </div>
            `;
        });
    }
    
    body.innerHTML = html;
    modal.classList.add('active');
    
    document.getElementById('selectAllColumns').onchange = (e) => {
        document.querySelectorAll('.col-checkbox').forEach(cb => cb.checked = e.target.checked);
    };
    
    document.getElementById('applyColumnSelection').onclick = () => {
        let selected = [];
        document.querySelectorAll('.col-checkbox:checked').forEach(cb => selected.push(cb.value));
        selectedColumns.tab5 = selected;
        localStorage.setItem(`selectedColumns_tab5`, JSON.stringify(selected));
        closeColumnModal();
        if (currentData5.length > 0) {
            renderTable5WithSelectedColumns('bodyTab5', currentData5, 'searchTab5', 'typeTab5', 'statsTab5');
        }
    };
}

// إعادة تعريف أزرار التبويب 5 للتأكد من ربطها
document.getElementById("printBtn5").onclick = () => {
    if (currentData5.length > 0) {
        printReport('tab5', '🚛 تقرير TRSHP فقط (بدون Dray Status وبدون IMPRT)');
    } else {
        alert("لا توجد بيانات للطباعة في تبويب TRSHP فقط");
    }
};

document.getElementById("selectColumnsBtn5").onclick = () => openColumnModalTab5();

// إعدادات السماح للتبويب 5
document.getElementById("settingsBtn5").onclick = () => {
    document.getElementById("settingsPanel5").style.display = "block";
    displayPeriodsList('trshpOnlyPeriodsList5', trshpOnlyPeriods5, '5');
};

document.getElementById("closeSettings5").onclick = () => { 
    document.getElementById("settingsPanel5").style.display = "none"; 
};

document.getElementById("addTrshpOnlyPeriodBtn5").onclick = () => addNewPeriod('5', 'TRSHP');

document.getElementById("savePeriodsBtn5").onclick = () => {
    let updated = updateEndDates(trshpOnlyPeriods5);
    localStorage.setItem("trshpOnlyPeriodsTab5", JSON.stringify(updated));
    localStorage.setItem("excludeLines5", JSON.stringify(excludeLines5));
    trshpOnlyPeriods5 = updated;
    document.getElementById("settingsPanel5").style.display = "none";
    if (containersMap.size > 0) processAndDisplay5();
    document.getElementById("footerMsg").innerHTML = `✅ تم حفظ إعدادات TRSHP فقط`;
};

document.getElementById("addExcludeBtn5").onclick = () => {
    let line = document.getElementById("excludeLine5").value;
    if (line && !excludeLines5.includes(line)) {
        excludeLines5.push(line);
        localStorage.setItem("excludeLines5", JSON.stringify(excludeLines5));
        displayExcludeList('excludeList5', excludeLines5, '5');
        if (containersMap.size > 0) processAndDisplay5();
        document.getElementById("excludeLine5").value = "";
    }
};

// فلترة التبويب 5
document.getElementById("searchTab5")?.addEventListener("input", () => {
    if (selectedColumns.tab5 && selectedColumns.tab5.length > 0 && currentData5.length > 0) {
        renderTable5WithSelectedColumns("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
    } else if (currentData5.length > 0) {
        renderTable5("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
    }
});

document.getElementById("typeTab5")?.addEventListener("change", () => {
    if (selectedColumns.tab5 && selectedColumns.tab5.length > 0 && currentData5.length > 0) {
        renderTable5WithSelectedColumns("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
    } else if (currentData5.length > 0) {
        renderTable5("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
    }
});

// زر تصدير التبويب 5
document.getElementById("exportBtn5").onclick = () => {
    if (currentData5.length > 0) {
        let ws = XLSX.utils.json_to_sheet(currentData5);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "TRSHP_ONLY");
        XLSX.writeFile(wb, `تقرير_TRSHP_ONLY_${new Date().toISOString().slice(0,19)}.xlsx`);
    } else {
        alert("لا توجد بيانات للتصدير في تبويب TRSHP فقط");
    }
};

// عرض قائمة الاستثناءات للتبويب 5
displayExcludeList('excludeList5', excludeLines5, '5');

// ========== دوال الإحصائيات للتبويب 5 المصححة ==========

function renderAdvancedStatsTab5(data) {
    if (!data || data.length === 0) {
        return `<div style="padding:20px; text-align:center;">لا توجد بيانات</div>`;
    }
    
    // ========== تجميع الحاويات الفريدة (حسب رقم الحاوية) ==========
    let uniqueContainers = new Map();
    
    for (let item of data) {
        let containerNo = item["Container No."];
        if (!uniqueContainers.has(containerNo)) {
            uniqueContainers.set(containerNo, {
                "Container No.": containerNo,
                "Size": item["Size"],
                "Is Refrigerated": item["Is Refrigerated"],
                "TRSHP Net": item["TRSHP Net"] || 0,
                "TRSHP Days": item["TRSHP Days"] || 0
            });
        } else {
            // دمج القيم إذا وجدت أكثر من فترة لنفس الحاوية
            let existing = uniqueContainers.get(containerNo);
            existing["TRSHP Net"] += item["TRSHP Net"] || 0;
            existing["TRSHP Days"] += item["TRSHP Days"] || 0;
        }
    }
    
    let uniqueData = Array.from(uniqueContainers.values());
    
    let totalTrshpNet = uniqueData.reduce((s, i) => s + (i["TRSHP Net"] || 0), 0);
    let totalCount = uniqueData.length;
    
    // الحاويات المبردة (Is Refrigerated = true)
    let refrigeratedContainers = uniqueData.filter(i => i["Is Refrigerated"] === "true");
    let refrigeratedCount = refrigeratedContainers.length;
    let refrigeratedNet = refrigeratedContainers.reduce((s, i) => s + (i["TRSHP Days"] || 0), 0);
    
    // تفاصيل الحاويات المبردة حسب المقاس
    let refrigerated20 = refrigeratedContainers.filter(i => i["Size"]?.toString().startsWith("2"));
    let refrigerated40 = refrigeratedContainers.filter(i => i["Size"]?.toString().startsWith("4"));
    let refrigerated20Net = refrigerated20.reduce((s, i) => s + (i["TRSHP Days"] || 0), 0);
    let refrigerated40Net = refrigerated40.reduce((s, i) => s + (i["TRSHP Days"] || 0), 0);
    let refrigerated20Count = refrigerated20.length;
    let refrigerated40Count = refrigerated40.length;
    
    // إجمالي الحاويات حسب المقاس
    let size20Containers = uniqueData.filter(i => i["Size"]?.toString().startsWith("2"));
    let size40Containers = uniqueData.filter(i => i["Size"]?.toString().startsWith("4"));
    let size20Count = size20Containers.length;
    let size40Count = size40Containers.length;
    let size20Net = size20Containers.reduce((s, i) => s + (i["TRSHP Net"] || 0), 0);
    let size40Net = size40Containers.reduce((s, i) => s + (i["TRSHP Net"] || 0), 0);
    
    return `
        <div style="display: flex; gap: 15px; margin: 0 25px 20px 25px; flex-wrap: wrap;">
            
            <!-- بطاقة 1: إجمالي TRSHP -->
            <div style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">🚛 إجمالي TRSHP</div>
                <div style="font-size: 28px; font-weight: bold;">${totalTrshpNet}</div>
                <div style="font-size: 12px;">صافي أيام الترانزيت</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 20 قدم: ${size20Net} يوم (${size20Count})</div>
                    <div>📦 40 قدم: ${size40Net} يوم (${size40Count})</div>
                </div>
            </div>
            
            <!-- بطاقة 2: الحاويات المبردة -->
            <div style="flex: 1; background: linear-gradient(135deg, #4facfe, #00f2fe); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">❄️ الحاويات المبردة (RF)</div>
                <div style="font-size: 28px; font-weight: bold;">${refrigeratedNet}</div>
                <div style="font-size: 12px;">إجمالي أيام TRSHP (قبل الخصم)</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 العدد: ${refrigeratedCount} حاوية</div>
                    <div>📦 إجمالي الأيام: ${refrigeratedNet} يوم</div>
                    <div>📦 20 قدم: ${refrigerated20Net} يوم (${refrigerated20Count})</div>
                    <div>📦 40 قدم: ${refrigerated40Net} يوم (${refrigerated40Count})</div>
                </div>
            </div>
            
            <!-- بطاقة 3: إجمالي الحاويات -->
            <div style="flex: 1; background: linear-gradient(135deg, #43e97b, #38f9d7); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📦 إجمالي الحاويات</div>
                <div style="font-size: 28px; font-weight: bold;">${totalCount}</div>
                <div style="font-size: 12px;">حاوية فريدة</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>❄️ مبردة: ${refrigeratedCount} حاوية</div>
                    <div>📦 20 قدم: ${size20Count}</div>
                    <div>📦 40 قدم: ${size40Count}</div>
                </div>
            </div>
        </div>
    `;
}

// ========== دوال العرض البديلة للتبويب 5 (في حالة احتياجها) ==========

function renderTable5Safe(tbodyId, data, searchId, typeId, statsId) {
    console.log("renderTable5Safe called with data length:", data?.length || 0);
    
    if (!data || data.length === 0) {
        let tbody = document.getElementById(tbodyId);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="19" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات TRSHP بدون Dray Status وبدون IMPRT<\/td></tr>`;
        }
        return;
    }
    
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    let tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = "";
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="19" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات تطابق البحث<\/td></tr>`;
        return;
    }
    
    for (let item of filtered) {
        let row = tbody.insertRow();
        let methodClass = item["طريقة الحساب"] === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
        
        let flexValue = item["Flex String 01"] || "—";
        let flexHtml = "—";
        if (flexValue === "TRUE") {
            flexHtml = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
        } else if (flexValue === "FALSE") {
            flexHtml = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
        }
        
        row.innerHTML = `
            <td style="font-weight:bold;">${item["Container No."] || "—"}<\/td>
            <td>${item["Size"] || "—"}<\/td>
            <td>${item["Is OOG"] === "true" ? "✅" : "❌"}<\/td>
            <td>${item["Is Refrigerated"] === "true" ? "✅" : "❌"}<\/td>
            <td>${item["Is Bundled"] === "true" ? "✅" : "❌"}<\/td>
            <td>${item["Is Hazardous"] === "true" ? "✅" : "❌"}<\/td>
            <td>${item["IMDG Class"] || "—"}<\/td>
            <td><strong>${item["Type"] || "—"}</strong><\/td>
            <td>${item["Line ID"] || "—"}<\/td>
            <td><span class="${methodClass}">${item["طريقة الحساب"] || "—"}</span><\/td>
            <td>${flexHtml}<\/td>
            <td>${item["flex_04"] || "—"}<\/td>
            <td>${item["TRSHP Start"] || "—"}<\/td>
            <td>${item["TRSHP End"] || "—"}<\/td>
            <td style="background:#e3f2fd;">${item["TRSHP Days"] || "—"}<\/td>
            <td style="background:#fff3cd;">${item["TRSHP Free"] || "—"}<\/td>
            <td style="background:#d4edda;">${item["TRSHP Net"] || "—"}<\/td>
            <td style="background:#cce5ff; font-weight:bold;">${item["Total Net"] || "—"}<\/td>
            <td>${item["Vessel Name"] || "—"}<\/td>
        `;
    }
    
    let statsDiv = document.getElementById(statsId);
    if (statsDiv) {
        statsDiv.innerHTML = renderAdvancedStatsTab5(filtered);
        statsDiv.style.display = "flex";
    }
}




// تبويب 5
document.getElementById("printBtn5").onclick = () => {
    let carrier = document.getElementById("headerCarrierName")?.innerText || "—";
    let date = document.getElementById("headerShippingDate")?.innerText || "—";
    let line = document.getElementById("headerLineId")?.innerText || "—";
    printReport('tab5', `تقرير TRSHP فقط | 🚢 ${carrier} | 📅 ${date} | 🏷️ ${line}`);
};
document.getElementById("selectColumnsBtn5").onclick = () => openColumnModalTab5();

// إعدادات السماح للتبويب 5
document.getElementById("settingsBtn5").onclick = () => {
    document.getElementById("settingsPanel5").style.display = "block";
    displayPeriodsList('trshpOnlyPeriodsList5', trshpOnlyPeriods5, '5');
};
document.getElementById("closeSettings5").onclick = () => { document.getElementById("settingsPanel5").style.display = "none"; };
document.getElementById("addTrshpOnlyPeriodBtn5").onclick = () => addNewPeriod('5', 'TRSHP');
document.getElementById("savePeriodsBtn5").onclick = () => {
    let updated = updateEndDates(trshpOnlyPeriods5);
    localStorage.setItem("trshpOnlyPeriodsTab5", JSON.stringify(updated));
    localStorage.setItem("excludeLines5", JSON.stringify(excludeLines5));
    trshpOnlyPeriods5 = updated;
    document.getElementById("settingsPanel5").style.display = "none";
    if (containersMap.size > 0) processAndDisplay5();
    document.getElementById("footerMsg").innerHTML = `✅ تم حفظ إعدادات TRSHP فقط`;
};
document.getElementById("addExcludeBtn5").onclick = () => {
    let line = document.getElementById("excludeLine5").value;
    if (line && !excludeLines5.includes(line)) {
        excludeLines5.push(line);
        localStorage.setItem("excludeLines5", JSON.stringify(excludeLines5));
        displayExcludeList('excludeList5', excludeLines5, '5');
        if (containersMap.size > 0) processAndDisplay5();
        document.getElementById("excludeLine5").value = "";
    }
};

// فلترة التبويب 5
document.getElementById("searchTab5")?.addEventListener("input", () => {
    if (selectedColumns.tab5 && selectedColumns.tab5.length > 0) {
        renderTable5WithSelectedColumns("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
    } else {
        renderTable5("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
    }
});
document.getElementById("typeTab5")?.addEventListener("change", () => {
    if (selectedColumns.tab5 && selectedColumns.tab5.length > 0) {
        renderTable5WithSelectedColumns("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
    } else {
        renderTable5("bodyTab5", currentData5, "searchTab5", "typeTab5", "statsTab5");
    }
});

// زر تصدير التبويب 5
document.getElementById("exportBtn5").onclick = () => {
    let ws = XLSX.utils.json_to_sheet(currentData5);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TRSHP_ONLY");
    XLSX.writeFile(wb, `تقرير_TRSHP_ONLY_${new Date().toISOString().slice(0,19)}.xlsx`);
};

function processAndDisplay6() {
    console.log("=== processAndDisplay6 started, containersMap size:", containersMap.size);
    console.log("=== بدء processAndDisplay6 ===");
    console.log("عدد الحاويات في containersMap:", containersMap.size);
    
    let result = [];
    
    for (let [id, container] of containersMap.entries()) {
        // ===================================================
        // التعديل: استخدام exprtList بدلاً من container.exprt
        // ===================================================
        let trshpArray = container.trshpList || [];
        let exprtList = container.exprtList || [];
        
        let hasStrge = (container.strge !== null);
        let hasExprt = exprtList.length > 0;  // ← استخدم exprtList
        let hasTrshp = trshpArray.length > 0;
        let hasImprt = (container.imprt !== null);
        let hasTrshpReturn = (container.trshpReturn !== null);
        
        // الحاوية مؤهلة فقط إذا كان لديها STRGE و EXPRT وليس لديها TRSHP أو IMPRT
        let isValid = hasStrge && hasExprt && !hasTrshp && !hasImprt && !hasTrshpReturn;
        
        if (!isValid) continue;
        
        let st = container.strge;
        let lineId = container.lineId || "";
        let isExcl = isExcluded(lineId, excludeLines6);
        
        // تواريخ STRGE
        let stStart = convertDate(st["Start Time"] || "");
        let stEnd = convertDate(st["End Time"] || "");
        
        if (!stStart || !stEnd) continue;
        
        // ===================================================
        // التعديل: التكرار على كل EXPRT في exprtList
        // ===================================================
        for (let ex of exprtList) {
            // تواريخ EXPRT (باستخدام Rule Start/End Time)
            let exStart = convertDate(ex["Rule Start Time"] || "");
            let exEnd = convertDate(ex["Rule End Time"] || "");
            
            if (!exStart || !exEnd) continue;
            
            // حساب الأيام والتداخل
            let stDays = diffDays(stStart, stEnd);
            let exDays = diffDays(exStart, exEnd);
            
            // حساب الأيام المشتركة
            let overlapResult = calculateDaysWithOverlapRemoved(stStart, stEnd, exStart, exEnd);
            let stDaysAfterOverlap = overlapResult.net1;
            let exDaysAfterOverlap = overlapResult.net2;
            let overlapDays = overlapResult.overlap;
            
            // الحصول على أيام السماح
            let stFlexString01 = st["Flex String 01"] || "";
            let stDrayStatus = st["Dray Status"] || "";
            let exFlexString01 = ex["Flex String 01"] || "";
            let exDrayStatus = ex["Dray Status"] || "";
            
            let stFree = getFreeDays(strgePeriods6, lineId, stStart, stFlexString01, stDrayStatus);
            let exFree = getFreeDays(exprtPeriods6, lineId, exStart, exFlexString01, exDrayStatus);
            
            let strgeNet = 0, exprtNet = 0;
            
            if (isExcl) {
                let indResult = calculateIndependent(stDaysAfterOverlap, stFree, exDaysAfterOverlap, exFree);
                strgeNet = indResult.net1;
                exprtNet = indResult.net2;
            } else {
                let overlapResultCalc = calculateWithOverlap(stDaysAfterOverlap, stFree, exDaysAfterOverlap, exFree);
                strgeNet = overlapResultCalc.net1;
                exprtNet = overlapResultCalc.net2;
            }
            
            let totalNet = strgeNet + exprtNet;
            let method = isExcl ? "🚫 سماح مستقل" : "🔄 تداخل سماح";
            
            // معلومات الحاوية
            let equipType = container.equipmentType;
            let size = equipType.toString().match(/^(\d+)/)?.[1] || "";
            let isRefrigerated = ex["Is Refrigerated"] || "";
            let type = (isRefrigerated === "true" || equipType.includes("R1")) ? "RF" : "GP";
            let isOOG = st["Is OOG"] || "";
            let isBundled = st["Is Bundled"] || "";
            let isHazardous = st["Is Hazardous"] || "";
            let imdgClass = st["IMDG Class"] || "";
            let flexString01 = st["Flex String 01"] || "";
            let vesselName = st["I/B Carrier Name"] || "";
            if (!vesselName) vesselName = ex["I/B Carrier Name"] || "—";
            
            result.push({
                "Container No.": id,
                "Size": size,
                "Is OOG": isOOG,
                "Is Refrigerated": isRefrigerated,
                "Is Bundled": isBundled,
                "Is Hazardous": isHazardous,
                "IMDG Class": imdgClass,
                "Type": type,
                "Line ID": lineId,
                "طريقة الحساب": method,
                "Flex String 01": flexString01,
                "STRGE Start": stStart,
                "STRGE End": stEnd,
                "STRGE Days": stDays,
                "Overlap Days": overlapDays,
                "STRGE After Overlap": stDaysAfterOverlap,
                "STRGE Free": stFree,
                "STRGE Net": strgeNet,
                "EXPRT Start": exStart,
                "EXPRT End": exEnd,
                "EXPRT Days": exDaysAfterOverlap,
                "EXPRT Free": exFree,
                "EXPRT Net": exprtNet,
                "Total Net": totalNet,
                "Vessel Name": vesselName
            });
        }
        // ===================================================
    }
    
    currentData6 = result;
    console.log("عدد الحاويات في تبويب 6 (STRGE+EXPRT فقط):", currentData6.length);
    
    // تحديث رسالة الفوتر
    let footerMsg = document.getElementById("footerMsg");
    if (footerMsg) {
        let currentText = footerMsg.innerHTML;
        let cleanText = currentText.replace(/\s*\|\s*STRGE\+EXPRT فقط:\s*\d+/, '');
        footerMsg.innerHTML = cleanText + ` | STRGE+EXPRT فقط: ${currentData6.length}`;
    }
    
    // عرض البيانات
    renderTable6("bodyTab6", currentData6, "searchTab6", "typeTab6", "statsTab6");
    updateHeaderFromDisplayData('6', currentData6);
}

// ========== دالة معالجة تبويب 7 (IMPRT + FORWARD) ==========
function processAndDisplay7() {
    console.log("=== processAndDisplay7 (التشخيص الكامل) ===");
    console.log("عدد الحاويات في containersMap:", containersMap.size);
    
    let result = [];
    
    for (let [id, container] of containersMap.entries()) {
        let lineId = container.lineId || "";
        let equipType = container.equipmentType || "";
        let size = equipType.toString().match(/^(\d+)/)?.[1] || "";
        
        // ===== التحقق من وجود حالات أخرى =====
        let hasImprt = container.imprt !== null;
        let hasTrshp = (container.trshpList && container.trshpList.length > 0);
        let hasExprt = (container.exprtList && container.exprtList.length > 0) || container.exprt;
        let hasStrge = container.strge !== null;
        let hasTrshpReturn = container.trshpReturn !== null;
        
        // ================================================
        // المسار 1: IMPRT فقط (بدون حالات أخرى)
        // مع Dray Status = FORWARD أو RETURN أو فارغ
        // ================================================
        if (hasImprt && !hasTrshp && !hasExprt && !hasStrge && !hasTrshpReturn) {
            let drayStatus = container.imprt["Dray Status"] || "";
            let obLocType = container.imprt["O/B Loc Type"] || "";
            
            // فقط FORWARD أو RETURN أو فارغ
            if (drayStatus === "FORWARD" || drayStatus === "RETURN") {
                let startTime = container.imprt["Start Time"] || "";
                let endTime = container.imprt["Rule End Time"] || "";
                let paidThruDate = container.imprt["PaidThruDate"] || "";
                
                if (startTime && endTime) {
                    let startTimeFormatted = convertDate(startTime);
                    let endDate = convertDate(endTime);
                    
                    if (startTimeFormatted && endDate) {
                        let startFormatted;
                        let paidDateFormatted = null;
                        let hasPaidThruDate = false;
                        
                        if (paidThruDate && paidThruDate !== "") {
                            hasPaidThruDate = true;
                            let paidDate = convertDate(paidThruDate);
                            paidDateFormatted = paidDate;
                            let start = new Date(paidDate);
                            start.setDate(start.getDate() + 1);
                            startFormatted = start.toLocaleDateString('en-CA');
                        } else {
                            hasPaidThruDate = false;
                            paidDateFormatted = "—";
                            let start = new Date(startTimeFormatted);
                            startFormatted = start.toLocaleDateString('en-CA');
                        }
                        
                        let days = diffDays(startFormatted, endDate);
                        if (days < 0) days = 0;
                        
                        let isExcl = isExcluded(lineId, excludeLines7);
                        let flexString01 = container.imprt["Flex String 01"] || "";
                        
                        let freeDays;
                        if (hasPaidThruDate) {
                            freeDays = 0;
                        } else {
                            freeDays = getFreeDays(imprtForwardPeriods7, lineId, startFormatted, flexString01, drayStatus);
                        }
                        
                        let net = days - freeDays;
                        if (net < 0) net = 0;
                        
                        let isRefrigerated = container.imprt["Is Refrigerated"] || "";
                        let isOOG = container.imprt["Is OOG"] || "";
                        let isHazardous = container.imprt["Is Hazardous"] || "";
                        let imdgClass = container.imprt["IMDG Class"] || "";
                        let type = (isRefrigerated === "true" || equipType.includes("R1")) ? "RF" : "GP";
                        let vesselName = container.imprt["I/B Carrier Name"] || container.imprt["O/B Carrier Name"] || "";
                        let method = isExcl ? "🚫 سماح مستقل" : "🔄 سماح عادي";
                        
                        let typeLabel = "IMPRT (VESSEL)";
                        if (drayStatus === "FORWARD") typeLabel = "IMPRT + FORWARD";
                        if (drayStatus === "RETURN") typeLabel = "IMPRT + RETURN";
                        
                        result.push({
                            "رقم الحاوية": id,
                            "الحجم": size,
                            "OOG": isOOG && isOOG.toLowerCase() === "true" ? "✅" : "❌",
                            "مبرد": isRefrigerated && isRefrigerated.toLowerCase() === "true" ? "✅" : "❌",
                            "خطير": isHazardous && isHazardous.toLowerCase() === "true" ? "✅" : "❌",
                            "IMDG": imdgClass || "—",
                            "النوع": type,
                            "الخط": lineId,
                            "نوع": typeLabel,
                            "Start Time": startTimeFormatted,
                            "PaidThruDate": paidDateFormatted,
                            "Start (Paid+1)": startFormatted,
                            "End": endDate,
                            "Days": days,
                            "Free": freeDays,
                            "Net": net,
                            "Vessel Name": vesselName || "—",
                            "طريقة الحساب": method
                        });
                    }
                }
            }
        }
        
        // ================================================
        // المسار 2: TRSHP فقط (بدون حالات أخرى)
        // مع Dray Status = FORWARD أو RETURN
        // ================================================
        if (hasTrshp && !hasImprt && !hasExprt && !hasStrge) {
            let trshpArray = container.trshpList || [];
            for (let tr of trshpArray) {
                let drayStatus = tr["Dray Status"] || "";
                
                // ← هنا التعديل: إضافة RETURN
                if (drayStatus === "FORWARD" || drayStatus === "RETURN") {
                    let startTime = tr["Start Time"] || "";
                    let endTime = tr["End Time"] || "";
                    let paidThruDate = tr["PaidThruDate"] || "";
                    
                    if (startTime && endTime) {
                        let startTimeFormatted = convertDate(startTime);
                        let endDate = convertDate(endTime);
                        
                        if (startTimeFormatted && endDate) {
                            let startFormatted;
                            let paidDateFormatted = null;
                            let hasPaidThruDate = false;
                            
                            if (paidThruDate && paidThruDate !== "") {
                                hasPaidThruDate = true;
                                let paidDate = convertDate(paidThruDate);
                                paidDateFormatted = paidDate;
                                let start = new Date(paidDate);
                                start.setDate(start.getDate() + 1);
                                startFormatted = start.toLocaleDateString('en-CA');
                            } else {
                                hasPaidThruDate = false;
                                paidDateFormatted = "—";
                                let start = new Date(startTimeFormatted);
                                startFormatted = start.toLocaleDateString('en-CA');
                            }
                            
                            let days = diffDays(startFormatted, endDate);
                            if (days < 0) days = 0;
                            
                            let isExcl = isExcluded(lineId, excludeLines7);
                            let flexString01 = tr["Flex String 01"] || "";
                            
                            let freeDays;
                            if (hasPaidThruDate) {
                                freeDays = 0;
                            } else {
                                freeDays = getFreeDays(imprtForwardPeriods7, lineId, startFormatted, flexString01, drayStatus);
                            }
                            
                            let net = days - freeDays;
                            if (net < 0) net = 0;
                            
                            let isRefrigerated = tr["Is Refrigerated"] || "";
                            let isOOG = tr["Is OOG"] || "";
                            let isHazardous = tr["Is Hazardous"] || "";
                            let imdgClass = tr["IMDG Class"] || "";
                            let type = (isRefrigerated === "true" || equipType.includes("R1")) ? "RF" : "GP";
                            let vesselName = tr["I/B Carrier Name"] || tr["O/B Carrier Name"] || "";
                            let method = isExcl ? "🚫 سماح مستقل" : "🔄 سماح عادي";
                            
                            let typeLabel = drayStatus === "FORWARD" ? "TRSHP + FORWARD" : "TRSHP + RETURN";
                            
                            result.push({
                                "رقم الحاوية": id,
                                "الحجم": size,
                                "OOG": isOOG && isOOG.toLowerCase() === "true" ? "✅" : "❌",
                                "مبرد": isRefrigerated && isRefrigerated.toLowerCase() === "true" ? "✅" : "❌",
                                "خطير": isHazardous && isHazardous.toLowerCase() === "true" ? "✅" : "❌",
                                "IMDG": imdgClass || "—",
                                "النوع": type,
                                "الخط": lineId,
                                "نوع": typeLabel,
                                "Start Time": startTimeFormatted,
                                "PaidThruDate": paidDateFormatted,
                                "Start (Paid+1)": startFormatted,
                                "End": endDate,
                                "Days": days,
                                "Free": freeDays,
                                "Net": net,
                                "Vessel Name": vesselName || "—",
                                "طريقة الحساب": method
                            });
                        }
                    }
                }
            }
        }
    }
    
    console.log("نتيجة تبويب 7:", result.length, "صف");
    currentData7 = result;
    
    // ================================================
    // إظهار التبويب 7 بالقوة
    // ================================================
    console.log("🔄 محاولة إظهار تبويب 7...");
    
    let statsDiv = document.getElementById("statsTab7");
    if (statsDiv) {
        if (currentData7.length > 0) {
            statsDiv.innerHTML = renderAdvancedStatsTab7(currentData7);
            statsDiv.style.display = "flex";
            statsDiv.style.visibility = "visible";
        }
    }
    
    let filtersDiv = document.getElementById("filtersTab7");
    if (filtersDiv) {
        filtersDiv.style.display = "flex";
        filtersDiv.style.visibility = "visible";
    }
    
    let wrapperDiv = document.getElementById("wrapperTab7");
    if (wrapperDiv) {
        wrapperDiv.style.display = "block";
        wrapperDiv.style.visibility = "visible";
    }
    
    let tbody = document.getElementById("bodyTab7");
    if (tbody) {
        if (currentData7.length === 0) {
            tbody.innerHTML = `<tr><td colspan="17" style="text-align:center; padding:40px;">⚠️ لا توجد بيانات</td></tr>`;
        } else {
            tbody.innerHTML = "";
            for (let item of currentData7) {
                let row = tbody.insertRow();
                
                let typeBadge = "";
                if (item["نوع"] === "IMPRT + FORWARD") {
                    typeBadge = '<span style="background:#ff6b6b; color:white; padding:2px 10px; border-radius:12px;">IMPRT + FORWARD</span>';
                } else if (item["نوع"] === "IMPRT + RETURN") {
                    typeBadge = '<span style="background:#ffc107; color:#333; padding:2px 10px; border-radius:12px;">IMPRT + RETURN</span>';
                } else if (item["نوع"] === "IMPRT (VESSEL)") {
                    typeBadge = '<span style="background:#667eea; color:white; padding:2px 10px; border-radius:12px;">IMPRT (VESSEL)</span>';
                } else if (item["نوع"] === "TRSHP + FORWARD") {
                    typeBadge = '<span style="background:#ffa07a; color:#333; padding:2px 10px; border-radius:12px;">TRSHP + FORWARD</span>';
                } else if (item["نوع"] === "TRSHP + RETURN") {
                    typeBadge = '<span style="background:#ff9800; color:#333; padding:2px 10px; border-radius:12px;">TRSHP + RETURN</span>';
                } else {
                    typeBadge = '<span style="background:#667eea; color:white; padding:2px 10px; border-radius:12px;">IMPRT (VESSEL)</span>';
                }
                
                row.innerHTML = `
                    <td style="font-weight:bold;">${item["رقم الحاوية"] || "—"}</td>
                    <td>${item["الحجم"] || "—"}</td>
                    <td>${item["OOG"] || "❌"}</td>
                    <td>${item["مبرد"] || "❌"}</td>
                    <td>${item["خطير"] || "❌"}</td>
                    <td>${item["IMDG"] || "—"}</td>
                    <td><strong>${item["النوع"] || "—"}</strong></td>
                    <td>${item["الخط"] || "—"}</td>
                    <td>${typeBadge}</td>
                    <td>${item["Start Time"] || "—"}</td>
                    <td>${item["PaidThruDate"] || "—"}</td>
                    <td>${item["Start (Paid+1)"] || "—"}</td>
                    <td>${item["End"] || "—"}</td>
                    <td style="background:#e3f2fd;">${item["Days"] || "—"}</td>
                    <td style="background:#fff3cd;">${item["Free"] || "—"}</td>
                    <td style="background:#d4edda; font-weight:bold;">${item["Net"] || "—"}</td>
                    <td>${item["Vessel Name"] || "—"}</td>
                `;
            }
        }
    }
    
    let tab7Div = document.getElementById("tab7");
    if (tab7Div) {
        if (!tab7Div.classList.contains("active")) {
            tab7Div.classList.add("active");
            document.querySelectorAll(".tab-content").forEach(c => {
                if (c.id !== "tab7") c.classList.remove("active");
            });
            document.querySelectorAll(".tab-btn").forEach(b => {
                b.classList.remove("active");
                if (b.dataset.tab === "tab7") b.classList.add("active");
            });
        }
    }
    
    let footerMsg = document.getElementById("footerMsg");
    if (footerMsg) {
        let currentText = footerMsg.innerHTML;
        let cleanText = currentText.replace(/\s*\|\s*IMPRT\+FORWARD:\s*\d+/, '');
        footerMsg.innerHTML = cleanText + ` | IMPRT+FORWARD: ${currentData7.length}`;
    }
    
    console.log("✅ processAndDisplay7 اكتمل");
}
// ========== دالة عرض جدول تبويب 7 ==========
function renderTable7(tbodyId, data, searchId, typeId, statsId) {
    console.log("=== renderTable7 ===");
    console.log("data length:", data?.length || 0);
    console.log("data sample:", data?.[0]);
    
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    
    let filtered = data.filter(item => {
        let matchSearch = item["رقم الحاوية"]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["النوع"] === type;
        return matchSearch && matchType;
    });
    
    console.log("filtered length:", filtered.length);
    
    let statsDiv = document.getElementById(statsId);
    if (statsDiv && data.length > 0) {
        statsDiv.innerHTML = renderAdvancedStatsTab7(data);
        statsDiv.style.display = "flex";
    }
    
    let tbody = document.getElementById(tbodyId);
    if (!tbody) {
        console.error("❌ tbody غير موجود:", tbodyId);
        return;
    }
    tbody.innerHTML = "";
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="17" style="text-align:center; padding:40px;">⚠️ لا توجد بيانات</td></tr>`;
        return;
    }
    
    for (let item of filtered) {
        let row = tbody.insertRow();
        let methodClass = item["طريقة الحساب"] === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
        
        let typeBadge = "";
        if (item["نوع"] === "IMPRT + FORWARD") {
            typeBadge = '<span style="background:#ff6b6b; color:white; padding:2px 10px; border-radius:12px;">IMPRT + FORWARD</span>';
        } else if (item["نوع"] === "TRSHP + FORWARD") {
            typeBadge = '<span style="background:#ffa07a; color:#333; padding:2px 10px; border-radius:12px;">TRSHP + FORWARD</span>';
        } else {
            typeBadge = '<span style="background:#667eea; color:white; padding:2px 10px; border-radius:12px;">IMPRT (VESSEL)</span>';
        }
        
        row.innerHTML = `
            <td style="font-weight:bold;">${item["رقم الحاوية"] || "—"}</td>
            <td>${item["الحجم"] || "—"}</td>
            <td>${item["OOG"] || "❌"}</td>
            <td>${item["مبرد"] || "❌"}</td>
            <td>${item["خطير"] || "❌"}</td>
            <td>${item["IMDG"] || "—"}</td>
            <td><strong>${item["النوع"] || "—"}</strong></td>
            <td>${item["الخط"] || "—"}</td>
            <td>${typeBadge}</td>
            <td>${item["Start Time"] || "—"}</td>
            <td>${item["PaidThruDate"] || "—"}</td>
            <td>${item["Start (Paid+1)"] || "—"}</td>
            <td>${item["End"] || "—"}</td>
            <td style="background:#e3f2fd;">${item["Days"] || "—"}</td>
            <td style="background:#fff3cd;">${item["Free"] || "—"}</td>
            <td style="background:#d4edda; font-weight:bold;">${item["Net"] || "—"}</td>
            <td>${item["Vessel Name"] || "—"}</td>
        `;
    }
    
    // إظهار العناصر
    let filtersDiv = document.getElementById("filtersTab7");
    let wrapperDiv = document.getElementById("wrapperTab7");
    if (filtersDiv) filtersDiv.style.display = "flex";
    if (wrapperDiv) wrapperDiv.style.display = "block";
    
    console.log("✅ renderTable7 completed, displayed:", filtered.length, "rows");
}

// ========== دالة إحصائيات تبويب 7 ==========
function renderAdvancedStatsTab7(data) {
    if (!data || data.length === 0) {
        return `<div style="padding:20px; text-align:center;">لا توجد بيانات</div>`;
    }
    
    // ===== إحصائيات حسب النوع =====
    let totalImprtForward = data.filter(i => i["نوع"] === "IMPRT + FORWARD");
    let totalImprtVessel = data.filter(i => i["نوع"] === "IMPRT (VESSEL)");
    let totalTrshpForward = data.filter(i => i["نوع"] === "TRSHP + FORWARD");
    
    let imprtForwardNet = totalImprtForward.reduce((s, i) => s + (i["Net"] || 0), 0);
    let imprtVesselNet = totalImprtVessel.reduce((s, i) => s + (i["Net"] || 0), 0);
    let trshpForwardNet = totalTrshpForward.reduce((s, i) => s + (i["Net"] || 0), 0);
    let totalNet = data.reduce((s, i) => s + (i["Net"] || 0), 0);
    let totalCount = data.length;
    
    // ===== إحصائيات حسب النوع (RF / GP) =====
    let rfContainers = data.filter(i => i["النوع"] === "RF");
    let gpContainers = data.filter(i => i["النوع"] === "GP");
    let rfNet = rfContainers.reduce((s, i) => s + (i["Net"] || 0), 0);
    let gpNet = gpContainers.reduce((s, i) => s + (i["Net"] || 0), 0);
    let rfCount = rfContainers.length;
    let gpCount = gpContainers.length;
    
    // ===== إحصائيات OOG =====
    let oogContainers = data.filter(i => i["OOG"] === "✅");
    let oogNet = oogContainers.reduce((s, i) => s + (i["Net"] || 0), 0);
    let oogCount = oogContainers.length;
    
    // ===== إحصائيات Hazardous =====
    let hazardousContainers = data.filter(i => i["خطير"] === "✅");
    let hazardousNet = hazardousContainers.reduce((s, i) => s + (i["Net"] || 0), 0);
    let hazardousCount = hazardousContainers.length;
    
    // ===== إحصائيات Refrigerated =====
    let refrigeratedContainers = data.filter(i => i["مبرد"] === "✅");
    let refrigeratedNet = refrigeratedContainers.reduce((s, i) => s + (i["Net"] || 0), 0);
    let refrigeratedCount = refrigeratedContainers.length;
    
    // ===== تفاصيل الحجم =====
    let size20Containers = data.filter(i => i["الحجم"]?.toString().startsWith("2"));
    let size40Containers = data.filter(i => i["الحجم"]?.toString().startsWith("4"));
    let size20Count = size20Containers.length;
    let size40Count = size40Containers.length;
    let size20Net = size20Containers.reduce((s, i) => s + (i["Net"] || 0), 0);
    let size40Net = size40Containers.reduce((s, i) => s + (i["Net"] || 0), 0);
    
    return `
        <div style="display: flex; gap: 15px; margin: 0 25px 20px 25px; flex-wrap: wrap;">
            
            <!-- بطاقة 1: الإجمالي الكلي -->
            <div style="flex: 1; background: linear-gradient(135deg, #43e97b, #38f9d7); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📦 الإجمالي الكلي</div>
                <div style="font-size: 28px; font-weight: bold;">${totalNet}</div>
                <div style="font-size: 12px;">صافي أيام</div>
                <div style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 11px;">
                    ${totalCount} حاوية
                </div>
            </div>
            
            <!-- بطاقة 2: IMPRT + FORWARD -->
            <div style="flex: 1; background: linear-gradient(135deg, #ff6b6b, #ee5a24); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📥 IMPRT + FORWARD</div>
                <div style="font-size: 28px; font-weight: bold;">${imprtForwardNet}</div>
                <div style="font-size: 12px;">صافي أيام</div>
                <div style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 11px;">
                    ${totalImprtForward.length} حاوية
                </div>
            </div>
            
            <!-- بطاقة 3: IMPRT (VESSEL) -->
            <div style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📥 IMPRT (VESSEL)</div>
                <div style="font-size: 28px; font-weight: bold;">${imprtVesselNet}</div>
                <div style="font-size: 12px;">صافي أيام</div>
                <div style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 11px;">
                    ${totalImprtVessel.length} حاوية
                </div>
            </div>
            
            <!-- بطاقة 4: TRSHP + FORWARD -->
            <div style="flex: 1; background: linear-gradient(135deg, #ffa07a, #ff6b6b); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">🚛 TRSHP + FORWARD</div>
                <div style="font-size: 28px; font-weight: bold;">${trshpForwardNet}</div>
                <div style="font-size: 12px;">صافي أيام</div>
                <div style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 11px;">
                    ${totalTrshpForward.length} حاوية
                </div>
            </div>
            
            <!-- بطاقة 5: تفاصيل إضافية -->
            <div style="flex: 1; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="background: #0a3d62; color: white; padding: 8px; text-align: center; font-weight: bold; font-size: 12px;">
                    📊 تفاصيل إضافية
                </div>
                <div style="padding: 10px; font-size: 11px;">

                    <div style="display: flex; justify-content: space-between; padding: 3px 0;">
                        <span>📦 20 قدم / 40 قدم</span>
                        <span><strong>${size20Count}</strong> / <strong>${size40Count}</strong> حاوية</span>
                    </div>

                </div>
            </div>
        </div>
    `;
}

// ========== دوال إدارة فترات السماح للتبويب 7 ==========
function getPeriodsArray7() {
    return imprtForwardPeriods7;
}

function setPeriodsArray7(periods) {
    imprtForwardPeriods7 = periods;
    localStorage.setItem("imprtForwardPeriodsTab7", JSON.stringify(imprtForwardPeriods7));
}

// ========== عرض قائمة الفترات للتبويب 7 ==========
function displayPeriodsList7(containerId) {
    let sorted = sortPeriods([...imprtForwardPeriods7]);
    let html = `<table style="width:100%; font-size:12px; border:1px solid #ddd;">
        <thead>
            <tr style="background:#f1f3f5;">
                <th>Line ID</th>
                <th>تاريخ البدء</th>
                <th>تاريخ النهاية</th>
                <th>أيام السماح</th>
                <th></th>
            </tr>
        </thead>
        <tbody>`;
    
    sorted.forEach(period => {
        let endDisplay = period.endDate || "مفتوحة";
        
        html += `<tr>
            <td>
                <select class="period-line-7" data-id="${period.id}" style="padding:6px 10px; border-radius:6px;">
                    <option value="*" ${period.lineId === "*" ? "selected" : ""}>* (الكل)</option>
                    ${masterLinesList.map(line => `<option value="${line}" ${period.lineId === line ? "selected" : ""}>${line}</option>`).join('')}
                </select>
            </td>
            <td><input type="date" class="period-start-7" data-id="${period.id}" value="${period.startDate || ''}" style="width:130px;"></td>
            <td style="background:#f8f9fa;">${endDisplay}</td>
            <td><input type="number" class="period-days-7" data-id="${period.id}" value="${period.freeDays}" style="width:80px;"></td>
            <td><button onclick="window.deletePeriod7(${period.id})" class="delete-btn">✖ حذف</button></td>
        </tr>`;
    });
    
    html += `</tbody></table>`;
    document.getElementById(containerId).innerHTML = html;
    
    setTimeout(() => {
        document.querySelectorAll('.period-line-7').forEach(sel => {
            sel.onchange = function() {
                let id = parseInt(this.dataset.id);
                let p = imprtForwardPeriods7.find(p => p.id === id);
                if (p) {
                    p.lineId = this.value;
                    setPeriodsArray7(imprtForwardPeriods7);
                    displayPeriodsList7('imprtForwardPeriodsList7');
                }
            };
        });
        
        document.querySelectorAll('.period-start-7').forEach(inp => {
            inp.onchange = function() {
                let id = parseInt(this.dataset.id);
                let p = imprtForwardPeriods7.find(p => p.id === id);
                if (p) {
                    p.startDate = this.value;
                    setPeriodsArray7(imprtForwardPeriods7);
                    displayPeriodsList7('imprtForwardPeriodsList7');
                }
            };
        });
        
        document.querySelectorAll('.period-days-7').forEach(inp => {
            inp.onchange = function() {
                let id = parseInt(this.dataset.id);
                let p = imprtForwardPeriods7.find(p => p.id === id);
                if (p) {
                    p.freeDays = parseInt(this.value) || 0;
                    setPeriodsArray7(imprtForwardPeriods7);
                    this.value = p.freeDays;
                }
            };
        });
    }, 100);
}

// ========== حذف فترة للتبويب 7 ==========
window.deletePeriod7 = function(periodId) {
    imprtForwardPeriods7 = imprtForwardPeriods7.filter(p => p.id !== periodId);
    let updated = updateEndDates(imprtForwardPeriods7);
    setPeriodsArray7(updated);
    displayPeriodsList7('imprtForwardPeriodsList7');
    if (containersMap.size > 0) processAndDisplay7();
};

// ========== إضافة فترة جديدة للتبويب 7 ==========
function addNewPeriod7() {
    let newId = nextIdImprtForward7++;
    let lastStart = new Date().toISOString().split('T')[0];
    
    let newPeriod = {
        id: newId,
        lineId: "*",
        startDate: lastStart,
        endDate: "",
        freeDays: 0
    };
    
    imprtForwardPeriods7.push(newPeriod);
    setPeriodsArray7(imprtForwardPeriods7);
    displayPeriodsList7('imprtForwardPeriodsList7');
}

// ========== عرض قائمة الاستثناءات للتبويب 7 ==========
function displayExcludeList7() {
    let html = '<div style="display:flex; flex-wrap:wrap; gap:10px;">';
    excludeLines7.forEach((line, idx) => {
        html += `<span class="exclude-badge">🚫 ${line} <button onclick="window.removeExclude7(${idx})" style="background:none; border:none; color:#721c24; cursor:pointer;">✖</button></span>`;
    });
    html += '</div>';
    if (excludeLines7.length === 0) html = '<span style="color:#6c757d;">لا توجد خطوط مستثناة</span>';
    document.getElementById('excludeList7').innerHTML = html;
}

// ========== حذف استثناء للتبويب 7 ==========
window.removeExclude7 = function(idx) {
    excludeLines7.splice(idx, 1);
    localStorage.setItem("excludeLines7", JSON.stringify(excludeLines7));
    displayExcludeList7();
    if (containersMap.size > 0) processAndDisplay7();
};

// ========== أحداث تبويب 7 ==========

// زر إعدادات السماح
document.getElementById("settingsBtn7").onclick = function() {
    document.getElementById("settingsPanel7").style.display = "block";
    displayPeriodsList7('imprtForwardPeriodsList7');
};

// زر إغلاق الإعدادات
document.getElementById("closeSettings7").onclick = function() {
    document.getElementById("settingsPanel7").style.display = "none";
};

// زر إضافة فترة جديدة
document.getElementById("addImprtForwardPeriodBtn7").onclick = function() {
    addNewPeriod7();
};

// زر حفظ الإعدادات
document.getElementById("savePeriodsBtn7").onclick = function() {
    let updated = updateEndDates(imprtForwardPeriods7);
    setPeriodsArray7(updated);
    localStorage.setItem("excludeLines7", JSON.stringify(excludeLines7));
    document.getElementById("settingsPanel7").style.display = "none";
    if (containersMap.size > 0) processAndDisplay7();
    document.getElementById("footerMsg").innerHTML = `✅ تم حفظ إعدادات IMPRT + FORWARD`;
};

// زر إضافة خط للاستثناء
document.getElementById("addExcludeBtn7").onclick = function() {
    let line = document.getElementById("excludeLine7").value;
    if (line && !excludeLines7.includes(line)) {
        excludeLines7.push(line);
        localStorage.setItem("excludeLines7", JSON.stringify(excludeLines7));
        displayExcludeList7();
        if (containersMap.size > 0) processAndDisplay7();
        document.getElementById("excludeLine7").value = "";
    }
};

// زر الطباعة
// طباعة تبويب 7
document.getElementById("printBtn7").onclick = function() {
    if (currentData7.length > 0) {
        let carrier = document.getElementById("headerCarrierName")?.innerText || "—";
        let date = document.getElementById("headerShippingDate")?.innerText || "—";
        let line = document.getElementById("headerLineId")?.innerText || "—";
        printReport('tab7', `📥 تقرير IMPRT + FORWARD | 🚢 ${carrier} | 📅 ${date} | 🏷️ ${line}`);
    } else {
        alert("لا توجد بيانات للطباعة");
    }
};

// زر تصدير Excel
document.getElementById("exportBtn7").onclick = function() {
    if (currentData7.length > 0) {
        let ws = XLSX.utils.json_to_sheet(currentData7);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "IMPRT_FORWARD");
        XLSX.writeFile(wb, `تقرير_IMPRT_FORWARD_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.xlsx`);
    } else {
        alert("لا توجد بيانات للتصدير");
    }
};

// زر اختيار الأعمدة
// ربط زر اختيار الأعمدة لتبويب 7
document.getElementById("selectColumnsBtn7").onclick = function() {
    openColumnModalTab7();
};

// البحث والفلترة
document.getElementById("searchTab7")?.addEventListener("input", function() {
    renderTable7("bodyTab7", currentData7, "searchTab7", "typeTab7", "statsTab7");
});

document.getElementById("typeTab7")?.addEventListener("change", function() {
    renderTable7("bodyTab7", currentData7, "searchTab7", "typeTab7", "statsTab7");
});

// عرض قائمة الاستثناءات عند التحميل
displayExcludeList7();

function renderTable6(tbodyId, data, searchId, typeId, statsId) {
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    // تطبيق تفضيلات الأعمدة المحفوظة
    let selected = selectedColumns.tab6;
    if (selected && selected.length > 0) {
        let thead = document.querySelector('#tableTab6 thead tr');
        if (thead) {
            thead.innerHTML = '';
            selected.forEach(colName => {
                let col = availableColumnsTab6.tab6.find(c => c.name === colName);
                let th = document.createElement('th');
                th.textContent = col ? col.label : colName;
                thead.appendChild(th);
            });
        }
        
        let tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${selected.length}" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات<\/td></tr>`;
            return;
        }
        
        for (let item of filtered) {
            let row = tbody.insertRow();
            selected.forEach(colName => {
                let cell = row.insertCell();
                let value = item[colName];
                
                if (["Is OOG", "Is Refrigerated", "Is Bundled", "Is Hazardous"].includes(colName)) {
                    cell.textContent = value === "true" ? "✅" : "❌";
                } else if (colName === "طريقة الحساب") {
                    let methodClass = value === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
                    cell.innerHTML = `<span class="${methodClass}">${value || "—"}</span>`;
                } else if (colName === "Flex String 01") {
                    if (value === "TRUE") {
                        cell.innerHTML = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
                    } else if (value === "FALSE") {
                        cell.innerHTML = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
                    } else {
                        cell.textContent = "—";
                    }
                } else if (colName === "Container No.") {
                    cell.textContent = value || "—";
                    cell.style.fontWeight = "bold";
                } else if (colName === "Type") {
                    cell.innerHTML = `<strong>${value || "—"}</strong>`;
                } else {
                    cell.textContent = value || "—";
                }
            });
        }
    } else {
        // العرض العادي بدون تفضيلات
        let statsDiv = document.getElementById(statsId);
        if (statsDiv && data.length > 0) {
            statsDiv.innerHTML = renderAdvancedStatsTab6(data);
            statsDiv.style.display = "flex";
        }
        
        let tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        tbody.innerHTML = "";
        
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="25" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات<\/td></tr>`;
            return;
        }
        
        for (let item of filtered) {
            let row = tbody.insertRow();
            let methodClass = item["طريقة الحساب"] === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
            
            let flexValue = item["Flex String 01"] || "—";
            let flexHtml = "—";
            if (flexValue === "TRUE") {
                flexHtml = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
            } else if (flexValue === "FALSE") {
                flexHtml = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
            }
            
            row.innerHTML = `
                <td style="font-weight:bold;">${item["Container No."] || "—"}<\/td>
                <td>${item["Size"] || "—"}<\/td>
                <td>${item["Is OOG"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Refrigerated"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Bundled"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["Is Hazardous"] === "true" ? "✅" : "❌"}<\/td>
                <td>${item["IMDG Class"] || "—"}<\/td>
                <td><strong>${item["Type"] || "—"}</strong><\/td>
                <td>${item["Line ID"] || "—"}<\/td>
                <td><span class="${methodClass}">${item["طريقة الحساب"] || "—"}</span><\/td>
                <td>${flexHtml}<\/td>
                <td>${item["STRGE Start"] || "—"}<\/td>
                <td>${item["STRGE End"] || "—"}<\/td>
                <td style="background:#e3f2fd;">${item["STRGE Days"] || "—"}<\/td>
                <td style="background:#f8d7da;">${item["Overlap Days"] || "—"}<\/td>
                <td style="background:#fff3cd;">${item["STRGE After Overlap"] || "—"}<\/td>
                <td style="background:#fff3cd;">${item["STRGE Free"] || "—"}<\/td>
                <td style="background:#d4edda;">${item["STRGE Net"] || "—"}<\/td>
                <td>${item["EXPRT Start"] || "—"}<\/td>
                <td>${item["EXPRT End"] || "—"}<\/td>
                <td style="background:#e3f2fd;">${item["EXPRT Days"] || "—"}<\/td>
                <td style="background:#fff3cd;">${item["EXPRT Free"] || "—"}<\/td>
                <td style="background:#d4edda;">${item["EXPRT Net"] || "—"}<\/td>
                <td style="background:#cce5ff; font-weight:bold;">${item["Total Net"] || "—"}<\/td>
                <td>${item["Vessel Name"] || "—"}<\/td>
            `;
        }
    }
    
    document.getElementById(statsId).style.display = "flex";
    document.getElementById("filtersTab6").style.display = "flex";
    document.getElementById("wrapperTab6").style.display = "block";
}

function renderAdvancedStatsTab6(data) {
    if (!data || data.length === 0) {
        return `<div style="padding:20px; text-align:center;">لا توجد بيانات</div>`;
    }
    
    let totalStrgeNet = data.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let totalExprtNet = data.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    let totalCount = data.length;
    
    let refrigeratedContainers = data.filter(i => i["Is Refrigerated"] === "true");
	    // ========== الحاويات المبردة ==========
    let refrigeratedCount = refrigeratedContainers.length;
    let refrigeratedStrgeNet = refrigeratedContainers.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let refrigeratedExprtNet = refrigeratedContainers.reduce((s, i) => s + (i["EXPRT Net"] || 0), 0);
    
    let refrigerated20 = refrigeratedContainers.filter(i => i["Size"]?.toString().startsWith("2"));
    let refrigerated40 = refrigeratedContainers.filter(i => i["Size"]?.toString().startsWith("4"));
    let refrigerated20Count = refrigerated20.length;
    let refrigerated40Count = refrigerated40.length;
    let refrigerated20StrgeNet = refrigerated20.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let refrigerated40StrgeNet = refrigerated40.reduce((s, i) => s + (i["STRGE Net"] || 0), 0);
    let size20Containers = data.filter(i => i["Size"]?.toString().startsWith("2"));
    let size40Containers = data.filter(i => i["Size"]?.toString().startsWith("4"));
    
    let size20Count = size20Containers.length;
    let size40Count = size40Containers.length;
    
    return `
        <div style="display: flex; gap: 15px; margin: 0 25px 20px 25px; flex-wrap: wrap;">
            <div style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📦 إجمالي STRGE</div>
                <div style="font-size: 28px; font-weight: bold;">${totalStrgeNet}</div>
                <div style="font-size: 12px;">صافي أيام التخزين</div>
            </div>
			    <div style="flex: 1; background: linear-gradient(135deg, #4facfe, #00f2fe); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">❄️ الحاويات المبردة (RF)</div>
                <div style="font-size: 28px; font-weight: bold;">${refrigeratedCount}</div>
                <div style="font-size: 12px;">عدد الحاويات</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>📦 إجمالي STRGE: ${refrigeratedStrgeNet} يوم</div>
                    <div>📤 إجمالي EXPRT: ${refrigeratedExprtNet} يوم</div>
                    <div>📦 20 قدم: ${refrigerated20Count} حاوية (${refrigerated20StrgeNet} يوم)</div>
                    <div>📦 40 قدم: ${refrigerated40Count} حاوية (${refrigerated40StrgeNet} يوم)</div>
                </div>
            </div>
            <div style="flex: 1; background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📤 إجمالي EXPRT</div>
                <div style="font-size: 28px; font-weight: bold;">${totalExprtNet}</div>
                <div style="font-size: 12px;">صافي أيام التصدير</div>
            </div>
            <div style="flex: 1; background: linear-gradient(135deg, #43e97b, #38f9d7); border-radius: 12px; padding: 15px; text-align: center; color: white;">
                <div style="font-size: 14px;">📦 إجمالي الحاويات</div>
                <div style="font-size: 28px; font-weight: bold;">${totalCount}</div>
                <div style="font-size: 12px;">حاوية</div>
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px;">
                    <div>❄️ مبردة: ${refrigeratedContainers.length}</div>
                    <div>📦 20 قدم: ${size20Count}</div>
                    <div>📦 40 قدم: ${size40Count}</div>
                </div>
            </div>
        </div>
    `;
}

// تبويب 6
document.getElementById("settingsBtn6").onclick = () => {
    document.getElementById("settingsPanel6").style.display = "block";
    displayPeriodsList('strgePeriodsList6', strgePeriods6, '6');
    displayPeriodsList('exprtPeriodsList6', exprtPeriods6, '6');
};
document.getElementById("closeSettings6").onclick = () => { document.getElementById("settingsPanel6").style.display = "none"; };
document.getElementById("addStrgePeriodBtn6").onclick = () => addNewPeriod('6', 'STRGE');
document.getElementById("addExprtPeriodBtn6").onclick = () => addNewPeriod('6', 'EXPRT');
document.getElementById("savePeriodsBtn6").onclick = () => {
    let updatedStrge = updateEndDates(strgePeriods6);
    let updatedExprt = updateEndDates(exprtPeriods6);
    localStorage.setItem("strgePeriodsTab6", JSON.stringify(updatedStrge));
    localStorage.setItem("exprtPeriodsTab6", JSON.stringify(updatedExprt));
    localStorage.setItem("excludeLines6", JSON.stringify(excludeLines6));
    strgePeriods6 = updatedStrge;
    exprtPeriods6 = updatedExprt;
    document.getElementById("settingsPanel6").style.display = "none";
    if (containersMap.size > 0) processAndDisplay6();
    document.getElementById("footerMsg").innerHTML = `✅ تم حفظ إعدادات STRGE/EXPRT للتبويب 6`;
};
document.getElementById("addExcludeBtn6").onclick = () => {
    let line = document.getElementById("excludeLine6").value;
    if (line && !excludeLines6.includes(line)) {
        excludeLines6.push(line);
        localStorage.setItem("excludeLines6", JSON.stringify(excludeLines6));
        displayExcludeList('excludeList6', excludeLines6, '6');
        if (containersMap.size > 0) processAndDisplay6();
        document.getElementById("excludeLine6").value = "";
    }
};

// فلترة التبويب 6
document.getElementById("searchTab6")?.addEventListener("input", () => renderTable6("bodyTab6", currentData6, "searchTab6", "typeTab6", "statsTab6"));
document.getElementById("typeTab6")?.addEventListener("change", () => renderTable6("bodyTab6", currentData6, "searchTab6", "typeTab6", "statsTab6"));

// تبويب 6
document.getElementById("printBtn6").onclick = () => {
    let carrier = document.getElementById("headerCarrierName")?.innerText || "—";
    let date = document.getElementById("headerShippingDate")?.innerText || "—";
    let line = document.getElementById("headerLineId")?.innerText || "—";
    printReport('tab6', `تقرير STRGE + EXPRT فقط | 🚢 ${carrier} | 📅 ${date} | 🏷️ ${line}`);
};	

// تصدير التبويب 6
document.getElementById("exportBtn6").onclick = () => {
    let ws = XLSX.utils.json_to_sheet(currentData6);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "STRGE_EXPRT_ONLY");
    XLSX.writeFile(wb, `تقرير_STRGE_EXPRT_ONLY_${new Date().toISOString().slice(0,19)}.xlsx`);
};

function openColumnModalTab6() {
    let modal = document.getElementById('columnModal');
    let body = document.getElementById('columnModalBody');
    
    let html = `<div class="select-all">
        <label style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="selectAllColumns"> <strong>تحديد الكل</strong>
        </label>
    </div>`;
    
    let cols = availableColumnsTab6.tab6;
    if (cols) {
        cols.forEach(col => {
            let isChecked = selectedColumns.tab6?.includes(col.name) || 
                           (selectedColumns.tab6?.length === 0 && col.default);
            html += `
                <div class="column-option">
                    <input type="checkbox" class="col-checkbox" value="${col.name}" id="col_${col.name.replace(/ /g, '_')}" ${isChecked ? 'checked' : ''}>
                    <label for="col_${col.name.replace(/ /g, '_')}">${col.label}</label>
                </div>
            `;
        });
    }
    
    body.innerHTML = html;
    modal.classList.add('active');
    
    document.getElementById('selectAllColumns').onchange = (e) => {
        document.querySelectorAll('.col-checkbox').forEach(cb => cb.checked = e.target.checked);
    };
    
    document.getElementById('applyColumnSelection').onclick = () => {
        let selected = [];
        document.querySelectorAll('.col-checkbox:checked').forEach(cb => selected.push(cb.value));
        selectedColumns.tab6 = selected;
        localStorage.setItem(`selectedColumns_tab6`, JSON.stringify(selected));
        closeColumnModal();
        if (currentData6.length > 0) {
            renderTable6WithSelectedColumns('bodyTab6', currentData6, 'searchTab6', 'typeTab6', 'statsTab6');
        }
    };
}

// ========== دوال اختيار الأعمدة للتبويب 6 ==========

function renderTable6WithSelectedColumns(tbodyId, data, searchId, typeId, statsId) {
    console.log("renderTable6WithSelectedColumns called, data length:", data?.length || 0);
    
    if (!data || data.length === 0) {
        let tbody = document.getElementById(tbodyId);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="25" style="text-align:center; padding:40px;">⚠️ لا توجد بيانات<\/td></tr>`;
        }
        return;
    }
    
    let search = document.getElementById(searchId)?.value.toLowerCase() || "";
    let type = document.getElementById(typeId)?.value || "";
    
    let filtered = data.filter(item => {
        let matchSearch = item["Container No."]?.toLowerCase().includes(search) || false;
        let matchType = !type || item["Type"] === type;
        return matchSearch && matchType;
    });
    
    let selected = selectedColumns.tab6;
    if (!selected || selected.length === 0) {
        selected = availableColumnsTab6.tab6.filter(c => c.default).map(c => c.name);
    }
    
    let thead = document.querySelector('#tableTab6 thead tr');
    if (thead) {
        thead.innerHTML = '';
        selected.forEach(colName => {
            let col = availableColumnsTab6.tab6.find(c => c.name === colName);
            let th = document.createElement('th');
            th.textContent = col ? col.label : colName;
            thead.appendChild(th);
        });
    }
    
    let tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        let colspan = selected.length;
        tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center; padding:40px;">⚠️ لا توجد حاويات تطابق البحث<\/td></tr>`;
        return;
    }
    
    for (let item of filtered) {
        let row = tbody.insertRow();
        selected.forEach(colName => {
            let cell = row.insertCell();
            let value = item[colName];
            
            if (["Is OOG", "Is Refrigerated", "Is Bundled", "Is Hazardous"].includes(colName)) {
                cell.textContent = value === "true" ? "✅" : "❌";
            } else if (colName === "طريقة الحساب") {
                let methodClass = value === "🚫 سماح مستقل" ? "exclude-badge" : "method-badge";
                cell.innerHTML = `<span class="${methodClass}">${value || "—"}</span>`;
            } else if (colName === "Flex String 01") {
                if (value === "TRUE") {
                    cell.innerHTML = '<span style="background:#ff6b6b; color:white; padding:2px 8px; border-radius:12px;">⭐ خاص</span>';
                } else if (value === "FALSE") {
                    cell.innerHTML = '<span style="background:#4facfe; color:white; padding:2px 8px; border-radius:12px;">📋 عادي</span>';
                } else {
                    cell.textContent = "—";
                }
            } else if (colName === "Container No.") {
                cell.textContent = value || "—";
                cell.style.fontWeight = "bold";
            } else if (colName === "Type") {
                cell.innerHTML = `<strong>${value || "—"}</strong>`;
            } else {
                cell.textContent = value || "—";
            }
        });
    }
    
    let statsDiv = document.getElementById(statsId);
    if (statsDiv && statsDiv.innerHTML === "" && data.length > 0) {
        statsDiv.innerHTML = renderAdvancedStatsTab6(data);
        statsDiv.style.display = "flex";
    }
}

function updateHeaderInfo(tabId) {
    let carrierName = "—";
    let maxDate = "—";
    let lineIds = new Set();
    
    for (let [id, container] of containersMap.entries()) {
        let sourceData = null;
        
        // تحديد مصدر البيانات حسب التبويب
        if (tabId === '1' || tabId === '2' || tabId === '3' || tabId === '6' || tabId === '7') {
            // ========== التعديل: استخدام exprtList (المصفوفة) أولاً ==========
            if (container.exprtList && container.exprtList.length > 0) {
                sourceData = container.exprtList[0];
            } else if (container.exprt) {
                sourceData = container.exprt;
            }
        } 
        else if (tabId === '4') {
            sourceData = container.strge;
        }
        else if (tabId === '5') {
            // ========== التعديل: استخدام trshpList (المصفوفة) أولاً ==========
            if (container.trshpList && container.trshpList.length > 0) {
                sourceData = container.trshpList[0];
            } else if (container.trshp) {
                sourceData = container.trshp;
            }
        }
        
        if (sourceData) {
            // O/B Carrier Name
            if (carrierName === "—") {
                carrierName = sourceData["O/B Carrier Name"] || "—";
                if (carrierName === "—") {
                    carrierName = sourceData["I/B Carrier Name"] || "—";
                }
            }
            
            // O/B Carrier ATD (تاريخ الشحن)
            let ata = sourceData["O/B Carrier ATD"] || sourceData["O/B Carrier ATA"] || sourceData["I/B Carrier ATA"];
            if (ata && ata !== "") {
                let convertedDate = convertDate(ata);
                if (convertedDate) {
                    if (maxDate === "—" || convertedDate > maxDate) {
                        maxDate = convertedDate;
                    }
                }
            }
            
            // Line ID
            let lineId = sourceData["Line ID"];
            if (lineId && lineId !== "") {
                lineIds.add(lineId);
            }
        }
    }
    
    // تحديث الـ Header
    let carrierNameSpan = document.getElementById("headerCarrierName");
    let shippingDateSpan = document.getElementById("headerShippingDate");
    let lineIdSpan = document.getElementById("headerLineId");
    
    if (carrierNameSpan) {
        carrierNameSpan.textContent = carrierName;
    }
    if (shippingDateSpan) {
        shippingDateSpan.textContent = maxDate;
    }
    if (lineIdSpan) {
        lineIdSpan.textContent = lineIds.size > 0 ? Array.from(lineIds).join(", ") : "—";
    }
}

function updateHeaderFromDisplayData(tabId, displayData) {
    let carrierName = "—";
    let maxDate = "—";
    let lineIds = new Set();
    
    if (!displayData || displayData.length === 0) {
        // إذا لا توجد بيانات، استخدم القيم الافتراضية
        updateHeaderUI(carrierName, maxDate, lineIds);
        return;
    }
    
// تبويب 5 (TRSHP فقط) - المصدر هو TRSHP
if (tabId === '5') {
    let displayedContainerIds = new Set(displayData.map(item => item["Container No."]));
    
    for (let [id, container] of containersMap.entries()) {
        if (!displayedContainerIds.has(id)) continue;
        
        // الحصول على جميع فترات TRSHP
        let trshpArray = container.trshpList || [];
        if (container.trshp && trshpArray.length === 0) {
            trshpArray = [container.trshp];
        }
        
        // البحث عن فترة O/B Loc Type = VESSEL (السفينة)
        let vesselData = null;
        
        for (let tr of trshpArray) {
            let locType = tr["O/B Loc Type"] || "";  // ← التصحيح هنا: O/B Loc Type
            if (locType === "VESSEL") {
                vesselData = tr;
                break;
            }
        }
        
        // نأخذ بيانات VESSEL فقط
        if (vesselData) {
            // O/B Carrier Name (اسم السفينة)
            if (carrierName === "—") {
                carrierName = vesselData["O/B Carrier Name"] || vesselData["I/B Carrier Name"] || "—";
            }
            
            // O/B Carrier ATD (تاريخ الشحن) - من سطر VESSEL فقط
            let atd = vesselData["O/B Carrier ATD"] || vesselData["O/B Carrier ATA"] || "";
            if (atd && atd !== "") {
                let convertedDate = convertDate(atd);
                if (convertedDate) {
                    if (maxDate === "—" || convertedDate > maxDate) {
                        maxDate = convertedDate;
                    }
                }
            }
            
            // Line ID
            let lineId = vesselData["Line ID"];
            if (lineId && lineId !== "") {
                lineIds.add(lineId);
            }
        }
    }
    
    // إذا لم نجد بيانات VESSEL، نأخذ من displayData
    if (carrierName === "—") {
        for (let item of displayData) {
            if (carrierName === "—") {
                carrierName = item["Vessel Name"] || "—";
            }
            let lineId = item["Line ID"];
            if (lineId && lineId !== "") {
                lineIds.add(lineId);
            }
        }
    }
}
// التبويب 4 (STRGE فارغ + IMPRT) - المصدر الأساسي هو STRGE
else if (tabId === '4') {
    let displayedContainerIds = new Set(displayData.map(item => item["Container No."]));
    
    for (let [id, container] of containersMap.entries()) {
        if (!displayedContainerIds.has(id)) continue;
        
        // المصدر الأساسي هو STRGE (التخزين)
        let sourceData = container.strge;
        
        if (sourceData) {
            // اسم سفينة الشحن من STRGE
            if (carrierName === "—") {
                carrierName = sourceData["O/B Carrier Name"] || "";
                if (carrierName === "") {
                    carrierName = sourceData["I/B Carrier Name"] || "—";
                }
            }
            
            // تاريخ الشحن من STRGE
            let atd = sourceData["O/B Carrier ATD"] || sourceData["O/B Carrier ATA"];
            if (atd && atd !== "") {
                let convertedDate = convertDate(atd);
                if (convertedDate) {
                    if (maxDate === "—" || convertedDate > maxDate) {
                        maxDate = convertedDate;
                    }
                }
            }
            
            // Line ID
            let lineId = sourceData["Line ID"];
            if (lineId && lineId !== "") {
                lineIds.add(lineId);
            }
        }
    }
    
    // إذا لم نجد بيانات من STRGE، استخدم القيم من displayData كاحتياطي
    if (carrierName === "—") {
        for (let item of displayData) {
            if (carrierName === "—") {
                carrierName = item["Vessel Name"] || "—";
            }
            let lineId = item["Line ID"];
            if (lineId && lineId !== "") {
                lineIds.add(lineId);
            }
        }
    }
}
    // التبويبات 1,2,3,6: خذ من بيانات EXPRT (O/B Carrier Name) - معدل لاستخدام exprtList
    else {
        // نبحث في containersMap عن EXPRT المرتبطة بالحاويات المعروضة
        let displayedContainerIds = new Set(displayData.map(item => item["Container No."]));
        
        for (let [id, container] of containersMap.entries()) {
            if (!displayedContainerIds.has(id)) continue;
            
            // ========== التعديل: استخدام exprtList (المصفوفة) أولاً ==========
            let sourceData = null;
            if (container.exprtList && container.exprtList.length > 0) {
                sourceData = container.exprtList[0];  // نأخذ أول سجل EXPRT
            } else if (container.exprt) {
                sourceData = container.exprt;         // للتوافق مع الإصدارات القديمة
            }
            
            if (sourceData) {
                if (carrierName === "—") {
                    carrierName = sourceData["O/B Carrier Name"] || "—";
                    if (carrierName === "—") {
                        carrierName = sourceData["I/B Carrier Name"] || "—";
                    }
                }
                
                let atd = sourceData["O/B Carrier ATD"] || sourceData["O/B Carrier ATA"];
                if (atd && atd !== "") {
                    let convertedDate = convertDate(atd);
                    if (convertedDate) {
                        if (maxDate === "—" || convertedDate > maxDate) {
                            maxDate = convertedDate;
                        }
                    }
                }
                
                let lineId = sourceData["Line ID"];
                if (lineId && lineId !== "") {
                    lineIds.add(lineId);
                }
            }
        }
    }
    
    updateHeaderUI(carrierName, maxDate, lineIds);
}

function updateHeaderUI(carrierName, maxDate, lineIds) {
    // تحديث اسم السفينة في عنوان الصفحة و h1
    if (carrierName !== "—" && carrierName !== currentVesselName) {
        currentVesselName = carrierName;
        document.title = `📦 تقرير أيام التخزين - ${currentVesselName}`;
        let h1Element = document.querySelector('.header h1');
        if (h1Element) {
            h1Element.innerHTML = `📦 تقرير أيام التخزين - ${currentVesselName}`;
        }
        let vesselNameSpan = document.getElementById("vesselNameTitle");
        if (vesselNameSpan) {
            vesselNameSpan.textContent = currentVesselName;
        }
    }
    
    let carrierNameSpan = document.getElementById("headerCarrierName");
    let shippingDateSpan = document.getElementById("headerShippingDate");
    let lineIdSpan = document.getElementById("headerLineId");
    
    if (carrierNameSpan) {
        carrierNameSpan.textContent = carrierName;
    }
    if (shippingDateSpan) {
        shippingDateSpan.textContent = maxDate;
    }
    if (lineIdSpan) {
        lineIdSpan.textContent = lineIds.size > 0 ? Array.from(lineIds).join(", ") : "—";
    }
}
// ربط زر اختيار الأعمدة للتبويب 6
document.getElementById("selectColumnsBtn6").onclick = () => openColumnModalTab6();
// عرض قائمة الاستثناءات
displayExcludeList('excludeList6', excludeLines6, '6');

// ربط زر اختيار الأعمدة للتبويب 5
document.getElementById("selectColumnsBtn5").onclick = () => openColumnModalTab5();

