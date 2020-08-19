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

With the built-in monitoring capability in Azure Spring Cloud, you can easily debug and monitor complex issues. Azure Spring Cloud integrates [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) with Azure's [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview). This integration provides powerful logs, metrics and distributed tracing capability from the Azure portal. We will walk you though how to use Log Streaming, Log Analytics, Metrics and Distributed tracing with deployed PiggyMetrics apps.
Please make sure you have complete previous steps: [provision an instance of Azure Spring Cloud](spring-cloud-quickstart-provision-service-instance.md), [set up the config server](spring-cloud-quickstart-setup-config-server.md) and [Build and deploy apps](spring-cloud-quickstart-deploy-apps.md).
## Logs
There are two ways to see logs on Azure Spring Cloud: Log Streaming for real-time logs per app instance and Log Analytics for aggregated logs with advanced query capability.

### Log Streaming

#### [IntelliJ](#tab/IntelliJ)

To get the logs using Azure Toolkit for IntelliJ:
1. Select **Azure Explorer**, then **Spring Cloud**.
1. Right-click the running app.
1. Select **Streaming Logs** from the drop-down list.
    ![Select streaming logs](media/spring-cloud-intellij-howto/streaming-logs.png)
1. Select **Instance**.
    ![Select instance](media/spring-cloud-intellij-howto/select-instance.png)
1. The streaming log will be visible in the output window.
    ![Streaming log output](media/spring-cloud-intellij-howto/streaming-log-output.png)

#### [CLI](#tab/Azure-CLI)

You can use log streaming in the Azure CLI with the following command.

```azurecli
   az spring-cloud app logs -s <service instance name> -g <resource group name> -n gateway -f

```

Log Streaming from Azure CLI
    ![Log Streaming from Azure CLI](media/spring-cloud-quickstart-logs-metrics-tracing/logs-streaming-cli.png)

>[!TIP]
> Use `az spring-cloud app logs -h` to explore more parameters and log stream functionalities.

---
## Log Analytics

1. Go to the **service Overview** page and select **Logs** in **Monitoring** section. Click **Run** on one of the sample query for Azure Spring Cloud and you will see filtered logs. See [Azure Log Analytics docs](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries) for more guidance on writing queries.

    ![Logs Analytics entry](media/spring-cloud-quickstart-logs-metrics-tracing/logs-entry.png)
    
## Metrics
1. Go to the **service Overview** page and select **Metrics** in **Monitoring** section. Add your first metric by selecting `system.cpu.usage` for **Metric** and `Avg` for **Aggregation** to see the timeline for overall CPU usage.

    ![Metrics entry](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-basic-cpu.png)
    
1. Click **Add filter** in the toolbar above, select `App=Gateway` to see CPU usage only for the **gateway** app.

    ![Use filter in metrics](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-filter.png)

1. Dismiss the filter created above, click **Apply Splitting** and select `App` for **Values** to see CPU usage by different apps.

    ![Apply splitting in metrics](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-split.png)

## Distributed Tracing
1. Go to the **service Overview** page and select **Distributed tracing** in **Monitoring** section. Then click the **View application map** tab on the right.

    ![Distributed Tracing entry](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-entry.png)

1. You can now see the status of calls between Piggymetrics apps. 

    ![Distributed Tracing overview](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-overview.png)
    
1. Click the link between **gateway** and **account-service** to see more details like slowest calls by HTTP methods.

    ![Distributed Tracing entry](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-call.png)
    
1. Finally, click **Investigate Performance** to explore more powerful built-in performance analysis.

    ![Distributed Tracing entry](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-performance.png)

## Next steps
* [Diagnostic services](diagnostic-services.md)
* [Distributed tracing](spring-cloud-tutorial-distributed-tracing.md)
* [Stream logs in real time](spring-cloud-howto-log-streaming.md)
With the distributed tracing tools in Azure Spring Cloud, you can easily debug and monitor complex issues. Azure Spring Cloud integrates [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) with Azure's [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview). This integration provides powerful distributed tracing capability from the Azure portal.
