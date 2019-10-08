---
title: How to bind Azure Cache for Redis to your Azure Spring Cloud application | Microsoft Docs
description: Learn how to bind Azure Cache for Redis to your Azure Spring Cloud application
services: spring-cloud
author: v-vasuke
manager: gwallace
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/06/2019
ms.author: v-vasuke

---

# Tutorial: Bind Azure services to your Azure Spring Cloud application: Azure Cache for Redis

Azure Spring Cloud allows you to bind select Azure services to your applications automatically, instead of manually configuring your Spring Boot application. This article demonstrates how to bind your application to Azure Cache for Redis.

## Prerequisites

* A deployed Azure Spring Cloud instance
* An Azure Cache for Redis service instance
* Azure Spring Cloud extension for the Azure CLI

If necessary, install the Azure Spring Cloud extension for the Azure CLI using the following command:

```azurecli
az extension add -y --source https://azureclitemp.blob.core.windows.net/spring-cloud/spring_cloud-0.1.0-py2.py3-none-any.whl
```

>[!TIP]
> The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article.  It has common Azure tools preinstalled, including the latest versions of Git, JDK, Maven, and the Azure CLI. If you are logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com.  You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

## Bind Azure Cache for Redis

1. Add the following dependency in your project's `pom.xml`

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
    </dependency>
    ```
1. Remove `spring.redis.*` properties, if any, in the `application.properties` file

1. Update the current deployment using `az spring-cloud app update` or create a new deployment using `az spring-cloud app deployment create`.

1. Go to your Azure Spring Cloud service page in the Azure portal. Find the **Application Dashboard** and select the application to bind to the Azure Cache for Redis .  This is the same application you updated or deployed in the previous step. Next, choose `Service binding` and select the `Create service binding` button. Fill out the form, being sure to select **Binding type** `Azure Cache for Redis`, your Redis server, and the Primary key option. 

1. Restart the app and this binding should work now.

1. To ensure the service binding is correct, select the binding name and verify its details. The `property` field should look like this:
    ```
    spring.redis.host=some-redis.redis.cache.windows.net
    spring.redis.port=6380
    spring.redis.password=abc******
    spring.redis.ssl=true
    ```

## Next steps

In this tutorial, you learned how to bind your Azure Spring Cloud application to an Azure Redis cache.  To learn more about binding services to your application, continue to the tutorial for binding an application to a MySQL DB.

> [!div class="nextstepaction"]
> [Learn how to bind an Azure MySql service to your Azure Spring Cloud service](spring-cloud-tutorial-bind-mysql.md).