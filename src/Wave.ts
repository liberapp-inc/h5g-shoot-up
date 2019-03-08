// Liberapp 2019 - Tahiti Katagai

class Wave extends GameObject{

    scroll:number = 0;
    wave:number = 0;

    constructor() {
        super();
    }

    update() {
        this.scroll += Player.I.speed;

        const length = Util.height * BLOCK_SIZE_PER_HEIGHT * 2;
        if( this.scroll >= length ){
            this.scroll -= length;

            const bw = BLOCK_SIZE_PER_WIDTH * Util.width;
            for( let i=0 ; i<BLOCK_IN_WIDTH ; i++ ){
                if( Util.randomInt(0,3) != 0 ){
                    new Block( bw*0.5 + i * bw, 0, Util.randomInt( 1, Block.maxHp ) );
                }
            }
        }

    }
}

