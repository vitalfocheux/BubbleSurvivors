import { Item } from './Item.js';

export class Boots extends Item {
    constructor() {
        super(1.2, 0, 0, 0, 0, 40);
    }

    getDescriptor() {
        return `Multiplie votre vitesse par ${super.getIncreaseSpeed()}`;
    }
}