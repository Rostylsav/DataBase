
/**
* Connecting modules of nodde.js
*/  
var express = require('express'),
    app = express(),
    restify = require('restify'),
    server = restify.createServer({ name: 'my-api' }),
    save = require('save'),
    saveJson = require('save-json'),
    _ = require('lodash'),
    userSave = save('user', { engine: saveJson('user.json') });

     userSave.create(
        {
            name : 'Rostyslav Paslavskyy',
            login : 'admin',
            password : 'admin',
            workPlace : 'SoftServe',
            addres : 'Lviv ',
            tel : '0992363934',
            skype : 'S-a-c-h-o-k1',
            email : 'pas.ros.bor@gmail.com',
            logIN : false,
            tasks : [
                {
                    "id": 1,
                    "task": "qweqwe",
                    "status": false
                },
                {
                    "id": 2,
                    "task": "qweqwe",
                    "status": false
                },
                {
                    "id": 3,
                    "task": "werwer",
                    "status": false
                },
                {
                    "id": 4,
                    "task": "ertert",
                    "status": false
                }
            ]
        },
        function(){}
      );
      userSave.create(
        {
            name : 'Igor Paslavskyy',
            login : 'IgorKo',
            password : 'igor123',
            workPlace : 'SoftServe',
            addres : 'Lviv ',
            tel : '0509984827',
            skype : 'IgorKo',
            email : 'IGOR@gmail.com',
            logIN : false,
            tasks : [
                {
                    "id": 1,
                    "task": "123",
                    "status": false
                },
                {
                    "id": 2,
                    "task": "321",
                    "status": false
                },
                {
                    "id": 3,
                    "task": "234",
                    "status": false
                },
                {
                    "id": 4,
                    "task": "234235345",
                    "status": false
                }
            ]
        },
        function(){}
      );



server
  .use(restify.fullResponse())
  .use(restify.bodyParser())

function filter(array){
    array.map(function (item){
        item.password = '';
        return item;
    });
    return array;
}

server.get('/user', function (req, res, next) {
    userSave.find({}, function (error, users) {
        var clonUsers = _.cloneDeep(users); 
        res.send(filter(clonUsers));
    });
});


/**
* Creates a new user with paramenters user, name, _id,  if a user does not exist
*/
server.post('/user', function (req, res, next) {    
    userSave.find({login : req.params.login}, function (error, users) {
       // if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
        if(users && users.length > 0){
            res.send(501);
        }
        else{
             userSave.create(req.params, function (error, user) {
                if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
                res.send(201, user)
            });
        }
    });
});



/**
* Checks whether the user exists. then validates the password
*/
server.post('/loginAndPassword', function (req, res, next){
        userSave.find(req.params, function (error, users){
                if(users && users.length > 0){
                    if(users[0].login === 'admin' && users[0].password === 'admin'){
                      userSave.find({}, function (error, users) {
                            var clonUsers = _.cloneDeep(users); 
                            res.send(filter(clonUsers));
                        });
                    }
                    else{
                     res.send(users[0]);
                    }
                }
                else{
                   res.send(502); 
                }
            
        });
    }
)

server.post('/islogin', function (req, res, next){
        userSave.find(req.params, function (error, users){
            if(users && users.length > 0){
                    res.send(users[0]);
            }
        });
    }
)

/**
* Updata status of  user by id
*/
server.put('/user', function (req, res, next) {
    userSave.update( req.params, function (error, user) {
            if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
            res.send(200, user);
    });
});

/**
*Delete  user by id
*/
server.del('/user', function (req, res, next) {
    userSave.delete( req.params.id, function (error, user) {
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
        res.send()
      })
});

/**
*Get all fikes.
*/
app.use(express.static(__dirname));

/**
*Run servers
*/
server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url)
})
app.listen(5000);










