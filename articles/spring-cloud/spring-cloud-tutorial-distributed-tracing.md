---
title: "Tutorial: Using Distributed Tracing with Azure Spring Cloud | Microsoft Docs"
description: Learn how to use Spring Cloud's Distributed Tracing through Azure Application Insights
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/06/2019
ms.author: v-vasuke

---
# Tutorial: Using Distributed Tracing with Azure Spring Cloud

Spring Cloud's Distributed Tracing tools are extremely valuable for debugging and monitoring complex issues that can arise when using a microservices based architecture. Azure Spring Cloud integrates the [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) with Azure's [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview) to have a powerful Distributed Tracing capability directly from the Azure portal.

In this article you will learn how to:

> [!div class="checklist"]
> * Enable Distributed Tracing in the Azure portal
> * Add the Spring Cloud Sleuth to your application
> * View dependency maps for your microservice applications
> * Search tracing data with different filters

## Prerequisites

To complete this quickstart:

- An already provisioned and running Azure Spring Cloud service
	

## Add dependencies

Ensure the zipkin sender is set to web by going to the application.properties file and adding the following line:

```
spring.zipkin.sender.type = web
```

You can skip the next step if you properly followed our [guide for prepping an Azure Spring Cloud application](spring-cloud-tutorial-prepare-app-deployment.md). Go to your local development environment and edit your `pom.xml` file to include the Spring Cloud Sleuth dependency:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-sleuth</artifactId>
            <version>${spring-cloud-sleuth.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-sleuth</artifactId>
    </dependency>
</dependencies>
```

You will need to build and deploy again for your Azure Spring Cloud service to reflect these changes. 

## Modify the sample rate
You can change the rate at which your telemetry is collected by modifying the sample rate. For example, if you want to sample half as often, go to your `application.properties` file, and change the following line:
```
spring.sleuth.sampler.probability=0.5
```
If you already have an application built an deployed, you can  modify the sample rate by adding the above line as an environment variable in the Azure CLI or portal. 
## Enable Application Insights

1. Go to your Azure Spring Cloud service page in the Azure portal.

1. In the Monitoring section, click on **Distributed Tracing**.
1. Click **Edit setting** to edit or add a new setting.
1. Create a new Application Insight query, or you can select an existing one.
1. Choose which logging category you want to monitor, and specify the retention time (in days).
1. Click **Apply** to apply the new tracing.

## View application map

Back in the Distributed Tracing page, click **View application map**. Then you can see a visual representation of your application and monitoring settings. For more information on how to use the application map, see [this article](https://docs.microsoft.com/azure/azure-monitor/app/app-map).

## Search

Use the search function to query other specific telemetry items. Back in the **Distributed Tracing** page, click **Search**. For more information on how to use the search function, see [this article](https://docs.microsoft.com/azure/azure-monitor/app/diagnostic-search).

## Application Insights page

In addition to the application map and search, Application Insights provides other monitoring capabilities. Search the Azure portal for your application's name and then launch an Application Insights page to find more. For more guidance on how to use these tools, [check out the documentation](https://docs.microsoft.com/azure/azure-monitor/log-query/query-language).



## Disable Application Insights

1. Go to your Azure Spring Cloud service page in the Azure portal.
1. In the Monitoring section, click on **Distributed Tracing**.
1. Click **Disable** to disable Application Insights

