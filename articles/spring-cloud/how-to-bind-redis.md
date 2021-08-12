---
title: Bind Azure Cache for Redis to your Azure Spring Cloud application
description: Learn how to bind Azure Cache for Redis to your Azure Spring Cloud application
author: karlerickson
ms.service: spring-cloud
ms.topic: how-to
ms.date: 10/31/2019
ms.author: karler
ms.custom: devx-track-java
---

# Bind Azure Cache for Redis to your Azure Spring Cloud application 

**This article applies to:** ✔️ Java

Instead of manually configuring your Spring Boot applications, you can automatically bind select Azure services to your applications by using Azure Spring Cloud. This article shows how to bind your application to Azure Cache for Redis.

## Prerequisites

* A deployed Azure Spring Cloud instance
* An Azure Cache for Redis service instance
* The Azure Spring Cloud extension for the Azure CLI

If you don't have a deployed Azure Spring Cloud instance, follow the steps in the [quickstart on deploying an Azure Spring Cloud app](./quickstart.md).

## Prepare your Java project

1. Add the following dependency to your project's pom.xml file:

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
    </dependency>
    ```

1. Remove any `spring.redis.*` properties from the `application.properties` file

1. Update the current deployment using `az spring-cloud app update` or create a new deployment using `az spring-cloud app deployment create`.

## Bind your app to the Azure Cache for Redis

#### [Service Binding](#tab/Service-Binding)
1. Go to your Azure Spring Cloud service page in the Azure portal. Go to **Application Dashboard** and select the application to bind to Azure Cache for Redis. This application is the same one you updated or deployed in the previous step.

1. Select **Service binding** and select **Create service binding**. Fill out the form, being sure to select the **Binding type** value **Azure Cache for Redis**, your Azure Cache for Redis server, and the **Primary** key option.

1. Restart the app. The binding should now work.

1. To ensure the service binding is correct, select the binding name and verify its details. The `property` field should look like this:

    ```properties
    spring.redis.host=some-redis.redis.cache.windows.net
    spring.redis.port=6380
    spring.redis.password=abc******
    spring.redis.ssl=true
    ```

#### [Terraform](#tab/Terraform)

The following Terraform script shows how to set up an Azure Spring Cloud app with Azure Cache for Redis.

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

resource "azurerm_redis_cache" "redis" {
  name                = "redis-${var.application_name}-001"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
  capacity            = 0
  family              = "C"
  sku_name            = "Standard"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"
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
    "spring.redis.host"     = azurerm_redis_cache.redis.hostname
    "spring.redis.password" = azurerm_redis_cache.redis.primary_access_key
    "spring.redis.port"     = "6380"
    "spring.redis.ssl"      = "true"
  }
}

resource "azurerm_spring_cloud_active_deployment" "example" {
  spring_cloud_app_id = azurerm_spring_cloud_app.example.id
  deployment_name     = azurerm_spring_cloud_java_deployment.example.name
}
```

---

## Next steps

In this article, you learned how to bind your Azure Spring Cloud application to Azure Cache for Redis. To learn more about binding services to your application, see [Bind to an Azure Database for MySQL instance](./how-to-bind-mysql.md).
