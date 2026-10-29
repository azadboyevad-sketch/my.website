// ========================================
// EDUWAY — MAIN APP
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // USER
    // ========================================

    function getUser() {
        const data = localStorage.getItem("eduwayUser");

        if (!data) return null;

        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    }


    function isLoggedIn() {
        return localStorage.getItem("eduwayLoggedIn") === "true";
    }


    // ========================================
    // LOGOUT
    // ========================================

    window.eduwayLogout = function () {

        localStorage.removeItem("eduwayLoggedIn");

        window.location.href = "index.html";
    };


    // ========================================
    // DASHBOARD HIMOYASI
    // ========================================

    if (
        window.location.pathname
            .toLowerCase()
            .includes("dashboard.html")
    ) {

        if (!isLoggedIn() || !getUser()) {

            window.location.href = "login.html";

            return;
        }
    }


    // ========================================
    // DASHBOARD USER
    // ========================================

    const user = getUser();

    if (user) {

        const userName =
            document.getElementById("userName");

        const profileName =
            document.getElementById("profileName");

        const profileEmail =
            document.getElementById("profileEmail");

        const profileAvatar =
            document.getElementById("profileAvatar");


        if (userName) {
            userName.textContent =
                user.name.split(" ")[0];
        }


        if (profileName) {
            profileName.textContent =
                user.name;
        }


        if (profileEmail) {
            profileEmail.textContent =
                user.email;
        }


        if (profileAvatar) {
            profileAvatar.textContent =
                user.name.charAt(0).toUpperCase();
        }
    }


    // ========================================
    // COURSE DATA
    // ========================================

    const courseKey = "frontend";

    const lessons = [
        "HTML asoslari",
        "CSS asoslari",
        "Flexbox va Grid",
        "JavaScript asoslari",
        "DOM bilan ishlash",
        "Amaliy loyiha"
    ];


    // ========================================
    // PROGRESS SAQLASH
    // ========================================

    function getCourseProgress() {

        const data =
            localStorage.getItem(
                "eduwayProgress"
            );

        if (!data) {

            return {
                frontend: {
                    completed: [],
                    progress: 0
                }
            };
        }


        try {

            return JSON.parse(data);

        } catch {

            return {
                frontend: {
                    completed: [],
                    progress: 0
                }
            };
        }
    }


    function saveCourseProgress(data) {

        localStorage.setItem(
            "eduwayProgress",
            JSON.stringify(data)
        );
    }


    // ========================================
    // PROGRESS FOIZINI HISOBLASH
    // ========================================

    function calculateProgress(completed) {

        const count = completed.length;


        if (count === 0) return 0;

        if (count === 1) return 0;

        if (count === 2) return 25;

        if (count === 3) return 50;

        if (count === 4) return 50;

        if (count === 5) return 75;

        if (count >= 6) return 100;

        return 0;
    }


    // ========================================
    // DARSNI YAKUNLASH
    // ========================================

    window.completeLesson = function (
        lessonNumber
    ) {

        if (!isLoggedIn()) {

            alert(
                "Darsni davom ettirish uchun avval tizimga kiring."
            );

            window.location.href =
                "login.html";

            return;
        }


        let data =
            getCourseProgress();


        if (!data[courseKey]) {

            data[courseKey] = {
                completed: [],
                progress: 0
            };
        }


        if (
            !data[courseKey]
                .completed
                .includes(lessonNumber)
        ) {

            data[courseKey]
                .completed
                .push(lessonNumber);

        }


        data[courseKey].progress =
            calculateProgress(
                data[courseKey].completed
            );


        saveCourseProgress(data);


        updateCoursePage();


        const progress =
            data[courseKey].progress;


        if (progress === 100) {

            showCertificate();

        } else {

            alert(
                "🎉 Dars muvaffaqiyatli yakunlandi!\n\nProgress: " +
                progress +
                "%"
            );
        }
    };


    // ========================================
    // DARS TANLASH
    // ========================================

    window.selectLesson = function (
        number,
        lessonName
    ) {

        const data =
            getCourseProgress();

        const completed =
            data[courseKey]
                ? data[courseKey].completed
                : [];


        // Birinchi dars doim ochiq
        if (number === 1) {

            openLesson(
                number,
                lessonName
            );

            return;
        }


        // Oldingi dars tugaganmi?
        if (
            !completed.includes(number - 1)
        ) {

            alert(
                "🔒 Bu dars qulflangan.\n\nAvval oldingi darsni yakunlang."
            );

            return;
        }


        openLesson(
            number,
            lessonName
        );
    };


    // ========================================
    // DARSNI OCHISH
    // ========================================

    function openLesson(
        number,
        lessonName
    ) {

        const title =
            document.querySelector(
                ".video-box h3"
            );


        if (title) {

            title.textContent =
                number +
                "-dars: " +
                lessonName;

        }


        const videoBox =
            document.querySelector(
                ".video-box"
            );


        if (videoBox) {

            videoBox.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }


        // Tugmani chiqarish
        const existingButton =
            document.getElementById(
                "completeLessonBtn"
            );


        if (existingButton) {

            existingButton.remove();

        }


        if (!isLoggedIn()) return;


        const button =
            document.createElement(
                "button"
            );


        button.id =
            "completeLessonBtn";


        button.textContent =
            "✅ Darsni tugatdim";


        button.style.cssText = `
            margin-top:20px;
            width:100%;
            padding:14px;
            border:none;
            border-radius:10px;
            background:#2563eb;
            color:white;
            font-size:15px;
            font-weight:700;
            cursor:pointer;
        `;


        button.onclick =
            function () {

                completeLesson(number);

            };


        if (videoBox) {

            videoBox.appendChild(
                button
            );

        }
    }


    // ========================================
    // COURSE PAGE PROGRESS
    // ========================================

    function updateCoursePage() {

        const data =
            getCourseProgress();


        const course =
            data[courseKey];


        if (!course) return;


        const progress =
            course.progress;


        // Progress text
        const progressTexts =
            document.querySelectorAll(
                ".progress-percent"
            );


        progressTexts.forEach(
            function (element) {

                element.textContent =
                    progress + "%";

            }
        );


        // Progress bar
        const progressBars =
            document.querySelectorAll(
                ".progress-fill"
            );


        progressBars.forEach(
            function (bar) {

                bar.style.width =
                    progress + "%";

            }
        );


        // Darslar
        const lessonItems =
            document.querySelectorAll(
                ".lesson-item"
            );


        lessonItems.forEach(
            function (item, index) {

                const number =
                    index + 1;


                if (
                    course.completed
                        .includes(number)
                ) {

                    item.classList.add(
                        "completed"
                    );


                    const icon =
                        item.querySelector(
                            ".lesson-icon"
                        );


                    if (icon) {

                        icon.textContent =
                            "✅";

                    }

                }

            }
        );
    }


    // ========================================
    // CERTIFICATE
    // ========================================

    function showCertificate() {

        const oldCertificate =
            document.getElementById(
                "eduwayCertificate"
            );


        if (oldCertificate) {

            oldCertificate.remove();

        }


        const certificate =
            document.createElement(
                "div"
            );


        certificate.id =
            "eduwayCertificate";


        const currentUser =
            getUser();


        const name =
            currentUser
                ? currentUser.name
                : "O‘quvchi";


        certificate.innerHTML = `

            <div style="
                position:fixed;
                inset:0;
                background:rgba(15,23,42,0.75);
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:9999;
                padding:20px;
            ">

                <div style="
                    width:min(650px,100%);
                    background:white;
                    border-radius:25px;
                    padding:45px 30px;
                    text-align:center;
                    box-shadow:0 30px 80px rgba(0,0,0,.25);
                ">

                    <div style="
                        font-size:60px;
                        margin-bottom:15px;
                    ">
                        🏆
                    </div>

                    <h2 style="
                        font-size:30px;
                        margin-bottom:10px;
                    ">
                        Tabriklaymiz!
                    </h2>

                    <p style="
                        color:#64748b;
                        margin-bottom:20px;
                    ">
                        Siz Frontend Development
                        kursini muvaffaqiyatli yakunladingiz.
                    </p>

                    <div style="
                        border:2px solid #2563eb;
                        border-radius:15px;
                        padding:25px;
                        margin-bottom:25px;
                    ">

                        <div style="
                            font-size:13px;
                            color:#64748b;
                        ">
                            SERTIFIKAT
                        </div>

                        <h3 style="
                            font-size:25px;
                            margin:12px 0;
                        ">
                            ${name}
                        </h3>

                        <p style="
                            color:#475569;
                        ">
                            Frontend Development
                        </p>

                        <strong style="
                            color:#2563eb;
                        ">
                            100% yakunlandi
                        </strong>

                    </div>

                    <button
                        onclick="
                            document
                                .getElementById('eduwayCertificate')
                                .remove()
                        "
                        style="
                            padding:13px 25px;
                            border:none;
                            border-radius:10px;
                            background:#2563eb;
                            color:white;
                            font-weight:700;
                            cursor:pointer;
                        "
                    >
                        Yopish
                    </button>

                </div>

            </div>
        `;


        document.body.appendChild(
            certificate
        );
    }


    // ========================================
    // COURSE PAGE BOSHLANGANDA PROGRESS
    // ========================================

    if (
        window.location.pathname
            .toLowerCase()
            .includes("course.html")
    ) {

        updateCoursePage();

    }


    // ========================================
    // LOGOUT BUTTON
    // ========================================

    const logoutButton =
        document.querySelector(
            ".logout-btn"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                eduwayLogout();

            }
        );

    }


    console.log(
        "EduWay App ishga tushdi 🚀"
    );

});