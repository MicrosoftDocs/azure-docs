---
title: Develop with the Table API using .NET SDK
titleSuffix: Azure Cosmos DB
description: Learn how to develop with Table API in Azure Cosmos DB by using .NET SDK
author: SnehaGunda

ms.service: cosmos-db
ms.component: cosmosdb-table
ms.devlang: dotnet
ms.topic: tutorial
ms.date: 12/07/2018
ms.author: sngun
ms.custom: seodec18
---

# Develop with Azure Cosmos DB's Table API using .NET SDK

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB.

This tutorial covers the following tasks: 

> [!div class="checklist"] 
> * Create an Azure Cosmos DB account 
> * Enable functionality in the app.config file 
> * Create a table using the [Table API](table-introduction.md)
> * Add an entity to a table 
> * Insert a batch of entities 
> * Retrieve a single entity 
> * Query entities using automatic secondary indexes 
> * Replace an entity 
> * Delete an entity 
> * Delete a table
 
## Tables in Azure Cosmos DB 

Azure Cosmos DB provides the [Table API](table-introduction.md) for applications that need a key-value store with a schema-less design. Both Azure Cosmos DB Table API and [Azure Table storage](../storage/common/storage-introduction.md) now support the same SDKs and REST APIs. You can use Azure Cosmos DB to create tables with high throughput requirements.

This tutorial is for developers who are familiar with the Azure Table storage SDK, and would like to use the premium features available with Azure Cosmos DB. It is based on [Get Started with Azure Table storage using .NET](table-storage-how-to-use-dotnet.md) and shows how to take advantage of additional capabilities like secondary indexes, provisioned throughput, and multi-homing. This tutorial describes how to use the Azure portal to create an Azure Cosmos DB account, and then build and deploy a Table API application. We also walk through .NET examples for creating and deleting a table, and inserting, updating, deleting, and querying table data. 

If you currently use Azure Table storage, you gain the following benefits with Azure Cosmos DB Table API:

- Turn-key [global distribution](distribute-data-globally.md) with multi-homing and [automatic and manual failovers](high-availability.md)
- Support for automatic schema-agnostic indexing against all properties ("secondary indexes"), and fast queries 
- Support for [independent scaling of storage and throughput](partition-data.md), across any number of regions
- Support for [dedicated throughput per table](request-units.md) that can be scaled from hundreds to millions of requests per second
- Support for [five tunable consistency levels](consistency-levels.md) to trade off availability, latency, and consistency based on your application needs
- 99.99% availability within a single region, and ability to add more regions for higher availability, and [industry-leading comprehensive SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) on general availability
- Work with the existing Azure storage .NET SDK, and no code changes to your application

This tutorial covers Azure Cosmos DB Table API using the .NET SDK. You can download the [Azure Cosmos DB Table API .NET SDK](https://aka.ms/tableapinuget) from NuGet.

To learn more about complex Azure Table storage tasks, see:

* [Introduction to Azure Cosmos DB Table API](table-introduction.md)
* The Table service reference documentation for complete details about available APIs [Azure Cosmos DB Table API .NET SDK](https://docs.microsoft.com/dotnet/api/overview/azure/cosmosdb/client?view=azure-dotnet)

### About this tutorial
This tutorial is for developers who are familiar with the Azure Table storage SDK, and would like to use the premium features available using Azure Cosmos DB. It is based on [Get Started with Azure Table storage using .NET](table-storage-how-to-use-dotnet.md) and shows how to take advantage of additional capabilities like secondary indexes, provisioned throughput, and multi-homing. We cover how to use the Azure portal to create an Azure Cosmos DB account, and then build and deploy a Table application. We also walk through .NET examples for creating and deleting a table, and inserting, updating, deleting, and querying table data. 

If you don't already have Visual Studio 2017 installed, you can download and use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a database account

Let's start by creating an Azure Cosmos DB account in the Azure portal.  
 
> [!IMPORTANT]  
> You need to create a new Table API account to work with the generally available Table API SDKs. Table API accounts created during preview are not supported by the generally available SDKs. 
>

[!INCLUDE [cosmosdb-create-dbaccount-table](../../includes/cosmos-db-create-dbaccount-table.md)] 

## Clone the sample application

Now let's clone a Table app from github, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and use the `cd` command to change to a folder to install the sample app. 

    ```bash
    cd "C:\git-samples"
    ```

2. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer. 

    ```bash
    git clone https://github.com/Azure-Samples/storage-table-dotnet-getting-started.git
    ```

3. Then open the solution file in Visual Studio. 

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app. This enables your app to communicate with your hosted database. 

1. In the [Azure portal](http://portal.azure.com/), click **Connection String**. 

    Use the copy buttons on the right side of the screen to copy the PRIMARY CONNECTION STRING.

    ![View and copy the CONNECTION STRING in the Connection String pane](./media/create-table-dotnet/connection-string.png)

2. In Visual Studio, open the app.config file. 

3. Uncomment the StorageConnectionString on line 8 and comment out the StorageConnectionString on line 7 as this tutorial does not use the Storage Emulator. Line 7 and 8 should now look like this:

    ```
    <!--key="StorageConnectionString" value="UseDevelopmentStorage=true;" />-->
    <add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[AccountKey]" />
    ```

4. Paste the PRIMARY CONNECTION STRING from the portal into the StorageConnectionString value on line 8. Paste the string inside the quotes.
   
    > [!IMPORTANT]
    > If your Endpoint uses documents.azure.com, that means you have a preview account, and you need to create a [new Table API account](#create-a-database-account) to work with the generally available Table API SDK. 
    >

    Line 8 should now look similar to:

    ```
    <add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=txZACN9f...==;TableEndpoint=https://<account name>.table.cosmosdb.azure.com;" />
    ```

5. Save the app.config file.

You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

## Azure Cosmos DB capabilities
Azure Cosmos DB supports a number of capabilities that are not available in the Azure Table storage API. 

Certain functionality is accessed via new overloads to CreateCloudTableClient that enable one to specify connection policy and consistency level.

| Table Connection Settings | Description |
| --- | --- |
| Connection Mode  | Azure Cosmos DB supports two connectivity modes. In `Gateway` mode, requests are always made to the Azure Cosmos DB gateway, which forwards it to the corresponding data partitions. In `Direct` connectivity mode, the client fetches the mapping of tables to partitions, and requests are made directly against data partitions. We recommend `Direct`, the default.  |
| Connection Protocol | Azure Cosmos DB supports two connection protocols - `Https` and `Tcp`. `Tcp` is the default, and recommended because it is more lightweight. |
| Preferred Locations | Comma-separated list of preferred (multi-homing) locations for reads. Each Azure Cosmos DB account can be associated with 1-30+ regions. Each client instance can specify a subset of these regions in the preferred order for low latency reads. The regions must be named using their [display names](https://msdn.microsoft.com/library/azure/gg441293.aspx), for example, `West US`. Also see [Multi-homing APIs](tutorial-global-distribution-table.md). |
| Consistency Level | You can trade off between latency, consistency, and availability by choosing between five well-defined consistency levels: `Strong`, `Session`, `Bounded-Staleness`, `ConsistentPrefix`, and `Eventual`. Default is `Session`. The choice of consistency level makes a significant performance difference in multi-region setups. See [Consistency levels](consistency-levels.md) for details. |

Other functionality can be enabled via the following `appSettings` configuration values.

| Key | Description |
| --- | --- |
| TableQueryMaxItemCount | Configure the maximum number of items returned per table query in a single round trip. Default is `-1`, which lets Azure Cosmos DB dynamically determine the value at runtime. |
| TableQueryEnableScan | If the query cannot use the index for any filter, then run it anyway via a scan. Default is `false`.|
| TableQueryMaxDegreeOfParallelism | The degree of parallelism for execution of a cross-partition query. `0` is serial with no pre-fetching, `1` is serial with pre-fetching, and higher values increase the rate of parallelism. Default is `-1`, which lets Azure Cosmos DB dynamically determine the value at runtime. |

To change the default value, open the `app.config` file from Solution Explorer in Visual Studio. Add the contents of the `<appSettings>` element shown below. Replace `account-name` with the name of your storage account, and `account-key` with your account access key. 

```xml
<configuration>
    ...
    <appSettings>
      <!-- Client options -->
      <add key="CosmosDBStorageConnectionString" 
        value="DefaultEndpointsProtocol=https;AccountName=MYSTORAGEACCOUNT;AccountKey=AUTHKEY;TableEndpoint=https://account-name.table.cosmosdb.azure.com" />
      <add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key; TableEndpoint=https://account-name.documents.azure.com" />

      <!-- Table query options -->
      <add key="TableQueryMaxItemCount" value="-1"/>
      <add key="TableQueryEnableScan" value="false"/>
      <add key="TableQueryMaxDegreeOfParallelism" value="-1"/>
      <add key="TableQueryContinuationTokenLimitInKb" value="16"/>
            
    </appSettings>
</configuration>
```

Let's make a quick review of what's happening in the app. Open the `Program.cs` file and you will find that these lines of code create the Table resources. 

## Create the table client
You initialize a `CloudTableClient` to connect to the table account.

```csharp
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
```
This client is initialized using the `TableConnectionMode`, `TableConnectionProtocol`, `TableConsistencyLevel`, and `TablePreferredLocations` configuration values if specified in the app settings.

## Create a table
Then, you create a table using `CloudTable`. Tables in Azure Cosmos DB can scale independently in terms of storage and throughput, and partitioning is handled automatically by the service. Azure Cosmos DB supports both fixed size and unlimited tables. See [Partitioning in Azure Cosmos DB](partition-data.md) for details. 

```csharp
CloudTable table = tableClient.GetTableReference("people");
400
table.CreateIfNotExists(throughput: 800);
```

There is an important difference in how tables are created. Azure Cosmos DB reserves throughput, unlike Azure storage's consumption-based model for transactions. Your throughput is dedicated/reserved, so you never get throttled if your request rate is at or below your provisioned throughput.

You can configure the default throughput by including it as a parameter of CreateIfNotExists.

A read of a 1-KB entity is normalized as 1 RU, and other operations are normalized to a fixed RU value based on their CPU, memory, and IOPS consumption. Learn more about [Request units in Azure Cosmos DB](request-units.md) and specifically for [key value stores](key-value-store-cost.md).

Next, we walk through the simple read and write (CRUD) operations using the Azure Table storage SDK. This tutorial demonstrates predictable low single-digit millisecond latencies and fast queries provided by Azure Cosmos DB.

## Add an entity to a table
Entities in Azure Table storage extend from the `TableEntity` class and must have `PartitionKey` and `RowKey` properties. Here's a sample definition for a customer entity.

```csharp
public class CustomerEntity : TableEntity
{
    public CustomerEntity(string lastName, string firstName)
    {
        this.PartitionKey = lastName;
        this.RowKey = firstName;
    }

    public CustomerEntity() { }

    public string Email { get; set; }

    public string PhoneNumber { get; set; }
}
```

The following snippet shows how to insert an entity with the Azure storage SDK. Azure Cosmos DB is designed for guaranteed low latency at any scale, across the world.

Writes complete <15 ms at p99 and ~6 ms at p50 for applications running in the same region as the Azure Cosmos DB account. And this duration accounts for the fact that writes are acknowledged back to the client only after they are synchronously replicated, durably committed, and all content is indexed.


```csharp
// Create a new customer entity.
CustomerEntity customer1 = new CustomerEntity("Harp", "Walter");
customer1.Email = "Walter@contoso.com";
customer1.PhoneNumber = "425-555-0101";

// Create the TableOperation object that inserts the customer entity.
TableOperation insertOperation = TableOperation.Insert(customer1);

// Execute the insert operation.
table.Execute(insertOperation);
```

## Insert a batch of entities
Azure Table storage supports a batch operation API, that lets you combine updates, deletes, and inserts in the same batch operation.

```csharp
// Create the batch operation.
TableBatchOperation batchOperation = new TableBatchOperation();

// Create a customer entity and add it to the table.
CustomerEntity customer1 = new CustomerEntity("Smith", "Jeff");
customer1.Email = "Jeff@contoso.com";
customer1.PhoneNumber = "425-555-0104";

// Create another customer entity and add it to the table.
CustomerEntity customer2 = new CustomerEntity("Smith", "Ben");
customer2.Email = "Ben@contoso.com";
customer2.PhoneNumber = "425-555-0102";

// Add both customer entities to the batch insert operation.
batchOperation.Insert(customer1);
batchOperation.Insert(customer2);

// Execute the batch operation.
table.ExecuteBatch(batchOperation);
```
## Retrieve a single entity
Retrieves (GETs) in Azure Cosmos DB complete <10 ms at p99 and ~1 ms at p50 in the same Azure region. You can add as many regions to your account for low latency reads, and deploy applications to read from their local region ("multi-homed") by setting `TablePreferredLocations`. 

You can retrieve a single entity using the following snippet:

```csharp
// Create a retrieve operation that takes a customer entity.
TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

// Execute the retrieve operation.
TableResult retrievedResult = table.Execute(retrieveOperation);
```
> [!TIP]
> Learn about multi-homing APIs at [Developing with multiple regions](tutorial-global-distribution-table.md)
>

## Query entities using automatic secondary indexes
Tables can be queried using the `TableQuery` class. Azure Cosmos DB has a write-optimized database engine that automatically indexes all columns within your table. Indexing in Azure Cosmos DB is agnostic to schema. Therefore, even if your schema is different between rows, or if the schema evolves over time, it is automatically indexed. Since Azure Cosmos DB supports automatic secondary indexes, queries against any property can use the index and be served efficiently.

```csharp
CloudTable table = tableClient.GetTableReference("people");

// Filter against a property that's not partition key or row key
TableQuery<CustomerEntity> emailQuery = new TableQuery<CustomerEntity>().Where(
    TableQuery.GenerateFilterCondition("Email", QueryComparisons.Equal, "Ben@contoso.com"));

foreach (CustomerEntity entity in table.ExecuteQuery(emailQuery))
{
    Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
        entity.Email, entity.PhoneNumber);
}
```

Azure Cosmos DB supports the same query functionality as Azure Table storage for the Table API. Azure Cosmos DB also supports sorting, aggregates, geospatial query, hierarchy, and a wide range of built-in functions. See [Azure Cosmos DB query](how-to-sql-query.md) for an overview of these capabilities. 

## Replace an entity
To update an entity, retrieve it from the Table service, modify the entity object, and then save the changes back to the Table service. The following code changes an existing customer's phone number. 

```csharp
TableOperation updateOperation = TableOperation.Replace(updateEntity);
table.Execute(updateOperation);
```
Similarly, you can perform `InsertOrMerge` or `Merge` operations.  

## Delete an entity
You can easily delete an entity after you have retrieved it by using the same pattern shown for updating an entity. The following code retrieves and deletes a customer entity.

```csharp
TableOperation deleteOperation = TableOperation.Delete(deleteEntity);
table.Execute(deleteOperation);
```

## Delete a table
Finally, the following code example deletes a table from a storage account. You can delete and recreate a table immediately with Azure Cosmos DB.

```csharp
CloudTable table = tableClient.GetTableReference("people");
table.DeleteIfExists();
```

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this tutorial, we covered how to get started using Azure Cosmos DB with the Table API, and you've done the following: 

> [!div class="checklist"] 
> * Created an Azure Cosmos DB account 
> * Enabled functionality in the app.config file 
> * Created a table 
> * Added an entity to a table 
> * Inserted a batch of entities 
> * Retrieved a single entity 
> * Queried entities using automatic secondary indexes 
> * Replaced an entity 
> * Deleted an entity 
> * Deleted a table  

You can now proceed to the next tutorial and learn more about querying table data. 

> [!div class="nextstepaction"]
> [Query with the Table API](tutorial-query-table.md)
