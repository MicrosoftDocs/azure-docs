---
title: Metrics for Azure Elastic SAN Next Generation Preview
description: Learn about Azure Elastic SAN Next Generation capacity and performance metrics, how to view them, and how to calculate IOPS and throughput.
author: normesta
ms.service: azure-elastic-san
ms.topic: concept-article
ms.date: 10/28/2026
ms.author: normesta
# Customer intent: As a cloud storage administrator, I want to monitor Azure Elastic SAN Next Generation capacity and performance metrics, so that I can manage resource usage and monitor workload availability.
---

# Elastic SAN Next Generation metrics

Azure provides metrics in the Azure portal that give you insight into your Azure Elastic SAN Next Generation resources. This article provides definitions of specific metrics you can select to monitor, their recommended use, how to view them at the SAN resource level, and how to calculate IOPS and throughput.

> [!IMPORTANT]
> Azure Elastic SAN Next Generation is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## View Elastic SAN Next Generation metrics

1. In the Azure portal, open your **Elastic SAN Next Generation** resource.

1. Under **Monitoring**, select **Metrics**.

1. Select the **Metric namespace** and **Metric**.

1. Select an **aggregation**.

1. When supported by the selected metric, use available dimensions to filter the results.

> [!NOTE]
> For Elastic SAN Next Generation, capacity metrics are available at the SAN resource level, with **Volume Group** and **Volume** dimensions that allow you to filter and analyze capacity usage for individual volume groups and volumes. Not all metrics are available at every resource scope. Metric availability and supported dimensions depend on the metric you select.

## Available metrics

Elastic SAN Next Generation metrics are grouped into two categories:

- **Capacity metrics** describe provisioned volume size, used volume size, and snapshot size.
- **Performance metrics** describe service availability, I/O requests, data transfer, and request latency.

## Capacity metrics definitions

Elastic SAN Next Generation exposes three capacity metrics: **Provisioned Size**, **Used Size**, and **Snapshot Size**. These metrics show the capacity allocated to volumes, the capacity used by volume data excluding snapshots, and the capacity used by snapshots, respectively. Use the **Volume Group** and **Volume** dimensions to filter results for individual volume groups and volumes.

| Metric | Definition | Scope | Recommended use |
|---|---|---|---|
| **Provisioned Size** | The provisioned size of Elastic SAN Next Generation volumes in bytes. | SAN resource; Volume Group and Volume dimensions | Understand how much capacity you allocated to volumes. |
| **Used Size** | The measured used size of Elastic SAN Next Generation volumes in bytes, excluding snapshots. | SAN resource; Volume Group and Volume dimensions | Monitor actual used size excluding snapshots. |
| **Snapshot Size** | The measured size of snapshots of Elastic SAN Next Generation volumes in bytes. | SAN resource; Volume Group and Volume dimensions | Monitor snapshot consumption separately from used volume size. |

## Performance metrics definitions

Performance metrics describe the requests and I/O activity that Elastic SAN Next Generation processes. This category includes service availability, request counts, latency, and data transfer.

For Elastic SAN Next Generation, supported performance metrics can be viewed at the SAN resource level and analyzed using **Volume Group** and **Volume** dimensions.

| Metric | Unit | Definition | Recommended use |
|---|---|---|---|
| **Availability** | Percent | The percentage of availability for the storage service or specified API operation. | Monitor service availability and configure availability alerts. |
| **Transactions** | Count | The number of requests made to the storage service or specified API operation. This count includes successful requests, failed requests, and requests that return errors. | Understand I/O activity and calculate average IOPS over a selected interval. |
| **E2E Latency** | Milliseconds | The average end-to-end latency of successful requests made to the resource or specified API operation. | Understand latency across the complete request path. |
| **Server Latency** | Milliseconds | The average time the service takes to process a successful request. This value doesn't include the network latency that's part of **E2E Latency**. | Compare with **E2E Latency** to help understand the service-processing portion of latency. |
| **Ingress** | Bytes | The amount of data written to the SAN. | Monitor write-oriented data transfer and calculate write throughput. |
| **Egress** | Bytes | The amount of data read from the SAN. | Monitor read-oriented data transfer and calculate read throughput. This metric doesn't represent billable network egress. |

> [!IMPORTANT]
> In Elastic SAN Next Generation metrics, **Ingress** represents data written to the SAN and **Egress** represents data read from the SAN. These definitions differ from how ingress and egress might be interpreted for Azure network traffic.

## Calculate IOPS and throughput

Elastic SAN Next Generation provides foundational I/O telemetry through **Transactions**, **Ingress**, and **Egress**. You can use these metrics to calculate average IOPS and throughput for a selected time interval.

### Calculate average IOPS

**IOPS calculation**:

- **Average IOPS** = Total transactions in time bucket / Seconds in time bucket
- Example: A one-minute bucket contains 120,000 transactions:

   120,000 / 60 = 2,000 average IOPS

To calculate IOPS in the Azure portal:

1. Select **Transactions**.

1. Set **Aggregation** to **Total**.

1. Select a one-minute time granularity.

1. Divide the displayed transaction value by 60.

> [!IMPORTANT]
> This calculation provides an average rate for the selected time bucket. It doesn't represent an instantaneous IOPS rate.

### Calculate average throughput

**Throughput calculation**:

- **Average total throughput (MB/s)** = (Ingress bytes + Egress bytes) / Seconds in time bucket / 1,000,000

For separate read and write views:

- **Average write throughput (MB/s)** = Ingress bytes / Seconds in time bucket / 1,000,000
- **Average read throughput (MB/s)** = Egress bytes / Seconds in time bucket / 1,000,000

## Resource logging

> [!NOTE]
> The resource logging guidance in this section applies only to General Purpose volume groups that use iSCSI. It doesn't apply to General Purpose or Business Critical volume groups that use direct attach.

You can configure the [diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings) of your Elastic SAN Next Generation to send Azure platform logs and metrics to supported destinations.

Elastic SAN Next Generation provides the **Transactions** log category for transaction logging. Available log categories include:

- Write Success Requests
- Write Failed Requests
- Read Success Requests
- Read Failed Requests
- Persistent Reservation Requests
- SendTargets Requests

## Monitor workload performance

### Monitor Availability

Use **Availability** to monitor the percentage of requests that the service successfully serves. For Elastic SAN Next Generation, use the **Average** aggregation to understand availability over the selected time period. You can also use minimum availability when configuring monitoring intended to identify periods of degraded availability.

### How to create an alert for Availability < 99.9%

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

1. In the **Scope** tab, select your Elastic SAN Next Generation resource.

1. In the **Condition** tab, select the **Availability** metric.

1. In the **Alert logic** tab, select the following values:

   | Field | Description |
   |---|---|
   | Threshold | Static |
   | Aggregation type | Average |
   | Operator | Less than |
   | Threshold value | 99.9 |

1. Configure the evaluation frequency and lookback period appropriate for your monitoring scenario.

1. Select **Next** to go to the **Actions** tab and add an action group. You can select an existing action group or create a new action group.

1. Select **Next** to go to the **Details** tab and fill in the details of the alert, such as the alert name, description, and severity.

1. Select **Review + create** to create the alert.

## Next steps

- [Azure Monitor Metrics overview](/azure/azure-monitor/essentials/data-platform-metrics)
- [Azure Monitor metrics aggregation and display explained](/azure/azure-monitor/essentials/metrics-aggregation-explained)
