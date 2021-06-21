var count =0;
$(document).ready(function(){
  if(localStorage.getItem('partnerUser') != null)
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
    $('#partnerUser').text("Welcome, "+localStorage.getItem('partnerUser'));
    $('#Measure').html('');
    findDevice(localStorage.getItem('partnerUser'));
  }
  else {
    alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
    location.href = "../login/login.html";
  }
});
function findDevice(cusUser)
{
  var actFind = firebase.database().ref('OwnerShip').orderByChild('CusUser').equalTo(cusUser);
  actFind.once('value',function(snap){
    snap.forEach(function(data){
      if(data.val().CusUser != "null")
      {
          var body = "<tr><td><a href=\"javascript:void(0)\">"+data.val().SerialNumber+"</a></td><td>"+data.val().Type+"</td><td>"+
          data.val().timestamp+"</td></tr>";
          $('#AllcustomerList').append(body);
          findMeasure(data.val().SerialNumber);
      }
    });
    $('#allDevice').text(snap.numChildren()+" devices");
  });
}
function findMeasure(serial){
    var start = (new Date().getMonth()+1)+'-'+new Date().getFullYear()+'-'+new Date().getDate();
    var end = (new Date().getMonth()+1)+'-'+new Date().getFullYear()+'-'+(new Date().getDate()+1);

    var actFind = firebase.database().ref('Spectrokit')
                .orderByChild('timestamp').limitToLast(40).startAt(start).endAt(end);
  actFind.once('value',function(snap){
    if(snap.numChildren()>0)
    { // Data in today
      $('#labelDay').text('40 Lastest Measure');
      snap.forEach(function(data){
        if(serial == data.val().SerialNumber)
        {
            var body = "<tr><td><a href=\"#\" onclick=\"OpenExcel('"+data.val().SerialNumber+"')\">"+data.val().SerialNumber+"</a></td><td>"+data.val().kind+"</td><td>"+
            data.val().Measurement+"</td><td>"+data.val().timestamp+"</td></tr>";
            $('#Measure').append(body);
        }
      });
      $('#allMeasure').text(snap.numChildren()+" times");
    }
    else{ // lastest Data
      $('#labelDay').text('Lastest Measure');
      var actLast = firebase.database().ref('Spectrokit')
                  .orderByChild('timestamp').limitToLast(40);
      actLast.once('value',function(lastest){
        lastest.forEach(function(data){

          if(count<=30)
          {
            if(serial == data.val().SerialNumber)
            {
              count+=1;
              var body = "<tr><td><a href=\"javascript:void(0)\">"+data.val().SerialNumber+"</a></td><td>"+data.val().kind+"</td><td>"+
              data.val().Measurement+"</td><td>"+data.val().timestamp+"</td></tr>";
              $('#Measure').append(body);
              $('#allMeasure').text(count+" times");
            }

          }
        });
      });
    }

  });
}
function OpenExcel(serial)
{
  var object = [];
  var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate();
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
