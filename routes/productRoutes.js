//importing only router as u dont need the whole express

const router = require('express').Router();
const productContoller = require('../controllers/productController');

//Make a create user API

router.post('/create', productContoller.createProduct);

//exporting
module.exports = router;