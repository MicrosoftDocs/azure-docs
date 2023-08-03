---
title: 'Quickstart: Create a security module twin'
description: In this quickstart, learn how to create a Defender for IoT module twin for use with Microsoft Defender for IoT.
ms.topic: quickstart
ms.date: 03/28/2022
ms.custom: mode-other
---

# Quickstart: Create an azureiotsecurity module twin

This quickstart explains how to create individual _azureiotsecurity_ module twins for new devices, or batch create module twins for all devices in an IoT Hub.

## Prerequisites

- None

## Understanding azureiotsecurity module twins

For IoT solutions built in Azure, device twins play a key role in both device management and process automation.

Defender for IoT offers full integration with your existing IoT device management platform, enabling you to manage your device security status and make use of existing device control capabilities. Defender for IoT integration is achieved by making use of the IoT Hub twin mechanism.

See [IoT Hub module twins](../../iot-hub/iot-hub-devguide-module-twins.md)[IoT Hub module twins] to learn more about the general concept of module twins in Azure IoT Hub.

Defender for IoT makes use of the module twin mechanism and maintains a security module twin named _azureiotsecurity_ for each of your devices.

The Defender-IoT-micro-agent twin holds all the information relevant to device security for each of your devices.

To make full use of Defender for IoT features, you'll need to create, configure, and use this Defender-IoT-micro-agent twins for every device in the service.

## Create azureiotsecurity module twin

_azureiotsecurity_ module twins can be created in two ways:

1. [Module batch script](https://aka.ms/iot-security-github-create-module) - automatically creates module twin for new devices or devices without a module twin using the default configuration.
1. Manually editing each module twin individually with specific configurations for each device.

>[!NOTE]
> Using the batch method will not overwrite existing azureiotsecurity module twins. Using the batch method ONLY creates new module twins for devices that do not already have a security module twin.

See [agent configuration](how-to-agent-configuration.md) to learn how to modify or change the configuration of an existing module twin.

To manually create a new _azureiotsecurity_ module twin for a device:

1. In your IoT Hub, locate and select the device you wish to create a security module twin for.

1. Select on your device, and then on **Add module identity**.

1. In the **Module Identity Name** field, enter **azureiotsecurity**.

1. Select **Save**.

## Verify creation of a module twin

To verify if a security module twin exists for a specific device:

1. In your Azure IoT Hub, select **IoT devices** from the **Explorers** menu.

1. Enter the device ID, or select an option in the **Query device field** and select **Query devices**.

    :::image type="content" source="./media/quickstart/verify-security-module-twin.png" alt-text="Query devices":::

1. Select the device or double select it to open the Device details page.

1. Select the **Module identities** menu, and confirm existence of the **azureiotsecurity** module in the list of module identities associated with the device.

    :::image type="content" source="./media/quickstart/verify-security-module-twin-3.png" alt-text="Modules associated with a device":::

To learn more about customizing properties of Defender for IoT module twins, see [Agent configuration](how-to-agent-configuration.md).

## Next steps

Advance to the next article to learn how to investigate security recommendations...

> [!div class="nextstepaction"]
> [Investigate security recommendations](quickstart-investigate-security-recommendations.md)
