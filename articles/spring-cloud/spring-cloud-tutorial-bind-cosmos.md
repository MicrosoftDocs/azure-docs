---
title: Tutorial - Bind an Azure Cosmos DB to your Azure Spring Cloud application
description: In this tutorial, learn how to bind Azure Cosmos DB to your Azure Spring Cloud application
author: bmitchell287
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 10/06/2019
ms.author: brendm

---

# Bind an Azure Cosmos DB database to your Azure Spring Cloud application

Instead of manually configuring your Spring Boot applications, you can automatically bind select Azure services to your applications by using Azure Spring Cloud. This article demonstrates how to bind your application to an Azure Cosmos DB database.

Prerequisites:

* A deployed Azure Spring Cloud instance. Follow our [quickstart on deploying via the Azure CLI](spring-cloud-quickstart-launch-app-cli.md) to get started.
* An Azure Cosmos DB account with a minimum permission level of Contributor.

## Bind Azure Cosmos DB

Azure Cosmos DB has five different API types that support binding. The following procedure shows how to use them:

1. Create an Azure Cosmos DB database. Refer to the quickstart on [creating a database](https://docs.microsoft.com/azure/cosmos-db/create-cosmosdb-resources-portal) for help. 

1. Record the name of your database. For this procedure, the database name is **testdb**.

1. Add one of the following dependencies to your Azure Spring Cloud application's pom.xml file. Choose the dependency that is appropriate for your API type.

    * API type: Core (SQL)

      ```xml
      <dependency>
          <groupId>com.microsoft.azure</groupId>
          <artifactId>azure-cosmosdb-spring-boot-starter</artifactId>
          <version>2.1.6</version>
      </dependency>
      ```

    * API type: MongoDB

      ```xml
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-data-mongodb</artifactId>
      </dependency>
      ```

    * API type: Cassandra

      ```xml
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-data-cassandra</artifactId>
      </dependency>
      ```

    * API type: Gremlin (graph)

      ```xml
      <dependency>
          <groupId>com.microsoft.spring.data.gremlin</groupId>
          <artifactId>spring-data-gremlin</artifactId>
          <version>2.1.7</version>
      </dependency>
      ```

    * API type: Azure Table

      ```xml
      <dependency>
          <groupId>com.microsoft.azure</groupId>
          <artifactId>azure-storage-spring-boot-starter</artifactId>
          <version>2.0.5</version>
      </dependency>
      ```

1. Use `az spring-cloud app update` to update the current deployment, or use `az spring-cloud app deployment create` to create a new deployment. These commands will either update or create the application with the new dependency.

1. Go to your Azure Spring Cloud service page in the Azure portal. Go to **Application Dashboard** and select the application to bind to Azure Cosmos DB. This application is the same one you updated or deployed in the previous step.

1. Select **Service binding**, and select **Create service binding**. To fill out the form, select:
   * The **Binding type** value **Azure Cosmos DB**.
   * The API type.
   * Your database name.
   * The Azure Cosmos DB account.

    > [!NOTE]
    > If you are using Cassandra, use a key space for the database name.

1. Restart the application by selecting **Restart** on the application page.

1. To ensure the service is bound correctly, select the binding name and verify its details. The `property` field should be similar to this example:

    ```
    azure.cosmosdb.uri=https://<some account>.documents.azure.com:443
    azure.cosmosdb.key=abc******
    azure.cosmosdb.database=testdb
    ```

## Next steps

In this tutorial, you learned how to bind your Azure Spring Cloud application to an Azure Cosmos DB database. To learn how to bind your application to an Azure Cache for Redis cache, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Learn how to bind to an Azure Cache for Redis cache](spring-cloud-tutorial-bind-redis.md)
