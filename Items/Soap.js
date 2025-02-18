import {Item} from './Item.js';

export class Soap extends Item{
    constructor() {
        super(0, 0, 0, 50, 0, 10);
    }

    getDescriptor(){
        return `Augmente votre vie de ${super.getIncreaseLife()}%`;
    }
}