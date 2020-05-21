---
title: Node.js tutorial for the SQL API for Azure Cosmos DB
description: A Node.js tutorial that demonstrates how to connect to and query Azure Cosmos DB using the SQL API
author: deborahc
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: nodejs
ms.topic: tutorial
ms.date: 04/20/2020
ms.author: dech
#Customer intent: As a developer, I want to build a Node.js console application to access and manage SQL API account resources in Azure Cosmos DB, so that customers can better use the service.

---
# Tutorial: Build a Node.js console app with the JavaScript SDK to manage Azure Cosmos DB SQL API data

> [!div class="op_single_selector"]
> * [.NET](sql-api-get-started.md)
> * [Java](sql-api-java-get-started.md)
> * [Async Java](sql-api-async-java-get-started.md)
> * [Node.js](sql-api-nodejs-get-started.md)
> 

As a developer, you might have applications that use NoSQL document data. You can use a SQL API account in Azure Cosmos DB to store and access this document data. This tutorial shows you how to build a Node.js console application to create Azure Cosmos DB resources and query them.

In this tutorial, you will:

> [!div class="checklist"]
> * Create and connect to an Azure Cosmos DB account.
> * Set up your application.
> * Create a database.
> * Create a container.
> * Add items to the container.
> * Perform basic operations on the items, container, and database.

## Prerequisites 

Make sure you have the following resources:

* An active Azure account. If you don't have one, you can sign up for a [Free Azure Trial](https://azure.microsoft.com/pricing/free-trial/). 

  [!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

* [Node.js](https://nodejs.org/) v6.0.0 or higher.

## Create Azure Cosmos DB account

Let's create an Azure Cosmos DB account. If you already have an account you want to use, you can skip ahead to [Set up your Node.js application](#SetupNode). If you are using the Azure Cosmos DB Emulator, follow the steps at [Azure Cosmos DB Emulator](local-emulator.md) to set up the emulator and skip ahead to [Set up your Node.js application](#SetupNode). 

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

## <a id="SetupNode"></a>Set up your Node.js application

Before you start writing code to build the application, you can build the framework for your app. Run the following steps to set up your Node.js application that has the framework code:

1. Open your favorite terminal.
2. Locate the folder or directory where you'd like to save your Node.js application.
3. Create empty JavaScript files with the following commands:

   * Windows:
     * `fsutil file createnew app.js 0`
     * `fsutil file createnew config.js 0`
     * `md data`
     * `fsutil file createnew data\databaseContext.js 0`

   * Linux/OS X:
     * `touch app.js`
     * `touch config.js`
     * `mkdir data`
     * `touch data/databaseContext.js`

4. Create and initialize a `package.json` file. Use the following command:
   * ```npm init -y```

5. Install the @azure/cosmos module via npm. Use the following command:
   * ```npm install @azure/cosmos --save```

## <a id="Config"></a>Set your app's configurations

Now that your app exists, you need to make sure it can talk to Azure Cosmos DB. By updating a few configuration settings, as shown in the following steps, you can set your app to talk to Azure Cosmos DB:

1. Open the *config.js* file in your favorite text editor.

1. Copy and paste the following code snippet into the *config.js* file and set the properties `endpoint` and `key` to your Azure Cosmos DB endpoint URI and primary key. The database,  container names are set to **Tasks** and **Items**. The partition key you will use for this application is **/category**.

   :::code language="javascript" source="~/cosmosdb-nodejs-get-started/config.js":::

   You can find the endpoint and key details in the **Keys** pane of the [Azure portal](https://portal.azure.com).

   ![Get keys from Azure portal screenshot][keys]

The JavaScript SDK uses the generic terms *container* and *item*. A container can be a collection, graph, or table. An item can be a document, edge/vertex, or row, and is the content inside a container. In the previous code snippet, the `module.exports = config;` code is used to export the config object, so that you can reference it within the *app.js* file.

## Create a database and a container

1. Open the *databaseContext.js* file in your favorite text editor.

1. Copy and paste the following code to the *databaseContext.js* file. This code defines a function that creates the "Tasks", "Items" database and the container if they don't already exist in your Azure Cosmos account:

   :::code language="javascript" source="~/cosmosdb-nodejs-get-started/data/databaseContext.js" id="createDatabaseAndContainer":::

   A database is the logical container of items partitioned across containers. You create a database by using either the `createIfNotExists` or create function of the **Databases** class. A container consists of items which in the case of the SQL API is JSON documents. You create a container by using either the `createIfNotExists` or create function from the **Containers** class. After creating a container, you can store and query the data.

   > [!WARNING]
   > Creating a container has pricing implications. Visit our [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) so you know what to expect.

## Import the configuration

1. Open the *app.js* file in your favorite text editor.

1. Copy and paste the code below to import the `@azure/cosmos` module, the configuration, and the databaseContext that you defined in the previous steps. 

   :::code language="javascript" source="~/cosmosdb-nodejs-get-started/app.js" id="ImportConfiguration":::

## Connect to the Azure Cosmos account

In the *app.js* file, copy and paste the following code to use the previously saved endpoint and key to create a new CosmosClient object.

:::code language="javascript" source="~/cosmosdb-nodejs-get-started/app.js" id="CreateClientObjectDatabaseContainer":::

> [!Note]
> If connecting to the **Cosmos DB Emulator**, disable TLS verification for your node process:
>   ```javascript
>   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
>   const client = new CosmosClient({ endpoint, key });
>   ```

Now that you have the code to initialize the Azure Cosmos DB client, let's take a look at how to work with Azure Cosmos DB resources.

## <a id="QueryItem"></a>Query items

Azure Cosmos DB supports rich queries against JSON items stored in each container. The following sample code shows a query that you can run against the items in your container.You can query the items by using the query function of the `Items` class. Add the following code to the *app.js* file to query the items from your Azure Cosmos account:

:::code language="javascript" source="~/cosmosdb-nodejs-get-started/app.js" id="QueryItems":::

## <a id="CreateItem"></a>Create an item

An item can be created by using the create function of the `Items` class. When you're using the SQL API, items are projected as documents, which are user-defined (arbitrary) JSON content. In this tutorial, you create a new item within the tasks database.

1. In the app.js file, define the item definition:

   :::code language="javascript" source="~/cosmosdb-nodejs-get-started/app.js" id="DefineNewItem":::

1. Add the following code to create the previously defined item:

   :::code language="javascript" source="~/cosmosdb-nodejs-get-started/app.js" id="CreateItem":::

## <a id="ReplaceItem"></a>Update an item

Azure Cosmos DB supports replacing the contents of items. Copy and paste the following code to *app.js* file. This code gets an item from the container and updates the *isComplete* field to true.

:::code language="javascript" source="~/cosmosdb-nodejs-get-started/app.js" id="UpdateItem":::

## <a id="DeleteItem"></a>Delete an item

Azure Cosmos DB supports deleting JSON items. The following code shows how to get an item by its ID and delete it. Copy and paste the following code to *app.js* file:

:::code language="javascript" source="~/cosmosdb-nodejs-get-started/app.js" id="DeleteItem":::

## <a id="Run"></a>Run your Node.js application

Altogether, your code should look like this:

:::code language="javascript" source="~/cosmosdb-nodejs-get-started/app.js":::

In your terminal, locate your ```app.js``` file and run the command:

```bash 
node app.js
```

You should see the output of your get started app. The output should match the example text below.

```
Created database:
Tasks

Created container:
Items

Querying container: Items
1 - Pick up apples and strawberries.

Created new item: 3 - Complete Cosmos DB Node.js Quickstart ⚡

Updated item: 3 - Complete Cosmos DB Node.js Quickstart ⚡
Updated isComplete to true

Deleted item with id: 3
```

## <a id="GetSolution"></a>Get the complete Node.js tutorial solution

If you didn't have time to complete the steps in this tutorial, or just want to download the code, you can get it from [GitHub](https://github.com/Azure-Samples/azure-cosmos-db-sql-api-nodejs-getting-started ).

To run the getting started solution that contains all the code in this article, you will need:

* An [Azure Cosmos DB account][create-account].
* The [Getting Started](https://github.com/Azure-Samples/azure-cosmos-db-sql-api-nodejs-getting-started) solution available on GitHub.

Install the project's dependencies via npm. Use the following command:

* ```npm install``` 

Next, in the ```config.js``` file, update the config.endpoint and config.key values as described in [Step 3: Set your app's configurations](#Config).  

Then in your terminal, locate your ```app.js``` file and run the command:  

```bash  
node app.js 
```

## Clean up resources

When these resources are no longer needed, you can delete the resource group, Azure Cosmos DB account, and all the related resources. To do so, select the resource group that you used for the Azure Cosmos DB account, select **Delete**, and then confirm the name of the resource group to delete.

## Next steps

> [!div class="nextstepaction"]
> [Monitor an Azure Cosmos DB account](monitor-accounts.md)

[create-account]: create-sql-api-dotnet.md#create-account
[keys]: media/sql-api-nodejs-get-started/node-js-tutorial-keys.png
