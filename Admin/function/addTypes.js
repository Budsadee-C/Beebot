$(document).ready(function(){
if(localStorage.getItem('username') != null)
{
  $('#submit').click(function(){
    var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
    if($('#name').val()!='')
    {
      insertType(day);
    }
  });
}//end if
else {
  alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
  location.href = "login.html";
}
/*$(window).unload(function(){
  //localStorage.myPageDataArr=undefined;
  localStorage.removeItem('username');
});*/
});

function insertType(day)
{
  var result = confirm("คุณต้องการบันทึกข้อมูลหรือไม่");
  if(result==true)
  {
      firebase.database().ref('Device/').push().set({
      AssignType: $('#name').val()
      });
      firebase.database().ref('logFile/').push().set({
      activity: "Add New Device Types: "+$('#name').val(),
      status:"Master",
      username:localStorage.getItem('username'),
      timestamp:day
      });
      alert("บันทึกข้อมูลสำเร็จค่ะ");
      $('#name').val('');
      //location.href = "deviceTypes.html";
  }
  else {
    $('#name').val('');
  }
}
