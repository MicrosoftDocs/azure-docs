---
title: Use Azure Cosmos DB Table API and Azure Table storage using Python
description: Store structured data in the cloud using Azure Table storage or the Azure Cosmos DB Table API.
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: python
ms.topic: sample
ms.date: 04/05/2018
author: wmengmsft
ms.author: wmeng
ms.reviewer: sngun
---
# Get started with Azure Table storage and the Azure Cosmos DB Table API using Python

[!INCLUDE [storage-selector-table-include](../../includes/storage-selector-table-include.md)]
[!INCLUDE [storage-table-applies-to-storagetable-and-cosmos](../../includes/storage-table-applies-to-storagetable-and-cosmos.md)]

Azure Table storage and Azure Cosmos DB are services that store structured NoSQL data in the cloud, providing a key/attribute store with a schemaless design. Because Table storage and Azure Cosmos DB are schemaless, it's easy to adapt your data as the needs of your application evolve. Access to Table storage and Table API data is fast and cost-effective for many types of applications, and is typically lower in cost than traditional SQL for similar volumes of data.

You can use Table storage or Azure Cosmos DB to store flexible datasets like user data for web applications, address books, device information, or other types of metadata your service requires. You can store any number of entities in a table, and a storage account may contain any number of tables, up to the capacity limit of the storage account.

### About this sample
This sample shows you how to use the [Azure Cosmos DB Table SDK for Python](https://pypi.python.org/pypi/azure-cosmosdb-table/) in common Azure Table storage scenarios. The name of the SDK indicates it is for use with Azure Cosmos DB, but it works with both Azure Cosmos DB and Azure Tables storage, each service just has a unique endpoint. These scenarios are explored using Python examples that illustrate how to:
* Create and delete tables
* Insert and query entities
* Modify entities

While working through the scenarios in this sample, you may want to refer to the [Azure Cosmos DB SDK for Python API reference](https://docs.microsoft.com/python/api/overview/azure/cosmosdb?view=azure-python).

## Prerequisites

You need the following to complete this sample successfully:

- [Python](https://www.python.org/downloads/) 2.7, 3.3, 3.4, 3.5, or 3.6
- [Azure Cosmos DB Table SDK for Python](https://pypi.python.org/pypi/azure-cosmosdb-table/). This SDK connects with both Azure Table storage and the Azure Cosmos DB Table API.
- [Azure Storage account](../storage/common/storage-account-create.md) or [Azure Cosmos DB account](https://azure.microsoft.com/try/cosmosdb/)

## Create an Azure service account
[!INCLUDE [cosmos-db-create-azure-service-account](../../includes/cosmos-db-create-azure-service-account.md)]

### Create an Azure storage account
[!INCLUDE [cosmos-db-create-storage-account](../../includes/cosmos-db-create-storage-account.md)]

### Create an Azure Cosmos DB Table API account
[!INCLUDE [cosmos-db-create-tableapi-account](../../includes/cosmos-db-create-tableapi-account.md)]

## Install the Azure Cosmos DB Table SDK for Python

After you've created a Storage account, your next step is to install the [Microsoft Azure Cosmos DB Table SDK for Python](https://pypi.python.org/pypi/azure-cosmosdb-table/). For details on installing the SDK, refer to the [README.rst](https://github.com/Azure/azure-cosmosdb-python/blob/master/azure-cosmosdb-table/README.rst) file in the Cosmos DB Table SDK for Python repository on GitHub.

## Import the TableService and Entity classes

To work with entities in the Azure Table service in Python, you use the [TableService][py_TableService] and [Entity][py_Entity] classes. Add this code near the top your Python file to import both:

```python
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity
```

## Connect to Azure Table service

To connect to Azure Storage Table service, create a [TableService][py_TableService] object, and pass in your Storage account name and account key. Replace `myaccount` and `mykey` with your account name and key.

```python
table_service = TableService(account_name='myaccount', account_key='mykey')
```

## Connect to Azure Cosmos DB

To connect to Azure Cosmos DB, copy your primary connection string from the Azure portal, and create a [TableService][py_TableService] object using your copied connection string:

```python
table_service = TableService(connection_string='DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey;TableEndpoint=myendpoint;')
```

## Create a table

Call [create_table][py_create_table] to create the table.

```python
table_service.create_table('tasktable')
```

## Add an entity to a table

To add an entity, you first create an object that represents your entity, then pass the object to the [TableService.insert_entity method][py_TableService]. The entity object can be a dictionary or an object of type [Entity][py_Entity], and defines your entity's property names and values. Every entity must include the required [PartitionKey and RowKey](#partitionkey-and-rowkey) properties, in addition to any other properties you define for the entity.

This example creates a dictionary object representing an entity, then passes it to the [insert_entity][py_insert_entity] method to add it to the table:

```python
task = {'PartitionKey': 'tasksSeattle', 'RowKey': '001',
        'description': 'Take out the trash', 'priority': 200}
table_service.insert_entity('tasktable', task)
```

This example creates an [Entity][py_Entity] object, then passes it to the [insert_entity][py_insert_entity] method to add it to the table:

```python
task = Entity()
task.PartitionKey = 'tasksSeattle'
task.RowKey = '002'
task.description = 'Wash the car'
task.priority = 100
table_service.insert_entity('tasktable', task)
```

### PartitionKey and RowKey

You must specify both a **PartitionKey** and a **RowKey** property for every entity. These are the unique identifiers of your entities, as together they form the primary key of an entity. You can query using these values much faster than you can query any other entity properties because only these properties are indexed.

The Table service uses **PartitionKey** to intelligently distribute table entities across storage nodes. Entities that have the same  **PartitionKey** are stored on the same node. **RowKey** is the unique ID of the entity within the partition it belongs to.

## Update an entity

To update all of an entity's property values, call the [update_entity][py_update_entity] method. This example shows how to replace an existing entity with an updated version:

```python
task = {'PartitionKey': 'tasksSeattle', 'RowKey': '001',
        'description': 'Take out the garbage', 'priority': 250}
table_service.update_entity('tasktable', task)
```

If the entity that is being updated doesn't already exist, then the update operation will fail. If you want to store an entity whether it exists or not, use [insert_or_replace_entity][py_insert_or_replace_entity]. In the following example, the first call will replace the existing entity. The second call will insert a new entity, since no entity with the specified PartitionKey and RowKey exists in the table.

```python
# Replace the entity created earlier
task = {'PartitionKey': 'tasksSeattle', 'RowKey': '001',
        'description': 'Take out the garbage again', 'priority': 250}
table_service.insert_or_replace_entity('tasktable', task)

# Insert a new entity
task = {'PartitionKey': 'tasksSeattle', 'RowKey': '003',
        'description': 'Buy detergent', 'priority': 300}
table_service.insert_or_replace_entity('tasktable', task)
```

> [!TIP]
> The [update_entity][py_update_entity] method replaces all properties and values of an existing entity, which you can also use to remove properties from an existing entity. You can use the [merge_entity][py_merge_entity] method to update an existing entity with new or modified property values without completely replacing the entity.

## Modify multiple entities

To ensure the atomic processing of a request by the Table service, you can submit multiple operations together in a batch. First, use the [TableBatch][py_TableBatch] class to add multiple operations to a single batch. Next, call [TableService][py_TableService].[commit_batch][py_commit_batch] to submit the operations in an atomic operation. All entities to be modified in batch must be in the same partition.

This example adds two entities together in a batch:

```python
from azure.cosmosdb.table.tablebatch import TableBatch
batch = TableBatch()
task004 = {'PartitionKey': 'tasksSeattle', 'RowKey': '004',
           'description': 'Go grocery shopping', 'priority': 400}
task005 = {'PartitionKey': 'tasksSeattle', 'RowKey': '005',
           'description': 'Clean the bathroom', 'priority': 100}
batch.insert_entity(task004)
batch.insert_entity(task005)
table_service.commit_batch('tasktable', batch)
```

Batches can also be used with the context manager syntax:

```python
task006 = {'PartitionKey': 'tasksSeattle', 'RowKey': '006',
           'description': 'Go grocery shopping', 'priority': 400}
task007 = {'PartitionKey': 'tasksSeattle', 'RowKey': '007',
           'description': 'Clean the bathroom', 'priority': 100}

with table_service.batch('tasktable') as batch:
    batch.insert_entity(task006)
    batch.insert_entity(task007)
```

## Query for an entity

To query for an entity in a table, pass its PartitionKey and RowKey to the [TableService][py_TableService].[get_entity][py_get_entity] method.

```python
task = table_service.get_entity('tasktable', 'tasksSeattle', '001')
print(task.description)
print(task.priority)
```

## Query a set of entities

You can query for a set of entities by supplying a filter string with the **filter** parameter. This example finds all tasks in Seattle by applying a filter on PartitionKey:

```python
tasks = table_service.query_entities(
    'tasktable', filter="PartitionKey eq 'tasksSeattle'")
for task in tasks:
    print(task.description)
    print(task.priority)
```

## Query a subset of entity properties

You can also restrict which properties are returned for each entity in a query. This technique, called *projection*, reduces bandwidth and can improve query performance, especially for large entities or result sets. Use the **select** parameter and pass the names of the properties you want returned to the client.

The query in the following code returns only the descriptions of entities in the table.

> [!NOTE]
> The following snippet works only against the Azure Storage. It is not supported by the storage emulator.

```python
tasks = table_service.query_entities(
    'tasktable', filter="PartitionKey eq 'tasksSeattle'", select='description')
for task in tasks:
    print(task.description)
```

## Delete an entity

Delete an entity by passing its **PartitionKey** and **RowKey** to the [delete_entity][py_delete_entity] method.

```python
table_service.delete_entity('tasktable', 'tasksSeattle', '001')
```

## Delete a table

If you no longer need a table or any of the entities within it, call the [delete_table][py_delete_table] method to permanently delete the table from Azure Storage.

```python
table_service.delete_table('tasktable')
```

## Next steps

* [FAQ - Develop with the Table API](https://docs.microsoft.com/azure/cosmos-db/faq)
* [Azure Cosmos DB SDK for Python API reference](https://docs.microsoft.com/python/api/overview/azure/cosmosdb?view=azure-python)
* [Python Developer Center](https://azure.microsoft.com/develop/python/)
* [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md): A free, cross-platform application for working visually with Azure Storage data on Windows, macOS, and Linux.
* [Working with Python in Visual Studio (Windows)](https://docs.microsoft.com/visualstudio/python/overview-of-python-tools-for-visual-studio)


[py_commit_batch]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.tableservice.tableservice?view=azure-python
[py_create_table]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.tableservice.tableservice?view=azure-python
[py_delete_entity]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.tableservice.tableservice?view=azure-python
[py_get_entity]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.tableservice.tableservice?view=azure-python
[py_insert_entity]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.tableservice.tableservice?view=azure-python
[py_insert_or_replace_entity]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.tableservice.tableservice?view=azure-python
[py_Entity]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.models.entity?view=azure-python
[py_merge_entity]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.tableservice.tableservice?view=azure-python
[py_update_entity]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.tableservice.tableservice?view=azure-python
[py_delete_table]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.tableservice.tableservice?view=azure-python
[py_TableService]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.tableservice.tableservice?view=azure-python
[py_TableBatch]: https://docs.microsoft.com/python/api/azure-cosmosdb-table/azure.cosmosdb.table.tableservice.tableservice?view=azure-python
