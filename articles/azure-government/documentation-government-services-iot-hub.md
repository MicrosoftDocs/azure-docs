---
title: Azure Government Internet of Things | Microsoft Docs
description: This provides a comparision of features and guidance on developing IoT Hub applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: dominicbetts
manager: timlt

ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 06/08/2017
ms.author: dobett

---
# Azure Government Internet of Things

## Azure IoT Hub

Azure IoT Hub is generally available in Azure Government.

For more information, see [Azure IoT Hub commercial documentation](../iot-hub/index.md).

### Variations

The following URL for Azure IoT Hub is different in Azure Government:

| Azure Public        | Azure Government   | Notes                              |
| ------------------- | ------------------ | ---------------------------------- |
| *.azure-devices.net | *.azure-devices.us | Replace `*` with your IoT Hub name |

If you are using the IoT Hub connection string (instead of the Event Hub-compatible settings) with the Microsoft Azure Service Bus .NET client library to receive telemetry or operations monitoring events, then be sure to use WindowsAzure.ServiceBus NuGet package version 4.1.2 or higher.

## Next steps

For supplemental information and updates, subscribe to the [Microsoft Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov).
