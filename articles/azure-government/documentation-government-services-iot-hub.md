---
title: Azure Government Internet of Things | Microsoft Docs
description: This provides a comparision of features and guidance on developing IoT Hub applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: gsacavdm
manager: pathuff

ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 03/30/2018
ms.author: gsacavdm

---
# Azure Government Internet of Things

## Azure IoT Hub

Azure IoT Hub is generally available in Azure Government.

For more information, see [Azure IoT Hub commercial documentation](../iot-hub/index.yml).

### Variations

The following URL for Azure IoT Hub is different in Azure Government:

| Azure Public        | Azure Government   |
| ------------------- | ------------------ |
| \*.azure-devices.net | \*.azure-devices.us |

If you are using the IoT Hub connection string (instead of the Event Hub-compatible settings) with the Microsoft Azure Service Bus .NET client library to receive telemetry or operations monitoring events, then be sure to use WindowsAzure.ServiceBus NuGet package version 4.1.2 or higher.

## Azure Event Hubs
For details on this service and how to use it, see [Azure Event Hubs documentation](../event-hubs/event-hubs-what-is-event-hubs.md).

### Variations

The following URL for Azure Event Hubs is different in Azure Government:

| Azure Public        | Azure Government   | 
| ------------------- | ------------------ | 
| \*.servicebus.windows.net | \*.servicebus.usgovcloudapi.net |

## Azure Notification Hubs
 Azure Notification Hubs is generally available in Azure Government.
 
 For details on this service and how to use it, see [Azure Notification Hubs documentation](../notification-hubs/index.yml).

### Variations

The URLs for accessing and managing Azure Notification Hub in Azure Government are different:

| Azure Public        | Azure Government   | 
| ------------------- | ------------------ | 
| \*.servicebus.windows.net | \*.servicebus.usgovcloudapi.net |

## Next steps

For supplemental information and updates, subscribe to the [Microsoft Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov).
