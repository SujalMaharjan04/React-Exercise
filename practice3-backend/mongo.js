const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://maharjansujal100:${password}@cluster0.hvhmrmd.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
    content: 'HTML is easy',
    important: true,
})

const note1 = new Note ({
    content: 'PUT and GET Request',
    important: false,
})

const note2 = new Note ({
    content: 'MongoDB',
    important: false,
})

// note.save().then(result => {
//     console.log('note saved!');
// })

// note1.save().then(result => {
//     console.log('note1 saved');
// })

// note2.save().then(result => {
//     console.log('note2 saved');
//     mongoose.connection.close();
// })

Note.find({
    important: true
}).then(result => {
    result.forEach(element => {
        console.log(element)
    });

    mongoose.connection.close();
})
