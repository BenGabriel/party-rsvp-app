const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { check, validationResult } = require("express-validator");
//Guet model
const Guest = require("../model/guest");

router.get("/", auth, async (req, res) => {
  try {
    const guests = await Guest.find({ user: req.user.id });
    res.json(guests);
  } catch (err) {
    console.err(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    check("name", "Please provide a name").not().isEmpty(),
    check("phone", "Please provide a phone number").not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).json({ error: error.array() });
    }
    const { name, phone, dietary, isConfirmed } = req.body;
    try {
      let guest = new Guest({
        user: req.user.id,
        name,
        phone,
        dietary,
        isConfirmed,
      });

      guest = await guest.save();
      res.json(guest);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    let guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ msg: " Guest Not Found" });
    }
    await Guest.findByIdAndRemove(req.params.id);
    res.send("guest removed");
  } catch (err) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.put("/:id", auth, async (req, res) => {
  const { name, phone, dietary, isConfirmed } = req.body;
  const updatedGuest = { name, phone, dietary, isConfirmed };
  try {
    let guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ msg: " Guest Not Found" });
    }

    guest = await Guest.findByIdAndUpdate(
      req.params.id,
      { $set: updatedGuest },
      { new: true }
    );
    res.send(guest);
  } catch (err) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// router.get("/:id", auth, async (req, res) => {
//   let guest = await Guest.findById(req.params.id);
//   if (!guest) {
//     return res.status(404).json({ msg: " Guest Not Found" });
//   }
//   res.send(guest);
// });

// router.get("/get", async (req, res) => {
//   let guest = await Guest.find({}).select("-user");
//   if (!guest) {
//     return res.status(404).json({ msg: " Guest Not Found" });
//   }
//   res.send(guest);
// });
module.exports = router;
