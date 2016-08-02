<properties 
	pageTitle="How to use io.js with Azure App Service Web Apps" 
	description="Learn how to use a web app in Azure App Service with io.js." 
	services="app-service\web" 
	documentationCenter="nodejs" 
	authors="rmcmurray" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="article" 
	ms.date="06/24/2016"
	ms.author="robmcm" />

# How to use io.js with Azure App Service Web Apps

The popular Node fork [io.js] features various differences to Joyent's Node.js project, including a more open governance model, a faster release cycle and a faster adoption of new and experimental JavaScript features.

While [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) Web Apps has many Node.js versions preinstalled, it also allows for an user-provided Node.js binary. This article discusses two methods enabling the use of io.js on App Service Web Apps: The use of an extended deployment script, which automatically configures Azure to use the latest available io.js version, as well as the manual upload of a io.js binary. 

<a id="deploymentscript"></a>
## Using a Deployment Script

Upon deployment of a Node.js app, App Service Web Apps runs a number of small commands to ensure that the environment is configured properly. Using a deployment script, this process can be customized to include the download and configuration of io.js.

The [io.js Deployment Script](https://github.com/felixrieseberg/iojs-azure) is available on GitHub. To enable io.js on your web app, simply copy **.deployment**, **deploy.cmd** and **IISNode.yml** to the root of your application folder and deploy to Web Apps.  

The first file, **.deployment**, instructs Web Apps to run **deploy.cmd** upon deployment. This script runs all the usual steps for a Node.js application, but also downloads the latest version of io.js. Finally, **IISNode.yml** configures Web Apps to use just the downloaded io.js binary instead of a pre-installed Node.js binary.

> [AZURE.NOTE] To update the used io.js binary, just redeploy your application - the script will download a new version of io.js every single time the application is deployed.

<a id="manualinstallation"></a>
## Using Manual Installation

The manual installation of a custom io.js version includes only two steps. First, download the **win-x64** binary directly from the [io.js distribution]. Required are two files - **iojs.exe** and **iojs.lib**. Save both files to a folder inside your web app, for example in **bin/iojs**.

To configure Web Apps to use **iojs.exe** instead of a pre-installed Node version, create a **IISNode.yml** file at the root of your application and add the following line.

    nodeProcessCommandLine: "D:\home\site\wwwroot\bin\iojs\iojs.exe"

<a id="nextsteps"></a>
## Next Steps

In this article you learned how to use io.js with App Service Web Apps, using both provided deployment scripts as well as manual installation. 

> [AZURE.NOTE] io.js is in heavy development and updated more frequently than Node.js. A number of Node.js modules might not work with io.js - please consult [io.js on GitHub] for troubleshooting.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

[io.js]: https://iojs.org
[io.js distribution]: https://iojs.org/dist/
[io.js on GitHub]: https://github.com/iojs/io.js
[io.js Deployment Script]: https://github.com/felixrieseberg/iojs-azure
 