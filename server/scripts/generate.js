const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const PRIVATE_KEY = secp256k1.utils.randomPrivateKey();
const PUBLIC_KEY = secp256k1.getPublicKey(PRIVATE_KEY);

const SIGNATURE = secp256k1.sign(keccak256(utf8ToBytes("message")), PRIVATE_KEY);

console.log('Public key: ', toHex(PUBLIC_KEY));
console.log('Private key: ', toHex(PRIVATE_KEY));
console.log('Signature: ', SIGNATURE);
