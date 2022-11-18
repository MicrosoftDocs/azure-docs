---
title: Quickstart - Use Spring Datan Azure Cosmos DB v3 to create a document database using Azure Cosmos DB
description: This quickstart presents a Spring Datan Azure Cosmos DB v3 code sample you can use to connect to and query the Azure Cosmos DB for NoSQL
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: quickstart
ms.date: 08/26/2021
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: seo-java-august2019, seo-java-september2019, devx-track-java, mode-api, ignite-2022
---

# Quickstart: Build a Spring Datan Azure Cosmos DB v3 app to manage Azure Cosmos DB for NoSQL data
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

In this quickstart, you create and manage an Azure Cosmos DB for NoSQL account from the Azure portal, and by using a Spring Datan Azure Cosmos DB v3 app cloned from GitHub. First, you create an Azure Cosmos DB for NoSQL account using the Azure portal or without a credit card or an Azure subscription, you can set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb), then create a Spring Boot app using the Spring Datan Azure Cosmos DB v3 connector, and then add resources to your Azure Cosmos DB account by using the Spring Boot application. Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities.

> [!IMPORTANT]  
> These release notes are for version 3 of Spring Datan Azure Cosmos DB. You can find [release notes for version 2 here](sdk-java-spring-data-v2.md). 
>
> Spring Datan Azure Cosmos DB supports only the API for NoSQL.
>
> See these articles for information about Spring Data on other Azure Cosmos DB APIs:
> * [Spring Data for Apache Cassandra with Azure Cosmos DB](/azure/developer/java/spring-framework/configure-spring-data-apache-cassandra-with-cosmos-db)
> * [Spring Data MongoDB with Azure Cosmos DB](/azure/developer/java/spring-framework/configure-spring-data-mongodb-with-cosmos-db)
>

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). Or [try Azure Cosmos DB for free](https://aka.ms/trycosmosdb) without an Azure subscription or credit card. You can also use the [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator) with a URI of `https://localhost:8081` and the key `C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==`.
- [Java Development Kit (JDK) 8](https://www.azul.com/downloads/azure-only/zulu/?&version=java-8-lts&architecture=x86-64-bit&package=jdk). Point your `JAVA_HOME` environment variable to the folder where the JDK is installed.
- A [Maven binary archive](https://maven.apache.org/download.cgi). On Ubuntu, run `apt-get install maven` to install Maven.
- [Git](https://www.git-scm.com/downloads). On Ubuntu, run `sudo apt-get install git` to install Git.

## Introductory notes

*The structure of an Azure Cosmos DB account.* Irrespective of API or programming language, an Azure Cosmos DB *account* contains zero or more *databases*, a *database* (DB) contains zero or more *containers*, and a *container* contains zero or more items, as shown in the diagram below:

:::image type="content" source="../media/account-databases-containers-items/cosmos-entities.png" alt-text="Azure Cosmos DB account entities" border="false":::

You may read more about databases, containers and items [here.](../account-databases-containers-items.md) A few important properties are defined at the level of the container, among them *provisioned throughput* and *partition key*. 

The provisioned throughput is measured in Request Units (*RUs*) which have a monetary price and are a substantial determining factor in the operating cost of the account. Provisioned throughput can be selected at per-container granularity or per-database granularity, however container-level throughput specification is typically preferred. You may read more about throughput provisioning [here.](../set-throughput.md)

As items are inserted into an Azure Cosmos DB container, the database grows horizontally by adding more storage and compute to handle requests. Storage and compute capacity are added in discrete units known as *partitions*, and you must choose one field in your documents to be the partition key which maps each document to a partition. The way partitions are managed is that each partition is assigned a roughly equal slice out of the range of partition key values; therefore you are advised to choose a partition key which is relatively random or evenly-distributed. Otherwise, some partitions will see substantially more requests (*hot partition*) while other partitions see substantially fewer requests (*cold partition*), and this is to be avoided. You may learn more about partitioning [here](../partitioning-overview.md).

## Create a database account

Before you can create a document database, you need to create a API for NoSQL account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount](../includes/cosmos-db-create-dbaccount.md)]

## Add a container

[!INCLUDE [cosmos-db-create-collection](../includes/cosmos-db-create-collection.md)]

<a id="add-sample-data"></a>
## Add sample data

[!INCLUDE [cosmos-db-create-sql-api-add-sample-data](../includes/cosmos-db-create-sql-api-add-sample-data.md)]

## Query your data

[!INCLUDE [cosmos-db-create-sql-api-query-data](../includes/cosmos-db-create-sql-api-query-data.md)]

## Clone the sample application

Now let's switch to working with code. Let's clone a API for NoSQL app from GitHub, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

```bash
git clone https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started.git
```

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Run the app
](#run-the-app). 

### Application configuration file

Here we showcase how Spring Boot and Spring Data enhance user experience - the process of establishing an Azure Cosmos DB client and connecting to Azure Cosmos DB resources is now config rather than code. At application startup Spring Boot handles all of this boilerplate using the settings in **application.properties**:

```xml
cosmos.uri=${ACCOUNT_HOST}
cosmos.key=${ACCOUNT_KEY}
cosmos.secondaryKey=${SECONDARY_ACCOUNT_KEY}

dynamic.collection.name=spel-property-collection
# Populate query metrics
cosmos.queryMetricsEnabled=true
```

Once you create an Azure Cosmos DB account, database, and container, just fill-in-the-blanks in the config file and Spring Boot/Spring Data will automatically do the following: (1) create an underlying Java SDK `CosmosClient` instance with the URI and key, and (2) connect to the database and container. You're all set - **no more resource management code!**

### Java source

The Spring Data value-add also comes from its simple, clean, standardized and platform-independent interface for operating on datastores. Building on the Spring Data GitHub sample linked above, below are CRUD and query samples for manipulating Azure Cosmos DB documents with Spring Datan Azure Cosmos DB.

* Item creation and updates by using the `save` method.

    [!code-java[](~/spring-data-azure-cosmos-db-sql-tutorial/azure-spring-data-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmostutorial/SampleApplication.java?name=Create)]
   
* Point-reads using the derived query method defined in the repository. The `findByIdAndLastName` performs point-reads for `UserRepository`. The fields mentioned in the method name cause Spring Data to execute a point-read defined by the `id` and `lastName` fields:

    [!code-java[](~/spring-data-azure-cosmos-db-sql-tutorial/azure-spring-data-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmostutorial/SampleApplication.java?name=Read)]

* Item deletes using `deleteAll`:

    [!code-java[](~/spring-data-azure-cosmos-db-sql-tutorial/azure-spring-data-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmostutorial/SampleApplication.java?name=Delete)]

* Derived query based on repository method name. Spring Data implements the `UserRepository` `findByFirstName` method as a Java SDK SQL query on the `firstName` field (this query could not be implemented as a point-read):

    [!code-java[](~/spring-data-azure-cosmos-db-sql-tutorial/azure-spring-data-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmostutorial/SampleApplication.java?name=Query)]

## Run the app

Now go back to the Azure portal to get your connection string information and launch the app with your endpoint information. This enables your app to communicate with your hosted database.

1. In the git terminal window, `cd` to the sample code folder.

    ```bash
    cd azure-spring-data-cosmos-java-sql-api-getting-started/azure-spring-data-cosmos-java-getting-started/
    ```

2. In the git terminal window, use the following command to install the required Spring Datan Azure Cosmos DB packages.

    ```bash
    mvn clean package
    ```

3. In the git terminal window, use the following command to start the Spring Datan Azure Cosmos DB application:

    ```bash
    mvn spring-boot:run
    ```
    
4. The app loads **application.properties** and connects the resources in your Azure Cosmos DB account.
5. The app will perform point CRUD operations described above.
6. The app will perform a derived query.
7. The app doesn't delete your resources. Switch back to the portal to [clean up the resources](#clean-up-resources) from your account if you want to avoid incurring charges.

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB for NoSQL account, create a document database and container using the Data Explorer, and run a Spring Data app to do the same thing programmatically. You can now import additional data into your Azure Cosmos DB account. 

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB](../import-data.md)
