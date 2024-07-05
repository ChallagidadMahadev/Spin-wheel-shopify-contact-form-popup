
// the game itself
var game;
var game_launched = false;

var gameOptions = {

    // slices (prizes) placed in the wheel
    slices: 6,

    // prize names, starting from 12 o'clock going clockwise
    slicePrizes: [
        "🎉 5% OFF",
        "🎉 10% OFF",
        "🎉 15% OFF",
        "🎉 25% OFF",
        "🎉 50% OFF",
        "🎉 FREE PASTRY 🍰"
    ],

    // wheel rotation duration, in milliseconds
    rotationTime: 3000
}


class PartyButton extends HTMLButtonElement {

    constructor() {
        super();
        this.isAnimating = false;
        this.bindedAnimate = this.animate.bind(this);
    }

    connectedCallback() {
        this.addEventListener('click', this.partyTime)
    }

    partyTime() {
        console.log(game_launched);
        if (game_launched == false) {
            // game configuration object
            var gameConfig = {

                // render type
                type: Phaser.CANVAS,

                parent: "alivenow-game",
                // game width, in pixels
                scale: {
                    // Or set parent divId here

                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                },
                width: 850,

                // game height, in pixels
                height: 850,

                // game background color
                backgroundColor: 0xCACFD2,

                // scenes used by the game
                scene: [playGame]
            };

            // game constructor
            game = new Phaser.Game(gameConfig);

            // pure javascript to give focus to the page/frame and scale the game
            window.focus()
            resize();
            window.addEventListener("resize", resize, false);
            game_launched = true;
        }
    }
}

customElements.define('party-button', PartyButton, { extends: "button" })

// once the window loads...
window.onload = function () {


}

// PlayGame scene
class playGame extends Phaser.Scene {

    // constructor
    constructor() {
        super("PlayGame");
    }

    // method to be executed when the scene preloads
    preload() { // loading assets
        this.load.image("wheel", urls);
        //this.load.image("wheel", "{{ wheel.png | asset_url }}");
        this.load.image("pin", urls_pin);
    }

    // method to be executed once the scene has been created
    create() {

        // adding the wheel in the middle of the canvas
        this.wheel = this.add.sprite(game.config.width / 2, game.config.height / 2, "wheel");


        // adding the pin in the middle of the canvas
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");

        // adding the text field
        this.prizeText = this.add.text(game.config.width / 2, game.config.height - 35, "SPIN TO WIN", {
            font: "bold 64px Rajdhani",
            align: "center",
            color: "white"
        });

        // center the text
        this.prizeText.setOrigin(0.5);

        // the game has just started = we can spin the wheel
        this.canSpin = true;

        // waiting for your input, then calling "spinWheel" function
        this.input.on("pointerdown", this.spinWheel, this);
    }

    // function to spin the wheel
    spinWheel() {

        // can we spin the wheel?
        if (this.canSpin) {

            // resetting text field
            this.prizeText.setText("");

            // the wheel will spin round from 2 to 4 times. This is just coreography
            var rounds = Phaser.Math.Between(4, 6);

            // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
            var degrees = Phaser.Math.Between(0, 360);

            // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
            var prize = gameOptions.slices - 1 - Math.floor(degrees / (360 / gameOptions.slices));

            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;

            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            this.tweens.add({

                // adding the wheel to tween targets
                targets: [this.wheel],

                // angle destination
                angle: 360 * rounds + degrees,

                // tween duration
                duration: gameOptions.rotationTime,

                // tween easing
                ease: "Cubic.easeOut",

                // callback scope
                callbackScope: this,

                // function to be executed once the tween has been completed
                onComplete: function (tween) {
                    // displaying prize text
                    this.prizeText.setText(gameOptions.slicePrizes[prize]);

                    // player can spin again
                    this.canSpin = false;


                    var canvas = document.querySelector("canvas");
                    console.log(canvas);
                    document.getElementById("user-form").style.width = canvas.style.width;
                    canvas.style.display = "none";
                    document.getElementById("user-form").style.display = "flex";
                }
            });
        }
    }
}

// pure javascript to scale the game
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

// let userForm = document.querySelector("[type=app-form]");

// userForm.addEventListener("submit", function (e) {
//   e.preventDefault();
//   console.log("form btn data click");
//   let formData = new FormData(userForm);
//   let data = [...formData.values()];
//   fetch(`${location.origin}/apps/proxy-5/userinfo?shop=${Shopify.shop}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((data) => console.log(data))
//     .catch((error) => console.log(error));
// });


// form.addEventListener("submit", (event) => {
//   event.preventDefault(); // Prevent default form submission

//   // Simulate form submission (replace with your actual form submission logic)
//   console.log("Form data submitted:", {
//     name: document.getElementById("name").value,
//     email: document.getElementById("email").value,
//   });

//   // Show the thank you modal
//   thankyouModal.style.display = "block";
// });


let proxy = "proxy"
let userForm = document.getElementById("submit-btn");
// const userForm = document.getElementById("user-form");
const thankyouModal = document.getElementById("thankyou-modal");
const closeModalBtn = document.getElementById("close-modal");

userForm.addEventListener('click', function (e) {
  e.preventDefault();
  console.log("form clicked");
  let formdata = new FormData();
      formdata.username = document.getElementById("name").value;
      formdata.useremail = document.getElementById("email").value;

// let formData = new FormData(userForm);
// let data = [...formData.values()];
console.log(formdata)
  fetch(`${location.origin}/apps/${proxy}/userinfo?shop=${Shopify.shop}`, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    //   body: JSON.stringify({ name: "venki", email: "venki@gmail.com" }),
    body: JSON.stringify(formdata),
  }).then((response) => response.json())
    .then((data) => thankyouModal.style.display = "block")
    .catch((error) => console.log(error));
});



closeModalBtn.addEventListener("click", () => {
  thankyouModal.style.display = "none";
});