---
title: Use the Azure Tables client library for Java
description: Store structured data in the cloud using the Azure Tables client library for Java.
ms.service: cosmos-db
ms.subservice: table
ms.devlang: Java
ms.topic: sample
ms.date: 12/10/2020
author: seesharprun
ms.author: sidandrews
ms.custom: devx-track-java, ignite-2022, devx-track-extended-java
---

# How to use the Azure Tables client library for Java

[!INCLUDE[Table](../includes/appliesto-table.md)]

[!INCLUDE [storage-selector-table-include](../../../includes/storage-selector-table-include.md)]
[!INCLUDE [storage-table-applies-to-storagetable-and-cosmos](../../../includes/storage-table-applies-to-storagetable-and-cosmos.md)]

This article shows you how to create tables, store your data, and perform CRUD operations on said data. The samples are written in Java and use the [Azure Tables client library for Java][Azure Tables client library for Java]. The scenarios covered include **creating**, **listing**, and **deleting** tables, as well as **inserting**, **querying**, **modifying**, and **deleting** entities in a table. For more information on tables, see the [Next steps](#next-steps) section.

> [!IMPORTANT]
> The last version of the Azure Tables client library supporting Table Storage and Azure Cosmos DB Table is [12+][Azure Tables client library for Java].

## Create an Azure service account

[!INCLUDE [cosmos-db-create-azure-service-account](../includes/cosmos-db-create-azure-service-account.md)]

**Create an Azure storage account**

[!INCLUDE [cosmos-db-create-storage-account](../includes/cosmos-db-create-storage-account.md)]

**Create an Azure Cosmos DB account**

[!INCLUDE [cosmos-db-create-tableapi-account](../includes/cosmos-db-create-tableapi-account.md)]

## Create a Java application

To use the samples in this article:
1. Install the [Java Development Kit (JDK)](/azure/developer/java/fundamentals/java-support-on-azure#supported-java-versions-and-update-schedule).
2. Create an Azure storage account or Azure Cosmos DB account in your Azure subscription.
3. Verify that your development system meets the minimum requirements and dependencies listed in the [Azure Tables client library for Java][Azure Tables client library for Java] repository on GitHub.
4. Follow the instructions to download and install the Azure Storage Libraries for Java on your system from that repository.
5. Create a Java app that uses the examples in this article.

## Configure your app to access Table Storage

Add the following entry to your *pom.xml* file's `dependencies` section:

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-data-tables</artifactId>
  <version>12.1.1</version>
</dependency>
```

Then, add the following `import` statements to the top of the Java file where you want to use Azure Tables APIs to access tables:

```java
// Include the following imports to use table APIs
import com.azure.data.tables.TableClient;
import com.azure.data.tables.TableClientBuilder;
import com.azure.data.tables.TableServiceClient;
import com.azure.data.tables.TableServiceClientBuilder;
import com.azure.data.tables.models.ListEntitiesOptions;
import com.azure.data.tables.models.TableEntity;
import com.azure.data.tables.models.TableEntityUpdateMode;
import com.azure.data.tables.models.TableTransactionAction;
import com.azure.data.tables.models.TableTransactionActionType;
```

## Add your connection string

You can either connect to the Azure storage account or the Azure Cosmos DB for Table account. Get the connection string based on the type of account you are using.

### Add an Azure Storage connection string

An Azure Tables client can use a storage connection string to store endpoints and credentials for accessing data management services. When running in a client app, you must provide the Storage connection string in the following format, using the name of your Storage account and the Primary access key for the Storage account listed in the [Azure portal](https://portal.azure.com) for the **AccountName** and **AccountKey** values.

This example shows how you can declare a static field to hold the connection string:

```java
// Define the connection-string with your values.
public final String connectionString =
    "DefaultEndpointsProtocol=http;" +
    "AccountName=your_storage_account;" +
    "AccountKey=your_storage_account_key;" +
    "EndpointSuffix=core.windows.net";
```

### Add an Azure Cosmos DB for Table connection string

An Azure Cosmos DB account uses a connection string to store the table endpoint and your credentials. When running in a client app, you must provide the Azure Cosmos DB connection string in the following format, using the name of your Azure Cosmos DB account and the primary access key for the account listed in the [Azure portal](https://portal.azure.com) for the **AccountName** and **AccountKey** values.

This example shows how you can declare a static field to hold the Azure Cosmos DB connection string:

```java
public final String connectionString =
    "DefaultEndpointsProtocol=https;" + 
    "AccountName=your_cosmosdb_account;" + 
    "AccountKey=your_account_key;" + 
    "TableEndpoint=https://your_endpoint;";
```

In an app running within a role in Azure, you can store this string in the service configuration file, *ServiceConfiguration.cscfg*. You can access it with a call to the `System.getenv` method. Here's an example of getting the connection string from a **Setting** element named *ConnectionString* in the service configuration file:

```java
// Retrieve storage account from connection-string.
String connectionString = System.getenv("ConnectionString");
```

You can also store your connection string in your project's config.properties file:

```java
connectionString = DefaultEndpointsProtocol=https;AccountName=your_account;AccountKey=your_account_key;TableEndpoint=https://your_table_endpoint/
```

The following samples assume that you have used one of these methods to get the storage connection string.

## Create a table

A `TableServiceClient` object allows you to interact with the Tables service in order to create, list, and delete tables. The following code creates a `TableServiceClient` object and uses it to create a new `TableClient` object, which represents a table named `Employees`.

```java
try
{
    final String tableName = "Employees";

    // Create a TableServiceClient with a connection string.
    TableServiceClient tableServiceClient = new TableServiceClientBuilder()
        .connectionString(connectionString)
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

To get a list of tables, call the `TableServiceClient.listTables` method to retrieve an iterable list of table names.

```java
try
{
    // Create a TableServiceClient with a connection string.
    TableServiceClient tableServiceClient = new TableServiceClientBuilder()
        .connectionString(connectionString)
        .buildClient();

    // Loop through a collection of table names.
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

The following code creates a new instance of the `TableEntity` class with some customer data to be stored. The code calls the `upsertEntity` method on the `TableClient` object. That method either inserts the new customer entity into the `Employees` table or replaces the entity if it already exists.

```java
try
{
    final String tableName = "Employees";

    // Create a TableClient with a connection string and a table name.
     TableClient tableClient = new TableClientBuilder()
        .connectionString(connectionString)
        .tableName(tableName)
        .buildClient();

    // Create a new employee TableEntity.
    String partitionKey = "Sales";
    String rowKey = "0001";
    Map<String, Object> personalInfo= new HashMap<>();
    personalInfo.put("FirstName", "Walter");
    personalInfo.put("LastName", "Harp");
    personalInfo.put("Email", "Walter@contoso.com");
    personalInfo.put("PhoneNumber", "425-555-0101");
    TableEntity employee = new TableEntity(partitionKey, rowKey).setProperties(personalInfo);
        
    // Upsert the entity into the table
    tableClient.upsertEntity(employee);
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Insert a batch of entities

You can insert a batch of entities to the table service in one write operation. The following code creates a `List<TableTransactionAction>` object, then adds three upsert operations to it. Each operation is added by creating a new `TableEntity` object, setting its properties, and then calling the `submitTransaction` method on the `TableClient` object.

```java
try
{
    final String tableName = "Employees";

    // Create a TableClient with a connection string and a table name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(connectionString)
        .tableName(tableName)
        .buildClient();

    String partitionKey = "Sales";
    List<TableTransactionAction> tableTransactionActions = new ArrayList<>();
    
    Map<String, Object> personalInfo1 = new HashMap<>();
    personalInfo1.put("FirstName", "Jeff");
    personalInfo1.put("LastName", "Smith");
    personalInfo1.put("Email", "Jeff@contoso.com");
    personalInfo1.put("PhoneNumber", "425-555-0104");
    
    // Create an entity to add to the table.
    tableTransactionActions.add(new TableTransactionAction(
        TableTransactionActionType.UPSERT_MERGE,
        new TableEntity(partitionKey, "0001")
            .setProperties(personalInfo1)
    ));
    
    Map<String, Object> personalInfo2 = new HashMap<>();
    personalInfo2.put("FirstName", "Ben");
    personalInfo2.put("LastName", "Johnson");
    personalInfo2.put("Email", "Ben@contoso.com");
    personalInfo2.put("PhoneNumber", "425-555-0102");
    
    // Create another entity to add to the table.
    tableTransactionActions.add(new TableTransactionAction(
        TableTransactionActionType.UPSERT_MERGE,
        new TableEntity(partitionKey, "0002")
            .setProperties(personalInfo2)
    ));
    
    Map<String, Object> personalInfo3 = new HashMap<>();
    personalInfo3.put("FirstName", "Denise");
    personalInfo3.put("LastName", "Rivers");
    personalInfo3.put("Email", "Denise@contoso.com");
    personalInfo3.put("PhoneNumber", "425-555-0103");
    
    // Create a third entity to add to the table.
    tableTransactionActions.add(new TableTransactionAction(
        TableTransactionActionType.UPSERT_MERGE,
        new TableEntity(partitionKey, "0003")
            .setProperties(personalInfo3)
    ));

    // Submit transaction on the "Employees" table.
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

To query a table for entities in a partition, you can use a `ListEntitiesOptions`. Call `ListEntitiesOptions.setFilter` to create a query on a particular table that returns a specified result type. The following code specifies a filter for entities where `Sales` is the partition key. When the query is executed with a call to `listEntities` on the `TableClient` object, it returns an `Iterator` of `TableEntity`. You can then use the `Iterator` returned in a "ForEach" loop to consume the results. This code prints the fields of each entity in the query results to the console.

```java
try
{
    // Define constants for filters.
    final String PARTITION_KEY = "PartitionKey";
    final String tableName = "Employees";

    // Create a TableClient with a connection string and a table name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(connectionString)
        .tableName(tableName)
        .buildClient();

    // Create a filter condition where the partition key is "Sales".
    ListEntitiesOptions options = new ListEntitiesOptions().setFilter(PARTITION_KEY + " eq 'Sales'");

    // Loop through the results, displaying information about the entities.
    tableClient.listEntities(options, null, null).forEach(tableEntity -> {
        System.out.println(tableEntity.getPartitionKey() +
            " " + tableEntity.getRowKey() +
            "\t" + tableEntity.getProperty("FirstName") +
            "\t" + tableEntity.getProperty("LastName") +
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

If you don't want to query all the entities in a partition, specify a range by using comparison operators in a filter. The following code combines two filters to get all entities in partition `Sales` with a row key between '0001' and '0004'. Then it prints the query results. If you use the entities added to the table in the batch insert section of this guide, only two entities are returned this time (Ben and Denise).

```java
try
{
    // Define constants for filters.
    final String PARTITION_KEY = "PartitionKey";
    final String ROW_KEY = "RowKey";
    final String tableName = "Employees";

    // Create a TableServiceClient with a connection string.
    // Create a TableClient with a connection string and a table name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(connectionString)
        .tableName(tableName)
        .buildClient();

    // Create a filter condition where the partition key is "Sales".
    ListEntitiesOptions options = new ListEntitiesOptions().setFilter(PARTITION_KEY + " eq 'Sales' AND " + ROW_KEY + " lt '0004' AND " + ROW_KEY + " gt '0001'");
    
    // Loop through the results, displaying information about the entities.
    tableClient.listEntities(options, null, null).forEach(tableEntity -> {
        System.out.println(tableEntity.getPartitionKey() +
            " " + tableEntity.getRowKey() +
            "\t" + tableEntity.getProperty("FirstName") +
            "\t" + tableEntity.getProperty("LastName") +
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

You can write a query to retrieve a single, specific entity. The following code calls `TableClient.getEntity` with partition key and row key parameters to retrieve the entity for employee "Jeff Smith", instead of creating a `ListEntitiesOptions` and using filters to do the same thing. When executed, the retrieve operation returns just one entity, rather than a collection. A `null` value is returned if no entity has an exact partition and row key match. Specifying both partition and row keys in a query is the fastest way to retrieve a single entity from the Table service.

```java
try
{
    final String tableName = "Employees";

    // Create a TableClient with a connection string and a table name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(connectionString)
        .tableName(tableName)
        .buildClient();

    // Get the specific entity.
    TableEntity specificEntity = tableClient.getEntity("Sales", "0001");

    // Output the entity.
    if (specificEntity != null)
    {
        System.out.println(specificEntity.getPartitionKey() +
            " " + specificEntity.getRowKey() +
            "\t" + specificEntity.getProperty("FirstName") +
            "\t" + specificEntity.getProperty("LastName") +
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

To modify an entity, retrieve it from the table service, make changes to the entity object, and save the changes back to the table service with a replace or merge operation. The following code changes an existing customer's phone number. Instead of calling `tableClient.upsertEntity` as we did to insert, this code calls `tableClient.updateEntity`.

```java
try
{
    final String tableName = "Employees";

    // Create a TableClient with a connection string and a table name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(connectionString)
        .tableName(tableName)
        .buildClient();

    // Get the specific entity.
    TableEntity specificEntity = tableClient.getEntity("Sales", "0001");

    // Specify a new phone number
    specificEntity.getProperties().put("PhoneNumber", "425-555-0105");

    // Update the specific entity
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
    final String tableName = "Employees";

    // Create a TableClient with a connection string and a table name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(connectionString)
        .tableName(tableName)
        .buildClient();

    // Create a filter condition that retrieves only the Email property.
    List<String> attributesToRetrieve = new ArrayList<>();
    attributesToRetrieve.add("Email");
    
    ListEntitiesOptions options = new ListEntitiesOptions().setSelect(attributesToRetrieve);

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

Often you want to add an entity to a table without knowing if it already exists in the table. An insert-or-replace operation allows you to make a single request. That request will either insert the entity if it doesn't exist or replace the existing one if it does. Building on prior examples, the following code inserts or replaces the entity for "Walter Harp". After creating a new entity, this code calls the `TableClient.upsertEntity` method.

```java
try
{
    final String tableName = "Employees";

    // Create a TableClient with a connection string and a table name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(connectionString)
        .tableName(tableName)
        .buildClient();

    // Create a new table entity.
    Map<String, Object> properties = new HashMap<>();
    properties.put("FirstName", "Walter");
    properties.put("LastName", "Harp");
    properties.put("Email", "Walter@contoso.com");
    properties.put("PhoneNumber", "425-555-0101");
        
    TableEntity newEmployee = new TableEntity("Sales", "0004")
        .setProperties(properties);
        
    // Add the new customer to the Employees table.
    tableClient.upsertEntity(newEmployee);
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Delete an entity

You can delete an entity by providing its partition key and row key via `TableClient.deleteEntity`.

```java
try
{
    final String tableName = "Employees";

    // Create a TableClient with a connection string and a table name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(connectionString)
        .tableName(tableName)
        .buildClient();

    // Delete the entity for partition key 'Sales' and row key '0001' from the table.
    tableClient.deleteEntity("Sales", "0001");
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

## Delete a table

Finally, the following code deletes a table from an account. Around 40 seconds after you delete a table, you cannot recreate it.

```java
try
{
    final String tableName = "Employees";

    // Create a TableClient with a connection string and a table name.
    TableClient tableClient = new TableClientBuilder()
        .connectionString(connectionString)
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
* [Azure Tables client library for Java][Azure Tables client library for Java]
* [Azure Tables client library reference][Azure Tables client library reference documentation]
* [Azure Tables REST API][Azure Tables REST API]
* [Azure Tables Team Blog][Azure Tables Team Blog]

For more information, visit [Azure for Java developers](/java/azure).

[Azure SDK for Java]: https://go.microsoft.com/fwlink/?LinkID=525671
[Azure Tables client library for Java]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/tables/azure-data-tables
[Azure Tables client library reference documentation]: https://azure.github.io/azure-sdk-for-java/tables.html
[Azure Tables REST API]: ../../storage/tables/table-storage-overview.md
[Azure Tables Team Blog]: https://blogs.msdn.microsoft.com/windowsazurestorage/
