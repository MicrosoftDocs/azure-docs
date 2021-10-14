---
title: 'Quickstart: Onboard Defender for IoT to an agent-based solution'
description: In this quickstart, you will learn how to onboard and enable the Defender for IoT security service in your Azure IoT Hub.
ms.topic: quickstart
ms.date: 1/20/2021
---

# Quickstart: Onboard Defender for IoT to an agent-based solution

This article explains how to enable the Defender for IoT service on your existing IoT Hub. If you don't currently have an IoT Hub, see [Create an IoT hub using the Azure portal](../../iot-hub/iot-hub-create-through-portal.md) to get started.

You can manage your IoT security through the IoT Hub in Defender for IoT. The management portal located in the IoT Hub allows you to do the following: 

- Manage IoT Hub security.

- Basic management of an IoT device's security without installing an agent based on the IoT Hub telemetry. 

- Advanced management for the security of an IoT device based on the micro agent.

> [!NOTE]
> Defender for IoT currently only supports standard tier IoT Hubs.

## Prerequisites

None

## Onboard Defender for IoT to an IoT Hub

For all new IoT hubs, Defender for IoT is set to **On** by default. You can verify that Defender for IoT is toggled to **On** during the IoT Hub creation process.

To verify the toggle is set to **On**:

1. Navigate to the Azure portal.

1. Select **IoT Hub** from the list of Azure services.

1. Select **Create**.

    :::image type="content" source="media/quickstart-onboard-iot-hub/create-iot-hub.png" alt-text="Select the create button from the top toolbar." lightbox="media/quickstart-onboard-iot-hub/create-iot-hub-expanded.png":::

1. Select the **Management** tab, and verify that **Defender for IoT** toggle is set to **On**.

    :::image type="content" source="media/quickstart-onboard-iot-hub/management-tab.png" alt-text="Ensure the Defender for IoT toggle is set to on.":::

## Onboard Defender for IoT to an existing IoT Hub

You can onboard Defender for IoT to an existing IoT Hub, where
you can then monitor the device identity management, device to cloud, and cloud to device communication patterns.

To onboard Defender for IoT to an existing IoT Hub:

1. Navigate to the IoT Hub. 

1. Select the IoT Hub to be onboarded.

1. Select any option under the **Security** section.

1. Click **Secure your IoT solution** and complete the onboarding form. 

    :::image type="content" source="media/quickstart-onboard-iot-hub/secure-your-iot-solution.png" alt-text="Select the secure your IoT solution button to secure your solution.":::

The **Secure your IoT solution** button will only appear if the IoT Hub has not already been onboarded, or if while onboarding you left the Defender for IoT toggle on **Off**.

:::image type="content" source="media/quickstart-onboard-iot-hub/toggle-is-off.png" alt-text="If your toggle was set to off during onboarding.":::

## Next steps

Advance to the next article to configure your solution...

> [!div class="nextstepaction"]
> [Create a Defender Iot micro agent module twin (Preview)](quickstart-create-micro-agent-module-twin.md)
