$(document).ready(() => {
    openModal();
    // loadData();

    const $buttonToClick = $(".push__button");
    const $currentScore = $(".game__score");
    const $clickSound = $(".click__sound")[0];
    const $saveButton = $(".game__button--save");

    let points = 0;
    let pointsMultiplier = 1;
    let userNickname = "";

    $buttonToClick.on("click", () => {
        points += pointsMultiplier;
        $clickSound.pause();
        $clickSound.currentTime = 0;
        $clickSound.play();
        $currentScore.text(points);
        animateDefaultButtonClick ();
    });

    $saveButton.on("click", saveData);

    $buttonToClick.on("mouseover", animateDefaultButtonHover);

    $buttonToClick.on("mouseout", animateDefaultButtonHover);

    $saveButton.on("click", saveData);

    function animateDefaultButtonHover () {
        $buttonToClick.css("transform", "scaleX(1.75)");
        $buttonToClick.css("transform", "scaleY(0.5)");
        setTimeout(function() {
            $buttonToClick.css("transform", "scaleX(1)");
            $buttonToClick.css("transform", "scaleY(1)");
        }, 300);
    }

    function animateDefaultButtonClick () {
        $buttonToClick.css("transform", "scale(0.1)");
        setTimeout(function() {
            $buttonToClick.css("transform", "scale(1)");
        }, 100);
    }

    function saveData () {
        let playerData = {
            nickname: userNickname,
            score: points
        }

        let storedPlayerData = JSON.parse(localStorage.getItem("players")) || {};
        let playerName = playerData.nickname;
        let playerScore = playerData.score;
        storedPlayerData[playerName] = playerScore;

        localStorage.setItem('players', JSON.stringify(storedPlayerData));
        // setData();
    }

    function setData() {
        let leaderBoardData = JSON.parse(window.localStorage.getItem("players"));
        let leadersArr = [];
        for (let property in leaderBoardData) {
        leadersArr.push(`${property} ${leaderBoardData[property]}`);
        };
        let numbersArr = leadersArr.map((value) => {
            let numberScore = value.split(" ")[1];  
            return numberScore;
        });  
        let leadersScore = numbersArr.map((value) => {return parseInt(value, 10)});
        let filteredLeaders = leadersArr;
        for (let i = 0; i < leadersScore.length; i++) {
          let minIndex = i;
            for (let j = i + 1; j < leadersScore.length; j++) {
              if (leadersScore[j] > leadersScore[minIndex]) {
                  minIndex = j;
                }
            }
          let tempValue = leadersScore[minIndex];
          leadersScore[minIndex] = leadersScore[i];
          leadersScore[i] = tempValue;
      
          let tempUser = filteredLeaders[minIndex];
          filteredLeaders[minIndex] = filteredLeaders[i];  
          filteredLeaders[i] = tempUser;
        }
    }

    function loadData () {

    }

    function openModal() {
        const $overlay = $(".nickname__setup");
        const $modal = $("#modal__nickname");
        const $submitButton = $(".button__submit")

        $overlay.css("display", "flex");
        $modal.css("display", "block");

        $submitButton.on("click", saveNickname);
    }

    function closeModal() {
        const $overlay = $(".nickname__setup");
        const $modal = $("#modal__nickname");

        $overlay.css("display", "none");
        $modal.css("display", "none");
    }

    function saveNickname() {
        let $nicknameInput = $("#nicknameInput").val();
        if (checkNickname($nicknameInput) === true) {
        userNickname = $nicknameInput;
        closeModal();
        } else {
            alert("Not Correct");
        }
    }

    function checkNickname(text) {
        let regex = /^[a-zA-Z]+[0-9]{4,24}$|^[a-zA-Z0-9]{4,24}$/
        if(regex.test(text)) {
            return true;
        } else {
            return false;
        }
    }
  });