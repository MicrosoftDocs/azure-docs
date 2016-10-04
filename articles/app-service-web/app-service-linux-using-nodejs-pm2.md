<properties 
	pageTitle="Using PM2 Configuration for NodeJS in Web Apps on Linux | Microsoft Azure" 
	description="Using PM2 Configuration for NodeJS in Web Apps on Linux" 
	keywords="azure app service, web app, nodejs, pm2, linux, oss"
	services="app-service" 
	documentationCenter="" 
	authors="naziml" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/03/2016" 
	ms.author="naziml"/>

# Using PM2 Configuration for Node.js in Web Apps on Linux

If you set the application stack to Node.js for Web Apps on Linux, you will get the option to set a Node.js startup file as shown in the image below.

![][1]

You can use this to either

-	Specify the startup script for your Node.js app (for example: /bin/server.js)
-	Specify the PM2 configuration file to use for your Node.js app (for example: /foo/process.json)

 >[AZURE.NOTE] If you want your Node processes to automatically restart when certain files are modified, you will need to use PM2 configuration. Otherwise your application will not restart when it receives change notifications from things like continuous deployment when your application code changes.

You can check the Node.js [process file documentation](http://pm2.keymetrics.io/docs/usage/application-declaration/) for all the options, but below is a sample of what you would use as your process.json file

		{
		  "name"        : "worker",
		  "script"      : "/bin/server.js",
		  "instances"   : 1,
		  "merge_logs"  : true,
		  "log_date_format" : "YYYY-MM-DD HH:mm Z",
		  "watch": ["/bin/server.js", "foo.txt"],
		  "watch_options": {
		    "followSymlinks": true,
		    "usePolling"   : true,
		    "interval"    : 5
		  }
		}

Important things to note in this configuration are 

-	The "script" property specifies your application's start script.
-	The "instances" property specifies how many instances of the node process to launch. If you are running your application on larger VM sizes that have multiple cores, you want to maximize your resources by setting a higher value here.
-	The "watch" array specifies all files for whose change you want to restart your node processes.
-	For the "watch_options", you currently need to specify "usePolling" as true because of the way your application content is mounted.


## Next Steps ##

* [What is App Service on Linux?](./app-service-linux-intro.md)

<!--Image references-->
[1]: ./media/app-service-linux-using-nodejs-pm2/nodejs-startup-file.png