---
title: 'Spring Data Azure Cosmos DB v3 for SQL API release notes and resources'
description: Learn all about the Spring Data Azure Cosmos DB v3 for SQL API including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 08/17/2020
ms.author: anfeldma
ms.custom: devx-track-java
---

# Spring Data Azure Cosmos DB v3 for Core (SQL) API: release notes and resources
> [!div class="op_single_selector"]
> * [.NET SDK v3](sql-api-sdk-dotnet-standard.md)
> * [.NET SDK v2](sql-api-sdk-dotnet.md)
> * [.NET Core SDK v2](sql-api-sdk-dotnet-core.md)
> * [.NET Change Feed SDK v2](sql-api-sdk-dotnet-changefeed.md)
> * [Node.js](sql-api-sdk-node.md)
> * [Java SDK v4](sql-api-sdk-java-v4.md)
> * [Async Java SDK v2](sql-api-sdk-async-java.md)
> * [Sync Java SDK v2](sql-api-sdk-java.md)
> * [Spring Data v2](sql-api-sdk-java-spring-v2.md)
> * [Spring Data v3](sql-api-sdk-java-spring-v3.md)
> * [Spark Connector](sql-api-sdk-java-spark.md)
> * [Python](sql-api-sdk-python.md)
> * [REST](/rest/api/cosmos-db/)
> * [REST Resource Provider](/rest/api/cosmos-db-resource-provider/)
> * [SQL](sql-api-query-reference.md)
> * [Bulk executor - .NET v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

The Spring Data Azure Cosmos DB v3 for Core (SQL) allows developers to utilize Azure Cosmos DB in Spring applications. Spring Data Azure Cosmos DB exposes the Spring Data interface for manipulating databases and collections, working with documents, and issuing queries. Both Sync and Async (Reactive) APIs are supported in the same Maven artifact. 

Spring Data Azure Cosmos DB takes a dependency on the Spring framework. Azure Cosmos DB SDK team releases Maven artifacts for Spring framework v2.2 and v2.3.

The [Spring framework](https://spring.io/projects/spring-framework) is a programming and configuration model which streamlines Java application development. To quote the organization's website, Spring streamlines the "plumbing" of applications using dependency injection. Many developers like Spring because building and testing applications becomes more straightforward. [Spring Boot](https://spring.io/projects/spring-boot) extends this idea of handling the plumbing with an eye towards web application and microservices development. [Spring Data](https://spring.io/projects/spring-data) is a programming model for accessing datastores such as Azure Cosmos DB from the context of a Spring or Spring Boot application. 

You can use Spring Data Azure Cosmos DB in your [Azure Spring Cloud](https://azure.microsoft.com/services/spring-cloud/) applications.

> [!IMPORTANT]  
> These release notes are for v3 of Spring Data Azure Cosmos DB. You can find v2 release notes [here](sql-api-sdk-java-spring-v2.md). 
>
> Spring Data Azure Cosmos DB only supports SQL API.
>
> The following guides support Spring Data on other Azure Cosmos DB APIs:
> * [Spring Data for Apache Cassandra with Azure Cosmos DB](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-data-apache-cassandra-with-cosmos-db)
> * [Spring Data MongoDB with Azure Cosmos DB](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-data-mongodb-with-cosmos-db)
> * [Spring Data Gremlin with Azure Cosmos DB](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-data-gremlin-java-app-with-cosmos-db)
>
> Want to get going fast?
> 1. Install the [minimum supported Java runtime, JDK 8](/java/azure/jdk/?view=azure-java-stable) so you can use the SDK.
> 2. Create a Spring Data Azure Cosmos DB app using the starter - [it's easy](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-cosmos-db)!
> 3. Work through the [Spring Data Azure Cosmos DB Developers Guide](https://docs.microsoft.com/azure/developer/java/spring-framework/how-to-guides-spring-data-cosmosdb) which walks through basic Azure Cosmos DB requests.
>
> You can spin up Spring Boot Starter apps fast with [Spring Initializr](https://start.spring.io/)!
>

## Start here

# [Explore](#tab/explore)

![](media/sql-api-sdk-java-spring-v3/up-arrow.png)

### Navigate the tabs above for basic Spring Data Azure Cosmos DB samples.

# [pom.xml](#tab/pom)

### Configure dependencies

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-spring-data-cosmos-core</artifactId>
    <version>latest</version>
</dependency>
```

# [Connect](#tab/connect)

### Connect

Specify Azure Cosmos DB account and container details. Spring Data Azure Cosmos DB automatically creates the client and connects to the container.

[application.properties](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/blob/main/azure-spring-data-2-2-cosmos-java-getting-started/src/main/resources/application.properties):
```
cosmos.uri=${ACCOUNT_HOST}
cosmos.key=${ACCOUNT_KEY}
cosmos.secondaryKey=${SECONDARY_ACCOUNT_KEY}

dynamic.collection.name=spel-property-collection
# Populate query metrics
cosmos.queryMetricsEnabled=true
```

# [Doc ops](#tab/docs)

### Document operations

[Create](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/blob/main/azure-spring-data-2-2-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmos/SampleApplication.java):
[!code-java[](~/spring-data-azure-cosmos-db-sql-tutorial/azure-spring-data-2-2-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmos/SampleApplication.java?name=Create)]

[Delete](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/blob/main/azure-spring-data-2-2-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmos/SampleApplication.java):
[!code-java[](~/spring-data-azure-cosmos-db-sql-tutorial/azure-spring-data-2-2-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmos/SampleApplication.java?name=Delete)]

# [Query](#tab/queries)

### Query

[Query](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/blob/main/azure-spring-data-2-2-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmos/SampleApplication.java):
[!code-java[](~/spring-data-azure-cosmos-db-sql-tutorial/azure-spring-data-2-2-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmos/SampleApplication.java?name=Query)]

---

## Helpful content

| Content | Spring framework v2.2 | Spring framework v2.3 |
|---|---|
| **SDK download** | [Maven](https://mvnrepository.com/artifact/com.azure/azure-spring-data-2-2-cosmos) | [Maven](https://mvnrepository.com/artifact/com.azure/azure-spring-data-2-3-cosmos) |
|**Contribute to SDK** | [Spring Data Azure Cosmos DB repo on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-spring-data-2-2-cosmos) | [Spring Data Azure Cosmos DB repo on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-spring-data-2-3-cosmos) | 
|**Tutorial**| [Spring Data Azure Cosmos DB tutorial on GitHub](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/tree/main/azure-spring-data-2-2-cosmos-java-getting-started) | [Spring Data Azure Cosmos DB tutorial on GitHub](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/tree/main/azure-spring-data-2-3-cosmos-java-getting-started) |

## Release history
[!INCLUDE[Release notes](~/azure-sdk-for-java-cosmos-db/sdk/cosmos/azure-spring-data-2-2-cosmos/CHANGELOG.md)]

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## Next steps
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.

To learn more about the Spring framework, see the [project home page](https://spring.io/projects/spring-framework).

To learn more about Spring Boot, see the [project home page](https://spring.io/projects/spring-boot).

To learn more about Spring Data, see the [project home page](https://spring.io/projects/spring-data).