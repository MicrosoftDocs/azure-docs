---
title: Control plane metrics in Azure Monitor
description: Azure Resource Manager metrics in Azure Monitor | Traffic and latency observability for subscription-level control plane requests
ms.topic: conceptual
ms.date: 12/01/2021
---

# Azure Resource Manager metrics in Azure Monitor
When you create and manage resources in Azure, your requests are orchestrated through Azure's [control plane](../control-plane-and-data-plane.md), Azure Resource Manager. This article describes how to monitor the volume and latency of control plane requests made to Azure.

With these metrics, you can observe traffic and latency for control plane requests throughout your subscriptions. The metrics are available for up to three months (93 days) and only track synchronous requests. For a scenario like a VM creation, the metrics do not represent the performance or reliability of the long running asynchronous operation.

## Accessing Azure Resource Manager metrics

You can access control plane metrics via the Azure Monitor REST APIs, SDKs, and the Azure portal (by selecting the "Azure Resource Manager" metric). For an overview on Azure Monitor, see [Azure Monitor Metrics](../../monitoring-and-diagnostics/monitoring-overview-metrics.md).

There is no opt-in or sign-up process to access control plane metrics.

For guidance on how to retrieve a bearer token and make requests to Azure, see [Azure REST API reference](https://docs.microsoft.com/en-us/rest/api/azure/#create-the-request).

## Metric definition

The definition for Azure Resource Manager metrics in Azure Monitor is only accessible through the 2017-12-01-preview API version. To retrieve the definition, you can run the following snippet, with your subscription ID replacing "00000000-0000-0000-0000-000000000000":

```c
> curl --location --request GET 'https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/microsoft.insights/metricDefinitions?api-version=2017-12-01-preview&metricnamespace=microsoft.resources/subscriptions' \
--header 'Authorization: bearer {{bearerToken}}'
```

This will return the definition for the metrics schema. Notably, this schema includes the dimensions you can filter on with the Monitor API:

| Dimension Name | Description |
| ------------------- | ----------------- |
| **ResourceUri** | The full Resource ID for a particular resource. |
| **RequestRegion** | The region where control plane requests originate, like "EastUS2" |
| **StatusCode** | Response type from Azure Resource Manager for your control plane request. Possible values are (but not limited to): <br/>- 0<br/>- 200<br/>- 201<br/>- 400<br/>- 404<br/>- 429<br/>- 500<br/>- 502|
| **StatusCodeClass** | The class for the status code returned from Azure Resource Manager. Possible values are: <br/>- 2xx<br/>- 4xx<br/>- 5xx|
| **Namespace** | The namespace for the Resource Provider, in all caps, like "MICROSOFT.COMPUTE"|
| **ResourceType** | Any resource type in Azure that you have created or sent a request to, in all caps, like "VIRTUALMACHINES" |
| **Method** | The HTTP method used in the request made to Azure Resource Manager. Possible values are: <br/>- GET<br/>- HEAD<br/>- PUT<br/>- POST<br/>- PATCH<br/>- DELETE|

### Example: Query traffic and latency control plane metrics via Azure portal

First, navigate to the Azure Monitor blade within the [portal](https://portal.azure.com):

:::image type="content" source="./media/view-arm-monitor-metrics/explore-metrics-portal.png" alt-text="Navigate to the Azure portal's Monitor page":::

After selecting **Explore Metrics**, select a single subscription and then select the **Azure Resource Manager** metric:

:::image type="content" source="./media/view-arm-monitor-metrics/select-arm-metric.png" alt-text="Select a single subscription and the Azure Resource Manager metric.":::

Then, after selecting **Apply**, you can visualize your Traffic or Latency control plane metrics with custom filtering and splitting:

:::image type="content" source="./media/view-arm-monitor-metrics/arm-metrics-view.png" alt-text="From the metrics visualization, you can filter and split by the dimensions you choose.":::

### Example: Query traffic and latency control plane metrics via REST API

After you are authenticated with Azure, you can make a request to retrieve control plane metrics for your subscription. In the script shared below, please replace"00000000-0000-0000-0000-000000000000" with your subscription ID:

```c
> curl --location --request GET "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/microsoft.insights/metrics?api-version=2021-05-01&interval=P1D&metricnames=Latency,Traffic&metricnamespace=microsoft.resources/subscriptions&region=global&aggregation=average,count&timespan=2021-11-01T00:00:00Z/2021-11-01T02:00:00Z" \
--header "Authorization: bearer {{bearerToken}}"
```

The response for the request above would be populated with your metrics in a JSON response:

```Json
{
    "cost": 476,
    "timespan": "2021-11-01T00:00:00Z/2021-11-01T02:00:00Z",
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
                            "average": 0.19345163584637265
                        }
                    ]
                }
            ],
            "errorCode": "Success"
        },
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
                            "count": 1406.0,
                            "average": 0.19345163584637276
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

For the metrics supporting dimensions, you need to specify the dimension value to see the corresponding metrics values. For example, if you want to use **Latency** value for successful requests to ARM, you need to filter the **StatusCodeClass** dimension with **2XX**.

Similarly with **Traffic**, you would need to filter the **Namespace** dimension for **MICROSOFT.NETWORK** if you want to look at the number of requests made in your subscription for Networking resources, like Virtual Networks and Load Balancers.


## Next steps

* [Azure Monitor Overview](../../monitoring-and-diagnostics/monitoring-overview.md)
