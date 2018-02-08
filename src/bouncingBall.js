"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const utils_1 = require("./utils");
exports.newBouncingBall = function (options) {
    if (!options.minBounceInterval) {
        options.minBounceInterval = 2; // default
    }
    const setNumBouncesText = function (numBounces = ball.numBounces) {
        ball.numBouncesText.innerText = "0 of Bounces: " + numBounces;
    };
    const setAngleText = function (angle = ball.angle) {
        ball.angleText.innerText = "Angle: " + utils_1.MathUtils.angleToString(angle);
    };
    const setSpeedText = function (speed = ball.speed) {
        ball.speedText.innerText = "Speed: " + speed;
    };
    const reset = function (game) {
        privateBall.initialSpeed = options.initialSpeed();
        privateBall.initialAngle = options.initialAngle();
        privateBall.x = game.canvas.width / 2;
        privateBall.y = game.canvas.height / 2;
        privateBall.speed = privateBall.initialSpeed;
        privateBall.angle = privateBall.initialAngle;
        setAngleText();
        setSpeedText();
        privateBall.lastXBounceTick = 0;
        privateBall.lastYBounceTick = 0;
        privateBall.numBounces = 0;
        setNumBouncesText();
        console.log("Initial Angle: " + utils_1.MathUtils.angleToString(ball.initialAngle));
    };
    const update = function (game) {
        const canvas = game.canvas;
        const radius = ball.radius;
        let x = ball.x;
        let y = ball.y;
        let angle = ball.angle;
        const xBounce = x < radius || x > canvas.width - radius;
        const yBounce = y < radius || y > canvas.height - radius;
        if (game.tick - ball.lastXBounceTick > ball.minBounceInterval && xBounce) {
            angle = -(Math.PI + angle) % utils_1.MathUtils.TAU;
            privateBall.lastXBounceTick = this.tick;
        }
        else if (this.tick - ball.lastYBounceTick > ball.minBounceInterval && yBounce) {
            angle = -angle;
            privateBall.lastYBounceTick = this.tick;
        }
        if (xBounce || yBounce) {
            privateBall.numBounces++;
            setNumBouncesText();
            setAngleText(angle);
        }
        // fail safe to rescue balls off screen
        if (game.tick % 16 === 0) {
            if (x < 0) {
                x = radius;
            }
            if (x > canvas.width) {
                x = canvas.width - radius;
            }
            if (y < 0) {
                x = radius;
            }
            if (y > canvas.height) {
                y = canvas.height - radius;
            }
        }
        // super fail safe, reset to center
        // usually happens at extreme speeds, so not noticeable really
        if (game.tick % 64 === 0) {
            if (x < 0 || x > canvas.width) {
                console.log("super fail safe");
                x = canvas.width / 2;
            }
            if (y < 0 || y > canvas.height) {
                console.log("super fail safe");
                y = canvas.height / 2;
            }
        }
        const speed = ball.speed;
        const delta = 1; // this.delta * 0.01;
        x += speed * Math.cos(angle) * delta;
        y += speed * Math.sin(angle) * delta;
        privateBall.angle = angle;
        privateBall.x = x;
        privateBall.y = y;
    };
    const render = function (game) {
        const context = game.context;
        context.beginPath();
        // context.fillRect(ball.x, ball.y, ball.x + 20, ball.y + 20); // weird, size-changing rectangle
        context.ellipse(ball.x, ball.y, ball.radius, ball.radius, 0, 0, utils_1.MathUtils.TAU);
        context.fill();
    };
    const ball = {
        numBouncesText: options.numBouncesText,
        speedText: options.speedText,
        angleText: options.angleText,
        setNumBouncesText: setNumBouncesText,
        setSpeedText: setSpeedText,
        setAngleText: setAngleText,
        minBounceInterval: options.minBounceInterval,
        radius: options.radius(),
        // are set in reset()
        initialSpeed: 0,
        initialAngle: 0,
        x: 0,
        y: 0,
        speed: 0,
        angle: 0,
        lastXBounceTick: 0,
        lastYBounceTick: 0,
        numBounces: 0,
        update: update,
        render: render,
        reset: reset,
    };
    const privateBall = ball;
    return ball;
};
exports.newBouncingBallGame = function (options) {
    options = options || {};
    options.parent = options.parent || document.body;
    options.gameWidth = options.gameWidth || 500;
    options.gameHeight = options.gameHeight || 500;
    options.ballRadius = options.ballRadius || 50;
    const parent = options.parent.appendNewElement("center");
    const numBouncesText = parent.appendNewElement("h4");
    const angleText = parent.appendNewElement("h4");
    const speedText = parent.appendNewElement("h4");
    const canvasDiv = parent.appendNewElement("div");
    parent.appendBr();
    parent.appendBr();
    const stopButton = parent.appendButton("Pause");
    const resumeButton = parent.appendButton("Resume");
    const restartButton = parent.appendButton("Restart");
    const game = game_1.newGame()
        .name("Bouncing Ball")
        .newCanvas(canvasDiv)
        .size(options.gameWidth, options.gameHeight)
        .build();
    const ball = exports.newBouncingBall({
        numBouncesText: numBouncesText,
        speedText: speedText,
        angleText: angleText,
        minBounceInterval: 2,
        radius: () => options.ballRadius,
        initialSpeed: () => 25,
        initialAngle: () => utils_1.MathUtils.randomRange(-Math.PI, Math.PI),
    });
    const privateBall = ball;
    game.addActor(ball);
    game.startListener.click(resumeButton);
    game.stopListener.click(stopButton);
    game.restartListener.click(restartButton);
    const keyCodeToDeltaSpeed = function (keyCode) {
        switch (keyCode) {
            case 38:
                return 1;
            case 40:
                return -1;
            default:
                return 0;
        }
    };
    const keyCodeToDeltaAngle = function (keyCode) {
        switch (keyCode) {
            case 37:
                return -1;
            case 39:
                return 1;
            default:
                return 0;
        }
    };
    // change speed and angle
    window.addEventListener("keydown", function (e) {
        const deltaSpeed = keyCodeToDeltaSpeed(e.keyCode);
        privateBall.speed += deltaSpeed;
        if (deltaSpeed !== 0) {
            e.preventDefault();
        }
        ball.setSpeedText();
        const deltaAngle = ball.speed * utils_1.MathUtils.deg2rad(keyCodeToDeltaAngle(e.keyCode));
        privateBall.angle = (ball.angle + deltaAngle) % utils_1.MathUtils.TAU;
        if (deltaAngle !== 0) {
            e.preventDefault();
        }
        ball.setAngleText();
    });
    game.ball = ball;
    return game;
};
exports.runBouncingBallGame = function (options) {
    const game = exports.newBouncingBallGame(options);
    game.start();
    return game;
};
