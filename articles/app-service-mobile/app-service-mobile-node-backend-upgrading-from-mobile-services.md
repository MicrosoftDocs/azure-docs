<properties
	pageTitle="Upgrade from Mobile Services to Azure App Service - Node.js"
	description="Learn how to easily upgrade your Mobile Services application to an App Service Mobile App"
	services="app-service\mobile"
	documentationCenter=""
	authors="adrianhall"
	manager="ggailey"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile"
	ms.devlang="node"
	ms.topic="article"
	ms.date="05/05/2016"
	ms.author="adrianha"/>

# Upgrade your existing Node.js Azure Mobile Service to App Service

App Service Mobile is a new way to build mobile applications using Microsoft Azure. To learn more, see [What are Mobile Apps?].

This topic describes how to upgrade an existing Node.js backend application from Azure Mobile Services to a new App Service 
Mobile Apps. While you perform this upgrade, your existing Mobile Services application can continue to operate.  If you
need to upgrade a Node.js backend application, refer to [Upgrading your .NET Mobile Services](./app-service-mobile-net-upgrading-from-mobile-services.md).

When a mobile backend is upgraded to Azure App Service, it has access to all App Service features and are billed according to [App Service pricing], not Mobile Services pricing.

## Migrate vs. upgrade

[AZURE.INCLUDE [app-service-mobile-migrate-vs-upgrade](../../includes/app-service-mobile-migrate-vs-upgrade.md)]

>[AZURE.TIP] It is recommended that you [perform a migration](app-service-mobile-migrating-from-mobile-services.md) before going 
through an upgrade. This way, you can put both versions of your application on the same App Service Plan and incur no additional 
cost.

### Improvements in Mobile Apps Node.js server SDK

Upgrading to the new [Mobile Apps SDK](https://www.npmjs.com/package/azure-mobile-apps) provides a lot of improvements, including:

- Based on the [Express framework](http://expressjs.com/en/index.html), the new Node SDK is light-weight and designed to keep up 
with new Node versions as they come out. You can customize the application behavior with Express middleware.

- Significant performance improvements compared to the Mobile Services SDK.

- You can now host a website together with your mobile backend; similarly, it's easy to add the Azure Mobile SDK to any 
existing express.v4 application.

- Built for cross-platform and local development, the Mobile Apps SDK can be developed and run locally on Windows, Linux, 
and OSX platforms. It's now easy to use common Node development techniques like running [Mocha](https://mochajs.org/) tests 
prior to deployment.

## <a name="overview"></a>Basic upgrade overview

To aid in upgrading a Node.js backend, Azure App Service has provided a compatibility package.  After upgrade, you will have
a niew site that can be deployed to a new App Service site.

The Mobile Services client SDKs are **not** compatible with the new Mobile Apps server SDK. In order to provide continuity of 
service for your app, you should not publish changes to a site currently serving published clients. Instead, you should create 
a new mobile app that serves as a duplicate. You can put this application on the same App Service plan to avoid incurring 
additional financial cost.

You will then have two versions of the application: one that stays the same and serves published apps in the wild, and the 
other which you can then upgrade and target with a new client release. You can move and test your code at your pace, but you 
should make sure that any bug fixes you make get applied to both. Once you feel that a desired number of client apps in the 
wild have updated to the latest version, you can delete the original migrated app if you desire. It doesn't incur any additional 
monetary costs, if hosted in the same App Service plan as your Mobile App.

The full outline for the upgrade process is as follows:

1. Download your existing (migrated) Azure Mobile Service.
2. Convert the project to an Azure Mobile App using the compatibility package.
3. Correct any differences (such as authentication settings).
4. Deploy your converted Azure Mobile App project to a new App Service.
4. Release a new version of your client application that use the new Mobile App.
5. (Optional) Delete your original migrated mobile service app.

Deletion can occur when you don't see any traffic on your original migrated mobile service.

## <a name="install-npm-package"></a> Install the Pre-requisites

You should install [Node] on your local machine.  You should also install the compatibility package.  After Node is
installed, you can run the following command from a new cmd or PowerShell prompt:

```npm i -g azure-mobile-apps-compatibility```

## <a name="obtain-ams-scripts"></a> Obtain your Azure Mobile Services Scripts

- Log in to the [Azure Portal].
- Using **All Resources** or **App Services**, find your Mobile Services site.
- Within the site, click on **Tools** -> **Kudu** -> **Go** to open the Kudu site.
- Click on **Debug Console** -> **PowerShell** to open the Debug console.
- Navigate to `site/wwwroot/App_Data/config` by clicking on each directory in turn
- Click on the download icon next to the `scripts` directory.

This will download the scripts in ZIP format.  Create a new directory on your local machine and unpack the `scripts.ZIP` file 
within the directory.  This will create a `scripts` directory.

## <a name="scaffold-app"></a> Scaffold the new Azure Mobile Apps backend

Run the following command from the directory containing the scripts directory:

```scaffold-mobile-app scripts out```

This will create a scaffolded Azure Mobile Apps backend in the `out` directory.  Although not required, it's a good
idea to check the `out` directory into a source code repository of your choice.

## <a name="deploy-ama-app"></a> Deploy your Azure Mobile Apps backend

During deployment, you will need to do the following:

1. Create a new Mobile App in the [Azure Portal].
2. Run the `createViews.sql` script on your connected database.
3. Link the database that is linked to your Mobile Service to your new App Service.
4. Link any other resources (such as Notification Hubs) to the new App Service.
5. Deploy the generated code to your new site.

### Create a new Mobile App

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

### Run CreateViews.SQL

The scaffolded app contains a file called `createViews.sql`.  This script must be executed against the
target database.  The connection string for the target database can be obtained from your migrated mobile
service from the **Settings** blade under **Connection Strings**.  It is named `MS_TableConnectionString`.

You can run this script from within SQL Server Management Studio or Visual Studio.

### Link the Database to your App Service

Link the existing database to your App Service:

- In the [Azure Portal], open your App Service.
- Select **All Settings** -> **Data Connections**.
- Click on **+ Add**.
- In the drop-down, select **SQL Database**
- Under **SQL Database**, select your existing database, then click on **Select**.
- Under **Connection string**, enter the username and password for the database, then click on **OK**.
- In the **Add data connections** blade, click on **OK**.

The username and password can be found by viewing the Connection String for the target database in your 
migrated Mobile Service.


### Set up authentication

Azure Mobile Apps allows you to configure Azure Active Directory, Facebook, Google, Microsoft and Twitter
authentication within the service.  Custom authentication will need to be developed separately.  Refer to
the [Authentication Concepts] documentation and [Authentication Quickstart] documentation for more
information.  

## <a name="updating-clients"></a>Update Mobile clients

Once you have an operational Mobile App backend, you can work on a new version of your client application 
which consumes it. Mobile Apps also includes a new version of the client SDKs, and similar to the server 
upgrade above, you will need to remove all references to the Mobile Services SDKs before installing the
 Mobile Apps versions.

One of the main changes between the versions is that the constructors no longer require an application key. 
You now simply pass in the URL of your Mobile App. For example, on the .NET clients, the `MobileServiceClient` 
constructor is now:

        public static MobileServiceClient MobileService = new MobileServiceClient(
            "https://contoso.azurewebsites.net", // URL of the Mobile App
        );

You can read about installing the new SDKs and using the new structure via the links below:

- [Android version 2.2 or later](app-service-mobile-android-how-to-use-client-library.md)
- [iOS version 3.0.0 or later](app-service-mobile-ios-how-to-use-client-library.md)
- [.NET (Windows/Xamarin) version 2.0.0 or later](app-service-mobile-dotnet-how-to-use-client-library.md)
- [Apache Cordova version 2.0 or later](app-service-mobile-cordova-how-to-use-client-library.md)

If your application makes use of push notifications, make note of the specific registration instructions for 
each platform, as there have been some changes there as well.

When you have the new client version ready, try it out against your upgraded server project. After validating that 
it works, you can release a new version of your application to customers. Eventually, once your customers have had 
a chance to receive these updates, you can delete the Mobile Services version of your app. At this point, you have 
completely upgraded to an App Service Mobile App using the latest Mobile Apps server SDK.

<!-- URLs. -->

[Azure portal]: https://portal.azure.com/
[Azure classic portal]: https://manage.windowsazure.com/
[What are Mobile Apps?]: app-service-mobile-value-prop.md
[I already use web sites and mobile services – how does App Service help me?]: /en-us/documentation/articles/app-service-mobile-value-prop-migration-from-mobile-services
[Mobile App Server SDK]: https://www.npmjs.com/package/azure-mobile-apps
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
[Authentication Concepts]: ../app-service/app-service-authentication-overview.md
[Authentication Quickstart]: app-service-mobile-auth.md

[Azure Portal]: https://portal.azure.com/
[OData]: http://www.odata.org
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[basicapp sample on GitHub]: https://github.com/azure/azure-mobile-apps-node/tree/master/samples/basic-app
[todo sample on GitHub]: https://github.com/azure/azure-mobile-apps-node/tree/master/samples/todo
[samples directory on GitHub]: https://github.com/azure/azure-mobile-apps-node/tree/master/samples
[static-schema sample on GitHub]: https://github.com/azure/azure-mobile-apps-node/tree/master/samples/static-schema
[QueryJS]: https://github.com/Azure/queryjs
[Node.js Tools 1.1 for Visual Studio]: https://github.com/Microsoft/nodejstools/releases/tag/v1.1-RC.2.1
[mssql Node.js package]: https://www.npmjs.com/package/mssql
[Microsoft SQL Server 2014 Express]: http://www.microsoft.com/en-us/server-cloud/Products/sql-server-editions/sql-server-express.aspx
[ExpressJS Middleware]: http://expressjs.com/guide/using-middleware.html
[Winston]: https://github.com/winstonjs/winston
