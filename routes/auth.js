const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware");

//user model
const User = require("../model/User");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Please provide 6 characters long password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //not registered user
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User is not Registered" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.send({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server Error");
    }
  }
);

module.exports = router;
