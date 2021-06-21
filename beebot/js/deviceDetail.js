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
    var serial = window.location.href.substring(window.location.href.lastIndexOf('=') + 1);
    findOwner(serial);
  }
  else {
    alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
    location.href = "../login/login.html";
  }
});
function findOwner(serial)
{
  var actFind = firebase.database().ref('OwnerShip').orderByChild('SerialNumber').equalTo(serial);
  actFind.once('value',function(snap){
    snap.forEach(function(data)
    {
      $('#fullname').text(data.val().SerialNumber);
      $('#showSerial').text(data.val().Type);
      findCustomer(data.val().CusUser);
    });
  });
}
function findCustomer(cusUser)
{

  var actFind = firebase.database().ref('Customer').orderByChild('username').equalTo(cusUser);
  actFind.once('value',function(snap){
    snap.forEach(function(data)
    {
      $('#partUser').val(data.val().fullname);
      $('#cus').val(data.val().username);
      $('#organ').val(data.val().organize);
    });
  });
}
