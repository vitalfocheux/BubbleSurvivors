import { Item } from './Item.js';

export class CooldownBooster extends Item {
    constructor() {
        super(0, 0, 0, 0, 2.5, 30);
    }

    getDescriptor() {
        return `Diminue votre cooldown de ${super.getDecreaseCooldown()}%`;
    }
}