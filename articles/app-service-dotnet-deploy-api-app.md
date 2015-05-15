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

In this tutorial, you'll deploy the Web API project that you created in the [previous tutorial](app-service-dotnet-create-api-app.md) to a new [API app](app-service-api-apps-why-best-platform.md). You'll use Visual Studio to create the API app resource in [Azure App Service](app-service-value-prop-what-is.md) and to deploy your Web API code to the Azure API app. 

### Other deployment options

There are many other ways to deploy API apps. An API app is a [web app](app-service-web-overview.md) with extra features for hosting web services, and all of the [the deployment methods that are available for web apps](web-sites-deploy.md) can also be used with API apps. The web app that hosts an API app is called the API app host in the Azure preview portal, and you can configure deployment by using the API app host portal blade. For information about the API app host blade, see [Manage an API app](app-service-api-manage-in-portal.md).

The fact that API apps are based on web apps also means that you can deploy code written for platforms other than ASP.NET to API apps. For an example that uses Git to deploy Node.js code to an API app, see [Create a Node.js API app in Azure App Service](app-service-api-nodejs-api-app.md).
 
## Deploy the API app 

In this section, you'll see the steps required to deploy an API app to an Azure subscription. 

1. In **Solution Explorer**, right-click the project (not the solution) and click **Publish...**. 

	![Project publish menu option](./media/app-service-dotnet-deploy-api-app/20-publish-gesture-v3.png)

2. Click the **Profile** tab and click **Microsoft Azure API Apps (Preview)**. 

	![Publish Web dialog](./media/app-service-dotnet-deploy-api-app/21-select-api-apps-for-deployment-v2.png)

3. Click **New** to provision a new API App in your Azure subscription.

	![Select Existing API Services dialog](./media/app-service-dotnet-deploy-api-app/23-publish-to-apiapps-v3.png)

4. In the **Create an API App** dialog, enter the following:

	- For **API App Name**, enter ContactsList. 
	- If you have multiple Azure subscriptions, select the one you want to use.
	- For **App Service Plan**, select from your existing App Service plans, or select **Create new App Service plan** and enter the name of a new plan. 
	- For **Resource Group**, select from your existing resource groups, or select **Create new resource group** and enter a name. The name must be unique; consider using the app name as a prefix and appending some personal information such as your Microsoft ID (without the @ sign).  
	- For **Access Level**, select **Available to Anyone**. This option will make your API completely public, which is fine for this tutorial. You can restrict access later through the Azure preview portal.
	- For **Region**, select a region close to you.  

	![Configure Microsoft Azure Web App dialog](./media/app-service-dotnet-deploy-api-app/24-new-api-app-dialog-v3.png)

5. Click **OK** to create the API App in your subscription. As this process can take a few minutes, Visual Studio displays a confirmation dialog.  

	![API Service Creation Started confirmation message](./media/app-service-dotnet-deploy-api-app/25-api-provisioning-started-v3.png)

6. Click **OK** on the confirmation dialog. The provisioning process creates the resource group and API App in your Azure subscription. Visual Studio shows the progress in the **Azure App Service Activity** window. 

	![Status notification via the Azure App Service Activity window](./media/app-service-dotnet-deploy-api-app/26-provisioning-success-v3.png)

7. Once the API App is provisioned, right-click the project in **Solution Explorer** and select **Publish** to re-open the publish dialog. The publish profile created in the previous step should be pre-selected. Click **Publish** to begin the deployment process. 

	![Deploying the API App](./media/app-service-dotnet-deploy-api-app/26-5-deployment-success-v3.png)

The **Azure App Service Activity** window shows the deployment progress. 

![Status notification of the Azure App Service Activity window](./media/app-service-dotnet-deploy-api-app/26-5-deployment-success-v4.png)

## View the app in the Azure preview portal

In this section, you will navigate to the portal to view the basic settings available for API Apps and make iterative changes to your API app. With each deployment, the portal will reflect the changes you're making to your API app. 

1. In your browser, navigate to the [Azure preview portal](https://portal.azure.com). 

2. Click the **Browse** button on the sidebar and select **API Apps**.

	![Browse options on Azure portal](./media/app-service-dotnet-deploy-api-app/27-browse-in-portal-v3.png)

3. From the list of API apps in your subscription, select the API you created.

	![API Apps list](./media/app-service-dotnet-deploy-api-app/28-view-api-list-v3.png)

4. Click **API Definition**. The app's **API Definition** blade shows the list of API operations that you defined when you created the app. 

	![API Definition](./media/app-service-dotnet-deploy-api-app/29-api-definition-v3.png)

5. Now, go back to the project in Visual Studio and add the following code to the **ContactsController.cs** file. This code adds a **Post** method that can be used to post new `Contact` instances to the API.  

		[HttpPost]
		public HttpResponseMessage Post([FromBody] Contact contact)
		{
			// todo: save the contact somewhere
			return Request.CreateResponse(HttpStatusCode.Created);
		}

	![Adding the Post method to the controller](./media/app-service-dotnet-deploy-api-app/30-post-method-added-v3.png)

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

You've seen how the direct deployment capabilities in Visual Studio make it easy to iterate and deploy rapidly and test that your API works correctly. In the [next tutorial](app-service-dotnet-remotely-debug-api-app.md), you'll see how to debug your API app while it runs in Azure.
