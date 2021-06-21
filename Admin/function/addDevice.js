var number = 1;
$(document).ready(function(){
if(localStorage.getItem('username') != null)
{
  showType();
  showComp();
  $('#showLastest').html('');

  $('#submit').click(function(){
    var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
    var beginL = $('#middle').val();
    var lastL = $('#last').val();
    var mix ="";
    if(lastL.length>=beginL.length && lastL >= beginL && lastL.length <=4 && beginL.length <=4 && $('#SelectType').val()!= 0 && $('#SelectComp').val()!=0  )
    {
      for(var i=beginL;i<=lastL;i++)
      {
        if(i.toString().length==1)
        {
          mix = "000"+i;
        }
        else if(i.toString().length==2)
        {
          mix = "00"+i;
        }
        else if(i.toString().length==3)
        {
          mix = "0"+i;
        }
        else{
          mix = i;
        }
        mix = $('#begin').val()+mix;
      //  alert($('#SelectType :selected').text());
       firebase.database().ref('Device/'+$('#SelectType').val()).push().set({
        SerialNumber: mix
        });
       firebase.database().ref('OwnerShip/').push().set({
        CusUser: "null",
        SerialNumber:mix,
        Type:$('#SelectType :selected').text(),
        compUser:$('#SelectComp').val(),
        timestamp:day
        });
        //alert($('#SelectType').val());
        //console.log(i+" length : "+i.toString().length+" and All:: "+mix);
      }
      firebase.database().ref('logFile/').push().set({
       activity: "Add new "+(lastL-beginL+1)+" Devices to Company, "+$('#SelectComp :selected').text(),
       status:"Master",
       timestamp:day,
       username: localStorage.getItem('username')
       });
       alert('บันทึกข้อมูลสำเร็จค่ะ');
       showNewDevice();
    }
    else {
      alert("กรุณาเลือกข้อมูล Type หรือ Company ให้ครบด้วยค่ะ");
    }
  });
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
function showType()
{
  var number = 1;
  var body = "<option value=\"0\">กรุณาเลือกประเภทอุปกรณ์ค่ะ</option>";
  var device = firebase.database().ref('Device');
  $('#SelectType').append(body);
  device.once('value',function(snap){
    snap.forEach(function(data){
         body = "<option value=\""+data.key+"\">"+data.val().AssignType+"</option>";
         $('#SelectType').append(body);
         number++;
    });
  });
}
function showComp()
{
  var number = 1;
  var body = "<option value=\"0\">กรุณาเลือกลูกค้าค่ะ</option>";
  var device = firebase.database().ref('Company');
  $('#SelectComp').append(body);
  device.once('value',function(snap){
    snap.forEach(function(data){
         body = "<option value=\""+data.val().username+"\">"+data.val().fullname+"</option>";
         $('#SelectComp').append(body);
         number++;
    });
  });
}
function showNewDevice()
{
  var actFind = firebase.database().ref('OwnerShip').orderByKey().limitToLast(($('#last').val()-$('#middle').val()+1));
  actFind.once('value',function(snap){
    snap.forEach(function(data){
      var body = "<div class=\"article border-bottom\"><div class=\"col-xs-12\">"+
          "<div class=\"row\"><div class=\"col-xs-2 col-md-2 date\"><div class=\"large\">"+number+"</div>"+
          "<div class=\"text-muted\">No.</div></div><div class=\"col-xs-10 col-md-10\">"+
          "<h4><a href=\"deviceDetail.html/"+data.key+"\">"+data.val().SerialNumber+"</a></h4><p>Type : "+data.val().Type+"</p><p>Company : "+data.val().compUser+"&nbsp;<a href=\"#\" class=\"trash\"><em class=\"fa fa-trash\"></em></a></p></div></div></div><div class=\"clear\"></div></div>";
          $('#showLastest').append(body);
          number++;
    });
  });
}
