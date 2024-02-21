---
title: Metrics for Azure Elastic SAN
description: Learn about the available metrics for an Azure Elastic SAN.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 02/13/2024
ms.author: rogarana
---

# Elastic SAN metrics

Azure offers metrics in the Azure portal that provide insight into your Elastic SAN resources. This article provides definitions of the specific metrics you can select to monitor. 

## Metrics definitions 
The following metrics are currently available for your Elastic SAN resource. You can configure and view them in the Azure portal: 

|Metric|Definition|
|---|---|
|**Used Capacity**|The total amount of storage used in your SAN resources. At the SAN level, it's the sum of capacity used by volume groups and volumes, in bytes. At the volume group level, it's the sum of the capacity used by all volumes in the volume group, in bytes|
|**Transactions**|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests that produced errors.|
|**E2E Latency**|The average end-to-end latency of successful requests made to the resource or the specified API operation.|
|**Server Latency**|The average time used to process a successful request. This value doesn't include the network latency specified in **E2E Latency**. |
|**Ingress**|The amount of ingress data. This number includes ingress from an external client into the resource as well as ingress within Azure. |
|**Egress**|The amount of egress data. This number includes egress from an external client into the resource as well as egress within Azure.  |

By default, all metrics are shown at the SAN level. To view these metrics at either the volume group or volume level, select a filter on your selected metric to view your data on a specific volume group or volume.

## Next steps

- [Azure Monitor Metrics overview](../../azure-monitor/essentials/data-platform-metrics.md)
- [Azure Monitor Metrics aggregation and display explained](../../azure-monitor/essentials/metrics-aggregation-explained.md)