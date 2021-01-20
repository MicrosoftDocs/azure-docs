---
author: baanders
description: include file for Azure Digital Twins - differences between digital twins and IoT Hub device twins
ms.service: digital-twins
ms.topic: include
ms.date: 1/20/2021
ms.author: baanders
---

>[!NOTE]
> Digital twins in Azure Digital Twins are different from [**device twins** in IoT Hub](../articles/iot-hub/iot-hub-devguide-device-twins.md). While they can both hold information about a device, like its properties, they're part of two separate services and thus have different goals and additional supporting data. IoT Hub device twins typically aim to capture and describe the device itself, while twins in Azure Digital Twins are more conceptual representations that can store user-defined insights. 
>
> IoT Hub device twins can be connected to Azure Digital Twins as part of an [end-to-end solution](../articles/digital-twins/tutorial-end-to-end.md) that represents devices across services.
