<properties 
	pageTitle="Migrate from Mobile Services to an App Service Mobile App" 
	description="Learn how to easily migrate your Mobile Services application to an App Service Mobile App" 
	services="app-service\mobile" 
	documentationCenter="" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="08/11/2015" 
	ms.author="mahender"/>

# Migrate your existing Azure Mobile Service to an Azure App Service Mobile App

This topic shows you how to migrate an existing application from Azure Mobile Services to a new App Service Mobile App. All existing Mobile Services apps can be easily migrated to a new App Service Mobile app. During a migration, your existing Mobile Services application can continue to operate. Over time, the process for migrating will become even easier, but for those who wish to migrate today, the following steps can be used.

>[AZURE.NOTE] Migrations are currently only supported for customers using the Mobile Services .NET backend. Applications using the Node.JS backend will need to stay on Mobile Services at this time.

##<a name="understand"></a>Understanding App Service Mobile Apps

App Service Mobile Apps is a new way to build mobile applications using Microsoft Azure. You can learn more about Mobile Apps in the [What are Mobile Apps?] topic.

In a migration to Mobile Apps, all existing app functionality (and code) can be preserved. Moreover, new features are available to the application. In the Mobile Apps model, your code actually runs on a Web App (the new version of Azure Web Sites). You have full control over the web app and how it operates. In addition, Web Apps features which were previously unavailable to Mobile Services customers, such as Traffic Manager and Development Slots, can now be used. 

The new model also addresses one of the major difficulties of working with Mobile Services. Now, any version of any NuGet package can be deployed without worrying about dependency conflicts. More about the benefits of migrating can be found in the [I already use web sites and mobile services – how does App Service help me?] topic.

##<a name="overview"></a>Basic migration overview
The simplest way to migrate is to create a new instance of an App Service Mobile App. In many cases, migrating will be as simple as switching to the new Server SDK and republishing your code onto a new Mobile App. There are, however some scenarios which will require some additional configuration, such as advanced authentication scenarios and working with scheduled jobs. Each of these is covered in the following sections.

>[AZURE.NOTE] It is advised that you read and understand the rest of this topic completely before starting a migration. Make note of any features you use which are called out below.

You can move and test your code at your pace. When the Mobile App backend is ready, you can release a new version of your client application. At this point, you will have two copies of your application backend running side by side. You need to make sure any bug fixes you make get applied to both. Finally, once your users have updated to the newest version, you can delete the original Mobile Service.

The full set of steps for this migration is as follows:

1. Create and configure a new Mobile App
2. Address any authentication concerns
3. Release a new version of your client application
4. Delete your original Mobile Services instance


##<a name="mobile-app-version"></a>Setting up a Mobile App version of your application
The first step in migrating is to create the Mobile App resource which will host the new version of your application. You can create a new Mobile App in the [Preview Azure Management Portal]. You can consult the [Create a Mobile App] topic for further detail.

You will likely want to use the same database and Notification Hub as you did in Mobile Services. You can copy these values from the **Configure** tab of the Mobile Services section of the [Azure Management Portal]. Under **Connection Strings**, copy `MS_NotificationHubConnectionString` and `MS_TableConnectionString`. Navigate to your Mobile App site and select **Settings**, **Application settings**, and add these to the **Connection strings** section, overwriting any existing values.

Mobile Apps provides a new [Mobile App Server SDK] which provides much of the same functionality as the Mobile Services runtime. First, you should remove the Mobile Services NuGet from your existing project and instead include the Server SDK. For this migration, most developers will want to download install the `Microsoft.Azure.Mobile.Server.Quickstart` package, as this will pull in the entire required set. Then, in WebApiConfig.cs, you can replace 

    // Use this class to set configuration options for your mobile service
    ConfigOptions options = new ConfigOptions();
    
    // Use this class to set WebAPI configuration options
    HttpConfiguration config = ServiceConfig.Initialize(new ConfigBuilder(options));

with

    HttpConfiguration config = new HttpConfiguration();

    new MobileAppConfiguration()
	    .UseDefaultConfiguration()
	    .ApplyTo(config);


>[AZURE.NOTE] If you wish to learn more about the new Server SDK and how to add/remove features from your app, please see the [How to use the .NET server SDK] topic.

There are a few other changes between the Mobile Services and Mobile Apps SDKs, but they are easy to address. Throughout your project, you may need to modify some using statements, with which Visual Studio will assist.

You need to add the `[MobileAppController]` attribute to all of your ApiControllers, simply by placing that decorator directly before the class definition.

There is no longer an `[AuthorizeLevel]` attribute, and you should instead decorate your controllers and methods with the standard ASP.NET `[Authorize]` attribute. Note also that any controller that did not have an `[AuthorizeLevel]` is no longer protected by an application key; it will be treated as public. The new SDK no longer makes use of an Application Key and Master Key.

For push, the main item that you may find missing from the Server SDK is the PushRegistrationHandler class. Registrations are handled slightly differently in Mobile Apps, and tagless registrations are enabled by default. Managing tags may be accomplished by using custom APIs. Please see the [Add push notifications to your mobile app] topic for more information.

Scheduled jobs are not built into Mobile Apps, so any existing jobs that you have in your .NET backend will need to be migrated individually. One option is to create a scheduled [Web Job] on the Mobile App code site. You could also set up a controller that holds your job code and configure the [Azure Scheduler] to hit that endpoint on the expected schedule.

The `ApiServices` object is no longer part of the SDK. To access Mobile App settings, you can use the following:

    MobileAppSettingsDictionary settings = this.Configuration.GetMobileAppSettingsProvider().GetMobileAppSettings(); 

Similarly, logging is now accomplished using the standard ASP.NET trace writing:

    ITraceWriter traceWriter = this.Configuration.Services.GetTraceWriter();
    traceWriter.Info("Hello, World");  

##<a name="authentication"></a>Authentication considerations
One of the biggest differences between Mobile Apps and Mobile Services is that login is now handled by the App Service Gateway in the case of Mobile Apps, not the site running your code. If your resource group does not already have one, you can provision a gateway by navigating to your Azure Mobile App in the management portal. Then select **Settings**, and then **User authentication** under the **Mobile** category. Click **Create** to associate a gateway with your Mobile App.

Beyond this, most applications will require no additional action, but there are a few advanced scenarios which should be noted.

Most apps will be fine to simply use a new registration with the target identity provider, and you can learn about adding identity to an App Service app by following the [Add authentication to your mobile app] tutorial.

If your application takes dependencies on user IDs, such as storing them in a database, it is important to note that the user IDs between Mobile Services and App Service Mobile Apps are different. However, it is possible to get the Mobile Services User ID in your App Service Mobile App application by using the following (with Facebook as an example):

    MobileAppUser = (MobileAppUser) this.User;
    FacebookCredentials creds = await user.GetIdentityAsync<FacebookCredentials>();
    string mobileServicesUserId = creds.Provider + ":" + creds.UserId;

Additionally, if you take any dependencies on user IDs, it is important that you leverage the same registration with an identity provider  if possible. User IDs are typically scoped to the application registration that was used, so introducing a new registration could create problems with matching users to their data. Should your application need to use the same identity provider registration for any reason, you can use the following steps:

1. Copy over the Client ID and Client secret connection information for each provider used by your application.
2. Add the gateway's /signin-* endpoints as an additional redirect URI for each provider. 

>[AZURE.NOTE] Some providers, such as Twitter and Microsoft Account, do not allow you to specify multiple redirect URIs on different domains. If your app uses one of these providers and takes a dependency on user IDs, it is advised that you do not attempt to migrate at this time.

##<a name="updating-clients"></a>Updating clients
Once you have an operational Mobile App backend, you can update your client application to consume the new Mobile App. Mobile Apps will also include a new version of the Mobile Services client SDKs, which will allow developers to take advantage of new App Service features. Once you have a Mobile App version of your backend, you can release a new version of your client application which leverages the new SDK version.

The main change that will be required of your client code is in the constructor. In addition to the URL of your Mobile App site, you need to provide the URL of the App Service Gateway which hosts your authentication settings:

    public static MobileServiceClient MobileService = new MobileServiceClient(
        "https://contoso.azurewebsites.net", // URL of the Mobile App
        "https://contoso-gateway.azurewebsites.net", // URL of the App Service Gateway
        "" // Formerly app key. To be removed in future client SDK update
    );

This will allow the client to route requests to the components of your Mobile App. You can find more details specific to your target platform using the appropriate [Create a Mobile App] topic.

In the same update, you will need to adjust any push notification registration calls that you make. There are new APIs which make improvements to the registration process (using Windows as an example):

    var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
    await MobileService.GetPush().Register(channel.Uri); 

Please see the [Add push notifications to your mobile app] and [Send cross-platform push notifications] topics for details specific to your target platform.

Once your customers have had a chance to receive these updates, you can delete the Mobile Services version of your app. At this point, you have completely migrated to an App Service Mobile App.

<!-- URLs. -->

[Preview Azure Management Portal]: https://portal.azure.com/
[Azure Management Portal]: https://manage.windowsazure.com/
[What are Mobile Apps?]: app-service-mobile-value-prop-preview.md
[I already use web sites and mobile services – how does App Service help me?]: /en-us/documentation/articles/app-service-mobile-value-prop-migration-from-mobile-services-preview
[Mobile App Server SDK]: http://www.nuget.org/packages/microsoft.azure.mobile.server
[Create a Mobile App]: app-service-mobile-dotnet-backend-xamarin-ios-get-started-preview.md
[Add push notifications to your mobile app]: app-service-mobile-dotnet-backend-xamarin-ios-get-started-push-preview.md
[Add authentication to your mobile app]: app-service-mobile-dotnet-backend-xamarin-ios-get-started-users-preview.md
[Azure Scheduler]: /en-us/documentation/services/scheduler/
[Web Job]: ../app-service-web/websites-webjobs-resources.md
[Send cross-platform push notifications]: app-service-mobile-dotnet-backend-xamarin-ios-push-notifications-to-user-preview.md 
[How to use the .NET server SDK]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
