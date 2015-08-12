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
	ms.date="08/11/2015"
	ms.author="glenga"/>

# Work with the .NET backend server SDK for Azure Mobile Apps

This topic shows you how to use the .NET backend server SDK in key Azure App Service Mobile Apps scenarios. The Azure Mobile Apps SDK helps you work with mobile clients from your ASP.NET application.

## Downloading and initializing the SDK

The SDK is available on [NuGet.org]. This package includes the base functionality required to get started using the SDK. To initialize the SDK, you need to perform actions on the **HttpConfiguration** object. 

###Install the SDK

To install the SDK, right-click on the server project in Visual Studio, select **Manage NuGet Packages**, search for the [Microsoft.Azure.Mobile.Server](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server/) package, then click **Install**.

###Initialize the server project

A .NET backend server project is initialized in the **Register** method of the **WebApiConfig** class, usually found in the App_Start folder. An **HttpConfiguration** object, which represents configuration options for the service, is used to initialize the server project. The following example initialize the server project, with no added features: 

    new MobileAppConfiguration()
        .ApplyTo(config);

To enable individual features, you must call extension methods on the **MobileAppConfiguration** object before calling **ApplyTo**. For example, the following code adds the default routes to all API controllers during initialization:

	new MobileAppConfiguration()
	    .MapApiControllers()
	    .ApplyTo(config);

Many of the feature extension methods are available via additional NuGet packages you can include, which are described in the section below. 

### SDK extensions

The following NuGet-based extension packages provide various mobile features that can be used by your application. You enable extensions during initialization by using the **MobileAppConfiguration** object.

- [Microsoft.Azure.Mobile.Server.Quickstart]  
	 Supports the basic Mobile Apps setup. Added to the configuration by calling the **UseDefaultConfiguration** extension method during initialization. This extension includes following extensions: Notifications, Authentication, Entity, Tables, Crossdomain and Home packages. This is equivalent to the quickstart server project that you download from the Azure portal.

- [Microsoft.Azure.Mobile.Server.Home](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Home/)   
	Adds a simple home page to the web site root. Add to the configuration by calling the **AddMobileAppHomeController** extension method.

- [Microsoft.Azure.Mobile.Server.Tables](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Tables/)  
	includes classes for working with data and sets-up the data pipeline. Add to the configuration by calling the **AddTables** extension method.

- [Microsoft.Azure.Mobile.Server.Entity](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Entity/)   
	Enables the Entity Framework to access data in the SQL Database. Add to the configuration by calling the **AddTablesWithEntityFramework** extension method.

- [Microsoft.Azure.Mobile.Server.Authentication]  
	Enables authentication and sets-up the OWIN middleware used to validate tokens. Add to the configuration by calling the **AddAppServiceAuthentication** and **IAppBuilder**.**UseMobileAppAuthentication** extension methods.

- [Microsoft.Azure.Mobile.Server.Notifications](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Notifications/)  
	Enables push notifications and defines a push registration endpoint. Add to the configuration by calling the **AddPushNotifications** extension method.

- [Microsoft.Azure.Mobile.Server.CrossDomain](http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.CrossDomain/)  
	Creates a controller that serves data to legacy web browsers from your Mobile App. Add to the configuration by calling the **MapLegacyCrossDomainController** extension method.

## How to: Define a table controller

You define a table controller by doing the following:




## How to: Define a custom API controller

The API controller provides the most basic functionality to your Mobile App backend. You do not need to add any extensions during initialization. You define a custom API controller by applying the **MobileAppControllerAttribute** to a controller class that inherits from **ApiController**, as in the following example:

	    [MobileAppController] 
	    public class TestController : ApiController
	       {
	              //...
	       }

Any controllers that do not have **MobileAppControllerAttribute** will not be considered part of your Mobile App backend.

## How to: Add authentication to a server project

You can add authentication to your server project by extending the **MobileAppConfiguration** object and configuring OWIN middleware. Note, that if you have installed the [Microsoft.Azure.Mobile.Server.Quickstart] package, no additional action is needed. These configurations have already been completed for you.

1. In Visual Studio, install the [Microsoft.Azure.Mobile.Server.Authentication] package. 

2. Browse to the App_Startup folder, open the WebApiConfig.cs project file and add a call to the **AddAppServiceAuthentication** extension method during initialization, which looks like the following:

		new MobileAppConfiguration()
			// other features...
			.AddAppServiceAuthentication()
			.ApplyTo(config);

3. In the Startup.cs project file, add the following line of code at the beginning of the **Configuration** method:

		app.UseMobileAppAuthentication(config);

	This adds the OWIN middleware component that enables your Azure Mobile App to validate tokens issued by the associated App Service gateway.

4. Add the `[Authorize]` attribute to any controller or method that requires authentication. Users must now be authenticated to access that endpoint or those a specific APIs.

## How to: Add push notifications to a server project

## How to: Publishing the server project

Use the following steps to publish your server project to Azure:

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]


[NuGet.org]: http://www.nuget.org/
[Microsoft.Azure.Mobile.Server.Quickstart]: http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Quickstart/
[Microsoft.Azure.Mobile.Server.Authentication]: http://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Authentication/