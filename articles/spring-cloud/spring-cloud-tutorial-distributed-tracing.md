---
title: "Tutorial: Use Distributed Tracing with Azure Spring Cloud | Microsoft Docs"
description: Learn how to use Spring Cloud's Distributed Tracing through Azure Application Insights
services: spring-cloud
author: v-vasuke
manager: gwallace
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/06/2019
ms.author: v-vasuke

---
# Tutorial: Using Distributed Tracing with Azure Spring Cloud

Spring Cloud's Distributed Tracing tools enable easy debugging and monitoring of complex issues. Azure Spring Cloud integrates the [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) with Azure's [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview) to provide powerful distributed tracing capability from the Azure portal.

In this article you will learn how to:

> [!div class="checklist"]
> * Enable Distributed Tracing in the Azure portal
> * Add the Spring Cloud Sleuth to your application
> * View dependency maps for your microservice applications
> * Search tracing data with different filters

## Prerequisites

To complete this tutorial:

* An already provisioned and running Azure Spring Cloud service.  Complete [this quickstart](spring-cloud-quickstart-launch-app-cli.md) to provision and launch an Azure Spring Cloud service.
	
## Add dependencies

Enable the zipkin sender to send to the web by adding the following line to the application.properties file:

```xml
spring.zipkin.sender.type = web
```

You can skip the next step if you followed our [guide to prepping an Azure Spring Cloud application](spring-cloud-tutorial-prepare-app-deployment.md). Otherwise, go to your local development environment and edit your `pom.xml` file to include the Spring Cloud Sleuth dependency:

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

* Build and deploy again for your Azure Spring Cloud service to reflect these changes. 

## Modify the sample rate
You can change the rate at which your telemetry is collected by modifying the sample rate. For example, if you want to sample half as often, go to your `application.properties` file, and change the following line:

```xml
spring.sleuth.sampler.probability=0.5
```

If you already have an application built and deployed, you can modify the sample rate by adding the above line as an environment variable in the Azure CLI or portal. 

## Enable Application Insights

1. Go to your Azure Spring Cloud service page in the Azure portal.
1. In the Monitoring section, select **Distributed Tracing**.
1. Select **Edit setting** to edit or add a new setting.
1. Create a new Application Insight query, or you can select an existing one.
1. Choose which logging category you want to monitor, and specify the retention time (in days).
1. Select **Apply** to apply the new tracing.

## View application map

Return to the Distributed Tracing page and select **View application map**. Review the visual representation of your application and monitoring settings. To learn how to use the application map, see [this article](https://docs.microsoft.com/azure/azure-monitor/app/app-map).

## Search

Use the search function to query other specific telemetry items. On the **Distributed Tracing** page, select **Search**. For more information on how to use the search function, see [this article](https://docs.microsoft.com/azure/azure-monitor/app/diagnostic-search).

## Application Insights page

Application Insights provides monitoring capabilities in addition to the application map and search. Search the Azure portal for your application's name and then launch an Application Insights page to find more. For more guidance on how to use these tools, [check out the documentation](https://docs.microsoft.com/azure/azure-monitor/log-query/query-language).


## Disable Application Insights

1. Go to your Azure Spring Cloud service page in the Azure portal.
1. In the Monitoring section, click on **Distributed Tracing**.
1. Click **Disable** to disable Application Insights

## Next steps

In this tutorial, you learned how to enable and understand distributed tracing in the Azure Spring Cloud. To learn how to bind your application to an Azure CosmosDB, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Learn how to bind your application to an Azure CosmosDB](spring-cloud-tutorial-bind-cosmos.md).
