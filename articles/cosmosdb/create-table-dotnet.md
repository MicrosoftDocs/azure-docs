---
title: Get started with Azure Cosmos DB's Table API using .NET | Microsoft Docs
description: Get started with Azure Cosmos DB's Tables API using .NET
services: documentdb
documentationcenter: ''
author: bhanupr
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: documentdb
ms.custom: quick start connect
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 05/02/2017
ms.author: bhanupr

---
# Get started with Azure Cosmos DB's Table API using .NET

Azure Cosmos DB provides the Table API for applications that need a key-value store with a schema-less design. [Azure Table storage](../storage/storage-introduction.md) SDKs and REST APIs can be used to work with Azure Cosmos DB. You can use Azure Cosmos DB to create tables with high throughput requirements. Azure Cosmos DB supports throughput-optimized tables (informally called "premium tables"), currently in public preview. 

You can continue to use Azure Table storage for tables with high storage and lower throughput requirements. Azure Cosmos DB will introduce support for storage-optimized tables in a future update, and existing and new Azure Table storage accounts will be seamlessly upgraded to Azure Cosmos DB.

If you currently use Azure Table storage, you gain the following benefits with the "premium table" preview:

- Turn-key [global distribution](../documentdb/documentdb-distribute-data-globally.md) with multi-homing and [automatic and manual failvoers](../documentdb/documentdb-regional-failovers.md)
- Support for automatic schema-agnostic indexing against all properties ("secondary indexes"), and fast queries 
- Support for [independent scaling of storage and throughput](../documentdb/documentdb-partition-data.md), across any number of regions
- Support for [dedicated throughput per table](../documentdb/documentdb-request-units.md) that can be scaled from 100s to millions of requests per second
- Support for [five tunable consistency levels](../documentdb/documentdb-consistency-levels.md) to trade off availability, latency, and consistency based on your application needs
- 99.99% availability within a single region, and ability to add more regions for higher availability, and [industry-leading comprehensive SLAs](https://azure.microsoft.com/support/legal/sla/documentdb/v1_1/) on general availability
- Work with the existing Azure storage .NET SDK, and no code changes to your application

During the preview, Azure Cosmos DB supports the Table API using the .NET SDK. You can download the [Azure Storage Preview SDK](https://www.nuget.org/packages/WindowsAzure.Storage-Preview) SDK from Nuget, that has the same classes and method signatures as the public [Azure storage SDK](https://www.nuget.org/packages/WindowsAzure.Storage), but also has the ability to connect to Azure Cosmos DB accounts using the Table API.

### About this tutorial
This tutorial is for developers who are familiar with the Azure Table storage SDK, and would like to use the premium features available using Azure Cosmos DB. It is based on [Get Started with Azure Table storage using .NET](../storage/storage-dotnet-how-to-use-tables.md) and shows how to take advantage oft additional capabilities like secondary indexes, provisioned throughput, and multi-homing. We cover how to use the Azure portal to create an Azure Cosmos DB account,and then build and deploy a Table application. We also walk through C# examples for creating and deleting a table, and inserting, updating, deleting, and querying table data. 

If you don't already have Visual Studio 2015 installed, you can download and use the **free** [Visual Studio 2015 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a database account

[!INCLUDE [documentdb-create-dbaccount](../../includes/documentdb-create-dbaccount.md)]

## Clone the sample application

Now let's clone a Table app from github, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and `CD` to a working directory.  

2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-table-dotnet-getting-started
    ```

3. Then open the solution file in Visual Studio.

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app.

1. In the [Azure portal](http://portal.azure.com/), in your Azure Cosmos DB account, in the left navigation click **Keys**. You'll use the copy buttons on the right side of the screen to copy the connection string into the app.config file in the next step.

    ![View and copy an access key in the Azure Portal, Keys blade](./media/create-table-dotnet/keys.png)

2. In Visual Studio 2015, open the app.config file. 

3. Copy your URI value from the portal (using the copy button) and make it the value of the account-key in app.config. Use the account name created earlier for account-name in app.config.
  
`<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key;TableEndpoint=https://account-name.documents.azure.com" />`

> [!NOTE]
> To use this app with a Azure Table Storage, you just need to change the connection string in `app.config file`. Use the account name as Table-account name and key as Azure Storage Primary key. <br>
>`<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key;EndpointSuffix=core.windows.net" />`
> 
>

## Build and deploy the app
1. In Visual Studio, right-click on the project in **Solution Explorer** and then click **Manage NuGet Packages**. 

2. In the NuGet **Browse** box, type ***WindowsAzure.Storage***. Check **Include prerelease versions** if you haven't already.

3. From the results, install the **WindowsAzure.Storage** and choose the preview build `8.2.0-preview`. This installs the Azure Table storage package as well as all dependencies.

4. Add steps to install Azure Storage Nuget package and Configuration Manager nuget package.

4. Click CTRL + F5 to run the application. 

You can now go back to Data Explorer and see query, modify, and work with this table data. 

> [!NOTE]
> To use this app with a Azure Cosmos DB Emulator, you just need to change the connection string in `app.config file`. Use the below value for emulator. <br>
>`<add key="StorageConnectionString" value=DefaultEndpointsProtocol=https;AccountName=localhost;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==;TableEndpoint=https://localhost -->`
> 
>

## Azure Cosmos DB capabilities
While Azure Cosmos DB supports a number of additional capabilities, we did not introduce any new signatures or overloads to the preview Azure Storage SDK, so that you can use the same interface to work with Azure Table storage accounts as well as Azure Cosmos DB. You can even run them side by side within the same executable, and use the SDK to work with other Azure Storage services like Blobs and Queues. 

The new functionality can be enabled via the following `appSettings` configuration values:

| Key | Description |
| --- | --- |
| `TableConnectionMode`  | Azure Cosmos DB supports two connectivity modes. In `Gateway` mode, requests are always made to the Azure Cosmos DB gateway, which forwards it to the corresponding data partitions. In direct connectivity mode, the client fetches the mapping of tables to partitions, and requests are made directly against data partitions. We recommend `Direct`, the default.  |
| `TableConnectionProtocol` | Azure Cosmos DB supports two connection protocols - `Https` and `Tcp`. `Tcp` is the default, and recommended because it is more lightweight. |
| `TablePreferredLocations` | Comma-separated list of preferred (multi-homing) locations for reads. Each Azure Cosmos DB account can be associated with 1-30+ regions. Each client instance can specify a subset of these regions in the preferred order for low latency reads. The regions must be named using their [display names](https://msdn.microsoft.com/library/azure/gg441293.aspx), for example, `West US`. Also see [Multi-homing APIs](../documentdb/documentdb-developing-with-multiple-regions.md).
| `TableConsistencyLevel` | You can trade off between latency, consistency, and availablity by choosing between five well defined consistency levels: `Strong`, `Session`, `Bounded-Staleness`, `ConsistentPrefix` and `Eventual`. Default is `Session`. The choice of consistency level makes a significant performance difference in multi-region setups. See [Consistency Levels](../documentdb/documentdb-consistency-levels.md) for details. |
| `TableThroughput` | Reserved throughput for the table expressed in request units (RU) per second. Single tables can support 100s-millions of RU/s. See [Request units](../documentdb/documentdb-request-units.md). Default is `400` |
| `TableIsRUPerMinuteEnabled` | Used to enable the RU/min provisioning flag for new tables. If enabled, then Azure Cosmos DB will include bonus per-minute RUs in addition to the per-second provisined RUs. RU/min provisioning can be used to handle spikes in activity in a cost-effectiv manner. See [Request units](../documentdb/documentdb-request-units.md). Default is `false` |
| `TableIndexingPolicy` | Consistent and automatic secondary indexing of all columns within tables | JSON string conforming to the indexing policy specification. See [Indexing Policy](../documentdb/documentdb-indexing-policies.md) to see how you can change indexing policy to include/exclude specific columns. | Automatic indexing of all properties (hash for strings, and range for numbers) |
| `TableQueryMaxItemCount` | Configure the maximum number of items returned per table query in a single round trip. Default is `-1`, which lets Azure Cosmos DB dynamically determine the value at runtime. |
| `TableQueryEnableScan` | If the table is configured with no index paths for any of the filters in a query, then run it anyway via a table scan. Default is `false`.|
| `TableQueryMaxDegreeOfParallelism` | The degree of parallelism for execution of a cross-partition query. `0` is serial with no pre-fetching, `1` is serial with pre-fetching, and higher values increase the rate of parallelism. Default is `-1`, which les Azure Cosmos DB dynamically determine the value at runtime. |
| `TableQueryContinuationTokenLimitInKb` | The maximum size of the continuation token for resuming query execution. No limit enforced if not specified. The default (no limit) is recommended. |
| `TableDisableRUPerMinuteUsage` | Should the client use RU/min quota for requess, if available. Default is `false` |

The following example shows how you can change the different settings for above capablities provided by Azure Cosmos DB. To change the default value, open the `app.config` file from Solution Explorer in Visual Studio. Add the contents of the `<appSettings>` element shown below. Replace `account-name` with the name of your storage account, and `account-key` with your account access key. 

```xml
<configuration>
    <startup> 
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5.2" />
    </startup>
    <appSettings>
      <!-- Client options -->
      <add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key; TableEndpoint=https://account-name.documents.azure.com" />
      <add key="TableConnectionMode" value="Direct"/>
      <add key="TableConnectionProtocol" value="Tcp"/>
      <add key="TablePreferredLocations" value="East US, West US, North Europe"/>
      <add key="TableConsistencyLevel" value="Eventual"/>

      <!--Table creation options -->
      <add key="TableThroughput" value="700"/>
      <add key="TableIsRUPerMinuteEnabled" value="false"/>
      <add key="TableIndexingPolicy" value="{""indexingMode"": ""Consistent""}">

      <!-- Table query options -->
      <add key="TableQueryMaxItemCount" value="-1"/>
      <add key="TableQueryEnableScan" value="false"/>
      <add key="TableQueryMaxDegreeOfParallelism" value="-1"/>
      <add key="TableQueryContinuationTokenLimitInKb" value="16"/>
      
      <!-- Table general request options -->
      <add key="TableDisableRUPerMinuteUsage" value="false"/>
      
    </appSettings>
</configuration>
```

Let's make a quick review of what's happening in the app. Open the `Program.cs` file and you'll find that these lines of code create the Table resources. 

## Create the table client.
You initialize a `CloudTableClient` to connect to the table account.

```csharp
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
```
This client is initialized using `TableConnectionMode`, `TableConnectionProtocol`, `TableConsistencyLevel`, and `TablePreferredLocations` configuration values that are specified in the app settings (or defaults if not specified).
    
## Create a table.
Then, you create a table using `CloudTable`. Tables in Azure Cosmos DB can scale independently in terms of storage and throughput, and partitioning is handled automatically by the service. Azure Cosmos DB supports both fixed size and unlimited tables. See [Partitioning in Azure Cosmos DB](../documentdb/documentdb-partition-data.md) for details. 

```csharp
//Retrieve a reference to the table.
CloudTable table = tableClient.GetTableReference("people");
//Create the table if it doesn't exist.
table.CreateIfNotExists();
```

Note that there is an important difference in how tables are created. Azure Cosmos DB reserves throughput, unlike Azure storage's consumption based model for transactions. The reservation model has two key benefits. 1) your throughput is dedicated/reserved, so you never get throttled if your request rate is at or below your provisioned throughput, and 2) the reservation model is more [cost effective for workloads](../documentdb/documentdb-key-value-store-cost.md) that need to perform a large number of reads and writes. You can configure the default throughput per table by onfiguring the AppSetting for `TableThroughput` in terms of RU (request units) per second. 

A read of a 1 KB document is normalized as 1 RU, and all other operations are expressed in terms of RUs based on their CPU, memory, and IOPS consumption. Learn more about [Request units in Azure Cosmos DB(../documentdb/documentdb-request-units.md).

> [!NOTE]
> While Table storage SDK does not currently support modifying throughput, you can change the throughput instantaneously at any time using the Azure portal or Azure CLI.

Next, we walk through the simple read and write (CRUD) operations using the Azure Table storage SDK. The primary advantage is that you will notice while running this tutorial with Azure Cosmos DB is predictable low single-digit millisecond latencies for readsa and writes, and fast queries.

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

Writes in Azure Cosmos DB complete <15ms at p99 and ~6ms at p50 for applications running in the same region as the Azure Cosmos DB account. And this duration accounts for the fact that writes are acked back to the client only after they are synchronously replicated, durably committed, and all content is indexed.

The Table API for Azure Cosmos DB is in preview. At general availability, the p99 latency guarantees are backed by SLAs like other Azure Cosmos DB APIs. 

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
Azure Table storage supports a batch operation API, that lets you combine updates, deletes, and inserts in the same single batch operation. Azure Cosmos DB does not have some of the limitations on the batch API as Azure Table storage. For example, you can perform multiple reads within a batch, you can perform multiple writes to the same entity within a batch, and there is no limit on 100 operations per batch. 

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
You can retrieve a single entity using the following snippet. Retrieves(GETs) in Azure Cosmos DB complete <10ms at p99 and ~1ms at p50 in the same Azure region. You can add as many regions to your account for low latency reads, and deploy applications to read from their local region ("multi-homed") by setting `TablePreferredLocations`. 

Again when the Table API is generally available, these latency guarantees are backed by SLAs

```csharp
// Create a retrieve operation that takes a customer entity.
TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

// Execute the retrieve operation.
TableResult retrievedResult = table.Execute(retrieveOperation);
```
> [!TIP]
> Learn about multi-homing APIs at [Developing with multiple regions](../documentdb/documentdb-developing-with-multiple-regions.md)
>

## Query entities using automatic secondary indexes
Tables can be queried using the `TableQuery` class. Since Azure Cosmos DB has a write-optimized database engine, that automatically indexes all columns within your table even if the schema is different between rows, or if the schema evolves over time. Since Azure Cosmos DB supports automatic secondary indexes, queries against any property can use the index and be served efficiently.

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

In preview, Azure Cosmos DB supports the same query surface area as Azure Table storage. Azure Cosmos DB is capable of supporting a much wider surface area, including sorting, aggregates, geospatial query, hierarchy, and a wide range of built-in functions. See [Azure Cosmos DB query](../documentdb/documentdb-sql-query.md) for an overview of these capabilities. 

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

## Next steps
In this tutorial, we covered how to get started using Azure Cosmos DB with the Table API. To learn more about Azure Table storage, follow these links to learn about more complex storage tasks:

* Read about [Azure Cosmos DB: Table API](table-introduction.md)
* See more Table storage samples in [Getting Started with Azure Table Storage in .NET](../create-table-dotnet.md)
* View the Table service reference documentation for complete details about available APIs: [Storage Client Library for .NET reference](http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409)
