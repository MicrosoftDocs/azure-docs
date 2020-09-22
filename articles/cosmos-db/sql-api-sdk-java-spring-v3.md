---
title: 'Spring Data Azure Cosmos DB v3 for SQL API release notes and resources'
description: Learn about the Spring Data Azure Cosmos DB v3 for SQL API, including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 08/18/2020
ms.author: anfeldma
ms.custom: devx-track-java
---

# Spring Data Azure Cosmos DB v3 for Core (SQL) API: Release notes and resources
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

The Spring Data Azure Cosmos DB version 3 for Core (SQL) allows developers to use Azure Cosmos DB in Spring applications. Spring Data Azure Cosmos DB exposes the Spring Data interface for manipulating databases and collections, working with documents, and issuing queries. Both Sync and Async (Reactive) APIs are supported in the same Maven artifact. 

Spring Data Azure Cosmos DB has a dependency on the Spring Data framework. The Azure Cosmos DB SDK team releases Maven artifacts for Spring Data versions 2.2 and 2.3.

The [Spring Framework](https://spring.io/projects/spring-framework) is a programming and configuration model that streamlines Java application development. Spring streamlines the "plumbing" of applications by using dependency injection. Many developers like Spring because it makes building and testing applications more straightforward. [Spring Boot](https://spring.io/projects/spring-boot) extends this handling of the plumbing with an eye toward web application and microservices development. [Spring Data](https://spring.io/projects/spring-data) is a programming model and framework for accessing datastores like Azure Cosmos DB from the context of a Spring or Spring Boot application. 

You can use Spring Data Azure Cosmos DB in your [Azure Spring Cloud](https://azure.microsoft.com/services/spring-cloud/) applications.

> [!IMPORTANT]  
> These release notes are for version 3 of Spring Data Azure Cosmos DB. You can find [release notes for version 2 here](sql-api-sdk-java-spring-v2.md). 
>
> Spring Data Azure Cosmos DB supports only the SQL API.
>
> See these articles for information about Spring Data on other Azure Cosmos DB APIs:
> * [Spring Data for Apache Cassandra with Azure Cosmos DB](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-data-apache-cassandra-with-cosmos-db)
> * [Spring Data MongoDB with Azure Cosmos DB](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-data-mongodb-with-cosmos-db)
> * [Spring Data Gremlin with Azure Cosmos DB](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-data-gremlin-java-app-with-cosmos-db)
>

## Start here

# [Explore](#tab/explore)

<img src="media/sql-api-sdk-java-spring-v3/up-arrow.png" alt="explore the tabs above" width="80"/>

#### These tabs contain basic Spring Data Azure Cosmos DB samples.

# [pom.xml](#tab/pom)

### Configure dependencies

  ```xml
  <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-spring-data-cosmos</artifactId>
      <version>latest</version>
  </dependency>
  ```

# [Connect](#tab/connect)

### Connect

Specify Azure Cosmos DB account and container details. Spring Data Azure Cosmos DB automatically creates the client and connects to the container.

[application.properties](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started/blob/main/azure-spring-data-cosmos-java-getting-started/src/main/resources/application.properties):
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

---

## Resources

* **Contribute to the SDK**: [Spring Data Azure Cosmos DB repo on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-spring-data-cosmos)

* **Tutorial**: [Spring Data Azure Cosmos DB tutorial on GitHub](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started) 

## Release history

### 3.0.0-beta.2 (September 17, 2020)

#### New features

* Updated artifact id to `azure-spring-data-cosmos`.
* Updated azure-cosmos dependency to `4.5.0`.
* `Query Annotation` support for native queries.
* Support for Java 11.
* Added support for Nested Partition Key by exposing `partitionKeyPath` field in `@Container` annotation.
* Added support for `limit` query type allowing `top` and `first` to be used when defining repository APIs.

#### Key bug fixes

* Fixed nested partition key bug when used with `@GeneratedValue` annotation.

### 3.0.0-beta.1 (August 17, 2020)

#### New features

* Updates group ID to `com.azure`.
* Updates artifact ID to `azure-spring-data-2-3-cosmos`.
* Updates azure-cosmos SDK dependency to `4.3.2-beta.2`.
* Adds support for auditing entities: automatic management of `createdBy`, `createdDate`, `lastModifiedBy`, and `lastModifiedDate` annotated fields.
* Adds `@GeneratedValue` annotation support for automatic ID generation for ID fields of `String` type.
* Adds multi-database configuration support for single Azure Cosmos DB accounts with multiple databases and multiple Azure Cosmos DB accounts with multiple databases.
* Adds support for `@Version` annotation on any string field.
* Updates sync API return types to `Iterable` types instead of `List`.
* Exposes `CosmosClientBuilder` from the Azure Cosmos DB SDK as Spring bean to the `@Configuration` class.
* Updates `CosmosConfig` to contain query metrics and response diagnostics processor implementation.
* Adds support for returning the `Optional` data type for single result queries.

#### Renames

* `CosmosDbFactory` to `CosmosFactory`.
* `CosmosDBConfig` to `CosmosConfig`.
* `CosmosDBAccessException` to `CosmosAccessException`.
* `Document` annotation to `Container` annotation.
* `DocumentIndexingPolicy` annotation to `CosmosIndexingPolicy` annotation.
* `DocumentQuery` to `CosmosQuery`.
* application.properties flag `populateQueryMetrics` to `queryMetricsEnabled`.

#### Key bug fixes

* Scheduling of diagnostics logging task to `Parallel` threads to avoid blocking Netty I/O threads.
* Fixes optimistic locking on delete operation.
* Fixes issue with escaping queries for `IN` clause.
* Fixes issue by allowing `long` data type for `@Id`.
* Fixes issue by allowing `boolean`, `long`, `int`, and `double` as data types for the `@PartitionKey` annotation.
* Fixes `IgnoreCase` and `AllIgnoreCase` keywords for ignore case queries.
* Removes default request unit value of 4,000 when containers are created automatically.

## FAQ

[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## Next steps

Learn more about [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/).

Learn more about the [Spring Framework](https://spring.io/projects/spring-framework).

Learn more about [Spring Boot](https://spring.io/projects/spring-boot).

Learn more about [Spring Data](https://spring.io/projects/spring-data).