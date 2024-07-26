---
title: Monitor Azure Resource Manager
description: Start here to learn how to monitor Azure Resource Manager. Learn about Traffic and latency observability for subscription-level control plane requests.
ms.date: 07/25/2024
ms.custom: horz-monitor, devx-track-arm-template
ms.topic: conceptual
author: mumian
ms.author: jgao
ms.service: azure-resource-manager
---

# Monitor Azure Resource Manager

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

For more information, see [Monitor Azure Monitor Resource Group insights](resource-group-insights.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Resource Manager, see [Azure Resource Manager monitoring data reference](monitor-resource-manager-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Resource Manager, see [Azure Resource Manager monitoring data reference](monitor-resource-manager-reference.md#metrics).

When you create and manage resources in Azure, your requests are orchestrated through Azure's [control plane](./control-plane-and-data-plane.md), Azure Resource Manager. This article describes how to monitor the volume and latency of control plane requests made to Azure.

With these metrics, you can observe traffic and latency for control plane requests throughout your subscriptions. For example, you can now figure out when your requests have been throttled by [examining throttled requests](#examining-throttled-requests). Determine if they failed by filtering for specific status codes and [examining server errors](#examining-server-errors).

The metrics are available for up to three months (93 days) and only track synchronous requests. For a scenario like a virtual machine creation, the metrics don't represent the performance or reliability of the long running asynchronous operation.

### Accessing Azure Resource Manager metrics

You can access control plane metrics by using the Azure Monitor REST APIs, SDKs, and the Azure portal by selecting the **Azure Resource Manager** metric. For an overview on Azure Monitor, see [Azure Monitor Metrics](../../azure-monitor/data-platform.md).

There's no opt-in or sign-up process to access control plane metrics.

For guidance on how to retrieve a bearer token and make requests to Azure, see [Azure REST API reference](/rest/api/azure/#create-the-request).

### Metric definition

The definition for Azure Resource Manager metrics in Azure Monitor is only accessible through the 2017-12-01-preview API version. To retrieve the definition, you can run the following snippet. Replace `00000000-0000-0000-0000-000000000000` with your subscription ID.

```bash
curl --location --request GET 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/microsoft.insights/metricDefinitions?api-version=2017-12-01-preview&metricnamespace=microsoft.resources/subscriptions' \
--header 'Authorization: bearer {{bearerToken}}'
```

This snippet returns the definition for the metrics schema. Notably, this schema includes [the dimensions you can filter on with the Monitor API](monitor-resource-manager-reference.md#metric-dimensions).

### Metrics examples

Here are some scenarios that can help you explore Azure Resource Manager metrics.

#### Query traffic and latency control plane metrics with Azure portal

First, navigate to the Azure Monitor page within the [portal](https://portal.azure.com):

:::image type="content" source="./media/view-arm-monitor-metrics/explore-metrics-portal.png" alt-text="Screenshot of navigating to the Azure portal's Monitor page with Explore Metrics highlighted.":::

After selecting **Explore Metrics**, select a single subscription and then select the **Azure Resource Manager** metric:

:::image type="content" source="./media/view-arm-monitor-metrics/select-arm-metric.png" alt-text="Screenshot of selecting a single subscription and the Azure Resource Manager metric in the Azure portal.":::

Then, after selecting **Apply**, you can visualize your Traffic or Latency control plane metrics with custom filtering and splitting:

:::image type="content" source="./media/view-arm-monitor-metrics/arm-metrics-view.png" alt-text="Screenshot of the metrics visualization in the Azure portal, showing options to filter and split by dimensions.":::

#### Query traffic and latency control plane metrics with REST API

After you authenticate with Azure, you can make a request to retrieve control plane metrics for your subscription. In the script, replace `00000000-0000-0000-0000-000000000000` with your subscription ID. The script retrieves the average request latency, in seconds, and the total request count for the two day timespan, broken down by one day intervals:

```bash
curl --location --request GET "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/microsoft.insights/metrics?api-version=2021-05-01&interval=P1D&metricnames=Latency&metricnamespace=microsoft.resources/subscriptions&region=global&aggregation=average,count&timespan=2021-11-01T00:00:00Z/2021-11-03T00:00:00Z" \
--header "Authorization: bearer {{bearerToken}}"
```

For Azure Resource Manager metrics, you can retrieve the traffic count by using the Latency metric and including the 'count' aggregation. You see a JSON response for the request:

```Json
{
    "cost": 5758,
    "timespan": "2021-11-01T00:00:00Z/2021-11-03T00:00:00Z",
    "interval": "P1D",
    "value": [
        {
            "id": "subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Insights/metrics/Latency",
            "type": "Microsoft.Insights/metrics",
            "name": {
                "value": "Latency",
                "localizedValue": "Latency"
            },
            "displayDescription": "Latency data for all requests to Azure Resource Manager",
            "unit": "Seconds",
            "timeseries": [
                {
                    "metadatavalues": [],
                    "data": [
                        {
                            "timeStamp": "2021-11-01T00:00:00Z",
                            "count": 1406.0,
                            "average": 0.19345163584637273
                        },
                        {
                            "timeStamp": "2021-11-02T00:00:00Z",
                            "count": 1517.0,
                            "average": 0.28294792353328935
                        }
                    ]
                }
            ],
            "errorCode": "Success"
        }
    ],
    "namespace": "microsoft.resources/subscriptions",
    "resourceregion": "global"
}
```

If you want to retrieve only the traffic count, then you can use the Traffic metric with the `count` aggregation:

```bash
curl --location --request GET 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/microsoft.insights/metrics?api-version=2021-05-01&interval=P1D&metricnames=Traffic&metricnamespace=microsoft.resources/subscriptions&region=global&aggregation=count&timespan=2021-11-01T00:00:00Z/2021-11-03T00:00:00Z' \
--header 'Authorization: bearer {{bearerToken}}'
```

The response for the request is:

```Json
{
    "cost": 2879,
    "timespan": "2021-11-01T00:00:00Z/2021-11-03T00:00:00Z",
    "interval": "P1D",
    "value": [
        {
            "id": "subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Insights/metrics/Traffic",
            "type": "Microsoft.Insights/metrics",
            "name": {
                "value": "Traffic",
                "localizedValue": "Traffic"
            },
            "displayDescription": "Traffic data for all requests to Azure Resource Manager",
            "unit": "Count",
            "timeseries": [
                {
                    "metadatavalues": [],
                    "data": [
                        {
                            "timeStamp": "2021-11-01T00:00:00Z",
                            "count": 1406.0
                        },
                        {
                            "timeStamp": "2021-11-02T00:00:00Z",
                            "count": 1517.0
                        }
                    ]
                }
            ],
            "errorCode": "Success"
        }
    ],
    "namespace": "microsoft.resources/subscriptions",
    "resourceregion": "global"
}
```

For the metrics supporting dimensions, you need to specify the dimension value to see the corresponding metrics values. For example, if you want to focus on the **Latency** for successful requests to Resource Manager, you need to filter the **StatusCodeClass** dimension with **2XX**.

If you want to look at the number of requests made in your subscription for Networking resources, like Virtual Networks and Load Balancers, you would need to filter the **Namespace** dimension for **MICROSOFT.NETWORK**.

#### Examining Throttled Requests

To view only your throttled requests, you need to filter for 429 status code responses only. For REST API calls, filtering is accomplished by using the [$filter property](/rest/api/monitor/Metrics/List#uri-parameters) and the StatusCode dimension by appending: `$filter=StatusCode eq '429'` as seen at the end of the request in the following snippet:

```bash
curl --location --request GET 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/microsoft.insights/metrics?api-version=2021-05-01&interval=P1D&metricnames=Latency&metricnamespace=microsoft.resources/subscriptions&region=global&aggregation=count,average&timespan=2021-11-01T00:00:00Z/2021-11-03T00:00:00Z&$filter=StatusCode%20eq%20%27429%27' \
--header 'Authorization: bearer {{bearerToken}}'
```

You can also filter directly in portal:
:::image type="content" source="./media/view-arm-monitor-metrics/throttling-filter-portal.png" alt-text="Screenshot of filtering HTTP Status Code to 429 responses only in the Azure portal.":::

#### Examining Server Errors

Similar to looking at throttled requests, you view *all* requests that returned a server error response code by filtering 5xx responses only. For REST API calls, filtering is accomplished by using the [$filter property](/rest/api/monitor/Metrics/List#uri-parameters) and the StatusCodeClass dimension by appending: $filter=StatusCodeClass eq '5xx' as seen at the end of the request in the following snippet:

```bash
curl --location --request GET 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/microsoft.insights/metrics?api-version=2021-05-01&interval=P1D&metricnames=Latency&metricnamespace=microsoft.resources/subscriptions&region=global&aggregation=count,average&timespan=2021-11-01T00:00:00Z/2021-11-03T00:00:00Z&$filter=StatusCodeClass%20eq%20%275xx%27' \
--header 'Authorization: bearer {{bearerToken}}'
```

You can also accomplish generic server errors filtering within portal by setting the filter property to `StatusCodeClass` and the value to `5xx`, similar to what was done in the throttling example.

[!INCLUDE [horz-monitor-no-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

### Resource Manager alert rules

You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Resource Manager monitoring data reference](monitor-resource-manager-reference.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Resource Manager monitoring data reference](monitor-resource-manager-reference.md) for a reference of the metrics, logs, and other important values created for Resource Manager.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
