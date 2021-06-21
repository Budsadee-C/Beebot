$(document).ready(function(){
if(localStorage.getItem('username') != null)
{
showCompany();
setInterval(function()
{
  $('#lastest').html('');
  showLog();
}, 5000);
} // end if
else {
  alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
  location.href = "login.html";
}
/*$(window).unload(function(){
  //localStorage.myPageDataArr=undefined;
  localStorage.removeItem('username');
});*/
});
function showCompany()
{
  var number = 1;
  var actFind = firebase.database().ref('Company').orderByChild('fullname');
  actFind.once('value',function(snap){
    snap.forEach(function(data){
      var body = "<div class=\"article border-bottom\"><div class=\"col-xs-12\">"+
          "<div class=\"row\"><div class=\"col-xs-2 col-md-2 date\"><div class=\"large\">"+number+"</div>"+
          "<div class=\"text-muted\">No.</div></div><div class=\"col-xs-10 col-md-10\">"+
          "<h4><a href=\"CompanyShip.html?token="+data.val().username+"\">"+data.val().fullname+"</a></h4><p>E-mail : "+data.val().email+"</p></div></div></div><div class=\"clear\"></div></div>";
          $('#showComp').append(body);
          number++;
    });
  });
}
function showLog()
{
  var number = 1;
  var device = firebase.database().ref('logFile').orderByChild('status').limitToLast(10).equalTo('Company');
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
