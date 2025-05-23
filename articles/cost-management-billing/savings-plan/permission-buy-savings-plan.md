---
title: Permissions to buy an Azure savings plan
titleSuffix: Microsoft Cost Management
description: This article provides you with information to understand who can buy an Azure savings plan.
author: nwokolo
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: conceptual
ms.date: 01/07/2025
ms.author: onwokolo
---

# Permissions to buy an Azure savings plan

Savings plan discounts only apply to resources associated with subscriptions purchased through an Enterprise Agreement, Microsoft Customer Agreement, or Microsoft Partner Agreement. You can buy a savings plan for an Azure subscription that's of type Enterprise Agreement (MS-AZR-0017P or MS-AZR-0148P), Microsoft Customer Agreement, or Microsoft Partner Agreement. To determine if you're eligible to buy a plan, [check your billing type](../manage/view-all-accounts.md#check-the-type-of-your-account).

>[!NOTE]
> The Azure savings plan isn't supported for the China legacy Online Service Premium Agreement (OSPA) platform.

### Enterprise Agreement customers
Saving plan purchasing for Enterprise Agreement customers is limited to:

- Enterprise Agreement admins with write permissions can purchase savings plans from **Cost Management + Billing** > **Savings plan**. No subscription-specific permissions are needed.
- Users with subscription owner or savings plan purchaser roles in at least one subscription in the enrollment account can purchase savings plans from **Home** > **Savings plan**.

Enterprise Agreement (EA) customers can limit purchases to EA admins by disabling the **Add Savings Plan** policy option in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/BillingAccounts). To change settings, navigate to the **Policies** menu.


### Microsoft Customer Agreement customers
Savings plan purchasing for Microsoft Customer Agreement customers is limited to:

- Users with billing profile contributor permissions or higher can purchase savings plans from **Cost Management + Billing** > **Savings plan** experience. No subscription-specific permissions are needed.
- Users with subscription owner or savings plan purchaser roles in at least one subscription in the billing profile can purchase savings plans from **Home** > **Savings plan**.

Microsoft Customer Agreement (MCA), Billing Profile Owners can restrict savings plan purchases by disabling the **Add Savings Plan** policy option in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/BillingAccounts). Beginning in June 2025, Microsoft Customer Agreement (MCA), Billing Profile, and Billing Account Owners will have the ability to purchase savings plans even if the Add Savings plan policy option is disabled in the Azure portal. To change settings, navigate to the **Policies** menu under **Billing Profile**.

### Microsoft Partner Agreement partners

Partners can use **Home** > **Savings plan** in the [Azure portal](https://portal.azure.com/) to purchase savings plans on behalf of their customers.

As of June 2023, partners can purchase an Azure savings plan through the Partner Center. Previously, the Azure savings plan was only supported for purchase through the Azure portal. Partners can now purchase an Azure savings plan through the Partner Center portal or APIs. They can also continue to use the Azure portal.

To purchase an Azure savings plan by using the Partner Center APIs, see [Purchase Azure savings plans](/partner-center/developer/azure-purchase-savings-plan).

## Need help?

If you have Azure savings plan for compute questions, contact your account team or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides answers to expert support requests in English for questions about Azure savings plan for compute.

## Related content

- To buy a savings plan, see [Buy a savings plan](buy-savings-plan.md)
- To learn how to manage a savings plan, see [Manage Azure savings plans](manage-savings-plan.md).
- To learn more about Azure savings plans, see:

    - [What are Azure savings plans?](savings-plan-compute-overview.md)
    - [Manage Azure savings plans](manage-savings-plan.md)
    - [How a savings plan discount is applied](discount-application.md)
    - [Understand savings plan costs and usage](utilization-cost-reports.md)
    - [Software costs not included with Azure savings plans](software-costs-not-included.md)
