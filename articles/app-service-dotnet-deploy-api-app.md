<properties 
	pageTitle="Deploy an Azure API App" 
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

# Deploy an Azure API App

## Overview

If you're actively developing your own Azure API App using Visual Studio and you're not yet ready to publish your API in the Marketplace, you can provision a new API App in your Azure subscription and deploy your code directly to the cloud using Visual Studio's convenient Azure API App Deployment feature. 

This is the third tutorial in a series of four:

1. In [Create an API App](../app-service-dotnet-create-api-app/) you create a Web API project and prepare it to be published as an API App in the Azure API Marketplace.
* In [Publish an API App](../app-service-dotnet-publish-api-app/) you publish the API app you created to the Marketplace, where other application developers can find it and use it in their APIs.
* In this tutorial you deploy the API app you created to your Azure subscription.
* In [Debug an API App](../app-service-dotnet-remotely-debug-api-app/) you use Visual Studio to remotely debug the code while it runs in Azure.

## Deploy the API App 

1. In **Solution Explorer**, right-click the project (not the solution), and then click **Publish...**. 

	![Project publish menu option](./media/app-service-dotnet-deploy-api-app/20-publish-gesture-v2.png)

2. If the **Publish Web** dialog opens on the **Preview** tab, click the **Profile** tab.

2. Click **Microsoft Azure API Apps**. 

	![Publish Web dialog](./media/app-service-dotnet-deploy-api-app/21-select-api-apps-for-deployment.png)

3. Click **New** to provision a new API App in your Azure subscription.

	![Select Existing API Services dialog](./media/app-service-dotnet-deploy-api-app/23-publish-to-apiapps-v2.png)

5. For the **API Name**, provide the name of the API App you'd like to have in your Azure subscription. 

7. Enter a name for the **Resource Group**. This name must be unique; consider using the **API Name** as a prefix and appending some personal information such as your Microsoft ID (without the @ sign).  

9. If you have multiple Azure subscriptions, select the one you want to use.

11. Select the **Access Level** labeled **Available to Anyone** to make your API completely public. You can change this later using the Azure portal if you want to restrict access to your API.

13. Specify the **US East** region.  

	![Configure Microsoft Azure Web App dialog](./media/app-service-dotnet-deploy-api-app/24-new-api-app-dialog-v2.png)

6. Once you have provided the settings for your new Azure API App and resource group, click **OK** to create the API App in your subscription.

	This process may take a few seconds, so you'll be provided with a dialog notifying you that the process has initiated. 

	![API Service Creation Started confirmation message](./media/app-service-dotnet-deploy-api-app/25-api-provisioning-started-v2.png)

7. Click **OK**. The provisioning process will create the resource group and API App in your Azure subscription, and when the process completes Visual Studio will display a message in the **Web Publish Activity** window. 

	![Status notification via the Web Publish Activity window](./media/app-service-dotnet-deploy-api-app/26-provisioning-success-v2.png)

8. Now that the API App has been provisioned, re-do the Right-click Publish gesture on the Web Project to open the publish dialog. The publish profile created by the API App provisioning in the previous step should be pre-selected. Click the publish button to begin the deployment process. 

	![Deploying the API App](./media/app-service-dotnet-deploy-api-app/26-5-deployment-step.png)

9. Once the deployment has completed the **Azure App Service Activity** window reflects the steps in deployment and the status. 

	![Status notification of the Azure App Service Activity window](./media/app-service-dotnet-deploy-api-app/26-5-deployment-success.png)

## View the new API App in the Azure Portal

In this section, you see how to navigate to the portal to view the basic settings available there for API Apps and to make iterative changes to your API App. With each deployment direct to your Azure subscription, the portal will reflect the changes you're making to your API App. 

1. In your browser, navigate to the Azure Portal at `http://aka.ms/apiappspublicpreview`. 

2. Click the **Browse** button on the sidebar and select the **API Apps** menu option.

	![Browse options on Azure portal](./media/app-service-dotnet-deploy-api-app/27-browse-in-portal-v2.png)

3. Select the API you provisioned from the list of API Apps in your subscription.

	![API Apps list](./media/app-service-dotnet-deploy-api-app/28-view-api-list-v2.png)

4. Once the API App is selected, click the **API Definition** button. In the API App's API Definition blade, you'll see the list of API operations coded up in your Web API code. 

	![API Definition](./media/app-service-dotnet-deploy-api-app/29-api-definition-v2.png)

5. In Visual Studio, add the following code to the **ContactsController.cs** file in your project. This will add a **Post** method that can be used to post new Contact instances to the API. 

		[HttpPost]
		public HttpResponseMessage Post([FromBody] Contact contact)
		{
			// todo: save the contact somewhere
			return Request.CreateResponse(HttpStatusCode.Created);
		}
    
	![Adding the Post method to the controller](./media/app-service-dotnet-deploy-api-app/30-post-method-added-v2.png)

6. In **Solution Explorer**, right-click the project node and select the **Publish** context menu option. 

	![Project Publish context menu](./media/app-service-dotnet-deploy-api-app/31-publish-gesture-v2.png)


7. Select the **Debug** configuration from the publish dialog's **Configuration** dropdown and click **Publish** to deploy your API App code to your Azure subscription. 

	![Publish Web settings](./media/app-service-dotnet-deploy-api-app/36.5-select-debug-option-v2.png)

8. In the **Preview** tab of the **Publish Web** wizard, click **Publish**.  

	![Publish Web dialog](./media/app-service-dotnet-deploy-api-app/39-re-publish-preview-step.png)

9. The publish process will complete, and the details of the publish process will be visible in the **Web Publish Activity** window.

	![Publish results viewed in the Web Publish Activity window](./media/app-service-dotnet-deploy-api-app/37-publish-succeeded-v2.png)
	
10. Once the publish process has completed, go back to the portal, and close and reopen the **API Definition blade**.

	You see the new API endpoint you just created and deployed directly into your Azure subscription.
 
	![API Definition](./media/app-service-dotnet-deploy-api-app/38-portal-with-post-method-v2.png)

## Next steps

You've seen how the direct deployment capabilities in Visual Studio for API App developers make it easy to iterate and deploy rapidly and test that your API is executing properly. In the [next tutorial](../app-service-dotnet-remotely-debug-api-app/), you'll see how to debug your API App while it runs in Azure.
