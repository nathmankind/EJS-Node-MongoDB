const express = require("express");
const Order = require("../models/order");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const phoneRegex = /^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/;
const validateRegex = (userInput, regexExp) => {
  if (regexExp.test(userInput)) {
    return true;
  } else {
    return false;
  }
};

const validatePhoneField = (value) => {
  if (!validateRegex(value, phoneRegex)) {
    throw new Error("Phone number should be in the format xxx-xxx-xxxx");
  }
  return true;
};

const formValidation = [
  check("name", "Must have a name").not().isEmpty(),
  check("phone").custom(validatePhoneField),
  check("address", "Enter an address").not().isEmpty(),
  check("mangoJuices", "Mango Juices : Enter a valid number")
    .optional({ checkFalsy: true })
    .isNumeric(),
  check("berryJuices", "Berry Juices: Enter a valid number")
    .optional({ checkFalsy: true })
    .isNumeric(),
  check("appleJuices", "Enter a valid number for apple juices")
    .optional({ checkFalsy: true })
    .isNumeric(),
];

const productPrice = {
  mangoJuices: 2.99,
  berryJuices: 1.99,
  appleJuices: 2.49,
};

router.post("/", formValidation, async (req, res) => {
  const { name, phone, address, mangoJuices, berryJuices, appleJuices } =
    req.body;
  const errors = validationResult(req);

  let itemSum =
    Number(mangoJuices ?? 0) +
    Number(berryJuices ?? 0) +
    Number(appleJuices ?? 0);
  const checkItemSum = () => {
    if (itemSum < 1) {
      return {
        type: "field",
        value: "",
        msg: "You must purchase at least one item",
        path: "product",
        location: "body",
      };
    }
    return true;
  };
  const itemsErr = checkItemSum();

  console.log("itemsErr", itemsErr);
  if (!errors.isEmpty() || itemsErr !== true) {
    console.log([...errors.array(), itemsErr]);
    res.render("form", {
      errors: [...errors.array(), itemsErr],
    });
    return;
  } else {
    try {
      const subTotal =
        productPrice["mangoJuices"] * mangoJuices +
        productPrice["berryJuices"] * berryJuices +
        productPrice["appleJuices"] * appleJuices;

      const tax = subTotal * 0.13;
      const total = subTotal + tax;
      let data = {
        name,
        phone,
        address,
        mangoJuices: mangoJuices ?? 0,
        berryJuices: berryJuices ?? 0,
        appleJuices: appleJuices ?? 0,
        subTotal,
        tax,
        total,
      };
      const myOrder = new Order({
        name,
        phone,
        address,
        mangoJuices: !!mangoJuices ? mangoJuices : 0,
        berryJuices: !!berryJuices ? berryJuices : 0,
        appleJuices: !!appleJuices ? appleJuices : 0,
      });
      await myOrder.save();
      req.session.message = {
        type: "success",
        message: "Order created successfully!",
      };
      res.render("form", {
        ...data,
        message: {
          type: "success",
          message: "Order created successfully!",
        },
      });
    } catch (error) {
      throw new Error("An error occured!");
    }
  }
});
router.get("/", (req, res) => {
  res.render("form");
});

router.get("/orders", async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.render("all-orders", { allOrders });
  } catch (error) {
    throw new Error("An error occured!");
  }
});

router.get("/delete/:id", async (req, res) => {
  let id = req.params.id;

  try {
    await Order.findByIdAndDelete(id);
    req.session.message = {
      type: "success",
      message: `User with ID: ${id} has been deleted successully`,
    };
    res.redirect("/orders");
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
