---
title: Enable diagnostic logging for Batch events - Azure | Microsoft Docs
description: Record and analyze diagnostic log events for Azure Batch account resources like pools and tasks.
services: batch
documentationcenter: ''
author: tamram
manager: timlt
editor: ''

ms.assetid: e14e611d-12cd-4671-91dc-bc506dc853e5
ms.service: batch
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: big-compute
ms.date: 05/22/2017
ms.author: tamram
ms.custom: H1Hack27Feb2017

---
# Log events for diagnostic evaluation and monitoring of Batch solutions

As with many Azure services, the Batch service emits log events for certain resources during the lifetime of the resource. You can enable Azure Batch diagnostic logs to record events for resources like pools and tasks, and then use the logs for diagnostic evaluation and monitoring. Events like pool create, pool delete, task start, task complete, and others are included in Batch diagnostic logs.

> [!NOTE]
> This article discusses logging events for Batch account resources themselves, not job and task output data. For details on storing the output data of your jobs and tasks, see [Persist Azure Batch job and task output](batch-task-output.md).
> 
> 

## Prerequisites
* [Azure Batch account](batch-account-create-portal.md)
* [Azure Storage account](../storage/storage-create-storage-account.md#create-a-storage-account)
  
  To persist Batch diagnostic logs, you must create an Azure Storage account where Azure will store the logs. You specify this Storage account when you [enable diagnostic logging](#enable-diagnostic-logging) for your Batch account. The Storage account you specify when you enable log collection is not the same as a linked storage account referred to in the [application packages](batch-application-packages.md) and [task output persistence](batch-task-output.md) articles.
  
  > [!WARNING]
  > You are **charged** for the data stored in your Azure Storage account. This includes the diagnostic logs discussed in this article. Keep this in mind when designing your [log retention policy](../monitoring-and-diagnostics/monitoring-archive-diagnostic-logs.md).
  > 
  > 

## Enable diagnostic logging
Diagnostic logging is not enabled by default for your Batch account. You must explicitly enable diagnostic logging for each Batch account you want to monitor:

[How to enable collection of Diagnostic Logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md#how-to-enable-collection-of-diagnostic-logs)

We recommend that you read the full [Overview of Azure Diagnostic Logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) article to gain an understanding of not only how to enable logging, but the log categories supported by the various Azure services. For example, Azure Batch currently supports one log category: **Service Logs**.

## Service Logs
Azure Batch Service Logs contain events emitted by the Azure Batch service during the lifetime of a Batch resource like a pool or task. Each event emitted by Batch is stored in the specified Storage account in JSON format. For example, this is the body of a sample **pool create event**:

```json
{
    "poolId": "myPool1",
    "displayName": "Production Pool",
    "vmSize": "Small",
    "cloudServiceConfiguration": {
        "osFamily": "4",
        "targetOsVersion": "*"
    },
    "networkConfiguration": {
        "subnetId": " "
    },
    "resizeTimeout": "300000",
    "targetDedicatedComputeNodes": 2,
    "maxTasksPerNode": 1,
    "vmFillType": "Spread",
    "enableAutoscale": false,
    "enableInterNodeCommunication": false,
    "isAutoPool": false
}
```

Each event body resides in a .json file in the specified Azure Storage account. If you want to access the logs directly, you may wish to review the [schema of Diagnostic Logs in the storage account](../monitoring-and-diagnostics/monitoring-archive-diagnostic-logs.md#schema-of-diagnostic-logs-in-the-storage-account).

## Service Log events
The Batch service currently emits the following Service Log events. This list may not be exhaustive, since additional events may have been added since this article was last updated.

| **Service Log events** |
| --- |
| [Pool create][pool_create] |
| [Pool delete start][pool_delete_start] |
| [Pool delete complete][pool_delete_complete] |
| [Pool resize start][pool_resize_start] |
| [Pool resize complete][pool_resize_complete] |
| [Task start][task_start] |
| [Task complete][task_complete] |
| [Task fail][task_fail] |

## Next steps
In addition to storing diagnostic log events in an Azure Storage account, you can also stream Batch Service Log events to an [Azure Event Hub](../event-hubs/event-hubs-what-is-event-hubs.md), and send them to [Azure Log Analytics](../log-analytics/log-analytics-overview.md).

* [Stream Azure Diagnostic Logs to Event Hubs](../monitoring-and-diagnostics/monitoring-stream-diagnostic-logs-to-event-hubs.md)
  
  Stream Batch diagnostic events to the highly scalable data ingress service, Event Hubs. Event Hubs can ingest millions of events per second, which you can then transform and store using any real-time analytics provider.
* [Analyze Azure diagnostic logs using Log Analytics](../log-analytics/log-analytics-azure-storage.md)
  
  Send your diagnostic logs to Log Analytics where you can analyze them in the Operations Management Suite (OMS) portal, or export them for analysis in Power BI or Excel.

[pool_create]: https://msdn.microsoft.com/library/azure/mt743615.aspx
[pool_delete_start]: https://msdn.microsoft.com/library/azure/mt743610.aspx
[pool_delete_complete]: https://msdn.microsoft.com/library/azure/mt743618.aspx
[pool_resize_start]: https://msdn.microsoft.com/library/azure/mt743609.aspx
[pool_resize_complete]: https://msdn.microsoft.com/library/azure/mt743608.aspx
[task_start]: https://msdn.microsoft.com/library/azure/mt743616.aspx
[task_complete]: https://msdn.microsoft.com/library/azure/mt743612.aspx
[task_fail]: https://msdn.microsoft.com/library/azure/mt743607.aspx
