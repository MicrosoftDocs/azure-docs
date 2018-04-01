---
title: Azure Internet of Things (IoT) Introduction 
description: Overview Azure IoT and related services and technologies.
services: iot-hub
documentationcenter: ''
author: BryanLa
manager: timlt
editor: bryanla

ms.service: iot
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/30/2018
ms.author: bryanla

---
[!INCLUDE [iot-azure-and-iot](../../includes/iot-azure-and-iot.md)]

## Next steps

Azure IoT Hub is an Azure service that enables secure and reliable bi-directional communications between your solution back end and millions of devices. It enables the solution back end to:

* Receive telemetry at scale from your devices.
* Route data from your devices to a stream event processor.
* Receive file uploads from devices.
* Send cloud-to-device messages to specific devices.

You can use IoT Hub to implement your own solution back end. In addition, IoT Hub includes an identity registry used to provision devices, their security credentials, and their rights to connect to the IoT hub. To learn more about IoT Hub, see [What is IoT Hub][lnk-iot-hub].

To learn how Azure IoT Hub enables standards-based device management for you to remotely manage your devices, see [Overview of device management with IoT Hub][lnk-device-management].

To implement client applications on a wide variety of device hardware platforms and operating systems, you can use the Azure IoT device SDKs. The device SDKs include libraries that facilitate sending telemetry to an IoT hub and receiving cloud-to-device messages. When you use the device SDKs, you can choose from several network protocols to communicate with IoT Hub. To learn more, see the [information about device SDKs][lnk-device-sdks].

To get started writing some code and running some samples, see the [Get started with IoT Hub][lnk-getstarted] tutorial.

You may also be interested in [Azure IoT Suite][lnk-iot-suite], which is a collection of preconfigured solutions. IoT Suite enables you to get started quickly and scale IoT projects to address common IoT scenarios--such as remote monitoring, asset management, and predictive maintenance.

[lnk-getstarted]: ../iot-hub/iot-hub-csharp-csharp-getstarted.md
[lnk-device-sdks]: https://github.com/Azure/azure-iot-sdks
[lnk-iot-hub]: ../iot-hub/iot-hub-what-is-iot-hub.md
[lnk-iot-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/
[lnk-iotdev]: https://azure.microsoft.com/develop/iot/
[lnk-device-management]: ../iot-hub/iot-hub-device-management-overview.md
