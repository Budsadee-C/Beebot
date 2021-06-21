$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyCASboRA4fT274naA8oIav364IM7v_kysw",
    authDomain: "beebot-iot.firebaseapp.com",
    databaseURL: "https://beebot-iot.firebaseio.com",
    projectId: "beebot-iot",
    storageBucket: "beebot-iot.appspot.com",
    messagingSenderId: "137526632607"
  };
  firebase.initializeApp(config);
  localStorage.clear();
  let database = firebase.database();
  let storage = firebase.storage();

  //var time = new Date().getDate()+"-"+(new Date().getMonth()+1)+"-"+new Date().getFullYear()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
    $('#signin').click(function(){
      var email = $("#email").val();
      var password = $("#password").val();
      var level = $("#myselect").val();
      if(email !='' && password !='')
      {
          if(level == "super-admin" || level == "admin")
          { // company system
            getUser('Company',email,password,level);
          }
          else { // customer system
            getUser('Customer',email,password,level);
          }
      }
      else {
        alert('Please Fill in Username & Password');
      }
    });
});
function getUser(collection,email,pass,lev)
{

  var reAct = firebase.database().ref(collection).orderByChild('email').equalTo(email);;
  reAct.once('value', function(data) {
  if (data.exists()){
    data.forEach(function(find) {
  //  var search = firebase.database().ref(collection+'/'+data.key+'/');
    //    search.once('value', function(find){
            if(pass==find.val().password && lev==find.val().level)
            {
              if(lev=='super-admin' || lev =='admin')
              {
                localStorage.setItem('username', find.val().username);
                location.href = "../beebot/index.html";
              }
              else
              {
                localStorage.setItem('partnerUser', find.val().username);
                location.href = "../beebot/CustomerView.html";
              }
            }
            else {
              alert('Please try it again');
            }
       });
   }//end if exist
   else {
     alert('Please try it again');
   }
  //  });
  });

}
