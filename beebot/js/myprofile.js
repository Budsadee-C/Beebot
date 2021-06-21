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
    var user = localStorage.getItem('username');
    $("#detailUser").hide();
    $("#detail").show();
    $("#Profileusername").prop('disabled', true);
    $("#Profilepassword").prop('disabled', true);
    findProfile(user);
    $('#editMyProfile').click(function(){ // when click link edit
      $('#newUsername').val(localStorage.getItem('username'));
      $("#detailUser").show();
      $("#detail").hide();
    });
    $('#save').click(function(){ // when click save
      //findKey(localStorage.getItem('username'),"Profile");
      findKey(localStorage.getItem('username'));
    });
    $('#editSave').click(function(){ // when click edit username & password
        checkPassword(localStorage.getItem('username'));
    });
  }
  else {
    alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
    location.href = "../login/login.html";
  }
});
function checkPassword(profile)
{
  var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
  var actFind = firebase.database().ref('Company').orderByChild('username').equalTo(profile);
  actFind.once('value',function(snap){
    snap.forEach(function(data){
      if($('#oldPassword').val()==data.val().password) // match old password
      {
        firebase.database().ref().child('/Company/' +data.key)
        .update({
          password: $('#newPassword').val()
        });

        firebase.database().ref('logFile/').push().set({
        activity: "Change Company's Password ",
        status: "Company",
        username: profile,
        timestamp: day
        });
        alert("บันทึกข้อมูลสำเร็จค่ะ");
        location.href = "../beebot/profile.html";
      }
      else {
        alert("กรุณากรอกรหัสผ่านไม่ถูกต้องค่ะ");
        $('#oldPassword').text('');
      }
    });
  });
}
  function findKey(user)
  {
    var actFind = firebase.database().ref('Company').orderByChild('username').equalTo(user);
    actFind.once('value',function(snap){
      snap.forEach(function(data){
        updateProfile(data.key);
      });
    });
  }
  function updateProfile(key)
  {
      var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
      firebase.database().ref().child('/Company/' +key)
      .update({
        address: $('#address').val(),
        email: $('#email').val(),
        fullname: $('#fullName').val(),
        telephone: $('#telephone').val()
      });
      firebase.database().ref('logFile/').push().set({
      activity: "Change Company's Profile",
      status: "Company",
      username: localStorage.getItem('username'),
      timestamp: day
      });
      alert('บันทึกข้อมูลสำเร็จค่ะ')
    location.href = "../beebot/profile.html";
  }
  function findProfile(user)
  {
    var actFind = firebase.database().ref('Company').orderByChild('username').equalTo(user);
    actFind.once('value',function(snap){
      snap.forEach(function(data){
        $('#fullName').val(data.val().fullname);
        $('#Profileusername').val(data.val().username);
        $('#telephone').val(data.val().telephone);
        $('#Profilepassword').val(data.val().password);
        $('#email').val(data.val().email);
        $('#address').val(data.val().address);
        $('#province').val(data.val().province);
        $('#fullname').text(data.val().fullname);
        $('#cusLevel').text("ตำแหน่ง : "+data.val().level);
      });
    });
  }
