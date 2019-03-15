// Liberapp 2019 - Tahiti Katagai
// パワーアイテム

class ItemPower extends GameObject{

    static I:ItemPower = null;

    power:Power;
    sizeW:number;
    sizeH:number;
    readonly speed:number = 0.8;
    text:egret.TextField = null;
    state:()=>void = this.stateFall;
    step:number = 0;

    constructor( x:number, y:number, power:Power ) {
        super();

        ItemPower.I = this;
        this.power = power;
        this.sizeW = BLOCK_SIZE_PER_WIDTH * Util.width;
        this.sizeH = this.sizeW * 0.5;
        this.setShape(x, y);
        this.text = Util.newTextField(Power[power], Util.width / 24, 0xf0d000, this.shape.x/Util.width, this.shape.y/Util.height, true);
        GameObject.display.addChild( this.text );
    }

    onDestroy(){
        GameObject.display.removeChild( this.text );
        this.text = null;
        ItemPower.I = null;
    }

    setShape(x:number, y:number){
        if( this.shape == null ){
            this.shape = new egret.Shape();
            GameObject.display.addChild(this.shape);
        }
        else{
            this.shape.graphics.clear();
        }
        let w = this.sizeW;
        let h = this.sizeH;
        this.shape.x = x;
        this.shape.y = y;
        this.shape.graphics.lineStyle(3, 0xf0d000);
        this.shape.graphics.drawRect( w * -0.5, h * -0.5, w, h );
    }

    update() {
        this.state();
    }

    stateFall(){
        // fall down
        this.shape.y += Player.I.speed * this.speed;
        this.text.x = this.shape.x - this.text.width  * 0.5;
        this.text.y = this.shape.y - this.text.height * 0.5;

        // プレイヤーとの接触
        let dx = Player.I.shape.x - this.shape.x;
        let dy = Player.I.shape.y - this.shape.y;
        if( dx**2 + dy**2 <= (Player.I.radius + this.sizeW)**2 ){
            Player.I.pickPower( this.power );
            this.state = this.stateEquipped;
            this.step = 60 * 6;
            return;
        }

        // 画面外で消滅
        if( this.shape.y >= Util.height + this.sizeH*0.5 )
            this.destroy();
    }

    stateEquipped(){
        this.shape.x += (Player.I.shape.x - this.shape.x) * 0.5;
        this.shape.y += ((Player.I.shape.y + Player.I.radius + this.sizeH * 0.5) - this.shape.y) * 0.5;

        this.text.x = this.shape.x - this.text.width  * 0.5;
        this.text.y = this.shape.y - this.text.height * 0.5;

        this.step--;

        if( this.step <= 60 * 2 ){
            this.text.alpha = (this.step & 0x8) != 0 ? 1 : 0.5;

            if( this.step <= 0 ){
                this.destroy();
            }
        }
    }
}

