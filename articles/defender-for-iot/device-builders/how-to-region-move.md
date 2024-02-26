---
title: Move an "iotsecuritysolutions" resource to another region by using the Azure portal
description: Move an "iotsecuritysolutions" resource from one Azure region to another by using the Azure portal.
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 01/04/2022
---

# Move an "iotsecuritysolutions" resource to another region by using the Azure portal

There are various scenarios for moving an existing resource from one region to another. For example, you might want to take advantage of features, and services that are only available in specific regions, to meet internal policy and governance requirements, or in response to capacity planning requirements.

You can move a Microsoft Defender for IoT "iotsecuritysolutions" resource to a different Azure region. The "iotsecuritysolutions" resource is a hidden resource that is connected to a specific IoT hub resource that is used to enable security on the hub. Learn how to [configure, and create](/azure/templates/microsoft.security/iotsecuritysolutions?tabs=bicep) this resource.

## Resource prerequisites

- Make sure that the resource is in the Azure region that you want to move from.

- An existing "iotsecuritysolutions" resource.  

- Make sure that your Azure subscription allows you to create "iotsecuritysolutions" resources in the target region.

- Make sure that your subscription has enough resources to support the addition of resources for this process. For more information, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits)

## Alert preparation

In this section, you'll prepare to move the resource for the move by finding the resource and confirming it is in a region you wish to move from.

Before transitioning the resource to the new region, we recommended using [log analytics](../../azure-monitor/logs/quick-create-workspace.md) to store alerts, and raw events.

**To find the resource you want to move**:

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **All Resources**.

1. Select **Show hidden types**.

    :::image type="content" source="media/region-move/hidden-resources.png" alt-text="Screenshot showing where the Show hidden resources checkbox is located.":::

1. Select the **Type** filter, and enter `iotsecuritysolutions` in the search field.

    :::image type="content" source="media/region-move/filter-type.png" alt-text="Screenshot showing you how to filter by type.":::

1. Select **Apply**.

1. Select your hub from the list.

1. Ensure that you've selected the correct hub, and that it is in the region you want to move it from.

    :::image type="content" source="media/region-move/location.png" alt-text="Screenshot showing you the region your hub is located in.":::

## Moving IoT Hub

You're now ready to move your resource to your new location. Follow [these instructions](../../iot-hub/iot-hub-how-to-clone.md) to move your IoT Hub.

After transferring, and enabling the resource, you can link to the same log analytics workspace that was configured earlier.

## Resource verification

In this section, you'll verify that the resource has been moved, that the connection to the IoT Hub has been enabled, and that everything is working correctly.

**To verify the resource is in the correct region**:

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **All Resources**.

1. Select **Show hidden types**.

    :::image type="content" source="media/region-move/hidden-resources.png" alt-text="Screenshot showing where the Show hidden resources checkbox is located.":::

1. Select the **Type** filter, and enter `iotsecuritysolutions` in the search field.

1. Select **Apply**.

1. Select your hub from the list.

1. Ensure that the region has been changed.

    :::image type="content" source="media/region-move/location-changed.png" alt-text="Screenshot that shows you the region your hub is located in.":::

**To ensure everything is working correctly**:

1. Navigate to **IoT Hub** > **`Your hub`** > **Defender for IoT**, and select Recommendations.

    :::image type="content" source="media/region-move/recommendations.png" alt-text="Screenshot showing you where to go to see recommendations.":::

The recommendations should have transferred and everything should be working correctly.

## Clean up source resources

Don’t clean up until you have finished verifying that the resource has moved, and the recommendations have transferred. When you're ready, clean up the old resources by performing these steps:

- If you haven't already, delete the old hub. This removes all of the active devices from the hub.

- If you have routing resources that you moved to the new location, you can delete the old routing resources.

## Next steps

In this tutorial, you moved an Azure resource from one region to another and cleaned up the source resource.

- Learn more about [Moving your resources to a new resource group or subscription.](../../azure-resource-manager/management/move-resource-group-and-subscription.md).

- Learn how to [move VMs to another Azure region](../../site-recovery/azure-to-azure-tutorial-migrate.md).
