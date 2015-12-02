<properties
	pageTitle="Develop or create an API hosted in the app service environment in PowerApps Enterprise | Microsoft Azure"
	description="Learn how to register a custom API hosted in app service environment in the Azure portal"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/25/2015"
   ms.author="guayan"/>

# Register an API hosted in your app service environment
PowerApps supports registering existing APIs hosted anywhere in the cloud or on-premises, which is really powerful. In some scenarios, you may want to develop or create some new APIs. For example, you may want to:

- Implement some new functionality for your organization to use.
- Build on top of existing functionality or data to provide a better experience for users building their apps.

When you host your APIs in your app service environment, you leverage all the existing capabilities of the [app service environment](../app-service-app-service-environment-intro.md), and also get a better integration experience.

To use these APIs in your apps, you must "register" the APIs in the Azure portal. The following options are available: 

- Register a [Microsoft managed API or an IT managed API](powerapps-register-from-available-apis.md).
- Register an API hosted within your app service environment.
- Register using a [Swagger 2.0 API definition](powerapps-register-existing-api-from-api-definition.md).

This article shows you how to **register an API hosted in your app service environment**.

#### Prerequisites to get started

- Sign up for [PowerApps Enterprise](powerapps-get-started-azure-portal.md).
- Create an [app service environment](powerapps-get-started-azure-portal.md).


## Develop and deploy an API in you app service environment

Developing an API in the app service environment is straightforward. You choose your favorite programming language to build a web API, and then use [Swagger 2.0](http://swagger.io) to describe the API definition. Some examples include:  

- [Build and deploy a .NET in Azure App Service](../app-service-api-dotnet-get-started.md)
- [Build and deploy a Java API app in Azure App Service](../app-service-api-java-api-app.md)
- [Build and deploy a Node.js API app in Azure App Service](../app-service-api-nodejs-api-app.md)

You also have options to deploy your web API into an app service environment, including deploying from Visual Studio, and deploying continuously using a source control system.  [Deploy a web app in Azure App Service](../web-sites-deploy.md) is a good resource. 

## Register your custom API in the app service environment

After the API is deployed to your app service environment, use the following steps to register:

1. In the [Azure portal](https://portal.azure.com/), select **PowerApps**, and then select **Manage APIs**:  
![][11]
2. In Manage APIs, select **Add**:  
![][12]  
3. In **Add API**, enter the API properties:  

	- In **Name**, enter a name for your API. Notice that the name you enter is included in the runtime URL of the API. Make the name meaningful and unique within your organization.	
	- In **Source**, select **Import from APIs hosted in App Service Environment**:  
	![][13]
4. In **API hosted in App Service Environment**, select the API you want to import. This list shows every web app, API app, and mobile app in your app service environment  that has its **apiDefinition.url** property configured. To import the API, it uses the Swagger 2.0 API definition exposed using this property. Make sure this URL is publicly accessible when you register the API:  
![][14]
5. Select **ADD** to complete these steps.

> [AZURE.TIP] When you register an API, you're registering the API to your app service environment. Once in the app service environment, it can be used by other apps within the same app service environment.

## Summary and next steps
In this topic, you've seen how to register an APIs hosted in your app service environment. Here are some related topics and resources for learning more about PowerApps: 

- [Configure APIs](../powerapps-configure-apis.md)
- [Add a new API](../powerapps-register-from-available-apis.md)

<!--Reference-->
[11]: ./media/powerapps-register-api-hosted-in-app-service/registered-apis-part.png
[12]: ./media/powerapps-register-api-hosted-in-app-service/add-api-button.png
[13]: ./media/powerapps-register-api-hosted-in-app-service/add-api-blade.png
[14]: ./media/powerapps-register-api-hosted-in-app-service/add-api-select-from-ase.png
