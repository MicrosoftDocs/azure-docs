---
title: Metrics for Azure Elastic SAN
description: Learn about the available metrics that can let you understand how your Azure Elastic SAN is performing.
author: roygara
ms.service: azure-elastic-san
ms.topic: concept-article
ms.date: 01/07/2026
ms.author: rogarana
# Customer intent: As a cloud storage administrator, I want to monitor the performance metrics of my Azure Elastic SAN, so that I can optimize its availability and manage resource usage effectively.
---

# Elastic SAN metrics

Azure provides metrics in the Azure portal that give you insight into your Elastic SAN resources. This article provides definitions of specific metrics you can select to monitor, their recommended use, how to view them at SAN level, and how to calculate IOPS and throughput.

## View Elastic SAN metrics 

1. In the Azure portal, open your **Elastic SAN** resource. 

2. Under **Monitoring**, select **Metrics**. 

3. Select the **Metric namespace** and **Metric**. 

4. Select an **aggregation**. 

> [!NOTE]
> You can currently view Elastic SAN metrics only at the SAN resource level. Volume group and volume-level performance metrics aren't currently available for Elastic SAN. When you investigate a workload issue, use SAN-level metrics together with workload, VM, or operating system monitoring to isolate the source of the issue. 

## Available metrics 

Elastic SAN metrics are grouped into two categories: 

- **Capacity metrics** describe capacity configured or allocated for the SAN. 

- **Transaction metrics** describe availability, requests, data transfer, and request latency. 

## Capacity metrics definitions
The following metrics are currently available for your Elastic SAN resource. You can configure and view them in the Azure portal: 

| Metric | Definition | Recommended use | 
|---|---|---|
|**Provisioned Base**| The baseline capacity you configure for the Elastic SAN when you create it. This capacity includes the initial reserved SAN capacity before you add any extra expansion capacity.| Understand the base capacity that contributes to the SAN’s provisioned performance. |
|**Provisioned Capacity**| The total currently provisioned SAN capacity. This capacity includes the original **Provisioned Base** plus any extra capacity expansions you add.| Monitor the SAN’s configured capacity and capacity growth. |
|**Provisioned Size**| The total allocated size of all volumes you provision within the SAN. Unlike **Provisioned Capacity**, which represents the total SAN capacity configured and available at the SAN level, **Provisioned Size** reflects how much of that SAN capacity you already assigned to volumes.| Compare provisioned size with other SAN capacity metrics. |
|**Snapshot Size**| The total snapshot size for the provisioned size under the SAN.| Track snapshot capacity separately from volume capacity.|
|**Total Provisioned Volume Capacity**| The aggregate logical footprint of provisioned volumes plus snapshots within the SAN.| Understand how much capacity is provisioned to volumes.|

## Capacity metrics: Hierarchy and relationships
Before you monitor capacity metrics, it's important to understand how they relate to each other:
```text
Provisioned Base
└─ Provisioned Capacity (base capacity + any purchased expansions)
 └─ Provisioned Size (sum of all provisioned volume sizes within the SAN)
  └─ Total Provisioned Volume Capacity (total allocated volume capacity)
```
* You set **Provisioned Base** when you create the SAN. Expanding the SAN increases **Provisioned Capacity**, not the base. 
* **Provisioned Size** can never exceed **Provisioned Capacity**. If it does, volume creation fails. 
* **Total Provisioned Volume Capacity** is the total provisioned and allocated volume capacity, not the actual written usage. For example, provisioning a 10 GiB volume can result in 10 GiB of **Total Provisioned Volume Capacity** being reported, even if the volume contains minimal data. 
* **Snapshot Size** accumulates separately and isn't included in the **Total Provisioned Volume Capacity**. Monitor both together for total billed storage.

## Transaction metrics definitions
Transaction metrics represent the total number of I/O requests that the Elastic SAN service processes. Transactions include successful requests, failed requests, and requests that return errors.

| Metric | Unit | Definition | Recommended use |
|---|---|---|---|
|**Availability**|Percent| The percentage of availability for the storage service or the specified API operation.|Monitor service availability and configure availability alerts.|
|**Transactions**|Count| The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests that produced errors.| Understand I/O activity and calculate average IOPS over a selected interval.|
|**E2E Latency**|Milliseconds| The average end-to-end latency of successful requests made to the resource or the specified API operation.|Understand latency across the complete request path.|
|**Server Latency**|Milliseconds| The average time used to process a successful request. This value doesn't include the network latency specified in **E2E Latency**. |Compare with **E2E Latency** to determine whether latency is inside or outside service processing.|
|**Ingress**|Bytes| The amount of ingress data. This number includes ingress to the resource from external clients as well as ingress within Azure. | Monitor write-oriented data transfer and calculate throughput.|
|**Egress**|Bytes| The amount of egress data. This number includes egress from the resource to external clients as well as egress within Azure.  |Monitor read-oriented data transfer and calculate throughput. This metric doesn't represent billable network egress.|

> [!IMPORTANT]
> Elastic SAN currently surfaces foundational telemetry metrics such as **Transactions**, **Ingress**, and **Egress** instead of direct IOPS and throughput metrics. Depending on the selected aggregation and granularity, you can use the following calculations to derive IOPS and MB/s values.  

**IOPS calculation**: 

* **Average IOPS** = Total transactions in time bucket / Seconds in time bucket 

* Example: A one-minute bucket contains 120,000 transactions: 

   120,000 / 60 = 2,000 average IOPS 

To calculate IOPS in the Azure portal: 

1. Select **Transactions**. 

2. Set **Aggregation** to Total. 

3. Select one-minute time granularity. 

4. Divide each displayed value by 60. 

> [!IMPORTANT]
> This calculation produces the average rate for the selected time bucket. It doesn't show an instantaneous rate. 

**Throughput calculation**:

* **Average total throughput (MB/s)** = (Ingress bytes + Egress bytes) / Seconds in time bucket / 1,000,000

For separate read and write views: 

* **Average write throughput (MB/s)** = Ingress bytes / Seconds in time bucket / 1,000,000 
* **Average read throughput (MB/s)** = Egress bytes / Seconds in time bucket / 1,000,000

> [!IMPORTANT]
> In the context of Elastic SAN, **Ingress** represents data written to the SAN (coming from your VM/client), and **Egress** represents data read from the SAN. These definitions aren't the same as conventional Azure network ingress/egress terminology.

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
 

## Next steps

- [Azure Monitor Metrics overview](/azure/azure-monitor/essentials/data-platform-metrics)
- [Azure Monitor Metrics aggregation and display explained](/azure/azure-monitor/essentials/metrics-aggregation-explained)
