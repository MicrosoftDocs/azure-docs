---
title: Quickstart- Use Node.js to query from Azure Cosmos DB for NoSQL account
description: How to use Node.js to create an app that connects to Azure Cosmos DB for NoSQL account and queries data.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: javascript
ms.topic: quickstart
ms.date: 09/22/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: devx-track-js, mode-api, ignite-2022
---

# Quickstart: Use Node.js to connect and query data from Azure Cosmos DB for NoSQL account

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Node.js](quickstart-nodejs.md)
> * [Java](quickstart-java.md)
> * [Spring Data](quickstart-java-spring-data.md)
> * [Python](quickstart-python.md)
> * [Spark v3](quickstart-spark.md)
> * [Go](quickstart-go.md)
>

Get started with the Azure Cosmos DB client library for JavaScript to create databases, containers, and items within your account.  Without a credit card or an Azure subscription, you can set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb). Follow these steps to  install the package and try out example code for basic tasks.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-sql-api-javascript-samples) are available on GitHub as a Node.js project.

## Prerequisites

* In a terminal or command window, run ``node --version`` to check that the Node.js version is one of the current long term support (LTS) versions.
* Run ``az --version`` (Azure CLI) or ``Get-Module -ListAvailable AzureRM`` (Azure PowerShell) to check that you have the appropriate Azure command-line tools installed.

## Setting up

This section walks you through creating an Azure Cosmos account and setting up a project that uses Azure Cosmos DB SQL API client library for JavaScript to manage resources.

### Create an Azure Cosmos DB account

[!INCLUDE [Create resource tabbed conceptual - ARM, Azure CLI, PowerShell, Portal](includes/create-resources.md)]

### Configure environment variables

[!INCLUDE [Create environment variables for key and endpoint](includes/environment-variables.md)]

### Create a new JavaScript project

1. Create a new Node.js application in an empty folder using your preferred terminal.

    ```bash
    npm init -y
    ```

2. Edit the `package.json` file to use ES6 modules by adding the `"type": "module",` entry. This setting allows your code to use modern async/await syntax.

    :::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/package.json" highlight="6":::

### Install the package

1. Add the [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos) npm package to the Node.js project.

    ```bash
    npm install @azure/cosmos
    ```

1. Add the [dotenv](https://www.npmjs.com/package/dotenv) npm package to read environment variables from a `.env` file.

    ```bash
    npm install dotenv
    ```

### Create local development environment files

1. Create a `.gitignore` file and add the following value to ignore your environment file and your node_modules. This configuration file ensures that only secure and relevant files are checked into source code.

    ```text
    .env
    node_modules
    ```

1. Create a `.env` file with the following variables:

    ```text
    COSMOS_ENDPOINT=
    COSMOS_KEY=
    ```

### Create a code file

Create an `index.js` and add the following boilerplate code to the file to read environment variables:

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="1-3":::

### Add dependency to client library

Add the following code at the end of the `index.js` file to include the required dependency to programmatically access Cosmos DB.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="5-6":::

### Add environment variables to code file

Add the following code at the end of the `index.js` file to include the required environment variables. The endpoint and key were found at the end of the [account creation steps](#create-an-azure-cosmos-db-account).

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="8-11":::

### Add variables for names

Add the following variables to manage unique database and container names and the [partition key (pk)](../partitioning-overview.md).

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="13-19":::

In this example, we chose to add a timeStamp to the database and container in case you run this sample code more than once.

## Object model

[!INCLUDE [Explain DOCUMENT DB object model](includes/object-model.md)]

You'll use the following JavaScript classes to interact with these resources:

* [``CosmosClient``](/javascript/api/@azure/cosmos/cosmosclient) - This class provides a client-side logical representation for the Azure Cosmos DB service. The client object is used to configure and execute requests against the service.
* [``Database``](/javascript/api/@azure/cosmos/database) - This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it.
* [``Container``](/javascript/api/@azure/cosmos/container) - This class is a reference to a container that also may not exist in the service yet. The container is validated server-side when you attempt to work with it.
* [``SqlQuerySpec``](/javascript/api/@azure/cosmos/sqlqueryspec) - This interface represents a SQL query and any query parameters.
* [``QueryIterator<>``](/javascript/api/@azure/cosmos/queryiterator) - This class represents an iterator that can track the current page of results and get a new page of results.
* [``FeedResponse<>``](/javascript/api/@azure/cosmos/feedresponse) - This class represents a single page of responses from the iterator.

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Create a database](#create-a-database)
* [Create a container](#create-a-container)
* [Create an item](#create-an-item)
* [Get an item](#get-an-item)
* [Query items](#query-items)

The sample code described in this article creates a database named ``adventureworks`` with a container named ``products``. The ``products`` table is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

For this sample code, the container will use the category as a logical partition key.

### Authenticate the client

In the `index.js`, add the following code to use the resource **endpoint** and **key** to authenticate to Cosmos DB. Define a new instance of the [``CosmosClient``](/javascript/api/@azure/cosmos/cosmosclient) class.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="21-22":::

### Create a database

Add the following code to use the [``CosmosClient.Databases.createDatabaseIfNotExists``](/javascript/api/@azure/cosmos/databases#@azure-cosmos-databases-createifnotexists) method to create a new database if it doesn't already exist. This method will return a reference to the existing or newly created database.

:::code language="csharp" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="24-26":::

### Create a container

Add the following code to create a container with the [``Database.Containers.createContainerIfNotExistsAsync``](/javascript/api/@azure/cosmos/containers#@azure-cosmos-containers-createifnotexists) method. The method returns a reference to the container.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="28-35":::

### Create an item

Add the following code to provide your data set. Each _product_ has a unique ID, name, category name (used as partition key) and other fields.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js"  range="37-84":::

Create a few items in the container by calling [``Container.Items.create``](/javascript/api/@azure/cosmos/items#@azure-cosmos-items-create) in a loop.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js"  range="86-91":::

### Get an item

In Azure Cosmos DB, you can perform a point read operation by using both the unique identifier (``id``) and partition key fields. In the SDK, call [``Container.item().read``](/javascript/api/@azure/cosmos/item#@azure-cosmos-item-read) passing in both values to return an item.

The partition key is specific to a container. In this Contoso Products container, the category name, `categoryName`, is used as the partition key.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js"  range="93-95":::

### Query items

Add the following code to query for all items that match a specific filter. Create a [parameterized query expression](/javascript/api/@azure/cosmos/sqlqueryspec) then call the [``Container.Items.query``](/javascript/api/@azure/cosmos/items#@azure-cosmos-items-query) method. This method returns a [``QueryIterator``](/javascript/api/@azure/cosmos/queryiterator) that will manage the pages of results. Then, use a combination of ``while`` and ``for`` loops to [``fetchNext``](/javascript/api/@azure/cosmos/queryiterator#@azure-cosmos-queryiterator-fetchnext) page of results as a [``FeedResponse``](/javascript/api/@azure/cosmos/feedresponse) and then iterate over the individual data objects.

The query is programmatically composed to `SELECT * FROM todo t WHERE t.partitionKey = 'Bikes, Touring Bikes'`.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js"  range="97-114":::

If you want to use this data returned from the FeedResponse as an _item_, you need to create an [``Item``](/javascript/api/@azure/cosmos/item), using the [``Container.Items.read``](#get-an-item) method.

### Delete an item

Add the following code to delete an item you need to use the ID and partition key to get the item, then delete it. This example uses the [``Container.Item.delete``](/javascript/api/@azure/cosmos/item#@azure-cosmos-item-delete) method to delete the item.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js"  range="116-118":::

## Run the code

This app creates an Azure Cosmos DB SQL API database and container. The example then creates items and then reads one item back. Finally, the example issues a query that should only return items matching a specific category. With each step, the example outputs metadata to the console about the steps it has performed.

To run the app, use a terminal to navigate to the application directory and run the application.

```bash
node index.js
```

The output of the app should be similar to this example:

```output
contoso_1663276732626 database ready
products_1663276732626 container ready
'Touring-1000 Blue, 50' inserted
'Touring-1000 Blue, 46' inserted
'Mountain-200 Black, 42' inserted
Touring-1000 Blue, 50 read
08225A9E-F2B3-4FA3-AB08-8C70ADD6C3C2: Touring-1000 Blue, 50, BK-T79U-50
2C981511-AC73-4A65-9DA3-A0577E386394: Touring-1000 Blue, 46, BK-T79U-46
0F124781-C991-48A9-ACF2-249771D44029 Item deleted
```

## Clean up resources

[!INCLUDE [Clean up resources - Azure CLI, PowerShell, Portal](includes/clean-up-resources.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB SQL API account, create a database, and create a container using the JavaScript SDK. You can now dive deeper into the SDK to import more data, perform complex queries, and manage your Azure Cosmos DB SQL API resources.

> [!div class="nextstepaction"]
> [Tutorial: Build a Node.js console app](sql-api-nodejs-get-started.md)