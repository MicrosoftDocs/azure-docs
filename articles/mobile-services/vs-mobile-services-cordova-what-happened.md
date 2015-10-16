<properties 
	pageTitle="What happened to my Cordova project (Visual Studio Connected Services) | Microsoft Azure" 
	description="Describes what happened to your Azure Cordova project after adding Azure Mobile Services by using Visual Studio Connected Services " 
	services="mobile-services" 
	documentationCenter="na" 
	authors="patshea123" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="09/17/2015" 
	ms.author="patshea"/>

# What happened to my Azure Cordova project after adding Azure Mobile Services by using Visual Studio Connected Services?

> [AZURE.SELECTOR]
> - [Getting Started](vs-mobile-services-cordova-getting-started.md)
> - [What Happened](vs-mobile-services-cordova-what-happened.md)

##References Added

The Azure Mobile Service Client plugin included with all Multi-Device Hybrid Apps has been enabled.
  
##Connection string values for Mobile Services

Under `services\mobileServices\settings`, a new JavaScript (.js) file with a **MobileServiceClient** was generated containing the selected mobile service’s application URL and application key. The file contains the initialization of a mobile service client object, similar to the following code.

	var mobileServiceClient;
	document.addEventListener("deviceready", function() {
            mobileServiceClient = new WindowsAzure.MobileServiceClient(
	        "<your mobile service name>.azure-mobile.net",
	        "<insert your key>"
	    );

[Learn more about mobile services](http://azure.microsoft.com/documentation/services/mobile-services/) 
