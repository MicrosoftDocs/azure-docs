---
title: 'Quickstart: Enable Microsoft Defender for IoT on your Azure IoT Hub'
description: Learn how to enable Defender for IoT in an Azure IoT hub.
ms.topic: quickstart
ms.date: 01/16/2022
ms.custom: mode-other
---

# Quickstart: Enable Microsoft Defender for IoT on your Azure IoT Hub

This article explains how to enable Microsoft Defender for IoT on an Azure IoT hub.

[Azure IoT Hub](../../iot-hub/iot-concepts-and-iot-hub.md) is a managed service that acts as a central message hub for communication between IoT applications and IoT devices. You can connect millions of devices and their backend solutions reliably and securely. Almost any device can be connected to an IoT Hub. Defender for IoT integrates into Azure IoT Hub to provide real-time monitoring, recommendations, and alerts.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The ability to create a standard tier IoT Hub.

> [!NOTE]
> Defender for IoT currently only supports standard tier IoT Hubs.

## Create an IoT Hub with Microsoft Defender for IoT

You can create a hub in the Azure portal. For all new IoT hubs, Defender for IoT is set to **On** by default.

**To create an IoT Hub**:

1. Follow the steps to [create an IoT hub using the Azure portal](../../iot-hub/iot-hub-create-through-portal.md#create-an-iot-hub).

1. Under the **Management** tab, ensure that **Defender for IoT** is set to **On**. By default, Defender for IoT will be set to **On** .

    :::image type="content" source="media/quickstart-onboard-iot-hub/management-tab.png" alt-text="Ensure the Defender for IoT toggle is set to on.":::

## Enable Defender for IoT on an existing IoT Hub

You can onboard Defender for IoT to an existing IoT Hub, where you can then monitor the device identity management, device to cloud, and cloud to device communication patterns.

**To enable Defender for IoT on an existing IoT Hub**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT** > **Overview**.

1. Select **Secure your IoT solution**, and complete the onboarding form.

    :::image type="content" source="media/quickstart-onboard-iot-hub/secure-your-iot-solution.png" alt-text="Select the secure your IoT solution button to secure your solution." lightbox="media/quickstart-onboard-iot-hub/secure-your-iot-solution-expanded.png":::

The **Secure your IoT solution** button will only appear if the IoT Hub hasn't already been onboarded, or if you set the Defender for IoT toggle to **Off** while onboarding.

:::image type="content" source="media/quickstart-onboard-iot-hub/toggle-is-off.png" alt-text="If your toggle was set to off during onboarding.":::

## Verify that Defender for IoT is enabled

**To verify that Defender for IoT is enabled**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT** > **Overview**.

    The Threat prevention and Threat detection screen will appear.

    :::image type="content" source="media/quickstart-onboard-iot-hub/threat-prevention.png" alt-text="Screenshot showing that Defender for IoT is enabled." lightbox="media/quickstart-onboard-iot-hub/threat-prevention-expanded.png":::

## Configure data collection

Configure data collection settings for Defender for IoT in your IoT hub, such as a Log Analytics workspace and other advanced settings.

**To configure Defender for IoT data collection**:

1. In your IoT hub, select **Defender for IoT > Settings**. The **Enable Microsoft Defender for IoT** option is toggled on by default.

1. In the **Workspace configuration** area, toggle the **On** option to connect to a Log Analytics workspace, and then select the Azure subscription and Log Analytics workspace you want to connect to.

    If you need to create a new workspace, select the **Create New Workspace** link.

    Select **Access to raw security data** to export raw security events from your devices to the Log Analytics workspace that you'd selected above.

1. In the **Advanced settings** area, the following options are selected by default. Clear the selection as needed:

    - **In-depth security recommendations and custom alerts**. Allows Defender for IoT access to the device's twin data in order to generate alerts based on that data.

    - **IP data collection**. Allows Defender for IoT access to the device's incoming and outgoing IP addresses to generate alerts based on suspicious connections.

1. Select **Save** to save your settings.

## Next steps

Advance to the next article to add a resource group to your solution.

> [!div class="nextstepaction"]
> [Add a resource group to your IoT solution](tutorial-configure-your-solution.md)
