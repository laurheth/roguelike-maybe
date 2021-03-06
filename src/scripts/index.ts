// Import styles
import '../styles/style.scss';
// Import the toolkit
import * as Toolkit from './toolkit/toolkit';

// Important imports
import { Actor } from './actors/Actor';
import { Player } from './actors/Player';
import { Map } from './map/Map';
import { Messenger } from './messages/Messenger';
import { NameGen } from './actors/nameGen';

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

    /** Name generator */
    nameGen: NameGen;

    /** Stop play? */
    stop: boolean;

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

        // Name generator
        this.nameGen = new NameGen(this.random);

        // Initialize the messenger
        this.messenger = new Messenger(this.messageContainer);

        // Create the player
        this.player = new Player(this.messenger, this.sideBar);

        this.stop=false;

        // Setup some interface listeners
        this.interfaceStuff();

        // Generate the map
        this.map = new Map({
            width: 40,
            height: 40,
        }, this.display, this.random, this.player,this.messenger,this.eventManager, this.nameGen);

        this.map.drawMap();
    }

    async play() {
        while (this.player.alive && !this.stop) {
            await this.eventManager.advance();
        }
        this.stop=false;
    }

    /** Set up some interface stuff */
    interfaceStuff() {
        // About Modal
        const aboutButton = document.querySelector('#showAbout');
        const aboutModal = document.querySelector('#aboutModal');
        const closeAboutModal = document.querySelector('#aboutModal button');

        // Open about
        aboutButton.addEventListener('click',(e)=>{
            e.preventDefault();
            aboutModal.classList.add('open');
        });

        // Close about
        closeAboutModal.addEventListener('click',(e)=>{
            e.preventDefault();
            aboutModal.classList.remove('open');
        });

        // Sidebar
        let isOpen=false;
        const toggleSidebar = document.querySelector('#openSidebar');
        const sideBarElement = document.querySelector('#sideBar');
        toggleSidebar.addEventListener('click',(e)=>{
            e.preventDefault();
            if (!isOpen) {
                isOpen=true;
                toggleSidebar.classList.add('clicked');
                sideBarElement.classList.add('open');
            } else {
                isOpen=false;
                toggleSidebar.classList.remove('clicked');
                sideBarElement.classList.remove('open');
            }
        });
    }
}

const game = new Game();

/** Resume play */
export const play = async ()=>await game.play();

/** Stop play */
export const stopPlay = ()=>game.stop=true;