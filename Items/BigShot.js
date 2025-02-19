import { Item } from './Item.js';

export class BigShot extends Item {
    constructor() {
        super(1.2, 0, 25, 0, 2.5, 40);
    }

    getDescriptor() {
        return `Augmente votre attage de ${super.getIncreaseDamage()}%
                Augmente votre cooldown par ${super.getDecreaseCooldown()}
                Augmente votre vitesse de ${Math.floor((super.getIncreaseSpeed() - 1) * 100 + 1)}%`;
    }
}