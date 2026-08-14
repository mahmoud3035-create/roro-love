// ========================================
// إحصائيات كتاب الذكريات
//
// 🔒 عدد الرسائل المقفولة حاليًا
// ⏳ عداد فتح أحدث رسالة مقفولة حاليًا
// 📅 تاريخ آخر رسالة تم إرسالها
// ========================================

function updateMemoryStats(memories) {

    // ========================================
    // عناصر الإحصائيات
    // ========================================

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



    // ========================================
    // التأكد من وجود البيانات
    // ========================================

    if (!Array.isArray(memories)) {

        if (lockedCountElement) {

            lockedCountElement.textContent =
                "0 رسالة";

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



    // ========================================
    // لا توجد رسائل
    // ========================================

    if (memories.length === 0) {

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



    // ========================================
    // ترتيب جميع الرسائل
    //
    // الأحدث أولًا
    // ========================================

    const sortedMemories =
        [...memories].sort(
            function(a, b) {

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



    // ========================================
    // 🔒 الرسائل المقفولة حاليًا فقط
    //
    // مهم:
    // الرسالة التي انتهى موعد فتحها
    // لا يتم حسابها كمقفولة.
    // ========================================

    const lockedMemories =
        memories.filter(
            function(memory) {

                return isMemoryStillLocked(
                    memory
                );

            }
        );



    // ========================================
    // عدد الرسائل المقفولة حاليًا
    // ========================================

    const lockedCount =
        lockedMemories.length;



    if (lockedCountElement) {

        if (lockedCount === 0) {

            lockedCountElement.textContent =
                "لا توجد رسائل";

        } else {

            lockedCountElement.textContent =
                `${lockedCount} رسالة`;

        }

    }



    // ========================================
    // 📅 آخر رسالة تم إرسالها
    // ========================================

    const latestMemory =
        sortedMemories[0] ||
        null;


    window.latestMemory =
        latestMemory;



    // ========================================
    // عرض تاريخ آخر رسالة
    // ========================================

    if (latestDateElement) {

        if (!latestMemory) {

            latestDateElement.textContent =
                "لا توجد رسائل";

        } else {

            let latestDateText =
                "";



            // ========================================
            // الأولوية لـ created_at
            // لأنه وقت الإرسال الحقيقي
            // ========================================

            if (
                latestMemory.created_at
            ) {

                latestDateText =
                    formatMemoryDateTime(
                        latestMemory.created_at
                    );

            }



            // ========================================
            // لو created_at غير موجود
            // نستخدم memory_date
            // ========================================

            if (
                !latestDateText &&
                latestMemory.memory_date
            ) {

                latestDateText =
                    formatMemoryDate(
                        latestMemory.memory_date
                    );

            }



            latestDateElement.textContent =
                latestDateText ||
                "التاريخ غير متوفر";

        }

    }



    // ========================================
    // ⏳ ترتيب الرسائل المقفولة حاليًا
    //
    // الأحدث من بينهم أولًا
    // ========================================

    const sortedLockedMemories =
        [...lockedMemories].sort(
            function(a, b) {

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



    // ========================================
    // آخر رسالة مقفولة حاليًا
    // ========================================

    const latestLockedMemory =
        sortedLockedMemories[0] ||
        null;


    window.latestLockedMemory =
        latestLockedMemory;



    // ========================================
    // Console للتأكد من البيانات
    // ========================================

    console.log(
        "📊 Memory Statistics:",
        {

            totalMessages:
                memories.length,

            lockedMessages:
                lockedCount,

            latestMessage:
                latestMemory,

            latestLockedMessage:
                latestLockedMemory

        }
    );



    // ========================================
    // تحديث عداد فتح آخر رسالة مقفولة
    // ========================================

    updateLatestMemoryCountdown();

}