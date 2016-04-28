<properties 
	pageTitle="API Apps introduction | Microsoft Azure" 
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
	ms.topic="get-started-article" 
	ms.date="03/31/2016" 
	ms.author="tdykstra"/>

# API Apps overview

API Apps is one of four app types offered by [Azure App Service](../app-service/app-service-value-prop-what-is.md).

![App types in Azure App Service](./media/app-service-api-apps-why-best-platform/appservicesuite.png)

[App Service](../app-service/app-service-value-prop-what-is.md) is a fully managed platform for web, mobile, and integration scenarios. API apps in App Service offer features that make it easier to build, host, and consume APIs in the cloud and on-premises. With API apps you get enterprise grade security, simple access control, hybrid connectivity, automatic SDK generation, and seamless integration with [Logic Apps](../app-service-logic/app-service-logic-what-are-logic-apps.md).

## Why API Apps?

Here are some key features of API Apps:

- **Easy consumption** - Integrated support for [Swagger API metadata](#concepts) makes your APIs easily consumable by a variety of clients.  Automatically generate client code for your APIs in a variety of languages including C#, Java, and Javascript. Easily configure [CORS](#concepts) without changing your code. For more information, see [App Service API Apps metadata for API discovery and code generation](app-service-api-metadata.md) and [Consume an API app from JavaScript using CORS](app-service-api-cors-consume-javascript.md). 

- **Simple access control** - Protect an API app from unauthenticated access with no changes to your code. Built-in authentication services secure APIs for access by other services or by clients representing users. Supported identity providers include Azure Active Directory, Facebook, Twitter, Google, and Microsoft Account. Clients can use Active Directory Authentication Library (ADAL) or the Mobile Apps SDK. For more information, see [Authentication and authorization for API Apps in Azure App Service](app-service-api-authentication.md).

- **Visual Studio integration** - Dedicated tools in Visual Studio streamline the work of creating, deploying, consuming, debugging, and managing API apps. For more information, see [Announcing the Azure SDK 2.8.1 for .NET](/blog/announcing-azure-sdk-2-8-1-for-net/).

- **Integration with Logic Apps** - API apps that you create can be consumed by [App Service Logic Apps](../app-service-logic/app-service-logic-what-are-logic-apps.md).  For more information, see [Using your custom API hosted on App Service with Logic apps](../app-service-logic/app-service-logic-custom-hosted-api.md) and [New schema version 2015-08-01-preview](../app-service-logic/app-service-logic-schema-2015-08-01.md).

- **Bring your existing API as-is** - You don't have to change any of the code in your existing APIs to take advantage of API Apps features -- just deploy your code to an API app. Your API can use any language or framework supported by App Service, including ASP.NET and C#, Java, PHP, Node.js, and Python.

In addition, an API app can take advantage of features offered by [Web Apps](../app-service-web/app-service-web-overview.md) and [Mobile Apps](../app-service-mobile/app-service-mobile-value-prop.md). The reverse is also true: if you use a web app or mobile app to host an API, it can take advantage of API Apps features such as Swagger metadata for client code generation and CORS for cross-domain browser access. The only difference between the three app types (API, web, mobile) is the name and icon used for them in the Azure portal.

## Augmenting API Apps by using Azure API Management 

API Apps and [Azure API Management](../api-management/api-management-key-concepts.md) are complementary services:

* API Management is about managing APIs. You put an API Management front end on an API to monitor and throttle usage, manipulate input and output, consolidate several APIs into one, and so forth. The APIs being managed can be hosted anywhere.
* API Apps is about hosting APIs. The service includes features that facilitate developing and consuming APIs, but it doesn't do the kinds of monitoring, throttling, manipulating, or consolidating that API Management does. 

You can use API Management to manage APIs that are hosted by API Apps, or you can use API Apps without API Management. 

Some features of API Management and API Apps have similar functions.  For example, both can automate CORS support. When you use the two services together, you would use API Management for CORS since it functions as the front end to your API apps. 

## <a id="concepts"></a> API Apps concepts

- **Swagger** - A framework for documentation and discovery of a RESTful API, used by default in API Apps. For more information, see [http://swagger.io/](http://swagger.io/).
- **Cross Origin Resource Sharing (CORS)** - A mechanism that allows JavaScript running in a browser to make calls to an API hosted on a different domain than the web page was loaded from. For more information, see [Consume an API app from JavaScript using CORS](app-service-api-cors-consume-javascript.md). 
- **Trigger** - A REST API that [logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md) can call to initiate a workflow process when a certain condition is met. For example, an API app could provide a method that the logic app calls periodically to look for a certain phrase in a Twitter feed. For more information, see [API app triggers](app-service-api-dotnet-triggers.md).
- **Action** - A REST API that [logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md) can call to process data after a workflow has been started by a trigger. For example, an API app could provide a method that the logic app calls to respond to a tweet found by the Twitter trigger. Actions are API methods that are exposed by a Swagger API definition.

## Getting started

To get started with API Apps, follow one of the [Get started with API Apps](app-service-api-dotnet-get-started.md) tutorials. 

To ask questions about API apps, start a thread in the [API Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureAPIApps). 
