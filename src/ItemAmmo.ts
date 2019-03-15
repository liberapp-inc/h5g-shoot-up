// Liberapp 2019 - Tahiti Katagai
// 弾薬アイテム

class ItemAmmo extends GameObject{

    radius:number;
    speed:number = 1.0;

    constructor( x:number, y:number ) {
        super();

        this.radius = SHOT_RADIUS_PER_WIDTH * Util.width * 1.75;
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
        this.shape.graphics.beginFill(0xf0d000);
        const r = this.radius * 0.4;
        this.shape.graphics.drawCircle(r*-0.0, r*-1.4, r);
        this.shape.graphics.drawCircle(r*+1.2, r*+0.6, r);
        this.shape.graphics.drawCircle(r*-1.2, r*+0.6, r);
        this.shape.graphics.endFill();
    }

    update() {
        // fall down
        this.shape.y += Player.I.speed * this.speed;
        this.speed += 0.03;

        // プレイヤーとの接触
        if( this.isPicked() ){
            Player.I.addAmmo();
            return;
        }

        // 画面外で消滅
        this.isOutOfScreen();
    }

    // プレイヤーとの接触
    isPicked():boolean{
        let dx = Player.I.shape.x - this.shape.x;
        let dy = Player.I.shape.y - this.shape.y;
        let l = dx**2 + dy**2;
        if( l <= (Player.I.radius + this.radius)**2 ){
            this.destroy();
            return true;
        }
        // マグネット引き寄せ
        if( Player.I.power == Power.MAGNET ){
            l = Math.sqrt( l );
            let rate = 1 - Util.clamp( l / (Util.width * 0.5), 0, 1 );
            this.speed += (1.0 - this.speed) * rate;
            l = 1 / l * rate * Util.width * 0.05;
            this.shape.x += dx * l;
            this.shape.y += dy * l;
        }
        return false;
    }

    // 画面外で消滅
    isOutOfScreen():boolean{
        if( this.shape.y >= Util.height + this.radius ){
            this.destroy();
            return true;
        }
        return false;
    }
}

