<properties 
	pageTitle="How to Create a Web App with App Service on Linux | Microsoft Azure" 
	description="Web app creation workflow for App Service on Linux." 
	keywords="azure app service, web app, linux, oss"
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
	ms.date="10/10/2016" 
	ms.author="naziml"/>

# Create a Web App with App Service on Linux

## Using the Management Portal to create your web app
You can start creating your Web App on Linux from the [management portal](https://portal.azure.com) as shown in the image below.

![][1]

Once you select the option below, you will be shown the Create blade as shown in the image below. 

![][2]

-	Give your web app a name.
-	Choose an existing Resource Group or create a new one. (See regions available in the [limitations section](./app-service-linux-intro.md)).
-	Choose an existing app service plan or create a new one (See app service plan notes in the [limitations section](./app-service-linux-intro.md)). 
-	Choose the application stack you intend to use. You will get to choose between several versions of Node.js and PHP. 

Once you have the app created, you can change the application stack from the application settings as shown in the image below.

![][3]

## Deploying your web app

Choosing "deployment options" from the management portal gives you the option to use local a Git repository or a GitHub repository to deploy your application. The instructions thereafter are similarly to a non-Linux web app and you can follow the instructions in either our [local Git deployment](./app-service-deploy-local-git.md) or our [continuous deployment](./app-service-continuous-deployment.md) article for GitHub.

You can also use FTP to upload your application to your site. You can get the FTP endpoint for your web app from the diagnostics logs section as shown in the image below.

![][4]


## Next Steps ##

* [What is App Service on Linux?](./app-service-linux-intro.md)
* [Using PM2 Configuration for Node.js in Web Apps on Linux](./app-service-linux-using-nodejs-pm2.md)

<!--Image references-->
[1]: ./media/app-service-linux-how-to-create-a-web-app/top-level-create.png
[2]: ./media/app-service-linux-how-to-create-a-web-app/create-blade.png
[3]: ./media/app-service-linux-how-to-create-a-web-app/application-settings-change-stack.png
[4]: ./media/app-service-linux-how-to-create-a-web-app/diagnostic-logs-ftp.png
