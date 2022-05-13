---
title: Migrate from the bulk executor library to the bulk support in Azure Cosmos DB Java V4 SDK
description: Learn how to migrate your application from using the bulk executor library to the bulk support in Azure Cosmos DB Java V4 SDK
author: TheovanKraay
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 05/13/2022
ms.author: thvankra
ms.devlang: java
ms.custom: devx-track-java

---

# Migrate from the bulk executor library to the bulk support in Azure Cosmos DB Java V4 SDK
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

This article describes the required steps to migrate an existing application's code that uses the [Java bulk executor library](sql-api-sdk-bulk-executor-java.md) to the [bulk support](bulk-executor-java.md) feature in the latest version of the Java SDK.

## Enable bulk support

To use bulk support in the Java SDK, include the import below:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=CosmosBulkOperationsImport)]

## Add documents to a reactive stream 

Bulk support in the Java SDK works by adding documents to a reactive stream object. For example, you can add each document individually:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=AddDocsToStream)]

Or you can add the documents to the stream from a list, using `fromIterable`:

```java
    class SampleDoc {
        public SampleDoc() {
        }
        public String getId() {
            return id;
        }
        public void setId(String id) {
            this.id = id;
        }
        private String id="";
    }
    List<SampleDoc> docList = new ArrayList<>();
    SampleDoc doc = new SampleDoc();
    for (int i = 1; i <= 5; i++){            
        String id = "id-"+i;
        doc.setId(id);
        docList.add(doc);
    }
           
    Flux<SampleDoc> docs = Flux.fromIterable(docList);
```

If you want to do bulk import (similar to using [DocumentBulkExecutor.importAll](/java/api/com.microsoft.azure.documentdb.bulkexecutor.documentbulkexecutor.importall)), you need to pass the reactive stream to a method like the following:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkCreateItems)]

If you want to do bulk *update* (similar to using [DocumentBulkExecutor.updateAll](/java/api/com.microsoft.azure.documentdb.bulkexecutor.documentbulkexecutor.updateall)), you need to use bulk replace:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkReplaceItems)]


If you want to do bulk *patch* (similar to using [DocumentBulkExecutor.mergeAll](/java/api/com.microsoft.azure.documentdb.bulkexecutor.documentbulkexecutor.mergeall)), you need to use bulk upsert:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkUpsertItems)]

And if you want to do bulk *delete* (similar to using [DocumentBulkExecutor.deleteAll](/java/api/com.microsoft.azure.documentdb.bulkexecutor.documentbulkexecutor.deleteall)), you need to use bulk delete:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkDeleteItems)]


## Retries, timeouts, and throughput control

The bulk support in Java V4 SDK does not handle these natively. Please see guidance in [Bulk Executor - Java Library](bulk-executor-java.md). The sample also has examples for local and global throughput control. 


## Next steps

* [Bulk samples on GitHub](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/tree/main/src/main/java/com/azure/cosmos/examples/bulk/async)
* Trying to do capacity planning for a migration to Azure Cosmos DB?
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)