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

This initializes the SDK but adds no features. To enable individual features, you will need to invoke extension methods on your `MobileAppConfiguration` object, before the `ApplyTo()` call. For example, to initialize and add the default routes to ApiControllers that have the `[MobileAppController]` attribute (described further in "Define a custom API controller" below), you would write:

      new MobileAppConfiguration()
        .MapApiControllers()
        .ApplyTo(config);

Many of the feature extension methods are available via additional NuGet packages you can include, which are described in the section below.

### SDK extensions

The following extension packages enable various mobile features that can be used by your application:

- [Microsoft.Azure.Mobile.Server.Quickstart](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Quickstart/) - Includes the Notifications, Authentication, Entity, Tables, Crossdomain, and Home packages. This provides the basic Mobile Apps setup through the `UseDefaultConfiguration()` extension method.

- [Microsoft.Azure.Mobile.Server.Home](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Home/) - Provides the `AddMobileAppHomeController()` extension method, which adds a simple home page to the site root.

- [Microsoft.Azure.Mobile.Server.Tables](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Tables/) - Includes classes for working with data and the `AddTables()` extension method, which sets up the data pipeline.

- [Microsoft.Azure.Mobile.Server.Entity](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Entity/) - Includes classes for working with SQL using Entity Framework. This also provides the `AddTablesWithEntityFramework()` extension method which sets up the Entity Framework configuration.

- [Microsoft.Azure.Mobile.Server.Authentication](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Authentication/) - Provides the `AddAppServiceAuthentication()` extension method, as well as the `IAppBuilder.UseMobileAppAuthentication()` extension which sets up the OWIN middleware used to validate tokens.

- [Microsoft.Azure.Mobile.Server.Notifications](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Notifications/) - Provides the `AddPushNotifications()` extension method, which sets up the push registration endpoint.

- [Microsoft.Azure.Mobile.Server.CrossDomain](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.CrossDomain/) - Provides the `MapLegacyCrossDomainController()` extension method, which sets up the controller you need to serve data to legacy web browsers from your Mobile App.

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