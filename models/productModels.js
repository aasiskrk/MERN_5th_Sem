const mongoose = require('mongoose');

//making schema

const productSchema = new mongoose.Schema({
    Name :{
        type : String,
        required : true
    },
    description:{
        type :String,
        required : true
    },
    price : {
        type: String,
        required : true
    },
    category : {
        type : String,
        required : true
    }
});

const Product = mongoose.model('products', productSchema);
module.exports = Product;