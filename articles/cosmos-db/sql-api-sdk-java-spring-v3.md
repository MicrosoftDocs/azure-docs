---
title: 'Spring Data Azure Cosmos DB v3 for SQL API release notes and resources'
description: Learn about the Spring Data Azure Cosmos DB v3 for SQL API, including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 03/15/2021
ms.author: kuthapar
ms.custom: devx-track-java
---

# Spring Data Azure Cosmos DB v3 for Core (SQL) API: Release notes and resources
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

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
> * [SQL](./sql-query-getting-started.md)
> * [Bulk executor - .NET v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

The Spring Data Azure Cosmos DB version 3 for Core (SQL) allows developers to use Azure Cosmos DB in Spring applications. Spring Data Azure Cosmos DB exposes the Spring Data interface for manipulating databases and collections, working with documents, and issuing queries. Both Sync and Async (Reactive) APIs are supported in the same Maven artifact. 

> [!IMPORTANT]
> Spring Data Azure Cosmos DB has a dependency on the Spring Data framework.
> 
> azure-spring-data-cosmos versions from 3.0.0 to 3.4.0 support Spring Data versions 2.2 and 2.3.
> 
> azure-spring-data-cosmos versions 3.5.0 and above support Spring Data versions 2.4.3 and above.
>

The [Spring Framework](https://spring.io/projects/spring-framework) is a programming and configuration model that streamlines Java application development. Spring streamlines the "plumbing" of applications by using dependency injection. Many developers like Spring because it makes building and testing applications more straightforward. [Spring Boot](https://spring.io/projects/spring-boot) extends this handling of the plumbing with an eye toward web application and microservices development. [Spring Data](https://spring.io/projects/spring-data) is a programming model and framework for accessing datastores like Azure Cosmos DB from the context of a Spring or Spring Boot application. 

You can use Spring Data Azure Cosmos DB in your [Azure Spring Cloud](https://azure.microsoft.com/services/spring-cloud/) applications.

> [!IMPORTANT]  
> These release notes are for version 3 of Spring Data Azure Cosmos DB. You can find [release notes for version 2 here](sql-api-sdk-java-spring-v2.md). 
>
> Spring Data Azure Cosmos DB supports only the SQL API.
>
> See these articles for information about Spring Data on other Azure Cosmos DB APIs:
> * [Spring Data for Apache Cassandra with Azure Cosmos DB](/azure/developer/java/spring-framework/configure-spring-data-apache-cassandra-with-cosmos-db)
> * [Spring Data MongoDB with Azure Cosmos DB](/azure/developer/java/spring-framework/configure-spring-data-mongodb-with-cosmos-db)
> * [Spring Data Gremlin with Azure Cosmos DB](/azure/developer/java/spring-framework/configure-spring-data-gremlin-java-app-with-cosmos-db)
>

## Get started fast

  Get up and running with Spring Data Azure Cosmos DB by following our [Spring Boot Starter guide](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-cosmos-db). The Spring Boot Starter approach is the recommended way to get started using the Spring Data Azure Cosmos DB connector.

  Alternatively, you can add the Spring Data Azure Cosmos DB dependency to your `pom.xml` file as shown below:

  ```xml
  <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-spring-data-cosmos</artifactId>
      <version>latest-version</version>
  </dependency>
  ```

## Helpful content

| Content | Link |
|---|---|
|**SDK download**| [Maven](https://mvnrepository.com/artifact/com.azure/azure-spring-data-cosmos) |
|**API documentation** | [Java API reference documentation](/java/api/com.azure.spring.data.cosmos) |
|**Contribute to SDK** | [Azure SDK for Java Central Repo on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-spring-data-cosmos) | 
|**Get started** | [Quickstart: Build a Spring Data Azure Cosmos DB app to manage Azure Cosmos DB SQL API data](./create-sql-api-spring-data.md) <br> [GitHub repo with quickstart code](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-getting-started) | 
|**Basic code samples** | [Azure Cosmos DB: Spring Data Azure Cosmos DB examples for the SQL API](sql-api-spring-data-sdk-samples.md) <br> [GitHub repo with sample code](https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples)|
| **Performance tips**| [Performance tips for Java SDK v4 (applicable to Spring Data)](performance-tips-java-sdk-v4-sql.md)| 
| **Troubleshooting** | [Troubleshoot Java SDK v4 (applicable to Spring Data)](troubleshoot-java-sdk-v4-sql.md) | 
| **Azure Cosmos DB workshops and labs** |[Cosmos DB workshops home page](https://aka.ms/cosmosworkshop)

[!INCLUDE[Release notes](~/azure-sdk-for-java-cosmos-db/sdk/cosmos/azure-spring-data-cosmos/CHANGELOG.md)]

## Additional notes

* Spring Data Azure Cosmos DB supports Java JDK 8 and Java JDK 11.
* Spring Data 2.3 is currently supported, Spring Data 2.4 is not supported currently.

## FAQ

[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## Next steps

Learn more about [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/).

Learn more about the [Spring Framework](https://spring.io/projects/spring-framework).

Learn more about [Spring Boot](https://spring.io/projects/spring-boot).

Learn more about [Spring Data](https://spring.io/projects/spring-data).