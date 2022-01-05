---
title: 'Quickstart: Enable Microsoft Defender for IoT on Azure IoT Hub'
description: Learn how to enable Defender for IoT in an Azure IoT hub.
ms.topic: quickstart
ms.date: 01/05/2022
ms.custom: mode-other
---

# Quickstart: Enable Microsoft Defender for IoT on Azure IoT Hub

This article explains how to enable Microsoft Defender for IoT on an Azure IoT hub.

[Azure IoT Hub](../../iot-hub/iot-concepts-and-iot-hub.md) is a managed service that acts as a central message hub for communication between IoT applications and IoT devices. You can connect millions of devices and their backend solutions reliably and securely. Almost any device can be connected to an IoT Hub. Defender for IoT integrates into Azure IoT Hub to provide real-time monitoring, recommendations, and alerts.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The ability to create a standard tier IoT Hub.

> [!NOTE]
> Defender for IoT currently only supports standard tier IoT Hubs.

## Create an IoT Hub with Microsoft Defender for IoT

You can create a hub in the Azure portal, or using other tools such as Azure IoT Tools for VS code, PowerShell, Azure CLI, or REST API. This tutorial assumes you're using the portal. For all new IoT hubs, Defender for IoT is set to **On** by default.

1. Follow the steps in [this article](../../iot-hub/iot-hub-create-through-portal.md#create-an-iot-hub).

1. Under the **Management** tab, ensure that **Defender for IoT** is set to **On**.

    :::image type="content" source="media/quickstart-onboard-iot-hub/management-tab.png" alt-text="Ensure the Defender for IoT toggle is set to on.":::

1. Follow the rest of the article to create the hub.

## Enable Defender for IoT on an existing IoT Hub

You can onboard Defender for IoT to an existing IoT Hub, where you can then monitor the device identity management, device to cloud, and cloud to device communication patterns.

**To enable Defender for IoT on an existing IoT Hub**:

1. In the Azure portal, search for and select **IoT Hub**.

1. Select your hub.

1. Navigate to **Defender for IoT** > **Overview**.

1. Click **Secure your IoT solution** and complete the onboarding form.

    :::image type="content" source="media/quickstart-onboard-iot-hub/secure-your-iot-solution.png" alt-text="Select the secure your IoT solution button to secure your solution.":::

The **Secure your IoT solution** button will only appear if the IoT Hub has not already been onboarded, or if while onboarding you left the Defender for IoT toggle on **Off**.

:::image type="content" source="media/quickstart-onboard-iot-hub/toggle-is-off.png" alt-text="If your toggle was set to off during onboarding.":::

## Verify that Defender for IoT is enabled

**To verify that Defender for IoT is enabled**:

1. Navigate to the Azure portal > **IoT Hub**.

1. Select the relevant hub from the list.

1. Under **Defender for IoT**, select **Overview**.

1. The Threat prevention, and Threat detection screen will appear.

    :::image type="content" source="../organizations/media/quickstart-onboard-iot-hub/threat-prevention.png" alt-text="Screenshot showing that Defender for IoT is enabled.":::

## Next steps

Advance to the next article to configure your solution...

> [!div class="nextstepaction"]
> [Add Azure resources to your IoT solution](quickstart-configure-your-solution.md)
