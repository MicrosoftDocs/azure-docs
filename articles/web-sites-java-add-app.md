<properties 
	pageTitle="Add a Java application to Azure App Service Web Apps" 
	description="This tutorial shows you how to add a page or application to your instance of Azure App Service Web Apps that is already configured to use Java." 
	services="app-service\web" 
	documentationCenter="java" 
	authors="rmcmurray" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="04/21/2015" 
	ms.author="robmcm"/>

# Add a Java application to Azure App Service Web Apps

Once you have initialized your Java web app in [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) as documented at [Create a Java web app in Azure App Service](web-sites-java-get-started.md), you can upload your application by placing your WAR in the **webapps** folder.

The navigation path to the **webapps** folder differs based on how you set up your Web Apps instance.

- If you set up your web app by using the Azure Marketplace, the path to the **webapps** folder is in the form **d:\home\site\wwwroot\bin\application\_server\webapps**, where **application\_server** is the name of the application server in effect for your Web Apps instance. 
- If you set up your web app by using the Azure configuration UI, the path to the **webapps** folder is in the form **d:\home\site\wwwroot\webapps**. 

Note that you can use source control to upload your application or web pages, including continuous integration scenarios. Instructions for using source control with your web app are available at [Continuous deployment using GIT in Azure App Service](web-sites-publish-source-control.md). FTP is also an option for uploading your application or web pages.

Note for Tomcat web apps: Once you've uploaded your WAR file to the **webapps** folder, the Tomcat application server will detect that you've added it and will automatically load it. Note that if you copy files (other than WAR files) to the ROOT directory, the application server will need to be restarted before those files are used. The autoload functionality for the Tomcat Java web apps running on Azure is based on a new WAR file being added, or new files or directories added to the **webapps** folder. 

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.
