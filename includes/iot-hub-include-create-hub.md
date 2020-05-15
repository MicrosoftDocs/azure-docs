---
title: include file
description: include file
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 02/14/2020
ms.author: robinsh
ms.custom: include file
---

This section describes how to create an IoT hub using the [Azure portal](https://portal.azure.com).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure homepage, select the **+ Create a resource** button, and then enter *IoT Hub* in the **Search the Marketplace** field.

1. Select **IoT Hub** from the search results, and then select **Create**.

1. On the **Basics** tab, complete the fields as follows:

   - **Subscription**: Select the subscription to use for your hub.

   - **Resource Group**: Select a resource group or create a new one. To create a new one, select **Create new** and fill in the name you want to use. To use an existing resource group, select that resource group. For more information, see [Manage Azure Resource Manager resource groups](../articles/azure-resource-manager/management/manage-resource-groups-portal.md).

   - **Region**: Select the region in which you want your hub to be located. Select the location closest to you. Some features, such as [IoT Hub device streams](../articles/iot-hub/iot-hub-device-streams-overview.md), are only available in specific regions. For these limited features, you must select one of the supported regions.

   - **IoT Hub Name**: Enter a name for your hub. This name must be globally unique. If the name you enter is available, a green check mark appears.

   [!INCLUDE [iot-hub-pii-note-naming-hub](iot-hub-pii-note-naming-hub.md)]

   ![Create a hub in the Azure portal](./media/iot-hub-include-create-hub/iot-hub-create-screen-basics.png)

1. Select **Next: Size and scale** to continue creating your hub.

   ![Set the size and scale for a new hub using the Azure portal](./media/iot-hub-include-create-hub/iot-hub-create-screen-size-scale.png)

   You can accept the default settings here. If desired, you can modify any of the following fields: 

    - **Pricing and scale tier**: Your selected tier. You can choose from several tiers, depending on how many features you want and how many messages you send through your solution per day. The free tier is intended for testing and evaluation. It allows 500 devices to be connected to the hub and up to 8,000 messages per day. Each Azure subscription can create one IoT hub in the free tier. 

      If you are working through a Quickstart for IoT Hub device streams, select the free tier.

    - **IoT Hub units**: The number of messages allowed per unit per day depends on your hub's pricing tier. For example, if you want the hub to support ingress of 700,000 messages, you choose two S1 tier units.
    For details about the other tier options, see [Choosing the right IoT Hub tier](../articles/iot-hub/iot-hub-scaling.md).

    - **Azure Security Center**: Turn this on to add an extra layer of threat protection to IoT and your devices. This option is not available for hubs in the free tier. For more information about this feature, see [Azure Security Center for IoT](https://docs.microsoft.com/azure/asc-for-iot/).

    - **Advanced Settings** > **Device-to-cloud partitions**: This property relates the device-to-cloud messages to the number of simultaneous readers of the messages. Most hubs need only four partitions.

1.  Select **Next: Tags** to continue to the next screen.

    Tags are name/value pairs. You can assign the same tag to multiple resources and resource groups to categorize resources and consolidate billing. for more information, see [Use tags to organize your Azure resources](../articles/azure-resource-manager/management/tag-resources.md).

    ![Assign tags for the hub using the Azure portal](./media/iot-hub-include-create-hub/iot-hub-create-tabs.png)

1.  Select **Next: Review + create** to review your choices. You see something similar to this screen, but with the values you selected when creating the hub. 

    ![Review information for creating the new hub](./media/iot-hub-include-create-hub/iot-hub-create-review.png)

1.  Select **Create** to create your new hub. Creating the hub takes a few minutes.
