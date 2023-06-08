---
title: Quickstart - Control a device from Azure IoT Hub | Microsoft Docs
description: In this quickstart, you run two sample applications. One application is a service application that can remotely control devices connected to your hub. The other application simulates a device connected to your hub that can be controlled remotely.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: quickstart
ms.custom: [mvc, mqtt, 'Role: Cloud Development', devx-track-azurecli, mode-other, devx-track-dotnet, devx-track-extended-java, devx-track-python]
ms.date: 02/25/2022
zone_pivot_groups: iot-hub-set1
#Customer intent: As a developer new to IoT Hub, I need to see how to use a service application to control a device connected to the hub.
---

# Quickstart: Control a device connected to an IoT hub

In this quickstart, you use a direct method to control a simulated device connected to your IoT hub. IoT Hub is an Azure service that lets you manage your IoT devices from the cloud and ingest high volumes of device telemetry to the cloud for storage or processing. You can use direct methods to remotely change the behavior of devices connected to your IoT hub.

:::zone pivot="programming-language-csharp"

[!INCLUDE [quickstart-control-device-dotnet](../../includes/quickstart-control-device-dotnet.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [quickstart-control-device-java](../../includes/quickstart-control-device-java.md)]

:::zone-end

:::zone pivot="programming-language-nodejs"

[!INCLUDE [quickstart-control-device-node](../../includes/quickstart-control-device-node.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [quickstart-control-device-python](../../includes/quickstart-control-device-python.md)]

:::zone-end

## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources](../../includes/iot-hub-quickstarts-clean-up-resources.md)]

## Next steps

In this quickstart, you called a direct method on a device from a service application, and responded to the direct method call in a simulated device application.

To learn how to route device-to-cloud messages to different destinations in the cloud, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Route telemetry to different endpoints for processing](tutorial-routing.md)
