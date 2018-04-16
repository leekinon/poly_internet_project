var Product = require('../models/product');

var mongoose = require('mongoose');

//connect database local mongodb
mongoose.connect('mongodb://127.0.0.1:27017/shopping',{useMongoClient:true});

//connect microsoft azure mongodb
//mongoose.connect('mongodb://poly-5022-project:UdewTsaJhJ7k5WXNbnT4IDWSSupkV32eXPVQuYql2p0Mb32i7mgpZmXs6TSVx8yyiyx2Mic24PCzcsCl49vSrw%3D%3D@poly-5022-project.documents.azure.com:10255/?ssl=true');


var products = [
  // data of product
 
	new Product({
        imagePath: 'https://s.yimg.com/wb/images/50839A3D71753DA0F8110A9A587604D05DF0406A',
        title: 'Asus 22" Monitor',
        description: 'Good Resolution for using',
        price: 1500
    }),
	
	
   
    new Product({
        imagePath: 'https://static.gigabyte.com/Product/2/6305/2017052415421069_big.png',
        title: 'X299 AORUS Gaming 7 (rev. 1.0)',
        description: 'Intel X299 電競主機板搭載RGB Fusion, 數位LED燈條, 3個M.2, M.2散熱片, ESS SABRE 9018 DAC音效, Killer DoubleShot™ Pro 電競網路, 前後USB 3.1 Gen 2 Type-C連接埠',
        price: 2380
    }),
	
	
	 new Product({
        imagePath: 'https://static.bhphoto.com/images/multiple_images/thumbnails/1505747750000_IMG_871414.jpg',
        title: 'Asus ZenBook Pro UX550VE',
        description: 'Slim notebook and the best mobility',
        price: 11500
    }),
	
	
	 new Product({
        imagePath: 'https://www.asus.com/media/global/products/blJFZbbtTotymk5e/P_setting_fff_1_90_end_500.png',
        title: 'Motherboard PRIME H110M2',
        description: 'Full-featured micro-ATX H110 with 5X Protection II for dependable stability, DDR4 support, and UEFI BIOS with EZ Flash 3',
        price: 980
    })

];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
          //disconnect mongoDB after save all item
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
