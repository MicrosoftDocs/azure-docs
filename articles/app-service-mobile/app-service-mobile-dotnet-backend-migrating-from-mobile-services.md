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
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/25/2015"
	ms.author="mahender"/>

# Migrate your existing Azure mobile service to App Service

This topic shows you how to migrate an existing application from Azure Mobile Services to a new App Service Mobile App. Any existing mobile service can be easily migrated to a new Mobile App backend. During migration, the existing mobile service will continue to function.

When a mobile service is migrated to App Service, it has access to all App Service features and you are billed according to [App Service pricing], not Mobile Services pricing.

One other note is that any scheduled jobs will be moved from a Microsoft managed Azure Scheduler plan to an Azure Scheduler plan under your own subscription and control. Similar to the benefits of migrating to App Service, this lets you utilize the full power of Azure Scheduler.

### <a name="why-host"></a>Why host in App Service?

App Service provides a more feature-rich hosting environment for your application. By hosting in App Service, your service gets access to staging slots, custom domains, Traffic Manager support, and more. While you can upgrade a mobile service to a Mobile App backend once you've migrated to App Service, some customers may wish to take advantage of these features immediately, without performing the SDK update just yet.  

For more on the benefits of App Service, see [Mobile Services vs. App Service].

## Migrate vs. upgrade

[AZURE.INCLUDE [app-service-mobile-migrate-vs-upgrade](../../includes/app-service-mobile-migrate-vs-upgrade.md)]

- For Node.js-based server projects, the new [Mobile Apps Node.js SDK](https://github.com/Azure/azure-mobile-apps-node) provides a number of new features. For instance, you can now do local development and debugging, use any Node.js version above 0.10, and customize with any Express.js middleware.

- For .NET-based server projects, the new [Mobile Apps SDK NuGet packages](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server/) has more flexibility on NuGet dependencies, supports the new App Service authentication features, and composes with any ASP.NET project, including MVC. To learn more about upgrading, see [Upgrade your existing .NET Mobile Service to App Service](app-service-mobile-net-upgrading-from-mobile-services.md).


## <a name="understand"></a>Understanding App Service Mobile Apps

Mobile Apps in App Service is a new way to build mobile applications using Azure. You can learn more about Mobile Apps in [What are Mobile Apps?].

When migrating to Mobile Apps, all existing app functionality, including your business logic, can be preserved. Moreover, new features are available to the application. In the Mobile Apps model, your code actually runs on a web app in App Service, which is the new version of Azure Web Sites. You have full control over the web app and how it operates. In addition, web app features which were previously unavailable to Mobile Services customers, such as Traffic Manager and Development Slots, can now be used.

The main limitation to upgrading is that the Mobile Services scheduled jobs are not integrated, and either the Azure Scheduler must be set up to call custom APIs, or the Web Jobs features must be enabled.

## Migrating your Mobile Service with the Migrate to App Service wizard

The easiest and recommended way of migrating your mobile service to App Service by using the Migrate to App Service wizard, which is available in the Azure classic portal. Navigate to the [Azure classic portal],  browse your mobile services, and select a mobile service to migrate; on the bottom of the screen, you'll see a **Migrate to App Service** button that walks you through the process of migrating your mobile service.

### <a name="what-gets-migrated"></a>What gets migrated?

The migration wizard changes the server farms that host your mobile service from being managed by Mobile Services to being managed by App Service. It also moves any Scheduler plans that Mobile Services was managing from a Microsoft managed subscription to your subscription. When the server farms are transferred over to App Service's management control, all the Mobile Services that were associated with that server farm are moved at the same time.

Mobile Services organizes your mobile services into server farms based on region and SKU (free, basic, standard). All your free services in a region are on the same server farm and migrate together; some number of basic services in a region are hosted on the same farm together, but if you have a large number of basic services, they'll be on separate plans; each standard service is on its own server farm. If you ever want to migrate a single service or avoid having a service move with your other sites, you can upgrade it to basic and it will be on its own independent plan.

You'll also have Azure Scheduler plans added to your subscription, if you were using any scheduled jobs. There are a limited number of free scheduled jobs allowed per subscription, so there may be some costs associated with this that you'll want to review post subscription.

###  Using the migration wizard

1. Navigate to the [Azure classic portal] and click Mobile Services. 

2. Select the mobile service to migrate, then click "Migrate to App Service" on the bottom menu bar. This will present at pop up with the list of Mobile Services that will be migrated. See the [previous section](#what-gets-migrated) for details on what services will show up and why. 

3. Type the name of the mobile service to confirm the migration, then click the checkmark to proceed. When multiple mobile services are included in the migration, you must still type the name of the original service that was selected. 

4. After the migration has started, you can view the current status from the Mobile Services list in the [Azure classic portal]. It will show as "migrating" for all services currently being migrated. Once all migrations show as completed, you can view them in the [Azure portal] under Mobile Apps. During the migration and after, your mobile services will continue to function and the URL will not change.

## Manual migration for Mobile Services .NET backend

>[AZURE.NOTE] Please note that the recommended way of migrating a mobile service is via the Migrate to App Service wizard, described in the previous section. Manual migration should only be used in situations where the wizard cannot be used.

This section shows you how to host a .NET Mobile Services project within Azure App Service. An app hosted in this way can use all of the *Mobile Services* .NET runtime tutorials, although it is necessary to substitute any URL using the azure-mobile.net domain with the domain of the App Service instance.

A Mobile Services project can also be hosted in an [App Service Environment]. All of the content in this topic still applies, but the site will have the form `contoso.contosoase.p.azurewebsites.net` instead of `contoso.azurewebsites.net`.

>[AZURE.NOTE] If you perform a manual migration, you *cannot* preserve your existing **service.azure-mobile.net** URL. When you have mobile clients that are connecting to this URL, you should either use the automatic migration option or keep your mobile service running until all mobile clients have upgraded to the new URL.


### <a name="app-settings"></a>Application Settings
Mobile Services requires several application settings to be available in the environment, which are described in this section.

In order to set the application settings on your Mobile App backend, first sign into the [Azure portal]. Navigate to the App Service app you wish to use as your Mobile App backend, click **Settings** > **Application Settings**, then scroll down to **App settings**, which is where you can set the following required key-value pairs:

+ **MS_MobileServiceName** should be set to the name of your app. For example, when the URL of your backend is `contoso.azurewebsites.net`, then *contoso* is the correct value.

+ **MS_MobileServiceDomainSuffix** should be set to the name of your web app. For example, when the URL of your backend is `contoso.azurewebsites.net`, then *azurewebsites.net* is the correct value.

+ **MS_ApplicationKey** can be set to any value, but it must be the same value used by the client SDK. A GUID is recommended.

+ **MS_MasterKey** can be set to any value, but it must be the same value used by any admin APIs/clients. A GUID is recommended.

When migrating a mobile service, both the master key and the application key can be obtained from the **Configure** tab of the Mobile Services section of the [Azure classic portal]. Click **Manage Keys** at the bottom and copy the keys.


### <a name="client-sdk"></a>How to: Modify the client SDK

In the client app project, modify the constructor of the Mobile Services client object to accept the new app URL (e.g., `https://contoso.azurewebsites.net`) and the application key configured earlier. The client SDK version should be a **Mobile Services** version and should **not** be upgraded. For iOS and Android clients, use 2.x versions, and for Windows/Xamarin, use 1.3.2. Javascript clients should be using 1.2.7.

### <a name="data"></a>How to: Enable data features

To work with the default Entity Framework classes in Mobile Services, two additional settings are needed.

Connection strings are stored in the **Connection strings** section of the Application Settings blade, just below the **App settings** section. The connection string for your database should be set under the **MS_TableConnectionString** key. When migrating an existing mobile service to App Service, navigate to the **Connection Strings** section of the mobile service's **Configure** tab in the [Azure classic portal](https://manage.windowsazure.com/). Click **Show Connection Strings** and copy the value.

By default, the schema to be used is **MS_MobileServiceName**, but this can be overwritten with the **MS_TableSchema** setting. Back under **App settings** set **MS_TableSchema** to be the name of the schema to be used. If you are moving over an existing Mobile Services application, a schema was already created using Entity Framework - this is the name of the mobile service, not the App Service instance that will be hosting the code now.

### <a name="push"></a>How to: Enable push features

For push to work, the web app also needs to know information about the notification hub.

Under **Connection strings**, set **MS_NotificationHubConnectionString** with the DefaultFullSharedAccessSignature connection string of the notification hub. To migrate an existing mobile service, navigate to the **Connection Strings** section of the mobile services **Configure** tab in the [Azure classic portal](https://manage.windowsazure.com/). Click **Show Connection Strings** and copy the value.

The **MS_NotificationHubName** app setting should be set to the name of the hub. When moving an existing mobile service, you can get this value from the mobile service's **Push** tab in the [Azure classic portal](https://manage.windowsazure.com/). The other fields on this tab are linked to the hub itself and do not need to be copied anywhere.

### <a name="auth"></a>How to: Enable auth features

The identity features also have app setting requirements for the individual providers. If moving from an existing mobile service, each of the fields in the **Identity** tab in the Azure classic portal has a corresponding app setting.

Microsoft Account

* **MS_MicrosoftClientID**

* **MS_MicrosoftClientSecret**

* **MS_MicrosoftPackageSID**

Facebook

* **MS_FacebookAppID**

* **MS_FacebookAppSecret**

Twitter

* **MS_TwitterConsumerKey**

* **MS_TwitterConsumerSecret**

Google

* **MS_GoogleClientID**

* **MS_GoogleClientSecret**

AAD

* **MS_AadClientID**

* **MS_AadTenants** - Note: **MS_AadTenants** is stored as a comma-separated list of tenant domains (the **Allowed Tenants** fields in the Azure classic portal).

### <a name="publish"></a>How to: Publish the mobile service project

1. In the [Azure portal], navigate to your app, click **Get publish profile** in the command bar, and save the downloaded profile to the local machine.
2. In Visual Studio, right click on the Mobile Services server project, then click **Publish**. 
3. On the profile tab, choose **Import** and browse to the downloaded profile.
3. Click **Publish** to deploy the code to App Service.

Logs are handled via the standard App Service logging features. To learn more about logging, see [Enable diagnostics logging in Azure App Service].



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
[Send cross-platform push notifications]: app-service-mobile-xamarin-ios-push-notifications-to-user.md
[How to use the .NET server SDK]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md


[Enable diagnostics logging in Azure App Service]: web-sites-enable-diagnostic-log.md
[App Service pricing]: https://azure.microsoft.com/en-us/pricing/details/app-service/
[App Service Environment]: app-service-app-service-environment-intro.md
[Mobile Services vs. App Service]: app-service-mobile-value-prop-migration-from-mobile-services-preview.md
[migrate a mobile service to a mobile app on App Service]: app-service-mobile-dotnet-backend-migrating-from-mobile-services.md
