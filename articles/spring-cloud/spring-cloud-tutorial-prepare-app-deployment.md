---
title: Tutorial - Prepare a Spring application for deployment in Azure Spring Cloud
description: In this tutorial, you prepare a Java Spring application for deployment.
author: bmitchell287
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 10/06/2019
ms.author: brendm

---
# Prepare a Java Spring application for deployment in Azure Spring Cloud

This quickstart shows how to prepare an existing Java Spring Cloud application for deployment to Azure Spring Cloud. If configured properly, Azure Spring Cloud provides robust services to monitor, scale, and update your Java Spring Cloud application.

## Java Runtime version

Only Spring/Java applications can run in Azure Spring Cloud.

Azure Spring Cloud supports both Java 8 and Java 11. The hosting environment contains the latest version of Azul Zulu OpenJDK for Azure. For more information about Azul Zulu OpenJDK for Azure, see [Install the JDK](https://docs.microsoft.com/azure/java/jdk/java-jdk-install).

## Spring Boot and Spring Cloud versions

Azure Spring Cloud supports only Spring Boot apps. It supports both Spring Boot version 2.0 and version 2.1. The following table lists the supported Spring Boot and Spring Cloud combinations:

Spring Boot version | Spring Cloud version
---|---
2.0 | Finchley.RELEASE
2.1 | Greenwich.RELEASE

Verify that your pom.xml file has the correct Spring Boot and Spring Cloud dependencies based on your Spring Boot version.

### Dependencies for Spring Boot version 2.0

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

### Dependencies for Spring Boot version 2.1

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

Azure Spring Cloud hosts and manages Spring Cloud components for you. Such components include Spring Cloud Service Registry and Spring Cloud Config Server. Include the Azure Spring Cloud client library in your dependencies to allow communication with your Azure Spring Cloud service instance.

The following table lists the correct Azure Spring Cloud versions for your app that uses Spring Boot and Spring Cloud.

Spring Boot version | Spring Cloud version | Azure Spring Cloud version
---|---|---
2.0 | Finchley.RELEASE | 2.0
2.1 | Greenwich.RELEASE | 2.1

Include one of the following dependencies in your pom.xml file. Select the dependency whose Azure Spring Cloud version matches your own.

### Dependency for Azure Spring Cloud version 2.0

```xml
<dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-starter-azure-spring-cloud-client</artifactId>
        <version>2.0.0</version>
</dependency>
```

### Dependency for Azure Spring Cloud version 2.1

```xml
<dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-starter-azure-spring-cloud-client</artifactId>
        <version>2.1.0</version>
</dependency>
```

## Other required dependencies

To enable the built-in features of Azure Spring Cloud, your application must include the following dependencies. This inclusion ensures that your application configures itself correctly with each component.  

### Service Registry dependency

To use the managed Azure Service Registry service, include the `spring-cloud-starter-netflix-eureka-client` dependency in the pom.xml file as shown here:

```xml
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
```

The endpoint of the Service Registry server is automatically injected as environment variables with your app. Applications can register themselves with the Service Registry server and discover other dependent microservices.

### Distributed Configuration dependency

To enable Distributed Configuration, include the following `spring-cloud-config-client` dependency in the dependencies section of your pom.xml file:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-client</artifactId>
</dependency>
```

> [!WARNING]
> Don't specify `spring.cloud.config.enabled=false` in your bootstrap configuration. Otherwise, your application stops working with Config Server.

### Metrics dependency

Include the `spring-boot-starter-actuator` dependency in the dependencies section of your pom.xml file as shown here:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

 Metrics are periodically pulled from the JMX endpoints. You can visualize the metrics by using the Azure portal.

### Distributed Tracing dependency

Include the following `spring-cloud-starter-sleuth` and `spring-cloud-starter-zipkin` dependencies in the dependencies section of your pom.xml file:

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

 You also need to enable an Azure Application Insights instance to work with your Azure Spring Cloud service instance. Read the [tutorial on distributed tracing](spring-cloud-tutorial-distributed-tracing.md) to learn how to use Application Insights with Azure Spring Cloud.

## Next steps

In this tutorial, you learned how to configure your Java Spring application for deployment to Azure Spring Cloud. To learn how to set up a Config Server instance, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Learn how to set up a Config Server instance](spring-cloud-tutorial-config-server.md)

More samples are available on GitHub: [Azure Spring Cloud Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/service-binding-cosmosdb-sql).
