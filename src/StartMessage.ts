// Liberapp 2019 - Tahiti Katagai
// スタート時の説明テキスト

class StartMessage extends GameObject{

    texts:egret.TextField[] = [];
    
    constructor() {
        super();

        this.texts[0] = Util.newTextField("スワイプでボールを動かして", Util.width / 18, 0xf0c000, 0.5, 0.3, true);
        this.texts[1] = Util.newTextField("ブロックを打ち壊せ！", Util.width / 18, 0xf0c000, 0.5, 0.4, true);
        this.texts.forEach( text => { GameObject.display.addChild( text ); });

        GameObject.display.once(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => this.tap(e), this);
    }

    onDestroy(){
        this.texts.forEach( text => { GameObject.display.removeChild( text ); });
        this.texts = null;
    }

    update() {}

    tap(e:egret.TouchEvent){
        Player.I.startRun();
        this.destroy();
    }
}
