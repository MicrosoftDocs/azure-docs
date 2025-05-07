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

- For the [resource group and access management setup process](#allow-access-to-the-iot-hub), you need the following roles:

    - To add role assignments, you need the Owner, Role Based Access Control Administrator and User Access Administrator roles. 
    - To register resource providers, you need th Owner and Contributor roles. 
    
    Learn more about [privileged administrator roles in Azure](../../role-based-access-control/role-assignments-steps.md#privileged-administrator-roles).

> [!NOTE]
> Defender for IoT currently only supports standard tier IoT Hubs.

## Create an IoT Hub with Microsoft Defender for IoT

You can create a hub in the Azure portal. For all new IoT hubs, Defender for IoT is set to **On** by default.

**To create an IoT Hub**:

1. Follow the steps to [create an IoT hub using the Azure portal](../../iot-hub/iot-hub-create-through-portal.md#create-an-iot-hub).

1. Under the **Management** tab, ensure that **Defender for IoT** is set to **On**. By default, Defender for IoT will be set to **On** .

    :::image type="content" source="media/quickstart-onboard-iot-hub/management-tab.png" alt-text="Ensure the Defender for IoT toggle is set to on.":::

1. Follow these steps to [allow access to the IoT Hub](#allow-access-to-the-iot-hub).

## Enable Defender for IoT on an existing IoT Hub

You can onboard Defender for IoT to an existing IoT Hub, where you can then monitor the device identity management, device to cloud, and cloud to device communication patterns.

**To enable Defender for IoT on an existing IoT Hub**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Follow these steps to [allow access to the IoT Hub](#allow-access-to-the-iot-hub).

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

## Set up resource providers and access control

To set up permissions needed to access the IoT hub:

1. [Set up resource providers and access control for the IoT hub](#allow-access-to-the-iot-hub).
1. To allow access to a Log Analytics workspace, also [set up resource providers and access control for Log Analytics workspace](#allow-access-to-a-log-analytics-workspace).

Learn more about [resource providers and resource types](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

### Allow access to the IoT Hub

To allow access to the IoT Hub:

#### Set up resource providers for the IoT hub

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to the **Subscriptions** page.

1. In the subscriptions table, select your subscription. 

1. In the subscription page that opens, from the left menu bar, select **Resource providers**.

1. In the search bar, type: *Microsoft.iot*. 

1. Select the **Microsoft.IoTSecurity** provider and verify that its status is **Registered**.

#### Set up access control for the IoT hub

1. In your IoT hub, from the left menu bar, select **Access control (IAM)**, and from the top menu, select **Add > Add role assignment**.

1. In the **Role tab**, select the **Privileged administrator roles** tab, and select the **Contributor** role. 

1. Select the **Members** tab, and next to **Members**, select **Select members**.

1. In the **Select members** page, in the **Select** field, type *Azure security*, select **Azure Security for IoT**, and select **Select** at the bottom.

1. Back in the **Members** tab, select **Review + assign** at the bottom of the tab, in the **Review and assign tab**, select **Review + assign** at the bottom again.

### Allow access to a Log Analytics workspace

To connect to a Log Analytics workspace:

#### Set up resource providers for the Log Analytics workspace

1. In the Azure portal, navigate to the **Subscriptions** page.

1. In the subscriptions table, select your subscription. 

1. In the subscription page that opens, from the left menu bar, select **Resource providers**.

1. In the search bar, type: *Microsoft.OperationsManagement*. 

1. Select the **Microsoft.OperationsManagement** provider and verify that its status is **Registered**.

#### Set up access control for the Log Analytics workspace

1. In the Azure portal, search for and navigate to the **Log analytics workspaces** page, select your workspace, and from the left menu, select **Access control (IAM)**.

1. From the top menu, select **Add > Add role assignment**.
   
1. In the **Role tab**, under **Job function roles**, search for *Log analytics*, and select the **Log Analytics Contributor** role.

1. Select the **Members** tab, and next to **Members**, select **Select members**.

1. In the **Select members** page, in the **Select** field, type *Azure security*, select **Azure Security for IoT**, and select **Select** at the bottom.

1. Back in the **Members** tab, select **Review + assign** at the bottom of the tab, in the **Review and assign tab**, select **Review + assign** at the bottom again.

#### Enable Defender for IoT

1. In your IoT hub, from the left menu, select **Settings**, and in the **Settings page**, select **Data Collection**.

1. Toggle on **Enable Microsoft Defender for IoT**, and select **Save** at the bottom.

1. Under **Choose the Log Analytics workspace you want to connect to**, set the toggle to **On**.

1. Select the subscription for which you [set up the resource provider](#set-up-resource-providers-for-the-log-analytics-workspace) and workspace.

## Next steps

Advance to the next article to add a resource group to your solution.

> [!div class="nextstepaction"]
> [Add a resource group to your IoT solution](tutorial-configure-your-solution.md)
