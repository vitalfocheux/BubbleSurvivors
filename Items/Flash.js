import { Item } from './Item.js';

export class Flash extends Item {
    constructor() {
        super(0, 0, 0, 0, 80, 100);
    }

    getDescriptor() {
        return `Augmente vos dégâts de ${super.getDecreaseCooldown()}%`;
    }
}