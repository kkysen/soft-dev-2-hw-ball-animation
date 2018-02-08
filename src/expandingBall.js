"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const utils_1 = require("./utils");
const listener_1 = require("./listener");
const keys_1 = require("./keys");
exports.newExpandingBall = function (options) {
    const reset = function (game) {
        privateBall.radius = ball.initialRadius;
        privateBall.radiusSpeed = ball.initialRadiusSpeed;
        privateBall.x = game.canvas.width / 2;
        privateBall.y = game.canvas.height / 2;
    };
    const reverseRadiusSpeed = function (direction) {
        privateBall.radiusSpeed = direction * Math.abs(ball.radiusSpeed);
        if (ball.onRadiusSpeedReversal) {
            ball.onRadiusSpeedReversal();
        }
    };
    const update = function (game) {
        // console.log(ball.radius);
        let radius = ball.radius;
        radius += ball.radiusSpeed; // * game.delta * 0.001;
        if (radius < 0) {
            radius = 0;
            reverseRadiusSpeed(1);
        }
        else if (2 * radius > game.canvas.width || 2 * radius > game.canvas.height) {
            reverseRadiusSpeed(-1);
        }
        privateBall.radius = radius;
    };
    const ballRenderer = options.render;
    const delegateRender = function (game) {
        ballRenderer(game, ball);
    };
    const ownRender = function (game) {
        game.context.beginPath();
        game.context.ellipse(ball.x, ball.y, ball.radius, ball.radius, 0, 0, utils_1.MathUtils.TAU);
        game.context.fill();
    };
    const render = options.render ? delegateRender : ownRender;
    const ball = {
        initialRadius: options.initialRadius,
        initialRadiusSpeed: options.initialRadiusSpeed,
        radius: 0,
        radiusSpeed: options.initialRadiusSpeed,
        x: 0,
        y: 0,
        reset: reset,
        update: update,
        render: render,
    };
    const privateBall = ball;
    return ball;
};
exports.newExpandingBallGame = function (options) {
    const parent = options.parent.appendNewElement("center");
    parent.appendNewElement("h4").innerText = "Use UP and DOWN arrow keys to change the speed of the radius.";
    const canvasDiv = parent.appendNewElement("div");
    parent.appendBr();
    const startButton = parent.appendButton("I’m an Animaniac!");
    const stopButton = parent.appendButton("STOP");
    const resumeButton = parent.appendButton("Resume");
    const reverseDirectionButton = parent.appendButton("Reverse Direction");
    const resetButton = parent.appendButton("Reset");
    const game = game_1.newGame()
        .name("Expanding Ball")
        .newCanvas(canvasDiv)
        .size(options.gameWidth, options.gameHeight)
        .build();
    const ball = exports.newExpandingBall({
        initialRadius: options.initialBallRadius,
        initialRadiusSpeed: options.initialBallRadiusSpeed,
        render: options.ballRenderer,
    });
    const updateReverseDirectionButtonText = function () {
        reverseDirectionButton.innerText =
            ball.radiusSpeed === 0
                ? "Reverse Direction"
                : ball.radiusSpeed < 0
                    ? "Grow" : "Shrink";
    };
    ball.onRadiusSpeedReversal = updateReverseDirectionButtonText;
    const privateBall = ball;
    game.addActor(ball);
    game.startListener.click(startButton);
    game.stopListener.click(stopButton);
    game.resumeListener.click(resumeButton);
    game.restartListener.click(resetButton);
    listener_1.newListener(() => () => {
        console.log("reversing");
        privateBall.radiusSpeed *= -1;
        updateReverseDirectionButtonText();
    }).click(reverseDirectionButton);
    updateReverseDirectionButtonText();
    // change speed
    window.addEventListener("keydown", function (e) {
        const deltaSpeed = keys_1.keyCodeToDeltaSpeed(e.keyCode);
        privateBall.radiusSpeed += Math.sign(ball.radiusSpeed) * deltaSpeed;
        if (ball.radiusSpeed === 0) {
            privateBall.radiusSpeed += deltaSpeed;
        }
        if (deltaSpeed !== 0) {
            e.preventDefault();
        }
    });
    game.ball = ball;
    return game;
};
