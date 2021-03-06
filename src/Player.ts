// Liberapp 2019 - Tahiti Katagai
// プレイヤー丸型

enum Power{
    None,
    SPREAD,
    MAGNET,
    FEVER,
    Total
}

class Player extends GameObject{

    static I:Player = null;   // singleton instance

    radius:number;
    maxSpeed:number = 0;
    speed:number = 0;
    ammo:number = 0;
    textAmmo:egret.TextField = null;
    readonly shotLevelTable:number[] = [10, 30, 100];
    shotLevel = 0;
    readonly shotFrameTable:number[] = [14, 11, 8];
    shotFrame:number = 0;
    power:Power = Power.None;
    powerFrame:number = 0;
    touch:boolean = false;
    touchOffsetX:number = 0;
    stopFlag:boolean = false;
    state:()=>void = this.stateNone;
    
    constructor() {
        super();

        Player.I = this;
        this.radius = PLAYER_RADIUS_PER_WIDTH * Util.width;

        this.setShape(Util.width *0.5, Util.height * PLAYER_POSITION_PER_HEIGHT, this.radius);
        this.textAmmo = Util.newTextField(""+this.ammo, Util.width / 18, 0x000000, this.shape.x/Util.width, this.shape.y/Util.height, true);
        GameObject.display.addChild( this.textAmmo );

        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => this.touchBegin(e), this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => this.touchMove(e), this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => this.touchEnd(e), this);
    }

    onDestroy(){
        GameObject.display.removeChild( this.textAmmo );
        this.textAmmo = null;
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => this.touchBegin(e), this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => this.touchMove(e), this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => this.touchEnd(e), this);
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
        this.shape.graphics.beginFill(0xf0c000);
        this.shape.graphics.drawCircle(0, 0, radius);
        this.shape.graphics.endFill();
    }
    
    update() {
        this.state();
        
        // ammo
        this.textAmmo.text = "" + this.ammo;
        this.textAmmo.x = this.shape.x - this.textAmmo.width  * 0.5;
        this.textAmmo.y = this.shape.y - this.textAmmo.height * 0.5;
    }

    startRun(){
        this.state = this.stateRun;
        this.speed = this.maxSpeed = Util.height / (2.5 * 60);
    }
    stateRun(){
        // game over
        if( this.shape.y > Util.height - this.radius ){
            this.state = this.stateNone;
            this.speed = 0;
            new GameOver();
            return;
        }

        // power
        this.processPower();

        // move
        if( this.stopFlag ){
            this.stopFlag = false;
            this.speed = this.maxSpeed * 0.5;
        }
        this.speed += Util.clamp( this.maxSpeed - this.speed, this.maxSpeed * -0.1, this.maxSpeed * +0.1 );
        const yd = Util.height * (1/60/2);
        this.shape.y += Util.clamp( PLAYER_POSITION_PER_HEIGHT*Util.height - this.shape.y, -yd, yd );

        // shot
        if( this.touch ){
            if( (--this.shotFrame) <= 0 ){
                this.shotFrame = this.shotFrameTable[ this.shotLevel ];
                this.addAmmo( -1 );

                switch( this.power ){
                    default:
                    case Power.None:
                    new PlayerShot( this.shape.x, this.shape.y - this.radius, 0 );
                    break;

                    case Power.SPREAD:
                    new PlayerShot( this.shape.x, this.shape.y - this.radius, 0 );
                    new PlayerShot( this.shape.x, this.shape.y - this.radius, Math.PI * (+1/16) );
                    new PlayerShot( this.shape.x, this.shape.y - this.radius, Math.PI * (-1/16) );
                    break;
                }
            }
        }
    }

    stateNone(){}


    touchBegin(e:egret.TouchEvent){
        if( this.state == this.stateNone )
            return;
        this.touch = true;
        this.touchOffsetX = this.shape.x - e.localX;
    }
    touchMove(e:egret.TouchEvent){
        if( this.state == this.stateNone )
            return;
        this.touch = true;
        this.shape.x = e.localX + this.touchOffsetX;
        this.shape.x = Util.clamp( this.shape.x, this.radius, Util.width - this.radius );
        this.touchOffsetX = this.shape.x - e.localX;
    }
    touchEnd(e:egret.TouchEvent){
        if( this.state == this.stateNone )
            return;
        this.touch = false;
    }

    conflict(dx:number, dy:number){
        this.shape.x += dx;
        this.shape.x = Util.clamp( this.shape.x, this.radius, Util.width - this.radius );
        this.shape.y += dy;
        this.touchOffsetX += dx;
        this.textAmmo.x = this.shape.x - this.textAmmo.width  * 0.5;
        this.textAmmo.y = this.shape.y - this.textAmmo.height * 0.5;
        if( dy > 0 ){
            this.stopFlag = true;
        }
    }

    addAmmo( delta:number=8 ){
        this.ammo = Util.clamp( this.ammo + delta, 0, 999 );

        for( let i=0 ; i<this.shotLevelTable.length ; i++ ){
            this.shotLevel = i;
            if( this.ammo < this.shotLevelTable[i] )
                break;
        }
    }

    // Power

    pickPower( power:Power ){
        this.power = power;
    }

    processPower(){
        if( this.power == Power.None )
            return;
        
        if( ItemPower.I == null ){
            this.endPower();
            return;
        }

        switch( this.power ){
            default:
            break;

            case Power.FEVER:
            // 突進
            this.stopFlag = false;
            this.shape.y += (PLAYER_POSITION_PER_HEIGHT*Util.height - this.shape.y) * 0.5;
            this.shape.scaleX =
            this.shape.scaleY = 2.0 + (ItemPower.I.step & 7) / 7;
            this.radius = PLAYER_RADIUS_PER_WIDTH * Util.width * 2.0;
            this.maxSpeed = Util.height / (1 * 60);
            // Blockへのダメージ
            Block.blocks.forEach( block => {
                if( (block.shape.y - this.shape.y)**2 < (block.sizeH*0.5 + this.radius)**2 )
                if( (block.shape.x - this.shape.x)**2 < (block.sizeW*0.5 + this.radius)**2 ){
                    block.applyDamage(Block.maxHp);
                }
            });
            break;
        }
    }
    
    endPower(){
        this.power = Power.None;
        
        // dispose fever
        this.speed = this.maxSpeed = Util.height / (2.5 * 60);
        this.shape.scaleX =
        this.shape.scaleY = 1.0;
        this.radius = PLAYER_RADIUS_PER_WIDTH * Util.width;
        this.speed = this.maxSpeed = Util.height / (2.5 * 60);
    }
}
