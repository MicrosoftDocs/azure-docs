---
title: Quickstart - Azure Cosmos DB for MongoDB driver for MongoDB
description: Learn how to build a Node.js app to manage Azure Cosmos DB for MongoDB account resources and data in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: javascript
ms.topic: quickstart
ms.date: 07/06/2022
ms.custom: devx-track-js, ignite-2022, devguide-js, cosmos-db-dev-journey, devx-track-azurecli
---

# Quickstart: Azure Cosmos DB for MongoDB driver for Node.js

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Python](quickstart-python.md)
> * [Java](quickstart-java.md)
> * [Node.js](quickstart-nodejs.md)
> * [Go](quickstart-go.md)
>

Get started with the MongoDB npm package to create databases, collections, and docs within your Azure Cosmos DB resource. Follow these steps to  install the package and try out example code for basic tasks.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[API for MongoDB reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (NuGet)](https://www.npmjs.com/package/mongodb)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- [Node.js LTS](https://nodejs.org/en/download/)
- [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

### Prerequisite check

- In a terminal or command window, run ``node --version`` to check that Node.js is one of the LTS versions.
- Run ``az --version`` (Azure CLI) or ``Get-Module -ListAvailable AzureRM`` (Azure PowerShell) to check that you have the appropriate Azure command-line tools installed.

## Setting up

This section walks you through creating an Azure Cosmos DB account and setting up a project that uses the MongoDB npm package.

### Create an Azure Cosmos DB account

This quickstart will create a single Azure Cosmos DB account using the API for MongoDB.

#### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - create resources](<./includes/azure-cli-create-resource-group-and-resource.md>)]

#### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - create resource group and resources](<./includes/powershell-create-resource-group-and-resource.md>)]

#### [Portal](#tab/azure-portal)

[!INCLUDE [Portal - create resource](<./includes/portal-create-resource.md>)]

---

### Get MongoDB connection string

#### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - get connection string](<./includes/azure-cli-get-connection-string.md>)]

#### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - get connection string](<./includes/powershell-get-connection-string.md>)]

#### [Portal](#tab/azure-portal)

[!INCLUDE [Portal - get connection string](<./includes/portal-get-connection-string-from-resource.md>)]

---

### Create a new JavaScript app

Create a new JavaScript application in an empty folder using your preferred terminal. Use the [``npm init``](https://docs.npmjs.com/cli/v8/commands/npm-init) command to begin the prompts to create the `package.json` file. Accept the defaults for the prompts.

```console
npm init
```

### Install the package

Add the [MongoDB](https://www.npmjs.com/package/mongodb) npm package to the JavaScript project. Use the [``npm install package``](https://docs.npmjs.com/cli/v8/commands/npm-install) command specifying the name of the npm package. The `dotenv` package is used to read the environment variables from a `.env` file during local development.

```console
npm install mongodb dotenv
```

### Configure environment variables

[!INCLUDE [Multi-tab](<./includes/environment-variables-connection-string.md>)]

## Object model

Before you start building the application, let's look into the hierarchy of resources in Azure Cosmos DB. Azure Cosmos DB has a specific object model used to create and access resources. The Azure Cosmos DB creates resources in a hierarchy that consists of accounts, databases, collections, and docs.

:::image type="complex" source="media/quickstart-nodejs/resource-hierarchy.png" alt-text="Diagram of the Azure Cosmos DB hierarchy including accounts, databases, collections, and docs.":::
    Hierarchical diagram showing an Azure Cosmos DB account at the top. The account has two child database nodes. One of the database nodes includes two child collection nodes. The other database node includes a single child collection node. That single collection node has three child doc nodes.
:::image-end:::

You'll use the following MongoDB classes to interact with these resources:

- [``MongoClient``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html) - This class provides a client-side logical representation for the API for MongoDB layer on Azure Cosmos DB. The client object is used to configure and execute requests against the service.
- [``Db``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html) - This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it.
- [``Collection``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Collection.html) - This class is a reference to a collection that also may not exist in the service yet. The collection is validated server-side when you attempt to work with it.

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Get database instance](#get-database-instance)
- [Get collection instance](#get-collection-instance)
- [Chained instances](#chained-instances)
- [Create an index](#create-an-index)
- [Create a doc](#create-a-doc)
- [Get an doc](#get-a-doc)
- [Query docs](#query-docs)

The sample code described in this article creates a database named ``adventureworks`` with a collection named ``products``. The ``products`` collection is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

For this procedure, the database won't use sharding.

### Authenticate the client

1. From the project directory, create an *index.js* file. In your editor, add requires statements to reference the MongoDB and DotEnv npm packages.

    :::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="package_dependencies":::

2. Define a new instance of the ``MongoClient,`` class using the constructor, and [``process.env.``](https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_env) to read the environment variable you created earlier.

    :::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="client_credentials":::

For more information on different ways to create a ``MongoClient`` instance, see [MongoDB NodeJS Driver Quick Start](https://www.npmjs.com/package/mongodb#quick-start).

### Set up asynchronous operations

In the ``index.js`` file, add the following code to support the asynchronous operations:

```javascript
async function main(){

// The remaining operations are added here
// in the main function

}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
```

The following code snippets should be added into the *main* function in order to handle the async/await syntax.

### Connect to the database

Use the [``MongoClient.connect``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html#connect) method to connect to your Azure Cosmos DB for MongoDB resource. The connect method returns a reference to the database.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="connect_client":::

### Get database instance

Use the [``MongoClient.db``](https://mongodb.github.io/node-mongodb-native/4.5/classes/MongoClient.html#db) gets a reference to a database.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="new_database" :::

### Get collection instance

The [``MongoClient.Db.collection``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Db.html#collection) gets a reference to a collection.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="new_collection":::

### Chained instances

You can chain the client, database, and collection together. Chaining is more convenient if you need to access multiple databases or collections.

```javascript
const db = await client.db(`adventureworks`).collection('products').updateOne(query, update, options)
```

### Create an index

Use the [``Collection.createIndex``](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#createIndex) to create an index on the document's properties you intend to use for sorting with the MongoDB's [``FindCursor.sort``](https://mongodb.github.io/node-mongodb-native/4.7/classes/FindCursor.html#sort) method.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="create_index":::

### Create a doc

Create a doc with the *product* properties for the `adventureworks` database:

- An _id property for the unique identifier of the product.
- A *category* property. This property can be used as the logical partition key.
- A *name* property.
- An inventory *quantity* property.
- A *sale* property, indicating whether the product is on sale.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="new_doc":::

Create an doc in the collection by calling [``Collection.UpdateOne``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Collection.html#updateOne). In this example, we chose to *upsert* instead of *create* a new doc in case you run this sample code more than once.

### Get a doc

In Azure Cosmos DB, you can perform a less-expensive [point read](https://devblogs.microsoft.com/cosmosdb/point-reads-versus-queries/) operation by using both the unique identifier (``_id``) and partition key (``category``).

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="read_doc" :::

### Query docs

After you insert a doc, you can run a query to get all docs that match a specific filter. This example finds all docs that match a specific category: `gear-surf-surfboards`. Once the query is defined, call [``Collection.find``](https://mongodb.github.io/node-mongodb-native/4.5/classes/Collection.html#find) to get a [``FindCursor``](https://mongodb.github.io/node-mongodb-native/4.7/classes/FindCursor.html) result. Convert the cursor into an array to use JavaScript array methods.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="query_docs" :::

Troubleshooting:

- If you get an error such as `The index path corresponding to the specified order-by item is excluded.`, make sure you [created the index](#create-an-index).

## Run the code

This app creates an API for MongoDB database and collection and creates a doc and then reads the exact same doc back. Finally, the example issues a query that should only return that single doc. With each step, the example outputs information to the console about the steps it has performed.

To run the app, use a terminal to navigate to the application directory and run the application.

```console
node index.js
```

The output of the app should be similar to this example:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="console_result" :::

## Clean up resources

When you no longer need the Azure Cosmos DB for MongoDB account, you can delete the corresponding resource group.

### [Azure CLI](#tab/azure-cli)

Use the [``az group delete``](/cli/azure/group#az-group-delete) command to delete the resource group.

```azurecli-interactive
az group delete --name $resourceGroupName
```

### [PowerShell](#tab/azure-powershell)

Use the [``Remove-AzResourceGroup``](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to delete the resource group.

```azurepowershell-interactive
$parameters = @{
    Name = $RESOURCE_GROUP_NAME
}
Remove-AzResourceGroup @parameters
```

### [Portal](#tab/azure-portal)

1. Navigate to the resource group you previously created in the Azure portal.

    > [!TIP]
    > In this quickstart, we recommended the name ``msdocs-cosmos-javascript-quickstart-rg``.
1. Select **Delete resource group**.

   :::image type="content" source="media/quickstart-nodejs/delete-resource-group-option.png" lightbox="media/quickstart-nodejs/delete-resource-group-option.png" alt-text="Screenshot of the Delete resource group option in the navigation bar for a resource group.":::

1. On the **Are you sure you want to delete** dialog, enter the name of the resource group, and then select **Delete**.

   :::image type="content" source="media/quickstart-nodejs/delete-confirmation.png" lightbox="media/quickstart-nodejs/delete-confirmation.png" alt-text="Screenshot of the delete confirmation page for a resource group.":::

---

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB for MongoDB account, create a database, and create a collection using the MongoDB driver. You can now dive deeper into the Azure Cosmos DB for MongoDB to import more data, perform complex queries, and manage your Azure Cosmos DB MongoDB resources.

> [!div class="nextstepaction"]
> [Migrate MongoDB to Azure Cosmos DB for MongoDB offline](../../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%3ftoc%3d%2fazure%2fcosmos-db%2ftoc.json)
