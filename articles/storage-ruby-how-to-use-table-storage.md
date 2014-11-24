<properties urlDisplayName="Table Service" pageTitle="How to use table storage (Ruby) | Microsoft Azure" metaKeywords="Azure table storage service, Azure table service Ruby, table storage Ruby" description="Learn how to use the table storage service in Azure. Code samples are written using the Ruby API." metaCanonical="" services="storage" documentationCenter="Ruby" title="How to Use the Table Service from Ruby" authors="tomfitz" solutions="" manager="wpickett" editor="" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="ruby" ms.topic="article" ms.date="11/24/2014" ms.author="tomfitz" />





# How to Use the Table Service from Ruby

This guide shows you how to perform common scenarios using the Windows
Azure Table service. The samples are written written using the
Ruby API. The scenarios covered include **creating and deleting a
table, inserting and querying entities in a table**. For more
information on tables, see the [Next Steps](#next-steps) section.

## Table of Contents

* [What is the Table Service?](#what-is)
* [Concepts](#concepts)
* [Create an Azure Storage Account](#create-a-windows-azure-storage-account)
* [Create a Ruby application](#create-a-ruby-application)
* [Configure your Application to Access Storage](#configure-your-application-to-access-storage)
* [Setup an Azure Storage Connection](#setup-a-windows-azure-storage-connection)
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

[WACOM.INCLUDE [howto-table-storage](../includes/howto-table-storage.md)]

## <a id="create-a-windows-azure-storage-account"></a>Create an Azure Storage Account

[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]

## <a id="create-a-ruby-application"></a>Create a Ruby Application

Create a Ruby application. For instructions, 
see [Create a Ruby Application on Azure](/en-us/develop/ruby/tutorials/web-app-with-linux-vm/).

## <a id="configure-your-application-to-access-storage"></a>Configure Your Application to Access Storage

To use Azure storage, you need to download and use the Ruby azure package, 
which includes a set of convenience libraries that communicate with the storage REST services.

### Use RubyGems to obtain the package

1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix).

2. Type **gem install azure** in the command window to install the gem and dependencies.

### Import the package

Use your favorite text editor, add the following to the top of the Ruby file where you intend to use storage:

	require "azure"

## <a id="setup-a-windows-azure-storage-connection"></a>Setup an Azure Storage Connection

The azure module will read the environment variables **AZURE\_STORAGE\_ACCOUNT** and **AZURE\_STORAGE\_ACCESS\_KEY** 
for information required to connect to your Azure storage account. If these environment variables are not set, you must specify the account information before using **Azure::TableService** with the following code:

	Azure.config.storage_account_name = "<your azure storage account>"
	Azure.config.storage_access_key = "<your azure storage access key>"

To obtain these values:

1. Log into the [Azure Management Portal](https://manage.windowsazure.com/).

2. Navigate to the storage account you want to use.

3. Click **MANAGE KEYS** at the bottom of the navigation pane.

4. In the pop up dialog, you will see the storage account name, primary access key and secondary access key. For access key, you can either the primary one or the secondary one.

## <a id="how-to-create-a-table"></a>How to Create a Table

The **Azure::TableService** object lets you work with tabls and entities. To create a table, use the **create\_table()** method. The following example creates a table or print out the error if there is any.

	azure_table_service = Azure::TableService.new
	begin
	  azure_table_service.create_table("testtable")
	rescue
	  puts $!
	end

## <a id="how-to-add-an-entity-to-a-table"></a>How to Add an Entity to a Table

To add an entity, first create a hash object that defines your entity properties. Note that for every entity you mustspecify a **PartitionKey** and **RowKey**. These are the unique identifiers of your entities, and are values that can be queried much faster than your other properties. Azure Storage Service uses **PartitionKey** to automatically distribute the table's entities over many storage nodes. Entities with the same **PartitionKey** are stored on the same node. The **RowKey** is the unique ID of the entity within the partition it belongs to. 

	entity = { "content" => "test entity", 
	  :PartitionKey => "test-partition-key", :RowKey => "1" }
	azure_table_service.insert_entity("testtable", entity)

## <a id="how-to-update-an-entity"></a>How To: Update an Entity

There are multiple methods available to update an existing entity:

* **update\_entity():** Update an existing entity by replacing it.
* **merge\_entity():** Updates an existing entity by merging new property values into the existing entity.
* **insert\_or\_merge\_entity():** Updates an existing entity by replacing it. If no entity exists, a new one will be inserted:
* **insert\_or\_replace\_entity():** Updates an existing entity by merging new property values into the existing entity. If no entity exists, a new one will be inserted.

The following example demonstrates updating an entity using **update\_entity()**:

	entity = { "content" => "test entity with updated content", 
	  :PartitionKey => "test-partition-key", :RowKey => "1" }
	azure_table_service.update_entity("testtable", entity)

With **update\_entity()** and **merge\_entity()**, if the entity that is being updated doesn't exist then the update operation will fail. Therefore if you wish to store an entity regardless of whether it already exists, you should instead use **insert\_or\_replace\_entity()** or **insert\_or\_merge\_entity()**.

## <a id="how-to-work-with-groups-of-entities"></a>How to: Work with Groups of Entities

Sometimes it makes sense to submit multiple operations together in a batch to ensure atomic processing by the server. To accomplish that, you first create a **Batch** object and then use the **execute\_batch()** method on **TableService**. The following example demonstrates submitting two entities with RowKey 2 and 3 in a batch. Notice that it only works for entities with the same PartitionKey.

	azure_table_service = Azure::TableService.new
	batch = Azure::Storage::Table::Batch.new("testtable", 
	  "test-partition-key") do
	  insert "2", { "content" => "new content 2" }
	  insert "3", { "content" => "new content 3" }
	end
	results = azure_table_service.execute_batch(batch)

## <a id="how-to-query-for-an-entity"></a>How to: Query for an Entity

To query an entity in a table, use the **get\_entity()** method, by passing the table name, **PartitionKey** and **RowKey**.

	result = azure_table_service.get_entity("testtable", "test-partition-key", 
	  "1")

## <a id="how-to-query-a-set-of-entities"></a>How to: Query a Set of Entities

To query a set of entities in a table, create a query hash object and use the **query\_entities()** method. The following example demonstrates getting all the entities with the same **PartitionKey**:

	query = { :filter => "PartitionKey eq 'test-partition-key'" }
	result, token = azure_table_service.query_entities("testtable", query)

**Notice** that if the result set is too large for a single query to return, a continuation token will be returned which you can use to retrieve subsequent pages.

## <a id="how-to-query-a-subset-of-entity-properties"></a>How To: Query a Subset of Entity Properties

A query to a table can retrieve just a few properties from an entity. This technique, called "projection", reduces bandwidth and can improve query performance, especially for large entities. Use the select clause and pass the names of the properties you would like to bring over to the client.

	query = { :filter => "PartitionKey eq 'test-partition-key'", 
	  :select => ["content"] }
	result, token = azure_table_service.query_entities("testtable", query)

## <a id="how-to-delete-an-entity"></a>How To: Delete an Entity

To delete an entity, use the **delete\_entity()** method. You need to pas in the name of the table which contains the entity, the PartitionKey and RowKey of the entity.

		azure_table_service.delete_entity("testtable", "test-partition-key", "1")

## <a id="how-to-delete-a-table"></a>How to: Delete a Table

To delete a table, use the **delete\_table()** method and pass in the name of the table you want to delete.

		azure_table_service.delete_table("testtable")

## <a id="next-steps"></a>Next Steps

Now that you've learned the basics of table storage, follow these links to learn how to do more complex storage tasks.

* See the MSDN Reference: [Storing and Accessing Data in Azure](http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx)
* Visit the [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/)
* Visit the [Azure SDK for Ruby](http://github.com/WindowsAzure/azure-sdk-for-ruby) repository on GitHub
