---
title: Get started using Azure Cosmos DB for MongoDB and Python
description: Presents a Python code sample you can use to connect to and query using Azure Cosmos DB's API for MongoDB.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: quickstart
ms.date: 04/26/2022
ms.devlang: python
ms.custom: mode-api, ignite-2022
---

# Quickstart: Get started using Azure Cosmos DB for MongoDB and Python
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

> [!div class="op_single_selector"]
> * [.NET](create-mongodb-dotnet.md)
> * [Python](quickstart-python.md)
> * [Java](quickstart-java.md)
> * [Node.js](create-mongodb-nodejs.md)
> * [Golang](quickstart-go.md)
>  

This [quickstart](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) demonstrates how to:
1. Create an [Azure Cosmos DB for MongoDB account](introduction.md) 
2. Connect to your account using PyMongo
3. Create a sample database and collection
4. Perform CRUD operations in the sample collection

## Prerequisites to run the sample app

* [Python](https://www.python.org/downloads/) 3.9+ (It's best to run the [sample code](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) described in this article with this recommended version. Although it may work on older versions of Python 3.)
* [PyMongo](https://pypi.org/project/pymongo/) installed on your machine

<a id="create-account"></a>
## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount](../includes/cosmos-db-create-dbaccount-mongodb.md)]

## Learn the object model

Before you continue building the application, let's look into the hierarchy of resources in the API for MongoDB and the object model that's used to create and access these resources. The API for MongoDB creates resources in the following order:

* Azure Cosmos DB for MongoDB account
* Databases 
* Collections 
* Documents

To learn more about the hierarchy of entities, see the [Azure Cosmos DB resource model](../account-databases-containers-items.md) article.

## Get the code

Download the sample Python code [from the repository](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started) or use git clone:

```shell
git clone https://github.com/Azure-Samples/azure-cosmos-db-mongodb-python-getting-started
```

## Retrieve your connection string

When running the sample code, you have to enter your API for MongoDB account's connection string. Use the following steps to find it:

1. In the [Azure portal](https://portal.azure.com/), select your Azure Cosmos DB account.

2. In the left navigation select **Connection String**, and then select **Read-write Keys**. You'll use the copy buttons on the right side of the screen to copy the primary connection string.

> [!WARNING]
> Never check passwords or other sensitive data into source code.


## Run the code

```shell
python run.py
```

## Understand how it works

### Connecting

The following code prompts the user for the connection string. It's never a good idea to have your connection string in code since it enables anyone with it to read or write to your database.

```python
CONNECTION_STRING = getpass.getpass(prompt='Enter your primary connection string: ') # Prompts user for connection string
```

The following code creates a client connection your API for MongoDB and tests to make sure it's valid.

```python
client = pymongo.MongoClient(CONNECTION_STRING)
try:
    client.server_info() # validate connection string
except pymongo.errors.ServerSelectionTimeoutError:
    raise TimeoutError("Invalid API for MongoDB connection string or timed out when attempting to connect")
```

### Resource creation
The following code creates the sample database and collection that will be used to perform CRUD operations. When creating resources programmatically, it's recommended to use the API for MongoDB extension commands (as shown here) because these commands have the ability to set the resource throughput (RU/s) and configure sharding. 

Implicitly creating resources will work but will default to recommended values for throughput and will not be sharded.

```python
# Database with 400 RU throughput that can be shared across the DB's collections
db.command({'customAction': "CreateDatabase", 'offerThroughput': 400})
```

```python
 # Creates a unsharded collection that uses the DB s shared throughput
db.command({'customAction': "CreateCollection", 'collection': UNSHARDED_COLLECTION_NAME})
```

### Writing a document
The following inserts a sample document we will continue to use throughout the sample. We get its unique _id field value so that we can query it in subsequent operations.

```python
"""Insert a sample document and return the contents of its _id field"""
document_id = collection.insert_one({SAMPLE_FIELD_NAME: randint(50, 500)}).inserted_id
```

### Reading/Updating a document
The following queries, updates, and again queries for the document that we previously inserted.

```python
print("Found a document with _id {}: {}".format(document_id, collection.find_one({"_id": document_id})))

collection.update_one({"_id": document_id}, {"$set":{SAMPLE_FIELD_NAME: "Updated!"}})
print("Updated document with _id {}: {}".format(document_id, collection.find_one({"_id": document_id})))
```

### Deleting a document
Lastly, we delete the document we created from the collection.
```python
"""Delete the document containing document_id from the collection"""
collection.delete_one({"_id": document_id})
```

## Next steps
In this quickstart, you've learned how to create an API for MongoDB account, create a database and a collection with code, and perform CRUD operations. 

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](../../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json)
