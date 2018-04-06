
var postsArray;
var commentsArray;
var usersArray;
var postsHtml='';
var commentsHtml="";
var postsComments=[];
var editForm='';
var len=20;
if(localStorage.length!=0)
{
    jQuery("#getData").css({'display':'none'});
}
//Button load data!!
//******************
jQuery("#getData").on("click",function(){
    jQuery('#getData').css({'display':'none'});
    if(localStorage.length==0)
    {
    $.when(
        jQuery.ajax({
            type:"GET",
            url:"https://jsonplaceholder.typicode.com/posts",
            success:function(post)
            {
                localStorage.posts=JSON.stringify(post);
            }
        }),
        jQuery.ajax({
            type:"GET",
            url:"https://jsonplaceholder.typicode.com/comments",
            success:function(comment)
            {
                localStorage.comments=JSON.stringify(comment);
            }
        }),
        jQuery.ajax({
            type:"GET",
            url:"https://jsonplaceholder.typicode.com/users",
            success:function(user)
            {
                localStorage.users=JSON.stringify(user);
            }
        })
    ).then(
        function(){
loadData();
        }
    )
}
})


//*********************
//Debounce
//*********************
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
// ************************
// scroll
// ************************
var scroll_slow=debounce(function(){
    console.log("hello");
    var cntr=document.getElementById("container");
    var contentHeight=cntr.offsetHeight;
    console.log(contentHeight);
    var yOffSet=window.pageYOffset;
    var y=yOffSet+window.innerHeight;
    if(y>contentHeight)
    {
        if(len<postsArray.length)
       {
        len+=20;
       } 
       else{
           len=postsArray.length;
           window.removeEventListener("scroll",scroll_slow);
       }
        
        loadData();
    }
    
},50);
window.addEventListener("scroll",scroll_slow);

loadData();


//Display all posts:
//************loadData function **************//
function loadData()
{
    postsHtml="";
    if (localStorage.length != 0) 
    {
     postsArray=JSON.parse(localStorage.posts);
commentsArray=JSON.parse(localStorage.comments);
usersArray=JSON.parse(localStorage.users);
    for(var i=0;i<len;i++)
    {
        for(var j=0;j<usersArray.length;j++)
        {
            if(usersArray[j].id==postsArray[i].userId)
            {
               postsHtml+=`<div class="posts" id="post_${postsArray[i].id}">
                <h4>Name:${usersArray[j].name},${i}</h4>
                <em id="title_${postsArray[i].id}"><strong>Title: </strong>${postsArray[i].title}</em>
                <p id="body_${postsArray[i].id}"><strong>Post Description: </strong>${postsArray[i].body}</p>
                <div id="buttons_${postsArray[i].id}">
                <button id="viewComm_${postsArray[i].id}">View Comments</button>
                <button id="editPost_${postsArray[i].id}">Edit Post</button>
                <button id="deletePost_${postsArray[i].id}">Delete Post</button>
                </div>
               </div> ` 
            }   
        }
    }
    document.getElementById("postsContainer").innerHTML=postsHtml;
    // jQuery("#newForm").after(postsHtml);
}
}
//*************************************************
//View Comments
//*************************************************
jQuery("#container").on("click","button[id^='viewComm_']",function()
{
    commentsHtml="";
    commentsHtml+='<div id="cHead"><h3>Comments</h3><hr></div>';
    var vcId=jQuery(this).attr('id');
    console.log(vcId);
    var post_Id=vcId.replace('viewComm','post');
    console.log(post_Id);
    var btn_Id=vcId.replace('viewComm','buttons');
    console.log(btn_Id);
    var viewComm_Id=Number(vcId.substring(9));
    console.log(viewComm_Id);
    if(jQuery("#"+post_Id).has(jQuery(".comments")))
    {
        
        jQuery(".comments").remove(); 
        jQuery("#cHead").remove(); 
        // jQuery("button[id^='addComm_']").remove();
        jQuery("#newComm").remove();
        
    }
     postsComments=[];
    for(var i=0;i<commentsArray.length;i++)
    {
        
            if(commentsArray[i].postId==viewComm_Id)
            {
                postsComments.push({id:commentsArray[i].id,body:commentsArray[i].body})
                // postsComments.push(commentsArray[i].body)
                
            }
        
    }
    for(var i=0;i<postsComments.length;i++)
    {
        
commentsHtml+=`<div class="comments" id="comm_${postsComments[i].id}">
                    <p>${postsComments[i].body}</p>
              
              <button id="delComm_${postsComments[i].id}">Delete Comment!!</button>
              <hr>
              </div>`
    }
    commentsHtml+=`<div id="newComm">
    <input id="uname" type="text" placeholder="Enter your name" required><br><br>
    <input id="email" type="email" placeholder="Enter your email-id" required><br/><br>
    <textarea id="textComm" type="text" placeholder="Enter your comment" required></textarea><br><br>
    <button id="addComm_${viewComm_Id}">Add New Comment!!</button></div>`;
    jQuery("#"+btn_Id).after(commentsHtml);


});

//********************************
//Create new comment
//********************************

jQuery("#container").on("click","button[id^='addComm_']",function(){
    var aComm=Number(jQuery(this).attr('id').substring(8));
    console.log(aComm);  
    var addComment='';
    var addCommentObj={
    postId:aComm,
    id:commentsArray.length+1,
    name:document.getElementById("uname").value,
    email:document.getElementById("email").value,
    body:document.getElementById("textComm").value
}
    console.log(postsComments.length);
    
addComment+=`<div class="comments" id="comm_${commentsArray.length+1}">
                <p>${document.getElementById("textComm").value}</p>
                <button id="delComm_${commentsArray.length+1}">Delete Comment!!</button>
                <hr>
            </div>`;
jQuery("#newComm").before(addComment)

console.log(addCommentObj)
commentsArray.push(addCommentObj);
console.log(commentsArray)
postsComments.push({id:addCommentObj.id,body:addCommentObj.body})
console.log(postsComments)
     document.getElementById("uname").value="";
     document.getElementById("email").value="";
     document.getElementById("textComm").value="";
// console.log(commentsArray);
localStorage.comments=JSON.stringify(commentsArray);       
    });


//****************************
//Delete Comment:
//****************************
jQuery("#container").on("click","button[id^='delComm_']",function(){
    var delCommBtn_Id=jQuery(this).attr('id');
    console.log(delCommBtn_Id);
    // console.log("*******")
    var delCommArr_id=Number(delCommBtn_Id.substring(8));
    console.log(delCommArr_id);
    var delComm_Id=jQuery(this).closest("div").attr('id');
    console.log(delComm_Id);
    var delComm_rep=delComm_Id.replace("comm_","delComm_");
    console.log(delComm_rep);
    if(delCommBtn_Id==delComm_rep)
    {
        console.log(postsComments);
  
console.log(commentsArray)
console.log(commentsArray[delCommArr_id])
for(var i=0;i<commentsArray.length;i++)
{
    if(delCommArr_id==commentsArray[i].id)
    {
        console.log("hello");
        commentsArray.splice(i,1);
    }
}
for(var i=0;i<postsComments.length;i++)
{
    if(delCommArr_id==postsComments[i].id)
    {
        postsComments.splice(i,1);
        console.log(postsComments);
    }
}

jQuery("#"+delComm_Id).remove();
        
localStorage.comments=JSON.stringify(commentsArray);   
    }
    
})
//***************************** 
//Create Post:
//*****************************
jQuery("#upload").on("click",function(){
    var newPostObj={
        userId:document.getElementById("userId").value,
        id:postsArray.length+1,
        title:document.getElementById("title").value,
        body:document.getElementById("post").value
    };
    var newUsersObj={
        id:document.getElementById("userId").value,
        name:document.getElementById("name").value
    };
    postsArray.push(newPostObj);
    console.log(postsArray);
    localStorage.posts=JSON.stringify(postsArray);
    usersArray.push(newUsersObj);
    console.log(usersArray);
    localStorage.users=JSON.stringify(usersArray);
    var newPostHtml="";
    newPostHtml+=`<div class="posts" id="post_${postsArray.length}">
                <h4>Name:${document.getElementById("name").value}</h4>
                <em><strong>Title: </strong>${document.getElementById("title").value}</em>
                <p><strong>Post Description: </strong>${document.getElementById("post").value}</p>
                <div id="buttons_${postsArray.length}">
                <button id="viewComm_${postsArray.length}">View Comments</button>
                <button id="editPost_${postsArray.length}">Edit Post</button>
                <button id="deletePost_${postsArray.length}">Delete Post</button>
                </div>
               </div>`;
               document.getElementById("userId").value="";
               document.getElementById("name").value="";
               document.getElementById("title").value="";
               document.getElementById("post").value="";

jQuery("#container").append(newPostHtml);
});

//*************************
//Delete Post
//*************************
jQuery("#container").on("click","button[id^='deletePost_']",function(){
    var delPost=Number(jQuery(this).attr("id").substring(11));
    console.log(delPost);
    for(var i=0;i<postsArray.length;i++)
    {
        if(delPost==postsArray[i].id)
        {
            postsArray.splice(i, 1);
            console.log(localStorage.posts = JSON.stringify(postsArray))
            localStorage.posts = JSON.stringify(postsArray)
            console.log(postsArray);
            jQuery("#post_"+delPost).remove();
        }
    }
})
//**********************************
//Edit Post
//**********************************
jQuery("#container").on("click","button[id^='editPost_']",function(){
    var editBtn=jQuery(this).attr('id');
    console.log(editBtn);
    var editBtn_Num=Number(editBtn.substring(9));
    console.log(editBtn_Num)
    console.log(jQuery("#"+editBtn).parent().parent().attr('id'));
    var editPost_Id=jQuery("#"+editBtn).parent().parent().attr('id');
    editForm='';
    console.log(editPost_Id.replace("post_","editPost_"))
    if(jQuery("#post_"+editBtn.substring(9)).has(jQuery("#editForm")))
    {
        jQuery("#editForm").remove();
    }
    if(editBtn==editPost_Id.replace("post_","editPost_"))
    {
        editForm+=`<div id="editForm">
        <h3>Edit Post</h3>
        <div><input  style="width:300px;height:50px" id="edit_postTitle" type="text" placeholder="Enter post title"></div><br>
        <textarea style="width:300px;height:100px" id="edit_body" placeholder="Enter post"></textarea> <br>
        <button id="edit_sub">Update</button>
        </div>`
        jQuery("#buttons_"+editBtn.substring(9)).append(editForm);
        
        //*****************
        //Submit Post!!
        //*****************
        jQuery("#edit_sub").on("click",function(){
        console.log("hello");
        for(var i=0;i<postsArray.length;i++)
{
    if(editBtn_Num==postsArray[i].id)
    {
        postsArray[i].title=document.getElementById("edit_postTitle").value;
        postsArray[i].body=document.getElementById("edit_body").value;
        document.getElementById("edit_postTitle").value="";
        document.getElementById("edit_body").value="";
        console.log(document.getElementById("title_"+editBtn_Num).innerHTML)
        document.getElementById("title_"+editBtn_Num).innerHTML="<strong>Title: </strong>"+postsArray[i].title;
        document.getElementById("body_"+editBtn_Num).innerHTML="<strong>Title: </strong>"+postsArray[i].body;
        console.log(postsArray[i]);
        localStorage.posts=JSON.stringify(postsArray);
        console.log(localStorage.posts);
          
    }
}
        })
    }
    
    
})
