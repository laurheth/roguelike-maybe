// Import styles
import '../styles/style.scss';
// Import the toolkit
import * as Toolkit from './toolkit/toolkit';

// Important imports
import { Actor } from './actors/Actor';
import { Player } from './actors/Player';
import { Map } from './map/Map';
import { Messenger } from './messages/Messenger';

/** Main Game Object */
class Game {
    /** Element holding the display */
    displayContainer: HTMLDivElement;
    /** Element where messages will be displayed */
    messageContainer: HTMLDivElement;
    /** Element used as the sidebar, for HP / name / etc */
    sideBar: HTMLDivElement;

    /** Main display object */
    display: Toolkit.Display;

    /** Main event scheduler */
    eventManager: Toolkit.EventManager;

    /** Random number generator */
    random: Toolkit.Random;

    /** Player character */
    player: Player;

    /** Map */
    map: Map;

    /** Messenger */
    messenger: Messenger;

    constructor() {
        // Select the important sections
        this.displayContainer = document.querySelector('#displayContainer');
        this.messageContainer = document.querySelector('#messages');
        this.sideBar = document.querySelector('#sideBar');

        // Create a new display object
        this.display = new Toolkit.Display({target: this.displayContainer, tileWidth:20});
        
        // Initialize the event manager
        this.eventManager = new Toolkit.EventManager({type:"complex"})

        // Initialize the prng.
        this.random = new Toolkit.Random();

        // Initialize the messenger
        this.messenger = new Messenger(this.messageContainer);

        // Create the player
        this.player = new Player();

        // Generate the map
        this.map = new Map({
            width: 30,
            height: 30,
        }, this.display, this.random, this.player);

        this.map.drawMap();

        this.eventManager.add({actor:this.player});

        // this.play();
    }

    async play() {
        for(let i=0;i<30;i++) {
            this.map.drawMap();
            await this.eventManager.advance();
        }
    }
}

const game = new Game();

export default game;