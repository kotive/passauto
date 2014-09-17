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

function keepLetters(data){

	var out = [];

	for (var i = 0; i < data.length; i++) {

		out[i] = data[i].replace(/[^a-zA-Z0-9]+/g, "");
	
	}

	return out;

}

function selectWords(data) {
				
	var words = keepLetters(data);
	var usedWords = [];
	var password = "";
	var minimumLength = 3; //can be changed

	while (!isPasswordStrong(password)) {
				
		var rand = words[Math.floor(Math.random() * words.length)];

		if(usedWords.indexOf(rand) == -1 && rand.length >= minimumLength){

			var password = password + capitaliseFirstLetter(rand);
			usedWords.push(rand);

		}

	}

	console.log("(html)    Output:   " + checkPasswordStrength(password));
	console.log("(boolean) Strong?:  " + isPasswordStrong(password));
	console.log("(string)  Password: " + password);

	$("#suggested_password").html(password);
		
}

function generate(){

	var sections = ["arts",
			"business",
			"dining",
			"fashion",
			"garden",
			"health",
			"magazine",
			"national",
			"nyregion",
			"opinion",
			"politics",
			"realestate",
			"science",
			"sports",
			"technology",
			"travel",					
			"world"];

	var types =    ["mostemailed",
			"mostshared",
			"mostviewed"];

	var key = "c20545b4dc42cab4d83a7ace81ec9ac2:0:69814665";
	var address = "http://api.nytimes.com/svc/mostpopular/v2/" +
		types[Math.floor(Math.random() * (types.length - 1))] + "/" +//randomly select one of the different types
		sections[Math.floor(Math.random() * (sections.length - 1))] + "/1.json?api-key=" + key;

	//address = 'proxy.php?url=' + address;

	$("#suggested_password").html("Loading...");
		
	$.ajax({
		url:		"test.txt",
		cache:		false,
		crossOrigin:	true,
		dataType:	'json',
		success:	function(data){

			var words = data['results'][0]['abstract'].split(' ');
						
			if(words.length == 0){

				generate();

			} else {

				selectWords(words);

			}

		}

	});

}
