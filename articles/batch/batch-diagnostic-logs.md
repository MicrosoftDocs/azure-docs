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

As with many Azure services, the Batch service emits log events for certain resources during the lifetime of the resource. You can enable Azure Batch diagnostic logs to record events for resources like pools and tasks, and then use the logs for diagnostic evaluation and monitoring. Log and parse events like pool create, pool delete, task start, task complete, and others.

>[AZURE.NOTE] This article discusses logging events for Batch account resources themselves, not job and task output data. For details on storing the output data of your jobs and tasks, see [Persist Azure Batch job and task output](batch-task-output.md).

## Prerequisites

* [Azure Batch account](batch-account-create-portal.md)

* [Azure Storage account](../storage/storage-create-storage-account.md#create-a-storage-account)

  To persist Batch Service Logs, you must create an Azure Storage account to which Azure will store the logs. The Storage account that you specify when you enable log collection is not the "linked" storage account referred to in the [application packages](batch-application-packages.md) and [task output persistence](batch-task-output.md) articles. However, you can use the same Storage account you've linked for those purposes, if you like.

>[AZURE.WARNING] You are **charged** for the data stored in your Azure Storage account. This includes the diagnostic logs discussed in this article. Keep this in mind when you are designing your [log retention policy](../azure-portal/monitoring-archive-diagnostic-logs.md).

## Enable diagnostic logging

By default, diagnostic logging is not enabled for your Batch account. You must explicitly enable diagnostic logging for each Batch account that you want to monitor:

[How to enable collection of Diagnostic Logs](../azure-portal/monitoring-overview-of-diagnostic-logs.md#how-to-enable-collection-of-diagnostic-logs)

We recommend that you read the [Overview of Azure Diagnostic Logs](../azure-portal/monitoring-overview-of-diagnostic-logs.md) article to gain an understanding of not only how to enable logging, but the log categories supported by the various Azure Services. For example, Azure Batch currently supports one log category: **Service Logs**.

## Service Logs

Azure Batch currently supports one log category, Service Logs. These logs contain events emitted by the Azure Batch service during the lifetime of a Batch resource (like a pool, or task).

Each event emitted by Batch is stored in the specified Storage account in JSON format. For example, this is the body of a sample **pool create event**:

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

## Service Log events

The Batch service currently emits the following Service Log events. This list may not be exhaustive, since additional events may have been added since this article was last updated.

| Service log events |
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

* Learn how to use the [Batch File Conventions](batch-task-output.md) library to persist you job and task data to Azure Storage.

* See [Application deployment with Azure Batch application packages](batch-application-packages.md) to find out how to use this feature to manage and deploy the applications you execute on Batch compute nodes.

[batch_forum]: https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=azurebatch
[github_readme]: https://github.com/Azure/azure-xplat-cli/blob/dev/README.md
[rest_api]: https://msdn.microsoft.com/library/azure/dn820158.aspx
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx