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
  $('#signin').click(function(){
  var user = $('#user').val();
  var pass = $('#pass').val();
    if(user!='' && pass!='')
    {

      findUser(user,pass);
    }
    else {
      alert("Please fill in username and password");
    }
  });
});
function findUser(user, pass)
{
  var find = firebase.database().ref('Nectec');
  find.once('value',function(snapshot){
    if(snapshot.exists())
    {
        if(pass == snapshot.val().password && user == snapshot.val().username)
        {
            localStorage.setItem('username', snapshot.val().username);
            location.href = "index.html";
        }
        else {
          alert("Wrong Username Or Password");
        }
    }
    else {
      alert("Please Try it again");
      $('#user').val('');
      $('#pass').val('');
    }
  });
}
