<properties 
	pageTitle="What happens when you add Mobile Services to a Javvascript app by using Visual Studio Connected Services" 
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
	ms.date="07/02/2015" 
	ms.author="patshea"/>

# What happens to my Visual Studio Azure Javascript project when I add Add Mobile Services using Connected Services?

> [AZURE.SELECTOR]
> - [Getting Started](vs-mobile-services-javascript-getting-started.md)
> - [What Happened](vs-mobile-services-javascript-what-happened.md)

###What happened to my project?

#####NuGet package added

The **WindowsAzure.MobileServices.WinJS** NuGet package was installed, including the Azure Mobile Service library in the `js\MobileServices.js` file.
  
#####Connection string values for Mobile Services 

In the `services\mobileServices\settings` folder, a new JavaScript (.js) file with a **MobileServiceClient** was generated that contains the selected mobile service's application URL and application key.  


#####References added to default.html

References to `MobileServices.js` and the settings file were added to `default.html`.  


#####Connected services files added

In the services folder, Connected Services configuration files were added.



 
