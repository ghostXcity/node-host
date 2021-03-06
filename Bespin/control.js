"define metadata";
({
    "objects": ["commandLine", "editor"],
    "description": "the interface for Node-host",
    "provides": [
	{
	    "ep": "command",
	    "name": "open",
	    "key": "ctrl_o",
	    "pointer": "#openCommand",
	    "description": "Open a file by name",
	    "params": [
		{
		    "name": "file",
		    "type": "text",
		    "description": "file to load"
		}
	    ]
	},
	{
	    "ep": "command",
	    "name": "save",
	    "key": "ctrl_s",
	    "pointer": "#saveCommand",
	    "description": "save the file to the server",
	    "params": [
		{
		    "name": "file",
		    "type": "text",
		    "description": "name to save under"
		}
	    ]
	},
	{
	    "ep": "command",
	    "name": "test",
	    "key": "ctrl_b",
	    "pointer": "#testCommand",
	    "description": "open the current code in a test window",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "new",
	    "key": "ctrl_n",
	    "pointer": "#newCommand",
	    "description": "Make a new file",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "deploy",
	    "pointer": "#deployCommand",
	    "description": "update the running program",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "list",
	    "pointer": "#listCommand",
	    "description": "List of files on the server",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "ls",
	    "pointer": "#listCommand",
	    "description": "List of files on the server",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "logout",
	    "pointer": "#logoutCommand",
	    "description": "Logout",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "login",
	    "key": "ctrl_l",
	    "pointer": "#loginCommand",
	    "description": "Login",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "newuser",
	    "description": "Create a new user",
	    "pointer": "#newUserCommand",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "share",
	    "description": "Share the current file with other using a short url",
	    "pointer": "#shareCommand",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "docs",
	    "description": "Docs for JsApp",
	    "key": "ctrl_h",
	    "pointer": "#docsCommand",
	    "params":[]
	},
	{
	    "ep": "command",
	    "name": "sidebar",
	    "description": "Toggle the showing of the sidebar",
	    "pointer": "#sidebarCommand",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "profile",
	    "description": "Change user, profile and sharing settings",
	    "pointer": "#profileCommand",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "files",
	    "description": "Mangage files",
	    "pointer": "#filesCommand",
	    "params": []
	},
	{
	    "ep": "command",
	    "name": "rm",
	    "pointer": "#deleteCommand",
	    "description": "Delete a file",
	    "params": [
		{
		    "name": "file",
		    "type": "text",
		    "description": "file name to delete"
		}
	    ]
	},
	{
	    "ep": "command",
	    "name": "delete",
	    "pointer": "#deleteCommand",
	    "description": "Delete a file",
	    "params": [
		{
		    "name": "file",
		    "type": "text",
		    "description": "file name to delete"
		}
	    ]
	},
	{
	    "ep": "command",
	    "name": "mv",
	    "pointer": "#renameCommand",
	    "description": "Rename a file",
	    "params": [
		{
		    "name": "file",
		    "type": "text",
		    "description": "current file name"
		},
		{
		    "name": "nfile",
		    "type": "text",
		    "description": "new file name"
		}
	    ]
	},
	{
	    "ep": "command",
	    "name": "rename",
	    "pointer": "#renameCommand",
	    "description": "Rename a file",
	    "params": [
		{
		    "name": "file",
		    "type": "text",
		    "description": "current file name"
		},
		{
		    "name": "nfile",
		    "type": "text",
		    "description": "new file name"
		}
	    ]
	},
	{
	    "ep": "command",
	    "name": "reload_check",
	    "pointer":"#reloadCheck",
	    "params":[],
	    "key": "ctrl_r"
	},
	{
	    "ep": "command",
	    "name": "delete-42-domain",
	    "pointer": "#deleteDomainCommand",
	    "params": [
		{
		    "name": "domain",
		    "type": "text",
		    "description": "Domain to delete"
		}
	    ]
	}
    ]
});
"end";

var discardChanges = "Are you sure that you want to discard all changes";

require('facebox'); // just to load it into jquery

var env = require('environment').env;
var $ = require('jquery').$;

var loadFile="";
var loadValue = env.editor.value;
var fileList=[];
var hostList=[];
var publicList=[];

var userName=null;
var userPass=null;
var userToken=null;
var randomToken=Math.random().toString().substring(2, 6);

function syntax () {
    // check the file name and select a syntax for it
    try {
	var suffix = /\.([a-zA-Z0-9]*)$/.exec(loadFile)[1].toLowerCase();
	try {
	    switch (suffix) {
	    case 'coffee':
		throw "coffee";
	    case 'html':
	    case 'htm':
		throw "html";
	    case 'css':
		throw 'css';
	    default:
		throw "js";
	    }
	}catch(s) {
	    env.editor.syntax=s;
	}
    }catch(e) {
	env.editor.syntax = "js";
    }
}

if(location.hash) {
    switch(location.hash[1]) {
    case 'u':
	var hash = location.hash.substring(2).split(",");
	userToken=hash[0];
	userName=hash[1];
	location.hash="";
	break;
    case 's':
	location.href="/s/"+location.hash.substring(2);
	break;
    }
}
if(location.href.indexOf("/s/")!=-1) {
    env.editor.value = env.editor.value.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
    env.commandLine.execute('goto 1');
    loadFile=location.href.substring(location.href.indexOf("/s/")+3);
    syntax();
}

function track (event) {
    _gaq.push(['_trackEvent', 'editor', event]);
}

exports.openCommand = function (args, request) {
    if(!userToken)  { alert("you need to login for this command"); return request.done("Not logedin"); }
    if(!('file' in args)) {
	env.commandLine.setInput('open ');
	return;
    }
    if(loadValue != env.editor.value)
	if(!confirm(discardChanges)) return;
    loadFile = args['file'];
    syntax();
    Ajax.Call({
	"action": "open",
	"name": loadFile
    }, function (data) {
	if(!data.ok) { alert("File not found"); env.editor.value=""; loadFile="";}
	else env.editor.value=loadValue=data.val;
	if(request.args)
	    request.done(data.ok ? "File opened" : "File not found");
    });
    Ajax.send();
};

exports.saveCommand = function (args, request) {
    if(!userToken)  { alert("you need to login for this command"); return request.done("Not logedin"); }
    if(!loadFile && (!('file' in args) || args['file']=="")) {
	env.commandLine.setInput('save ');
	return;
    }
    var file = args['file'] || loadFile;
    if(!file) return alert("No file name given");
    loadValue=env.editor.value;
    loadFile=file;
    syntax();
    if(loadFile.indexOf("*")!=-1) {loadFile=null;return alert("File name can not containt *");}
    Ajax.Call({
	"action": "save",
	"name": loadFile,
	"val": loadValue
    }, function () {
	if(request.args)
	    request.done("file saved");
    });
    Ajax.send();
    if(fileList.indexOf(loadFile)==-1)
	fileList.push(loadFile);
};

var console_win;

exports.testCommand = function (args, request) {
    // this seems to work with better with popup blockers
    var win = window.open("",""); // we want to get a new window that will grab the focus
    if(typeof console_win == "undefined" || console_win.closed)
	console_win = window.open("http://console.test.jsapp.us:7654", "CONSOLE", "status=0,toolbar=0,location=0,menubar=0,directories=0,width=275,height=500,scrollbars=1");
    Ajax.Call({
	"action": "test",
	"code": env.editor.value,
	"randToken": randomToken,
	"fileName": loadFile
    }, function (p) {
	win.location.href=p;
	win.focus();
	try {
	    setTimeout(function () {
		// this seems to work in chrome and firefox
		console_win.location.href="http://console.test.jsapp.us:7654#"+p;
	    }, 500);
	}catch(e) {}
    });
    Ajax.send();
    track("test");
};

exports.newCommand = function (args, request) {
    if(loadValue != env.editor.value)
	if(!confirm(discardChanges)) return;
    loadValue="";
    env.editor.value = "";
    loadFile = null;
};

var domainLimit=2;
exports.deployCommand = function (args, request) {
    //var saveFile=false;
    if(!userToken)  { alert("you need to login for this command"); return request.done("Not logedin"); }
    if(!loadFile)
	return alert("The file has no name, you must use the save command first to give it a name");
    if(loadValue != env.editor.value) {
	if(confirm("Would you like to save the file before updating")) {
	    loadValue=env.editor.value;
	    Ajax.Call({
		"action": "save",
		"name": loadFile,
		"val": loadValue
	    });
	}
    }
    // stuff here
    $.facebox('<div id="deploy" class="bespin"><select id="deploy-host" style="width:60%"><option value="_">---</option></select><input id="deploy-newHost" type="button" style="width:40%; display: inline;" value="JSApp subomain" /><input id="deploy-altHost" type="button" style="width:40%; display: inline" value="Custom Domain" /><br><br><input id="deploy-button" type="button" style="width:85%; display: inline;" value="Deploy" /></div>');
    var list = $("#deploy-host");
    for(var a=0; a<hostList.length;a++) {
	list.append('<option value="'+hostList[a]+'" >'+hostList[a]+'</option>');
    }
    $("#deploy-altHost").click(function () {
	var name = prompt("You must first CNAME your subdomain to: "+randomToken+"."+userName.replace(/[^a-zA-Z0-9\-]/g, "-")+".host.jsapp.us\n\nIf you do not have a subdomain to CNAME, you can use JSApp subdomain to quickly get started\n\nEnter the subdomain:", "");
	if(!name) return;
	if(hostList.indexOf(name)!=-1) {
	    $("#deploy-host").val(name);
	    return;
	}
	Ajax.Call({
	    "action": "altHost",
	    "name": name
	}, function (data) {
	    if(data.ok) {
		list.append('<option value="'+name+'" >'+name+'</option>');
		hostList.push(name);
		$("#deploy-host").val(name);
	    }else
		alert(data.error);
	});
	Ajax.send();
    });
    $("#deploy-newHost").click(function () {
	if(0>--domainLimit) return alert("You have reached your hourly limit for sub domains");
	var name = prompt("Enter a subhost name\n[name].jsapp.us", ".jsapp.us");
	if(!name) return;
	name = name.replace(/.jsapp.us$/i, "");
	if(/[^a-zA-Z0-9\-]/.exec(name))
	    return alert("Name contains invalid characters");
	if(hostList.indexOf(name)!=-1) {
	    $("#deploy-host").val(name);
	    return;
	}
	Ajax.Call({
	    "action": "newHost",
	    "name": name
	}, function (data) {
	    if(data) {
		list.append('<option value="'+name+'" >'+name+'</option>');
		hostList.push(name);
		$("#deploy-host").val(name);
	    }else
		alert("That name is all ready taken");
	});
	Ajax.send();
	track("new domain")
    });
    $("#deploy-button").click(function () {
	var name = $("#deploy-host").val();
	if(name == "_") return;
	Ajax.Call({
	    "action": "deploy",
	    "name": name,
	    "file": loadFile
	}, function (data) {
	    alert(data);
	});
	Ajax.send();
	track("deploy");
    });
    
};

exports.listCommand = function (args, request) {
    if(!userToken) { alert("you need to login for this command"); return request.done("Not logedin"); }
    if(fileList.length)
	request.done(fileList.join("<br>"));
    else
	request.done("Added files using the save command");
};

exports.logoutCommand = function (args, request) {
    if(loadValue != env.editor.value)
	if(!confirm(discardChanges)) return;
    if(!confirm("Are you sure that you want to logout")) return;
    // this is not needed, but might change and not reload page
    loadFile=userName=userToken=userPass=null;
    env.editor.value=loadValue="Loged out";
    fileList=[];
    
    $.facebox("have a good day");
    Ajax.Call('logout', function () {
	location.reload(false);
    });
    Ajax.send();
};

exports.loginCommand = function (args,request) {
    if(userName !== null) return exports.logoutCommand();
    request.done();
    $.facebox('<div id="login" class="bespin"><p>Live debug console now opens when testing applications, try it out now by pressing Ctrl-b.</p><form action="/newUser" method="post" type="input">User:<input id="userName" name="userName" type="input" style="color:#000; width:90%;"/><br>Password:<input id="password" name="password" type="password" style="color:#000; width: 90%; "/><div id="moreUser" style="display:none;">Password Again:<input id="password2" name="password2" type="password" style="color: #000; width:90%" /><br>Email:<input id="userEmail" name="userEmail" type="input" style="color: #000; width:90%" /><br><a href="https://groups.google.com/group/jsapp-us" target="_blank">Join the mailing list</a></div><br><input value="login" type="button" id="loginButton" style="width:40%; display: inline;" /><input value="new user" type="submit" id="newUserButton" style="width:40%; display:inline;"/></form></div>');
    setTimeout('$("#userName").focus();', 30);
    $("#userName,#password").keypress(function (e) {
	if(e.keyCode == '13') {
	    e.preventDefault();
	    $("#loginButton").click();
	}
    });
    $("#newUserButton").click(function () {
	if($("#moreUser:hidden").show().size()) { 
	    return false;
	}
	if($("#userName").val().length < 2) {
	    alert("Username is to short");
	    return false;
	}
	if(/\\|\//.exec($("#userName").val())) {
	    alert("Username contain invalid characters");
	    return false;
	}
	if(!$("#password").val()) {
	    alert("There is no password entered");
	    return false;
	}
	if($("#password").val() != $("#password2").val()) {
	    $("#password2").val('').focus();
	    alert("Passwords do not match");
	    return false;
	}
	if(!$("#userEmail").val()) {
	    if(!confirm("Email is only used for password reset\nleave it blank?")) return;
	}
	track("new user");
	return true;
    });
    $("#loginButton").click(function () {
	$("#login").fadeTo("slow", .33);
	var user = $("#userName").val();
	var pass = userPass = $("#password").val();
	$.ajax({
	    "url": "/ajax",
	    "type": "POST",
	    "cache": false,
	    "dataType": "json",
	    "data": JSON.stringify({
		"actions": [
		    {
			"action": "login",
			"user": user,
			"pass": pass
		    }
		]
	    }),
	    success: function (data) {
		if(data.data[0].ok != true) {
		    $("#login").fadeTo("slow", 1);
		    alert("login failed");
		    return;
		}
		userName=data.data[0].user;
		userToken=data.data[0].token;
		window.sideBar(false);
		Ajax.Call('list', function(data) {
		    fileList = data[0];
		    hostList = data[1];
		    publicList = data[2];
		    hostList.pop();
		});
		Ajax.send();
		function r () {
		    $("#login").remove();
		    $(document).unbind('afterClose.facebox', r);
		}
		$(document).bind('afterClose.facebox', r);
		$(document).trigger('close.facebox');
		env.editor.focus = true;
		track("login");
	    },
	    complete: function (a,b) {
		if(b == "error") {
		    alert('try again latter');
		}
	    }
	});
    });
};

exports.profileCommand = function (args, request) {
    if(!userToken) { alert("you need to login for this command"); return request.done("Not logedin"); }
    $.facebox('<div id="profile" class="bespin">Loading...</div>');
    Ajax.Call("profile-data", function (data) {
	$("#profile").html('Display name: <input id="Pname" type="input" style="width: 90%; color:#000;"><hr>Email:<input id="Pemail" type="input" style="width: 90%; color: #000;"><hr>Profile: (<a href="/p/'+userName+'" target="_blank">view profile</a>)<br><textarea id="Pprofile" rows="12" style="color: #000; width: 98%;"></textarea><div style="width: 30%;"> </div><input type="button" value="save" id="profileSave" style="width: 95%; display: inline;">');
	
	$("#Pname").val(data.name || userName);
	$("#Pemail").val(data.email);
	$("#Pprofile").val(data.markdown);
	$("#profileSave").click(function () {
	    Ajax.Call({
		"action": "profile-save",
		"name": $("#Pname").val(),
		"email": $("#Pemail").val(),
		"markdown": $("#Pprofile").val()
	    }, function (d) {
		if(d)
		    alert("profile saved");
	    });
	    Ajax.send();
	    track("profile-save");
	});
    });
    Ajax.send();
};

exports.filesCommand = function (args, request) {
    if(!userToken) { alert("you need to login for this command"); return request.done("Not logedin"); }
    $.facebox('<div id="files" class="bespin" style="overflow: auto;"><div id="filesList"></div></div>');
    function generate () {
	var html="<table boarder='1'><tr><td><div style='width: 50%'>Name</div></td><td><div style='width:75px'>Public</div></td><td><div style='width: 75px;'>Delete</div></td><td><div style='width:75px;'>Rename</div></td></tr>";
	for(var a=0;a<fileList.length;a++){
	    html+='<tr><td>'+fileList[a].replace(/\</g, "&lt;").replace(/\>/g, "&gt;")+'</td><td><input style="width: 30px;" class="publicCheck" type="checkbox" class="publicCheck" value="'+fileList[a].replace(/\"\<\>/g, "")+'"></td><td><a href="#_Delete" class="fileDelete" file="'+fileList[a].replace(/\"\<\>/g, "")+'">Delete</a></td><td><a href="#_Rename" class="fileRename" file="'+fileList[a].replace(/\"\<\>/g, "")+'">Rename</a></td></tr>';
	}
	html+="</table>";
	$("#filesList").html(html);
	for(var a=0;a<publicList.length;a++) {
	    $("input.publicCheck[value="+publicList[a].replace(/\"\<\>/g, "")+"]").attr('checked', true);
	}
	$(".publicCheck").click(function () {
	    var list=[];
	    // just re caculate it all and send it to the server
	    $(".publicCheck:checked").each(function () { list.push($(this).attr('value')); });
	    Ajax.Call({
		"action": "public-save",
		"pub": list
	    });
	    Ajax.send();
	    publicList = list;
	});
	$(".fileDelete").click(function () {
	    var name = $(this).attr('file');
	    if(confirm("Are you sure that you want to delete "+name)) {
		Ajax.Call({
		    "action": "delete",
		    "name": name
		});
		Ajax.send();
		fileList.splice(fileList.indexOf(name),1);
		if(publicList.indexOf(name)!=-1)
		    publicList.splice(publicList.indexOf(name),1);
		generate();
	    }
	    return false;
	});
	$(".fileRename").click(function () {
	    var from = $(this).attr('file');
	    var to = prompt("Entere a new file name", from);
	    if(to) {
		Ajax.Call({
		    "action": "rename",
		    "from": from,
		    "to": to
		});
		Ajax.send();
		fileList[fileList.indexOf(from)]=to;
		if(publicList.indexOf(from)!=-1)
		    publicList[publicList.indexOf(from)]=to;
		generate();
	    }
	    return false;
	});
    }
    generate();
};

exports.deleteCommand = function (args, request) {
    if(!userToken)  { alert("you need to login for this command"); return request.done("Not logedin"); }
    if(!('file' in args) || args['file']=="") {
	env.commandLine.setInput('rm ');
	return;
    }
    var name = args['file'];
    if(fileList.indexOf(name)!=-1) {
	Ajax.Call({
	    "action": "delete",
	    "name": name
	}, function (d) {
	    request.done(d ? "File deleted" : "failed to delete");
	    if(d) {
		fileList.splice(fileList.indexOf(name),1);
		if(publicList.indexOf(name)!=-1)
		    publicList.splice(publicList.indexOf(name),1);
	    }
	});
	Ajax.send();
    }else
	request.done("File not found");
};

exports.renameCommand = function (args, request) {
    if(!userToken)  { alert("you need to login for this command"); return request.done("Not logedin"); }
    if(!('file' in args) || args['file']=="" || !('nfile' in args) || args['nfile'] == "") {
	env.commandLine.setInput('mv ');
	return;
    }
    if(fileList.indexOf(args['file']) == -1) return request.done("File not found");
    Ajax.Call({
	"action": "rename",
	"from": args['file'],
	"to": args['nfile']
    }, function (d) {
	request.done(d ? "File renamed" : "failed to rename");
	if(d) {
	    fileList[fileList.indexOf(args['file'])]=args['nfile'];
	    if(publicList.indexOf(args['file'])!=-1)
		publicList[publicList.indexOf(args['file'])]=args['nfile'];
	}
    });
    Ajax.send();
  
};

exports.newUserCommand = function (args, request) {
    exports.loginCommand(args, request);
    $("#newUserButton").click();
};

exports.shareCommand = function (args, request) {
    if(!userToken) { alert("you need to login for this command"); return request.done("Not logedin"); }
    if(!loadFile)
	return alert("The file has no name, you must use the save command first to give it a name");
    if(loadValue != env.editor.value) {
	if(confirm("Would you like to save the file before sharing")) {
	    loadValue=env.editor.value;
	    Ajax.Call({
		"action": "save",
		"name": loadFile,
		"val": loadValue
	    });
	}
    }
    Ajax.Call({
	"action": "share",
	"file": loadFile
    }, function (b) {
	if(b.ok) {
	    request.done('Code shared at: <a href="http://jsapp.us/s/'+b.num+'" target="_blank">http://jsapp.us/s/'+b.num+'</a>');
	    location.hash="s"+b.num;
	}else{
	    request.done("Failed to share code");
	}
	track("share");
    });
    Ajax.send();
};

var deletedDomainAlready=false;
exports.deleteDomainCommand = function (args, request) {
    if(!userToken) { alert("you need to login for this command"); return request.done("Not logedin"); }
    if(!('domain' in args) || args['domain'] == "" || hostList.indexOf(args['domain']) == -1) {
	return request.done("domain name not found, your domains:<br>"+hostList.join("<br>"));
    }
    if(deletedDomainAlready) {
	return request.done("To delete another domain logout and log back in, one domain delete per login");
    }
    var domain=args['domain'];
    if(prompt("To delete "+domain+" enter:\nI "+userName+" want to delete "+domain, "") != "I "+userName+" want to delete "+domain) return request.done("domain was not deleted");
    Ajax.Call({
	"action": "delete-sub-domain",
	"domain": domain
    }, function (b) {
	deletedDomainAlready = b;
	request.done(b ? "Domain was deleted" : "failed to delete domain");
	if(b) {
	    hostList.splice(hostList.indexOf(domain), 1);
	}
    });
    Ajax.send();
    track("delete-domain");
};

exports.docsCommand = function () {
    //window.open("http://wiki.matthewfl.com/jsapp:start");
    window.open("https://github.com/matthewfl/node-host/wiki");
    track("help");
};

exports.sidebarCommand = function () {
    window.sideBar(null);
};

exports.reloadCheck = function () {
    if(confirm("Are you sure that you want to reload the page\nDoing so will log you out"))
	location.reload();
};



var Ajax = {
    docTitle: document.title,
    buffer: [],
    callbacks: [],
    Call: function (data, callback) {
	if(typeof data == "string")
	    data = {"action": data};
	Ajax.buffer.push(data);
	Ajax.callbacks.push(callback || function () {});
    },
    send: function () {
	if(!Ajax.buffer.length) return;
	document.title = "Loading... "+Ajax.docTitle;
	var send = {"actions":Ajax.buffer, "user": userName, "token": userToken};
	var callback=Ajax.callbacks;
	Ajax.buffer=[];
	Ajax.callbacks=[];
	(function (callback, sent) {
	    $.ajax({
		"url": "/ajax",
		"type": "POST",
		"cache": false,
		"dataType": "json",
		"data": JSON.stringify(send),
		success: function (data) {
		    document.title = Ajax.docTitle;
		    if(userName && data.user != userName) {
			userToken = null;
			$.ajax({
			    "url": "/ajax",
			    "type": "POST",
			    "cache": false,
			    "dataType": "json",
			    "data": JSON.stringify({
				"actions": [
				    {
					"action": "login",
					"user": userName,
					"pass": userPass
				    }
				]
			    }),
			    success: function (data) {
				if(!data.data[0].ok) {
				    alert("The server is having a problem with your login\nYou are loged out");
				    userName=userPass=userToken=null;
				    return;
				}
				userName = data.data[0].user;
				userToken = data.data[0].token;
				Ajax.send();
			    }
			});
			Ajax.buffer = sent.concat(Ajax.buffer);
			Ajax.callbacks = callback.concat(Ajax.callbacks);
			return;
		    }
		    for(var i=0;i<callback.length;i++)
			callback[i](data.data[i]);
		}
	    });
	})(callback, send.actions);
    }
};