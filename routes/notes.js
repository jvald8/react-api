var mongo = require('mongodb');
// Require mongodb module

var Server = mongo.Server;
// Fetch mongo server object
var Db = mongo.Db;
// Fetch mongo database object

var server = new Server('localhost', 27017, {auto_reconnect:true});
// Create an instance of a mongo server object that reads on localhost:27017, which
// autoreconnects if the server connection is lost.

var db = new Db('notesdb', server);
// Create an instance of a mongo db object, call is notes, and open it using the server object.


// Open the notes db connection to the server with a callback that asks if there's an error
// If there's no error, console log a succes message, then check to see if that particular db exists.
// If that db exists, then move on. else create a new database named notes and populate it with some data

// If there's an error, say that the connection is down, or couldn't connect.
db.open(function(err, db) {
  if(!err) {
    console.log('connection to the database is a go');
    db.collection('notes', {strict:true}, function(err, collection) {
      if(err) {
        console.log('Couldnt find the db, lets create it and populate it with data');
        populateDb();
      }
    });
  }
});


// The findById function will find and return the notes by id
exports.findById = function(request, response) {
  var id = request.params.id;
  console.log('Getting note # ' + id);

  db.collection('notes', function(err, collection) {
    collection.findOne({'id':parseInt(id)}, function(err, item) {
      console.log(JSON.stringify(item));
      response.send(item);
    });
  });
};

// The findAll function will find and return all the notes
exports.findAll = function(request, response) {
  db.collection('notes', function(err, collection) {
    collection.find().toArray(function(err, items) {
      response.send(items);
    });
  });
};


// the add
exports.addNote = function(request, response) {
  var note = request.body;
  console.log('Adding note: ' + JSON.stringify(note));
  db.collection('notes', function(err, collection) {
    collection.insert(note, {safe:true}, function(err, result) {
      if(err) {
        response.send({'error': 'theres an error'});
      } else {
        console.log('Success: ' + JSON.stringify(result[0]));
        response.send(result[0]);
      }
    });
  });
}

exports.updateNote = function(request, response) {
  var id = request.params.id;
  var note = request.body;
  console.log('updating note with id: ' + id);
  console.log(JSON.stringify(note));
  db.collection('notes', function(err, collection) {
    collection.update({'id':parseInt(id)}, note, {safe:true}, function(err, result) {
      if(err) {
        console.log('theres been an error updating note: ' + err);
        response.send({'error':'theres been an error'});
      } else {
        console.log('' + result + 'documents updated');
        response.send(note);
      }
    });
  });
}

exports.deleteNote = function(request, response) {
  var id = request.params.id;
  console.log('deleting note with id :' + id);
  db.collection('notes', function(err, collection) {
    collection.remove({'id':parseInt(id)}, {safe:true}, function(err, result) {
      if(err) {
        response.send({'error':'theres been an error - ' + err});
      } else {
        console.log('successfully deleted note: ' + id);
        response.send(request.body);
      }
    });
  });
}

exports.findByUsername = function(request, callback) {
  console.log(request);
  console.log('Getting username ' + request);
  var username = request;

  db.collection('users', function(err, collection) {
    collection.findOne({'username':username}, function(err, user) {
      console.log(JSON.stringify(user));
      console.log(user);
      callback(null, user);
    });
  });
};


/*populates a database if there isn't any*/
var populateDb = function() {
  var notes = [
    {
        name: 'First Note',
        id:1
    },
    {
        name: 'Second note',
        id:2
    }];

    db.collection('notes', function(err, collection) {
        collection.insert(notes, {safe:true}, function(err, result) {});
    });

};



/* cURL commands for testing, make sure types are correct
Get all notes:
curl -i -X GET http://localhost:3001/notes
Get note with id value of 1 (use a value that exists in your database):
curl -i -X GET http://localhost:3001/notes/1
Delete note with id value of 1:
curl -i -X DELETE http://localhost:3001/notes/1
Add a new note:
curl -i -X POST -H 'Content-Type: application/json' -d '{"id":"1","name": "firstNote"}' http://localhost:3001/notes/1
Modify note with id value of 1:
curl -i -X PUT -H 'Content-Type: application/json' -d '{"id":"1","name": "firstNote"}' http://localhost:3000/notes/1
*/
