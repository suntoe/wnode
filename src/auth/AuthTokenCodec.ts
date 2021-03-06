import AuthToken from './AuthToken';
import Aes128 from '../util/Aes128';
import Context from '../ctx/Context';


export default class AuthTokenCodec {

    public $id = 'AuthTokenCodec';
    public $Aes128:Aes128 = null;
    public $lazy = true;

    /**
     * 编码
     */
    encode( token:AuthToken ):Promise<string> {
        const me = this;
        return new Promise( function(resolve) {
            const raw = {
                i: token.userId,
                o: token.orgId,
                e: token.expireByMinutes,
                r: token.roles,
                d: token.data,
                x: token.internal
            };
            const json = JSON.stringify(raw);
            resolve( me.$Aes128.encrypt(json, 'base64') );
        } );
    }

    /**
     * 解码
     */
    decode( ctx:Context, tokenText:string ) {
        const me = this;
        return new Promise( function( resolve, reject ) {
            const json = me.$Aes128.decrypt(tokenText, 'base64');
            let raw;
            try {
                raw = JSON.parse(json);
            } catch(e) {
                return reject(e);
            }
            resolve( new AuthToken( raw.i, raw.o, raw.e, raw.r, raw.d, raw.x ) );
        } );
    }

}
