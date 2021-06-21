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
    $('#showCustomer').show();
    $('#FormCustomer').hide();
    $('#password').val(GenPassword());
    $('#username').text("Welcome, "+localStorage.getItem('username'));
    var user = localStorage.getItem('username');
    findCustomer(user,'OwnerShip','#customerList');
    findCustomer(user,'Partner','#AllcustomerList');
    $('#addCustomer').click(function(){ // when click add customer
      $('#showCustomer').hide();
      $('#FormCustomer').show();
    });
    $('#save').click(function(){ // when click save
        $('#password').val(GenPassword());
        if(validateEmail($('#email').val())) // check validateEmail
        {
          if($('#fullName').val()=="" || $('#Cususername').val()=="" || $('#telephone').val()==""|| $('#email').val()=="" || $('#organize').val()==""|| $('#province').val()=="")
          {
            alert('กรุณากรอกข้อมูลให้ครบค่ะ');
            //setCss('#labelName','color','red','ชื่อ-สกุล <h6>* กรุณากรอกข้อมูลด้วยค่ะ</h6>');
          }
          else {
            insertCustom(localStorage.getItem('username'));
          }
        } //end if
        else {
          alert('อีเมล์ไม่ถูกต้องค่ะ');
        }
    });
  }
  else {
    alert ('กรุณาเข้าสู่ระบบให้ถูกต้องด้วยค่ะ');
    location.href = "../login/login.html";
  }
  });

  function insertCustom(user)
  {
    var day = (new Date().getMonth()+1)+"-"+new Date().getFullYear()+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
    firebase.database().ref('Customer').push().set({
      email: $('#email').val(),
      fullname: $('#fullName').val(),
      level: $('#position').val(),
      organize: $('#organize').val(),
      telephone:$('#telephone').val(),
      province:$('#province').val(),
      username:$('#Cususername').val(),
      password:$('#password').val()
    });
    firebase.database().ref('Partner').push().set({
      CusUser:$('#Cususername').val(),
      compUser:user
    });
    firebase.database().ref('logFile/').push().set({
    activity: "Add New Customer's User: "+$('#Cususername').val(),
    status: "Company",
    username: user,
    timestamp: day
    });
    sendMail();
    alert("บันทึกข้อมูลเรียบร้อยค่ะ");

  }
  function setCss(id,element,parameter,word)
  {
    $(id).css(element,parameter);
    $(id).html(word);
  }
  function findCustomer(user,collection,element)
  {
    var number = 0;
    var actFind = firebase.database().ref(collection).orderByChild('compUser').equalTo(user);
    actFind.once('value',function(snap){
      snap.forEach(function(data){
        if(data.val().CusUser != "null")
        {
            number+=1;
            getCustomer(data.val().CusUser,data.val().SerialNumber,number,element);
        }
      });
      if(element=="#AllcustomerList")
      {
          $('#allPartner').text(snap.numChildren()+" คน ");
      }
      if(number<0)
      {
        $('.table').html('');
      }
    });
  }
  function getCustomer(cusUser,serial,number,element)
  {
    var actUser = firebase.database().ref('Customer').orderByChild('username').equalTo(cusUser);
    actUser.once('value',function(snap){
      snap.forEach(function(data){
        if(element=="#customerList")
        {
          var body = "<tr><td>"+number+"</td><td><a href=\"CusProfile.html?token="+data.key+"\">"+data.val().username+"</a></td><td>"+data.val().email+"</td><td>"+
                      data.val().level+"</td><td>"+serial+"</td></tr>";
        }
        else {
          var body = "<tr><td><a href=\"CusProfile.html?token="+data.key+"\">"+data.val().username+"</a></td><td>"+data.val().email+"</td><td>"+
                      data.val().level+"</td><td>"+data.val().organize+"</td></tr>";
        }
      $(element).prepend(body);
      });
    });
  }
  function validateEmail($email)
  {
    //var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var emailReg = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailReg.test( $email );
  }
  function sendMail()
  {
    var word =  "Username : "+$('#Cususername').val()+"\n"
                +"Password : "+$('#password').val()+"\n"
                +"Level : "+ $('#position').val()+"\n"
                +"First Login, Please change your password\n"
                +"https://beebottest-9cb31.firebaseapp.com/login/login.html";
    var link = "mailto:"+$('#email').val()+
              // "?cc=beebot500@gmail.com"+
               "?subject=" + escape("e-mail from Beebot-iot By nectec")+
               "&body=" + escape(word);
    window.location.href = link;
    //location.href = "../beebot/CustomerList.html";
  }
  function GenPassword()
  {
    //var specials = '!@#$&:|;';
    var lowercase = 'abcdefghijklmnopqrstuvwxyz';
    var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var numbers = '0123456789';
    //var all = specials + lowercase + uppercase + numbers;
    var all = lowercase + uppercase + numbers;
    var password = '';
  //  password += specials.pick(1);
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
