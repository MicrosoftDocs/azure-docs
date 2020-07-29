---
title: Create an end-to-end Azure Cosmos DB Java SDK v4 application sample by using Change Feed
description: This guide walks you through a simple Java SQL API application which inserts documents into an Azure Cosmos DB container, while maintaining a materialized view of the container using Change Feed.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: tutorial
ms.date: 06/11/2020
ms.author: anfeldma
---

# How to create a Java application that uses Azure Cosmos DB SQL API and change feed processor

This how-to guide walks you through a simple Java application which uses the Azure Cosmos DB SQL API to insert documents into an Azure Cosmos DB container, while maintaining a materialized view of the container using Change Feed and Change Feed Processor. The Java application communicates with the Azure Cosmos DB SQL API using Azure Cosmos DB Java SDK v4.

> [!IMPORTANT]  
> This tutorial is for Azure Cosmos DB Java SDK v4 only. Please view the Azure Cosmos DB Java SDK v4 [Release notes](sql-api-sdk-java-v4.md), [Maven repository](https://mvnrepository.com/artifact/com.azure/azure-cosmos), Azure Cosmos DB Java SDK v4 [performance tips](performance-tips-java-sdk-v4-sql.md), and Azure Cosmos DB Java SDK v4 [troubleshooting guide](troubleshoot-java-sdk-v4-sql.md) for more information. If you are currently using an older version than v4, see the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide for help upgrading to v4.
>

## Prerequisites

* The URI and key for your Azure Cosmos DB account

* Maven

* Java 8

## Background

The Azure Cosmos DB change feed provides an event-driven interface to trigger actions in response to document insertion. This has many uses. For example in applications which are both read and write heavy, a chief use of change feed is to create a real-time **materialized view** of a container as it is ingesting documents. The materialized view container will hold the same data but partitioned for efficient reads, making the application both read and write efficient.

The work of managing change feed events is largely taken care of by the change feed Processor library built into the SDK. This library is powerful enough to distribute change feed events among multiple workers, if that is desired. All you have to do is provide the change feed library a callback.

This simple example demonstrates change feed Processor library with a single worker creating and deleting documents from a materialized view.

## Setup

If you have not already done so, clone the app example repo:

```bash
git clone https://github.com/Azure-Samples/azure-cosmos-java-sql-app-example.git
```

Open a terminal in the repo directory. Build the app by running

```bash
mvn clean package
```

## Walkthrough

1. As a first check, you should have an Azure Cosmos DB account. Open the **Azure portal** in your browser, go to your Azure Cosmos DB account, and in the left pane navigate to **Data Explorer**.

    ![Azure Cosmos DB account](media/create-sql-api-java-changefeed/cosmos_account_empty.JPG)

1. Run the app in the terminal using the following command:

    ```bash
    mvn exec:java -Dexec.mainClass="com.azure.cosmos.workedappexample.SampleGroceryStore" -DACCOUNT_HOST="your-account-uri" -DACCOUNT_KEY="your-account-key" -Dexec.cleanupDaemonThreads=false
    ```

1. Press enter when you see

    ```bash
    Press enter to create the grocery store inventory system...
    ```

    then return to the Azure portal Data Explorer in your browser. You will see a database **GroceryStoreDatabase** has been added with three empty containers: 

    * **InventoryContainer** - The inventory record for our example grocery store, partitioned on item ```id``` which is a UUID.
    * **InventoryContainer-pktype** - A materialized view of the inventory record, optimized for queries over item ```type```
    * **InventoryContainer-leases** - A leases container is always needed for change feed; leases track the app's progress in reading the change feed.


    ![Empty containers](media/create-sql-api-java-changefeed/cosmos_account_resources_lease_empty.JPG)


1. In the terminal, you should now see a prompt

    ```bash
    Press enter to start creating the materialized view...
    ```

    Press enter. Now the following block of code will execute and initialize the change feed processor on another thread: 

    ### <a id="java4-connection-policy-async"></a>Java SDK V4 (Maven com.azure::azure-cosmos) Async API

    [!code-java[](~/azure-cosmos-java-sql-app-example/src/main/java/com/azure/cosmos/workedappexample/SampleGroceryStore.java?name=InitializeCFP)]

    ```"SampleHost_1"``` is the name of the Change Feed processor worker. ```changeFeedProcessorInstance.start()``` is what actually starts the Change Feed processor.

    Return to the Azure portal Data Explorer in your browser. Under the **InventoryContainer-leases** container, click **items** to see its contents. You will see that Change Feed Processor has populated the lease container, i.e. the processor has assigned the ```SampleHost_1``` worker a lease on some partitions of the **InventoryContainer**.

    ![Leases](media/create-sql-api-java-changefeed/cosmos_leases.JPG)

1. Press enter again in the terminal. This will trigger 10 documents to be inserted into **InventoryContainer**. Each document insertion appears in the change feed as JSON; the following callback code handles these events by mirroring the JSON documents into a materialized view:

    ### <a id="java4-connection-policy-async"></a>Java SDK V4 (Maven com.azure::azure-cosmos) Async API

    [!code-java[](~/azure-cosmos-java-sql-app-example/src/main/java/com/azure/cosmos/workedappexample/SampleGroceryStore.java?name=CFPCallback)]

1. Allow the code to run 5-10sec. Then return to the Azure portal Data Explorer and navigate to **InventoryContainer > items**. You should see that items are being inserted into the inventory container; note the partition key (```id```).

    ![Feed container](media/create-sql-api-java-changefeed/cosmos_items.JPG)

1. Now, in Data Explorer navigate to **InventoryContainer-pktype > items**. This is the materialized view - the items in this container mirror **InventoryContainer** because they were inserted programmatically by change feed. Note the partition key (```type```). So this materialized view is optimized for queries filtering over ```type```, which would be inefficient on **InventoryContainer** because it is partitioned on ```id```.

    ![Materialized view](media/create-sql-api-java-changefeed/cosmos_materializedview2.JPG)

1. We're going to delete a document from both **InventoryContainer** and **InventoryContainer-pktype** using just a single ```upsertItem()``` call. First, take a look at Azure portal Data Explorer. We'll delete the document for which ```/type == "plums"```; it is encircled in red below

    ![Materialized view](media/create-sql-api-java-changefeed/cosmos_materializedview-emph-todelete.JPG)

    Hit enter again to call the function ```deleteDocument()``` in the example code. This function, shown below, upserts a new version of the document with ```/ttl == 5```, which sets document Time-To-Live (TTL) to 5sec. 
    
    ### <a id="java4-connection-policy-async"></a>Java SDK V4 (Maven com.azure::azure-cosmos) Async API

    [!code-java[](~/azure-cosmos-java-sql-app-example/src/main/java/com/azure/cosmos/workedappexample/SampleGroceryStore.java?name=DeleteWithTTL)]

    The change feed ```feedPollDelay``` is set to 100ms; therefore, change feed responds to this update almost instantly and calls ```updateInventoryTypeMaterializedView()``` shown above. That last function call will upsert the new document with TTL of 5sec into **InventoryContainer-pktype**.

    The effect is that after about 5 seconds, the document will expire and be deleted from both containers.

    This procedure is necessary because change feed only issues events on item insertion or update, not on item deletion.

1. Press enter one more time to close the program and clean up its resources.
