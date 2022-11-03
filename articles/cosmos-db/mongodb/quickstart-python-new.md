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
ms.date: 10/31/2022
ms.custom: devx-track-js, ignite-2022
---

# Quickstart: Azure Cosmos DB for MongoDB for Python with MongoDB driver

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Get started with the PyMongo package to create databases, collections, and documents within your Azure Cosmos DB resource. Follow these steps to install the package and try out example code for basic tasks.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) are available on GitHub as a Python project.

In this quickstart, you'll communicate with the Azure Cosmos DB’s API for MongoDB by using any of the open-source MongoDB client drivers for Python. Here, we'll use the [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) driver. Also, you'll use the [MongoDB extension commands](/azure/cosmos-db/mongodb/custom-commands), designed to help you create and obtain database resources that are specific to the [Azure Cosmos DB capacity model](/azure/cosmos-db/account-databases-containers-items).

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

Create a new empty folder using your preferred terminal. Or, you can fork and clone the [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) from GitHub.

Change directory to the root of the project folder. Make sure there's a *requirements.txt* file with lines for the [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/) and the [python-dotenv](https://pypi.org/project/python-dotenv/) packages.

```text
# requirements.txt
pymongo
python-dotenv
```
### Install packages

Create a virtual environment and install the packages with:

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

Let's look at the hierarchy of resources in the API for MongoDB and the object model that's used to create and access these resources. The API for MongoDB creates resources in the following order:

* [MongoClient](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html) - The first step when working with PyMongo is to create a MongoClient to connect to Azure Cosmos DB's API for MongoDB. The client object is used to configure and execute requests against the service.

* [Database](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html) - Azure Cosmos DB's API for MongoDB can support one or more independent databases.

* [Collection](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html) - A database can contain one or more collections. A collection is a group of documents stored in MongoDB, and can be thought of as roughly the equivalent of a table in a relational database.

* [Document](https://pymongo.readthedocs.io/en/stable/tutorial.html#documents) - A document is a set of key-value pairs. Documents have dynamic schema. Dynamic schema means that documents in the same collection don't need to have the same set of fields or structure, and common fields in a collection's documents may hold different types of data.

To learn more about the hierarchy of entities, see the [Azure Cosmos DB resource model](../account-databases-containers-items.md) article.

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Get database](#get-database)
* [Get collection](#get-collection)
* [Create an index](#create-an-index)
* [Create a document](#create-a-document)
* [Get an document](#get-a-document)
* [Query documents](#query-documents)

The sample code described in this article creates a database named `adventureworks` with a collection named `products`. The `products` collection is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier. The complete sample code is at https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/.

For the steps below, the database won't use sharding and shows a synchronous application uisng PyMongo. For asynchronous applications, use the [Motor](https://www.mongodb.com/docs/drivers/motor/) driver.

### Authenticate the client

1. In the project directory, create an *run.py* file. In your editor, add require statements to reference packages you'll use, including the PyMongo and python-dotenv packages.

    ```python
    import os
    import pymongo
    from dotenv import load_dotenv
    from random import randint
    ```
    <!--- 
        :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="package_dependencies":::
    --->
    
2. Get the connection information from the environment variable defined in an *.env* file.

    ```python
    load_dotenv()
    CONNECTION_STRING = os.environ.get('COSMOS_CONNECTION_STRING')
    ```
    <!--
        :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="client_credentials":::
    --->

3. Define constants you'll use in the code.

    ```python
    DB_NAME = "adventureworks"
    COLLECTION_NAME = "products"
    ```
    <!--
        :::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="constant_values":::
    --->

### Connect to Azure Cosmos DB’s API for MongoDB

Use the [MongoClient](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient) object to connect to your Azure Cosmos DB for MongoDB resource. The connect method returns a reference to the database.

```python
client = pymongo.MongoClient(CONNECTION_STRING)
```
<!--- 
:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="connect_client":::
--->

### Get database

Check if the database exists with [list_database_names](https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient.list_database_names) method. If the database doesn't exist, use the [create database extension command](https://learn.microsoft.com/azure/cosmos-db/mongodb/custom-commands#create-database) to create it with a specified provisioned throughput.

```python
# Create database if it doesn't exist
db = client[DB_NAME]
if DB_NAME not in client.list_database_names():
    # Database with 400 RU throughput that can be shared across the DB's collections
    db.command({'customAction': "CreateDatabase", 'offerThroughput': 400})
    print("Created db {} with shared throughput.\n". format(DB_NAME))
else:
    print("Using database: {}\n".format(DB_NAME))
```
<!---
:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="new_database" :::
--->

### Get collection

Check if the collection exists with the [list_collection_names](https://pymongo.readthedocs.io/en/stable/api/pymongo/database.html#pymongo.database.Database.list_collection_names) method. If the collection doesn't exist, use the [create collection extension command](https://learn.microsoft.com/azure/cosmos-db/mongodb/custom-commands#create-collection) to create it.

```python
# Create collection if it doesn't exist
collection = db[COLLECTION_NAME]
if COLLECTION_NAME not in db.list_collection_names():
    # Creates a unsharded collection that uses the DBs shared throughput
    db.command({'customAction': "CreateCollection", 'collection': COLLECTION_NAME})
    print("Created collection '{}'.\n". format(COLLECTION_NAME))
else:
    print("Using collection: '{}'.\n".format(COLLECTION_NAME))
```
<!---
:::code language="python" source="~/azure-cosmos-db-mongodb-python-getting-started/001-quickstart/run.py" id="new_collection":::
--->

### Create an index

Create an index using the [update collection extension command](/azure/cosmos-db/mongodb/custom-commands#update-collection). You can also set the index in the create collection extension command. Set the index to `name` property in this example so that you can later sort with the cursor class [sort](https://pymongo.readthedocs.io/en/stable/api/pymongo/cursor.html#pymongo.cursor.Cursor.sort) method on product name.

```python
indexes = [{'key': {'_id': 1}, 'name': "_id_1"},{'key': {'name': 2}, 'name': "_id_2"}]
db.command({'customAction': "UpdateCollection", 'collection': COLLECTION_NAME, 'indexes': indexes})
print("Indexes are: {}\n".format(sorted(collection.index_information())))
```
<!---
:::code language="python" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="create_index":::
--->

### Create a document

Create a document with the *product* properties for the `adventureworks` database:

* An _id property for the unique identifier of the product.
* A *category* property. This property can be used as the logical partition key.
* A *name* property.
* An inventory *quantity* property.
* A *sale* property, indicating whether the product is on sale.

```python
"""Create new document and upsert (create or replace) to collection"""
product = {
    'category': 'gear-surf-surfboards',
    'name': 'Yamba Surfboard-{}'.format(randint(50, 5000)),
    'quantity': 1,
    'sale': False
}
result = collection.update_one(
    {'name': product['name']},
    {'$set': product}, 
    upsert=True)
print("Upserted document with _id {}\n".format(result.upserted_id))
```
<!---
:::code language="python" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="new_doc":::
--->

Create a document in the collection by calling the collection level operation [update_one](https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.update_one). In this example, we chose to *upsert* instead of *create* a new document in case you run this sample code more than once.

### Get a document

In Azure Cosmos DB, you can perform a less-expensive [point read](https://devblogs.microsoft.com/cosmosdb/point-reads-versus-queries/) operation by using both the unique identifier (`_id`) and partition key (`category`).

```python
doc = collection.find_one({"_id": result.upserted_id})
print("Found a document with _id {}: {}\n".format(result.upserted_id, doc))
```
<!---
:::code language="python" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="read_doc":::
--->

### Query documents

After you insert a doc, you can run a query to get all docs that match a specific filter. This example finds all docs that match a specific category: `gear-surf-surfboards`. Once the query is defined, call [`Collection.find`](https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.find) to get a [`Cursor`](https://pymongo.readthedocs.io/en/stable/api/pymongo/cursor.html#pymongo.cursor.Cursor) result.

```python
"""Query for documents in the collection"""
print("Products with category 'gear-surf-surfboards':\n")
allProductsQuery = {
    "category": "gear-surf-surfboards"
} 
for doc in collection.find(allProductsQuery).sort('name', pymongo.ASCENDING):
    print("Found a product with _id {}: {}\n".format(doc["_id"], doc))
```
<!---
:::code language="python" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="query_doc":::
--->

Troubleshooting:

* If you get an error such as `The index path corresponding to the specified order-by item is excluded.`, make sure you [created the index](#create-an-index).

## Run the code

This app creates an API for MongoDB database and collection and creates a document and then reads the exact same document back. Finally, the example issues a query that should only return that single doc. With each step, the example outputs information to the console about the steps it has performed.

To run the app, use a terminal to navigate to the application directory and run the application.

```console
python run.py
```

The output of the app should be similar to this example:

```console
Created db 'adventureworks' with shared throughput.

Created collection 'products'.

Indexes are: ['_id_', 'name_1']

Upserted document with _id <ID>

Found a document with _id <ID>: {'_id': <ID>, 'category': 'gear-surf-surfboards', 'name': 'Yamba Surfboard-50', 'quantity': 1, 'sale': False}

Products with category 'gear-surf-surfboards':

Found a product with _id <ID>: {'_id': ObjectId('<ID>'), 'name': 'Yamba Surfboard-386', 'category': 'gear-surf-surfboards', 'quantity': 1, 'sale': False}
```

<!---
:::code language="python" source="~/samples-cosmosdb-mongodb-javascript/001-quickstart/index.js" id="console_result":::
--->

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
> [Options to migrate your on-premises or cloud data to Azure Cosmos DB](/azure/cosmos-db/migration-choices)
