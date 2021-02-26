---
title:  Automate service registry and discovery 
description: Learn how to automate service discovery and registration using Spring Cloud Service Registry
author:  bmitchell287
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 09/08/2020
ms.author: brendm
ms.custom: devx-track-java
zone_pivot_groups: programming-languages-spring-cloud
---

# Discover and register your Spring Cloud services

Service Discovery is a key requirement for a microservice-based architecture.  Configuring each client manually takes time and introduces the possibility of human error.  Azure Spring Cloud Service Registry solves this problem.  Once configured, a Service Registry server will control service registration and discovery for your application's microservices. The Service Registry server maintains a registry of the deployed microservices, enables client-side load-balancing, and decouples service providers from clients without relying on DNS.

::: zone pivot="programming-language-csharp"
For information about how to set up service registration for a Steeltoe app, see [Prepare a Java Spring application for deployment in Azure Spring Cloud](spring-cloud-tutorial-prepare-app-deployment.md).
::: zone-end
::: zone pivot="programming-language-java"

## Register your application using Spring Cloud Service Registry

Before your application can manage service registration and discovery using Spring Cloud Service Registry, several dependencies must be included in the application's *pom.xml* file.
Include dependencies for *spring-cloud-starter-netflix-eureka-client* and *spring-cloud-starter-azure-spring-cloud-client* to your *pom.xml*

```xml
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-starter-azure-spring-cloud-client</artifactId>
        <version>2.1.0</version>
    </dependency>
```

## Update the top level class

Finally, we add an annotation to the top level class of your application

 ```java
    package foo.bar;

    import org.springframework.boot.SpringApplication;
    import org.springframework.cloud.client.SpringCloudApplication;

    @SpringCloudApplication
    public class DemoApplication {
        public static void main(String... args) {
            SpringApplication.run(DemoApplication.class, args);
        }
    }
 ```

The Spring Cloud Service Registry server endpoint will be injected as an environment variable in your application.  Microservices will now be able to register themselves with the Service Registry server and discover other dependent microservices.

Note that it can take a few minutes for the changes to propagate from the server to all microservices.
::: zone-end
