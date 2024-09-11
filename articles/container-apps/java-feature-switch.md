---
title: How to turn on Java Stack in Azure Container Apps
description: How to turn on Java Stack feature to use Java-optimized support in Azure Container Apps
services: container-apps
author: hangwang
ms.service: azure-container-apps
ms.custom: ignite-2024, devx-track-azurecli, devx-track-extended-java
ms.topic: how-to
ms.date: 02/27/2024
ms.author: hangwan
zone_pivot_groups: container-apps-portal-or-cli
---

# Turn on Java Features in Azure Container Apps

This guide provides step-by-step instructions for enabling key Java features in Azure Container Apps. By activating these features, you can optimize your Java applications for performance, monitoring and ease of development. 

## Java Virtual Machine (JVM) metrics
Java Virtual Machine (JVM) metrics are essential for tracking the performance and health of your Java applications. These metrics offer insights into memory consumption, garbage collection, and thread activity within the JVM. By enabling Java Metrics in Azure Container Apps, you can access these detailed metrics in Azure Monitor to optimize application performance and address potential issues proactively.

::: zone pivot="azure-portal"
To turn on Java Virtual Machine (JVM) metrics on portal, refer to [Metrics Configuration on Portal](java-metrics.md?tabs=create&pivots=azure-portal#configuration).

::: zone-end

::: zone pivot="azure-cli"
To turn on Java Virtual Machine (JVM) metrics on CLI, refer to [Metrics Configuration on CLI](java-metrics.md?tabs=create&pivots=azure-cli#configuration).  

::: zone-end

## Automatic memory fitting
The JVM conservatively manages memory, but with Java automatic memory fitting, your container app can optimize usage by making more memory available, boosting performance by 10-20% without requiring code changes.

Automatic memory fitting is **enabled by default**, but you can disable manually.

::: zone pivot="azure-portal"
Disabling Automatic memory fitting is currently only available on CLI, please refer to [Disable memory fitting](java-memory-fit.md?tabs=create#disable-memory-fitting).

::: zone-end

::: zone pivot="azure-cli"
To turn off Automatic memory fitting on CLI, refer to [Disable memory fitting](java-memory-fit.md?tabs=create#disable-memory-fitting).  

::: zone-end

## Diagnostics
Azure Container Apps provides a built-in diagnostics tool designed specifically for Java developers, enabling easier and more efficient debugging and troubleshooting of Java applications deployed on the platform.

### Dynamic logger level

::: zone pivot="azure-portal"
Enabling Dynamic logger level is currently only available on CLI, please refer to [Enable JVM diagnostics for your Java applications](java-dynamic-log-level.md?enable-jvm-diagnostics-for-your-java-applications).  
::: zone-end

::: zone pivot="azure-cli"
To turn on Dynamic logger level on CLI, refer to [Enable JVM diagnostics for your Java applications](java-dynamic-log-level.md?enable-jvm-diagnostics-for-your-java-applications).  
::: zone-end

## Java Components
Azure Container Apps supports various Java Components as managed services, allowing you to leverage these components without deploying additional code.

### Eureka Server for Spring
Eureka Server for Spring is a service registry that allows microservices to register themselves and discover other services. Available as an Azure Container Apps component, you can bind your container app to a Eureka Server for Spring for automatic registration with the Eureka server.

::: zone pivot="azure-portal"
To use Eureka Server for Spring on portal, refer to [Create the Eureka Server for Spring Java component on Portal](java-eureka-server.md?tabs=azure-portal#create-the-eureka-server-for-spring-java-component).

::: zone-end

::: zone pivot="azure-cli"
To use Eureka Server for Spring on CLI, refer to [Create the Eureka Server for Spring Java component on CLI](java-eureka-server.md?tabs=azure-cli#create-the-eureka-server-for-spring-java-component).

::: zone-end

### Config Server for Spring
Config Server for Spring provides a centralized location to make configuration data available to multiple applications. 

::: zone pivot="azure-portal"
To use Config Server for Spring on portal, refer to [Create the Config Server for Spring Java component on Portal](java-config-server.md?tabs=azure-portal#create-the-config-server-for-spring-java-component).

::: zone-end

::: zone pivot="azure-cli"
To use Config Server for Spring on CLI, refer to [Create the Config Server for Spring Java component on CLI](java-config-server.md?tabs=azure-cli#create-the-config-server-for-spring-java-component).

::: zone-end

### Admin for Spring
The Admin for Spring managed component offers an administrative interface for Spring Boot web applications that expose actuator endpoints. 

::: zone pivot="azure-portal"
To use Admin for Spring on portal, refer to [Use the component on Portal](java-admin.md?tabs=azure-portal).

::: zone-end

::: zone pivot="azure-cli"
To use Admin for Spring on CLI, refer to [Use the componentt on CLI](java-admin.md?tabs=azure-cli).

::: zone-end

> [!TIP]
> With Eureka Server for Spring, you can bind Admin for Spring to Eureka Server for Spring, so that it can get application information through Eureka, instead of having to bind individual applications to Admin for Spring.[Learn More](java-admin-eureka-integration.md).


## Next steps

> [!div class="nextstepaction"]
> [Launch your first Java app](java-get-started.md)
