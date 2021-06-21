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
    findSerial(key);
    setMatch(localStorage.getItem('username'));

    $('#chooseCustom').change(function(){
      setOrgan($('#chooseCustom option:selected').val());
    });
    $('#save').click(function(){ // when click save
      if(localStorage.getItem('username') != null)
      {
        var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
        firebase.database().ref().child('/OwnerShip/' +key)
        .update({ CusUser: $('#cus').val()});

        firebase.database().ref('logFile/').push().set({
        activity: "Update Matching : "+$('#cus').val()+" with "+localStorage.getItem('username'),
        status: "Company",
        username: localStorage.getItem('username'),
        timestamp: day
        });
        alert ('บันทึกข้อมูลเรียบร้อยค่ะ');
        location.href = "../beebot/deviceList.html";
      }
      else {
        alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
        location.href = "../login/login.html";
      }
    });
  }
  else {
    alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
    location.href = "../login/login.html";
  }
});
function findSerial(key)
{
  var actFind = firebase.database().ref('OwnerShip').orderByKey().equalTo(key);
  actFind.once('value',function(snap){
    snap.forEach(function(data)
    {
      $('#fullname').text(data.val().SerialNumber);
      $('#showSerial').text(data.val().Type);
    });
  });
}
function setMatch(user)
{
  var number=0;
  var actFind = firebase.database().ref('Partner').orderByChild('compUser').equalTo(user);
  actFind.once('value',function(snap){
    snap.forEach(function(data)
    {
       if(data.val().CusUser != "null")
       {
         number+=1;
         getEmail(data.val().CusUser,number);
       }
    });
  });
}
function getEmail(cusUser,number)
{
  var actUser = firebase.database().ref('Customer').orderByChild('username').equalTo(cusUser);
  actUser.once('value',function(snap){
    snap.forEach(function(data){
      if(number==1)
      {
        var choose = "<option selected>"+data.val().email+"</option>";
      }
      else {
        var choose = "<option>"+data.val().email+"</option>";
      }
      $('#chooseCustom').prepend(choose);
      $('#organ').val(data.val().organize);
      $('#cus').val(data.val().username);
    });
  });
}
function setOrgan(email)
{
  var actUser = firebase.database().ref('Customer').orderByChild('email').equalTo(email);
  actUser.once('value',function(snap){
    snap.forEach(function(data){
      $('#organ').val(data.val().organize);
      $('#cus').val(data.val().username);
    });
  });
}
