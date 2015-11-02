<properties
	pageTitle="How to work with the Node backend server SDK for Mobile Apps | Azure App Service"
	description="Learn how to work with the Node backend server SDK for Azure App Service Mobile Apps."
	services="app-service\mobile"
	documentationCenter=""
	authors="adrianha" 
	manager=""
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-multiple"
	ms.devlang="node"
	ms.topic="article"
	ms.date="11/18/2015"
	ms.author="adrianha"/>

This article provides detailed information and examples showing how to work with a Node backend in Azure App Service Mobile Apps.
	
# Introduction

Azure App Service Mobile Apps provides the capability to add a mobile-optimized data access Web API to a web application.  The Azure App 
Service Mobile Apps SDK is provided for ASP.NET and NodeJS web application and provides the following operations:

- Table operations (Read, Insert, Update, Dete) for data access
- Custom API operations
 
Both operations provide for authentication across all authentication methods allowed by Azure App Service, including social authentication
providers such as Facebook, Twitter, Google and Microsoft as well as Azure Active Directory for enterprise authentication.

## HOWTO: Create a Basic Node backend using the Command Line

Every Azure App Service Mobile App Node backend starts as an ExpressJS application.  ExpressJS is the most popular web service framework
available for Node.  You can create a basic ExpressJS Node application as follows:

1. In a command or PowerShell window, create a new directory for your project.

```
mkdir basicapp
```

2. Run npm init to initialize the package structure.

```
cd basicapp
npm init
```
		
The npm init command will ask a set of questions to initialize the project.  See the example output below

![The npm init output][0]

3. Install the express and azure-mobile-apps libraries from the npm repository.

```
npm install --save express azure-mobile-apps
```

4. Create an app.js file to implement the basic mobile server.

```
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
```

This application creates a simple mobile-optimized WebAPI with a single endpoint - /tables/TodoItem - that provides 
unauthenticated access to an underlying SQL data store using a dynamic schema.  It is suitable for following the
client library quick starts:

- [iOS Client QuickStart]
- [Xamarin.iOS Client QuickStart]
- [Xamarin.Android Client QuickStart]
- [Xamarin.Forms Client QuickStart]
- [Windows Phone Client QuickStart]
- [HTML/Javascript Client QuickStart]

You can find the code for this basic application in the [basicapp sample on GitHub].

## HOWTO: Create a Node backend with Visual Studio 2015

Visual Studio 2015 requires an extension to develop Node application within the IDE.  To start, download and install the [Node.js Tools 1.1 for Visual Studio].  Once the Node.js Tools for Visual Studio are installed, create an Express 4.x application:

1. Open the *New Project* dialog (from File -&gt; New Project...)
2. Expand *Templates* -&gt; *JavaScript* -&gt; *Node.js*
3. Select the *Basic Azure Node.js Express 4 Application*
4. Fill in the project name.  Click on *OK*.

![Visual Studio 2015 New Project][1]

5. Right-click on the *npm* node and select *Install New npm packages...*
6. You will need to refresh the npm catalog on creating your first Node application - click on *Refresh*.
7. Enter _azure-mobile-apps_ in the search box.  Click on the azure-mobile-apps 2.0.0 package, then click on *Install Package*

![Install New npm packages][2]

8. Click on *Close*.
9. Open the _app.js_ file to add support for the Azure Mobile Apps SDK:
  a. At line 6, add the following code:
  
```
var bodyParser = require('body-parser');
var azureMobileApps = require('azure-mobile-apps');
```

  b. At approximately line 27, add the following code:
  
```
app.use('/users', users);

// Azure Mobile Apps Initialization
var mobile = azureMobileApps();
mobile.tables.add('TodoItem');
app.use('mobile');
```

  c. Save the file.
  
10. Either run the application locally (the API will be served on http://localhost:3000) or publish to Azure.

## HOWTO: Publish your Node backend to Azure 

Microsoft Azure provides many mechanisms for publishing your Azure App Service Mobile Apps Node backend to the Azure service.  These include
utilizing deployment tools integrated into Visual Studio, command-line tools and continuous deployment options based on source control.  For
more information on this topic, refer to the [Azure App Service Deployment Guide].

Azure App Service has specific advice for Node application that you should review before deploying:

- How to [specify the Node Version]
- How to [use Node modules]

# Table Operations

The azure-mobile-apps Node Server SDK provides mechanisms to expose data tables stored in SQL Azure as a WebAPI.  Five operations are provided.

| GET /tables/_tablename_ | Get all records in the table |
| GET /tables/_tablename_/:id | Get a specific record in the table |
| POST /tables/_tablename_ | Create a new record in the table |
| PUT /tables/_tablename_/:id | Update an existing record in the table |
| DELETE /tables/_tablename_/:id | Delete a record in the table |
	
This WebAPI supports [OData] and extends the table schema to support [offline data sync].  

## HOWTO: Define Tables using a Dynamic Schema

Before a table can be used, it must be defined.  Tables can be defined with a static schema (where the developer defines the columns within the schema)
or dynamically (where the SDK controls the schema based on incoming requests). In addition, the developer can control specific aspects of the WebAPI by
adding Javascript code to the definition.

As a best practice, you should define each table in a Javascript file in the tables directory, then use the tables.import() method to import the tables.
Extending the basic-app, the app.js file would be adjusted:

```
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
```

Define the table in ./tables/TodoItem.js:

```
var azureMobileApps = require('azure-mobile-apps');

var table = azureMobileApps.table();

// Additional configuration for the table goes here

module.exports = table;
```

Tables use dynamic schema by default.  To turn off dynamic schema globally, set the App Setting *MS_DynamicSchema* to false within the Azure Portal.
  
You can find a complete example in the [todo sample on GitHub].

## HOWTO: Define Tables using a Static Schema

You can explicitly define the columns to expose via the WebAPI.  The azure-mobile-apps Node SDK will automatically add any additional columns required
for offline data sync to the list that you provide.  For example, the QuickStart client applications require a table with two columns: text (a string) 
and complete (a boolean).  This can be defined in the table definition JavaScript file (located in the tables directory) as follows:

```
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
```

If you define tables statically, then you must also call the tables.initialize() method to create the database schema on startup.  The tables.initialize()
method returns a [Promise] - this is used to ensure that the web service does not serve requests prior to the database being initialized.

## HOWTO: Use SQL Express as a Development Datastore on your local machine

The Azure Mobile Apps Node SDK provides three options for serving data out of the box:

- Use the *memory* driver to provide a non-persistent example store
- Use the *sql* driver to provide a SQL Express data store for development
- Use the *sql* driver to provide a SQL Azure data store for production

Tha Azure Mobile Apps Node SDK uses the [mssql Node package] to establish and use a connection to both SQL Express and SQL Azure.  This package requires
that you enable TCP connections on your SQL Express instance.

1. Download and install [Microsoft SQL Server 2014 Express].  Ensure you install the SQL Server 2014 Express with Tools edition.  Unless you explicitly
require 64 Bit support, the 32 Bit version will consume less memory when running.

2. Run the SQL Server 2014 Configuration Manager.

  a. Expand the *SQL Server Network Configuration* node in the left hand tree menu.
  b. Click on *Protocols for SQLEXPRESS*.
  c. Right-click on *TCP/IP* and select *Enable*.  Click on *OK* in the pop-up dialog.
  d. Right-click on *TCP/IP* and select *Properties*.
  e. Click on the *IP Addresses* tab.
  f. Find the *IPAll* node.  In the *TCP Port* field, enter *1433*.
  
![Configure SQL Express for TCP/IP][3]

  g. Click on *OK*.  Click on *OK* in the pop-up dialog.
  h. Click on *SQL Server Services* in the left hand tree menu.
  i. Right-click on *SQL Server (SQLEXPRESS) and select *Restart*
  j. Close the SQL Server 2014 Configuration Manager.
  
3. Create a Run the SQL Server 2014 Management Studio and connect to your local SQL Express instance

  a. Right-click on your instance in the Object Explorer and select *Properties*
  b. Select the *Security* page.
  c. Ensure the *SQL Server and Windows Authentication mode* is selected
  d. Click on *OK*
  
![Configure SQL Express Authentication][4]
  
  e. Expand *Security* -&gt; *Logins* in the Object Explorer
  f. Right-click on *Logins* and select *New Login...*
  g. Enter a Login name.  Select *SQL Server authentication*.  Enter a Password, then enter the same password in *Confirm password*.  Note that the password must meet Windows complexity requirement.
  h. Click on *OK*

![Add a new user to SQL Express][5]

  i. Right-click on your new login and select *Properties*
  j. Select the *Server Roles* page
  k. Check the box next to the *dbcreator* server role
  l. Click on *OK*
  m. Close the SQL Server 2015 Management Studio

Ensure you record the username and password you selected.  You may need to assign additional server roles or permissions depending on your 
specific database requirements.  

The Node application will read the SQLCONNSTR_MS_TableConnectionString environment variable to read the connection string for this database.
You can set this within your environment.  For example, you can use PowerShell to set this environment variable:

```
$env:SQLCONNSTR_MS_TableConnectionString = "Server=127.0.0.1; Database=mytestdatabase; User Id=azuremobile; Password=T3stPa55word;"
```

Note that you must access the database through a TCP/IP connection and provide a username and password for the connection.  
  
## HOWTO: Use SQL Azure as your Production Datastore

## HOWTO: Require Authentication for access to tables

Each table has an access property that can be used to control access to the table.  The following sample shows a statically defined table with 
authorization required. 

```
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
```

The access property can take two values

  - *authenticated* indicates that the client application must send a valid authentication token with the request
  - *disabled* indicates that this table is currently disabled

If the access property is undefined, unauthenticated access is allowed.

## HOWTO: Disable access to specific table operations

In addition to appearing on the table, the access property can be used to control individual operations.  There are four operations:

  - *read* is the RESTful GET operation on the table
  - *insert* is the RESTful POST operation on the table
  - *update* is the RESTful PATCH operation on the table
  - *delete* is the RESTful DELETE operation on the table
  
For example, you may wish to provide a read-only unauthenticated table.  This can be provided by the following table definition:

```
var azureMobileApps = require('azure-mobile-apps');

var table = azureMobileApps.table();

// Read-Only table - only allow READ operations
table.read.access = undefined;
table.insert.access = 'disabled';
table.update.access = 'disabled';
table.delete.access = 'disabled';

module.exports = table;
```

## HOWTO: Adjust the query that is used with table operations

A common requirement for table operations is to provide a restricted view of the data.  For example, you may provide a table that is
tagged with the authenticated user ID such that the user can only read or update their own records.  The following table definition 
will provide this functionality:

```
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
```

Operations that normally execute a query will have a query property that you can adjust with a where clause.    The query property is
a [QueryJS] object that is used to convert an OData query to something that the data backend can process.  For simple equality cases 
(like the one above), a map can be used. It is also relatively easy to add specific SQL clauses:

```
context.query.where('myfield eq ?', 'value');
```

## HOWTO: Seed your database with data

# Custom API

## HOWTO: Define a Simple Custom API

## HOWTO: Require Authentication for access to a Custom API

## HOWTO: Create a Custom API to use Push Notifications

# Authentication

## HOWTO: Work with Social Authentication to get information about the user

## HOWTO: Work with Azure Active Directory to access the Office APIs

# Debugging and Troubleshooting

## HOWTO: Write to the Azure Mobile Apps diagnostic logs

# Integrating a Web Application

## HOWTO: Use MVC Routes to provide a Web App in addition to a Mobile App

## HOWTO: Leverage Authentication with an MVC Web App

<!-- Images -->
[0]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/npm-init.png
[1]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/vs2015-new-project.png
[2]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/vs2015-install-npm.png
[3]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/sqlexpress-config.png
[4]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/sqlexpress-authconfig.png
[5]: ./media/app-service-mobile-node-backend-how-to-use-server-sdk/sqlexpress-newuser-1.png

<!-- URLs -->
[iOS Client QuickStart]: app-service-mobile-ios-get-started.md
[Xamarin.iOS Client QuickStart]: app-service-mobile-xamarin-ios-get-started.md
[Xamarin.Android Client QuickStart]: app-service-mobile-xamarin-android-get-started.md
[Xamarin.Forms Client QuickStart]: app-service-mobile-xamarin-forms-get-started.md
[Windows Phone Client QuickStart]: app-service-mobile-windows-store-dotnet-get-started.md
[HTML/Javascript Client QuickStart]: app-service-html-get-started.md
[offline data sync]: app-service-mobile-offline-data-sync.md
[Azure App Service Deployment Guide]: ../app-service-web/web-site-deploy.md
[specify the Node Version]: ../nodejs-specify-node-version-azure-apps.md
[use Node modules]: ../nodejs-use-node-mobiles-azure-apps.md
[OData]: http://www.odata.org
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[basicapp sample on GitHub]: https://github.com/azure/azure-mobile-apps-node/tree/master/samples/basic-app
[todo sample on GitHub]: https://github.com/azure/azure-mobile-apps-node/tree/master/samples/todo
[static-schema sample on GitHub]: https://github.com/azure/azure-mobile-apps-node/tree/master/samples/static-schema
[QueryJS]: https://github.com/Azure/queryjs
[Node.js Tools 1.1 for Visual Studio]: https://github.com/Microsoft/nodejstools/releases/tag/v1.1-RC.2.1
[mssql Node package]: https://www.npmjs.com/package/mssql
[Microsoft SQL Server 2014 Express]: http://www.microsoft.com/en-us/server-cloud/Products/sql-server-editions/sql-server-express.aspx