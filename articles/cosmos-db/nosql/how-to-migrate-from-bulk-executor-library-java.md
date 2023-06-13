---
title: Migrate from the bulk executor library to the bulk support in Azure Cosmos DB Java V4 SDK
description: Learn how to migrate your application from using the bulk executor library to the bulk support in Azure Cosmos DB Java V4 SDK
author: TheovanKraay
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 05/13/2022
ms.author: thvankra
ms.devlang: java
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate from the bulk executor library to the bulk support in Azure Cosmos DB Java V4 SDK
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article describes the required steps to migrate an existing application's code that uses the [Java bulk executor library](sdk-java-bulk-executor-v2.md) to the [bulk support](bulk-executor-java.md) feature in the latest version of the Java SDK.

## Enable bulk support

To use bulk support in the Java SDK, include the import below:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=CosmosBulkOperationsImport)]

## Add documents to a reactive stream 

Bulk support in the Java V4 SDK works by adding documents to a reactive stream object. For example, you can add each document individually:

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
for (int i = 1; i <= 5; i++){ 
    SampleDoc doc = new SampleDoc();           
    String id = "id-"+i;
    doc.setId(id);
    docList.add(doc);
}
           
Flux<SampleDoc> docs = Flux.fromIterable(docList);
```

If you want to do bulk create or upsert items (similar to using [DocumentBulkExecutor.importAll](/java/api/com.microsoft.azure.documentdb.bulkexecutor.documentbulkexecutor.importall)), you need to pass the reactive stream to a method like the following:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkUpsertItems)]

You can also use a method like the below, but this is only used for creating items:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkCreateItems)]


The [DocumentBulkExecutor.importAll](/java/api/com.microsoft.azure.documentdb.bulkexecutor.documentbulkexecutor.importall) method in the old BulkExecutor library was also used to bulk *patch* items. The old [DocumentBulkExecutor.mergeAll](/java/api/com.microsoft.azure.documentdb.bulkexecutor.documentbulkexecutor.mergeall) method was also used for patch, but only for the `set` patch operation type. To do bulk patch operations in the V4 SDK, first you need to create patch operations:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=PatchOperations)]

Then you can pass the operations, along with the reactive stream of documents, to a method like the below. In this example, we apply both `add` and `set` patch operation types. The full set of patch operation types supported can be found [here](../partial-document-update.md#supported-operations) in our overview of [partial document update in Azure Cosmos DB](../partial-document-update.md).

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkPatchItems)]

> [!NOTE]
> In the above example, we apply `add` and `set` to patch elements whose root parent exists. However, you cannot do this where the root parent does **not** exist. This is because Azure Cosmos DB partial document update is [inspired by JSON Patch RFC 6902](../partial-document-update-faq.yml#is-this-an-implementation-of-json-patch-rfc-6902-). If patching where root parent does not exist, first read back the full documents, then use a method like the below to replace the documents:
> [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkReplaceItems)]               


And if you want to do bulk *delete* (similar to using [DocumentBulkExecutor.deleteAll](/java/api/com.microsoft.azure.documentdb.bulkexecutor.documentbulkexecutor.deleteall)), you need to use bulk delete:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java?name=BulkDeleteItems)]


## Retries, timeouts, and throughput control

The bulk support in Java V4 SDK doesn't handle retries and timeouts natively. You can refer to the guidance in [Bulk Executor - Java Library](bulk-executor-java.md), which includes a [sample](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java) that implements an [abstraction](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/bulk/async/BulkWriter.java) for handling retries and timeouts properly. The sample also has examples for local and global throughput control. You can also refer to the section [should my application retry on errors](conceptual-resilient-sdk-applications.md#should-my-application-retry-on-errors) for more guidance on the different kinds of errors that can occur, and best practices for handling retries. 


## Next steps

* [Bulk samples on GitHub](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/tree/main/src/main/java/com/azure/cosmos/examples/bulk/async)
* Trying to do capacity planning for a migration to Azure Cosmos DB?
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
