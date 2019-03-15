// Liberapp 2019 - Tahiti Katagai
// エフェクト　円　破壊したときに表示

class EffectCircle extends GameObject{

    radius:number;
    color:number;
    period:number;
    frame:number;
    scaler:number;

    constructor( x:number, y:number, radius:number, color:number=0xffc000, frames:number=10, scaler:number=1.1 ) {
        super();

        this.radius = radius;
        this.color = color;
        this.frame = this.period = frames;
        this.scaler = scaler;
        this.setShape(x, y, this.radius);
    }

    setShape(x:number, y:number, radius:number){
        if( this.shape == null ){
            this.shape = new egret.Shape();
            GameObject.display.addChild(this.shape);
        }else{
            this.shape.graphics.clear();
        }
        const rate = (this.frame / this.period);  // 1.0~0.0
        this.shape.x = x;
        this.shape.y = y;
        this.shape.graphics.lineStyle(3 + 10 * rate, this.color);
        this.shape.graphics.drawCircle(0, 0, radius);
    }

    update() {
        if( (--this.frame) <= 0 ){
            this.destroy();
            return;
        }

        this.radius *= this.scaler;
        this.setShape( this.shape.x, this.shape.y, this.radius );
    }
}
