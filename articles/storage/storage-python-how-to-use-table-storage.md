<properties
	pageTitle="How to use Table storage from Python | Microsoft Azure"
	description="Store structured data in the cloud using Azure Table storage, a NoSQL data store."
	services="storage"
	documentationCenter="python"
	authors="emgerner-msft"
	manager="wpickett"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="python"
	ms.topic="article"
	ms.date="07/26/2016"
	ms.author="emgerner"/>


# How to use Table storage from Python

[AZURE.INCLUDE [storage-selector-table-include](../../includes/storage-selector-table-include.md)]
<br/>
[AZURE.INCLUDE [storage-try-azure-tools-tables](../../includes/storage-try-azure-tools-tables.md)]

## Overview

This guide shows you how to perform common scenarios by using the Azure Table storage service. The samples are written in Python and use the [Microsoft Azure Storage SDK for Python]. The covered scenarios include creating and deleting a table, in addition to inserting and querying entities in a table.

[AZURE.INCLUDE [storage-table-concepts-include](../../includes/storage-table-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

## Create a table

The **TableService** object lets you work with table services. The
following code creates a **TableService** object. Add the code near
the top of any Python file in which you wish to programmatically access Azure Storage:

	from azure.storage.table import TableService, Entity

The following code creates a **TableService** object by using the storage account name and account key.  Replace 'myaccount' and 'mykey' with your account name and key.

	table_service = TableService(account_name='myaccount', account_key='mykey')

	table_service.create_table('tasktable')

## Add an entity to a table

To add an entity, first create a dictionary or Entity that defines your entity
property names and values. Note that for every entity, you must
specify **PartitionKey** and **RowKey**. These are the unique
identifiers of your entities. You can query using these values much
faster than you can query your other properties. The system uses **PartitionKey** to
automatically distribute the table entities over many storage nodes.
Entities that have the same **PartitionKey** are stored on the same node. **RowKey** is the unique ID of the entity within the partition that it
belongs to.

To add an entity to your table, pass a dictionary object to the **insert\_entity** method.

	task = {'PartitionKey': 'tasksSeattle', 'RowKey': '1', 'description' : 'Take out the trash', 'priority' : 200}
	table_service.insert_entity('tasktable', task)

You can also pass an instance of the **Entity** class to the **insert\_entity** method.

	task = Entity()
	task.PartitionKey = 'tasksSeattle'
	task.RowKey = '2'
	task.description = 'Wash the car'
	task.priority = 100
	table_service.insert_entity('tasktable', task)

## Update an entity

This code shows how to replace the old version of an existing entity with an updated version.

	task = {'PartitionKey': 'tasksSeattle', 'RowKey': '1', 'description' : 'Take out the garbage', 'priority' : 250}
	table_service.update_entity('tasktable', task)

If the entity that is being updated does not exist, then the update
operation will fail. If you want to store an entity
regardless of whether it existed before, use **insert\_or\_replace_entity**.
In the following example, the first call will replace the existing entity. The second call will insert a new entity, since no entity with the specified **PartitionKey** and **RowKey** exists in the table.

	task = {'PartitionKey': 'tasksSeattle', 'RowKey': '1', 'description' : 'Take out the garbage again', 'priority' : 250}
	table_service.insert_or_replace_entity('tasktable', task)

	task = {'PartitionKey': 'tasksSeattle', 'RowKey': '3', 'description' : 'Buy detergent', 'priority' : 300}
	table_service.insert_or_replace_entity('tasktable', task)

## Change a group of entities

Sometimes it makes sense to submit multiple operations together in a
batch to ensure atomic processing by the server. To accomplish that, you
use the **TableBatch** class. When you do want to submit the
batch, you call **commit\_batch**. Note that all entities must be in the same partition in order to be changed as a batch. The example below adds two entities together in a batch.

	from azure.storage.table import TableBatch
	batch = TableBatch()
	task10 = {'PartitionKey': 'tasksSeattle', 'RowKey': '10', 'description' : 'Go grocery shopping', 'priority' : 400}
	task11 = {'PartitionKey': 'tasksSeattle', 'RowKey': '11', 'description' : 'Clean the bathroom', 'priority' : 100}
	batch.insert_entity(task10)
	batch.insert_entity(task11)
	table_service.commit_batch('tasktable', batch)

Batches can also be used with the contex manager syntax:

	task12 = {'PartitionKey': 'tasksSeattle', 'RowKey': '12', 'description' : 'Go grocery shopping', 'priority' : 400}
	task13 = {'PartitionKey': 'tasksSeattle', 'RowKey': '13', 'description' : 'Clean the bathroom', 'priority' : 100}

	with table_service.batch('tasktable') as batch:
		batch.insert_entity(task12)
		batch.insert_entity(task13)


## Query for an entity

To query an entity in a table, use the **get\_entity** method by
passing **PartitionKey** and **RowKey**.

	task = table_service.get_entity('tasktable', 'tasksSeattle', '1')
	print(task.description)
	print(task.priority)

## Query a set of entities

This example finds all tasks in Seattle based on **PartitionKey**.

	tasks = table_service.query_entities('tasktable', filter="PartitionKey eq 'tasksSeattle'")
	for task in tasks:
		print(task.description)
		print(task.priority)

## Query a subset of entity properties

A query to a table can retrieve just a few properties from an entity.
This technique, called *projection*, reduces bandwidth and can improve
query performance, especially for large entities. Use the **select**
parameter and pass the names of the properties that you want to bring over
to the client.

The query in the following code returns only the descriptions of
entities in the table.

[AZURE.NOTE] The following snippet works only against the cloud
storage service. This is not supported by the storage
emulator.

	tasks = table_service.query_entities('tasktable', filter="PartitionKey eq 'tasksSeattle'", select='description')
	for task in tasks:
		print(task.description)

## Delete an entity

You can delete an entity by using its partition and row key.

	table_service.delete_entity('tasktable', 'tasksSeattle', '1')

## Delete a table

The following code deletes a table from a storage account.

	table_service.delete_table('tasktable')

## Next steps

Now that you've learned the basics of Table storage, follow these links
to learn more.

- [Python Developer Center](/develop/python/)
- [Azure Storage Services REST API](http://msdn.microsoft.com/library/azure/dd179355)
- [Azure Storage Team Blog]
- [Microsoft Azure Storage SDK for Python]

[Azure Storage Team blog]: http://blogs.msdn.com/b/windowsazurestorage/
[Microsoft Azure Storage SDK for Python]: https://github.com/Azure/azure-storage-python
