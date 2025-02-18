import { Item } from './Item.js';

export class MultiExp extends Item {
    constructor() {
        super(0, 1.5, 0, 0, 0, 10);
    }

    getDescriptor() {
        return `Multiplie vos gains d'expérience par ${super.getIncreaseExp()}`;
    }
}