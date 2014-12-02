<properties title="Getting Started with Mobile Services" pageTitle="" metaKeywords="Azure, Getting Started, Mobile Services" description="" services="mobile-services" documentationCenter="" authors="ghogen, kempb" />

<tags ms.service="mobile-services" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/8/2014" ms.author="ghogen, kempb" />

> [AZURE.SELECTOR]
> - [Getting Started](/documentation/articles/vs-mobile-services-dotnet-getting-started/)
> - [What Happened](/documentation/articles/vs-mobile-services-dotnet-what-happened/)

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