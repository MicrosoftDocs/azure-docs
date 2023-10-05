---
title: Quickstart - Azure Cosmos DB for MongoDB for Python with MongoDB driver
description: Learn how to build a Python app to manage Azure Cosmos DB for MongoDB account resources in this quickstart.
author: diberry
ms.author: diberry
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: python
ms.topic: quickstart
ms.date: 11/08/2022
ms.custom: ignite-2022, devx-track-azurecli, devx-track-python
---

# Quickstart: Azure Cosmos DB for MongoDB for Python with MongoDB driver

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Python](quickstart-python.md)
> * [Java](quickstart-java.md)
> * [Node.js](quickstart-nodejs.md)
> * [Go](quickstart-go.md)
>

Get started with the PyMongo package to create databases, collections, and documents within your Azure Cosmos DB resource. Follow these steps to install the package and try out example code for basic tasks.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) are available on GitHub as a Python project.

In this quickstart, you'll communicate with the Azure Cosmos DB’s API for MongoDB by using one of the open-source MongoDB client drivers for Python, [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/). Also, you'll use the [MongoDB extension commands](./custom-commands.md), which are designed to help you create and obtain database resources that are specific to the [Azure Cosmos DB capacity model](../resource-model.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* [Python 3.8+](https://www.python.org/downloads/)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

### Prerequisite check

* In a terminal or command window, run `python --version`  to check that you have a recent version of Python.
* Run ``az --version`` (Azure CLI) or `Get-Module -ListAvailable Az*` (Azure PowerShell) to check that you have the appropriate Azure command-line tools installed.

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

### Create a new Python app

1. Create a new empty folder using your preferred terminal and change directory to the folder.

    > [!NOTE]
    > If you just want the finished code, download or fork and clone the [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) repo that has the full example. You can also `git clone` the repo in Azure Cloud Shell to walk through the steps shown in this quickstart.

2. Create a *requirements.txt* file that lists the [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) and [python-dotenv](https://pypi.org/project/python-dotenv/) packages.

    ```text
    # requirements.txt
    pymongo
    python-dotenv
    ```

3. Create a virtual environment and install the packages.

    #### [Windows](#tab/venv-windows)
    
    ```bash
    # py -3 uses the global python interpreter. You can also use python3 -m venv .venv.
    py -3 -m venv .venv
    source .venv/Scripts/activate   
    pip install -r requirements.txt
    ```
    
    #### [Linux / macOS](#tab/venv-linux+macos)
    
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```
    
    ---

### Configure environment variables

[!INCLUDE [Multi-tab](<./includes/environment-variables-connection-string.md>)]

## Object model

Let's look at the hierarchy of resources in the API for MongoDB and the object model that's used to create and access these resources. The Azure Cosmos DB creates resources in a hierarchy that consists of accounts, databases, collections, and documents.

:::image type="complex" source="media/quickstart-nodejs/resource-hierarchy.png" alt-text="Diagram of the Azure Cosmos DB hierarchy including accounts, databases, collections, and docs.":::
    Hierarchical diagram showing an Azure Cosmos DB account at the top. The account has two child database nodes. One of the database nodes includes two child collection nodes. The other database node includes a single child collection node. That single collection node has three child doc nodes.
:::image-end:::

Each type of resource is represented by a Python class. Here are the most common classes:

* [MongoClient](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html) - The first step when working with PyMongo is to create a MongoClient to connect to Azure Cosmos DB's API for MongoDB. The client object is used to configure and execute requests against the service.

* [Database](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html) - Azure Cosmos DB's API for MongoDB can support one or more independent databases.

* [Collection](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html) - A database can contain one or more collections. A collection is a group of documents stored in MongoDB, and can be thought of as roughly the equivalent of a table in a relational database.

* [Document](https://pymongo.readthedocs.io/en/stable/tutorial.html#documents) - A document is a set of key-value pairs. Documents have dynamic schema. Dynamic schema means that documents in the same collection don't need to have the same set of fields or structure. And common fields in a collection's documents may hold different types of data.

To learn more about the hierarchy of entities, see the [Azure Cosmos DB resource model](../resource-model.md) article.

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Get database](#get-database)
* [Get collection](#get-collection)
* [Create an index](#create-an-index)
* [Create a document](#create-a-document)
* [Get an document](#get-a-document)
* [Query documents](#query-documents)

The sample code described in this article creates a database named `adventureworks` with a collection named `products`. The `products` collection is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier. The complete sample code is at https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started/tree/main/001-quickstart/.

For the steps below, the database won't use sharding and shows a synchronous application using the [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) driver. For asynchronous applications, use the [Motor](https://www.mongodb.com/docs/drivers/motor/) driver.

### Authenticate the client

1. In the project directory, create an *run.py* file. In your editor, add require statements to reference packages you'll use, including the PyMongo and python-dotenv packages.

    :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="package_dependencies":::

2. Get the connection information from the environment variable defined in an *.env* file.

    :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="client_credentials":::

3. Define constants you'll use in the code.

    :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="constant_values":::

### Connect to Azure Cosmos DB’s API for MongoDB

Use the [MongoClient](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient) object to connect to your Azure Cosmos DB for MongoDB resource. The connect method returns a reference to the database.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="connect_client":::

### Get database

Check if the database exists with [list_database_names](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient.list_database_names) method. If the database doesn't exist, use the [create database extension command](./custom-commands.md#create-database) to create it with a specified provisioned throughput.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="new_database":::

### Get collection

Check if the collection exists with the [list_collection_names](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html#pymongo.database.Database.list_collection_names) method. If the collection doesn't exist, use the [create collection extension command](./custom-commands.md#create-collection) to create it.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="create_collection":::

### Create an index

Create an index using the [update collection extension command](./custom-commands.md#update-collection). You can also set the index in the create collection extension command. Set the index to `name` property in this example so that you can later sort with the cursor class [sort](https://pymongo.readthedocs.io/en/stable/api/pymongo/cursor.html#pymongo.cursor.Cursor.sort) method on product name.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="create_index":::

### Create a document

Create a document with the *product* properties for the `adventureworks` database:

* A *category* property. This property can be used as the logical partition key.
* A *name* property.
* An inventory *quantity* property.
* A *sale* property, indicating whether the product is on sale.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="new_doc":::

Create a document in the collection by calling the collection level operation [update_one](https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.update_one). In this example, you'll *upsert* instead of *create* a new document. Upsert isn't necessary in this example because the product *name* is random. However, it's a good practice to upsert in case you run the code more than once and the product name is the same.

The result of the `update_one` operation contains the `_id` field value that you can use in subsequent operations. The *_id* property was created automatically.

### Get a document

Use the [find_one](https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.find_one) method to get a document.

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="read_doc":::

In Azure Cosmos DB, you can perform a less-expensive [point read](https://devblogs.microsoft.com/cosmosdb/point-reads-versus-queries/) operation by using both the unique identifier (`_id`) and a partition key.

### Query documents

After you insert a doc, you can run a query to get all docs that match a specific filter. This example finds all docs that match a specific category: `gear-surf-surfboards`. Once the query is defined, call [`Collection.find`](https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.find) to get a [`Cursor`](https://pymongo.readthedocs.io/en/stable/api/pymongo/cursor.html#pymongo.cursor.Cursor) result, and then use [sort](https://pymongo.readthedocs.io/en/stable/api/pymongo/cursor.html#pymongo.cursor.Cursor.sort).

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="query_docs":::

Troubleshooting:

* If you get an error such as `The index path corresponding to the specified order-by item is excluded.`, make sure you [created the index](#create-an-index).

## Run the code

This app creates an API for MongoDB database and collection and creates a document and then reads the exact same document back. Finally, the example issues a query that returns documents that match a specified product *category*. With each step, the example outputs information to the console about the steps it has performed.

To run the app, use a terminal to navigate to the application directory and run the application.

```console
python run.py
```

The output of the app should be similar to this example:

:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="console_result":::

## Clean up resources

When you no longer need the Azure Cosmos DB for NoSQL account, you can delete the corresponding resource group.

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

1. Navigate to the resource group you previously created in the [Azure portal](https://portal.azure.com).

1. Select **Delete resource group**.

1. On the **Are you sure you want to delete** dialog, enter the name of the resource group, and then select **Delete**.

---

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB for MongoDB account, create a database, and create a collection using the PyMongo driver. You can now dive deeper into the Azure Cosmos DB for MongoDB to import more data, perform complex queries, and manage your Azure Cosmos DB MongoDB resources.

> [!div class="nextstepaction"]
> [Options to migrate your on-premises or cloud data to Azure Cosmos DB](../migration-choices.md)
