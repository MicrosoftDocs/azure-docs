---
title: Bind Azure Cache for Redis to your application in Azure Spring Apps
description: Learn how to bind Azure Cache for Redis to your application in Azure Spring Apps
author: karlerickson
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/31/2019
ms.author: karler
ms.custom: devx-track-java, event-tier1-build-2022, service-connector
---

# Bind Azure Cache for Redis to your application in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

Instead of manually configuring your Spring Boot applications, you can automatically bind select Azure services to your applications by using Azure Spring Apps. This article shows how to bind your application to Azure Cache for Redis.

## Prerequisites

* A deployed Azure Spring Apps instance
* An Azure Cache for Redis service instance
* The Azure Spring Apps extension for the Azure CLI

If you don't have a deployed Azure Spring Apps instance, follow the steps in the [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md).

## Prepare your Java project

1. Add the following dependency to your project's *pom.xml* file:

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
   </dependency>
   ```

1. Remove any `spring.redis.*` properties from the *application.properties* file

1. Update the current deployment using `az spring app update` or create a new deployment using `az spring app deployment create`.

## Bind your app to the Azure Cache for Redis

### [Service Connector](#tab/Service-Connector)

1. Use the Azure CLI to configure your Spring app to connect to a Redis database with an access key using the `az spring connection create` command, as shown in the following example.

   ```azurecli
   az spring connection create redis \
       --resource-group $AZURE_SPRING_APPS_RESOURCE_GROUP \
       --service $AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME \
       --app $APP_NAME \
       --deployment $DEPLOYMENT_NAME \
       --target-resource-group $REDIS_RESOURCE_GROUP \
       --server $REDIS_SERVER_NAME\
       --database $REDIS_DATABASE_NAME \
       --secret
   ```

   > [!NOTE]
   > If you're using [Service Connector](../service-connector/overview.md) for the first time, start by running the command `az provider register --namespace Microsoft.ServiceLinker` to register the Service Connector resource provider.
   >
   > If you're using Redis Enterprise, use the `az spring connection create redis-enterprise` command instead.

   > [!TIP]
   > Run the command `az spring connection list-support-types --output table` to get a list of supported target services and authentication methods for Azure Spring Apps. If the `az spring` command isn't recognized by the system, check that you have installed the required extension by running `az extension add --name spring`.

1. Alternately, you can use the Azure portal to configure this connection by completing the following steps. The Azure portal provides the same capabilities as the Azure CLI and provides an interactive experience.

   1. Select your Azure Spring Apps instance in the Azure portal and then select **Apps** from the navigation menu. Choose the app you want to connect and then select **Service Connector** on the navigation menu.

   1. Select **Create**.

   1. On the **Basics** tab, for service type, select Cache for Redis. Choose a subscription and a Redis cache server. Fill in the Redis database name ("0" in this example) and under client type, select Java. Select **Next: Authentication**.

   1. On the **Authentication** tab, choose **Connection string**. Service Connector will automatically retrieve the access key from your Redis database account. Select **Next: Networking**.

   1. On the **Networking** tab, select **Configure firewall rules to enable access to target service**, then select **Review + Create**.

   1. On the **Review + Create** tab, wait for the validation to pass and then select **Create**. The creation can take a few minutes to complete.

   1. Once the connection between your Spring app your Redis database has been generated, you can see it in the Service Connector page and select the unfold button to view the configured connection variables.

### [Service Binding](#tab/Service-Binding)

> [!NOTE]
> We recommend using Service Connector instead of Service Binding to connect your app to your database. Service Binding is going to be deprecated in favor of Service Connector. For instructions, see the Service Connector tab.

1. Go to your Azure Spring Apps service page in the Azure portal. Go to **Application Dashboard** and select the application to bind to Azure Cache for Redis. This application is the same one you updated or deployed in the previous step.

1. Select **Service binding** and select **Create service binding**. Fill out the form, being sure to select the **Binding type** value **Azure Cache for Redis**, your Azure Cache for Redis server, and the **Primary** key option.

1. Restart the app. The binding should now work.

1. To ensure the service binding is correct, select the binding name and verify its details. The `property` field should look like this:

   ```properties
   spring.redis.host=some-redis.redis.cache.windows.net
   spring.redis.port=6380
   spring.redis.password=abc******
   spring.redis.ssl=true
   ```

### [Terraform](#tab/Terraform)

The following Terraform script shows how to set up an Azure Spring Apps app with Azure Cache for Redis.

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
  quota {
    cpu    = "2"
    memory = "4Gi"
  }
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

In this article, you learned how to bind your application in Azure Spring Apps to Azure Cache for Redis. To learn more about binding services to your application, see [Bind to an Azure Database for MySQL instance](./how-to-bind-mysql.md).
