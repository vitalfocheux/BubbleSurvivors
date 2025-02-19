import { Item } from './Item.js';

export class One_UP extends Item {
    constructor() {
        super(0, 0, 0, 100, 0, 5);
    }

    getDescriptor() {
        return `Augmente votre vie de ${super.getIncreaseLife()}%`;
    }
}