$(document).ready(() => {
    openModal();

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
    const $modificator = $(".modificator");
    const $bonus = $(".bonus");
    const $upgradeButtonMod = $(".price-mod");
    const $upgradeButtonBonus = $(".price-bonus");
    const $displayMod = $(".modificator__counter");
    const $displayBonus = $(".bonus__counter");

    // Global scope
    let points = 0.0;
    let pointsMultiplier = 1.0;
    let bonusPoints = 0.0;
    let userNickname = "";
    let previousMultipleOf100 = 0;

    $modificator.html(`Modificator: ${pointsMultiplier.toFixed(2)}`);
    $bonus.html(`Bonus: ${bonusPoints.toFixed(2)}`);
    $displayMod.html(`Modificator: ${pointsMultiplier.toFixed(2)}`);
    $displayBonus.html(`Bonus: ${bonusPoints.toFixed(2)}`);

    $upgradeButtonMod.on("click", () => {
        if (points < 100) {
            alert("You do not have enough points for this upgrade")
        } else {
            pointsMultiplier += 0.10;
            points -= 100;
            $modificator.html(`Modificator: ${pointsMultiplier.toFixed(2)}`);
            $bonus.html(`Bonus: ${bonusPoints.toFixed(2)}`);
            $currentScore.text(points.toFixed(2));
            $displayMod.html(`Modificator: ${pointsMultiplier.toFixed(2)}`);
        }
    })
    $upgradeButtonBonus.on("click", () => {
        if (points < 250) {
            alert("You do not have enough points for this upgrade")
        } else {
            bonusPoints += 1;
            points -= 250;
            $modificator.html(`Modificator: ${pointsMultiplier.toFixed(2)}`);
            $bonus.html(`Bonus: ${bonusPoints.toFixed(2)}`);
            $currentScore.text(points.toFixed(2));
            $displayBonus.html(`Bonus: ${bonusPoints.toFixed(2)}`);
        }
    })

    // Clicker animation and actions
    $buttonToClick.on("click", () => {
        points += pointsMultiplier + bonusPoints;
        $clickSound.load();
        $clickSound.pause();
        $clickSound.currentTime = 0;
        $clickSound.play();
        $currentScore.text(points.toFixed(2));
        animateDefaultButtonClick ();
        $displayMod.html(`Modificator: ${pointsMultiplier.toFixed(2)}`);
        $displayBonus.html(`Bonus: ${bonusPoints.toFixed(2)}`);
        $bonus.html(`Bonus: ${bonusPoints.toFixed(2)}`);
    });
    $buttonToClick.on("mouseover", animateDefaultButtonHover);
    $buttonToClick.on("mouseout", animateDefaultButtonHover);

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

    $upgradeMenu.on("click", openUpgrade);
    $(document).keydown((event) => {
        if (event.which === 27) {
            closeSkins();
            closeUpgrade();
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
            case "./image/skin-button/button_cat.webp":
            $currentSound.attr("src", "./sound/button_cat_sound.mp3");
            break;
            case "./image/skin-button/button_cow.webp":
            $currentSound.attr("src", "./sound/button_cow_sound.mp3");
            break;
        }
    }

    function saveData () {
        let playerData = {
            nickname: userNickname,
            score: points.toFixed(2),
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


    // Open Upgrade menu
    function openUpgrade() {
        const $overlay = $(".upgrade__setup--container");
        const $display = $(".upgrade__setup--modal");
        
        $overlay.css("display", "flex");
        $display.css("display", "grid");
    }

    function closeUpgrade() {
        const $overlay = $(".upgrade__setup--container");
        const $display = $(".upgrade__setup--modal");
        
        $overlay.css("display", "none");
        $display.css("display", "none");
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
        const $modal = $(".modal__nickname");
        const $submitButton = $(".button__submit")

        $overlay.css("display", "flex");
        $modal.css("display", "block");

        $submitButton.on("click", saveNickname);
        loadData();
    }

    function closeModal() {
        const $overlay = $(".nickname__setup");
        const $modal = $(".modal__nickname");

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
            alert("Your Nickname should contain at least 1 letter and from 4 to 16 characters (numbers are allowed)");
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