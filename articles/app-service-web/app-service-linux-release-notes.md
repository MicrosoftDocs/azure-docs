---
title: Release Notes for Azure App Service Web Apps on Linux | Microsoft Docs
description: Release Notes for Azure App Service Web Apps on Linux.
keywords: azure app service, web app, release, linux, oss
services: app-service
documentationCenter: ''
authors: aelnably
manager: wpickett
editor: ''

ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/09/2017
ms.author: aelnably

---

With the latest updates to our back end we pushed in February 2017, we introduced the following new features and improvements:

## February 2017 Release ##

* Built-in support for Ruby 2.3

## December 2016 Release ##

* Custom docker image support
	* You can set the port used in the custom image by setting the **PORT** app setting
* Docker logs names is now named docker_{InstanceNumber}_out.log / err.log
* Overlapped recycling, no more 500s because of site restarts
* Added PHP XDebug
	* To enable XDebug for your PHP app, just set an appsetting called PHP_ZENDEXTENSIONS with the value xdebug. Your logs will show up in the /home/LogFiles directory 
* Added PHP extensions
	* For full list of added extensions please check http://github.com/appsvc
* All containers running as fakeroot
	
## September 2016 Release 2 ##

* Switching to Ubuntu 16.04 LTS

## September 2016 Release 1 ##

* Application logs will now be dumped to your /home/LogFiles directory
	* They will show up in the /home/LogFiles directory, which is a sibling to the wwwroot directory.  You can use either Kudu or FTP to grab the logs
	* This will be for  both PHP and Node js
	* Application Logs setting for all sites is enabled by default
* NodeJS using PM2 config
	* Add a JSON config file in your content root like

     {
		"name": "worker",
		"script"  : "/bin/server.js",
		"instances"   : 1,
		"merge_logs"  : true,
		"log_date_format" : "YYYY-MM-DD HH:mm Z",
		"watch": ["/bin/server.js", "foo.txt"],
		"watch_options": {
		"followSymlinks": true,
		"usePolling"   : true,
		"interval": 5
		}
	}

	* You can set the number of node instances you want to launch using the "instances" property
	* Set AppCommandLine app setting for your web app to this JSON file, so if this file is called process.json, just set the value of AppCommandLine to process.json
	* The files on whose change you want your node processes to cycle need to be added to the "watch" section
	* You have to use polling for your "watch_options"
* Custom docker image support
	* You can use 4 new app settings to specify a custom image DOCKER_REGISTRY_SERVER_URL, DOCKER_REGISTRY_SERVER_USERNAME, DOCKER_REGISTRY_SERVER_PASSWORD,  DOCKER_CUSTOM_IMAGE_NAME
	* If you are getting an image from dockerhub or some public registry, you can skip the username and password. Otherwise you need to specify them as well
	* The DOCKER_CUSTOM_IMAGE_NAME is where you specify the tag used for the image. We will be downloading the image at runtime on first request to your site at this point in time.

## Next steps
* [Introduction to App Service on Linux](./app-service-linux-intro.md) 
* [What is App Service on Linux?](app-service-linux-intro.md)
* [Creating Web Apps in App Service on Linux](./app-service-linux-how-to-create-a-web-app.md)
