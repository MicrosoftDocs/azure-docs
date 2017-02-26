---
title: Azure Event Hubs diagnostic logs | Microsoft Docs
description: Learn how to analyze diagnostic logs from Event Hubs in Microsoft Azure.
keywords:
documentationcenter: ''
services: event-hubs
author: banisadr
manager: 
editor:

ms.assetid: 
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 02/01/2017
ms.author: babanisa

---
# Event Hub diagnostic logs

## Introduction
Event Hubs exposes two types of logs: 
* [Activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) that are always enabled and provide insights into operations performed on jobs;
* [Diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) that are user configurable and provide richer insights into everything that happens with the job starting when it’s created, updated, while it’s running and until it’s deleted;

## How to enable diagnostic logs
The diagnostics logs are turned **off** by default. To enable them follow these steps:

Sign on to the Azure portal and navigate to the streaming job blade and use the “Diagnostic logs” blade under “Monitoring”.

![blade navigation to diagnostic logs](./media/event-hubs-diagnostic-logs/image1.png)  

Then click on the “Turn on diagnostics” link

![turn on diagnostic logs](./media/event-hubs-diagnostic-logs/image2.png)

On the opened diagnostics, change the status to “On”.

![change status diagnostic logs](./media/event-hubs-diagnostic-logs/image3.png)

Configure the desired archival target (storage account, event hub, Log Analytics) and select the categories of logs that you want to collect (Execution, Authoring). Then save the new diagnostics configuration.

Once saved, the configuration will take about 10 minutes to take effect and after that logs will start appearing in the configured archival target which you can see on the “Diagnostics logs” blade:

More information about configuring diagnostics is available on the [diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) page.

## Diagnostic logs categories
There are two categories of diagnostic logs that we currently capture:

* **ArchivalLogs:** capture the logs related to Event Hub Archive - speficically related to Archive errors.
* **OperationalLogs:** capture what is happening during Event Hubs operation - speficically the operation type such as Event Hub creation, resources used, and the status of the operation.

## Diagnostic logs schema
All logs are stored in JSON format and each entry has string fields following the below format:


### Archive error schema
Name | Description
------- | -------
TaskName | The description of task that failed
ActivityId | Internal Id for tracking purpose
trackingId | Internal Id for tracking purpose
resourceId | ARM Resource Id
eventHub | Event Hub full name (Includes namespace name)
partitionId | The partition being written to within the Event Hub
archiveStep | ArchiveFlushWriter
startTime | Failure start time
failures | Number of times failure has occured
durationInSeconds | Duration of failure
message | Error message
category | ArchiveLogs

#### Example Archive log

```json
{
	 "TaskName": "EventHubArchiveUserError",
	 "ActivityId": "21b89a0b-8095-471a-9db8-d151d74ecf26",
	 "trackingId": "21b89a0b-8095-471a-9db8-d151d74ecf26_B7",
	 "resourceId": "/SUBSCRIPTIONS/854D368F-1828-428F-8F3C-F2AFFA9B2F7D/RESOURCEGROUPS/DEFAULT-EVENTHUB-CENTRALUS/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/FBETTATI-OPERA-EVENTHUB",
	 "eventHub": "fbettati-opera-eventhub:eventhub:eh123~32766",
	 "partitionId": "1",
	 "archiveStep": "ArchiveFlushWriter",
	 "startTime": "9/22/2016 5:11:21 AM",
	 "failures": 3,
	 "durationInSeconds": 360,
	 "message": "Microsoft.WindowsAzure.Storage.StorageException: The remote server returned an error: (404) Not Found. ---> System.Net.WebException: The remote server returned an error: (404) Not Found.\r\n   at Microsoft.WindowsAzure.Storage.Shared.Protocol.HttpResponseParsers.ProcessExpectedStatusCodeNoException[T](HttpStatusCode expectedStatusCode, HttpStatusCode actualStatusCode, T retVal, StorageCommandBase`1 cmd, Exception ex)\r\n   at Microsoft.WindowsAzure.Storage.Blob.CloudBlockBlob.<PutBlockImpl>b__3e(RESTCommand`1 cmd, HttpWebResponse resp, Exception ex, OperationContext ctx)\r\n   at Microsoft.WindowsAzure.Storage.Core.Executor.Executor.EndGetResponse[T](IAsyncResult getResponseResult)\r\n   --- End of inner exception stack trace ---\r\n   at Microsoft.WindowsAzure.Storage.Core.Util.StorageAsyncResult`1.End()\r\n   at Microsoft.WindowsAzure.Storage.Core.Util.AsyncExtensions.<>c__DisplayClass4.<CreateCallbackVoid>b__3(IAsyncResult ar)\r\n--- End of stack trace from previous location where exception was thrown ---\r\n   at System.",
	 "category": "ArchiveLogs"
}
```

### Operation logs schema
Name | Description
------- | -------
ActivityId | Internal Id for tracking purpose
EventName | Operation name			 
resourceId | ARM Resource Id
SubscriptionId | Subscription Id
EventTimeString | Operation time
EventProperties | Operation properties
Status | Operation Status
Caller | Caller of operation (Portal or Management Client)
category | OperationalLogs

#### Example Operation log

```json
Example: 
{
	 "ActivityId": "6aa994ac-b56e-4292-8448-0767a5657cc7",
	 "EventName": "Create EventHub",
	 "resourceId": "/SUBSCRIPTIONS/1A2109E3-9DA0-455B-B937-E35E36C1163C/RESOURCEGROUPS/DEFAULT-SERVICEBUS-CENTRALUS/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/SHOEBOXEHNS-CY4001",
	 "SubscriptionId": "1a2109e3-9da0-455b-b937-e35e36c1163c",
	 "EventTimeString": "9/28/2016 8:40:06 PM +00:00",
	 "EventProperties": "{\"SubscriptionId\":\"1a2109e3-9da0-455b-b937-e35e36c1163c\",\"Namespace\":\"shoeboxehns-cy4001\",\"Via\":\"https://shoeboxehns-cy4001.servicebus.windows.net/f8096791adb448579ee83d30e006a13e/?api-version=2016-07\",\"TrackingId\":\"5ee74c9e-72b5-4e98-97c4-08a62e56e221_G1\"}",
	 "Status": "Succeeded",
	 "Caller": "ServiceBus Client",
	 "category": "OperationalLogs"
}
```

## Next steps
* [Introduction to Event Hubs](event-hubs-what-is-event-hubs.md)
* [Event Hubs API Overview](event-hubs-api-overview.md)
* [Get Started with Event Hubs](event-hubs-csharp-ephcs-getstarted.md)