---
title: Create a Defender IoT micro agent module twin (Preview)
description: Learn how to create individual DefenderIotMicroAgent module twins for new devices.
ms.date: 1/20/2021
ms.topic: quickstart
---

# Create a Defender IoT micro agent module twin (Preview)

You can create individual **DefenderIotMicroAgent** module twins for new devices. You can also batch create module twins for all devices in an IoT Hub. 

## Device twins 

For IoT solutions built in Azure, device twins play a key role in both device management and process automation. 

Defender for IoT has the ability to fully integrate with your existing IoT device management platform. Full integration, enables you to manage your device's security status, and allows you to make use of all existing device control capabilities. Integration is achieved by making use of the IoT Hub twin mechanism. 

Learn more about the concept of [device twins](../iot-hub/iot-hub-devguide-device-twins.md) in Azure IoT Hub. 

## Defender-IoT-micro-agent twins 

Defender for IoT uses a Defender-IoT-micro-agent twin for each device. The Defender-IoT-micro-agent twin holds all of the information that is relevant to device security, for each specific device in your solution. Device security properties are configured through a dedicated Defender-IoT-micro-agent twin for safer communication, to enable updates, and maintenance that requires fewer resources. 

## Understanding DefenderIotMicroAgent module twins 

Device twins play a key role in both device management and process automation, for IoT solutions that are built in to Azure.

Defender for IoT offers the capability to fully integrate your existing IoT device management platform, enabling you to manage your device security status and make use of the existing device control capabilities. You can integrate your Defender for IoT by using the IoT Hub twin mechanism.  

To learn more about the general concept of module twins in Azure IoT Hub, see [IoT Hub module twins](../iot-hub/iot-hub-devguide-module-twins.md).

Defender for IoT uses the module twin mechanism, and maintains a Defender-IoT-micro-agent twin named `DefenderIotMicroAgent` for each of your devices. 

To take full advantage of all Defender for IoT feature's, you need to create, configure, and use the Defender-IoT-micro-agent twins for every device in the service. 

## Create DefenderIotMicroAgent module twin 

**DefenderIotMicroAgent** module twins can be created by manually editing each module twin to include specific configurations for each device. 

To manually create a new **DefenderIotMicroAgent** module twin for a device: 

1. In your IoT Hub, locate and select the device on which to create a Defender-IoT-micro-agent twin. 

1. Select **Add module identity**. 

1. In the **Module Identity Name** field, and enter `DefenderIotMicroAgent`. 

1. Select **Save**. 

## Verify the creation of a module twin 

To verify if a Defender-IoT-micro-agent twin exists for a specific device: 

1. In your Azure IoT Hub, select **IoT devices** from the **Explorers** menu. 

1. Enter the device ID, or select an option in the **Query device** field and select **Query devices**.  

    :::image type="content" source="media/quickstart-create-micro-agent-module-twin/iot-devices.png" alt-text="Select query devices to get a list of your devices.":::

1. Select the device, and open the **Device details** page. 

1. Select the **Module identities** menu, and confirm the existence of the **DefenderIotMicroAgent** module in the list of module identities associated with the device.  

    :::image type="content" source="media/quickstart-create-micro-agent-module-twin/device-details-module.png" alt-text="Select module identities from the tab.":::

## Next steps 

Advance to the next article to learn how to [investigate security recommendations](quickstart-investigate-security-recommendations.md).
