function scorePassword(pass) {

  	var score = 0;
  	if (!pass) return score;
  	var letters = new Object();
  	
	for (var i=0; i<pass.length; i++) {
      		
		letters[pass[i]] = (letters[pass[i]] || 0) + 1;
      		score += 5.0 / letters[pass[i]];
  	
	}
  
  	var variations = {
      		
		digits: /\d/.test(pass),
      		lower: /[a-z]/.test(pass),
      		upper: /[A-Z]/.test(pass),
      		nonWords: /\W/.test(pass),
  	
	}
  
  	variationCount = 0;
  	for (var check in variations) variationCount += (variations[check] == true) ? 1 : 0;
  	score += (variationCount - 1) * 10;
  
  	return parseInt(score);

}

function checkPasswordStrength(pass) {

  	var score = scorePassword(pass);
  	if (score > 80) return "<span style='color:green; text-align:right;'>Strong password</span>";
  	if (score > 60) return "<span style='color:orange;'>Average password</span>";
  	if (score >= 30) return "<span style='color:red;'>Weak password</span>";
	return "";

}

function isPasswordStrong(pass) {

	var score = scorePassword(pass);

	if (score > 80) return true;
	return false;

}

function capitaliseFirstLetter(pass){

	return pass[0].toUpperCase() + pass.slice(1);

}
