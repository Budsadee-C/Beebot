
$(document).ready(function(){
  if(localStorage.getItem('username') != null)
  {
      showSubMen();
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
function showSubMen()
{
  var number = 1;
  var device = firebase.database().ref('Device');
  device.once('value',function(snap){
    snap.forEach(function(data){
      var numberType = firebase.database().ref('Device/'+data.key);
      numberType.once('value',function(snapshot){
         var body = "<div class=\"article border-bottom\"><div class=\"col-xs-12\">"+
             "<div class=\"row\"><div class=\"col-xs-2 col-md-2 date\"><div class=\"large\">"+number+"</div>"+
             "<div class=\"text-muted\">No.</div></div><div class=\"col-xs-10 col-md-10\">"+
             "<h4><a href=\"deviceTypeDetail.html?token="+data.key+"\">"+data.val().AssignType+"</a></h4><p>"+(snapshot.numChildren()-1)+"  Devices</p></div></div></div><div class=\"clear\"></div></div>";
             $('#types').append(body);
             number++;
      });
    });
  });
}
