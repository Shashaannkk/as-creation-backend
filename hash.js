// hash.js
const bcrypt = require("bcryptjs");

const password = "wuAppr9q7gU0WS0k123"; // change this to your real admin password

bcrypt.genSalt(10, (err, salt) => {
  if (err) throw err;

  bcrypt.hash(password, salt, (err, hash) => {
    if (err) throw err;
    console.log("Password hash:", hash);
  });
});
