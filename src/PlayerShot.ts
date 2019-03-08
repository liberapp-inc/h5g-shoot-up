// Liberapp 2019 - Tahiti Katagai
// プレイヤーの撃つ弾

class PlayerShot extends GameObject{

    static shots:PlayerShot[] = [];
    radius:number;
    vx:number;
    vy:number;

    constructor( x:number, y:number, a:number ) {
        super();

        PlayerShot.shots.push(this);
        this.radius = SHOT_RADIUS_PER_WIDTH * Util.width;
        this.setShape(x, y, this.radius);
        this.vx =  Math.sin(a) * this.radius * 2.0;
        this.vy = -Math.cos(a) * this.radius * 2.0;
    }

    onDestroy(){
        PlayerShot.shots = PlayerShot.shots.filter( obj => obj != this );
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
        this.shape.graphics.beginFill(0x00c0ff);
        this.shape.graphics.drawCircle(0, 0, radius);
        this.shape.graphics.endFill();
    }
    
    update() {
        // 移動処理
        this.shape.x += this.vx;
        this.shape.y += this.vy;

        // Blockとの接触判定
        const hh = (BLOCK_SIZE_PER_HEIGHT*Util.height*0.5 + this.radius)**2;
        const ww = (BLOCK_SIZE_PER_WIDTH *Util.width *0.5 + this.radius)**2;
        Block.blocks.forEach( block => {
            if( (block.shape.y - this.shape.y)**2 < hh )
            if( (block.shape.x - this.shape.x)**2 < ww ){
                block.applyDamage(1);
                this.destroy();
            }
        });

        // 画面外で消滅
        if( this.shape.y < 0 || (this.shape.x - Util.width*0.5)**2 >= (Util.width*0.5+this.radius)**2 ) {
            this.destroy();
        }
    }
}
