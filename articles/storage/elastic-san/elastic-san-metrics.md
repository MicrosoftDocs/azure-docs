---
title: Metrics for Azure Elastic SAN
description: Learn about the available metrics that can let you understand how your Azure Elastic SAN is performing.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: concept-article
ms.date: 01/07/2026
ms.author: rogarana
# Customer intent: As a cloud storage administrator, I want to monitor the performance metrics of my Azure Elastic SAN, so that I can optimize its availability and manage resource usage effectively.
---

# Elastic SAN metrics

Azure provides metrics in the Azure portal that give you insight into your Elastic SAN resources. This article provides definitions of specific metrics you can select to monitor. 

## Metrics definitions 
The following metrics are currently available for your Elastic SAN resource. You can configure and view them in the Azure portal: 

|Metric|Definition|
|---|---|
|**Availability**|The percentage of availability for the storage service or the specified API operation.|
|**Transactions**|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests that produced errors.|
|**E2E Latency**|The average end-to-end latency of successful requests made to the resource or the specified API operation.|
|**Server Latency**|The average time used to process a successful request. This value doesn't include the network latency specified in **E2E Latency**. |
|**Ingress**|The amount of ingress data. This number includes ingress to the resource from external clients as well as ingress within Azure. |
|**Egress**|The amount of egress data. This number includes egress from the resource to external clients as well as egress within Azure.  |

By default, all metrics are shown at the SAN level. To view these metrics at either the volume group or volume level, select a filter on your selected metric to view your data on a specific volume group or volume.

## Resource logging

You can configure the [diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings) of your elastic SAN to send Azure platform logs and metrics to different destinations. Currently, there's one log configuration:

- Transactions - Every transaction log that the resource offers.

Audit logs are each resource provider's attempt to provide the most relevant audit data. However, these logs might not be considered sufficient from an auditing standards perspective.

Available log categories:

- Write Success Requests
- Write Failed Requests
- Read Success Requests
- Read Failed Requests
- Persistent Reservation Requests
- SendTargets Requests

## Monitor workload performance
 
### Monitor Availability 
The **Availability** metric can be useful for viewing any visible problems from either an application or user perspective.
 
When you use this metric with Azure Elastic SAN, you should use the **Average** aggregation. By using Average, you see what percentage of your requests are experiencing errors and if they're within [Elastic SAN's SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1).
For worst and best case availability scenarios, you should use the **Min** and **Max** aggregation. For example, you can use **Min** availability for incident alerting.
 
### How to create an alert for Availability < 99.9%
 
1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).
 
1. In the **Scope** tab, select your Elastic SAN resource.
 
1. In the **Condition** tab, select the **Availability** metric.
 
1. In the **Alert logic** tab, select the following attribute variable values from the drop-down menu: 
   
   | Field             | Description  |
   |------------------|--------------|
   | Threshold         | Static       |
   | Aggregation type  | Average      |
   | Operator          | Less than    |
   | Threshold value   | 99.9         |

 
1. In the **When to evaluate** tab, select the following variable values from the drop-down menu:
   
   | Field             | Description  |
   |------------------|--------------|
   | Check every      | 5 minutes    |
   | Lookback period  | 1 hour       |
 
1. Select **Next** to go to the **Actions** tab and add an action group (email, SMS, and so on) to the alert. You can select an existing action group or create a new action group.
 
1. Select **Next** to go to the **Details** tab and fill in the details of the alert such as the alert name, description, and severity.
 
1. Select **Review + create** to create the alert.
 
 
### Monitor utilization
 
Utilization metrics that measure the amount of data being transmitted (throughput) or operations being serviced (IOPS) are commonly used to determine how much work is being performed by the application or workload. Transaction metrics can determine the number of operations or requests against the Azure Elastic SAN service over various time granularity.
 
To determine the average I/O per second (IOPS) for your workload, first determine the total number of transactions using the **Transactions** metric over a minute and then divide that number by 60 seconds. For example, 120,000 transactions in 1 minute / 60 seconds = 2,000 average IOPS.
 
To determine the average throughput for your workload, take the total amount of transmitted data by combining the **Ingress** and **Egress** metrics (total throughput) and divide that number by 60 seconds. For example, 1 GiB total throughput over 1 minute / 60 seconds = 17 MiB average throughput.

## Next steps

- [Azure Monitor Metrics overview](/azure/azure-monitor/essentials/data-platform-metrics)
- [Azure Monitor Metrics aggregation and display explained](/azure/azure-monitor/essentials/metrics-aggregation-explained)
