var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

/// Port info
const LOCAL_PORT = 8000; 

/// Database info
const DB_USERNAME = 'admin';
const DB_PASSWORD = '123Password123';
const DB_CLUSTER = 'tcslearningcluster';
const DB_NAME = 'ShoppingDB';
const DB_URI = "mongodb+srv://" + DB_USERNAME + ":" + DB_PASSWORD + "@" + DB_CLUSTER + ".dfefc.mongodb.net/" + DB_NAME + "?retryWrites=true&w=majority";
const DB_COLLECTION_PRODUCTS = 'CProducts';
const DB_COLLECTION_USERS = 'CUsers';

/// Mongo Database Object
var DB_dataBase;

/// Start Application services
var app = express();
app.use(
    bodyParser.json(), 
    express.static(__dirname + '/dist/'),
    function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-with, content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    }
);

/// Error Handler
function handleError(res, reason, message, code){
    console.log('Error: '+reason);
    res.status(code || 500).json({'error': message});
}

/// Init the server
mongodb.MongoClient.connect(process.env.MONGODB_URI || DB_URI, 
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }, function(error, client) {

        // If error, log it and close
        if(error) {
            console.log(error);
            process.exit(-1);
        }

        // Save database Object
        DB_dataBase = client.db();
        console.log('Connection to MongoDB successful!');
        
        // Initialize the application
        var server = app.listen(process.env.PORT || LOCAL_PORT, () =>{
            console.log("Application running on PORT:", server.address().port);
        });
    }
);

/**
 * http routing: /api/status
 * GET: Retrieves Server Status
 */
app.get('/api/status', function(req, res){
    res.status(200).json({status: "Server Running!"});
});

////////// Product Server Services

/**
 * http routing: /api/products
 * GET: finds all products
 */
app.get('/api/products', function(req, res){
    DB_dataBase.collection(DB_COLLECTION_PRODUCTS).find({}).toArray(function(error, data){
        if(error){
            handleError(res, error.message, 'Failed to retriev Products.');
        } else {
            res.status(200).json(data);
        }
    });
});

/**
 * http routing: /api/products
 * POST: creates a new product
 */
app.post('/api/products', function(req, res){
    var product = req.body;

    if(!product.name)
        handleError(res, 'Invalid product input', 'Name is mandatory.', 400);
    else if(!product.brand)
        handleError(res, 'Invalid product input', 'Brand is mandatory.', 400);
    else {
        DB_dataBase.collection(DB_COLLECTION_PRODUCTS).insertOne(product, function(err, doc){
            if(err)
                handleError(res, err.message, 'Failed to create new product.');
            else
                res.status(201).json(doc.ops[0]);
        });
    }
});

/**
 * http routing: /api/products/:id
 * DELETE: deletes product by id
 */
app.delete('/api/products/:id', function(req, res){
    if(req.params.id.length > 24 || req.params.id.length < 24)
        handleError(res, 'Invalid product ID', 'ID must be 24 characters in length.', 400);
    else {
        DB_dataBase.collection(DB_COLLECTION_PRODUCTS).deleteOne({_id: new mongodb.ObjectID(req.params.id)}, function(err, result){
            if(err)
                handleError(res, err.message, 'Failed to delete the specified product.');
            else
                res.status(200).json(req.params.id);
        });
    }
});

////////// User Server Services

/**
 * http routing: /api/user
 * GET: finds all user
 */
app.get('/api/user', function(req, res){
    DB_dataBase.collection(DB_COLLECTION_USERS).find({}).toArray(function(error, data){
        if(error){
            handleError(res, error.message, 'Failed to retriev Members.');
        } else {
            res.status(200).json(data);
        }
    });
});

app.post('/api/users/authenticate', function(req, res) {
    DB_dataBase.collection(DB_COLLECTION_USERS).findOne({ 
        "name": req.body.username , 
        "password": req.body.password, 
        "type": req.body.type}, 
        function(err, result){
            if(err){
                handleError(res, error.message, 'Failed to retrieve Member matching user info.');
            } else {
                console.log('Retrieved User:', result);
                res.status(200).json(result);
            }
    });
});

/**
 * http routing: /api/user
 * POST: creates a new user
 */
app.post('/api/user', function(req, res){
    var user = req.body;
    if(!user.name)
        handleError(res, 'Invalid user input', 'Name is mandatory.', 400);
    else if(!user.email)
        handleError(res, 'Invalid user input', 'Email is mandatory.', 400);
    else if(!user.password)
        handleError(res, 'Invalid user input', 'Password is mandatory.', 400);
    else if(!user.type)
        handleError(res, 'Invalid user input', 'Type is mandatory.', 400);
    else {
        DB_dataBase.collection(DB_COLLECTION_USERS).insertOne(user, function(err, doc){
            if(err){
                handleError(res, err.message, 'Failed to create new user.');
            }
            else{
                console.log('Created User:', doc.ops[0]);
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

/**
 * http routing: /api/user/:id
 * DELETE: deletes user by id
 */
app.delete('/api/user/:id', function(req, res){
    if(req.params.id.length > 24 || req.params.id.length < 24)
        handleError(res, 'Invalid user ID', 'ID must be 24 characters in length.', 400);
    else {
        DB_dataBase.collection(DB_COLLECTION_USERS).deleteOne({_id: new mongodb.ObjectID(req.params.id)}, function(err, result){
            if(err)
                handleError(res, err.message, 'Failed to delete the specified member.');
            else
                res.status(200).json(req.params.id);
        });
    }
});