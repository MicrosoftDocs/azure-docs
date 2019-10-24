---
title: Bind an Azure Cosmos DB to your Azure Spring Cloud application | Microsoft Docs
description: Learn how to bind Azure Cosmos DB to your Azure Spring Cloud application
services: spring-cloud
author: v-vasuke
manager: gwallace
editor: ''

ms.service: spring-cloud
ms.topic: conceptual
ms.date: 10/06/2019
ms.author: v-vasuke

---

# Tutorial: Bind an Azure Cosmos DB to your Azure Spring Cloud application

Azure Spring Cloud allows you to bind select Azure services to your applications automatically, instead of manually configuring your Spring Boot application. This article demonstrates how to bind your application to an Azure Cosmos DB.

Prerequisites:
* A deployed Azure Spring Cloud instance.  Follow our [quickstart](spring-cloud-quickstart-launch-app-cli.md) to get started.
* An Azure Cosmos DB account with a minimum permissions level of contributor.

## Bind Azure Cosmos DB

Azure Cosmos DB has five different API types that support binding:

1. Create an Azure Cosmos DB database. [Refer to this article](https://docs.microsoft.com/azure/cosmos-db/create-cosmosdb-resources-portal) for help with creating the database. Record the name of your database. Ours is named `testdb`.

1. Add one of the following dependencies in your Spring Cloud application's `pom.xml` according to your API type.
    
    #### API type: Core (SQL)

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-cosmosdb-spring-boot-starter</artifactId>
        <version>2.1.6</version>
    </dependency>
    ```
    
    #### API type: MongoDB

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>
    ```

    #### API type: Cassandra

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-cassandra</artifactId>
    </dependency>
    ```

    #### API type: Gremlin (graph)

    ```xml
    <dependency>
        <groupId>com.microsoft.spring.data.gremlin</groupId>
        <artifactId>spring-data-gremlin</artifactId>
        <version>2.1.7</version>
    </dependency>
    ```

    #### API type: Azure Table

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-storage-spring-boot-starter</artifactId>
        <version>2.0.5</version>
    </dependency>
    ```

1. Update the current deployment using `az spring-cloud app update` or create a new deployment for this change using `az spring-cloud app deployment create`.  These commands will either update or create the application with the new dependency.

1. Go to your Azure Spring Cloud service page in the Azure portal. This is the same application you updated or deployed in the previous step. Find the **Application Dashboard** and select the application to bind to the Cosmos DB. Next, select `Service binding` and select the `Create service binding` button. Fill out the form, selecting **Binding type** `Azure Cosmos DB`, the API type, your database name, and the Azure Cosmos DB account.

    > [!NOTE]
    > Use a key space for the database name if you are using Cassandra.

1. Restart the application by selecting the **Restart** button on the application page.

1. To ensure the service is bound correctly, select the binding name and verify its detail. The `property` field should be similar to this:

    ```
    azure.cosmosdb.uri=https:/<some account>.documents.azure.com:443
    azure.cosmosdb.key=abc******
    azure.cosmosdb.database=testdb
    ```

## Next steps

In this tutorial, you learned how to bind your Azure Spring Cloud application to a CosmosDB.  To learn how to bind your application to an Azure Redis Cache, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Bind an Azure Spring Cloud application to an Azure Redis Cache](spring-cloud-tutorial-bind-redis.md).
