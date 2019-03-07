// Liberapp 2019 - Tahiti Katagai
// プレイヤー（まる）

class Player extends GameObject{

    static I:Player = null;   // singleton instance

    radius:number;
    maxSpeed:number;
    speed:number;
    bullet:number;
    touchOffsetX:number = 0;
    stopFlag:boolean = false;

    constructor() {
        super();

        Player.I = this;
        this.radius = PLAYER_RADIUS_PER_WIDTH * Util.width;
        this.speed = this.maxSpeed = Util.height / (3 * 60);
        this.setShape(Util.width *0.5, Util.height *0.7, this.radius);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => this.touchBegin(e), this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => this.touchMove(e), this);
    }

    onDestroy(){
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => this.touchBegin(e), this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => this.touchMove(e), this);
        Player.I = null;
    }

    setShape(x:number, y:number, radius:number){
        if( this.shape == null ){
            this.shape = new egret.Shape();
            GameObject.display.addChild(this.shape);
        }
        else{
            this.shape.graphics.clear();
        }
        this.shape.x = x;
        this.shape.y = y;
        this.shape.graphics.beginFill(0xffc000);
        this.shape.graphics.drawCircle(0, 0, radius);
        this.shape.graphics.endFill();
    }
    
    update() {
        if( this.stopFlag ){
            this.stopFlag = false;
            this.speed = 0;
        }

        this.speed += Util.clamp( this.maxSpeed - this.speed, 0, this.maxSpeed*0.1 );
        const yd = Util.height * (3/60);
        this.shape.y += Util.clamp( Util.height*0.7-this.shape.y, -yd, yd );
    }

    touchBegin(e:egret.TouchEvent){
        if( this.deleteFlag )
            return;
        this.touchOffsetX = this.shape.x - e.localX;
    }
    touchMove(e:egret.TouchEvent){
        if( this.deleteFlag )
            return;
        this.shape.x = e.localX + this.touchOffsetX;
        this.shape.x = Util.clamp( this.shape.x, this.radius, Util.width - this.radius );
        this.touchOffsetX = this.shape.x - e.localX;
    }

    conflict(dx:number, dy:number){
        this.shape.x += dx;
        this.shape.x = Util.clamp( this.shape.x, this.radius, Util.width - this.radius );
        this.shape.y += dy;
        this.touchOffsetX += dx;
        if( dy > 0 ){
            this.stopFlag = true;
        }
    }

    eatDot(){
        this.bullet += 1;
    }
}
