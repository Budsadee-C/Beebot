$(document).ready(function(){
  if(localStorage.getItem('username') != null)
  {
      countDash();
  }
  else {
    alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
    location.href = "login.html";
  }
  /*$(window).unload(function(){
    //localStorage.myPageDataArr=undefined;
    localStorage.removeItem('username');
  });*/
});
function countDash()
{
  var countComp = firebase.database().ref('Company');
  countComp.once('value',function(snapshot){
    $('#countComp').text(snapshot.numChildren());
  })
  var countType = firebase.database().ref('Device');
  countType.once('value',function(snapshot){
    $('#countType').text(snapshot.numChildren());
  })
  var countDevice = firebase.database().ref('OwnerShip');
  countDevice.once('value',function(snapshot){
    $('#countDevice').text(snapshot.numChildren());
  })
}
