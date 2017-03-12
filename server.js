// server.js

// BASE SETUP
// =============================================================================

var mongoose = require('mongoose');
mongoose.connect('mongodb://wennan:wennan@ds119020.mlab.com:19020/mtm');//connect to the database (mlab)

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port



// ROUTES FOR OUR API
// =============================================================================

var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to MarktheMap' });   
});



// more routes for our API will happen here



// routes for the marker model

var Marker = require('./app/models/marker');	//calling the marker model

// on routes that end in /markers
// ----------------------------------------------------

router.route('/markers')

    // create a marker (accessed at POST http://localhost:8080/api/markers)
    .post(function(req, res) {
        
        var marker = new Marker();	// create a new instance of the marker model
        marker.title = req.body.title;	// set the marker title
        marker.type = req.body.type;	//set the marker type
        marker.content = req.body.content;	//set the marker content
        marker.author = req.body.author;	//set the marker author
        marker.time = req.body.time;	//set the marker creation time
        marker.xLocation = req.body.xLocation;	//set the x,y location of the marker
        marker.yLocation = req.body.yLocation;

        // save the marker and check for errors
        marker.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Marker created!' });
        });
    })

    // get all the markers (accessed at GET http://localhost:8080/api/markers)
    .get(function(req, res) {
        Marker.find(function(err, markers) {
            if (err)
                res.send(err);

            res.json(markers);
        });
    });

// on routes that end in /markers/:marker_id
// ----------------------------------------------------

router.route('/markers/:marker_id')

    // get the marker with this id (accessed at GET http://localhost:8080/api/markers/:marker_id)
    .get(function(req, res) {
        Marker.findById(req.params.marker_id, function(err, marker) {
            if (err)
                res.send(err);

            res.json(marker);
        });
    })

    // update the marker with this id (accessed at PUT http://localhost:8080/api/markers/:marker_id)
    .put(function(req, res) {

        // use our marker model to find the marker we want
        Marker.findById(req.params.marker_id, function(err, marker) {

            if (err)
                res.send(err);

            marker.title = req.body.title;	//update the marker info
        	marker.type = req.body.type;	
        	marker.content = req.body.content;	
        	marker.author = req.body.author;
        	marker.time = req.body.time;
        	marker.xLocation = req.body.xLocation;	
        	marker.yLocation = req.body.yLocation;

            // save the marker
            marker.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Marker updated!' });
            });

        });
    })

    // delete the marker with this id (accessed at DELETE http://localhost:8080/api/markers/:marker_id)
    .delete(function(req, res) {
        Marker.remove({_id: req.params.marker_id}, function(err, marker) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });




// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);