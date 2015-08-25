<properties 
	pageTitle="" 
	description="Describes what happened in your Azure Mobile Services .NET project in Visual Studio" 
	services="mobile-services" 
	documentationCenter="" 
	authors="patshea123" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="NA" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="07/02/2015" 
	ms.author="patshea"/>

# What happened to my project?

> [AZURE.SELECTOR]
> - [Getting Started](vs-mobile-services-dotnet-getting-started.md)
> - [What Happened](vs-mobile-services-dotnet-what-happened.md)

###What happened to my project?

#####References Added

The Azure Mobile Services NuGet package was added to your project. As a result, the following .NET references were added to your project:

- `Microsoft.WindowsAzure.Mobile`
- `Microsoft.WindowsAzure.Mobile.Ext`
- `Newtonsoft.Json`
- `System.Net.Http.Extensions`
- `System.Net.Http.Primitives` 

#####Connection string values for Mobile Services

In your App.xaml.cs file, a **MobileServiceClient** object was created with the selected mobile service’s application URL and application key. 

####Mobile Services project added

If a .NET mobile service is created in the Connected Service Provider, then a mobile services project is created and added to the solution.


[Learn more about mobile services](http://azure.microsoft.com/documentation/services/mobile-services/) 
