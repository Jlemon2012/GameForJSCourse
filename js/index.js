$(document).ready(() => {
    const buttonToClick = $(".push__button");
    const currentScore = $(".game__score");
    const clickSound = $(".click__sound")[0];
    let points = 0;
    let pointsMultiplier = 1;

    buttonToClick.on("click", () => {
        points += pointsMultiplier;
        clickSound.pause();
        clickSound.currentTime = 0;
        clickSound.play();
        currentScore.text(points);
    })
  });