---
title: include file
description: include file
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 02/24/2022
ms.author: kgremban
ms.custom: include file
---

This section describes how to create an IoT hub using the [Azure portal](https://portal.azure.com).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the Azure homepage, select the **+ Create a resource** button.

1. From the **Categories** menu, select **Internet of Things** then **IoT Hub**.

1. On the **Basics** tab, complete the fields as follows:

   - **Subscription**: Select the subscription to use for your hub.

   - **Resource group**: Select a resource group or create a new one. To create a new one, select **Create new** and fill in the name you want to use. To use an existing resource group, select that resource group. For more information, see [Manage Azure Resource Manager resource groups](../articles/azure-resource-manager/management/manage-resource-groups-portal.md).
   
   - **IoT hub name**: Enter a name for your hub. This name must be globally unique, with a length between 3 and 50 alphanumeric characters. The name can also include the dash (`'-'`) character.

   - **Region**: Select the region, closest to you, where you want your hub to be located. Some features, such as [IoT Hub device streams](../articles/iot-hub/iot-hub-device-streams-overview.md), are only available in specific regions. For these limited features, you must select one of the supported regions.

   [!INCLUDE [iot-hub-pii-note-naming-hub](iot-hub-pii-note-naming-hub.md)]

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-screen-basics.png" alt-text="Screenshot that shows how to create an IoT hub in the Azure portal.":::

1. Select **Next: Networking** to continue creating your hub.

   Choose the endpoints that devices can use to connect to your IoT hub. Accept the default setting, **Public access**, for this example.

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-network-screen.png" alt-text="Choose the endpoints that can connect.":::

1. Select **Next: Management** to continue creating your hub.

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-management.png" alt-text="Set the size and scale for a new hub using the Azure portal.":::

    Accept the default settings here. If desired, you can modify any of the following fields:

    - **Pricing and scale tier**: Tier selection depends on how many features you want and how many messages you send through your solution per day. The free tier is intended for testing and evaluation. The free tier allows 500 devices to be connected to the hub and up to 8,000 messages per day. Each Azure subscription can create one IoT hub in the free tier. For details about other tier options, see [Choosing the right IoT Hub tier](../articles/iot-hub/iot-hub-scaling.md).

      If you're working through a quickstart, select the free tier.

    - **IoT Hub units**: The number of messages allowed per *unit* per day depends on your hub's pricing tier. For example, if you want the hub to support ingress of 700,000 messages, choose two S1 tier units.

    - **Microsoft Defender for IoT**: Turn Defender on to add an extra layer of protection to IoT and your devices. This option isn't available for hubs in the free tier. Learn more about [security recommendations for IoT Hub in Defender for IoT](../articles/defender-for-iot/device-builders/concept-recommendations.md).

    - **Role-based access control**: This property decides how you *manage access* to your IoT hub. Allow shared access policies or choose only role-based access control. For more information, see [Control access to IoT Hub by using Azure Active Directory](../articles/iot-hub/iot-hub-dev-guide-azure-ad-rbac.md).

    - **Device-to-cloud partitions**: This property relates the device-to-cloud messages to the number of simultaneous readers of the messages. Most hubs need only four partitions.

1. Select **Next: Tags** to continue to the next screen.

    Tags are name/value pairs. You can assign the same tag to multiple resources and resource groups to categorize resources and consolidate billing. In this document, you won't be adding any tags. For more information, see [Use tags to organize your Azure resources](../articles/azure-resource-manager/management/tag-resources.md).

    :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-tags.png" alt-text="Assign tags for the hub using the Azure portal.":::

1. Select **Next: Review + create** to review your choices. You see something similar to this screen, but with the values you selected when creating the hub.

    :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-review-and-create.png" alt-text="Review information for creating the new hub.":::

1. Select **Create** to start the deployment of your new hub. Your deployment will be in progress a few minutes while the hub is being created. Once the deployment is complete, select **Go to resource** to open the new hub.
