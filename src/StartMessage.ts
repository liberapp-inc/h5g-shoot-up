// Liberapp 2019 - Tahiti Katagai
// スタート時の説明テキスト

class StartMessage extends GameObject{

    text:egret.TextField = null;
    
    constructor() {
        super();

        this.text = Util.newTextField("スワイプでボールを動かして\nブロックを打ち壊せ！", Util.width / 18, 0xf0c000, 0.5, 0.4, true);
        GameObject.display.addChild( this.text );

        GameObject.display.once(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => this.tap(e), this);
    }

    onDestroy(){
        GameObject.display.removeChild( this.text );
        this.text = null;
    }

    update() {}

    tap(e:egret.TouchEvent){
        Player.I.startRun();
        this.destroy();
    }
}
