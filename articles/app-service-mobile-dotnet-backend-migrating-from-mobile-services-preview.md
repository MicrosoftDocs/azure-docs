<properties 
	pageTitle="Migrate from Mobile Services to an App Service Mobile App" 
	description="Learn how to easily migrate your Mobile Services application to an App Service Mobile App" 
	services="app-service-mobile" 
	documentationCenter="" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="mahender"/>

# Migrate your existing Azure Mobile Service to an Azure App Service Mobile App.

This topic shows you how to migrate an existing application from Azure Mobile Services to the new App Service Mobile App. All Existing Mobile Services apps can be easily migrated to a new App Service Mobile app. During a migration, your existing Mobile Services application can continue to operate. Over time, the process for migrating will be automated to make things even easier, but for those who wish to migrate today, the following steps can be used.

>[AZURE.NOTE] Migrations are currently only supported for customers using the Mobile Services .NET backend. Applications using the Node.JS backend will continue to stay on Mobile Services at this time.

##<a name="understand"></a>Understanding App Service Mobile Apps

App Service Mobile apps is a new way to build mobile applications using Microsoft Azure. You can learn more about Mobile Apps in the [What are App Service Mobile Apps?] topic.

In a migration to Mobile Apps, all existing app functionality (and code) can be preserved. Moreover, new features are available to the application. 

More about the benefits of migrating can be found in the [I already use web sites and mobile services – how does App Service help me?] topic.

In the Mobile Apps model, your code actually runs on a Web App (the new version of Azure Web SItes). You have full control over the web site and how it operates. In addition, Web Apps features which were previously unavailable to Mobile Services customers, such as Traffic Manager and Development Slots, can now be used. 

The new model also addresses one of the major difficulties of working with Mobile Services. Now, any version of any NuGet package can be deployed without worrying about dependency conflicts.

Mobile Apps provides a new [Mobile App Server SDK] which provides much of the same functionality as the Mobile Services runtime, but it operates only based on the dependencies it declares.

##<a name="overview"></a>Basic migration overview
In many cases, migrating will be as simple as switching to the new Server SDK and republishing your code onto a new Mobile App.

The simplest migration which can be performed is to create a new instance of an App Service Mobile App. You can then move and test your code at your pace. When ready, you can release a new version of your client application. Finally, once your customers have updated to the newest version, you can delete the original Mobile Service.



##<a name="mobile-app-version"></a>Setting up a Mobile App version of your application
The first step in migrating is to create the App Service which will host the new version of your application


##<a name="authentication"></a>Authentication considerations

If your application takes dependencies on user IDs, such as storing them in a database, it is important to note that the user IDs between Mobile Services and App Service Mobile Apps are different. However, it is possible to get the Mobile Services User ID in your App Service Mobile App application by using the following:

    ServiceUser user = (ServiceUser) this.User;
    FacebookCredentials creds = (await user.GetIdentitiesAsync()).OfType< FacebookCredentials >().FirstOrDefault();
    string mobileServicesUserId = creds.Provider + ":" + creds.UserId;

It is also important that if your app contains

##<a name="updating clients"></a>Updating clients
Mobile Apps will also include a new version of the Mobile Services client SDKs, which will allow developers to take advantage of new App Service features. Once you have an


<!-- URLs. -->

[Azure Management Portal]: https://portal.azure.com/
[What are App Service Mobile Apps]: https://azure.microsoft.com/
[I already use web sites and mobile services – how does App Service help me?]: https://azure.microsoft.com/
[Mobile App Server SDK]:  https://azure.microsoft.com/