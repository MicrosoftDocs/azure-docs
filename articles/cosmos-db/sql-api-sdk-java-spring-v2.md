---
title: 'Spring Data Azure Cosmos DB v2 for SQL API release notes and resources'
description: Learn all about the Spring Data Azure Cosmos DB v2 for SQL API including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 08/12/2020
ms.author: anfeldma
ms.custom: devx-track-java
---

# Spring Data Azure Cosmos DB v2 for Core (SQL) API: release notes and resources
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

The Spring Data Azure Cosmos DB v2 for Core (SQL) allows developers to utilize Azure Cosmos DB in Spring applications. Spring Data Azure Cosmos DB exposes the Spring Data interface for manipulating databases and collections, working with documents, and issuing queries. Both Sync and Async (Reactive) APIs are supported in the same Maven artifact. 

The [Spring framework](https://spring.io/projects/spring-framework) is a programming and configuration model which streamlines Java application development. To quote the organization's website, Spring streamlines the "plumbing" of applications using dependency injection. Many developers like Spring because building and testing applications becomes more straightforward. [Spring Boot](https://spring.io/projects/spring-boot) extends this idea of handling the plumbing with an eye towards web application and microservices development. [Spring Data](https://spring.io/projects/spring-data) is a programming model for accessing datastores such as Azure Cosmos DB from the context of a Spring or Spring Boot application. 

You can use Spring Data Azure Cosmos DB in your [Azure Spring Cloud](https://azure.microsoft.com/services/spring-cloud/) applications.

> [!IMPORTANT]  
> These release notes are for v2 of Spring Data Azure Cosmos DB. You can find v3 release notes [here](sql-api-sdk-java-spring-v3.md). 
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

### 2.3.0 (2020-05-21)
#### New features
* Update spring boot version to 2.3.0 
#### Key bug fixes

### 2.2.5 (2020-05-19)
#### New features
* Updated Azure Cosmos DB version to v3.7.3
#### Key bug fixes
* Contains memory leak fixes and netty version upgrades from Cosmos SDK v3.7.3 

### 2.2.4 (2020-04-06)
#### New features
#### Key bug fixes
* Fixed allowTelemetry flag to take into account from CosmosDbConfig
* Fixed TTL property on container

### 2.2.3 (2020-02-25)
#### New features
* Added new findAll by partition key API
* Updated azure-cosmos version to 3.7.0
#### Key bug fixes
* Fixed collectionName -> containerName
* Fixed entityClass & domainClass -> domainType
* Fixed "Return entity collection saved by repository instead of input entity"

### 2.1.10 (2020-02-25)
#### New features
#### Key bug fixes
* Backported fix for "Return entity collection saved by repository instead of input entity"

### 2.2.2 (2020-01-15)
#### New features
* Updated azure-cosmos version to v3.6.0
#### Key bug fixes

### 2.2.1 (2019-12-31)
#### New features
* Updated Cosmos DB SDK version to 3.5.0
* Added annotation field to enable/disable auto create collection
* Better Exception handling, exposed CosmosClientException through CosmosDBAccessException
* Exposed requestCharge and activityId through ResponseDiagnostics
#### Key bug fixes
* SDK 3.5.0 update fixes "Exception when Cosmos DB HTTP response header is larger than 8192 bytes", "ConsistencyPolicy.defaultConsistencyLevel() fails on Bounded Staleness and Consistent Prefix"
* Fixed findById APIs behavior, return empty on not found, instead of throwing exception
* Fixed a bug where sorting was not applied on next page when using CosmosPageRequest

### 2.1.9 (2019-12-26)
#### New features
* Added annotation field to enable/disable auto create collection
#### Key bug fixes
* Fixed findById APIs behavior, return empty on not found, instead of throwing exception

### 2.2.0 (2019-10-21)
#### New features
* Complete Reactive Cosmos Repository Support
* Cosmos DB Request Diagnostics String and Query Metrics Support
* Cosmos DB SDK version update to 3.3.1
* Spring Framework version upgrade to 5.2.0.RELEASE
* Spring Data Commons version upgrade to 2.2.0.RELEASE
* Added findByIdAndPartitionKey, deleteByIdAndPartitionKey APIs
* Removed dependency from azure-doumentdb
* Rebranded DocumentDb to Cosmos
#### Key bug fixes
* Fixed "Sorting throws exception when pageSize is less than total items in repository"

### 2.1.8 (2019-10-18)
#### New features
* Deprecate Document DB APIs
* Added findByIdAndPartitionKey, deleteByIdAndPartitionKey APIs.
* Added Optimistic Locking based on _etag
* Enabled SPeL expression for document collection name
* ObjectMapper improvements.
#### Key bug fixes

### 2.1.7 (2019-10-18)
#### New features
* Added Cosmos SDK v3 dependency
* Added Reactive Cosmos Repository
* Updated implementation of DocumentDbTemplate to use Cosmos SDK v3.
* Other configuration changes for Reactive Cosmos Repository support.
#### Key bug fixes

### 2.1.2 (2019-03-19)
#### New features
#### Key bug fixes
* Remove applicationInsights dependency for
    * Potential risk of dependencies polluting
    * Java 11 incompatibility
    * Avoiding potential performance impact to CPU and/or memory.

### 2.0.7 (2019-03-20)
#### New features
#### Key bug fixes
* Backport removes applicationInsights dependency for
    * Potential risk of dependencies polluting
    * Java 11 incompatibility
    * Avoiding potential performance impact to CPU and/or memory.

### 2.1.1 (2019-03-07)
#### New features
* Update master version to 2.1.1
#### Key bug fixes

### 2.0.6 (2019-03-07)
#### New features
* Ignore all exceptions from telemetry
#### Key bug fixes

### 2.1.0 (2018-12-17)
#### New features
* Update version to 2.1.0 to address issue
#### Key bug fixes

### 2.0.5 (2018-09-13)
#### New features
* Add keyword exists, startsWith
* Update Readme
#### Key bug fixes
* Fix "Cant call self href directly for Entity"
* Fix "findAll will fail if collection is not created"

### 2.0.4 (Pre-release) (2018-08-23)
#### New features
* Renaming package from documentdb to cosmosdb,
* Add new feature of query method keyword, 16 keywords from Sql API supported.
* Add new feature of query with paging and sorting.
* Simplify the configuration of spring-data-cosmosdb.
* Add deleteCollection and deleteAll API.

#### Key bug fixes
* Bug fix and defect enhancement.

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## Next steps
To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.

To learn more about the Spring framework, see the [project home page](https://spring.io/projects/spring-framework).

To learn more about Spring Boot, see the [project home page](https://spring.io/projects/spring-boot).

To learn more about Spring Data, see the [project home page](https://spring.io/projects/spring-data).