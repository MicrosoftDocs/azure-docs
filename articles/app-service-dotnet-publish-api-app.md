<properties 
	pageTitle="Deploy an Azure App Service API App" 
	description="Learn how to deploy an API App project to your Azure subscription." 
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
	ms.date="02/19/2015" 
	ms.author="bradyg;tarcher"/>

# Deploy an Azure App Service API App

## Overview

If you're actively developing your own API app using Visual Studio and need to test your API in the cloud, you can create a new API app in your Azure subscription and deploy your code using Visual Studio's convenient App Service deployment features. 

This is the second tutorial in a series of three:

1. In [Create an API App](app-service-dotnet-create-api-app.md) you created an API App project. 
* In this tutorial, you will deploy the API app to your Azure subscription.
* In [Debug an API App](app-service-dotnet-remotely-debug-api-app.md), you will use Visual Studio to remotely debug the code while it runs in Azure.

## Deploy the API app 

In **Solution Explorer**, right-click the project (not the solution) and click **Publish...**. 

![Project publish menu option](./media/app-service-dotnet-deploy-api-app/20-publish-gesture-v3.png)

Click the **Profile** tab and click **Microsoft Azure API Apps (Preview)**. 

![Publish Web dialog](./media/app-service-dotnet-deploy-api-app/21-select-api-apps-for-deployment-v2.png)

Click **New** to provision a new API App in your Azure subscription.

![Select Existing API Services dialog](./media/app-service-dotnet-deploy-api-app/23-publish-to-apiapps-v3.png)

In the **Create an API App** dialog, enter the following:

- Under **API App Name**, enter a name for the app. 
- If you have multiple Azure subscriptions, select the one you want to use.
-Under App Service Plan, select from your existing App Service plans, or select **Create new App Service plan** and enter the name of a new plan. 
- Under **Resource Group**, select from your existing resource groups, or select **Create new resource group** and enter a name. The name must be unique; consider using the app name as a prefix and appending some personal information such as your Microsoft ID (without the @ sign).  
- Under **Access Level**, select **Available to Anyone**. This option will make your API completely public, which is fine for this tutorial. You can restrict access later through the Azure Portal.
- Select a region.  

![Configure Microsoft Azure Web App dialog](./media/app-service-dotnet-deploy-api-app/24-new-api-app-dialog-v3.png)

Click **OK** to create the API App in your subscription. The process can take a few minutes, so Visual Studio shows a dialog notifying you that the process has initiated. 

![API Service Creation Started confirmation message](./media/app-service-dotnet-deploy-api-app/25-api-provisioning-started-v3.png)

The provisioning process creates the resource group and API App in your Azure subscription. Visual Studio shows the progress in the **Azure App Service Activity** window. 

![Status notification via the Azure App Service Activity window](./media/app-service-dotnet-deploy-api-app/26-provisioning-success-v3.png)

Once the API App is provisioned, right-click the project in Solution Explorer and select **Publish** to re-open the publish dialog. The publish profile created in the previous step should be pre-selected. Click **Publish** to begin the deployment process. 

![Deploying the API App](./media/app-service-dotnet-deploy-api-app/26-5-deployment-success-v3.png)

The **Azure App Service Activity** window shows the deployment progress. 

![Status notification of the Azure App Service Activity window](./media/app-service-dotnet-deploy-api-app/26-5-deployment-success-v4.png)

## View the app in the Azure Portal

In this section, you will navigate to the portal to view the basic settings available for API Apps and make iterative changes to your API app. With each deployment, the portal will reflect the changes you're making to your API app. 

In your browser, navigate to the [Azure Portal](https://portal.azure.com). 

Click the **Browse** button on the sidebar and select **API Apps**.

![Browse options on Azure portal](./media/app-service-dotnet-deploy-api-app/27-browse-in-portal-v3.png)

Select the API you created from the list of API apps in your subscription.

![API Apps list](./media/app-service-dotnet-deploy-api-app/28-view-api-list-v3.png)

Click **API Definition**. The app's **API Definition** blade shows the list of API operations that you defined when you created the app. 

![API Definition](./media/app-service-dotnet-deploy-api-app/29-api-definition-v3.png)

Now go back to the project in Visual Studio. Add the following code to the **ContactsController.cs** file.  

	[HttpPost]
	public HttpResponseMessage Post([FromBody] Contact contact)
	{
		// todo: save the contact somewhere
		return Request.CreateResponse(HttpStatusCode.Created);
	}

This code adds a **Post** method that can be used to post new `Contact` instances to the API. 

![Adding the Post method to the controller](./media/app-service-dotnet-deploy-api-app/30-post-method-added-v3.png)

In **Solution Explorer**, right-click the project and select **Publish**. 

![Project Publish context menu](./media/app-service-dotnet-deploy-api-app/31-publish-gesture-v3.png)

Select the **Debug** configuration from **Configuration** drop-down and click **Publish** to redeploy the API app. 

![Publish Web settings](./media/app-service-dotnet-deploy-api-app/36.5-select-debug-option-v3.png)

In the **Preview** tab of the **Publish Web** wizard, click **Publish**.  

![Publish Web dialog](./media/app-service-dotnet-deploy-api-app/39-re-publish-preview-step-v2.png)

Once the publish process has completed, go back to the portal, and close and reopen the **API Definition** blade. You will see the new API endpoint you just created and deployed directly into your Azure subscription.

![API Definition](./media/app-service-dotnet-deploy-api-app/38-portal-with-post-method-v4.png)

## Next steps

You've seen how the direct deployment capabilities in Visual Studio make it easy to iterate and deploy rapidly and test that your API works correctly. In the [next tutorial](app-service-dotnet-remotely-debug-api-app.md), you'll see how to debug your API app while it runs in Azure.


