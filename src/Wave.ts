// Liberapp 2019 - Tahiti Katagai

class Wave extends GameObject{

    scroll:number = 0;
    wave:number = 0;
    meteo:number = 60*6;
    state:()=>void = this.stateLine;
    step:number = 0;
    route:number=0;
    map:number[] = null;
    mapIndex:number = 0;

    constructor() {
        super();
    }

    update() {
        this.scroll += Player.I.speed;
        this.state();

        this.processMeteo();
    }

    calcBlockHp():number {
        const maxHp = Math.min( this.wave/16+3, Block.maxHp );
        return Util.clamp( Util.randomInt( maxHp*0.25, maxHp ), 1, maxHp );
    }

    processMeteo(){
        if( (--this.meteo) <= 0 ){
            this.meteo = Util.random( 0.5, Util.clamp( 15 - this.wave/10, 8, 15 ) ) * 60;
            const bw   = BLOCK_SIZE_PER_WIDTH  * Util.width;
            const bh05 = BLOCK_SIZE_PER_HEIGHT * Util.height * 0.5;
            let i = Util.randomInt( 1, BLOCK_IN_WIDTH - 1 );
            const maxHp = Math.min( this.wave/16+6, Block.maxHp );
            new FallBlock( bw*0.5 + i * bw, -bh05, maxHp, Util.randomInt(0,3) != 0 ? 2.0 : 0.7 );
        }
    }

    stateLine(){
        const length = Util.height * BLOCK_SIZE_PER_HEIGHT * 2;
        if( this.scroll >= length ){
            this.scroll -= length;
            this.wave++;

            const bw   = BLOCK_SIZE_PER_WIDTH  * Util.width;
            const bh05 = BLOCK_SIZE_PER_HEIGHT * Util.height * 0.5;

            if( (++this.step) % 2 == 0 ){
                // block line
                for( let i=0 ; i<BLOCK_IN_WIDTH ; i++ ){
                    if( Util.randomInt( 0, 2 ) != 0 ){
                        new Block( bw*0.5 + i * bw, -bh05, this.calcBlockHp() );
                    }
                }
            }else{
                // one block
                let i = Util.randomInt( 1, BLOCK_IN_WIDTH - 1 );
                new Block( bw*0.5 + i * bw, -bh05, this.calcBlockHp() );
            }

            if( Util.randomInt( 0, 30 ) == 0 ){
                this.state = this.stateRoute;
                this.scroll -= Util.height * BLOCK_SIZE_PER_HEIGHT * 8;
            }
        }
    }
    
    stateRoute(){
        const length = Util.height * BLOCK_SIZE_PER_HEIGHT * 2;
        if( this.scroll >= length ){
            this.scroll -= length;
            this.wave++;

            const bw   = BLOCK_SIZE_PER_WIDTH  * Util.width;
            const bh05 = BLOCK_SIZE_PER_HEIGHT * Util.height * 0.5;
            this.route = Util.clamp( this.route + Util.randomInt(-2,+2), 0, BLOCK_IN_WIDTH-2 );
            for( let i=0 ; i<BLOCK_IN_WIDTH ; i++ ){
                if( i != this.route && i!= this.route+1 ){
                    new Block( bw*0.5 + i * bw, -bh05, this.calcBlockHp() );
                }
            }
            
            if( Util.randomInt( 0, 30 ) == 0 ){
                this.setStateMap();
            }
        }
    }

    setStateMap(){
        this.state = this.stateMap;
        this.map = this.maps[ Util.randomInt( 0, this.maps.length-1 ) ];
        this.mapIndex = this.map.length / BLOCK_IN_WIDTH - 1;
        this.scroll -= Util.height * BLOCK_SIZE_PER_HEIGHT * 8;
    }
    stateMap(){
        const length = Util.height * BLOCK_SIZE_PER_HEIGHT;
        if( this.scroll >= length ){
            this.scroll -= length;
            this.wave++;

            const bw   = BLOCK_SIZE_PER_WIDTH  * Util.width;
            const bh05 = BLOCK_SIZE_PER_HEIGHT * Util.height * 0.5;
            for( let i=0 ; i<BLOCK_IN_WIDTH ; i++ ){
                if( this.map[this.mapIndex * BLOCK_IN_WIDTH + i] != 0 ){
                    new Block( bw*0.5 + i * bw, -bh05, this.calcBlockHp() );
                }
            }

            if( (--this.mapIndex) < 0 ){
                if( Util.randomInt(0, 3) != 0 ){
                    this.setStateMap();
                }else{
                    this.state = this.stateLine;
                    this.scroll -= Util.height * BLOCK_SIZE_PER_HEIGHT * 8;
                }
            }
        }
    }
    map0:number[] = [
        0,0,0,0,0,
        1,1,1,1,1,
        1,1,0,1,1,
        1,0,0,0,1,
        0,0,0,0,0,
        1,0,1,0,1,
        1,0,0,0,1,
        0,1,0,1,0,
        0,1,0,1,0,
        0,0,0,0,0,
        1,0,0,0,1,
        0,0,0,0,0,
    ];
    map1:number[] = [
        0,0,0,0,0,
        0,0,1,0,0,
        0,1,1,1,0,
        0,1,1,1,0,
        0,1,0,1,0,
        0,1,1,1,0,
        0,0,0,0,0,
        0,1,1,1,0,
        0,0,1,0,0,
        0,1,1,1,0,
        0,0,1,0,0,
    ];
    map2:number[] = [
        1,0,0,0,1,
        1,0,0,0,1,
        0,1,0,1,0,
        0,1,0,1,0,
        0,0,1,0,0,
        0,0,1,0,0,
    ];
    map3:number[] = [
        1,0,0,0,1,
        0,1,0,1,0,
        0,0,1,0,0,
        0,0,1,0,0,
        0,0,1,0,0,
    ];
    maps:number[][] = [this.map0, this.map1, this.map2, this.map3];
}

