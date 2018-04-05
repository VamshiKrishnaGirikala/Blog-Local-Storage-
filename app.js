
var postsArray;
var commentsArray;
var usersArray;
var postsHtml='';
var commentsHtml="";
var postsComments=[];
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

if(localStorage.length!=0)
{
    jQuery("#getData").css({'display':'none'});

    
loadData();

}
//Display all posts:
//************loadData function **************//
function loadData()
{
 postsArray=JSON.parse(localStorage.posts);
commentsArray=JSON.parse(localStorage.comments);
usersArray=JSON.parse(localStorage.users);
    for(var i=0;i<postsArray.length;i++)
    {
        for(var j=0;j<usersArray.length;j++)
        {
            if(postsArray[i].userId==usersArray[j].id)
            {
               postsHtml+=`<div class="posts" id="post_${postsArray[i].id}">
                <h4>Name:${usersArray[j].name}</h4>
                <em><strong>Title: </strong>${postsArray[i].title}</em>
                <p><strong>Post Description: </strong>${postsArray[i].body}</p>
                <div id="buttons_${postsArray[i].id}">
                <button id="viewComm_${postsArray[i].id}">View Comments</button>
                <button id="editPost_${postsArray[i].id}">Edit Post</button>
                <button id="deletePost_${postsArray[i].id}">Delete Post</button>
                </div>
               </div> ` 
            }   
        }
    }
    jQuery("#newForm").after(postsHtml);
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
commentsHtml+=`<div class="comments" id="comm_${i}">
                    <p>${postsComments[i].body}</p>
              
              <button id="delComm_${i}">Delete Comment!!</button>
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
    
addComment+=`<div class="comments" id="comm_${postsComments.length}">
                <p>${document.getElementById("textComm").value}</p>
                <button id="delComm_${postsComments.length}">Delete Comment!!</button>
                <hr>
            </div>`;
jQuery("#newComm").before(addComment)

console.log(addCommentObj)
commentsArray.push(addCommentObj);
console.log(commentsArray)
postsComments.push(addCommentObj.body)
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
        // jQuery("#"+delComm_Id).remove();
        console.log(postsComments)
        //start here*****************************************************************************
        // postsComments.splice(delCommArr_id,1)
        console.log(commentsArray[commentsArray[delCommArr_id].id])
        // commentsArray.splice(commentsArray[delCommArr_id],1)
    //     // console.log(commentsArray);
    //     localStorage.comments=JSON.stringify(commentsArray)
        console.log(postsComments)
    }



    // for(var i=0;i<commentsArray.length;i++)
    //     {
    //         if(commentsArray[i].id==delCommId)
    //         {
    //             // console.log(commentsArray[i].id)
    //             commentsArray.splice(i,1);
    //             console.log(postComments);
    //             postComments.splice(i,1);
    //             console.log(postComments)
    //             console.log(commentsArray);
    //             localStorage.comments=JSON.stringify(commentsArray);
    //             console.log(postComments);
    //             console.log(postComments.length);
    //         }}
    
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
    
    // console.log(postsArray);
    // console.log(usersArray);
    // console.log(commentsArray);
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
    

    // var delPost_Id=delPost.replace("deletePost","post")
})
//**********************************
//Edit Post
//**********************************
jQuery("#container").on("click","button[id^='editPost_']",function(){
    var editBtn=jQuery(this).attr('id');
    console.log(editBtn);
    console.log(jQuery("#"+editBtn).parent().parent().attr('id'));
    var editPost_Id=jQuery("#"+editBtn).parent().parent().attr('id');
})
