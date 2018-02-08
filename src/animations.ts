import {Game} from "./game";
import {BouncingBallGame, newBouncingBallGame} from "./bouncingBall";
import {ExpandingBallGame, newExpandingBall, newExpandingBallGame} from "./expandingBall";
import {newListener} from "./listener";

export enum AnimationIndex {
    
    EXPANDING_BALL_GAME = 0,
    BOUNCING_BALL_GAME,
    NUM_ANIMATIONS,
    
}

interface Animation {
    
    readonly index: AnimationIndex,
    readonly div: HTMLDivElement,
    readonly game: Game,
    
}

const checkAnimationIndex = function(animationIndex: AnimationIndex): void {
    if (animationIndex === AnimationIndex.NUM_ANIMATIONS) {
        throw new Error("animationIndex can't be NUM_ANIMATIONS");
    }
};

const newAnimationGame = function(animationIndex: AnimationIndex, parent: HTMLElement): Game {
    switch (animationIndex) {
        case AnimationIndex.NUM_ANIMATIONS:
            checkAnimationIndex(animationIndex);
            return null;
        case AnimationIndex.EXPANDING_BALL_GAME:
            return newExpandingBallGame({
                parent: parent,
                gameWidth: 500,
                gameHeight: 500,
                initialBallRadius: 50,
                initialBallRadiusSpeed: 1,
            });
        case AnimationIndex.BOUNCING_BALL_GAME:
            return newBouncingBallGame({
                parent: parent,
                gameWidth: 500,
                gameHeight: 500,
                ballRadius: 50,
            });
    }
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

export const run = function(animationIndex: AnimationIndex = AnimationIndex.EXPANDING_BALL_GAME): void {
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
        animation.div.hidden = false; // show new one
        animationName.innerText = animation.game.name;
    };
    
    animationIndex = (animationIndex + animations.length - 1) % animations.length; // decrease to start with correct one
    switchAnimation();
    
    newListener(() => switchAnimation).click(switchAnimationButton);
    
};