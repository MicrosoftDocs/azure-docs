<properties 
	pageTitle="Migrate from Mobile Services to an App Service Mobile App" 
	description="Learn how to easily migrate your Mobile Services application to an App Service Mobile App" 
	services="app-service\mobile" 
	documentationCenter="" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="mahender"/>

# Migrate your existing Azure Mobile Service to an Azure App Service Mobile App.

This topic shows you how to migrate an existing application from Azure Mobile Services to the new App Service Mobile App. All existing Mobile Services apps can be easily migrated to a new App Service Mobile app. During a migration, your existing Mobile Services application can continue to operate. Over time, the process for migrating will be automated to make things even easier, but for those who wish to migrate today, the following steps can be used.

>[AZURE.NOTE] Migrations are currently only supported for customers using the Mobile Services .NET backend. Applications using the Node.JS backend will need to stay on Mobile Services at this time.

##<a name="understand"></a>Understanding App Service Mobile Apps

App Service Mobile apps is a new way to build mobile applications using Microsoft Azure. You can learn more about Mobile Apps in the [What are App Service Mobile Apps?] topic.

In a migration to Mobile Apps, all existing app functionality (and code) can be preserved. Moreover, new features are available to the application. In the Mobile Apps model, your code actually runs on a Web App (the new version of Azure Web SItes). You have full control over the web site and how it operates. In addition, Web Apps features which were previously unavailable to Mobile Services customers, such as Traffic Manager and Development Slots, can now be used. 

The new model also addresses one of the major difficulties of working with Mobile Services. Now, any version of any NuGet package can be deployed without worrying about dependency conflicts. More about the benefits of migrating can be found in the [I already use web sites and mobile services – how does App Service help me?] topic.

When you create an App Service Mobile App, you get:

- A Mobile App resource, which contains new functionality 
- The Mobile App Code site, which runs your Web API project using the Mobile App Server SDK
- An App Service Gateway, which handles login and helps you add App Service API Apps to your application

##<a name="overview"></a>Basic migration overview
The simplest way to migrate is to create a new instance of an App Service Mobile App. In many cases, migrating will be as simple as switching to the new Server SDK and republishing your code onto a new Mobile App. There are, however some scenarios which will require some additional configuration, such as advanced authentication scenarios and working with scheduled jobs. Each of these is covered in the following sections.

You can move and test your code at your pace. When the Mobile App backend is ready, you can release a new version of your client application. At this point, you will have two copies of your application running side by side. You need to make sure any bug fixes you make get applied to both. Finally, once your users have updated to the newest version, you can delete the original Mobile Service.

The full set of steps for this migration is as follows:

1. Create and configure a new Mobile App
2. Address any authentication concerns
3. Release a new version of your client application
4. Delete your original Mobile Services instance

##<a name="mobile-app-version"></a>Setting up a Mobile App version of your application
The first step in migrating is to create the App Service which will host the new version of your application. You can create a new Mobile App in the [Preview Azure Management Portal]. You can consult the [Get Started with Mobile Apps] for further detail.

You will likely want to use the same database and Notification Hub as you did in Mobile Services. You can copy these values from the **Configure** tab of the Mobile Services section of the [Current Azure Management Portal]. Under **Connection Strings**, copy `MS_NotificationHubConnectionString` and `MS_TableConnectionString`. Navigate to your Mobile App Code site and select **Settings**, **Application settings**, and add these connection strings, overwriting any existing values. You should additionally add these values to the Mobile App as well. To do this, navigate to the Mobile App blade, select **Settings** and then **Properties**. Select **Advanced Application Settings** and paste in the connection string as in the code site. Do not change other values as this could break Mobile App functionality. Please note that at the moment, the Mobile App blade will continue to show the existing connections even after this configuration step. Additional action may be required once the Mobile Apps experience has been updated.

Mobile Apps provides a new [Mobile App Server SDK] which provides much of the same functionality as the Mobile Services runtime. You should remove the Mobile Services NuGet project from your existing project and instead include the Server SDK. You may need to modify some using statements, with which Visual Studio will assist. The main item that one may find missing from the Server SDK is a PushRegistrationHandler class. Registrations are not handled by the code site, but instead provided by the Mobile App resource. However, tag registrations still are and need to be supported explicitly. Please see the [How to work with push notifications] topic for more information.

Scheduled jobs are not built into Mobile Apps, so any existing jobs that you have in your .NET backend will need to be migrated individually. One option is to create a scheduled [Web Job] on the Mobile App code site. You could also set up a controller that holds your job code and configure the [Azure Scheduler] to hit that endpoint on the expected schedule.


##<a name="authentication"></a>Authentication considerations
Most apps will be fine to simply use a new registration, and you can learn about adding identity to an App Services app by following the [Add authentication to your mobile app] tutorial.

If your application takes dependencies on user IDs, such as storing them in a database, it is important to note that the user IDs between Mobile Services and App Service Mobile Apps are different. However, it is possible to get the Mobile Services User ID in your App Service Mobile App application by using the following (with Facebook as an example):

    ServiceUser user = (ServiceUser) this.User;
    FacebookCredentials creds = (await user.GetIdentitiesAsync()).OfType< FacebookCredentials >().FirstOrDefault();
    string mobileServicesUserId = creds.Provider + ":" + creds.UserId;

Additionally, it is important that you leverage the same registration with an identity provider. User IDs are typically scoped to the application registration that was used, so introducing a new registration could create problems with matching users to their data. Should your application need to use the same identity provider registration for any reason, you can use the following steps:

1. Copy over the Client ID and Client secret connection information for each provider used by your application.
2. Add the gateway /signin-* endpoint as an additional redirect URI for each provider. Note that some providers do not allow you to specify multiple redirect URIs. If you make use of any of these, you will need change the redirect URL in your provider registration point at your App Service Gateway redirect URL, and immediately add the MS_GatewayUrl parameter to your Mobile Service with the gateway URL root. These must be done in immediate sequence to avoid downtime.

##<a name="updating clients"></a>Updating clients
Once you have an operational Mobile App backend, you can update your client application to consume the new Mobile App. Mobile Apps will also include a new version of the Mobile Services client SDKs, which will allow developers to take advantage of new App Service features. Once you have a Mobile App version of your backend, you can release a new version of your client application which leverages the new SDK version.

The main change that will be required of your client code is in the constructor. In addition to the URL of your Mobile App resource and application key, you need to provide the name of the Mobile App code site that is registered for your Mobile App:

    public static MobileServiceClient MobileService = new MobileServiceClient(
        "https://contosoproxysite.azurewebsites.net/contoso",
        "contoso-code",
        "983682c4-f043-483e-a75b-8a8545fc1846"
    );

This will allow the client to route requests to the components of your Mobile App, and you can begin to take advantage of new features in the Mobile App resource. You can find more details specific to your target platform using the appropriate [Get Started with Mobile Apps] topic.

In the same update, you will need to adjust any push notification registration calls that you make. There are new APIs which make improvements to the registration process (using Windows as an example):

    var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
    await MobileServices.GetPush().Register(channel.Uri); 

Please see the [Get Started with Push] and [How to work with push notifications] topics for details specific to your platform.

Once your customers have had a chance to receive these updates, you can delete the Mobile Services version. At this point, you have completely migrated to an App Service Mobile App.

<!-- URLs. -->

[Preview Azure Management Portal]: https://portal.azure.com/
[Current Azure Management Portal]: https://manage.windowsazure.com/
[What are App Service Mobile Apps?]: /en-us/documentation/articles/app-service-mobile-value-prop-preview
[I already use web sites and mobile services – how does App Service help me?]: /en-us/documentation/articles/app-service-mobile-value-prop-migration-from-mobile-services-preview
[Mobile App Server SDK]:  https://azure.microsoft.com/
[Get Started with Mobile Apps]: https://azure.microsoft.com/
[Get Started with Push]: https://azure.microsoft.com/
[Add authentication to your mobile app]: https://azure.microsoft.com/
[Azure Scheduler]: http://azure.microsoft.com/en-us/documentation/services/scheduler/
[Web Job]: /en-us/documentation/articles/websites-webjobs-resources/
[Register for notifications]: https://azure.microsoft.com/