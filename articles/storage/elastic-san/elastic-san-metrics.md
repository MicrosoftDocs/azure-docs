---
title: Metrics for Azure Elastic SAN
description: Learn about the available metrics that can let you understand how your Azure Elastic SAN is performing.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 05/31/2024
ms.author: rogarana
---

# Elastic SAN metrics

Azure offers metrics in the Azure portal that provide insight into your Elastic SAN resources. This article provides definitions of the specific metrics you can select to monitor. 

## Metrics definitions 
The following metrics are currently available for your Elastic SAN resource. You can configure and view them in the Azure portal: 

|Metric|Definition|
|---|---|
|**Used Capacity**|The total amount of storage used in your SAN resources. At the SAN level, it's the sum of capacity used by volume groups and volumes, in bytes.|
|**Transactions**|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests that produced errors.|
|**E2E Latency**|The average end-to-end latency of successful requests made to the resource or the specified API operation.|
|**Server Latency**|The average time used to process a successful request. This value doesn't include the network latency specified in **E2E Latency**. |
|**Ingress**|The amount of ingress data. This number includes ingress to the resource from external clients as well as ingress within Azure. |
|**Egress**|The amount of egress data. This number includes egress from the resource to external clients as well as egress within Azure.  |

All metrics are shown at the elastic SAN level.

## Next steps

- [Azure Monitor Metrics overview](../../azure-monitor/essentials/data-platform-metrics.md)
- [Azure Monitor Metrics aggregation and display explained](../../azure-monitor/essentials/metrics-aggregation-explained.md)
