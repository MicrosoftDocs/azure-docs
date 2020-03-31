---
title: Use bulk executor .NET library in Azure Cosmos DB for bulk import and update operations
description: Bulk import and update the Azure Cosmos DB documents using the bulk executor .NET library.
author: tknandu
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 03/23/2020
ms.author: ramkris
ms.reviewer: sngun
---

# Use the bulk executor .NET library to perform bulk operations in Azure Cosmos DB

> [!NOTE]
> This bulk executor library described in this article is maintained for applications using the .NET SDK 2.x version. For new applications, you can use the **bulk support** that is directly available with the [.NET SDK version 3.x](tutorial-sql-api-dotnet-bulk-import.md) and it does not require any external library. 

> If you are currently using the bulk executor library and planning to migrate to bulk support on the newer SDK, use the steps in the [Migration guide](how-to-migrate-from-bulk-executor-library.md) to migrate your application.

This tutorial provides instructions on using the bulk executor .NET library to import and update documents to an Azure Cosmos container. To learn about the bulk executor library and how it helps you leverage massive throughput and storage, see the [bulk executor library overview](bulk-executor-overview.md) article. In this tutorial, you will see a sample .NET application that bulk imports randomly generated documents into an Azure Cosmos container. After importing, it shows you how you can bulk update the imported data by specifying patches as operations to perform on specific document fields.

Currently, bulk executor library is supported by the Azure Cosmos DB SQL API and Gremlin API accounts only. This article describes how to use the bulk executor .NET library with SQL API accounts. To learn about using the bulk executor .NET library with Gremlin API accounts, see [perform bulk operations in the Azure Cosmos DB Gremlin API](bulk-executor-graph-dotnet.md).

## Prerequisites

* If you don't already have Visual Studio 2019 installed, you can download and use the [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable "Azure development" during the Visual Studio setup.

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* You can [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments. Or, you can use the [Azure Cosmos DB emulator](https://docs.microsoft.com/azure/cosmos-db/local-emulator) with the `https://localhost:8081` endpoint. The Primary Key is provided in [Authenticating requests](local-emulator.md#authenticating-requests).

* Create an Azure Cosmos DB SQL API account by using the steps described in [create database account](create-sql-api-dotnet.md#create-account) section of the .NET quickstart article.

## Clone the sample application

Now let's switch to working with code by downloading a sample .NET application from GitHub. This application performs bulk operations on the data stored in your Azure Cosmos account. To clone the application, open a command prompt, navigate to the directory where you want to copy it and run the following command:

```
git clone https://github.com/Azure/azure-cosmosdb-bulkexecutor-dotnet-getting-started.git
```

The cloned repository contains two samples "BulkImportSample" and "BulkUpdateSample". You can open either of the sample applications, update the connection strings in App.config file with your Azure Cosmos DB account's connection strings, build the solution, and run it.

The "BulkImportSample" application generates random documents and bulk imports them to your Azure Cosmos account. The "BulkUpdateSample" application bulk updates the imported documents by specifying patches as operations to perform on specific document fields. In the next sections, you will review the code in each of these sample apps.

## Bulk import data to an Azure Cosmos account

1. Navigate to the "BulkImportSample" folder and open the "BulkImportSample.sln" file.  

2. The Azure Cosmos DB's connection strings are retrieved from the App.config file as shown in the following code:  

   ```csharp
   private static readonly string EndpointUrl = ConfigurationManager.AppSettings["EndPointUrl"];
   private static readonly string AuthorizationKey = ConfigurationManager.AppSettings["AuthorizationKey"];
   private static readonly string DatabaseName = ConfigurationManager.AppSettings["DatabaseName"];
   private static readonly string CollectionName = ConfigurationManager.AppSettings["CollectionName"];
   private static readonly int CollectionThroughput = int.Parse(ConfigurationManager.AppSettings["CollectionThroughput"]);
   ```

   The bulk importer creates a new database and a container with the database name, container name, and the throughput values specified in the App.config file.

3. Next the DocumentClient object is initialized with Direct TCP connection mode:  

   ```csharp
   ConnectionPolicy connectionPolicy = new ConnectionPolicy
   {
      ConnectionMode = ConnectionMode.Direct,
      ConnectionProtocol = Protocol.Tcp
   };
   DocumentClient client = new DocumentClient(new Uri(endpointUrl),authorizationKey,
   connectionPolicy)
   ```

4. The BulkExecutor object is initialized with a high retry value for wait time and throttled requests. And then they are set to 0 to pass congestion control to BulkExecutor for its lifetime.  

   ```csharp
   // Set retry options high during initialization (default values).
   client.ConnectionPolicy.RetryOptions.MaxRetryWaitTimeInSeconds = 30;
   client.ConnectionPolicy.RetryOptions.MaxRetryAttemptsOnThrottledRequests = 9;

   IBulkExecutor bulkExecutor = new BulkExecutor(client, dataCollection);
   await bulkExecutor.InitializeAsync();

   // Set retries to 0 to pass complete control to bulk executor.
   client.ConnectionPolicy.RetryOptions.MaxRetryWaitTimeInSeconds = 0;
   client.ConnectionPolicy.RetryOptions.MaxRetryAttemptsOnThrottledRequests = 0;
   ```

5. The application invokes the BulkImportAsync API. The .NET library provides two overloads of the bulk import API - one that accepts a list of serialized JSON documents and the other that accepts a list of deserialized POCO documents. To learn more about the definitions of each of these overloaded methods, refer to the [API documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.bulkexecutor.bulkimportasync?view=azure-dotnet).

   ```csharp
   BulkImportResponse bulkImportResponse = await bulkExecutor.BulkImportAsync(
     documents: documentsToImportInBatch,
     enableUpsert: true,
     disableAutomaticIdGeneration: true,
     maxConcurrencyPerPartitionKeyRange: null,
     maxInMemorySortingBatchSize: null,
     cancellationToken: token);
   ```
   **BulkImportAsync method accepts the following parameters:**
   
   |**Parameter**  |**Description** |
   |---------|---------|
   |enableUpsert    |   A flag to enable upsert operations on the documents. If a document with the given ID already exists, it's updated. By default, it is set to false.      |
   |disableAutomaticIdGeneration    |    A flag to disable automatic generation of ID. By default, it is set to true.     |
   |maxConcurrencyPerPartitionKeyRange    | The maximum degree of concurrency per partition key range, setting to null will cause library to use a default value of 20. |
   |maxInMemorySortingBatchSize     |  The maximum number of documents that are pulled from the document enumerator, which is passed to the API call in each stage. For in-memory sorting phase that happens before bulk importing, setting this parameter to null will cause library to use default minimum value (documents.count, 1000000).       |
   |cancellationToken    |    The cancellation token to gracefully exit the bulk import operation.     |

   **Bulk import response object definition**
   The result of the bulk import API call contains the following attributes:

   |**Parameter**  |**Description**  |
   |---------|---------|
   |NumberOfDocumentsImported (long)   |  The total number of documents that were successfully imported out of the total documents supplied to the bulk import API call.       |
   |TotalRequestUnitsConsumed (double)   |   The total request units (RU) consumed by the bulk import API call.      |
   |TotalTimeTaken (TimeSpan)    |   The total time taken by the bulk import API call to complete the execution.      |
   |BadInputDocuments (List\<object>)   |     The list of bad-format documents that were not successfully imported in the bulk import API call. Fix the documents returned and retry import. Bad-formatted documents include documents whose ID value is not a string (null or any other datatype is considered invalid).    |

## Bulk update data in your Azure Cosmos account

You can update existing documents by using the BulkUpdateAsync API. In this example, you will set the `Name` field to a new value and remove the `Description` field from the existing documents. For the full set of supported update operations, refer to the [API documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.bulkupdate?view=azure-dotnet).

1. Navigate to the "BulkUpdateSample" folder and open the "BulkUpdateSample.sln" file.  

2. Define the update items along with the corresponding field update operations. In this example, you will use `SetUpdateOperation` to update the `Name` field and `UnsetUpdateOperation` to remove the `Description` field from all the documents. You can also perform other operations like increment a document field by a specific value, push specific values into an array field, or remove a specific value from an array field. To learn about different methods provided by the bulk update API, refer to the [API documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.bulkupdate?view=azure-dotnet).

   ```csharp
   SetUpdateOperation<string> nameUpdate = new SetUpdateOperation<string>("Name", "UpdatedDoc");
   UnsetUpdateOperation descriptionUpdate = new UnsetUpdateOperation("description");

   List<UpdateOperation> updateOperations = new List<UpdateOperation>();
   updateOperations.Add(nameUpdate);
   updateOperations.Add(descriptionUpdate);

   List<UpdateItem> updateItems = new List<UpdateItem>();
   for (int i = 0; i < 10; i++)
   {
    updateItems.Add(new UpdateItem(i.ToString(), i.ToString(), updateOperations));
   }
   ```

3. The application invokes the BulkUpdateAsync API. To learn about the definition of the BulkUpdateAsync method, refer to the [API documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.ibulkexecutor.bulkupdateasync?view=azure-dotnet).  

   ```csharp
   BulkUpdateResponse bulkUpdateResponse = await bulkExecutor.BulkUpdateAsync(
     updateItems: updateItems,
     maxConcurrencyPerPartitionKeyRange: null,
     maxInMemorySortingBatchSize: null,
     cancellationToken: token);
   ```  
   **BulkUpdateAsync method accepts the following parameters:**

   |**Parameter**  |**Description** |
   |---------|---------|
   |maxConcurrencyPerPartitionKeyRange    |   The maximum degree of concurrency per partition key range, setting this parameter to null will make the library to use the default value(20).   |
   |maxInMemorySortingBatchSize    |    The maximum number of update items pulled from the update items enumerator passed to the API call in each stage. For the in-memory sorting phase that happens before bulk updating, setting this parameter to null will cause the library to use the default minimum value(updateItems.count, 1000000).     |
   | cancellationToken|The cancellation token to gracefully exit the bulk update operation. |

   **Bulk update response object definition**
   The result of the bulk update API call contains the following attributes:

   |**Parameter**  |**Description** |
   |---------|---------|
   |NumberOfDocumentsUpdated (long)    |   The number of documents that were successfully updated out of the total documents supplied to the bulk update API call.      |
   |TotalRequestUnitsConsumed (double)   |    The total request units (RUs) consumed by the bulk update API call.    |
   |TotalTimeTaken (TimeSpan)   | The total time taken by the bulk update API call to complete the execution. |
    
## Performance tips 

Consider the following points for better performance when using the bulk executor library:

* For best performance, run your application from an Azure virtual machine that is in the same region as your Azure Cosmos account's write region.  

* It is recommended that you instantiate a single `BulkExecutor` object for the whole application within a single virtual machine that corresponds to a specific Azure Cosmos container.  

* Since a single bulk operation API execution consumes a large chunk of the client machine's CPU and network IO (This happens by spawning multiple tasks internally). Avoid spawning multiple concurrent tasks within your application process that execute bulk operation API calls. If a single bulk operation API call that is running on a single virtual machine is unable to consume the entire container's throughput (if your container's throughput > 1 million RU/s), it's preferred to create separate virtual machines to concurrently execute the bulk operation API calls.  

* Ensure the `InitializeAsync()` method is invoked after instantiating a BulkExecutor object to fetch the target Cosmos container's partition map.  

* In your application's App.Config, ensure **gcServer** is enabled for better performance
  ```xml  
  <runtime>
    <gcServer enabled="true" />
  </runtime>
  ```
* The library emits traces that can be collected either into a log file or on the console. To enable both, add the following code to your application's App.Config file.

  ```xml
  <system.diagnostics>
    <trace autoflush="false" indentsize="4">
      <listeners>
        <add name="logListener" type="System.Diagnostics.TextWriterTraceListener" initializeData="application.log" />
        <add name="consoleListener" type="System.Diagnostics.ConsoleTraceListener" />
      </listeners>
    </trace>
  </system.diagnostics>
  ```

## Next steps

* To learn about the Nuget package details and the release notes, see the [bulk executor SDK details](sql-api-sdk-bulk-executor-dot-net.md).
