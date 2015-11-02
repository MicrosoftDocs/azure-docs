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
	ms.date="09/18/2015"
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

- (iOS)[app-service-mobile-ios-get-started]
- (Xamarin.iOS)[app-service-mobile-xamarin-ios-get-started]
- (Xamarin.Android)[app-service-mobile-xamarin-android-get-started]
- (Xamarin.Forms)[app-service-mobile-xamarin-forms-get-started]
- (Windows Phone)[app-service-mobile-windows-store-dotnet-get-started]
- (HTML/Javascript)[app-service-html-get-started]

You can find the code for this basic application in the (Azure Mobile Apps Node SDK GitHub Repository)[https://github.com/azure/azure-mobile-apps-node/tree/master/samples/basic-app].

## HOWTO: Create a Node backend with Visual Studio 2015

## HOWTO: Publish your Node backend to Azure for the first time

## HOWTO: Publish your Node backend to Azure subsequently

# Table Operations

The azure-mobile-apps Node Server SDK provides mechanisms to expose data tables stored in SQL Azure as a WebAPI.  Five operations are provided.

	| GET /tables/_tablename_ | Get all records in the table |
	| GET /tables/_tablename_/:id | Get a specific record in the table |
	| POST /tables/_tablename_ | Create a new record in the table |
	| PUT /tables/_tablename_/:id | Update an existing record in the table |
	| DELETE /tables/_tablename_/:id | Delete a record in the table |
	
This WebAPI supports (OData)[http://www.odata.org] and extends the table schema to support (offline data sync)[app-service-mobile-offline-data-sync].  

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
  
You can find a complete example in the (Azure Mobile Apps Node SDK GitHub Repository)[https://github.com/azure/azure-mobile-apps-node/tree/master/samples/todo].

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
method returns a (Promise)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise] - this is used to ensure that the web
service does not serve requests prior to the database being initialized.

## HOWTO: Use SQL Express as a Development Datastore on your local machine

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
a (QueryJS)[https://github.com/Azure/queryjs] object that is used to convert an OData query to something that the data backend can 
process.  For simple equality cases (like the one above), a map can be used. It is also relatively easy to add specific SQL clauses:

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
<!-- png screenshot of the npm init output -->
[0]: ./media/images/...
