---
title: Get Load Balancer metrics with Azure Monitor CLI
titleSuffix: Azure Load Balancer
description: In this article, get started using the Azure Monitor CLI to collect health and usage metrics for Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to 
ms.date: 06/09/2022
ms.custom: template-how-to 
---

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

# Get Load Balancer metrics with Azure Monitor CLI 

In this article, we'll go over a couple of examples how to retrieve Load Balancer metrics using Azure Monitor CLI.

Complete reference documentation and other samples for retrieving metrics using Azure Monitor CLI are available in the [az monitor metrics reference](/cli/azure/monitor/metrics).

## Table of metric names via CLI

When using CLI, Load Balancer metrics may use a different metric name. When specifying the metric name via the --metric dimension, please use the CLI metric name equivalent instead.

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

To see what metrics are available for Standard Load Balancer resources, you can run the az monitor metrics list-definitions command. 

```azurecli
# Display available metrics for Standard Load Balancer resources
az monitor metrics list-definitions 
```

To retrieve Standard Load Balancer metrics using CLI, you can use the `az monitor metrics list` command.  

```azurecli
# Retrieve all Standard Load Balancer metrics
az monitor metrics list  
```

```azurecli
# List the Health Probe Status metric from a Standard Load Balancer
az monitor metrics list --resource <ResourceName> --metric DipAvailability 
```

```azurecli
# List the Health Probe Status metric from a Standard Load Balancer
az monitor metrics list --resource "/subscriptions/6a5f35e9-6951-499d-a36b-83c6c6eed44a/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/demoLB" --metrics DipAvailability
```
When you run the above command, the output will appear as follows:
```output
...
{
  "cost": 59,
  "interval": "0:01:00",
  "namespace": "Microsoft.Network/loadBalancers",
  "resourceregion": "eastus",
  "timespan": "2022-06-03T15:48:50Z/2022-06-03T16:48:50Z",
  "value": [
    {
      "displayDescription": "Average Load Balancer health probe status per time duration",
      "errorCode": "Success",
      "errorMessage": null,
      "id": "/subscriptions/6a5f35e9-6951-499d-a36b-83c6c6eed44a/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/demoLB/providers/Microsoft.Insights/metrics/DipAvailability",
      "name": {
        "localizedValue": "Health Probe Status",
        "value": "DipAvailability"
      },
      "resourceGroup": "myResourceGroup",
      "timeseries": [],
      "type": "Microsoft.Insights/metrics",
      "unit": "Count"
    }
  ]
}
...
```
Use the following CLI command to collect the Health Probe Status metric from a Standard Load Balancer. By default, Azure monitor metrics list returns the resource’s metrics from the last hour. You can specify the time range using –start-time and –end-time instead. 

List average Health Probe Status aggregated per day, every day between May 5, 2022 and May 10, 2022. 

```azurecli
# List average Health Probe Status aggregated per day, every day between May 5, 2022 and May 10, 2022. 

az monitor metrics list --resource <ResourceName> --metric DipAvailability --start-time 2022-05-01T00:00:00Z --end-time 2022-05-10T00:00:00Z --interval PT24H 
```
>[!Note]
>Start and end times are represented using a format of yyyy-mm-dd format. For example, every day between May 5, 2022 and May 10, 2022 would be represented as `2022-05-01` and `2022-05-10`. 

You can also specify the aggregation type of your metric via the –aggregation flag. For recommended aggregations, see Monitoring load balancer data reference. 

```azurecli
az monitor metrics list --resource <ResourceName> --metric DipAvailability –aggregation Average 
```

The above command uses the “Average” aggregation type, reporting data in 1-minute intervals. The –interval flag determines the granularity at which metrics are aggregated.  

```azurecli
az monitor metrics list --resource <ResourceName> --metric DipAvailability –aggregation Average –interval 1M 
```

To split metrics on a dimension such as “BackendIPAddress”, specify the dimension in the –filter flag. To learn more about which dimensions are supported for each metric, see [Monitoring load balancer data reference](./monitor-load-balancer-reference.md). 
 
```azurecli
az monitor metrics list --resource <ResourceName> --metric DipAvailability –filter “BackendIPAddress eq ‘*’” 
```

You can also specify a specific dimension value. 

```azurecli
az monitor metrics list --resource <ResourceName> --metric DipAvailability –filter “BackendIPAddress eq ’10.1.0.4’” 
```

You can also filter on multiple dimension values.

```azurecli
az monitor metrics list --resource <ResourceName> --metric DipAvailability –filter “BackendIPAddress eq ‘*’ and BackendPort eq ‘*’” 
```


## Next steps
* Review the dashboard and provide feedback using the below link if there is anything that can be improved
* [Review the metrics documentation to ensure you understand how each metric is calculated](./load-balancer-standard-diagnostics.md#multi-dimensional-metrics)
* [Create Connection Monitors for your Load Balancer](../network-watcher/connection-monitor.md)
* [Create your own workbooks](../azure-monitor/visualize/workbooks-overview.md), you can take inspiration by clicking on the edit button in your detailed metrics dashboard