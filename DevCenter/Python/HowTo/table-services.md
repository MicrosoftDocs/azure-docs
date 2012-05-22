# How to Use the Table Storage Service from Python

This guide shows you how to perform common scenarios using the Windows
Azure Table storage service. The samples are written written using the
Python API. The scenarios covered include **creating and deleting a
table, inserting and querying entities in a table**. For more
information on tables, see the [Next Steps][] section.

## Table of Contents

[What is the Table Service?][]   
 [Concepts][]   
 [Create a Windows Azure Storage Account][]   
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

## <a name="what-is"> </a>What is the Table Service?

The Windows Azure Table storage service stores large amounts of
structured data. The service accepts authenticated calls from inside and
outside the Windows Azure cloud. Windows Azure tables are ideal for
storing structured, non-relational data. Common uses of Table services
include:

-   Storing a huge amount of structured data (many TB) that is
    automatically scaled to meet throughput demands
-   Storing datasets that don’t require complex joins, foreign keys, or
    stored procedures and can be denormalized for fast access
-   Quickly querying data such as user profiles using a clustered index

You can use the Table service to store and query huge sets of
structured, non-relational data, and your tables scale when volume
increases.

## <a name="concepts"> </a>Concepts

The Table service contains the following components:

![Table1][]

-   **URL format:** Code addresses tables in an account using this
    address format:   
    http://storageaccount.table.core.windows.net/table
      
    You can address Azure tables directly using this address with the
    OData protocol. For more information, see [OData.org][]

-   **Storage Account:** All access to Windows Azure Storage is done
    through a storage account. The total size of blob, table, and queue
    contents in a storage account cannot exceed 100TB.

-   **Table**: A table is an unlimited collection of entities. Tables
    don’t enforce a schema on entities, which means a single table can
    contain entities that have different sets of properties. An account
    can contain many tables.

-   **Entity**: An entity is a set of properties, similar to a database
    row. An entity can be up to 1MB in size.

-   **Properties**: A property is a name-value pair. Each entity can
    include up to 252 properties to store data. Each entity also has
    three system properties that specify a partition key, a row key, and
    a timestamp. Entities with the same partition key can be queried
    more quickly, and inserted/updated in atomic operations. An entity’s
    row key is its unique identifier within a partition.

## <a name="create-account"> </a>Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. (You can also
create a storage account [using the REST API][].)

1.  Log into the [Windows Azure Management Portal][].

2.  In the navigation pane, click **Hosted Services, Storage Accounts &
    CDN**.

3.  At the top of the navigation pane, click **Storage Accounts**.

4.  On the ribbon, in the Storage group, click **New Storage Account**.
      
    ![Blob2][]  
      
    The **Create a New Storage Account**dialog box opens.   
    ![Blob3][]

5.  In **Choose a Subscription**, select the subscription that the
    storage account will be used with.

6.  In Enter a URL, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Table, Queue, or Table resources for the
    subscription.

7.  Choose a region or an affinity group in which to locate the storage.
    If you will be using storage from your Windows Azure application,
    select the same region where you will deploy your application.

8.  Finally, take note of your **Primary access key** in the right-hand
    column. You will need this in subsequent steps to access storage.   
    ![Blob4][]

## <a name="create-table"> </a>How to Create a Table

The **CloudTableClient** object lets you work with table services. The
following code creates a **CloudTableClient** object. Add the following near
the top of any Python file in which you wish to programmatically access Windows Azure Storage:

    from windowsazure.storages.cloudtableclient import *

The following code creates a **CloudTableClient** object using the storage account name and account key.  Replace 'myaccount' and 'mykey' with the real account and key.

	table_client = CloudTableClient(account_name='myaccount', account_key='mykey')

	table_client.create_table('tasktable')

## <a name="add-entity"> </a>How to Add an Entity to a Table

To add an entity, first create a dictionary that defines your entity
property names and values. Note that for every entity you must
specify a **PartitionKey** and **RowKey**. These are the unique
identifiers of your entities, and are values that can be queried much
faster than your other properties. The system uses **PartitionKey** to
automatically distribute the table’s entities over many storage nodes.
Entities with the same **PartitionKey** are stored on the same node. The
**RowKey** is the unique ID of the entity within the partition it
belongs to.

To add an entity to your table, pass a dictionary object
to the **insert\_entity** method.

	task = {'PartitionKey': 'tasksSeattle', 'RowKey': '1', 'description' : 'Take out the trash', 'priority' : 200}
	table_client.insert_entity('tasktable', task)

You can also pass an instance of the **Entity** class to the **insert\_entity** method.

	task = Entity()
	task.PartitionKey = 'tasksSeattle'
	task.RowKey = '2'
	task.description = 'Wash the car'
	task.priority = 100
	table_client.insert_entity('tasktable', task)

## <a name="update-entity"> </a>How to Update an Entity

This code shows how to replace the old version of an existing entity
with an updated version.

	task = {'description' : 'Take out the garbage', 'priority' : 250}
	table_client.update_entity('tasktable', 'tasksSeattle', '1', task)

If the entity that is being updated doesn’t exist, then the update
operation will fail. If you want to store an entity
regardless of whether it already existed before, use **insert\_or\_replace_entity**. 
In the following example, the first call will replace the existing entity. The second call will insert a new entity, since no entity with the specified **PartitionKey** and **RowKey** exists in the table.

	task = {'description' : 'Take out the garbage again', 'priority' : 250}
	table_client.insert_or_replace_entity('tasktable', 'tasksSeattle', '1', task)

	task = {'description' : 'Buy detergent', 'priority' : 300}
	table_client.insert_or_replace_entity('tasktable', 'tasksSeattle', '3', task)

## <a name="change-entities"> </a>How to Change a Group of Entities

Sometimes it makes sense to submit multiple operations together in a
batch to ensure atomic processing by the server. To accomplish that, you
use the **begin\_batch** method on **CloudTableClient** and then call the
series of operations as usual. When you do want to submit the
batch, you call **commit\_batch**. Note that all entities must be in the same partition in order to be changed as a batch. The example below adds two entities together in a batch.

	task10 = {'PartitionKey': 'tasksSeattle', 'RowKey': '10', 'description' : 'Go grocery shopping', 'priority' : 400}
	task11 = {'PartitionKey': 'tasksSeattle', 'RowKey': '11', 'description' : 'Clean the bathroom', 'priority' : 100}
	table_client.begin_batch()
	table_client.insert_entity('tasktable', task10)
	table_client.insert_entity('tasktable', task11)
	table_client.commit_batch()

## <a name="query-for-entity"> </a>How to Query for an Entity

To query an entity in a table, use the **get\_entity** method, by
passing the **PartitionKey** and **RowKey**.

	task = table_client.get_entity('tasktable', 'tasksSeattle', '1', '')
	print(task.description)
	print(task.priority)

## <a name="query-set-entities"> </a>How to Query a Set of Entities

This example finds all tasks in Seattle based on the **PartitionKey**.

	tasks = table_client.query_entities('tasktable', "PartitionKey eq 'tasksSeattle'", '')
	for task in tasks:
	    print(task.description)
	    print(task.priority)

## <a name="query-entity-properties"> </a>How to Query a Subset of Entity Properties

A query to a table can retrieve just a few properties from an entity.
This technique, called *projection*, reduces bandwidth and can improve
query performance, especially for large entities. Use the **comma\_separated\_property\_names**
parameter and pass the names of the properties you would like to bring over
to the client.

The query in the following code only returns the **Descriptions** of
entities in the table.

*Please note that the following snippet only works against the cloud
storage service, this not supported by the Storage
Emulator.*

	tasks = table_client.query_entities('tasktable', "partitionkey eq 'tasksSeattle'", 'description')
	for task in tasks:
	    print(task.description)

## <a name="delete-entity"> </a>How to Delete an Entity

You can delete an entity using its partition and row key.

	table_client.delete_entity('tasktable', 'tasksSeattle', '1')

## <a name="delete-table"> </a>How to Delete a Table

The following code deletes a table from a storage account.

	table_client.delete_table('tasktable')

## <a name="next-steps"> </a>Next Steps

Now that you’ve learned the basics of table storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows Azure][]
-   [Visit the Windows Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is the Table Service?]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [How To: Create a Table]: #create-table
  [How To: Add an Entity to a Table]: #add-entity
  [How To: Update an Entity]: #update-entity
  [How To: Change a Group of Entities]: #change-entities
  [How To: Query for an Entity]: #query-for-entity
  [How To: Query a Set of Entities]: #query-set-entities
  [How To: Query a Subset of Entity Properties]: #query-entity-properties
  [How To: Delete an Entity]: #delete-entity
  [How To: Delete a Table]: #delete-table
  [Table1]: ../../../DevCenter/dotNet/Media/table1.png
  [OData.org]: http://www.odata.org/
  [using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Windows Azure Management Portal]: http://windows.azure.com
  [Blob2]: ../../../DevCenter/dotNet/Media/blob2.png
  [Blob3]: ../../../DevCenter/dotNet/Media/blob3.png
  [Blob4]: ../../../DevCenter/dotNet/Media/blob4.png
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Visit the Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
