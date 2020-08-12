---
title: 'Spring Data Azure Cosmos DB v3 for SQL API release notes and resources'
description: Learn all about the Spring Data Azure Cosmos DB v3 for SQL API including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 08/12/2020
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

## Getting started

# [Sync API](#tab/sync)

Test Sync

# [Async API](#tab/async)

Test Async

# [Third panel](#tab/thirdpanel)

Test Third panel

---

## Helpful content

| Content | Link |
|---|---|
| **SDK download** | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure/spring-data-cosmosdb) |
|**API documentation** | [Spring Data Azure Cosmos DB reference documentation]() |
|**Contribute to SDK** | [Spring Data Azure Cosmos DB Repo on GitHub](https://github.com/microsoft/spring-data-cosmosdb) | 
|**Spring Boot starter**| [Azure Cosmos DB Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-starter-cosmosdb) |
|**Spring TODO app sample with Azure Cosmos DB**| [End-to-end Java Experience in App Service Linux (Part 2)](https://github.com/Azure-Samples/e2e-java-experience-in-app-service-linux-part-2) |
|**Developers guide** | [Spring Data Azure Cosmos DB Developers Guide](https://docs.microsoft.com/azure/developer/java/spring-framework/how-to-guides-spring-data-cosmosdb) | 
|**Guide to using starter** | [How to use the Spring Boot Starter with the Azure Cosmos DB SQL API](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-cosmos-db) <br> [GitHub repo for Azure Spring Boot Starter Cosmos DB](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-starter-cosmosdb) |
|**Sample with App Services** | [How to use Spring and Cosmos DB with App Service on Linux](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-app-with-cosmos-db-on-app-service-linux) <br> [TODO app sample](https://github.com/Azure-Samples/e2e-java-experience-in-app-service-linux-part-2.git) |

## Release history

### 3.0.0-beta.1 (Unreleased)
#### New features
* Updated group id to `com.azure`.
* Updated artifact id to `azure-spring-data-2-3-cosmos`.
* Updated azure-cosmos SDK dependency to `4.3.1`.
* Support for auditing entities - automatic management of createdBy, createdDate, lastModifiedBy and lastModifiedDate annotated fields.
* `@GeneratedValue` annotation support for automatic id generation for id fields of `String` type.
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