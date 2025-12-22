---
title:  Purchase Reserved Instances and Savings Plans - Azure portal
description: Learn how to purchase a Reserved Instance or a Savings Plan for your Azure Extended Zone resources using the Azure portal.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 08/30/2025
#customer intent: As a user, I want to purchase a a Reserved Instance or a Savings Plan for your Azure Extended Zone resources, so that I can optimize my cloud spend.
---

# Purchase Reserved Instances and/or Savings Plans in the Azure portal

In this article, you learn how to purchase a **Reserved Instance** and how to purchase a **Savings Plan** for your Azure Extended Zone resources using the Azure portal.
- An Azure account with an active subscription.
- An existing Extended Zone resource, with a couple of days of usage, to be targeted for reservations and/or savings plans.
    > [!NOTE]
    > Meters need to be minted for both Reserved Instances and Savings Plans, so the functionality is applicable only to SKUs with live meters supported in the respective AEZ. Most meters should be supported by end of 2025. If your SKU isn't supported yet, check back later or contact support for more information.
    > [!NOTE]
    > Recommendations may take up to 7 days to appear in both **Reserved Instances** and **Savings Plans** after the Extended Zone resource is created. If you don't see any recommendations, check back later. If you still don't see them after seven days, contact support.> Reserved Instances for Extended Zones are currently available for purchase only through the **Recommendations** workflow, and working as expected once contracted. The **All Products** list workflow isn't currently enabled. Upon selecting the **All Products** list workflow, you may notice that no Extended Zone is listed under the "Region" filter.

## Prerequisites

- An Azure account with an active subscription.
- An existing Extended Zone resource, with a couple of days of usage, to be targeted for reservations and/or savings plans.
    > [!NOTE]
    > Recommendations may take up to 7 days to appear in both **Reserved Instances** and **Savings Plans** after the Extended Zone resource is created. If you don't see any recommendations, check back later. If you still don't see them after seven days, contact support.

## Purchase a reserved instance

In this section, you learn to purchase a reservation in the Azure portal from the Recommendations flow.

1. Once you've created an Extended Zone resource, navigate to the Azure portal home page and search for and select **Reserved Instances** from the search bar.

1. Once in the Reservations site, select **Add**.
 
1. Select the type of resource deployed for reservations as a prerequisite and select on **Recommended**. You’ll see the resources for which the system has optimization recommendations and for which you may contract a **Reserved Instance**. Select the configuration you prefer. You may notice that the name of the Extended Zone (that is "perth", in this case) appears in the **Region** column. This is expected and a confirmation of proper setup of the reservation.
 
1. Follow the steps to review and purchase your **Reserved Instance**.
 
Once deployed and configured, **Reserved Instances** purchases will appear in the initial **Reservations** dashboard, selected in the first step. You may select on it to get its details and insights. You may notice that the name of the Extended Zone (that is "perth", in this case) continues to appear in the **Region** column. This consistency is expected and a confirmation of proper setup of the reservation.

## Purchase a Savings Plan in the Azure portal

To purchase **Savings Plans** for your Azure Extended Zone resources using the Azure portal, the steps will be consistent with similar resources deployed in Azure Regions. Consequently, you may follow the steps outlined in the section "Buy a savings plan in the Azure portal" found in [Purchase a Savings Plan - Azure portal](/azure/cost-management-billing/savings-plan/buy-savings-plan).

## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Frequently asked questions](faq.md)
- [Reserved Instances documentation](/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Savings Plans documentation](/azure/cost-management-billing/savings-plan/buy-savings-plan)