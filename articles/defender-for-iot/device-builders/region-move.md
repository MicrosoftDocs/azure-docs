---
title: Move an “iotsecuritysolutions” resource to another region by using the Azure portal
description: Move an “iotsecuritysolutions” resource from one Azure region to another by using a      and the Azure portal.
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 01/02/2022
---

# Move an “iotsecuritysolutions” resource to another region by using the Azure portal

There are various scenarios for moving an existing resources from one region to another. For example, you might want to take advantage of features, and services that are only available in specific regions, to meet internal policy and governance requirements, or in response to capacity planning requirements.

You can move a Microsoft Defender for IoT “iotsecuritysolutions” resource to a different Azure region. The “iotsecuritysolutions” resource is a hidden resource that is connected to a specific IoT hub resource which is used to enable security on the hub. Learn how to [configure, and create](/azure/templates/microsoft.security/iotsecuritysolutions?tabs=bicep) this resource.

## Prerequisites

- Make sure that the resource is in the Azure region that you want to move from.

- An existing “iotsecuritysolutions” resource.  

- Make sure that your Azure subscription allows you to create “iotsecuritysolutions” resources in the target region.

- Make sure that your subscription has enough resources to support the addition of resources for this process. For more information, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).

## Prepare

In this section, you will prepare to move the resource for the move by finding the resource and confirming it is in a region you wish to move from.

Before transitioning the resource to the new region, we recommended using [log analytics](https://docs.microsoft.com/azure/azure-monitor/logs/quick-create-workspace) to store alerts, and raw events.

**To find the resource you want to move**:

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **All Resources**.

1. Select **Show hidden types**.

    :::image type="content" source="media/region-move/hidden-resources.png" alt-text="Screenshot showing where the Show hidden resources checkbox is located.":::

1. Select the **Type** filter, and enter `iotsecuritysolutions` in the search field.

1. Select **Apply**.

1. Select your hub from the list.

1. Ensure that you have selected the correct hub, and that it is in the region you want to move it from.

    :::image type="content" source="media/region-move/location.png" alt-text="Screenshot showing you the region your hub is located in.":::

Once you have located your resource and ensured it is in a region that you wish to move from, you will then need to disable that resources connection to the IoT Hub.

**To disable the connection to the IoT Hub**:

1. Sign in to the [Azure portal](https://portal.azure.com), and then navigate to the IoT Hub.

1. Locate, and select your hub.

1. Navigate to **Device management** > **Devices** > **Device ID**, and select your device.

    :::image type="content" source="media/region-move/your-device.png" alt-text="Screenshot showing you where to select your device in the IoT Hub.":::

1. Disable the connection to the IoT Hub.

:::image type="content" source="media/region-move/disable-connection.png" alt-text="Screenshot showing how to disable the connection to the IoT Hub.":::

## Move

YOu are now ready to move your resource to your new location.

Follow [these instructions](/azure/iot-hub/iot-hub-how-to-clone) to move your IoT Hub.

After transferring, and enabling the resource, you can link to the same log analytics workspace that was configured 