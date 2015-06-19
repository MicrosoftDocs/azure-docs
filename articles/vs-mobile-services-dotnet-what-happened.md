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
	ms.date="05/06/2015" 
	ms.author="patshea123"/>

# What happened to my project?

> [AZURE.SELECTOR]
> - [Getting Started](vs-mobile-services-dotnet-getting-started.md)
> - [What Happened](vs-mobile-services-dotnet-what-happened.md)

###<span id="whathappened">What happened to my project?</span>

#####References Added

The Azure Mobile Services NuGet package was added to your project. As a result, the following .NET references were added to your project:

- `Microsoft.WindowsAzure.Mobile`
- `Microsoft.WindowsAzure.Mobile.Ext`
- `Newtonsoft.Json`
- `System.Net.Http.Extensions`
- `System.Net.Http.Primitives` 

#####Connection string values for Mobile Services

In your App.xaml.cs file, a **MobileServiceClient** object was created with the selected mobile service’s application URL and application key. 

[Learn more about mobile services](http://azure.microsoft.com/documentation/services/mobile-services/)