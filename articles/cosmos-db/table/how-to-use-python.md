---
title: Use the Azure Tables client library for Python
description: Store structured data in the cloud using the Azure Tables client library for Python.
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: python
ms.topic: sample
ms.date: 03/23/2021
author: sakash279
ms.author: akshanka
ms.reviewer: sngun
ms.custom: devx-track-python
---
# Get started with Azure Tables client library using Python
[!INCLUDE[appliesto-table-api](../includes/appliesto-table-api.md)]

[!INCLUDE [storage-selector-table-include](../../../includes/storage-selector-table-include.md)]
[!INCLUDE [storage-table-applies-to-storagetable-and-cosmos](../../../includes/storage-table-applies-to-storagetable-and-cosmos.md)]

The Azure Table storage and the Azure Cosmos DB are services that store structured NoSQL data in the cloud, providing a key/attribute store with a schemaless design. Because Table storage and Azure Cosmos DB are schemaless, it's easy to adapt your data as the needs of your application evolve. Access to the table storage and table API data is fast and cost-effective for many types of applications, and is typically lower in cost than traditional SQL for similar volumes of data.

You can use the Table storage or the Azure Cosmos DB to store flexible datasets like user data for web applications, address books, device information, or other types of metadata your service requires. You can store any number of entities in a table, and a storage account may contain any number of tables, up to the capacity limit of the storage account.

### About this sample

This sample shows you how to use the [Azure Data Tables SDK for Python](https://pypi.org/project/azure-data-tables/) in common Azure Table storage scenarios. The name of the SDK indicates it is for use with Azure Tables storage, but it works with both Azure Cosmos DB and Azure Tables storage, each service just has a unique endpoint. These scenarios are explored using Python examples that illustrate how to:

* Create and delete tables
* Insert and query entities
* Modify entities

While working through the scenarios in this sample, you may want to refer to the [Azure Data Tables SDK for Python API reference](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/tables/azure-data-tables).

## Prerequisites

You need the following to complete this sample successfully:

* [Python](https://www.python.org/downloads/) 2.7 or 3.6+.
* [Azure Data Tables SDK for Python](https://pypi.python.org/pypi/azure-data-tables/). This SDK connects with both Azure Table storage and the Azure Cosmos DB Table API.
* [Azure Storage account](../../storage/common/storage-account-create.md) or [Azure Cosmos DB account](https://azure.microsoft.com/try/cosmosdb/).

## Create an Azure service account

[!INCLUDE [cosmos-db-create-azure-service-account](../includes/cosmos-db-create-azure-service-account.md)]

**Create an Azure storage account**

[!INCLUDE [cosmos-db-create-storage-account](../includes/cosmos-db-create-storage-account.md)]

**Create an Azure Cosmos DB Table API account**

[!INCLUDE [cosmos-db-create-tableapi-account](../includes/cosmos-db-create-tableapi-account.md)]

## Install the Azure Data Tables SDK for Python

After you've created a Storage account, your next step is to install the [Microsoft Azure Data Tables SDK for Python](https://pypi.python.org/pypi/azure-data-tables/). For details on installing the SDK, refer to the [README.md](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/tables/azure-data-tables/README.md) file in the Data Tables SDK for Python repository on GitHub.

## Import the TableServiceClient and TableEntity classes

To work with entities in the Azure Data Tables service in Python, you use the `TableServiceClient` and `TableEntity` classes. Add this code near the top your Python file to import both:

```python
from azure.data.tables import TableServiceClient
from azure.data.tables import TableEntity
```

## Connect to Azure Table service
You can either connect to the Azure Storage account or the Azure Cosmos DB Table API account. Get the shared key or connection string based on the type of account you are using.

### Creating the Table service client from a shared key

Create a `TableServiceClient` object, and pass in your Cosmos DB or Storage account name, account key and table endpoint. Replace `myaccount`, `mykey` and `mytableendpoint` with your Cosmos DB or Storage account name, key and table endpoint.

```python
from azure.core.credentials import AzureNamedKeyCredential

credential = AzureNamedKeyCredential("myaccount", "mykey")
table_service = TableServiceClient(endpoint="mytableendpoint", credential=credential)
```

### Creating the Table service client from a connection string

Copy your Cosmos DB or Storage account connection string from the Azure portal, and create a `TableServiceClient` object using your copied connection string:

```python
table_service = TableServiceClient.from_connection_string(conn_str='DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey;TableEndpoint=mytableendpoint;')
```

## Create a table

Call `create_table` to create the table.

```python
table_service.create_table('tasktable')
```

## Add an entity to a table

Create a table in your account and get a `TableClient` to perform operations on the newly created table. To add an entity, you first create an object that represents your entity, then pass the object to the `TableClient.create_entity` method. The entity object can be a dictionary or an object of type `TableEntity`, and defines your entity's property names and values. Every entity must include the required [PartitionKey and RowKey](#partitionkey-and-rowkey) properties, in addition to any other properties you define for the entity.

This example creates a dictionary object representing an entity, then passes it to the `create_entity` method to add it to the table:

```python
table_client = table_service.get_table_client(table_name="tasktable")
task = {u'PartitionKey': u'tasksSeattle', u'RowKey': u'001',
        u'description': u'Take out the trash', u'priority': 200}
table_client.create_entity(entity=task)
```

This example creates an `TableEntity` object, then passes it to the `create_entity` method to add it to the table:

```python
task = TableEntity()
task[u'PartitionKey'] = u'tasksSeattle'
task[u'RowKey'] = u'002'
task[u'description'] = u'Wash the car'
task[u'priority'] = 100
table_client.create_entity(task)
```

### PartitionKey and RowKey

You must specify both a **PartitionKey** and a **RowKey** property for every entity. These are the unique identifiers of your entities, as together they form the primary key of an entity. You can query using these values much faster than you can query any other entity properties because only these properties are indexed.

The Table service uses **PartitionKey** to intelligently distribute table entities across storage nodes. Entities that have the same  **PartitionKey** are stored on the same node. **RowKey** is the unique ID of the entity within the partition it belongs to.

## Update an entity

To update all of an entity's property values, call the `update_entity` method. This example shows how to replace an existing entity with an updated version:

```python
task = {u'PartitionKey': u'tasksSeattle', u'RowKey': u'001',
        u'description': u'Take out the garbage', u'priority': 250}
table_client.update_entity(task)
```

If the entity that is being updated doesn't already exist, then the update operation will fail. If you want to store an entity whether it exists or not, use `upsert_entity`. In the following example, the first call will replace the existing entity. The second call will insert a new entity, since no entity with the specified PartitionKey and RowKey exists in the table.

```python
# Replace the entity created earlier
task = {u'PartitionKey': u'tasksSeattle', u'RowKey': u'001',
        u'description': u'Take out the garbage again', u'priority': 250}
table_client.upsert_entity(task)

# Insert a new entity
task = {u'PartitionKey': u'tasksSeattle', u'RowKey': u'003',
        u'description': u'Buy detergent', u'priority': 300}
table_client.upsert_entity(task)
```

> [!TIP]
> The **mode=UpdateMode.REPLACE** parameter in `update_entity` method replaces all properties and values of an existing entity, which you can also use to remove properties from an existing entity. The **mode=UpdateMode.MERGE** parameter is used by default to update an existing entity with new or modified property values without completely replacing the entity.

## Modify multiple entities

To ensure the atomic processing of a request by the Table service, you can submit multiple operations together in a batch. First, add multiple operations to a list. Next, call `Table_client.submit_transaction` to submit the operations in an atomic operation. All entities to be modified in batch must be in the same partition.

This example adds two entities together in a batch:

```python
task004 = {u'PartitionKey': u'tasksSeattle', u'RowKey': '004',
           'description': u'Go grocery shopping', u'priority': 400}
task005 = {u'PartitionKey': u'tasksSeattle', u'RowKey': '005',
           u'description': u'Clean the bathroom', u'priority': 100}
operations = [("create", task004), ("create", task005)]
table_client.submit_transaction(operations)
```

## Query for an entity

To query for an entity in a table, pass its PartitionKey and RowKey to the `Table_client.get_entity` method.

```python
task = table_client.get_entity('tasksSeattle', '001')
print(task['description'])
print(task['priority'])
```

## Query a set of entities

You can query for a set of entities by supplying a filter string with the **query_filter** parameter. This example finds all tasks in Seattle by applying a filter on PartitionKey:

```python
tasks = table_client.query_entities(query_filter="PartitionKey eq 'tasksSeattle'")
for task in tasks:
    print(task['description'])
    print(task['priority'])
```

## Query a subset of entity properties

You can also restrict which properties are returned for each entity in a query. This technique, called *projection*, reduces bandwidth and can improve query performance, especially for large entities or result sets. Use the **select** parameter and pass the names of the properties you want returned to the client.

The query in the following code returns only the descriptions of entities in the table.

> [!NOTE]
> The following snippet works only against the Azure Storage. It is not supported by the Storage Emulator.

```python
tasks = table_client.query_entities(
    query_filter="PartitionKey eq 'tasksSeattle'", select='description')
for task in tasks:
    print(task['description'])
```

## Query for an entity without partition and row keys

You can also list entities within a table without using the partition and row keys. Use the `table_client.list_entities` method as show in the following example:

```python
print("Get the first item from the table")
tasks = table_client.list_entities()
lst = list(tasks)
print(lst[0])
```

## Delete an entity

Delete an entity by passing its **PartitionKey** and **RowKey** to the `delete_entity` method.

```python
table_client.delete_entity('tasksSeattle', '001')
```

## Delete a table

If you no longer need a table or any of the entities within it, call the `delete_table` method to permanently delete the table from Azure Storage.

```python
table_service.delete_table('tasktable')
```

## Next steps

* [FAQ - Develop with the Table API](table-api-faq.yml)
* [Azure Data Tables SDK for Python API reference](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/tables/azure-data-tables)
* [Python Developer Center](https://azure.microsoft.com/develop/python/)
* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md): A free, cross-platform application for working visually with Azure Storage data on Windows, macOS, and Linux.
* [Working with Python in Visual Studio (Windows)](/visualstudio/python/overview-of-python-tools-for-visual-studio)

