const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "02d09dd302783f8ad970eed2958fc5100674c580535838f4c5039e64852154410d": 100, 
  // 6fed8df8fc035dc98b271e55b381a57fd24b7cb4953edb2fcbce0a0e9dfde8c7
  // Signature {
  //   r: 23720051498763503783917726271523652549207294298985279159350933837174710203328,
  //   s: 4435980828796164432731250662896255671753207847874516322178971334725112889219,
  //   recovery: 1
  // }
  "0371a62f45acb1d80739fc4e2d4b8d21a6c0008f2a2f7785168da091070949e1e9": 50,
  // 44637e9ed6cbf9299a5c0b24fa9bb286c5aadb8d918844702e8f512a4ea20d72
  // Signature {
  //   r: 37108325501407529916172586963101025735763752280376970380152320626751075566051,
  //   s: 5464974280504064928918520448510040409937034776577158480937385176048019533503,
  //   recovery: 1
  // }
  "03965015bcef82a4e07506e1cc21b2921fc60d620ba2a14ce7e15c768187295cea": 75,
  // e4f5e5b7ac2b250ea300361616fdcaf00638897c18ed1d1fb2f4eb3bba654489
  // Signature {
  // r: 86737456465190225491166300807491496751341511967978764244962966736621034283122,
  // s: 34597607414795052539887880647695865131740527066301444395733112299986649793294,
  // recovery: 1
  // }
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // setInitialBalance(sender);
  // setInitialBalance(recipient);

  const message = "message";
  const hashedMessage = keccak256(utf8ToBytes(message));
  // console.log(req.body);
  const { sender, amount, recipient, r, s, recovery, publicKey } = req.body;

  const bigIntR = BigInt(r);
  const bigIntS = BigInt(s);
  const sig = new secp.secp256k1.Signature(bigIntR, bigIntS, parseInt(recovery));

  const verify = secp.secp256k1.verify(sig, hashedMessage, publicKey);
  console.log(verify);

  if (verify) {
    setInitialBalance(sender);
    setInitialBalance(recipient);
    
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
      res.status(401).send({ message: "You are not authorized!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
