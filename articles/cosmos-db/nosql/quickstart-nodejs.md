---
title: Quickstart - Azure Cosmos DB for NoSQL client library for Node.js
description: Learn how to build a Node.js app to manage Azure Cosmos DB for NoSQL account resources in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: javascript
ms.topic: quickstart
ms.date: 05/08/2023
ms.custom: devx-track-js, mode-api, ignite-2022, devguide-js, cosmos-db-dev-journey, passwordless-js, devx-track-azurecli, devx-track-dotnet
---

# Quickstart - Azure Cosmos DB for NoSQL client library for Node.js

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Quickstart selector](includes/quickstart-selector.md)]

Get started with the Azure Cosmos DB client library for JavaScript to create databases, containers, and items within your account.  Follow these steps to  install the package and try out example code for basic tasks.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-sql-api-javascript-samples) are available on GitHub as a Node.js project.

## Prerequisites

- An Azure account with an active subscription.
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
- [Node.js LTS](https://nodejs.org/en/download/)
- [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

### Prerequisite check

- In a terminal or command window, run ``node --version`` to check that the Node.js version is one of the current long term support (LTS) versions.
- Run ``az --version`` (Azure CLI) or ``Get-Module -ListAvailable AzureRM`` (Azure PowerShell) to check that you have the appropriate Azure command-line tools installed.

## Setting up

This section walks you through creating an Azure Cosmos account and setting up a project that uses Azure Cosmos DB SQL API client library for JavaScript to manage resources.

### <a id="create-account"></a>Create an Azure Cosmos DB account

> [!TIP]
> No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required. If you create an account using the free trial, you can safely skip ahead to the [Create a new JavaScript project](#create-a-new-javascript-project) section.

[!INCLUDE [Create resource tabbed conceptual - ARM, Azure CLI, PowerShell, Portal](includes/create-resources.md)]


### Create a new JavaScript project

1. Create a new Node.js application in an empty folder using your preferred terminal.

    ```bash
    npm init -y
    ```

2. Edit the `package.json` file to use ES6 modules by adding the `"type": "module",` entry. This setting allows your code to use modern async/await syntax.

    :::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/package.json" highlight="6":::

### Install packages

### [Passwordless (Recommended)](#tab/passwordless)

1. Add the [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos) and [@azure/identity](https://www.npmjs.com/package/@azure/identity) npm packages to the Node.js project.

    ```bash
    npm install @azure/cosmos
    npm install @azure/identity
    ```

1. Add the [dotenv](https://www.npmjs.com/package/dotenv) npm package to read environment variables from a `.env` file.

    ```bash
    npm install dotenv
    ```

### [Connection String](#tab/connection-string)

1. Add the [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos) npm package to the Node.js project.

    ```bash
    npm install @azure/cosmos
    ```

1. Add the [dotenv](https://www.npmjs.com/package/dotenv) npm package to read environment variables from a `.env` file.

    ```bash
    npm install dotenv
    ```

---


### Configure environment variables

[!INCLUDE [Create environment variables for key and endpoint](includes/environment-variables.md)]


## Object model

[!INCLUDE [Explain DOCUMENT DB object model](includes/object-model.md)]

You'll use the following JavaScript classes to interact with these resources:

- [``CosmosClient``](/javascript/api/@azure/cosmos/cosmosclient) - This class provides a client-side logical representation for the Azure Cosmos DB service. The client object is used to configure and execute requests against the service.
- [``Database``](/javascript/api/@azure/cosmos/database) - This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it.
- [``Container``](/javascript/api/@azure/cosmos/container) - This class is a reference to a container that also may not exist in the service yet. The container is validated server-side when you attempt to work with it.
- [``SqlQuerySpec``](/javascript/api/@azure/cosmos/sqlqueryspec) - This interface represents a SQL query and any query parameters.
- [``QueryIterator<>``](/javascript/api/@azure/cosmos/queryiterator) - This class represents an iterator that can track the current page of results and get a new page of results.
- [``FeedResponse<>``](/javascript/api/@azure/cosmos/feedresponse) - This class represents a single page of responses from the iterator.

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Create a database](#create-a-database)
- [Create a container](#create-a-container)
- [Create an item](#create-an-item)
- [Get an item](#get-an-item)
- [Query items](#query-items)

The sample code described in this article creates a database named ``cosmicworks`` with a container named ``products``. The ``products`` table is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

For this sample code, the container will use the category as a logical partition key.

### Authenticate the client

[!INCLUDE [passwordless-overview](../../../includes/passwordless/passwordless-overview.md)]

## [Passwordless (Recommended)](#tab/passwordless)

[!INCLUDE [language-agnostic-default-azure-credential-overview](../../../includes/passwordless/dotnet-default-azure-credential-overview.md)]

[!INCLUDE [cosmos-nosql-create-assign-roles](../../../includes/passwordless/cosmos-nosql/cosmos-nosql-create-assign-roles.md)]

#### Authenticate using DefaultAzureCredential

[!INCLUDE [default-azure-credential-sign-in](../../../includes/passwordless/default-azure-credential-sign-in.md)]

From the project directory, open the *index.js* file. In your editor, add npm packages to work with Cosmos DB and authenticate to Azure. You'll authenticate to Cosmos DB for NoSQL using `DefaultAzureCredential` from the [`@azure/identity`](https://www.npmjs.com/package/@azure/identity) package. `DefaultAzureCredential` will automatically discover and use the account you signed-in with previously.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/002-quickstart-passwordless/index.js" range="5-9":::

Create an environment variable that specifies your Cosmos DB endpoint.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/002-quickstart-passwordless/index.js" range="11-13":::

Create constants for the database and container names.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/002-quickstart-passwordless/index.js" range="15-17":::


Create a new client instance of the [`CosmosClient`](/javascript/api/@azure/cosmos/cosmosclient) class constructor with the `DefaultAzureCredential` object and the endpoint.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/002-quickstart-passwordless/index.js" range="19-23":::

## [Connection String](#tab/connection-string)

From the project directory, open the *index.js* file. In your editor, import [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos) package to work with Cosmos DB and authenticate to Azure using the endpoint and key. 

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="5-6":::

Create environment variables that specify your Cosmos DB endpoint and key.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="8-11":::

Create constants for the database and container names.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="13-19":::

Create a new client instance of the [`CosmosClient`](/javascript/api/@azure/cosmos/cosmosclient) class constructor with the endpoint and key.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="21-22":::

---

### <a id="create-and-query-the-database"></a>
### Create a database

## [Passwordless (Recommended)](#tab/passwordless)


The `@azure/cosmos` client library enables you to perform *data* operations using [Azure RBAC](../role-based-access-control.md). However, to authenticate *management* operations, such as creating and deleting databases, you must use RBAC through one of the following options:

> - [Azure CLI scripts](manage-with-cli.md)
> - [Azure PowerShell scripts](manage-with-powershell.md)
> - [Azure Resource Manager templates (ARM templates)](manage-with-templates.md)
> - [Azure Resource Manager JavaScript client library](https://www.npmjs.com/package/@azure/arm-cosmosdb)

The Azure CLI approach is used in for this quickstart and passwordless access. Use the [`az cosmosdb sql database create`](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-create) command to create a Cosmos DB for NoSQL database.

```azurecli
# Create a SQL API database `
az cosmosdb sql database create `
    --account-name <cosmos-db-account-name> `
    --resource-group <resource-group-name> `
    --name cosmicworks
```

The command line to create a database is for PowerShell, shown on multiple lines for clarity. For other shell types, change the line continuation characters as appropriate. For example, for Bash, use backslash ("\\"). Or, remove the continuation characters and enter the command on one line.

## [Connection String](#tab/connection-string)

Add the following code to use the [``CosmosClient.Databases.createDatabaseIfNotExists``](/javascript/api/@azure/cosmos/databases#@azure-cosmos-databases-createifnotexists) method to create a new database if it doesn't already exist. This method returns a reference to the existing or newly created database.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="24-26":::

---

### Create a container

## [Passwordless (Recommended)](#tab/passwordless)

The `Microsoft.Azure.Cosmos` client library enables you to perform *data* operations using [Azure RBAC](../role-based-access-control.md). However, to authenticate *management* operations such as creating and deleting databases you must use RBAC through one of the following options:

> - [Azure CLI scripts](manage-with-cli.md)
> - [Azure PowerShell scripts](manage-with-powershell.md)
> - [Azure Resource Manager templates (ARM templates)](manage-with-templates.md)
> - [Azure Resource Manager JavaScript client library](https://www.npmjs.com/package/@azure/arm-cosmosdb)

The Azure CLI approach is used in this example. Use the [`az cosmosdb sql container create`](/cli/azure/cosmosdb/sql/container#az-cosmosdb-sql-container-create) command to create a Cosmos DB container.

```azurecli
# Create a SQL API container
az cosmosdb sql container create `
    --account-name <cosmos-db-account-name> `
    --resource-group <resource-group-name> `
    --database-name cosmicworks `
    --partition-key-path "/categoryId" `
    --name products
```

The command line to create a container is for PowerShell, on multiple lines for clarity. For other shell types, change the line continuation characters as appropriate. For example, for Bash, use backslash ("\\"). Or, remove the continuation characters and enter the command on one line. For Bash, you'll also need to add `MSYS_NO_PATHCONV=1` before the command so that Bash deals with the partition key parameter correctly.

After the resources have been created, use classes from the `Microsoft.Azure.Cosmos` client libraries to connect to and query the database.

## [Connection String](#tab/connection-string)

Add the following code to create a container with the [``Database.Containers.createContainerIfNotExistsAsync``](/javascript/api/@azure/cosmos/containers#@azure-cosmos-containers-createifnotexists) method. The method returns a reference to the container.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js" range="28-35":::

---

### Create an item

Add the following code to provide your data set. Each _product_ has a unique ID, name, category id (used as partition key) and other fields.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js"  range="37-84":::

Create a few items in the container by calling [``Container.Items.create``](/javascript/api/@azure/cosmos/items#@azure-cosmos-items-create) in a loop.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js"  range="86-91":::

### Get an item

In Azure Cosmos DB, you can perform a point read operation by using both the unique identifier (``id``) and partition key fields. In the SDK, call [``Container.item().read``](/javascript/api/@azure/cosmos/item#@azure-cosmos-item-read) passing in both values to return an item.

The partition key is specific to a container. In this Contoso Products container, the category id, `categoryId`, is used as the partition key.

:::code language="javascript" source="~/cosmos-db-sql-api-javascript-samples/001-quickstart/index.js"  range="93-95":::

### Query items

Add the following code to query for all items that match a specific filter. Create a [parameterized query expression](/javascript/api/@azure/cosmos/sqlqueryspec) then call the [``Container.Items.query``](/javascript/api/@azure/cosmos/items#@azure-cosmos-items-query) method. This method returns a [``QueryIterator``](/javascript/api/@azure/cosmos/queryiterator) that manages the pages of results. Then, use a combination of ``while`` and ``for`` loops to [``fetchNext``](/javascript/api/@azure/cosmos/queryiterator#@azure-cosmos-queryiterator-fetchnext) page of results as a [``FeedResponse``](/javascript/api/@azure/cosmos/feedresponse) and then iterate over the individual data objects.

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
