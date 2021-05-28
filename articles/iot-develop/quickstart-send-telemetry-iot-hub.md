---
title: Send device telemetry to Azure IoT Hub quickstart
description: This quickstart shows device developers how to connect a device securely to Azure IoT Hub. You use an Azure IoT device SDK for C, C#, Python, Node.js, or Java, to run a client app on a simulated device, then you connect to IoT Hub and send telemetry.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: quickstart
ms.date: 05/04/2021
ms.collection: embedded-developer, application-developer
zone_pivot_groups: iot-develop-set1

#Customer intent: As a device application developer, I want to learn the basic workflow of using an Azure IoT device SDK to build a client app on a device, connect the device securely to Azure IoT Hub, and send telemetry.
---

# Quickstart: Send telemetry from a device to Azure IoT Hub

**Applies to**: [Device application developers](about-iot-develop.md#device-application-development)

In this quickstart, you learn a basic Azure IoT application development workflow. You use the Azure CLI to create an Azure IoT hub and a device. Then you use an Azure IoT device SDK sample to run a simulated temperature controller, connect it securely to the hub, and send telemetry.

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

## View telemetry
After the simulated device connects to IoT Hub, it begins sending telemetry. You can view the telemetry metrics and other details about your Iot hub and devices in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Click your IoT hub to open it.  You can find your IoT hub under **Recent resources** or in the left navigation, you can find it in **All resources**.

1. On the **Overview** page scroll to view the overview metrics for your hub.
    :::image type="content" source="media/quickstart-send-telemetry-iot-hub/iot-hub-metrics.png" alt-text="IoT Hub device metrics overview":::

1. Optionally, to review more metrics and build custom views, on the left navigation in **Monitoring**, select **Metric**s.
    
## Clean up resources
If you no longer need the Azure resources created in this quickstart, you can use the Azure CLI to delete them.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources.

To delete a resource group by name:
1. Run the [az group delete](/cli/azure/group#az_group_delete) command. This command removes the resource group, the IoT Hub, and the device registration you created.

    ```azurecli-interactive
    az group delete --name MyResourceGroup
    ```
1. Run the [az group list](/cli/azure/group#az_group_list) command to confirm the resource group is deleted.  

    ```azurecli-interactive
    az group list
    ```

## Next steps

In this quickstart, you learned a basic Azure IoT application workflow for securely connecting a device to the cloud and sending device-to-cloud telemetry. You used Azure CLI to create an Azure IoT hub and a device instance. Then you used an Azure IoT device SDK to create a simulated device, connect it to the hub, and send telemetry. You also used Azure portal to monitor telemetry.

As a next step, explore the following articles to learn more about building device solutions with Azure IoT. 

> [!div class="nextstepaction"]
> [Send telemetry to IoT Central](quickstart-send-telemetry-central.md)
> [!div class="nextstepaction"]
> [Get started with embedded development](quickstart-device-development.md)