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
	ms.date="06/01/2015" 
	ms.author="bradyg;tarcher"/>

# Debug an API App in Azure App Service

## Overview

In this tutorial, you'll learn how to debug ASP.NET Web API code that is configured to run in an [API app](app-service-api-apps-why-best-platform.md) in [Azure App Service](../app-service/app-service-value-prop-what-is.md). You’ll debug both locally and remotely (while it runs in Azure). The tutorial works with the API app that you [create](app-service-dotnet-create-api-app.md) and [deploy](app-service-dotnet-deploy-api-app.md) in the previous tutorials in this series.

## Debug an API app remotely 

The following steps enable you to debug your API app while it runs in the cloud using the Swagger UI as the test client.

1. In the Visual Studio **Solution Explorer**, right-click the project that you [deployed in the previous tutorial](app-service-dotnet-deploy-api-app.md), and select **Publish**.

	![Publish project](./media/app-service-api-dotnet-debug/rd-publish.png)

2. In the **Publish Web** dialog, select the Settings tab and verify that the **Debug** build configuration is selected. When finished, click **Publish** to push any changes to your Azure subscription.

	![Publish project](./media/app-service-api-dotnet-debug/rd-debug-publish.png)

3. A browser window should open and display a message confirming that your API app has been successfully created.

4. In the browser address bar, add /swagger to the end of the URL and press &lt;Enter>. This will display the Swagger UI client.

	![Swagger UI](./media/app-service-api-dotnet-debug/rd-swagger-ui.png)

5. Return to Visual Studio, and from the **View** menu, select **Server Explorer**. 

6. In **Server Explorer**, expand the **Azure > App Service** node. 

7. Locate the resource group that you created when you deployed your API app. 

8. Under the resource group, right-click the node for your API app and select **Attach Debugger**. 

	![Attaching debugger](./media/app-service-api-dotnet-debug/rd-attach-debugger.png)

	The remote debugger will try to connect. In some cases, you may need to retry clicking **Attach Debugger** to establish a connection, so if it fails, try again.

	![Attaching debugger](./media/app-service-api-dotnet-debug/rd-attaching.png)

9. After the connection is established, open the **ContactsController.cs** file in the API App project, and add breakpoints at the `Get` and `Post` methods. They may not appear as active at first, but if the remote debugger is attached, you're ready to debug. 

	![Applying breakpoints to controller](./media/app-service-api-dotnet-debug/rd-breakpoints.png)

10. Return to the browser session, click the **Get** verb to display the schema for the *Contact* object, and then click **Try it Out**. If you set a breakpoint in the controller's **Get** method, Visual Studio will stop program execution, and you can debug your controller's logic. 

	![Try it out](./media/app-service-api-dotnet-debug/rd-try-it-out.png)

## Debug an API app locally 

There may be times when you want to debug your API app locally; for example, to avoid potentially slow round-trips during your test/debug cycle. The following steps illustrate how to debug your API app locally using the Swagger UI  as the test client.

1. In Visual Studio, open the API app project's *web.config* file. 
 
2. In your browser, navigate to the [Azure preview portal](http://portal.azure.com). 

3. Click the **Browse** button on the sidebar and select **API Apps**. 

	![Browse options on Azure portal](./media/app-service-api-dotnet-debug/ld-browse.png)

4. From the list of API apps in your subscription, select the API app you created.

	![API App List](./media/app-service-api-dotnet-debug/ld-api-app-list.png)

5. In the API app's blade, click the **API app host**.

	![API App Host](./media/app-service-api-dotnet-debug/ld-api-app-blade-api-app-host.png)

6. In the API app host's blade, click **All Settings**.

	![API App Host All Settings](./media/app-service-api-dotnet-debug/ld-api-app-host-all-settings.png)

7. In the **Settings** blade, click **Application settings**.

	![API App Host Application Settings](./media/app-service-api-dotnet-debug/ld-application-settings.png)

8. In the **Web app settings** blade, scroll down to the **App settings** section.

	![API App Host Application Settings for Local Debug](./media/app-service-api-dotnet-debug/ld-app-settings-for-local-debugging.png)

9. From **App settings**, locate each of the following values and add them to the *web.config* file's **appSettings** section.
	- **EMA\_MicroserviceId**
	- **EMA\_Secret**
	- **EMA\_RuntimeUrl**

	When done, the **appSettings** section of your *web.config* should resemble the following screenshot.

	![API App Host Application Settings for Local Debug](./media/app-service-api-dotnet-debug/ld-debug-settings.png)

	**Note:** The *EMA_* values you added to your *web.config* file in this section contain sensitive authorization information. Therefore, it is recommended that you use caution when committing this file into a public source control medium (such as *github*) as these secrets will then be visible to others. See the article, [Best practices for deploying passwords and other sensitive data to ASP.NET and Azure App Service](http://www.asp.net/identity/overview/features-api/best-practices-for-deploying-passwords-and-other-sensitive-data-to-aspnet-and-azure) for more information.   

10. Place one or more breakpoints in your API app's controller code (in the `Get` and `Post` methods).

	![Setting breakpoints](./media/app-service-api-dotnet-debug/ld-breakpoints.png)

11. Click &lt;F5> to start a Visual Studio debugging session. When the browser loads the page, you should see an error message. Add */swagger* to the end of the URL in your browser's address bar and press &lt;Enter>.

12. Once the Swagger UI has loaded, click the **Get** verb on the browser window to display the schema for the Contact object, and then click **Try it Out**. Visual Studio will now stop program execution on the breakpoints you set earlier, and you can debug your controller's logic. 

	![Try it out](./media/app-service-api-dotnet-debug/ld-try-it-out.png)

## Next steps

Remote debugging for API Apps makes it easier to see how your code is running in Azure App Service. Rich diagnostic and debugging data is available right in the Visual Studio IDE for Azure API apps. 

App Service API apps are App Service web apps that have additional features for hosting web services, so you can use the same debugging and troubleshooting tools for API apps that you use for web apps.  For more information, see [Troubleshoot a web app in Azure App Service using Visual Studio](../app-service-web/web-sites-dotnet-troubleshoot-visual-studio.md). 

The API app you created in this series is publicly available for anyone to call. For information about how to protect the API app so that only authenticated users can call it, see [Protect an API app: Add Azure Active Directory or social provider authentication](app-service-api-dotnet-add-authentication.md).
 