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
Azure Cosmos DB, formerly known as Azure DocumentDB, is Microsoft's multi-tenant, globally distributed NoSQL database service for mission-critical applications. Azure Cosmos DB was built with global distribution and horizontal scale at its core. It offers turn-key global distribution across any number of Azure regions by transparently scaling and replicating your data wherever your users are. You can elastically scale throughput and storage worldwide and pay only for the throughput and storage you need. Azure Cosmos DB guarantees single-digit millisecond latencies at the 99th percentile anywhere in the world, offers multiple well-defined consistency models to fine-tune for performance, and guaranteed high availability with multi-homing capabilities, all backed by industry-leading service level agreements (SLAs). It automatically indexes data without requiring you to deal with schema and index management

Azure Cosmos DB provides the Table API for applications that need a key/attribute store with a schemaless design. It comes with a Premium Table .NET SDK that is based on Table Storage .NET SDK. So, you can continue to use the existing Azure Table Storage [.NET APIs](https://msdn.microsoft.com/en-us/library/microsoft.windowsazure.storage.table.aspx) to build applications to store flexible datasets like user data for web applications, address books, device information, or other types of metadata your service requires. If you have an existing application that is implemented using Table Storage .NET SDK, then you don't need to change your application. You can use the same application and just change the connection string to use the capabilities like global distribution, predictable performance, rich indexing and query, provided by Azure Cosmos DB. 

### About this tutorial
This quick start demonstrates how to use [Get Started with Azure Table storage using .NET](https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-how-to-use-tables) for Azure Cosmos DB and the Azure portal to create an Azure Cosmos DB account,and then build and deploy a Table application. It will also walk through C# examples for creating and deleting a table, and inserting, updating, deleting, and querying table data. 

If you don’t already have Visual Studio 2015 installed, you can download and use the **free** [Visual Studio 2015 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

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

1. In the [Azure portal](http://portal.azure.com/), in your Azure Cosmos DB account, in the left navigation click **Keys**. You'll use the copy buttons on the right side of the screen to copy the Primary Key into the app.config file in the next step.

    ![View and copy an access key in the Azure Portal, Keys blade](./media/documentdb-connect-dotnet/keys.png)

2. In Visual Studio 2015, open the app.config file. 

3. Copy your URI value from the portal (using the copy button) and make it the value of the account-key in app.config. Use the account name created earlier for account-name in app.config.
  
`<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key;TableEndpoint=https://account-name.documents.azure.com" />`

> [!NOTE]
> To use this app with a Azure Table Storage, you just need to change the connection string in `app.config file`. Use the account name as Table-account name and key as Azure Storage Primary key. <br>
>`<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key;EndpointSuffix=core.windows.net" />`
> 
>

## Build and deploy the web app
1. In Visual Studio, right-click on the project in **Solution Explorer** and then click **Manage NuGet Packages**. 

2. In the NuGet **Browse** box, type ***Azure DocumentDB***.

3. From the results, install the **.NET Client library for Azure DocumentDB**. This installs the DocumentDB package as well as all dependencies.

4. Add steps to install Azure Storage Nuget package and Configuration Manager nuget package.

4. Click CTRL + F5 to run the application. 

You can now go back to Data Explorer and see query, modify, and work with this table data. 

> [!NOTE]
> To use this app with a Azure Cosmos DB Emulator, you just need to change the connection string in `app.config file`. Use the below value for emulator. <br>
>`<add key="StorageConnectionString" value=DefaultEndpointsProtocol=https;AccountName=localhost;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==;TableEndpoint=https://localhost -->`
> 
>

## Azure Cosmos DB capabilities
You can use the below settings to tune different settings for Table. 

| Key | Default Value | Definition of the key | Example Value |
| --- | --- | --- | --- |
| TableUseGatewayMode  | false | If true, then client applications issues requests to the Cosmos DB gateway machines, which forwards the requests to the backend node. If false, the client applications directly connects to the backend nodes and offers better performance | false |
| TablePreferredLocations | None |Sets the preferred location for geo-replicated accounts. Accounts can be mapped to 30+ regions | East US |
| TableThroughput |400 (Single partition) | Reserve throughput with guaranteed Request Units backed by SLA. For large scale scenarios (including migrating from Table Storage to Azure Cosmos DB), request higher RUs for better performance. Accounts have no upper limit on throughput and use >10 million operations/s per collection in practice | 7000 |
| TableIndexingPolicy | Indexes all property | Use custom indexing policy to include/exclude paths | CustomPolicy |
| TableConsistencyLevel | Session | You can select from five well defined consistency levels: Strong, Session, Bounded-Staleness, Consistent Prefix and Eventual | Eventual |

Below example shows how you can change the different settings for above capablities provided by Azure Cosmos DB. To change the default value, open the `app.config` file from Solution Explorer in Visual Studio. Add the contents of the `<appSettings>` element shown below. Replace `account-name` with the name of your storage account, and `account-key` with your account access key. 

```xml
<configuration>
    <startup> 
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5.2" />
    </startup>
    <appSettings>
        <add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key; TableEndpoint=https://account-name.documents.azure.com" />
      <add key="TableUseGatewayMode" value="false"/>
      <add key="TablePreferredLocations" value="East US"/>
      <add key="TableThroughput" value="7000"/>
      <add key="TableIndexingPolicy" value="CustomPolicy"/>
      <add key="TableConsistencyLevel" value="Eventual"/>
    </appSettings>
</configuration>
```

## Review the code

Let's make a quick review of what's happening in the app. Open the Program.cs file and you'll find that these lines of code create the Table resources. 

* Create the table client.

    ```csharp
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
    ```
* Create a table.

    ```csharp
    //Retrieve a reference to the table.
    CloudTable table = tableClient.GetTableReference("people");
    //Create the table if it doesn't exist.
    table.CreateIfNotExists();
    ```
As we walk through the below operations, you will get single-digit millisecond latency for reads and writes with Azure Cosmos DB, backed with <10 ms latency reads and <15 ms latency writes at the 99th percentile. 

## Add an entity to a table
Entities map to C# objects by using a custom class derived from [TableEntity][dotnet_TableEntity]. To add an entity to a table, create a class that defines the properties of your entity. The following code defines an entity class that uses the customer's first name as the row key and last name as the partition key. Together, an entity's partition and row key uniquely identify it in the table. Entities with the same partition key can be queried faster than entities with different partition keys, but using diverse partition keys allows for greater scalability of parallel operations. Entities to be stored in tables must be of a supported type, for example derived from the [TableEntity][dotnet_TableEntity] class. Entity properties you'd like to store in a table must be public properties of the type, and support both getting and setting of values. Also, your entity type *must* expose a parameter-less constructor.

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

Table operations that involve entities are performed via the [CloudTable][dotnet_CloudTable] object that you created earlier in the "Create a table" section. The operation to be performed is represented by a [TableOperation][dotnet_TableOperation] object. The following code example shows the creation of the [CloudTable][dotnet_CloudTable] object and then a **CustomerEntity** object. To prepare the operation, a [TableOperation][dotnet_TableOperation] object is created to insert the customer entity into the table. Finally, the operation is executed by calling [CloudTable][dotnet_CloudTable].[Execute][dotnet_CloudTable_Execute]. With Premium SDK, the data is written within 15 ms for 99% of the requests. In the below example, the write is guaranteed to happen within 15 ms and this backed by SLA. 

```csharp
// Retrieve the storage account from the connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the table client.
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Create the CloudTable object that represents the "people" table.
CloudTable table = tableClient.GetTableReference("people");

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
You can insert a batch of entities into a table in one write operation. Some other notes on batch operations:

* You can perform updates, deletes, and inserts in the same single batch operation.
* A single batch operation can include up to 100 entities.
* All entities in a single batch operation must have the same partition key.
* While it is possible to perform a query as a batch operation, it must be the only operation in the batch.

The following code example creates two entity objects and adds each to [TableBatchOperation][dotnet_TableBatchOperation] by using the [Insert][dotnet_TableBatchOperation_Insert] method. Then, [CloudTable][dotnet_CloudTable].[ExecuteBatch][dotnet_CloudTable_ExecuteBatch] is called to execute the operation.

```csharp
// Retrieve the storage account from the connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the table client.
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Create the CloudTable object that represents the "people" table.
CloudTable table = tableClient.GetTableReference("people");

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

## Retrieve all entities in a partition
To query a table for all entities in a partition, use a [TableQuery][dotnet_TableQuery] object. The following code example specifies a filter for entities where 'Smith' is the partition key. This example prints the fields of each entity in the query results to the console.

```csharp
// Retrieve the storage account from the connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the table client.
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Create the CloudTable object that represents the "people" table.
CloudTable table = tableClient.GetTableReference("people");

// Construct the query operation for all customer entities where PartitionKey="Smith".
TableQuery<CustomerEntity> query = new TableQuery<CustomerEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "Smith"));

// Print the fields for each customer.
foreach (CustomerEntity entity in table.ExecuteQuery(query))
{
    Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
        entity.Email, entity.PhoneNumber);
}
```

## Retrieve a range of entities in a partition
If you don't want to query all entities in a partition, you can specify a range by combining the partition key filter with a row key filter. The following code example uses two filters to get all entities in partition 'Smith' where the row key (first name) starts with a letter before 'E' in the alphabet, then prints the query results.

```csharp
// Retrieve the storage account from the connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the table client.
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Create the CloudTable object that represents the "people" table.
CloudTable table = tableClient.GetTableReference("people");

// Create the table query.
TableQuery<CustomerEntity> rangeQuery = new TableQuery<CustomerEntity>().Where(
    TableQuery.CombineFilters(
        TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "Smith"),
        TableOperators.And,
        TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.LessThan, "E")));

// Loop through the results, displaying information about the entity.
foreach (CustomerEntity entity in table.ExecuteQuery(rangeQuery))
{
    Console.WriteLine("{0}, {1}\t{2}\t{3}", entity.PartitionKey, entity.RowKey,
        entity.Email, entity.PhoneNumber);
}
```

## Retrieve a single entity
You can write a query to retrieve a single, specific entity. The following code uses [TableOperation][dotnet_TableOperation] to specify the customer 'Ben Smith'. This method returns just one entity rather than a collection, and the returned value in [TableResult][dotnet_TableResult].[Result][dotnet_TableResult_Result] is a **CustomerEntity** object. Specifying both partition and row keys in a query is the fastest way to retrieve a single entity from the Table service.

```csharp
// Retrieve the storage account from the connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the table client.
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Create the CloudTable object that represents the "people" table.
CloudTable table = tableClient.GetTableReference("people");

// Create a retrieve operation that takes a customer entity.
TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

// Execute the retrieve operation.
TableResult retrievedResult = table.Execute(retrieveOperation);

// Print the phone number of the result.
if (retrievedResult.Result != null)
{
    Console.WriteLine(((CustomerEntity)retrievedResult.Result).PhoneNumber);
}
else
{
    Console.WriteLine("The phone number could not be retrieved.");
}
```

## Replace an entity
To update an entity, retrieve it from the Table service, modify the entity object, and then save the changes back to the Table service. The following code changes an existing customer's phone number. Instead of calling [Insert][dotnet_TableOperation_Insert], this code uses [Replace][dotnet_TableOperation_Replace]. [Replace][dotnet_TableOperation_Replace] causes the entity to be fully replaced on the server, unless the entity on the server has changed since it was retrieved, in which case the operation will fail. This failure is to prevent your application from inadvertently overwriting a change made between the retrieval and update by another component of your application. The proper handling of this failure is to retrieve the entity again, make your changes (if still valid), and then perform another [Replace][dotnet_TableOperation_Replace] operation. The next section will show you how to override this behavior.

```csharp
// Retrieve the storage account from the connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the table client.
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Create the CloudTable object that represents the "people" table.
CloudTable table = tableClient.GetTableReference("people");

// Create a retrieve operation that takes a customer entity.
TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

// Execute the operation.
TableResult retrievedResult = table.Execute(retrieveOperation);

// Assign the result to a CustomerEntity object.
CustomerEntity updateEntity = (CustomerEntity)retrievedResult.Result;

if (updateEntity != null)
{
    // Change the phone number.
    updateEntity.PhoneNumber = "425-555-0105";

    // Create the Replace TableOperation.
    TableOperation updateOperation = TableOperation.Replace(updateEntity);

    // Execute the operation.
    table.Execute(updateOperation);

    Console.WriteLine("Entity updated.");
}
else
{
    Console.WriteLine("Entity could not be retrieved.");
}
```

## Insert-or-replace an entity
[Replace][dotnet_TableOperation_Replace] operations will fail if the entity has been changed since it was retrieved from the server. Furthermore, you must retrieve the entity from the server first in order for the [Replace][dotnet_TableOperation_Replace] operation to be successful. Sometimes, however, you don't know if the entity exists on the server and the current values stored in it are irrelevant. Your update should overwrite them all. To accomplish this, you would use an [InsertOrReplace][dotnet_TableOperation_InsertOrReplace] operation. This operation inserts the entity if it doesn't exist, or replaces it if it does, regardless of when the last update was made.

In the following code example, a customer entity for 'Fred Jones' is created and inserted into the 'people' table. Next, we use the [InsertOrReplace][dotnet_TableOperation_InsertOrReplace] operation to save an entity with the same partition key (Jones) and row key (Fred) to the server, this time with a different value for the PhoneNumber property. Because we use [InsertOrReplace][dotnet_TableOperation_InsertOrReplace], all of its property values are replaced. However, if a 'Fred Jones' entity hadn't already existed in the table, it would have been inserted.

```csharp
// Retrieve the storage account from the connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the table client.
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Create the CloudTable object that represents the "people" table.
CloudTable table = tableClient.GetTableReference("people");

// Create a customer entity.
CustomerEntity customer3 = new CustomerEntity("Jones", "Fred");
customer3.Email = "Fred@contoso.com";
customer3.PhoneNumber = "425-555-0106";

// Create the TableOperation object that inserts the customer entity.
TableOperation insertOperation = TableOperation.Insert(customer3);

// Execute the operation.
table.Execute(insertOperation);

// Create another customer entity with the same partition key and row key.
// We've already created a 'Fred Jones' entity and saved it to the
// 'people' table, but here we're specifying a different value for the
// PhoneNumber property.
CustomerEntity customer4 = new CustomerEntity("Jones", "Fred");
customer4.Email = "Fred@contoso.com";
customer4.PhoneNumber = "425-555-0107";

// Create the InsertOrReplace TableOperation.
TableOperation insertOrReplaceOperation = TableOperation.InsertOrReplace(customer4);

// Execute the operation. Because a 'Fred Jones' entity already exists in the
// 'people' table, its property values will be overwritten by those in this
// CustomerEntity. If 'Fred Jones' didn't already exist, the entity would be
// added to the table.
table.Execute(insertOrReplaceOperation);
```

## Query a subset of entity properties
A table query can retrieve just a few properties from an entity instead of all the entity properties. This technique, called projection, reduces bandwidth and can improve query performance, especially for large entities. The query in the following code returns only the email addresses of entities in the table. This is done by using a query of [DynamicTableEntity][dotnet_DynamicTableEntity] and also [EntityResolver][dotnet_EntityResolver]. You can learn more about projection in the [Introducing Upsert and Query Projection blog post][blog_post_upsert]. Projection is not supported by the storage emulator, so this code runs only when you're using an account in the Table service.

```csharp
// Retrieve the storage account from the connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the table client.
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Create the CloudTable that represents the "people" table.
CloudTable table = tableClient.GetTableReference("people");

// Define the query, and select only the Email property.
TableQuery<DynamicTableEntity> projectionQuery = new TableQuery<DynamicTableEntity>().Select(new string[] { "Email" });

// Define an entity resolver to work with the entity after retrieval.
EntityResolver<string> resolver = (pk, rk, ts, props, etag) => props.ContainsKey("Email") ? props["Email"].StringValue : null;

foreach (string projectedEmail in table.ExecuteQuery(projectionQuery, resolver, null, null))
{
    Console.WriteLine(projectedEmail);
}
```

## Delete an entity
You can easily delete an entity after you have retrieved it by using the same pattern shown for updating an entity. The following code retrieves and deletes a customer entity.

```csharp
// Retrieve the storage account from the connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the table client.
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Create the CloudTable that represents the "people" table.
CloudTable table = tableClient.GetTableReference("people");

// Create a retrieve operation that expects a customer entity.
TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

// Execute the operation.
TableResult retrievedResult = table.Execute(retrieveOperation);

// Assign the result to a CustomerEntity.
CustomerEntity deleteEntity = (CustomerEntity)retrievedResult.Result;

// Create the Delete TableOperation.
if (deleteEntity != null)
{
    TableOperation deleteOperation = TableOperation.Delete(deleteEntity);

    // Execute the operation.
    table.Execute(deleteOperation);

    Console.WriteLine("Entity deleted.");
}
else
{
    Console.WriteLine("Could not retrieve the entity.");
}
```

## Delete a table
Finally, the following code example deletes a table from a storage account. A table that has been deleted will be unavailable to be re-created for a period of time following the deletion.

```csharp
// Retrieve the storage account from the connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the table client.
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

// Create the CloudTable that represents the "people" table.
CloudTable table = tableClient.GetTableReference("people");

// Delete the table it if exists.
table.DeleteIfExists();
```

## Next steps
Now that you've learned the basics of Table storage, follow these links to learn about more complex storage tasks:

* See more Table storage samples in [Getting Started with Azure Table Storage in .NET](https://azure.microsoft.com/documentation/samples/storage-table-dotnet-getting-started/)
* View the Table service reference documentation for complete details about available APIs:
  * [Storage Client Library for .NET reference](http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409)