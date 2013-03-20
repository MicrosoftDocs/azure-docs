# How to Use the Table Service from Ruby

This guide shows you how to perform common scenarios using the Windows
Azure Table service. The samples are written written using the
Ruby API. The scenarios covered include **creating and deleting a
table, inserting and querying entities in a table**. For more
information on tables, see the [Next Steps](#next-steps) section.

## Table of Contents

* [What is the Table Service?](#what-is-the-table-service)
* [Concepts](#concepts)
* [Create a Windows Azure Storage Account](#create-a-windows-azure-storage-account)
* [Create a Ruby application](#create-a-ruby-application)
* [Configure your Application to Access Storage](#configure-your-application-to-access-storage)
* [Setup a Windows Azure Storage Connection](#setup-a-windows-azure-storage-connection)
* [How to: Create a Table](#how-to-create-a-table)
* [How to: Add an Entity to a Table](#how-to-add-an-entity-to-a-table)
* [How To: Update an Entity](#how-to-update-an-entity)
* [How to: Work with Groups of Entities](#how-to-work-with-groups-of-entities)
* [How to: Query for an Entity](#how-to-query-for-an-entity)
* [How to: Query a Set of Entities](#how-to-query-a-set-of-entities)
* [How To: Query a Subset of Entity Properties](#how-to-query-a-subset-of-entity-properties)
* [How To: Delete an Entity](#how-to-delete-an-entity)
* [How to: Delete a Table](#how-to-delete-a-table)
* [Next Steps](#next-steps)

[Common Section Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]

## What is the Table Service?

The Windows Azure Table service stores large amounts of
structured data. The service accepts authenticated calls from inside and
outside the Windows Azure cloud. Windows Azure tables are ideal for
storing structured, non-relational data. Common uses of Table services
include:

* Storing a huge amount of structured data (many TB) that is automatically scaled to meet throughput demands
* Storing datasets that don’t require complex joins, foreign keys, or stored procedures and can be denormalized for fast access
* Quickly querying data such as user profiles using a clustered index

You can use the Table service to store and query huge sets of
structured, non-relational data, and your tables scale when volume
increases.

## Concepts

The Table service contains the following components:

![Table1](images/table1.png?raw=true)

* **URL format:** Code addresses tables in an account using this address format:   
	http://storageaccount.table.core.windows.net/table  
	You can address Azure tables directly using this address with the OData protocol. For more information, see http://www.odata.org/

* **Storage Account:** All access to Windows Azure Storage is done through a storage account. The total size of blob, table, and queue contents in a storage account cannot exceed 100TB.

* **Table**: A table is an unlimited collection of entities. Tables don’t enforce a schema on entities, which means a single table can contain entities that have different sets of properties. An account can contain many tables.

* **Entity**: An entity is a set of properties, similar to a database row. An entity can be up to 1MB in size.

* **Properties**: A property is a name-value pair. Each entity can include up to 252 properties to store data. Each entity also has three system properties that specify a partition key, a row key, and a timestamp. Entities with the same partition key can be queried more quickly, and inserted/updated in atomic operations. An entity’s row key is its unique identifier within a partition.

## Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. 

1.  Log into the [Windows Azure Management
	Portal](http://windows.azure.com).

2.  At the bottom of the navigation pane, click **+NEW**.

	![+new][images/plus-new.png?raw=true]

3.  Click **Storage Account**, and then click **Quick Create**.

	![Quick create dialog](images/quick-storage.png?raw=true)

4.  In URL, type a subdomain name to use in the URI for the
	storage account. The entry can contain from 3-24 lowercase letters
	and numbers. This value becomes the host name within the URI that is
	used to address Blob, Queue, or Table resources for the
	subscription.

5.  Choose a Region/Affinity Group in which to locate the
	storage. If you will be using storage from your Windows Azure
	application, select the same region where you will deploy your
	application.

6.  Click **Create Storage Account**.

[Common Section End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]

## Create a Ruby Application

Create a Ruby application. For instructions, 
see [Create a Ruby Application on Windows Azure](no-link-yet). **No link yet**

## Configure Your Application to Access Storage

To use Windows Azure storage, you need to download and use the Ruby azure package, 
which includes a set of convenience libraries that communicate with the storage REST services.

###Use RubyGems to obtain the package

1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix).
2. Type ``gem install azure`` in the command window to install the gem and dependencies.

###Import the package

Use your favorite text editor, add the following to the top of the Ruby file where you intend to use storage:

	require "azure"

##Setup a Windows Azure Storage Connection

The azure module will read the environment variables **AZURE_STORAGE_ACCOUNT** and **AZURE_STORAGE_ACCESS_KEY** 
for information required to connect to your Windows Azure storage account. If these environment variables are not set, you must specify the account information before using ``Azure::TableService`` with the following code:

	Azure.config.storage_account_name = "<your azure storage account>"
	Azure.config.storage_access_key = "<your azure storage access key>"

To obtain these values:

1. Log into the [Windows Azure Management Portal](https://manage.windowsazure.com/).
2. On the left side of the navigation pan, click **STORAGE**.

   ![Storage](images/storage.png)

3. On the right side, choose the storage account you want to use in the table and click **MANAGE KEYS** at the bottom of the navigation pane.

   ![Manage keys](images/manage-keys.png)

4. In the pop up dialog, you will see the storage account name, primary access key and secondary access key. For access key, you can either the primary one or the secondary one.

   ![Manage keys dialog](images/manage-keys-dialog.png)

## How to Create a Table

The ``Azure::TableService`` object lets you work with tabls and entities. To create a table, use the ``create_table()`` method. The following example creates a table or print out the error if there is any.

	azure_table_service = Azure::TableService.new
	begin
	  azure_table_service.create_table("testtable")
	rescue
	  puts $!
	end

## How to Add an Entity to a Table

To add an entity, first create a hash object that defines your entity properties. Note that for every entity you mustspecify a **PartitionKey** and **RowKey**. These are the unique identifiers of your entities, and are values that can be queried much faster than your other properties. Windows Azure Storage Service uses **PartitionKey** to
automatically distribute the table’s entities over many storage nodes. Entities with the same **PartitionKey** are stored on the same node. The **RowKey** is the unique ID of the entity within the partition it belongs to. 

	entity = { "content" => "test entity", :PartitionKey => "test-partition-key", :RowKey => "1" }
	azure_table_service.insert_entity("testtable", entity)

## How To: Update an Entity

There are multiple methods available to update an existing entity:

* ``update_entity()``: Update an existing entity by replacing it.
* ``merge_entity()``: Updates an existing entity by merging new property values into the existing entity.
* ``insert_or_merge_entity()`` : Updates an existing entity by replacing it. If no entity exists, a new one will be inserted:
* ``insert_or_replace_entity()``: Updates an existing entity by merging new property values into the existing entity. If no entity exists, a new one will be inserted.

The following example demonstrates updating an entity using ``update_entity()``:

	entity= { "content" => "test entity with updated content", :PartitionKey => "test-partition-key", :RowKey => "1" }
	azure_table_service.update_entity("testtable", entity)

With ``update_entity()`` and ``merge_entity()``, if the entity that is being updated doesn’t exist then the update operation will fail. Therefore if you wish to store an entity regardless of whether it already exists, you should instead use ``insert_or_replace_entity()`` or ``insert_or_merge_entity()``.

## How to: Work with Groups of Entities

Sometimes it makes sense to submit multiple operations together in a batch to ensure atomic processing by the server. To accomplish that, you first create a ``Batch`` object and then use the ``execute_batch()`` method on ``TableService``. The following example demonstrates submitting two entities with RowKey 2 and 3 in a batch. Notice that it only works for entities with the same PartitionKey.

	azure_table_service = Azure::TableService.new
	batch = Azure::Storage::Table::Batch.new("testtable", "test-partition-key") do
	  insert "2", { "content" => "new content 2" }
	  insert "3", { "content" => "new content 3" }
	end
	results = azure_table_service.execute_batch(batch)

## How to: Query for an Entity

To query an entity in a table, use the ``get_entity()`` method, by passing the table name, ``PartitionKey`` and ``RowKey``.

	result = azure_table_service.get_entity("testtable", "test-partition-key", "1")

## How to: Query a Set of Entities

To query a set of entities in a table, create a query hash object and use the ``query_entities()`` method. The following example demonstrates getting all the entities with the same ``PartitionKey``:

	query = { :filter => "PartitionKey eq 'test-partition-key'" }
	result, token = azure_table_service.query_entities("testtable", query)

**Notice** that if the result set is too large for a single query to return, a continuation token will be returned which you can use to retrieve subsequent pages.

## How To: Query a Subset of Entity Properties

A query to a table can retrieve just a few properties from an entity. This technique, called __projection__, reduces bandwidth and can improve query performance, especially for large entities. Use the select clause and pass the names of the properties you would like to bring over to the client.

	query = { :filter => "PartitionKey eq 'test-partition-key'", :select => ["content"] }
	result, token = azure_table_service.query_entities("testtable", query)

## How To: Delete an Entity

To delete an entity, use the ``delete_entity()`` method. You need to pas in the name of the table which contains the entity, the PartitionKey and RowKey of the entity.

	azure_table_service.delete_entity("testtable", "test-partition-key", "1")

## How to: Delete a Table

To delete a table, use the ``delete_table()``method and pass in the name of the table you want to delete.

	azure_table_service.delete_table("testtable")

## Next Steps

Now that you’ve learned the basics of table storage, follow these links
to learn how to do more complex storage tasks.

* See the MSDN Reference: [Storing and Accessing Data in Windows Azure](http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx).
* Visit the [Windows Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/)
* Visit the [Azure SDK for Ruby](http://github.com/WindowsAzure/azure-sdk-for-ruby) repository on GitHub.