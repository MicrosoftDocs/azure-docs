---
title: Quickstart - Use Spring Data Azure Cosmos DB v3 to create a document database using Azure Cosmos DB
description: This quickstart presents a Spring Data Azure Cosmos DB v3 code sample you can use to connect to and query the Azure Cosmos DB for NoSQL
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: quickstart
ms.date: 02/22/2023
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: seo-java-august2019, seo-java-september2019, devx-track-java, mode-api, ignite-2022
---

# Quickstart: Build a Spring Data Azure Cosmos DB v3 app to manage Azure Cosmos DB for NoSQL data

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

In this quickstart, you create and manage an Azure Cosmos DB for NoSQL account from the Azure portal, and by using a Spring Data Azure Cosmos DB v3 app cloned from GitHub.

First, you create an Azure Cosmos DB for NoSQL account using the Azure portal. Alternately, without a credit card or an Azure subscription, you can set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb). You can then create a Spring Boot app using the Spring Data Azure Cosmos DB v3 connector, and then add resources to your Azure Cosmos DB account by using the Spring Boot application.

Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities.

> [!IMPORTANT]
> These release notes are for version 3 of Spring Data Azure Cosmos DB. You can find release notes for version 2 at [Spring Data Azure Cosmos DB v2 for API for NoSQL (legacy): Release notes and resources](sdk-java-spring-data-v2.md).
>
> Spring Data Azure Cosmos DB supports only the API for NoSQL.
>
> See the following articles for information about Spring Data on other Azure Cosmos DB APIs:
>
> * [Spring Data for Apache Cassandra with Azure Cosmos DB](/azure/developer/java/spring-framework/configure-spring-data-apache-cassandra-with-cosmos-db)
> * [Spring Data MongoDB with Azure Cosmos DB](/azure/developer/java/spring-framework/configure-spring-data-mongodb-with-cosmos-db)

## Prerequisites

* An Azure account with an active subscription.
  * No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
* [Java Development Kit (JDK) 8](/java/openjdk/download#openjdk-8). Set the `JAVA_HOME` environment variable to the JDK install folder.
* A [Maven binary archive](https://maven.apache.org/download.cgi). On Ubuntu, run `apt-get install maven` to install Maven.
* [Git](https://www.git-scm.com/downloads). On Ubuntu, run `sudo apt-get install git` to install Git.

## Introductory notes

*The structure of an Azure Cosmos DB account.* Irrespective of API or programming language, an Azure Cosmos DB *account* contains zero or more *databases*, a *database* (DB) contains zero or more *containers*, and a *container* contains zero or more items, as shown in the following diagram:

:::image type="content" source="../media/account-databases-containers-items/cosmos-entities.png" alt-text="Azure Cosmos DB account entities" border="false":::

For more information about databases, containers, and items, see [Azure Cosmos DB resource model](../resource-model.md). A few important properties are defined at the level of the container, among them *provisioned throughput* and *partition key*.

The provisioned throughput is measured in Request Units (*RUs*) which have a monetary price and are a substantial determining factor in the operating cost of the account. You can select provisioned throughput at per-container granularity or per-database granularity. However, you should prefer container-level throughput specification. For more information, see [Introduction to provisioned throughput in Azure Cosmos DB](../set-throughput.md).

As items are inserted into an Azure Cosmos DB container, the database grows horizontally by adding more storage and compute to handle requests. Storage and compute capacity are added in discrete units known as *partitions*. You must choose one field in your documents to be the partition key, which maps each document to a partition.

The way partitions are managed is that each partition is assigned a roughly equal slice out of the range of partition key values. For this reason, you should choose a partition key that's relatively random or evenly distributed. Otherwise, you get *hot partitions* and *cold partitions*, which see substantially more or fewer requests. For information on avoiding this condition, see [Partitioning and horizontal scaling in Azure Cosmos DB](../partitioning-overview.md).

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

Now let's switch to working with code. Let's clone an API for NoSQL app from GitHub, set the connection string, and run it.

Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

```bash
git clone https://github.com/Azure-Samples/azure-spring-boot-samples.git
```

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Run the app](#run-the-app).

### [Passwordless (Recommended)](#tab/passwordless)

In this section, the configurations and the code don't have any authentication operations. However, connecting to Azure service requires authentication. To complete the authentication, you need to use Azure Identity. Spring Cloud Azure uses `DefaultAzureCredential`, which Azure Identity provides to help you get credentials without any code changes.

`DefaultAzureCredential` supports multiple authentication methods and determines which method to use at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code. For more information, see the [Default Azure credential](/azure/developer/java/sdk/identity-azure-hosted-auth#default-azure-credential) section of [Authenticate Azure-hosted Java applications](/azure/developer/java/sdk/identity-azure-hosted-auth).

[!INCLUDE [cosmos-nosql-create-assign-roles](../../../includes/passwordless/cosmos-nosql/cosmos-nosql-create-assign-roles.md)]

### Authenticate using DefaultAzureCredential

[!INCLUDE [default-azure-credential-sign-in](../../../includes/passwordless/default-azure-credential-sign-in.md)]

You can authenticate to Cosmos DB for NoSQL using `DefaultAzureCredential` by adding the `azure-identity` [dependency](https://mvnrepository.com/artifact/com.azure/azure-identity) to your application. `DefaultAzureCredential` automatically discovers and uses the account you signed in with in the previous step.

### Application configuration file

Configure the Azure Database for MySQL credentials in the *application.yml* configuration file in the *cosmos/spring-cloud-azure-starter-data-cosmos/spring-cloud-azure-data-cosmos-sample* directory. Replace the values of `${AZURE_COSMOS_ENDPOINT}` and `${COSMOS_DATABASE}`.

```yaml
spring:
  cloud:
    azure:
      cosmos:
        endpoint: ${AZURE_COSMOS_ENDPOINT}
        database: ${COSMOS_DATABASE}
```

After Spring Boot and Spring Data create the Azure Cosmos DB account, database, and container, they connect to the database and container for `delete`, `add`, and `find` operations.

### [Password](#tab/password)

### Application configuration file

The following section shows how Spring Boot and Spring Data use configuration instead of code to establish an Azure Cosmos DB client and connect to Azure Cosmos DB resources. At application startup Spring Boot handles all of this boilerplate using the following settings in *application.yml*:

```yaml
spring:
  cloud:
    azure:
      cosmos:
        key: ${AZURE_COSMOS_KEY}
        endpoint: ${AZURE_COSMOS_ENDPOINT}
        database: ${COSMOS_DATABASE}
```

Once you create an Azure Cosmos DB account, database, and container, just fill-in-the-blanks in the config file and Spring Boot/Spring Data does the following: (1) creates an underlying Java SDK `CosmosClient` instance with the URI and key, and (2) connects to the database and container. You're all set - no more resource management code!

---

### Java source

Spring Data provides a simple, clean, standardized, and platform-independent interface for operating on datastores, as shown in the following examples. These CRUD and query examples enable you to manipulate Azure Cosmos DB documents by using Spring Data Azure Cosmos DB. These examples build on the Spring Data GitHub sample linked to earlier in this article.

* Item creation and updates by using the `save` method.

  ```java
  // Save the User class to Azure Cosmos DB database.
  final Mono<User> saveUserMono = repository.save(testUser);
  ```

* Point-reads using the derived query method defined in the repository. The `findById` performs point-reads for `repository`. The fields mentioned in the method name cause Spring Data to execute a point-read defined by the `id` field:

  ```java
  //  Nothing happens until we subscribe to these Monos.
  //  findById will not return the user as user is not present.
  final Mono<User> findByIdMono = repository.findById(testUser.getId());
  final User findByIdUser = findByIdMono.block();
  Assert.isNull(findByIdUser, "User must be null");
  ```

* Item deletes using `deleteAll`:

  ```java
  repository.deleteAll().block();
  LOGGER.info("Deleted all data in container.");
  ```

* Derived query based on repository method name. Spring Data implements the `repository` `findByFirstName` method as a Java SDK SQL query on the `firstName` field. You can't implement this query as a point-read.

  ```java
  final Flux<User> firstNameUserFlux = repository.findByFirstName("testFirstName");
  ```

## Run the app

Now go back to the Azure portal to get your connection string information. Then, use the following steps to launch the app with your endpoint information so your app can communicate with your hosted database.

1. In the Git terminal window, `cd` to the sample code folder.

   ```bash
   cd azure-spring-boot-samples/cosmos/spring-cloud-azure-starter-data-cosmos/spring-cloud-azure-data-cosmos-sample
   ```

1. In the Git terminal window, use the following command to install the required Spring Data Azure Cosmos DB packages.

   ```bash
   mvn clean package
   ```

1. In the Git terminal window, use the following command to start the Spring Data Azure Cosmos DB application:

   ```bash
   mvn spring-boot:run
   ```

1. The app loads *application.yml* and connects the resources in your Azure Cosmos DB account.
1. The app performs point CRUD operations described previously.
1. The app performs a derived query.
1. The app doesn't delete your resources. Switch back to the portal to [clean up the resources](#clean-up-resources) from your account if you want to avoid incurring charges.

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB for NoSQL account and create a document database and container using the Data Explorer. You then ran a Spring Data app to do the same thing programmatically. You can now import more data into your Azure Cosmos DB account.

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.

* If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md)
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
