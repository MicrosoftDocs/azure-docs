<properties 
	pageTitle="Deploy an API app in Azure App Service " 
	description="Learn how to deploy an API app project to your Azure subscription." 
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
	ms.date="05/04/2015" 
	ms.author="bradyg;tarcher"/>

# Deploy an API app in Azure App Service 

## Overview

In this tutorial, you'll deploy the Web API project that you created in the [previous tutorial](app-service-dotnet-create-api-app.md) to a new [API app](app-service-api-apps-why-best-platform.md). You'll use Visual Studio to create the API app resource in [Azure App Service](../app-service/app-service-value-prop-what-is.md) and to deploy your Web API code to the Azure API app. 

### Other deployment options

There are many other ways to deploy API apps. An API app is a [web app](../app-service-web/app-service-web-overview.md) with extra features for hosting web services, and all of the [the deployment methods that are available for web apps](../app-service-web/web-sites-deploy.md) can also be used with API apps. The web app that hosts an API app is called the API app host in the Azure preview portal, and you can configure deployment by using the API app host portal blade. For information about the API app host blade, see [Manage an API app](app-service-api-manage-in-portal.md).

The fact that API apps are based on web apps also means that you can deploy code written for platforms other than ASP.NET to API apps. For an example that uses Git to deploy Node.js code to an API app, see [Create a Node.js API app in Azure App Service](app-service-api-nodejs-api-app.md).
 
## <a id="provision"></a>Create the API app in Azure 

In this section, you use the Visual Studio **Publish Web** wizard to create an API app in Azure. Where the instructions direct you to enter a name for the API app, enter *ContactsList*.

[AZURE.INCLUDE [app-service-api-pub-web-create](../../includes/app-service-api-pub-web-create.md)]

## <a id="deploy"></a>Deploy your code to the new API app

You use the same **Publish Web** wizard to deploy your code to the new API app.

[AZURE.INCLUDE [app-service-api-pub-web-deploy](../../includes/app-service-api-pub-web-deploy.md)]

## View the app in the Azure preview portal

In this section, you view the basic settings available for API Apps in the portal and make iterative changes to your API app. With each deployment, the portal reflects the changes you're making to your API app. 

1. In the [Azure preview portal](https://portal.azure.com), go to the **API app** blade for the API app that you deployed.

4. Click **API Definition**. 
 
	The app's **API Definition** blade shows the list of API operations that you defined when you created the app. 

	![API Definition](./media/app-service-dotnet-deploy-api-app/29-api-definition-v3.png)

5. Now, go back to the project in Visual Studio and add the following code to the **ContactsController.cs** file.   

		[HttpPost]
		public HttpResponseMessage Post([FromBody] Contact contact)
		{
			// todo: save the contact somewhere
			return Request.CreateResponse(HttpStatusCode.Created);
		}

	![Adding the Post method to the controller](./media/app-service-dotnet-deploy-api-app/30-post-method-added-v3.png)

	This code adds a **Post** method that can be used to post new `Contact` instances to the API.

6. In **Solution Explorer**, right-click the project and select **Publish**. 

	![Project Publish context menu](./media/app-service-dotnet-deploy-api-app/31-publish-gesture-v3.png)

7. Click the **Settings** tab. 

8. From the **Configuration** drop-down, select **Debug**. 

	![Publish Web settings](./media/app-service-dotnet-deploy-api-app/36.5-select-debug-option-v3.png)

9. Click the **Preview** tab

10. Click **Start Preview** to view the changes that will be made.  

	![Publish Web dialog](./media/app-service-dotnet-deploy-api-app/39-re-publish-preview-step-v2.png)

11. Click **Publish**.

12. Once the publish process has completed, go back to the portal, and close and reopen the **API Definition** blade. You will see the new API endpoint you just created and deployed directly into your Azure subscription.

	![API Definition](./media/app-service-dotnet-deploy-api-app/38-portal-with-post-method-v4.png)

## Next steps

You've seen how the direct deployment capabilities in Visual Studio make it easy to iterate and deploy rapidly and test that your API works correctly. In the [next tutorial](../app-service-dotnet-remotely-debug-api-app.md), you'll see how to debug your API app while it runs in Azure.
 
