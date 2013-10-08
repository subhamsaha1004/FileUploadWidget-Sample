(function(window){
	var doc = window.document;

	var userWrapper = doc.querySelector('.userWrapper');
			currentUser = null;

	document.addEventListener('click', function(e){
		var elem = e.target;
		if(elem.classList.contains('login')){
			navigator.id.request();
		} else if (elem.classList.contains('logout')){
			navigator.id.logout();
		}
	}, false);

	function simpleXhrSentinel(xhr) {
    return function() {
	    if (xhr.readyState == 4) {
        if (xhr.status == 200){
        	var res = JSON.parse(xhr.response);
        	console.log(res);
          // reload page to reflect new login state
          //window.location.reload();
          var login = doc.querySelector('.login'),
          		logout = doc.querySelector('.logout'),
          		user = doc.querySelector('.user');

          currentUser = (res.result && res.result.email) ? res.result.email : "subham.saha1004@gmail.com";

          if(login){
          	login.classList.remove('login');
						login.classList.add('logout');
						login.innerHTML = 'Logout';
						user.innerHTML = "Welcome, <strong>" + currentUser + '</strong>';
          } else {
          	logout.classList.remove('logout');
						logout.classList.add('login');
						logout.innerHTML = 'Login';
						user.innerHTML = "";
          }
        } else {
          navigator.id.logout();
          console.log("XMLHttpRequest error: " + xhr.status); 
        } 
      } 
    } 
  }

	function verifyAssertion(assertion) {
	  // Your backend must return HTTP status code 200 to indicate successfulverification of user's email address and it must arrange for the binding of currentUser to said address when the page is reloaded
	  var xhr = new XMLHttpRequest();
	  xhr.open("POST", "php/auth.php", true);
	  var param = "assertion="+assertion;
	  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	  //xhr.setRequestHeader("Content-length", param.length);
	  //xhr.setRequestHeader("Connection", "close");
	  xhr.send(encodeURI(param)); // for verification by your backend

	  xhr.onreadystatechange = simpleXhrSentinel(xhr); 
	}

	function signoutUser() {
	  // Your backend must return HTTP status code 200 to indicate successful
	  // sign out (usually the resetting of one or more session variables) and
	  // it must arrange for the binding of currentUser to 'null' when the page
	  // is reloaded
	  var xhr = new XMLHttpRequest();
	  xhr.open("POST", "php/auth.php", true);
	  var param = "logout=1";
	  xhr.send(param);
	  xhr.onreadystatechange = simpleXhrSentinel(xhr); 
	}

// Go!
navigator.id.watch({
  loggedInUser: currentUser,
  onlogin: verifyAssertion,
  onlogout: signoutUser 
});


}(this));