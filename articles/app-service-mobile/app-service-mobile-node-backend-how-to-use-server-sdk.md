<properties
	pageTitle="How to work with the Node.js backend server SDK for Mobile Apps | Azure App Service"
	description="Learn how to work with the Node.js backend server SDK for Azure App Service Mobile Apps."
	services="app-service\mobile"
	documentationCenter=""
	authors="adrianhall"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-multiple"
	ms.devlang="node"
	ms.topic="article"
	ms.date="12/02/2015"
	ms.author="adrianhall"/>

# How to use the Azure Mobile Apps Node.js SDK

[AZURE.INCLUDE [app-service-mobile-selector-server-sdk](../../includes/app-service-mobile-selector-server-sdk.md)]
&nbsp;

[AZURE.INCLUDE [app-service-mobile-note-mobile-services](../../includes/app-service-mobile-note-mobile-services.md)]

This article provides detailed information and examples showing how to work with a Node.js backend in Azure App Service Mobile Apps.

> [AZURE.NOTE] This SDK is in PREVIEW.  As a result, we do not recommend that you use this SDK in production.  The examples in this document use v2.0.0-beta1 of [azure-mobile-apps].

## <a name="Introduction"></a>Introduction

Azure App Service Mobile Apps provides the capability to add a mobile-optimized data access Web API to a web application.  The Azure App
Service Mobile Apps SDK is provided for ASP.NET and Node.js web applications.  The SDK provides the following operations:

- Table operations (Read, Insert, Update, Delete) for data access
- Custom API operations

Both operations provide for authentication across all identity providers allowed by Azure App Service, including social identity
providers such as Facebook, Twitter, Google and Microsoft as well as Azure Active Directory for enterprise identity.

You can find samples for each use case in the [samples directory on GitHub].

### <a name="howto-cmdline-basicapp"></a>Create a Basic Node.js backend using the Command Line

Every Azure App Service Mobile App Node.js backend starts as an ExpressJS application.  ExpressJS is the most popular web service framework
available for Node.js.  You can create a basic [Express] application as follows:

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

		// Define a TodoItem table
		mobile.tables.add('TodoItem');

		// Add the mobile API so it is accessible as a Web API
		app.use(mobile);

		// Start listening on HTTP
		app.listen(process.env.PORT || 3000);

This application creates a simple mobile-optimized WebAPI with a single endpoint - /tables/TodoItem - that provides
unauthenticated access to an underlying SQL data store using a dynamic schema.  It is suitable for following the
client library quick starts:

- [iOS Client QuickStart]
- [Xamarin.iOS Client QuickStart]
- [Xamarin.Android Client QuickStart]
- [Xamarin.Forms Client QuickStart]
- [Windows Store Client QuickStart]
- [HTML/Javascript Client QuickStart]

You can find the code for this basic application in the [basicapp sample on GitHub].

### <a name="howto-vs2015-basicapp"></a>Create a Node backend with Visual Studio 2015

Visual Studio 2015 requires an extension to develop Node.js.js applications within the IDE.  To start, download and install the [Node.js Tools 1.1 for Visual Studio].  Once the Node.js Tools for Visual Studio are installed, create an Express 4.x application:

1. Open the **New Project** dialog (from **File** > **New** > **Project...**).

2. Expand **Templates** > **JavaScript** > **Node.js**.

3. Select the **Basic Azure Node.js Express 4 Application**.

4. Fill in the project name.  Click on *OK*.

	![Visual Studio 2015 New Project][1]

5. Right-click on the **npm** node and select **Install New npm packages...**.

6. You may need to refresh the npm catalog on creating your first Node.js application.  If this is required, you will be prompted - click on **Refresh**.

7. Enter _azure-mobile-apps_ in the search box.  Click on the **azure-mobile-apps 2.0.0** package, then click on **Install Package**.

	![Install New npm packages][2]

8. Click on **Close**.

9. Open the _app.js_ file to add support for the Azure Mobile Apps SDK.  At line 6 at the bottom of the library require statements, add the following code:

        var bodyParser = require('body-parser');
        var azureMobileApps = require('azure-mobile-apps');

    At approximately line 27 after the other app.use statements, add the following code:

        app.use('/users', users);

        // Azure Mobile Apps Initialization
        var mobile = azureMobileApps();
        mobile.tables.add('TodoItem');
        app.use('mobile');

    Save the file.

10. Either run the application locally (the API will be served on http://localhost:3000) or publish to Azure.

### <a name="howto-publish-to-azure"></a>Publish your Node.js backend to Azure

Microsoft Azure provides many mechanisms for publishing your Azure App Service Mobile Apps Node.js backend to the Azure service.  These include utilizing deployment tools integrated into Visual Studio, command-line tools and continuous deployment options based on source control.  For more information on this topic, refer to the [Azure App Service Deployment Guide].

Azure App Service has specific advice for Node.js application that you should review before deploying:

- How to [specify the Node Version]
- How to [use Node modules]

## <a name="TableOperations"></a>Table Operations

The azure-mobile-apps Node.js Server SDK provides mechanisms to expose data tables stored in SQL Azure as a WebAPI.  Five operations are provided.

| Operation | Description |
| --------- | ----------- |
| GET /tables/_tablename_ | Get all records in the table |
| GET /tables/_tablename_/:id | Get a specific record in the table |
| POST /tables/_tablename_ | Create a new record in the table |
| PATCH /tables/_tablename_/:id | Update an existing record in the table |
| DELETE /tables/_tablename_/:id | Delete a record in the table |

This WebAPI supports [OData] and extends the table schema to support [offline data sync].  

### <a name="howto-dynamicschema"></a>Define Tables using a Dynamic Schema

Before a table can be used, it must be defined.  Tables can be defined with a static schema (where the developer defines the columns within the schema) or dynamically (where the SDK controls the schema based on incoming requests). In addition, the developer can control specific aspects of the WebAPI by adding Javascript code to the definition.

As a best practice, you should define each table in a Javascript file in the tables directory, then use the tables.import() method to import the tables.
Extending the basic-app, the app.js file would be adjusted:

    var express = require('express'),
        azureMobileApps = require('azure-mobile-apps');

    var app = express(),
	    mobile = azureMobileApps();

    // Define the database schema that is exposed
    mobile.tables.import('./tables');

    // Provide initialization of any tables that are statically defined
    mobile.tables.initialize().then(function () {
        // Add the mobile API so it is accessible as a Web API
        app.use(mobile);

        // Start listening on HTTP
        app.listen(process.env.PORT || 3000);
    });

Define the table in ./tables/TodoItem.js:

    var azureMobileApps = require('azure-mobile-apps');

    var table = azureMobileApps.table();

    // Additional configuration for the table goes here

    module.exports = table;

Tables use dynamic schema by default.  To turn off dynamic schema globally, set the App Setting **MS_DynamicSchema** to false within the Azure Portal.

You can find a complete example in the [todo sample on GitHub].

### <a name="howto-staticschema"></a>Define Tables using a Static Schema

You can explicitly define the columns to expose via the WebAPI.  The azure-mobile-apps Node.js SDK will automatically add any additional columns required for offline data sync to the list that you provide.  For example, the QuickStart client applications require a table with two columns: text (a string) and complete (a boolean).  This can be defined in the table definition JavaScript file (located in the tables directory) as follows:

    var azureMobileApps = require('azure-mobile-apps');

    var table = azureMobileApps.table();

    // Define the columns within the table
    table.columns = {
        "text": "string",
        "complete": "boolean"
    };

    // Turn off dynamic schema
    table.dynamicSchema = false;

    module.exports = table;

If you define tables statically, then you must also call the tables.initialize() method to create the database schema on startup.  The tables.initialize() method returns a [Promise] - this is used to ensure that the web service does not serve requests prior to the database being initialized.

### <a name="howto-sqlexpress-setup"></a>Use SQL Express as a Development Datastore on your local machine

The Azure Mobile Apps The AzureMobile Apps Node SDK provides three options for serving data out of the box: SDK provides three options for serving data out of the box:

- Use the **memory** driver to provide a non-persistent example store
- Use the **mssql** driver to provide a SQL Express data store for development
- Use the **mssql** driver to provide a SQL Azure data store for production

The Azure Mobile Apps Node.js SDK uses the [mssql Node.js package] to establish and use a connection to both SQL Express and SQL Azure.  This package requires that you enable TCP connections on your SQL Express instance.

> [AZURE.NOTE] The memory driver does not provide a complete set of facilities for testing.  If you wish to test your backend locally,
we recommend the use of a SQL Express data store and using the sql driver.

1. Download and install [Microsoft SQL Server 2014 Express].  Ensure you install the SQL Server 2014 Express with Tools edition.  Unless you explicitly
require 64 Bit support, the 32 Bit version will consume less memory when running.

2. Run the SQL Server 2014 Configuration Manager.

  1. Expand the **SQL Server Network Configuration** node in the left hand tree menu.
  2. Click on **Protocols for SQLEXPRESS**.
  3. Right-click on **TCP/IP** and select **Enable**.  Click on **OK** in the pop-up dialog.
  4. Right-click on **TCP/IP** and select **Properties**.
  5. Click on the **IP Addresses** tab.
  6. Find the **IPAll** node.  In the **TCP Port** field, enter **1433**.
  
	 	 ![Configure SQL Express for TCP/IP][3]
  7. Click on **OK**.  Click on **OK** in the pop-up dialog.
  8. Click on **SQL Server Services** in the left hand tree menu.
  9. Right-click on **SQL Server (SQLEXPRESS)** and select **Restart**
  10. Close the SQL Server 2014 Configuration Manager.

3. Create a Run the SQL Server 2014 Management Studio and connect to your local SQL Express instance

  1. Right-click on your instance in the Object Explorer and select **Properties**
  2. Select the **Security** page.
  3. Ensure the **SQL Server and Windows Authentication mode** is selected
  4. Click on **OK**

  		![Configure SQL Express Authentication][4]

  5. Expand **Security** > **Logins** in the Object Explorer
  6. Right-click on **Logins** and select **New Login...**
  7. Enter a Login name.  Select **SQL Server authentication**.  Enter a Password, then enter the same password in **Confirm password**.  Note that the password must meet Windows complexity requirement.
  8. Click on **OK**

  		![Add a new user to SQL Express][5]

  9. Right-click on your new login and select **Properties**
  10. Select the **Server Roles** page
  11. Check the box next to the **dbcreator** server role
  12. Click on **OK**
  13. Close the SQL Server 2015 Management Studio

Ensure you record the username and password you selected.  You may need to assign additional server roles or permissions depending on your specific database requirements.  

The Node.js application will read the **SQLCONNSTR_MS_TableConnectionString** environment variable to read the connection string for this database.  You can set this within your environment.  For example, you can use PowerShell to set this environment variable:

    $env:SQLCONNSTR_MS_TableConnectionString = "Server=127.0.0.1; Database=mytestdatabase; User Id=azuremobile; Password=T3stPa55word;"

Note that you must access the database through a TCP/IP connection and provide a username and password for the connection.  

### <a name="howto-config-localdev"></a>Configure your project for local development

Azure Mobile Apps reads a JavaScript file called _azureMobile.js_ from the local filesystem.  You should not use this file to configure the Azure Mobile Apps SDK in production - use App Settings within the [Azure Portal] instead.  The _azureMobile.js_ file should export a configuration object.  The most common settings are:

- Database Settings
- Diagnostic Logging Settings
- Alternate CORS Settings

An example _azureMobile.js_ file implementing the database settings given above is below:

    module.exports = {
        cors: {
            origins: [ 'localhost' ]
        },
        data: {
            provider: 'mssql',
            server: '127.0.0.1',
            database: 'mytestdatabase',
            user: 'azuremobile',
            password: 'T3stPa55word'
        },
        logging: {
            level: 'verbose'
        }
    };

We recommend that you add _azureMobile.js_ to your _.gitignore_ file (or other source code control ignore file) to prevent passwords from
being stored in the cloud.  Always configure production settings in App Settings within the [Azure Portal].

### <a name="howto-use-sqlazure"></a>Use SQL Azure as your Production Datastore

<!--- ALTERNATE INCLUDE - we can't use ../includes/app-service-mobile-dotnet-backend-create-new-service.md - slightly different semantics -->

Using SQL Azure as a data store is identical across all Azure App Service application types. If you have not done so already, follow these steps to create a new Mobile App backend.

1. Log into the [Azure Portal].

2. In the top left of the window, click the **+NEW** button > **Web + Mobile** > **Mobile App**, then provide a name for your Mobile App backend.

3. In the **Resource Group** box, enter the same name as your app.

4. The Default App Service plan will be selected.  If you wish to change your App Service plan, you can do so by clicking on the App Service Plan > **+ Create New**.  Provide a name of the new App Service plan and select an appropriate location.  Click the Pricing tier and select an appropriate pricing tier for the service. Select **View all** to view more pricing options, such as **Free** and **Shared**.  Once you have selected the pricing tier, click the **Select** button.  Back in the **App Service plan** blade, click **OK**.

5. Click **Create**. This creates a Mobile App backend where you will later deploy your server project.  Provisioning a Mobile App backend can take a couple of minutes.  Once the Mobile App backend is provisioned, the portal will open the **Settings** blade for the Mobile App backend.  

Once the Mobile App backend is created, you can choose to either connect an existing SQL Azure database to your Mobile App backend or create a new SQL Azure database.  In this HOWTO, we will create a new SQL database.

> [AZURE.NOTE] If you already have a database in the same location as the new mobile app backend, you can instead choose **Use an existing database** and then select that database. The use of a database in a different location is not recommended because of additional bandwidth costs and higher latencies.

6. In the new Mobile App backend, click **Settings** > **Mobile App** > **Data** > **+Add**.

7. In the **Add data connection** blade, click **SQL Database - Configure required settings** > **Create a new database**.  Enter the name of the new database in the **Name** field.

8. Click **Server**.  In the **New server** blade, enter a unique server name in the **Server name** field, and provide a suitable **Server admin login** and **Password**.  Ensure **Allow azure services to access server** is checked.  Click on **OK**.

	![Create a SQL Azure Database][6]

9. On the **New database** blade, click on **OK**.

10. Back on the **Add data connection** blade, select **Connection string**, enter the login and password that you just provided when creating the database.  If you use an existing database, provide the login credentials for that database.  Once entered, click **OK**.

11. Back on the **Add data connection** blade again, click on **OK** to create the database.

<!--- END OF ALTERNATE INCLUDE -->

Creation of the database can take a few minutes.  Use the **Notifications** area to monitor the progress of the deployment.  Do not progress until the database has been deployed sucessfully.  Once successfully deployed, a Connection String will be created for the SQL Azure database instance in your Mobile backend App Settings.  You can see this app setting in the **Settings** > **Application settings** > **Connection strings**.

### <a name="howto-tables-auth"></a>Require Authentication for access to tables

If you wish to use App Service Authentication with the tables endpoint, you must configure App Service Authentication in the [Azure Portal] first.  For
more details about configuring authentication in an Azure App Service, review the Configuration Guide for the identity provider you intend to use:

- [How to configure Azure Active Directory Authentication]
- [How to configure Facebook Authentication]
- [How to configure Google Authentication]
- [How to configure Microsoft Authentication]
- [How to configure Twitter Authentication]

Each table has an access property that can be used to control access to the table.  The following sample shows a statically defined table with authentication required.

    var azureMobileApps = require('azure-mobile-apps');

    var table = azureMobileApps.table();

    // Define the columns within the table
    table.columns = {
        "text": "string",
        "complete": "boolean"
    };

    // Turn off dynamic schema
    table.dynamicSchema = false;

    // Require authentication to access the table
    table.access = 'authenticated';

    module.exports = table;

The access property can take one of three values

  - *anonymous* indicates that the client application is allowed to read data without authentication
  - *authenticated* indicates that the client application must send a valid authentication token with the request
  - *disabled* indicates that this table is currently disabled

If the access property is undefined, unauthenticated access is allowed.

### <a name="howto-tables-disabled"></a>Disable access to specific table operations

In addition to appearing on the table, the access property can be used to control individual operations.  There are four operations:

  - *read* is the RESTful GET operation on the table
  - *insert* is the RESTful POST operation on the table
  - *update* is the RESTful PATCH operation on the table
  - *delete* is the RESTful DELETE operation on the table

For example, you may wish to provide a read-only unauthenticated table.  This can be provided by the following table definition:

    var azureMobileApps = require('azure-mobile-apps');

    var table = azureMobileApps.table();

    // Read-Only table - only allow READ operations
    table.read.access = 'anonymous';
    table.insert.access = 'disabled';
    table.update.access = 'disabled';
    table.delete.access = 'disabled';

    module.exports = table;

### <a name="howto-tables-query"></a>Adjust the query that is used with table operations

A common requirement for table operations is to provide a restricted view of the data.  For example, you may provide a table that is
tagged with the authenticated user ID such that the user can only read or update their own records.  The following table definition
will provide this functionality:

    var azureMobileApps = require('azure-mobile-apps');

    var table = azureMobileApps.table();

    // Define a static schema for the table
    table.columns = {
        "userId": "string",
        "text": "string",
        "complete": "boolean"
    };
    table.dynamicSchema = false;

    // Require authentication for this table
    table.access = 'authenticated';

    // Ensure that only records for the authenticated user are retrieved
    table.read(function (context) {
		context.query.where({ userId: context.user.id });
		return context.execute();
	});

    // When adding records, add or overwrite the userId with the authenticated user
    table.insert(function (context) {
	    context.item.userId = context.user.id;
	    return context.execute();
    }

    module.exports = table;

Operations that normally execute a query will have a query property that you can adjust with a where clause.    The query property is
a [QueryJS] object that is used to convert an OData query to something that the data backend can process.  For simple equality cases
(like the one above), a map can be used. It is also relatively easy to add specific SQL clauses:

    context.query.where('myfield eq ?', 'value');

### <a name="howto-tables-softdelete"></a>Configure Soft Delete on a table

Soft Delete does not actually delete records.  Instead it marks them as deleted within the database by setting the deleted column to true.  The Azure Mobile Apps SDK automatically removes soft-deleted records from results unless the Mobile Client SDK uses IncludeDeleted().  To configure a table for soft delete, set the softDelete property in the table definition file.  An example might be:

    var azureMobileApps = require('azure-mobile-apps');

    var table = azureMobileApps.table();

    // Define the columns within the table
    table.columns = {
        "text": "string",
		"complete": "boolean"
	};

	// Turn off dynamic schema
	table.dynamicSchema = false;

	// Turn on Soft Delete
	table.softDelete = true;

	// Require authentication to access the table
	table.access = 'authenticated';

	module.exports = table;

You will need to establish a mechanism for purging records - either from a client application, via a WebJob or through a custom mechanism.

### <a name="howto-tables-seeding"></a>Seed your database with data

When creating a new application, you may wish to seed a table with data.  This can be done within the table definition JavaScript file as
follows:

	var azureMobileApps = require('azure-mobile-apps');

	var table = azureMobileApps.table();

	// Define the columns within the table
	table.columns = {
		"text": "string",
		"complete": "boolean"
	};
	table.seed = [
		{ text: 'Example 1', complete: false },
		{ text: 'Example 2', complete: true }
	];

	// Turn off dynamic schema
	table.dynamicSchema = false;

	// Require authentication to access the table
	table.access = 'authenticated';

	module.exports = table;

It is important to note that seeding of data is only done when the table is created by the Azure Mobile Apps SDK.  If the table already
exists within the database, no data is injected into the table.  If dynamic schema is turned on, then the schema will be inferred from
the seeded data.

We recommend that you explicitly call the initialize() method to create the table when the service starts running.

## <a name="CustomAPI"></a>Custom API

In addition to the data access API via the /tables endpoint, Azure Mobile Apps can provide custom API coverage.  Custom APIs are defined in
a similar way to the table definitions and can access all the same facilities, including authentication.

If you wish to use App Service Authentication with a Custom API, you must configure App Service Authentication in the [Azure Portal] first.  For
more details about configuring authentication in an  Azure App Service, review the Configuration Guide for the identity provider you intend to use:

- [How to configure Azure Active Directory Authentication]
- [How to configure Facebook Authentication]
- [How to configure Google Authentication]
- [How to configure Microsoft Authentication]
- [How to configure Twitter Authentication]

### <a name="howto-customapi-basic"></a>Define a Simple Custom API

Custom APIs are defined in much the same way as the Tables API.

1. Create an **api** directory
2. Create an API definition JavaScript file in the **api** directory.
3. Use the import method to import the **api** directory.

Here is the prototype api definition based on the basic-app sample we used earlier.

	var express = require('express'),
		azureMobileApps = require('azure-mobile-apps');

	var app = express(),
		mobile = azureMobileApps();

	// Import the Custom API
	mobile.api.import('./api');

	// Add the mobile API so it is accessible as a Web API
	app.use(mobile);

	// Start listening on HTTP
	app.listen(process.env.PORT || 3000);

Let's take a simple API that will return the server date using the _Date.now()_ method.  Here is the api/date.js file:

	var api = {
		get: function (req, res, next) {
			var date = { currentTime: Date.now() };
			res.status(200).type('application/json').send(date);
		});
	};

	module.exports = api;

Each parameter is one of the standard RESTful verbs - GET, POST, PATCH or DELETE.  The method is a standard [ExpressJS Middleware] function that sends the required output.  

### <a name="howto-customapi-auth"></a>Require Authentication for access to a Custom API

Azure Mobile Apps SDK implements authentication in the same way for both the tables endpoint and custom APIs.  To add authentication to the API developed in the previous section, add an **access** property:

	var api = {
		get: function (req, res, next) {
			var date = { currentTime: Date.now() };
			res.status(200).type('application/json').send(date);
		});
	};
	// All methods must be authenticated.
	api.access = 'authenticated';

	module.exports = api;

You can also specify authentication on specific operations:

	var api = {
		get: function (req, res, next) {
			var date = { currentTime: Date.now() };
			res.status(200).type('application/json').send(date);
		});
	};
	// The GET methods must be authenticated.
	api.get.access = 'authenticated';

	module.exports = api;

The same token that is used for the tables endpoint must be used for custom APIs requiring authentication.

## <a name="Debugging"></a>Debugging and Troubleshooting

The Azure App Service provides several debugging and troubleshooting techniques for Node.js applications.
All of these techniques are available.  

- [Monitoring an Azure App Service]
- [Enable Diagnostic Logging in Azure App Service]
- [Toubleshoot an Azure App Service in Visual Studio]

### <a name="howto-diagnostic-logs"></a>Write to the Azure Mobile Apps diagnostic logs

Node.js applications have access to a wide range of diagnostic log tools.  Internally, the Azure Mobile Apps Node.js SDK uses [Winston] for diagnostic logging.  This is automatically enabled by enabling debug mode or by setting the **MS_DebugMode** app setting to true in the [Azure Portal].  Logs generated will appear in the Diagnostic Logs on the [Azure Portal].

<!-- Images -->
[0]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/npm-init.png
[1]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/vs2015-new-project.png
[2]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/vs2015-install-npm.png
[3]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/sqlexpress-config.png
[4]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/sqlexpress-authconfig.png
[5]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/sqlexpress-newuser-1.png
[6]: ../../includes/media/app-service-mobile-dotnet-backend-create-new-service/dotnet-backend-create-db.png

<!-- URLs -->
[iOS Client QuickStart]: app-service-mobile-ios-get-started.md
[Xamarin.iOS Client QuickStart]: app-service-mobile-xamarin-ios-get-started.md
[Xamarin.Android Client QuickStart]: app-service-mobile-xamarin-android-get-started.md
[Xamarin.Forms Client QuickStart]: app-service-mobile-xamarin-forms-get-started.md
[Windows Store Client QuickStart]: app-service-mobile-windows-store-dotnet-get-started.md
[HTML/Javascript Client QuickStart]: app-service-html-get-started.md
[offline data sync]: app-service-mobile-offline-data-sync.md
[How to configure Azure Active Directory Authentication]: app-service-mobile-how-to-configure-active-directory-authentication.md
[How to configure Facebook Authentication]: app-service-mobile-how-to-configure-facebook-authentication.md
[How to configure Google Authentication]: app-service-mobile-how-to-configure-google-authentication.md
[How to configure Microsoft Authentication]: app-service-mobile-how-to-configure-microsoft-authentication.md
[How to configure Twitter Authentication]: app-service-mobile-how-to-configure-twitter-authentication.md
[Azure App Service Deployment Guide]: ../app-service-web/web-site-deploy.md
[Monitoring an Azure App Service]: ../app-service-web/web-sites-monitor.md
[Enable Diagnostic Logging in Azure App Service]: ../app-service-web/web-sites-enable-diagnostic-log.md
[Toubleshoot an Azure App Service in Visual Studio]: ../app-service-web/web-sites-dotnet-troubleshoot-visual-studio.md
[specify the Node Version]: ../nodejs-specify-node-version-azure-apps.md
[use Node modules]: ../nodejs-use-node-mobiles-azure-apps.md
[Create a new Azure App Service]: ../app-service-web/
[azure-mobile-apps]: https://www.npmjs.com/package/azure-mobile-apps
[Express]: http://expressjs.com/

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
