---
title: How to configure a Spring Boot Initializer app to use Redis Cache
description: Learn how to configure a Spring Boot application created with the Spring Initializr to use Azure Redis Cache.
services: redis-cache
documentationcenter: java
author: rmcmurray
manager: cfowler
editor: ''
keywords: Spring, Spring Boot Starter, Redis Cache

ms.assetid:
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache-redis
ms.devlang: java
ms.topic: article
ms.date: 08/31/2017
ms.author: robmcm;zhijzhao;yidon
---

# How to configure a Spring Boot Initializer app to use Redis Cache

## Overview

The **[Spring Framework]** is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications. To help developers get started with Spring Boot, several sample Spring Boot packages are available at <https://github.com/spring-guides/>. In addition to choosing from the list of basic Spring Boot projects, the **[Spring Initializr]** helps developers get started with creating custom Spring Boot applications.

This article walks you through creating a Redis cache using the Azure portal, then using the **Spring Initializr** to create a custom application, and then creating a Java web application that stores and retrieves data using your Redis cache.

## Prerequisites

The following prerequisites are required in order to follow the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].

* A [Java Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/), version 1.7 or later.

* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

## Create a Redis cache on Azure

1. Browse to the Azure portal at <https://portal.azure.com/> and click the item for **+New**.

   ![Azure portal][AZ01]

1. Click **Database**, and then click **Redis Cache**.

   ![Azure portal][AZ02]

1. On the **New Redis Cache** page, specify the following information:

   * Enter the **DNS name** for your cache.
   * Specify your **Subscription**, **Resource group**, **Location**, and **Pricing tier**.
   * For this tutorial, choose **Unblock port 6379**.

   > [!NOTE]
   >
   > You can use SSL with Redis caches, but you would need to use a different Redis client like Jedis. For more information, see [How to use Azure Redis Cache with Java][Redis Cache with Java].
   >

   When you have specified these options, click **Create** to create your cache.

   ![Azure portal][AZ03]

1. Once your cache has been completed, you will see it listed on your Azure **Dashboard**, as well as under the **All Resources**, and **Redis Caches** pages. You can click on your cache on any of those locations to open the properties page for your cache.

   ![Azure portal][AZ04]

1. When the page that contains the list of properties for your cache is displayed, click **Access keys** and copy your access keys for your cache.

   ![Azure portal][AZ05]

## Create a custom application using the Spring Initializr

1. Browse to <https://start.spring.io/>.

1. Specify that you want to generate a **Maven** project with **Java**, enter the **Group** and **Aritifact** names for your application, and then click the link to **Switch to the full version** of the Spring Initializr.

   ![Basic Spring Initializr options][SI01]

   > [!NOTE]
   >
   > The Spring Initializr will use the **Group** and **Aritifact** names to create the package name; for example: *com.contoso.myazuredemo*.
   >

1. Scroll down to the **Web** section and check the box for **Web**, then scroll down to the **NoSQL** section and check the box for **Redis**, then scroll to the bottom of the page and click the button to **Generate Project**.

   ![Full Spring Initializr options][SI02]

1. When prompted, download the project to a path on your local computer.

   ![Download custom Spring Boot project][SI03]

1. After you have extracted the files on your local system, your custom Spring Boot application will be ready for editing.

   ![Custom Spring Boot project files][SI04]

## Configure your custom Spring Boot to use your Redis Cache

1. Locate the *application.properties* file in the *resources* directory of your app, or create the file if it does not already exist.

   ![Locate the application.properties file][RE01]

1. Open the *application.properties* file in a text editor, and add the following lines to the file, and replace the sample values with the appropriate properties from your cache:

   ```yaml
   # Specify the DNS URI of your Redis cache.
   spring.redis.host=myspringbootcache.redis.cache.windows.net

   # Specify the port for your Redis cache.
   spring.redis.port=6379

   # Specify the access key for your Redis cache.
   spring.redis.password=57686f6120447564652c2049495320526f636b73=
   ```

   ![Editing the application.properties file][RE02]

   > [!NOTE]
   >
   > If you were using a different Redis client like Jedis that enables SSL, you would specify port 6380 in your *application.properties* file. For more information, see [How to use Azure Redis Cache with Java][Redis Cache with Java].
   >

1. Save and close the *application.properties* file.

1. Create a folder named *controller* under the source folder for your package; for example:

   `C:\SpringBoot\myazuredemo\src\main\java\com\contoso\myazuredemo\controller`

   -or-

   `/users/example/home/myazuredemo/src/main/java/com/contoso/myazuredemo/controller`

1. Create a new file named *HelloController.java* in the *controller* folder. Open the file in a text editor and add the following code to it:

   ```java
   package com.contoso.myazuredemo;

   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.data.redis.core.StringRedisTemplate;
   import org.springframework.data.redis.core.ValueOperations;

   @RestController
   public class HelloController {
   
      @Autowired
      private StringRedisTemplate template;

      @RequestMapping("/")
      // Define the Hello World controller.
      public String hello() {
      
         ValueOperations<String, String> ops = this.template.opsForValue();

         // Add a Hello World string to your cache.
         String key = "greeting";
         if (!this.template.hasKey(key)) {
             ops.set(key, "Hello World!");
         }

         // Return the string from your cache.
         return ops.get(key);
      }
   }
   ```
   
   Where you will need to replace `com.contoso.myazuredemo` with the package name for your project.

1. Save and close the *HelloController.java* file.

1. Build your Spring Boot application with Maven and run it; for example:

   ```shell
   mvn clean package
   mvn spring-boot:run
   ```

1. Test the web app by browsing to http://localhost:8080 using a web browser, or use the syntax like the following example if you have curl available:

   ```shell
   curl http://localhost:8080
   ```

   You should see the "Hello World!" message from your sample controller displayed, which is being retrieved dynamically from your Redis cache.

## Next steps

For more information about using Spring Boot applications on Azure, see the following articles:

* [Deploy a Spring Boot Application to the Azure App Service](../app-service/app-service-deploy-spring-boot-web-app-on-azure.md)

* [Running a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](../container-service/container-service-deploy-spring-boot-app-on-kubernetes.md)

For more information about using Azure with Java, see the [Azure Java Developer Center] and the [Java Tools for Visual Studio Team Services].

For more information about getting started using Redis Cache with Java on Azure, see [How to use Azure Redis Cache with Java][Redis Cache with Java].

<!-- URL List -->

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/
[Redis Cache with Java]: cache-java-get-started.md

<!-- IMG List -->

[AZ01]: ./media/cache-java-spring-boot-initializer-with-redis-cache/AZ01.png
[AZ02]: ./media/cache-java-spring-boot-initializer-with-redis-cache/AZ02.png
[AZ03]: ./media/cache-java-spring-boot-initializer-with-redis-cache/AZ03.png
[AZ04]: ./media/cache-java-spring-boot-initializer-with-redis-cache/AZ04.png
[AZ05]: ./media/cache-java-spring-boot-initializer-with-redis-cache/AZ05.png

[SI01]: ./media/cache-java-spring-boot-initializer-with-redis-cache/SI01.png
[SI02]: ./media/cache-java-spring-boot-initializer-with-redis-cache/SI02.png
[SI03]: ./media/cache-java-spring-boot-initializer-with-redis-cache/SI03.png
[SI04]: ./media/cache-java-spring-boot-initializer-with-redis-cache/SI04.png

[RE01]: ./media/cache-java-spring-boot-initializer-with-redis-cache/RE01.png
[RE02]: ./media/cache-java-spring-boot-initializer-with-redis-cache/RE02.png
