// modules import
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// start express app
var app = express();


// configure app
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// set port
var port = process.env.PORT || 8080;

// db connect
mongoose.connect('mongodb://johnamusi:johnamuesi@ds059155.mongolab.com:59155/amuesiconference')



/****** Speaker API  ******/


var Speaker =  require('./server/models/speaker');

// define api routes

//start router
var router = express.Router();

// simple middleware for all routes
router.use(function(req, res, next){
    console.log('action completed by server');
    
    // next ensures routing doesnt stop here
    next();
});

// default message on api
router.get('/', function(req, res){
    res.json({message: "API Online"});
});


// when accessing speakers route
router.route('/speakers')


.post(function(req, res){
    
    //new instance of Speaker model
    var speaker = new Speaker();
    
    // set speaker properties from reqeust body
    speaker.name = req.body.name;
    speaker.company = req.body.company;
    speaker.title = req.body.title;
    speaker.description = req.body.description;
    speaker.picture = req.body.picture;
    speaker.schedule = req.body.name;
    speaker.name = req.body.name;
    
    
    // save speaker data
    speaker.save(function(err){
        if(err){
            res.send(err);
        }
       res.json({message: 'speaker added'}); 
    });
    
})

// get all the speakers 
.get(function(req, res) {
  Speaker.find(function(err, speakers) {
    if (err)
      res.send(err);

    res.json(speakers);
  });
})

// speaker route by id
router.route('/speakers/:speaker_id')

.get(function(req, res) {
  Speaker.findById(req.params.speaker_id, function(err, speaker) {
    if (err)
      res.send(err);
      res.json(speaker);
    });
})
// update the speaker by id

.put(function(req, res){
    
    Speaker.findById(req.params.speaker_id, function(err, speaker){
        if(err)
            res.send(err);
        
        
        // set the speakers properties (comes from the request)
          speaker.name = req.body.name;
          speaker.company = req.body.company;
          speaker.title = req.body.title;
          speaker.description = req.body.description;
          speaker.picture = req.body.picture;
          speaker.schedule = req.body.schedule;
        
        
        // save the speaker
        speaker.save(function(err){
            if(err)
                res.send(err);
                //success
                res.json({message: 'speaker updated'});
        });
        
    });
    
})

// delete speaker by id
.delete(function(req, res){
    Speaker.remove({
        _id: req.params.speaker_id
    }, function(err, speaker){
        if(err){
            res.send(err)
        }
        res.json({message: "speaker deleted"});
    })
})


// register the route
app.use('/api', router);

// start server
app.listen(port);
console.log('server running on '+ port);