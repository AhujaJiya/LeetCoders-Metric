document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search_button");
    const usernameInput = document.getElementById("user_input");
    const statsContainer = document.querySelector(".stats_container");
    const easyProgressCircle = document.querySelector(".easy_progress");
    const mediumProgressCircle = document.querySelector(".medium_progress");
    const hardProgressCircle = document.querySelector(".hard_progress");
    const easyLabel = document.getElementById("easy_label");
    const mediumLabel = document.getElementById("medium_label");
    const hardLabel = document.getElementById("hard_label");
    const cardStatsContainer = document.querySelector(".stats_card");

    //validate if the username entered exists or not
    function validateUsername(username) {
        if (username.trim() == "") {
            alert("Username cannot be empty");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data) {


        const totalQstn = data.totalQuestions;
        const totalHardQstn = data.totalHard;
        const totalMediumQstn = data.totalMedium;
        const totalEasyQstn = data.totalEasy;

        const totalSolvedQstn = data.totalSolved;
        const totalHardSolved = data.hardSolved;
        const totalMediumSolved = data.mediumSolved;
        const totalEasySolved = data.easySolved;

        updateProgress(totalEasySolved, totalEasyQstn, easyLabel, easyProgressCircle);
        updateProgress(totalMediumSolved, totalMediumQstn, mediumLabel, mediumProgressCircle);
        updateProgress(totalHardSolved, totalHardQstn, hardLabel, hardProgressCircle);

        const cardData = [
            { label: "Ranking", value: data.ranking },
            { label: "Contribution Point", value: data.contributionPoint }
        ];

        cardStatsContainer.innerHTML = cardData.map(
            data => {
                return `
                <div class="card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
                </div>
                `
            }
        ).join("");

        statsContainer.style.display = "block";
    }

    async function fetchUserdetails(username) {

        const url = ` https://leetcode-api-faisalshohag.vercel.app/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch the user details");
            }

            const data = await response.json();

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            console.log("Logging data:", data);

            displayUserData(data);
        }
        catch (error) {
            if (error.message === "That user does not exist.") {
                statsContainer.style.display = "none";
                alert('No data found');
            } else {
                statsContainer.style.display = "none";
                alert('Something went wrong. Please try again later.');
            }
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }


    searchButton.addEventListener('click', function () {
        const username = usernameInput.value;
        console.log("username: ", username);
        if (validateUsername(username)) {
            fetchUserdetails(username);
        }
    })




})