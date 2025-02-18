export class Item{
    constructor(increase_speed, increase_exp, increase_damage, increase_life, decrease_cooldown, cost) {
        if(new.target === Item){
            throw new TypeError("Cannot construct Enemy instances directly");
        }
        this.increase_speed = increase_speed;
        this.increase_exp = increase_exp;
        this.increase_damage = increase_damage;
        this.increase_life = increase_life;
        this.decrease_cooldown = decrease_cooldown;
        this.cost = cost;
    }

    getIncreaseSpeed() {
        return this.increase_speed;
    }

    setIncreaseSpeed(speed) {
        this.increase_speed = speed;
    }

    getIncreaseExp() {
        return this.increase_exp;
    }

    setIncreaseExp(exp) {
        this.increase_exp = exp;
    }

    getIncreaseDamage() {
        return this.increase_damage;
    }

    setIncreaseDamage(damage) {
        this.increase_damage = damage;
    }

    getIncreaseLife() {
        return this.increase_life;
    }

    setIncreaseLife(life) {
        this.increase_life = life;
    }

    getDecreaseCooldown() {
        return this.decrease_cooldown;
    }

    setDecreaseCooldown(cooldown) {
        this.decrease_cooldown = cooldown;
    }

    getCost(){
        return this.cost;
    }

    setCost(cost){
        this.cost = cost;
    }
}