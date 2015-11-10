<properties
	pageTitle="Register API hosted in App Service Environment | Microsoft Azure"
	description="Register API hosted in App Service Environment"
	services="power-apps"
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="power-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="" 
   ms.date="11/30/2015"
   ms.author="guayan"/>

# Register API Hosted in App Service Environment

There are three ways to register an API so that users can use them from their apps:

1. [From Marketplace](powerapps-register-api-from-marketplace.md)
2. From APIs hosted in your App Service Environment
3. [From Swagger 2.0 API definition](powerapps-register-existing-api-from-api-definition.md)

This article describes how to register an API hosted in your App Service Environment.

#### Prerequisites to get started

- Sign up for PowerApps Enterprise
- Create an App Service Environment

## Overview

We support registering existing APIs hosted anywhere, in the cloud or on-premises, which is really powerful. Having said that, in some scenarios, you may want to develop some new APIs. For example:

- You want to implement some new functionalities for your organization to use.
- You want to build on top of some existing functionalities or data to provide a better experience for users when using it building their apps.

In this case, hosting the API in your App Service Environment will not only let you leverage all the existing capabilities of [App Service]() but also provides you the best integration experience.

## Develop and deploy an API in App Service Environment

Developing an API in App Service Environment is simple. You choose your favorite programming language to build a web API and use [Swagger 2.0](http://swagger.io) to describe the API definition. For some concrete examples, please refer to

- [Create an ASP.NET API app in Azure App Service](app-service-dotnet-create-api-app.md)
- [Build and deploy a Java API app in Azure App Service](app-service-api-java-api-app.md)
- [Build and deploy a Node.js API app in Azure App Service](app-service-api-nodejs-api-app.md)

You also have a lot of options to deploy your web API into App Service Environment, from Visual Studio to continuous deployment via source control system. For more information, please refer to [Deploy a web app in Azure App Service](web-sites-deploy.md)

## Register your API

After the API is deployed to your App Service Environment, registering it is simple. Following are the steps:

1. In the Azure portal, select **PowerApps**. In PowerApps, select **Registered APIs**:  
	![][11]
2. In Registered APIs, select **Add**:
	![][12]  
3. In **Add API**, enter the API properties:
	In **Name**, enter a name for your API. Notice that it will be part of the runtime URL of the API, which should be meaningful and unique within your organization.
	In **Source**, select **Import from API app**.
	![][13]
4. In **API**, select the API app you want to import from.
	![][14]
5. Click **ADD** to complete these steps.

Now, your API is registered and ready for users to use from their apps. One thing to notice is that because you are hosting the API in App Service Environment, we can actually secure it automatically so that nobody can access your backend API app directly.

## Summary and next steps




[11]: ./media/powerapps-register-api-hosted-in-app-service/registered-apis-part.png
[12]: ./media/powerapps-register-api-hosted-in-app-service/add-api-button.png
[13]: ./media/powerapps-register-api-hosted-in-app-service/add-api-blade.png
[14]: ./media/powerapps-register-api-hosted-in-app-service/add-api-select-from-api-app-blade.png