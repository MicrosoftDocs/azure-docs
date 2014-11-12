<properties urlDisplayName="Table Service" pageTitle="How to use table storage (Python) | Microsoft Azure" metaKeywords="Azure table Python, creating table Azure, deleting table Azure, inserting table Azure, querying table Azure" description="Learn how to use the Table service from Python to create and delete a table, and insert, delete, and query the table." metaCanonical="" services="storage" documentationCenter="Python" title="How to Use the Table Storage Service from Python" authors="huvalo" solutions="" manager="wpickett" editor="" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="python" ms.topic="article" ms.date="09/19/2014" ms.author="huvalo" />





# How to Use the Table Storage Service from Python
This guide shows you how to perform common scenarios using the Windows
Azure Table storage service. The samples are written written using the
Python API. The scenarios covered include **creating and deleting a
table, inserting and querying entities in a table**. For more
information on tables, see the [Next Steps][] section.

## Table of Contents

[What is the Table Service?][]   
 [Concepts][]   
 [Create an Azure Storage Account][]   
 [How To: Create a Table][]   
 [How To: Add an Entity to a Table][]   
 [How To: Update an Entity][]   
 [How To: Change a Group of Entities][]   
 [How To: Query for an Entity][]   
 [How To: Query a Set of Entities][]   
 [How To: Query a Subset of Entity Properties][]   
 [How To: Delete an Entity][]   
 [How To: Delete a Table][]   
 [Next Steps][]

[WACOM.INCLUDE [howto-table-storage](../includes/howto-table-storage.md)]

## <a name="create-account"> </a>Create an Azure Storage Account
[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]

**Note:** If you need to install Python or the Client Libraries, please see the [Python Installation Guide](../python-how-to-install/).


## <a name="create-table"> </a>How to Create a Table

The **TableService** object lets you work with table services. The
following code creates a **TableService** object. Add the following near
the top of any Python file in which you wish to programmatically access Azure Storage:

	from azure.storage import TableService, Entity

The following code creates a **TableService** object using the storage account name and account key.  Replace 'myaccount' and 'mykey' with the real account and key.

	table_service = TableService(account_name='myaccount', account_key='mykey')

	table_service.create_table('tasktable')

## <a name="add-entity"> </a>How to Add an Entity to a Table

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

## <a name="update-entity"> </a>How to Update an Entity

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

## <a name="change-entities"> </a>How to Change a Group of Entities

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

## <a name="query-for-entity"> </a>How to Query for an Entity

To query an entity in a table, use the **get\_entity** method, by
passing the **PartitionKey** and **RowKey**.

	task = table_service.get_entity('tasktable', 'tasksSeattle', '1')
	print(task.description)
	print(task.priority)

## <a name="query-set-entities"> </a>How to Query a Set of Entities

This example finds all tasks in Seattle based on the **PartitionKey**.

	tasks = table_service.query_entities('tasktable', "PartitionKey eq 'tasksSeattle'")
	for task in tasks:
		print(task.description)
		print(task.priority)

## <a name="query-entity-properties"> </a>How to Query a Subset of Entity Properties

A query to a table can retrieve just a few properties from an entity.
This technique, called *projection*, reduces bandwidth and can improve
query performance, especially for large entities. Use the **select**
parameter and pass the names of the properties you would like to bring over
to the client.

The query in the following code only returns the **Descriptions** of
entities in the table.

*Please note that the following snippet only works against the cloud
storage service, this not supported by the Storage
Emulator.*

	tasks = table_service.query_entities('tasktable', "PartitionKey eq 'tasksSeattle'", 'description')
	for task in tasks:
		print(task.description)

## <a name="delete-entity"> </a>How to Delete an Entity

You can delete an entity using its partition and row key.

	table_service.delete_entity('tasktable', 'tasksSeattle', '1')

## <a name="delete-table"> </a>How to Delete a Table

The following code deletes a table from a storage account.

	table_service.delete_table('tasktable')

## <a name="next-steps"> </a>Next Steps

Now that you have learned the basics of table storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Azure][]
-   [Visit the Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is the Table Service?]: #what-is
  [Concepts]: #concepts
  [Create an Azure Storage Account]: #create-account
  [How To: Create a Table]: #create-table
  [How To: Add an Entity to a Table]: #add-entity
  [How To: Update an Entity]: #update-entity
  [How To: Change a Group of Entities]: #change-entities
  [How To: Query for an Entity]: #query-for-entity
  [How To: Query a Set of Entities]: #query-set-entities
  [How To: Query a Subset of Entity Properties]: #query-entity-properties
  [How To: Delete an Entity]: #delete-entity
  [How To: Delete a Table]: #delete-table
  [Storing and Accessing Data in Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Visit the Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
