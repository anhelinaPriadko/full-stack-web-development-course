const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://fullstack:${password}@ac-y8033rp-shard-00-00.dootyfu.mongodb.net:27017,ac-y8033rp-shard-00-01.dootyfu.mongodb.net:27017,ac-y8033rp-shard-00-02.dootyfu.mongodb.net:27017/?ssl=true&replicaSet=atlas-rn0z2x-shard-0&authSource=admin`
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Please provide the correct arguments: node mongo.js <password> <name> <number>')
  mongoose.connection.close()
}