---
title: Get started with Azure Cosmos DB for MongoDB using JavaScript
description: Get started developing a JavaScript application that works with Azure Cosmos DB for MongoDB. This article helps you learn how to set up a project and configure access to an Azure Cosmos DB for MongoDB database.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: javascript
ms.topic: how-to
ms.date: 06/23/2022
ms.custom: devx-track-js, ignite-2022, devguide-js, cosmos-db-dev-journey
---

# Get started with Azure Cosmos DB for MongoDB using JavaScript

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This article shows you how to connect to Azure Cosmos DB for MongoDB using the native MongoDB npm package. Once connected, you can perform operations on databases, collections, and docs.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[API for MongoDB reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (npm)](https://www.npmjs.com/package/mongodb)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- [Node.js LTS](https://nodejs.org/en/download/)
- [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)
- [Azure Cosmos DB for MongoDB resource](quickstart-nodejs.md#create-an-azure-cosmos-db-account)

## Create a new JavaScript app

1. Create a new JavaScript application in an empty folder using your preferred terminal. Use the [``npm init``](https://docs.npmjs.com/cli/v8/commands/npm-init) command to begin the prompts to create the `package.json` file. Accept the defaults for the prompts.

    ```console
    npm init
    ```

1. Add the [MongoDB](https://www.npmjs.com/package/mongodb) npm package to the JavaScript project. Use the [``npm install package``](https://docs.npmjs.com/cli/v8/commands/npm-install) command specifying the name of the npm package. The `dotenv` package is used to read the environment variables from a `.env` file during local development.

    ```console
    npm install mongodb dotenv
    ```

1. To run the app, use a terminal to navigate to the application directory and run the application.

    ```console
    node index.js
    ```

## Connect with MongoDB native driver to Azure Cosmos DB for MongoDB

To connect with the MongoDB native driver to Azure Cosmos DB, create an instance of the [``MongoClient``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html#connect) class. This class is the starting point to perform all operations against databases.

The most common constructor for **MongoClient** has two parameters:

| Parameter | Example value | Description |
| --- | --- | --- |
| ``url`` | ``COSMOS_CONNECTION_STRING`` environment variable | API for MongoDB connection string to use for all requests |
| ``options`` | `{ssl: true, tls: true, }` | [MongoDB Options](https://mongodb.github.io/node-mongodb-native/4.5/interfaces/MongoClientOptions.html) for the connection. |

Refer to the [Troubleshooting guide](error-codes-solutions.md) for connection issues.

## Get resource name

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - get resource name](<./includes/azure-cli-get-resource-name.md>)]

### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - set resource name](<./includes/powershell-set-resource-name.md>)]

### [Portal](#tab/azure-portal)

Skip this step and use the information for the portal in the next step.

---

## Retrieve your connection string

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - get connection string](<./includes/azure-cli-get-connection-string.md>)]

### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - get connection string](<./includes/powershell-get-connection-string.md>)]

### [Portal](#tab/azure-portal)

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos``.

[!INCLUDE [Portal - get connection string](<./includes/portal-get-connection-string-from-sign-in.md>)]

---

## Configure environment variables

[!INCLUDE [Multitab - store connection string in environment variable](<./includes/environment-variables-connection-string.md>)]

## Create MongoClient with connection string

1. Add dependencies to reference the MongoDB and DotEnv npm packages.

    :::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/101-client-connection-string/index.js" id="package_dependencies":::

1. Define a new instance of the ``MongoClient`` class using the constructor, and [``process.env.``](https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_env) to use the connection string.

    :::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/101-client-connection-string/index.js" id="client_credentials":::

For more information on different ways to create a ``MongoClient`` instance, see [MongoDB NodeJS Driver Quick Start](https://www.npmjs.com/package/mongodb#quick-start).

## Close the MongoClient connection

When your application is finished with the connection, remember to close it. The `.close()` call should be after all database calls are made.

```javascript
client.close()
```

## Use MongoDB client classes with Azure Cosmos DB for API for MongoDB

[!INCLUDE [Conceptual object model](<./includes/conceptual-object-model.md>)]

Each type of resource is represented by one or more associated JavaScript classes. Here's a list of the most common classes:

| Class | Description |
|---|---|
|[``MongoClient``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html)|This class provides a client-side logical representation for the API for MongoDB layer on Azure Cosmos DB. The client object is used to configure and execute requests against the service.|
|[``Db``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html)|This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it.|
|[``Collection``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Collection.html)|This class is a reference to a collection that also may not exist in the service yet. The collection is validated server-side when you attempt to work with it.|

The following guides show you how to use each of these classes to build your application.

**Guide**:

- [Manage databases](how-to-javascript-manage-databases.md)  
- [Manage collections](how-to-javascript-manage-collections.md)
- [Manage documents](how-to-javascript-manage-documents.md)
- [Use queries to find documents](how-to-javascript-manage-queries.md)

## See also

- [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos)
- [API reference](https://docs.mongodb.com/drivers/node)

## Next steps

Now that you've connected to an API for MongoDB account, use the next guide to create and manage databases.

> [!div class="nextstepaction"]
> [Create a database in Azure Cosmos DB for MongoDB using JavaScript](how-to-javascript-manage-databases.md)
