---
title: Get started with Azure Cosmos DB MongoDB API and JavaScript
description: Get started developing a JavaScript application that works with Azure Cosmos DB MongoDB API. This article helps you learn how to set up a project and configure access to an Azure Cosmos DB MongoDB API database.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: javascript
ms.topic: how-to
ms.date: 06/20/2022
ms.custom: devx-track-js

---

# Get started with Azure Cosmos DB MongoDB API and JavaScript
[!INCLUDE[appliesto-mongo-api](../includes/appliesto-mongodb-api.md)]

This article shows you how to connect to Azure Cosmos DB MongoDB API using the native MongoDB npm package. Once connected, you can perform operations on databases, collections, and docs.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [mongodb Package (NuGet)](https://www.npmjs.com/package/mongodb)


## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* [Node.js LTS](https://nodejs.org/en/download/)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

## Set up your project

### Create a new JavaScript app

1. Create a new JavaScript application in an empty folder using your preferred terminal. Use the [``npm init``](https://docs.npmjs.com/cli/v8/commands/npm-init) command to begin the prompts to create the `package.json` file. Accept the defaults for the prompts. 

    ```console
    npm init
    ```

2. Add the [MongoDB](https://www.npmjs.com/package/mongodb) npm package to the JavaScript project. Use the [``npm install package``](https://docs.npmjs.com/cli/v8/commands/npm-install) command specifying the name of the npm package. The `dotenv` package is used to read the environment variables from a `.env` file during local development.

    ```console
    npm install mongodb dotenv
    ```

3. To run the app, use a terminal to navigate to the application directory and run the application.

    ```console
    node index.js
    ```

## Connect with MongoDB native driver to Azure Cosmos DB MongoDB API

To connect with the MongoDB native driver to Azure Cosmos DB, create an instance of the [``MongoClient``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html#connect) class. This class is the starting point to perform all operations against databases. 

### Connect with a MongoDB connection string

The most common constructor for **MongoClient** has two parameters:

| Parameter | Example value | Description |
| --- | --- | --- |
| ``url`` | ``COSMOS_CONNECTION_STRIN`` environment variable | MongoDB API connection string to use for all requests |
| ``options`` | `{ssl: true, tls: true, }` | [MongoDB Options](https://mongodb.github.io/node-mongodb-native/4.5/interfaces/MongoClientOptions.html) for the connection. |

Refer to the [Troubleshooting guide](error-codes-solutions.md) for connection issues.

#### Retrieve your connection string

##### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - get resource name](<./includes/azurecli-get-resource-name.md>)]

[!INCLUDE [Azure CLI - get connection string](<./includes/azurecli-get-connection-string.md>)]

##### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - set resource name](<./includes/powershell-set-resource-name.md>)]

[!INCLUDE [Powershell - get connection string](<./includes/powershell-get-connection-string.md>)]


##### [Portal](#tab/azure-portal)

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos``.

[!INCLUDE [Portal - get connection string](<./includes/portal-get-connection-string-from-sign-in.md>)]

---

[!INCLUDE [Multitab - store connection string in environment variable](<./includes/multitab-env-vars-connection-string.md>)]

#### Create MongoClient with connection string

Create a new instance of the **MongoClient** class with the ``COSMOS_CONNECTION_STRING`` environment variable as the first parameter.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/101-client-connection-string/index.js" id="client_credentials":::

## Build your application

As you build your application, your code will primarily interact with these types of resources:

- Databases, which organize the collections in your account.

- Collections, which contain a set of individual docs in your database.

- Docs, which represent a JSON document in your collection.

The following diagram shows the relationship between these resources.

:::image type="complex" source="media/quickstart-javascript/resource-hierarchy.png" alt-text="Diagram of the Azure Cosmos D B hierarchy including accounts, databases, collections, and docs.":::
    Hierarchical diagram showing an Azure Cosmos D B account at the top. The account has two child database nodes. One of the database nodes includes two child collection nodes. The other database node includes a single child collection node. That single collection node has three child doc nodes.
:::image-end:::

Each type of resource is represented by one or more associated JavaScript classes. Here's a list of the most common classes:

| Class | Description |
|---|---|
|[``MongoClient``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html)|This class provides a client-side logical representation for the MongoDB API layer on Cosmos DB. The client object is used to configure and execute requests against the service.|
|[``Db``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html)|This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it.|
|[``Collection``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Collection.html)|This class is a reference to a collection that also may not exist in the service yet. The collection is validated server-side when you attempt to work with it.|

The following guides show you how to use each of these classes to build your application.

| Guide | Description |
|--|---|
| [Create a database](how-to-javascript-manage-databases.md) | Create databases |
| [Create a collection](how-to-javascript-manage-collections.md) | Create collections |

## See also

- [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos)
- [API reference](https://docs.mongodb.com/drivers/node)

## Next steps

Now that you've connected to a MongoDB API account, use the next guide to create and manage databases.

> [!div class="nextstepaction"]
> [Create a database in Azure Cosmos DB MongoDB API using JavaScript](how-to-javascript-manage-databases.md)