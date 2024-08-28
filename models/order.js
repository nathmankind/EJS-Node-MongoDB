const mongoose = require("mongoose");


//name, phone, address, mangoJuices, berryJuices, appleJuices
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  mangoJuices:{
    type:Number,
    require:true
  },
  berryJuices:{
    type:Number,
    require:true
  },
  appleJuices:{
    type:Number,
    require:true,
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
