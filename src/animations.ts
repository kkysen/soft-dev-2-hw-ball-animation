import {Game, GameRenderer} from "./game";
import {BouncingBallGame, newBouncingBallGame} from "./bouncingBall";
import {ExpandingBallGame, newExpandingBall, newExpandingBallGame} from "./expandingBall";
import {newListener} from "./listener";
import {Ball, BallRenderer} from "./ball";

export enum AnimationIndex {
    
    EXPANDING_BALL = 0,
    BOUNCING_BALL,
    BOUNCING_BALLS,
    BOUNCING_KIRAN,
    DVD_PLAYER_SCREEN_SAVER,
    NUM_ANIMATIONS,
    
}

interface Animation {
    
    readonly index: AnimationIndex,
    readonly div: HTMLDivElement,
    readonly game: Promise<Game>,
    
}

const checkAnimationIndex = function(animationIndex: AnimationIndex): void {
    if (animationIndex === AnimationIndex.NUM_ANIMATIONS) {
        throw new Error("animationIndex can't be NUM_ANIMATIONS");
    }
};

const renderImageAsBall = function(image: ImageBitmap): BallRenderer {
    
    return function(game: Game, ball: Ball) {
        game.context.drawImage(image,
            ball.x - ball.radiusX, ball.y - ball.radiusY,
            ball.radiusX * 2, ball.radiusY * 2);
    };
    
};

const newBouncingImageGame = function(parent: HTMLElement, imageFile: string, name: string = "Bouncing Image"): Promise<BouncingBallGame> {
    
    const maxWidth: number = 250;
    const maxHeight: number = 250;
    
    const img: HTMLImageElement = new Image();
    img.src = imageFile;
    return new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = (e) => reject({
            reason: "Unable to load image \"" + imageFile + "\"",
            event: e,
        });
    })
        .then(img => createImageBitmap(img))
        .then(img => {
            const scale: number = 0.5 * Math.min(1, maxWidth / img.width, maxHeight / img.height);
            console.log(img);
            console.log(scale);
            return newBouncingBallGame({
                name: name,
                parent: parent,
                gameWidth: 500,
                gameHeight: 500,
                ballRadiusX: img.width * scale,
                ballRadiusY: img.height * scale,
                initialBallSpeed: 10,
                ballRenderer: renderImageAsBall(img),
            });
        });
};

const newBouncingKiranGame = function(parent: HTMLElement) {
    const fileName: string = "resources/JumpingKiran.png";
    const name: string = "Jumping Kiran";
    return newBouncingImageGame(parent, fileName, name);
};

const newDVDPlayerScreenSaver = function(parent: HTMLElement) {
    const fileName: string = "resources/DVDPlayerLogo.jpg";
    const name: string = "DVD Player Screen Saver";
    return newBouncingImageGame(parent, fileName, name).then(game => {
        game.start.button.innerText = "I'm waiting for the movie to start";
        game.stop.button.innerText = "STOP";
        return game;
    });
};

const newAnimationGameUnchecked = function(animationIndex: AnimationIndex, parent: HTMLElement): Promise<Game> {
    switch (animationIndex) {
        case AnimationIndex.NUM_ANIMATIONS:
            checkAnimationIndex(animationIndex);
            return null;
        case AnimationIndex.EXPANDING_BALL:
            return Promise.resolve(newExpandingBallGame({
                parent: parent,
                gameWidth: 500,
                gameHeight: 500,
                initialBallRadius: 50,
                initialBallRadiusSpeed: 1,
            }));
        case AnimationIndex.BOUNCING_BALL:
            return Promise.resolve(newBouncingBallGame({
                parent: parent,
                gameWidth: 500,
                gameHeight: 500,
                ballRadiusX: 50,
                ballRadiusY: 50,
                initialBallSpeed: 25,
            }));
        case AnimationIndex.BOUNCING_BALLS:
            const game: BouncingBallGame = newBouncingBallGame({
                name: "Bouncing Balls",
                parent: parent,
                gameWidth: 500,
                gameHeight: 500,
                ballRadiusX: 10,
                ballRadiusY: 10,
                initialBallSpeed: 15,
                numBalls: 10,
            });
            // game.ball.render = ;
            return Promise.resolve(game);
        case AnimationIndex.BOUNCING_KIRAN:
            return newBouncingKiranGame(parent);
        case AnimationIndex.DVD_PLAYER_SCREEN_SAVER:
            return newDVDPlayerScreenSaver(parent);
    }
};

const newAnimationGame = function(animationIndex: AnimationIndex, parent: HTMLElement): Promise<Game> {
    return new Promise<Game>(resolve => {
        newAnimationGameUnchecked(animationIndex, parent)
            .then(resolve)
            .catch(error => {
                console.log(error);
                resolve(null);
            });
    });
};

const newAnimation = function(animationIndex: AnimationIndex): Animation {
    const div: HTMLDivElement = document.body.appendDiv();
    div.hidden = true;
    return {
        index: animationIndex,
        div: div,
        game: newAnimationGame(animationIndex, div),
    };
};

export const run = function(animationIndex: AnimationIndex): void {
    checkAnimationIndex(animationIndex);
    
    const parent: HTMLElement = document.body.appendNewElement("center");
    
    parent.appendBr();
    const switchAnimationButton: HTMLButtonElement = parent.appendButton("Switch Animation");
    const animationName: HTMLHeadingElement = parent.appendNewElement("h3");
    
    const animations: Animation[] =
        new Array(AnimationIndex.NUM_ANIMATIONS)
            .fill(null)
            .map((e, i) => newAnimation(i));
    
    parent.appendBr();
    
    const switchAnimation = function() {
        animations[animationIndex].div.hidden = true; // hide last one
        animationIndex = (animationIndex + 1) % animations.length; // switch to next
        const animation: Animation = animations[animationIndex];
        console.log("switching to:", animation);
        animation.div.hidden = false; // show new one
        animation.game.then(game => {
            if (!game) {
                // if this game wasn't loaded, skip to next
                switchAnimation();
                return;
            }
            animationName.innerText = game.name;
        });
    };
    
    animationIndex = (animationIndex + animations.length - 1) % animations.length; // decrease to start with correct one
    switchAnimation();
    
    newListener(switchAnimation).click(switchAnimationButton);
};
