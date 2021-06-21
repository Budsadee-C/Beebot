$(document).ready(function(){
  if(localStorage.getItem('partnerUser') != null)
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
    $('#partnerUser').text("Welcome, "+localStorage.getItem('partnerUser'));
    $('#detail').show();
    $('#detailUser').hide();
    findProfileCus(localStorage.getItem('partnerUser'));

    $('#addCustomer').click(function(){ // when click add customer
      $('#newUsername').val(localStorage.getItem('partnerUser'));
      $('#detail').hide();
      $('#detailUser').show();
    });

    $('#save').click(function(){
      findKey(localStorage.getItem('partnerUser'));
    });
    $('#editSave').click(function(){
      checkPassword(localStorage.getItem('partnerUser'));
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
  var actFind = firebase.database().ref('Customer').orderByChild('username').equalTo(profile);
  actFind.once('value',function(snap){
    snap.forEach(function(data){
      if($('#oldPassword').val()==data.val().password) // match old password
      {
        firebase.database().ref().child('/Customer/' +data.key)
        .update({
          password: $('#newPassword').val()
        });
        firebase.database().ref('logFile/').push().set({
        activity: "Customer,"+profile+" Change Password",
        status: "Customer",
        username: profile,
        timestamp: day
        });
        alert("บันทึกข้อมูลสำเร็จค่ะ");
        location.href = "../beebot/CustomerProfile.html";
      }
      else {
        alert("กรุณากรอกรหัสผ่านไม่ถูกต้องค่ะ");
        $('#oldPassword').text('');
      }
    });
  });
}
function findKey(profile)
{
  var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
  var actFind = firebase.database().ref('Customer').orderByChild('username').equalTo(profile);
  actFind.once('value',function(snap){
    snap.forEach(function(data){
      firebase.database().ref().child('/Customer/' +data.key)
      .update({
        telephone: $('#telephone').val(),
        email: $('#email').val(),
        fullname: $('#fullName').val(),
        province: $('#province').val(),
        organize: $('#organize').val()
      });
      firebase.database().ref('logFile/').push().set({
      activity: "Customer,"+profile+" Change Profile",
      status: "Customer",
      username: profile,
      timestamp: day
      });
      alert("บันทึกข้อมูลสำเร็จค่ะ");
      location.href = "../beebot/CustomerProfile.html";
    });
  });

}
function findProfileCus(profile)
{
  var actUser = firebase.database().ref('Customer').orderByChild('username').equalTo(profile);
  actUser.once('value',function(snap){
    snap.forEach(function(data){
      $('#fullName').val(data.val().fullname);
      $('#fullname').text(data.val().fullname)
      $('#Cususername').val(data.val().username);
      $('#telephone').val(data.val().telephone);
      $('#password').val(data.val().password);
      $('#email').val(data.val().email);
      $('#province').val(data.val().province);
      $('#organize').val(data.val().organize);
      $('#cusLevel').text("ตำแหน่ง : "+data.val().level);
    });
  });
}
