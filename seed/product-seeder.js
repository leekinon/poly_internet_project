var Product = require('../models/product');

var mongoose = require('mongoose');

//connect database local mongodb
mongoose.connect('mongodb://127.0.0.1:27017/shopping');

//connect microsoft azure mongodb
//mongoose.connect('mongodb://poly-5022-project:UdewTsaJhJ7k5WXNbnT4IDWSSupkV32eXPVQuYql2p0Mb32i7mgpZmXs6TSVx8yyiyx2Mic24PCzcsCl49vSrw%3D%3D@poly-5022-project.documents.azure.com:10255/?ssl=true');


var products = [
  // data of product
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic Video Game',
        description: 'Awesome Game!!!!',
        price: 10
    }),
    new Product({
        imagePath: 'http://cdn2us.denofgeek.com/sites/denofgeekus/files/styles/main_wide/public/2016/09/world-of-warcraft.jpg',
        title: 'World of Warcraft Video Game',
        description: 'Also awesome? But of course it was better in vanilla ...',
        price: 20
    }),
    new Product({
        imagePath: 'https://support.activision.com/servlet/servlet.FileDownload?file=00PU000000Rq6tz',
        title: 'Call of Duty Video Game',
        description: 'Meh ... nah, it\'s okay I guess',
        price: 40
    }),
    new Product({
        imagePath: 'https://pmcdeadline2.files.wordpress.com/2014/02/minecraft__140227211000.jpg',
        title: 'Minecraft Video Game',
        description: 'Now that is super awesome!',
        price: 15
    }),
    new Product({
        imagePath: 'https://d1r7xvmnymv7kg.cloudfront.net/sites_products/darksouls3/assets/img/DARKSOUL_facebook_mini.jpg',
        title: 'Dark Souls 3 Video Game',
        description: 'I died!',
        price: 50
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
