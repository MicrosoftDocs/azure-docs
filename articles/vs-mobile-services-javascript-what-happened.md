<properties 
	pageTitle="" 
	description="Describes what happened to your Azure Mobile Services project in Visual Studio" 
	services="mobile-services" 
	documentationCenter="" 
	authors="patshea123" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="NA" 
	ms.devlang="JavaScript" 
	ms.topic="article" 
	ms.date="05/06/2015" 
	ms.author="patshea123"/>

# What happened to my project?

> [AZURE.SELECTOR]
> - [Getting Started](vs-mobile-services-javascript-getting-started.md)
> - [What Happened](vs-mobile-services-javascript-what-happened.md)

###<span id="whathappened">What happened to my project?</id>

#####References Added

The Azure Mobile Service library was added to your project in the form of a **MobileServices.js** file.
  
#####Connection string values for Mobile Services 

In the `services\mobileServices\settings` folder, a new JavaScript (.js) file with a **MobileServiceClient** was generated that contains the selected mobile service's application URL and application key.  
