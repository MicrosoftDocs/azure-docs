---
title: Tutorial - How to bind an Azure Database for MySQL instance to your Azure Spring Cloud application
description: This tutorial will show you how to bind an Azure Database for MySQL instance to your Azure Spring Cloud application
author: bmitchell287
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 11/04/2019
ms.author: brendm

---

# Tutorial: Bind an Azure Database for MySQL instance to your Azure Spring Cloud application 

With Azure Spring Cloud, you can bind select Azure services to your applications automatically, instead of having to configure your Spring Boot application manually. This tutorial shows you how to bind your application to your Azure Database for MySQL instance.

## Prerequisites

* A deployed Azure Spring Cloud instance
* An Azure Database for MySQL account
* Azure CLI

If you don't have a deployed Azure Spring Cloud instance, follow the instructions in [Quickstart: Launch an Azure Spring Cloud application by using the Azure portal](spring-cloud-quickstart-launch-app-portal.md) to deploy your first Spring Cloud app.

## Bind your app to your Azure Database for MySQL instance

1. Note the admin username and password of your Azure Database for MySQL account. 

1. Connect to the server, create a database named **testdb** from a MySQL client, and then create a new non-admin account.

1. In your project's *pom.xml* file, add the following dependency:

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    ```
1. In the *application.properties* file, remove any `spring.datasource.*` properties.

1. Update the current deployment by running `az spring-cloud app update`, or create a new deployment for this change by running `az spring-cloud app deployment create`.  These commands either update or create the application with the new dependency.

1. In the Azure portal, on your **Azure Spring Cloud** service page, look for the **Application Dashboard**, and then select the application to bind to your Azure Database for MySQL instance.  This is the same application that you updated or deployed in the previous step. 

1. Select **Service binding**, and then select the **Create service binding** button. 

1. Fill out the form, selecting **Azure MySQL** as the **Binding type**, using the same database name you used earlier, and using the same username and password you noted in the first step.

1. Restart the app, and this binding should now work.

1. To ensure that the service binding is correct, select the binding name, and then verify its detail. The `property` field should look like this:
    ```
    spring.datasource.url=jdbc:mysql://some-server.mysql.database.azure.com:3306/testdb?useSSL=true&requireSSL=false&useLegacyDatetimeCode=false&serverTimezone=UTC
    spring.datasource.username=admin@some-server
    spring.datasource.password=abc******
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
    ```

## Next steps

In this tutorial, you learned how to bind your Azure Spring Cloud application to an Azure Database for MySQL instance.  To learn more about managing your Azure Spring Cloud service, see the article about service discovery and registration.

> [!div class="nextstepaction"]
> [Enable service discovery and registration by using the Spring Cloud Service Registry](spring-cloud-service-registration.md)
