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
    $('#user').text(localStorage.getItem('username'));
  /*  $('#plus').click(function(){
      showSubMen();
    });
    $('#minus').click(function(){ // clear submenu
      $('#sub-item-1').html('');
      $('#types').html('');
    });*/

});
/*function showSubMen()
{
  var menu = firebase.database().ref('Device');
  menu.once('value',function(snap){
    snap.forEach(function(data){
       console.log(data.val().Type);
       var body = "<li><a class=\"\" href=\"#\"><span class=\"fa fa-arrow-right\">&nbsp;&nbsp;</span>" +data.val().Type+"</a></li>";
       $('#sub-item-1').prepend(body);
    });
  });
}*/
