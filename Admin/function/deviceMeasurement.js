var web  = window.location.href.substring(window.location.href.lastIndexOf('=') + 1);
web = web.split("#");
var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate()+","+new Date().getHours()+"-"+new Date().getMinutes()+"-"+new Date().getSeconds();
$(document).ready(function(){
  if(localStorage.getItem('username') != null)
  {
  var graph_canvas = document.getElementById('chart').getContext('2d');
  var value= [];
  var time = [];
  var actGraph = firebase.database().ref('Measurement').orderByChild('SerialNumber').limitToLast(40).equalTo(web[0]);
  actGraph.on('value',function(snap){
    if(snap.exists())
    {
      $('#word').html('');
      snap.forEach(function(data){
        value.push(data.val().value);
        time.push(data.val().kind+" "+data.val().timestamp);
        console.log(data.val().value+" data");
      });
       creatGraph(value.reverse(),time.reverse(),graph_canvas,web);
    }
    else {
      var body = "ไม่พบข้อมูลการวัดค่ะ";
    //  alert('ไม่พบข้อมูลค่ะ');
      $('#word').append(body);
    }
  }); // end graph
  $('#openExcel').click(function()
  {
    var object = [];
    var actGraph = firebase.database().ref('Measurement').orderByChild('SerialNumber').equalTo(web[0]);
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
        filename = web+"#"+day+".csv"  || 'export.csv';
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
  }); // end click
}//end if
else {
  alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
  location.href = "login.html";
}
/*$(window).unload(function(){
  //localStorage.myPageDataArr=undefined;
  localStorage.removeItem('username');
});*/
}); // end document
// Initial Values
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
function creatGraph(_value,_time,_graph,_serial)
{
  graph = new Chart(_graph, {
  type: 'line',
  data: {
      labels: _time,
      datasets: [{
          fill: false,
          lineTension: 0,
          backgroundColor: "red",
          borderColor: "red",
          radius: 3,
          data: _value,
          label: "ID: "+_serial+" "
      }]
  },
  options: {
      animation: false,
      responsive: true,
      title: {
      display: true,
      position: "top",
      fontSize: 18,
      fontColor: "red",
      text: 'Measure From Device ID: '+_serial
     },
      scales: {
        xAxes: [{
          ticks:{
            fontSize : 9
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
  graph.options.scales.yAxes[0].ticks.min = 0;
  graph.options.scales.yAxes[0].ticks.max = 100;
}
