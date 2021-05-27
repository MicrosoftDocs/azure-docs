---
title: Achieve geo-redundancy for Azure Stream Analytics jobs 
description: This article describes how-to achieve geo-redundancy of Azure Stream Analytics jobs instead of geo-failover.
author: an-emma
ms.author: raan
ms.service: stream-analytics
ms.topic: how-to
ms.date: 08/26/2020
---

# Achieve geo-redundancy for Azure Stream Analytics jobs

Azure Stream Analytics does not provide automatic geo-failover, but you can achieve geo-redundancy by deploying identical Stream Analytics jobs in multiple Azure regions. Each job connects to a local input and local output sources. It is the responsibility of your application to both send input data into the two regional inputs and reconcile between the two regional outputs. The Stream Analytics jobs are two separate entities.

The following diagram depicts a sample geo-redundant Stream Analytics job deployment with Event Hub input and Azure Database output.

:::image type="content" source="media/geo-redundancy/geo-redundant-jobs.png" alt-text="diagram of geo-redundant stream analytics jobs":::

## Primary/secondary strategy

Your application needs to manage which region's output database is considered the primary and which is considered the secondary. On a primary region failure, the application switches to the secondary database and starts reading updates from that database. The actual mechanism that allows minimizing duplicate reads depends on your application. You can simplify this process by writing additional information to the output. For example, you can add a timestamp or a sequence ID to each output to make skipping duplicate rows a trivial operation. Once the primary region is restored, it catches up with the secondary database using similar mechanics.

Although different input and output types allow for different geo-replication options, we recommend using the pattern outlined in this article to achieve geo-redundancy because it provides flexibility and control for the both event producers and event consumers.

## Next steps

* [Monitor and manage Azure Stream Analytics jobs with PowerShell](stream-analytics-monitor-and-manage-jobs-use-powershell.md)
* [Data-driven debugging in Azure Stream Analytics](stream-analytics-job-diagram-with-metrics.md)