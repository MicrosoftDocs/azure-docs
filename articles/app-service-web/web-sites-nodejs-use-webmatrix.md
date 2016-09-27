<properties 
	pageTitle="Build and deploy a Node.js web app to Azure using WebMatrix" 
	description="A tutorial that teaches you how to use WebMatrix to develop a Node.js application and deploy it to Azure App Service Web Apps." 
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
	ms.date="08/11/2016"
	ms.author="robmcm"/>


# Build and deploy a Node.js web app to Azure using WebMatrix

This tutorial shows you how to use WebMatrix to develop a Node.js application and deploy it to [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) Web Apps. WebMatrix is a free web development tool from Microsoft that includes everything you need for website or web app development. WebMatrix includes several features that make it easy to use Node.js including code completion, pre-built templates, and editor support for Jade, LESS, and CoffeeScript. Learn more about [WebMatrix](https://www.microsoft.com/web/webmatrix/).

Upon completing this guide, you will have a Node.js web app running in Azure App Service.
 
A screenshot of the completed application is below:

![Azure node Web site][webmatrix-node-completed]

[AZURE.INCLUDE [create-account-and-websites-note](../../includes/create-account-and-websites-note.md)]

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Sign into Azure

Follow these steps to create a web app in Azure App Service.

1. Launch WebMatrix
2. If this is the first time you've used WebMatrix, you will be prompted to sign into Azure.  Otherwise, you can click on the **Sign In** button, and choose **Add Account**.  Select to **Sign in** using your Microsoft Account.

	![Add Account][addaccount]

3. If you have signed up for an Azure account, you may log in using your Microsoft Account:

	![Sign into Azure][signin]	


## Create a site using a built in template for Azure

1. On the start screen, click the **New** button, and choose **Template Gallery** to create a new site from the Template Gallery:

	![New site from Template Gallery][sitefromtemplate]

2. In the **Site from Template** dialog, select **Node** and then select **Express Site**. Finally, click **Next**. If you are missing any prerequisites for the **Express Site** template, you will be prompted to install them.

	![select express template][webmatrix-templates]

3. If you are signed into Azure, you now have the option to create an App Service web app for your local site.  Choose a unique name, and select the datacenter where you would like your App Service web app to be created: 

	![Create site on Azure][nodesitefromtemplateazure]
	
4. After WebMatrix finishes building the local site and creating the App Service web app, the WebMatrix IDE is displayed.

	![webmatrix ide][webmatrix-ide]

##Publish your application to Azure

1. In WebMatrix, click **Publish** from the **Home** ribbon to display the **Publish Preview** dialog box for the site.

	![publish preview][webmatrix-node-publishpreview]

2. Click **Continue**. When publishing is complete, the URL for the App Service web app is displayed at the bottom of the WebMatrix IDE

	![publish complete][webmatrix-publish-complete]

3. Click the link to open the App Service web app in your browser.

	![Express web app][webmatrix-node-express-site]

##Modify and republish your application

You can easily modify and republish your application. Here, you will make a simple change to the heading in in the **index.jade** file, and republish the application.

1. In WebMatrix, select **Files**, and then expand the **views** folder. Open the **index.jade** file by double-clicking it.

	![webmatrix viewing index.jade][webmatrix-modify-index]

2. Change the paragraph line to the following:

		p Welcome to #{title} with WebMatrix on Azure!

3. Save your changes, and then click the publish icon. Finally, click **Continue** in the **Publish Preview** dialog and wait for the update to be published.

	![publish preview][webmatrix-republish]

4. When publishing has completed, use the link returned when the publish process is complete to see the updated App Service web app.

	![Azure node web app][webmatrix-node-completed]

##Next steps

To learn more about the versions of Node.js that are provided with Azure and how to specify the version to be used with your application, see [Specifying a Node.js version in an Azure application](../nodejs-specify-node-version-azure-apps.md).

If you encounter problems with your application after it has been deployed to Azure, see [How to debug a Node.js web app in Azure App Service](web-sites-nodejs-debug.md) for information on diagnosing the problem.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

[WebMatrix WebSite]: http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200106398
[WebMatrix for Azure]: http://go.microsoft.com/fwlink/?LinkID=253622&clcid=0x409

[webmatrix-node-completed]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-node-complete.png
[webmatrix-templates]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-templates.png

[webmatrix-node-publishpreview]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-publishpreview.png

[webmatrix-ide]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-ide.png
[webmatrix-publish-complete]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-publish-complete.png
[webmatrix-node-express-site]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-express-webiste.png
[webmatrix-modify-index]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-node-edit.png
[webmatrix-republish]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-republish.png
[addaccount]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-add-account.png
[signin]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-sign-in.png
[sitefromtemplate]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-site-from-template.png
[nodesitefromtemplateazure]: ./media/web-sites-nodejs-use-webmatrix/webmatrix-node-site-azure.png
 