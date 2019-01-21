//var http = require('http');

var express = require('express');
var mongoose = require("mongoose");
var path = require("path");
var crypto = require("crypto");
var request = require("request");
var session = require('express-session');
var nodemailer = require("nodemailer");
var schema = require("./schema.js");
var XLSX = require('xlsx');
var multer  =   require('multer');
var MemoryStore = require('session-memory-store')(session);

var app = express();
var makeid = function() {
  
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
  
};


var storage =   multer.diskStorage({
  
  
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, './static/excel'));
  },
  filename: function (req, file, callback) {
    
    callback(null, file.fieldname + '-' + Date.now());
    
  }
  
  
});

// require bodyParser since we need to handle post data for adding a user

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./static"))); // static content
app.use(session(
  {
    
    secret: makeid(), 
    store: new MemoryStore(),
    proxy: true,
    resave: true,
    saveUninitialized: true
    
  }));
  
app.set('views', path.join(__dirname, './views')); // set the views folder and set up ejs
app.set('view engine', 'ejs');
app.use( express.static( "public" ) );


// var mongoPassword = 'lampard';
// var mongoUser = "fa836bc00c91f8d40a901c2a759bbd2c";



// console.log( "stopping" );
// return;



var mongoPassword = "lampard";
var mongoUser = "fa836bc00c91f8d40a901c2a759bbd2c";

var mongoHostString = "4a.mongo.evennode.com:27017/fa836bc00c91f8d40a901c2a759bbd2c";
var connect = null;
var sess;
const wit_api = "https://api.wit.ai/"; 
const domain = "localhost:8000";
const {Wit, log} = require('node-wit');
const fb = require('fb');


try{
  console.log("connected");
  connect = mongoose.connect("mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoHostString);  
}
catch(e){ 

  console.log(e.message);
  console.log("error in connecting");

}


//return; 


var isSessionActive = function(bot_username,email){
  
  if(bot_username == undefined && email == undefined)
    return false;
  else
    return true;
  
  
};
var emailSender = function(to,subject,message){
  
      
    let transporter = nodemailer.createTransport({
      
      service: 'Gmail',
      auth: {
          type: 'OAuth2',
          clientId: "273107785701-qqsjvi5etdtkgr2svofoei9mgh5kbnht.apps.googleusercontent.com",
          clientSecret: "mSNxdzKJ2ITFaD6753ecuXDd"
      }
      
    });
    
    
    // transporter.on('token', token => {
      
    //   console.log('A new access token was generated');
    //   console.log('User: %s', token.user);
    //   console.log('Access Token: %s', token.accessToken);
    //   console.log('Expires: %s', new Date(token.expires));
    
      
    // });
  
    // setup e-mail data with unicode symbols
    let mailOptions = {
        
      from    : "noreply@test.com", // sender address
      to      : to, // list of receivers
      subject : subject, // Subject line
      text    : '', // plaintext body
      html    : message, // html body

      auth : {
        
          user         : "osahonmichael93@gmail.com",
          refreshToken : "1/coepXN8FKcFOtHD1WntsBFlrCmejnh4mQSUCs4DXbFPhZjHyoCxW2MGS6R1MC22-",
          accessToken  : "ya29.GlvKBPeXiA6-IfE98AQU1A4RwEAvo5oR1yLS96nZOXdmZaz1SoAeR_2_Nysc9FXb_WANRy9DX1OOEBH7NhU0jb4KAfOMefeDH5KsxMToUa5R3KI6IKrNzdwzasaA",
          expires      : 1494388182480
          
      }
      
      
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
      
      
  
};
var sideBar = function(role){
  
  
  
  var bar = "";
  if(role == 1)
    bar = "<div class='sidebar' data-color='purple' data-image='/img/sidebar-1.jpg'><div class='logo'><img src='' style='width:10%;height:auto' /></div><div class='sidebar-wrapper'><ul class='nav'><li><a href='/dashboard'><i class='material-icons'>dashboard</i><p>Dashboard</p></a></li>  <li><a href='/bots'><i class='material-icons'>bubble_chart</i><p>Bots</p></a></li>  <li><a href='/integrations'><i class='material-icons'>bubble_chart</i><p>Integrations</p></a></li>  <li><a href='/role_manager'><i class='material-icons'>bubble_chart</i><p>Role Manager</p></a></li>  <li><a href='/users'><i class='material-icons'>person</i><p>Users</p></a></li><li><a href='javascript:support();'><i class='material-icons'>settings</i><p>Support</p></a></li></ul></div></div>";
  else
    bar = "<div class='sidebar' data-color='purple' data-image='/img/sidebar-1.jpg'><div class='logo'><img src='' style='width:30%;height:auto' /></div><div class='sidebar-wrapper'><ul class='nav'><li><a href='/bots'><i class='material-icons'>bubble_chart</i><p>Bots</p></a></li>  <li><a href='javascript:support();'><i class='material-icons'>settings</i><p>Support</p></a></li></ul></div></div>";
    
    
  return bar;
  
  
};
var headerBar = function(name,role){
  
  
  var role_str = "";
  if(role == 0)
    role_str = "<strong> (Primary)</strong>";
  else
    role_str = "<strong> (Secondary)</strong>";
  
  
  var header = "<ul class='nav navbar-nav navbar-right' style='margin-left:-15%;'><li><a href='javascript:history.go(0)' class='dropdown-toggle' data-toggle='dropdown'><p class='hidden-lg hidden-md'>Dashboard</p></a></li>  <li class='dropdown'><a href='#' class='dropdown-toggle' data-toggle='dropdown'><i class='material-icons'>notifications</i><span class='notification'>0</span> <p class='hidden-lg hidden-md'>Notifications</p> </a></li>  <li><a href='#pablo' class='dropdown-toggle' data-toggle='dropdown'><h6 style='margin-top:-2%'>"  + name + role_str + "</h6></a></li> <li><a href='/signout'><button class='btn btn-primary btn-round' type='button' style='margin-top:-12%;'>Sign Out</button></a></li> </ul><div align='center'>  <form class='navbar-form' role='search'><div class='form-group is-empty'><input type='text' class='form-control' placeholder='Search'><span class='material-input'></span></div><button type='submit' class='btn btn-white btn-round btn-just-icon'><i class='material-icons'>search</i><div class='ripple-container'></div></button></form></div>";
  return header;


}
var sentenceCase = function(value){
  
  
  var first_char;
  var rem_char;
  var output;
  
  
  if(value.length > 0){
    
    
    first_char = value[0].toUpperCase();
    rem_char = value.substring(1,value.length).toLowerCase();
    output = first_char+rem_char;
    
  }
  else
  {
    output = value;
  }
  
  return output;
  
}
var logKnowledge = function(value, knowledge_type, bot_name, email, status, status_desc,create_type){
  
  
  var log_data = {

    value: value,
    knowledge_type: knowledge_type,
    bot_name: bot_name.toLowerCase(),
    created_by: email,
    date_created: new Date().getDate(),
    status: status,
    status_desc: status_desc,
    create_type: create_type

  };
  
  
  var KnowledgeInsert = new schema.LogKnowledge(log_data);
  KnowledgeInsert.save(function(err){
    
    
    if(!err){
      //console.log("Knowledge status logged successfully. ");
    }
    else
    {
      //console.log("An error occured in logging the knowledge. ");
    }
    
    
  });
  

};
var formatCategory = function(cat_name){
  
  
  if(cat_name != undefined && cat_name.length > 0){
    
    
    cat_name = cat_name.replace(new RegExp(" ", "g"),"_");
    cat_name = cat_name.replace(new RegExp("'", "g"),"_");
    cat_name = cat_name.replace(new RegExp("&", "g"),"_");
    
    return cat_name;
    
    
  }
  
  
};


var createKeyword = function(keyword,bot_id,cat_id,sess,val,inp_sim_ques){
  

  
  return new Promise((resolve, reject) => {
    
    
    var msg,msg_status;
    if(keyword == ""){
      
      msg_status = -1;
      msg = "Question cannot be empty. ";
      //console.log(msg);
      return resolve(msg_status);
      
    }
    else{
      
      
      // submit the questions
      
      keyword = keyword.trim();
      schema.Keywords.find({name:keyword,cat_id:cat_id,bot_id:bot_id},function(err,keywords){
        
        
        if(!err){
          
          // console.log( keyword );
          // console.log( "cat_id" +  cat_id );
          // console.log( "bot_id" + bot_id );
          
          // return;
        
        
          if(keywords.length > 0){
            
            

            msg = "It appears this keyword already exists. ";
            msg_status = -1;
            logKnowledge(keyword,"keyword","",sess.email,msg_status,msg,"bulk");
            
            
          }
          
          else
          {
          
            var keyword_data = {
        
              
              name: keyword,
              cat_id: cat_id,
              bot_id: bot_id,
              username: sess.username,
              date_created: new Date().getDate(),
              created_by: sess.email,
              approved: 1,
              approved_by: sess.email,
              comment: ""
              
        
            };
            var KeywordIns = new schema.Keywords(keyword_data);
            KeywordIns.save(function(err,data){
              
              
              
              console.log(data);
              
              
              if(!err){
                
                // insert it into wit
                
                var bot_token,cat_name;
                schema.BotSetup.find({_id:bot_id},function(err, bot){
                  
                  
                  if(!err){
                    
                    if(bot.length > 0){
                      bot_token = bot[0].token;  
                    }
                    else
                    {
                      bot_token = "";
                    }
                    
                    //console.log(bot);
                    
                    schema.Categories.find({_id:cat_id},function(err, cat){
                      
                      if(!err){
                        
                        
                        if(cat.length > 0)
                          cat_name = cat[0].name;
                        else
                          cat_name = "";
                        
                        
                        var url = wit_api + "entities/" + cat_name + "/values";
                        url = url.replace(new RegExp(" ", "g"),"_");
                        var json_entity = {
                  
                          "value":keyword
                  
                        };
                        
                        
                        request({
                  
                          
                          url: url,
                          method: "POST",
                          json: true,
                          headers: {
                    
                              "authorization": "Bearer " + bot_token,
                              "content-type": "application/json",
                    
                          },
                          body: json_entity
                          
                        }, 
                              
                        function(err,response,body){
                  
                  
                          if(!err){
                            
                            if(response.body.builtin == false){
                              
                              
                              
                              msg = "Question has been added successfully. ";
                              msg_status = 1;
                              
                         
                            }
                            else
                            {
                              
                              msg = "An error occured in entering this question. ";
                              msg_status = -1;
                              
                            }
                            
                            //resolve(msg_status);
                            logKnowledge(keyword,"keyword","",sess.email,msg_status,msg,"bulk");
                            
                            //res.send( {msg:msg,msg_status:msg_status} );
                            // it is at this point that you should submit the answers
                            
                            var keyword_id = data._id;
                            
                            schema.Values.find({keyword_id:keyword_id,value:val, bot_id:bot_id},function(err,values){
                                        
                                        
                                    if(!err){
                                      
                                      
                                      //console.log(keyword_id);
                                      //console.log(values);
                                  
                                      
                                      if(values.length > 0){
                                        
                                        
                                        //console.log("value already exist");
                                        
                                        
                                        //means that the value has already been inserted
                                        
                                        msg = "A value for this keyword/question already exists. ";
                                        msg_status = -1;
                                        
                                        logKnowledge(val,"value","",sess.email,msg_status,msg,"bulk");
                                        return resolve(msg_status);
                                        
                                        
                                      }
                                      else
                                      {
                                        

                                        var value_data = {
                                          
                                          
                                          value: val,
                                          keyword_id: keyword_id,
                                          bot_id: bot_id,
                                          cat_id: cat_id,
                                          username: sess.username,
                                          date_created: new Date().getDate(),
                                          created_by: sess.email,
                                          approved: 1,
                                          approved_by: sess.email,
                                          comment: ""
                                          
                                          
                                        };
                                        
                                        var ValueIns = new schema.Values(value_data);
                                        ValueIns.save(function(err,data){
                                          
                                          
                                          if(!err){
                                            
                                            msg = "Value has been added successfully. ";
                                            msg_status = 1;
                                            
                                          }
                                          else
                                          {
                                            
                                            msg = err.message;
                                            msg_status = -1;
                                            
                                          }
                                          
                                          logKnowledge(val,"value","",sess.email,msg_status,msg,"bulk");
                                          return resolve(msg_status);
                                          
                                        });
                                        
                                      }
                                      
                                    }
                                    else
                                    {
                                      console.log("Value Error: " + err.message);
                                      return reject(err);
                                    }
                                    
                                    
                                    
                                  });
                                  
                                  
                                  // at this point, insert the simiar question
                                  
                                  
                                  if(inp_sim_ques.length > 0){
            
            
                                    var q_;
                                    var sim_;
                                    
                                    for(var j=0; j<inp_sim_ques.length; j++){
                                      
                                      
                                      q_ = inp_sim_ques[j].split("~")[0];
                                      sim_ = inp_sim_ques[j].split("~")[1];
                                      
                                      
                                      //console.log( inp_sim_ques[j]  );
                                      
                          
                                      if(q_ != keyword){
                                        
                                        
                                        // console.log(q_ + "\n");
                                        // console.log(keyword);
                                        
                                        //console.log( "not a keyword" );
                                        
                                        
                                      }
                                      else{
                                        
                                        
                                        //console.log(sim_);
                                        createSimilarQues(keyword,cat_id,bot_id,sess,sim_)
                                        
                                        
                                      }
                                      
                                      
                                    }
                                  
                                  }
                            
                            
                               
                          }
                          else{
                            console.log("error occured in creating this response. ");
                          }
                          
                  
                        });
        
                        
                      }
                      
                        
                    });
                    
                  }
                  
                    
                });
                
              }
              
            });
          
          }
        
        
        }
      
      
      });
      
    }
  
    
  });
  
  
};
var createAnswer= function(sess,val,keyword,cat_id,bot_id,value){
  
  
  return new Promise( (resolve,reject) => {
    
    
    var msg,msg_status;
    var keyword_value,answer_value;
    
    keyword = keyword.split(",");
    value = value.split(",");
    
    if(keyword.length > 0){
      
      
      for(var i=0; i<keyword.length; i++){
        
        // get the keyword id from the keyword
        
        keyword_value = keyword[i];
        answer_value = value[i];
        
        
        getKeywordId(keyword_value,cat_id,bot_id,sess,answer_value).then(keyword_id => {
        });
        
        
      }
      
    }
    
    return resolve(1);
    
  });
  
  
};
var getKeywordId = function(keyword_val,cat_id,bot_id,sess,val){
  
  
  var msg,msg_status;
  return new Promise((resolve, reject) => {
    
    
    schema.Keywords.find( {name:keyword_val, cat_id:cat_id,bot_id:bot_id}, function(err,keyword){
      
      
      
      if(!err){
        
        
        var keyword_id;
        if(keyword.length > 0){
          
          
          keyword_id = keyword[0]._id;
          
          
          
          schema.Values.find({keyword_id:keyword_id,value:val},function(err,values){
                
                
            if(!err){
              
              
              //console.log(keyword_id);
              //console.log(values);
          
              
              if(values.length > 0){
                
                
                console.log("value already exist");
                
                
                //means that the value has already been inserted
                
                msg = "A value for this keyword/question already exists. ";
                msg_status = -1;
                logKnowledge(val,"value","",sess.email,msg_status,msg,"bulk");
                return resolve(msg_status);
                
                
                
              }
              else
              {
                
                
                //console.log("pushing answer");
                
                
                var value_data = {
                  
                  
                  value: val,
                  keyword_id: keyword_id,
                  bot_id: bot_id,
                  cat_id: cat_id,
                  username: sess.username,
                  date_created: new Date().getDate(),
                  created_by: sess.email,
                  approved: 1,
                  approved_by: sess.email,
                  comment: ""
                  
                  
                };
                
                var ValueIns = new schema.Values(value_data);
                ValueIns.save(function(err,data){
                  
                  
                  if(!err){
                    
                    msg = "Value has been added successfully. ";
                    msg_status = 1;
                    
                  }
                  else
                  {
                    
                    msg = err.message;
                    msg_status = -1;
                    
                  }
                  
                  logKnowledge(val,"value","",sess.email,msg_status,msg,"bulk");
                  return resolve(msg_status);
                  
                });
                
              }
              
            }
            else
            {
              console.log("Value Error: " + err.message);
              return reject(err);
            }
            
            
            
          });
          
          
          
          
        }
        else
        {
          
          console.log("no keyword found" + keyword_val);
          
        }
        
        
      }
      
      else
      {
        
        console.log(err.message);
        return reject("none");
        
      }
      
      
      
    });
    
    
  });
  
  
};
var createSimilarQues = function(keyword_val,cat_id,bot_id,sess,synonym){
  
  
    var keyword_id;
    var msg,msg_status;
    
    
    schema.Keywords.find( {name:keyword_val,cat_id:cat_id,bot_id:bot_id }, function(err,keyword){
      
      if(!err){
        
        if(keyword.length > 0){
          
          
          keyword_id = keyword[0]._id;
          
          var synonym_data = {
            
            name: synonym,
            keyword_id: keyword_id,
            bot_id: bot_id,
            cat_id: cat_id,
            username: sess.email,
            date_created: new Date().getDate(),
            created_by: sess.email,
            approved: 1,
            approved_by: sess.email,
            comment: ""
            
          };
          var cat_name;
          var keyword_name;
          var bot_token;
          
          
          var SynonymIns = new schema.Synonyms(synonym_data);
          SynonymIns.save(function(err,data){
            
            if(!err){
              
              
              // add it to wit framework
              
              
              schema.Categories.find({_id:cat_id},function(err, cat){
                
                
                if(!err){
                  
                  if(cat.length > 0)
                  {
                    
                    cat_name = cat[0].name.replace(new RegExp(" ", "g"),"_");
                    schema.Keywords.find({_id:keyword_id},function(err,keyword){
                      
                      if(!err){
                        
                        
                        if(keyword.length > 0){
                          
                          
                          schema.BotSetup.find({_id:bot_id},function(err, bot){
                            
                            
                            if(!err){
                              
                              
                              if(bot.length > 0){
                                
                                
                                
                                bot_token = bot[0].token;
                                keyword_name = keyword[0].name;
                                keyword_name = keyword_name.replace("?","%3F");
                                
                                
                                var url = wit_api + "entities/" + cat_name + "/values/" + keyword_name + "/expressions";
                                var json_entity = {"expression":synonym};
                                
                                request({
                          
                                  url: url,
                                  method: "POST",
                                  json: true,
                                  headers: {
                          
                                      "authorization": "Bearer " + bot_token,
                                      "content-type": "application/json",
                          
                                  },
                                  body: json_entity
                                }, function(err,response,body){
                                
                                  
                                  
                                  if(!err){
                                    
                                    
                                    //console.log(response);
                                    
                                  
                                    if(response.body.builtin == false){
                              
                                      
                                      
                                      msg = "Similar question has been added successfully. Refresh page to view it. ";
                                      msg_status = 1;
                                      
                                      //res.send({msg:msg,msg_status:msg_status});
                                      
                              
                                    }
                                    else
                                    {
                                      
                                      msg = "An error occured in adding synonym to the learning engine. ";
                                      msg_status = -1;
                                      
                                      //res.send({ msg:msg,msg_status:msg_status });
                                    
                                      
                                    }
                                    
                                  
                                  }
                        
                          
                                });

                                
                              }
                              
                              
                            }
                              
                          });
                        
                        }
                        
                      }
                      
                    });
                    
                  }
                  
                }
                  
              });
              
            }
            
            else{
              
              msg = "There was an error in adding synonym. ";
              msg_status = -1;
              
              //res.send({msg:msg,msg_status:msg_status});
              
            }
            
            
          });
          
  
        }
        else
        {
          console.log("did not find keyword. ");
        }
        
        
      }
      
    });
    
    
};
var getBotName = function(bot_id,index){
  
  
  return new Promise((resolve, reject) => {
  
    
      schema.BotSetup.find({ _id:bot_id },function(err, bot){
        
        if(!err){
          
          
          var bot_name;
          if(bot.length > 0){
            
            
            bot_name = bot[0].name;
            return resolve(index);
            
            
          }
          
          
        }
        
          
      });
      
  });
  
};



var upload = multer({ storage : storage}).single('userExcel');


// start the GET request


app.get('/', function(req, res) {
  
  //res.redirect("http://botify_live.eu-4.evennode.com");
   res.render('surf/index');
 
});



// widget code integration

app.get('/widget/:bot_id',function(req,res){


  

  var bot_id = req.params.bot_id;

  
  // next is to get the bot name, bot username


  schema.BotSetup.find({ _id:bot_id },function(err,bot){


    if( !err ){


      if( bot.length > 0 )
      {


        res.render('account/widget', { bot_id:bot_id, username: bot[0].username, name: bot[0].name, token: bot[0].token });


      }


    }


  });


  



});


app.get("/queries",function(req,res){
  
  
  var sess = req.session;
  var username = sess.username;
  let egg = [];

  
  schema.Queries.find( {username:username}, null, {sort: {'_id': -1}},  function(err, queries) {
    
    if(!err){
      
      res.render("account/queries", {queries:queries, sidebar: sideBar(sess.role), header:headerBar(sess.name,sess.role) } );
      
    }
      
  });
  
});

app.get("/delete_stuffs",function(){
  
  
  var email = "osahonmichael@yahoo.com";
  
  schema.BotSetup.remove( {created_by: email}, function(err) {
    
    if(!err){
      console.log("deleted successfully. ");
    }
    else
    {
      console.log("error in deleting. ");
    }
      
  });
  
  schema.Categories.remove( {created_by: email}, function(err) {
    
    if(!err){
      console.log("deleted successfully. ");
    }
    else
    {
      console.log("error in deleting. ");
    }
      
  });
  
  schema.Keywords.remove( {created_by: email}, function(err) {
    
    if(!err){
      console.log("deleted successfully. ");
    }
    else
    {
      console.log("error in deleting. ");
    }
      
  });
  
  schema.Synonyms.remove( {created_by: email}, function(err) {
    
    if(!err){
      console.log("deleted successfully. ");
    }
    else
    {
      console.log("error in deleting. ");
    }
      
  });
  
  schema.Values.remove( {created_by: email}, function(err) {
    
    
    if(!err){
      console.log("deleted successfully. ");
    }
    else
    {
      console.log("error in deleting. ");
    }
    
      
  });
  
  
});

app.get("/find_token",function(){
  
  
  // schema.Admin.find( {email: "ctu@gtbank.com"},function(err, admin) {
  //   console.log(admin);  
  // });
  
  
  // schema.BotSetup.update({name:"ITRAVEL"},{token:"T2WBDKQPPOPJDZ3RIB3PC5ET6SBAPQQU"},{upsert:true},function(err,bot_update){
    
  // });
  
  
  // schema.Categories.update( {_id:"5a61f0cef6deed0014e7e9d9"},{name:"Asset and Liability Management"},{upsert:true},function(err,bot_update){
    
  // });
  
  // schema.Categories.find( {name: "Equipment Repairs"},function(err, admin) {
  //   console.log(admin);  
  // });
  
  // schema.Keywords.find( {cat_id: "5a60c58d1bdc400014671e63"},function(err, admin) {
  //   console.log(admin);  
  // });
  
  
  schema.Keywords.update({name:"id like to move funds "},{name:"id like to move funds"},{upsert:true},function(err,bot_update){
    
  });
  
  // schema.Synonyms.update({keyword_id:"5a58df5f0ea8d70014b56dc9"},{username:"temitope.adeshina", created_by: "temitope.adeshina@gtbank.com", approved_by: "temitope.adeshina@gtbank.com"},{insert:true},function(err,bot_update){
    
  // });
  
  // schema.Synonyms.update({keyword_id:"5a58df5f0ea8d70014b56dc7"},{username:"temitope.adeshina", created_by: "temitope.adeshina@gtbank.com", approved_by: "temitope.adeshina@gtbank.com"},{insert:true},function(err,bot_update){
    
  // });
  
  // schema.Synonyms.update({keyword_id:"5a58df5f0ea8d70014b56dca"},{username:"temitope.adeshina", created_by: "temitope.adeshina@gtbank.com", approved_by: "temitope.adeshina@gtbank.com"},{insert:true},function(err,bot_update){
    
  // });
  
  // schema.Synonyms.update({keyword_id:"5a58df5f0ea8d70014b56dc8"},{username:"temitope.adeshina", created_by: "temitope.adeshina@gtbank.com", approved_by: "temitope.adeshina@gtbank.com"},{insert:true},function(err,bot_update){
    
  // });
  
  
  
  
  
  
  
  // schema.Keywords.update({_id:"5a58df5f0ea8d70014b56dc9"},{username:"temitope.adeshina", created_by: "temitope.adeshina@gtbank.com", approved_by: "temitope.adeshina@gtbank.com"},{insert:true},function(err,bot_update){
    
  // });
  
  
  // schema.Keywords.update({_id:"5a58df5f0ea8d70014b56dc6"},{username:"temitope.adeshina", created_by: "temitope.adeshina@gtbank.com", approved_by: "temitope.adeshina@gtbank.com"},{insert:true},function(err,bot_update){
    
  // });
  
  // schema.Keywords.update({_id:"5a58df5f0ea8d70014b56dc5"},{username:"temitope.adeshina", created_by: "temitope.adeshina@gtbank.com", approved_by: "temitope.adeshina@gtbank.com"},{insert:true},function(err,bot_update){
    
  // });
  
  
  // schema.Keywords.find( { name: "How often are excellent employees celebrated?" },function(err, keyword) {
    
  //   console.log(keyword);
      
  // });
  
  // schema.Keywords.find( { name:"What are treasury bills?" }, function(err,cats){
  //   console.log(cats);
  // });
  
  // //5a6f493f76040b0014a1cfb6
  
  
  // schema.Categories.remove( { name:"Treasury Bills" }, function(err,cats){
  //   console.log(cats);
  // });
  
  // schema.Categories.remove( {"name": "Enrolment"}, function(err) {
    
  //   if(!err){
  //     console.log("deleted successfully. ");
  //   }
  //   else
  //   {
  //     console.log("error in deleting. ");
  //   }
      
  // });
  
  
  
  // schema.Keywords.find({ name: "What is BVN", bot_id: "5a5dd1c83cd1df00146357d6" },function(err, keyword) {
  //   console.log(keyword);  
  // });
  
  
  //5a5dd1c83cd1df00146357d6
  
  
  // schema.Synonyms.find({ keyword_id:"5a5ddb3cb8243c00147a2c14" },function(err,bots){
  //   console.log(bots);
  // });
  
  
  // schema.Keywords.find({ cat_id: "5a61f0cef6deed0014e7e9d9"},function(err,cats){
    
  //   console.log(cats);
    
  // });
  
  
  // schema.Keywords.find({ cat_id: "5a60c58d1bdc400014671e60" },function(err,admins){
  
  //   console.log(admins);
  
  // });
  
  
  // schema.BotSetup.find({_id:"59b7bde3a867c41742ba89f7"},function(err, bots){
    
  //   if(!err)
  //   {
  //     console.log(bots);
  //   }
      
  // });

  
  
});

app.get("/login",function(req,res){
  
  //res.redirect("http://botify_live.eu-4.evennode.com/login");
  res.render('surf/login');
  
});

app.get("/forgot",function(req,res){
  
  
  res.render('surf/forgot');

  
});

app.get("/setup",function(req,res){
  
  //res.redirect("http://botify_live.eu-4.evennode.com/setup");
  res.render("surf/setup");
  
});

app.get("/reset/:user_id",function(req, res) {
  
  var user_id = req.params.user_id;
  res.render("surf/reset_password", {user_id:user_id} );
  
});

app.get("/signout",function(req, res) {
  
  
  req.session.destroy(function(err) {
    
    if(!err)
      res.redirect("/");
    
  });

  
});

app.get("/revamp",function(req,res){
  
  sess = req.session;
  res.render("account/revamp",{ sidebar:sideBar(sess.role), header:headerBar(sess.name,sess.role) });
  
});

app.get("/role_manager",function(req, res){
  
  
  sess = req.session;
  schema.Admin.find( {username:sess.username}, function(err, admins){
    
    if(!err){
      
      if(admins.length > 0){
        
        schema.Users.find({admin_id:admins[0]._id},function(err, users){
    
          if(!err){
            
            
            schema.Admin.find( {_id:admins[0]._id }, function(err,admin){
              
              if(!err){
                res.render("account/role_manager",{users:users, admin_rec:admin, sidebar:sideBar(sess.role), header:headerBar(sess.name,sess.role)});  
              }
              
              
            });
              
          }
          
        });
      
      }
      
    }
      
  });
    
});

app.get("/user/:user_id",function(req, res){
  
  
  var user_id = req.params.user_id;
  schema.Users.find({_id:user_id},function(err,user){
    
    
    if(!err){
      res.render("account/user"); 
    }


  });
  
    
});

// app.get("/chat/:chat_username",function(req, res) {
  
  
//   var username = req.params.chat_username;
//   schema.BotSetup.find( { username:username }, function(err,bots){
    
//     if(!err){
    
//       if(bots.length > 0){
        
//         // load bot interface
        
//         if(bots[0].approved == 0)
//           res.render("surf/error", {error: "This BOT is yet to be approved. Please contact administrator for approval. "} );
//         else
//         {
          
//         }
        
//       }
//       else
//         res.render("surf/error", {error: "It appears this BOT does not exist on our BOT Engine. Please contact administrator. <a href='/'>Back to home</a>"} );
      
//     }
    
//   });
  
  
  
// });


app.get("/admin/login",function(req, res) {
   
   res.render("admin/login");
   
});

app.get("/dashboard",function(req, res) {
  
  
  sess = req.session;
  var sess_active = isSessionActive(sess.username,sess.email);
  var count_bots;
  var count_users;
  var admin_id;
  var count_engagements = 0;
  
  
  if(sess_active == false)
    res.redirect("/login");
  else{
    
    
    schema.BotSetup.find({username:sess.username},function(err, bots) {
      
      if(!err){
        
        count_bots = bots.length;
        schema.Admin.find({username: sess.username},function(err, admin){
          
          if(!err){
            
            if(admin.length > 0){
              
              admin_id = admin[0]._id;
              schema.Users.find({admin_id:admin_id},function(err, users){
                
                if(!err){
                  
                  
                  count_users = users.length + admin.length;


                  schema.Queries.find({ username: sess.username },function(err,queries){




                    if(bots.length > 0){
                     
                        schema.Rating.find({},function(err,ratings){
                       
                          if(!err){
                           

                            // console.log( ratings );
                            // return;


                           res.render("account/dashboard",{ sidebar: sideBar(sess.role), header:headerBar(sess.name,sess.role),count_bots:count_bots,count_users:count_users, engagements: ratings.length, queries: queries.length  });
                        


                        }


                        
                      });
                    
                    }
                    else
                    {
                      var queries = [];
                      count_engagements = 0;
                      res.render("account/dashboard",{ sidebar: sideBar(sess.role), header:headerBar(sess.name,sess.role),count_bots:count_bots,count_users:count_users, engagements: count_engagements, queries: queries.length  });  
                    }

                  


                  });

                  
                  
                  
                }
                  
              });
              
            }
            
          }
            
        });
        
        
      }
        
    });
    
  }
    
});

app.get("/feedback",function(req,res){


  
  schema.Rating.find({},function(err,ratings){

    if(!err)
    {
      //console.log(ratings);
      //return; 
      res.render("account/feedback", {queries:ratings, sidebar: sideBar(sess.role), header:headerBar(sess.name,sess.role) });
    }

  });



});

app.get("/categories",function(req, res) {
  
  
  sess = req.session;
  var sess_active = isSessionActive(sess.bot_username,sess.email);
  if(sess_active == false)
    res.redirect("/login");
  else{
    
    schema.Categories.find( {},function(err,categories){
    
    
      if(!err){
        res.render("account/categories", {categories:categories} );
      }
      
      
    
    });
    
  }
  

  
});

app.get("/category/:cat_name",function(req, res) {
   
   res.render("/account/category",{ sidebar:sideBar(sess.role),header:headerBar(sess.name,sess.role) });
    
});

app.get("/home",function(req, res) {
  
  res.render("/account/home");
    
});

var BulkUpload = function(sess,file_path,bot_name) {
  

  var workbook = XLSX.readFile(file_path);
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  
  
    
  
  var RemoveUndefined = function(arr){
    
    if(arr.length > 0){
      
      for(var i=0; i<arr.length; i++){
        
        if(arr[i] == "undefined"){
          // remove this item from the array
          
          arr.splice(i,1);
          
        }
        
      }
      
    }
    else{}
    
    return arr;
    
  }
  
  
  var json_knowledge = {};
  var cat_val = "";
  var cat_ques = "";
  var cat_related_ques = "";
  var cat_answer = "";
  var cat_desc = "";
  var bulk_data = [];
  
  if(xlData.length > 0){
      
      
    
    for(var i=0; i<xlData.length; i++){
      
      
      if(xlData[i].Category != undefined){
        
        cat_val = xlData[i].Category;
        cat_desc = xlData[i].Description;
        cat_related_ques = xlData[i].Similar_Questions;
        
        if(xlData[i].Questions != undefined){
         cat_ques = xlData[i].Questions; 
        }
        else
          cat_ques = "undefined";
        
        
        if(xlData[i].Answer != undefined)
          cat_answer = xlData[i].Answer;
        else
          cat_answer = "undefined";
          
      
        
      }
      else{
        
        
        cat_related_ques = xlData[i].Similar_Questions;
        
        if(xlData[i].Questions != undefined){
         cat_ques = xlData[i].Questions; 
        }
        
        
        if(xlData[i].Answer != undefined)
          cat_answer = xlData[i].Answer;
        else
          cat_answer = "undefined";
        
      }
      
      
      json_knowledge = {
          
        "category": cat_val,
        "questions": cat_ques,
        "similar_questions": cat_ques + "~" + cat_related_ques,
        "answer": cat_answer,
        "description":cat_desc
        
      };
      
      
      // console.log(json_knowledge);
      // return;
      
      
      bulk_data.push(json_knowledge);
      
      
    }
    
    
  }
  
  
  else{ }
  
  
  
  
  if(bulk_data.length > 0){
    
    
    var fin_questions = [];
    var fin_related_questions = [];
    var fin_answers = [];
    var fin_descs = [];
    var fin_json;
    var fin_arr = [];
    

    
    
    for(var j=0; j<bulk_data.length; j++){
      
      
      if(j == 0){
        
        
        if(bulk_data[j].questions != undefined)
          fin_questions.push(bulk_data[j].questions);
        if(bulk_data[j].similar_questions != undefined){
          fin_related_questions.push(bulk_data[j].similar_questions);
        }
        if(bulk_data[j].answer != undefined){
          fin_answers.push(bulk_data[j].answer);
        }

        
        fin_json = {
          
          
          "category": bulk_data[j].category,
          "questions": RemoveUndefined(fin_questions).join("^"),
          "similar_questions": fin_related_questions.join("^"),
          "answer": RemoveUndefined(fin_answers).join("^"),
          "description": bulk_data[j].description
          
          
        };
        
        if(bulk_data.length  == 1)
          fin_arr.push(fin_json);
        
      }
      
      else{
        
        
        if(bulk_data[j-1].category == bulk_data[j].category){
          
          
          if(bulk_data[j].questions != undefined)
            fin_questions.push(bulk_data[j].questions);
          if(bulk_data[j].similar_questions != undefined)
            fin_related_questions.push(bulk_data[j].similar_questions);
          if(bulk_data[j].answer != undefined){
            fin_answers.push(bulk_data[j].answer);
          }
          
          
          fin_json = {
          
          
            "category": bulk_data[j].category,
            "questions": RemoveUndefined(fin_questions).join("^"),
            "similar_questions": fin_related_questions.join("^"),
            "answer": RemoveUndefined(fin_answers).join("^"),
            "description": bulk_data[j].description
            
          };
          
          if(j == bulk_data.length - 1){
            fin_arr.push(fin_json);
          }
          
            
        }
        
        else{
          
          // push the data into the array
          
          fin_arr.push(fin_json);
          
          fin_questions = [];
          fin_related_questions = [];
          fin_answers = [];
          
          if(bulk_data[j].questions != undefined){
            fin_questions.push(bulk_data[j].questions);
          }
          
          if(bulk_data[j].similar_questions != undefined){
            fin_related_questions.push(bulk_data[j].similar_questions);
          }
          if(bulk_data[j].answer != undefined){
            fin_answers.push(bulk_data[j].answer);
          }
            
          fin_json = {
            
            "category": bulk_data[j].category,
            "questions": RemoveUndefined(fin_questions).join("^"),
            "similar_questions": fin_related_questions.join("^"),
            "answer": RemoveUndefined(fin_answers).join("^"),
            "description": bulk_data[j].description
            
          };
          
          //fin_arr.push(fin_json);
          
        }
        
      }
      
    }
    
  }
  else
    fin_arr = [];
  
  
  
  
  // console.log(fin_arr);
  // return;
  
  
  
  
  if(fin_arr.length > 0){
    
    
    var inp_cat = "";
    var inp_cat_desc = "";
    var save_email = sess.email;
    var inp_questions = [];
    var inp_sim_ques = [];
    var inp_answer = [];

    
    var newSaveCategory = function(cat,cat_desc,email,bot_name,inp_questions,inp_answer,inp_sim_ques,index,sess,create_type){
      
      var msg;
      var msg_status;
      var bot_id;
      var cat_id;
      var bot_token;
      
      
      var newCategory = function(){
        
        
        schema.BotSetup.find( {name:bot_name.toUpperCase()}, function(err,bot){
          
          
          if(!err){
            
            if(bot.length > 0){
              bot_token = bot[0].token;
            }
            else
            {
              bot_token = "no_token";
            }
            
            // console.log(bot);
            // console.log(bot_token);
            // return;
            
            cat = cat.trim();
            
            schema.Categories.find( {name:cat, bot_name:bot_name.toLowerCase()}, function(err, cates) {
                
              
              if(!err){
                
                if(cates.length == 0){
          
                
                  var cat_data = {
            
                    name: cat,
                    description: cat_desc,
                    bot_name: bot_name.toLowerCase(),
                    username: sess.username,
                    date_created: new Date().getDate(),
                    created_by: sess.email,
                    approved: 1,
                    approved_by: sess.email
                
                  };
                  var CatInsert = new schema.Categories(cat_data);
                  CatInsert.save(function(err,data){
                    
                    var cat_name = formatCategory(cat);  
              
                    if(err){
                      logKnowledge(cat,"category",bot_name,sess.email,-2,err.message,create_type);
                    }
                    else{
                      
                      
                      var url = wit_api + "entities";
                      var json_entity = {
                    
                    
                        "id":cat_name,
                        "lookups": ["keywords"]
                      
                      };
                      request({
                    
                        url: url,
                        method: "POST",
                        json: true,
                        headers: {
                    
                          "authorization": "Bearer " + bot_token,
                          "content-type": "application/json",
                  
                        },
                        body: json_entity
                      }, function(err,response,body){
                        
                          
                          if(!err){
                            
                            //console.log(response.body);
                            
                            if(response.body.builtin == false){
                              
                              
                              msg = "Category created successfully. ";
                              msg_status = 1;
                              
                            }
                            else
                            {
                        
                              msg = "Error happened in adding category. ";
                              msg_status = -1;
                              
                            }
                            
                            
                            logKnowledge(cat,"category",bot_name,sess.email,msg_status,msg,create_type);
                            newQuestion();
                            
                            
                            // at this point, input the questions;
                            
                          }
                        
                        
                      });
                      
                      
                    }
                  
                    
                  });
                  
                
                }
                else
                {
                  newQuestion();
                }
              
              }
              
            });
            
          }        
        
        });
        
        
        
        
        
      };
      
      var newQuestion = function(){
        
        
        schema.BotSetup.find({name:bot_name.toUpperCase()},function(err,bot){
          
          if(!err){
            
            if(bot.length > 0){
              
              bot_id = bot[0]._id;
              
            }
            else
            {
              bot_id = "";
            }
            
          }
          
          schema.Categories.find({name:cat,bot_name:bot_name.toLowerCase()},function(err,cats){
            
            
            if(!err){
              
              if(cats.length > 0){
                
                cat_id = cats[0]._id;
                
              }
              else
              {
                cat_id = "egg";
              }
              
            }
            
            
            inp_questions = inp_questions.split("^");
            inp_answer = inp_answer.split("^");
            inp_sim_ques = inp_sim_ques.split("^");
            
            //console.log(inp_sim_ques);
            //return;
            
            var uniqueArray = function(arrArg) {
              
              return arrArg.filter(function(elem, pos,arr) {
                return arr.indexOf(elem) == pos;
              });
            
              
            };
            
            
            inp_questions = uniqueArray(inp_questions);
            inp_sim_ques = uniqueArray(inp_sim_ques);
            
            
            if(inp_questions.length > 0){
              
              
              for(var i=0; i<inp_questions.length; i++){
                
                createKeyword(inp_questions[i],bot_id,cat_id,sess,inp_answer[i],inp_sim_ques).then(create_keyword => {
                  
                });
                
              }
              
            
            }

            
          });
          
          
        });
        
        
      };
       
      schema.BotSetup.find({name:bot_name.toUpperCase()},function(err,bot){
        
        
        if(!err){
          
          var bot_id = "";
          if(bot.length > 0){
            
            
            bot_id = bot[0]._id;
            schema.Categories.find({name:cat,bot_id: bot_id},function(err,cat){
              
              if(!err){
                
              
                if(cat.length > 0){
                  
                  // update category
                  
                }
                else
                {
                  
                  // insert new category
                  
                  newCategory();
                  
                  //console.log("submitting question");
                  //newQuestion();
                  
                  
                }
                
              
              }
              
              
            });
            
            
          }
          
        }
        
      });
      
    };
    
    // new code
    
    
    for(var k=0; k<fin_arr.length; k++){
      
      
      inp_cat = fin_arr[k].category;
      inp_cat_desc = fin_arr[k].description;
      inp_questions = fin_arr[k].questions;
      inp_sim_ques= fin_arr[k].similar_questions;
      inp_answer = fin_arr[k].answer;
      
      // inp_answer = inp_answer.split("^");
      
      // for(var z=0; z<inp_answer.length; z++){
        
      //   console.log(inp_answer[z]);
          
      // }
      
      // return;
      
      
      // inp_questions = inp_questions.split(",").join("^");
      
      // console.log(inp_questions);
      // return;
      
      newSaveCategory(inp_cat,inp_cat_desc,save_email,bot_name,inp_questions,inp_answer,inp_sim_ques,k,sess,"bulk");
      
      //return;
      
    
      // saveCategory(inp_cat,inp_cat_desc,save_email,bot_name,inp_questions,inp_answer,inp_sim_ques).then(saved => {
        
      //   // at this point, return 
        
      //   if(saved == 1)
      //   {
           
      //     // at this point, enter in the questions
           
      //       console.log("Category has been added successfully. ");
            
      //     //   saveQuestion(inp_cat,inp_cat_desc,bot_name,inp_questions,save_email).then(saved=>{
         
         
      //     //     console.log(saved);
      //     //     saveAnswer(inp_cat,inp_cat_desc,inp_questions,bot_name,inp_answer).then(saved_answer => {
        
      //     //       console.log(saved_answer);
                
      //     //     }).catch(err => {
                
      //     //       console.log(err.message);
                
      //     //     });
         
         
             
      //     //   }).
      //     //   catch(err => {
             
             
      //     //   if(!err){
      //     //   }
             
             
      //     // });
           
      //   }
      //   else{
      //     console.log("An error occured in inserting categories. ");
      //   }
          
        
      // })
      // .catch(err => {
        
      //   console.log(err.message);
        
        
      // });
      
      
    }
    
  }
  else{
  }
  
    
};

app.get("/bots",function(req, res) {
  
  
  sess = req.session;
  var role = sess.role;
  var condition;
  

  
  
  if(role == 0)
    condition = {created_by: sess.email};
  else if(role == 1)
    condition = {username:sess.username};
    
  
  schema.BotSetup.find( condition ,function(err, bots){
    
    
    if(!err){
      
      res.render("account/bots",{bots:bots,sidebar:sideBar(sess.role), header:headerBar(sess.name,sess.role), role: sess.role });
            
      // if(bots.length > 0){
        
      //   for(var i=0; i<bots.length; i++){
          
          
          
          
      //     if(bots[i].created_by == sess.email){
            
            
      //         // console.log(sess.email);
      //         // console.log(bots[i].created_by);
      //         // return;
            
      //       bots[i].full_name = sess.name;
          
            
      //     }
      //     else
      //     {
            
      //       schema.Users.find({email:bots[i].created_by},function(err, user) {
              
              
      //         if(!err){
                
                
      //           bots[i].full_name = "Michael Osahon";  
      //           if(i == bots.length - 1){
      //             res.render("account/bots",{bots:bots,sidebar:sideBar(sess.role), header:headerBar(sess.name,sess.role), role: sess.role });
      //           }
                
      //         }
              
                
      //       });
          
      //     }
          
      //   }
        
      // }
      // else
      // {
        
      // }
      
    }
    else
    {}
    
  });
  
  
});

app.get("/bot/:bot_id",function(req, res) {
  
  
  
  sess = req.session;
  var bot_id = req.params.bot_id;
  schema.BotSetup.find( { _id: bot_id, username:sess.username },function(err,bot){
    
    if(!err){
    
    
      if(bot.length > 0){
        
        
        schema.Categories.find( {username:sess.username,bot_name: bot[0].name.toLowerCase()},function(err, cats){
          
          
          if(!err){
            
            if(cats.length > 0){
              
              
              //get the longest description from all of the categories
              var desc_length = 0;
              var desc = "";
              var found_length = 0;
              var space_occur = 0;
              var space_val = "";
              
              for(var i=0; i<cats.length; i++){
                
                desc = cats[i].description;
                if(desc != undefined){
                
                  if(desc.length >desc_length){
                    desc_length = desc.length;
                  }
                
                }
                
                
              }
              
              
              found_length = desc_length;
              
              for(var j=0; j<cats.length; j++){
                
                if(cats[j].description != undefined){
                
                  if(cats[j].description.length < found_length){
                  
                  space_occur = Math.abs(found_length - cats[j].description.length);
                  for(var k=0; k<space_occur; k++){
                    space_val = space_val + "&nbsp;";
                  }
                  
                  cats[j].description = cats[j].description + space_val;
                  
                }
                  
                }
              }
              
            }
            
            
            // console.log(cats);
            // return;
            
            res.render("account/bot",{ domain:domain, bot:bot, bot_desc: bot[0].description, cats:cats, bot_name:  sentenceCase(bot[0].name.toLowerCase()) , sidebar:sideBar(sess.role), header:headerBar(sess.name,sess.role) });
          
            
          }
          else{
          }
          
          
        });
        
      }
      else
        console.log("not found. ");
      
    }
    
    
    
  });
  
   
});

app.get("/bot/:bot_id/settings",function(req,res){
  
  
  sess = req.session;
  var bot_id = req.params.bot_id;
  let no_response = "";
  
  schema.BotSetup.find( {_id:bot_id},function(err, bots){
    
    
    // console.log(sess.email);
    // console.log(sess.username);
    
    // return;
    
    
    if(!err){
      
      if(bots.length > 0){
        
        schema.Admin.find( { email:sess.email },function(err,data){
          
          
          if(!err)
          {
            
            if(data.length > 0)
            {
                
              
              schema.NoResponse.find({bot_id:bot_id},function(err, resp_data) {
                 
                 if(!err){
                   
                  
                  if(resp_data.length > 0)
                  {
                      no_response = resp_data[0].response;
                  }
                  else
                    no_response = "";
                  
                  
                  res.render("account/settings",{ domain:domain, sidebar:sideBar(sess.role), header:headerBar(sess.name,sess.role), bot_id:bot_id, bot_desc: bots[0].description, bot_name: sentenceCase(bots[0].name), profile:data, no_response:no_response });
                   
                 }
                 
                  
              });
              
            
            }
            else
            {
              
              schema.Users.find( { username:sess.username,email:sess.email },function(err, user) {
                
                if(!err){
                  
                 if(user.length > 0)
                 {
                   
                   
                   schema.NoResponse.find({bot_id:bot_id},function(err, data) {
                 
                 
                     if(!err){
                       
                      
                      if(data.length > 0)
                      {
                          no_response = data[0].response;
                      }
                      else
                        no_response = "";
                      
                      
                      res.render("account/settings",{ domain:domain, sidebar:sideBar(sess.role), header:headerBar(sess.name,sess.role), bot_id:bot_id, bot_desc: bots[0].description, bot_name: sentenceCase(bots[0].name), profile:user, no_response:no_response });
                       
                     }
                 
                  
                  });
                  
                  
                 }
                 else
                 {
                   
                   // render the "details was not found page"
                   
                   res.render("account/user_not_found");
                   
                 }
                  
                }
                  
              });
              
            }
            
          }
          
          
        });  
        
      
        
      
        
        
      }
      
    }
    else{
    }

  });
  
});

app.get("/category/:bot_id/:cat_id",function(req, res){
  
  
  sess = req.session;
  var cat_id = req.params.cat_id;
  var bot_id = req.params.bot_id;
  
  
  schema.Keywords.find( {cat_id:cat_id, username:sess.username},function(err,keywords){
    
    
    if(!err){
      
      schema.Categories.find( {_id:cat_id },function(err, cat){
        
        if(!err){
          
          if(cat.length > 0 ){
            
            if(keywords.length > 0){
              
              
              var count = 0;
              var obj_synonyms;
              var obj_expressions;
              var obj_values;
              var arr_synonyms = new Array();
              var arr_expressions = new Array();
              var arr_values = new Array();
              
             
              function getUsers (keyword_id) {
                  
                  // Return the Promise right away, unless you really need to
                  // do something before you create a new Promise, but usually
                  // this can go into the function below
                  
                  
                  return new Promise((resolve, reject) => {
                    
                    // reject and resolve are functions provided by the Promise
                    // implementation. Call only one of them.
                
                    var keyword_items = [];
                    schema.Synonyms.find( {keyword_id:keyword_id},function(err,synonyms){
                      
                      if(!err){
                        
                        keyword_items["synonyms"] = synonyms;
                        schema.Expressions.find( {keyword_id:keyword_id}, function(err,expressions){
                          
                          if(!err){
                            
                            keyword_items["expressions"] = expressions;
                            schema.Values.find( {keyword_id:keyword_id}, function(err,values){
                              
                              if(!err){
                                
                                keyword_items["values"] = values;
                                return resolve(keyword_items);
                              
                                
                              }
                              
                            });
                            
                          }
                          
                          
                        });
                        
                      }
                      else
                      {
                        return reject(false);
                      }
                        
                    
                    });
                  
                    
                  });
                  
                  
              }
              
              
              for(var i=0; i<keywords.length; i++){
                
                
                getUsers(keywords[i]._id).then(items => {
                  
                  
                  var synonyms = items["synonyms"];
                  var expressions = items["expressions"];
                  var values = items["values"];
                  
                  
                  if(count == keywords.length - 1){
                    
                    
                    if(synonyms.length > 0){
                      for(var j=0; j<synonyms.length; j++){
                      
                      
                      obj_synonyms = {
                      
                        "id": synonyms[j]._id,
                        "name": synonyms[j].name,
                        "keyword_id": synonyms[j].keyword_id
                      
                      };
                      
                      arr_synonyms.push(obj_synonyms);
                      
                    }
                    }
                    
                    if(expressions.length > 0){
                      
                      for(var k=0; k<expressions.length; k++){
                      
                      
                      obj_expressions = {
                        
                        "id": expressions[k]._id,
                        "name": expressions[k].name,
                        "keyword_id": expressions[k].keyword_id
                        
                      };
                      
                      arr_expressions.push(obj_expressions);
                      
                    }
                    
                  }
                    
                    if(values.length > 0){
                        
                        for(var l=0; l<values.length; l++){
                          
                          
                          obj_values = {
                            
                            "id": values[l]._id,
                            "value": values[l].value,
                            "keyword_id": values[l].keyword_id
                            
                          };
                          
                          arr_values.push(obj_values);
                          
                        }
                        
                      }
                    
                    
                    schema.BotSetup.find({_id:bot_id},function(err, bot) {
                      
                      if(!err){
                        
                        if(bot.length > 0){
                          res.render("account/category",{ domain:domain, keywords:keywords,cat_name: sentenceCase(cat[0].name) ,bot_id:bot_id, bot_name: sentenceCase(bot[0].name), bot_desc:bot[0].description, cat_id:cat_id,synonyms:arr_synonyms,expressions:arr_expressions,values:arr_values,sidebar:sideBar(sess.role), header:headerBar(sess.name,sess.role) });
                        }
                        else
                        {
                          console.log("couldn't load the bot. ");
                        }
                        
                      }
                        
                    });
                    
                  }
                  else
                  {
                    
                    for(var k=0; k<synonyms.length; k++){
                      
                      
                      obj_synonyms = {
                      
                        "id": synonyms[k]._id,
                        "name": synonyms[k].name,
                        "keyword_id": synonyms[k].keyword_id
                      
                      };
                      arr_synonyms.push(obj_synonyms);
                      
                    }
                    
                    if(expressions.length > 0){
                      
                      for(var k=0; k<expressions.length; k++){
                      
                        obj_expressions = {
                        
                        "id": expressions[k]._id,
                        "name": expressions[k].name,
                        "keyword_id": expressions[k].keyword_id
                        
                      };
                        arr_expressions.push(obj_expressions);
                      
                    }
                    
                  }
                    
                    if(values.length > 0){
                        
                        for(var l=0; l<values.length; l++){
                          
                          
                          obj_values = {
                            
                            "id": values[l]._id,
                            "value": values[l].value,
                            "keyword_id": values[l].keyword_id
                            
                          };
                          
                          arr_values.push(obj_values);
                          
                        }
                        
                      }

                  }
                  
                  count++;
                  
                })
                .catch(err => {
                  
                  if(err){
                  }
                  
                  
                });
            
                
              }
              
              
            }
            else{
              
              schema.BotSetup.find({_id:bot_id},function(err, bot){
                
                if(!err){
                  
                  if(bot.length > 0){
                    res.render("account/category",{ domain:domain, keywords:keywords,cat_name: sentenceCase(cat[0].name) ,bot_id:bot_id, bot_name: sentenceCase(bot[0].name), bot_desc:bot[0].description, cat_id:cat_id,synonyms:arr_synonyms,expressions:arr_expressions,values:arr_values,sidebar:sideBar(sess.role), header:headerBar(sess.name,sess.role) });  
                  }
                  
                }
                
                
              });
              
              
            }
            
            
          }
          else
          {
            
          }
            
            
        }
          
      });
      
      
    }
    
    
  });
  
    
});

app.get("/users",function(req,res){
  
  sess = req.session;
  schema.Admin.find( {username:sess.username}, function(err, admins){
    
    if(!err){
      
      if(admins.length > 0){
        
        schema.Users.find({admin_id:admins[0]._id},function(err, users){
    
          if(!err){
            
            
            
            schema.Admin.find( {_id:admins[0]._id }, function(err,admin){
              
              if(!err){
                
                res.render("account/users",{users:users, admin_rec:admin, sidebar:sideBar(sess.role), header:headerBar(sess.name,sess.role)});  
                
              }
              
            });
              
          }
          
        });
      
      }
      
    }
      
  });
  
  
});

app.get("/db",function(req, res){
  
  
  
  // schema.Queries.find({},function(err, queries) {
    
  //   console.log(queries);
      
  // });
  
  
  schema.Users.remove({},function(err,data){
    
    
    if(!err){
      
      if(data.n > 0)
      {
        console.log("Records deleted successfully. ");  
      }
      else
        console.log("No record could not be deleted. ");
      
    }
      
    else
      console.log("Error occured in deleting records. ");
    
    
  });
  
    
});

app.get("/integrations",function(req, res) {
  
  sess = req.session;
  schema.Integrations.find({username:sess.username},function(err, ints) {
    
    if(!err){
      res.render("account/integrations",{ints:ints,sidebar:sideBar(sess.role), header:headerBar(sess.name,sess.role) });
    }
    
  });
  
  
    
});

app.get("/invite/:invite_id",function(req, res){
  
  
  var invite_id = req.params.invite_id;
  var recipient;
  var sender;
  
  schema.Invites.find({_id:invite_id},function(err, invite) {
     
     if(!err){
       
       if(invite.length > 0){
         
         recipient = invite[0].recipient;
         sender = invite[0].sender;
         res.render("account/invite_reg",{ recipient:recipient,sender:sender,invite_id:invite_id });
        
         
       }
       
     }
      
  });
  
  
});

app.get("/:bot_name",function(req, res){
  
  
  var bot_name = req.params.bot_name;
  schema.BotSetup.find( { name:bot_name.toUpperCase() }, function(err, bot){
      
      if(!err){
        
        
        if(bot.length > 0){
          res.render("surf/chat", {bot_id:bot[0]._id, bot_token: bot[0].token, bot_name: sentenceCase(bot[0].name), bot_username: bot[0].username } );
        }
        else
        {
          
          res.render("surf/card");
        
          
        }
        
      }
      
  });



});

app.get("/messenger/webhook",function(req, res){
  
  
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'test_token') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.log("Failed validation. Make sure the validation tokens match.");
    res.status(403).send("Error");          
  }  
  
  

  
    
});

app.post("/get_cats_by_bot_id",function(req, res) {

  
  var bot_id = req.body.bot_id;
  var bot_name = "";
  
  //console.log(bot_id);
  
  schema.BotSetup.find({_id:bot_id},function(err, bot) {
    
    if(!err){
      
      
      if(bot.length > 0){
        
        bot_name = bot[0].name;
        if(bot_name.length > 0)
          bot_name = bot_name.toLowerCase();
          
        
        schema.Categories.find({bot_name:bot_name},function(err, cats) {
          
          
          if(!err){
            
            //console.log(cats);
            res.send({ cats:cats });
          
            
          }
          
              
        });
        
          
      }
      else
        console.log("no bots");
      
    }
    else
      console.log(err.message);
      
  });
  
   
});

app.post("/add_learning",function(req, res) {
  
  
  sess = req.session;
  var bot_id = req.body.bot_id;
  var cat = req.body.cat;
  var resp= req.body.resp;
  var question = req.body.question;
  var query_id = req.body.query_id;
  
  var UpdateQuery = function(query_id)
  {
    
    
    //console.log(query_id);
    
    schema.Queries.update({_id:query_id},{response:2},{upsert:true},function(data){
      console.log(data);
    });
    
    
  };
  
  
  var keyword_data = {

    
    name: question.trim(),
    cat_id: cat,
    bot_id: bot_id,
    username: sess.username,
    date_created: new Date().getDate(),
    created_by: sess.email,
    approved: 1,
    approved_by: sess.email,
    comment: ""
    

  };
  
  var KeywordIns = new schema.Keywords(keyword_data);
  KeywordIns.save(function(err,data){
    
    
    if(!err){
      
      // add value to the value database
      
      
      var cat_name= "";
      schema.BotSetup.find({_id:bot_id},function(err, bot){
        
        
        if(!err){
          
          schema.Categories.find({_id:cat},function(err, cat){
        
        
              
            if(!err){
          
          
          if(cat.length > 0)
            cat_name = cat[0].name;
          else
            cat_name = "";
          
          
          cat_name = formatCategory(cat_name);
          
          
          var url = wit_api + "entities/" + cat_name + "/values";
          var json_entity = {
    
            "value":question.trim()
    
          };
          
          // console.log(keyword);
          // console.log(url);
          // console.log(bot_token);
          // return;
          
          
          request({
    
            
            url: url,
            method: "POST",
            json: true,
            headers: {
      
                "authorization": "Bearer " + bot[0].token,
                "content-type": "application/json",
      
            },
            body: json_entity
            
          }, 
                
          function(err,response,body){
    
    
            if(!err){
              
              
              
              if(response.body.builtin == false){
                
                
                
                var value_data = {
        
        
        value: resp.trim(),
        keyword_id: data._id,
        bot_id: bot_id,
        cat_id: cat,
        username: sess.username,
        date_created: new Date().getDate(),
        created_by: sess.email,
        approved: 1,
        approved_by: sess.email,
        comment: ""
        
        
      };
                var ValueIns = new schema.Values(value_data);
                ValueIns.save(function(err,data){
                  
                  
                  if(!err){
                    
                    
                    UpdateQuery(query_id);
                    res.send( {msg_status:1, msg: "Question has been added successfully. "});  
                  
                    
                  }
                  else
                    res.send( {msg_status:0, msg: "An error occured in changing your password.  "});
                  
                  
                });
                
                  
              }
              else
              {
                
                
                var msg;
                var msg_status = 0;
                
                msg = "An error occured in entering this keyword. ";
                msg_status = -1;
                res.send( {msg:msg,msg_status:msg_status} );
                
              }
              
              
              
              
            }
            else{
              console.log("error occured in creating this response. ");
            }
            
    
          });

          
          }
        
          
          });
          
        }
        
          
      });
      
    
      

      
      
    }
    
    
  });
  

    
});

app.post("/change_password",function(req,res){
  
  
  var pword = req.body.pword;
  var user_id = req.body.user_id;
  pword = crypto.createHash("md5").update(pword).digest("hex");
  
  schema.Admin.find( {_id:user_id}, function(err,admin){
    
    if(!err){
      
      
      if(admin.length > 0){
      
      
        schema.Admin.update({_id:user_id},{pword:pword},{upsert:true},function(err,admin_update){
                      
        
          if(!err){
            
            console.log("admin");
            if(admin_update.nModified > 0){
              res.send( {msg_status:1, msg: "Your password has been changed successfully. "});  
            }
            else
            {
              res.send( {msg_status:0, msg: "An error occured in changing your password.  "});
            }
          
            
          }
    
      
        });
      
      
      }
      else
      {
        
        
        schema.Users.update({_id:user_id},{pword:pword},{upsert:true},function(err,user_update){
        
          if(!err){
            
            
            if(user_update.nModified > 0){
              res.send( {msg_status:1, msg: "Your password has been changed successfully. "} );  
            }
            else
            {
              res.send( {msg_status:0, msg: "An error occured in changing your password.  "} );
            }
            
          
            
          }
      
        });
        
      
        
      }
    
      
    }
  
    
    
  });
  
  

  
  
  
  
});

app.post("/messenger/webhook",function(req, res) {
  
  
  var data = req.body;
  
  // console.log(data);
  // return;


  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      

      var pageID = entry.id;
      var timeOfEvent = entry.time;
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          
          
          receivedMessage(event);
          
          
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      
        
      });
    
      
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    
    res.send(200);
    
  }
  
    
});

function receivedMessage(event) {
  
  

  
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  
  
  console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));
  


  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;


  if (messageText) {


    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    // switch (messageText) {
    //   case 'generic':
    //     sendGenericMessage(senderID);
    //     break;

    //   default:
    //     sendTextMessage(senderID, messageText);
    // }
    
    
    //sendGenericMessage(senderID,messageText,recipientID);
    //sendTextMessage(senderID, messageText,recipientID);
    
    callSendAPI(recipientID,messageText,senderID);
    
    
    
  } else if (messageAttachments) {
    //sendTextMessage(senderID, "Message with attachment received",recipientID);
  }

  
}


function verifyToken(app_token){
  
  
  
  return new Promise((resolve, reject) => {
  
    var resp;
    request({
      
      uri: 'https://graph.facebook.com/app?access_token='+ app_token,
      method: 'GET'
        
    },
    function(error, response, body) {
      
      
      var body_msg = "";
      body = JSON.parse(body);
      
      if(!error && response.statusCode == 200){
        
        
        
        resp = {
          
          "status": 1,
          "msg": "Validated successfully. ",
          "name": body.name,
          "resp_code": response.statusCode
          
        };
        
        
        return resolve(resp);
        
      }
      else{
        
        
        if(response.statusCode == 400)
          body_msg = "Invalid Access token. Please ensure you input the correct token. ";
        
        
        resp = {
        
          "status":0,
          "msg" : body_msg,
          "name": "",
          "resp_code": response.statusCode
          
        };
        
        
        return resolve(resp);
        
        
      }
      
      
    });
  
    
  });
  
  
  
}

app.post("/validate_app_token",function(req, res) {
   
  
  var token = req.body.app_token;
  verifyToken(token).then(response => {
    
    console.log(response);
    res.send( {"response": response} );
  
    
  }).
  catch(err => {
                  
    if(err){
      
      console.log(err);
      
    }
    
    
  });
   
    
});


function callSendAPI(pageID,messageText,senderID) {
  
  
  // before requesting, check if we get the correct token
  

  
  var tokens = function(){
    
    
    return new Promise((resolve, reject) => {
      
      
      schema.Integrations.find( {}, function(err, ints) {
        
        
        if(!err){
          return resolve(ints);
        }
        else
        {
          return reject(err);
        }
        
      });
      
      
    });
  
  };
  
  
  tokens().then(resp => {
    
    if(resp.length > 0){
      
      
      var validateAccessToken = function(access_token){
        
        
        return new Promise((resolve, reject) => {
            
            
            request({
    
              uri: 'https://graph.facebook.com/v2.6/' + pageID + "?fields=access_token",
              qs: {access_token: access_token},
              method: "GET"
              
            },function(error, response, body) {
              
              
              var body = JSON.parse(body);
              if(body.access_token != undefined && body.access_token.length > 5){
                return resolve(access_token);  
              }
              else
              {
                return reject("error");
              }
              
            });  
          
        });
        
      };
      
      for(var i=0; i<resp.length; i++){
        
        
        if(i == resp.length){
          break;
        }  
        
        else{
          
          
        
          validateAccessToken(resp[i].access_token).then(response_token=>{
            
            
            // console.log(response_token);
            // return;
            
            
            if(response_token != "error"){
              
              
              schema.Integrations.find({access_token:response_token},function(err,ints){
                
                
                if(!err){
                  
                  
                  
                  if(ints.length > 0){
                    
                    
                    
                    schema.BotSetup.find( {_id:ints[0].bot_id}, function(err,bot){
                     
                     if(!err){
                       
                       if(bot.length > 0){
                         
                  //       console.log(response_token);
                  // return;
                  
                          
                        
                          var dataA = {
  
    
                            reason: messageText,
                            token: bot[0].token,
                            bot_name: sentenceCase(bot[0].name),
                            bot_id: bot[0]._id
                            
                            
                          };
                          
                          
                          // console.log(dataA);
                          // return;
                          
                          
                          const client = new Wit({accessToken: bot[0].token  });
                          client.message(dataA.reason, {}).then((data) => {
            
                  
                            chatResponse(dataA,data).then(resp => {
                              
                              
                              var messageData = {
                      
                      
                                recipient: {
                                  id: senderID
                                },
                                message: {
                                  text: resp
                                }
                              
                                
                              };
                              
                              

                              request({
              
              
                                uri: 'https://graph.facebook.com/v2.6/me/messages',
                                qs: { access_token: response_token },
                                method: 'POST',
                                json: messageData
                                
                            
                              }, function (error, response, body) {
                                
                                
                                console.log(response.statusCode);
                                return;
                  
                                
                                
                                if (!error && response.statusCode == 200) {
                                  
                                  var recipientId = body.recipient_id;
                                  var messageId = body.message_id;
                            
                                  console.log("Successfully sent generic message with id %s to recipient %s", 
                                    messageId, recipientId);
                                    return;
                                    
                                    
                                } else {
                                  
                                  console.error("Unable to send message.");
                                  console.error(error);
                                
                                  
                                }
                                
                                
                                
                              });  
                  
                              
                                    
          
                            })
                            .catch(err => {
                              
                              
                              if(err){
                                console.log(err);
                              }
                              
                              
                            });
            
                  
                          })
                          .catch(err=>{
                            
                            console.log("beanss");
                            console.log(err);  
                            
                            
                          });
                
                        
                       }
                       
                     }
                      
                      
                    })
                    
                  }
                  
                }
                
                
              });
              
            

            }
            
            
          }).catch(err=>{
            
            
            if(!err){
            }
            
            
          });
      
          
        }
        
      }
      
    }
    
  })
  .catch(err => {
    
    if(err){
    }
    
  });
  
  
}


// end the GET request
// begin the POST request


app.post('/upload/excel',function(req,res){
  
  
    upload(req,res,function(err) {
        
        
        if(err) {
            return res.send("Error uploading file." + err.message);
        }
        else{
          
          
          var bot_name = req.body.bot_name;
          var bot_id = req.body.bot_id;
          bot_name= bot_name.toLowerCase();
          
          // console.log( req );
          // return;
          
            
          if(req.file != undefined){
            
            
            
            if(req.file.mimetype != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
              res.send("File has a wrong content type. Please upload file with the right content-type. <a href='/bot/" + bot_id + "'>Go back to <b>" + bot_name.toUpperCase() + "</b></a>");
            }
            
            else
            {
            
              var file_path = req.file.path;
              BulkUpload(req.session,file_path,bot_name);
              res.send("File has been uploaded and processed successfully . <a href='/bot/" + bot_id + "'>Go back to <b>" + bot_name.toUpperCase() + "</b> to view changes</a>");
            
            }
            
          }
          else
          {
            res.send("Error occured in uploading file (File cannot be empty) . <a href='/bot/" + bot_id + "'>Go back to <b>" + bot_name.toUpperCase() + "</b></a>");
          }
          
          
        }
    
      
    });
  
});

app.post("/bot/set_no_response",function(req,res){
  
  
  var bot_id = req.body.bot_id;
  var response = req.body.response;
  var no_resp_data = {
    
    bot_id: bot_id,
    response: response
    
  }
  
  // check if a response exist
  
  schema.NoResponse.find({bot_id:bot_id},function(err,data){
    
    if(!err){
      
      
      if(data.length > 0){
        
        
        schema.NoResponse.update( {bot_id:bot_id},{ response:response },{upsert:true},function(err,data){
          
          if(!err){
            
          
            
            if(data.nModified > 0)
              res.send( {status:1, msg: "Default 'No Response' has been set sucessfully. "});
            else
              res.send( {status:0, msg: "No change was made on the response. "});
             
           
          }
          
        });
        
      }
      else
      {
        
          var NoResponseInsert = new schema.NoResponse(no_resp_data);
          NoResponseInsert.save(function(err,data){
            
            if(!err){
            
              
              
                res.send( {status:1, msg: "Default No Response has been set sucessfully. "});
                
              
            }
            else
              res.send( {status:0, msg: "An error occured in creating default response. "});
            
            
          });  
        
      }
      
    }
    
  });
  

  
  
});

app.post("/bot_setup",function(req,res){
  
  
  // var bot_name = req.body.bot_name;
  // var bot_desc = req.body.bot_desc;
  
  
  var username = req.body.username;
  var org_name = req.body.org_name;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var password = req.body.pword;
  
  var admin_data = {
    
    
    username: username,
    email: email,
    pword: crypto.createHash("md5").update(password).digest("hex"),
    fname: fname,
    lname: lname,
    org_name: org_name,
    role: 1,
    date_created: new Date().getDate(),
    
    
  };
  

  var msg;
  var msg_status;
  
  
  schema.Admin.find( {email:email}, function(err, rec_email){
          
    
    if(!err){
      
    
      if(rec_email.length == 0 || rec_email == undefined){
        
        
        var AdminIns = new schema.Admin(admin_data);
        AdminIns.save(function(err){
              
              
          if(err){
            
            msg = "There was an error in creating user. ";
            msg_status = -2;
          
          }
          else{
            
            msg = "Your profile has been created successfully. ";
            msg_status = 1;
            
              
          }
          
          res.send( {msg:msg,status:msg_status} );
          
        });
        
        
      }
      else{
        
        
        msg = "It appears this email already exists. Please change your email. ";
        msg_status = -7;
        res.send( {msg:msg,status:msg_status} );
        
      }
      
    }
    
    
  });
        
  
  
});

app.post("/console_login",function(req,res){
  
  
  // var pword = "ayodeji.fawole";
  // pword = crypto.createHash("md5").update(pword).digest("hex");
  // console.log(pword);
  // return;
  
  //req.session.destroy(); // destroy any session if it exists
  
  sess = req.session;
  var msg = "";
  var msg_status = null;
  var email = req.body.email;
  var pword = req.body.pword;
  
  
  if(email == "")
  {
    msg_status = -2;
    msg = "Email cannot be empty. ";
    res.send( { msg_status:msg_status, msg:msg });
    
  }
  else if(pword == ""){
    msg_status = -3;
    msg = "Password cannot be empty. ";
    res.send( { msg_status:msg_status, msg:msg });
    
  }
  else{
    
    
    pword = crypto.createHash("md5").update(pword).digest("hex");    
    schema.Admin.find( {email:email,pword: pword},function(err,recs){
      
      
      if(!err){
      
        
        if(recs.length > 0){
          
          
          // this means that the record exists, check if it has been approved
          
          
          
          msg_status = 1;
          msg = "Approved successfully. ";
          sess.email= recs[0].email;
          sess.username = recs[0].username;
          sess.name = recs[0].fname + " " + recs[0].lname;
          sess.role = recs[0].role;
          
            
          res.send( { msg_status:msg_status, msg:msg, role: recs[0].role });
            
          
          //res.send( { msg_status:msg_status, msg:msg, role: recs[0].role });
          
        }
        else{
          
          //console.log("issue");
          // check users table if the user exist
          
          schema.Users.find({email:email,pword:pword},function(err,user){
            
            if(!err){
              
              
              if(user.length > 0){
                
                
                // it means the user exist and was called via an invite
                
                schema.Admin.find( {_id:user[0].admin_id}, function(err,admin){
                  
                  
                  if(!err){
                    
                    if(admin.length > 0){
                      
                      //console.log("admin stuffs");
                      
                      msg_status = 1;
                      msg = "Approved successfully. ";
                      sess.email= user[0].email;
                      sess.username = admin[0].username;
                      sess.name = user[0].fname + " " + user[0].lname;
                      sess.role = user[0].role;
                      
                      res.send( { msg_status:msg_status, msg:msg, role: user[0].role });
                      
                    }
                    else
                    {
                      
                      msg_status = -6;
                      msg = "Admin record could not be found. ";
                      res.send( { msg_status:msg_status, msg:msg});
                        
                    }
                    
                  }
                  
                });
                
                
              }
              else{
  
                
                msg_status = -7;
                msg = "Incorrect username or password. Please ensure your login details are correct.";
                res.send( { msg_status:msg_status, msg:msg });
                
                
              }
              
            }
            
          });
          
          msg_status = -4;
          msg = "Incorrect details. Please login with the correct details. ";
          
        }
        
      }
      else{
        
        
        console.log(err.message);
        console.log("Error in login. ");
        return;
      
        
      }
      
      
    });
    
      
  }
  
  
});

app.post("/admin_login",function(req, res) {
   
   
   var email = req.body.email;
   var pword = req.body.pword;
   var msg;
   var msg_status;
   pword = crypto.createHash("md5").update(pword).digest("hex");
   
   
  // res.send(email);
  // return;
  
   
  // ConsoleAdmin.find( {email:email} ,function(err, admin_rec) {
     
     
  //   if(!err){
       
       
  //     // res.send(admin_rec.length.toString());
  //     // return;
       
      
  //     if(admin_rec.length > 0){
         
  //       msg = "Admin authenticated successfully. ";
  //       msg_status = 1;
         
  //     }
  //     else{
         
  //       msg = "Couldn't find record. ";
  //       msg_status = 0;
         
  //     }
       
       
  //     res.send( { msg_status:msg_status, msg:msg });
       
     
  //   }
     
     
  // });
   
    
    
});

app.post("/create_bot",function(req, res) {
  
  sess = req.session;
  var msg,msg_status;
  
  var bot_type = req.body.bot_type;
  var bot_name = req.body.bot_name;
  var bot_desc = req.body.bot_desc;
  
  
  if(bot_name.indexOf(' ') != -1)
  {
    
    msg = "Some characters are not allowed in your bot creation process. ";
    msg_status = -1;
    res.send( {msg:msg,msg_status:msg_status} );
    
  }
  else{
  
    
    //console.log("creating");
    
    schema.BotSetup.find({name:bot_name.toUpperCase()},function(err, bot){
      
      if(!err){
        
        
        // console.log(sess.email);
        // return;
        
        
        if(bot.length > 0){
          
          
          msg = "Name '" + bot_name + "' already exists. ";
          msg_status = -4;
          res.send( { msg:msg, msg_status:msg_status } );
  
        }
        else
        {
          
          var bot_data = {
  
            username : sess.username,
            name: bot_name.toUpperCase(),
            description: bot_desc,
            type: bot_type,
            date_created: new Date().getDate(),
            created_by: sess.email,
            approved:0,
            approved_by: "",
            date_approved: "",
            token: ""
            
          };
          var BotInsert = new schema.BotSetup(bot_data);
          BotInsert.save(function(err,data){
            
            var msg,msg_status;
            
            if(!err){
              
              var data_id = data._id;
              var url = wit_api+"apps";
              request({
                
                url: url,
                method: "POST",
                json: true,
                headers: {
                  
                  "authorization": "Bearer 5AB2ZP4UIGQDMBYYQVAQJ7SZG3E6Q2Z7",
                  "content-type": "application/json",
                  
                },
                
                body: { 
                  
                  "name": bot_name.toLowerCase(),
                  "lang": "en",
                  "private": "true"
                  
                }
                
                
              },function(err,response,body){
                
                
                console.log(response);
                console.log(response.statusCode);
                
                
                if(!err){
                  
                  if( (response.statusCode == 200) && response.body.access_token != ""){
                    
                    
                    // update access token
                    
                    
                    schema.BotSetup.update({_id:data_id},{token:response.body.access_token},{upsert:true},function(err,botz){
                      
                      
                      if(!err){
                        
                        msg = "BOT ' " + bot_name + " ' has been created successfully. :) ";
                        msg_status = 1;
                        
                      }
                      
                      else
                      {
                        
                        msg = response.body.errors[0];
                        msg_status = -9;
                        
                      }
                      
                      res.send( { msg:msg, msg_status:msg_status } );
                      
                    });
                    
                      
                  }
                  else{
                    

                
                    // override insertion
                    
                    schema.BotSetup.remove( {_id:data_id},function(err){
                      
                      if(!err){
                        
                        msg = "Bot couldn't be setup succesfully because of a server issue on the learning engine. Please try again and if this persist, please send an email to fintech@gtbank.com";
                        msg_status = -3;
                        res.send( { msg:msg, msg_status:msg_status } );
                        
                      }
                      
                    });
                      
                  }
                  
                }
                else
                {
                  
                  msg = "Error occured in setting up on Wit. ";
                  msg_status = -3;
                  res.send( { msg:msg, msg_status:msg_status } );
                  
                }
                
                

                
                
              });
              
              
            }
            else
            {
              console.log("error");
            }
              
            
          });
          
        }
        
        
      }
      
        
    });
    
  }
  
    
});

app.post("/add_cat",function(req, res) {
   
  
  sess = req.session;
  var cat_name = req.body.name;
  var cat_desc = req.body.desc;
  var bot_name = req.body.bot_name;
  

  var cat_data = {

    name: cat_name,
    description: cat_desc,
    bot_name: bot_name.toLowerCase(),
    username: sess.username,
    date_created: new Date().getDate(),
    created_by: sess.email,
    approved: 1,
    approved_by: sess.email

  };
  
  schema.Categories.find( {name:cat_name,bot_name:bot_name.toLowerCase() },function(err,cat){
    
    
    var msg,msg_status;
    if(!err){
      
      if(cat.length > 0){
        
        msg = "It appears this category already exists. ";
        msg_status = -1;
        res.send({ msg:msg,msg_status:msg_status });
        
      }
      else
      {
        
        
        // get token via the bot name
        
        schema.BotSetup.find( {name:bot_name.toUpperCase()},function(err, bot){
          
          
          if(!err){
            
            
            var bot_token;
            if(bot.length > 0)
              bot_token = bot[0].token;
            else
              bot_token = "<< no token >>";
            
            
            // console.log(bot_token);
            // return;
            
            var CatInsert = new schema.Categories(cat_data);
            CatInsert.save(function(err,data){
              
              
              cat_name = formatCategory(cat_name);
              
        
              if(err)
                console.log("error");
              else{
                
                
                
                var url = wit_api + "entities";
                var json_entity = {
              
              
                  "id":cat_name,
                  "lookups": ["keywords"]
                
                };
                request({
              
                  url: url,
                  method: "POST",
                  json: true,
                  headers: {
              
                    "authorization": "Bearer " + bot_token,
                    "content-type": "application/json",
              
                  },
                  body: json_entity
                }, function(err,response,body){
                  
                    
                    
                    if(!err){
                      
                      
                      // console.log(response);
                      // console.log(bot_token);
                      
                    
                      if(response.body.builtin == false){
                        
                        msg = "Category created successfully. ";
                        msg_status = 1;
                        
                      }
                      else
                      {
                  
                        msg = "Error happened in adding category. ";
                        msg_status = -1;
                        
                      }
                      
                      res.send({ msg:msg,msg_status:msg_status });
                      
                    }
                  
                  
                });
                
                
                
              }
            
              
            });
            
        
          }
          
            
        });
        
      }
      
        
    }
    
    
  });

    
});

app.post("/delete_cat",function(req, res){
  
  var cat_id = req.body.cat_id;
  var cat_name,bot_name,bot_token;
  var msg,msg_status;
  
  schema.Categories.find( {_id:cat_id},function(err, cat){
    
    if(!err){
      
      if(cat.length > 0){
        
        cat_name = cat[0].name;
        bot_name = cat[0].bot_name;
        
        schema.Categories.remove( {_id:cat_id},function(err){
          
          
          if(!err){
            
            
            // delete from wit
            // get the token from the bot name;
            
            schema.Keywords.remove( {cat_id:cat_id},function(err){
                
            
              if(!err){
                
                
                schema.Synonyms.remove({ cat_id:cat_id },function(err){
                  
                  
                  
                  
                  if(!err){
                    
                    
                    schema.Values.remove( {cat_id:cat_id},function(err){
                      
                      
                      
                      if(!err)
                      {
                        
                        schema.BotSetup.find( { name:bot_name.toUpperCase() },function(err, bot){
              
              if(!err){
                
                bot_token = bot[0].token;
                cat_name = formatCategory(cat_name);
                var url = wit_api + "entities/" + cat_name;
                
                request({
              
                  url: url,
                  method: "DELETE",
                  json: true,
                  headers: {
              
                      "authorization": "Bearer " + bot_token,
              
                  },
                  
                }, function(err,response,body){
                  
                    
                    if(!err){
                      
                      
                      // console.log( response );
                      // console.log( cat_name );
                      // console.log( bot_token );
                      // console.log( cat_id );
                      
                      //return;
                      
                      
                      if(response.body.deleted.toLowerCase().trim() == cat_name.replace(new RegExp(" ", "g"),"_").toLowerCase().trim()){
                        
                        msg = "Category has been deleted successfully. ";
                        msg_status = 1;
                          
                      }
                      
                      else
                      {
                        
                        msg = "An error occured in deleting this category. ";
                        msg_status = -1;
                        
                      }
                      
                      
                      res.send({ msg:msg,msg_status:msg_status });
                      
                      
                      //console.log(bot_token);
                      
                    
                      // if(response.body.builtin == false){
                        
                      //   console.log("Category created successfully. ");
                      //   msg = "Category created successfully. ";
                      //   msg_status = 1;
                        
                      // }
                      // else
                      // {
                  
                      //   msg = "Error happened in adding category. ";
                      //   msg_status = -1;
                        
                      // }
                      
                      //res.send({ msg:msg,msg_status:msg_status });
                      
                    }
                  
                  
                });
                
                
              }
                
            });
                    
                      }
                      
                    
                    });
            
                
                  }
                  
                
                });
              
                
              }
            
            
            });
            
            
          }
          
          
        });
        
      }
      
    }
      
  });
  
    
});

app.post("/add_keyword",function(req, res){
  
  
  sess = req.session;
  
  var msg,msg_status;
  var keyword = req.body.keyword;
  var bot_id = req.body.bot_id;
  var cat_id= req.body.cat_id;
  
  
  if(keyword == ""){
    
    msg_status = -1;
    msg = "Keyword cannot be empty. ";
    
  }
  else{
    
    
    var keyword_data = {

      
      name: keyword,
      cat_id: cat_id,
      bot_id: bot_id,
      username: sess.username,
      date_created: new Date().getDate(),
      created_by: sess.email,
      approved: 1,
      approved_by: sess.email,
      comment: ""
      

    };
    
    var KeywordIns = new schema.Keywords(keyword_data);
    KeywordIns.save(function(err,data){
      
      
      if(!err){
        
        // insert it into wit
        
        var bot_token,cat_name;
        schema.BotSetup.find({_id:bot_id},function(err, bot){
          
          
          if(!err){
            
            bot_token = bot[0].token;
            schema.Categories.find({_id:cat_id},function(err, cat){
              
              if(!err){
                
                
                if(cat.length > 0)
                  cat_name = cat[0].name;
                else
                  cat_name = "";
                
                
                cat_name = formatCategory(cat_name);
                
                
                var url = wit_api + "entities/" + cat_name + "/values";
                var json_entity = {
          
                  "value":keyword
          
                };
                
                // console.log(keyword);
                // console.log(url);
                // console.log(bot_token);
                // return;
                
                
                request({
          
                  
                  url: url,
                  method: "POST",
                  json: true,
                  headers: {
            
                      "authorization": "Bearer " + bot_token,
                      "content-type": "application/json",
            
                  },
                  proxy: 'http://proxy.gtbank.com:80',
                  body: json_entity
                  
                }, 
                      
                function(err,response,body){
          
          
                  if(!err){
                    
                    if(response.body.builtin == false){
                      
                      msg = "Keyword has been added successfully. ";
                      msg_status = 1;
                        
                    }
                    else
                    {
                      
                      msg = "An error occured in entering this keyword. ";
                      msg_status = -1;
                      
                    }
                    
                    res.send( {msg:msg,msg_status:msg_status} );
                    
                    
                  }
                  else{
                    console.log(err);
                    console.log("error occured in creating this response. ");
                  }
                  
          
                });

                
              }
              
                
            });
            
          
          }
          
            
        });
        
        
        
        
      }
      
    });
  
    
  }
  
    
});

app.post("/add_synonym",function(req, res){
  
  
  sess = req.session;
  var msg,msg_status;
  var synonym = req.body.synonym;
  var keyword_id = req.body.keyword_id;
  var bot_id = req.body.bot_id;
  var cat_id = req.body.cat_id;
  
  
  var synonym_data = {
    
    name: synonym,
    keyword_id: keyword_id,
    bot_id: bot_id,
    cat_id: cat_id,
    username: sess.email,
    date_created: new Date().getDate(),
    created_by: sess.email,
    approved: 1,
    approved_by: sess.email,
    comment: ""
    
  };
  var cat_name;
  var keyword_name;
  var bot_token;
  
  
  var SynonymIns = new schema.Synonyms(synonym_data);
  SynonymIns.save(function(err,data){
    
    if(!err){
      
      
      // add it to wit framework
      
      
      schema.Categories.find({_id:cat_id},function(err, cat){
        
        
        if(!err){
          
          if(cat.length > 0)
          {
            
            
            if(cat[0].name.indexOf(" ") > -1)
              cat_name = cat[0].name.replace(new RegExp(" ", "g"),"_");
            else
              cat_name = cat[0].name; 
            
            
            schema.Keywords.find({_id:keyword_id},function(err,keyword){
              
              if(!err){
                
                
                if(keyword.length > 0){
                  
                  
                  schema.BotSetup.find({_id:bot_id},function(err, bot){
                    
                    
                    if(!err){
                      
                      
                      if(bot.length > 0){
                        
                        
                        
                        bot_token = bot[0].token;
                        keyword_name = keyword[0].name;
                        
                        
                        if(keyword_name.indexOf("?") > -1)
                          keyword_name = keyword_name.replace("?","%3F");
                        
                        
                        var url = wit_api + "entities/" + cat_name + "/values/" + keyword_name + "/expressions";
                        var json_entity = {"expression":synonym};
                        request({
                  
                          url: url,
                          method: "POST",
                          json: true,
                          headers: {
                  
                              "authorization": "Bearer " + bot_token,
                              "content-type": "application/json",
                  
                          },
                          body: json_entity
                        }, function(err,response,body){
                        
                          
                          
                          if(!err){
                            
                            
                            console.log(response);
                            
                          
                            if(response.body.builtin == false){
                      
                              
                              
                              msg = "Similar question has been added successfully. Refresh page to view it. ";
                              msg_status = 1;
                              res.send({msg:msg,msg_status:msg_status});
                              
                      
                            }
                            else
                            {
                              
                              msg = "An error occured in adding synonym to the learning engine. ";
                              msg_status = -1;
                              res.send({ msg:msg,msg_status:msg_status });
                            
                              
                            }
                            
                          
                          }
                
                  
                        });



                        
                      }
                      
                      
                    }
                      
                  });
                
                }
                
              }
              
            });
            
          }
          
        }
          
      });
      
    }
    
    else{
      
      msg = "There was an error in adding synonym. ";
      msg_status = -1;
      res.send({msg:msg,msg_status:msg_status});
      
    }
    
    
  });
  
  
});

app.post("/delete_synonym",function(req, res){
  
  
  var syn_id= req.body.syn_id;
  var bot_id;
  var bot_token;
  var cat_id;
  var cat_name;
  var keyword_id;
  var keyword_name;
  var syn_name;
  var msg,msg_status;
  
  
  schema.Synonyms.find({_id:syn_id},function(err,syn){
    
    
    if(!err){
      
      
      if(syn.length > 0){
        
        
        bot_id = syn[0].bot_id;
        cat_id = syn[0].cat_id;
        keyword_id = syn[0].keyword_id;
        syn_name = syn[0].name;
        
        

        schema.BotSetup.find( {_id:bot_id}, function(err, bot){
          
          if(!err){
            
            if(bot.length > 0){
              
              bot_token = bot[0].token;
              schema.Categories.find( {_id:cat_id}, function(err, cat){
                
                if(!err){
                  
                  if(cat.length > 0){
                    
                    cat_name = cat[0].name;     
                    schema.Keywords.find({_id:keyword_id},function(err,keyword){
                      
                      if(!err){
                        
                        if(keyword.length > 0){
                          
                          keyword_name = keyword[0].name;
                          schema.Synonyms.remove( { _id:syn_id },function(err){
    
                            
                            if(!err){
                              
                              // delete from wit
                              
                              var url_delete = wit_api+"entities/" + cat_name + "/values/" + keyword_name + "/expressions/" + syn_name;
                              request({
                        
                                url: url_delete,
                                method: "DELETE",
                                json: true,
                                headers: {
                        
                                    "authorization": "Bearer " + bot_token
                        
                                },
                                
                              }, function(err,response,body){
                              
                                
                                
                                if(!err){
                                  
                                  
                                  console.log(response);
                                  console.log(syn_name);
                                  
                                  if(response.body.deleted != "" || response.body.deleted != undefined){
                                    
                                    
                                    msg = "Similar Question has been deleted successfully.  ";
                                    msg_status = 1;

                                    
                                      
                                  }
                                  else
                                  {
                                    
                                    msg = "An error occured in deleting similar questions. ";
                                    msg_status = -1;
                                    
                                  }
                                  
                                  res.send({ msg:msg,msg_status:msg_status });
                                  
                                
                                }
                        
                        
                              });
                              
                            
                            }
                            
                            
                        
                          });
                          
                          
                        }
                        
                        
                      }
                      
                    });
                      
                  }
                  
                }
                  
              });
                
            }
            else{
              
              console.log("bot not found. ");
              
            }
            
          }
            
        });
        
      }
      
    }
    
  });
  
  
    
});

app.post("/delete_keyword",function(req, res){
  
  
  var keyword_id = req.body.keyword_id;
  var cat_id;
  var bot_id;
  var cat_name;
  var keyword_name;
  var bot_token;
  var msg;
  var msg_status;
  
  
  schema.Keywords.find( {_id:keyword_id}, function(err, keyword){
    
    if(!err){
      
      if(keyword.length > 0){
        
        cat_id = keyword[0].cat_id;
        bot_id = keyword[0].bot_id;
        keyword_name = keyword[0].name;
        
        schema.Categories.find({_id:cat_id},function(err, cat){
          
          if(!err){
            
            if(cat.length > 0){
              
              cat_name = cat[0].name;
              
              // get the bot token
              
              schema.BotSetup.find({_id:bot_id},function(err, bot){
                
                if(!err){
                  
                  if(bot.length > 0){
                    
                    bot_token = bot[0].token;
                    
                    // we have gotten all the data from our callbacks, Now delete the keyword
                    
                    schema.Keywords.remove({_id:keyword_id},function(err){
                      
                      if(!err){
                        
                        
                        schema.Synonyms.remove({keyword_id:keyword_id},function(err){
                          
                          
                          if(!err){
                            
                            
                            // delete expressions and values too then we would go to wit but now go to wit
                            
                            keyword_name = keyword_name.replace("?","%3F");
                            
                            var url_delete = wit_api + "entities/" + cat_name + "/values/" + keyword_name
                            request({
                  
                              url: url_delete,
                              method: "DELETE",
                              headers: {"authorization": "Bearer " + bot_token}
                            }, function(err,response,body){
                  
                              if(!err){
                                
                                
                                console.log( response );
                                console.log( body );
                                console.log( err );
                                
                                
                                msg = "Keyword has been deleted successfully. ";
                                msg_status = 1;
                                  
                              }
                              else{
                                
                                msg = "An error occured in deleting this keyword. ";
                                msg_status = -1;
                                
                              }
                              
                              res.send({msg:msg,msg_status:msg_status});
                              
                            
                              
                            });
                            
                          }
                          
                          
                        });
                        
                        
                      }  
                      
                    });
                    
                  }
                  
                }
                  
              });
              
            }
            
          }
            
        });
        
      }
      
    } 
      
  });
  
  

  
  
    
});

app.post("/add_expression",function(req, res){
  
  
  sess = req.session;
  var exp = req.body.expression;
  var keyword_id = req.body.keyword_id;
  var cat_id = req.body.cat_id;
  var bot_id = req.body.bot_id;
  var msg,msg_status;
  
  if(exp == ""){
    
    msg_status = 0;
    msg = "Expression value cannot be empty. ";
    res.send({msg:msg,msg_status:msg_status});
    
  }
  else{
    
    
    var expression_data = {
      
      name: exp,
      keyword_id: keyword_id,
      bot_id: bot_id,
      cat_id: cat_id,
      username: sess.email,
      date_created: new Date().getDate(),
      created_by: sess.email,
      approved: 1,
      approved_by: sess.email,
      comment: ""
      
    };
    var cat_name;
    var keyword_name;
    var bot_token;
    
    
    var ExpressionIns = new schema.Expressions(expression_data);
    
      
      // add the expression to wit
        
    schema.BotSetup.find( {_id:bot_id}, function(err, bot){
          
          if(!err){
            
            if(bot.length > 0){
              
              bot_token = bot[0].token; // it means that the token exists
              
              // get the category and the keyword;
              
              schema.Categories.find({_id:cat_id},function(err, cat){
                
                if(!err){
                  
                  if(cat.length > 0){
                    
                    cat_name = cat[0].name;
                    schema.Keywords.find({_id:keyword_id},function(err, keyword){
                      
                      if(!err){
                        
                        if(keyword.length > 0){
                          
                          ExpressionIns.save(function(err,data){
                          
                            
                            if(!err){
                              
                            
                              keyword_name = keyword[0].name;
                              
                              
                              var url = wit_api+"samples";
                              var json_entity = [{
                    
                    
                                "text":exp,
                                "entities": [
                    
                                  {
                    
                                    entity: cat_name,
                                    value: keyword_name,
                    
                                  }
                    
                                ]
                    
                    
                              }];
                              request({
                    
                                url: url,
                                method: "POST",
                                json: true,
                                headers: {
                    
                                    "authorization": "Bearer " + bot_token,
                                    "content-type": "application/json",
                    
                                },
                                body: json_entity
                              }, 
                              function(err,response,body){
                                
                                
                                if(!err){
                                  
                                  //console.log(response);
                                  
                                  if(response.body.sent == true){
                      
                      
                                    msg = "Expression has been added successfully. ";
                                    msg_status = 1;
                      
      
                                  }
                      
                                  else
                                  {
                      
                                    console.log(response.body);
                                    msg = "An error occured in adding expression. ";
                                    msg_status = -1;
                                    
                                  }
                                  
                                
                                  res.send({ msg:msg,msg_status:msg_status });
                                  
                                
                                }
                    
                              
                              });
                            
                              
                            }
                            

                          });
                          
                          
                        }
                        else{
                          
                          msg = "No keyword for expression to be matched to. ";
                          msg_status = -3;
                          
                        }
                        
                      }
                        
                    });
                    
                  }
                  else{
                    
                  }

                  
                }
                
                
              });
              
              
            }
            
          }
          
            
        });
        
      
      
    
  }
  
    
});

app.post("/add_value", function(req, res){
  
  
  sess = req.session;
  var val = req.body.value;
  var keyword_id = req.body.keyword_id;
  var cat_id = req.body.cat_id;
  var bot_id = req.body.bot_id;
  var msg,msg_status;
  
  
  schema.Values.find({keyword_id:keyword_id,username:sess.username},function(err,values){
    
    
    if(!err){
      
      
      if(values.length > 0){
        
        //means that the value has already been inserted
        
        msg = "A value for this keyword already exists. ";
        msg_status = -1;
        
      }
      else
      {
        
        var value_data = {
          
          
          value: val,
          keyword_id: keyword_id,
          bot_id: bot_id,
          cat_id: cat_id,
          username: sess.username,
          date_created: new Date().getDate(),
          created_by: sess.email,
          approved: 1,
          approved_by: sess.email,
          comment: ""
          
          
        };
        var ValueIns = new schema.Values(value_data);
        ValueIns.save(function(err,data){
          
          
          if(!err){
            
            msg = "Value has been added successfully. ";
            msg_status = 1;
            
          }
          else
          {
            
            msg = err.message;
            msg_status = -1;
            
          }
          
          res.send({msg:msg,msg_status:msg_status});
          
          
        });
        
      
        
      }
     
      
    }
    
  });
  
    
});

app.post("/send_invite",function(req, res){
  
  
  sess = req.session;
  var email = req.body.email;
  var msg,msg_status;
  
  if(email == ""){
    
    msg = "Email cannot be empty";
    msg_status = -1;
    res.send({msg:msg,msg_status:msg_status});
    
    
  }
  else if(email == sess.email){
    
    msg = "You cannot send an invite to yourself. ";
    msg_status = -2;
    res.send({msg:msg,msg_status:msg_status});
    
    
  }
  else{
    
    // submit the invite to mongodb
    
    schema.Invites.find( { email:email,username:sess.username },function(err,invite){
      
      if(!err){
        
        if(invite.length ==  0){
          
          // it means an invite has been sent  to this user
          
          var invite_data = {
            
            recipient: email,
            sender: sess.email,
            registered: 0,
            username:sess.username,
            date_sent: new Date().getDate()
            
          };
          var InviteIns = new schema.Invites(invite_data);
          
          InviteIns.save(function(err,data){
            
            if(!err){
              
              var invite_link;
              var invite_msg;
              
              if(data.recipient == email){
                
                // generate link  for the user to do his registration
                
                
                invite_link = domain + "/invite/" + data._id;
                invite_msg = "You have received an invite from " + data.sender ;
                invite_msg += "<p> Click <a href='" + invite_link + "'> here </a> to get registered. </p>";
                
                emailSender(data.recipient,"BOTIfy User Invite",invite_msg);
                
                msg = "Email Invite to " + data.recipient + " has been sent successfully. ";
                msg_status = 1;
                
              }
              else{
                
                msg = "Email Invite to " + data.recipient + " has been sent successfully. ";
                msg_status = -1;
              
              }
              
              
            }
            else{
              
              msg = err.message;
              msg_status = -1;
              
            }
            
            res.send( { msg:msg,msg_status:msg_status } );
            
          });
          
        }
        else{
          console.log("an invite has been sent to this user. ");
        }
        
      }
      
      
    });
    
  }
  
  // emailSender();  

  
    
});

app.post("/register_user",function(req, res){
  
  
  
  var fname = req.body.fname;
  var lname = req.body.lname;
  var pword = req.body.pword;
  var email = req.body.email;
  var invite_id = req.body.invite_id;
  var sender = req.body.sender;
  var id;
  var username;
  
  
  schema.Admin.find({email:sender},function(err, admin){
    
    if(!err){
      
      if(admin.length > 0){
        
        
        id = admin[0]._id;
        username = admin[0].username;
        
        
        schema.Users.find( { email:email }, function(err,user){
          
          if(!err){
            
            var msg,msg_status;
            if(user.length > 0){
              
              msg = "this user already exists. ";
              msg_status = 0;
              
              res.send( {msg:msg,msg_status:msg_status} );
              
            }
            else
            {
              
              
              var user_data = {
                
                
                fname: fname,
                lname: lname,
                pword: crypto.createHash("md5").update(pword).digest("hex"),
                email: email,
                role: 0,
                admin_id: id,
                date_created: new Date().getDate(),
                invite_id: invite_id,
                username: username
    
              };
              
              var UserIns = new schema.Users(user_data);
              UserIns.save(function(err,data){
                
                if(!err){
                  
                  
                  msg = "User has been registered successfully. ";
                  msg_status = 1;
                }
                else{
                  
                  msg = err.message;
                  msg_status = -1;
                
                  
                }
                
                res.send( {msg:msg,msg_status:msg_status} );
                
              });
              
            }
            
          }
          else{
            console.log(err.message);
          }
          
        });
        
      }
      else{
        console.log("could not get the admin data. ");
      }
      
    }
      
  });
  
  
    
});

app.post("/fasttrack",function(req, res){
  
  var xls_data = req.body.result;
  xls_data = JSON.parse(xls_data);
  var cat_id;
  var keyword_id,synonym_id,exp_id;
  var cat_data;
  var keyword_data;
  var syn_data;
  var exp_data;
  var val_data;
  
  if(xls_data.length > 0){
    
    
    for(var i=0; i<xls_data.length; i++){
      
      
      if(xls_data[i].Category != ""){
        
        cat_data = {
        
          name: cat_name,
          description: cat_desc,
          bot_name: bot_name,
          username: sess.username,
          date_created: new Date().getDate(),
          created_by: sess.email,
          approved: 1,
          approved_by: sess.email
      
        };
        
        schema.Categories.save(function(err,data){
          
          if(!err){
            
            cat_id = data[0]._id; 
            
            
          }
          
        });
        
        
      }
      else{
        
        // insert the keyword
        
        
        
        
      }
      
      
    }
    
  }
  
    
});

app.post("/delete_bot",function(req, res){
  
  var bot_id = req.body.bot_id;
  var bot_name;
  var msg,msg_status;
  
  schema.BotSetup.find({_id:bot_id},function(err, bot){
    
    
    if(!err){
      
      if(bot.length > 0){
        
        // it means that the bot does not exists
        
        bot_name = bot[0].name;
        schema.BotSetup.remove({_id:bot_id},function(err){
          
          if(!err){
            
            msg = "Bot " + bot_name + " has been deleted successfully. ";
            msg_status = 1;
            
          }
          else
          {
            
            msg = err.message;
            msg_status = -1;
            
          }
          
          res.send( {msg:msg,msg_status:msg_status} );
          
          
        });

        
      }
      else{
        
        msg = err.message;
        msg_status = -2;
        res.send( {msg:msg,msg_status:msg_status} );
        
        
      }
      
    }
      
  });
  
    
});

app.post("/get_synonym",function(req, res){
  
  
  var syn_id = req.body.syn_id;
  var synonym;
  schema.Synonyms.find({_id:syn_id},function(err, syn) {
    
    if(!err){
      
      
      if(syn.length > 0)
        synonym = syn[0].name;
      else
        synonym = "";
        
        
      res.send( {synonym:synonym,syn_status:1} );
      
      
    }
      
  });
    
    
});

app.post("/edit_synonym",function(req, res){
  
  var synonym = req.body.synonym;
  var synonym_id = req.body.synonym_id;
  var msg,msg_status;
  var old_synonym;
  var bot_id,cat_id,bot_token,cat_name,keyword_id,keyword_name;
  
  
  if(synonym == ""){
    
    msg = "Synonym cannot be empty. ";
    msg_status = -1;
    res.send( {msg:msg,msg_status:msg_status} );
    
  }
  else{
    
    
    schema.Synonyms.find({_id:synonym_id},function(err, syn){
      
      if(!err){
        
        if(syn.length > 0){
          
          
          old_synonym = syn[0].name;
          bot_id = syn[0].bot_id;
          cat_id = syn[0].cat_id;
          keyword_id = syn[0].keyword_id;
          
          schema.BotSetup.find({_id:bot_id},function(err, bot){
            
            if(!err){
              
              if(bot.length > 0){
                
                
                bot_token = bot[0].token;
                schema.Categories.find({_id:cat_id},function(err, cat){
                  
                  if(!err){
                    
                    if(cat.length > 0){
                      
                      cat_name = cat[0].name;
                      schema.Keywords.find({_id:keyword_id},function(err, keyword){
                        
                        if(!err){
                          
                          if(keyword.length > 0){
                            
                            
                            
                            keyword_name = keyword[0].name;
                            schema.Synonyms.update( {_id:synonym_id}, {name:synonym},{upsert:true},function(err){
      
                              if(!err){
                                
                                
                                // msg = "Synonym has been updated successfully. ";
                                // msg_status = 1;
                                
                                
                                var url_delete = wit_api+"entities/" + cat_name + "/values/" + keyword_name + "/expressions/" + old_synonym;
                                request({
                        
                                url: url_delete,
                                method: "DELETE",
                                json: true,
                                headers: {
                        
                                    "authorization": "Bearer " + bot_token
                        
                                },
                                
                                }, function(err,response,body){
                              
                                
                                
                                if(!err){
                                  
                                  
                                  
                                  if(response.body.deleted == old_synonym){
                                    
                                    
                                    var url = wit_api + "entities/" + cat_name + "/values/" + keyword_name + "/expressions";
                                    var json_entity = {"expression":synonym};
                                    request({
                              
                                      url: url,
                                      method: "POST",
                                      json: true,
                                      headers: {
                              
                                          "authorization": "Bearer " + bot_token,
                                          "content-type": "application/json",
                              
                                      },
                                      body: json_entity
                                    }, function(err,response,body){
                                    
                                      
                                      
                                      if(!err){
                                        
                                        
                                        // console.log(response);
                                        
                                      
                                        if(response.body.builtin == false){
                                  
                                  
                                          msg = "Synonym '" + synonym + "' has been updated successfully.  ";
                                          msg_status = 1;
                                          res.send({msg:msg,msg_status:msg_status});
                                  
                                        }
                                        else
                                        {
                                          
                                          msg = "An error occured in updating synonym to the learning engine. ";
                                          msg_status = -9;
                                          res.send({msg:msg,msg_status:msg_status});
                                          
                                          
                                        }
                                        
                                      
                                      }
                            
                              
                                    });

                                    
                                      
                                  }
                                  else
                                  {
                                    
                                    msg = "An error occured in deleting synonym. ";
                                    msg_status = -1;
                                    res.send({ msg:msg,msg_status:msg_status });
                                    
                                  }
                                  
                                  
                                  
                                
                                }
                        
                        
                              });
                                
                               
                              }
                              else
                              {
                                
                                msg =  err.message;
                                msg_status = -2;
                                res.send( {msg:msg,msg_status:msg_status} );
                                
                              }
                              
                            });
                            
                          }
                          
                        }
                          
                      });
                      
                    }
                    
                  }
                    
                });
                
                
              }
              
            }
              
          });
          
          
        }
        
      }
        
    });
    
    
  }
  
    
});

app.post("/get_value",function(req, res){
  
  var value_id = req.body.value_id;
  schema.Values.find({_id:value_id},function(err, value){
    
    if(!err){
      
      if(value.length > 0)
        res.send({ msg:value[0].value,msg_status:1 });
      else
        res.send({ msg:"not found",msg_status:0 });
      
    }
      
  });
    
});

app.post("/update_value",function(req, res){
  
  var value_id = req.body.value_id;
  var value = req.body.value;
  
  schema.Values.update({_id:value_id},{value:value},{upsert:true},function(err,values){
    
    if(!err)
      res.send( {msg:"Value '" + value + "' has been updated successfully. ", msg_status:1} );
    else
      res.send( {msg:"An error occured in updating value/response. ", msg_status:1} );
      
      // My name is Michael
    
  });
  
    
});

app.post("/get_expression",function(req, res){
  
  var exp_id = req.body.expression_id;
  var exp_name;
  var msg_status;
  
  schema.Expressions.find({_id:exp_id},function(err,exp){
    
    if(!err){
      
      
      if(exp.length > 0){
        
        
        exp_name = exp[0].name;
        msg_status = 1;
        
      }
      else{
        
        exp_name = exp_id;
        msg_status = 0;
        
      }
      
      res.send({ msg:exp_name,msg_status:msg_status });
      
    }
    
    
  });
    
});

app.post("/update_expression",function(req, res){
  
  
  var exp_id = req.body.expression_id;
  var exp = req.body.expression;
  var bot_id;
  var cat_id;
  var bot_token;
  var cat_name;
  var url;
  var keyword_id;
  var msg_status,msg;
  
  
  schema.Expressions.find( {_id:exp_id}, function(err, exps){
    
    
    if(!err){
      
      if(exps.length > 0){
        
        
        bot_id = exps[0].bot_id;
        cat_id = exps[0].cat_id;
        keyword_id = exps[0].keyword_id;
        
        
        schema.BotSetup.find({_id:bot_id},function(err, bots){
          
          
          if(!err){
            
            if(bots.length > 0){
              
              
              bot_token = bots[0].token;
              schema.Categories.find({_id:cat_id},function(err, cats){
                
                if(!err){
                  
                  if(cats.length > 0){
                    
                    
                    cat_name = cats[0].name;
                    schema.Keywords.find({_id:keyword_id},function(err, keywords){
                      
                      if(!err){
                        
                        
                        if(keywords.length > 0){
                          
                          
                          schema.Expressions.update({_id:exps[0]._id},{ name: exp },{upsert:true},function(err){
                            
                            if(!err){
                              
  
                              url = wit_api+"samples";
                              var json_entity = [{
                    
                    
                                "text":exp,
                                "entities": [
                    
                                  {
                    
                                    entity: cat_name,
                                    value: keywords[0].name,
                    
                                  }
                    
                                ]
                    
                    
                              }];
                              request({
                    
                                url: url,
                                method: "POST",
                                json: true,
                                headers: {
                    
                                    "authorization": "Bearer " + bot_token,
                                    "content-type": "application/json",
                    
                                },
                                body: json_entity
                              }, 
                              function(err,response,body){
                                
                                
                                if(!err){
                                  
                                  //console.log(response);
                                  
                                  if(response.body.sent == true){
                      
                      
                                    msg = "Expression has been added successfully. ";
                                    msg_status = 1;
                      
          
                                  }
                      
                                  else
                                  {
                      
                                    console.log(response.body);
                                    msg = "An error occured in adding expression. ";
                                    msg_status = -1;
                                    
                                  }
                                  
                                  res.send({ msg:msg,msg_status:msg_status });
                                  
                                
                                }
                    
                              
                              });
                              
                            
                              
                            }
                            
                          
                            
                          });
                        
                        
                        }
                    
                    
                      }
                        
                    });

                  }
                  
                }
                
                  
              });    
              
              
            }
            
          }
          
            
        });
        
        
        
      }
      
      
    }
      
  });
  
    
});

app.post("/delete_expression",function(req,res){
  
  
  var expression_id = req.body.expression_id;
  var msg,msg_status;
  
  schema.Expressions.remove( {_id:expression_id },function(err){
    
    
    if(!err){
      
      msg = "Expression has been deleted successfully. ";
      msg_status = 1;
      
    }
    else
    {
      
      msg = err.message;
      msg_status = 0;
      
    }
    
    res.send( {msg:msg,msg_status:msg_status} );
    
    
  });
  
  
});

app.post("/finish_integration",function(req, res){
  
  
  var app_name= req.body.app_name;
  var access_token = req.body.access_token;
  var bot_id = req.body.bot_id;
  sess = req.session;
  
  schema.Integrations.find( { bot_id:bot_id,access_token:access_token }, function(err,ints){
    
    
    var msg;
    var msg_status;
    
    
    if(!err){
      
      if(ints.length > 0){
        
        msg = "It appear an integration with facebook already exists on the Bot";
        msg_status = 0;
        res.send( {msg:msg,msg_status:msg_status} );
        
      }
      else{
        
        
        // insert the integration data
        
        schema.BotSetup.find({_id:bot_id},function(err, bots) {
          
          if(!err){
            
            
            var ints_data = {
              
              bot_name: bots[0].name,
              bot_id: bot_id,
              access_token: access_token,
              app_name: app_name,
              created_by: sess.email,
              date_created: new Date().getDate(),
              username: sess.username
              
            };
            var IntsInsert = new schema.Integrations(ints_data);
            IntsInsert.save(function(err,data){
    
        
              if(err){
                
                msg = err.message;
                msg_status = -1;
                
              }
              else{
                
                msg = "Integration completed sucessfully. ";
                msg_status = 1;
                
              }
              
              res.send( {msg:msg,msg_status:msg_status} );
            
              
            });
                
            
            
          }
            
        });
        
      }
      
    }
    
  });
  
    
});

app.post("/assign_role",function(req,res){
  
  
  sess = req.session;
  var role = req.body.role;
  var user_id = req.body.user_id;
  var role_val;
  var msg,msg_status;
  
  schema.Users.find({_id:user_id},function(err, urole){
    
    if(!err){
      
      if(urole.length > 0){
        
        
        role_val = urole[0].role;
        schema.Users.update({_id:user_id},{ role: role },{upsert:true},function(err,data){
                            
          var modified;
          if(!err)
          {
            
            modified = data.nModified;
            if(modified > 0){
              
              // keep a role manager audit
              
              
                var role_audit_data = {
                    
                  
                    user_id: user_id,
                    old_role: role_val,
                    new_role: role,
                    created_by: sess.email,
                    date_created: new Date().getDate()
                  
                  
                };
                var RoleAuditInsert = new schema.RoleAudit(role_audit_data);
                RoleAuditInsert.save(function(err,data){
        
            
                  if(err){
                    
                    msg = err.message;
                    msg_status = -1;
                    
                  }
                  else{
                    
                    msg = "Role has been changed successfully. ";
                    msg_status = 1;
                    
                  }
                  
                  res.send( {msg:msg,msg_status:msg_status} );
                  
                });
              
            }
          
            
          }
          
        });
        
      }
      
    }
      
  
    
  });
  
  
});

app.post("/reset_password",function(req, res) {
   
   
   var email = req.body.email;
   email = email.trim();
   var reset_link = "";
   var reset_email = "";
   var user_id;
   var sendResetEmail = function(user_id){
     
      
      reset_link = domain + "/reset/" + user_id;
      reset_email = "You have requested to reset your password ";
      reset_email += "<p> Click <a href='" + reset_link + "'> here </a> to reset your password. </p>";
      
      
      emailSender(email,"Botify Reset Password",reset_email);
      
     
   };
   
   
   schema.Admin.find( {email:email}, function(err, admin) {
     
     
     if(!err){
       
       if(admin.length > 0){
         
         
         // means that the user is an administrator
         // send the reset link
         
          user_id = admin[0]._id;
          sendResetEmail(user_id);
          res.send({ msg_status: 1, msg: "An email has been sent to you to reset your password. " });
          
         
       }
       else{
         
         
         // check for the list of users
       
         schema.Users.find( {email:email}, function(err, user) {
           
           
           if(!err){
             
             
             if(user.length > 0){
              
              user_id = user[0]._id;
              sendResetEmail(user_id);
              res.send({ msg_status: 1, msg: "An email has been sent to you to reset your password. " });
               
             }
             else
             {
               res.send({ msg_status: 0, msg: "It appears this email does not exist on Botify. " });
             }
             
             
           }
             
           
         });
         
         
       }
       
     }
       
   });
    
});

app.post("/rate_chat",function(req,res){


  var rating_value = req.body.rating_value;
  var rating_exp = req.body.rating_exp;


  var rate_data = {
    

    rating_value: rating_value,
    rating_exp:rating_exp
    
  };


  var RateInsert = new schema.Rating(rate_data);
  RateInsert.save(function(err,data){


    
    if(err){
      
      msg = err.message;
      msg_status = -1;
      
    }
    else{
      
      msg = "Feedback has been submitted. Thank you for giving us ways we can serve you better. ";
      msg_status = 1;
      
    }
    
    res.send( {msg:msg,msg_status:msg_status} );
  
    
  });


});

app.post("/widget/gen_widget",function(req,res){


  // res.send(  } )

  console.log( "widgetinggggg...." );


});



var server = app.listen(process.env.PORT || 8000, function() {
  console.log("Chat server listening at 8000");
});


var chatResponse = function(dataA,data){
  
  // data is the one that comes from the NLP
  // dataA is the one 
  
  return new Promise((resolve, reject) => {
    
    
    schema.Categories.find({ bot_name:dataA.bot_name.toLowerCase() },function(err,cats){
      
          
      if(!err){
      

        var cat_name;
        var keyword_name;
        var keyword_id;
        var resp;
        var query_data;
        var found;
        
        
        var Suggestor = function(){
        
          
          
        schema.Keywords.find({ bot_id:dataA.bot_id },function(err,suggest_keywords){
          
                
          if(!err){
            
            
            var exemptKeywords = function(needle){
              
              
              var arr_exempt = ["what","where","is","the","are","on","how","here"];
              var is_exempt = "0";
              
              for(var j=0; j<arr_exempt.length; j++){
                
                
                if( needle.toLowerCase() == arr_exempt[j] ){
                    is_exempt = "1";
                    break;
                }
                else
                  is_exempt = "0";
                
                
              }
              
              return is_exempt;
              
              
            };
            
            
            var inArray = function(needle,haystack){
              
              var found_word = false;
              if(haystack.length > 0){
                
                
                for(var i=0; i<haystack.length; i++){
                  
                  
                  
                  // exempt some resevred words from the dictionary
                  // it's not that it did not find it, but we need to exclude some random
                  // keywords from the string search
                  
                  
                  if( exemptKeywords( needle.trim().toLowerCase() ) == "1" ){
                    found_word = false;
                  }
                  else{
                  
                  
                    if(needle.trim().toLowerCase().replace("?","") == haystack[i].trim().toLowerCase().replace("?","") ){
                      
                      found_word = true;
                      break;
                    
                      
                    }
                    else
                      found_word = false;
                  
                  }
                  
                  
                }
                
                return found_word;
                    
                
              }
              else
                return false;
              
            }
                  
            
            var suggest_words;
            var arr_suggest_words = [];
            var split_word = [];
            var sent_chat = dataA.reason;
            var split_chat = [];
            var counter = 0;
            var needle = [];
            var haystack = [];
            var occurence = 0;
            var percent = 0; 
            var no_suggest = true;
            
            
            if(suggest_keywords.length > 0){
              
              for(var i=0; i<suggest_keywords.length; i++){
                
              
                suggest_words = suggest_keywords[i].name;
                split_word = suggest_words.split(" ");
                split_chat = sent_chat.split(" ");
                
                
                if(split_word.length >= split_chat.length){
                  
                  counter = split_chat.length;
                  haystack= split_word;
                  
                }
                else
                {
                  
                  counter = split_word.length;
                  haystack= split_chat;
                  
                }
                
                needle = split_chat;
                
                for(var j=0; j<counter; j++){
                  
                  // console.log( needle[j] );
                  // console.log( split_word );
                  
                  if(needle[j].length >= 3){
                    
                    
                    var exempt_split = exemptKeywords(needle[j]);
                    if( exempt_split == "0" )
                    {
                      
                      
                      if( inArray( needle[j],split_word ) == true ){
                        occurence = occurence + 1;
                      }
                      
                      
                    }
                  
                  }
                  
                }
                
                var counter_occurence = 0;
                
                if(split_word.length > 0){
                  
                  
                  
                  
                  
                  for(var k=0; k<split_word.length; k++){
                    
                    
                    counter_occurence = counter_occurence + 1;
                    
                    
                  }
                  
                }
                
                
                if(counter_occurence == 0)
                  counter_occurence = 1;
                
                
                // console.log(occurence);
                // console.log(split_word.length);
                
                
                
                
                percent = (occurence / counter_occurence);
                
                //if( percent > 0 )
                  
                
                if( (percent >= 0.4 && counter_occurence <=4) || (percent >= 0.2 && counter_occurence >=5) || (percent > 0 && split_chat.length == 1 ) ){
                  
                  // suggest this keyword
                  
                  //console.log(suggest_words + "-" + percent);
                  
                  console.log(suggest_words + "-" + percent + "-" + occurence + "-" + counter_occurence);
                  
                  
                  arr_suggest_words.push( suggest_words );
                  no_suggest = false;
                  
                  
                }
                else
                {
                  
                  // dont suggest this keyword
                  
                  
                }
                
                
                // console.log(i);
                // console.log(percent);
                // console.log(suggest_keywords[i].name);
                
                percent = 0;
                occurence = 0;
                counter = 0;
                
              }
              
              var json_suggest = {
                
                "suggest": true,
                "arr_suggest_words": arr_suggest_words
                
              };
              
              
              if(no_suggest == true){
                
                
                // query_data = {
                              
                //   query: dataA.reason,
                //   response: 0,
                //   bot_id: dataA.bot_id,
                //   keyword_id: "",
                //   date_sent: new Date().getDate(),
                //   val: "No category for this query/chat",
                //   username: dataA.bot_username
                  
                    
                // };
                // var QueryIns = new schema.Queries(query_data);
                // QueryIns.save(function(err,data){
                            
                            
                //   if(!err){
                //     //return resolve(resp);
                //   }
                //   else{
                //     //return reject(err.message);
                //   }
                  
                  
                // });
                
                //console.log("nothing");
                //return resolve("none");
                
                // check for synonyms here
                
                
                schema.Synonyms.find({ bot_id:dataA.bot_id },function(err, syns){
              
              
                  if(!err){
                    
                    console.log("suggesting synonyms. ");
                    SuggestSynonym(syns);
                    
                  }
                  else
                  {
                    console.log(err.message);
                  }
                  
                    
                    
                });
                
              }
              
              else
              {
                return resolve( json_suggest );
              }
              
            }
            else
            {
            }
              
              
            var SuggestSynonym = function(suggest_keywords){
            
            if(suggest_keywords.length > 0){
            
            
              for(var i=0; i<suggest_keywords.length; i++){
                
              
                suggest_words = suggest_keywords[i].name;
                split_word = suggest_words.split(" ");
                split_chat = sent_chat.split(" ");
                
                
                if(split_word.length >= split_chat.length){
                  
                  counter = split_chat.length;
                  haystack= split_word;
                  
                }
                else
                {
                  
                  counter = split_word.length;
                  haystack= split_chat;
                  
                }
                
                needle = split_chat;
                
                for(var j=0; j<counter; j++){
                  
                  // console.log( needle[j] );
                  // console.log( split_word );
                  
                  if(needle[j].length >= 3){
                    
                    var exempt_split = exemptKeywords( needle[j] );
                    if( exempt_split == "0" )
                    {
                    
                  
                      if( inArray( needle[j],split_word ) == true ){
                        occurence = occurence + 1;
                      }
                      
                      
                    }
                    
                  }
                  
                }
                
                
                var counter_occurence = 0;
                
                if(split_word.length > 0){
                  
                  
                  
                  for(var k=0; k<split_word.length; k++){
                    
                    
                    counter_occurence = counter_occurence + 1;
                    
                    
                    
                  }
                  
                }
                
                
                
                
                if(counter_occurence == 0)
                  counter_occurence = 1;
                
                
                
                
                percent = (occurence / counter_occurence);
                
                if(percent > 0)
                  console.log(suggest_words + "-" + percent + "-" + occurence + "-" + counter_occurence);
                
                
                if(   (percent >= 0.4 && counter_occurence <=4) || (percent >= 0.2 && counter_occurence >=5)  ){
                  
                  // suggest this keyword
                  //console.log(suggest_words);
                  
                  console.log(suggest_words + "-" + percent + "-" + occurence + "-" + counter_occurence);
                  
                  
                  arr_suggest_words.push( suggest_words );
                  no_suggest = false;
                  
                  
                }
                else
                {
                  
                  // dont suggest this keyword
                  
                  
                  
                }
                
                
                // console.log(i);
                // console.log(percent);
                // console.log(suggest_keywords[i].name);
                
                percent = 0;
                occurence = 0;
                counter = 0;
                
              }
              
              var json_suggest = {
                
                "suggest": true,
                "arr_suggest_words": arr_suggest_words
                
              };
              
              if(no_suggest == true){
                
                
                query_data = {
                              
                  query: dataA.reason,
                  response: 0,
                  bot_id: dataA.bot_id,
                  keyword_id: "",
                  date_sent: new Date().getDate(),
                  val: "No category for this query/chat",
                  username: dataA.bot_username,
                  bot_name: dataA.bot_name
                  
                    
                };
                var QueryIns = new schema.Queries(query_data);
                QueryIns.save(function(err,data){
                            
                            
                  if(!err){
                    //return resolve(resp);
                  }
                  else{
                    //return reject(err.message);
                  }
                  
                  
                });
                
                //console.log("nothing");
                return resolve("none");
                
                
              }
              else
              {
                return resolve( json_suggest );
              }
            
            
            
            }
            else{
              console.log("no synonyms");
            }
            
            };
            
            
            // if they are no keywords, it means it wasn't found on the keywords, check the synonyms
            // to see if they exist
            
          }
          else
          {
            console.log("Error in suggestion. " + err.message);
          }
          
                
        });
      
                  
        };
        
        
        if(cats.length > 0){
          
          // console.log("found categories. ");
        
          for(var i=0; i<cats.length; i++){
            
            
            cat_name = formatCategory(cats[i].name);
            
            
            console.log(data.entities);
            console.log(data);
            console.log(data.entities[cat_name]);
            console.log(cat_name);
            
            
            if(data.entities[cat_name] != undefined){
              
              console.log("found");
              
              // get value from the keyword id
              
              found = true;
              keyword_name = data.entities[cat_name][0].value;
              
              
              console.log("Keyword: " + keyword_name);
              console.log("Bot Id: " + dataA.bot_id);
              
              
              schema.Keywords.find( {cat_id:cats[i]._id, name:keyword_name,bot_id:dataA.bot_id}, function(err,keyword){
                
                if(!err){
                  
                  if(keyword.length > 0){
                    
                    keyword_id = keyword[0]._id;
                    
                    console.log(keyword_id);
              
                    schema.Values.find( {keyword_id:keyword_id}, function(err,value){
                      
                      if(!err){
                        
                        if(value.length > 0){
                          
                          console.log(value[0].value);
                          
                          query_data = {
                            
                            query: dataA.reason,
                            response: 1,
                            bot_id: dataA.bot_id,
                            keyword_id: keyword_id,
                            date_sent: new Date().getDate(),
                            val: value[0].value,
                            username: dataA.bot_username,
                            bot_name: dataA.bot_name
                              
                          };
                          
                          resp = value[0].value;
                          
                        }
                        else{
                          
                          
                          query_data = {
                            
                            query: dataA.reason,
                            response: 0,
                            bot_id: dataA.bot_id,
                            keyword_id: keyword_id,
                            date_sent: new Date().getDate(),
                            val: "An answer to this question has not been uploaded yet. Kindly notify the Bot Admin to do so. ",
                            username: dataA.bot_username,
                            bot_name: dataA.bot_name
                              
                          };
                          
                          
                          resp = "An answer to this question has not been uploaded yet. Kindly notify the Bot Admin to do so. ";
                          
                          
                        }
                        
                        var QueryIns = new schema.Queries(query_data);
                        QueryIns.save(function(err,data){
                          
                          
                          if(!err){
                            
                            return resolve(resp);
                            
                          }
                          else{
                            return reject(err.message);
                          }
                          
                          
                        });
                        
                        
                      }
                      else{
                        console.log("kole werk. ");
                      }
                      
                    });
                    
                  }
                  else
                  {
                    
                    //console.log("no keyword. ");


                    var query_data = {
                      
                      query: dataA.reason,
                      response: 0,
                      bot_id: dataA.bot_id,
                      keyword_id: "",
                      date_sent: new Date().getDate(),
                      val: "An answer to this question has not been uploaded yet. Kindly notify the Bot Admin to do so. ",
                      username: dataA.bot_username,
                      bot_name: dataA.bot_name
                        
                    };


                    var QueryIns = new schema.Queries(query_data);
                    QueryIns.save(function(err,data){
                      
                      
                      if(!err){
                        
                        //return resolve(resp);
                        
                      }
                      else{
                        //return reject(err.message);
                      }
                      
                      
                    });

                    
                    Suggestor();
                    
                  }
                  
                }
                
              });
              break;
              
              
            }
            else
            {
              
              
              found = false;
              console.log("looking for the keyword. ");
              
              
            }
            
            
          }
          
        
        } // end cats.length > 0
        else
        {
          
          console.log("no category found. ");
          found = false;
        
          
        }
        
        
        if(found == false){
          
        
          // at this point, push to the database that there was no response on this
          // particular query
          
          // write the suggestive algorithm for Botify
          
          // console.log("egg");


          var query_data = {
            
            query: dataA.reason,
            response: 0,
            bot_id: dataA.bot_id,
            keyword_id: "",
            date_sent: new Date().getDate(),
            val: "An answer to this question has not been uploaded yet. Kindly notify the Bot Admin to do so. ",
            username: dataA.bot_username,
            bot_name: dataA.bot_name
              
          };


          var QueryIns = new schema.Queries(query_data);
          QueryIns.save(function(err,data){
            
            
            if(!err){
              
              //return resolve(resp);
              
            }
            else{
              //return reject(err.message);
            }
            
            
          });
                    

          Suggestor();


        }

        
      }
      else
      {
        
        console.log(err);
        
      }
    
    });
  
  
  
  });
  
};

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  
  
  socket.on("user_sent", function (dataA){
    
    
    const token = dataA.token;
    console.log( "Token: " + token );
    const client = new Wit({accessToken: token});
    
    // console.log(dataA.reason);
    // console.log(typeof dataA.reason);


    client.message(dataA.reason, {})
      .then((data) => {
        
        
        // console.log(data);
        // return;
        
        if( data.entities == undefined )
          var data =  data.data[0].__wit__legacy_response;
        
        
        chatResponse(dataA,data).then(resp => {
          
          
          console.log(resp);

          
          if(resp == "none"){
            
            schema.NoResponse.find({ bot_id:dataA.bot_id  },function(err, resp_data){
              
              if(!err){
                
                
                if(resp_data.length == 0){
                  
                  resp = "I am so sorry I wasn't able to respond to this, but I believe I would be smarter over time :). ";
                  socket.emit('server_response',{response:resp});
                  
                }
                else
                {
                 
                 
                  resp = resp_data[0].response;
                  

                  if(resp.indexOf("’") > -1)
                  {
                    resp = resp.replace("’","'");
                  }


                  if(resp.indexOf("‘") > -1)
                  {
                    resp = resp.replace("‘","'");
                  }


                  if(resp.indexOf('“') > -1)
                  {
                    resp = resp.replace("“",'"');
                  }


                  if(resp.indexOf('”') > -1)
                  {
                    resp = resp.replace("”",'"');
                  }


                  if(resp.indexOf("\r\n") > -1)
                  {
                    resp = resp.replace("\r\n","");
                  }


                  if(resp.indexOf("–") > -1)
                  {
                    resp = resp.replace("–","-");
                  }

                  


                  socket.emit('server_response',{response:resp});
                  
                }

                
              }
                
            });
            
            
          }
          else if (typeof resp == undefined || typeof resp == "undefined")
          {
            


            schema.NoResponse.find({ bot_id:dataA.bot_id  },function(err, resp_data){
              
              if(!err){
                
                
                if(resp_data.length == 0){
                  
                  resp = "I am so sorry I wasn't able to respond to this, but I believe I would be smarter over time :). ";
                  socket.emit('server_response',{response:resp});
                  
                }
                else
                {
                 
                 
                  resp = resp_data[0].response;
                  socket.emit('server_response',{response:resp});
                  
                }
                
              }
                
            });



          }
          else if(resp.suggest == true){
            
            //console.log("not normal");
            socket.emit('server_response',{response:resp.arr_suggest_words, suggest: resp.suggest});

          }
          else
          {


            for(var i=0; i<resp.length; i++){

              

              if(resp.indexOf("’") > -1)
              {
                resp = resp.replace("’","'");
              }


              if(resp.indexOf("‘") > -1)
              {
                resp = resp.replace("‘","'");
              }


              if(resp.indexOf('“') > -1)
              {
                resp = resp.replace("“",'"');
              }


              if(resp.indexOf('”') > -1)
              {
                resp = resp.replace("”",'"');
              }


              if(resp.indexOf("\r\n") > -1)
              {
                resp = resp.replace("\r\n","");
              }


              if(resp.indexOf("–") > -1)
              {
                resp = resp.replace("–","-");
              }

            }
            


            // resp = resp.replace("’","'");
            // resp = resp.replace("‘","'");
            // resp = resp.replace(new RegExp("’",'g'), "'");


            socket.emit('server_response',{response:resp});


          }

          
        })
        .catch(err => {
          
          
          if(err){
            
            console.log(err);
            
          }
          
          
        });

        
      }).catch( err => {
        
        console.log(err); 
        
      });
      
    
  });
  
  
});


