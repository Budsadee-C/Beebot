var web  = window.location.href.substring(window.location.href.lastIndexOf('=') + 1);
$(document).ready(function(){
showDetail();
showType();
});

function showDetail()
{
  var number = 1;
  var numberType = firebase.database().ref('Device/'+web);

  numberType.once('value',function(snapshot){
    snapshot.forEach(function(data){
      if(number <= (snapshot.numChildren()-1))
      {
        var body = "<div class=\"article border-bottom\">"
                      +"<div class=\"col-xs-12\">"
                        +"<div class=\"row\">"
                          +"<div class=\"col-xs-2 col-md-2 date\">"
                              +"<div class=\"large\">"+number+"</div>"
                              +"<div class=\"text-muted\">No.</div>"
                           +"</div>"
                           +"<div class=\"col-xs-10 col-md-10\"><h4><a href=\"deviceMeasure.html?token="+data.val().SerialNumber+"\">"+data.val().SerialNumber+"</a></h4></div>"
                       +"</div>"
                     +"</div><div class=\"clear\"></div>"
                  +"</div>";
           $('#types').append(body);
           number++;
      }
    });
  });
}
function showType()
{
  var numberType = firebase.database().ref('Device/'+web+'/AssignType');
  numberType.once('value',function(snapshot){
    $('#kind').append(snapshot.val());
  });
}
