// Liberapp 2019 - Tahiti Katagai

class Background extends GameObject{

    constructor() {
        super();

        this.shape = new egret.Shape();
        this.shape.graphics.beginFill(0x000000);
        this.shape.graphics.drawRect(0, 0, Util.width, Util.height);
        this.shape.graphics.endFill();
        GameObject.display.addChild(this.shape);
        GameObject.display.setChildIndex( this.shape, 1 );
    }
    
    update() {}
}

