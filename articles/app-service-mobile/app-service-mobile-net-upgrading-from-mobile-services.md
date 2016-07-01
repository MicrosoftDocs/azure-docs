<properties
	pageTitle="Upgrade from Mobile Services to Azure App Service"
	description="Learn how to easily upgrade your Mobile Services application to an App Service Mobile App"
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
	ms.date="06/28/2016"
	ms.author="mahender"/>

# Upgrade your existing .NET Azure Mobile Service to App Service

App Service Mobile is a new way to build mobile applications using Microsoft Azure. To learn more, see [What are Mobile Apps?].

This topic describes how to upgrade an existing .NET backend application from Azure Mobile Services to a new App Service Mobile Apps. While you perform this upgrade, your existing Mobile Services application can continue to operate.

When a mobile backend is upgraded to Azure App Service, it has access to all App Service features and are billed according to [App Service pricing], not Mobile Services pricing.

##Migrate vs. upgrade

[AZURE.INCLUDE [app-service-mobile-migrate-vs-upgrade](../../includes/app-service-mobile-migrate-vs-upgrade.md)]

>[AZURE.TIP] It is recommended that you [perform a migration](app-service-mobile-migrating-from-mobile-services.md) before going through an upgrade. This way, you can put both versions of your application on the same App Service Plan and incur no additional cost.

###Improvements in Mobile Apps .NET server SDK

Upgrading to the new [Mobile Apps SDK](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server/) provides the following benefits:

- More flexibility on NuGet dependencies. The hosting environment no longer provides its own versions of NuGet packages, so you can use alternative compatible versions. However, if there are new critical bugfixes or security updates to the Mobile Server SDK or dependencies, you must update your service manually.

- More flexibility in the mobile SDK. You can explicitly control which features and routes are set up, such as authentication, table APIs, and the push registration endpoint. To learn more, see [How to use the .NET server SDK for Azure Mobile Apps](app-service-mobile-net-upgrading-from-mobile-services.md#server-project-setup).

- Support for other ASP.NET project types and routes. You can now host MVC and Web API controllers in the same project as your mobile backend project.

- Support for new App Service authentication features, which allow you to use a common authentication configuration across your web and mobile apps.

##<a name="overview"></a>Basic upgrade overview

In many cases, upgrading will be as simple as switching to the new Mobile Apps server SDK and republishing your code onto a new Mobile App instance. There are, however some scenarios which will require some additional configuration, such as advanced authentication scenarios and working with scheduled jobs. Each of these is covered in the later sections.

>[AZURE.TIP] It is advised that you read and understand the rest of this topic completely before starting an upgrade. Make note of any features you use which are called out below.

The Mobile Services client SDKs are **not** compatible with the new Mobile Apps server SDK. In order to provide continuity of service for your app, you should not publish changes to a site currently serving published clients. Instead, you should create a new mobile app that serves as a duplicate. You can put this application on the same App Service plan to avoid incurring additional financial cost.

You will then have two versions of the application: one which stays the same and serves published apps in the wild, and the other which you can then upgrade and target with a new client release. You can move and test your code at your pace, but you should make sure that any bug fixes you make get applied to both. Once you feel that a desired number of client apps in the wild have updated to the latest version, you can delete the original migrated app if you desire.

The full outline for the upgrade process is as follows:

1. Create a new Mobile App
2. Update the project to use the new Server SDKs
3. Release a new version of your client application
4. (Optional) Delete your original migrated instance

##<a name="mobile-app-version"></a>Creating a second application instance
The first step in upgrading is to create the Mobile App resource which will host the new version of your application. If you have already migrated an existing mobile service, you will want to create this version on the same hosting plan. Open the [Azure portal] and navigate to your migrated application. Make note of the App Service Plan it is running on.

Next, create the second application instance by following the [.NET backend creation instructions](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#create-app). When prompted to select you App Service Plan or "hosting plan" choose the plan of your migrated application.

You will likely want to use the same database and Notification Hub as you did in Mobile Services. You can copy these values by opening [Azure portal] and navigating to the original application, then click **Settings** > **Application settings**. Under **Connection Strings**, copy `MS_NotificationHubConnectionString` and `MS_TableConnectionString`. Navigate to your new upgrade site and paste them in, overwriting any existing values. Repeat this process for any other application settings your app needs. If not using a migrated service, you can read connection strings and app settings from the **Configure** tab of the Mobile Services section of the [Azure classic portal].

Make a copy of the ASP.NET project for your application and publish it to your new site. Using a copy of your client application updated with the new URL, validate that everything works as expected.

## Updating the server project

Mobile Apps provides a new [Mobile App Server SDK] which provides much of the same functionality as the Mobile Services runtime. First, you should remove all references to the Mobile Services packages. In the NuGet package manager, search for `WindowsAzure.MobileServices.Backend`. Most apps will see several packages here, including `WindowsAzure.MobileServices.Backend.Tables` and `WindowsAzure.MobileServices.Backend.Entity`. In such a case, start with the lowest package in the dependency tree, such as `Entity`, and remove it. When prompted, do not remove all dependant packages. Repeat this process until you have removed `WindowsAzure.MobileServices.Backend` itself.

At this point you will have a project that no longer references Mobile Services SDKs.

Next you will add references the Mobile Apps SDK. For this upgrade, most developers will want to download and install the `Microsoft.Azure.Mobile.Server.Quickstart` package, as this will pull in the entire required set.

There will be quite a few compiler errors resulting from differences between the SDKs, but these are easy to address and are covered in the rest of this section.

### Base configuration

Then, in WebApiConfig.cs, you can replace:

        // Use this class to set configuration options for your mobile service
        ConfigOptions options = new ConfigOptions();

        // Use this class to set WebAPI configuration options
        HttpConfiguration config = ServiceConfig.Initialize(new ConfigBuilder(options));

with

        HttpConfiguration config = new HttpConfiguration();
        new MobileAppConfiguration()
            .UseDefaultConfiguration()
        .ApplyTo(config);

>[AZURE.NOTE] If you wish to learn more about the new .NET server SDK and how to add/remove features from your app, please see the [How to use the .NET server SDK] topic.

If your app makes use of the authentication features, you will also need to register an OWIN middleware. In this case, you should move the above configuration code into a new OWIN Startup class.

1. Add the NuGet package `Microsoft.Owin.Host.SystemWeb` if it is not already included in your project.
2. In Visual Studio, right click on your project and select **Add** -> **New Item**. Select **Web** -> **General** -> **OWIN Startup class**.
3. Move the above code for MobileAppConfiguration from `WebApiConfig.Register()` to the `Configuration()` method of your new startup class.

Make sure the `Configuration()` method ends with:

        app.UseWebApi(config)
        app.UseAppServiceAuthentication(config);

There are additional changes related to authentication which are covered in the full authentication section below.

### Working with Data

In Mobile Services, the mobile app name served as the default schema name in the Entity Framework setup.

To ensure that you have the same schema being referenced as before, use the following to set the schema in the DbContext for your application:

        string schema = System.Configuration.ConfigurationManager.AppSettings.Get("MS_MobileServiceName");

Please make sure you have MS_MobileServiceName set if you do the above. You can also provide another schema name if your application customized this previously.

### System Properties

#### Naming

In the Azure Mobile Services server SDK, system properties always contain a double underscore (`__`) prefix for the properties:

- __createdAt
- __updatedAt
- __deleted
- __version

The Mobile Services client SDKs have special logic for parsing system properties in this format.

In Azure Mobile Apps, system properties no longer have a special format and have the following names:

- createdAt
- updatedAt
- deleted
- version

The Mobile Apps client SDKs use the new system properties names, so no changes are required to client code. However, if you are directly making REST calls to your service then you should change your queries accordingly.

#### Local store

The changes to the names of system properties mean that an offline sync local database for Mobile Services is not compatible with Mobile Apps. If possible, you should avoid upgrading client apps from Mobile Services to Mobile Apps until after pending changes have been sent to the server. Then, the upgraded app should use a new database filename.

If a client app is upgraded from Mobile Services to Mobile Apps while there are pending offline changes in the operation queue, then the system database must be updated to use the new column names. On iOS, this can be achieved using lightweight migrations to change the column names. On Android and the .NET managed client, you should write custom SQL to rename the columns for your data object tables.

On iOS, you should change your Core Data schema for your data entities to match the following. Note that the properties `createdAt`, `updatedAt` and `version` no longer have an `ms_` prefix:

| Attribute |  Type   | Note                                                 |
|---------- |  ------ | -----------------------------------------------------|
| id        | String, marked required  | primary key in remote store         |
| createdAt | Date    | (optional) maps to createdAt system property         |
| updatedAt | Date    | (optional) maps to updatedAt system property         |
| version   | String  | (optional) used to detect conflicts, maps to version |

#### Querying system properties

In Azure Mobile Services, system properties are not sent by default, but only when they are requested using the query string `__systemProperties`. In contrast, in Azure Mobile Apps system properties are **always selected** since they are part of the server SDK object model.

This change mainly impacts custom implementations of domain managers, such as extensions of `MappedEntityDomainManager`. In Mobile Services, if a client never requests any system properties, it is possible to use a `MappedEntityDomainManager` that does not actually map all properties. However, in Azure Mobile Apps, these unmapped properties will cause an error in GET queries.

The easiest way to resolve the issue is to modify your DTOs so that they inherit from `ITableData` instead of `EntityData`. Then, add the `[NotMapped]` attribute to the fields that should be omitted.

For example, the following defines `TodoItem` with no system properties:

    using System.ComponentModel.DataAnnotations.Schema;

    public class TodoItem : ITableData
    {
        public string Text { get; set; }

        public bool Complete { get; set; }

        public string Id { get; set; }

        [NotMapped]
        public DateTimeOffset? CreatedAt { get; set; }

        [NotMapped]
        public DateTimeOffset? UpdatedAt { get; set; }

        [NotMapped]
        public bool Deleted { get; set; }

        [NotMapped]
        public byte[] Version { get; set; }
    }

Note: if you get errors on `NotMapped`, add a reference to the assembly `System.ComponentModel.DataAnnotations`.

### CORS

Mobile Services included some support for CORS by wrapping the ASP.NET CORS solution. This wrapping layer has been removed to give the developer more control, so you can directly leverage [ASP.NET CORS support](http://www.asp.net/web-api/overview/security/enabling-cross-origin-requests-in-web-api).

The main areas of concern if using CORS are that the `eTag` and `Location` headers must be allowed in order for the client SDKs to work properly.

### Push Notifications
For push, the main item that you may find missing from the Server SDK is the PushRegistrationHandler class. Registrations are handled slightly differently in Mobile Apps, and tagless registrations are enabled by default. Managing tags may be accomplished by using custom APIs. Please see the [registering for tags](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#tags) instructions for more information.

### Scheduled Jobs
Scheduled jobs are not built into Mobile Apps, so any existing jobs that you have in your .NET backend will need to be upgraded individually. One option is to create a scheduled [Web Job] on the Mobile App code site. You could also set up a controller that holds your job code and configure the [Azure Scheduler] to hit that endpoint on the expected schedule.

### Miscellaneous changes
All ApiControllers which will be consumed by a mobile client must now have the `[MobileAppController]` attribute. This is no longer included by default so that other ApiControllers to go unaffected by the mobile formatters.

The `ApiServices` object is no longer part of the SDK. To access Mobile App settings, you can use the following:

    MobileAppSettingsDictionary settings = this.Configuration.GetMobileAppSettingsProvider().GetMobileAppSettings();

Similarly, logging is now accomplished using the standard ASP.NET trace writing:

    ITraceWriter traceWriter = this.Configuration.Services.GetTraceWriter();
    traceWriter.Info("Hello, World");  

##<a name="authentication"></a>Authentication considerations

The authentication components of Mobile Services have now been moved into the App Service Authentication/Authorization feature. You can learn about enabling this for your site by reading the [Add authentication to your mobile app](app-service-mobile-ios-get-started-users.md) topic.

For some providers, such as AAD, Facebook, and Google, you should be able to leverage the existing registration from your copy application. You simply need to navigate to the identity provider's portal and add a new redirect URL to the registration. Then configure App Service Authentication/Authorization with the client ID and secret.

### Controller action authorization
Any instances of the `[AuthorizeLevel(AuthorizationLevel.User)]` attribute must now be changed to use the standard ASP.NET `[Authorize]` attribute. Additionally, controllers are now Anonymous by default, as in other ASP.NET applications.
If you were using one of the other AuthorizeLevel options, such as Admin or Application, please note that these are gone. You can instead set up AuthorizationFilters for shared secrets or configure an AAD Service Principal to enable service-to-service calls securely.

### Getting additional user information

You can get additional user information, including access tokens through the `GetAppServiceIdentityAsync()` method:

        FacebookCredentials creds = await this.User.GetAppServiceIdentityAsync<FacebookCredentials>();

Additionally, if your application takes dependencies on user IDs, such as storing them in a database, it is important to note that the user IDs between Mobile Services and App Service Mobile Apps are different. You can still get the Mobile Services User ID, though. All of the ProviderCredentials subclasses have a UserId property. So continuing from the example before:

        string mobileServicesUserId = creds.Provider + ":" + creds.UserId;

If your app does take any dependencies on user IDs, it is important that you leverage the same registration with an identity provider if possible. User IDs are typically scoped to the application registration that was used, so introducing a new registration could create problems with matching users to their data.

### Custom authentication

If your app is using a custom authentication solution, you will want to make sure that the upgraded site has access to the system. Follow the new instructions for custom authentication in the [.NET server SDK overview] to integrate your solution. Please note that the custom authentication components are still in preview.

##<a name="updating-clients"></a>Updating clients
Once you have an operational Mobile App backend, you can work on a new version of your client application which consumes it. Mobile Apps also includes a new version of the client SDKs, and similar to the server upgrade above, you will need to remove all references to the Mobile Services SDKs before installing the Mobile Apps versions.

One of the main changes between the versions is that the constructors no longer require an application key. You now simply pass in the URL of your Mobile App. For example, on the .NET clients, the `MobileServiceClient` constructor is now:

        public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://contoso.azurewebsites.net", // URL of the Mobile App
        );

You can read about installing the new SDKs and using the new structure via the links below:

- [iOS version 3.0.0 or later](app-service-mobile-ios-how-to-use-client-library.md)
- [.NET (Windows/Xamarin) version 2.0.0 or later](app-service-mobile-dotnet-how-to-use-client-library.md)

If your application makes use of push notifications, make note of the specific registration instructions for each platform, as there have been some changes there as well.

When you have the new client version ready, try it out against your upgraded server project. After validating that it works, you can release a new version of your application to customers. Eventually, once your customers have had a chance to receive these updates, you can delete the Mobile Services version of your app. At this point, you have completely upgraded to an App Service Mobile App using the latest Mobile Apps server SDK.

<!-- URLs. -->

[Azure portal]: https://portal.azure.com/
[Azure classic portal]: https://manage.windowsazure.com/
[What are Mobile Apps?]: app-service-mobile-value-prop.md
[I already use web sites and mobile services – how does App Service help me?]: /en-us/documentation/articles/app-service-mobile-value-prop-migration-from-mobile-services
[Mobile App Server SDK]: http://www.nuget.org/packages/microsoft.azure.mobile.server
[Create a Mobile App]: app-service-mobile-xamarin-ios-get-started.md
[Add push notifications to your mobile app]: app-service-mobile-xamarin-ios-get-started-push.md
[Add authentication to your mobile app]: app-service-mobile-xamarin-ios-get-started-users.md
[Azure Scheduler]: /en-us/documentation/services/scheduler/
[Web Job]: ../app-service-web/websites-webjobs-resources.md
[How to use the .NET server SDK]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
[Migrate from Mobile Services to an App Service Mobile App]: app-service-mobile-migrating-from-mobile-services.md
[Migrate your existing Mobile Service to App Service]: app-service-mobile-migrating-from-mobile-services.md
[App Service pricing]: https://azure.microsoft.com/en-us/pricing/details/app-service/
[.NET server SDK overview]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md
