var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
$(document).ready(function(){
  if(localStorage.getItem('username') != null)
  {
    $('#pass').val(GenPassword());
    $('#submit').click(function(){
    if(validateEmail($('#email').val())) // check rule email and user not null
    {
      firebase.database().ref('Company/').push().set({
      address: "null",
      display:"null",
      email:$('#email').val(),
      fullname:$('#com').val(),
      level:$('#myselect').val(),
      password:$('#pass').val(),
      telephone:"null",
      username:$('#name').val()
      });
      firebase.database().ref('logFile/').push().set({
      activity: "Add New Company's User: "+$('#name').val(),
      status:"Master",
      username:localStorage.getItem('username'),
      timestamp:day
      });
      alert("บันทึกข้อมูลสำเร็จค่ะ");
      sendMail();
      clearData();

    }
    else {
      alert('รูปแบบอีเมล์ไม่ถูกต้องค่ะ');
      $('#email').val('');
      $('#name').val('');
    }
  });
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
function clearData()
{
  $('#email').val('');
  $('#com').val('');
  $('#pass').val(GenPassword());
  $('#name').val('');
}
function validateEmail($email)
{
  //var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  var emailReg = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return emailReg.test( $email );
}
function sendMail()
{
  var word =  "Username : "+$('#name').val()+"\n"
              +"Password : "+$('#pass').val()+"\n"
              +"First Login, Please change your password\n"
              +"https://beebottest-9cb31.firebaseapp.com/login/login.html";
  var link = "mailto:"+$('#email').val()+
            // "?cc=beebot500@gmail.com"+
             "?subject=" + escape("e-mail from Beebot-iot By nectec")+
             "&body=" + escape(word);
  window.location.href = link;
}
function GenPassword()
{
  var specials = '!@#$&:|;';
  var lowercase = 'abcdefghijklmnopqrstuvwxyz';
  var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var numbers = '0123456789';
  var all = specials + lowercase + uppercase + numbers;

  var password = '';
  password += specials.pick(1);
  password += lowercase.pick(1);
  password += uppercase.pick(1);
  password += all.pick(8, 10);
  password = password.shuffle();
  return password;
}
String.prototype.pick = function(min, max) {
    var n, chars = '';

    if (typeof max === 'undefined') {
        n = min;
    } else {
        n = min + Math.floor(Math.random() * (max - min + 1));
    }
    for (var i = 0; i < n; i++) {
        chars += this.charAt(Math.floor(Math.random() * this.length));
    }
    return chars;
};
// Credit to @Christoph: http://stackoverflow.com/a/962890/464744
String.prototype.shuffle = function() {
    var array = this.split('');
    var tmp, current, top = array.length;

    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array.join('');
};
