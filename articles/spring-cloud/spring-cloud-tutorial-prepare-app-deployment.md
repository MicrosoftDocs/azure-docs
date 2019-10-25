---
title: Prepare a Spring application for deployment in Azure Spring Cloud | Microsoft Docs
description: In this quickstart, you prepare a Java Spring application for deployment.
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/06/2019
ms.author: v-vasuke

---
# Tutorial: Prepare a Java Spring application for deployment in Azure Spring Cloud

This quickstart shows you how to prepare an existing Java Spring Cloud application for deployment to Azure Spring Cloud.  Configured properly, Azure Spring Cloud provides robust services to monitor, scale, and update your Spring Cloud application. 

## Java Runtime Version

Only Spring/Java applications can run in Azure Spring Cloud.

Both Java 8 and Java 11 are supported. The hosting environment contains the latest Azul Zulu OpenJDK for Azure. Refer to [this article](https://docs.microsoft.com/azure/java/jdk/java-jdk-install) for more information about Azul Zulu OpenJDK for Azure. 

## Spring Boot and Spring Cloud versions

Only Spring Boot apps are supported in Azure Spring Cloud. Both Spring Boot 2.0 and 2.1 are supported. Supported Spring Boot and Spring Cloud combinations are listed in below table.

Spring Boot version | Spring Cloud version
---|---
2.0.x | Finchley.RELEASE
2.1.x | Greenwich.RELEASE

Verify your `pom.xml` file has the Spring Boot and Spring Cloud dependencies based on your version.

### Version 2.0:

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

### Version 2.1:

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

Azure Spring Cloud hosts and manages Spring Cloud components for you, such as the Spring Cloud Service Registry and the Spring Cloud Config Server. Include Azure Spring Cloud's client library in your dependencies to allow communication with your Azure Spring Cloud service instance.

The table below lists the correct versions for your Spring Boot/Spring Cloud app.

Spring Boot version | Spring Cloud version | Azure Spring Cloud version
---|---|---
2.0.x | Finchley.RELEASE | 2.0.0-SNAPSHOT
2.1.x | Greenwich.RELEASE | 2.1.0-SNAPSHOT

Include this snippet in  your `pom.xml` with the correct Azure Spring Cloud version in the 'dependency':

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

## Other required dependencies

To enable the built-in features of Azure Spring Cloud, your application must include the following dependencies. This will ensure that your application configures itself correctly with each component.  

### Service Registry

To use the managed Azure Service Registry service, include `spring-cloud-starter-netflix-eureka-client` in `POM.xml` as shown below.

The endpoint of the Service Registry server will be automatically injected as environment variables with your app. Applications will be able to register themselves with Service Registry server and discover other dependent microservices.

```xml
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
```

### Distributed Configuration

To enable Distributed Configuration, include `spring-cloud-config-client` in the dependencies section of your `pom.xml`.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-client</artifactId>
</dependency>
```

> [!WARNING]
> Don't specify `spring.cloud.config.enabled=false` in bootstrap configuration, as it will stop the application from working with the Config Server.

### Metrics

Include `spring-boot-starter-actuator` in the dependencies section of your pom.xml. Metrics will be periodically pulled from the JMX endpoints and can be visualized using the Azure portal.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Distributed Tracing

Include `spring-cloud-starter-sleuth` and `spring-cloud-starter-zipkin` in the dependencies section of your pom.xml as below. Also, you need to enable an Azure App Insights instance to work with your Azure Spring Cloud service instance. Read more on how to enable App Insights with Azure Spring Cloud [here](spring-cloud-tutorial-distributed-tracing.md)

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

## Next steps

In this tutorial, you learned how to configure your Java Spring application for deployment to Azure Spring Cloud.  To learn how to enable the Config Server, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Learn how to set up your Config Server](spring-cloud-tutorial-config-server.md).

