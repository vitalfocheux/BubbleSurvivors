import { Item } from './Item.js';

export class MultiExp extends Item {
    constructor() {
        super(0, 1.2, 0, 0, 0, 25);
    }

    getDescriptor() {
        return `Multiplie vos gains d'expérience par ${super.getIncreaseExp()}`;
    }
}