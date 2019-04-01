
$(document).ready(function(e){


    var reloadPage = function(){
        
        setTimeout(function(){
            window.location.reload(); 
         },1000);
        
    };
    
    //window.location.reload();
    
                
    try{
        
        
        // For excel bulk uploading of the platform

        var handleFastTrack = function(e) {
            
            
            var f = document.getElementById("files").files;
            var reader = new FileReader();
            var name = f.name;
            
            reader.onload = function (e) {
                
                
                var data = e.target.result;
                var result;
                var workbook = XLSX.read(data, { type: 'binary' });
                var sheet_name_list = workbook.SheetNames;
                
                
                sheet_name_list.forEach(function (y) { 
                    
                    /* iterate through sheets */
                    //Convert the cell value to Json
                    
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                    if(roa != undefined){
                        
                        
                        if (roa.length > 0) {
                            
                            
                            result = roa;
                            
                            
                        }    
                    
                        
                    }
                    
                    
                });
                
                
                //Get the first column first cell value
                //alert(result[0].Column1);
                
                if(result.length > 0){
                    
                    // POST IT TO THE SERVER
                    
                    $.post("/fasttrack",
                    {
                        
                        result: JSON.stringify(result)
                        
                    },
                    function(data, status){
                        
                    });
                    
                }
                
                
            };
            reader.readAsArrayBuffer(f[0]);
            e.preventDefault();
            
                
        }
        
        
        $("#btn_setup").on("click",function(e){
            
            
            // demo.showNotification('top','right',"Bot Name cannot be empty. ",2);
            // e.preventDefault();
            // return;


            var bot_name = $("#bot_name").val();
            var bot_username = $("#username").val();
            var bot_desc = $("#bot_desc").val();
            var org_name = $("#org_name").val();
            var fname = $("#fname").val();
            var lname = $("#lname").val();
            var email = $("#email").val();
            var pword = $("#pword").val();
            

            $("#btn_setup").attr("disabled",true).html("Setting up account.....");
            

            $.post("/bot_setup",
		    {
		        
		        bot_name: bot_name,
		        username: bot_username,
		        bot_desc: bot_desc,
		        org_name: org_name,
		        fname: fname,
		        lname: lname,
		        email: email,
		        pword: pword
		        
		    },
		    function(data, status){


                // console.log(data);
                // return;

		    	if(data.status == 1)
		    	    demo.showNotification('top','right',data.msg,2);
		    	else
		    	    demo.showNotification('top','right',data.msg,4);


                $("#btn_setup").attr("disabled",false).html("Sign Up");


		    });

            e.preventDefault();
		    
             
        });
        $("#btn_login").on("click",function(e){
           
           
           var email = $("#email").val();
           var pword = $("#pword").val();
           
           if(email == "")
                demo.showNotification('top','right',"Email cannot be empty. ",4);
            else if(pword == "")
                demo.showNotification('top','right',"Password cannot be empty. ",4);
           else{
           
            $("#btn_login").attr("disabled",true).html("Signing in.....");
           
            $.post("/console_login",
    	   {
    	        
    	        
    	        email: email,
    	        pword: pword
    	        
    	        
    	    },
    	   function(data, status){
    
    	    	
    	   // 	console.log(data);
    	   // 	return;
    	    	
    	    	if(data.msg_status == 1){
    	    	    
    	    	    
    	    	    if(data.role == 1)
    	    	        window.location.href = "/dashboard";
    	    	    else
    	    	        window.location.href = "/bots";
    	    	    
    	    	}
    	    	else
    	    	{
    	    	    demo.showNotification('top','right',data.msg,4);
    	    	}
    	    	    
    	        $("#btn_login").attr("disabled",false).html("Log In");    
    
    	    });
    	    
           
           
           
               
           }
           
           e.preventDefault();
           
        });
        $("#btn_admin_login").on("click",function(e) {
            
            
            var email = $("#email").val();
            var pword = $("#pword").val();
            
            
            $.post("/admin_login",
    	    {
    	        
    	        
    	        email: email,
    	        pword: pword
    	        
    	        
    	    },
    	   function(data, status){
                
                
                // console.log(data);
                // return;
    	    	
    	    	if(data.status == 1)
    	    	    alert(data.msg);
    	    	else
    	    	    alert(data.msg);
    	    	    
    
    	    });
    	    
    	    e.preventDefault();
            
        });
        
        // $("#btn_verify_bot").on("click",function(e) {
           
        //   var bot_username = $("#username").val();
        //   if(bot_username == ""){
        //       alert("Username cannot be empty. ");
        //   }
        //   else{
               
        //       $.post("/verify_bot",{bot_username:bot_username},function(data, status) {
                   
        //           if(data.status == 1){
        //               localStorage.bot_username = bot_username;
        //               alert("Bot Verified");
        //           }
        //           else{
        //               alert("Bot could not be verified. Please type in the correct bot username. ");
        //           }
                   
                   
        //       });
               
        //   }
        //   e.preventDefault();
            
        // });
        
    //     $("#btn_add_cat").on("click",function(e) {
          
          
    //         var cat_name = $("#cat_name").val();
    //         var cat_desc = $("#cat_desc").val();
            
    // 		if(cat_name == ""){
    // 			alert("Please type in a category name");
    // 		}
    // 		else
    // 		{
    
    // 			$.post("/add_cat",
    // 		    {
    		        
    // 		        name: cat_name,
    // 		        desc: cat_desc
    		        
    		        
    // 		    },
    // 		    function(data, status){
    
    		    	
    		    	
    // 		  //  	if(data.status == 1)
    // 		  //  		alert(data.msg);
    // 		  //  	else
    // 		  //  		alert(data.msg);
    		  
    		  
    // 		        alert(data.msg);
    
    
    
    // 		    });
    
    
    
    
    
    // 		}
          
    //         e.preventDefault();
            
            
    //     });
        $("#btn_create_bot").on("click",function(e){
            
            
            var bot_type = 1;
            var bot_name = $("#bot_name").val();
            var bot_desc = $("#bot_desc").val();
            
            
            if(bot_name == ""){
                demo.showNotification('top','right',"Bot Name cannot be empty. ",4);
            }
            else if(bot_desc == ""){
                demo.showNotification('top','right',"Bot Description cannot be empty.  ",4);
            }
            else{
                
                
                $("#btn_create_bot").attr("disabled",true).html("Setting up BOT.....");
                
                
                $.post("/create_bot",
    		    {
    		        
    		        
    		        bot_type: bot_type,
    		        bot_name: bot_name,
    		        bot_desc: bot_desc,
    		        
    		        
    		    },
    		    function(data, status){
    
    		    	
    		    	
    		    	if(data.msg_status == 1){
    		    	    
    		    	    $("#AddCategory").modal("hide");
    		    	    demo.showNotification('top','right',data.msg,2);
    		    	}
    		    	else
    		    	    demo.showNotification('top','right',data.msg,4);
                    
                    
                    
                    $("#btn_create_bot").attr("disabled",false).html("Create");
                    reloadPage();
    
    		    });
		    
            }
            
            try{ e.preventDefault(); }
            catch(ex){}
            
        });
        $("#destroy_app").on("click",function(e) {
           
           alert("test");
            
        });

        $("#btn_create_cat").on("click",function(e){
           
           
           var cat_name = $("#cat_name").val();
           var cat_desc = $("#cat_desc").val();
           var bot_name = $("#bot_name").val();
           
           if(cat_name == "")
            demo.showNotification('top','right',"Category name cannot be empty. ",4);
            
            else{
                
                
               $("#btn_create_cat").attr("disabled",true).html("Saving Category.....");
               $.post("/add_cat",
    		   {
    		        
    		        
    		        name: cat_name,
    		        desc: cat_desc,
    		        bot_name: bot_name
    		        
    		        
    		    },
    		   function(data, status){
    		    	
    		    	
    		  //  	alert(data.msg_status);
    		  //  	alert(data.msg);
    		    	
    		    	
    		    	if(data.msg_status == 1)
    		    	    demo.showNotification('top','right',data.msg,2);
    		    	else
    		    	    demo.showNotification('top','right',data.msg,4);
    
                     
                     $("#AddCategory").modal("hide");
                     $("#btn_create_cat").attr("disabled",false).html("Save");
                     reloadPage();
		    
		    
    		    });
    		    
    		   
            }
            
            try {e.preventDefault();}
            catch(ex){}
           
            
        });
        $(".cat_delete").on("click",function(e){
            
            $("#del_id").val($(this).attr("id"));
            $("#DeleteModal").modal("show");
            
            try { e.preventDefault(); }
            catch(ex){}
            
            
        });
        
        $("#btn_del_yes").on("click",function(e){
            
            
            var cat_id = $("#del_id").val();
            $("#btn_del_yes").attr("disabled",true).html("Deleting Category.....");
            $.post("/delete_cat",
		    {
		        
		        cat_id: cat_id
		        
		    },
		    function(data, status){
		    
		    	
		    	if(data.msg_status == 1)
		    	    demo.showNotification('top','right',data.msg,2);
		    	else
		    	    demo.showNotification('top','right',data.msg,4);
		    	    
		    	
		    	    
		    	$("#DeleteModal").modal("hide");    
		    	$("#btn_del_yes").attr("disabled",false).html("Yes");
		    	reloadPage();
		    	

		    });
		    
		    
		    try{ e.preventDefault(); }
		    catch(ex){ }
	    
        });
        $("#btn_add_keyword").on("click",function(e){
            
            
            var keyword = $("#keyword").val();
            var bot_id = $("#bot_id").val();
            var cat_id = $("#cat_id").val();
            
            
            if(keyword == "")
                demo.showNotification('top','right',"Keyword value cannot be empty. ",4);
            else{
                
                
                $("#btn_add_keyword").attr("disabled",true).html("Adding keyword.... ");
                $.post("/add_keyword",
		        {
		        
		        
    		        keyword: keyword,
    		        bot_id: bot_id,
    		        cat_id: cat_id,
		        
		        
		        },
		        function(data, status){

		    	    
		    	
    		    	if(data.msg_status == 1)
    		    	    demo.showNotification('top','right',data.msg,2);
    		    	else
    		    	    demo.showNotification('top','right',data.msg,4);
    		    	    
    		    	
    		    	$("#AddKeyword").modal("hide");
    		        $("#btn_add_keyword").attr("disabled",false).html("Save");
    		        reloadPage();
                

		        });
            
            }
            
            try{e.preventDefault();}
            catch(ex){}
            
        });

        $("#keyword").keydown(function(e){


            var keyword_length = $("#keyword").val().length;
            if(e.keyCode == 8){
                keyword_length = $("#keyword").val().length-1;
            }


            $("#lbl_count").html(keyword_length.toString());


        });

        $(".syn").each(function(){
            
            
            var id = $(this).attr("id");
            var syn_val;
            
            
            $("#"+id).keypress(function(e){
                

                if(e.keyCode == 13){
                    
                    
                    syn_val = $("#"+id).val();
                    if(syn_val == ""){
                        demo.showNotification('top','right',"Synonym value cannot be empty. ",4);
                    }
                    else{
                        
                        
                        
                        $("#"+id).attr("disabled",true);
                        $("#process_"+id).html("<strong>Processing.......</strong>");

                        
                        //demo.showNotification('top','right',"Processing..... ",2);
                        
                        // push this synonym to the bot engine/nlp
                        
                        
                        $.post("/add_synonym",
            		    {
            		        synonym: syn_val,
            		        keyword_id: id,
            		        cat_id: $("#cat_id").val(),
            		        bot_id: $("#bot_id").val()
            		        
            		    },
            		    function(data, status){
            
            		    	
            		    	var index;
            		    	if(data.msg_status == 1){
            		    	    
            		    	    
            		    	    $("#"+id).focus();
            		    	    
            		    	    index = $(".span_syn_" + id).children().length;
            		    	    $("#"+id).val("");
            		    	    $("#syn_"+id+"_"+index).
            		    	    append("<br />  "+"<strong>"+syn_val+"</strong> <a href='javascript:;'>Edit</a><label> | </label><a href='javascript:;'>Delete</a>");
            		    	    
            		    	    demo.showNotification('top','right',data.msg,2);
                                reloadPage();
            		    	    
            		    	    
            		    	    
            		    	}
            		    	else
            		    	    demo.showNotification('top','right',data.msg,4);
            
            
            		        $("#"+id).attr("disabled",false);
            		        $("#process_"+id).html("");

        
            		        
            		    });
                        
                    }
                    
                }
                
            });
            
        });
        $(".exp").each(function(){
            
            
            var id = $(this).attr("id");
            var exp_val;
            var exp_id;
            

            
            $("#"+id).keypress(function(e){
                
                
                
                exp_val = $("#"+id).val();
                exp_id = id.split("_")[1];
                
                
                if(e.keyCode == 13)
                {
                    
                    if(exp_val != ""){
                        
                        
                        $.post("/add_expression",
            		    {
            		        
            		        expression: exp_val,
            		        keyword_id: exp_id,
            		        cat_id: $("#cat_id").val(),
            		        bot_id: $("#bot_id").val()
            		        
            		    },
            		    function(data, status){
            		        
            		        
            		        
            		        if(data.msg_status == 1){
            		            demo.showNotification('top','right',data.msg,2);
            		        }
            		        else{
            		            demo.showNotification('top','right',data.msg,4);
            		        }
            		        
            		    
            		        
            		    });
    
                        
                    }
                        
                }
                
                
            });
            
            
        });
        $(".cls_delete").on("click",function(e){
           
           
           var id = $(this).attr("id");
           $("#syn_del_id").val(id);
           $("#DeleteSynonym").modal("show");
           
            
        });
        $("#btn_del_syn").on("click",function(e){
            
            
            var id = $("#syn_del_id").val();
            if(id != undefined){
                
                $("#btn_del_syn").attr("disabled",true).html("Deleting.....");
                $.post("/delete_synonym",
                {
                
                    syn_id: id,
                },
                function(data, status){
        
            	   
        	    	if(data.msg_status == 1)
        	    	    demo.showNotification('top','right',data.msg,2);
        	    	else
        	    	    demo.showNotification('top','right',data.msg,4);
                    
                    
                    $("#DeleteSynonym").modal("hide");
                    $("#btn_del_syn").attr("disabled",false).html("Yes");
                    
                    reloadPage();
                    
        
                });
                
                   
            }
            
        });
        $("#pop_add_keyword").on("click",function(e){
            $("#AddKeyword").modal("show");
        });
        $(".cls_edit").on("click",function(e){
           
            var id = $(this).attr("id");
            alert(id);
            
        });
        $(".cls_del_keyword").on("click",function(e){
           
           
            var id = $(this).attr("id");
            $("#del_keyword_id").val(id);
            $("#DeleteKeyword").modal("show");
            
            
        });
        $("#btn_del_keyword").on("click",function(e){
            
            var id = $("#del_keyword_id").val();
            $("#btn_del_keyword").attr("disabled",true).html("Deleting keyword.....");
            $.post("/delete_keyword",
            {
            
                keyword_id: id,
                
            },
            function(data, status){
    
        	   
    	    	
    	    	if(data.msg_status == 1)
    	    	    demo.showNotification('top','right',data.msg,2);
    	    	else
    	    	    demo.showNotification('top','right',data.msg,4);
                
                
                $("#DeleteKeyword").modal("hide");
                $("#btn_del_keyword").attr("disabled",false).html("Yes");
                
                reloadPage();



            });
            
            
        });
        $(".cls_add_value").on("click",function(e){
            
            
            var id = $(this).attr("id");
            $("#val_keyword_id").val(id);
            $("#AddValue").modal("show");
            
            
        });
        $("#btn_add_value").on("click",function(e){
            
            
            var keyword_id = $("#val_keyword_id").val();
            keyword_id = keyword_id.split("_")[1];
            
            var value = $("#value").val();
            if(value == "")
                demo.showNotification('top','right',"Value cannot be empty. ",4);
            else{
                
                
                
                $("#btn_add_value").attr("disabled",true).html("Adding value.... ");
                $.post("/add_value",
    		    {
    		        
    		        value: value,
    		        keyword_id: keyword_id,
    		        cat_id: $("#cat_id").val(),
    		        bot_id: $("#bot_id").val()
    		        
    		    },
    		    function(data, status){
    		        
    		            
    		            
    		        if(data.msg_status == 1)
    		            demo.showNotification('top','right',data.msg,2);
    		        else
    		            demo.showNotification('top','right',data.msg,4);
    		        
    		        
    		        $("#btn_add_value").attr("disabled",false).html("Save");
    		        reloadPage();
    		    
    		    
    		    });
                
            }
            
        });
        $("#btn_invite").on("click",function(e){


            var email = $("#invite_email").val();
            if(email == "")
                demo.showNotification('top','right',"Email address cannot be empty. ",4);
            else{
                
                
                $("#btn_invite").attr("disabled",true).html("Sending Email Invite....");
                $.post("/send_invite",
    		    {
    		        email: email
    		    },
    		    function(data, status){
    		        
    		            
    		        if(data.msg_status == 1){
    		            demo.showNotification('top','right',data.msg,2);
    		        }
    		        else{
    		            demo.showNotification('top','right',data.msg,4);
    		        }
    		        
    		        
    		        $("#btn_invite").attr("disabled",false).html("Invite");    
    		    
    		    
    		    });
                
            }
            
            
            
            try{ e.preventDefault(); }
            catch(ex){ }
            
            
        });
        $("#btn_register").on("click",function(e){
            
            
            
            var fname = $("#fname").val();
            var lname = $("#lname").val();
            var pword = $("#pword").val();
            var invite_id = $("#invite_id").val();
            var recipient = $("#recipient").val();
            var sender = $("#sender").val();
            
            
            $.post("/register_user",
            
            {
                
                fname: fname,
                lname: lname,
                pword: pword,
                email: recipient,
                invite_id: invite_id,
                sender: sender
                
            },
            
            function(data, status) {
                
                alert(data.msg);
                //alert("Registered successfully. ");
                
            });
            
            
        });
        $("#btn_fast_track").on("click",function(e){
            
            
            // var form_data = new FormData($('#form_upload')[0]);
            // console.log(form_data);
            // e.preventDefault();
            // return;
            
            // $.ajax({
                
                  
            //   type:'POST',
            //   url:'/fasttrack',
            //   processData: false,
            //   contentType: false,
            //   async: false,
            //   cache: false,
            //   data : form_data,
            //   success: function(response){
                
                
            //     console.log(response);
                
            //   }
              
              
            // });
            
            handleFastTrack(e);
            e.preventDefault();
            
            
            try{ e.preventDefault(); }
            catch(ex){}

            
        });
        $("#destroy_bot").on("click",function(e){
            $("#DeleteBot").modal("show");
        });
        $("#btn_del_bot").on("click",function(e){
            
            
            var bot_id = $("#bot_id").val();
            $("#btn_del_bot").attr("disabled",true).html("Deleting Bot.....");
            
            
            $.post("/delete_bot",
            {
                bot_id:bot_id
            },
            function(data, status){
                
                
                
                if(data.msg_status == 1)
    	    	    demo.showNotification('top','right',data.msg,2);
    	    	else
    	    	    demo.showNotification('top','right',data.msg,4);
                
                
                $("#DeleteBot").modal("hide");
                $("#btn_del_bot").attr("disabled",false).html("Yes");
                
                
                
            });
            
            
        });
        $(".cls_edit_synonym").on("click",function(e){
            
            var id = $(this).attr("id");
            id = id.split("_")[1];
            $.post("/get_synonym",{syn_id:id},function(data, status) {
                
                
                if(data.syn_status == 1){
                    
                    
                    // pop the modal window
                    
                    $("#edit_synonym").focusin();
                    $("#synonym_id").val(id);
                    $("#edit_synonym").val(data.synonym);
                    $("#EditSynonym").modal("show");
                    
                    
                }
                else
                {
                    
                }
                
                
            });
            
        });
        $("#btn_save_synonym").on("click",function(e) {
            
            
            var synonym = $("#edit_synonym").val();
            var synonym_id = $("#synonym_id").val();
            
            if(synonym == ""){
                demo.showNotification("top","right","Synonym value cannot be empty. ",4);
            }
            else{
                
                
                $("#btn_save_synonym").attr("disabled",true).html("Updating Synonym.....");
                $.post("/edit_synonym",
                {
                    
                    synonym:synonym,
                    synonym_id: synonym_id
                    
                },
                function(data, status){
                
                    
                    if(data.msg_status == 1)
                        demo.showNotification('top','right',data.msg,2);
                    else
                        demo.showNotification('top','right',data.msg,4);
                    
                    
                    $("#EditSynonym").modal("hide");
                    $("#btn_save_synonym").attr("disabled",false).html("Save");
                    reloadPage(); 
                    
                    
                });
                
            }
            
            
            try{ e.preventDefault(); }
            catch(ex){ }
            
        });
        $(".cls_edit_value").on("click",function(e){
            
            
            var id = $(this).attr("id");
            id = id.split("_")[1];
            $("#edit_value_id").val(id);
            
            
            $.post("/get_value",
            {
                
                value_id: $("#edit_value_id").val()
                
            },
            function(data, status) {
                
                
                if(data.msg_status == 1){
                    
                    
                    
                    $("#edit_value").val(data.msg);
                    $("#EditValue").modal("show");
                    
                    
                }
                else{
                    alert("an error occured in deleting this value. ");
                }
                    
        
                    
            });
            
        });
        $("#btn_save_value").on("click",function(e){
            
            
            var value = $("#edit_value").val();
            var value_id = $("#edit_value_id").val();
            
            
            if(value == "")
                demo.showNotification('top','right','Value/Response cannot be empty',2);
            else
            {
                
                $("#btn_save_value").attr("disabled",true).html("Updating Value.....");
                $.post("/update_value",
                {
                    
                    value_id: value_id,
                    value: value
                    
                },
                function(data, status) {
                    
                    
                    
                    
                    if(data.msg_status == 1)
                        demo.showNotification('top','right',data.msg,2);
                    else
                        demo.showNotification('top','right',data.msg,4);
                    
                    
                    $("#EditValue").modal("hide");
                    $("#btn_save_synonym").attr("disabled",false).html("Save");
                    
                    
                    
                });
                
                
            }
            
            try{ e.preventDefault(); }
            catch(ex){}
            
        });
        $(".cls_edit_expression").on("click",function(e){
            
            
            var id = $(this).attr("id");
            id = id.split("_")[1];
            if(id != undefined || id != ""){
                
                $("#edit_expression_id").val(id);
                $.post("/get_expression",
                {
                    
                    expression_id:id
                    
                },
                function(data, status){
                    
                    
                    if(data.msg_status == 1){
                        
                        $("#edit_expression").val(data.msg);
                        $("#EditExpression").modal("show");
                        
                    }
                    else
                    {
                        alert("An error occured in getting the expression. ");
                    }
                    
                    
                });
                
            }
            
        
            
            
        });
        $("#btn_save_expression").on("click",function(e){
            
            
            
            var expression = $("#edit_expression").val();
            var expression_id = $("#edit_expression_id").val();
            
            if(expression == "")
                demo.showNotification('top','right','Expression cannot be empty. ',4);
            else{
                
                
                $("#btn_save_expression").attr("disabled",true).html("Updating expression...");
                $.post("/update_expression",
                {
                    
                    expression_id:expression_id,
                    expression:expression
                    
                },
                function(data, status){
                    
                    
                    console.log(data);
                    
                    
                    if(data.msg_status == 1)
                        demo.showNotification('top','right',data.msg,2);
                    else
                        demo.showNotification('top','right',data.msg,4);
                    
                    
                    
                    $("#EditExpression").modal("hide");
                    $("#btn_save_expression").attr("disabled",false).html("Save");

                    
                        
                });
                
            }
                
            
            try { e.preventDefault(); }
            catch(ex){ }
            
        });
        $(".cls_delete_exp").on("click",function(e){
           
           
           var id  = $(this).attr("id");
           id = id.split("_")[1];
           if(id != "" || id != undefined){
            
            
            $("#del_expression_id").val(id);
            $("#DeleteExpression").modal("show");
           
               
           }
           
            
        });
        $("#btn_del_exp").on("click",function(e){
            
            
            var exp_id = $("#del_expression_id").val();
            $("#btn_del_exp").attr("disabled",true).html("Deleting Expression....");
            
            
            $.post("/delete_expression",
            {
                
                expression_id:exp_id
                
            },
            function(data,status){
                
                
                if(data.msg_status == 1)
                    demo.showNotification('top','right',data.msg,2);
                else
                    demo.showNotification('top','right',data.msg,4);
                
                
                
                $("#DeleteExpression").modal("hide");
                $("#btn_del_exp").attr("disabled",false).html("Save");
                
                
                
            });
            
            
            try { e.preventDefault(); }
            catch(ex){}
           
            
        });
        $("#test_webhook").on("click",function(e){
            
            
            $.post("/messenger/webhook",
            {},
            function(data, status) {
               
                alert("egg");  
                
            });
            
            
            try{ e.preventDefault(); }
            catch(ex){ }
            
        });
        $("#read_instruction").on("click",function(e){
            
            $("#ReadInstructions").modal("show");
            try{ e.preventDefault(); }
            catch(ex){}
            
        });
        $("#btn_start_integration").on("click",function(e) {
           
           $("#GetStarted").modal("show");
           try{ e.preventDefault(); }
           catch(ex){}
            
        });
        $("#btn_validate_token").on("click",function(e){
            
            
            var token = $("#token").val();
            if(token == ""){
                demo.showNotification('top','right','Access token cannot be empty. ',4);    
            }
            else{
                
                $("#btn_validate_token").attr("disabled",true).html("Validating token......").css("font-weight","bolder");
                $.post("/validate_app_token",
                {
                    
                    app_token: token
                    
                },
                function(data, status) {
                    
                    
                    var response = data.response;
                    var html_append = "";
                    
                    
                    if(response.status == 1){
                        
                        
                        $("#lbl_app").html(response.name);
                        $("#txt_token").text(token);
                        
                                
                        $("#form_val_token").css("display","none");
                        $("#finish_integration").css("display","block");
                        $("#val_token_title").html(response.msg);
                        
                        
                        
                    }
                    else
                        demo.showNotification('top','right',response.msg,4);
                    
                    
                    $("#btn_validate_token").attr("disabled",false).html("Validate");
                    
                    
                });
                
                
                
            
            }
            
            try { e.preventDefault(); }
            catch(ex){}
            
            
        });
        
        $("#btn_finish_integration").on("click",function(){
           
           
            var app_name = $("#lbl_app").text();
            var access_token = $("#txt_token").val();
            var bot_id = $("#bot_id").val();
            
            $("#btn_finish_integration").attr("disabled",true).html("Completing Integration....");
            $.post("/finish_integration",
            {
                
                app_name: app_name,
                access_token: access_token,
                bot_id: bot_id
                
            },
            function(data,status){
                
                
                if(data.msg_status == 1){
                    
                    demo.showNotification('top','right',data.msg,2);
                    setTimeout(function(){
                        window.location.href = window.location.toString();    
                    },2000);
                    
                }
                else{
                    
                    demo.showNotification('top','right',data.msg,4);
                    setTimeout(function(){
                        window.location.href = window.location.toString();    
                    },2000);
                }    
                
                
                $("#btn_finish_integration").attr("disabled",false).html("Finish Integration");
                
                
            });
           
           
        });
        $(".btn_save_role").on("click",function(e) {
           
           var id = $(this).attr("id");
           var role = $("#sel_"+id).val();
           
           if(role == "")
                demo.showNotification('top','right',"Role cannot be empty. Select a role before assigning  ",4);
           else{
               
               var ExecRole = function(id,role){
                   
                   
                    $("#"+id).attr("disabled",true).html("Assigning....");
                    $.post("/assign_role",{role:role, user_id:id},function(data){
                    
                    
                    if(data.msg_status > 0)
                        demo.showNotification('top','right',"Role has been assigned successfully. ",2); 
                    else{
                        demo.showNotification('top','right',"This role has already been assigned to this user. ",4);
                    }
                    
                    $("#"+id).attr("disabled",false).html("Assign");
                    
                });
                   
                   
               }
               
                if(role == 2){
                    
                    // throw a trigger
                    $("#RoleTrigger").modal("show");
                    $("#btn_role_cont").on("click",function(e) {
                       
                       
                        $("#RoleTrigger").modal("hide");
                        ExecRole(id,role);
                       
                        try { e.preventDefault(); }
                        catch(ex){}
                       
                        
                    });
                    
                }
                else
                    ExecRole(id,role);
                
                   
               
           }
           
           
           try{ e.preventDefault(); }
           catch(ex){}
            
        });
        $("#modal_add_cat").on("click",function(e){
           $("#AddCategory").modal("show");
        });
        $("#modal_fast_track").on("click",function(e) {
           $("#FastTrack").modal("show");
        });
        
        $("#btn_reset").on("click",function(e) {
           
           var email = $("#email").val();
           if(email == "")
           {
               demo.showNotification('top','right','Email Address cannot be empty. ',4);
           }
           else
           {
               
               $("#btn_reset").attr("disabled",true).html("Resetting Password.....");
               
               $.post("/reset_password",{email:email},function(data, status){
                   
                    if(data.msg_status == 0)
                        demo.showNotification('top','right',data.msg,4);
                    else if(data.msg_status == 1)
                        demo.showNotification('top','right',data.msg,2);
                        
                    $("#btn_reset").attr("disabled",false).html("Reset Password");
                   
               });
               
           }
           
           
           try{ e.preventDefault(); }
           catch(ex){}
           
        });
        $("#btn_change_password").on("click",function(e) {
           
           
           var old_pword = $("#old_pword").val();
           var c_pword = $("#c_pword").val();
           var user_id = $("#user_id").val();
           
           
            if(old_pword == "")
                demo.showNotification('top','right',"Password field cannot be empty. ",4);
            else if(c_pword == "")
                demo.showNotification('top','right',"Confirm password field cannot be empty. ",4);
            else if(old_pword != c_pword)
                demo.showNotification('top','right',"Password and Confirm Password cannot be empty. ",4);
            else
            {
                
                $("#btn_change_password").attr("disabled",true).html("Saving password.....");
                
                $.post("/change_password",{ pword:old_pword, user_id:user_id},function(data,status){
                   
                   
                   if(data.msg_status == 1){
                    demo.showNotification('top','right',"Password has been reset successfuly. Now you can login to your account. ",2);   
                   }
                   else
                   {
                    demo.showNotification('top','right',data.msg,4);   
                   }
                   
                   
                   $("#btn_change_password").attr("disabled",false).html("Save");
                   
                   
                });
                
            }
            
           
           try{
               e.preventDefault();
           }
           catch(ex){}
            
        });
        $(".cls_learn_add").on("click",function(e) {
          
          
          var id = $(this).attr("id");
          var bot_id = id.split("_")[1];
          var query = id.split("_")[2];
          var query_id = id.split("_")[3];
          
          
          $("#lbl_ques").html("<strong>" + query + "</strong>");
          
          $("#bot_id").val(bot_id);
          
        //   alert(query);
        //   return;
        //   get all the categories from the bot id
        
        $.post("/get_cats_by_bot_id",
        {bot_id:bot_id},
        function(data){
            
            
            var cats = data.cats;
            var html_cat = "";
            
            //console.log(cats);
            
            if(cats.length > 0){
                
                
                html_cat += "<option value=''>Choose a Category</option>";
                for(var i=0; i<cats.length; i++){
                    html_cat += "<option value='" + cats[i]._id + "'>" + cats[i].name + "</option>";
                }
                
                
                $("#append_cats").html(html_cat);
                $("#AddQuestion").modal("show");
                $("#question").val(query);
                $("#query_id").val(query_id);
                
            }
            else{
                
                html_cat = "";
                alert("no categories to add for this bot. ");
                
            }
            
            
          
            
        });
          
          
          //$("#AddValue").modal("show");
          e.preventDefault();
          
            
        });
        $("#btn_learn").on("click",function(e){
            
            
            var cat = $("#append_cats").val();
            var resp = $("#value").val();
            var question = $("#question").val();
            var bot_id = $("#bot_id").val();
            var query_id = $("#query_id").val();
            
            if(cat == "")
                demo.showNotification('top','right',"Please select a category",4);
            else if(resp == "")
                demo.showNotification('top','right',"Please type in a response to the answer. ",4);
            else{
                
                
                $("#btn_learn").attr("disabled",true).html("Adding Question.....");
                $.post("/add_learning",
                {
                    
                    cat:cat,
                    resp:resp,
                    question:question,
                    bot_id:bot_id,
                    query_id:query_id
                    
                },
                function(data){
                    
                    
                    $("#btn_learn").attr("disabled",false);
                    if(data.status == 1)
                        demo.showNotification('top','right',data.msg,4);
                    else
                        demo.showNotification('top','right',data.msg,2);
                    
                    
                    $("#btn_learn").attr("disabled",false).html("Save");    
                    
                });
            
            
            }
            
            e.preventDefault();
            
        });
        $("#btn_no_response").on("click",function(e) {
           $("#NoResponse").modal("show");
           
        });
        $("#btn_set_resp").on("click",function(e) {
           
           
           
           let bot_id = $("#bot_id").val();
           let response = $("#resp_val").val();
           
           
           
           if(response == "")
                demo.showNotification('top','right',"Response field cannot be empty. ",4);
            else
            {
            
                $("#btn_set_resp").attr("disabled",true).html("Setting 'No Response' Answer...... ");
                $.post("/bot/set_no_response",
            
                {
                    
                    
                    bot_id:bot_id,
                    response:response
                    
                },
                
                function(data){
                    
                    if(data.status == 1){
                        
                        $("#resp_val").val(data.msg);
                        demo.showNotification('top','right',data.msg,2);
                        
                    }
                    else
                        demo.showNotification('top','right',data.msg,4);
                        
                        $("#btn_set_resp").attr("disabled",false).html("Set Response");
                    
                });
                
            }
           
           try { e.preventDefault(); }
           catch(ex){}
            
        });
        
        
        e.preventDefault();
        
    }
    catch(ex){
    }
    
    
})