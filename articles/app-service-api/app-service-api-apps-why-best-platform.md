<properties 
	pageTitle="What are API Apps?" 
	description="Learn why Azure App Service is the best platform for developing, publishing, and hosting RESTful APIs." 
	services="app-service\api" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-api" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/15/2015" 
	ms.author="tdykstra"/>

# What are API Apps?

API Apps provides a rich platform for building, hosting, and consuming APIs in the cloud and on-premises. Deploy your API as an API app and benefit from enterprise grade security, simple access control, hybrid and SaaS connectivity. automatic SDK generation, and seamless integration with [Logic Apps](../app-service-logic/app-service-logic-what-are-logic-apps.md).

API Apps is part of [Azure App Service](../app-service/app-service-value-prop-what-is.md), which also includes Web Apps, Mobile Apps, and Logic Apps. 

![](./media/app-service-api-apps-why-best-platform/appservicesuite.png)

## Why API Apps?

API Apps provides capabilities for developing, deploying, publishing, consuming and managing RESTful web APIs. App Service provides the following features available today in public preview:

- **Easy consumption** - Integrated [Swagger](http://swagger.io/) support makes your APIs easily consumable by a variety of clients.  The API Apps SDK can generate client code for your APIs in a variety of languages including C#, Java, and Javascript.

- **Simple access control** - Built-in authentication services support Azure Active Directory or third-party services such as Facebook and Twitter. You can protect an API app from unauthenticated access with no changes to your code. If you're familiar with the authentication services provided by [Azure Mobile Services](../mobile-services-windows-dotnet-how-to-use-client-library.md#authentication), API Apps builds on that framework and extends it to APIs hosted by API Apps.  The App Service SDK also enables you to use a simplified syntax for authorization code. For more information, see [Authentication for API apps and mobile apps in Azure App Service](../app-service/app-service-authentication-overview.md).

- **Easy connection to SaaS platforms** - [Connector API apps](../app-service-logic/app-service-logic-what-are-biztalk-api-apps.md) in the Azure Marketplace are provided by Microsoft and third parties to simplify the code you write for interacting with SalesForce, Office 365, Twitter, Facebook, Dropbox, and many others.

- **Integration with Logic Apps** - API apps that you create can be consumed by [App Service Logic Apps](../app-service-logic/app-service-logic-what-are-logic-apps.md).    

- **Visual Studio integration** - Dedicated tools in Visual Studio streamline the work of [creating](app-service-dotnet-create-api-app.md), [deploying](app-service-dotnet-deploy-api-app.md), [debugging](app-service-dotnet-remotely-debug-api-app), and managing API apps.

You can bring your existing API as-is: you don't have to change any of the code in your existing APIs to take advantage of API App features, just deploy your code to an API app. You can use ASP.NET, Java, PHP, Node.js or Python for your APIs.

API Apps additionally includes [features of App Service Web Apps](../app-service-web/app-service-web-overview.md).

>[AZURE.NOTE] [Azure API Management](/services/api-management/) is a separate service that offers features such as endpoint consolidation and throttling. You can use API Management with API Apps.
>
>API Apps is currently in public preview. [App Service Web Apps](../app-service-web/app-service-web-overview.md) is a Generally Available (GA) service designed for building and hosting secure mission-critical applications at global scale. If you are looking for a GA service for building your API today, Web Apps is a great option. When API Apps goes GA, we'll provide a path for taking existing web apps and leveraging the additional features of API Apps.

## API Apps concepts ##

- **Gateway** - A web app that handles API administration functions and authentication for all API apps in a resource group. 
- **Swagger** - A framework for interactive documentation and discovery of a RESTful API, used by default in API apps. For more information, see [http://swagger.io/](http://swagger.io/).
- **Connector** - A type of API app that makes it easy to connect to SaaS platforms such as Salesforce and Office 365. For more information, see [What are connectors and BizTalk API apps](../app-service-logic/app-service-logic-what-are-biztalk-api-apps.md).
- **Trigger** - A REST API that [logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md) can call to initiate a workflow process when a certain condition is met. For example, an API app could provide a method that the logic app calls periodically to look for a certain phrase in a Twitter feed. For more information, see [API app triggers](app-service-api-dotnet-triggers.md).
- **Action** - A REST API that [logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md) can call to process data after a workflow has been started by a trigger. For example, an API app could provide a method that the logic app calls to respond to a tweet found by the Twitter trigger. Actions are API methods that are exposed by a Swagger API definition.

## Getting started

To get started with API apps, follow the [Create an API app tutorial](app-service-dotnet-create-api-app.md).

To see a list of known issues with API apps, please refer to [this MSDN forum post](https://social.msdn.microsoft.com/Forums/en-US/7f8b42f2-ac0d-48b8-a35e-3b4934e1c25e/api-app-known-issues?forum=AzureAPIApps).

For more information about the Azure App Service platform, see [Azure App Service](../app-service/app-service-value-prop-what-is.md).

 
