<properties 
	pageTitle="" 
	description="Describes what happened to your Azure Mobile Services project in Visual Studio" 
	services="mobile-services" 
	documentationCenter="" 
	authors="patshea" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="web" 
	ms.tgt_pltfrm="vs-what-happened" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/02/2015" 
	ms.author="patshea"/>

> [AZURE.SELECTOR]
> - [Getting Started](/documentation/articles/vs-mobile-services-javascript-getting-started/)
> - [What Happened](/documentation/articles/vs-mobile-services-javascript-what-happened/)

###<span id="whathappened">What happened to my project?</id>

#####References Added

The Windows Azure Mobile Service library was added to your project in the form of a **MobileServices.js** file.
  
#####Connection string values for Mobile Services 

In the `services\mobileServices\settings` folder, a new JavaScript (.js) file with a **MobileServiceClient** was generated that contains the selected mobile service's application URL and application key.  
