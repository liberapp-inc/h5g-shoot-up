// Liberapp 2019 - Tahiti Katagai
// 弾薬アイテム

class ItemAmmo extends GameObject{

    radius:number;

    constructor( x:number, y:number ) {
        super();

        this.radius = SHOT_RADIUS_PER_WIDTH * Util.width;
        this.setShape(x, y);
    }

    setShape(x:number, y:number){
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
        this.shape.graphics.drawCircle(0, 0, this.radius);
        this.shape.graphics.endFill();
    }

    update() {
        this.shape.y += Player.I.speed * 1.2;

        // プレイヤーとの接触
        let dx = Player.I.shape.x - this.shape.x;
        let dy = Player.I.shape.y - this.shape.y;
        if( dx**2 + dy**2 <= (Player.I.radius + this.radius)**2 ){
            Player.I.addAmmo();
            this.destroy();
            return;
        }

        // 画面外で消滅
        if( this.shape.y >= Util.height + this.radius )
            this.destroy();
    }
}
