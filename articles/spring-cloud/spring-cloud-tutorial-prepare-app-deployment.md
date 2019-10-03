---
title: Prepare a Java Spring application for deployment | Microsoft Docs
description: In this quickstart, you prepare a Java Spring application for deployment.
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---
# Quickstart: Prepare a Java Spring application for deployment in Azure Spring Cloud

This quickstart shows you how to prepare an existing Java Spring Cloud application for deployment to Azure Spring Cloud. In order for Azure Spring Cloud to work optimally, these preparations are essential. Particularly, Azure Spring Cloud has several Spring Cloud features baked directly into the service; for them to work, some dependencies need to be added to your application. When you're finished, you can move on to provisioning your Azure Spring Cloud service.

## Java Runtime Version

Only Spring/Java applications can run in Azure Spring Cloud.

Both Java 8 and Java 11 are supported. The latest Azul Zulu OpenJDK for Azure are used in the hosting environment. Find more details about Azul Zulu OpenJDK for Azure at [here](https://docs.microsoft.com/en-us/azure/java/jdk/java-jdk-install).

## Spring Boot and Spring Cloud versions

Only Spring Boot apps are supported in Azure Spring Cloud. Both Spring Boot 2.0 and 2.1 are supported. Supported Spring Boot and Spring Cloud combinations are listed in below table.

Spring Boot version | Spring Cloud version
---|---
2.0.x | Finchley.RELEASE
2.1.x | Greenwich.RELEASE

Verify your `pom.xml` file has the Spring Boot and Spring Cloud dependenices based on your version.

2.0:


```xml
    <!-- Spring Boot dependencies -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.0.9.RELEASE</version>
    </parent>

    <!-- Spring Cloud dependencies -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Finchley.SR4</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```

2.1:

```xml
    <!-- Spring Boot dependencies -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.8.RELEASE</version>
    </parent>

    <!-- Spring Cloud dependencies -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Greenwich.SR3</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```

## Azure Spring Cloud client dependency

Azure Spring Cloud hosts and manages Spring Cloud components for you, such as Spring Cloud Service Registry and Spring Cloud Config Server. You need to include Azure Spring Cloud's client library in your dependencies to correctly communicate with Azure Spring Cloud service instance.

Include below snippet in `pom.xml`:

> NOTE:
> `nexus-snapshots` will not be required once we have an official preview version released to Maven Central.

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
    
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-starter-azure-spring-cloud-client</artifactId>
        <version>2.1.0-SNAPSHOT</version>
    </dependency>
```

Refer to below table to find the correct version for your Spring Boot/Spring Cloud app.

Spring Boot version | Spring Cloud version | Azure Spring Cloud version
---|---|---
2.0.x | Finchley.RELEASE | 2.0.0-SNAPSHOT
2.1.x | Greenwich.RELEASE | 2.1.0-SNAPSHOT

## Other required dependencies

To fully utilize the built-in features of Azure Managed Service for Spring Cloud, your application needs to include below dependencies. Then your application will be automatically wired up with each component (Eureka Server, Config Server etc.).


### Service Registry
To use the managed Eureka Server in Azure Spring Cloud, you need to include `spring-cloud-starter-netflix-eureka-client` in `POM.xml` as below.
The endpoint of the managed Eureka Server will be automatically injected as environment variables with your app. Then applications will be able to register themselves with Eureka server and discover other dependent microservices.

```xml
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
```

### Distributed Configuration

To enable Distributed Configuration, include spring-cloud-config-client in the dependencies section of your pom.xml as below.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-client</artifactId>
</dependency>
```

> [!NOTE]
> Don't specify `spring.cloud.config.enabled=false` in bootstrap configuration, as it will stop the application from working with config server. 

### Metrics

Include spring-boot-starter-actuator in the dependencies section of your pom.xml as below. Metrics will be periodically pulled from the JMX endpoints and can be visualized from Azure Portal.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Distributed Tracing

Include spring-cloud-starter-sleuth and spring-cloud-starter-zipkin in the dependencies section of your pom.xml as below. Also, you need to enable an Azure App Insights instance to work with your Azure Spring Cloud service instance. Read more on how to enable App Insights with Azure Spring Cloud [here](./spring-cloud-tutorial-distributed-tracing).

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
</dependency>
```
