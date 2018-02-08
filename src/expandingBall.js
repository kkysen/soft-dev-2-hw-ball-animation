"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const utils_1 = require("./utils");
const listener_1 = require("./listener");
// TODO make options object parameter instead
exports.newExpandingBall = function (options) {
    const reset = function (game) {
        privateBall.radius = ball.initialRadius;
        privateBall.radiusSpeed = ball.initialRadiusSpeed;
        privateBall.x = game.canvas.width / 2;
        privateBall.y = game.canvas.height / 2;
        game.clear();
    };
    const update = function (game) {
        privateBall.radius += ball.radiusSpeed * game.delta * 0.001;
    };
    const render = function (game) {
        game.context.ellipse(ball.x, ball.y, ball.radius, ball.radius, 0, 0, utils_1.MathUtils.TAU);
        game.context.fill();
    };
    const ball = {
        initialRadius: options.initialRadius,
        initialRadiusSpeed: options.initialRadiusSpeed,
        radius: 0,
        radiusSpeed: 0,
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
    const canvasDiv = parent.appendNewElement("div");
    parent.appendBr();
    parent.appendBr();
    const startButton = parent.appendButton("I’m an Animaniac!");
    const stopButton = parent.appendButton("STOP");
    const reverseDirectionButton = parent.appendButton("Reverse Direction");
    const resetButton = parent.appendButton("Reset");
    const game = game_1.newGame()
        .name("Expanding Ball")
        .newCanvas(canvasDiv)
        .size(options.gameWidth, options.gameHeight)
        .build();
    game.clearFrame = false;
    const ball = exports.newExpandingBall({
        initialRadius: options.initialBallRadius,
        initialRadiusSpeed: options.initialBallRadiusSpeed,
    });
    const privateBall = ball;
    game.addActor(ball);
    const updateReverseDirectionButtonText = function () {
        reverseDirectionButton.innerText =
            ball.initialRadiusSpeed === 0
                ? "Reverse Direction"
                : ball.initialRadiusSpeed < 0
                    ? "Grow" : "Shrink";
    };
    game.startListener.click(startButton);
    game.stopListener.click(stopButton);
    game.restartListener.click(resetButton);
    listener_1.newListener(() => () => {
        privateBall.radiusSpeed *= -1;
        updateReverseDirectionButtonText();
    }).click(reverseDirectionButton);
    game.ball = ball;
    return game;
};
