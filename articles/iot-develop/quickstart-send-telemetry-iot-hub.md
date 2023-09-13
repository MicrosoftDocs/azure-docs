---
title: Send device telemetry to Azure IoT Hub quickstart
description: "This quickstart shows device developers how to connect a device securely to Azure IoT Hub. You use an Azure IoT device SDK for C, C#, Python, Node.js, or Java, to build a device client for Windows, Linux, or Raspberry Pi (Raspbian). Then you connect and send telemetry."
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: quickstart
ms.date: 04/27/2023
ms.collection: embedded-developer, application-developer
zone_pivot_groups: iot-develop-set1
ms.custom: mode-other, devx-track-azurecli, engagement-fy23, devx-track-extended-java, devx-track-python
ms.devlang: azurecli
#Customer intent: As a device application developer, I want to learn the basic workflow of using an Azure IoT device SDK to build a client app on a device, connect the device securely to Azure IoT Hub, and send telemetry.
---

# Quickstart: Send telemetry from an IoT Plug and Play device to Azure IoT Hub

**Applies to**: [General device developers](about-iot-develop.md#general-device-development)

:::zone pivot="programming-language-ansi-c"

[!INCLUDE [iot-develop-send-telemetry-iot-hub-c](../../includes/iot-develop-send-telemetry-iot-hub-c.md)]

:::zone-end

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-develop-send-telemetry-iot-hub-csharp](../../includes/iot-develop-send-telemetry-iot-hub-csharp.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-develop-send-telemetry-iot-hub-java](../../includes/iot-develop-send-telemetry-iot-hub-java.md)]

:::zone-end

:::zone pivot="programming-language-nodejs"

[!INCLUDE [iot-develop-send-telemetry-iot-hub-node](../../includes/iot-develop-send-telemetry-iot-hub-node.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-develop-send-telemetry-iot-hub-python](../../includes/iot-develop-send-telemetry-iot-hub-python.md)]

:::zone-end
    
## Clean up resources
If you no longer need the Azure resources created in this quickstart, you can use the Azure CLI to delete them.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources.

To delete a resource group by name:
1. Run the [az group delete](/cli/azure/group#az-group-delete) command. This command removes the resource group, the IoT Hub, and the device registration you created.

    ```azurecli-interactive
    az group delete --name MyResourceGroup
    ```
1. Run the [az group list](/cli/azure/group#az-group-list) command to confirm the resource group is deleted.  

    ```azurecli-interactive
    az group list
    ```

## Next steps

In this quickstart, you learned a basic Azure IoT application workflow for securely connecting a device to the cloud and sending device-to-cloud telemetry. You used Azure CLI to create an Azure IoT hub and a device instance. Then you used an Azure IoT device SDK to create a temperature controller, connect it to the hub, and send telemetry. You also used Azure CLI to monitor telemetry.

As a next step, explore the following articles to learn more about building device solutions with Azure IoT. 

> [!div class="nextstepaction"]
> [Control a device connected to an IoT hub](../iot-hub/quickstart-control-device.md)
> [!div class="nextstepaction"]
> [Build a device solution with IoT Hub](set-up-environment.md)
