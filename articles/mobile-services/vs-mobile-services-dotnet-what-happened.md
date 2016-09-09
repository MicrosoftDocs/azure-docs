<properties
	pageTitle="What happened to my .NET project after adding Mobile Services by using Visual Studio Connected Services | Microsoft Azure"
	description="Describes what happened in your Visual Studio .NET project after adding Azure Mobile Services by using Connected Services "
	services="mobile-services"
	documentationCenter=""
	authors="mlhoop"
	manager="douge"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="mlearned"/>

# What happened to my Visual Studio .NET project after adding Azure Mobile Services by using Connected Services?

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

## References Added

The Azure Mobile Services NuGet package was added to your project. As a result, the following .NET references were added to your project:

- **Microsoft.WindowsAzure.Mobile**
- **Microsoft.WindowsAzure.Mobile.Ext**
- **Newtonsoft.Json**
- **System.Net.Http.Extensions**
- **System.Net.Http.Primitives**

## Connection string values for Mobile Services

In your App.xaml.cs file, a **MobileServiceClient** object was created with the selected mobile service’s application URL and application key.

## Mobile Services project added

If a .NET mobile service is created in the Connected Service Provider, then a mobile services project is created and added to the solution.


[Learn more about mobile services](https://azure.microsoft.com/documentation/services/mobile-services/)
