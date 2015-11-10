/**
 * Returns a score for the password
 * 
 * @author Hendrik Rust
 * @param pass Password for evaluation
 * @return score The score of the password
 */
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

/**
 * Checks a password's strength based on what score it achieved
 *
 * @author Hendrik Rust
 * @param pass Password for evaluation
 * @return html The strength of the password, formatted in HTML
 */
function checkPasswordStrength(pass) {

  	var score = scorePassword(pass);
  	if (score > 80) return "<span style='color:green; text-align:right;'>Strong password</span>";
  	if (score > 60) return "<span style='color:orange;'>Average password</span>";
  	if (score >= 30) return "<span style='color:red;'>Weak password</span>";
	return "";

}

/**
 * Checks if a password is strong, and then returns a corresponding boolean
 *
 * @author the_DJDJ
 * @param pass Password for evaluation
 * @return boolean A boolean representing whether or not the password is strong
 */
function pass_isPasswordStrong(pass) {
    
	var score = scorePassword(pass);
    
	if (score > 80) return true;
	return false;

}

/**
 * Capitalises the first letter in an array
 *
 * @author the_DJDJ
 * @param pass The array that needs capitalisation
 * @return array The array, with only the first letter capitalised
 */
function pass_capitaliseFirstLetter(pass){
    
	return pass[0].toUpperCase() + pass.slice(1).toLowerCase();

}

/**
 * Filters out all special and non-alphanumeric characters so that only letters and numbers remain
 *
 * @author the_DJDJ
 * @param data The array of letters to be filtered
 * @return out An array of the filtered characters
 */
function pass_keepLetters(data){
    
	var out = [];
    
    	for (var i = 0; i < data.length; i++) if(data[i] != "") out[i] = data[i].replace(/[^a-zA-Z0-9]+/g, "");    
    	return out;
    	
}

/**
 * Chooses a strong password based on an array. Also checks for whether or not there are enough words to form a strong password
 *
 * @author the_DJDJ
 * @param data The array of letters from which a password can be selected
 */
function pass_selectWords(data) {
    	
    	var words = pass_keepLetters(data);
    	var usedWords = [];
    	var password = "";
    	var minimumLength = 4; //can be changed
    	
    	var rand = [];
    	var password = "";
    	var count = 0;

    	while (!pass_isPasswordStrong(password)) {
        	
        	rand = words[Math.floor(Math.random() * words.length)];
        	
        	if(usedWords.indexOf(rand) == -1 && rand.length >= minimumLength){
        		
        		password += pass_capitaliseFirstLetter(rand);
        		usedWords.push(rand);
        		
        	}
        	
        	if(count == words.length) pass_generate();
        	count++;
    	
	}
    
	$("#suggested_password").html("<small><strong>Random password generated for you: </strong><br/>"+password+"<div style=\"float:right\"><a href=\"\" onclick=\"pass_start(); return false;\">reload</a> | <a href=\"\" onclick=\"javascript:pass_alert('"+password+"'); return false;\">copy</a></div></small>");

}

/**
 * Starts the password generation process. Is only it's own method to allow for <code>id='suggested_password'</code> to have two non-password values
 *
 * @author the_DJDJ
 */
function pass_start(){

	$("#suggested_password").html('<small><strong>Random password generated for you: </strong><br/><img src="assets/images/loading.gif"/>&nbsp;&nbsp;Loading...</small>');

	pass_generate();

}

/**
 * Generates a random URL at which to find the resources that are required to generate a password
 *
 * @author the_DJDJ
 */
function pass_generate(){

	var sections = [//"arts",
			"automobiles",
			//"books",
			"business",
			"dining",
			"education",
			//"fashion",
			"garden",
			//"health",
			//"magazine",
			//"movies",
			//"national",
			//"nyregion",
			"obituaries",
			//"opinion",
			"politics",
			"realestate",
			"science",
			"sports",
			"technology",
			//"theater",
			"travel",					
			//"world"
			];

	var types =    ["mostemailed",
			"mostshared",
			"mostviewed"];

	var time =     ["1",
			"7",
			"30"];
			
	var prefix = 'https:';
    	if (window.parent.document.location.protocol != 'https:') prefix = 'http:';

	var key = "c20545b4dc42cab4d83a7ace81ec9ac2:0:69814665";
	var address = prefix + "//api.nytimes.com/svc/mostpopular/v2/" +
		types[Math.floor(Math.random() * types.length)] + "/" +		//randomly select one of the different types
		sections[Math.floor(Math.random() * sections.length)] + "/" +	//randomly select one of the different sections
		time[Math.floor(Math.random() * time.length)] + 		//randomly select the time period (day, week, month)
		".jsonp?api-key=" + key + "&callback=pass_getWords";		//wrap using JSONP and pass_getWords() method
		
	$.ajax({
		
		url:		address,
		cache:		false,
		crossOrigin:	true,
		dataType:	'jsonp',
		success:	function(data){

			pass_getWords(data);

		}

	});

}

/**
 * Converts JSON data into an array of words that can be used to generate the password. Also checks for blank documents
 *
 * @author the_DJDJ
 * @param data The JSON data that needs to be converted
 * @param address The URL at which the data was found, in case that the data is blank
 */
function pass_getWords(data){

	var results = data.results;

	if(results.length == 0) pass_generate();
    	else pass_selectWords(results[Math.floor(Math.random() * data.results.length)].abstract.split(' '));

}

/**
 * Allows a user to quickly copy their password by displaying it in a prompt so that they only have to press CTRL + C
 *
 * @author the_DJDJ
 * @param password The text to display in the prompt box
 */
function pass_alert(password){
	
	prompt("Press CTRL + C to copy your password to your clipboard", password);
	
}
