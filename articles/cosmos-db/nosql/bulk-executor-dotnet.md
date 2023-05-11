---
title: Use bulk executor .NET library in Azure Cosmos DB for bulk import and update operations
description: Learn how to bulk import and update the Azure Cosmos DB documents using the bulk executor .NET library.
author: abinav2307
ms.author: abramees
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: how-to
ms.date: 03/15/2023
ms.reviewer: mjbrown
ms.custom: devx-track-csharp, ignite-2022
---

# Use the bulk executor .NET library to perform bulk operations in Azure Cosmos DB

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!NOTE]
> The bulk executor library described in this article is maintained for applications that use the .NET SDK 2.x version. For new applications, you can use the **bulk support** that's directly available with the [.NET SDK version 3.x](tutorial-dotnet-bulk-import.md), and it doesn't require any external library.
>
> If you currently use the bulk executor library and plan to migrate to bulk support on the newer SDK, use the steps in the [Migration guide](how-to-migrate-from-bulk-executor-library.md) to migrate your application.

This tutorial provides instructions on how to use the bulk executor .NET library to import and update documents to an Azure Cosmos DB container. To learn about the bulk executor library and how it helps you use massive throughput and storage, see the [Azure Cosmos DB bulk executor library overview](../bulk-executor-overview.md). In this tutorial, you see a sample .NET application where bulk imports randomly generated documents into an Azure Cosmos DB container. After you import the data, the library shows you how you can bulk update the imported data by specifying patches as operations to perform on specific document fields.

Currently, bulk executor library is supported by the Azure Cosmos DB for NoSQL and API for Gremlin accounts only. This article describes how to use the bulk executor .NET library with API for NoSQL accounts. To learn how to use the bulk executor .NET library with API for Gremlin accounts, see [Ingest data in bulk in the Azure Cosmos DB for Gremlin by using a bulk executor library](../gremlin/bulk-executor-dotnet.md).

## Prerequisites

* Latest [!INCLUDE [cosmos-db-visual-studio](../includes/cosmos-db-visual-studio.md)]

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* You can [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription. You can also [Install and use the Azure Cosmos DB Emulator for local development and testing](../local-emulator.md) with the `https://localhost:8081` endpoint. The Primary Key is provided in [Authenticating requests](../local-emulator.md#authenticate-requests).

* Create an Azure Cosmos DB for NoSQL account by using the steps described in the [Create an Azure Cosmos DB account](quickstart-dotnet.md#create-account) section of [Quickstart: Azure Cosmos DB for NoSQL client library for .NET](quickstart-dotnet.md).

## Clone the sample application

Now let's switch to working with code by downloading a sample .NET application from GitHub. This application performs bulk operations on the data stored in your Azure Cosmos DB account. To clone the application, open a command prompt, navigate to the directory where you want to copy it, and run the following command:

```bash
git clone https://github.com/Azure/azure-cosmosdb-bulkexecutor-dotnet-getting-started.git
```

The cloned repository contains two samples, *BulkImportSample* and *BulkUpdateSample*. You can open either of the sample applications, update the connection strings in *App.config* file with your Azure Cosmos DB account's connection strings, build the solution, and run it.

The *BulkImportSample* application generates random documents and bulk imports them to your Azure Cosmos DB account. The *BulkUpdateSample* application bulk updates the imported documents by specifying patches as operations to perform on specific document fields. In the next sections, you'll review the code in each of these sample apps.

## <a id="bulk-import-data-to-an-azure-cosmos-account"></a>Bulk import data to an Azure Cosmos DB account

1. Navigate to the *BulkImportSample* folder and open the *BulkImportSample.sln* file.

1. The Azure Cosmos DB's connection strings are retrieved from the App.config file as shown in the following code:

   ```csharp
   private static readonly string EndpointUrl = ConfigurationManager.AppSettings["EndPointUrl"];
   private static readonly string AuthorizationKey = ConfigurationManager.AppSettings["AuthorizationKey"];
   private static readonly string DatabaseName = ConfigurationManager.AppSettings["DatabaseName"];
   private static readonly string CollectionName = ConfigurationManager.AppSettings["CollectionName"];
   private static readonly int CollectionThroughput = int.Parse(ConfigurationManager.AppSettings["CollectionThroughput"]);
   ```

   The bulk importer creates a new database and a container with the database name, container name, and the throughput values specified in the App.config file.

1. Next, the *DocumentClient* object is initialized with Direct TCP connection mode:

   ```csharp
   ConnectionPolicy connectionPolicy = new ConnectionPolicy
   {
      ConnectionMode = ConnectionMode.Direct,
      ConnectionProtocol = Protocol.Tcp
   };
   DocumentClient client = new DocumentClient(new Uri(endpointUrl),authorizationKey,
   connectionPolicy)
   ```

1. The *BulkExecutor* object is initialized with a high retry value for wait time and throttled requests. Then they're set to 0 to pass congestion control to *BulkExecutor* for its lifetime.

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

1. The application invokes the *BulkImportAsync* API. The .NET library provides two overloads of the bulk import API&mdash;one that accepts a list of serialized JSON documents and the other that accepts a list of deserialized POCO documents. To learn more about the definitions of each of these overloaded methods, refer to the [API documentation](/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.bulkexecutor.bulkimportasync).

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

   |**Parameter** |**Description** |
   |---------|---------|
   |*enableUpsert*    |   A flag to enable upsert operations on the documents. If a document with the given ID already exists, it's updated. By default, it's set to false.      |
   |*disableAutomaticIdGeneration*    |    A flag to disable automatic generation of ID. By default, it's set to true.     |
   |*maxConcurrencyPerPartitionKeyRange*    | The maximum degree of concurrency per partition key range. Setting to null causes the library to use a default value of 20. |
   |*maxInMemorySortingBatchSize*     |  The maximum number of documents that are pulled from the document enumerator, which is passed to the API call in each stage. For the in-memory sorting phase that happens before bulk importing. Setting this parameter to null causes the library to use default minimum value (documents.count, 1000000).       |
   |*cancellationToken*    |    The cancellation token to gracefully exit the bulk import operation.     |

**Bulk import response object definition**<br>
The result of the bulk import API call contains the following attributes:

   |**Parameter** |**Description** |
   |---------|---------|
   |*NumberOfDocumentsImported* (long)   |  The total number of documents that were successfully imported out of the total documents supplied to the bulk import API call.       |
   |*TotalRequestUnitsConsumed* (double)   |   The total request units (RU) consumed by the bulk import API call.      |
   |*TotalTimeTaken* (TimeSpan)    |   The total time taken by the bulk import API call to complete the execution.      |
   |*BadInputDocuments* (List\<object>)   |     The list of bad-format documents that weren't successfully imported in the bulk import API call. Fix the documents returned and retry import. Bad-formatted documents include documents whose ID value isn't a string (null or any other datatype is considered invalid).    |

## Bulk update data in your Azure Cosmos DB account

You can update existing documents by using the *BulkUpdateAsync* API. In this example, you set the `Name` field to a new value and remove the `Description` field from the existing documents. For the full set of supported update operations, refer to the [API documentation](/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.bulkupdate).

1. Navigate to the *BulkUpdateSample* folder and open the *BulkUpdateSample.sln* file.

1. Define the update items along with the corresponding field update operations. In this example, you use *SetUpdateOperation* to update the `Name` field and *UnsetUpdateOperation* to remove the `Description` field from all the documents. You can also perform other operations like incrementing a document field by a specific value, pushing specific values into an array field, or removing a specific value from an array field. To learn about different methods provided by the bulk update API, refer to the [API documentation](/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.bulkupdate).

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

1. The application invokes the *BulkUpdateAsync* API. To learn about the definition of the *BulkUpdateAsync* method, refer to the [API documentation](/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.ibulkexecutor.bulkupdateasync).

   ```csharp
   BulkUpdateResponse bulkUpdateResponse = await bulkExecutor.BulkUpdateAsync(
     updateItems: updateItems,
     maxConcurrencyPerPartitionKeyRange: null,
     maxInMemorySortingBatchSize: null,
     cancellationToken: token);
   ```  
   **BulkUpdateAsync method accepts the following parameters:**

   |**Parameter** |**Description** |
   |---------|---------|
   |*maxConcurrencyPerPartitionKeyRange*    |   The maximum degree of concurrency per partition key range. Setting this parameter to null makes the library use the default value(20).   |
   |*maxInMemorySortingBatchSize*    |    The maximum number of update items pulled from the update items enumerator passed to the API call in each stage. For the in-memory sorting phase that happens before bulk updating. Setting this parameter to null causes the library use the default minimum value(updateItems.count, 1000000).     |
   |*cancellationToken*|The cancellation token to gracefully exit the bulk update operation. |

**Bulk update response object definition**<br>
The result of the bulk update API call contains the following attributes:

   |**Parameter** |**Description** |
   |---------|---------|
   |*NumberOfDocumentsUpdated* (long)    |   The number of documents that were successfully updated out of the total documents supplied to the bulk update API call.      |
   |*TotalRequestUnitsConsumed* (double)   |    The total request units (RUs) consumed by the bulk update API call.    |
   |*TotalTimeTaken* (TimeSpan)   | The total time taken by the bulk update API call to complete the execution. |

## Performance tips

Consider the following points for better performance when you use the bulk executor library:

* For best performance, run your application from an Azure virtual machine that's in the same region as your Azure Cosmos DB account's write region.

* It's recommended that you instantiate a single *BulkExecutor* object for the whole application within a single virtual machine that corresponds to a specific Azure Cosmos DB container.

* A single bulk operation API execution consumes a large chunk of the client machine's CPU and network IO when spawning multiple tasks internally. Avoid spawning multiple concurrent tasks within your application process that execute bulk operation API calls. If a single bulk operation API call that's running on a single virtual machine is unable to consume the entire container's throughput (if your container's throughput > 1 million RU/s), it's preferred to create separate virtual machines to concurrently execute the bulk operation API calls.

* Ensure the `InitializeAsync()` method is invoked after instantiating a BulkExecutor object to fetch the target Azure Cosmos DB container's partition map.

* In your application's App.Config, ensure **gcServer** is enabled for better performance
  ```xml  
  <runtime>
    <gcServer enabled="true" />
  </runtime>
  ```
* The library emits traces that can be collected either into a log file or on the console. To enable both, add the following code to your application's *App.Config* file:

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

* [.NET bulk executor library: Download information (Legacy)](sdk-dotnet-bulk-executor-v2.md).
