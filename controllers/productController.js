const productModel = require("../models/productModels");
const path = require("path");
const fs = require("fs");

// 1. Creating Product Function
const createProduct = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  // Destructuring incoming data
  const { productName, productDescription, productPrice, productCategory } =
    req.body;

  // // 2. Validation
  if (
    !productName ||
    !productDescription ||
    !productPrice ||
    !productCategory
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields!",
    });
  }
  //Check Product Image
  if (!req.files || !req.files.productImage) {
    return res.status(400).json({
      succes: false,
      message: "Image not found!!",
    });
  }
  const { productImage } = req.files;

  //Uploading
  //generate unique name for each file
  const imageName = `${Date.now()}-${productImage.name}`;

  //define specific path
  const imageUploadPath = path.join(
    __dirname,
    `../public/products/${imageName}`
  );
  //upload to that path (await | trycatch)
  try {
    await productImage.mv(imageUploadPath);

    //save to datanase
    const newProduct = new productModel({
      productName: productName,
      productDescription: productDescription,
      productPrice: productPrice,
      productCategory: productCategory,
      productImage: imageName,
    });

    const product = await newProduct.save();
    res.status(201).json({
      succes: true,
      message: "Product Created Successfully!!",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.json({
      succes: false,
      message: "internal server error",
      error: error,
    });
  }

  // try {
  //   // 4. Check if the product already exists
  //   const existingProduct = await productModels.findOne({ productName });

  //   if (existingProduct) {
  //     return res.status(409).json({
  //       success: false,
  //       message: "Product already exists!",
  //     });
  //   }

  //   // 5. Create new product
  //   const newProduct = new productModels({
  //     productName: productName,
  //     productDescription: productDescription,
  //     productPrice: productPrice,
  //     productCategory: productCategory,
  //     productImage: uploadedImage.secure_url,
  //   });

  //   // 6. Save in the database
  //   await newProduct.save();

  //   // 7. Send a success response
  //   return res.status(201).json({
  //     success: true,
  //     message: "Product created successfully!",
  //     product: newProduct,
  //   });
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json({
  //     success: false,
  //     message: "Internal Server Error!",
  //   });
  // }

  //fetch all products
};
const getAllProducts = async (req, res) => {
  //logic
  //#. try catch
  try {
    //1. find all the products

    const products = await productModel.find({});

    //2. send response
    res.status(201).json({
      success: true,
      message: "Product fetched successfully",
      products: products,
    });
  } catch (error) {
    console.log(error);
  }
};

//fetch single
const getProduct = async (req, res) => {
  //recieve id from the url
  const productId = req.params.id;
  try {
    const product = await productModel.findById(productId);
    // console.log(product);
    res.json({
      succes: true,
      message: "Product Fetched!",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.json({
      succes: false,
      message: "server error!",
    });
  }
};

//delete product
const deleteProduct = async (req, res) => {
  //get prodcut id
  const productId = req.params.id;
  try {
    await productModel.findByIdAndDelete(productId);
    res.status(201).json({
      succes: true,
      message: "Product Deleted!",
      //updatedProductList
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: "internal server error!",
    });
  }
};

//update product
//1.get a update id
//2.if new image is provided
//3.upload (public)
//4.delete old image - delete product
//5.update products
const updateProduct = async (req, res) => {
  try {
    //if there is image delete old image and upload new image
    if (req.files && req.files.productImage) {
      const { productImage } = req.files;

      //Uploading
      //generate unique name for each image
      const imageName = `${Date.now()}-${productImage.name}`;

      //define specific path
      const imageUploadPath = path.join(
        __dirname,
        `../public/products/${imageName}`
      );

      await productImage.mv(imageUploadPath);

      //replace productImage to new name
      req.body.productImage = imageName;

      //delete old image
      //find product information(we have only ID)
      const existingProduct = await productModel.findById(req.params.id);

      //search that image in directory
      if (req.body.productImage) {
        //if new image is uploaded, then only remove old image
        const oldImagePath = path.join(
          __dirname,
          `../public/products/${existingProduct.productImage}`
        );
        //delete from filesystem
        fs.unlinkSync(oldImagePath);
      }
    }
    //update in database
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(201).json({
      succes: true,
      message: "successfully updated",
      updatedProduct: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//pagination
const productPagination = async (req, res) => {
  //Resultperpage
  const resultPerPage = 2;

  // page no (recieved from user)
  const pageNo = req.query.page;

  try {
    const products = await productModel
      .find({})
      .skip((pageNo - 1) * resultPerPage)
      .limit(resultPerPage);

    // if there is no product
    if (products.length === 0) {
      return res.status(400)({
        succes: false,
        message: "No product Found",
      });
    }
    res.status(201)({
      succes: true,
      message: "Product fetched",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: "Server Error",
    });
  }
};

// Exporting
module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  productPagination,
};
