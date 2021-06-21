
$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyCASboRA4fT274naA8oIav364IM7v_kysw",
    authDomain: "beebot-iot.firebaseapp.com",
    databaseURL: "https://beebot-iot.firebaseio.com",
    projectId: "beebot-iot",
    storageBucket: "beebot-iot.appspot.com",
    messagingSenderId: "137526632607"
  };
  if(localStorage.getItem('username') != null)
  {
    $('#username').text("Welcome, "+localStorage.getItem('username'));
  firebase.initializeApp(config);
  var user = localStorage.getItem('username');

  setInterval(function()
  {
    $('#customerList').html('');
    $('#kind').text($('#kindMeasure').val());
    findDevice(user,$('#kindMeasure').val(),$('#MonthMeasure').val(),$('#YearhMeasure').val());
  }, 3000);

  $('#kind').text($('#kindMeasure').val());
  $('#customerList').html('');
  var cusNull =0;
  var cus =0,body="";
  getAllDevice(user);
}//end if
else {
  alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
  location.href = "../login/login.html";
}
  function findDevice(user,kind,month,year)
  {
    var number = 0;
    var actFind = firebase.database().ref('OwnerShip').orderByChild('compUser').equalTo(user);
    actFind.once('value',function(snap){
      snap.forEach(function(data){
        if(data.val().CusUser != "null")
        {
            number+=1;
            getMeasure(data.val().SerialNumber,kind,month,year,number);
            $('#showKind').text($('#kindMeasure').val());
            $('#labelSerial').text('Serial Number');
        }
      });
    });
  }
  function getMeasure(serial,kind,month,year,number)
  {
      var countKind = 0;
      var start = month+'-'+year+'-1';
      var end = (month)+'-'+(year+1)+'-1';
      var actTable = firebase.database().ref('Spectrokit')
        .orderByChild('timestamp').startAt(start).endAt(end);
      actTable.on('value',function(snap){
        snap.forEach(function(data){
          if(serial == data.val().SerialNumber)
          {
            if(kind == data.val().kind)
            {
              countKind +=1;
            }
          }
        });
        var body = "<tr class=\"text-center\"><td>"+number+"</td><td><a href=\"deviceDetail.html?token="+serial+"\">"+serial+"</a></td><td>"+countKind+"</td></tr>";
      $('#customerList').append(body);
      countKind = 0;
      });
  }
  function getAllDevice(user)
  {
    var actAll = firebase.database().ref('OwnerShip').orderByChild('compUser').equalTo(user);
    actAll.once('value',function(snap){
      snap.forEach(function(data){
        if(data.val().CusUser == "null")
        {
            cusNull+=1;
        }
        else {
              cus+=1;
        }
      });
      if(cusNull != 0 && cus !=0)
      {
        var per = Math.round((cusNull*100)/(cusNull+cus));
        $('#SalesPer').text((100-per)+"%");
        $('#divSalesPer').width((100-per)+"%");
      }
      else {
        var per = 0;
        $('#SalesPer').text("0%");
        $('#divSalesPer').width("0%");
      }
      $('#AllDevices').text("All Devices: "+(cusNull+cus));
      $('#DevicesSale').text("Sales: "+cus);
      $('#showStockDevice').text("Have : "+cusNull);
      $('#AllPer').text(per+"%");
      $('#divAllPer').width(per+"%");
    });
  }
});
