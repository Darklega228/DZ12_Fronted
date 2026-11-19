$(document).ready(function () {
    const dictionaries = {
        beginner: {
            label: "Початковий",
            words: [
                { en: "always", uk: ["завжди"] },
                { en: "never", uk: ["ніколи"] },
                { en: "sometimes", uk: ["іноді", "інколи"] },
                { en: "often", uk: ["часто"] },
                { en: "today", uk: ["сьогодні"] },
                { en: "tomorrow", uk: ["завтра"] },
                { en: "yesterday", uk: ["вчора", "учора"] },
                { en: "water", uk: ["вода"] },
                { en: "house", uk: ["будинок", "дім"] },
                { en: "book", uk: ["книга", "книжка"] },
                { en: "friend", uk: ["друг"] },
                { en: "city", uk: ["місто"] }
            ]
        },
        intermediate: {
            label: "Середній",
            words: [
                { en: "usually", uk: ["зазвичай"] },
                { en: "rarely", uk: ["рідко"] },
                { en: "already", uk: ["вже", "уже"] },
                { en: "together", uk: ["разом"] },
                { en: "knowledge", uk: ["знання"] },
                { en: "development", uk: ["розвиток", "розробка"] },
                { en: "decision", uk: ["рішення"] },
                { en: "environment", uk: ["середовище", "довкілля"] },
                { en: "experience", uk: ["досвід"] },
                { en: "opportunity", uk: ["можливість"] },
                { en: "behavior", uk: ["поведінка"] },
                { en: "direction", uk: ["напрямок", "напрям"] }
            ]
        },
        advanced: {
            label: "Високий",
            words: [
                { en: "consequence", uk: ["наслідок"] },
                { en: "ambiguity", uk: ["неоднозначність", "двозначність"] },
                { en: "inevitable", uk: ["неминучий"] },
                { en: "comprehensive", uk: ["всеосяжний", "вичерпний"] },
                { en: "perseverance", uk: ["наполегливість"] },
                { en: "fluctuation", uk: ["коливання"] },
                { en: "resilient", uk: ["стійкий", "витривалий"] },
                { en: "mitigate", uk: ["пом'якшувати", "помякшувати"] },
                { en: "substantial", uk: ["суттєвий", "значний"] },
                { en: "unprecedented", uk: ["безпрецедентний"] },
                { en: "scrutiny", uk: ["прискіпливий аналіз", "перевірка"] },
                { en: "feasible", uk: ["здійсненний", "реальний"] }
            ]
        }
    };

    const TOTAL_WORDS = 10;
    let currentDifficulty = "beginner";
    let wordsList = [];
    let currentIndex = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    function shuffleArray(array) {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function getSelectedDifficulty() {
        const checkedValue = $('input[name="difficulty"]:checked').val();
        return dictionaries[checkedValue] ? checkedValue : "beginner";
    }

    function initGame() {
        currentDifficulty = getSelectedDifficulty();
        const pool = dictionaries[currentDifficulty].words;

        wordsList = shuffleArray(pool)
            .slice(0, TOTAL_WORDS)
            .map(item => ({
                ...item,
                userAnswer: "",
                status: null 
            }));

        currentIndex = 0;
        correctCount = 0;
        incorrectCount = 0;

        $("#result-modal").addClass("hidden");
        updateStats();
        renderCard();
    }

    function renderCard() {
        const currentItem = wordsList[currentIndex];
        const $card = $("#word-card");
        const $input = $("#translation-input");
        const $hint = $("#card-hint");

        $("#word-text").text(currentItem.en);
        $("#step-counter").text(`${currentIndex + 1}/${TOTAL_WORDS}`);

        $("#validation-msg").removeClass("visible");
        $input.removeClass("input-error");
        $card.removeClass("status-correct status-incorrect");

        $input.val(currentItem.userAnswer);

        if (currentItem.status === "correct") {
            $card.addClass("status-correct");
            $input.prop("disabled", true);
            $hint.text("Вірно!");
        } else if (currentItem.status === "incorrect") {
            $card.addClass("status-incorrect");
            $input.prop("disabled", true);
            $hint.text(`Невірно. Правильно: ${currentItem.uk[0]}`);
        } else {
            $input.prop("disabled", false).focus();
            $hint.text("Натисніть на картку, щоб перевірити");
        }

        $("#prev-btn").prop("disabled", currentIndex === 0);
        $("#next-btn").prop("disabled", currentIndex === TOTAL_WORDS - 1);
    }

    function updateStats() {
        $("#correct-count").text(correctCount);
        $("#incorrect-count").text(incorrectCount);
    }

    function checkTranslation() {
        const currentItem = wordsList[currentIndex];

        if (currentItem.status !== null) {
            if (currentIndex < TOTAL_WORDS - 1) {
                currentIndex++;
                renderCard();
            }
            return;
        }

        const rawInput = $("#translation-input").val().trim();

        if (rawInput === "") {
            $("#translation-input").addClass("input-error").focus();
            $("#validation-msg").text("Введіть переклад перед перевіркою!").addClass("visible");
            return;
        }

        const normalizedInput = rawInput.toLowerCase();
        currentItem.userAnswer = rawInput;

        if (currentItem.uk.includes(normalizedInput)) {
            currentItem.status = "correct";
            correctCount++;
        } else {
            currentItem.status = "incorrect";
            incorrectCount++;
        }

        updateStats();
        renderCard();

        if (correctCount + incorrectCount === TOTAL_WORDS) {
            setTimeout(showResultModal, 600);
        }
    }

    function showResultModal() {
        const percentage = (correctCount / TOTAL_WORDS) * 100;
        let level = "";

        if (percentage >= 90) {
            level = "Високий (Advanced / C1)";
        } else if (percentage >= 70) {
            level = "Середній (Intermediate / B1-B2)";
        } else if (percentage >= 40) {
            level = "Базовий (Elementary / A2)";
        } else {
            level = "Початковий (Beginner / A1)";
        }

        $("#selected-difficulty-label").text(dictionaries[currentDifficulty].label);
        $("#final-score").text(correctCount);
        $("#total-words").text(TOTAL_WORDS);
        $("#knowledge-level").text(level);
        $("#result-modal").removeClass("hidden");
    }

    $('input[name="difficulty"]').on("change", function () {
        initGame();
    });

    $("#word-card").on("click", function () {
        checkTranslation();
    });

    $("#translation-input").on("keypress", function (e) {
        if (e.which === 13) {
            checkTranslation();
        }
    });

    $("#translation-input").on("input", function () {
        $(this).removeClass("input-error");
        $("#validation-msg").removeClass("visible");
    });

    $("#prev-btn").on("click", function () {
        if (currentIndex > 0) {
            currentIndex--;
            renderCard();
        }
    });

    $("#next-btn").on("click", function () {
        if (currentIndex < TOTAL_WORDS - 1) {
            currentIndex++;
            renderCard();
        }
    });

    $("#restart-btn").on("click", function () {
        initGame();
    });

    initGame();
});