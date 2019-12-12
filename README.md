# VisualBTC
Visual bitcoin private key generator. The square 16x16 is used for generation purposes, where each cell is one bit - 0 or 1. Make your visual drawings or use the generator in coin mode just fllipping the coin and fill the corresponding cell depending on the coin outcome.

Project structure:

1) index.html               ---> main  HTML file with the objects and references to scripts and styles
2) css/visualPrivKey.css    ---> Styles sheet
3) js/visualPrivKeyMain.js  ---> Main script with canvas calculations and object functions
4) js/bitcoinJS-lib.js      ---> BitcoinJS-lib v0.1.3-default (ECDSA formulas)
5) js/QRcode.js             ---> QR Code Generator for JavaScript

Project discussion: https://bitcointalk.org/index.php?topic=5187401.0

This project represents the visual bitcoin private key generator. Please have a look at info.txt file for the description.

The square 16x16 (=256) is used for generation purposes, where each cell represents one bit. The idea is that the filled cell represents "1" bit in the key, and not filled cell represents "0" bit in the key. Such presentation allows creating visual keys which could be easily memorized by human, but hardly understood by machines.
You cann also safely create your bitcoin private key by flipping a coin 256 times. Just start flipping the coin and filling the cells line by line from 1x1 to 16x16 and after 256 outcomes you will have a nonsense "picture" represented your unique private key. You can be sure that nobody in the world have ever generated the same key or would generate in the future.

(c) 2019 Visual Private Key Generator by MrFreeDragon > Donations: 1SoDn3auKHVwmQKRaBgkPk2hMmXzCMcPw  

https://btckeygen.com/
