---
title: Modify a site plan
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to modify the billing plan in a site using the Azure portal. 
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to
ms.date: 10/06/2022
ms.custom: template-how-to
---

# Modify the billing plan in a site

The *site plan* determines the throughput and the number of devices each network supports. In this how-to guide, you'll learn how to modify the billing plan in a site using the Azure portal.

<!-- Should we add a note like the one below? Do we have somewhere we can refer the user to for more information? -->
> [!IMPORTANT]
> Modifying the the billing plan may affect how much you're charged. Refer to ... for more information.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## Choose the new site plan

Use the following table to choose the new billing plan that will best fit your requirements.

| Site Plan | Throughput | Activated SIMs |
|------|------|------|
| G1 |  1 Gbps | 100 |
| G2 |  2 Gbps | 200 |
| G3 |  3 Gbps | 300 |
| G4 |  4 Gbps | 400 |
| G5 |  5 Gbps | 500 |

## Modify the site plan

1. Sign in to the Azure portal at [https://aka.ms/AP5GCNewPortal](https://aka.ms/AP5GCNewPortal).
2. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

3. In the **Resource** menu, select **Sites**.
4. Select the site you want to modify.
5. Select **Change plan**.

    :::image type="content" source="media/modify-site-plan/change-site-plan.png" alt-text="Screenshot of the Azure portal showing the Change plan option.":::

6. In **Site Plan** on the right, select the new site plan you collected in [Choose the new site plan](#choose-the-new-site-plan). Save your change with **Select**.

    :::image type="content" source="media/modify-site-plan/site-plan-selection-tab.png" alt-text="Screenshot of the Azure portal showing the Site Plan screen.":::

7. Azure will now redeploy the packet core instance.
8. When the deployment is complete, navigate to the **Mobile Network Site** resource as described in [Modify the site plan](#modify-the-site-plan). Check that the field under **Site Plan** contains the updated information.

## Next steps

Use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally after you modify the site plan.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
