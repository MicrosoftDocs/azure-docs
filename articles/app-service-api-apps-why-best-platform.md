<properties 
	pageTitle="Why Azure App Service is the best platform for RESTful APIs" 
	description="Learn why Azure App Service is the best platform for developing, publishing, and hosting RESTful APIs." 
	services="app-service" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="2/19/2015" 
	ms.author="tdykstra"/>

# Why Azure App Service is the best platform for RESTful APIs

## Overview

Today there are many development technologies for building RESTful APIs, such as ASP.NET, PHP, Node.js, and Python. While these technologies are great for building APIs, they're just one part of building and running an API in production. 

To be competitive you also need a reliable hosting environment that makes it easy to manage APIs, easy to deploy them, easy to scale them, and easy to back up and restore them. You need an easy way to publish your APIs where customers can find them and easily consume them from their own Web apps and APIs. You need troubleshooting resources that enable you to respond quickly to problems encountered by your customers in production use. You need a way to do authentication and authorization simply but reliably. And you need development lifecycle tools that facilitate debugging and work tracking as well as writing code.

Azure App Service meets all of those needs better than any other cloud hosting platform.

## Hosting 

Azure App Service provides a rich platform for hosting API projects. Here are a few of the benefits the platform provides:

* Platform-as-a-service (PaaS) with auto patching.
* Secure cloud platform that is ISO, SOC2, and PIC compliant.
* Support for .NET, Java, PHP, Node, and Python. 
* Rich integration with Visual Studio, including simple publish and remote debugging.
* Built-in staging, backup, roll-back, and testing-in-production capabilities.  
* Built-in autoscale, load balancing, and performance monitoring.
* High availability with geo-distributed deployments.
* Continuous deployment with Git, TFS, and GitHub.
* Access to on premises data with VPN and Hybrid Connections.
* Delegated and role-based administration of cloud apps and their resources.

## API Apps Gallery

As you're building an API, you often need it to consume other APIs: how do you find the ones you need?  And once your API is built, how do you share it with other developers? When you update it to a new version, how do you notify all your customers and deliver the update? The Azure API Apps Gallery solves all these problems.

### Find other APIs 

The Azure API Apps Gallery is a marketplace that makes it easy to find and deploy APIs provided by other developers. The Gallery also contains Microsoft-provided connector API apps that make it easy for you to connect your API app or Web app to common Software-as-a-Service (SaaS) platforms such as Office 365, Sales Force, and many more.  

### Share your API

When you publish your API to the Gallery you can make it publicly available or limit access to members of your organization. And you can include with your API a simple *.json* dependencies definition file that specifies which other Gallery APIs your app needs. Then when someone deploys your app into their Azure subscription, Azure automatically deploys and hosts all of the dependent APIs along with yours. 

The Gallery also provides an easy means for you to be compensated for the use of your API by your customers -- Azure bills them for usage and passes the income on to you.

### Update your API

Sooner or later an API is going to have to be updated to a new version. Azure knows who has deployed your API from the Gallery, and your customers can opt in to an automatic update process. Minor updates can be automatically pushed to their copy of your API running in their Azure subscription, and they can get notifications of major updates that are available but contain breaking changes.

## Monitoring

The Azure App Service platform automatically does logging for your API apps, without your having to write logging code. It also organizes presentation of the logs for you. You can see logs across all consumers of one of your APIs (dependent on privacy settings for each user), or you can see logs across all of your APIs; either way you have the resources you need to spot and respond to trends and issues as they arise.

## Authentication

Authentication and authorization are complex and difficult to manage for APIs. Azure App Service makes this easier and seamless. By setting some configuration values you can define which endpoints are protected and which are public, and you can secure endpoints by Azure Active Directory, Google, Microsoft, Facebook and Twitter; you don't have to write any code.

For Azure Active Directory, App Service provides single sign on scenarios where the authentication token can be flowed from one API to the next API automatically. Secret Stores are also available so tokens for services can be stored in secure places outside of your API.

## Tooling

App Service offers full support for all its management capabilities from the command line, which enables the functionality to be used with all of the supported programming languages.

.NET developers can use the full capabilities of Visual Studio, which supports creating new API apps, converting existing ASP.NET Web APIs into App Service API apps, remote debugging, and live streaming logs of your API apps as they run in the cloud. In Visual Studio you can publish to the Gallery with a single click, and you can generate client SDKs on the fly, making it simple to call the APIs you are using no matter what programming language they were written in.  

There is also an API Apps SDK which makes it easy to use some of the advanced platform capabilities. Here are a few of the feaures the SDK makes available:

* Isolated storage - a secure storage area that API apps in an Azure resource group can use to store and share data.
* Shared configuration - an easy way to specify data such as connection strings that need to be shared among multiple API apps in a resource group.
* Simplified code syntax for consuming other API apps.  

## Simple Transition of Existing API’s

Azure App Service can take your existing API’s and give them all these advantages with little to no work. You don’t even need to change your existing code. Adding a simple *apiapp.json* file to your existing API is all you have to do to start taking advantage of all the capabilities described in this article. There is no need to rewrite your APIs; just add the file, publish, and start taking advantage of the functionality. 

## Next Steps

For more information, see [The Azure Cloud Hosting Platform](../app-service-cloud-app-platform).

To get started with Azure API apps, see [Create an API app](../app-service-create-api-app).



