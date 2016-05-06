<properties
	pageTitle="Upgrade from Mobile Services to Azure App Service - Node.js"
	description="Learn how to easily upgrade your Mobile Services application to an App Service Mobile App"
	services="app-service\mobile"
	documentationCenter=""
	authors="adrianhall"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile"
	ms.devlang="node"
	ms.topic="article"
	ms.date="02/09/2016"
	ms.author="chrande"/>

# Upgrade your existing Node.js Azure Mobile Service to App Service

App Service Mobile is a new way to build mobile applications using Microsoft Azure. To learn more, see [What are Mobile Apps?].

This topic describes how to upgrade an existing Node.js backend application from Azure Mobile Services to a new App Service Mobile Apps. While you perform this upgrade, your existing Mobile Services application can continue to operate.

When a mobile backend is upgraded to Azure App Service, it has access to all App Service features and are billed according to [App Service pricing], not Mobile Services pricing.

## Migrate vs. upgrade

[AZURE.INCLUDE [app-service-mobile-migrate-vs-upgrade](../../includes/app-service-mobile-migrate-vs-upgrade.md)]

>[AZURE.TIP] It is recommended that you [perform a migration](app-service-mobile-migrating-from-mobile-services.md) before going through an upgrade. This way, you can put both versions of your application on the same App Service Plan and incur no additional cost.

### Improvements in Mobile Apps Node.js server SDK

Upgrading to the new [Mobile Apps SDK](https://www.npmjs.com/package/azure-mobile-apps) provides a lot of improvements, including:

- Based on [Express framework](http://expressjs.com/en/index.html), the new Node SDK is light-weight and designed to keep up with new Node versions as they come out. You can customize the application behavior with Express middleware.

- Significant performance improvements compared to the Mobile Services SDK.

- You can now host a website together with your mobile backend; similarly, it's easy to add the Azure Mobile SDK to any existing expressv4 application.

- Built for cross-platform and local development, the Mobile Apps SDK can be developed and run locally on Windows, Linux, and OSX platforms. It's now easy to use common Node development techniques like running [Mocha](https://mochajs.org/) tests prior to deployment.

- You can use Redis with native modules like [hiredis](https://www.npmjs.com/package/hiredis).  There is no need to include binaries in your deployment packages as App Service will install your npm packages for you.

## <a name="overview"></a>Basic upgrade overview

Unlike the .NET Mobile Apps SDK, upgrading a Node backend from Mobile Services to Mobile Apps isn't as simple as swapping out packages. You now own your whole application stack, as opposed to Azure controlling it, and thus you need to create a basic Express app to host your mobile backend. For the table and API controllers, the concepts are similar, but you now must export table objects and the function APIs have changed somewhat. This article will walk through the basic strategies of upgrading, but before you migrate, you'll want to read the [Node Backend How-To](app-service-mobile-node-backend-how-to-use-server-sdk.md) prior to getting started.

>[AZURE.TIP] Please read and understand the rest of this topic completely before starting an upgrade. Make note of any features you use that are called out below.

The Mobile Services client SDKs are **not** compatible with the new Mobile Apps server SDK. In order to provide continuity of service for your app, you should not publish changes to a site currently serving published clients. Instead, you should create a new mobile app that serves as a duplicate. You can put this application on the same App Service plan to avoid incurring additional financial cost.

You will then have two versions of the application: one which stays the same and serves published apps in the wild, and the other which you can then upgrade and target with a new client release. You can move and test your code at your pace, but you should make sure that any bug fixes you make get applied to both. Once you feel that a desired number of client apps in the wild have updated to the latest version, you can delete the original migrated app if you desire. It doesn't incur any additional monetary costs, if hosted in the same App Service plan as your Mobile App.

The full outline for the upgrade process is as follows:

1. Create a new Mobile App.
2. Update the project to use the new Server SDKs.
3. Publish your project on the new Mobile App.
4. Release a new version of your client application that use the new Mobile App
5. (Optional) Delete your original migrated mobile service app.

Deletion can occur when you don't see any traffic on your original migrated mobile service app.

## <a name="mobile-app-version"></a> Starting the Upgrade
The first step in upgrading is to create the Mobile App resource which will host the new version of your application. If you have already migrated an existing mobile service, you will want to create this version on the same hosting plan. Open the [Azure portal] and navigate to your migrated application. Make note of the App Service Plan it is running on.

### Creating a second application instance
Next, create the second application instance. When prompted to select you App Service Plan or "hosting plan" choose the plan of your migrated application.

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

You will likely want to use the same database and Notification Hub as you did in Mobile Services. You can copy these values by opening [Azure portal] and navigating to the original application, then click **Settings** > **Application settings**. Under **Connection Strings**, copy `MS_NotificationHubConnectionString` and `MS_TableConnectionString`. Navigate to your new upgrade site and paste them in, overwriting any existing values. Repeat this process for any other application settings your app needs. If not using a migrated service, you can read connection strings and app settings from the **Configure** tab of the Mobile Services section of the [Azure portal].

### Create a basic Mobile App backend with Node

Every Azure App Service Mobile App Node.js backend starts as an ExpressJS application. You can create a basic [Express](http://expressjs.com/en/index.html) application as follows:

1. In a command or PowerShell window, create a new directory for your project.

        mkdir basicapp

2. Run npm init to initialize the package structure.

        cd basicapp
        npm init

    The npm init command will ask a set of questions to initialize the project.  See the example output below

    ![The npm init output][0]

3. Install the express and azure-mobile-apps libraries from the npm repository.

        npm install --save express azure-mobile-apps

4. Create an app.js file to implement the basic mobile server.

        var express = require('express'),
            azureMobileApps = require('azure-mobile-apps');

        var app = express(),
            mobile = azureMobileApps();

        // Important all tables in the 'tables' directory
        mobile.tables.import('./tables');
        mobile.api.import('./api');

        // Provide initialization of any tables that are statically defined
        mobile.tables.initialize().then(function () {
           // Add the mobile API so it is accessible as a Web API
           app.use(mobile);

           // Start listening on HTTP
           var port = process.env.PORT || 3000;
           app.listen(port, function () {
               console.log('Now listening on ', port)
           });
        });

For more samples, refer to our [GitHub repository](https://github.com/Azure/azure-mobile-apps-node/tree/master/samples).

## Updating the server project

Mobile Apps provides a new [Mobile App Server SDK] which provides much of the same functionality as the Mobile Services runtime, but now you own the full runtime; Mobile Apps doesn't force a Node version or any code updates for you. If you've followed the steps above, you have a basic version of the Node mobile runtime available. You can now start moving tables and API logic from your Mobile Service to your Mobile App, customizing your server configuration, enabling push, configuring authentication, and more.

### Base configuration

The server has lots of configuration settings, but has a variety of default values to make it easy to get started. Many of the settings will be set up for you, in the [Azure portal], via the **Data**, **Authentication/Authorization**, and **Push** settings menus. For local development, if you want use data, authentication, and push, you may need to configure your local development environment.

You can configure your server configuration via environment variables which you can set via App Settings in your Mobile App backend.

You can further customize the Mobile Apps SDK by passing a [configuration object](http://azure.github.io/azure-mobile-apps-node/global.html#configuration) to the initializer or [creating a file named azureMobile.js](app-service-mobile-node-backend-how-to-use-server-sdk.md#howto-config-localdev) in the root of the project.

### Working with Data & Tables

The SDK comes with an in-memory data provider to allow for quick and easy getting started experiences. You should switch to using a SQL DB early on, as the in-memory provider will lose all data on restart and doesn't stay consistent across multiple instances.

To start moving your business logic from your Mobile Service to Mobile Apps, you'll first want to create a file with your table's name (appended with '.js') in the `./tables` directory. You can see a full example of a Mobile App table on [GitHub](https://github.com/Azure/azure-mobile-apps-node/blob/master/samples/todo/tables/TodoItem.js). The simplest version is:

    var azureMobileApps = require('azure-mobile-apps');

    // Create a new table definition
    var table = azureMobileApps.table();

    module.exports = table;

To start porting some of your logic over, for each of your `<tablename>.<operation>.js`, you'll need a function for your table. Let's add a read function for an example.

In a Mobile Service with a TodoItem table and a read operation which filters items based on userid, like this:

    function(query, user, request) {
        query.where({ userId: user.userId});
        request.execute();
    }

The function we add to the Azure Mobile Apps table code would look like this:

    table.read(function (context) {
        context.query.where({ userId: context.user.id });
        return context.execute();
    });

The query, user and request are combined into a context.  The following fields are available within the context object:

| Field   | Type                   | Description |
| :------ | :--------------------- | :---------- |
| query   | queryjs/Query          | The parsed OData query |
| id      | string or number       | The ID associated with the request |
| item    | object                 | The item being inserted or deleted |
| req     | express.Request        | The current express request object |
| res     | express.Response       | The current express response object |
| data    | data                   | The configured data provider |
| tables  | function               | A function that accepts a string table name and returns a table access object |
| user    | auth/user              | The authenticated user object |
| results | object                 | The results of the execute operation |
| push    | NotificationHubService | The Notification Hubs Service, if configured |

For more information, refer to the [current API documentation](http://azure.github.io/azure-mobile-apps-node).

### CORS

CORS can be enabled via a [CORS configuration setting](http://azure.github.io/azure-mobile-apps-node/global.html#corsConfiguration) in the SDK.

The main areas of concern if using CORS are that the `eTag` and `Location` headers must be allowed in order for the client SDKs to work properly.

### Push Notifications

The Azure Notification Hubs SDK has had some significant updates since Mobile Services, so some Notification Hubs function signatures may be different. Otherwise, the functionality is similar to Mobile Services; the Azure Mobile SDK will provision a Notifications Hubs instance if the App Setting for Notifications Hubs exists, and expose it on `context.push`. A sample can be found on [GitHub](https://github.com/Azure/azure-mobile-apps-node/blob/master/samples/push-on-insert/tables/TodoItem.js), with the relevant section shown below shown below:

    table.insert(function (context) {
        // For details of the Notification Hubs JavaScript SDK,
        // see https://azure.microsoft.com/en-us/documentation/articles/notification-hubs-nodejs-how-to-use-notification-hubs/
        logger.silly('Running TodoItem.insert');

        // This push uses a template mechanism, so we need a template/
        var payload = '<toast><visual><binding template="Toast01"><text id="1">INSERT</text></binding></visual></toast>';

        // Execute the insert.  The insert returns the results as a Promise,
        // Do the push as a post-execute action within the promise flow.
        return context.execute()
            .then(function (results) {
                // Only do the push if configured
                if (context.push) {
                    context.push.wns.send(null, payload, 'wns/toast', function (error) {
                        if (error) {
                            logger.error('Error while sending push notification: ', error);
                        } else {
                            logger.silly('Push notification sent successfully!');
                        }
                    });
                }
                // Don't forget to return the results from the context.execute()
                return results;
            })
            .catch(function (error) {
                logger.error('Error while running context.execute: ', error);
            });
    });


### Scheduled Jobs
Scheduled jobs are not built into Mobile Apps, so any existing jobs that you have in your Mobile Service  backend will need to be upgraded individually. One option is to create a scheduled [Web Job] on the Mobile App code site. You could also set up an API that holds your job code and configure the [Azure Scheduler] to hit that endpoint on the expected schedule.

## <a name="authentication"></a>Authentication considerations

The authentication components of Mobile Services have now been moved into the App Service Authentication/Authorization feature. You can learn about enabling this for your site by reading the [Add authentication to your mobile app](app-service-mobile-ios-get-started-users.md) topic.

For some providers, such as AAD, Facebook, and Google, you should be able to leverage the existing registration from your copy application. You simply need to navigate to the identity provider's portal and add a new redirect URL to the registration. Then configure App Service Authentication/Authorization with the client ID and secret.

### Controller action authorization and user identity

To limit access to your table, you can set it at the table level with `table.access = 'authenticated';`. You can see a full example on [GitHub](https://github.com/Azure/azure-mobile-apps-node/blob/master/samples/authentication/tables/TodoItem.js).

You can get access to the user identity information via the `user.getIdentity` method described [here](http://azure.github.io/azure-mobile-apps-node/module-azure-mobile-apps_auth_user.html#~getIdentity).

## <a name="updating-clients"></a>Updating clients
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

<!-- Images -->
[0]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/npm-init.png

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
