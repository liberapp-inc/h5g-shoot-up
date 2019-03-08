// Liberapp 2019 - Tahiti Katagai
// 障害物のブロック　壊すと弾アイテムやパワーアイテムを出す

class Block extends GameObject{

    static blocks:Block[] = [];
    static readonly maxHp:number = 5;
    hp:number;
    sizeW:number;
    sizeH:number;
    readonly animPeriod = 8;
    animFrame:number = 0;
    textHp:egret.TextField = null;

    constructor( x:number, y:number, hp:number ) {
        super();

        Block.blocks.push(this);
        this.hp = hp;
        this.sizeW = BLOCK_SIZE_PER_WIDTH  * Util.width;
        this.sizeH = BLOCK_SIZE_PER_HEIGHT * Util.height;
        this.setShape(x, y);
        this.textHp = Util.newTextField(""+this.hp, Util.width / 18, 0xffffff, x/Util.width, y/Util.height, true);
        GameObject.display.addChild( this.textHp );
    }

    onDestroy(){
        Block.blocks = Block.blocks.filter( obj => obj != this );
        GameObject.display.removeChild( this.textHp );
        this.textHp = null;
    }

    setShape(x:number, y:number){
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
        this.shape.graphics.drawRect(-0.5*this.sizeW, -0.5*this.sizeH, this.sizeW, this.sizeH);
        this.shape.graphics.endFill();
    }
    static getColor( hp:number ): number {
        let rate = Util.clamp( (hp-1) / (Block.maxHp-1), 0, 1);
        return Util.colorLerp( 0xf00040, 0xf0f000, rate );
    }

    update() {
        this.shape.y += Player.I.speed;

        this.textHp.text = "" + this.hp.toFixed();
        this.textHp.x = this.shape.x - this.textHp.width  * 0.5;
        this.textHp.y = this.shape.y - this.textHp.height * 0.5;

        if( this.animFrame > 0 ) {
            this.animFrame--;
            let scale = 1 + 0.2 * this.animFrame / this.animPeriod;
            this.shape.scaleX = this.shape.scaleY = scale;
        }

        // プレイヤーとの接触
        let dx = Player.I.shape.x - this.shape.x;
        let dy = Player.I.shape.y - this.shape.y;
        let rw = Player.I.radius + this.sizeW*0.5;
        let rh = Player.I.radius + this.sizeH*0.5;
        let dx2 = dx**2;
        let dy2 = dy**2;

        if( dx2 < rw**2 && dy2 < rh**2 ){
            if( dx2 < dy2 && dy > 0 ){
                Player.I.conflict( 0, rh - dy + Player.I.maxSpeed*0.2 );
            }else{
                Player.I.conflict( (dx>0 ? rw : -rw ) - dx, 0 );
            }
        }
        
        // 画面外で消滅
        if( this.shape.y >= Util.height + this.sizeH * 0.5 )
            this.destroy();
    }

    // ダメージ
    applyDamage( point:number ){
        this.hp -= point;
        if( this.hp > 0 ){
            this.animFrame = this.animPeriod;
            this.setShape( this.shape.x, this.shape.y );
        }else{
            Score.I.breakBlock();
            this.destroy();

            let x = this.shape.x;
            let y = this.shape.y;
            let r = this.sizeW * 0.5;
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
