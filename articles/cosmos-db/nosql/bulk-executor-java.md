---
title: Use bulk executor Java library in Azure Cosmos DB to perform bulk import and update operations
description: Bulk import and update Azure Cosmos DB documents using bulk executor Java library
author: TheovanKraay
ms.author: thvankra
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: how-to
ms.date: 03/07/2022
ms.reviewer: mjbrown
ms.custom: devx-track-java, devx-track-extended-java
---

# Perform bulk operations on Azure Cosmos DB data
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This tutorial provides instructions on performing bulk operations in the [Azure Cosmos DB Java V4 SDK](sdk-java-v4.md). This version of the SDK comes with the bulk executor library built-in. If you're using an older version of Java SDK, it's recommended to [migrate to the latest version](migrate-java-v4-sdk.md). Azure Cosmos DB Java V4 SDK is the current recommended solution for Java bulk support. 

Currently, the bulk executor library is supported only by Azure Cosmos DB for NoSQL and API for Gremlin accounts. To learn about using bulk executor .NET library with API for Gremlin, see [perform bulk operations in Azure Cosmos DB for Gremlin](../gremlin/bulk-executor-dotnet.md).


## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.  

* You can [try Azure Cosmos DB for free](../try-free.md) without an Azure subscription, free of charge and commitments. Or, you can use the [Azure Cosmos DB Emulator](../emulator.md) with  the `https://localhost:8081` endpoint. The Primary Key is provided in [Authenticating requests](../emulator.md).  

* [Java Development Kit (JDK) 1.8+](/java/azure/jdk/)  
  - On Ubuntu, run `apt-get install default-jdk` to install the JDK.  

  - Be sure to set the JAVA_HOME environment variable to point to the folder where the JDK is installed.

* [Download](https://maven.apache.org/download.cgi) and [install](https://maven.apache.org/install.html) a [Maven](https://maven.apache.org/) binary archive  
  
  - On Ubuntu, you can run `apt-get install maven` to install Maven.

* Create an Azure Cosmos DB for NoSQL account by using the steps described in the [create database account](quickstart-java.md#create-a-database-account) section of the Java quickstart article.

## Clone the sample application

Now let's switch to working with code by downloading a generic samples repository for Java V4 SDK for Azure Cosmos DB from GitHub. These sample applications perform CRUD operations and other common operations on Azure Cosmos DB. To clone the repository, open a command prompt, navigate to the directory where you want to copy the application and run the following command:

```bash
 git clone https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples 
```

The cloned repository contains a sample `SampleBulkQuickStartAsync.java` in the `/azure-cosmos-java-sql-api-samples/tree/main/src/main/java/com/azure/cosmos/examples/bulk/async` folder. The application generates documents and executes operations to bulk create, upsert, replace and delete items in Azure Cosmos DB. In the next sections, we will review the code in the sample app. 

## Bulk execution in Azure Cosmos DB

1. The Azure Cosmos DB's connection strings are read as arguments and assigned to variables defined in /`examples/common/AccountSettings.java` file. These environment variables must be set

```
ACCOUNT_HOST=your account hostname;ACCOUNT_KEY=your account primary key
```

To run the bulk sample, specify its Main Class: 

```
com.azure.cosmos.examples.bulk.async.SampleBulkQuickStartAsync
```

2. The `CosmosAsyncClient` object is initialized by using the following statements:  

    [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=CreateAsyncClient)]


3. The sample creates an async database and container. It then creates multiple documents on which bulk operations will be executed. It adds these documents to a `Flux<Family>` reactive stream object:

    [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=AddDocsToStream)]


4. The sample contains methods for bulk create, upsert, replace, and delete. In each method we map the families documents in the BulkWriter `Flux<Family>` stream to multiple method calls in `CosmosBulkOperations`. These operations are added to another reactive stream object `Flux<CosmosItemOperation>`. The stream is then passed to the `executeBulkOperations` method of the async `container` we created at the beginning, and operations are executed in bulk. See bulk create method below as an example:

    [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkCreateItems)]


5. There's also a class `BulkWriter.java` in the same directory as the sample application. This class demonstrates how to handle rate limiting (429) and timeout (408) errors that may occur during bulk execution, and retrying those operations effectively. It is implemented in the below methods, also showing how to implement local and global throughput control.

    [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkWriterAbstraction)]


6. Additionally, there are bulk create methods in the sample, which illustrate how to add response processing, and set execution options:

    [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkCreateItemsWithResponseProcessingAndExecutionOptions)]


   <!-- The importAll method accepts the following parameters:
 
   |**Parameter**  |**Description**  |
   |---------|---------|
   |isUpsert    |   A flag to enable upsert of the documents. If a document with given ID already exists, it's updated.  |
   |disableAutomaticIdGeneration     |   A flag to disable automatic generation of ID. By default, it is set to true.   |
   |maxConcurrencyPerPartitionRange    |  The maximum degree of concurrency per partition key range. The default value is 20.  |

   **Bulk import response object definition**
   The result of the bulk import API call contains the following get methods:

   |**Parameter**  |**Description**  |
   |---------|---------|
   |int getNumberOfDocumentsImported()  |   The total number of documents that were successfully imported out of the documents supplied to the bulk import API call.      |
   |double getTotalRequestUnitsConsumed()   |  The total request units (RU) consumed by the bulk import API call.       |
   |Duration getTotalTimeTaken()   |    The total time taken by the bulk import API call to complete execution.     |
   |List\<Exception> getErrors() |  Gets the list of errors if some documents out of the batch supplied to the bulk import API call failed to get inserted.       |
   |List\<Object> getBadInputDocuments()  |    The list of bad-format documents that were not successfully imported in the bulk import API call. User should fix the documents returned and retry import. Bad-formatted documents include documents whose ID value is not a string (null or any other datatype is considered invalid).     |

<!-- 5. After you have the bulk import application ready, build the command-line tool from source by using the 'mvn clean package' command. This command generates a jar file in the target folder:  

   ```bash
   mvn clean package
   ```

6. After the target dependencies are generated, you can invoke the bulk importer application by using the following command:  

   ```bash
   java -Xmx12G -jar bulkexecutor-sample-1.0-SNAPSHOT-jar-with-dependencies.jar -serviceEndpoint *<Fill in your Azure Cosmos DB's endpoint>*  -masterKey *<Fill in your Azure Cosmos DB's primary key>* -databaseId bulkImportDb -collectionId bulkImportColl -operation import -shouldCreateCollection -collectionThroughput 1000000 -partitionKey /profileid -maxConnectionPoolSize 6000 -numberOfDocumentsForEachCheckpoint 1000000 -numberOfCheckpoints 10
   ```

   The bulk importer creates a new database and a collection with the database name, collection name, and throughput values specified in the App.config file. 

## Bulk update data in Azure Cosmos DB

You can update existing documents by using the BulkUpdateAsync API. In this example, you will set the Name field to a new value and remove the Description field from the existing documents. For the full set of supported field update operations, see [API documentation](/java/api/com.microsoft.azure.documentdb.bulkexecutor). 

1. Defines the update items along with corresponding field update operations. In this example, you will use SetUpdateOperation to update the Name field and UnsetUpdateOperation to remove the Description field from all the documents. You can also perform other operations like increment a document field by a specific value, push specific values into an array field, or remove a specific value from an array field. To learn about different methods provided by the bulk update API, see the [API documentation](/java/api/com.microsoft.azure.documentdb.bulkexecutor).  

   ```java
   SetUpdateOperation<String> nameUpdate = new SetUpdateOperation<>("Name","UpdatedDocValue");
   UnsetUpdateOperation descriptionUpdate = new UnsetUpdateOperation("description");

   ArrayList<UpdateOperationBase> updateOperations = new ArrayList<>();
   updateOperations.add(nameUpdate);
   updateOperations.add(descriptionUpdate);

   List<UpdateItem> updateItems = new ArrayList<>(cfg.getNumberOfDocumentsForEachCheckpoint());
   IntStream.range(0, cfg.getNumberOfDocumentsForEachCheckpoint()).mapToObj(j -> {                        
    return new UpdateItem(Long.toString(prefix + j), Long.toString(prefix + j), updateOperations);
    }).collect(Collectors.toCollection(() -> updateItems));
   ```

2. Call the updateAll API that generates random documents to be then bulk imported into an Azure Cosmos DB container. You can configure the command-line configurations to be passed in CmdLineConfiguration.java file.

   ```java
   BulkUpdateResponse bulkUpdateResponse = bulkExecutor.updateAll(updateItems, null)
   ```

   The bulk update API accepts a collection of items to be updated. Each update item specifies the list of field update operations to be performed on a document identified by an ID and a partition key value. for more information, see the [API documentation](/java/api/com.microsoft.azure.documentdb.bulkexecutor):

   ```java
   public BulkUpdateResponse updateAll(
        Collection<UpdateItem> updateItems,
        Integer maxConcurrencyPerPartitionRange) throws DocumentClientException;
   ```

   The updateAll method accepts the following parameters:

   |**Parameter** |**Description** |
   |---------|---------|
   |maxConcurrencyPerPartitionRange   |  The maximum degree of concurrency per partition key range. The default value is 20.  |
 
   **Bulk import response object definition**
   The result of the bulk import API call contains the following get methods:

   |**Parameter** |**Description**  |
   |---------|---------|
   |int getNumberOfDocumentsUpdated()  |   The total number of documents that were successfully updated out of the documents supplied to the bulk update API call.      |
   |double getTotalRequestUnitsConsumed() |  The total request units (RU) consumed by the bulk update API call.       |
   |Duration getTotalTimeTaken()  |   The total time taken by the bulk update API call to complete execution.      |
   |List\<Exception> getErrors()   |       Gets the list of operational or networking issues related to the update operation.      |
   |List\<BulkUpdateFailure> getFailedUpdates()   |       Gets the list of updates, which could not be completed along with the specific exceptions leading to the failures.|

3. After you have the bulk update application ready, build the command-line tool from source by using the 'mvn clean package' command. This command generates a jar file in the target folder:  

   ```bash
   mvn clean package
   ```

4. After the target dependencies are generated, you can invoke the bulk update application by using the following command:

   ```bash
   java -Xmx12G -jar bulkexecutor-sample-1.0-SNAPSHOT-jar-with-dependencies.jar -serviceEndpoint **<Fill in your Azure Cosmos DB's endpoint>* -masterKey **<Fill in your Azure Cosmos DB's primary key>* -databaseId bulkUpdateDb -collectionId bulkUpdateColl -operation update -collectionThroughput 1000000 -partitionKey /profileid -maxConnectionPoolSize 6000 -numberOfDocumentsForEachCheckpoint 1000000 -numberOfCheckpoints 10
   ``` -->

## Performance tips 

Consider the following points for better performance when using bulk executor library:

* For best performance, run your application from an Azure VM in the same region as your Azure Cosmos DB account write region.  
* For achieving higher throughput:  

   * Set the JVM's heap size to a large enough number to avoid any memory issue in handling large number of documents. Suggested heap size: max(3 GB, 3 * sizeof(all documents passed to bulk import API in one batch)).  
   * There's a preprocessing time, due to which you'll get higher throughput when performing bulk operations with a large number of documents. So, if you want to import 10,000,000 documents, running bulk import 10 times on 10 bulk of documents each of size 1,000,000 is preferable than running bulk import 100 times on 100 bulk of documents each of size 100,000 documents.  

* It is recommended to instantiate a single CosmosAsyncClient object for the entire application within a single virtual machine that corresponds to a specific Azure Cosmos DB container.  

* Since a single bulk operation API execution consumes a large chunk of the client machine's CPU and network IO. This happens by spawning multiple tasks internally, avoid spawning multiple concurrent tasks within your application process each executing bulk operation API calls. If a single bulk operation API calls running on a single virtual machine is unable to consume your entire container's throughput (if your container's throughput > 1 million RU/s), it's preferable to create separate virtual machines to concurrently execute bulk operation API calls.

    
## Next steps
* For an overview of bulk executor functionality, see [bulk executor overview](../bulk-executor-overview.md).
