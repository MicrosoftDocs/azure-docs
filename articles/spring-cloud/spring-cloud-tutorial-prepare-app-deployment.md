---
title: How-to - Prepare a Java Spring application for deployment in Azure Spring Cloud
description: In this topic, you prepare a Java Spring application for deployment to Azure Spring Cloud.
author: bmitchell287
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/03/2020
ms.author: brendm

---
# Prepare a Java Spring application for deployment in Azure Spring Cloud

This topic shows how to prepare an existing Java Spring application for deployment to Azure Spring Cloud. If configured properly, Azure Spring Cloud provides robust services to monitor, scale, and update your Java Spring Cloud application.

Other examples explain how to deploy an application to Azure Spring Cloud when the POM file is configured. 
* [Launch App using the Azure portal](spring-cloud-quickstart-launch-app-portal.md)
* [Launch App using the Azure CLI](spring-cloud-quickstart-launch-app-cli.md)

This article explains the required dependencies and how to add them to the POM file.

## Java Runtime version

Only Spring/Java applications can run in Azure Spring Cloud.

Azure Spring Cloud supports both Java 8 and Java 11. The hosting environment contains the latest version of Azul Zulu OpenJDK for Azure. For more information about Azul Zulu OpenJDK for Azure, see [Install the JDK](https://docs.microsoft.com/azure/developer/java/fundamentals/java-jdk-install).

## Spring Boot and Spring Cloud versions

To prepare an existing Spring Boot application for deployment to Azure Spring Cloud include the Spring Boot and Spring Cloud dependencies in the application POM file as shown in the following sections.

Azure Spring Cloud supports only Spring Boot apps either Spring Boot version 2.1 or version 2.2. The following table lists the supported Spring Boot and Spring Cloud combinations:

Spring Boot version | Spring Cloud version
---|---
2.1 | Greenwich.RELEASE
2.2 | Hoxton.RELEASE
2.3 | Hoxton.SR5

### Dependencies for Spring Boot version 2.1

For Spring Boot version 2.1 add the following dependencies to the application POM file.

```xml
    <!-- Spring Boot dependencies -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.12.RELEASE</version>
    </parent>

    <!-- Spring Cloud dependencies -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Greenwich.SR4</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```

### Dependencies for Spring Boot version 2.2

For Spring Boot version 2.2 add the following dependencies to the application POM file.

```xml
    <!-- Spring Boot dependencies -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.4.RELEASE</version>
    </parent>

    <!-- Spring Cloud dependencies -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Hoxton.SR1</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```
### Dependencies for Spring Boot version 2.3

For Spring Boot version 2.3 add the following dependencies to the application POM file.

```xml
    <!-- Spring Boot dependencies -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.0.RELEASE</version>
    </parent>

    <!-- Spring Cloud dependencies -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Hoxton.SR5</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```
## Azure Spring Cloud client dependency

Azure Spring Cloud hosts and manages Spring Cloud components. The components include Spring Cloud Service Registry and Spring Cloud Config Server. Include the Azure Spring Cloud client library in your dependencies to allow communication with your Azure Spring Cloud service instance.

The following table lists the correct Azure Spring Cloud versions for your app that uses Spring Boot and Spring Cloud.

Spring Boot version | Spring Cloud version | Azure Spring Cloud version
---|---|---
2.1 | Greenwich.RELEASE | 2.1
2.2 | Hoxton.RELEASE | 2.2
2.3 | Hoxton.SR5 | 2.3

Include one of the following dependencies in your pom.xml file. Select the dependency whose Azure Spring Cloud version matches your own.

### Dependency for Azure Spring Cloud version 2.1

For Spring Boot version 2.1 add the following dependency to the application POM file.

```xml
<dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-starter-azure-spring-cloud-client</artifactId>
        <version>2.1.2</version>
</dependency>
```

### Dependency for Azure Spring Cloud version 2.2

For Spring Boot version 2.2 add the following dependency to the application POM file.

```xml
<dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-starter-azure-spring-cloud-client</artifactId>
        <version>2.2.1</version>
</dependency>
```

For Spring Boot version 2.3 add the following dependency to the application POM file.

```xml
<dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-starter-azure-spring-cloud-client</artifactId>
        <version>2.3.0</version>
</dependency>
```

## Other recommended dependencies to enable Azure Spring Cloud features

To enable the built-in features of Azure Spring Cloud from service registry to distributed tracing, you need to also include the following dependencies in your application. You can drop some of these dependencies if you don't need corresponding features for the specific apps.

### Service Registry

To use the managed Azure Service Registry service, include the `spring-cloud-starter-netflix-eureka-client` dependency in the pom.xml file as shown here:

```xml
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
```

The endpoint of the Service Registry server is automatically injected as environment variables with your app. Applications can register themselves with the Service Registry server and discover other dependent microservices.

#### EnableDiscoveryClient annotation

Add the following annotation to the application source code.
```java
@EnableDiscoveryClient
```
For example, see the piggymetrics application from earlier examples:
```java
package com.piggymetrics.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@SpringBootApplication
@EnableDiscoveryClient
@EnableZuulProxy

public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

### Distributed Configuration

To enable Distributed Configuration, include the following `spring-cloud-config-client` dependency in the dependencies section of your pom.xml file:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-client</artifactId>
</dependency>
```

> [!WARNING]
> Don't specify `spring.cloud.config.enabled=false` in your bootstrap configuration. Otherwise, your application stops working with Config Server.

### Metrics

Include the `spring-boot-starter-actuator` dependency in the dependencies section of your pom.xml file as shown here:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

 Metrics are periodically pulled from the JMX endpoints. You can visualize the metrics by using the Azure portal.

 > [!WARNING]
 > Please specify `spring.jmx.enabled=true` in your configuration property. Otherwise, metrics can't be visualized in Azure portal.

### Distributed Tracing

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

## See also
* [Analyze application logs and metrics](https://docs.microsoft.com/azure/spring-cloud/diagnostic-services)
* [Set up your Config Server](https://docs.microsoft.com/azure/spring-cloud/spring-cloud-tutorial-config-server)
* [Use distributed tracing with Azure Spring Cloud](https://docs.microsoft.com/azure/spring-cloud/spring-cloud-tutorial-distributed-tracing)
* [Spring Quickstart Guide](https://spring.io/quickstart)
* [Spring Boot documentation](https://spring.io/projects/spring-boot)

## Next steps

In this topic, you learned how to configure your Java Spring application for deployment to Azure Spring Cloud. To learn how to set up a Config Server instance, see the following article.

> [!div class="nextstepaction"]
> [Learn how to set up a Config Server instance](spring-cloud-tutorial-config-server.md)

More samples are available on GitHub: [Azure Spring Cloud Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
