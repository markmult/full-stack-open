const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
console.log("Connecting to database...");

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB:  ${error.message}`);
  });

const numberValidators = [
  {
    validator: function (v) {
      return /^\d{2,3}-\d{7,}/.test(v);
    },
    message: (props) => `${props.value} is not a valid`,
  },
];

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: numberValidators,
    minlength: 8,
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
