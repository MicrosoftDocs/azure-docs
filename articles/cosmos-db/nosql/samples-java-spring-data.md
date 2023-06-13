---
title: 'Azure Cosmos DB for NoSQL: Spring Data v3 examples'
description: Find Spring Data v3 examples on GitHub for common tasks using the Azure Cosmos DB for NoSQL, including CRUD operations.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: sample
ms.date: 08/26/2021
ms.custom: devx-track-java, ignite-2022, devx-track-extended-java
ms.author: sidandrews
ms.reviewer: mjbrown
---
# Azure Cosmos DB for NoSQL: Spring Data Azure Cosmos DB v3 examples
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
> * [.NET SDK Examples](samples-dotnet.md)
> * [Java V4 SDK Examples](samples-java.md)
> * [Spring Data V3 SDK Examples](samples-java-spring-data.md)
> * [Node.js Examples](samples-nodejs.md)
> * [Python Examples](samples-python.md)
> * [Azure Code Sample Gallery](https://azure.microsoft.com/resources/samples/?sort=0&service=cosmos-db)
> 
> 

> [!IMPORTANT]  
> These release notes are for version 3 of Spring Data Azure Cosmos DB. You can find [release notes for version 2 here](sdk-java-spring-data-v2.md). 
>
> Spring Data Azure Cosmos DB supports only the API for NoSQL.
>
> See these articles for information about Spring Data on other Azure Cosmos DB APIs:
> * [Spring Data for Apache Cassandra with Azure Cosmos DB](/azure/developer/java/spring-framework/configure-spring-data-apache-cassandra-with-cosmos-db)
> * [Spring Data MongoDB with Azure Cosmos DB](/azure/developer/java/spring-framework/configure-spring-data-mongodb-with-cosmos-db)
>

> [!IMPORTANT]  
>[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
>  
>- You can [activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio): Your Visual Studio subscription gives you credits every month that you can use for paid Azure services.
>
>[!INCLUDE [cosmos-db-emulator-docdb-api](../includes/cosmos-db-emulator-docdb-api.md)]
>

The latest sample applications that perform CRUD operations and other common operations on Azure Cosmos DB resources are included in the [azure-spring-data-cosmos-java-sql-api-samples](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples) GitHub repository. This article provides:

* Links to the tasks in each of the example Spring Data Azure Cosmos DB project files. 
* Links to the related API reference content.

**Prerequisites**

You need the following to run this sample application:

* Java Development Kit 8
* Spring Data Azure Cosmos DB v3

You can optionally use Maven to get the latest Spring Data Azure Cosmos DB v3 binaries for use in your project. Maven automatically adds any necessary dependencies. Otherwise, you can directly download the dependencies listed in the **pom.xml** file and add them to your build path.

```bash
<dependency>
	<groupId>com.azure</groupId>
	<artifactId>azure-spring-data-cosmos</artifactId>
	<version>LATEST</version>
</dependency>
```

**Running the sample applications**

Clone the sample repo:
```bash
$ git clone https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples

$ cd azure-spring-data-cosmos-java-sql-api-samples
```

You can run the samples using either an IDE (Eclipse, IntelliJ, or VSCODE) or from the command line using Maven.

In **application.properties** these environment variables must be set

```xml
cosmos.uri=${ACCOUNT_HOST}
cosmos.key=${ACCOUNT_KEY}
cosmos.secondaryKey=${SECONDARY_ACCOUNT_KEY}

dynamic.collection.name=spel-property-collection
# Populate query metrics
cosmos.queryMetricsEnabled=true
```

in order to give the samples read/write access to your account, databases and containers.

Your IDE may provide the ability to execute the Spring Data sample code. Otherwise you may use the following terminal command to execute the sample:

```bash
mvn spring-boot:run
```

## Document CRUD examples
The [samples](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/SampleApplication.java) file shows how to perform the following tasks. To learn about Azure Cosmos DB documents before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Create a document](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/SampleApplication.java#L46-L47) | CosmosRepository.save |
| [Read a document by ID](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/SampleApplication.java#L56-L58) | CosmosRepository.derivedQueryMethod |
| [Delete all documents](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/SampleApplication.java#L39-L41) | CosmosRepository.deleteAll |

## Derived query method examples
The [samples](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/SampleApplication.java) file shows how to perform the following tasks. To learn about Azure Cosmos DB queries before running the following samples, you may find it helpful to read [Baeldung's Derived Query Methods in Spring](https://www.baeldung.com/spring-data-derived-queries) article.

| [Query for documents](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/SampleApplication.java#L73-L77) | CosmosRepository.derivedQueryMethod |

## Custom query examples
The [samples](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/SampleApplication.java) file shows how to do the following tasks using the SQL query grammar. To learn about the SQL query reference in Azure Cosmos DB before you run the following samples, see [SQL query examples for Azure Cosmos DB](query/getting-started.md). 


| Task | API reference |
| --- | --- |
| [Query for all documents](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/UserRepository.java#L20-L22) | @Query annotation |
| [Query for equality using ==](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/UserRepository.java#L24-L26) | @Query annotation |
| [Query for inequality using != and NOT](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/UserRepository.java#L28-L38) | @Query annotation |
| [Query using range operators like >, <, >=, <=](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/UserRepository.java#L40-L42) | @Query annotation |
| [Query using range operators against strings](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/UserRepository.java#L44-L46) | @Query annotation |
| [Query with ORDER BY](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/UserRepository.java#L48-L50) | @Query annotation |
| [Query with DISTINCT](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/UserRepository.java#L52-L54) | @Query annotation |
| [Query with aggregate functions](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/UserRepository.java#L56-L62) | @Query annotation |
| [Work with subdocuments](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/UserRepository.java#L64-L66) | @Query annotation |
| [Query with intra-document Joins](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/UserRepository.java#L68-L85) | @Query annotation |
| [Query with string, math, and array operators](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/springexamples/quickstart/sync/UserRepository.java#L87-L97) | @Query annotation |

## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
