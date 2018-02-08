/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(1);
exports.newListener = function (listenerCallback) {
    let listeners = [];
    const listener = function (listeners) {
        return function (e) {
            e.preventDefault();
            listenerCallback()(e);
            for (const listener of listeners) {
                listener(e);
            }
        };
    };
    const self = {
        then: function (nextListener) {
            if (utils_1.isFunction(nextListener)) {
                listeners.push(nextListener);
            }
            return this;
        },
        attachTo: function (target, type) {
            target.addEventListener(type, listener(listeners));
            listeners = [];
            return target;
        },
        click: function (target) {
            return self.attachTo(target, "click");
        },
    };
    return self;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MathUtils = {
    TAU: 2 * Math.PI,
    rad2deg: function (radians) {
        return radians * 180 / Math.PI;
    },
    deg2rad: function (degrees) {
        return degrees * Math.PI / 180;
    },
    randomRange: function (min, max) {
        return Math.random() * (max - min) + min;
    },
    angleToString: function (angle) {
        if (angle < 0) {
            angle += exports.MathUtils.TAU;
        }
        return exports.MathUtils.rad2deg(angle).toFixed(2) + "°";
    },
};
exports.isFunction = function (o) {
    return !!(o && o.constructor && o.call && o.apply);
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const listener_1 = __webpack_require__(0);
exports.newGame = function () {
    return (function () {
        const fields = {
            name: null,
            canvas: null,
            width: null,
            height: null,
        };
        const checkFieldsInitialized = function () {
            for (const field in fields) {
                if (fields.hasOwnProperty(field)) {
                    if (!fields[field]) {
                        throw new Error(field + " not set");
                    }
                }
            }
        };
        const builder = {
            name: function (name) {
                fields.name = name;
                return builder;
            },
            canvas: function (canvas) {
                fields.canvas = canvas;
                return builder;
            },
            newCanvas: function (canvasParent) {
                fields.canvas = document.createElement("canvas");
                canvasParent.appendChild(fields.canvas);
                return builder;
            },
            width: function (width) {
                fields.width = width;
                return builder;
            },
            height: function (height) {
                fields.height = height;
                return builder;
            },
            size: function (widthOrSize, height) {
                let width;
                if (height === undefined) {
                    const size = widthOrSize;
                    width = size.x;
                    height = size.y;
                }
                else {
                    width = widthOrSize;
                }
                return builder.width(width).height(height);
            },
            build: function () {
                checkFieldsInitialized();
                const canvas = fields.canvas;
                const context = canvas.getContext("2d");
                const parent = canvas.parentElement;
                canvas.width = fields.width;
                canvas.height = fields.height;
                const actors = [];
                canvas.style.border = "1px solid black";
                const game = {
                    name: fields.name,
                    canvas: canvas,
                    context: context,
                    parent: parent,
                    tick: 0,
                    time: null,
                    delta: 0,
                    prevId: null,
                    clearFrame: true,
                    clear: function () {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                    },
                    start: function () {
                        resume(true);
                        return game;
                    },
                    stop: function () {
                        window.cancelAnimationFrame(game.prevId);
                        frame.prevId = null;
                        frame.time = null;
                    },
                    resume: function () {
                        resume(false);
                    },
                    reset: function () {
                        actors.forEach(actor => actor.reset(game));
                    },
                    restart: function () {
                        game.stop();
                        game.reset();
                        game.start();
                    },
                    startListener: listener_1.newListener(() => game.start),
                    stopListener: listener_1.newListener(() => game.stop),
                    resumeListener: listener_1.newListener(() => game.resume),
                    resetListener: listener_1.newListener(() => game.reset),
                    restartListener: listener_1.newListener(() => game.restart),
                    actors: actors,
                    addActor: function (actor) {
                        actors.push(actor);
                        const privateGame = actor;
                        privateGame.game = game;
                        privateGame.id = actors.length;
                        privateGame.remove = function () {
                            this.game.removeActor(this);
                        };
                    },
                    removeActor: function (actor) {
                        actors.splice(actor.id, 1);
                        const privateGame = actor;
                        privateGame.game = null;
                        privateGame.id = null;
                    },
                };
                const frame = game;
                const update = function (game) {
                    actors.forEach(actor => actor.update(game));
                };
                const render = function (game) {
                    if (game.clearFrame) {
                        game.clear();
                    }
                    actors.forEach(actor => actor.render(game));
                };
                const gameLoop = function (time) {
                    frame.tick++;
                    frame.delta = game.time === null ? 0 : time - game.time;
                    frame.time = time;
                    update(game);
                    render(game);
                    frame.prevId = window.requestAnimationFrame(gameLoop);
                };
                const resume = function (reset) {
                    if (reset) {
                        game.reset();
                    }
                    if (!frame.prevId) {
                        // if not already stopped
                        frame.prevId = window.requestAnimationFrame(gameLoop);
                        console.log("starting");
                    }
                };
                return game;
            },
        };
        return builder;
    }).call({});
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.keyCodeToDeltaSpeed = function (keyCode) {
    switch (keyCode) {
        case 38:
            return 1;
        case 40:
            return -1;
        default:
            return 0;
    }
};
exports.keyCodeToDeltaAngle = function (keyCode) {
    switch (keyCode) {
        case 37:
            return -1;
        case 39:
            return 1;
        default:
            return 0;
    }
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(5)
Object.defineProperty(exports, "__esModule", { value: true });
const animations_1 = __webpack_require__(6);
(function () {
    animations_1.run(animations_1.AnimationIndex.EXPANDING_BALL_GAME);
})();


/***/ }),
/* 5 */
/***/ (function(module, exports) {

HTMLElement.prototype.appendNewElement = function (tagName) {
    return this.appendChild(document.createElement(tagName));
};
HTMLElement.prototype.appendDiv = function () {
    return this.appendNewElement("div");
};
HTMLElement.prototype.appendButton = function (buttonText) {
    const button = this.appendNewElement("button");
    button.innerText = buttonText;
    return button;
};
HTMLElement.prototype.appendBr = function () {
    return this.appendNewElement("br");
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bouncingBall_1 = __webpack_require__(7);
const expandingBall_1 = __webpack_require__(8);
const listener_1 = __webpack_require__(0);
var AnimationIndex;
(function (AnimationIndex) {
    AnimationIndex[AnimationIndex["EXPANDING_BALL_GAME"] = 0] = "EXPANDING_BALL_GAME";
    AnimationIndex[AnimationIndex["BOUNCING_BALL_GAME"] = 1] = "BOUNCING_BALL_GAME";
    AnimationIndex[AnimationIndex["DVD_PLAYER_SCREEN_SAVER"] = 2] = "DVD_PLAYER_SCREEN_SAVER";
    AnimationIndex[AnimationIndex["NUM_ANIMATIONS"] = 3] = "NUM_ANIMATIONS";
})(AnimationIndex = exports.AnimationIndex || (exports.AnimationIndex = {}));
const checkAnimationIndex = function (animationIndex) {
    if (animationIndex === AnimationIndex.NUM_ANIMATIONS) {
        throw new Error("animationIndex can't be NUM_ANIMATIONS");
    }
};
const renderImageAsBall = function (imageFile) {
    return function (game, ball) {
        game.context.fillText(ball.x + ", " + ball.y, game.canvas.width / 2, game.canvas.height / 2);
    };
};
const newBouncingImageGame = function (parent, imageFile) {
    return bouncingBall_1.newBouncingBallGame({
        parent: parent,
        gameWidth: 500,
        gameHeight: 500,
        ballRadius: 50,
        ballRenderer: renderImageAsBall(imageFile),
    });
};
const newAnimationGame = function (animationIndex, parent) {
    switch (animationIndex) {
        case AnimationIndex.NUM_ANIMATIONS:
            checkAnimationIndex(animationIndex);
            return null;
        case AnimationIndex.EXPANDING_BALL_GAME:
            return expandingBall_1.newExpandingBallGame({
                parent: parent,
                gameWidth: 500,
                gameHeight: 500,
                initialBallRadius: 50,
                initialBallRadiusSpeed: 1,
            });
        case AnimationIndex.BOUNCING_BALL_GAME:
            return bouncingBall_1.newBouncingBallGame({
                parent: parent,
                gameWidth: 500,
                gameHeight: 500,
                ballRadius: 50,
            });
        case AnimationIndex.DVD_PLAYER_SCREEN_SAVER:
            return newBouncingImageGame(parent, "resources/dvdPlayer.png");
    }
};
const newAnimation = function (animationIndex) {
    const div = document.body.appendDiv();
    div.hidden = true;
    return {
        index: animationIndex,
        div: div,
        game: newAnimationGame(animationIndex, div),
    };
};
exports.run = function (animationIndex) {
    checkAnimationIndex(animationIndex);
    const parent = document.body.appendNewElement("center");
    parent.appendBr();
    const switchAnimationButton = parent.appendButton("Switch Animation");
    const animationName = parent.appendNewElement("h3");
    const animations = new Array(AnimationIndex.NUM_ANIMATIONS)
        .fill(null)
        .map((e, i) => newAnimation(i));
    parent.appendBr();
    const switchAnimation = function () {
        animations[animationIndex].div.hidden = true; // hide last one
        animationIndex = (animationIndex + 1) % animations.length; // switch to next
        const animation = animations[animationIndex];
        animation.div.hidden = false; // show new one
        animationName.innerText = animation.game.name;
    };
    animationIndex = (animationIndex + animations.length - 1) % animations.length; // decrease to start with correct one
    switchAnimation();
    listener_1.newListener(() => switchAnimation).click(switchAnimationButton);
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __webpack_require__(2);
const utils_1 = __webpack_require__(1);
const keys_1 = __webpack_require__(3);
exports.newBouncingBall = function (options) {
    if (!options.minBounceInterval) {
        options.minBounceInterval = 2; // default
    }
    const setNumBouncesText = function (numBounces = ball.numBounces) {
        ball.numBouncesText.innerText = "Number of Bounces: " + numBounces;
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
        privateBall.lastXBounceTick = 0;
        privateBall.lastYBounceTick = 0;
        privateBall.numBounces = 0;
        setAngleText();
        setSpeedText();
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
            privateBall.lastXBounceTick = game.tick;
        }
        else if (game.tick - ball.lastYBounceTick > ball.minBounceInterval && yBounce) {
            angle = -angle;
            privateBall.lastYBounceTick = game.tick;
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
    const ballRenderer = options.render;
    const delegateRender = function (game) {
        ballRenderer(game, ball);
    };
    const ownRender = function (game) {
        const context = game.context;
        context.beginPath();
        // context.fillRect(ball.x, ball.y, ball.x + 20, ball.y + 20); // weird, size-changing rectangle
        context.ellipse(ball.x, ball.y, ball.radius, ball.radius, 0, 0, utils_1.MathUtils.TAU);
        context.fill();
    };
    const render = options.render ? delegateRender : ownRender;
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
    parent.appendNewElement("h4").innerText = "Use UP and DOWN arrow keys to change the velocity of the ball.";
    parent.appendNewElement("h4").innerText = "Use LEFT and RIGHT arrow keys to change the angle of the ball.";
    const numBouncesText = parent.appendNewElement("h4");
    const angleText = parent.appendNewElement("h4");
    const speedText = parent.appendNewElement("h4");
    const canvasDiv = parent.appendNewElement("div");
    parent.appendBr();
    parent.appendBr();
    const startButton = parent.appendButton("Start");
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
        render: options.ballRenderer,
    });
    const privateBall = ball;
    game.addActor(ball);
    game.startListener.click(startButton);
    game.resumeListener.click(resumeButton);
    game.stopListener.click(stopButton);
    game.restartListener.click(restartButton);
    // change speed and angle
    window.addEventListener("keydown", function (e) {
        const deltaSpeed = keys_1.keyCodeToDeltaSpeed(e.keyCode);
        privateBall.speed += deltaSpeed;
        if (deltaSpeed !== 0) {
            e.preventDefault();
        }
        ball.setSpeedText();
        const deltaAngle = ball.speed * utils_1.MathUtils.deg2rad(keys_1.keyCodeToDeltaAngle(e.keyCode));
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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __webpack_require__(2);
const utils_1 = __webpack_require__(1);
const listener_1 = __webpack_require__(0);
const keys_1 = __webpack_require__(3);
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


/***/ })
/******/ ]);