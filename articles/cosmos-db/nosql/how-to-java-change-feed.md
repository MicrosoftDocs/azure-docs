---
title: Create an end-to-end Azure Cosmos DB Java SDK v4 application sample by using Change Feed
description: This guide walks you through a simple Java API for NoSQL application, which inserts documents into an Azure Cosmos DB container, while maintaining a materialized view of the container using Change Feed.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: how-to
ms.date: 06/11/2020
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: devx-track-java, ignite-2022, devx-track-extended-java
---

# How to create a Java application that uses Azure Cosmos DB for NoSQL and change feed processor
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB is a fully managed NoSQL database service provided by Microsoft. It allows you to build globally distributed and highly scalable applications with ease. This how-to guide walks you through the process of creating a Java application that uses the Azure Cosmos DB for NoSQL database and implements the Change Feed Processor for real-time data processing. The Java application communicates with the Azure Cosmos DB for NoSQL using Azure Cosmos DB Java SDK v4.

> [!IMPORTANT]  
> This tutorial is for Azure Cosmos DB Java SDK v4 only. Please view the Azure Cosmos DB Java SDK v4 [Release notes](sdk-java-v4.md), [Maven repository](https://mvnrepository.com/artifact/com.azure/azure-cosmos), [Change feed processor in Azure Cosmos DB](change-feed-processor.md), and Azure Cosmos DB Java SDK v4 [troubleshooting guide](troubleshoot-java-sdk-v4.md) for more information. If you are currently using an older version than v4, see the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide for help upgrading to v4.
>

## Prerequisites

* Azure Cosmos DB Account: you can create it from the [Azure portal](https://portal.azure.com/) or you can use [Azure Cosmos DB Emulator](../local-emulator.md) as well.

* Java Development Environment: Ensure you have Java Development Kit (JDK) installed on your machine with at least 8 version.

* [Azure Cosmos DB Java SDK V4](sdk-java-v4.md): provides the necessary features to interact with Azure Cosmos DB.

## Background

The Azure Cosmos DB change feed provides an event-driven interface to trigger actions in response to document insertion that has many uses.

The work of managing change feed events is largely taken care of by the change feed Processor library built into the SDK. This library is powerful enough to distribute change feed events among multiple workers, if that is desired. All you have to do is provide the change feed library a callback.

This simple example of Java application is demonstrating real-time data processing with Azure Cosmos DB and the Change Feed Processor. The application inserts sample documents into a "feed container" to simulate a data stream. The Change Feed Processor, bound to the feed container, processes incoming changes and logs the document content. The processor automatically manages leases for parallel processing.

## Source code

You can clone the SDK example repo and find this example in `SampleChangeFeedProcessor.java`:

```bash
git clone https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples.git
cd azure-cosmos-java-sql-api-sample/src/main/java/com/azure/cosmos/examples/changefeed/
```

## Walkthrough

1. Configure the [`ChangeFeedProcessorOptions`](/java/api/com.azure.cosmos.models.changefeedprocessoroptions) in a Java application using Azure Cosmos DB and Azure Cosmos DB Java SDK V4. The [`ChangeFeedProcessorOptions`](/java/api/com.azure.cosmos.models.changefeedprocessoroptions) provides essential settings to control the behavior of the Change Feed Processor during data processing.
    [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java?name=ChangeFeedProcessorOptions)]

2. Initialize [`ChangeFeedProcessor`](/java/api/com.azure.cosmos.changefeedprocessor) with relevant configurations, including the host name, feed container, lease container, and data handling logic. The [`start()`](/java/api/com.azure.cosmos.changefeedprocessor#com-azure-cosmos-changefeedprocessor-start()) method initiates the data processing, enabling concurrent and real-time processing of incoming data changes from the feed container.
    [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java?name=StartChangeFeedProcessor)]

3. Specify the delegate handles incoming data changes using the `handleChanges()` method. The method processes the received JsonNode documents from the Change Feed. As a developer you have two options for handling the JsonNode document provided to you by Change Feed. One option is to operate on the document in the form of a JsonNode. This is great especially if you don't have a single uniform data model for all documents. The second option - transform the JsonNode to a POJO having the same structure as the JsonNode. Then you can operate on the POJO.
    [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java?name=Delegate)]

4. Build and run the Java application. The application starts the Change Feed Processor, insert sample documents into the feed container, and process the incoming changes.

## Conclusion

In this guide, you learned how to create a Java application using [Azure Cosmos DB Java SDK V4](sdk-java-v4.md) that uses the Azure Cosmos DB for NoSQL database and uses the Change Feed Processor for real-time data processing. You can extend this application to handle more complex use cases and build robust, scalable, and globally distributed applications using Azure Cosmos DB.

## Additional resources

* [Azure Cosmos DB Java SDK V4](sdk-java-v4.md)
* [Additional samples on GitHub](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples)

## Next steps

You can now proceed to learn more about change feed estimator in the following articles:

* [Use the change feed estimator](how-to-use-change-feed-estimator.md)
