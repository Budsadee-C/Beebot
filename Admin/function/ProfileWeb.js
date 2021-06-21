$(document).ready(function(){
  if(localStorage.getItem('username') != null)
  {
  setInterval(function()
  {
    $('#lastest').html('');
    showLog();
  }, 10000);

  $('#submit').click(function(){
    var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
    UpdateUser(day);
  }); // close click function
  /*$(window).unload(function(){
    //localStorage.myPageDataArr=undefined;
    localStorage.removeItem('username');
  });*/
}// end if
else {
  alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
  location.href = "login.html";
}
/*$(window).unload(function(){
  //localStorage.myPageDataArr=undefined;
  localStorage.removeItem('username');
});*/
});
function showLog()
{
  var number = 1;
  var device = firebase.database().ref('logFile').orderByChild('username').limitToLast(10).equalTo(localStorage.getItem('username'));
  device.once('value',function(snap){
    snap.forEach(function(data){
        var body = "<div class=\"article border-bottom\"><div class=\"col-xs-12\">"+
            "<div class=\"row\"><div class=\"col-xs-2 col-md-2 date\"><div class=\"large\">"+number+"</div>"+
            "<div class=\"text-muted\">No.</div></div><div class=\"col-xs-10 col-md-10\">"+
            "<h4>Date: "+data.val().timestamp+"</a></h4><p>Activity : "+data.val().activity+"</p></div></div></div><div class=\"clear\"></div></div>";
           $('#lastest').append(body);
           number++;
    });
 });
}
function UpdateUser(day)
{
  if($('#opass').val()!=''&& $('#npass').val()!='')
  {
    var checkPass = firebase.database().ref('Nectec');
    checkPass.once('value',function(snap) {
        if($('#opass').val() == snap.val().password && $('#opass').val()!=$('#npass').val()) // match old password
        {
          firebase.database().ref().child('/Nectec')
          .update({
            password: $('#npass').val()
          });
          firebase.database().ref('logFile/').push().set({
            activity: "Changed password ",
            status: "Master",
            timestamp: day,
            username: localStorage.getItem('username')
          });
          alert("บันทึกข้อมูลสำเร็จค่ะ");
          location.href = "../Admin/index.html";
        }
        else {
          alert("กรุณากรอกรหัสผ่านไม่ถูกต้องค่ะ");
          $('#opass').text('');
        }
    });
  }
}
