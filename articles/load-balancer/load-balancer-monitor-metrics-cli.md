---
title: Get Load Balancer metrics with Azure Monitor CLI
titleSuffix: Azure Load Balancer
description: In this article, get started using the Azure Monitor CLI to collect health and usage metrics for Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to 
ms.date: 06/27/2023
ms.custom: template-how-to, engagement-fy23, devx-track-azurecli
---

# Get Load Balancer metrics with Azure Monitor CLI 

In this article, you learn some examples to list Load Balancer metrics using Azure Monitor CLI.

Complete reference documentation and other samples for retrieving metrics using Azure Monitor CLI are available in the [az monitor metrics reference](/cli/azure/monitor/metrics).

## Table of metric names via CLI

When you use CLI, Load Balancer metrics may use a different metric name for the CLI parameter value. When specifying the metric name via the `--metric dimension` parameter, use the CLI metric name instead. For example, the metric Data path availability would be used by specifying a parameter of `--metric VipAvaialbility`.

Here's a table of common Load Balancer metrics, the CLI metric name, and recommend aggregation values for queries:

|Metric|CLI metric name|Recommended aggregation|
|-----------------|-----------------|-----------------|
|Data path availability |VipAvailability |Average |
|Health probe status |DipAvailability |Average |
|SYN (synchronize) count |SYNCount |Average |
|SNAT connection count |SnatConnectionCount |Sum |
|Allocated SNAT ports |AllocatedSnatPorts |Average| 
|Used SNAT ports |UsedSnatPorts |Average |
|Byte count |ByteCount |Sum |
|Packet count |PacketCount |Sum |

For metric definitions and further details, refer to [Monitoring load balancer data reference](./monitor-load-balancer-reference.md). 

## CLI examples for Load Balancer metrics 
<!-- Introduction paragraph -->

The [az monitor metrics](/cli/azure/monitor/metrics/) command is used to view Azure resource metrics. To see the metric definitions available for a Standard Load Balancer, you run the [az monitor metrics list-definitions](/cli/azure/monitor/metrics#az-monitor-metrics-list-definitions) command. 

```azurecli
# Display available metric definitions for a Standard Load Balancer resource

az monitor metrics list-definitions --resource <resource_id>
```
>[!NOTE]
>In the all the following examples, replace **<resource_id>** with the unique resource id of your Standard Load Balancer. 

To retrieve Standard Load Balancer metrics for a resource, you can use the [az monitor metrics list](/cli/azure/monitor/metrics#az-monitor-metrics-list) command. For example, use the `--metric DipAvailability` option to collect the Health Probe Status metric from a Standard Load Balancer. 

```azurecli

# List the Health Probe Status metric from a Standard Load Balancer

az monitor metrics list --resource <resource_id> --metric DipAvailability 
```

When you run the above command, the output for Health Probe status will be like the following output:
```output
user@Azure:~$ az monitor metrics list --resource <resource_id> --metric DipAvailability
{
  "cost": 59,
  "interval": "0:01:00",
  "namespace": "Microsoft.Network/loadBalancers",
  "resourceregion": "eastus2",
  "timespan": "2022-06-30T15:22:39Z/2022-06-30T16:22:39Z",
  "value": [
    {
      "displayDescription": "Average Load Balancer health probe status per time duration",
      "errorCode": "Success",
      "errorMessage": null,
      "id": "/subscriptions/6a5f35e9-6951-499d-a36b-83c6c6eed44a/resourceGroups/myResourceGroup2/providers/Microsoft.Network/loadBalancers/myLoadBalancer/providers/Microsoft.Insights/metrics/DipAvailability",
      "name": {
        "localizedValue": "Health Probe Status",
        "value": "DipAvailability"
      },
      "resourceGroup": "myResourceGroup2",
      "timeseries": [],
      "type": "Microsoft.Insights/metrics",
      "unit": "Count"
    }
  ]
}
...
```
You can specify the aggregation type for a metric with the `–-aggregation` parameter. For recommended aggregations, see Monitoring load balancer data reference](./monitor-load-balancer-reference.md). 

```azurecli

# List the average Health Probe Status metric from a Standard Load Balancer

az monitor metrics list --resource <resource_id> --metric DipAvailability --aggregation Average 
```
To specify the interval to metrics, use the `--interval` parameter and specify a value in ##h##m format. The default interval is 1 m.

```azurecli

# List the average List the average Health Probe Status metric from a Standard Load Balancer in 5 minute intervals

az monitor metrics list --resource <resource_id> --metric DipAvailability --aggregation Average --interval 5m
```
By default, az monitor metrics list returns the resource’s aggregate metrics from the last hour. You can query metric data over a period of time using `--start-time` and `--end-time` with the format of date (yyyy-mm-dd) time (hh:mm:ss.xxxxx) timezone (+/-hh:mm). To list the average Health Probe Status aggregated per day from May 5, 2022 and May 10, 2022, use the following command:

```azurecli
# List average Health Probe Status metric aggregated per day from May 5, 2022 and May 10, 2022. 

az monitor metrics list --resource <resource_id> --metric DipAvailability --start-time 2022-05-01T00:00:00Z --end-time 2022-05-10T00:00:00Z --interval PT24H --aggregation Average
```
>[!Note]
>Start and end times are represented using a format of yyyy-mm-dd format. For example, every day between May 5, 2022 and May 10, 2022 would be represented as `2022-05-01` and `2022-05-10`. 


To split metrics on a dimension, such as “BackendIPAddress”, specify the dimension in the `--filter` flag. Dimensions of a metric are name/value pairs that include more data to describe the metric value. To learn more about which dimensions are supported for each metric, see [Monitoring load balancer data reference](./monitor-load-balancer-reference.md). 
 
```azurecli
# List average Health Probe Status metric and filter for all BackendIPAddress dimensions

az monitor metrics list --resource $res --metric DipAvailability --filter "BackendIPAddress eq '*'" --aggregation Average
```

You can also specify a specific dimension value. 

```azurecli
# List average Health Probe Status metric and filter for the 10.1.0.4 BackendIPAddress dimension

az monitor metrics list --resource <resource_id> --metric DipAvailability --filter "BackendIPAddress eq '10.1.0.4'" --aggregation Average 
```

In cases where you need to filter on multiple dimension values, specify the `--filter` value using `and` between the values.

```azurecli
# List average Health Probe Status metric and filter for all BackendIPAddress and BackendPort dimensions

az monitor metrics list --resource <resource_id> --metric DipAvailability --filter "BackendIPAddress eq '*' and BackendPort eq '*'" --aggregation Average 
```

## Next steps
* [Review the metric definitions to better understand how each is generated](./load-balancer-standard-diagnostics.md#multi-dimensional-metrics)
* [Create Connection Monitors for your Load Balancer](./load-balancer-standard-diagnostics.md)
* [Create your own workbooks](../azure-monitor/visualize/workbooks-overview.md), you can take inspiration by clicking on the edit button in your detailed metrics dashboard
