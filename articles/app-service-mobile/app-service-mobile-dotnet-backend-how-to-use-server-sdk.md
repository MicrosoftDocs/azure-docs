<properties
	pageTitle="How to work with the .NET backend server SDK for Mobile Apps | Azure App Service"
	description="Learn how to work with the .NET backend server SDK for Azure App Service Mobile Apps."
	services="app-service\mobile"
	documentationCenter=""
	authors="ggailey777" 
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-multiple"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="08/03/2015"
	ms.author="glenga"/>

# Work with the .NET backend server SDK for Azure Mobile Apps

This topic shows you how to use the .NET backend server SDK in key Azure App Service Mobile Apps scenarios. The Azure Mobile Apps SDK helps you work with mobile clients from your ASP.NET application.

## Downloading and initializing the SDK

The .NET SDK is  available on [NuGet.org]. You can add it to your ASP.NET project by right-clicking on the project in Visual Studio. Select **Manage NuGet Packages**, and then search for the [Microsoft.Azure.Mobile.Server](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server/) package. Select it, and then click **Install**.

This package includes the base functionality required to get started using the SDK. To initialize the SDK, you need to perform actions on the HttpConfiguration object. If you have an HttpConfiguration named "config" then you can add the following:

      new MobileAppConfiguration()
        .ApplyTo(config);

This initializes the SDK but adds no features. To enable individual features, you will need to include extension packages, as described in the below section.

### SDK extensions

The following extension packages enable various mobile features that can be used by your application:

- [Microsoft.Azure.Mobile.Server.Quickstart](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Quickstart/)

- [Microsoft.Azure.Mobile.Server.Authentication](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Authentication/)

- [Microsoft.Azure.Mobile.Server.Home](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Home/)

- [Microsoft.Azure.Mobile.Server.Tables](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Tables/)

- [Microsoft.Azure.Mobile.Server.Entity](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Entity/)

- [Microsoft.Azure.Mobile.Server.CrossDomain](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.CrossDomain/)

## How to: Define a table controller



## How to: Define a custom API controller

You define a custom API controller by applying the Microsoft.Azure.Mobile.Server.Config.MobileAppControllerAttribute to the controller class that inherits from API controller, as in the following example:

	using System;
	using System.Collections.Generic;
	using System.Web.Http;
	using Microsoft.Azure.Mobile.Server.Config;
	namespace todolistService.Controllers
	{
	    [MobileAppController] 
	    public class TestController : ApiController
	       {
	              //...
	       }
	}

## How to: Add authentication to a server project

## How to: Add push notifications to a server project

## How to: Publishing the server project

### Visual Studio publishing

### Git publishing



[NuGet.org]: http://www.nuget.org/