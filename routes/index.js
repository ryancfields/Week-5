const { Router } = require("express");
const router = Router();

router.use("/login", require("./login"));
router.use("/items", require("./items"));
router.use("/orders", require("./orders"));

router.use((error, req, res, next) => {
  const errString = error.toString();

  if (errString.includes("E11000")) {
    return res.status(409).json({ err: "Confict: Duplicate Values." });
  } else if (errString.includes("jwt" || "token")) {
    return res.status(401).json({ err: "token error" });
  } else if (errString.includes("Cannot read property")) {
    return res.status(400).json({ err: "bad item" });
  } else {
    return res.status(500).json({ err: errString });
  }
});

module.exports = router;
