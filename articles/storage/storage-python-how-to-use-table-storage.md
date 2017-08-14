---
title: How to use Azure Table storage with Python | Microsoft Docs
description: Store structured data in the cloud using Azure Table storage, a NoSQL data store.
services: storage
documentationcenter: python
author: mmacy
manager: timlt
editor: tysonn

ms.assetid: 7ddb9f3e-4e6d-4103-96e6-f0351d69a17b
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 05/16/2017
ms.author: marsma

---
# How to use Table storage in Python

[!INCLUDE [storage-selector-table-include](../../includes/storage-selector-table-include.md)]
[!INCLUDE [storage-table-cosmos-db-langsoon-tip-include](../../includes/storage-table-cosmos-db-langsoon-tip-include.md)]

This guide shows you how to perform common Azure Table storage scenarios in Python using the [Microsoft Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python). The scenarios covered include creating and deleting a table, and inserting and querying entities.

While working through the scenarios in this tutorial, you may wish to refer to the [Azure Storage SDK for Python API reference](https://azure-storage.readthedocs.io/en/latest/index.html).

[!INCLUDE [storage-table-concepts-include](../../includes/storage-table-concepts-include.md)]

[!INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

## Install the Azure Storage SDK for Python

Once you've created a storage account, your next step is to install the [Microsoft Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python). For details on installing the SDK, refer to the [README.rst](https://github.com/Azure/azure-storage-python/blob/master/README.rst) file in the Storage SDK for Python repository on GitHub.

## Create a table

To work with the Azure Table service in Python, you must import the [TableService][py_TableService] module. Since you'll be working with Table entities, you also need the [Entity][py_Entity] class. Add this code near the top your Python file to import both:

```python
from azure.storage.table import TableService, Entity
```

Create a [TableService][py_TableService] object, passing in your storage account name and account key. Replace `myaccount` and `mykey` with your account name and key, and call [create_table][py_create_table] to create the table in Azure Storage.

```python
table_service = TableService(account_name='myaccount', account_key='mykey')

table_service.create_table('tasktable')
```

## Add an entity to a table

To add an entity, you first create an object that represents your entity, then pass the object to the [TableService][py_TableService].[insert_entity][py_insert_entity] method. The entity object can be a dictionary or an object of type [Entity][py_Entity], and defines your entity's property names and values. Every entity must include the required [PartitionKey and RowKey](#partitionkey-and-rowkey) properties, in addition to any other properties you define for the entity.

This example creates a dictionary object representing an entity, then passes it to the [insert_entity][py_insert_entity] method to add it to the table:

```python
task = {'PartitionKey': 'tasksSeattle', 'RowKey': '001', 'description' : 'Take out the trash', 'priority' : 200}
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
task = {'PartitionKey': 'tasksSeattle', 'RowKey': '001', 'description' : 'Take out the garbage', 'priority' : 250}
table_service.update_entity('tasktable', task)
```

If the entity that is being updated doesn't already exist, then the update operation will fail. If you want to store an entity whether it exists or not, use [insert_or_replace_entity][py_insert_or_replace_entity]. In the following example, the first call will replace the existing entity. The second call will insert a new entity, since no entity with the specified PartitionKey and RowKey exists in the table.

```python
# Replace the entity created earlier
task = {'PartitionKey': 'tasksSeattle', 'RowKey': '001', 'description' : 'Take out the garbage again', 'priority' : 250}
table_service.insert_or_replace_entity('tasktable', task)

# Insert a new entity
task = {'PartitionKey': 'tasksSeattle', 'RowKey': '003', 'description' : 'Buy detergent', 'priority' : 300}
table_service.insert_or_replace_entity('tasktable', task)
```

> [!TIP]
> The [update_entity][py_update_entity] method replaces all properties and values of an existing entity, which you can also use to remove properties from an existing entity. You can use the [merge_entity][py_merge_entity] method to update an existing entity with new or modified property values without completely replacing the entity.

## Modify multiple entities

To ensure the atomic processing of a request by the Table service, you can submit multiple operations together in a batch. First, use the [TableBatch][py_TableBatch] class to add multiple operations to a single batch. Next, call [TableService][py_TableService].[commit_batch][py_commit_batch] to submit the operations in an atomic operation. All entities to be modified in batch must be in the same partition.

This example adds two entities together in a batch:

```python
from azure.storage.table import TableBatch
batch = TableBatch()
task004 = {'PartitionKey': 'tasksSeattle', 'RowKey': '004', 'description' : 'Go grocery shopping', 'priority' : 400}
task005 = {'PartitionKey': 'tasksSeattle', 'RowKey': '005', 'description' : 'Clean the bathroom', 'priority' : 100}
batch.insert_entity(task004)
batch.insert_entity(task005)
table_service.commit_batch('tasktable', batch)
```

Batches can also be used with the context manager syntax:

```python
task006 = {'PartitionKey': 'tasksSeattle', 'RowKey': '006', 'description' : 'Go grocery shopping', 'priority' : 400}
task007 = {'PartitionKey': 'tasksSeattle', 'RowKey': '007', 'description' : 'Clean the bathroom', 'priority' : 100}

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
tasks = table_service.query_entities('tasktable', filter="PartitionKey eq 'tasksSeattle'")
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
tasks = table_service.query_entities('tasktable', filter="PartitionKey eq 'tasksSeattle'", select='description')
for task in tasks:
    print(task.description)
```

## Delete an entity

Delete an entity by passing its PartitionKey and RowKey to the [delete_entity][py_delete_entity] method.

```python
table_service.delete_entity('tasktable', 'tasksSeattle', '001')
```

## Delete a table

If you no longer need a table or any of the entities within it, call the [delete_table][py_delete_table] method to permanently delete the table from Azure Storage.

```python
table_service.delete_table('tasktable')
```

## Next steps

* [Azure Storage SDK for Python API reference](https://azure-storage.readthedocs.io/en/latest/index.html)
* [Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python)
* [Python Developer Center](https://azure.microsoft.com/develop/python/)
* [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md): A free, cross-platform application for working visually with Azure Storage data on Windows, macOS, and Linux.

[py_commit_batch]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.tableservice.html#azure.storage.table.tableservice.TableService.commit_batch
[py_create_table]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.tableservice.html#azure.storage.table.tableservice.TableService.create_table
[py_delete_entity]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.tableservice.html#azure.storage.table.tableservice.TableService.delete_entity
[py_delete_table]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.tableservice.html#azure.storage.table.tableservice.TableService.delete_table
[py_Entity]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.models.html#azure.storage.table.models.Entity
[py_get_entity]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.tableservice.html#azure.storage.table.tableservice.TableService.get_entity
[py_insert_entity]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.tableservice.html#azure.storage.table.tableservice.TableService.insert_entity
[py_insert_or_replace_entity]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.tableservice.html#azure.storage.table.tableservice.TableService.insert_or_replace_entity
[py_merge_entity]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.tableservice.html#azure.storage.table.tableservice.TableService.merge_entity
[py_update_entity]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.tableservice.html#azure.storage.table.tableservice.TableService.update_entity
[py_TableService]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.tableservice.html
[py_TableBatch]: https://azure-storage.readthedocs.io/en/latest/ref/azure.storage.table.tablebatch.html#azure.storage.table.tablebatch.TableBatch
