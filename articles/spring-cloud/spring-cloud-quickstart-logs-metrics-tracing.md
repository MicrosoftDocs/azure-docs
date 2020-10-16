---
title: "Quickstart - Monitoring Azure Spring Cloud apps with logs, metrics, and tracing"
description: Use log streaming, log analytics, metrics, and tracing to monitor Piggymetrics sample apps on Azure Spring Cloud.
author: MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 08/04/2020
ms.custom: devx-track-java
zone_pivot_groups: programming-languages-spring-cloud
---

# Quickstart: Monitoring Azure Spring Cloud apps with logs, metrics, and tracing

::: zone pivot="programming-language-csharp"
With the built-in monitoring capability in Azure Spring Cloud, you can debug and monitor complex issues. Azure Spring Cloud integrates Steeltoe [distributed tracing](https://steeltoe.io/docs/3/tracing/distributed-tracing) with Azure's [Application Insights](../azure-monitor/app/app-insights-overview.md). This integration provides powerful logs, metrics, and distributed tracing capability from the Azure portal.

The following procedures explain how to use Log Streaming, Log Analytics, Metrics, and Distributed Tracing with the sample app that you deployed in the preceding quickstarts.

## Prerequisites

* Complete the previous quickstarts in this series:

  * [Provision Azure Spring Cloud service](spring-cloud-quickstart-provision-service-instance.md).
  * [Set up Azure Spring Cloud configuration server](spring-cloud-quickstart-setup-config-server.md).
  * [Build and deploy apps](spring-cloud-quickstart-deploy-apps.md).

## Logs

There are two ways to see logs on Azure Spring Cloud: **Log Streaming** of real-time logs per app instance or **Log Analytics** for aggregated logs with advanced query capability.

### Log streaming

You can use log streaming in the Azure CLI with the following command.

```azurecli
az spring-cloud app logs -n solar-system-weather -f
```

You will see output similar to the following example:

```output
=> ConnectionId:0HM2HOMHT82UK => RequestPath:/weatherforecast RequestId:0HM2HOMHT82UK:00000003, SpanId:|e8c1682e-46518cc0202c5fd9., TraceId:e8c1682e-46518cc0202c5fd9, ParentId: => Microsoft.Azure.SpringCloud.Sample.SolarSystemWeather.Controllers.WeatherForecastController.Get (Microsoft.Azure.SpringCloud.Sample.SolarSystemWeather)
Executing action method Microsoft.Azure.SpringCloud.Sample.SolarSystemWeather.Controllers.WeatherForecastController.Get (Microsoft.Azure.SpringCloud.Sample.SolarSystemWeather) - Validation state: Valid
←[40m←[32minfo←[39m←[22m←[49m: Microsoft.Azure.SpringCloud.Sample.SolarSystemWeather.Controllers.WeatherForecastController[0]

=> ConnectionId:0HM2HOMHT82UK => RequestPath:/weatherforecast RequestId:0HM2HOMHT82UK:00000003, SpanId:|e8c1682e-46518cc0202c5fd9., TraceId:e8c1682e-46518cc0202c5fd9, ParentId: => Microsoft.Azure.SpringCloud.Sample.SolarSystemWeather.Controllers.WeatherForecastController.Get (Microsoft.Azure.SpringCloud.Sample.SolarSystemWeather)
Retrieved weather data from 4 planets
←[40m←[32minfo←[39m←[22m←[49m: Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker[2]

=> ConnectionId:0HM2HOMHT82UK => RequestPath:/weatherforecast RequestId:0HM2HOMHT82UK:00000003, SpanId:|e8c1682e-46518cc0202c5fd9., TraceId:e8c1682e-46518cc0202c5fd9, ParentId: => Microsoft.Azure.SpringCloud.Sample.SolarSystemWeather.Controllers.WeatherForecastController.Get (Microsoft.Azure.SpringCloud.Sample.SolarSystemWeather)
Executing ObjectResult, writing value of type 'System.Collections.Generic.KeyValuePair`2[[System.String, System.Private.CoreLib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e],[System.String, System.Private.CoreLib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]][]'.
←[40m←[32minfo←[39m←[22m←[49m: Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker[2]
```

> [!TIP]
> Use `az spring-cloud app logs -h` to explore more parameters and log stream functionality.

### Log Analytics

1. In the Azure portal, go to the **service | Overview** page and select **Logs** in the **Monitoring** section. Select **Run** on one of the sample queries for Azure Spring Cloud.

   [ ![Logs Analytics entry](media/spring-cloud-quickstart-logs-metrics-tracing/logs-entry.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/logs-entry.png#lightbox)
    
1. Edit the query to remove the Where clauses that limit the display to warning and error logs.

1. Then select `Run`, and you will see logs. See [Azure Log Analytics docs](../azure-monitor/log-query/get-started-queries.md) for more guidance on writing queries.

   [ ![Logs Analytics query - Steeltoe](media/spring-cloud-quickstart-logs-metrics-tracing/logs-query-steeltoe.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/logs-query-steeltoe.png#lightbox)

## Metrics

1. In the Azure portal, go to the **service | Overview** page and select **Metrics** in the **Monitoring** section. Add your first metric by selecting one of the .NET metrics under **Performance (.NET)** or **Request (.NET)** in the **Metric** drop-down, and `Avg` for **Aggregation** to see the timeline for that metric.

   [ ![Metrics entry - Steeltoe](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-basic-cpu-steeltoe.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-basic-cpu-steeltoe.png#lightbox)
    
1. Click **Add filter** in the toolbar, select `App=solar-system-weather` to see CPU usage only for the **solar-system-weather** app.

   [ ![Use filter in metrics - Steeltoe](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-filter-steeltoe.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-filter-steeltoe.png#lightbox)

1. Dismiss the filter created in the preceding step, select **Apply Splitting**, and select `App` for **Values** to see CPU usage by different apps.

   [ ![Apply splitting in metrics - Steeltoe](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-split-steeltoe.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-split-steeltoe.png#lightbox)

## Distributed tracing

1. In the Azure portal, go to the **service | Overview** page and select **Distributed tracing** in the **Monitoring** section. Then select the **View application map** tab on the right.

   [ ![Distributed Tracing entry - Steeltoe](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-entry.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-entry.png#lightbox)

1. You can now see the status of calls between apps. 

   [ ![Distributed tracing overview - Steeltoe](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-overview-steeltoe.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-overview-steeltoe.png#lightbox)
    
1. Select the link between **solar-system-weather** and **planet-weather-provider** to see more details like slowest calls by HTTP methods.

   [ ![Distributed tracing - Steeltoe](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-call-steeltoe.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-call-steeltoe.png#lightbox)
    
1. Finally, select **Investigate Performance** to explore more powerful built-in performance analysis.

   [ ![Distributed tracing performance - Steeltoe](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-performance-steeltoe.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-performance-steeltoe.png#lightbox)
::: zone-end

::: zone pivot="programming-language-java"
With the built-in monitoring capability in Azure Spring Cloud, you can debug and monitor complex issues. Azure Spring Cloud integrates [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) with Azure's [Application Insights](../azure-monitor/app/app-insights-overview.md). This integration provides powerful logs, metrics, and distributed tracing capability from the Azure portal. The following procedures explain how to use Log Streaming, Log Analytics, Metrics, and Distributed tracing with deployed PiggyMetrics apps.

## Prerequisites

Complete previous steps: 

* [Provision an instance of Azure Spring Cloud](spring-cloud-quickstart-provision-service-instance.md)
* [Set up the config server](spring-cloud-quickstart-setup-config-server.md)
* [Build and deploy apps](spring-cloud-quickstart-deploy-apps.md).

## Logs

There are two ways to see logs on Azure Spring Cloud: **Log Streaming** of real-time logs per app instance or **Log Analytics** for aggregated logs with advanced query capability.

### Log streaming

#### [CLI](#tab/Azure-CLI)

You can use log streaming in the Azure CLI with the following command.

```azurecli
az spring-cloud app logs -s <service instance name> -g <resource group name> -n gateway -f
```

You will see logs like this:

[ ![Log Streaming from Azure CLI](media/spring-cloud-quickstart-logs-metrics-tracing/logs-streaming-cli.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/logs-streaming-cli.png#lightbox)

> [!TIP]
> Use `az spring-cloud app logs -h` to explore more parameters and log stream functionalities.

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

---
### Log Analytics

1. Go to the **service | Overview** page and select **Logs** in the **Monitoring** section. Click **Run** on one of the sample queries for Azure Spring Cloud. 

   [ ![Logs Analytics entry](media/spring-cloud-quickstart-logs-metrics-tracing/logs-entry.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/logs-entry.png#lightbox)
    
1. Then you will see filtered logs. See [Azure Log Analytics docs](../azure-monitor/log-query/get-started-queries.md) for more guidance on writing queries.

   [ ![Logs Analytics query](media/spring-cloud-quickstart-logs-metrics-tracing/logs-query.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/logs-query.png#lightbox)

## Metrics

1. Go to the **service | Overview** page and select **Metrics** in the **Monitoring** section. Add your first metric by selecting `system.cpu.usage` for **Metric** and `Avg` for **Aggregation** to see the timeline for overall CPU usage.

   [ ![Metrics entry](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-basic-cpu.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-basic-cpu.png#lightbox)
    
1. Click **Add filter** in the toolbar above, select `App=Gateway` to see CPU usage only for the **gateway** app.

   [ ![Use filter in metrics](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-filter.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-filter.png#lightbox)

1. Dismiss the filter created above, click **Apply Splitting** and select `App` for **Values** to see CPU usage by different apps.

   [ ![Apply splitting in metrics](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-split.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/metrics-split.png#lightbox)

## Distributed tracing

1. Go to the **service | Overview** page and select **Distributed tracing** in the **Monitoring** section. Then click the **View application map** tab on the right.

   [ ![Distributed Tracing entry](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-entry.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-entry.png#lightbox)

1. You can now see the status of calls between Piggymetrics apps. 

   [ ![Distributed tracing overview](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-overview.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-overview.png#lightbox)
    
1. Click the link between **gateway** and **account-service** to see more details like slowest calls by HTTP methods.

   [ ![Distributed tracing](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-call.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-call.png#lightbox)
    
1. Finally, click **Investigate Performance** to explore more powerful built-in performance analysis.

   [ ![Distributed tracing performance](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-performance.png) ](media/spring-cloud-quickstart-logs-metrics-tracing/tracing-performance.png#lightbox)

::: zone-end

## Clean up resources

In these quickstarts, you created Azure resources that will continue to accrue charges if they remain in your subscription. If you don't expect to need these resources in the future, delete the resource group by using the portal or by running the following command in the Cloud Shell:

```azurecli
az group delete --name <your resource group name; for example: helloworld-1558400876966-rg> --yes
```

In an earlier quickstart, you also set the default resource group name. If you don't intend to continue to the next quickstart, clear out that default by running the following CLI command:

```azurecli
az configure --defaults group=
```

## Next steps

To explore more monitoring capabilities of Azure Spring Cloud, see:

> [!div class="nextstepaction"]
> [Diagnostic services](diagnostic-services.md)
>
> [Distributed tracing](spring-cloud-tutorial-distributed-tracing.md)
>
> [Stream logs in real time](spring-cloud-howto-log-streaming.md)