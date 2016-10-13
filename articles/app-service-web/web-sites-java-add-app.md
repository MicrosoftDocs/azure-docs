<properties 
	pageTitle="Add a Java application to Azure App Service Web Apps" 
	description="This tutorial shows you how to add a page or application to your instance of Azure App Service Web Apps that is already configured to use Java." 
	services="app-service\web" 
	documentationCenter="java" 
	authors="rmcmurray" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="08/11/2016" 
	ms.author="robmcm"/>

# Add a Java application to Azure App Service Web Apps

Once you have initialized your Java web app in [Azure App Service][] as documented at [Create a Java web app in Azure App Service](web-sites-java-get-started.md), you can upload your application by placing your WAR in the **webapps** folder.

The navigation path to the **webapps** folder differs based on how you set up your Web Apps instance.

- If you set up your web app by using the Azure Marketplace, the path to the **webapps** folder is in the form **d:\home\site\wwwroot\bin\application\_server\webapps**, where **application\_server** is the name of the application server in effect for your Web Apps instance. 
- If you set up your web app by using the Azure configuration UI, the path to the **webapps** folder is in the form **d:\home\site\wwwroot\webapps**. 

Note that you can use source control to upload your application or web pages, including [continuous integration scenarios](app-service-continuous-deployment.md). FTP is also an option for uploading your application or web pages.

Note for Tomcat web apps: Once you've uploaded your WAR file to the **webapps** folder, the Tomcat application server will detect that you've added it and will automatically load it. Note that if you copy files (other than WAR files) to the ROOT directory, the application server will need to be restarted before those files are used. The autoload functionality for the Tomcat Java web apps running on Azure is based on a new WAR file being added, or new files or directories added to the **webapps** folder. 

## Next steps

For more information, see the [Java Developer Center](/develop/java/).

[AZURE.INCLUDE [app-service-web-whats-changed](../../includes/app-service-web-whats-changed.md)]

[AZURE.INCLUDE [app-service-web-try-app-service](../../includes/app-service-web-try-app-service.md)]

<!-- External Links -->
[Azure App Service]: http://go.microsoft.com/fwlink/?LinkId=529714
