import {Game, GameRenderer, GameUpdater, newGame, Vector} from "./game";
import {MathUtils} from "./utils";
import {keyCodeToDeltaAngle, keyCodeToDeltaSpeed} from "./keys";
import {Ball, BallRenderer} from "./ball";

export interface BouncingBallOptions {
    
    numBouncesText: HTMLElement;
    speedText: HTMLElement;
    angleText: HTMLElement;
    minBounceInterval?: number;
    radius: () => number;
    initialSpeed: () => number;
    initialAngle: () => number;
    
    render?: BallRenderer;
    
}

interface PrivateBouncingBall {
    
    initialSpeed: number;
    initialAngle: number;
    
    x: number;
    y: number;
    
    speed: number;
    angle: number;
    
    lastXBounceTick: number;
    lastYBounceTick: number;
    numBounces: number;
    
}

export interface BouncingBall extends Ball {
    
    readonly numBouncesText: HTMLElement;
    readonly speedText: HTMLElement;
    readonly angleText: HTMLElement;
    
    setNumBouncesText(numBounces?: number): void;
    setSpeedText(speed?: number): void;
    setAngleText(angle?: number): void;
    
    readonly minBounceInterval: number;
    
    readonly radius: number;
    
    readonly initialSpeed: number;
    readonly initialAngle: number;
    
    readonly speed: number;
    readonly angle: number;
    
    readonly lastXBounceTick: number;
    readonly lastYBounceTick: number;
    readonly numBounces: number;
    
}

export const newBouncingBall = function(options: BouncingBallOptions): BouncingBall {
    if (!options.minBounceInterval) {
        options.minBounceInterval = 2; // default
    }
    
    const setNumBouncesText = function(numBounces: number = ball.numBounces): void {
        ball.numBouncesText.innerText = "Number of Bounces: " + numBounces;
    };
    
    const setAngleText = function(angle: number = ball.angle): void {
        ball.angleText.innerText = "Angle: " + MathUtils.angleToString(angle);
    };
    
    const setSpeedText = function(speed: number = ball.speed): void {
        ball.speedText.innerText = "Speed: " + speed;
    };
    
    const reset = function(game: Game): void {
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
        
        console.log("Initial Angle: " + MathUtils.angleToString(ball.initialAngle));
    };
    
    const update: GameUpdater = function(game: Game): void {
        const canvas: HTMLCanvasElement = game.canvas;
        const radius: number = ball.radius;
        let x: number = ball.x;
        let y: number = ball.y;
        let angle: number = ball.angle;
        const xBounce = x < radius || x > canvas.width - radius;
        const yBounce = y < radius || y > canvas.height - radius;
        if (game.tick - ball.lastXBounceTick > ball.minBounceInterval && xBounce) {
            angle = -(Math.PI + angle) % MathUtils.TAU;
            privateBall.lastXBounceTick = game.tick;
        } else if (game.tick - ball.lastYBounceTick > ball.minBounceInterval && yBounce) {
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
        
        const speed: number = ball.speed;
        const delta: number = 1; // this.delta * 0.01;
        x += speed * Math.cos(angle) * delta;
        y += speed * Math.sin(angle) * delta;
        
        privateBall.angle = angle;
        privateBall.x = x;
        privateBall.y = y;
    };
    
    const ballRenderer: BallRenderer = options.render;
    
    const delegateRender: GameRenderer = function(game: Game): void {
        ballRenderer(game, ball);
    };
    
    const ownRender: GameRenderer = function(game: Game): void {
        const context: CanvasRenderingContext2D = game.context;
        context.beginPath();
        // context.fillRect(ball.x, ball.y, ball.x + 20, ball.y + 20); // weird, size-changing rectangle
        context.ellipse(ball.x, ball.y, ball.radius, ball.radius, 0, 0, MathUtils.TAU);
        context.fill();
    };
    
    const render: GameRenderer = options.render ? delegateRender : ownRender;
    
    const ball: BouncingBall = {
        
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
    
    const privateBall: PrivateBouncingBall = ball;
    
    return ball;
};

export interface BouncingBallGameOptions {
    
    parent?: HTMLElement;
    
    gameWidth?: number;
    gameHeight?: number;
    
    ballRadius?: number;
    
    ballRenderer?: BallRenderer;
    
}

export interface BouncingBallGame extends Game {

    readonly ball: BouncingBall;
    
}

export const newBouncingBallGame = function(options?: BouncingBallGameOptions): BouncingBallGame {
    
    options = options || {};
    options.parent = options.parent || document.body;
    options.gameWidth = options.gameWidth || 500;
    options.gameHeight = options.gameHeight || 500;
    options.ballRadius = options.ballRadius || 50;
    
    const parent = options.parent.appendNewElement("center");
    
    parent.appendNewElement("h4").innerText = "Use UP and DOWN arrow keys to change the velocity of the ball.";
    parent.appendNewElement("h4").innerText = "Use LEFT and RIGHT arrow keys to change the angle of the ball.";
    
    const numBouncesText: HTMLHeadingElement = parent.appendNewElement("h4");
    const angleText: HTMLHeadingElement = parent.appendNewElement("h4");
    const speedText: HTMLHeadingElement = parent.appendNewElement("h4");
    
    const canvasDiv: HTMLDivElement = parent.appendNewElement("div");
    
    parent.appendBr();
    parent.appendBr();
    
    const startButton: HTMLButtonElement = parent.appendButton("Start");
    const stopButton: HTMLButtonElement = parent.appendButton("Pause");
    const resumeButton: HTMLButtonElement = parent.appendButton("Resume");
    const restartButton: HTMLButtonElement = parent.appendButton("Restart");
    
    const game: Game = newGame()
        .name("Bouncing Ball")
        .newCanvas(canvasDiv)
        .size(options.gameWidth, options.gameHeight)
        .build();
    
    const ball: BouncingBall = newBouncingBall({
        numBouncesText: numBouncesText,
        speedText: speedText,
        angleText: angleText,
        
        minBounceInterval: 2,
        radius: () => options.ballRadius,
        
        initialSpeed: () => 25,
        initialAngle: () => MathUtils.randomRange(-Math.PI, Math.PI),
        
        render: options.ballRenderer,
    });
    
    const privateBall: PrivateBouncingBall = ball;
    
    game.addActor(ball);
    
    game.startListener.click(startButton);
    game.resumeListener.click(resumeButton);
    game.stopListener.click(stopButton);
    game.restartListener.click(restartButton);
    
    // change speed and angle
    window.addEventListener("keydown", function(e: KeyboardEvent) {
        const deltaSpeed: number = keyCodeToDeltaSpeed(e.keyCode);
        privateBall.speed += deltaSpeed;
        if (deltaSpeed !== 0) {
            e.preventDefault();
        }
        ball.setSpeedText();
        
        const deltaAngle: number = ball.speed * MathUtils.deg2rad(keyCodeToDeltaAngle(e.keyCode));
        privateBall.angle = (ball.angle + deltaAngle) % MathUtils.TAU;
        if (deltaAngle !== 0) {
            e.preventDefault();
        }
        ball.setAngleText();
    });
    
    (<any> game).ball = ball;
    return <BouncingBallGame> game;
};

export const runBouncingBallGame = function(options?: BouncingBallGameOptions): BouncingBallGame {
    const game: BouncingBallGame = newBouncingBallGame(options);
    game.start();
    return game;
};