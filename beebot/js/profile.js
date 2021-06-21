$(document).ready(function(){
  if(localStorage.getItem('username') != null)
  {
    var config = {
      apiKey: "AIzaSyCASboRA4fT274naA8oIav364IM7v_kysw",
      authDomain: "beebot-iot.firebaseapp.com",
      databaseURL: "https://beebot-iot.firebaseio.com",
      projectId: "beebot-iot",
      storageBucket: "beebot-iot.appspot.com",
      messagingSenderId: "137526632607"
    };
    firebase.initializeApp(config);
    $('#username').text("Welcome, "+localStorage.getItem('username'));
    var key = window.location.href.substring(window.location.href.lastIndexOf('=') + 1);
    var link = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    $("#detailUser").hide();
    $("#detail").show();
    $("#password").prop('disabled', true);
    $("#Cususername").prop('disabled', true);
    $('#addCustomer').val(key);
    findProfile(key);

    $('#addCustomer').click(function(){
      $("#detailUser").show();
      $("#detail").hide();
    });
  }
  else {
    alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
    location.href = "../login/login.html";
  }
});
function findProfile(key)
{
  var actFind = firebase.database().ref('Customer').orderByKey().equalTo(key);
  actFind.once('value',function(snap){
    snap.forEach(function(data){
      $('#fullName').val(data.val().fullname);
      $('#Cususername').val(data.val().username);
      $('#telephone').val(data.val().telephone);
      $('#password').val(data.val().password);
      $('#email').val(data.val().email);
      $('#organize').val(data.val().organize);
      $('#province').val(data.val().province);
      $('#fullname').text("ชื่อ-นามสกุล : "+data.val().fullname);
      $('#cusLevel').text("ตำแหน่ง : "+data.val().level);
    });
  });
}
