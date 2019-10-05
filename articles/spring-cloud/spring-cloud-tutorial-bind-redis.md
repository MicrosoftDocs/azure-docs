---
title: How to bind Azure Cache for Redis as a service to your Azure Spring Cloud application | Microsoft Docs
description: This article will show you how to bind Azure Cache for Redis to your Azure Spring Cloud application
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---

# Bind Azure services to your Azure Spring Cloud application: Azure Cache for Redis

Azure Spring Cloud allows you to bind select Azure services to your applications automatically, instead of manually configuring your Spring Boot application code. This tutorial will show you how to bind your application to Azure Cache for Redis.

## Prerequisites:
* A deployed Azure Spring Cloud instance
* An Azure Cache for Redis service instance
* Azure CLI


## Bind Azure Cache for Redis

1. Add the following dependency in your project's `pom.xml`
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
</dependency>
```
1. Remove `spring.redis.*` properties, if any, in the `application.properties` file

1. Update current deployment by `az spring-cloud app update` or create a new one for this change by `az spring-cloud app deployment create`.

1. Go to your Azure Spring Cloud service page in the Azure portal. Then go to the **Application Dashboard** and click the application which you want to bind to Azure Cache for Redis (the same application you updated or deployed in the previous step). Next, choose `Service binding` and click the `Create service binding` button. Fill out the form, being sure to select **Binding type** `Azure Cache for Redis`, your Redis server, and the Primary key option. 

1. Restart the app and this binding should work now.

1. To check whether the service binding is correct, click the binding name and verify its detail. The `property` field should be like this:
    ```
    spring.redis.host=some-redis.redis.cache.windows.net
    spring.redis.port=6380
    spring.redis.password=abc******
    spring.redis.ssl=true
    ```