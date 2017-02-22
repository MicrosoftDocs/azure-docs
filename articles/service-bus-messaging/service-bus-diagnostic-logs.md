---
title: Azure Service Bus diagnostic logs | Microsoft Docs
description: Learn how to analyze diagnostic logs from Service Bus in Microsoft Azure.
keywords:
documentationcenter: ''
services: service-bus-messaging
author: banisadr
manager: 
editor:

ms.assetid: 
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 02/17/2017
ms.author: babanisa

---
# Service Bus diagnostic logs

## Introduction
Service Bus exposes two types of logs: 
* [Activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) that are always enabled and provide insights into operations performed on jobs;
* [Diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) that are user configurable and provide richer insights into everything that happens with the job starting when it’s created, updated, while it’s running and until it’s deleted;

## How to enable diagnostic logs
The diagnostics logs are turned **off** by default. To enable them follow these steps:

Sign on to the Azure portal and navigate to the streaming job blade and use the “Diagnostic logs” blade under “Monitoring”.

![blade navigation to diagnostic logs](./media/service-bus-diagnostic-logs/image1.png)  

Then click on the “Turn on diagnostics” link

![turn on diagnostic logs](./media/service-bus-diagnostic-logs/image2.png)

On the opened diagnostics, change the status to “On”.

![change status diagnostic logs](./media/service-bus-diagnostic-logs/image3.png)

Configure the desired archival target (storage account, event hub, Log Analytics) and select the categories of logs that you want to collect (Execution, Authoring). Then save the new diagnostics configuration.

Once saved, the configuration will take about 10 minutes to take effect and after that logs will start appearing in the configured archival target which you can see on the “Diagnostics logs” blade:

More information about configuring diagnostics is available on the [diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) page.

## Diagnostic logs schema

All logs are stored in JSON format and each entry has string fields following the below format.

### Operation logs

OperationalLogs capture what is happening during Service Bus operation - speficically the operation type such as queue creation, resources used, and the status of the operation.

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
* [Introduction to Service Bus](service-bus-messaging-overview.md)
* [Get Started with Service Bus](service-bus-create-namespace-portal.md)
