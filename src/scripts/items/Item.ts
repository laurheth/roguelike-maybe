import { ActorAction } from '../actors/ActorInterfaces';
import { Actor } from '../actors/Actor';
import { Player } from '../actors/Player';
import { Map } from '../map/Map';

/** Item for the player to pick up and use */
export class Item {
    private player: Player;
    private tags:Array<string>;
    private action:ActorAction;
    public uses:number;
    readonly name:string;
    readonly map:Map;
    private finishedString:string;

    constructor(name:string, tags:string|Array<string>, map:Map, uses?:number,finishedString?:string, action?:ActorAction, ) {
        if (typeof tags === "string") {
            tags=[tags];
        }
        this.map=map;
        this.tags=tags;
        this.action=action;
        this.uses=(typeof uses !== "undefined") ? uses : Infinity;
        this.name=name;
        this.finishedString=finishedString;
    }

    getTags():Array<string> {
        return this.tags;
    }

    pickUp(player:Actor) {
        if (player instanceof Player) {
            this.player=player;
            if (this.action && !this.player.hasItem(this)) {
                this.player.addActionOn(this.action);
            }
            this.player.addInventory(this);
        }
    }

    /** Spend a use */
    use() {
        this.uses--;
        if (this.uses<=0) {
            if (this.action) {
                this.player.removeActionOn(this.action);
            }
            this.player.removeInventory(this);
            this.map.messenger.addMessage({
                message:this.finishedString,
                importance:3
            })
        }
    }
}