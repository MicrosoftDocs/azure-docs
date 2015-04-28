<properties 
	pageTitle="" 
	description="Information about the getting started with Azure Active Directory (Web API projects) wizard" 
	services="active-directory" 
	documentationCenter="" 
	authors="kempb" 
	manager="douge" 
	editor="tglee"/>
  
<tags 
	ms.service="active-directory" 
	ms.workload="web" 
	ms.tgt_pltfrm="vs-getting-started" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/02/2015" 
	ms.author="kempb"/>

# Getting Started with Azure Active Directory (Web API Projects)

> [AZURE.SELECTOR]
> - [Getting Started](vs-active-directory-webapi-getting-started.md)
> - [What Happened](vs-active-directory-webapi-what-happened.md)

#####Requiring authentication to access controllers
 
All controllers in your project were adorned with the **Authorize** attribute. This attribute will require the user to be authenticated before accessing the APIs defined by these controllers. To allow the controller to be accessed anonymously, remove this attribute from the controller. If you want to set the permissions at a more granular level, apply the attribute to each method that requires authorization instead of applying it to the controller class.

[Learn more about Azure Active Directory](http://azure.microsoft.com/services/active-directory/)
