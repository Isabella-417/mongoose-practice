require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


var personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});
let Person = mongoose.model("Person", personSchema);

//#2) create and save record model
const createAndSavePerson = (done) => {
  const person = new Person({name: 'Annie', age: 25, favoriteFoods: ['Sushi','French Fries']});

  person.save((error, data) => {
    if(error) done(error,null);
    done(null,data);
  })
};
//#3) Create Many Records
const createManyPeople = async(arrayOfPeople, done) => {
  console.log(arrayOfPeople)
  try{
    const people = await Person.create(arrayOfPeople);
    done(null, people);
  }catch(error){
    done(error,null);
  } 
};
//#4) Use find model
const findPeopleByName = async (personName, done) => {
  Person.find({ name: personName}, (err, docs) => {
    if(err) {
      done(err,null);
    }else {
      done(null,docs)
    };
  });
};

//#5) Use findOne model
const findOneByFood = (food, done) => {
   Person.findOne({ favoriteFoods: food}, (err, doc) => {
    if(err) {
      done(err,null);
    }else {
      done(null,doc)
    };
  });
};

//#6) Use findById model
const findPersonById = async(personId, done) => {
  const person = await Person.findById(personId).exec();
  if(person) done(null,person);
  else done("Not found", null);
};

//#7) find edit and save
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId,(err,res) => {
    if(err){
      done(err,null);
    }else{
      res.favoriteFoods.push(foodToAdd);
      res.save((err,updated) => {
        if(err) done(err,null);
        done(null,updated);
      })
    }
  })
};

//#8) find edit and save with findOneAndUpdate
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  const query = { name: personName };
  Person.findOneAndUpdate(query, { age: ageToSet }, { new: true }, (err,res) =>{
    if(err) done(err,null);
    else done(null,res);
  })
};

//#9) Removing by id (one)
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err,res) => {
    if(err) done(err,null);
    else done(null,res);
  });
};

//#10) Removing by name (more than one)
const removeManyPeople = async (done) => {
  const nameToRemove = "Mary";
  const res = await Person.remove({ name: nameToRemove });
  if(res) {
    done(null,res);
  }else{
    done('Error during operation',null);
  }
};

//#11) Chain Search Query Helpers
const queryChain = async (done) => {
  const favoriteFoods = "burrito";
  let person = await Person.find({ favoriteFoods: favoriteFoods }).sort({ name: 1}).limit(2).select('name favoriteFoods');
  if(person) done(null,person)
  else done('Error during operation',null);
};


exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
