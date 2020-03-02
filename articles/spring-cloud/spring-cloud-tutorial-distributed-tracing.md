---
title: "Tutorial - Use Distributed Tracing with Azure Spring Cloud"
description: This tutorial shows how to use Spring Cloud's Distributed Tracing through Azure Application Insights
author: bmitchell287
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 10/06/2019
ms.author: brendm

---
# Use distributed tracing with Azure Spring Cloud

With the distributed tracing tools in Azure Spring Cloud, you can easily debug and monitor complex issues. Azure Spring Cloud integrates [Azure Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) with Azure's [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview). This integration provides powerful distributed tracing capability from the Azure portal.

In this article you learn how to:

> [!div class="checklist"]
> * Enable distributed tracing in the Azure portal.
> * Add Azure Spring Cloud Sleuth to your application.
> * View dependency maps for your microservice applications.
> * Search tracing data with different filters.

## Prerequisites

To complete this tutorial, you need an Azure Spring Cloud service that is already provisioned and running. Complete the [quickstart on deploying an app via the Azure CLI](spring-cloud-quickstart-launch-app-cli.md) to provision and run an Azure Spring Cloud service.
	
## Add dependencies

1. Add the following line to the application.properties file:

   ```xml
   spring.zipkin.sender.type = web
   ```

   After this change, the Zipkin sender can send to the web.

1. Skip this step if you followed our [guide to preparing an Azure Spring Cloud application](spring-cloud-tutorial-prepare-app-deployment.md). Otherwise, go to your local development environment and edit your pom.xml file to include the following Azure Spring Cloud Sleuth dependency:

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

1. Build and deploy again for your Azure Spring Cloud service to reflect these changes.

## Modify the sample rate

You can change the rate at which your telemetry is collected by modifying the sample rate. For example, if you want to sample half as often, open your application.properties file, and change the following line:

```xml
spring.sleuth.sampler.probability=0.5
```

If you have already built and deployed an application, you can modify the sample rate. Do so by adding the previous line as an environment variable in the Azure CLI or the Azure portal.

## Enable Application Insights

1. Go to your Azure Spring Cloud service page in the Azure portal.
1. On the **Monitoring** page, select **Distributed Tracing**.
1. Select **Edit setting** to edit or add a new setting.
1. Create a new Application Insights query, or select an existing one.
1. Choose which logging category you want to monitor, and specify the retention time in days.
1. Select **Apply** to apply the new tracing.

## View the application map

Return to the **Distributed Tracing** page and select **View application map**. Review the visual representation of your application and monitoring settings. To learn how to use the application map, see [Application Map: Triage distributed applications](https://docs.microsoft.com/azure/azure-monitor/app/app-map).

## Use search

Use the search function to query for other specific telemetry items. On the **Distributed Tracing** page, select **Search**. For more information on how to use the search function, see [Using Search in Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/diagnostic-search).

## Use Application Insights

Application Insights provides monitoring capabilities in addition to the application map and search function. Search the Azure portal for your application's name, and then open an Application Insights page to find monitoring information. For more guidance on how to use these tools, check out [Azure Monitor log queries](https://docs.microsoft.com/azure/azure-monitor/log-query/query-language).

## Disable Application Insights

1. Go to your Azure Spring Cloud service page in the Azure portal.
1. On **Monitoring**, select **Distributed Tracing**.
1. Select **Disable** to disable Application Insights.

## Next steps

In this tutorial, you learned how to enable and understand distributed tracing in Azure Spring Cloud. To learn how to bind your application to an Azure Cosmos DB database, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Learn how to bind to an Azure Cosmos DB database](spring-cloud-tutorial-bind-cosmos.md)
