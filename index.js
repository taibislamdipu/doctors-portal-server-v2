const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.is4kq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000

const app = express()

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Doctors Portal Database is Running!!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("doctorsPortalDB").collection("appointments");

    console.log('doctors portal db connected successfully!!');

    // post appointment to server
    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        appointment.status = "pending";
        appointment.prescription = null;
        console.log(appointment);

        appointmentCollection.insertOne(appointment)
            .then((result) => {
                res.send(result.insertedCount > 0)
            })
    })

    // read all appointments data from database
    app.get('/appointments', (req, res) => {
        appointmentCollection.find()
            .toArray((err, documents) => {
                res.send(documents)
            })
    })



});




app.listen(process.env.PORT || port, console.log('Database Running on Port', port))
