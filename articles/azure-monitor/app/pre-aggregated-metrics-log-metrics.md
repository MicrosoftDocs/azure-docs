---
title: Log-based and pre-aggregated metrics in Application Insights | Microsoft Docs
description: This article explains when to use log-based versus pre-aggregated metrics in Application Insights.
ms.topic: conceptual
ms.date: 04/05/2023
ms.reviewer: vitalyg
---

# Log-based and pre-aggregated metrics in Application Insights

This article explains the difference between "traditional" Application Insights metrics that are based on logs and pre-aggregated metrics. Both types of metrics are available to users of Application Insights. Each one brings a unique value in monitoring application health, diagnostics, and analytics. The developers who are instrumenting applications can decide which type of metric is best suited to a particular scenario. Decisions are based on the size of the application, expected volume of telemetry, and business requirements for metrics precision and alerting.

[!INCLUDE [azure-monitor-app-insights-otel-available-notification](../includes/azure-monitor-app-insights-otel-available-notification.md)]

## Log-based metrics

In the past, the application monitoring telemetry data model in Application Insights was solely based on a few predefined types of events, such as requests, exceptions, dependency calls, and page views. Developers can use the SDK to emit these events manually by writing code that explicitly invokes the SDK. Or they can rely on the automatic collection of events from autoinstrumentation. In either case, the Application Insights back end stores all collected events as logs. The Application Insights panes in the Azure portal act as an analytical and diagnostic tool for visualizing event-based data from logs.

Using logs to retain a complete set of events can bring great analytical and diagnostic value. For example, you can get an exact count of requests to a particular URL with the number of distinct users who made these calls. Or you can get detailed diagnostic traces, including exceptions and dependency calls for any user session. Having this type of information can improve visibility into the application health and usage. It can also cut down the time necessary to diagnose issues with an app.

At the same time, collecting a complete set of events might be impractical or even impossible for applications that generate a large volume of telemetry. For situations when the volume of events is too high, Application Insights implements several telemetry volume reduction techniques that reduce the number of collected and stored events. These techniques include [sampling](./sampling.md) and [filtering](./api-filtering-sampling.md). Unfortunately, lowering the number of stored events also lowers the accuracy of the metrics that, behind the scenes, must perform query-time aggregations of the events stored in logs.

> [!NOTE]
> In Application Insights, the metrics that are based on the query-time aggregation of events and measurements stored in logs are called log-based metrics. These metrics typically have many dimensions from the event properties, which makes them superior for analytics. The accuracy of these metrics is negatively affected by sampling and filtering.

## Pre-aggregated metrics

In addition to log-based metrics, in late 2018, the Application Insights team shipped a public preview of metrics that are stored in a specialized repository that's optimized for time series. The new metrics are no longer kept as individual events with lots of properties. Instead, they're stored as pre-aggregated time series, and only with key dimensions. This change makes the new metrics superior at query time. Retrieving data happens faster and requires less compute power. As a result, new scenarios are enabled, such as [near real time alerting on dimensions of metrics](../alerts/alerts-metric-near-real-time.md) and more responsive [dashboards](./overview-dashboard.md).

> [!IMPORTANT]
> Both log-based and pre-aggregated metrics coexist in Application Insights. To differentiate the two, in the Application Insights user experience the pre-aggregated metrics are now called Standard metrics (preview). The traditional metrics from the events were renamed to Log-based metrics.

The newer SDKs ([Application Insights 2.7](https://www.nuget.org/packages/Microsoft.ApplicationInsights/2.7.2) SDK or later for .NET) pre-aggregate metrics during collection. This process applies to [standard metrics sent by default](../essentials/metrics-supported.md#microsoftinsightscomponents), so the accuracy isn't affected by sampling or filtering. It also applies to custom metrics sent by using [GetMetric](./api-custom-events-metrics.md#getmetric), which results in less data ingestion and lower cost.

For the SDKs that don't implement pre-aggregation (that is, older versions of Application Insights SDKs or for browser instrumentation), the Application Insights back end still populates the new metrics by aggregating the events received by the Application Insights event collection endpoint. Although you don't benefit from the reduced volume of data transmitted over the wire, you can still use the pre-aggregated metrics and experience better performance and support of the near real time dimensional alerting with SDKs that don't pre-aggregate metrics during collection.

The collection endpoint pre-aggregates events before ingestion sampling. For this reason, [ingestion sampling](./sampling.md) never affects the accuracy of pre-aggregated metrics, regardless of the SDK version you use with your application.

### SDK supported pre-aggregated metrics table

| Current production SDKs | Standard metrics (SDK pre-aggregation) | Custom metrics (without SDK pre-aggregation) | Custom metrics (with SDK pre-aggregation)|
|------------------------------|-----------------------------------|----------------------------------------------|---------------------------------------|
| .NET Core and .NET Framework | Supported (V2.13.1+)| Supported via [TrackMetric](api-custom-events-metrics.md#trackmetric)| Supported (V2.7.2+) via [GetMetric](get-metric.md) |
| Java                         | Not supported       | Supported via [TrackMetric](api-custom-events-metrics.md#trackmetric)| Not supported                           |
| Node.js                      | Supported (V2.0.0+) | Supported via [TrackMetric](api-custom-events-metrics.md#trackmetric)| Not supported                           |
| Python                       | Not supported       | Supported                                 | Partially supported via [OpenCensus.stats](/previous-versions/azure/azure-monitor/app/opencensus-python#metrics) |  

> [!NOTE]
> The metrics implementation for Python by using OpenCensus.stats is different from GetMetric. For more information, see the [Python documentation on metrics](/previous-versions/azure/azure-monitor/app/opencensus-python#metrics).

### Codeless supported pre-aggregated metrics table

| Current production SDKs | Standard metrics (SDK pre-aggregation) | Custom metrics (without SDK pre-aggregation) | Custom metrics (with SDK pre-aggregation)|
|-------------------------|--------------------------|-------------------------------------------|-----------------------------------------|
| ASP.NET                 | Supported <sup>1<sup>    | Not supported                             | Not supported                           |
| ASP.NET Core            | Supported <sup>2<sup>    | Not supported                             | Not supported                           |
| Java                    | Not supported            | Not supported                             | [Supported](opentelemetry-add-modify.md?tabs=java#metrics) |
| Node.js                 | Not supported            | Not supported                             | Not supported                           |

1. ASP.NET codeless attach on virtual machines/virtual machine scale sets and on-premises emits standard metrics without dimensions. The same is true for Azure App Service, but the collection level must be set to recommended. The SDK is required for all dimensions.
2. ASP.NET Core codeless attach on App Service emits standard metrics without dimensions. SDK is required for all dimensions.

## Use pre-aggregation with Application Insights custom metrics

You can use pre-aggregation with custom metrics. The two main benefits are: 

- The ability to configure and alert on a dimension of a custom metric
- Reduce the volume of data sent from the SDK to the Application Insights collection endpoint

There are several [ways of sending custom metrics from the Application Insights SDK](./api-custom-events-metrics.md). If your version of the SDK offers [GetMetric and TrackValue](./api-custom-events-metrics.md#getmetric), these methods are the preferred way of sending custom metrics. In this case, pre-aggregation happens inside the SDK. This approach reduces the volume of data stored in Azure and also the volume of data transmitted from the SDK to Application Insights. Otherwise, use the [trackMetric](./api-custom-events-metrics.md#trackmetric) method, which pre-aggregates metric events during data ingestion.

## Custom metrics dimensions and pre-aggregation

All metrics that you send by using [trackMetric](./api-custom-events-metrics.md#trackmetric) or [GetMetric and TrackValue](./api-custom-events-metrics.md#getmetric) API calls are automatically stored in both logs and metrics stores. Although the log-based version of your custom metric always retains all dimensions, the pre-aggregated version of the metric is stored by default with no dimensions. You can turn on collection of dimensions of custom metrics on the [usage and estimated cost](../cost-usage.md#usage-and-estimated-costs) tab by selecting the **Enable alerting on custom metric dimensions** checkbox.

:::image type="content" source="./media/pre-aggregated-metrics-log-metrics/001-cost.png" lightbox="./media/pre-aggregated-metrics-log-metrics/001-cost.png" alt-text="Screenshot that shows usage and estimated costs.":::

## Quotas

Pre-aggregated metrics are stored as time series in Azure Monitor. [Azure Monitor quotas on custom metrics](../essentials/metrics-custom-overview.md#quotas-and-limits) apply.

> [!NOTE]
> Going over the quota might have unintended consequences. Azure Monitor might become unreliable in your subscription or region. To learn how to avoid exceeding the quota, see [Design limitations and considerations](../essentials/metrics-custom-overview.md#design-limitations-and-considerations).

## Why is collection of custom metrics dimensions turned off by default?

The collection of custom metrics dimensions is turned off by default because in the future storing custom metrics with dimensions will be billed separately from Application Insights. Storing the nondimensional custom metrics remain free (up to a quota). You can learn about the upcoming pricing model changes on our official [pricing page](https://azure.microsoft.com/pricing/details/monitor/).

## Create charts and explore log-based and standard pre-aggregated metrics

Use [Azure Monitor metrics explorer](../essentials/metrics-getting-started.md) to plot charts from pre-aggregated and log-based metrics and to author dashboards with charts. After you select the Application Insights resource you want, use the namespace picker to switch between standard (preview) and log-based metrics. You can also select a custom metric namespace.

:::image type="content" source="./media/pre-aggregated-metrics-log-metrics/002-metric-namespace.png" lightbox="./media/pre-aggregated-metrics-log-metrics/002-metric-namespace.png" alt-text="Screenshot that shows Metric namespace.":::

## Pricing models for Application Insights metrics

Ingesting metrics into Application Insights, whether log-based or pre-aggregated, generates costs based on the size of the ingested data. For more information, see [Azure Monitor Logs pricing details](../logs/cost-logs.md#application-insights-billing). Your custom metrics, including all its dimensions, are always stored in the Application Insights log store. Also, a pre-aggregated version of your custom metrics with no dimensions is forwarded to the metrics store by default.

Selecting the [Enable alerting on custom metric dimensions](#custom-metrics-dimensions-and-pre-aggregation) option to store all dimensions of the pre-aggregated metrics in the metric store can generate *extra costs* based on [custom metrics pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Next steps

* [Metrics - Get - REST API](/rest/api/application-insights/metrics/get)
* [Application Insights API for custom events and metrics](api-custom-events-metrics.md)
* [Near real time alerting](../alerts/alerts-metric-near-real-time.md)
* [GetMetric and TrackValue](./api-custom-events-metrics.md#getmetric)
