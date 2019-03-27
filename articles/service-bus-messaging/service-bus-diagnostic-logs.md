---
title: Azure Service Bus diagnostic logs | Microsoft Docs
description: Learn how to set up diagnostic logs for Service Bus in Azure.
keywords:
documentationcenter: .net
services: service-bus-messaging
author: axisc
manager: timlt
editor: spelluru

ms.assetid:
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 01/23/2019
ms.author: aschhab

---
# Service Bus diagnostic logs

You can view two types of logs for Azure Service Bus:
* **[Activity logs](../azure-monitor/platform/activity-logs-overview.md)**. These logs contain information about operations performed on a job. The logs are always enabled.
* **[Diagnostic logs](../azure-monitor/platform/diagnostic-logs-overview.md)**. You can configure diagnostic logs for richer information about everything that happens within a job. Diagnostic logs cover activities from the time the job is created until the job is deleted, including updates and activities that occur while the job is running.

## Turn on diagnostic logs

Diagnostics logs are disabled by default. To enable diagnostic logs, perform the following steps:

1.	In the [Azure portal](https://portal.azure.com), under **Monitoring + Management**, click **Diagnostics logs**.

	![blade navigation to diagnostic logs](./media/service-bus-diagnostic-logs/image1.png)

2. Click the resource you want to monitor.  

3.	Click **Turn on diagnostics**.

	![turn on diagnostic logs](./media/service-bus-diagnostic-logs/image2.png)

4.	For **Status**, click **On**.

	![change status diagnostic logs](./media/service-bus-diagnostic-logs/image3.png)

5.	Set the archive target that you want; for example, a storage account, an event hub, or Azure Monitor logs.

6.	Save the new diagnostics settings.

New settings take effect in about 10 minutes. After that, logs appear in the configured archival target, on the **Diagnostics logs** blade.

For more information about configuring diagnostics, see the [overview of Azure diagnostic logs](../azure-monitor/platform/diagnostic-logs-overview.md).

## Diagnostic logs schema

All logs are stored in JavaScript Object Notation (JSON) format. Each entry has string fields that use the format described in the following section.

## Operational logs schema

Logs in the **OperationalLogs** category capture what happens during Service Bus operations. Specifically, these logs capture the operation type, including queue creation, resources used, and the status of the operation.

Operational log JSON strings include elements listed in the following table:

Name | Description
------- | -------
ActivityId | Internal ID, used for tracking
EventName | Operation name			 
resourceId | Azure Resource Manager resource ID
SubscriptionId | Subscription ID
EventTimeString | Operation time
EventProperties | Operation properties
Status | Operation status
Caller | Caller of operation (Azure portal or management client)
category | OperationalLogs

Here's an example of an operational log JSON string:

```json
{
  "ActivityId": "6aa994ac-b56e-4292-8448-0767a5657cc7",
  "EventName": "Create Queue",
  "resourceId": "/SUBSCRIPTIONS/1A2109E3-9DA0-455B-B937-E35E36C1163C/RESOURCEGROUPS/DEFAULT-SERVICEBUS-CENTRALUS/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/SHOEBOXEHNS-CY4001",
  "SubscriptionId": "1a2109e3-9da0-455b-b937-e35e36c1163c",
  "EventTimeString": "9/28/2016 8:40:06 PM +00:00",
  "EventProperties": "{\"SubscriptionId\":\"1a2109e3-9da0-455b-b937-e35e36c1163c\",\"Namespace\":\"shoeboxehns-cy4001\",\"Via\":\"https://shoeboxehns-cy4001.servicebus.windows.net/f8096791adb448579ee83d30e006a13e/?api-version=2016-07\",\"TrackingId\":\"5ee74c9e-72b5-4e98-97c4-08a62e56e221_G1\"}",
  "Status": "Succeeded",
  "Caller": "ServiceBus Client",
  "category": "OperationalLogs"
}
```

## Next steps

See the following links to learn more about Service Bus:

* [Introduction to Service Bus](service-bus-messaging-overview.md)
* [Get started with Service Bus](service-bus-dotnet-get-started-with-queues.md)
