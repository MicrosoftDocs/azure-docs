<properties 
	pageTitle="Locally debug an API App in Azure App Service" 
	description="Learn how to debug an API App using Visual Studio." 
	services="app-service\api" 
	documentationCenter=".net" 
	authors="tarcher" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-api" 
	ms.workload="web" 
	ms.tgt_pltfrm="dotnet" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/26/2015" 
	ms.author="tarcher"/>

# Locally debug an API App using Visual Studio 2013

## Overview

In this tutorial, you'll debug an API app using Visual Studio 2013. If you are new to the [API app](app-service-api-apps-why-best-platform.md) feature in [Azure App Service](app-service-value-prop-what-is.md), you might want to work through the tutorials that illustrate how to [create](app-service-dotnet-create-api-app.md) and [deploy](app-service-dotnet-deploy-api-app.md) API apps.

[AZURE.INCLUDE [app-service-dotnet-debug-api-app-gen-api-client](../includes/app-service-dotnet-debug-api-app-gen-api-client.md)]

## Locally debug the API app 

Once you have an API app built, you can debug it locally by following these steps:

1. In Visual Studio, open the API app project's *web.config* file. 
 
2. Browse to the [Azure portal](http://portal.azure.com). 

3. In the left nav bar, click **Browse**. 

4. Under **Filter by**, click **API Apps**. 

5. In the **API Apps** blade, click the API app you wish to debug.  

6. In the API app's blade, click the **API app host**.

7. In the API app host's blade, click **All Settings**.

8. In the **Settings** blade, click **Application settings**.

9. In the **Web app settings** blade, scroll down to the **App settings** section.

10. Add the **EMA\_MicroserviceId** key and value (from the **Web app settings** blade) to the *web.config* file's **appSettings** section. The following snippet illustrates how to do this when the **EMA\_MicroserviceId** value is *ContactsListTest*:

		<configuration>
			<appSettings>
				<add key="EMA_MicroserviceId" value="ContactsListTest"/>
				...

11. As you did for the **EMA\_MicroserviceId** key/value pair, add the **EMA\_Secret** and **EMA\_RuntimeUrl** key/value pairs to the web.config file's **appSettings** section.

12. In the Visual Studio **Solution Explorer**, right-click the API app project and select **Properties**.

13. When the project's property pages display, click the **Web** tab on the left.

14. Copy the **Project URL** to the clipboard. It should have a value like *http://localhost:&lt;portNbr>*.

15. Open the console app's *program.cs* file.

16. Locate the call to instantiate the client and modify it to pass in (as its only parameter) the project URL you copied to the clipboard. When finished, your code should look similar to the following (except with your project URL inserted).

        static void Main(string[] args)
        {
            var client = new ContactsListTest(new Uri("<Paste the Project URL here>"));
        	...

17. Place one or more breakpoints in your API app's controller code (in the **Get** and **Post** methods).

18. right-click the console app project and select **Debug > Start new instance** from the project's context menu. Since the console app calls both the controller's **Get** and **Post** methods, code should stop executing once you hit any of your breakpoints, at which point you can debug your code (e.g., examine local variables, step into code, etc.).  

## Next steps

Local debugging for API apps makes it easier to debug issues in your code without having to make roundtrips to and from Azure. Rich diagnostic and debugging data is available right in the Visual Studio IDE for Azure API apps. 

App Service API apps are App Service web apps that have additional features for hosting web services, so you can use the same debugging and troubleshooting tools for API apps that you use for web apps.  For more information, see [Troubleshoot a web app in Azure App Service using Visual Studio](web-sites-dotnet-troubleshoot-visual-studio.md). 

The API app you created in this series is publicly available for anyone to call. For information about how to protect the API app so that only authenticated users can call it, see [Protect an API app: Add Azure Active Directory or social provider authentication](app-service-api-dotnet-add-authentication.md).
