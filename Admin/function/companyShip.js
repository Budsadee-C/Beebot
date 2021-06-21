$(document).ready(function(){
if(localStorage.getItem('username') != null)
{
$('#spec').hide();
var value  = window.location.href.substring(window.location.href.lastIndexOf('?') + 1);
var kind = value.substring(0,value.indexOf('='));
var user = value.substring(value.lastIndexOf('=') + 1);

showDevice(user,kind);
showCompany(user,kind);
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
function showDevice(user,kind)
{
  var number = 1;
  if(kind=="token")
  {
    $('#spec').hide();
    var device = firebase.database().ref('OwnerShip').orderByChild('compUser').equalTo(user);

  }
  else if(kind="device"){
    $('#spec').show();
    showCustomer(user);
    var device = firebase.database().ref('OwnerShip').orderByChild('SerialNumber').equalTo(user);
    //var word="<h4 style=\"color:blue;\">"+data.val().SerialNumber+"</h4><p>Customer : "+data.val().CusUser+"</p>";
  }
  device.once('value',function(snap){
    if (snap.exists()){
      snap.forEach(function(data){
        var body = "<div class=\"article border-bottom\"><div class=\"col-xs-12\">"+
            "<div class=\"row\"><div class=\"col-xs-2 col-md-2 date\"><div class=\"large\">"+number+"</div>"+
            "<div class=\"text-muted\">No.</div></div><div class=\"col-xs-10 col-md-10\">"+
            "<h4><a href=\"deviceMeasure.html?device="+data.val().SerialNumber+"\">"+data.val().SerialNumber+"</a></h4><p>Type : "+data.val().Type+"</p>"+
            "</div></div></div><div class=\"clear\"></div></div>";
           $('#ownership').append(body);
           number++;
      });
    }
   else {
       var body = "ไม่พบข้อมูลอุปกรณ์ค่ะ";
       $('#ownership').append(body);
   }
  });
}
function showCompany(user,kind)
{
   $('#company').html('');
  if(kind=="token")
  {
    var company = firebase.database().ref('Company').orderByChild('username').equalTo(user);
    company.once('value',function(snap){
      snap.forEach(function(data){
        var body = "Owerships | "+data.val().fullname
                +"<span class=\"pull-right clickable panel-toggle panel-button-tab-left\"><em class=\"fa fa-toggle-up\"></em></span>";
        $('#company').append(body);
      });
    });
  }
  else if(kind=="device"){
    var body = "Devices | details";
      $('#company').append(body);
      $('#device').append('Customer | detail');
  }
}
function showCustomer(user)
{
  var custom = firebase.database().ref('OwnerShip').orderByChild('SerialNumber').equalTo(user);
  custom.on('child_added',function(snap){
    if(snap.val().CusUser!="null")
    {
      var query = firebase.database().ref('Customer').orderByChild('username').equalTo(snap.val().CusUser);
      query.on('child_added',function(data)
      {
          var body = "<div class=\"article border-bottom\"><div class=\"col-xs-12\">"+
              "<div class=\"row\"><div class=\"col-xs-3 col-md-3 date\"><div class=\"large\">&nbsp;</div>"+
              "<div class=\"text-muted\"></div></div><div class=\"col-xs-9 col-md-9\">"+
              "<h4>"+data.val().fullname+"</a></h4><p>E-mail: "+data.val().email+"</p><p>Organize : "+data.val().organize+"</p>"+
              "<p>Province : "+data.val().province+"</p><p>Telephone : "+data.val().telephone+"</p>"+
              "</div></div></div><div class=\"clear\"></div></div>";
             $('#detail').append(body);
      });
    }
    else {
      $('#detail').append("<center>เครื่องนี้ยังไม่ได้ถูกจำหน่ายค่ะ</center>");
    }
  });
}
