---
title: "Quickstart - Monitoring Azure Spring Cloud apps with logs, metrics, and tracing"
description: Steps to use logs, metrics, and tracing for deployed Piggymetrics sample apps on Azure Spring Cloud.
author: MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 08/04/2020
ms.custom: devx-track-java
---

# Quickstart: Monitoring Azure Spring Cloud apps with logs, metrics, and tracing

With the built in monitoring capability in Azure Spring Cloud, you can easily debug and monitor complex issues. Azure Spring Cloud integrates [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) with Azure's [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview). This integration provides powerful logs, metrics and distributed tracing capability from the Azure portal. We will walk you though how to use Log Streaming, Log Analytics, Metrics and Distritbuted tracing with deployed PiggyMetrics apps.

## Set up logs
#### [CLI](#tab/Azure-CLI)
The following procedures use the Azure CLI.

To follow these procedures, you need an Azure Spring Cloud service that is already provisioned and running. Complete the [quickstart on deploying an app via the Azure CLI](spring-cloud-quickstart-deploy-apps.md) to provision and run an Azure Spring Cloud service.
    
### Add dependencies

1. Add the following line to the application.properties file:

   ```xml
   spring.zipkin.sender.type = web
   ```

   After this change, the Zipkin sender can send to the web.

1. Skip this step if you followed our [guide to preparing an Azure Spring Cloud application](spring-cloud-tutorial-prepare-app-deployment.md). Otherwise, go to your local development environment and edit your pom.xml file to include the following Spring Cloud Sleuth dependency:

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
    ![Log Streaming from Azure CLI](media/spring-cloud-quickstart-logs-metrics-tracing/logs-streaming-cli.png)
    
    >[!TIP]
    > Use `az spring-cloud app logs -h` to explore more parameters and log stream functionalities.
---

### Log Analytics
1. Go to the **service Overview** page and select **Logs** in **Monitoring** section. Click **Run** on one of the sample query for Azure Spring Cloud and you will see filtered logs. See [Azure Log Analytics docs](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries) for more guidence on writing queries.

    ![Logs Analytics entry](media/spring-cloud-quickstart-logs-metrics-tracing/logs-entry.png)
    
## Metrics
1. Go to the **service Overview** page and select **Metrics** in **Monitoring** section. Add your first metric by selecting `system.cpu.usage` for **Metric** and `Avg` for **Aggregation** to see the timeline for overall CPU usage.

    ![Metrics entry](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-basic-cpu.png)
    
1. Click **Add filter** in the toolbar above, select `App=Gateway` to see CPU usage only for the **gateway** app.

    ![Use filter in metrics](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-filter.png)

1. Dismiss the filter created above, click **Apply Splitting** and select `App` for **Values** to see CPU usage by different apps.

#### [IntelliJ](#tab/IntelliJ)
## Set up logs following IntelliJ deployment
The following procedure assumes you have completed [deployment of an Azure Spring Cloud app using IntelliJ](spring-cloud-quickstart-deploy-apps.md#intellij-deployment).

## Distributed Tracing
1. Go to the **service Overview** page and select **Distributed tracing** in **Monitoring** section. Then click the **View application map** tab on the right.

    ![Distributed Tracing entry](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-entry.png)

1. You can now see the stauts of calls between Piggymetrics apps. 

    ![Distributed Tracing overview](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-overview.png)
    
1. Click the link between **gateway** and **account-service** to see more details like slowest calls by HTTP methods.

    ![Distributed Tracing entry](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-call.png)
    
1. Finally, click **Investigate Performance** to explore more powerful built-in performance analysis.

    ![Streaming log output](media/spring-cloud-intellij-howto/streaming-log-output.png)
---
## Next steps
* [Diagnostic services](diagnostic-services.md)
* [Distributed tracing](spring-cloud-tutorial-distributed-tracing.md)
* [Stream logs in real time](spring-cloud-howto-log-streaming.md)
With the distributed tracing tools in Azure Spring Cloud, you can easily debug and monitor complex issues. Azure Spring Cloud integrates [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) with Azure's [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview). This integration provides powerful distributed tracing capability from the Azure portal.
