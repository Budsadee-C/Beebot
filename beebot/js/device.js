$(document).ready(function(){
  if(localStorage.getItem('username') != null)
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
    $('#username').text("Welcome, "+localStorage.getItem('username'));
    $('#customerList').html('');
    $('#customerListNulls').html('');
    findDevice(localStorage.getItem('username'));
  }
  else {
    alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
    location.href = "../login/login.html";
  }
});
function findDevice(user)
{
  var cusCount =0;
  var cusNull = 0;
  var actFind = firebase.database().ref('OwnerShip').orderByChild('compUser').equalTo(user);
  actFind.once('value',function(snap){
    snap.forEach(function(data)
    {
       if(data.val().CusUser != "null")
       {
         cusCount+=1;
         getDetailUser(data.val().SerialNumber,data.val().timestamp,data.val().Type,data.val().CusUser,cusCount);
       }
       else {
         cusNull+=1;
         var body = "<tr><td>"+cusNull+"</td><td><a href=\"MatchCustom.html?token="+data.key+"\">"+data.val().SerialNumber+"</a></td><td>Avaliable</td><td>"+
                     data.val().timestamp+"</td><td>"+data.val().Type+"</td></tr>";
         $('#customerListNulls').append(body);
       }
    });
  });
}
function getDetailUser(serial,timestamp,type,cusUser,number)
{
  var actUser = firebase.database().ref('Customer').orderByChild('username').equalTo(cusUser);
  actUser.once('value',function(snap){
    snap.forEach(function(data){
      var body = "<tr><td>"+number+"</td><td><a href=\"#\" onclick=\"OpenExcel('"+serial+"')\">"+serial+"</a></td><td><a href=\"CusProfile.html?token="+data.key+"\">"+cusUser+"</a></td><td>"+
                  timestamp+"</td><td>"+type+"</td></tr>";
      $('#customerList').prepend(body);
    });
  });
}
function OpenExcel(serial)
{
  var object = [];
  var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate()+","+new Date().getHours()+"-"+new Date().getMinutes()+"-"+new Date().getSeconds();
  var actGraph = firebase.database().ref('Measurement').orderByChild('SerialNumber').equalTo(serial);
  actGraph.on('value',function(snap){
  if(snap.exists())
  {
    snap.forEach(function(data){
        object.push({"SerialNumber" : data.val().SerialNumber,"value" : data.val().value,"kind" : data.val().kind,"Type": data.val().Type,"timestamp": data.val().timestamp});
    });
        // download data to csv
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV({
        data: object
    });
    if (csv == null) return;
      filename = serial+"#"+day+".csv"  || 'export.csv';
      if (!csv.match(/^data:text\/csv/i))
      {
        csv = 'data:text/csv;charset=utf-8,' + csv;
      }
      data = encodeURI(csv);
      link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
      console.log(object);
  }// end if exitst
  else {
    alert("Can't open CSv file, it isn't data in this device");
  }
  }); // end on
}
function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length)
    {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });
    return result;
}
