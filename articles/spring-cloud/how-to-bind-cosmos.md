---
title: Bind an Azure Cosmos DB to your Azure Spring Cloud application
description: Learn how to bind Azure Cosmos DB to your Azure Spring Cloud application
author: karlerickson
ms.service: spring-cloud
ms.topic: how-to
ms.date: 10/06/2019
ms.author: karler
ms.custom: devx-track-java
---

# Bind an Azure Cosmos DB database to your Azure Spring Cloud application

**This article applies to:** ✔️ Java

Instead of manually configuring your Spring Boot applications, you can automatically bind select Azure services to your applications by using Azure Spring Cloud. This article demonstrates how to bind your application to an Azure Cosmos DB database.

Prerequisites:

* A deployed Azure Spring Cloud instance. Follow our [quickstart on deploying via the Azure CLI](./quickstart.md) to get started.
* An Azure Cosmos DB account with a minimum permission level of Contributor.

## Prepare your Java project

1. Add one of the following dependencies to your Azure Spring Cloud application's pom.xml file. Choose the dependency that is appropriate for your API type.

    * API type: Core (SQL)

      ```xml
      <dependency>
          <groupId>com.azure.spring</groupId>
          <artifactId>azure-spring-boot-starter-cosmos</artifactId>
          <version>3.6.0</version>
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

    * API type: Azure Table

      ```xml
      <dependency>
          <groupId>com.microsoft.azure</groupId>
          <artifactId>azure-storage-spring-boot-starter</artifactId>
          <version>2.0.5</version>
      </dependency>
      ```

1. Update the current app by running `az spring-cloud app deploy`, or create a new deployment for this change by running `az spring-cloud app deployment create`.

## Bind your app to the Azure Cosmos DB

#### [Service Binding](#tab/Service-Binding)
Azure Cosmos DB has five different API types that support binding. The following procedure shows how to use them:

1. Create an Azure Cosmos DB database. Refer to the quickstart on [creating a database](../cosmos-db/create-cosmosdb-resources-portal.md) for help. 

1. Record the name of your database. For this procedure, the database name is **testdb**.

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

#### [Terraform](#tab/Terraform)
The following Terraform script shows how to set up an Azure Spring Cloud app with Azure Cosmos DB MongoDB API.
```terraform
provider "azurerm" {
  features {}
}

variable "application_name" {
  type        = string
  description = "The name of your application"
  default     = "demo-abc"
}

resource "azurerm_resource_group" "example" {
  name     = "example-resources"
  location = "West Europe"
}

resource "azurerm_cosmosdb_account" "cosmosdb" {
  name                = "cosmosacct-${var.application_name}-001"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
  offer_type          = "Standard"
  kind                = "MongoDB"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    failover_priority = 0
    location          = azurerm_resource_group.example.location
  }
}

resource "azurerm_cosmosdb_mongo_database" "cosmosdb" {
  name                = "cosmos-${var.application_name}-001"
  resource_group_name = azurerm_cosmosdb_account.cosmosdb.resource_group_name
  account_name        = azurerm_cosmosdb_account.cosmosdb.name
}

resource "azurerm_spring_cloud_service" "example" {
  name                = "${var.application_name}"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
}

resource "azurerm_spring_cloud_app" "example" {
  name                = "${var.application_name}-app"
  resource_group_name = azurerm_resource_group.example.name
  service_name        = azurerm_spring_cloud_service.example.name
  is_public           = true
  https_only          = true
}

resource "azurerm_spring_cloud_java_deployment" "example" {
  name                = "default"
  spring_cloud_app_id = azurerm_spring_cloud_app.example.id
  cpu                 = 2
  memory_in_gb        = 4
  instance_count      = 2
  jvm_options         = "-XX:+PrintGC"
  runtime_version     = "Java_11"

  environment_variables = {
    "azure.cosmosdb.uri" : azurerm_cosmosdb_account.cosmosdb.connection_strings[0]
    "azure.cosmosdb.database" : azurerm_cosmosdb_mongo_database.cosmosdb.name
  }
}

resource "azurerm_spring_cloud_active_deployment" "example" {
  spring_cloud_app_id = azurerm_spring_cloud_app.example.id
  deployment_name     = azurerm_spring_cloud_java_deployment.example.name
}
```
---

## Next steps

In this article, you learned how to bind your Azure Spring Cloud application to an Azure Cosmos DB database. To learn more about binding services to your application, see [Bind to an Azure Cache for Redis cache](./how-to-bind-redis.md).
