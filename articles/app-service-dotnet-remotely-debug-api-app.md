<properties 
	pageTitle="Debug an API App in Azure App Service" 
	description="Learn how to debug an API App while it runs in Azure App Service, using Visual Studio." 
	services="app-service\api" 
	documentationCenter=".net" 
	authors="bradygaster" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-api" 
	ms.workload="web" 
	ms.tgt_pltfrm="dotnet" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/26/2015" 
	ms.author="bradyg;tarcher"/>

# Remotely debug an API App in Azure App Service

## Overview

In this tutorial, you'll debug ASP.NET Web API code while it runs in an [API app](app-service-api-apps-why-best-platform.md) in [Azure App Service](app-service-value-prop-what-is.md). The tutorial works with the API app that you [create](app-service-dotnet-create-api-app.md) and [deploy](app-service-dotnet-deploy-api-app.md) in the previous tutorials in this series.

You begin by using Visual Studio's **API App Client** feature to generate client code that calls the deployed API app. Then, you debug the client app and the API app simultaneously, with the API app running live in the cloud.

[AZURE.INCLUDE [app-service-dotnet-debug-api-app-gen-api-client](../includes/app-service-dotnet-debug-api-app-gen-api-client.md)]

## Remotely debug the API app 

Now that the API app and its client are coded and tested, let's see how to debug it.

1. From the Visual Studio **View** menu, select **Server Explorer**. 

2. In the **Server Explorer**, expand the **Azure > App Service** node. 

3. Locate the resource group that you created when you deployed your API app. 

4. Under the resource group, right-click the node for your API app and select **Attach Debugger**. 

	![Attaching debugger](./media/app-service-dotnet-remotely-debug-api-app/08-attach-debugger-v3.png)

	The remote debugger will try to connect. In some cases, you may need to retry clicking **Attach Debugger** to establish a connection, so if it fails, try again.

	![Attaching debugger](./media/app-service-dotnet-remotely-debug-api-app/09-attaching-v3.png)

16. After the connection is established, open the **ContactsController.cs** file in the API App project, and add breakpoints at the `Get` and `Post` methods. They may not appear as active at first, but if the remote debugger is attached, you're ready to debug. 

	![Applying breakpoints to controller](./media/app-service-dotnet-remotely-debug-api-app/10-breakpoints-v3.png)

17. To debug, right-click the console app in **Solution Explorer** and select **Debug** > **Start new instance**. Now, you can debug the API app remotely and the client app locally, and see the entire flow of the data. 

	The following screen shot shows the debugger when it hits the breakpoint for the `Post` method. You can see that the contact data from the client was deserialized into a strongly-typed `Contact` object. 

	![Debugging the local client to hit the API](./media/app-service-dotnet-remotely-debug-api-app/12-debugging-live-v3.png)

## Next steps

Remote debugging for API Apps makes it easier to see how your code is running in Azure App Service. Rich diagnostic and debugging data is available right in the Visual Studio IDE for Azure API apps. 

App Service API apps are App Service web apps that have additional features for hosting web services, so you can use the same debugging and troubleshooting tools for API apps that you use for web apps.  For more information, see [Troubleshoot a web app in Azure App Service using Visual Studio](web-sites-dotnet-troubleshoot-visual-studio.md). 

The API app you created in this series is publicly available for anyone to call. For information about how to protect the API app so that only authenticated users can call it, see [Protect an API app: Add Azure Active Directory or social provider authentication](app-service-api-dotnet-add-authentication.md).
