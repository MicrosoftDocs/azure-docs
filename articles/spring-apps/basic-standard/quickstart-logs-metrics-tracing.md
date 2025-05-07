---
title: "Quickstart - Monitoring Azure Spring Apps Apps with Logs, Metrics, and Tracing"
description: Use log streaming, log analytics, metrics, and tracing to monitor PetClinic sample apps on Azure Spring Apps.
author: KarlErickson
ms.author: karler
ms.service: azure-spring-apps
ms.topic: quickstart
ms.date: 06/27/2024
ms.custom: devx-track-java, devx-track-extended-java, mode-other
zone_pivot_groups: programming-languages-spring-apps
---

# Quickstart: Monitoring Azure Spring Apps apps with logs, metrics, and tracing

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ❎ Enterprise

::: zone pivot="programming-language-csharp"

With the built-in monitoring capability in Azure Spring Apps, you can debug and monitor complex issues. Azure Spring Apps integrates Steeltoe [distributed tracing](https://docs.steeltoe.io/api/v3/tracing/) with Azure's [Application Insights](/azure/azure-monitor/app/app-insights-overview). This integration provides powerful logs, metrics, and distributed tracing capability from the Azure portal.

The following procedures explain how to use Log Streaming, Log Analytics, Metrics, and Distributed Tracing with the sample app that you deployed in the preceding quickstarts.

## Prerequisites

- Complete the previous quickstarts in this series:

  - [Provision an Azure Spring Apps service instance](./quickstart-provision-service-instance.md).
  - [Quickstart: Set up Spring Cloud Config Server for Azure Spring Apps](./quickstart-setup-config-server.md).
  - [Build and deploy apps to Azure Spring Apps](./quickstart-deploy-apps.md).
  - [Set up a Log Analytics workspace](./quickstart-setup-log-analytics.md).

## Logs

There are two ways to see logs on Azure Spring Apps: **Log Streaming** of real-time logs per app instance or **Log Analytics** for aggregated logs with advanced query capability.

### Log streaming

#### [Azure portal](#tab/azure-portal-1)

[!INCLUDE [app-log-streaming-in-portal](../includes/log-streaming/app-log-streaming-in-portal.md)]

#### [Azure CLI](#tab/Azure-CLI-1)

You can use log streaming in the Azure CLI with the following command:

```azurecli
az spring app logs --name solar-system-weather --follow
```

You're shown output similar to the following example:

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
> Use `az spring app logs -h` to explore more parameters and log stream functionality.

---

### Log Analytics

1. In the Azure portal, go to the **service | Overview** page and select **Logs** in the **Monitoring** section. Select **Run** on one of the sample queries for Azure Spring Apps.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/logs-entry.png" alt-text="Screenshot of the Azure portal that shows the Logs pane with Queries page open and Run highlighted." lightbox="media/quickstart-logs-metrics-tracing/logs-entry.png":::

1. Edit the query to remove the Where clauses that limit the display to warning and error logs.

1. Select **Run**. You're shown logs. For more information, see [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries).

   :::image type="content" source="media/quickstart-logs-metrics-tracing/logs-query-steeltoe.png" alt-text="Screenshot of the Azure portal that shows the Logs Analytics query result." lightbox="media/quickstart-logs-metrics-tracing/logs-query-steeltoe.png":::

1. To learn more about the query language that's used in Log Analytics, see [Azure Monitor log queries](/azure/data-explorer/kusto/query/). To query all your Log Analytics logs from a centralized client, check out [Azure Data Explorer](/azure/data-explorer/query-monitor-data).

## Metrics

1. In the Azure portal, go to the **service | Overview** page and select **Metrics** in the **Monitoring** section. Add your first metric by selecting one of the .NET metrics under **Performance (.NET)** or **Request (.NET)** in the **Metric** drop-down, and **Avg** for **Aggregation** to see the timeline for that metric.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/metrics-basic-cpu-steeltoe.png" alt-text="Screenshot of the Azure portal that shows the Metrics page with available filters." lightbox="media/quickstart-logs-metrics-tracing/metrics-basic-cpu-steeltoe.png":::

1. Select **Add filter** in the toolbar, select `App=solar-system-weather` to see CPU usage only for the **solar-system-weather** app.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/metrics-filter-steeltoe.png" alt-text="Screenshot of the Azure portal that shows the Metrics page with the filter Property, Operator, and Values options highlighted." lightbox="media/quickstart-logs-metrics-tracing/metrics-filter-steeltoe.png":::

1. Dismiss the filter created in the preceding step, select **Apply Splitting**, and select **App** for **Values** to see the CPU usage by different apps.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/metrics-split-steeltoe.png" alt-text="Screenshot of the Azure portal that shows the Metrics page with the splitting Values, Limit, and Sort options highlighted." lightbox="media/quickstart-logs-metrics-tracing/metrics-split-steeltoe.png":::

## Distributed tracing

1. In the Azure portal, go to the **service | Overview** page and select **Distributed tracing** in the **Monitoring** section. Then select the **View application map** tab on the right.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/tracing-entry.png" alt-text="Screenshot of the Azure portal that shows the Distributed tracing page." lightbox="media/quickstart-logs-metrics-tracing/tracing-entry.png":::

1. You can now see the status of calls between apps.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/tracing-overview-steeltoe.png" alt-text="Screenshot of the Azure portal that shows the Application map page." lightbox="media/quickstart-logs-metrics-tracing/tracing-overview-steeltoe.png":::

1. Select the link between **solar-system-weather** and **planet-weather-provider** to see more details such as the slowest calls by HTTP methods.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/tracing-call-steeltoe.png" alt-text="Screenshot of the Azure portal that shows the Application map details." lightbox="media/quickstart-logs-metrics-tracing/tracing-call-steeltoe.png":::

1. Finally, select **Investigate Performance** to explore more powerful built-in performance analysis.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/tracing-performance-steeltoe.png" alt-text="Screenshot of the Azure portal that shows the Performance page." lightbox="media/quickstart-logs-metrics-tracing/tracing-performance-steeltoe.png":::

::: zone-end

::: zone pivot="programming-language-java"

With the built-in monitoring capability in Azure Spring Apps, you can debug and monitor complex issues. Azure Spring Apps integrates [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) with Azure's [Application Insights](/azure/azure-monitor/app/app-insights-overview). This integration provides powerful logs, metrics, and distributed tracing capability from the Azure portal. The following procedures explain how to use Log Streaming, Log Analytics, Metrics, and Distributed tracing with deployed PetClinic apps.

## Prerequisites

- Complete the previous quickstarts in this series:

  - [Provision an Azure Spring Apps service instance](./quickstart-provision-service-instance.md).
  - [Quickstart: Set up Spring Cloud Config Server for Azure Spring Apps](./quickstart-setup-config-server.md).
  - [Build and deploy apps to Azure Spring Apps](./quickstart-deploy-apps.md).
  - [Set up a Log Analytics workspace](./quickstart-setup-log-analytics.md).

## Logs

There are two ways to see logs on Azure Spring Apps: **Log Streaming** of real-time logs per app instance or **Log Analytics** for aggregated logs with advanced query capability.

### Log streaming

#### [Azure portal](#tab/azure-portal)

[!INCLUDE [app-log-streaming-in-portal](../includes/log-streaming/app-log-streaming-in-portal.md)]

#### [Azure CLI](#tab/Azure-CLI)

You can use log streaming in the Azure CLI with the following command:

```azurecli
az spring app logs \
    --resource-group <resource-group-name> \
    --service <service-instance-name> \
    --name api-gateway \
    --follow
```

You're shown logs like this:

:::image type="content" source="media/quickstart-logs-metrics-tracing/logs-streaming-cli.png" alt-text="Screenshot of the Azure CLI log streaming output." lightbox="media/quickstart-logs-metrics-tracing/logs-streaming-cli.png":::

> [!TIP]
> Use `az spring app logs -h` to explore more parameters and log stream functionalities.

To learn more about the query language that's used in Log Analytics, see [Azure Monitor log queries](/azure/data-explorer/kusto/query/). To query all your Log Analytics logs from a centralized client, check out [Azure Data Explorer](/azure/data-explorer/query-monitor-data).

#### [IntelliJ](#tab/IntelliJ)

Use the following steps to get the logs using the Azure Toolkit for IntelliJ:

1. Select **Azure Explorer**, then **Spring Cloud**.

1. Right-click the running app.

1. Select **Streaming Logs** from the drop-down list.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/streaming-logs.png" alt-text="Screenshot of IntelliJ that shows the Azure Explorer pane with the context menu open and the Streaming Logs option highlighted." lightbox="media/quickstart-logs-metrics-tracing/streaming-logs.png":::

1. Select **Instance**.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/select-instance.png" alt-text="Screenshot of IntelliJ that shows the Select Instance dialog box." lightbox="media/quickstart-logs-metrics-tracing/select-instance.png":::

1. The streaming log is visible in the output window.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/streaming-log-output.png" alt-text="Screenshot of IntelliJ that shows the Azure Streaming Log pane." lightbox="media/quickstart-logs-metrics-tracing/streaming-log-output.png":::

 To learn more about the query language that's used in Log Analytics, see [Azure Monitor log queries](/azure/data-explorer/kusto/query/). To query all your Log Analytics logs from a centralized client, check out [Azure Data Explorer](/azure/data-explorer/query-monitor-data).

---

### Log Analytics

1. Go to the **service | Overview** page and select **Logs** in the **Monitoring** section. Select **Run** on one of the sample queries for Azure Spring Apps.

   :::image type="content" source="media/quickstart-logs-metrics-tracing/logs-entry.png" alt-text="Screenshot of the Azure portal that shows the Queries page with Run highlighted." lightbox="media/quickstart-logs-metrics-tracing/logs-entry.png":::

1. Then you're shown filtered logs. For more information, see [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries).

   :::image type="content" source="media/quickstart-logs-metrics-tracing/logs-query.png" alt-text="Screenshot of the Azure portal that shows the query result of filtered logs." lightbox="media/quickstart-logs-metrics-tracing/logs-query.png":::

## Metrics

Navigate to the **Application insights** page, and then navigate to the **Metrics** page. You can see metrics contributed by Spring Boot apps, Spring modules, and dependencies.

The following chart shows `gateway_requests` (Spring Cloud Gateway), `hikaricp_connections` (JDBC Connections), and `http_client_requests`.

:::image type="content" source="media/quickstart-logs-metrics-tracing/petclinic-microservices-metrics.jpg" alt-text="Screenshot of the Azure portal that shows the Application Insights Metrics page with a graph of the selected values." lightbox="media/quickstart-logs-metrics-tracing/petclinic-microservices-metrics.jpg":::

Spring Boot registers several core metrics, including JVM, CPU, Tomcat, and Logback. The Spring Boot autoconfiguration enables the instrumentation of requests handled by Spring MVC. All three REST controllers (`OwnerResource`, `PetResource`, and `VisitResource`) are instrumented by the `@Timed` Micrometer annotation at the class level.

The `customers-service` application has the following custom metrics enabled:

- @Timed: `petclinic.owner`
- @Timed: `petclinic.pet`

The `visits-service` application has the following custom metrics enabled:

- @Timed: `petclinic.visit`

You can see these custom metrics in the **Metrics** page:

:::image type="content" source="media/quickstart-logs-metrics-tracing/petclinic-microservices-custom-metrics.jpg" alt-text="Screenshot of the Azure portal that shows the Application Insights Metrics page with custom metrics." lightbox="media/quickstart-logs-metrics-tracing/petclinic-microservices-custom-metrics.jpg":::

You can use the Availability Test feature in Application Insights and monitor the availability of applications:

:::image type="content" source="media/quickstart-logs-metrics-tracing/petclinic-microservices-availability.jpg" alt-text="Screenshot of the Azure portal that shows the Application Insights Availability page with the Availability Test section highlighted." lightbox="media/quickstart-logs-metrics-tracing/petclinic-microservices-availability.jpg":::

Navigate to the **Live Metrics** page to see live metrics with low latencies (less than one second):

:::image type="content" source="media/quickstart-logs-metrics-tracing/petclinic-microservices-live-metrics.jpg" alt-text="Screenshot of the Azure portal that shows the Application Insights Live Metrics page low latencies graphs." lightbox="media/quickstart-logs-metrics-tracing/petclinic-microservices-live-metrics.jpg":::

## Tracing

Open the Application Insights created by Azure Spring Apps and start monitoring Spring applications.

Navigate to the **Application Map** page:

:::image type="content" source="media/quickstart-logs-metrics-tracing/distributed-tracking-new-ai-agent.jpg" alt-text="Screenshot of the Azure portal that shows the Application Insights Application Map page with map components." lightbox="media/quickstart-logs-metrics-tracing/distributed-tracking-new-ai-agent.jpg":::

Navigate to the **Performance** page:

:::image type="content" source="media/quickstart-logs-metrics-tracing/petclinic-microservices-performance.jpg" alt-text="Screenshot of the Azure portal that shows the Application Insights Performance page with Operation details." lightbox="media/quickstart-logs-metrics-tracing/petclinic-microservices-performance.jpg":::

Navigate to the **Dependencies** tab, where you can see the performance number for dependencies, particularly SQL calls:

:::image type="content" source="media/quickstart-logs-metrics-tracing/petclinic-microservices-insights-on-dependencies.jpg" alt-text="Screenshot of the Azure portal that shows the Application Insights Performance page with the Depencies table highlighted." lightbox="media/quickstart-logs-metrics-tracing/petclinic-microservices-insights-on-dependencies.jpg":::

Select a SQL call to see the end-to-end transaction in context:

:::image type="content" source="media/quickstart-logs-metrics-tracing/petclinic-microservices-end-to-end-transaction-details.jpg" alt-text="Screenshot of the Azure portal that shows the End-to-end transaction details page." lightbox="media/quickstart-logs-metrics-tracing/petclinic-microservices-end-to-end-transaction-details.jpg":::

Navigate to the **Failures** page and the **Exceptions** tab, where you can see a collection of exceptions:

:::image type="content" source="media/quickstart-logs-metrics-tracing/petclinic-microservices-failures-exceptions.png" alt-text="Screenshot of the Azure portal that shows the Application Insights Failures page." lightbox="media/quickstart-logs-metrics-tracing/petclinic-microservices-failures-exceptions.png":::

Select an exception to see the end-to-end transaction and stacktrace in context:

:::image type="content" source="media/quickstart-logs-metrics-tracing/end-to-end-transaction-details.jpg" alt-text="Screenshot of the Azure portal that shows the End-to-end transaction details page with the exception details and call stack." lightbox="media/quickstart-logs-metrics-tracing/end-to-end-transaction-details.jpg":::

::: zone-end

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

In an earlier quickstart, you also set the default resource group name. If you don't intend to continue to the next quickstart, clear out that default by running the following CLI command:

```azurecli
az config set defaults.group=
```

## Next steps

To explore more monitoring capabilities of Azure Spring Apps, see:

> [!div class="nextstepaction"]
> [Analyze logs and metrics with diagnostics settings](diagnostic-services.md)
> [Stream Azure Spring Apps app logs in real-time](how-to-log-streaming.md)
