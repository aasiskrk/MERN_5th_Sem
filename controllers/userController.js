// Make a function (logic)
const userModels = require("../models/userModels");
const bcrypt = require("bcrypt");
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

//exporting
module.exports = {
  creatUser,
};
