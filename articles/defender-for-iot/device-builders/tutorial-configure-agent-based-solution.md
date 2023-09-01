---
title: Configure Microsoft Defender for IoT agent-based solution
description: Learn how to configure the Microsoft Defender for IoT agent-based solution
ms.date: 01/12/2022
ms.topic: tutorial
---

# Tutorial: Configure Microsoft Defender for IoT agent-based solution  

This tutorial will help you learn how to configure the Microsoft Defender for IoT agent-based solution.

In this tutorial you'll learn how to:

> [!div class="checklist"]
> - Enable data collection
> - Create a Log Analytics workspace
> - Enable geolocation and IP address handling

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [IoT hub](../../iot-hub/iot-hub-create-through-portal.md).

- You must have [enabled Microsoft Defender for IoT on your Azure IoT Hub](quickstart-onboard-iot-hub.md).

- You must have [added a resource group to your IoT solution](quickstart-configure-your-solution.md)

- You must have [created a Defender for IoT micro agent module twin](quickstart-create-micro-agent-module-twin.md).

- You must have [installed the Defender for IoT micro agent](quickstart-standalone-agent-binary-installation.md)

## Enable data collection

**To enable data collection**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT** > **Settings** > **Data Collection**.

    :::image type="content" source="media/how-to-configure-agent-based-solution/data-collection.png" alt-text="Select data collection from the security menu settings.":::

1. Under **Microsoft Defender for IoT**, ensure that **Enable Microsoft Defender for IoT** is enabled.

    :::image type="content" source="media/how-to-configure-agent-based-solution/enable-data-collection.png" alt-text="Screenshot showing you how to enable data collection.":::

1. Select **Save**.

## Create a Log Analytics workspace

Defender for IoT allows you to store security alerts, recommendations, and raw security data, in your Log Analytics workspace. Log Analytics ingestion in IoT Hub is set to **off** by default in the Defender for IoT solution. It is possible, to attach Defender for IoT to a Log Analytics workspace, and to store the security data there as well.

There are two types of information stored by default in your Log Analytics workspace by Defender for IoT:

- Security alerts.

- Recommendations.

You can choose to add storage of an additional information type as `raw events`.

> [!Note]
> Storing `raw events` in Log Analytics carries additional storage costs.

**To enable Log Analytics to work with micro agent**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT** > **Settings** > **Data Collection**.

1. Under the **Workspace configuration**, switch the Log Analytics toggle to **On**.

1. Select a subscription from the drop-down menu.

1. Select a workspace from the drop-down menu. If you don't already have an existing Log Analytics workspace, you can select **Create New Workspace** to create a new one.

1. Verify that the **Access to raw security data** option is selected.

    :::image type="content" source="media/how-to-configure-agent-based-solution/data-settings.png" alt-text="Ensure Access to raw security data is selected.":::

1. Select **Save**.

Every month, the first 5 gigabytes of data ingested, per customer to the Azure Log Analytics service, is free. Every gigabyte of data ingested into your Azure Log Analytics workspace, is retained at no charge for the first 31 days. For more information on pricing, see, [Log Analytics pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Enable geolocation and IP address handling

In order to secure your IoT solution, the IP addresses of the incoming, and outgoing connections for your IoT devices, IoT Edge, and IoT Hub(s) are collected and stored by default. This information is essential, and used to detect abnormal connectivity from suspicious IP address sources. For example, when there are attempts made that try to establish connections from an IP address source of a known botnet, or from an IP address source outside your geolocation. The Defender for IoT service, offers the flexibility to enable, and disable the collection of the IP address data at any time.

**To enable the collection of IP address data**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT** > **Settings** > **Data Collection**.

1. Ensure the IP data collection checkbox is selected.

    :::image type="content" source="media/how-to-configure-agent-based-solution/geolocation.png" alt-text="Screenshot that shows the checkbox needed to be selected to enable geolocation.":::

1. Select **Save**.

## Clean up resources

There are no resources to clean up.

## Next steps

> [!div class="nextstepaction"]
> [Investigate security recommendations](tutorial-investigate-security-recommendations.md)