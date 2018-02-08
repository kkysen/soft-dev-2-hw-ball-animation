import {Actor, Game} from "./game";

export interface Ball extends Actor {
    
    readonly x: number;
    readonly y: number;
    
}

export interface BallRenderer {
    
    (game: Game, ball: Ball): void;
    
}