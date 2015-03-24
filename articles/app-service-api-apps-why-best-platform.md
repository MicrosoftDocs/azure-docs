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
	ms.date="03/06/2015" 
	ms.author="tdykstra"/>

# What are API Apps?

## Overview

Azure App Service is a fully managed compute platform for professional developers that brings a rich set of capabilities to web, mobile, and integration scenarios. API apps are one part of the App Service suite and allow any technical user or developer to discover, host, manage and monetize API’s and SaaS connectors on a modern, feature rich, scalable, and globally available cloud platform.

## Why API apps?

API apps in Azure App Service make it easy to develop, publish, manage, and monetize APIs.

- **Bring your API as-is** - Use ASP.NET, Java, PHP, Node.js or Python for your APIs. Your APIs can take advantage of the features of Azure App Service with no changes.

- **Connect Your apps To popular SaaS platforms** - Azure App Service makes it easy to connect to popular SaaS platforms, including Salesforce, Office 365, Twitter, Facebook, Dropbox, and many more.

- **Simple access control** - APIs can be exposed to just the other apps inside of your Azure App Service or to the public, and you can add authentication by Azure Active Directory or third-party services with no changes to your code.

- **Public and organization gallery of APIs** - Easily share APIs with other teams in your organization, by using your own private organizational gallery of APIs. APIs can also be shared publicly for consumption by third party developers.

- **Automatic SDK generation** - Azure App Service can automatically build SDKs for a variety of languages including C#, Java, and Javascript, making your APIs available to many platforms.

- **Use the best IDE in the market** - [Visual
Studio](/campaigns/visual-studio-2013/) integration simplifies API creation, debugging, packaging, and publishing, and allows for full lifecycle app management.

<!--removing per directive to cut back on size of this section
- **No ops** - Run your API apps in a high-availability environment with automatic patching. API apps deployed with Azure App Service are isolated and are hosted in VMs dedicated to your applications – ensuring predictable performance and security isolation.

- **Automatically scale** - Azure App Service enables you to quickly scale up or out to handle any incoming customer load. Manually select the number and size of VMs or set up
[auto-scaling](/documentation/videos/auto-scaling-azure-web-sites/)
to scale your servers based on load or schedule.
-->

- **Access on-premises data** - API apps can consume data from your own data center using [Hybrid Connections](../integration-hybrid-connection-overview/) and [VNET](../web-sites-integrate-with-vnet/).

- **Friction-free deploy** - Set up continuous integration and deployment workflows with Visual Studio Online, GitHub, TeamCity, Hudson, or BitBucket – enabling you to automatically build, test and deploy your API app on each successful code check-in or integration tests.

## API Apps concepts ##

- **API Apps Gallery** - Select from an ever-growing list of existing API app templates.
- **Connectors** - A type of API app that makes it easy to connect to SaaS platforms such as Salesforce and Office 365.
- **Gateway** - A web app that handles API management functions such as authentication for all API apps in a resource group. 
- **Auto Scaling** - API apps can automatically scale-up or out to handle any incoming customer load. Manually select the number and size of VMs or set up auto-scaling to scale your servers based on load or schedule.
- **Continuous Integration** - Set up continuous integration and deployment workflows with VSO, GitHub, TeamCity, Hudson or BitBucket – enabling you to automatically build, test and deploy your web app on each successful code check-in or integration tests.

## Getting started

To get started with API apps, follow the [Create an API app tutorial](../app-service-dotnet-create-api-app/).

For more information about the Azure App Service platform, see [Azure App Service](../app-service-value-prop-what-is/).
