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
        	var res = xhr.response;
        	console.log(res);
          // reload page to reflect new login state
          //window.location.reload();
          var login = doc.querySelector('.login'),
          		logout = doc.querySelector('.logout'),
          		user = doc.querySelector('.user');

          if(login){
          	login.classList.remove('login');
						login.classList.add('logout');
						login.innerHTML = 'Logout';
						user.innerHTML = "Welcome, Subham";
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
	  // Your backend must return HTTP status code 200 to indicate successful
	  // verification of user's email address and it must arrange for the binding
	  // of currentUser to said address when the page is reloaded
	  var xhr = new XMLHttpRequest();
	  xhr.open("POST", "login.php", true);
	  // see http://www.openjs.com/articles/ajax_xmlhttp_using_post.php
	  var param = "assertion="+assertion;
	  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	  //xhr.setRequestHeader("Content-length", param.length);
	  //xhr.setRequestHeader("Connection", "close");
	  xhr.send(param); // for verification by your backend

	  xhr.onreadystatechange = simpleXhrSentinel(xhr); 
	}

	function signoutUser() {
	  // Your backend must return HTTP status code 200 to indicate successful
	  // sign out (usually the resetting of one or more session variables) and
	  // it must arrange for the binding of currentUser to 'null' when the page
	  // is reloaded
	  var xhr = new XMLHttpRequest();
	  xhr.open("GET", "logout.php", true);
	  xhr.send(null);
	  xhr.onreadystatechange = simpleXhrSentinel(xhr); 
	}

// Go!
navigator.id.watch({
  loggedInUser: currentUser,
  onlogin: verifyAssertion,
  onlogout: signoutUser 
});


}(this));