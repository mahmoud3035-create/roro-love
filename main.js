// ========================================
// زر "ادخلي يا فراولة"
// ========================================

function goToStory() {
    const story = document.getElementById("story");

    if (story) {
        story.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ========================================
// العداد من 01/08/2025
// ========================================

const startDate = new Date("2025-08-01T00:00:00");

function updateCounter() {

    const now = new Date();

    let difference = now.getTime() - startDate.getTime();

    if (difference < 0) {
        difference = 0;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);

    const hours = Math.floor(
        (totalSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;


    const daysElement =
        document.getElementById("days");

    const hoursElement =
        document.getElementById("hours");

    const minutesElement =
        document.getElementById("minutes");

    const secondsElement =
        document.getElementById("seconds");


    if (daysElement) {
        daysElement.textContent = days;
    }

    if (hoursElement) {
        hoursElement.textContent = hours;
    }

    if (minutesElement) {
        minutesElement.textContent = minutes;
    }

    if (secondsElement) {
        secondsElement.textContent = seconds;
    }
}


// تشغيل العداد
updateCounter();

setInterval(updateCounter, 1000);


// ========================================
// الرسالة السرية
// ========================================

function secretMessage() {

    const box =
        document.getElementById("secretBox");

    if (!box) {
        return;
    }


    box.innerHTML = `
        <div>
            كنتي فاكرة إن الموقع خلص؟ 😂❤️
            <br><br>

            <strong style="color:#ff91b2;">
                لا يا فراولة...
                <br><br>
                أنا بس حبيت أفكرك بحاجة:
                <br>
                بحبك إنتي. ❤️
            </strong>
        </div>
    `;


    createHearts(20);
}


// ========================================
// الإجابة النهائية
// ========================================

function answerYes() {

    const celebrate =
        document.getElementById("celebrate");


    if (celebrate) {

        celebrate.style.display = "block";

        celebrate.innerHTML = `
            كنت عارف إجابتك يا فراولة 😂❤️
            <br><br>
            بحبك إنتي... وبس. ❤️
        `;
    }


    createHearts(60);
}


// ========================================
// القلوب
// ========================================

function createHearts(amount) {

    for (let i = 0; i < amount; i++) {

        const heart =
            document.createElement("div");


        heart.className = "heart";


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
                    Math.random() * symbols.length
                )
            ];


        heart.style.left =
            Math.random() * 100 + "vw";


        heart.style.fontSize =
            (15 + Math.random() * 25) + "px";


        heart.style.setProperty(
            "--move",
            (Math.random() * 240 - 120) + "px"
        );


        heart.style.animationDuration =
            (3 + Math.random() * 3) + "s";


        document.body.appendChild(heart);


        setTimeout(() => {

            if (heart) {
                heart.remove();
            }

        }, 6500);

    }
}


// ========================================
// قلوب تلقائية
// ========================================

setInterval(() => {

    createHearts(1);

}, 1800);


// ========================================
// تكبير الصور
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const images =
        document.querySelectorAll(".gallery img");


    images.forEach((image) => {

        image.style.cursor = "pointer";


        image.addEventListener("click", () => {

            const overlay =
                document.createElement("div");


            overlay.className =
                "image-overlay";


            overlay.innerHTML = `
                <div class="close-image">×</div>
                <img src="${image.src}" alt="رورو">
            `;


            document.body.appendChild(
                overlay
            );


            overlay.addEventListener(
                "click",
                (event) => {

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

        });

    });

}); 