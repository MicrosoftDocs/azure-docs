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
	ms.date="10/08/2015" 
	ms.author="tdykstra"/>

# Debug an API App in Azure App Service

## Overview

In this tutorial, you debug ASP.NET Web API code that is configured to run in an [API app](app-service-api-apps-why-best-platform.md) in [Azure App Service](../app-service/app-service-value-prop-what-is.md). You debug the code while it is running locally and while it runs remotely in Azure. 

The tutorial works with the API app that you [create](app-service-dotnet-create-api-app.md) and [deploy](app-service-dotnet-deploy-api-app.md) in the previous tutorials in this series.

## Debug an API app remotely 

To enable remote debugging, you have to deploy a debug build to Azure.

1. In the Visual Studio **Solution Explorer**, right-click the project that you deployed in [the previous tutorial](app-service-dotnet-deploy-api-app.md), and select **Publish**.

2. In the **Publish Web** dialog, select the **Settings** tab and select the **Debug** build configuration.

4. Click **Publish**.

	![Publish project](./media/app-service-api-dotnet-debug/rd-debug-publish.png)

	A browser window opens to the base URL of your API app.

4. In the browser address bar, add /swagger to the end of the URL and press Enter. 

	This step assumes that you enabled the Swagger UI as directed in the [create](app-service-dotnet-create-api-app.md) tutorial.

	![Swagger UI](./media/app-service-api-dotnet-debug/rd-swagger-ui.png)

5. Return to Visual Studio, and click from **View > Server Explorer**. 

6. In **Server Explorer**, expand the **Azure > App Service** node. 

7. Locate the resource group that you created or selected when you deployed your API app. 

8. Under the resource group, right-click the node for your API app and select **Attach Debugger**. 

	![Attaching debugger](./media/app-service-api-dotnet-debug/rd-attach-debugger.png)

	The remote debugger will try to connect. In some cases, you may need to retry clicking **Attach Debugger** to establish a connection, so if it fails, try again.

	![Attaching debugger](./media/app-service-api-dotnet-debug/rd-attaching.png)

9. After the connection is established, open the **ContactsController.cs** file in the API App project, and add a breakpoint in the `Get` method.

	![Applying breakpoints to controller](./media/app-service-api-dotnet-debug/rd-breakpoints.png)

10. Return to the browser session, click the **Get** verb to display the schema for the *Contact* object, and then click **Try it Out**. Visual Studio stops program execution at your breakpoint, and you can debug your controller's logic. 

	![Try it out](./media/app-service-api-dotnet-debug/rd-try-it-out.png)

## Debug an API app locally 

There may be times when you want to debug your API app locally; for example, if round-trips to the Azure server make debugging slow. This section illustrates how to debug your API app locally using the Swagger UI  as the test client.

2. In your browser, navigate to the [Azure preview portal](https://portal.azure.com). 

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

1. In Visual Studio, open the API app project's *web.config* file. 

9. From **App settings**, add each of the following keys and values to the *web.config* file's **appSettings** section.
	- **EMA\_MicroserviceId**
	- **EMA\_Secret**
	- **EMA\_RuntimeUrl**

	When you're done, the **appSettings** section of your *web.config* should resemble the following screenshot.

	![API App Host Application Settings for Local Debug](./media/app-service-api-dotnet-debug/ld-debug-settings.png)

	**Note:** The *EMA_* values you added to your *web.config* file in this section contain sensitive authorization information. Therefore, it is recommended that you avoid saving these values in a public source control repository. For more information, see [Best practices for deploying passwords and other sensitive data to ASP.NET and Azure App Service](http://www.asp.net/identity/overview/features-api/best-practices-for-deploying-passwords-and-other-sensitive-data-to-aspnet-and-azure).   

10. Place a breakpoint in your API app's controller code in the `Get` method.

11. Press F5 to start a Visual Studio debugging session.
 
13.  If the API app's access level is set to **Public (anonymous)**, you can use the Swagger UI page to test.

	* When the browser loads the page, you see an HTTP 403 error page. Add */swagger* to the end of the URL in your browser's address bar and press Enter.

	* Once the Swagger UI has loaded, click the **Get** verb on the browser window to display the schema for the Contact object, and then click **Try it Out**.

		Visual Studio stops program execution on your breakpoint, and you can debug your controller's logic. 

14.	If the API app's access level is set to **Public (authenticated)**, you'll need to authenticate and use a browser tool following the procedures shown in [Protect an API app](app-service-api-dotnet-add-authentication.md#use-postman-to-send-a-post-request) for a Post request, that is:

	* Go to the gateway login URL and enter credentials to log in.
	* Get the Zumo token value from the x-zumo-auth cookie.
	* Add an x-zumo-auth header to your request, and set its value to the x-zumo-auth cookie value.
	* Submit the request.

	**Note:** When you're running locally, Azure cannot control access to the API app to ensure that only authenticated users can execute its methods. When you run in Azure, all traffic intended for the API app is routed through the gateway, and the gateway doesn't pass on unauthenticated requests. There is no redirection when you run locally, which means that unauthenticated requests are not prevented from accessing the API app.  The value of authenticating as described above is that you can successfully execute authentication-related code in the API app, such as code that retrieves information about the logged-on user. For more information about how the gateway handles authentication for API apps, see [Authentication for API apps and mobile apps](../app-service/app-service-authentication-overview.md#azure-app-service-gateway).

## Next steps

In this tutorial, you've seen how to debug API Apps. 

For more troubleshooting information, see [Troubleshoot a web app in Azure App Service using Visual Studio](../app-service-web/web-sites-dotnet-troubleshoot-visual-studio.md). Because API apps are web apps that have additional features for hosting web services, you can use the same debugging and troubleshooting tools for API apps that you use for web apps.    

For information about API Apps features, see [What are API apps?](app-service-api-apps-why-best-platform.md).

For information about how to develop, deploy, and consume API apps, see the entries in the table of contents that appears on the left (for wide browser windows) or in a expandable section at the top (for narrow browser windows).

For information about authenticating users of API apps, see [Authentication for API apps and mobile apps in Azure App Service](../app-service/app-service-authentication-overview.md).