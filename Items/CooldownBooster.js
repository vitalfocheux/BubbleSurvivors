import { Item } from './Item.js';

export class CooldownBooster extends Item {
    constructor() {
        super(0, 0, 0, 0, 50, 10);
    }

    getDescriptor() {
        return `Diminue votre cooldown de ${super.getDecreaseCooldown()}%`;
    }
}