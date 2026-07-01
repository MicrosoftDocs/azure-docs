---
title: Purchase Reservations and Savings Plans - Azure Portal
description: Learn how to purchase a reservation or a savings plan for your Azure Extended Zones resources by using the Azure portal.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 08/30/2025
#customer intent: As a user, I want to purchase a reservation or a savings plan for my Azure Extended Zones resources so that I can optimize my cloud spend.
---

# Purchase reservations or savings plans in the Azure portal

In this article, you learn how to purchase a reservation or a savings plan for your Azure Extended Zones resources by using the Azure portal.

> [!NOTE]
> Meters must be minted for both reservations and savings plans, so the functionality applies only to versions with live meters supported in the respective Azure extended zone. Most meters should be supported by the end of 2025. If your version isn't supported yet, check back later or contact support for more information.

Reservations for extended zones are currently available for purchase only through the **Recommendations** workflow and work as expected after they're contracted. The **All Products** list workflow isn't currently enabled. After you select the **All Products** list workflow, you might notice that no extended zone is listed under the **Region** filter.

## Prerequisites

- An Azure account with an active subscription.
- An existing Azure Extended Zones resource, with a couple of days of usage, to be targeted for reservations or savings plans.

> [!NOTE]
> Recommendations might take up to seven days to appear in both reservations and savings plans after the Azure Extended Zones resource is created. If you don't see any recommendations, check back later. If you don't see them after seven days, contact support.

## Purchase a reservation

In this section, you learn how to purchase a reservation in the Azure portal.

1. After you create an Azure Extended Zones resource, go to the Azure portal home page and enter **Reserved Instances** in the search bar and select it.

1. On the **Reservations** pane, select **Add**.

1. Select the type of resource deployed for reservations as a prerequisite and select **Recommended**. You see the resources for which the system has optimization recommendations and for which you might contract a reservation. Select the configuration that you prefer. The name of the extended zone ("Perth," in this case) appears in the **Region** column. This information is expected and a confirmation of proper setup of the reservation.

1. Follow the steps to review and purchase your reservation.

After reservation purchases are deployed and configured, they appear on the initial **Reservations** dashboard. Select them to see their details and insights. The name of the extended zone ("Perth," in this case) continues to appear in the **Region** column. This consistency is expected and a confirmation of proper setup of the reservation.

## Purchase a savings plan in the Azure portal

To purchase savings plans for your Azure Extended Zones resources by using the Azure portal, you follow steps that are consistent with similar resources that are deployed in Azure regions. Follow the steps outlined in the section "Buy a savings plan in the Azure portal" found in [Purchase a savings plan - Azure portal](/azure/cost-management-billing/savings-plan/buy-savings-plan).

## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an extended zone](deploy-vm-portal.md)
- [Frequently asked questions](faq.md)
- [Reservations documentation](/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Savings plans documentation](/azure/cost-management-billing/savings-plan/buy-savings-plan)