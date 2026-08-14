// ========================================
// إعداد Supabase
// ========================================

const SUPABASE_URL =
    "https://ssuqesxmqewbwxoeyfuy.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ogUaPDcjbxJba4Ty4cMX1A__HROEDny";

const MEMORIES_TABLE =
    "memories";


// ========================================
// طلبات Supabase
// ========================================

async function supabaseRequest(
    endpoint,
    options = {}
) {

    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            function () {

                controller.abort();

            },
            15000
        );


    try {

        console.log(
            "☁️ Supabase Request:",
            endpoint
        );


        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/${endpoint}`,
                {

                    method:
                        options.method || "GET",

                    body:
                        options.body || undefined,

                    signal:
                        controller.signal,

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`,

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json",

                        ...(options.headers || {})

                    }

                }
            );


        clearTimeout(
            timeout
        );


        const text =
            await response.text();


        console.log(
            "☁️ Supabase Status:",
            response.status
        );


        console.log(
            "☁️ Supabase Response:",
            text
        );


        if (!response.ok) {

            console.error(
                "===================================="
            );

            console.error(
                "❌ SUPABASE ERROR"
            );

            console.error(
                "Status:",
                response.status
            );

            console.error(
                "Response:",
                text
            );

            console.error(
                "===================================="
            );


            throw new Error(
                `Supabase Error ${response.status}: ${text}`
            );

        }


        if (!text) {

            return [];

        }


        try {

            return JSON.parse(
                text
            );

        } catch (error) {

            console.warn(
                "⚠️ Supabase returned non-JSON:",
                text
            );

            return [];

        }

    } catch (error) {

        clearTimeout(
            timeout
        );


        if (
            error.name === "AbortError"
        ) {

            console.error(
                "❌ Supabase request timed out after 15 seconds."
            );

        } else {

            console.error(
                "❌ Supabase Request Failed:",
                error
            );

        }


        return null;

    }

}


// ========================================
// تحويل قيمة القفل
// ========================================

function isMemoryLocked(memory) {

    const value =
        memory?.is_locked;


    if (value === true) {

        return true;

    }


    if (value === false) {

        return false;

    }


    if (
        typeof value === "string"
    ) {

        return (
            value.toLowerCase() === "true" ||
            value === "1"
        );

    }


    if (
        typeof value === "number"
    ) {

        return value === 1;

    }


    return false;

}


// ========================================
// هل الذكرى مقفولة حاليًا؟
// ========================================
function isMemoryStillLocked(memory) {

    if (!memory) {

        return false;

    }


    if (memory.open_at) {

        const openTime =
            new Date(
                memory.open_at
            ).getTime();


        if (!isNaN(openTime)) {

            return openTime > Date.now();

        }

    }


    return isMemoryLocked(
        memory
    );

}


// ========================================
// الذهاب إلى الرسالة
// ========================================

function goToStory() {

    const story =
        document.getElementById(
            "story"
        );


    if (!story) {

        console.warn(
            "⚠️ عنصر story غير موجود"
        );

        return;

    }


    story.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}


window.goToStory =
    goToStory;


// ========================================
// الذهاب إلى الذكريات
// ========================================

function goToMemories() {

    const memories =
        document.getElementById(
            "memories-book-section"
        );


    if (!memories) {

        console.warn(
            "⚠️ عنصر memories-book-section غير موجود"
        );

        return;

    }


    memories.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}


window.goToMemories =
    goToMemories;


// ========================================
// تاريخ اليوم
// ========================================

function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


// ========================================
// تثبيت تاريخ اليوم
// ========================================

function setTodayMemoryDate() {

    const input =
        document.getElementById(
            "memory-date"
        );


    if (!input) {

        return;

    }


    input.value =
        getTodayDate();


    input.readOnly =
        true;


    input.setAttribute(
        "readonly",
        "readonly"
    );

}


// ========================================
// فتح فورم الذكرى
// ========================================

function openMemoryForm() {

    const form =
        document.getElementById(
            "memory-form"
        );


    if (!form) {

        console.error(
            "❌ memory-form غير موجود"
        );

        return;

    }


    form.style.display =
        "block";


    setTodayMemoryDate();


    form.scrollIntoView({

        behavior:
            "smooth",

        block:
            "center"

    });


    const status =
        document.getElementById(
            "memory-form-status"
        );


    if (status) {

        status.textContent =
            "";

    }

}


window.openMemoryForm =
    openMemoryForm;


// ========================================
// إغلاق فورم الذكرى
// ========================================

function closeMemoryForm() {

    const form =
        document.getElementById(
            "memory-form"
        );


    if (!form) {

        return;

    }


    form.style.display =
        "none";

}


window.closeMemoryForm =
    closeMemoryForm;


// ========================================
// إظهار موعد الفتح
// ========================================

function toggleOpenDate() {

    const checkbox =
        document.getElementById(
            "memory-locked"
        );


    const area =
        document.getElementById(
            "open-date-area"
        );


    const openAt =
        document.getElementById(
            "memory-open-at"
        );


    if (
        !checkbox ||
        !area
    ) {

        return;

    }


    if (
        checkbox.checked
    ) {

        area.style.display =
            "block";


        if (openAt) {

            openAt.required =
                true;

        }

    } else {

        area.style.display =
            "none";


        if (openAt) {

            openAt.required =
                false;

            openAt.value =
                "";

        }

    }

}


window.toggleOpenDate =
    toggleOpenDate;


// ========================================
// حالة الفورم
// ========================================

function showFormStatus(
    message,
    error = false
) {

    const status =
        document.getElementById(
            "memory-form-status"
        );


    if (!status) {

        return;

    }


    status.textContent =
        message;


    status.style.color =
        error
            ? "#ff7b9f"
            : "#ffb4ca";

}


// ========================================
// إعادة زر الحفظ
// ========================================

function resetSaveButton() {

    const saveButton =
        document.querySelector(
            '#memory-form button[onclick="saveMemoryFromForm()"]'
        );


    if (!saveButton) {

        return;

    }


    saveButton.disabled =
        false;


    saveButton.style.opacity =
        "1";


    saveButton.style.cursor =
        "pointer";


    saveButton.innerHTML =
        "❤️ حفظ الرسالة";

}


// ========================================
// إنشاء عنوان الذكرى
// ========================================

function createMemoryTitle(
    memoryType
) {

    const type =
        String(
            memoryType || ""
        ).trim();


    switch (type) {

        case "حب":

            return "رسالة حب ❤️";


        case "ذكرى":

            return "ذكرى جميلة 📖";


        case "مستقبل":

            return "رسالة للمستقبل 🗓️";


        case "أخرى":

            return "ذكرى جديدة ✨";


        default:

            return "ذكرى جديدة ❤️";

    }

}


// ========================================
// حفظ الذكرى من الفورم
// ========================================

async function saveMemoryFromForm() {

    console.log(
        "💾 بدأ حفظ الذكرى..."
    );


    // ========================================
    // جلب العناصر
    // ========================================

    const messageElement =
        document.getElementById(
            "memory-message"
        );


    const senderElement =
        document.getElementById(
            "memory-sender"
        );


    const typeElement =
        document.getElementById(
            "memory-type"
        );


    const imageElement =
        document.getElementById(
            "memory-image"
        );


    const lockedElement =
        document.getElementById(
            "memory-locked"
        );


    const openAtElement =
        document.getElementById(
            "memory-open-at"
        );


    // ========================================
    // قراءة البيانات
    // ========================================

    const message =
        messageElement
            ? String(
                messageElement.value || ""
            ).trim()
            : "";


    const sender =
        senderElement
            ? String(
                senderElement.value || ""
            ).trim()
            : "";


    const memoryType =
        typeElement
            ? String(
                typeElement.value || "حب"
            ).trim()
            : "حب";


    const imageUrl =
        imageElement
            ? String(
                imageElement.value || ""
            ).trim()
            : "";


    const locked =
        lockedElement
            ? lockedElement.checked === true
            : false;


    const openAt =
        openAtElement
            ? openAtElement.value
            : "";


    console.log(
        "📝 Message:",
        message
    );


    console.log(
        "👤 Sender:",
        sender
    );


    console.log(
        "❤️ Type:",
        memoryType
    );


    console.log(
        "🔒 Locked:",
        locked
    );


    console.log(
        "⏰ Open At:",
        openAt
    );


    // ========================================
    // التحقق من الرسالة
    // ========================================

    if (!message) {

        showFormStatus(
            "💌 اكتبي الرسالة أو الكلام اللي جواكي.",
            true
        );

        return;

    }


    // ========================================
    // التحقق من موعد القفل
    // ========================================

    if (
        locked &&
        !openAt
    ) {

        showFormStatus(
            "⏰ اختاري موعد فتح الرسالة.",
            true
        );

        return;

    }


    // ========================================
    // تجهيز موعد الفتح
    // ========================================

    let finalOpenAt =
        null;


    if (locked) {

        const openDate =
            new Date(
                openAt
            );


        if (
            isNaN(
                openDate.getTime()
            )
        ) {

            showFormStatus(
                "⚠️ موعد الفتح غير صحيح.",
                true
            );

            return;

        }


        if (
            openDate.getTime() <=
            Date.now()
        ) {

            showFormStatus(
                "⏰ لازم موعد الفتح يكون في المستقبل.",
                true
            );

            return;

        }


        finalOpenAt =
            openDate.toISOString();

    }


    // ========================================
    // العنوان
    // ========================================

    const title =
        createMemoryTitle(
            memoryType
        );


    // ========================================
    // البيانات النهائية
    //
    // مهم:
    // title موجود دائمًا
    // وليس null
    // ========================================

    const memory = {

        title:
            title || "ذكرى جديدة ❤️",

        message:
            message,

        memory_date:
            getTodayDate(),

        memory_type:
            memoryType || "حب",

        sender_text:
            sender || null,

        image_url:
            imageUrl || null,

        open_at:
            finalOpenAt,

        is_locked:
            locked

    };


    console.log(
        "📦 Saving memory:",
        memory
    );


    // ========================================
    // التأكد من title
    // ========================================

    if (
        !memory.title
    ) {

        memory.title =
            "ذكرى جديدة ❤️";

    }


    // ========================================
    // تعطيل زر الحفظ
    // ========================================

    const saveButton =
        document.querySelector(
            '#memory-form button[onclick="saveMemoryFromForm()"]'
        );


    if (saveButton) {

        saveButton.disabled =
            true;


        saveButton.style.opacity =
            "0.6";


        saveButton.style.cursor =
            "wait";


        saveButton.innerHTML =
            "⏳ جاري حفظ الذكرى...";

    }


    showFormStatus(
        "☁️ جاري حفظ الذكرى في كتابنا..."
    );


    // ========================================
    // إرسال البيانات
    // ========================================

    let result =
        null;


    try {

        result =
            await supabaseRequest(
                MEMORIES_TABLE,
                {

                    method:
                        "POST",

                    headers: {

                        "Prefer":
                            "return=representation"

                    },

                    body:
                        JSON.stringify(
                            memory
                        )

                }
            );

    } catch (error) {

        console.error(
            "❌ Save error:",
            error
        );

    }


    // ========================================
    // فشل الحفظ
    // ========================================

    if (
        result === null
    ) {

        showFormStatus(
            "❌ لم يتم حفظ الرسالة. افتح Console وشوف خطأ Supabase.",
            true
        );


        resetSaveButton();


        return;

    }


    // ========================================
    // نجاح
    // ========================================

    console.log(
        "❤️ تم حفظ الذكرى بنجاح:",
        result
    );


    showFormStatus(
        "❤️ تم حفظ الذكرى بنجاح في كتابنا!"
    );


    createHearts(
        20
    );


    // ========================================
    // تحديث القائمة
    // ========================================

    await loadMemories();


    // ========================================
    // تنظيف الفورم
    // ========================================

    clearMemoryForm();


    resetSaveButton();


    // ========================================
    // إغلاق الفورم
    // ========================================

    setTimeout(
        function () {

            closeMemoryForm();

        },
        1500
    );

}


window.saveMemoryFromForm =
    saveMemoryFromForm;


// ========================================
// تنظيف الفورم
// ========================================

function clearMemoryForm() {

    const fields = [

        "memory-message",
        "memory-image",
        "memory-open-at"

    ];


    fields.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.value =
                    "";

            }

        }
    );


    const sender =
        document.getElementById(
            "memory-sender"
        );


    if (sender) {

        sender.value =
            "";

    }


    const type =
        document.getElementById(
            "memory-type"
        );


    if (type) {

        type.value =
            "حب";

    }


    const locked =
        document.getElementById(
            "memory-locked"
        );


    if (locked) {

        locked.checked =
            false;

    }


    toggleOpenDate();


    setTodayMemoryDate();


    const status =
        document.getElementById(
            "memory-form-status"
        );


    if (status) {

        status.textContent =
            "";

    }

}


// ========================================
// تنسيق التاريخ
// ========================================

function formatMemoryDate(
    dateValue
) {

    if (!dateValue) {

        return "";

    }


    const date =
        new Date(
            dateValue
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleDateString(
        "ar-EG",
        {

            year:
                "numeric",

            month:
                "long",

            day:
                "numeric"

        }
    );

}


// ========================================
// تنسيق التاريخ والوقت
// ========================================

function formatMemoryDateTime(
    dateValue
) {

    if (!dateValue) {

        return "";

    }


    const date =
        new Date(
            dateValue
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleString(
        "ar-EG",
        {

            year:
                "numeric",

            month:
                "long",

            day:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );

}


// ========================================
// إحصائيات كتاب الذكريات
// ========================================

function updateMemoryStats(
    memories
) {

    const lockedCountElement =
        document.getElementById(
            "locked-memories-count"
        );


    const latestCountdownElement =
        document.getElementById(
            "latest-memory-countdown"
        );


    const latestDateElement =
        document.getElementById(
            "latest-memory-date"
        );


    if (
        !Array.isArray(memories) ||
        memories.length === 0
    ) {

        if (lockedCountElement) {

            lockedCountElement.textContent =
                "لا توجد رسائل";

        }


        if (latestCountdownElement) {

            latestCountdownElement.textContent =
                "لا توجد رسائل";

        }


        if (latestDateElement) {

            latestDateElement.textContent =
                "لا توجد رسائل";

        }


        window.latestMemory =
            null;


        window.latestLockedMemory =
            null;


        return;

    }


    const sortedMemories =
        [...memories].sort(
            function (a, b) {

                const dateA =
                    new Date(
                        a.created_at ||
                        a.memory_date ||
                        0
                    ).getTime();


                const dateB =
                    new Date(
                        b.created_at ||
                        b.memory_date ||
                        0
                    ).getTime();


                return dateB - dateA;

            }
        );


    const lockedMemories =
        memories.filter(
            function (memory) {

                return isMemoryStillLocked(
                    memory
                );

            }
        );


    if (lockedCountElement) {

        lockedCountElement.textContent =
            lockedMemories.length === 0
                ? "لا توجد رسائل"
                : `${lockedMemories.length} رسالة`;

    }


    const latestMemory =
        sortedMemories[0] ||
        null;


    window.latestMemory =
        latestMemory;


    if (latestDateElement) {

        if (
            latestMemory?.created_at
        ) {

            latestDateElement.textContent =
                formatMemoryDateTime(
                    latestMemory.created_at
                );

        } else if (
            latestMemory?.memory_date
        ) {

            latestDateElement.textContent =
                formatMemoryDate(
                    latestMemory.memory_date
                );

        } else {

            latestDateElement.textContent =
                "التاريخ غير متوفر";

        }

    }


    const sortedLockedMemories =
        [...lockedMemories].sort(
            function (a, b) {

                const dateA =
                    new Date(
                        a.created_at ||
                        a.memory_date ||
                        0
                    ).getTime();


                const dateB =
                    new Date(
                        b.created_at ||
                        b.memory_date ||
                        0
                    ).getTime();


                return dateB - dateA;

            }
        );


    window.latestLockedMemory =
        sortedLockedMemories[0] ||
        null;


    updateLatestMemoryCountdown();

}


// ========================================
// إضافة الشهور بطريقة صحيحة
// ========================================

function addMonthsClamped(
    date,
    months
) {

    const result =
        new Date(
            date
        );


    const originalDay =
        result.getDate();


    result.setDate(
        1
    );


    result.setMonth(
        result.getMonth() +
        months
    );


    const lastDay =
        new Date(
            result.getFullYear(),
            result.getMonth() + 1,
            0
        ).getDate();


    result.setDate(
        Math.min(
            originalDay,
            lastDay
        )
    );


    return result;

}


// ========================================
// حساب الوقت المتبقي
// ========================================

function getCalendarTimeRemaining(
    targetDate
) {

    const now =
        new Date();


    if (
        !targetDate ||
        isNaN(
            targetDate.getTime()
        )
    ) {

        return null;

    }


    if (
        targetDate.getTime() <=
        now.getTime()
    ) {

        return null;

    }


    let cursor =
        new Date(
            now
        );


    let years =
        targetDate.getFullYear() -
        cursor.getFullYear();


    let test =
        new Date(
            cursor
        );


    test.setFullYear(
        test.getFullYear() +
        years
    );


    if (
        test > targetDate
    ) {

        years--;

    }


    years =
        Math.max(
            0,
            years
        );


    cursor.setFullYear(
        cursor.getFullYear() +
        years
    );


    let months =
        (
            targetDate.getFullYear() -
            cursor.getFullYear()
        ) * 12
        +
        (
            targetDate.getMonth() -
            cursor.getMonth()
        );


    months =
        Math.max(
            0,
            months
        );


    test =
        addMonthsClamped(
            cursor,
            months
        );


    while (
        months > 0 &&
        test > targetDate
    ) {

        months--;


        test =
            addMonthsClamped(
                cursor,
                months
            );

    }


    while (
        addMonthsClamped(
            cursor,
            months + 1
        ) <= targetDate
    ) {

        months++;

    }


    cursor =
        addMonthsClamped(
            cursor,
            months
        );


    let difference =
        targetDate.getTime() -
        cursor.getTime();


    const DAY =
        24 *
        60 *
        60 *
        1000;


    const days =
        Math.floor(
            difference / DAY
        );


    cursor.setDate(
        cursor.getDate() +
        days
    );


    difference =
        targetDate.getTime() -
        cursor.getTime();


    const HOUR =
        60 *
        60 *
        1000;


    const hours =
        Math.floor(
            difference / HOUR
        );


    cursor.setHours(
        cursor.getHours() +
        hours
    );


    difference =
        targetDate.getTime() -
        cursor.getTime();


    const MINUTE =
        60 *
        1000;


    const minutes =
        Math.floor(
            difference / MINUTE
        );


    cursor.setMinutes(
        cursor.getMinutes() +
        minutes
    );


    difference =
        targetDate.getTime() -
        cursor.getTime();


    const seconds =
        Math.floor(
            difference / 1000
        );


    return {

        years:
            Math.max(
                0,
                years
            ),

        months:
            Math.max(
                0,
                months
            ),

        days:
            Math.max(
                0,
                days
            ),

        hours:
            Math.max(
                0,
                hours
            ),

        minutes:
            Math.max(
                0,
                minutes
            ),

        seconds:
            Math.max(
                0,
                seconds
            )

    };

}


// ========================================
// عداد أحدث رسالة مقفولة
// ========================================

function updateLatestMemoryCountdown() {

    const element =
        document.getElementById(
            "latest-memory-countdown"
        );


    if (!element) {

        return;

    }


    const memory =
        window.latestLockedMemory;


    if (!memory) {

        element.textContent =
            "لا توجد رسائل مقفولة";

        return;

    }


    if (!memory.open_at) {

        element.textContent =
            "موعد الفتح غير محدد";

        return;

    }


    const targetDate =
        new Date(
            memory.open_at
        );


    if (
        isNaN(
            targetDate.getTime()
        )
    ) {

        element.textContent =
            "موعد الفتح غير صحيح";

        return;

    }


    if (
        targetDate.getTime() <=
        Date.now()
    ) {

        element.textContent =
            "❤️ الرسالة فتحت";

        return;

    }


    const remaining =
        getCalendarTimeRemaining(
            targetDate
        );


    if (!remaining) {

        element.textContent =
            "❤️ الرسالة فتحت";

        return;

    }


    const parts = [];


    if (
        remaining.years > 0
    ) {

        parts.push(
            `${remaining.years} سنة`
        );

    }


    if (
        remaining.months > 0
    ) {

        parts.push(
            `${remaining.months} شهر`
        );

    }


    if (
        remaining.days > 0 ||
        parts.length > 0
    ) {

        parts.push(
            `${remaining.days} يوم`
        );

    }


    parts.push(
        `${String(
            remaining.hours
        ).padStart(
            2,
            "0"
        )} ساعة`
    );


    parts.push(
        `${String(
            remaining.minutes
        ).padStart(
            2,
            "0"
        )} دقيقة`
    );


    parts.push(
        `${String(
            remaining.seconds
        ).padStart(
            2,
            "0"
        )} ثانية`
    );


    element.innerHTML = `

        <span>
            ${parts.join(" - ")}
        </span>

        <br>

        <small>
            الفتح:
            ${formatMemoryDateTime(
                memory.open_at
            )}
        </small>

    `;

}


// ========================================
// تحميل الذكريات
// ========================================

async function loadMemories() {

    const status =
        document.getElementById(
            "memories-status"
        );


    const list =
        document.getElementById(
            "memories-list"
        );


    if (!list) {

        console.error(
            "❌ لم يتم العثور على memories-list"
        );

        return [];

    }


    if (status) {

        status.innerHTML = `
            ☁️
            <br>
            جاري تحميل كتاب ذكرياتنا...
        `;

    }


    const memories =
        await supabaseRequest(
            `${MEMORIES_TABLE}?select=*&order=created_at.desc`
        );


    if (
        memories === null
    ) {

        if (status) {

            status.innerHTML = `
                ⚠️
                <br>
                حصلت مشكلة في الاتصال بكتاب ذكرياتنا.
                <br>
                <small>
                    افتح Console لمعرفة الخطأ.
                </small>
            `;

        }


        updateMemoryStats(
            []
        );


        return [];

    }


    console.log(
        "📚 الذكريات:",
        memories
    );


    updateMemoryStats(
        memories
    );


    renderMemories(
        memories
    );


    if (status) {

        status.innerHTML = `
            ❤️
            <br>
            تم تحميل كتاب ذكرياتنا
            <br>
            <small>
                عدد الذكريات: ${memories.length}
            </small>
        `;

    }


    return memories;

}


// ========================================
// عرض الذكريات
// ========================================

function renderMemories(
    memories
) {

    const list =
        document.getElementById(
            "memories-list"
        );


    if (!list) {

        return;

    }


    if (
        !Array.isArray(memories) ||
        memories.length === 0
    ) {

        list.innerHTML = `

            <div class="memory">

                <div class="icon">
                    📖
                </div>

                <h3>
                    كتابنا لسه مستني أول ذكرى ❤️
                </h3>

                <p>
                    أول ما نضيف ذكرى هتظهر هنا يا فراولة 🍓
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML =
        "";


    memories.forEach(
        function (memory) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "memory dynamic-memory";


            const stillLocked =
                isMemoryStillLocked(
                    memory
                );


            if (
                stillLocked
            ) {

                card.classList.add(
                    "locked-memory"
                );


                card.innerHTML =
                    createLockedMemoryHTML(
                        memory
                    );


                list.appendChild(
                    card
                );


                return;

            }


            const message =
                escapeHTML(
                    memory.message ||
                    ""
                );


            const sender =
                escapeHTML(
                    memory.sender_text ||
                    memory.sender ||
                    ""
                );


            const type =
                escapeHTML(
                    memory.memory_type ||
                    "ذكرى"
                );


            const title =
                escapeHTML(
                    memory.title ||
                    "ذكرى جديدة ❤️"
                );


            let dateText =
                "";


            if (
                memory.memory_date
            ) {

                dateText =
                    formatMemoryDate(
                        memory.memory_date
                    );

            }


            let imageHTML =
                "";


            if (
                memory.image_url
            ) {

                imageHTML = `

                    <img
                        src="${escapeAttribute(
                            memory.image_url
                        )}"
                        alt="صورة الذكرى"
                        class="memory-image"
                        onclick="openMemoryImage(this.src)"
                    >

                `;

            }


            let senderHTML =
                "";


            if (
                sender
            ) {

                senderHTML = `

                    <div class="memory-sender">
                        💌 من ${sender}
                    </div>

                `;

            }


            card.innerHTML = `

                ${imageHTML}

                <div class="memory-icon">
                    💌
                </div>

                <h3>
                    ${title}
                </h3>

                ${
                    dateText
                        ? `
                            <div class="memory-date">
                                📅 ${dateText}
                            </div>
                          `
                        : ""
                }

                <div class="memory-type">
                    ${type}
                </div>

                ${senderHTML}

                <p>
                    ${message}
                </p>

            `;


            list.appendChild(
                card
            );

        }
    );

}


// ========================================
// كارت الرسالة المقفولة
// ========================================

function createLockedMemoryHTML(
    memory
) {

    const sender =
        memory.sender_text ||
        memory.sender ||
        "";


    let senderHTML =
        "";


    if (
        sender
    ) {

        senderHTML = `

            <div class="memory-sender">

                💌 من ${escapeHTML(
                    sender
                )}

            </div>

        `;

    } else {

        senderHTML = `

            <div class="memory-sender">

                💌 رسالة

            </div>

        `;

    }


    let dateHTML =
        "";


    if (
        memory.memory_date
    ) {

        const formattedDate =
            formatMemoryDate(
                memory.memory_date
            );


        if (
            formattedDate
        ) {

            dateHTML = `

                <div class="memory-date">

                    📅 ${formattedDate}

                </div>

            `;

        }

    }


    const title =
        escapeHTML(
            memory.title ||
            "رسالة مقفولة ❤️"
        );


    return `

        <div class="locked-memory-content">

            <div class="memory-icon locked-icon">
                🔒
            </div>

            <h3>
                ${title}
            </h3>

            ${dateHTML}

            ${senderHTML}

            <p>
                ❤️ الرسالة دي مقفولة لحد موعدها
            </p>

            <div
                class="locked-countdown"
                data-open-at="${escapeAttribute(
                    memory.open_at || ""
                )}"
            >

                <div class="countdown-loading">

                    ⏳
                    <br>

                    جاري حساب الوقت...

                </div>

            </div>

        </div>

    `;

}


// ========================================
// تحديث عدادات الرسائل المقفولة
// ========================================

let countdownRefreshRunning =
    false;


async function updateLockedCountdowns() {

    const countdowns =
        document.querySelectorAll(
            ".locked-countdown"
        );


    updateLatestMemoryCountdown();


    if (
        countdowns.length === 0
    ) {

        return;

    }


    let shouldReload =
        false;


    countdowns.forEach(
        function (element) {

            const openAt =
                element.dataset.openAt;


            if (!openAt) {

                element.innerHTML = `

                    <div class="countdown-lock-icon">
                        🔒
                    </div>

                    <strong>
                        الرسالة مقفولة ❤️
                    </strong>

                    <small>
                        موعد الفتح غير محدد
                    </small>

                `;

                return;

            }


            const targetDate =
                new Date(
                    openAt
                );


            if (
                isNaN(
                    targetDate.getTime()
                )
            ) {

                element.innerHTML = `

                    <div class="countdown-lock-icon">
                        🔒
                    </div>

                    <strong>
                        الرسالة مقفولة ❤️
                    </strong>

                `;

                return;

            }


            if (
                targetDate.getTime() <=
                Date.now()
            ) {

                element.innerHTML = `

                    <div class="countdown-opened">
                        ❤️ الرسالة فتحت!
                    </div>

                `;


                shouldReload =
                    true;


                return;

            }


            const remaining =
                getCalendarTimeRemaining(
                    targetDate
                );


            if (!remaining) {

                return;

            }


            element.innerHTML = `

                <div class="countdown-lock-icon">
                    🔒
                </div>

                <div class="countdown-title">
                    متبقي على الفتح ❤️
                </div>

                <div class="countdown-time">

                    <div class="countdown-box">

                        <strong>
                            ${remaining.years}
                        </strong>

                        <small>
                            سنة
                        </small>

                    </div>


                    <div class="countdown-box">

                        <strong>
                            ${remaining.months}
                        </strong>

                        <small>
                            شهر
                        </small>

                    </div>


                    <div class="countdown-box">

                        <strong>
                            ${remaining.days}
                        </strong>

                        <small>
                            يوم
                        </small>

                    </div>


                    <div class="countdown-box">

                        <strong>
                            ${String(
                                remaining.hours
                            ).padStart(
                                2,
                                "0"
                            )}
                        </strong>

                        <small>
                            ساعة
                        </small>

                    </div>


                    <div class="countdown-box">

                        <strong>
                            ${String(
                                remaining.minutes
                            ).padStart(
                                2,
                                "0"
                            )}
                        </strong>

                        <small>
                            دقيقة
                        </small>

                    </div>


                    <div class="countdown-box">

                        <strong>
                            ${String(
                                remaining.seconds
                            ).padStart(
                                2,
                                "0"
                            )}
                        </strong>

                        <small>
                            ثانية
                        </small>

                    </div>

                </div>


                <div class="open-date-text">

                    🕐 موعد الفتح:

                    ${targetDate.toLocaleString(
                        "ar-EG",
                        {

                            year:
                                "numeric",

                            month:
                                "long",

                            day:
                                "numeric",

                            hour:
                                "2-digit",

                            minute:
                                "2-digit"

                        }
                    )}

                </div>

            `;

        }
    );


    if (
        shouldReload &&
        !countdownRefreshRunning
    ) {

        countdownRefreshRunning =
            true;


        await loadMemories();


        countdownRefreshRunning =
            false;

    }

}


// ========================================
// حماية HTML
// ========================================

function escapeHTML(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ========================================
// حماية Attributes
// ========================================

function escapeAttribute(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}


// ========================================
// إضافة ذكرى مباشرة
// ========================================

async function addMemory({

    title = null,

    message,

    memory_date = null,

    image_url = null,

    memory_type = null,

    sender_text = null,

    sender = null,

    open_at = null,

    is_locked = false

}) {

    const finalMemoryType =
        String(
            memory_type ||
            "حب"
        ).trim();


    const finalTitle =
        String(
            title ||
            createMemoryTitle(
                finalMemoryType
            ) ||
            "ذكرى جديدة ❤️"
        ).trim();


    const locked =
        is_locked === true ||
        is_locked === "true" ||
        is_locked === 1;


    const memory = {

        title:
            finalTitle,

        message:
            message || "",

        memory_date:
            memory_date ||
            getTodayDate(),

        memory_type:
            finalMemoryType,

        sender_text:
            sender_text ||
            sender ||
            null,

        image_url:
            image_url ||
            null,

        open_at:
            open_at ||
            null,

        is_locked:
            locked

    };


    console.log(
        "📦 addMemory:",
        memory
    );


    const result =
        await supabaseRequest(
            MEMORIES_TABLE,
            {

                method:
                    "POST",

                headers: {

                    "Prefer":
                        "return=representation"

                },

                body:
                    JSON.stringify(
                        memory
                    )

            }
        );


    if (
        result !== null
    ) {

        await loadMemories();

        return result;

    }


    return null;

}


window.addMemory =
    addMemory;


// ========================================
// حذف ذكرى
// ========================================

async function deleteMemory(
    id
) {

    if (!id) {

        return false;

    }


    const result =
        await supabaseRequest(
            `${MEMORIES_TABLE}?id=eq.${encodeURIComponent(
                id
            )}`,
            {

                method:
                    "DELETE",

                headers: {

                    "Prefer":
                        "return=minimal"

                }

            }
        );


    if (
        result !== null
    ) {

        await loadMemories();

        return true;

    }


    return false;

}


window.deleteMemory =
    deleteMemory;


// ========================================
// فتح الصورة
// ========================================

function openMemoryImage(
    src
) {

    if (!src) {

        return;

    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "image-overlay";


    overlay.innerHTML = `

        <div class="close-image">
            ×
        </div>

        <img
            src="${escapeAttribute(
                src
            )}"
            alt="صورة الذكرى"
        >

    `;


    document.body.appendChild(
        overlay
    );


    overlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target === overlay ||
                event.target.classList.contains(
                    "close-image"
                )
            ) {

                overlay.remove();

            }

        }
    );

}


window.openMemoryImage =
    openMemoryImage;


// ========================================
// العداد الرئيسي
// ========================================

const startDate =
    new Date(
        "2025-08-01T00:00:00"
    );


function updateCounter() {

    const now =
        new Date();


    let difference =
        now.getTime() -
        startDate.getTime();


    if (
        difference < 0
    ) {

        difference =
            0;

    }


    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    const days =
        Math.floor(
            totalSeconds / 86400
        );


    const hours =
        Math.floor(
            (
                totalSeconds % 86400
            ) / 3600
        );


    const minutes =
        Math.floor(
            (
                totalSeconds % 3600
            ) / 60
        );


    const seconds =
        totalSeconds % 60;


    const daysElement =
        document.getElementById(
            "days"
        );


    const hoursElement =
        document.getElementById(
            "hours"
        );


    const minutesElement =
        document.getElementById(
            "minutes"
        );


    const secondsElement =
        document.getElementById(
            "seconds"
        );


    if (daysElement) {

        daysElement.textContent =
            days;

    }


    if (hoursElement) {

        hoursElement.textContent =
            hours;

    }


    if (minutesElement) {

        minutesElement.textContent =
            minutes;

    }


    if (secondsElement) {

        secondsElement.textContent =
            seconds;

    }

}


// ========================================
// الرسالة السرية
// ========================================

function secretMessage() {

    const box =
        document.getElementById(
            "secretBox"
        );


    if (!box) {

        return;

    }


    box.innerHTML = `

        <div>

            كنتي فاكرة إن الموقع خلص؟ 😂❤️

            <br><br>

            <strong
                style="color:#ff91b2;"
            >

                لا يا فراولة...

                <br><br>

                أنا بس حبيت أفكرك بحاجة:

                <br><br>

                بحبك إنتي. ❤️

            </strong>

        </div>

    `;


    createHearts(
        20
    );

}


window.secretMessage =
    secretMessage;


// ========================================
// الإجابة النهائية
// ========================================

function answerYes() {

    const celebrate =
        document.getElementById(
            "celebrate"
        );


    if (celebrate) {

        celebrate.style.display =
            "block";


        celebrate.innerHTML = `

            كنت عارف إجابتك يا فراولة 😂❤️

            <br><br>

            بحبك إنتي... وبس. ❤️

        `;

    }


    createHearts(
        60
    );

}


window.answerYes =
    answerYes;


// ========================================
// القلوب
// ========================================

function createHearts(
    amount
) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const heart =
            document.createElement(
                "div"
            );


        heart.className =
            "heart";


        const symbols = [

            "❤️",
            "💗",
            "💕",
            "💖",
            "✨",
            "🍓"

        ];


        heart.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        heart.style.position =
            "fixed";


        heart.style.left =
            Math.random() *
            100 +
            "vw";


        heart.style.bottom =
            "-30px";


        heart.style.zIndex =
            "9999";


        heart.style.pointerEvents =
            "none";


        heart.style.fontSize =
            (
                15 +
                Math.random() *
                25
            ) +
            "px";


        heart.style.setProperty(
            "--move",
            (
                Math.random() *
                240 -
                120
            ) +
            "px"
        );


        heart.style.animation =
            "floatHeart " +
            (
                3 +
                Math.random() *
                3
            ) +
            "s linear forwards";


        document.body.appendChild(
            heart
        );


        setTimeout(
            function () {

                heart.remove();

            },
            6500
        );

    }

}


// ========================================
// قلوب تلقائية
// ========================================

setInterval(
    function () {

        createHearts(
            1
        );

    },
    1800
);


// ========================================
// معرض الصور
// ========================================

function setupGallery() {

    const images =
        document.querySelectorAll(
            ".gallery img"
        );


    images.forEach(
        function (image) {

            image.style.cursor =
                "pointer";


            image.addEventListener(
                "click",
                function () {

                    openMemoryImage(
                        image.src
                    );

                }
            );

        }
    );

}


// ========================================
// تشغيل الموقع
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "❤️ الموقع بدأ التشغيل"
        );


        // ========================================
        // التاريخ
        // ========================================

        setTodayMemoryDate();


        // ========================================
        // العداد الرئيسي
        // ========================================

        updateCounter();


        setInterval(
            updateCounter,
            1000
        );


        // ========================================
        // الصور
        // ========================================

        setupGallery();


        // ========================================
        // تفعيل حالة القفل
        // ========================================

        const lockCheckbox =
            document.getElementById(
                "memory-locked"
            );


        if (lockCheckbox) {

            lockCheckbox.addEventListener(
                "change",
                toggleOpenDate
            );

            toggleOpenDate();

        }


        // ========================================
        // الذكريات
        // ========================================

        await loadMemories();


        // ========================================
        // العدادات
        // ========================================

        updateLockedCountdowns();


        setInterval(
            updateLockedCountdowns,
            1000
        );


        console.log(
            "❤️ تم الانتهاء من تشغيل الموقع"
        );

    }
);