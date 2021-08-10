---
title: Use Azure Data Tables API from Java
description: Store structured data in the cloud using Azure Table storage or the Azure Cosmos DB Table API from Java.
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: Java
ms.topic: sample
ms.date: 12/10/2020
author: ThomasWeiss
ms.author: thweiss
ms.custom: devx-track-java
---

# How to use Azure Data Tables API from Java

[!INCLUDE[appliesto-table-api](../includes/appliesto-table-api.md)]

[!INCLUDE [storage-selector-table-include](../../../includes/storage-selector-table-include.md)]
[!INCLUDE [storage-table-applies-to-storagetable-and-cosmos](../../../includes/storage-table-applies-to-storagetable-and-cosmos.md)]

This article shows you how to create tables, store your data, and perform CRUD operations on the data. Choose either the Azure Data Tables API. The samples are written in Java and use the [Azure Data Tables SDK v12 for Java][Azure Data Tables SDK for Java]. The scenarios covered include **creating**, **listing**, and **deleting** tables, as well as **inserting**, **querying**, **modifying**, and **deleting** entities in a table. For more information on tables, see the [Next steps](#next-steps) section.

> [!IMPORTANT]
> The last version of the Azure Data Tables SDK supporting Table Storage is [v12][Azure Data Tables SDK for Java]. A new version of the Table Storage SDK for Java will be coming soon.

> [!NOTE]
> An SDK is available for developers who are using Azure Storage on Android devices. For more information, see the [Azure Storage SDK for Android][Azure Storage SDK for Android].
>

## Create an Azure service account

[!INCLUDE [cosmos-db-create-azure-service-account](../includes/cosmos-db-create-azure-service-account.md)]

**Create an Azure storage account**

[!INCLUDE [cosmos-db-create-storage-account](../includes/cosmos-db-create-storage-account.md)]

**Create an Azure Cosmos DB account**

[!INCLUDE [cosmos-db-create-tableapi-account](../includes/cosmos-db-create-tableapi-account.md)]

## Create a Java application

In this guide, you will use storage features that you can run in a Java application locally, or in code running in a web role or worker role in Azure.

To use the samples in this article, install the Java Development Kit (JDK), then create an Azure storage account or Azure Cosmos DB account in your Azure subscription. Once you have done so, verify that your development system meets the minimum requirements and dependencies that are listed in the [Azure Data Tables SDK for Java][Azure Data Tables SDK for Java] repository on GitHub. If your system meets those requirements, you can follow the instructions to download and install the Azure Storage Libraries for Java on your system from that repository. After you complete those tasks, you can create a Java application that uses the examples in this article.

## Configure your application to access table storage

Add the following import statements to the top of the Java file where you want to use Azure Data Tables APIs to access tables:

```java
// Include the following imports to use table APIs
import com.azure.data.tables.*;
import com.azure.data.tables.models.*;
```

## Add your connection string

You can either connect to the Azure storage account or the Azure Cosmos DB Table API account. Get the connection string based on the type of account you are using.

### Add an Azure storage connection string

An Azure storage client uses a storage connection string to store endpoints and credentials for accessing data management services. When running in a client application, you must provide the storage connection string in the following format, using the name of your storage account and the Primary access key for the storage account listed in the [Azure portal](https://portal.azure.com) for the **AccountName** and **AccountKey** values.

This example shows how you can declare a static field to hold the connection string:

```java
// Define the connection-string with your values.
public static final String storageConnectionString =
    "DefaultEndpointsProtocol=http;" +
    "AccountName=your_storage_account;" +
    "AccountKey=your_storage_account_key;" +
    "EndpointSuffix=core.windows.net;
```

### Add an Azure Cosmos DB Table API connection string

An Azure Cosmos DB account uses a connection string to store the table endpoint and your credentials. When running in a client application, you must provide the Azure Cosmos DB connection string in the following format, using the name of your Azure Cosmos DB account and the primary access key for the account listed in the [Azure portal](https://portal.azure.com) for the **AccountName** and **AccountKey** values.

This example shows how you can declare a static field to hold the Azure Cosmos DB connection string:

```java
public static final String storageConnectionString =
    "DefaultEndpointsProtocol=https;" + 
    "AccountName=your_cosmosdb_account;" + 
    "AccountKey=your_account_key;" + 
    "TableEndpoint=https://your_endpoint;" ;
```

In an application running within a role in Azure, you can store this string in the service configuration file, *ServiceConfiguration.cscfg*, and you can access it with a call to the **System.getenv** method. Here's an example of getting the connection string from a **Setting** element named *StorageConnectionString* in the service configuration file:

```java
// Retrieve storage account from connection-string.
String storageConnectionString = System.getenv("StorageConnectionString");
```

You can also store your connection string in your project's config.properties file:

```java
StorageConnectionString = DefaultEndpointsProtocol=https;AccountName=your_account;AccountKey=your_account_key;TableEndpoint=https://your_table_endpoint/
```

The following samples assume that you have used one of these methods to get the storage connection string.

## Create a table

A `TableServiceClient` object lets you get reference objects for tables
and entities. The following code creates a `TableServiceClient` object
and uses it to create a new `TableClient` object, which represents a table named "people".

```java
try
{
    final String tableName = "people";

    // Create the table service client with connection-string.
    TableServiceClient tableServiceClient = new TableServiceClientBuilder()
        .connectionString(storageConnectionString)
        .buildClient();

    // Create the table if it not exists.
    TableClient tableClient = tableServiceClient.createTableIfNotExists(tableName);

}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## List the tables

To get a list of tables, call the **TableServiceClient.listTables** method to retrieve an iterable list of table names.

```java
try
{
    // Create the table service client with connection-string.
    TableServiceClient tableServiceClient = new TableServiceClientBuilder()
        .connectionString(storageConnectionString)
        .buildClient();

    // Loop through the collection of table names.
    tableServiceClient.listTables().forEach(tableItem -> 
        System.out.printf(tableItem.getName())
    );
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Add an entity to a table

The following code creates a new instance of the `TableEntity` class with some customer data to be stored. The code calls the `upsertEntity` method on the `TableClient` object, insert the new customer entity into the "people" table, or replace the entity if it already exists.

```java
try
{
    final String tableName = "people";

    // Create the table client with connection-string and table-name.
     TableClient tableClient = new TableClientBuilder()
        .connectionString(storageConnectionString)
        .tableName(tableName)
        .buildClient();

    // Create a new customer table entity.
    TableEntity customer1 = new TableEntity("Harp", "Walter")
        .setProperties(new HashMap<String, Object>() {{
            put("Email", "Walter@contoso.com");
            put("PhoneNumber", "425-555-0101");
        }});

    // Insert table entry into table
    tableClient.upsertEntity(customer1);
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Insert a batch of entities

You can insert a batch of entities to the table service in one write operation. The following code creates a `List<TableTransactionAction>` object, then adds three insert operations to it. Each insert operation is added by creating a new entity object, setting its values, and then calling the `submitTransaction` method on the `TableClient` object to be apply to `TableEntiry` on "people" table.

```java
try
{
    final String tableName = "people";

    // Create the table client with connection-string and table-name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(storageConnectionString)
        .tableName(tableName)
        .buildClient();

    List<TableTransactionAction> tableTransactionActions = new ArrayList<>() {{

        // Create a table entity list to add to the table.
        add(new TableTransactionAction(
            TableTransactionActionType.UPSERT_MERGE,
            new TableEntity("Smith", "Jeff")
                .setProperties(new HashMap<String, Object>() {{
                    put("Email", "Jeff@contoso.com");
                    put("PhoneNumber", "425-555-0104");
                }})
        ));

        // Create another customer entity to add to the table.
        add(new TableTransactionAction(
            TableTransactionActionType.UPSERT_MERGE,
            new TableEntity("Smith", "Ben")
                .setProperties(new HashMap<String, Object>() {{
                    put("Email", "Ben@contoso.com");
                    put("PhoneNumber", "425-555-0102");
                }})
        ));

        // Create a third customer entity to add to the table.
        add(new TableTransactionAction(
            TableTransactionActionType.UPSERT_MERGE,
            new TableEntity("Smith", "Denise")
                .setProperties(new HashMap<String, Object>() {{
                    put("Email", "Denise@contoso.com");
                    put("PhoneNumber", "425-555-0103");
                }})
        ));
    }};

    // Submit transaction on the "people" table.
    tableClient.submitTransaction(tableTransactionActions);
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

Some things to note on batch operations:

* You can perform up to 100 insert, delete, merge, replace, insert or merge, and insert or replace operations in any combination in a single batch.
* A batch operation can have a retrieve operation, if it is the only operation in the batch.
* All entities in a single batch operation must have the same partition key.
* A batch operation is limited to a 4-MB data payload.

## Retrieve all entities in a partition

To query a table for entities in a partition, you can use a `ListEntitiesOptions`. Call `ListEntitiesOptions.setFilter` to create a query on a particular table that returns a specified result type. The following code specifies a filter for entities where 'Smith' is the partition key. When the query is executed with a call to `listEntities` on the `TableClient` object, it returns an `Iterator` with the `TableEntity` result type specified. You can then use the `Iterator` returned in a "ForEach" loop to consume the results. This code prints the fields of each entity in the query results to the console.

```java
try
{
    // Define constants for filters.
    final String PARTITION_KEY = "PartitionKey";
    final String tableName = "people";

    // Create the table client with connection-string and table-name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(storageConnectionString)
        .tableName(tableName)
        .buildClient();

    // Create a filter condition where the partition key is "Smith".
    ListEntitiesOptions options = new ListEntitiesOptions().setFilter(PARTITION_KEY + " eq 'Smith'");

    // Loop through the results, displaying information about the entity.
    tableClient.listEntities(options, null, null).forEach(tableEntity -> {
        System.out.println(tableEntity.getPartitionKey() +
            " " + tableEntity.getRowKey() +
            "\t" + tableEntity.getProperty("Email") +
            "\t" + tableEntity.getProperty("PhoneNumber"));
    });
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Retrieve a range of entities in a partition

If you don't want to query all the entities in a partition, you can specify a range by using comparison operators in a filter. The following code combines two filters to get all entities in partition "Smith" where the row key (first name) starts with a letter up to 'E' in the alphabet. Then it prints the query results. If you use the entities added to the table in the batch insert section of this guide, only two entities are returned this time (Ben and Denise Smith); Jeff Smith is not included.

```java
try
{
    // Define constants for filters.
    final String PARTITION_KEY = "PartitionKey";
    final String ROW_KEY = "RowKey";
    final String tableName = "people";

    // Create the table service client with connection-string.
    // Create the table client with connection-string and table-name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(storageConnectionString)
        .tableName(tableName)
        .buildClient();

    // Create a filter condition where the partition key is "Smith".
    ListEntitiesOptions options = new ListEntitiesOptions().setFilter(PARTITION_KEY + " eq 'Smith' AND " + ROW_KEY + " lt 'E'");

    // Loop through the results, displaying information about the entity.
    tableClient.listEntities(options, null, null).forEach(tableEntity -> {
        System.out.println(tableEntity.getPartitionKey() +
            " " + tableEntity.getRowKey() +
            "\t" + tableEntity.getProperty("Email") +
            "\t" + tableEntity.getProperty("PhoneNumber"));
    });
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Retrieve a single entity

You can write a query to retrieve a single, specific entity. The following code calls `TableClient.getEntity` with partition key and row key parameters to specify the customer "Jeff Smith", instead of creating a `ListEntitiesOptions` and using filters to do the same thing. When executed, the retrieve operation returns just one entity, rather than a collection. The `getEntity` method casts the result to the type of the assignment target, a `TableEntity` object. If this type is not compatible with the type specified for the query, an exception is thrown. A null value is returned if no entity has an exact partition and row key match. Specifying both partition and row keys in a query is the fastest way to retrieve a single entity from the Table service.

```java
try
{
    final String tableName = "people";

    // Create the table client with connection-string and table-name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(storageConnectionString)
        .tableName(tableName)
        .buildClient();

    // Get the specific entity.
    TableEntity specificEntity = tableClient.getEntity("Smith", "Jeff");

    // Output the entity.
    if (specificEntity != null)
    {
        System.out.println(specificEntity.getPartitionKey() +
            " " + specificEntity.getRowKey() +
            "\t" + specificEntity.getProperty("Email") +
            "\t" + specificEntity.getProperty("PhoneNumber"));
    }
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Modify an entity

To modify an entity, retrieve it from the table service, make changes to the entity object, and save the changes back to the table service with a replace or merge operation. The following code changes an existing customer's phone number. Instead of calling **tableClient.upsertEntity** as we did to insert, this code calls **tableClient.updateEntity**.

```java
try
{
    final String tableName = "people";

    // Create the table client with connection-string and table-name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(storageConnectionString)
        .tableName(tableName)
        .buildClient();

    // Get the specific entity.
    TableEntity specificEntity = tableClient.getEntity("Smith", "Jeff");

    // Specify a new phone number
    specificEntity.getProperties().put("PhoneNumber", "425-555-0105");

    // Update specified entity
    tableClient.updateEntity(specificEntity, TableEntityUpdateMode.REPLACE);
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Query a subset of entity properties

A query to a table can retrieve just a few properties from an entity. This technique, called projection, reduces bandwidth and can improve query performance, especially for large entities. The query in the following code uses the `ListEntitiesOptions.setSelect` method to return only the email addresses of entities in the table.

```java
try
{
    final String tableName = "people";

    // Create the table client with connection-string and table-name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(storageConnectionString)
        .tableName(tableName)
        .buildClient();

    // Create a filter condition that retrieves only the Email property.
    ListEntitiesOptions options = new ListEntitiesOptions().setSelect(new ArrayList(){{add("Email");}});

    // Loop through the results, displaying the Email values.
    tableClient.listEntities(options, null, null).forEach(tableEntity -> {
        System.out.println(tableEntity.getProperty("Email"));
    });
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Insert or Replace an entity

Often you want to add an entity to a table without knowing if it already exists in the table. An insert-or-replace operation allows you to make a single request, which will insert the entity if it does not exist or replace the existing one if it does. Building on prior examples, the following code inserts or replaces the entity for "Walter Harp". After creating a new entity, this code calls the **TableClient.upsertEntity** method.

```java
try
{
    final String tableName = "people";

    // Create the table client with connection-string and table-name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(storageConnectionString)
        .tableName(tableName)
        .buildClient();

    // Create a new table entity.
    TableEntity customer5 = new TableEntity("Harp", "Walter")
        .setProperties(new HashMap<String, Object>() {{
            put("email", "Walter@contoso.com");
            put("phoneNumber", "425-555-0101");
        }});

    // add the new customer to the people table.
    tableClient.upsertEntity(customer5);
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Delete an entity

You can easily delete an entity after you have retrieved it. After the entity is retrieved, call `TableClient.deleteEntity` with the entity to delete.

```java
try
{
    final String tableName = "people";

    // Create the table client with connection-string and table-name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(storageConnectionString)
        .tableName(tableName)
        .buildClient();

    // Create an operation to retrieve the entity with partition key of "Smith" and row key of "Jeff".
    TableEntity entitySmithJeff = new TableEntity("Smith", "Jeff");

    // Delete the entity from table.
    tableClient.deleteEntity(entitySmithJeff);
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Delete a table

Finally, the following code deletes a table from a storage account. Around 40 seconds after you delete a table, you cannot recreate it.

```java
try
        {
final String tableName = "people";

        // Create the table client with connection-string and table-name.
        TableClient tableClient = new TableClientBuilder()
        .connectionString(storageConnectionString)
        .tableName(tableName)
        .buildClient();

        // Delete the table and all its data.
        tableClient.deleteTable();
        }
        catch (Exception e)
        {
        // Output the stack trace.
        e.printStackTrace();
        }
```

[!INCLUDE [storage-check-out-samples-java](../../../includes/storage-check-out-samples-java.md)]

## Next steps

* [Getting Started with Azure Table Service in Java](https://github.com/Azure-Samples/storage-table-java-getting-started)
* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
* [Azure Data Tables SDK for Java][Azure Data Tables SDK for Java]
* [Azure Data Tables Client SDK Reference][Azure Data Tables Client SDK Reference]
* [Azure Data Tables REST API][Azure Data Tables REST API]
* [Azure Data Tables Team Blog][Azure Data Tables Team Blog]

For more information, visit [Azure for Java developers](/java/azure).

[Azure SDK for Java]: https://go.microsoft.com/fwlink/?LinkID=525671
[Azure Data Tables SDK for Java]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/tables/azure-data-tables
[Azure Storage SDK for Android]: https://github.com/azure/azure-storage-android
[Azure Data Tables Client SDK Reference]: https://azure.github.io/azure-sdk-for-java/tables.html
[Azure Data Tables REST API]: https://docs.microsoft.com/azure/storage/tables/table-storage-overview
[Azure Data Tables Team Blog]: https://blogs.msdn.microsoft.com/windowsazurestorage/