---
title: Azure solutions for Internet of Things (IoT Edge) | Microsoft Docs
description: Overview of a sample IoT solution architecture and how it relates to devices, the Azure IoT Hub service, Azure IoT device SDKs, Azure IoT service SDKs, and other Azure services.
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: a859e379-dca7-42fa-bdf6-1125c86ad140
ms.service: iot-hub
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/15/2017
ms.author: dobett

---
[!INCLUDE [iot-azure-and-iot](../../includes/iot-azure-and-iot.md)]

## Next steps

Azure IoT Edge is an Azure service that enables analytics and data processing at the edge. With IoT Edge, you can empower your devices with container-based code that includes either logic pulled directly from the Azure services that you already use, or your own solution-specific code. It enables your devices to:

* Act as gateway devices, aggregating and processing data from multiple leaf devices.
* Perform anomaly detection and react to changes in the environment without having to wait for instructions from the cloud.
* Minimize bandwidth and storage cost by preprocessing data and sending the results. 

IoT Edge also includes a cloud interface that enables remote management of devices. Without having to physically access your devices, you can deploy code, monitor the status, and update it. You can remotely manage single devices, or create deployments that affect large sets of devices that you define. For more information, see [Understand IoT Edge deployments for single devices or at scale][lnk-deployment].

To learn about the components that enable IoT Edge, see [How Azure IoT Edge works][lnk-overview].

To get started writing some code and running some samples, see the [Get started with IoT Hub][lnk-getstarted] tutorial.

You may also be interested in [Azure IoT Suite][lnk-iot-suite], which is a collection of preconfigured solutions. IoT Suite enables you to get started quickly and scale IoT projects to address common IoT scenarios--such as remote monitoring, asset management, and predictive maintenance.

[lnk-deployment]: module-deployment-monitoring.md
[lnk-overview]: how-iot-edge-works.md

[lnk-getstarted]: ../iot-hub/iot-hub-csharp-csharp-getstarted.md
[lnk-device-sdks]: https://github.com/Azure/azure-iot-sdks
[lnk-iot-hub]: ../iot-hub/iot-hub-what-is-iot-hub.md
[lnk-iot-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/
[lnk-iotdev]: https://azure.microsoft.com/develop/iot/
[lnk-device-management]: ../iot-hub/iot-hub-device-management-overview.md
