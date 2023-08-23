---
title: 'Spring Data Azure Cosmos DB v2 for API for NoSQL release notes and resources'
description: Learn about the Spring Data Azure Cosmos DB v2 for API for NoSQL, including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: reference
ms.date: 04/06/2021
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: devx-track-java, ignite-2022, devx-track-extended-java
---

# Spring Data Azure Cosmos DB v2 for API for NoSQL (legacy): Release notes and resources
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[SDK selector](../includes/cosmos-db-sdk-list.md)]

 Spring Data Azure Cosmos DB version 2 for NoSQL allows developers to use Azure Cosmos DB in Spring applications. Spring Data Azure Cosmos DB exposes the Spring Data interface for manipulating databases and collections, working with documents, and issuing queries. Both Sync and Async (Reactive) APIs are supported in the same Maven artifact. 

> [!WARNING]
> This version of Spring Data Azure Cosmos DB SDK depends on a retired version of Azure Cosmos DB Java SDK. This Spring Data Azure Cosmos DB SDK will be announced as retiring in the near future! This is *not* the latest Azure Spring Data Azure Cosmos DB SDK for Azure Cosmos DB and is outdated. Because of performance issues and instability in Azure Spring Data Azure Cosmos DB SDK V2, we highly recommend to use [Azure Spring Data Azure Cosmos DB v3](sdk-java-spring-data-v3.md) for your project. To upgrade, follow the instructions in the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide to understand the difference in the underlying Java SDK V4.
>

The [Spring Framework](https://spring.io/projects/spring-framework) is a programming and configuration model that streamlines Java application development. Spring streamlines the "plumbing" of applications by using dependency injection. Many developers like Spring because it makes building and testing applications more straightforward. [Spring Boot](https://spring.io/projects/spring-boot) extends this handling of the plumbing with an eye toward web application and microservices development. [Spring Data](https://spring.io/projects/spring-data) is a programming model for accessing datastores like Azure Cosmos DB from the context of a Spring or Spring Boot application. 

You can use Spring Data Azure Cosmos DB in your applications hosted in [Azure Spring Apps](https://azure.microsoft.com/services/spring-apps/).

> [!IMPORTANT]  
> These release notes are for version 2 of Spring Data Azure Cosmos DB. You can find [release notes for version 3 here](sdk-java-spring-data-v3.md). 
>
> Spring Data Azure Cosmos DB supports only the API for NoSQL.
>
> See the following articles for information about Spring Data on other Azure Cosmos DB APIs:
> * [Spring Data for Apache Cassandra with Azure Cosmos DB](/azure/developer/java/spring-framework/configure-spring-data-apache-cassandra-with-cosmos-db)
> * [Spring Data MongoDB with Azure Cosmos DB](/azure/developer/java/spring-framework/configure-spring-data-mongodb-with-cosmos-db)
>
> Want to get going fast?
> 1. Install the [minimum supported Java runtime, JDK 8](/java/azure/jdk/), so you can use the SDK.
> 2. Create a Spring Data Azure Cosmos DB app by using the [starter](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-cosmos-db). It's easy!
> 3. Work through the [Spring Data Azure Cosmos DB developer's guide](/azure/developer/java/spring-framework/how-to-guides-spring-data-cosmosdb), which walks through basic Azure Cosmos DB requests.
>
> You can spin up Spring Boot Starter apps fast by using [Spring Initializr](https://start.spring.io/)!
>

## Resources

| Resource | Link |
|---|---|
| **SDK download** | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure/spring-data-cosmosdb) |
|**API documentation** | [Spring Data Azure Cosmos DB reference documentation]() |
|**Contribute to the SDK** | [Spring Data Azure Cosmos DB repo on GitHub](https://github.com/microsoft/spring-data-cosmosdb) | 
|**Spring Boot Starter**| [Azure Cosmos DB Spring Boot Starter client library for Java](https://github.com/MicrosoftDocs/azure-dev-docs/blob/master/articles/java/spring-framework/configure-spring-boot-starter-java-app-with-cosmos-db.md) |
|**Spring TODO app sample with Azure Cosmos DB**| [End-to-end Java Experience in App Service Linux (Part 2)](https://github.com/Azure-Samples/e2e-java-experience-in-app-service-linux-part-2) |
|**Developer's guide** | [Spring Data Azure Cosmos DB developer's guide](/azure/developer/java/spring-framework/how-to-guides-spring-data-cosmosdb) | 
|**Using Starter** | [How to use Spring Boot Starter with the Azure Cosmos DB for NoSQL](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-cosmos-db) <br> [GitHub repo for Azure Cosmos DB Spring Boot Starter](https://github.com/MicrosoftDocs/azure-dev-docs/blob/master/articles/java/spring-framework/configure-spring-boot-starter-java-app-with-cosmos-db.md) |
|**Sample with Azure App Service** | [How to use Spring and Azure Cosmos DB with App Service on Linux](/azure/developer/java/spring-framework/configure-spring-app-with-cosmos-db-on-app-service-linux) <br> [TODO app sample](https://github.com/Azure-Samples/e2e-java-experience-in-app-service-linux-part-2.git) |

## Release history

### 2.3.0 (May 21, 2020)
#### New features
* Updates Spring Boot version to 2.3.0.


### 2.2.5 (May 19, 2020)
#### New features
* Updates Azure Cosmos DB version to 3.7.3.
#### Key bug fixes
* Contains memory leak fixes and Netty version upgrades from Azure Cosmos DB SDK 3.7.3.

### 2.2.4 (April 6, 2020)
#### Key bug fixes
* Fixes `allowTelemetry` flag to take into account from `CosmosDbConfig`.
* Fixes `TTL` property on container.

### 2.2.3 (February 25, 2020)
#### New features
* Adds new `findAll` by partition key API.
* Updates Azure Cosmos DB version to 3.7.0.
#### Key bug fixes
* Fixes `collectionName` -> `containerName`.
* Fixes `entityClass` and `domainClass` -> `domainType`.
* Fixes "Return entity collection saved by repository instead of input entity."

### 2.1.10 (February 25, 2020)
#### Key bug fixes
* Backports fix for "Return entity collection saved by repository instead of input entity."

### 2.2.2 (January 15, 2020)
#### New features
* Updates Azure Cosmos DB version to 3.6.0.
#### Key bug fixes

### 2.2.1 (December 31, 2019)
#### New features
* Updates Azure Cosmos DB SDK version to 3.5.0.
* Adds annotation field to enable or disable automatic collection creation.
* Improves exception handling. Exposes `CosmosClientException` through `CosmosDBAccessException`.
* Exposes `requestCharge` and `activityId` through `ResponseDiagnostics`.
#### Key bug fixes
* SDK 3.5.0 update fixes "Exception when Azure Cosmos DB HTTP response header is larger than 8192 bytes," "ConsistencyPolicy.defaultConsistencyLevel() fails on Bounded Staleness and Consistent Prefix."
* Fixes `findById` method's behavior. Previously, this method returned empty if the entity wasn't found instead of throwing an exception.
* Fixes a bug in which sorting wasn't applied on the next page when `CosmosPageRequest` was used.

### 2.1.9 (December 26, 2019)
#### New features
* Adds annotation field to enable or disable automatic collection creation.
#### Key bug fixes
*  Fixes `findById` method's behavior. Previously, this method returned empty if the entity wasn't found instead of throwing an exception.

### 2.2.0 (October 21, 2019)
#### New features
* Complete Reactive Azure Cosmos DB Repository support.
* Azure Cosmos DB Request Diagnostics String and Query Metrics support.
* Azure Cosmos DB SDK version update to 3.3.1.
* Spring Framework version upgrade to 5.2.0.RELEASE.
* Spring Data Commons version upgrade to 2.2.0.RELEASE.
* Adds `findByIdAndPartitionKey` and `deleteByIdAndPartitionKey` APIs.
* Removes dependency from azure-documentdb.
* Rebrands DocumentDB to Azure Cosmos DB.
#### Key bug fixes
* Fixes "Sorting throws exception when pageSize is less than total items in repository."

### 2.1.8 (October 18, 2019)
#### New features
* Deprecates DocumentDB APIs.
* Adds `findByIdAndPartitionKey` and `deleteByIdAndPartitionKey` APIs.
* Adds optimistic locking based on `_etag`.
* Enables SpEL expression for document collection name.
* Adds `ObjectMapper` improvements.

### 2.1.7 (October 18, 2019)
#### New features
* Adds Azure Cosmos DB SDK version 3 dependency.
* Adds Reactive Azure Cosmos DB Repository.
* Updates implementation of `DocumentDbTemplate` to use Azure Cosmos DB SDK version 3.
* Adds other configuration changes for Reactive Azure Cosmos DB Repository support.

### 2.1.2 (March 19, 2019)
#### Key bug fixes
* Removes `applicationInsights` dependency for:
    * Potential risk of dependencies polluting.
    * Java 11 incompatibility.
    * Avoiding potential performance impact to CPU and/or memory.

### 2.0.7 (March 20, 2019)
#### Key bug fixes
* Backport removes `applicationInsights` dependency for:
    * Potential risk of dependencies polluting.
    * Java 11 incompatibility.
    * Avoiding potential performance impact to CPU and/or memory.

### 2.1.1 (March 7, 2019)
#### New features
* Updates main version to 2.1.1.

### 2.0.6 (March 7, 2019)
#### New features
* Ignore all exceptions from telemetry.

### 2.1.0 (December 17, 2018)
#### New features
* Updates version to 2.1.0 to address problem.

### 2.0.5 (September 13, 2018)
#### New features
* Adds keywords `exists` and `startsWith`.
* Updates Readme.
#### Key bug fixes
* Fixes "Can't call self href directly for Entity."
* Fixes "findAll will fail if collection is not created."

### 2.0.4 (Prerelease) (August 23, 2018)
#### New features
* Renames package from documentdb to cosmosdb.
* Adds new feature of query method keyword. 16 keywords from API for NoSQL are now supported.
* Adds new feature of query with paging and sorting.
* Simplifies the configuration of spring-data-cosmosdb.
* Adds `deleteCollection` and `deleteAll` APIs.

#### Key bug fixes
* Bug fix and defect mitigation.

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../includes/cosmos-db-sdk-faq.md)]

## Next steps
Learn more about [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/).

Learn more about the [Spring Framework](https://spring.io/projects/spring-framework).

Learn more about [Spring Boot](https://spring.io/projects/spring-boot).

Learn more about [Spring Data](https://spring.io/projects/spring-data).
