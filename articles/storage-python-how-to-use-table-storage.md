<properties 
	pageTitle="How to use Table storage from Python | Microsoft Azure" 
	description="Learn how to use the Table service from Python to create and delete a table, and insert, delete, and query the table." 
	services="storage" 
	documentationCenter="python" 
	authors="huguesv" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="03/11/2015" 
	ms.author="huvalo"/>


# How to use Table storage from Python

[AZURE.INCLUDE [storage-selector-table-include](../includes/storage-selector-table-include.md)]

## Overview

This guide shows you how to perform common scenarios using the Azure Table storage service. The samples are written in Python and use the [Python Azure package][]. The scenarios covered include **creating and deleting a
table, inserting and querying entities in a table**.

[AZURE.INCLUDE [storage-table-concepts-include](../includes/storage-table-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../includes/storage-create-account-include.md)]

[AZURE.NOTE] If you need to install Python or the [Python Azure package][], please see the [Python Installation Guide](python-how-to-install.md).


## How to Create a Table

The **TableService** object lets you work with table services. The
following code creates a **TableService** object. Add the following near
the top of any Python file in which you wish to programmatically access Azure Storage:

	from azure.storage import TableService, Entity

The following code creates a **TableService** object using the storage account name and account key.  Replace 'myaccount' and 'mykey' with the real account and key.

	table_service = TableService(account_name='myaccount', account_key='mykey')

	table_service.create_table('tasktable')

## How to Add an Entity to a Table

To add an entity, first create a dictionary that defines your entity
property names and values. Note that for every entity you must
specify a **PartitionKey** and **RowKey**. These are the unique
identifiers of your entities, and are values that can be queried much
faster than your other properties. The system uses **PartitionKey** to
automatically distribute the table entities over many storage nodes.
Entities with the same **PartitionKey** are stored on the same node. The
**RowKey** is the unique ID of the entity within the partition it
belongs to.

To add an entity to your table, pass a dictionary object
to the **insert\_entity** method.

	task = {'PartitionKey': 'tasksSeattle', 'RowKey': '1', 'description' : 'Take out the trash', 'priority' : 200}
	table_service.insert_entity('tasktable', task)

You can also pass an instance of the **Entity** class to the **insert\_entity** method.

	task = Entity()
	task.PartitionKey = 'tasksSeattle'
	task.RowKey = '2'
	task.description = 'Wash the car'
	task.priority = 100
	table_service.insert_entity('tasktable', task)

## How to Update an Entity

This code shows how to replace the old version of an existing entity
with an updated version.

	task = {'description' : 'Take out the garbage', 'priority' : 250}
	table_service.update_entity('tasktable', 'tasksSeattle', '1', task)

If the entity that is being updated does not exist, then the update
operation will fail. If you want to store an entity
regardless of whether it already existed before, use **insert\_or\_replace_entity**. 
In the following example, the first call will replace the existing entity. The second call will insert a new entity, since no entity with the specified **PartitionKey** and **RowKey** exists in the table.

	task = {'description' : 'Take out the garbage again', 'priority' : 250}
	table_service.insert_or_replace_entity('tasktable', 'tasksSeattle', '1', task)

	task = {'description' : 'Buy detergent', 'priority' : 300}
	table_service.insert_or_replace_entity('tasktable', 'tasksSeattle', '3', task)

## How to Change a Group of Entities

Sometimes it makes sense to submit multiple operations together in a
batch to ensure atomic processing by the server. To accomplish that, you
use the **begin\_batch** method on **TableService** and then call the
series of operations as usual. When you do want to submit the
batch, you call **commit\_batch**. Note that all entities must be in the same partition in order to be changed as a batch. The example below adds two entities together in a batch.

	task10 = {'PartitionKey': 'tasksSeattle', 'RowKey': '10', 'description' : 'Go grocery shopping', 'priority' : 400}
	task11 = {'PartitionKey': 'tasksSeattle', 'RowKey': '11', 'description' : 'Clean the bathroom', 'priority' : 100}
	table_service.begin_batch()
	table_service.insert_entity('tasktable', task10)
	table_service.insert_entity('tasktable', task11)
	table_service.commit_batch()

## How to Query for an Entity

To query an entity in a table, use the **get\_entity** method, by
passing the **PartitionKey** and **RowKey**.

	task = table_service.get_entity('tasktable', 'tasksSeattle', '1')
	print(task.description)
	print(task.priority)

## How to Query a Set of Entities

This example finds all tasks in Seattle based on the **PartitionKey**.

	tasks = table_service.query_entities('tasktable', "PartitionKey eq 'tasksSeattle'")
	for task in tasks:
		print(task.description)
		print(task.priority)

## How to Query a Subset of Entity Properties

A query to a table can retrieve just a few properties from an entity.
This technique, called *projection*, reduces bandwidth and can improve
query performance, especially for large entities. Use the **select**
parameter and pass the names of the properties you would like to bring over
to the client.

The query in the following code only returns the descriptions of
entities in the table.

*Please note that the following snippet only works against the cloud
storage service, this not supported by the Storage
Emulator.*

	tasks = table_service.query_entities('tasktable', "PartitionKey eq 'tasksSeattle'", 'description')
	for task in tasks:
		print(task.description)

## How to Delete an Entity

You can delete an entity using its partition and row key.

	table_service.delete_entity('tasktable', 'tasksSeattle', '1')

## How to Delete a Table

The following code deletes a table from a storage account.

	table_service.delete_table('tasktable')

## Next Steps

Now that you have learned the basics of table storage, follow these links
to learn about more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Azure][]
-   [Visit the Azure Storage Team Blog][]

[Storing and Accessing Data in Azure]: http://msdn.microsoft.com/library/azure/gg433040.aspx
[Visit the Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
[Python Azure package]: https://pypi.python.org/pypi/azure  
