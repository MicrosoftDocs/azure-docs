---
title: Using bulk executor Java library to perform bulk import and update operations in Azure Cosmos DB
description: Bulk import and update Azure Cosmos DB documents using bulk executor Java library.
author: tknandu
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: conceptual
ms.date: 05/28/2019
ms.author: ramkris
ms.reviewer: sngun
---

# Use bulk executor Java library to perform bulk operations on Azure Cosmos DB data

This tutorial provides instructions on using the Azure Cosmos DB’s bulk executor Java library to import, and update Azure Cosmos DB documents. To learn about bulk executor library and how it helps you leverage massive throughput and storage, see [bulk executor Library overview](bulk-executor-overview.md) article. In this tutorial, you build a Java application that generates random documents and they are bulk imported into an Azure Cosmos DB container. After importing, you will bulk update some properties of a document. 

Currently, bulk executor library is supported by Azure Cosmos DB SQL API and Gremlin API accounts only. This article describes how to use bulk executor .NET library with SQL API accounts. To learn about using bulk executor .NET library with Gremlin API, see [perform bulk operations in Azure Cosmos DB Gremlin API](bulk-executor-graph-dotnet.md).

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.  

* You can [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments. Or, you can use the [Azure Cosmos DB Emulator](https://docs.microsoft.com/azure/cosmos-db/local-emulator) with  the `https://localhost:8081` endpoint. The Primary Key is provided in [Authenticating requests](local-emulator.md#authenticating-requests).  

* [Java Development Kit (JDK) 1.7+](https://aka.ms/azure-jdks)  
  - On Ubuntu, run `apt-get install default-jdk` to install the JDK.  

  - Be sure to set the JAVA_HOME environment variable to point to the folder where the JDK is installed.

* [Download](https://maven.apache.org/download.cgi) and [install](https://maven.apache.org/install.html) a [Maven](https://maven.apache.org/) binary archive  
  
  - On Ubuntu, you can run `apt-get install maven` to install Maven.

* Create an Azure Cosmos DB SQL API account by using the steps described in [create database account](create-sql-api-java.md#create-a-database-account) section of the Java quickstart article.

## Clone the sample application

Now let's switch to working with code by downloading a sample Java application from GitHub. This application performs bulk operations on Azure Cosmos DB data. To clone the application, open a command prompt, navigate to the directory where you want to copy the application and run the following command:

```
 git clone https://github.com/Azure/azure-cosmosdb-bulkexecutor-java-getting-started.git 
```

The cloned repository contains two samples "bulkimport" and "bulkupdate" relative to the "\azure-cosmosdb-bulkexecutor-java-getting-started\samples\bulkexecutor-sample\src\main\java\com\microsoft\azure\cosmosdb\bulkexecutor" folder. The "bulkimport" application generates random documents and imports them to Azure Cosmos DB. The "bulkupdate" application updates some documents in Azure Cosmos DB. In the next sections, we will review the code in each of these sample apps. 

## Bulk import data to Azure Cosmos DB

1. The Azure Cosmos DB’s connection strings are read as arguments and assigned to variables defined in CmdLineConfiguration.java file.  

2. Next the DocumentClient object is initialized by using the following statements:  

   ```java
   ConnectionPolicy connectionPolicy = new ConnectionPolicy();
   connectionPolicy.setMaxPoolSize(1000);
   DocumentClient client = new DocumentClient(
      HOST,
      MASTER_KEY, 
      connectionPolicy,
      ConsistencyLevel.Session)
   ```

3. The DocumentBulkExecutor object is initialized with a high retry values for wait time and throttled requests. And then they are set to 0 to pass congestion control to DocumentBulkExecutor for its lifetime.  

   ```java
   // Set client's retry options high for initialization
   client.getConnectionPolicy().getRetryOptions().setMaxRetryWaitTimeInSeconds(30);
   client.getConnectionPolicy().getRetryOptions().setMaxRetryAttemptsOnThrottledRequests(9);

   // Builder pattern
   Builder bulkExecutorBuilder = DocumentBulkExecutor.builder().from(
     client,
     DATABASE_NAME,
     COLLECTION_NAME,
     collection.getPartitionKey(),
     offerThroughput) // throughput you want to allocate for bulk import out of the container's total throughput

   // Instantiate DocumentBulkExecutor
   DocumentBulkExecutor bulkExecutor = bulkExecutorBuilder.build()

   // Set retries to 0 to pass complete control to bulk executor
   client.getConnectionPolicy().getRetryOptions().setMaxRetryWaitTimeInSeconds(0);
   client.getConnectionPolicy().getRetryOptions().setMaxRetryAttemptsOnThrottledRequests(0);
   ```

4. Call the importAll API that generates random documents to bulk import into an Azure Cosmos DB container. You can configure the command line configurations within the CmdLineConfiguration.java file.

   ```java
   BulkImportResponse bulkImportResponse = bulkExecutor.importAll(documents, false, true, null);
   ```
   The bulk import API accepts a collection of JSON-serialized documents and it has the following syntax, for more details, see the [API documentation](https://docs.microsoft.com/java/api/com.microsoft.azure.documentdb.bulkexecutor):

   ```java
   public BulkImportResponse importAll(
        Collection<String> documents,
        boolean isUpsert,
        boolean disableAutomaticIdGeneration,
        Integer maxConcurrencyPerPartitionRange) throws DocumentClientException;   
   ```

   The importAll method accepts the following parameters:
 
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

5. After you have the bulk import application ready, build the command-line tool from source by using the 'mvn clean package' command. This command generates a jar file in the target folder:  

   ```java
   mvn clean package
   ```

6. After the target dependencies are generated, you can invoke the bulk importer application by using the following command:  

   ```java
   java -Xmx12G -jar bulkexecutor-sample-1.0-SNAPSHOT-jar-with-dependencies.jar -serviceEndpoint *<Fill in your Azure Cosmos DB’s endpoint>*  -masterKey *<Fill in your Azure Cosmos DB’s master key>* -databaseId bulkImportDb -collectionId bulkImportColl -operation import -shouldCreateCollection -collectionThroughput 1000000 -partitionKey /profileid -maxConnectionPoolSize 6000 -numberOfDocumentsForEachCheckpoint 1000000 -numberOfCheckpoints 10
   ```

   The bulk importer creates a new database and a collection with the database name, collection name, and throughput values specified in the App.config file. 

## Bulk update data in Azure Cosmos DB

You can update existing documents by using the BulkUpdateAsync API. In this example, you will set the Name field to a new value and remove the Description field from the existing documents. For the full set of supported field update operations, see [API documentation](https://docs.microsoft.com/java/api/com.microsoft.azure.documentdb.bulkexecutor). 

1. Defines the update items along with corresponding field update operations. In this example, you will use SetUpdateOperation to update the Name field and UnsetUpdateOperation to remove the Description field from all the documents. You can also perform other operations like increment a document field by a specific value, push specific values into an array field, or remove a specific value from an array field. To learn about different methods provided by the bulk update API, see the [API documentation](https://docs.microsoft.com/java/api/com.microsoft.azure.documentdb.bulkexecutor).  

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

   The bulk update API accepts a collection of items to be updated. Each update item specifies the list of field update operations to be performed on a document identified by an ID and a partition key value. for more details, see the [API documentation](https://docs.microsoft.com/java/api/com.microsoft.azure.documentdb.bulkexecutor):

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
   |List\<Exception> getErrors()   |   	Gets the list of errors if some documents out of the batch supplied to the bulk update API call failed to get inserted.      |

3. After you have the bulk update application ready, build the command-line tool from source by using the 'mvn clean package' command. This command generates a jar file in the target folder:  

   ```
   mvn clean package
   ```

4. After the target dependencies are generated, you can invoke the bulk update application by using the following command:

   ```
   java -Xmx12G -jar bulkexecutor-sample-1.0-SNAPSHOT-jar-with-dependencies.jar -serviceEndpoint **<Fill in your Azure Cosmos DB’s endpoint>* -masterKey **<Fill in your Azure Cosmos DB’s master key>* -databaseId bulkUpdateDb -collectionId bulkUpdateColl -operation update -collectionThroughput 1000000 -partitionKey /profileid -maxConnectionPoolSize 6000 -numberOfDocumentsForEachCheckpoint 1000000 -numberOfCheckpoints 10
   ```

## Performance tips 

Consider the following points for better performance when using bulk executor library:

* For best performance, run your application from an Azure VM in the same region as your Cosmos DB account write region.  
* For achieving higher throughput:  

   * Set the JVM’s heap size to a large enough number to avoid any memory issue in handling large number of documents. Suggested heap size: max(3GB, 3 * sizeof(all documents passed to bulk import API in one batch)).  
   * There is a preprocessing time, due to which you will get higher throughput when performing bulk operations with a large number of documents. So, if you want to import 10,000,000 documents, running bulk import 10 times on 10 bulk of documents each of size 1,000,000 is preferable than running bulk import 100 times on 100 bulk of documents each of size 100,000 documents.  

* It is recommended to instantiate a single DocumentBulkExecutor object for the entire application within a single virtual machine that corresponds to a specific Azure Cosmos DB container.  

* Since a single bulk operation API execution consumes a large chunk of the client machine's CPU and network IO. This happens by spawning multiple tasks internally, avoid spawning multiple concurrent tasks within your application process each executing bulk operation API calls. If a single bulk operation API call running on a single virtual machine is unable to consume your entire container's throughput (if your container's throughput > 1 million RU/s), it's preferable to create separate virtual machines to concurrently execute bulk operation API calls.

	
## Next steps
* To learn about maven package details and release notes of bulk executor Java library, see[bulk executor SDK details](sql-api-sdk-bulk-executor-java.md).


