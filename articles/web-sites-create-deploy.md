<properties
	pageTitle="How to create a web app - Azure service management"
	description="Learn how to create a web app using the Azure Portal."
	services="app-service\web"
	documentationCenter=""
	authors="cephalin"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="app-service-web"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/24/2015"
	ms.author="cephalin"/>

#How to Create a web app

This topic shows how to create a web app from the gallery or by using the Azure Portal.

For information about how to deploy your content to a web app that you have created, see the **Deploy** section in [Azure Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714).

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

##<a name="createawebsiteportal"></a>How to: Create a web app Using the Azure Portal

Follow these steps to create a web app in Azure.

1. Login to the [Azure Portal](http://go.microsoft.com/fwlink/?LinkId=529715).

2. Click the **New** icon on the bottom left of the Azure Portal.

3. Click the **Web + Mobile** icon, click the **Web App** icon, enter a value for URL and then click **Create** on the bottom right corner of the create blade.

4. When the web app has been created, you will see the text **Deployment to resource group <resouce group name> was successful**.

5. In the portal, click the name of the web app displayed in the list of web apps to open the web app's blade.

6. On the blade, you are provided with options to get web app development tools, set up publishing for your web app, or set up deployment from a source control provider like TFS or Git. FTP publishing is set up by default for web apps and the FTP Host name is displayed in the **Essentials** section of the web app blade. Before publishing with FTP or Git, choose the option to **Reset publish profile** on the web app blade so that you can authenticate against the FTP Host or the Git Repository when deploying content to your web app.

7. The **Settings** blade exposes settings for your web app, such as:

	- version of .NET, PHP, Java, or Python for your web app
	- edit in Visual Studio Online
	- SSL bindings
	- custom domain names
	- authentication/authorization
	- application and site diagnostics
	- monitoring endpoints
	- logging options
	- app settings for the Azure environment (overriding <appSettings> in your development environment's Web.config, for example)
	- connection strings (overriding <connectionStrings> in your development environment's Web.config, for example)
	- script processors for specific file extensions like *.php

##<a name="howtocreatefromgallery"></a> How to: Create a web app from the Gallery

[AZURE.INCLUDE [website-from-gallery](../includes/website-from-gallery.md)]

##<a name="deleteawebsite"></a> How to: Delete a web app
Web Apps are deleted using the **Delete** icon in the Azure Portal. The **Delete** icon is available on the top the web app blade.

##<a name="nextsteps"></a> Next Steps

For more information, see [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714).

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)
