<properties 
	pageTitle="" 
	description="Describes what happened to your Azure Mobile Service project in Cordova" 
	services="mobile-services" 
	documentationCenter="" 
	authors="patshea123" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="NA" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="05/06/2015" 
	ms.author="patshea123"/>

# What happened to my project?

> [AZURE.SELECTOR]
> - [Getting Started](vs-mobile-services-cordova-getting-started.md)
> - [What Happened](vs-mobile-services-cordova-what-happened.md)

###<span id="whathappened">What happened to my project?</span>

#####References Added

The Azure Mobile Service Client plugin included with all Multi-Device Hybrid Apps has been enabled.
  
#####Connection string values for Mobile Services

Under `services\mobileServices\settings`, a new JavaScript (.js) file with a **MobileServiceClient** was generated containing the selected mobile service’s application URL and application key. The file contains the initialization of a mobile service client object, similar to the following code.

	var mobileServiceClient;
	document.addEventListener("deviceready", function() {
            mobileServiceClient = new WindowsAzure.MobileServiceClient(
	        "<your mobile service name>.azure-mobile.net",
	        "<insert your key>"
	    );

[Learn more about mobile services](http://azure.microsoft.com/documentation/services/mobile-services/)