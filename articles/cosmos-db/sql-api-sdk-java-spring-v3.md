---
title: 'Spring Data Azure Cosmos DB v3 for SQL API release notes and resources'
description: Learn all about the Spring Data Azure Cosmos DB v3 for SQL API including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 08/18/2020
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

Spring Data Azure Cosmos DB takes a dependency on the Spring Data framework. Azure Cosmos DB SDK team releases Maven artifacts for Spring Data v2.2 and v2.3.

The [Spring framework](https://spring.io/projects/spring-framework) is a programming and configuration model which streamlines Java application development. To quote the organization's website, Spring streamlines the "plumbing" of applications using dependency injection. Many developers like Spring because building and testing applications becomes more straightforward. [Spring Boot](https://spring.io/projects/spring-boot) extends this idea of handling the plumbing with an eye towards web application and microservices development. [Spring Data](https://spring.io/projects/spring-data) is a programming model and framework for accessing datastores such as Azure Cosmos DB from the context of a Spring or Spring Boot application. 

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

## Start here

# [Explore](#tab/explore)

<img src="media/sql-api-sdk-java-spring-v3/up-arrow.png" alt="explore the tabs above" width="80"/>

### Navigate the tabs above for basic Spring Data Azure Cosmos DB samples.

# [pom.xml](#tab/pom)

### Configure dependencies

Two Spring Data Azure Cosmos DB v3 Maven artifacts are available.

Artifact that depends on Spring Data framework v2.2:
```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-spring-data-2-2-cosmos</artifactId>
    <version>latest</version>
</dependency>
```

Artifact that depends on Spring Data framework v2.3:
```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-spring-data-2-3-cosmos</artifactId>
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

[Create](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/blob/main/azure-spring-data-2-3-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmostutorial/SampleApplication.java):
[!code-java[](~/spring-data-azure-cosmos-db-sql-tutorial/azure-spring-data-2-3-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmostutorial/SampleApplication.java?name=Create)]

[Delete](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/blob/main/azure-spring-data-2-3-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmostutorial/SampleApplication.java):
[!code-java[](~/spring-data-azure-cosmos-db-sql-tutorial/azure-spring-data-2-3-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmostutorial/SampleApplication.java?name=Delete)]

# [Query](#tab/queries)

### Query

[Query](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/blob/main/azure-spring-data-2-3-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmostutorial/SampleApplication.java):
[!code-java[](~/spring-data-azure-cosmos-db-sql-tutorial/azure-spring-data-2-3-cosmos-java-getting-started/src/main/java/com/azure/spring/data/cosmostutorial/SampleApplication.java?name=Query)]

---

## Helpful content

| Content | Spring Data framework v2.2 | Spring Data framework v2.3 |
|---|---|
| **SDK download** | [Maven](https://mvnrepository.com/artifact/com.azure/azure-spring-data-2-2-cosmos) | [Maven](https://mvnrepository.com/artifact/com.azure/azure-spring-data-2-3-cosmos) |
|**Contribute to SDK** | [Spring Data Azure Cosmos DB repo on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-spring-data-2-2-cosmos) | [Spring Data Azure Cosmos DB repo on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-spring-data-2-3-cosmos) | 
|**Tutorial**| [Spring Data Azure Cosmos DB tutorial on GitHub](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/tree/main/azure-spring-data-2-2-cosmos-java-getting-started) | [Spring Data Azure Cosmos DB tutorial on GitHub](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/tree/main/azure-spring-data-2-3-cosmos-java-getting-started) |

## Release history

### 3.0.0-beta.2 (Unreleased)

### 3.0.0-beta.1 (2020-08-17)
#### New features
* Updated group ID to `com.azure`.
* Updated artifact ID to `azure-spring-data-2-3-cosmos`.
* Updated azure-cosmos SDK dependency to `4.3.2-beta.2`.
* Support for auditing entities - automatic management of createdBy, createdDate, lastModifiedBy and lastModifiedDate annotated fields.
* `@GeneratedValue` annotation support for automatic id generation for ID fields of `String` type.
* Multi-database configuration support for single cosmos account with multiple databases and multiple cosmos accounts with multiple databases.
* Support for `@Version` annotation on any string field.
* Updated sync APIs return types to `Iterable` types instead of `List`.
* Exposed `CosmosClientBuilder` from Cosmos SDK as spring bean to `@Configuration` class.
* Updated `CosmosConfig` to contain query metrics and response diagnostics processor implementation.
* Support for returning `Optional` data type for single result queries.
#### Renames
* `CosmosDbFactory` to `CosmosFactory`.
* `CosmosDBConfig` to `CosmosConfig`.
* `CosmosDBAccessException` to `CosmosAccessException`.
* `Document` annotation to `Container` annotation.
* `DocumentIndexingPolicy` annotation to `CosmosIndexingPolicy` annotation.
* `DocumentQuery` to `CosmosQuery`.
* application.properties flag `populateQueryMetrics` to `queryMetricsEnabled`.
#### Key bug fixes
* Scheduling diagnostics logging task to `Parallel` threads to avoid blocking Netty I/O threads.
* Fixed optimistic locking on delete operation.
* Fixed issue with escaping queries for `IN` clause.
* Fixed issue by allowing `long` data type for `@Id`.
* Fixed issue by allowing `boolean`, `long`, `int`, `double` as data types for `@PartitionKey` annotation.
* Fixed `IgnoreCase` & `AllIgnoreCase` keywords for ignore case queries.
* Removed default request unit value of 4000 when creating containers automatically.

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## Next steps
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.

To learn more about the Spring framework, see the [project home page](https://spring.io/projects/spring-framework).

To learn more about Spring Boot, see the [project home page](https://spring.io/projects/spring-boot).

To learn more about Spring Data, see the [project home page](https://spring.io/projects/spring-data).