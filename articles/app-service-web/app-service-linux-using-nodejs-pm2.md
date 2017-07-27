---
title: Using PM2 configuration for Node.js in Azure Web App on Linux | Microsoft Docs
description: Using PM2 configuration for Node.js in Azure Web App on Linux
keywords: azure app service, web app, nodejs, pm2, linux, oss
services: app-service
documentationcenter: ''
author: naziml
manager: erikre
editor: ''

ms.assetid: fb420f32-6d74-49c7-992f-0ed5616e66e7
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/16/2017
ms.author: naziml;wesmc

---
# Use PM2 configuration for Node.js in Azure Web App on Linux

[!INCLUDE [app-service-linux-preview](../../includes/app-service-linux-preview.md)]


If you set the application stack to Node.js for Azure Web App on Linux, you get the option to set a Node.js startup file as shown in the following image:

![Set a Node.js startup file][1]

You can use this option to do one of the following tasks:

* Specify the startup script for your Node.js app (for example: /bin/server.js).
* Specify the PM2 configuration file to use for your Node.js app (for example: /foo/process.json).
  
  > [!NOTE]
  > If you want your Node.js processes to restart automatically when certain files are modified, use the PM2 configuration. Otherwise, your application won't restart when it receives change notifications (for example, when your application code changes).
  > 
  > 

You can check the Node.js [process file documentation](http://pm2.keymetrics.io/docs/usage/application-declaration/) for all the options, but following is a sample of what you can use as your process.json file:

        {
          "name"        : "worker",
          "script"      : "/bin/server.js",
          "instances"   : 1,
          "merge_logs"  : true,
          "log_date_format" : "YYYY-MM-DD HH:mm Z",
          "watch": ["/bin/server.js", "foo.txt"],
          "watch_options": {
            "followSymlinks": true,
            "usePolling"   : true,
            "interval"    : 5
          }
        }

Important things to note in this configuration are:

* The "script" property specifies your application's start script.
* The "instances" property specifies how many instances of the node process to launch. If you are running your application on larger VMs that have multiple cores, it's a good idea to maximize your resources by setting a higher value here.
* The "watch" array specifies all files that you want to restart the node process for when they change.
* For the "watch_options", you currently need to specify "usePolling" as true because of the way your application content is mounted.

## Next steps
* [What is Azure Web App on Linux?](app-service-linux-intro.md)
* [Azure App Service Web App on Linux FAQ](app-service-linux-faq.md)

<!--Image references-->
[1]: ./media/app-service-linux-using-nodejs-pm2/nodejs-startup-file.png
