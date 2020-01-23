---
title: Tutorial - Bind Azure Cache for Redis to your Azure Spring Cloud application
description: This tutorial shows you how to bind Azure Cache for Redis to your Azure Spring Cloud application
author: bmitchell287
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 10/31/2019
ms.author: brendm

---

# Bind Azure Cache for Redis to your Azure Spring Cloud application 

Instead of manually configuring your Spring Boot applications, you can automatically bind select Azure services to your applications by using Azure Spring Cloud. This article shows how to bind your application to Azure Cache for Redis.

## Prerequisites

* A deployed Azure Spring Cloud instance
* An Azure Cache for Redis service instance
* The Azure Spring Cloud extension for the Azure CLI

If you don't have a deployed Azure Spring Cloud instance, follow the steps in the [quickstart on deploying an Azure Spring Cloud app](spring-cloud-quickstart-launch-app-portal.md).

## Bind Azure Cache for Redis

1. Add the following dependency to your project's pom.xml file:

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
    </dependency>
    ```
1. Remove any `spring.redis.*` properties from the `application.properties` file

1. Update the current deployment using `az spring-cloud app update` or create a new deployment using `az spring-cloud app deployment create`.

1. Go to your Azure Spring Cloud service page in the Azure portal. Go to **Application Dashboard** and select the application to bind to Azure Cache for Redis. This application is the same one you updated or deployed in the previous step.

1. Select **Service binding** and select **Create service binding**. Fill out the form, being sure to select the **Binding type** value **Azure Cache for Redis**, your Azure Cache for Redis server, and the **Primary** key option.

1. Restart the app. The binding should now work.

1. To ensure the service binding is correct, select the binding name and verify its details. The `property` field should look like this:
    ```
    spring.redis.host=some-redis.redis.cache.windows.net
    spring.redis.port=6380
    spring.redis.password=abc******
    spring.redis.ssl=true
    ```

## Next steps

In this tutorial, you learned how to bind your Azure Spring Cloud application to Azure Cache for Redis. To learn more about binding services to your application, continue to the tutorial on binding an application to an Azure Database for MySQL instance.

> [!div class="nextstepaction"]
> [Learn how to bind to an Azure Database for MySQL instance](spring-cloud-tutorial-bind-mysql.md)
