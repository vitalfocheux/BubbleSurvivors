import { Item } from './Item.js';

export class Boots extends Item {
    constructor() {
        super(1.2, 0, 0, 0, 0, 10);
    }

    getDescriptor() {
        return `Multiplie votre vitesse par ${super.getIncreaseSpeed()}`;
    }
}