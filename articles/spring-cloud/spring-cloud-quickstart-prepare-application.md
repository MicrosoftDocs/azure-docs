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

## Prerequisites

- [JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- Spring Boot 2.0.x
- Spring Cloud Finchley

## Spring Boot and Spring Cloud versions

First we need to verify that your application has the right Spring versions. Ensure that your pom.xml Spring dependencies is as below:

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
            <version>Finchley.SR3</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

> !NOTE
> Java 11, Spring Boot 2.1.x, and Spring Cloud Greenwich are not tested and will be officially supported later.
>


## Required dependencies

To fully utilize the built-in features of Azure Managed Service for Spring Cloud, your application needs to include below dependencies. Then your application will be automatically wired up with each component (Eureka Server, Config Server etc.).

### Service Discovery

Follow below steps to use service discovery in Azure Managed Service for Spring Cloud.

1. Add snapshot repository in repositories section of your pom.xml

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

2. Include spring-cloud-starter-netflix-eureka-client and spring-cloud-starter-azure-spring-cloud-client in your pom.xml as below. 

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>spring-cloud-starter-azure-spring-cloud-client</artifactId>
    <version>0.0.2-SNAPSHOT</version>
</dependency>
```
3. Add @SpringCloudApplication annotation to the top level class as below. 

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
The built-in Eureka server endpoint will be automatically injected as enviroment variable with your application. Then applications will be able to register themselves with Eureka server and discover other dependent microservices.

### Distributed Configuration

To enable Distributed Configuration, include spring-cloud-config-client in the dependencies section of your pom.xml as below.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-client</artifactId>
</dependency>
```

### Metrics

Include spring-boot-starter-actuator in the dependencies section of your pom.xml as below. Metrics will be periodically pulled from the JMX endpoints and can be visualized from Azure Portal.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Distributed Tracing

Include spring-cloud-starter-sleuth and spring-cloud-starter-zipkin in the dependencies section of your pom.xml as below.

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

<!-- ### Circuit Breaker -->

## Next steps

To learn more about Service Fabric and .NET, take a look at this tutorial:
<!-- > [!div class="nextstepaction"]
> [.NET application on Service Fabric](service-fabric-tutorial-create-dotnet-app.md) -->
