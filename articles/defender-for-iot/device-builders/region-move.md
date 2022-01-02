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

## Prepare for the move

In this section, you prepare the resource for the move by using the configuration, the security rule move using the Azure portal, and the resource to the target region.

Before transitioning the resource to the new region, we recommended using [log analytics](https://docs.microsoft.com/azure/azure-monitor/logs/quick-create-workspace) to store alerts, and raw events.

**To move the resource to the new region**:

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **All Resources**.

1. Select **Show hidden types**.

    :::image type="content" source="media/region-move/hidden-resources.png" alt-text="Screenshot showing where the Show hidden resources checkbox is located.":::

1. Select the **Type** filter, and enter `iotsecuritysolutions` in the search field.

1. Select **Apply**.
1. Select your hub from the list.
1. 

Disable security for the source IoT hub that is connected to the “iotsecuritysolutions” resource by navigating to the resource group and then clicking the connected IoT hub. 