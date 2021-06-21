$(document).ready(function(){
if(localStorage.getItem('username') != null)
{
showDevice();
setInterval(function()
{
  $('#showMeasuer').html('');
  showMeasuer();
}, 5000);
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
function showDevice()
{
  var number = 1;
  var actFind = firebase.database().ref('OwnerShip').orderByChild('type');
  actFind.once('value',function(snap){
    snap.forEach(function(data){
      var body = "<div class=\"article border-bottom\"><div class=\"col-xs-12\">"+
          "<div class=\"row\"><div class=\"col-xs-2 col-md-2 date\"><div class=\"large\">"+number+"</div>"+
          "<div class=\"text-muted\">No.</div></div><div class=\"col-xs-10 col-md-10\">"+
          "<h4><a href=\"deviceMeasure.html?token="+data.val().SerialNumber+"\">"+data.val().SerialNumber+"</a></h4><p>Type : "+data.val().Type+"</p></div></div></div><div class=\"clear\"></div></div>";
          $('#ShowDevice').append(body);
          number++;
    });
  });
}
function showMeasuer()
{
  var number = 1;
  var actFind = firebase.database().ref('Measurement').orderByChild('timestamp').limitToLast(15);
  actFind.once('value',function(snap){
    snap.forEach(function(data){
      var body = "<div class=\"article border-bottom\"><div class=\"col-xs-12\">"+
          "<div class=\"row\"><div class=\"col-xs-2 col-md-2 date\"><div class=\"large\">"+number+"</div>"+
          "<div class=\"text-muted\">No.</div></div><div class=\"col-xs-10 col-md-10\">"+
          "<h4><a href=\"deviceMeasure.html?token"+data.val().SerialNumber+"\">"+data.val().SerialNumber+"</a></h4><p>Value : "+data.val().value+"</p><p>Type : "+data.val().Type+"</p></div></div></div><div class=\"clear\"></div></div>";
          $('#showMeasuer').append(body);
          number++;
    });
  });
}
