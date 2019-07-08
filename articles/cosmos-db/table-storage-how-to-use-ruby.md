---
title: How to use Azure Table Storage and the Azure Cosmos DB Table API with Ruby
description: Store structured data in the cloud using Azure Table storage or the Azure Cosmos DB Table API.
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: ruby
ms.topic: sample
ms.date: 04/05/2018
author: wmengmsft
ms.author: wmeng
ms.reviewer: sngun
---
# How to use Azure Table Storage and the Azure Cosmos DB Table API with Ruby
[!INCLUDE [storage-selector-table-include](../../includes/storage-selector-table-include.md)]
[!INCLUDE [storage-table-applies-to-storagetable-and-cosmos](../../includes/storage-table-applies-to-storagetable-and-cosmos.md)]

## Overview
This guide shows you how to perform common scenarios using Azure Table service and the Azure Cosmos DB Table API. The samples are written in Ruby and use the [Azure Storage Table Client Library for Ruby](https://github.com/azure/azure-storage-ruby/tree/master/table). The scenarios covered include **creating and deleting a table, and inserting and querying entities in a table**.

## Create an Azure service account
[!INCLUDE [cosmos-db-create-azure-service-account](../../includes/cosmos-db-create-azure-service-account.md)]

### Create an Azure storage account
[!INCLUDE [cosmos-db-create-storage-account](../../includes/cosmos-db-create-storage-account.md)]

### Create an Azure Cosmos DB account
[!INCLUDE [cosmos-db-create-tableapi-account](../../includes/cosmos-db-create-tableapi-account.md)]

## Add access to Storage or Azure Cosmos DB
To use Azure Storage or Azure Cosmos DB, you must download and use the Ruby Azure package that includes a set of convenience libraries that communicate with the Table REST services.

### Use RubyGems to obtain the package
1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix).
2. Type **gem install azure-storage-table** in the command window to install the gem and dependencies.

### Import the package
Use your favorite text editor, add the following to the top of the Ruby file where you intend to use Storage:

```ruby
require "azure/storage/table"
```

## Add an Azure Storage connection
The Azure Storage module reads the environment variables **AZURE_STORAGE_ACCOUNT** and **AZURE_STORAGE_ACCESS_KEY** for information required to connect to your Azure Storage account. If these environment variables are not set, you must specify the account information before using **Azure::Storage::Table::TableService** with the following code:

```ruby
Azure.config.storage_account_name = "<your Azure Storage account>"
Azure.config.storage_access_key = "<your Azure Storage access key>"
```

To obtain these values from a classic or Resource Manager storage account in the Azure portal:

1. Log in to the [Azure portal](https://portal.azure.com).
2. Navigate to the Storage account you want to use.
3. In the Settings blade on the right, click **Access Keys**.
4. In the Access keys blade that appears, you'll see the access key 1 and access key 2. You can use either of these.
5. Click the copy icon to copy the key to the clipboard.

## Add an Azure Cosmos DB connection
To connect to Azure Cosmos DB, copy your primary connection string from the Azure portal, and create a **Client** object using your copied connection string. You can pass the **Client** object when you create a **TableService** object:

```ruby
common_client = Azure::Storage::Common::Client.create(storage_account_name:'myaccount', storage_access_key:'mykey', storage_table_host:'mycosmosdb_endpoint')
table_client = Azure::Storage::Table::TableService.new(client: common_client)
```

## Create a table
The **Azure::Storage::Table::TableService** object lets you work with tables and entities. To create a table, use the **create_table()** method. The following example creates a table or prints the error if there is any.

```ruby
azure_table_service = Azure::Storage::Table::TableService.new
begin
    azure_table_service.create_table("testtable")
rescue
    puts $!
end
```

## Add an entity to a table
To add an entity, first create a hash object that defines your entity properties. Note that for every entity you must specify a **PartitionKey** and **RowKey**. These are the unique identifiers of your entities, and are values that can be queried much faster than your other properties. Azure Storage uses **PartitionKey** to automatically distribute the table's entities over many storage nodes. Entities with the same **PartitionKey** are stored on the same node. The **RowKey** is the unique ID of the entity within the partition it belongs to.

```ruby
entity = { "content" => "test entity",
    :PartitionKey => "test-partition-key", :RowKey => "1" }
azure_table_service.insert_entity("testtable", entity)
```

## Update an entity
There are multiple methods available to update an existing entity:

* **update_entity():** Update an existing entity by replacing it.
* **merge_entity():** Updates an existing entity by merging new property values into the existing entity.
* **insert_or_merge_entity():** Updates an existing entity by replacing it. If no entity exists, a new one will be inserted:
* **insert_or_replace_entity():** Updates an existing entity by merging new property values into the existing entity. If no entity exists, a new one will be inserted.

The following example demonstrates updating an entity using **update_entity()**:

```ruby
entity = { "content" => "test entity with updated content",
    :PartitionKey => "test-partition-key", :RowKey => "1" }
azure_table_service.update_entity("testtable", entity)
```

With **update_entity()** and **merge_entity()**, if the entity that you are updating doesn't exist then the update operation will fail. Therefore, if you want to store an entity regardless of whether it already exists, you should instead use **insert_or_replace_entity()** or **insert_or_merge_entity()**.

## Work with groups of entities
Sometimes it makes sense to submit multiple operations together in a batch to ensure atomic processing by the server. To accomplish that, you first create a **Batch** object and then use the **execute_batch()** method on **TableService**. The following example demonstrates submitting two entities with RowKey 2 and 3 in a batch. Notice that it only works for entities with the same PartitionKey.

```ruby
azure_table_service = Azure::TableService.new
batch = Azure::Storage::Table::Batch.new("testtable",
    "test-partition-key") do
    insert "2", { "content" => "new content 2" }
    insert "3", { "content" => "new content 3" }
end
results = azure_table_service.execute_batch(batch)
```

## Query for an entity
To query an entity in a table, use the **get_entity()** method, by passing the table name, **PartitionKey** and **RowKey**.

```ruby
result = azure_table_service.get_entity("testtable", "test-partition-key",
    "1")
```

## Query a set of entities
To query a set of entities in a table, create a query hash object and use the **query_entities()** method. The following example demonstrates getting all the entities with the same **PartitionKey**:

```ruby
query = { :filter => "PartitionKey eq 'test-partition-key'" }
result, token = azure_table_service.query_entities("testtable", query)
```

> [!NOTE]
> If the result set is too large for a single query to return, a continuation token is returned that you can use to retrieve subsequent pages.
>
>

## Query a subset of entity properties
A query to a table can retrieve just a few properties from an entity. This technique, called "projection," reduces bandwidth and can improve query performance, especially for large entities. Use the select clause and pass the names of the properties you would like to bring over to the client.

```ruby
query = { :filter => "PartitionKey eq 'test-partition-key'",
    :select => ["content"] }
result, token = azure_table_service.query_entities("testtable", query)
```

## Delete an entity
To delete an entity, use the **delete_entity()** method. Pass in the name of the table that contains the entity, the PartitionKey, and the RowKey of the entity.

```ruby
azure_table_service.delete_entity("testtable", "test-partition-key", "1")
```

## Delete a table
To delete a table, use the **delete_table()** method and pass in the name of the table you want to delete.

```ruby
azure_table_service.delete_table("testtable")
```

## Next steps

* [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
* [Ruby Developer Center](https://azure.microsoft.com/develop/ruby/)
* [Microsoft Azure Storage Table Client Library for Ruby](https://github.com/azure/azure-storage-ruby/tree/master/table) 

