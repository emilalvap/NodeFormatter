var http = require('http');
var exec = require('child_process').exec;
var formidable = require('C:\\Program Files\\nodejs\\node_modules\\formidable');
var fs = require('fs');
var crypto = require('crypto');
/*
################# FORMATTER SERVER 
*/
const FORMATTER_PORT=9000; 
function handleFormatterRequest(request, response){
    var logError = function(err){
            if(err)console.log(err);
    };
	if(request.method.toLowerCase()=="post"){
        var timestamp = new Date().toLocaleString(); 
        fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt","\n"+timestamp+ ": ### Request received:",logError);
    	var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.maxFieldSize = 10*1024*1024;
        form.parse(request, function (err, fields, files) {
            fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt", "\n# lang = "+fields.lang.toUpperCase()+"\n# file = "+fields.file,logError);
            var fileName = (fields.file != "" && fields.file != "undefined") ? fields.file+"."+fields.lang: crypto.createHash("md5").update(fields.data).digest("hex")+"."+fields.lang;
            fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\files\\", "\n# fileName = "+fileName,logError);
            fs.writeFile("C:\\xampp\\htdocs\\NodeFormatter\\files\\"+fileName, fields.data, function(err) {
       			if(err) 
            		return fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt", "\n# Error writing file:\n"+err,logError);
                else{
                    fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt", "\n# File saved",logError);
                    var cmd = '"C:\\Program Files\\Sublime Text 3\\sublime_text.exe" ./files/'+fileName;

                    exec(cmd, function(error, stdout, stderr) {
                        if(error){
                            return fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt", "\n# Error running sublime: \n"+error+"\n"+stderr,logError);
                        }else{
                            fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt", "\n### Request finished",logError);
                        }
                    });
                }
        	});
        }); 	    
        response.end();
    }else response.end();  
}

/*
################# END FORMATTER SERVER
*/
/*
################# LOG SERVER 
*/
const LOG_PORT=9001; 
function handleLogRequest(request, response){
    var logError = function(err){
            if(err)console.log(err);
    };
    if(request.method.toLowerCase()=="get"){
        fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt", "\nLog display received",logError);
        var cmd = '"C:\\Program Files\\Sublime Text 3\\sublime_text.exe" C:\\xampp\\htdocs\\NodeFormatter\\log.txt';
        exec(cmd, function(error, stdout, stderr) {
            if(error)fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt", error,logError);
        });
        response.end();
    }   
}
/*
################# END LOG
*/

/*
################ KILL NODE SERVER
*/
const KILLER_PORT=10000; 
function handleKillerRequest(request, response){
    var logError = function(err){
            if(err)console.log(err);
    };
    fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt", "\nKill Server received",logError);
	var cmd = 'taskkill /im node.exe';
	exec(cmd, null);
}
/*
################ END KILL NODE SERVER
*/
var logError = function(err){
            if(err)console.log(err);
    };
var formatter = http.createServer(handleFormatterRequest);
formatter.listen(FORMATTER_PORT, function(){
    fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt","\nFormatter Server listening on: http://localhost:"+FORMATTER_PORT,logError);
});
var log = http.createServer(handleLogRequest);
log.listen(LOG_PORT, function(){
    fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt","\nLog Server listening on: http://localhost:"+ LOG_PORT,logError);
});
var killer = http.createServer(handleKillerRequest);
killer.listen(KILLER_PORT, function(){
    fs.appendFile("C:\\xampp\\htdocs\\NodeFormatter\\log.txt","\nKiller Server listening on: http://localhost:"+ KILLER_PORT,logError);
});