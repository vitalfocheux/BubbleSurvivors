import { Item } from './Item.js';

export class BubbleBlaster extends Item {
    constructor() {
        super(0, 0, 5, 0, 0, 5);
    }

    getDescriptor() {
        return `Augmente vos dégâts de ${super.getIncreaseDamage()}%`;
    }
}