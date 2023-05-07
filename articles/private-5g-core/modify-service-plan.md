---
title: Modify a service plan
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to modify a service plan using the Azure portal. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 10/13/2022
ms.custom: template-how-to
---

# Modify a service plan

The *service plan* determines an allowance for the throughput and the number of radio access network (RAN) connections for each site, as well as the number of devices that each network supports. The plan you selected when creating the site can be updated to support your deployment requirements as they change. In this how-to guide, you'll learn how to modify a service plan using the Azure portal.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## Choose a new service plan

Choose the service plan that will best fit your requirements and verify pricing and charges. See [Azure Private 5G Core pricing](https://azure.microsoft.com/pricing/details/private-5g-core/).

## View the current service plan

You can view your current service plan in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. Select the **Sites** page, then select the site you're interested in.

    :::image type="content" source="media/mobile-network-sites.png" alt-text="Screenshot of the Azure portal showing the Sites view in the Mobile Network resource.":::

1. Under the **Network Functions** group, select the **Packet Core** resource.

    :::image type="content" source="media/modify-service-plan/select-packet-core.png" alt-text="Screenshot of the Azure portal. It shows a Mobile Network Site with a Packet Core resource highlighted.":::

1. Check the **Service Plan** field under the **Essentials** heading to view the current service plan.

    :::image type="content" source="media/modify-service-plan/service-plan.png" alt-text="Screenshot of the Azure portal showing a packet core control plane resource. The Service Plan field is highlighted.":::

## Modify the service plan

To modify your service plan:

1. If you haven't already, navigate to the service plan that you're interested in modifying as described in [View the current service plan](#view-the-current-service-plan).
2. Select **Change plan**.

    :::image type="content" source="media/modify-service-plan/service-plan.png" alt-text="Screenshot of the Azure portal showing a packet core control plane resource. The Service Plan field is highlighted.":::

3. In **Service Plan** on the right, select the new service plan you identified in [Choose a new service plan](#choose-a-new-service-plan). Save your change with **Select**.

    :::image type="content" source="media/modify-service-plan/service-plan-selection-tab.png" alt-text="Screenshot of the Azure portal showing the Service Plan screen.":::

4. Wait while the Azure portal applies the new service plan configuration to your site. You'll see a confirmation screen when the deployment is complete.
5. Navigate to the **Mobile Network Site** resource as described in [View the current service plan](#view-the-current-service-plan). Check that the field under **Service Plan** contains the updated information.

## Next steps

Use [Azure Monitor](monitor-private-5g-core-with-platform-metrics.md) or the [packet core dashboards](packet-core-dashboards.md) to confirm your packet core instance is operating normally after you modify the service plan.
