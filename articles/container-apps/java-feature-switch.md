---
title: How to turn on Java features in Azure Container Apps
description: How to turn on Java features to use Java-optimized supports in Azure Container Apps
services: container-apps
author: hangwang
ms.service: azure-container-apps
ms.custom: devx-track-azurecli, devx-track-extended-java
ms.topic: how-to
ms.date: 09/23/2024
ms.author: hangwan
zone_pivot_groups: container-apps-portal-or-cli
---

# Turn on Java features in Azure Container Apps

This guide provides step-by-step instructions for enabling key Java features in Azure Container Apps. By activating these features, you can optimize your Java applications for performance, monitoring, and ease of development. 

## Java virtual machine (JVM) metrics

Java virtual machine (JVM) metrics are essential for tracking the performance and health of your Java applications. These metrics offer insights into memory consumption, garbage collection, and thread activity within the JVM. By enabling Java metrics in Azure Container Apps, you can access these detailed metrics in Azure Monitor to proactively optimize application performance and address potential issues.

::: zone pivot="azure-portal"
To turn on Java virtual machine (JVM) metrics in the portal, refer to [Java metrics for Java apps in Azure Container Apps](java-metrics.md?tabs=create&pivots=azure-portal#configuration).

::: zone-end

::: zone pivot="azure-cli"
To turn on Java virtual machine (JVM) metrics on CLI, refer to [Java metrics for Java apps in Azure Container Apps](java-metrics.md?tabs=create&pivots=azure-cli#configuration).  

::: zone-end

## Automatic memory fitting
By default, the JVM manages memory conservatively, but Java automatic memory fitting fine-tunes how memory is managed for your Java application. Automatic memory fitting makes more memory available to your Java app, which may potentially boost performance by 10-20% without requiring code changes.

Automatic memory fitting is **enabled by default**, but you can disable manually.

::: zone pivot="azure-portal"
Disabling automatic memory fitting is currently only available on CLI, please refer to [Disable memory fitting](java-memory-fit.md?tabs=create#disable-memory-fitting).

::: zone-end

::: zone pivot="azure-cli"
To turn off automatic memory fitting on CLI, refer to [Disable memory fitting](java-memory-fit.md?tabs=create#disable-memory-fitting).  

::: zone-end

## Diagnostics
Azure Container Apps provides a built-in diagnostics tool designed specifically for Java developers, which makes debugging and troubleshooting easier and more efficient.

### Dynamic logger level

::: zone pivot="azure-portal"
Enabling dynamic logger level is currently only available on CLI, refer to [Enable JVM diagnostics for your Java applications](java-dynamic-log-level.md?enable-jvm-diagnostics-for-your-java-applications) for details.  
::: zone-end

::: zone pivot="azure-cli"
To turn on dynamic logger level on CLI, refer to [Enable JVM diagnostics for your Java applications](java-dynamic-log-level.md?enable-jvm-diagnostics-for-your-java-applications) for details.
::: zone-end

## Java components

Azure Container Apps supports Java components as managed services, which allows you to extend the capability of your applications without having to deploy additional code.

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
To use Admin for Spring on CLI, refer to [Use the component on CLI](java-admin.md?tabs=azure-cli).

::: zone-end

> [!TIP]
> With Eureka Server for Spring, you can bind Admin for Spring to Eureka Server for Spring, so that it can get application information through Eureka, instead of having to bind individual applications to Admin for Spring. For more information, see [Integrate Admin for Spring with Eureka Server for Spring in Azure Container Apps](java-admin-eureka-integration.md).


## Next steps

> [!div class="nextstepaction"]
> [Launch your first Java app](java-get-started.md)
