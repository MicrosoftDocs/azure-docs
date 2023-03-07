---
title: Modify a site plan
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to modify a site plan using the Azure portal. 
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to
ms.date: 10/13/2022
ms.custom: template-how-to
---

# Modify a site plan

The *site plan* determines an allowance for the throughput and number of radio access network (RAN) connections for each site, as well as the number of devices that each network supports. The plan you selected when creating the site can be updated to support your deployment requirements as they change. In this how-to guide, you'll learn how to modify a site plan using the Azure portal.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Verify pricing and charges associated with the site plan to which you want to move. See the [Azure Private 5G Core Pricing Calculator](https://azure.microsoft.com/pricing/calculator/?service=private-5g-core) for in depth pricing information.

## Choose the new site plan

Use the following table to choose the new site plan that will best fit your requirements.

| Site Plan | Throughput | Activated SIMs | RANs |
|------|------|------|------|
| G0 |  100 Mbps | 20 | 2 |
| G1 |  1 Gbps | 100 | 5 |
| G2 |  2 Gbps | 200 | 10 |
| G3 |  3 Gbps | 300 | Unlimited |
| G4 |  4 Gbps | 400 | Unlimited |
| G5 |  5 Gbps | 500 | Unlimited |
| G10 |  10 Gbps | 1000 | Unlimited |

## View the current site plan

You can view your current site plan in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. Select the **Sites** page, then select the site you're interested in.

    :::image type="content" source="media/mobile-network-sites.png" alt-text="Screenshot of the Azure portal showing the Sites view in the Mobile Network resource.":::

1. Check the **Site Plan** field under the **Essentials** heading to view the current site plan.

    :::image type="content" source="media/modify-site-plan/view-site-plan.png" alt-text="Screenshot of the Azure portal showing a site resource. The Site Plan field is highlighted.":::

## Modify the site plan

To modify your site plan:

1. If you haven't already, navigate to the site that you're interested in modifying as described in [View the current site plan](#view-the-current-site-plan).
2. Select **Change plan**.

    :::image type="content" source="media/modify-site-plan/change-site-plan.png" alt-text="Screenshot of the Azure portal showing the Change plan option.":::

3. In **Site Plan** on the right, select the new site plan you collected in [Choose the new site plan](#choose-the-new-site-plan). Save your change with **Select**.

    :::image type="content" source="media/modify-site-plan/site-plan-selection-tab.png" alt-text="Screenshot of the Azure portal showing the Site Plan screen.":::

4. Wait while the Azure portal applies the new site plan configuration to your site. You'll see a confirmation screen when the deployment is complete.
5. Navigate to the **Mobile Network Site** resource as described in [View the current site plan](#view-the-current-site-plan). Check that the field under **Site Plan** contains the updated information.

## Next steps

Use [Azure Monitor](monitor-private-5g-core-with-log-analytics.md) or the [packet core dashboards](packet-core-dashboards.md) to confirm your packet core instance is operating normally after you modify the site plan.
