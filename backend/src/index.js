const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes');
const http = require('http');
const { setupWebsocket } = require('./websocket')

const app = express();
const server = http.Server(app)

setupWebsocket(server);



mongoose.connect('mongodb+srv://tickedev:popgg2w8z7gg@cluster0-9vtgm.mongodb.net/semana10?retryWrites=true&w=majority',
{   
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
app.use(cors())
app.use(express.json());
app.use(routes);

server.listen(3334);