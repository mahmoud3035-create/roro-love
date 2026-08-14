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

    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/${endpoint}`,
                {
                    ...options,

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`,

                        "Content-Type":
                            "application/json",

                        "Prefer":
                            "return=representation",

                        ...(options.headers || {})

                    }

                }
            );


        const text =
            await response.text();


        // ========================================
        // إظهار خطأ Supabase بالتفصيل
        // ========================================

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


        // ========================================
        // استجابة فارغة
        // ========================================

        if (!text) {

            return [];

        }


        try {

            return JSON.parse(text);

        } catch (error) {

            console.warn(
                "Supabase returned non-JSON:",
                text
            );

            return [];

        }

    } catch (error) {

        console.error(
            "Supabase Request Failed:",
            error
        );

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
/*
وجود open_at في المستقبل
يجعل الرسالة مقفولة حتى لو
is_locked = false
*/
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


        if (
            !isNaN(openTime)
        ) {

            if (
                openTime > Date.now()
            ) {

                return true;

            }


            return false;

        }

    }


    if (
        isMemoryLocked(memory)
    ) {

        return true;

    }


    return false;

}



// ========================================
// زر الدخول إلى الرسالة
// ========================================

function goToStory() {

    const story =
        document.getElementById(
            "story"
        );


    if (story) {

        story.scrollIntoView({
            behavior:
                "smooth",

            block:
                "start"
        });

    }

}


window.goToStory =
    goToStory;



// ========================================
// زر الذكريات
// ========================================

function goToMemories() {

    const memories =
        document.getElementById(
            "memories-book-section"
        );


    if (memories) {

        memories.scrollIntoView({
            behavior:
                "smooth",

            block:
                "start"
        });

    }

}


window.goToMemories =
    goToMemories;



// ========================================
// الحصول على تاريخ اليوم
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
// تثبيت تاريخ الذكرى على تاريخ اليوم
// ========================================

function setTodayMemoryDate() {

    const memoryDateInput =
        document.getElementById(
            "memory-date"
        );


    if (!memoryDateInput) {

        return;

    }


    memoryDateInput.value =
        getTodayDate();


    // منع التعديل

    memoryDateInput.readOnly =
        true;


    memoryDateInput.setAttribute(
        "readonly",
        "readonly"
    );


    // منع فتح اختيار التاريخ

    memoryDateInput.addEventListener(
        "keydown",
        function(event) {

            event.preventDefault();

        }
    );


    memoryDateInput.addEventListener(
        "change",
        function() {

            memoryDateInput.value =
                getTodayDate();

        }
    );


    memoryDateInput.addEventListener(
        "input",
        function() {

            memoryDateInput.value =
                getTodayDate();

        }
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

        return;

    }


    form.style.display =
        "block";


    // تاريخ اليوم دائمًا

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

        status.innerHTML =
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
// إظهار / إخفاء موعد الفتح
// ========================================

function toggleOpenDate() {

    const checkbox =
        document.getElementById(
            "memory-locked"
        );


    const openDateArea =
        document.getElementById(
            "open-date-area"
        );


    const openAt =
        document.getElementById(
            "memory-open-at"
        );


    if (
        !checkbox ||
        !openDateArea
    ) {

        return;

    }


    if (
        checkbox.checked
    ) {

        openDateArea.style.display =
            "block";


        if (openAt) {

            openAt.required =
                true;

        }

    } else {

        openDateArea.style.display =
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
// حفظ الذكرى من الفورم
// ========================================

async function saveMemoryFromForm() {

    // ========================================
    // الرسالة
    // ========================================

    const message =
        document.getElementById(
            "memory-message"
        )?.value.trim();


    // ========================================
    // المرسل
    // يستخدم sender_text
    // ========================================

    const sender =
        document.getElementById(
            "memory-sender"
        )?.value || "";


    // ========================================
    // التاريخ
    // دائمًا تاريخ اليوم
    // ========================================

    const memoryDate =
        getTodayDate();


    // ========================================
    // نوع الرسالة
    // ========================================

    const memoryType =
        document.getElementById(
            "memory-type"
        )?.value || "حب";


    // ========================================
    // الصورة
    // ========================================

    const imageUrl =
        document.getElementById(
            "memory-image"
        )?.value.trim();


    // ========================================
    // القفل
    // ========================================

    const locked =
        document.getElementById(
            "memory-locked"
        )?.checked === true;


    // ========================================
    // موعد الفتح
    // ========================================

    const openAt =
        document.getElementById(
            "memory-open-at"
        )?.value;



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
    // موعد الفتح
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
    // تحويل موعد الفتح
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
    // البيانات التي سيتم حفظها
    // ========================================

    const memory = {

        /*
         * نخلي title فارغًا
         * لأنك مش عايز عنوان للذكرى.
         *
         * لو العمود موجود في Supabase
         * و NOT NULL فلن يحدث خطأ.
         */

        title:
            "",


        message:
            message,


        /*
         * مهم جدًا:
         * اسم العمود في Supabase هو sender_text
         */

        sender_text:
            sender || null,


        memory_date:
            memoryDate,


        image_url:
            imageUrl || null,


        memory_type:
            memoryType,


        open_at:
            finalOpenAt,


        is_locked:
            locked

    };


    console.log(
        "📦 البيانات التي سيتم حفظها:",
        memory
    );



    // ========================================
    // زر الحفظ
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
    // إرسال إلى Supabase
    // ========================================

    const result =
        await supabaseRequest(
            MEMORIES_TABLE,
            {

                method:
                    "POST",

                headers: {

                    "Prefer":
                        "return=minimal"

                },

                body:
                    JSON.stringify(
                        memory
                    )

            }
        );


    console.log(
        "📥 نتيجة الحفظ:",
        result
    );



    // ========================================
    // فشل الحفظ
    // ========================================

    if (
        result === null
    ) {

        showFormStatus(
            "❌ حصلت مشكلة أثناء حفظ الذكرى. افتح Console لمعرفة الخطأ.",
            true
        );


        resetSaveButton();


        return;

    }



    // ========================================
    // نجاح
    // ========================================

    showFormStatus(
        "❤️ تم حفظ الذكرى بنجاح في كتابنا!"
    );


    createHearts(
        15
    );


    await loadMemories();


    clearMemoryForm();


    setTimeout(
        function() {

            closeMemoryForm();

        },
        1500
    );


    resetSaveButton();

}


window.saveMemoryFromForm =
    saveMemoryFromForm;



// ========================================
// رسالة حالة الفورم
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
        "❤️ حفظ الذكرى";

}



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
        function(id) {

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



    // ========================================
    // المرسل
    // ========================================

    const sender =
        document.getElementById(
            "memory-sender"
        );


    if (sender) {

        sender.value =
            "";

    }



    // ========================================
    // النوع
    // ========================================

    const type =
        document.getElementById(
            "memory-type"
        );


    if (type) {

        type.value =
            "حب";

    }



    // ========================================
    // القفل
    // ========================================

    const locked =
        document.getElementById(
            "memory-locked"
        );


    if (locked) {

        locked.checked =
            false;

    }


    toggleOpenDate();


    // ========================================
    // إعادة التاريخ لليوم
    // ========================================

    setTodayMemoryDate();


    // ========================================
    // تنظيف الحالة
    // ========================================

    const status =
        document.getElementById(
            "memory-form-status"
        );


    if (status) {

        status.innerHTML =
            "";

    }

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
            "لم يتم العثور على memories-list"
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
            `${MEMORIES_TABLE}?select=*&order=memory_date.desc,created_at.desc`
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


        return [];

    }


    console.log(
        "📚 الذكريات:",
        memories
    );


    // ========================================
    // تشخيص
    // ========================================

    memories.forEach(
        function(memory) {

            console.log(
                "🔐 Memory:",
                {
                    id:
                        memory.id,

                    sender_text:
                        memory.sender_text,

                    message:
                        memory.message,

                    memory_date:
                        memory.memory_date,

                    memory_type:
                        memory.memory_type,

                    is_locked:
                        memory.is_locked,

                    open_at:
                        memory.open_at,

                    stillLocked:
                        isMemoryStillLocked(
                            memory
                        )

                }
            );

        }
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
        !memories ||
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
        function(memory) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "memory dynamic-memory";


            // ========================================
            // هل مقفولة؟
            // ========================================

            const stillLocked =
                isMemoryStillLocked(
                    memory
                );


            if (stillLocked) {

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



            // ========================================
            // الرسالة المفتوحة
            // ========================================

            const message =
                escapeHTML(
                    memory.message ||
                    ""
                );


            const sender =
                escapeHTML(
                    memory.sender_text ||
                    ""
                );


            const type =
                escapeHTML(
                    memory.memory_type ||
                    "ذكرى"
                );



            // ========================================
            // التاريخ
            // ========================================

            let dateText =
                "";


            if (
                memory.memory_date
            ) {

                const date =
                    new Date(
                        memory.memory_date +
                        "T00:00:00"
                    );


                if (
                    !isNaN(
                        date.getTime()
                    )
                ) {

                    dateText =
                        date.toLocaleDateString(
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

            }



            // ========================================
            // الصورة
            // ========================================

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



            // ========================================
            // المرسل
            // ========================================

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



            // ========================================
            // الكارت المفتوح
            // ========================================

            card.innerHTML = `

                ${imageHTML}


                <div class="memory-icon">
                    💌
                </div>


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
// كارت الذكرى المقفولة
// ========================================

function createLockedMemoryHTML(
    memory
) {

    // ========================================
    // المرسل
    // ========================================

    let senderHTML =
        "";


    if (
        memory.sender_text
    ) {

        senderHTML = `

            <div class="memory-sender">

                💌 من ${escapeHTML(
                    memory.sender_text
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



    // ========================================
    // التاريخ
    // ========================================

    let dateHTML =
        "";


    if (
        memory.memory_date
    ) {

        const date =
            new Date(
                memory.memory_date +
                "T00:00:00"
            );


        if (
            !isNaN(
                date.getTime()
            )
        ) {

            dateHTML = `

                <div class="memory-date">

                    📅 ${date.toLocaleDateString(
                        "ar-EG",
                        {
                            year:
                                "numeric",

                            month:
                                "long",

                            day:
                                "numeric"
                        }
                    )}

                </div>

            `;

        }

    }



    return `

        <div class="locked-memory-content">


            <div class="memory-icon locked-icon">
                🔒
            </div>


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


    // ========================================
    // السنوات
    // ========================================

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


    if (
        years < 0
    ) {

        years = 0;

    }


    cursor =
        new Date(
            cursor
        );


    cursor.setFullYear(
        cursor.getFullYear() +
        years
    );



    // ========================================
    // الشهور
    // ========================================

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


    if (
        months < 0
    ) {

        months = 0;

    }


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



    // ========================================
    // الأيام
    // ========================================

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
            difference /
            DAY
        );


    cursor.setDate(
        cursor.getDate() +
        days
    );



    // ========================================
    // الساعات
    // ========================================

    difference =
        targetDate.getTime() -
        cursor.getTime();


    const HOUR =
        60 *
        60 *
        1000;


    const hours =
        Math.floor(
            difference /
            HOUR
        );


    cursor.setHours(
        cursor.getHours() +
        hours
    );



    // ========================================
    // الدقائق
    // ========================================

    difference =
        targetDate.getTime() -
        cursor.getTime();


    const MINUTE =
        60 *
        1000;


    const minutes =
        Math.floor(
            difference /
            MINUTE
        );


    cursor.setMinutes(
        cursor.getMinutes() +
        minutes
    );



    // ========================================
    // الثواني
    // ========================================

    difference =
        targetDate.getTime() -
        cursor.getTime();


    const seconds =
        Math.floor(
            difference /
            1000
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
// تحديث عدادات الرسائل المقفولة
// ========================================

let countdownRefreshRunning =
    false;


async function updateLockedCountdowns() {

    const countdowns =
        document.querySelectorAll(
            ".locked-countdown"
        );


    if (
        countdowns.length === 0
    ) {

        return;

    }


    let shouldReload =
        false;


    countdowns.forEach(
        function(element) {

            const openAt =
                element.dataset.openAt;


            // ========================================
            // بدون موعد
            // ========================================

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



            // ========================================
            // التاريخ
            // ========================================

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



            // ========================================
            // الرسالة فتحت
            // ========================================

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



            // ========================================
            // حساب الوقت
            // ========================================

            const remaining =
                getCalendarTimeRemaining(
                    targetDate
                );


            if (!remaining) {

                return;

            }



            // ========================================
            // عرض العداد
            // ========================================

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



    // ========================================
    // إعادة تحميل عند الوصول للصفر
    // ========================================

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
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



// ========================================
// إضافة ذكرى مباشرة
// ========================================

async function addMemory({

    message,

    memory_date = null,

    image_url = null,

    memory_type = null,

    sender = null,

    open_at = null,

    is_locked = false

}) {

    const locked =
        is_locked === true ||
        is_locked === "true" ||
        is_locked === 1;


    const memory = {

        title:
            "",


        message:
            message || "",


        memory_date:
            memory_date ||
            getTodayDate(),


        image_url:
            image_url || null,


        memory_type:
            memory_type ||
            "حب",


        sender_text:
            sender || null,


        open_at:
            open_at || null,


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
                        "return=minimal"

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
// فتح صورة
// ========================================

function openMemoryImage(
    src
) {

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
        function(event) {

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
            difference /
            1000
        );


    const days =
        Math.floor(
            totalSeconds /
            86400
        );


    const hours =
        Math.floor(
            (
                totalSeconds %
                86400
            ) /
            3600
        );


    const minutes =
        Math.floor(
            (
                totalSeconds %
                3600
            ) /
            60
        );


    const seconds =
        totalSeconds %
        60;


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
            function() {

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
    function() {

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
        function(image) {

            image.style.cursor =
                "pointer";


            image.addEventListener(
                "click",
                function() {

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
    async function() {

        console.log(
            "❤️ الموقع بدأ التشغيل"
        );


        // ========================================
        // تاريخ اليوم
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
        // الذكريات
        // ========================================

        await loadMemories();


        // ========================================
        // عداد الرسائل المقفولة
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