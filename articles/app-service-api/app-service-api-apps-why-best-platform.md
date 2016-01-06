<properties 
	pageTitle="API Apps overview" 
	description="Learn why Azure App Service is the best platform for developing, publishing, and hosting RESTful APIs." 
	services="app-service\api" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-api" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="11/30/2015" 
	ms.author="tdykstra"/>

# API Apps overview

API Apps is one of four app types offered by [Azure App Service](../app-service/app-service-value-prop-what-is.md).

![](./media/app-service-api-apps-why-best-platform/appservicesuite.png)

[App Service](../app-service/app-service-value-prop-what-is.md) is a fully managed platform that brings a rich set of capabilities to web, mobile and integration scenarios. API Apps in App Service offer features that make it easier to build, host, and consume APIs in the cloud and on-premises. Deploy your API as an API app in App Service and benefit from enterprise grade security, simple access control, hybrid connectivity, automatic SDK generation, and seamless integration with [Logic Apps](../app-service-logic/app-service-logic-what-are-logic-apps.md).

## Why API Apps?

API Apps provides the following features:

- **Easy consumption** - Integrated support for [Swagger API metadata](#concepts) makes your APIs easily consumable by a variety of clients.  Automatically generate client code for your APIs in a variety of languages including C#, Java, and Javascript. Easily configure [CORS](#concepts) without changing your code. For more information, see [App Service API Apps metadata for API discovery and code generation](app-service-api-metadata.md) and [Consume an API app from JavaScript using CORS](app-service-api-cors-consume-javascript.md). 

- **Simple access control** - Protect an API app from unauthenticated access with no changes to your code. Built-in authentication services secure APIs for access by other services or by clients representing users. Supported identity providers include Azure Active Directory and third-party providers such as Facebook and Twitter. Clients can use Active Directory Authentication Library (ADAL) or the Mobile Apps SDK. For more information, see [Expanding App Service authentication / authorization](/blog/announcing-app-service-authentication-authorization/) and [App Service API Apps - What's changed](app-service-api-whats-changed.md).

- **Visual Studio integration** - Dedicated tools in Visual Studio streamline the work of creating, deploying, consuming, debugging, and managing API apps. For more information, see [Announcing the Azure SDK 2.8.1 for .NET](/blog/announcing-azure-sdk-2-8-1-for-net/).

- **Integration with Logic Apps** - API apps that you create can be consumed by [App Service Logic Apps](../app-service-logic/app-service-logic-what-are-logic-apps.md).  Learn how in [Using your custom API hosted on App Service with Logic apps](../app-service-logic/app-service-logic-custom-hosted-api.md). For information about ongoing changes in how API Apps integrates with Logic Apps, see [App Service API Apps - What's changed](app-service-api-whats-changed.md).   

- **Bring your existing API as-is** - You don't have to change any of the code in your existing APIs to take advantage of API Apps features -- just deploy your code to an API app. Your API can use any language or framework supported by App Service, including ASP.NET and C#, Java, PHP, Node.js and Python.

In addition, the features offered by API Apps, Web Apps, and Mobile Apps are interchangeable. This means that an instance of API Apps can take advantage of features for web and mobile development and hosting that Web Apps and Mobile Apps offer. The reverse is also true: for example, you can use a web app to host an API and still take advantage of Swagger metadata for client code generation and CORS for cross-domain browser access. For more information, see the [Web Apps overview](../app-service-web/app-service-web-overview.md) and [Mobile Apps overview](../app-service-mobile/app-service-mobile-value-prop.md).

>[AZURE.NOTE] You can use [Azure API Management](../api-management/api-management-key-concepts.md) to control client access to APIs that are hosted by App Service API Apps. While API Apps provides authentication services, there are other access management features it does not offer which API Management does offer, such as endpoint consolidation and throttling.

## <a id="concepts"></a> API Apps concepts

- **Swagger** - A framework for documentation and discovery of a RESTful API, used by default in API Apps. For more information, see [http://swagger.io/](http://swagger.io/).
- **Cross Origin Resource Sharing (CORS)** - A mechanism that allows JavaScript running in a browser to make calls to an API hosted on a different domain than the web page was loaded from. For more information, see [Consume an API app from JavaScript using CORS](app-service-api-cors-consume-javascript.md). 
- **Trigger** - A REST API that [logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md) can call to initiate a workflow process when a certain condition is met. For example, an API app could provide a method that the logic app calls periodically to look for a certain phrase in a Twitter feed. For more information, see [API app triggers](app-service-api-dotnet-triggers.md).
- **Action** - A REST API that [logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md) can call to process data after a workflow has been started by a trigger. For example, an API app could provide a method that the logic app calls to respond to a tweet found by the Twitter trigger. Actions are API methods that are exposed by a Swagger API definition.

## Getting started

To get started with API apps, follow the [Get started with API Apps](app-service-api-dotnet-get-started.md) tutorial.

To see a list of known issues with API Apps, see [the API Apps known issues forum post](https://social.msdn.microsoft.com/Forums/en-US/7f8b42f2-ac0d-48b8-a35e-3b4934e1c25e/api-app-known-issues?forum=AzureAPIApps).

For more information about the Azure App Service platform, see [Azure App Service](../app-service/app-service-value-prop-what-is.md).
