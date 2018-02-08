import {Actor, Game, GameRenderer, GameUpdater, newGame} from "./game";
import {MathUtils} from "./utils";
import {newListener} from "./listener";
import {keyCodeToDeltaAngle, keyCodeToDeltaSpeed} from "./keys";
import {Ball, BallRenderer} from "./ball";

export interface ExpandingBallOptions {
    
    initialRadius: number,
    initialRadiusSpeed: number,
    
    render?: GameRenderer;
    
}

interface PrivateExpandingBall {
    
    radius: number;
    radiusSpeed: number;
    x: number;
    y: number;
    
}

export interface ExpandingBall extends Ball {
    
    readonly initialRadius: number;
    readonly initialRadiusSpeed: number;
    
    readonly radius: number;
    readonly radiusSpeed: number;
    
    onRadiusSpeedReversal?: () => any;
    
}

export const newExpandingBall = function(options: ExpandingBallOptions): ExpandingBall {
    
    const reset = function(game: Game): void {
        privateBall.radius = ball.initialRadius;
        privateBall.radiusSpeed = ball.initialRadiusSpeed;
        privateBall.x = game.canvas.width / 2;
        privateBall.y = game.canvas.height / 2;
    };
    
    const reverseRadiusSpeed = function(direction: number) {
        privateBall.radiusSpeed = direction * Math.abs(ball.radiusSpeed);
        if (ball.onRadiusSpeedReversal) {
            ball.onRadiusSpeedReversal();
        }
    };
    
    const update: GameUpdater = function(game: Game): void {
        // console.log(ball.radius);
        let radius: number = ball.radius;
        radius += ball.radiusSpeed; // * game.delta * 0.001;
        if (radius < 0) {
            radius = 0;
            reverseRadiusSpeed(1);
        } else if (2 * radius > game.canvas.width || 2 * radius > game.canvas.height) {
            reverseRadiusSpeed(-1);
        }
        privateBall.radius = radius;
    };
    
    const ballRenderer: BallRenderer = options.render;
    
    const delegateRender: GameRenderer = function(game: Game): void {
        ballRenderer(game, ball);
    };
    
    const ownRender: GameRenderer = function(game: Game): void {
        game.context.beginPath();
        game.context.ellipse(ball.x, ball.y, ball.radius, ball.radius, 0, 0, MathUtils.TAU);
        game.context.fill();
    };
    
    const render: GameRenderer = options.render ? delegateRender : ownRender;
    
    const ball: ExpandingBall = {
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
    
    const privateBall: PrivateExpandingBall = ball;
    
    return ball;
    
};

export interface ExpandingBallGameOptions {
    
    parent: HTMLElement;
    
    gameWidth: number;
    gameHeight: number;
    
    initialBallRadius: number;
    initialBallRadiusSpeed: number;
    
    ballRenderer?: GameRenderer;
    
}

export interface ExpandingBallGame extends Game {
    
    readonly ball: ExpandingBall;
    
}

export const newExpandingBallGame = function(options: ExpandingBallGameOptions): ExpandingBallGame {
    
    const parent = options.parent.appendNewElement("center");
    
    parent.appendNewElement("h4").innerText = "Use UP and DOWN arrow keys to change the speed of the radius.";
    
    const canvasDiv: HTMLDivElement = parent.appendNewElement("div");
    
    parent.appendBr();
    
    const startButton: HTMLButtonElement = parent.appendButton("I’m an Animaniac!");
    const stopButton: HTMLButtonElement = parent.appendButton("STOP");
    const resumeButton: HTMLButtonElement = parent.appendButton("Resume");
    const reverseDirectionButton: HTMLButtonElement = parent.appendButton("Reverse Direction");
    const resetButton: HTMLButtonElement = parent.appendButton("Reset");
    
    const game: Game = newGame()
        .name("Expanding Ball")
        .newCanvas(canvasDiv)
        .size(options.gameWidth, options.gameHeight)
        .build();
    
    const ball: ExpandingBall = newExpandingBall({
        initialRadius: options.initialBallRadius,
        initialRadiusSpeed: options.initialBallRadiusSpeed,
        render: options.ballRenderer,
    });
    
    const updateReverseDirectionButtonText = function() {
        reverseDirectionButton.innerText =
            ball.radiusSpeed === 0
                ? "Reverse Direction"
                : ball.radiusSpeed < 0
                ? "Grow" : "Shrink";
    };
    
    ball.onRadiusSpeedReversal = updateReverseDirectionButtonText;
    
    const privateBall: PrivateExpandingBall = ball;
    
    game.addActor(ball);
    
    game.startListener.click(startButton);
    game.stopListener.click(stopButton);
    game.resumeListener.click(resumeButton);
    game.restartListener.click(resetButton);
    
    newListener(() => () => {
        console.log("reversing");
        privateBall.radiusSpeed *= -1;
        updateReverseDirectionButtonText();
    }).click(reverseDirectionButton);
    
    updateReverseDirectionButtonText();
    
    // change speed
    window.addEventListener("keydown", function(e: KeyboardEvent) {
        const deltaSpeed: number = keyCodeToDeltaSpeed(e.keyCode);
        privateBall.radiusSpeed += Math.sign(ball.radiusSpeed) * deltaSpeed;
        if (ball.radiusSpeed === 0) {
            privateBall.radiusSpeed += deltaSpeed;
        }
        if (deltaSpeed !== 0) {
            e.preventDefault();
        }
    });
    
    (<any> game).ball = ball;
    return <ExpandingBallGame> game;
};