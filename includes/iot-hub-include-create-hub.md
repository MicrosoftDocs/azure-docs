---
title: include file
description: include file
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 12/20/2022
ms.author: kgremban
ms.custom: include file
---

This section describes how to create an IoT hub using the [Azure portal](https://portal.azure.com).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the Azure homepage, select the **+ Create a resource** button.

1. From the **Categories** menu, select **Internet of Things**, and then select **IoT Hub**.

1. On the **Basics** tab, complete the fields as follows:

   [!INCLUDE [iot-hub-pii-note-naming-hub](iot-hub-pii-note-naming-hub.md)]

   | Property | Value |
   | ----- | ----- |
   | **Subscription** | Select the subscription to use for your hub. |
   | **Resource group** | Select a resource group or create a new one. To create a new one, select **Create new** and fill in the name you want to use.
   | **IoT hub name** | Enter a name for your hub. This name must be globally unique, with a length between 3 and 50 alphanumeric characters. The name can also include the dash (`'-'`) character.
   | **Region** | Select the region, closest to you, where you want your hub to be located. Some features, such as [IoT Hub device streams](../articles/iot-hub/iot-hub-device-streams-overview.md), are only available in specific regions. For these limited features, you must select one of the supported regions.
   | **Tier** | Select the tier that you want to use for your hub. Tier selection depends on how many features you want and how many messages you send through your solution per day.<br><br>The free tier is intended for testing and evaluation. The free tier allows 500 devices to be connected to the hub and up to 8,000 messages per day. Each Azure subscription can create one IoT hub in the free tier.<br><br>To compare the features available to each tier, select **Compare tiers**. For more information, see [Choose the right IoT Hub tier for your solution](../articles/iot-hub/iot-hub-scaling.md).
   | **Daily message limit** | Select the maximum daily quota of messages for your hub. The available options depend on the tier you've selected for your hub. To see the available messaging and pricing options, select **See all options** and select the option that best matches the needs of your hub. For more information, see [IoT Hub quotas and throttling](../articles/iot-hub/iot-hub-devguide-quotas-throttling.md).

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-screen-basics.png" alt-text="Screen capture that shows how to create an IoT hub in the Azure portal.":::

   > [!NOTE]
   > Prices shown are for example purposes only.

1. Select **Next: Networking** to continue creating your hub.

1. On the **Networking** tab, complete the fields as follows:

   | Property | Value |
   | ----- | ----- |
   | **Connectivity configuration** | Choose the endpoints that devices can use to connect to your IoT hub. Accept the default setting, **Public access**, for this example. You can change this setting after the IoT hub is created. For more information, see [Managing public network access for your IoT hub](../articles/iot-hub/iot-hub-devguide-endpoints.md). |
   | **Minimum TLS Version** | Select the minimum [TLS version](../articles/iot-hub/iot-hub-tls-support.md#tls-12-enforcement-available-in-select-regions) to be supported by your IoT hub. Once the IoT hub is created, this value can't be changed. Accept the default setting, **1.0**, for this example. |

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-network-screen.png" alt-text="Screen capture that shows how to choose the endpoints that can connect to a new IoT hub.":::

1. Select **Next: Management** to continue creating your hub.

1. On the **Management** tab, accept the default settings. If desired, you can modify any of the following fields:

   | Property | Value |
   | ----- | ----- |
   | **Permission model** | Part of role-based access control, this property decides how you *manage access* to your IoT hub. Allow shared access policies or choose only role-based access control. For more information, see [Control access to IoT Hub by using Azure Active Directory](../articles/iot-hub/iot-hub-dev-guide-azure-ad-rbac.md).
   | **Assign me** | You may need access to IoT Hub data APIs to manage elements within an instance. If you have access to role assignments, select **IoT Hub Data Contributor role** to grant yourself full access to the data APIs.<br><br>To assign Azure roles, you must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](../articles/role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../articles/role-based-access-control/built-in-roles.md#owner). |
   | **Device-to-cloud partitions** | This property relates the device-to-cloud messages to the number of simultaneous readers of the messages. Most IoT hubs need only four partitions. |

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-management.png" alt-text="Screen capture that shows how to set the role-based access control and scale for a new IoT hub.":::

1. Select **Next: Add-ons** to continue to the next screen.

1. On the **Add-ons** tab, accept the default settings. If desired, you can modify any of the following fields:

   | Property | Value |
   | -------- | ----- |
   | **Enable Device Update for IoT Hub** | Turn on Device Update for IoT Hub to enable over-the-air updates for your devices. If you select this option, you're prompted to provide information to provision a Device Update for IoT Hub account and instance. For more information, see [What is Device Update for IoT Hub?](../articles/iot-hub-device-update/understand-device-update.md)
   | **Enable Defender for IoT** | Turn Defender for IoT on to add an extra layer of protection to IoT and your devices. This option isn't available for hubs in the free tier. Learn more about [security recommendations for IoT Hub in Defender for IoT](../articles/defender-for-iot/device-builders/concept-recommendations.md).

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-add-ons.png" alt-text="Screen capture that shows how to set the optional add-ons for a new IoT hub.":::

   > [!NOTE]
   > Prices shown are for example purposes only.

1. Select **Next: Tags** to continue to the next screen.

    Tags are name/value pairs. You can assign the same tag to multiple resources and resource groups to categorize resources and consolidate billing. In this document, you won't be adding any tags. For more information, see [Use tags to organize your Azure resources](../articles/azure-resource-manager/management/tag-resources.md).

    :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-tags.png" alt-text="Screen capture that shows how to assign tags for a new IoT hub.":::

1. Select **Next: Review + create** to review your choices.

1. Select **Create** to start the deployment of your new hub. Your deployment will be in progress a few minutes while the hub is being created. Once the deployment is complete, select **Go to resource** to open the new hub.
