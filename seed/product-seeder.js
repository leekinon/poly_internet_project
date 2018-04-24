var Product = require('../models/product');

var mongoose = require('mongoose');

//connect database local mongodb
mongoose.connect('mongodb://127.0.0.1:27017/shopping',{useMongoClient:true});

//connect microsoft azure mongodb
//mongoose.connect('mongodb://poly-5022-project:UdewTsaJhJ7k5WXNbnT4IDWSSupkV32eXPVQuYql2p0Mb32i7mgpZmXs6TSVx8yyiyx2Mic24PCzcsCl49vSrw%3D%3D@poly-5022-project.documents.azure.com:10255/?ssl=true');


var products = [
  // data of product

	new Product({
        imagePath: 'https://www.price.com.hk/space/product/236000/236761_ag9ozf_4.png',
        title: 'Lenovo Yoga Book (ZA150026HK)',
        description: 'New',
        price: 5080
    }),



    new Product({
        imagePath: 'https://www.price.com.hk/space/product/292000/292381_9b9s8b_4.png',
        title: ' Lenovo IdeaPad 120S-14IAP (81A50025HH)',
        description: '(BLUE)',
        price: 3100
    }),


	 new Product({
        imagePath: 'https://www.price.com.hk/space/product/278000/278726_ge2cds_4.jpg',
        title: 'ASUS ZenBook (UX430UA-GV007T)',
        description: '(太空灰)',
        price: 7580
    }),


	 new Product({
        imagePath: 'https://www.price.com.hk/space/product/288000/288880_ubg7te_4.jpg',
        title: 'Acer Swift 3 (SF314-52-38Z1)',
        description: '(FHD 1920x1080)',
        price: 3980
    }),

    new Product({
          imagePath: 'https://www.price.com.hk/space/product/279000/279692_gj914j_4.jpg',
          title: 'Lenovo Ideapad 120S-11IAP (81A400CFHH)',
          description: 'Hot',
          price: 5080
      }),

      new Product({
          imagePath: 'https://www.price.com.hk/space/product/304000/304116_rfnrvl_4.jpg',
          title: 'Samsung Notebook 5 (NP500R5N-X01HK)',
          description: 'New',
          price: 8699
      }),


     new Product({
          imagePath: 'https://www.price.com.hk/space/product/304000/304115_nfph9k_4.png',
          title: 'Acer SF514-52T-518Y (NX.GTMCF.001)',
          description: 'New',
          price: 7999
      }),


     new Product({
          imagePath: 'https://www.price.com.hk/space/product/304000/304108_9sce5m_4.jpg',
          title: ' ASUS ZenBook (UX331UAL-GP8205T)',
          description: '(Rose gold)',
          price: 8890
      }),

      new Product({
            imagePath: 'https://www.price.com.hk/space/product/304000/304102_5snmuy_4.png',
            title: 'Samsung Notebook 9 Pen (NP930QAA-K02HK)',
            description: 'New',
            price: 13709
        }),



        new Product({
            imagePath: 'https://www.price.com.hk/space/product/296000/296710_mdixbc_4.jpg',
            title: 'ASUS VivoBook (X507MA-AS5001T)',
            description: '(Stary Grey)',
            price:3900
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
