---
title: How to bind Azure Database for MySQL to your Azure Spring Cloud application | Microsoft Docs
description: This article will show you how to bind Azure MySQL to your Azure Spring Cloud application
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---

# Bind Azure services to your Azure Spring Cloud application: Azure Database for MySQL

Azure Spring Cloud allows you to bind select Azure services to your applications automatically, instead of manually configuring your Spring Boot application code. This tutorial will show you how to bind your application to Azure MySQL.

## Prerequisites

* A deployed Azure Spring Cloud instance
* An Azure Database for MySQL account
* Azure CLI


## Bind Azure Database for MySQL

1. Note the admin username and password of your Azure MySQL account. Then connect to server and create a database named `testdb` from a MySQL client. Create a new non-admin account if needed.

1. Add the following dependency in your project's `pom.xml`
    ```
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    ```
1. Remove `spring.datasource.*` properties, if any, in the `application.properties` file.

1. Update current deployment by `az spring-cloud app update` or create a new one for this change by `az spring-cloud app deployment create`.

1. Go to your Azure Spring Cloud service page in the Azure portal. Then go to the **Application Dashboard** and click the application which you want to bind to Azure MySQL (the same application you updated or deployed in the previous step). Next, choose `Service binding` and click the `Create service binding` button. Fill out the form, being sure to select **Binding type** `Azure MySQL`, the same database name you used earlier, and the same username and password you noted in the first step.

1. Restart the app and this binding should work now.

1. To check whether the service binding is correct, click the binding name and verify its detail. The `property` field should be like this:
    ```
    spring.datasource.url=jdbc:mysql://some-server.mysql.database.azure.com:3306/testdb?useSSL=true&requireSSL=false&useLegacyDatetimeCode=false&serverTimezone=UTC
    spring.datasource.username=admin@some-server
    spring.datasource.password=abc******
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
    ```