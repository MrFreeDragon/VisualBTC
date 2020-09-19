// ###############################################################################
// #                                                                             #
// #        JS script for creating Visual 16x16 (256bit) BTC private keys        #
// #                                                                             #
// #           Visual private key generator (c) 2019 by MrFreeDragon             #
// #                                                                             #
// ###############################################################################

var c_canvas = document.getElementById("BTCpic");
var context = c_canvas.getContext("2d");
var cell = 28;
var width = cell * 16;

var LastCell = [16, 16]; // temp cell value out of range for fill by MouseMove event
var timer = 0 // tmp variabe for timeout function ID storage

var blockX = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //used to block column from filling in advanced option
var blockY = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //used to block row from filling in advanced option
var IsLinesBlockOption = false;
var cellfillcolour = "green"; //cell colour for bit=1
var cellnofillcolour = "white"; //cell colour for bit=0
var cellblockcolour = "#a8a8a8"; //cell colour if user blocks the whole line (all bits equals to 1), advanced option

var BTCbin = document.getElementById("BTCb");
var BTChex = document.getElementById("BTCh");
var BTCp_gen = document.getElementById("BTCpub");
var BTCaddr_gen = document.getElementById("BTCaddr");
var BTCp_c_gen = document.getElementById("BTCpubC");
var BTCaddr_c_gen = document.getElementById("BTCaddrC");
var BTCadd_trans = document.getElementById("BTCaddrCheck");
var BTCadd_c_trans = document.getElementById("BTCaddrCheckC");

var HEXtick = document.getElementById("ownHEX");
var HEXinput = document.getElementById("BTChIn");
var HEXform = document.getElementById("ownHEXform"); // includes HEXinput and Visualize btn objects to hide/show them both
var AdvOptform = document.getElementById("AdvOptDIV"); // includes advanced options to hide/show them both

var ExportKeyType = document.getElementById("IsCompressedExportKey");
var ExportDIV = document.getElementById("ExportKey");
var ExportPriv = document.getElementById("PrivKeyExport");
var ExportWIF = document.getElementById("PrivKeyWIF");
var ExportAddr = document.getElementById("AddressExport");

var PrivKeyCaution = document.getElementById("Caution");
var BTCOrderBin = "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111010111010101011101101110011100110101011110100100010100000001110111011111111010010010111101000110011010000001101100100000101000000".split("");

var BlockExplorer = "https://btc.com/"; // default explorer for transactions/balances overview
var APIrequestURL = "https://blockchain.info/q/getreceivedbyaddress/" // URL for API request to receive transaction amount

c_canvas.width = width + cell;
c_canvas.height = width + cell;

// Painting the grid
context.setLineDash([1, 3]);
context.strokeStyle = "blue";

for (var x = cell - 0.5; x <= width + cell; x += cell) {
  context.moveTo(x, cell);
  context.lineTo(x, width + cell);
}

for (var y = cell - 0.5; y <= width + cell; y += cell) {
  context.moveTo(cell, y);
  context.lineTo(width + cell, y);
}

context.stroke();

// Putting captions 1-16 to X and Y
context.font      = "bold 12px Verdana";
context.fillStyle = "green";
for (var count = 1; count <=16; count += 1) {
  context.fillText(count, 5, 20 + count * cell);
  context.fillText(count, 5 + count * cell, 20);
}

// Creating nul array 16x16 to store 256bit private key
var BTCpk = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var PrivKeyBstr = "";

// Function returns bin private key from Array elements
function PrivFromArr() {
        PrivKeyBstr = "";
        BTCpk.forEach(function(elem) {
        PrivKeyBstr += elem.join('');
        });
        return PrivKeyBstr;
}

function bin2hex(bin) {  
      var i = 0, l = bin.length, chr, hex = '';
      res = l % 4;
      for (i; i < l - res; i+=4) {
      chr = parseInt(bin.substr(-i -4, 4), 2).toString(16);
      hex = chr.concat(hex);
      }
      if (res > 0) {hex = parseInt(bin.substr(0, res) , 2).toString(16).concat(hex)} // converts the residual if bin str not devided by 4
      return hex;
}  

function hex2bin(hex) {
    var bin ="";
    for(var i=0; i < hex.length; i++) {
        bin += pad(parseInt(hex.substr(i, 1), 16).toString(2), 4, "0");
    }
    return bin;    
}

// Function returns uncompressed pubkey, uncompressed address, compressed pubkey annd compressed address
function LegacyAddr(sec_key) {
    var hash_str = pad(sec_key, 64, "0");
    var hash = Crypto.util.hexToBytes(hash_str);
    eckey = new Bitcoin.ECKey(hash);
    eckey_c = new Bitcoin.ECKey(hash);
    var curve = getSECCurveByName("secp256k1");
    var pt = curve.getG().multiply(eckey.priv);
    eckey_c.pub = getEncoded(pt, true);
    eckey_c.pubKeyHash = Bitcoin.Util.sha256ripe160(eckey_c.pub);
    var hash160 = eckey.getPubKeyHash();
    var hash160_c = eckey_c.getPubKeyHash();

    var pubkey = Crypto.util.bytesToHex(getEncoded(pt, false));
    var pubkey_c = Crypto.util.bytesToHex(eckey_c.pub);
    var addr = new Bitcoin.Address(hash160);
    var addr_c = new Bitcoin.Address(hash160_c);

    return [pubkey, addr, pubkey_c, addr_c];
}

// Function add ch="0" to make the exact length
function pad(str, len, ch) { 
    padding = '';
    for (var i = 0; i < len - str.length; i++) {
        padding += ch;
    }
    return padding + str;
}

// Function returns compressed or uncompressed public key
function getEncoded(pt, compressed) {
   var x = pt.getX().toBigInteger();
   var y = pt.getY().toBigInteger();
   var enc = integerToBytes(x, 32);
   if (compressed) {
     if (y.isEven()) {
       enc.unshift(0x02);
       } else {
       enc.unshift(0x03);
     }
   } else {
     enc.unshift(0x04);
     enc = enc.concat(integerToBytes(y, 32));
   }
   return enc;
}

// Function shows/hides custom private key input form
function DisplayHEXInput() {
if (HEXtick.checked) {
   HEXform.style.display = "block";
   } else {
   HEXform.style.display = "none";
   }
}

function visualizeHEX() {
HEXinput.value = HEXinput.value.replace(/ /g, '');
if (!/[^0123456789abcdef]+/i.test(HEXinput.value) && HEXinput.value != "" && HEXinput.value.length <=64 ) {
  BINstring = pad(hex2bin(HEXinput.value), 256, "0");
  for (let i=0; i<16; i++) {
  BTCpk[i] = BINstring.substr(i*16, 16).split("");
  }
  fillAllfromArr();
  calculation();
  } else {
  HEXinput.style.background="#FFFDD0";
  }
}

function DisplayAdvOptDIV(){
if (document.getElementById("AdvOpt").checked) {
   AdvOptform.style.display = "block";
   } else {
   AdvOptform.style.display = "none";
   }
}

function ChangeExplorer() {
  BlockExplorer = document.getElementById("ExplorerSelect").value;
  calculation();
}

function ClearAll () {
for (let i=0; i<16; i++) {
  BTCpk[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}
fillAllfromArr();
calculation();
HEXinput.value = "";
BTCbin.textContent = "";
BTChex.value = "";
BTCadd_trans.value = "";
BTCadd_c_trans.value = "";
LastCell = [16, 16];
}

function rndPrivKey() {
for (var x=0; x<16; x++) {for (var y=0; y<16; y++) {
    if (blockX[x] == 0 && blockY[y] == 0) {BTCpk[y][x] = Math.floor(Math.random() * 2)};
    }}
fillAllfromArr();
calculation();
LastCell = [16, 16];
}

function InverseKey() {
for (var x=0; x<16; x++) {for (var y=0; y<16; y++) {
    if (blockX[x] == 0 && blockY[y] == 0) {BTCpk[y][x] ^= 1};
    }}
fillAllfromArr();
calculation();
LastCell = [16, 16];
}

function RotateKey() {
BTCtmp = JSON.parse(JSON.stringify(BTCpk));
for (var x=0; x<16; x++) {for (var y=0; y<16; y++) {
    BTCpk[y][x] = BTCtmp[15-x][y];
    }}
UnblockLines(); // Rotation also unblocks lines in order to rotate the pattern key and not loose the bits
fillAllfromArr();
calculation();
LastCell = [16, 16];
BTCtmp = [];
}

function UnblockLines() {
blockX = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
blockY = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function GenerateExportDIV () {
if (BTChex.value == 0 || BTChex.value == "") {return;}
ExportDIV.style.display = "block";
ExportPriv.value = BTChex.value;
  if (ExportKeyType.value == 1) {
      ExportKeyType.value = "0";
      document.getElementById("AddressLabel").innerHTML = "BTC address (Legacy, uncompressed)";
      ExportAddr.value = BTCaddr_gen.value;
      var WIF = new Bitcoin.Address(Crypto.util.hexToBytes(BTChex.value));
      WIF.version = 0x80;
      ExportWIF.value = WIF.toString();
      } else {
      ExportKeyType.value = "1";
      document.getElementById("AddressLabel").innerHTML = "BTC address (Legacy, compressed)";
      ExportAddr.value = BTCaddr_c_gen.value;
      var WIF = new Bitcoin.Address(Crypto.util.hexToBytes(BTChex.value + "01"));
      WIF.version = 0x80;
      ExportWIF.value = WIF.toString();
  }
GenerateQR();
}

function GenerateQR () {
var KeyQR = qrcode (4, "M");
var AddrQR = qrcode (4, "M");
var textqrKey = ExportWIF.value.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
KeyQR.addData(textqrKey);
KeyQR.make();
document.getElementById("PrivKeyQR").innerHTML = KeyQR.createImgTag(3);
var textqrAddr = ExportAddr.value.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
AddrQR.addData(textqrAddr);
AddrQR.make();
document.getElementById("AddressQR").innerHTML = AddrQR.createImgTag(4);
}

function printDIV() {
     var newDIV = document.getElementById("DIVtoPrint").cloneNode(true);
     newDIV.id = "PrintDIVclone";
     document.body.appendChild(newDIV);
     document.getElementById("MainDIV").classList.add("noPrint");
     document.getElementById("PrintDIVclone").classList.add("printThis");
     window.print();
     document.getElementById("MainDIV").classList.remove("noPrint");
     removeDIV("PrintDIVclone");
}

function removeDIV(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}

// Function checks if bin string number within bitcoin order (not more than the order)
function IsInOrder(BinNumStr) {
var t = true;
 if (BinNumStr.length > 256) {t = false} else {
   if (BinNumStr.length == 256) {
     for (let i=0; i<256; i++) {
         if (BinNumStr.substr(i,1) > BTCOrderBin[i]) {
         return false; } else {
         if (BinNumStr.substr(i,1) < BTCOrderBin[i]) {return true;}
         }         
     }
   }
 }
return t;
}

// Main script

// transfers pic key to field and makes calculations
function calculation() {
	BTCbin.textContent = PrivFromArr();
        BTChex.value = bin2hex(BTCbin.textContent);
        if(!IsInOrder(BTCbin.textContent)) {Caution.style.display = "block";} else {Caution.style.display = "none"};
        if (BTCbin.textContent == 0) {
           GenResults = ["", "", "", ""];
           } else {
           GenResults = LegacyAddr(BTChex.value);
        }
        BTCp_gen.textContent = GenResults[0];
        BTCaddr_gen.value = GenResults[1];
        BTCp_c_gen.textContent = GenResults[2];
        BTCaddr_c_gen.value = GenResults[3];
        ExportDIV.style.display = "none";
        document.getElementById("ExploreBTCAddr").href = BlockExplorer + BTCaddr_gen.value;
        document.getElementById("ExploreBTCAddrC").href = BlockExplorer + BTCaddr_c_gen.value;
        if (document.getElementById("CheckAddrOnline").checked) {AddressCheckOnline(GenResults[1], BTCadd_trans); AddressCheckOnline(GenResults[3], BTCadd_c_trans)};
}

// check volume of transactions received by address; no used by default, activated only by advanced options
function AddressCheckOnline(address, fieldForResult) {
if (address != "") {
let xhr = new XMLHttpRequest();
xhr.open("GET", APIrequestURL+address+"?r="+Math.random(), true);
xhr.timeout = 3000; //timeout for API request
xhr.ontimeout = function () {}
xhr.send();
xhr.onreadystatechange = function() {
  if (xhr.readyState !== 4) return; 
  if (xhr.status === 200) {
     fieldForResult.value = "\u0243" + " " + xhr.responseText/100000000;
     if (fieldForResult.value == "\u0243" + " " + "0") {fieldForResult.style.background="none"} else {fieldForResult.style.background="#58fc49"};
     } else {
     console.log("HTTP API error on", APIrequestURL, xhr.status, xhr.statusText);
     fieldForResult.value = "\u0243" + " " + "0";
     fieldForResult.style.background="none";
     }
}
}}

// Function returns the X and Y of 16x16 array based on mouse position
function getCellByPosition(X, Y) {
	var cellX = Math.floor((X - cell) / cell)
	var cellY = Math.floor((Y - cell) / cell)
        return [cellX, cellY]
}

// Function fills/unfills the cell and changes the array element
function fillCell(CellToFill) {
	x = CellToFill[0];
        y = CellToFill[1];
        if ((x == -1 || y == -1) && IsLinesBlockOption) {blockLine(x, y)};
        if (x < 0 || y < 0 || x > 15 || y > 15 || (x == LastCell[0] && y == LastCell[1])) {return};
        if (blockX[x] == 1 || blockY[y] == 1) {return};
        if (BTCpk[y][x] == 0) {
           colour = cellfillcolour;
           BTCpk[y][x] = 1;
        }  else {
           colour = cellnofillcolour;
           BTCpk[y][x] = 0;
        }
        context.fillStyle = colour;
        context.fillRect(cell + x * cell, cell + y * cell, cell - 1, cell - 1);
        LastCell = [x, y];
        if (timer != 0) {clearTimeout(timer)}
        timer = setTimeout(calculation, 200);
}

function blockLine(row, column) {
        if (row == -1 && column == -1) {return};
        if (row == LastCell[0] && column == LastCell[1]) {return};
        if (row == -1) {blockY[column] ^= 1; BTCpk[column] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]};
        if (column == -1) {blockX[row] ^= 1; for (var y=0; y<16; y++) {BTCpk[y][row] = 0}};
        LastCell = [row, column];
        fillAllfromArr();
        calculation();
}

function LinesBlockSwitch() {
IsLinesBlockOption = document.getElementById("CheckBlockLines").checked;
if (!IsLinesBlockOption) {UnblockLines(); fillAllfromArr()}
}

function AddHideTransactionsField() {
if (document.getElementById("CheckAddrOnline").checked) {
        BTCadd_trans.style.display="inline-block";
        BTCadd_c_trans.style.display="inline-block";
        BTCaddr_gen.style.width="374px";
        BTCaddr_c_gen.style.width="374px";
        setTimeout(calculation, 100);
        }
        else {
        BTCadd_trans.style.display="none";
        BTCadd_c_trans.style.display="none";
        BTCadd_trans.value = "";
        BTCadd_c_trans.value = "";
        BTCaddr_gen.style.width="476px";
        BTCaddr_c_gen.style.width="476px";
        }
}

function fillAllfromArr() {
for (var x=0; x<16; x++) {for (var y=0; y<16; y++) {
        if (BTCpk[y][x] == 1) {colour = cellfillcolour} else {colour = cellnofillcolour};
        if (blockX[x] == 1 || blockY[y] == 1) {colour = cellblockcolour}
        context.fillStyle = colour;
        context.fillRect(cell + x * cell, cell + y * cell, cell - 1, cell - 1);
        }}
}

function handleMouseDown(event) { 
	CellXY = getCellByPosition(event.offsetX, event.offsetY);
	fillCell(CellXY);

	c_canvas.addEventListener('mousemove', handleMouseMove, false);
}

function handleMouseMove(event) {
	fillCell(getCellByPosition(event.offsetX, event.offsetY));
}

function handleMouseUp() {
	c_canvas.removeEventListener('mousemove', handleMouseMove, false)
        LastCell = [16, 16];
}

c_canvas.addEventListener('mousedown', handleMouseDown, false);
c_canvas.addEventListener('mouseup', handleMouseUp, false);

document.getElementById("ownHEX").addEventListener("change", DisplayHEXInput, false);
document.getElementById("ownHEXbtn").addEventListener("click", visualizeHEX, false);
document.getElementById("ClearButton").addEventListener("click", ClearAll, false);
document.getElementById("RandButton").addEventListener("click", rndPrivKey, false);
document.getElementById("Inverse").addEventListener("click", InverseKey, false);
document.getElementById("Rotate").addEventListener("click", RotateKey, false);
document.getElementById("GenQRbtn").addEventListener("click", GenerateExportDIV, false);
document.getElementById("PrintBtn").addEventListener("click", printDIV, false);
document.getElementById("AdvOpt").addEventListener("change", DisplayAdvOptDIV, false);
document.getElementById("ExplorerSelect").addEventListener("change", ChangeExplorer, false);
document.getElementById("CheckBlockLines").addEventListener("change", LinesBlockSwitch, false);
document.getElementById("CheckAddrOnline").addEventListener("change", AddHideTransactionsField, false);

ClearAll ();
