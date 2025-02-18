import { Item } from './Item.js';

export class BubbleBlaster extends Item {
    constructor() {
        super(0, 0, 50, 0, 0, 10);
    }

    getDescriptor() {
        return `Augmente vos dégâts de ${super.getIncreaseDamage()}%`;
    }
}