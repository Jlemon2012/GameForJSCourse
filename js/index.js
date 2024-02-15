$(document).ready(() => {
    // openModal();

    const $buttonToClick = $(".push__button");
    const $currentScore = $(".game__score");
    const $clickSound = $(".click__sound")[0];
    const $saveButton = $(".game__button--save");
    const $skinsMenu = $(".menu__option--skins");
    const $skinsCursor = $(".skins__cursors");
    const $skinsButtons = $(".skins__buttons");
    const $skinsCursorIcons = $(".cursor");
    const $skinsButtonsIcons = $(".button");
    const $upgradeMenu = $(".menu__option--upgrades");

    // Global scope
    let points = 0;
    let pointsMultiplier = 1;
    let userNickname = "";

    // Clicker animation and actions
    $buttonToClick.on("click", () => {
        points += pointsMultiplier;
        $clickSound.load();
        $clickSound.pause();
        $clickSound.currentTime = 0;
        $clickSound.play();
        $currentScore.text(points);
        animateDefaultButtonClick ();
    });
    $buttonToClick.on("mouseover", animateDefaultButtonHover);
    $buttonToClick.on("mouseout", animateDefaultButtonHover);

    // Save Button
    $saveButton.on("click", saveData);

    // Open and close skin menu
    $skinsMenu.on("click", openSkins);
    $skinsCursor.on("click", () => {
        let $getButtonSkins = $(".button");
        let $getCursorSkins = $(".cursor");
        $getButtonSkins.css("display", "none");
        $getCursorSkins.css("display", "block");
    } )
    $skinsButtons.on("click", () => {
        let $getButtonSkins = $(".button");
        let $getCursorSkins = $(".cursor");
        $getButtonSkins.css("display", "block");
        $getCursorSkins.css("display", "none");
    } )
    $(document).keydown((event) => {
        if (event.which === 27) {
            closeSkins()
        }
    })

    // Apply skins
    $skinsCursorIcons.on("click", function() {
        let $iconPlace = $(".push__button");
        let currentIcon = $(this).attr("src");
        $iconPlace.css("cursor", `url(${currentIcon}), auto`);
        $iconPlace.off("mouseenter mouseleave");
    });
    $skinsButtonsIcons.on("click", function() {
        let $iconPlace = $(".push__button");
        let currentIcon = $(this).attr("src");
        $iconPlace.attr("src", `${currentIcon}`);
        switchSound(currentIcon);
    });

    function switchSound(icon) {
        let $currentSound = $(".click__sound source");
        switch (icon) {
            case "./image/skin-button/button_default.png":
            $currentSound.attr("src", "./sound/button_default_sound.mp3");
            break;
            case "./image/skin-button/button_bag.webp":
            $currentSound.attr("src", "./sound/button_bag_sound.mp3");
            break;
            case "./image/skin-button/button_like.webp":
            $currentSound.attr("src", "./sound/button_like_sound.mp3");
            break;
            case "./image/skin-button/button_3d.png":
            $currentSound.attr("src", "./sound/button_3d_sound.mp3");
            break;
            case "./image/skin-button/button_button_cat.webp":
            $currentSound.attr("src", "./sound/button_cat_sound.mp3");
            break;
            case "./image/skin-button/button_cow.webp":
            $currentSound.attr("src", "./sound/button_cow_sound.mp3");
            break;
        }
    }

    function animateDefaultButtonHover () {
        $buttonToClick.css("transform", "scaleX(1.5)");
        setTimeout(function() {
            $buttonToClick.css("transform", "scaleX(1)");
        }, 300);
    }

    function animateDefaultButtonClick () {
        $buttonToClick.css("transform", "scaleY(0.2)");
        setTimeout(function() {
            $buttonToClick.css("transform", "scaleY(1)");
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
        setData();
    }

    function setData() {
        // Filters players from the highest score to the lowest
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
        window.localStorage.setItem("leaders", JSON.stringify(filteredLeaders));

        // Adds data to the Leaderboard
        const $leaderContent = $(".leaderboard__content tr");
        let orderedNicknames = filteredLeaders.map((value) => {
            let text = value.split(" ")[0];  
            return text;
        });
        let orderedPoints = filteredLeaders.map((value) => {
            let text = value.split(" ")[1];  
            return text;
        });
        $leaderContent.each(function (index) {
            $(this).find(".leader__nickname").text(orderedNicknames[index]);
            $(this).find(".leader__score").text(orderedPoints[index]);
        })
    }

    // Load the Leaderboard
    function loadData () {
        const dataToLoad = JSON.parse(window.localStorage.getItem("leaders"));
        if (dataToLoad != null) {
        const $leaderLoad = $(".leaderboard__content tr");
        let orderedNicknames = dataToLoad.map((value) => {
            let text = value.split(" ")[0];
            return text;
        });
        let orderedPoints = dataToLoad.map((value) => {
            let text = value.split(" ")[1];  
            return text;
        });
        $leaderLoad.each(function (index) {
            $(this).find(".leader__nickname").text(orderedNicknames[index]);
            $(this).find(".leader__score").text(orderedPoints[index]);
        })
        } else {
            return;
        }
    }

    // Open Skins menu
    function openSkins() {
        const $overlay = $(".skins__setup--container");
        const $display = $(".skins__setup--modal");
        
        $overlay.css("display", "flex");
        $display.css("display", "grid");
    }

    function closeSkins() {
        const $overlay = $(".skins__setup--container");
        const $display = $(".skins__setup--modal");
        
        $overlay.css("display", "none");
        $display.css("display", "none");
    }

    // Open, close modal window to ask Nickname
    function openModal() {
        const $overlay = $(".nickname__setup");
        const $modal = $("#modal__nickname");
        const $submitButton = $(".button__submit")

        $overlay.css("display", "flex");
        $modal.css("display", "block");

        $submitButton.on("click", saveNickname);
        loadData();
    }

    function closeModal() {
        const $overlay = $(".nickname__setup");
        const $modal = $("#modal__nickname");

        $overlay.css("display", "none");
        $modal.css("display", "none");
    }

    // Check and Save Nickname
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
        let regex = /^[a-zA-Z]+[0-9]{4,24}$|^[a-zA-Z0-9]{4,16}$/
        if(regex.test(text)) {
            return true;
        } else {
            return false;
        }
    }

  });