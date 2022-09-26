---
title: Create a DefenderforIoTMicroAgent module twin (Preview)
description: In this tutorial, you'll learn how to create a DefenderIotMicroAgent module twin for new devices.
ms.date: 01/16/2022
ms.topic: tutorial
ms.custom: mode-other
---

# Tutorial: Create a DefenderIotMicroAgent module twin (Preview)

This tutorial will help you learn how to create an individual `DefenderIotMicroAgent` module twin for new devices.

## Device twins

For IoT solutions built in Azure, device twins play a key role in both device management and process automation.

Defender for IoT fully integrates with your existing IoT device management platform. Full integration, enables you to manage your device's security status, and allows you to make use of all existing device control capabilities. Integration is achieved by making use of the IoT Hub twin mechanism.

Learn more about the concept of [Understand and use device twins in IoT Hub](../../iot-hub/iot-hub-devguide-device-twins.md).

## Defender-IoT-micro-agent twin

Defender for IoT uses a Defender-IoT-micro-agent twin for each device. The Defender-IoT-micro-agent twin holds all of the information that is relevant to device security, for each specific device in your solution. Device security properties are configured through a dedicated Defender-IoT-micro-agent twin for safer communication, to enable updates, and maintenance that requires fewer resources.

## Understanding DefenderIotMicroAgent module twins

Device twins play a key role in both device management and process automation, for IoT solutions that are built in to Azure.

Defender for IoT offers the capability to fully integrate your existing IoT device management platform, enabling you to manage your device security status and make use of the existing device control capabilities. You can integrate your Defender for IoT by using the IoT Hub twin mechanism.  

To learn more about the general concept of module twins in Azure IoT Hub, see [Understand and use module twins in IoT Hub](../../iot-hub/iot-hub-devguide-module-twins.md).

Defender for IoT uses the module twin mechanism, and maintains a Defender-IoT-micro-agent twin named `DefenderIotMicroAgent` for each of your devices.

To take full advantage of all Defender for IoT feature's, you need to create, configure, and use the Defender-IoT-micro-agent twins for every device in the service.

In this tutorial you'll learn how to:

> [!div class="checklist"]
> - Create a DefenderIotMicroAgent module twin
> - Verify the creation of a module twin

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Verify you are running one of the following [operating systems](concept-agent-portfolio-overview-os-support.md#agent-portfolio-overview-and-os-support-preview).

- An [IoT hub](../../iot-hub/iot-hub-create-through-portal.md).

- You must have [enabled Microsoft Defender for IoT on your Azure IoT Hub](quickstart-onboard-iot-hub.md).

- You must have [added a resource group to your IoT solution](quickstart-configure-your-solution.md)

## Create a DefenderIotMicroAgent module twin

A `DefenderIotMicroAgent` module twin can be created by manually editing each module twin to include specific configurations for each device.

**To create a DefenderIotMicroAgent module twin for a device**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Device management** > **Devices**.

1. Select your device from the list.

1. Select **Add module identity**.

1. In the Module Identity Name field, enter `DefenderIotMicroAgent`.

1. Select **Save**.

## Verify the creation of a module twin

**To verify the creation of a DefenderIotMicroAgent module twin on a specific device**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Device management** > **Devices**.

1. Select your device.

1. Under the Module identities menu, confirm the existence of the `DefenderIotMicroAgent` module in the list of module identities associated with the device.  

    :::image type="content" source="media/quickstart-create-micro-agent-module-twin/device-details-module.png" alt-text="Select module identities from the tab.":::

## Next steps

> [!div class="nextstepaction"]
> [Install the Defender for IoT micro agent (Preview)](tutorial-standalone-agent-binary-installation.md)
