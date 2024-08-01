---
title: Metrics for Azure Elastic SAN
description: Learn about the available metrics that can let you understand how your Azure Elastic SAN is performing.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 06/28/2024
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

By default, all metrics are shown at the SAN level. To view these metrics at either the volume group or volume level, select a filter on your selected metric to view your data on a specific volume group or volume.

## Resource logging

You can configure the [diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings) of your elastic SAN to send Azure platform logs and metrics to different destinations. Currently, there are two log configurations:

- All - Every resource log offered by the resource.
- Audit - All resource logs that record customer interactions with data or the settings of the service. 

Audit logs are an attempt by each resource provider to provide the most relevant audit data, but might not be considered sufficient from an auditing standards perspective.

Available log categories:

- Write Success Requests
- Write Failed Requests
- Read Success Requests
- Read Failed Requests
- Persistent Reservation Requests
- SendTargets Requests

## Next steps

- [Azure Monitor Metrics overview](../../azure-monitor/essentials/data-platform-metrics.md)
- [Azure Monitor Metrics aggregation and display explained](../../azure-monitor/essentials/metrics-aggregation-explained.md)
