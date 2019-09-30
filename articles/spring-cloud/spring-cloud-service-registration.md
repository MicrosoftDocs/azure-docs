---
title:  Service discovery and registration using Eureka
description: Learn how to discover and register your Spring Cloud services using Eureka
author:  jpconnock

ms.service: spring-cloud
ms.topic: conceptual
ms.date: 9/27/2019
ms.author: jeconnoc
---
# Discover and register your Spring Cloud services using Eureka

Service Discovery is a key requirement for a microservice-based architecture.  Configuring each client manually takes time and introduce the possibility of human error.  Azure Spring Cloud offers service discovery through Eureka to solve this problem.  Once configured, a Eureka server will control service registration and discovery for your application's microservices. The Eureka server maintains a registry of the deployed microservices.  This service enables client-side load-balancing and decouples service providers from clients without relying on DNS.

## Enable service discovery using Eureka

Before your application can manage service registraton and discovery using Eureka, several dependencies must be included in the application's *pom.xml* file.

To begin, we add a snapshot repository to the *repository* section of your *pom.xml*

```xml
    <repositories>
        <repository>
            <id>nexus-snapshots</id>
            <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>
    </repositories>
```

Next, we include dependencies for *spring-cloud-starter-netflix-eureka-client* and *spring-cloud-starter-azure-spring-cloud-client* to your *pom.xml*

```xml
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-starter-azure-spring-cloud-client</artifactId>
        <version>2.1.0-SNAPSHOT</version>
    </dependency>
```

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

The Eureka server endpoint will be injected as an environment variable in your application.  Microservices will now be able to register themselves with the Eureka server and discover other dependent microservices.

Note that it can take a few minutes for the changes to propagate from the server to all microservices.
