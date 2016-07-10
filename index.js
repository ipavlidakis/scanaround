var Firebase = require('firebase');
var elasticsearch = require('elasticsearch');

var config = {
    firebaseUrl: 'https://scanaround-42693.firebaseio.com/',
    elasticSearchUrl: 'https://pacific-refuge-11944.herokuapp.com/'
}
var rootRef = new Firebase(config.firebaseUrl);

var client = new elasticsearch.Client({
    host: config.elasticSearchUrl
});

var usersRef = rootRef.child('users');

usersRef.on('child_added', upsert);
usersRef.on('child_changed', upsert);
usersRef.on('child_removed', remove);

function upsert(snapshot){
    client.index({
        index: 'firebase',
        type: 'users',
        id: snapshot.key(),
        body: snapshot.val()
    }, function(err, response){
        if(err){
            console.log("Error indexing user : " + error);
        }
    })

}

function remove(snapshot){
    client.delete({
        index: 'firebase',
        type: 'users',
        id: snapshot.key()
    }, function(error, response){
        if(error){
            console.log("Error deleting user : " + error);
        }
    });
}
