const userModel = require("../models/user.model");

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password,
}) => {
  if (!firstname || !email || !password) {
    throw new Error("All fields are required");
  }

  try {
    // Create a new user and await the result
    const user = await userModel.create({
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
    });

    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};
