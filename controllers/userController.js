// Make a function (logic)
const userModels = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// 1. Creating User Function

const creatUser = async (req, res) => {
  //1. Get data from the user(fname,lname,email,pp)
  console.log(req.body);

  //#. Destructuring
  const { firstName, lastName, email, password } = req.body;
  //2. Validation
  //2.1 If not : Send the reponse and stop the process

  if (!firstName || !lastName || !email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  // Try - Catch (Error Handling)
  try {
    //4. Check existing user
    //check if the user is already exists
    const existingUser = await userModels.findOne({ email: email });

    //4.1 if yes : Send response and stop the process
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists!",
      });
    }
    //5. if not:
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal Server Error!",
    });
  }

  //hash the password
  const randomSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, randomSalt);

  //If proper data
  const newUser = new userModels({
    //fields : valuse reciveced from user
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  });

  //6. Save in the database
  await newUser.save();

  //7. Send a success reponse
  res.json({
    success: true,
    message: "User Created successfully!",
  });
};

//Login User Function
const loginUser = async (req, res) => {
  //checking incoming data
  console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }
  try {
    //1. find user, if not : stop the process
    const user = await userModels.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not Found",
      });
    }
    //2. Compare the password, if not :stop the process
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({
        success: false,
        message: "Incorrect Password",
      });
    }
    //3. generate JWT token

    //3.1 Secret Decryption key(.env)
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    //4. Send the token, userData , Message to the user
    res.json({
      success: true,
      message: "User Logged Successful!",
      token: token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

//exporting
module.exports = {
  creatUser,
  loginUser,
};
