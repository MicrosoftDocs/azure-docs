---
title: Modify a site plan
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to modify the billing plan in a site using the Azure portal. 
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to
ms.date: 10/13/2022
ms.custom: template-how-to
---

# Modify the billing plan in a site

The *site plan* determines the throughput and the number of devices each site supports. The plan you selected when creating the site can be easily updated to support your deployment requirements as they change. In this how-to guide, you'll learn how to modify the billing plan in a site using the Azure portal.

<!-- TODO: add note to external pricing documentation once available.
> [!IMPORTANT]
> Modifying the the site plan will affect how much you're charged. Refer to [Azure Private 5G Core pricing](https://azure.microsoft.com/products/private-5g-core/#pricing) for more information. -->

## Prerequisites

Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## Choose the new site plan

Use the following table to choose the new site plan that will best fit your requirements.

| Site Plan | Throughput | Activated SIMs |
|------|------|------|
| G1 |  1 Gbps | 100 |
| G2 |  2 Gbps | 200 |
| G3 |  3 Gbps | 300 |
| G4 |  4 Gbps | 400 |
| G5 |  5 Gbps | 500 |

## View the current site plan

You can view your current site plan in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the resource menu, select **Sites**.
1. Select the site you're interested in.

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

4. Wait while the Azure portal redeploys the packet core instance with the new configuration. You'll see a confirmation screen when the deployment is complete.
5. Navigate to the **Mobile Network Site** resource as described in [View the current site plan](#view-the-current-site-plan). Check that the field under **Site Plan** contains the updated information.

## Next steps

Use Azure Monitor or the packet core dashboards to confirm your packet core instance is operating normally after you modify the site plan.
<!-- TODO: add link to platform metrics -->
- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
