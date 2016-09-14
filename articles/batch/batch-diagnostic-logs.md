<properties
   pageTitle="Azure Batch diagnostic logging | Microsoft Azure"
   description="Enable and access diagnostic logs for Azure Batch account resources like pools and tasks."
   services="batch"
   documentationCenter=""
   authors="mmacy"
   manager="timlt"
   editor=""/>

<tags
   ms.service="batch"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="multiple"
   ms.workload="big-compute"
   ms.date="09/16/2016"
   ms.author="marsma"/>

# Azure Batch diagnostic logging

As with many Azure services, the Batch service emits log events for certain resources during the lifetime of the resource. You can enable Azure Batch diagnostic logs to record events for resources like pools and tasks, and then use the logs for diagnostic evaluation and monitoring. Events like pool create, pool delete, task start, task complete, and others are included in Batch diagnostic logs.

>[AZURE.NOTE] This article discusses logging events for Batch account resources themselves, not job and task output data. For details on storing the output data of your jobs and tasks, see [Persist Azure Batch job and task output](batch-task-output.md).

## Prerequisites

* [Azure Batch account](batch-account-create-portal.md)

* [Azure Storage account](../storage/storage-create-storage-account.md#create-a-storage-account)

  To persist Batch diagnostic logs, you must create an Azure Storage account where Azure will store the logs. The Storage account you specify when you enable log collection is not the same as a linked storage account referred to in the [application packages](batch-application-packages.md) and [task output persistence](batch-task-output.md) articles.

  >[AZURE.WARNING] You are **charged** for the data stored in your Azure Storage account. This includes the diagnostic logs discussed in this article. Keep this in mind when designing your [log retention policy](../azure-portal/monitoring-archive-diagnostic-logs.md).

## Enable diagnostic logging

Diagnostic logging is not enabled by default for your Batch account. You must explicitly enable diagnostic logging for each Batch account you want to monitor:

[How to enable collection of Diagnostic Logs](../azure-portal/monitoring-overview-of-diagnostic-logs.md#how-to-enable-collection-of-diagnostic-logs)

We recommend that you read the full [Overview of Azure Diagnostic Logs](../azure-portal/monitoring-overview-of-diagnostic-logs.md) article to gain an understanding of not only how to enable logging, but the log categories supported by the various Azure services. For example, Azure Batch currently supports one log category: **Service Logs**.

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
	"targetDedicated": 2,
	"maxTasksPerNode": 1,
	"vmFillType": "Spread",
	"enableAutoscale": false,
	"enableInterNodeCommunication": false,
	"isAutoPool": false
}
```

Each event body resides in a .json file in the specified Azure Storage account. If you want to access the logs directly, you may wish to review the [schema of Diagnostic Logs in the storage account](../azure-portal/monitoring-archive-diagnostic-logs.md#schema-of-diagnostic-logs-in-the-storage-account).

## Service Log events

The Batch service currently emits the following Service Log events. This list may not be exhaustive, since additional events may have been added since this article was last updated.

| **Service Log events** |
| ------------------ |
| Pool create |
| Pool delete start |
| Pool delete complete |
| Pool resize start |
| Pool resize complete |
| Task start |
| Task complete |
| Task fail |

## Next steps

* Learn how to [stream Azure Diagnostic Logs to Event Hubs](../azure-portal/monitoring-stream-diagnostic-logs-to-event-hubs.md).

* You can analyze your logs with [Operations Management Suite (OMS) Log Analytics](../log-analytics/log-analytics-azure-storage-json.md).

