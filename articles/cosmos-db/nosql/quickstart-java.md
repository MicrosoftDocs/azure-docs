---
title: "Quickstart: Build a Java app to manage Azure Cosmos DB for NoSQL data"
description: Use a Java code sample from GitHub to learn how to build an app to connect to and query Azure Cosmos DB for NoSQL.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: quickstart
ms.date: 03/16/2023
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: seo-java-august2019, seo-java-september2019, devx-track-java, mode-api, ignite-2022, passwordless-java, devx-track-azurecli, devx-track-extended-java
---

# Quickstart: Build a Java app to manage Azure Cosmos DB for NoSQL data
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Node.js](quickstart-nodejs.md)
> * [Java](quickstart-java.md)
> * [Spring Data](quickstart-java-spring-data.md)
> * [Python](quickstart-python.md)
> * [Spark v3](quickstart-spark.md)
> * [Go](quickstart-go.md)
>

This quickstart guide explains how to build a Java app to manage an Azure Cosmos DB for NoSQL account. You create the Java app using the SQL Java SDK, and add resources to your Azure Cosmos DB account by using the Java application. 

First, create an Azure Cosmos DB for NoSQL account using the Azure portal. Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities. You can [try Azure Cosmos DB account](https://aka.ms/trycosmosdb) for free without a credit card or an Azure subscription. 

> [!IMPORTANT]  
> This quickstart is for Azure Cosmos DB Java SDK v4 only. For more information, see the [release notes](sdk-java-v4.md), [Maven repository](https://mvnrepository.com/artifact/com.azure/azure-cosmos), [performance tips](performance-tips-java-sdk-v4.md), and [troubleshooting guide](troubleshoot-java-sdk-v4.md). If you currently use an older version than v4, see the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide for help upgrading to v4.

> [!TIP]
> If you work with Azure Cosmos DB resources in a Spring application, consider using [Spring Cloud Azure](/azure/developer/java/spring-framework/) as an alternative. Spring Cloud Azure is an open-source project that provides seamless Spring integration with Azure services. To learn more about Spring Cloud Azure, and to see an example using Cosmos DB, see [Access data with Azure Cosmos DB NoSQL API](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-cosmos-db).

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, you can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
- [Java Development Kit (JDK) 8](https://www.oracle.com/java/technologies/javase/8u-relnotes.html). Point your `JAVA_HOME` environment variable to the folder where the JDK is installed.
- A [Maven binary archive](https://maven.apache.org/download.cgi). On Ubuntu, run `apt-get install maven` to install Maven.
- [Git](https://www.git-scm.com/downloads). On Ubuntu, run `sudo apt-get install git` to install Git.

## Introductory notes

**The structure of an Azure Cosmos DB account:** For any API or programming language, an Azure Cosmos DB *account* contains zero or more *databases*, a *database* (DB) contains zero or more *containers*, and a *container* contains zero or more items, as shown in the following diagram:

:::image type="content" source="../media/account-databases-containers-items/cosmos-entities.png" alt-text="Diagram of Azure Cosmos DB account entities.":::

For more information, see [Databases, containers, and items in Azure Cosmos DB](../resource-model.md). 

A few important properties are defined at the level of the container, including *provisioned throughput* and *partition key*. The provisioned throughput is measured in request units (RUs), which have a monetary price and are a substantial determining factor in the operating cost of the account. Provisioned throughput can be selected at per-container granularity or per-database granularity, however container-level throughput specification is typically preferred. To learn more about throughput provisioning, see [Introduction to provisioned throughput in Azure Cosmos DB](../set-throughput.md).

As items are inserted into an Azure Cosmos DB container, the database grows horizontally by adding more storage and compute to handle requests. Storage and compute capacity are added in discrete units known as *partitions*, and you must choose one field in your documents to be the partition key that maps each document to a partition. Partitions are managed such that each partition is assigned a roughly equal slice out of the range of partition key values. Therefore, you're advised to choose a partition key that's relatively random or evenly distributed. Otherwise, some partitions see substantially more requests (*hot partition*) while other partitions see substantially fewer requests (*cold partition*). To learn more, see [Partitioning and horizontal scaling in Azure Cosmos DB](../partitioning-overview.md).

## Create a database account

Before you can create a document database, you need to create an API for NoSQL account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount](../includes/cosmos-db-create-dbaccount.md)]

## Add a container

[!INCLUDE [cosmos-db-create-collection](../includes/cosmos-db-create-collection.md)]

<a id="add-sample-data"></a>

## Add sample data

[!INCLUDE [cosmos-db-create-sql-api-add-sample-data](../includes/cosmos-db-create-sql-api-add-sample-data.md)]

## Query your data

[!INCLUDE [cosmos-db-create-sql-api-query-data](../includes/cosmos-db-create-sql-api-query-data.md)]

## Clone the sample application

Now let's switch to working with code. Clone an API for NoSQL app from GitHub, set the connection string, and run it. You can see how easy it is to work with data programmatically. 

Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

```bash
git clone https://github.com/Azure-Samples/azure-cosmos-java-getting-started.git
```

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Run the app](#run-the-app). 

## [Passwordless Sync API (Recommended)](#tab/passwordlesssync)

[!INCLUDE [java-default-azure-credential-overview](../../../includes/passwordless/java-default-azure-credential-overview.md)]

[!INCLUDE [cosmos-nosql-create-assign-roles](../../../includes/passwordless/cosmos-nosql/cosmos-nosql-create-assign-roles.md)]

## Authenticate using DefaultAzureCredential

[!INCLUDE [default-azure-credential-sign-in](../../../includes/passwordless/default-azure-credential-sign-in.md)]

You can authenticate to Cosmos DB for NoSQL using `DefaultAzureCredential` by adding the `azure-identity` [dependency](https://mvnrepository.com/artifact/com.azure/azure-identity) to your application. `DefaultAzureCredential` automatically discovers and uses the account you signed into in the previous step.

### Manage database resources using the synchronous (sync) API

* `CosmosClient` initialization: The `CosmosClient` provides client-side logical representation for the Azure Cosmos DB database service. This client is used to configure and execute requests against the service.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncPasswordlessMain.java?name=CreatePasswordlessSyncClient)]

* Use the [az cosmosdb sql database create](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-create) and [az cosmosdb sql container create](/cli/azure/cosmosdb/sql/container#az-cosmosdb-sql-container-create) commands to create a Cosmos DB NoSQL database and container.

    ```azurecli-interactive
    # Create a SQL API database
    az cosmosdb sql database create \
        --account-name msdocs-cosmos-nosql \
        --resource-group msdocs \
        --name AzureSampleFamilyDB
    ```
    
    ```azurecli-interactive
    # Create a SQL API container
    az cosmosdb sql container create \
        --account-name msdocs-cosmos-nosql \
        --resource-group msdocs \
        --database-name AzureSampleFamilyDB \
        --name FamilyContainer \
        --partition-key-path '/lastName'
    ```

* Item creation by using the `createItem` method.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncPasswordlessMain.java?name=CreateItem)]

* Point reads are performed using `readItem` method.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncPasswordlessMain.java?name=ReadItem)]

* SQL queries over JSON are performed using the `queryItems` method.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncPasswordlessMain.java?name=QueryItems)]

## Run the app

Now go back to the Azure portal to get your connection string information and launch the app with your endpoint information. This enables your app to communicate with your hosted database.

1. In the git terminal window, `cd` to the sample code folder.

    ```bash
    cd azure-cosmos-java-getting-started
    ```

2. In the git terminal window, use the following command to install the required Java packages.

    ```bash
    mvn package
    ```

3. In the git terminal window, use the following command to start the Java application. Replace SYNCASYNCMODE with `sync-passwordless` or `async-passwordless`, depending on which sample code you'd like to run. Replace YOUR_COSMOS_DB_HOSTNAME with the quoted URI value from the portal, and replace YOUR_COSMOS_DB_MASTER_KEY with the quoted primary key from portal.

    ```bash
    mvn exec:java@SYNCASYNCMODE -DACCOUNT_HOST=YOUR_COSMOS_DB_HOSTNAME -DACCOUNT_KEY=YOUR_COSMOS_DB_MASTER_KEY
    ```

    The terminal window displays a notification that the `FamilyDB` database was created. 

4. The app references the database and container you created via Azure CLI earlier. 

5. The app performs point reads using object IDs and partition key value (which is `lastName` in our sample).

6. The app queries items to retrieve all families with last name (*Andersen*, *Wakefield*, *Johnson*).

7. The app doesn't delete the created resources. Switch back to the portal to [clean up the resources](#clean-up-resources) from your account so that you don't incur charges.

## [Passwordless Async API](#tab/passwordlessasync)

[!INCLUDE [java-default-azure-credential-overview](../../../includes/passwordless/java-default-azure-credential-overview.md)]

[!INCLUDE [cosmos-nosql-create-assign-roles](../../../includes/passwordless/cosmos-nosql/cosmos-nosql-create-assign-roles.md)]

## Authenticate using DefaultAzureCredential

[!INCLUDE [default-azure-credential-sign-in](../../../includes/passwordless/default-azure-credential-sign-in.md)]

You can authenticate to Cosmos DB for NoSQL using `DefaultAzureCredential` by adding the [azure-identity dependency](https://mvnrepository.com/artifact/com.azure/azure-identity) to your application. `DefaultAzureCredential` automatically discovers and uses the account you signed-in with in the previous step.

### Managing database resources using the asynchronous (async) API

* Async API calls return immediately, without waiting for a response from the server. The following code snippets show proper design patterns for accomplishing all of the preceding management tasks using async API.

* `CosmosAsyncClient` initialization. The `CosmosAsyncClient` provides client-side logical representation for the Azure Cosmos DB database service. This client is used to configure and execute asynchronous requests against the service.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/async/AsyncPasswordlessMain.java?name=CreatePasswordlessAsyncClient)]

* Use the [az cosmosdb sql database create](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-create) and [az cosmosdb sql container create](/cli/azure/cosmosdb/sql/container#az-cosmosdb-sql-container-create) commands to create a Cosmos DB NoSQL database and container.

    ```azurecli-interactive
    # Create a SQL API database
    az cosmosdb sql database create \
        --account-name msdocs-cosmos-nosql \
        --resource-group msdocs \
        --name AzureSampleFamilyDB
    ```
    
    ```azurecli-interactive
    # Create a SQL API container
    az cosmosdb sql container create \
        --account-name msdocs-cosmos-nosql \
        --resource-group msdocs \
        --database-name AzureSampleFamilyDB \
        --name FamilyContainer \
        --partition-key-path '/lastName'
    ```

* As with the sync API, item creation is accomplished using the `createItem` method. This example shows how to efficiently issue numerous async `createItem` requests by subscribing to a Reactive Stream that issues the requests and prints notifications. Since this simple example runs to completion and terminates, `CountDownLatch` instances are used to ensure the program doesn't terminate during item creation. **The proper asynchronous programming practice is not to block on async calls. In realistic use cases, requests are generated from a main() loop that executes indefinitely, eliminating the need to latch on async calls.**

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/async/AsyncPasswordlessMain.java?name=CreateItem)]
   
* As with the sync API, point reads are performed using `readItem` method.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/async/AsyncPasswordlessMain.java?name=ReadItem)]

* As with the sync API, SQL queries over JSON are performed using the `queryItems` method.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/async/AsyncPasswordlessMain.java?name=QueryItems)]

## Run the app

Now go back to the Azure portal to get your connection string information and launch the app with your endpoint information. This enables your app to communicate with your hosted database.

1. In the git terminal window, `cd` to the sample code folder.

    ```bash
    cd azure-cosmos-java-getting-started
    ```

2. In the git terminal window, use the following command to install the required Java packages.

    ```bash
    mvn package
    ```

3. In the git terminal window, use the following command to start the Java application. Replace SYNCASYNCMODE with `sync-passwordless` or `async-passwordless` depending on which sample code you would like to run, replace YOUR_COSMOS_DB_HOSTNAME with the quoted URI value from the portal, and replace YOUR_COSMOS_DB_MASTER_KEY with the quoted primary key from portal.

    ```bash
    mvn exec:java@SYNCASYNCMODE -DACCOUNT_HOST=YOUR_COSMOS_DB_HOSTNAME -DACCOUNT_KEY=YOUR_COSMOS_DB_MASTER_KEY
    ```

    The terminal window displays a notification that the `AzureSampleFamilyDB` database was created. 

4. The app references the database and container you created via Azure CLI earlier.

5. The app performs point reads using object IDs and partition key value (which is `lastName` in our sample). 

6. The app queries items to retrieve all families with last name (*Andersen*, *Wakefield*, *Johnson*).

7. The app doesn't delete the created resources. Switch back to the portal to [clean up the resources](#clean-up-resources) from your account so that you don't incur charges.

## [Sync API](#tab/sync)

### Managing database resources using the synchronous (sync) API

* `CosmosClient` initialization. The `CosmosClient` provides client-side logical representation for the Azure Cosmos DB database service. This client is used to configure and execute requests against the service.
    
    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncMain.java?name=CreateSyncClient)]

* `CosmosDatabase` creation.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncMain.java?name=CreateDatabaseIfNotExists)]

* `CosmosContainer` creation.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncMain.java?name=CreateContainerIfNotExists)]

* Item creation by using the `createItem` method.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncMain.java?name=CreateItem)]
   
* Point reads are performed using `readItem` method.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncMain.java?name=ReadItem)]

* SQL queries over JSON are performed using the `queryItems` method.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncMain.java?name=QueryItems)]

## Run the app

Now go back to the Azure portal to get your connection string information and launch the app with your endpoint information. This enables your app to communicate with your hosted database.

1. In the git terminal window, `cd` to the sample code folder.

    ```bash
    cd azure-cosmos-java-getting-started
    ```

2. In the git terminal window, use the following command to install the required Java packages.

    ```bash
    mvn package
    ```

3. In the git terminal window, use the following command to start the Java application. Replace SYNCASYNCMODE with `sync` or `async` depending on which sample code you would like to run, replace YOUR_COSMOS_DB_HOSTNAME with the quoted URI value from the portal, and replace YOUR_COSMOS_DB_MASTER_KEY with the quoted primary key from portal.

    ```bash
    mvn exec:java@SYNCASYNCMODE -DACCOUNT_HOST=YOUR_COSMOS_DB_HOSTNAME -DACCOUNT_KEY=YOUR_COSMOS_DB_MASTER_KEY
    ```

    The terminal window displays a notification that the FamilyDB database was created. 

4. The app creates a database with the name `AzureSampleFamilyDB`.

5. The app creates a container with the name `FamilyContainer`.

6. The app performs point reads using object IDs and partition key value (which is `lastName` in our sample).

7. The app queries items to retrieve all families with last name (*Andersen*, *Wakefield*, *Johnson*).

8. The app doesn't delete the created resources. Return to the Azure portal to [clean up the resources](#clean-up-resources) from your account so you don't incur charges.

## [Async API](#tab/async)

### Managing database resources using the asynchronous (async) API

* Async API calls return immediately, without waiting for a response from the server. The following code snippets show proper design patterns for accomplishing all of the preceding management tasks using async API.

* `CosmosAsyncClient` initialization. The `CosmosAsyncClient` provides client-side logical representation for the Azure Cosmos DB database service. This client is used to configure and execute asynchronous requests against the service.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/async/AsyncMain.java?name=CreateAsyncClient)]

* `CosmosAsyncDatabase` creation.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncMain.java?name=CreateDatabaseIfNotExists)]

* `CosmosAsyncContainer` creation.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/sync/SyncMain.java?name=CreateContainerIfNotExists)]

* As with the sync API, item creation is accomplished using the `createItem` method. This example shows how to efficiently issue numerous async `createItem` requests by subscribing to a Reactive Stream that issues the requests and prints notifications. Since this simple example runs to completion and terminates, `CountDownLatch` instances are used to ensure the program doesn't terminate during item creation. **The proper asynchronous programming practice is not to block on async calls. In realistic use cases, requests are generated from a main() loop that executes indefinitely, eliminating the need to latch on async calls.**

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/async/AsyncMain.java?name=CreateItem)]
   
* As with the sync API, point reads are performed by using `readItem` method.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/async/AsyncMain.java?name=ReadItem)]

* As with the sync API, SQL queries over JSON are performed by using the `queryItems` method.

    [!code-java[](~/azure-cosmosdb-java-v4-getting-started/src/main/java/com/azure/cosmos/sample/async/AsyncMain.java?name=QueryItems)]

## Run the app

Now go back to the Azure portal to get your connection string information and launch the app with your endpoint information. This enables your app to communicate with your hosted database.

1. In the git terminal window, `cd` to the sample code folder.

    ```bash
    cd azure-cosmos-java-getting-started
    ```

2. In the git terminal window, use the following command to install the required Java packages.

    ```bash
    mvn package
    ```

3. In the git terminal window, use the following command to start the Java application. Replace SYNCASYNCMODE with `sync` or `async` depending on which sample code you would like to run, replace YOUR_COSMOS_DB_HOSTNAME with the quoted URI value from the portal, and replace YOUR_COSMOS_DB_MASTER_KEY with the quoted primary key from portal.

    ```bash
    mvn exec:java@SYNCASYNCMODE -DACCOUNT_HOST=YOUR_COSMOS_DB_HOSTNAME -DACCOUNT_KEY=YOUR_COSMOS_DB_MASTER_KEY

    ```

    The terminal window displays a notification that the `FamilyDB` database was created. 

4. The app creates a database with the name `AzureSampleFamilyDB`.

5. The app creates a container with the name `FamilyContainer`.

6. The app performs point reads using object IDs and partition key value (which is `lastName` in our sample).

7. The app queries items to retrieve all families with last name (*Andersen*, *Wakefield*, *Johnson*).

8. The app doesn't delete the created resources. Return to the Azure portal to [clean up the resources](#clean-up-resources) from your account so you don't incur charges.

[!INCLUDE [passwordless-overview](../../../includes/passwordless/passwordless-overview.md)]

---

## Use Throughput Control

Having throughput control helps to isolate the performance needs of applications running against a container, by limiting the amount of [request units](../request-units.md) that can be consumed by a given Java SDK client. 

There are several advanced scenarios that benefit from client-side throughput control:

- **Different operations and tasks have different priorities** - there can be a need to prevent normal transactions from being throttled due to data ingestion or copy activities. Some operations and/or tasks aren't sensitive to latency, and are more tolerant to being throttled than others.

- **Provide fairness/isolation to different end users/tenants** - An application will usually have many end users. Some users may send too many requests, which consume all available throughput, causing others to get throttled.

- **Load balancing of throughput between different Azure Cosmos DB clients** - in some use cases, it's important to make sure all the clients get a fair (equal) share of the throughput

> [!WARNING]
> Please note that throughput control is not yet supported for gateway mode. 
> Currently, for [serverless Azure Cosmos DB accounts](../serverless.md), attempting to use `targetThroughputThreshold` to define a percentage will result in failure. You can only provide an absolute value for target throughput/RU using `targetThroughput`.  

### Global throughput control

Global throughput control in the Java SDK is configured by first creating a container that will define throughput control metadata. This container must have a partition key of `groupId`, and `ttl` enabled. Assuming you already have objects for client, database, and container as defined in the examples above, you can create this container as below. Here we name the container `ThroughputControl`:

## [Sync API](#tab/sync-throughput)

```java
    CosmosContainerProperties throughputContainerProperties = new CosmosContainerProperties("ThroughputControl", "/groupId").setDefaultTimeToLiveInSeconds(-1);
    ThroughputProperties throughputProperties = ThroughputProperties.createManualThroughput(400);
    database.createContainerIfNotExists(throughputContainerProperties, throughputProperties);
```

## [Async API](#tab/async-throughput)

```java
    CosmosContainerProperties throughputContainerProperties = new CosmosContainerProperties("ThroughputControl", "/groupId").setDefaultTimeToLiveInSeconds(-1);
    ThroughputProperties throughputProperties = ThroughputProperties.createManualThroughput(400);
    database.createContainerIfNotExists(throughputContainerProperties, throughputProperties).block();
```
---

> [!NOTE]
> The throughput control container must be created with a partition key `/groupId` and must have `ttl` value set, or throughput control will not function correctly. 

Then, to enable the container object used by the current client to use a shared global control group, we need to create two sets of config. The first is to define the control `groupName`, and the `targetThroughputThreshold` or `targetThroughput` for that group. If the group does not already exist, an entry for it will be created in the throughput control container:

```java
    ThroughputControlGroupConfig groupConfig =
        new ThroughputControlGroupConfigBuilder()
            .groupName("globalControlGroup")
            .targetThroughputThreshold(0.25)
            .targetThroughput(100)
            .build();
```

> [!NOTE]
> In the above, we define a `targetThroughput` value of `100`, meaning that only a maximum of 100 RUs of the container's provisioned throughput can be used by all clients consuming the throughput control group, before the SDK will attempt to rate limit clients. You can also define `targetThroughputThreshold` to provide a percentage of the container's throughput as the threshold instead (the example above defines a threshold of 25%). Defining a value for both with not cause an error, but the SDK will apply the one with the lower value. For example, if the container in the above example has 1000 RUs provisioned, the value of `targetThroughputThreshold(0.25)` will be 250 RUs, so the lower value of `targetThroughput(100)` will be used as the threshold. 

> [!IMPORTANT]
> If you reference a `groupName` that already exists, but define `targetThroughputThreshold` or `targetThroughput` values to be different than what was originally defined for the group, this will be treated as a different group (even though it has the same name). To make sure all clients use the same group, make sure they all have the same settings for both `groupName` **and** `targetThroughputThreshold` (or `targetThroughput`). You also need to restart all applications after making any such changes, to ensure they all consume the new threshold or target throughput properly.

The second config you need to create will reference the throughput container you created earlier, and define some behaviours for it using two parameters:

- Use `setControlItemRenewInterval` to determine how fast throughput will be re-balanced between clients. At each renewal interval, each client will update it's own throughput usage in a client item record stored in the throughput control container. It will also read all the throughput usage of all other active clients, and adjust the throughput that should be assigned to itself. The minimum value that can be set is 5 seconds (there is no maximum value). 
- Use `setControlItemExpireInterval` to determine when a dormant client should be considered offline and no longer part of any throughput control group. Upon expiry, the client item in the throughput container will be removed, and the data will no longer be used for re-balancing between clients. The value of this must be at least (2 * `setControlItemRenewInterval` + 1). For example, if the value of `setControlItemRenewInterval` is 5 seconds, the value of `setControlItemExpireInterval` must be at least 11 seconds.

```java
    GlobalThroughputControlConfig globalControlConfig =
        this.client.createGlobalThroughputControlConfigBuilder("ThroughputControlDatabase", "ThroughputControl")
            .setControlItemRenewInterval(Duration.ofSeconds(5))
            .setControlItemExpireInterval(Duration.ofSeconds(11))
            .build();
```

Now we're ready to enable global throughput control for this container object. Other Cosmos clients running in other JVMs can share the same throughput control group, and as long as they are referencing the same throughput control metadata container, and reference the same throughput control group name. 

```java
    container.enableGlobalThroughputControlGroup(groupConfig, globalControlConfig);
```

> [!NOTE]
> Throughput control does not do RU pre-calculation of each operation. Instead, it tracks the RU usages *after* the operation based on the response header. As such, throughput control is based on an approximation - and **does not guarantee** that amount of throughput will be available for the group at any given time. This means that if the configured RU is so low that a single operation can use it all, then throughput control cannot avoid the RU exceeding the configured limit. Therefore, throughput control works best when the configured limit is higher than any single operation that can be executed by a client in the given control group. With that in mind, when reading via query or change feed, you should configure the [page size](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/a9460846d144fb87ae4e3d2168f63a9f2201c5ed/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L255) to be a modest amount, so that client throughput control can be re-calculated with higher frequency, and therefore reflected more accurately at any given time. However, when using throughput control for a write-job using bulk, the number of documents executed in a single request will automatically be tuned based on the throttling rate to allow the throughput control to kick-in as early as possible.

### Local throughput control

You can also use local throughput control, without defining a shared control group that multiple clients will use. However, with this approach, each client will be unaware of how much throughput other clients are consuming from the total available throughput in the container, while global throughput control attempts to load balance the consumption of each client.   

```java
    ThroughputControlGroupConfig groupConfig =
        new ThroughputControlGroupConfigBuilder()
            .groupName("localControlGroup")
            .targetThroughputThreshold(0.1)
            .build();
    container.enableLocalThroughputControlGroup(groupConfig);
```

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB for NoSQL account, create a document database and container using Data Explorer, and run a Java app to do the same thing programmatically. You can now import additional data into your Azure Cosmos DB account. 

Are you capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating RUs using vCores or vCPUs](../convert-vcore-to-request-unit.md).
* If you know typical request rates for your current database workload, learn how to [estimate RUs using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md).
