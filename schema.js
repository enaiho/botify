
var mongoose = require("mongoose");



var BotSetupSchema = new mongoose.Schema({


  username: String,
  name: String,
  description: String,
  type: Number,
  date_created: Date,
  created_by: String,
  approved: Number,
  approved_by:String,
  date_approved: Date,
  token: String

  
  
});
var AdminSchema = new mongoose.Schema({
  
  
  username: String,
  email: String,
  pword: String,
  fname: String,
  lname: String,
  date_created: Date,
  created_by: String,
  approved: Number,
  approved_by: String,
  role: Number,
  org_name: String
  
  
});
var ConsoleAdminSchema = new mongoose.Schema({

  email: String,
  pword: String
  

  
});
var CategoriesSchema = new mongoose.Schema({
  
  name: String,
  description: String,
  bot_name: String,
  username: String,
  date_created: Date,
  created_by: String,
  approved: Number,
  approved_by: String,
  comment: String
  
});
var KeywordSchema = new mongoose.Schema({
  
  name: String,
  cat_id: String,
  bot_id: String,
  username: String,
  date_created: Date,
  created_by: String,
  approved: Number,
  approved_by: String,
  comment: String
  
});
var SynonymSchema = new mongoose.Schema({
  
 
  name: String,
  keyword_id: String,
  bot_id: String,
  cat_id: String,
  username: String,
  date_created: {
    
    type: Date,
    default: Date.now
    
  },
  created_by: String,
  approved: Number,
  approved_by: String,
  comment: String
 
  
});
var ExpressionSchema = new mongoose.Schema({
  
  name: String,
  keyword_id: String,
  bot_id: String,
  cat_id: String,
  username: String,
  date_created: Date,
  created_by: String,
  approved: Number,
  approved_by: String,
  comment: String
  
});
var ValueSchema = new mongoose.Schema({
  
  value: String,
  keyword_id: String,
  bot_id: String,
  cat_id: String,
  username: String,
  date_created: {
    
    type: Date,
    default: Date.now
    
  },
  created_by: String,
  approved: Number,
  approved_by: String,
  comment: String
  
});
var InviteSchema = new mongoose.Schema({
  
  
  recipient: String,
  sender: String,
  registered: Number,
  username: String,
  date_sent: {
    
    type: Date,
    default: Date.now
    
  }
  
   
  
});
var UserSchema = new mongoose.Schema({
  
  
  fname: String,
  lname: String,
  pword: String,
  email: String,
  role: Number,
  admin_id: String,
  date_created: {
    
    type: Date,
    default: Date.now
    
  },
  invite_id: String,
  username: String
  
  
});
var QuerySchema = new mongoose.Schema({
  
    query: String,
    response: Number,
    bot_id: String,
    keyword_id: String,
    date_sent: Date,
    val: String,
    username: String,
    bot_name: String

});
var IntegrationSchema = new mongoose.Schema({
  
    bot_name:String,  
    bot_id: String,
    access_token: String,
    app_name: String,
    created_by: String,
    username: String,
    date_created: Date


});
var RoleAuditSchema = new mongoose.Schema({
  
    user_id:String,  
    old_role: String,
    new_role: String,
    created_by: String,
    date_created: Date
    
});
var LogKnowledgeSchema = new mongoose.Schema({
  
    value: String,
    knowledge_type: String,
    bot_name: String,
    created_by: String,
    date_created: Date,
    status: Number,
    status_desc: String,
    create_type: String
    
});
var PasswordResetSchema = new mongoose.Schema({
  
    value: String,
    knowledge_type: String,
    bot_name: String
    
});
var NoResponseSchema = new mongoose.Schema({
  
    
    bot_id: String,
    response: String,
    date_created: {
      
      type: Date,
      default: Date.now
      
    }
    
  
});

var RatingSchema = new mongoose.Schema({
  
    
    rating_value: String,
    rating_exp: String,
    date_created: {
      
      type: Date,
      default: Date.now
      
    }
    
});




try{
  exports.BotSetup = mongoose.model('bots', BotSetupSchema);  
}
catch(ex){ exports.BotSetup = mongoose.model('bots'); }


try{
  exports.Admin = mongoose.model('admin', AdminSchema);
}
catch(ex) { exports.Admin = mongoose.model('admin'); }


try{
  exports.ConsoleAdmin = mongoose.model('console_admin', ConsoleAdminSchema);
}
catch(ex) { exports.ConsoleAdmin = mongoose.model('console_admin'); }


try{
  exports.Categories = mongoose.model('categories', CategoriesSchema);
}
catch(ex) { exports.Categories = mongoose.model('categories'); }


try{
  exports.Keywords = mongoose.model('keywords', KeywordSchema);
}
catch(ex) { exports.Keywords = mongoose.model('keywords'); }

try{
  exports.Synonyms = mongoose.model('synonyms', SynonymSchema);
}
catch(ex) { exports.Synonyms = mongoose.model('synonyms'); }

try{
  exports.Expressions = mongoose.model('expressions', ExpressionSchema);
}
catch(ex) { exports.Expressions = mongoose.model('expressions'); }

try{
  exports.Values = mongoose.model('values', ValueSchema);
}
catch(ex) { exports.Values = mongoose.model('values'); }

try{
  exports.Invites = mongoose.model('invites', InviteSchema);
}
catch(ex) { exports.Values = mongoose.model('invites'); }

try{
  exports.Users = mongoose.model('users', UserSchema);
}
catch(ex) { exports.Users = mongoose.model('users'); }

try{
  exports.Queries = mongoose.model('queries', QuerySchema);
}
catch(ex) { exports.Queries = mongoose.model('queries'); }

try{
  exports.Integrations = mongoose.model('integrations', IntegrationSchema);
}
catch(ex) { exports.Integrations = mongoose.model('integrations'); }

try{
  exports.RoleAudit = mongoose.model('role_audit', RoleAuditSchema);
}
catch(ex) { exports.RoleAudit = mongoose.model('role_audit'); }

try{
  exports.LogKnowledge = mongoose.model('log_knowledge', LogKnowledgeSchema);
}
catch(ex) { exports.LogKnowledge = mongoose.model('log_knowledge'); }

try{
  exports.PasswordReset = mongoose.model('password_reset', PasswordResetSchema);
}
catch(ex) { exports.PasswordReset = mongoose.model('password_reset'); }

try{
  exports.NoResponse = mongoose.model('no_response', NoResponseSchema);
}
catch(ex) { exports.NoResponse = mongoose.model('no_response'); }

try{
  exports.Rating = mongoose.model('ratings', RatingSchema);
}
catch(ex) { exports.Rating = mongoose.model('ratings'); }