---
title: How to bind Azure Cosmos DB as a service to your Azure Spring Cloud application | Microsoft Docs
description: This article will show you how to bind Azure Cosmos DB to your Azure Spring Cloud application
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/06/2019
ms.author: v-vasuke

---

# Bind Azure services to your Azure Spring Cloud application: Azure Cosmos DB

Azure Spring Cloud allows you to bind select Azure services to your applications automatically, instead of manually configuring your Spring Boot application code. This tutorial will show you how to bind your application to Azure Cosmos DB.

Prerequisites:
* A deployed Azure Spring Cloud instance
* An Azure Cosmos DB account with a minimum permissions level of contributor


## Bind Azure Cosmos DB

Cosmos DB has 5 different API types and all of them are supported for binding.

1. Create an Azure Cosmos DB database. If you need instructions on how to do that, [refer to this article](https://docs.microsoft.com/azure/cosmos-db/create-cosmosdb-resources-portal). Note the name of your database; ours is named `testdb`.

1. Add one of the following dependencies in your Spring Cloud application's `pom.xml` according to your API type.
    
    #### API type: Core (SQL)
    ```
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-cosmosdb-spring-boot-starter</artifactId>
        <version>2.1.6</version>
    </dependency>
    ```
    
    #### API type: MongoDB
    ```
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>
    ```

    #### API type: Cassandra
    ```
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-cassandra</artifactId>
    </dependency>
    ```

    #### API type: Gremlin (graph)
    ```
    <dependency>
        <groupId>com.microsoft.spring.data.gremlin</groupId>
        <artifactId>spring-data-gremlin</artifactId>
        <version>2.1.7</version>
    </dependency>
    ```

    #### API type: Azure Table
    ```
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-storage-spring-boot-starter</artifactId>
        <version>2.0.5</version>
    </dependency>
    ```

1. Apply the new dependency to your application by updating the current deployment or creating a new application. Instructions on how to do that can be found [here](spring-cloud-quickstart-launch-app-cli.md).

1. Go to your Azure Spring Cloud service page in the Azure portal. Then go to the **Application Dashboard** and click the application which you want to bind to Cosmos DB (the same application you updated or deployed in the previous step). Next, choose `Service binding` and click the `Create service binding` button. Fill out the form, being sure to select **Binding type** `Azure Cosmos DB`, the same API type you added the dependency for, the same database name you used earlier, and the same Cosmos DB account you used earlier.

> [!NOTE]
> Use a key space for the database name if you are using Cassandra
>

Here's an example screenshot for API type `Core(SQL)`. You may see slightly different parameters for other API types.

    ![Creating a binding for Cosmos DB(SQL)](../images/service-binding-cosmosdb.png)

1. Restart the application by clicking the **Restart** button on the application page.

1. To check whether the service binding is correct, click the binding name and verify its detail. The `property` field should be similar to this:
    ```
    azure.cosmosdb.uri=https:/<some account>.documents.azure.com:443
    azure.cosmosdb.key=abc******
    azure.cosmosdb.database=testdb
    ```

## Next steps

[Find out how to bind the Azure Cache for Redis service to your Azure Spring Cloud service](spring-cloud-tutorial-bind-redis.md).