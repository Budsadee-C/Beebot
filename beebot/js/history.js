var _min=0;
var _max=0;
var _color="";
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
  var user = localStorage.getItem('partnerUser');
  //$('#kind').text($('#kindMeasure').val());
  $('#customerList').html('');
  var graph_canvas = document.getElementById('chart').getContext('2d');
  setSerialMeasure(localStorage.getItem('partnerUser'));
  findDevice($('#SerialMeasure').val(),$('#kindMeasure').val(),$('#MonthMeasure').val(),$('#YearhMeasure').val(),graph_canvas);
  $('#click').click(function(){
    var minMax=[];
    var kind = $('#kindMeasure').val();
    var month = $('#MonthMeasure').val();
    var year = $('#YearhMeasure').val();
    var serial = $('#SerialMeasure').val();
    setMinMax(kind);
    $('#customerList').html('');
  //$('#kind').text(kind);
    findDevice(serial,kind,month,year,graph_canvas);
  });
  $('#save').click(function(){
    OpenExcel($('#SerialMeasure').val(),$('#kindMeasure').val(),$('#MonthMeasure').val(),$('#YearhMeasure').val());
  });
}
else {
  alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
  location.href = "../login/login.html";
}
});
function setMinMax(_kind)
{

  if(_kind=="PH")
  {
      _min=0;
      _max=14;
      _color= "mediumblue";
  }
  else if(_kind=="Ammonium")
  {
    _min=0;
    _max=10;
    _color = "green";
  }
  else if(_kind=="Chlorine")
  {
    _min=0;
    _max=1;
    _color= "gold";
  }
  else if(_kind=="Nitrite")
  {
    _min=0;
    _max=1;
    _color="coral";
  }
  else if(_kind=="Phosphate")
  {
    _min=0;
    _max=10;
    _color= "deepskyblue";
  }
}
function findDevice(serial,kind,month,year,graph)
{
  var value= [];
  var time = [];
  //var web  = window.location.href.substring(window.location.href.lastIndexOf('=') + 1);
  //web = web.split("#");
//  var start = month+'-'+year+'-1';
//  var end = (month)+'-'+(year+1)+'-1';
//  var actTable = firebase.database().ref('Spectrokit')
//  .orderByChild('timestamp').startAt(start).endAt(end);
var actTable = actGraph = firebase.database().ref('Measurement').orderByChild('SerialNumber').limitToLast(40);
  actTable.on('value',function(snap){
    snap.forEach(function(data){
      value.push(data.val().value);
      time.push(data.val().kind+" "+data.val().timestamp);
      console.log(data.val().value+" data");
    });
  });
  creatGraph(value,time,graph,serial);
}
function creatGraph(_value,_time,_graph,_serial)
{
  chart_temp = new Chart(_graph, {
  type: 'line',
  data: {
      labels: _time,
      datasets: [{
          label: 'Measure From Device ID: '+_serial,
          fill: false,
          lineTension: 0.1,
          backgroundColor: _color,
          borderColor: _color,
          data: _value
      }]
  },
  options: {
      animation: false,
      responsive: true,
      scales: {
        xAxes: [{
          ticks:{
            fontSize : 6
            }
          }],
        yAxes: [{
          scaleLabel: {
            display: true,
            //labelString: 'Celsius.'

          }
        }]
      }
    }
  });
  chart_temp.options.scales.yAxes[0].ticks.min = _min;
  chart_temp.options.scales.yAxes[0].ticks.max = _max;
}
function setSerialMeasure(profile)
{
  var number =0;
  var actUser = firebase.database().ref('OwnerShip').orderByChild('CusUser').equalTo(profile);
  actUser.once('value',function(snap){
    if(snap.numChildren()==0)
    {
      var choose = "<option selected>ไมพบอุปกรณ์</option>";
      $('#SerialMeasure').prepend(choose);
    }
    else {
      $('#SerialMeasure').html('');
    }
    snap.forEach(function(data){
      number+=1;
      if(number==1)
      {
        var choose = "<option selected>"+data.val().SerialNumber+"</option>";
      }
      else {
        var choose = "<option>"+data.val().SerialNumber+"</option>";
      }
      $('#SerialMeasure').prepend(choose);
    });

  });
}
function OpenExcel(serial,kind,month,year)
{
  var object = [];
  var day = (new Date().getMonth()+1);
  var start = month+'-'+year+'-1';
  var end = (month)+'-'+(year+1)+'-1';
  var actTable = firebase.database().ref('Spectrokit')
      .orderByChild('timestamp').startAt(start).endAt(end);
  actTable.on('value',function(snap){
    if(snap.exists())
    {
      snap.forEach(function(data){
        if(serial == data.val().SerialNumber)
        {
            if(kind == data.val().kind)
            {
                object.push({"SerialNumber" : data.val().SerialNumber,
                "kind" : data.val().kind,"value" : data.val().Measurement,
                "Bb" : data.val().B_blank,"Gb" : data.val().G_blank,"Rb" : data.val().R_blank,
                "Bs" : data.val().B_sample,"Gs" : data.val().G_sample,"Rs" : data.val().R_sample,
                "timestamp": data.val().timestamp});
            }
        }
      });
      var data, filename, link;
      var csv = convertArrayOfObjectsToCSV({
          data: object
      });
      if (csv == null) return;
      filename = serial+"#allMonth-"+day+".csv"  || 'export.csv';
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
    }//end if
    else{
      alert("Can't open CSv file, it isn't data in this device");
    }
  });//end on
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
