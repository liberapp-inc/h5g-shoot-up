// Liberapp 2019 - Tahiti Katagai
// 障害物のブロック　壊すと弾アイテム　たまにパワーアイテムを出す

class Block extends GameObject{

    static blocks:Block[] = [];
    static readonly maxHp:number = 32;
    hp:number;
    radius:number;
    readonly animFrameMax = 8;
    animFrame:number = 0;
    text:egret.TextField = null;

    constructor( x:number, y:number, hp:number ) {
        super();

        Block.blocks.push(this);
        this.hp = hp;
        this.radius = TARGET_RADIUS_PER_WIDTH * Util.width;
        this.setShape(x, y, this.radius);
        this.text = Util.newTextField(""+this.hp, Util.width / 18, 0xffffff, x/Util.width, y/Util.height, true);
        GameObject.display.addChild( this.text );
    }

    onDestroy(){
        Block.blocks = Block.blocks.filter( obj => obj != this );
        GameObject.display.removeChild( this.text );
        this.text = null;
    }

    setShape(x:number, y:number, radius:number){
        if( this.shape == null ){
            this.shape = new egret.Shape();
            GameObject.display.addChild(this.shape);
            GameObject.display.setChildIndex(this.shape, 2);
        }else{
            this.shape.graphics.clear();
        }
        this.shape.x = x;
        this.shape.y = y;
        this.shape.graphics.beginFill(Block.getColor(this.hp));
        this.shape.graphics.drawCircle(0, 0, radius );
        this.shape.graphics.endFill();
    }
    static getColor( hp:number ): number {
        let rate = Util.clamp( (hp-1) / (Block.maxHp-1), 0, 1);
        if( rate <= 0.5 ){
            rate = Util.colorLerp( 0xf00040, 0xf0f000, rate * 2 );
        }else{
            rate = Util.colorLerp( 0xf0f000, 0x0080ff, rate * 2 - 1);
        }
        return rate;
    }

    update() {
        this.text.text = "" + this.hp.toFixed();
        this.text.x = this.shape.x - this.text.width  * 0.5;
        this.text.y = this.shape.y - this.text.height * 0.5;

        if( this.animFrame > 0 ) {
            this.animFrame--;
            let scale = 1 + 0.3 * this.animFrame / this.animFrameMax;
            this.shape.scaleX = this.shape.scaleY = scale;
        }
    }

    // ダメージ
    applyDamage( point:number ){
        this.hp -= point;
        if( this.hp > 0 ){
            this.animFrame = this.animFrameMax;
            this.setShape( this.shape.x, this.shape.y, this.radius );
        }else{
            Score.I.breakBlock();
            this.destroy();

            let x = this.shape.x;
            let y = this.shape.y;
            let r = this.radius;
            new EffectCircle( x, y, r );

            // for( let i=0 ; i<3 ; i++ )
            // {
            //     let a = Util.random( -Math.PI, +Math.PI );
            //     let vx = Math.sin( a );
            //     let vy = Math.cos( a );
            //     let radius = r * ( 2 + i*0.5 );
            //     new EffectLine(
            //         x + vx * r,
            //         y + vy * r,
            //         vx * radius,
            //         vy * radius );
            // }
        }
    }
}
