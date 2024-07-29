---
title: Manage Azure savings plans
titleSuffix: Microsoft Cost Management
description: Learn how to manage savings plans. See steps to change the plan's scope, split a plan, and optimize its use.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 11/17/2023
ms.author: banders
---

# Manage Azure savings plans
After you buy an Azure savings plan, with sufficient permissions, you can make the following types of changes to a savings plan:

- Update a savings plan scope.
- Change autorenewal settings.
- View savings plan details and utilization.
- Delegate savings plan role-based access control (RBAC) roles.

Except for autorenewal, none of the changes causes a new commercial transaction or changes the end date of the savings plan.

You can't make the following types of changes after purchase:
- Hourly commitment
- Term length
- Billing frequency

To learn more, see [Savings plan permissions](permission-view-manage.md). _Permission needed to manage a savings plan is separate from subscription permission._

## Change the savings plan scope
Your hourly savings plan benefit is to automatically use from savings plan-eligible resources that run in the savings plan's benefit scope. To learn more, see [Savings plan scopes](scope-savings-plan.md). Changing a savings plan's benefit scope doesn't alter the savings plan's term.

To update a savings plan scope as a billing administrator:
1. Sign in to the Azure portal and go to **Cost Management + Billing**.
    - If you're an Enterprise Agreement admin, on the left menu, select **Billing scopes**. Then in the list of billing scopes, select one.
    - If you're a Microsoft Customer Agreement billing profile owner, on the left menu, select **Billing profiles**. In the list of billing profiles, select one.
1. On the left menu, select **Products + services** > **Savings plans**. The list of savings plans for your Enterprise Agreement enrollment or billing profile appears.
1. Select the savings plan you want.
1. Select **Settings** > **Configuration**.
1. Change the scope.

If you purchased/were added to a savings plan, or were assigned savings plan RBAC roles, follow these steps to update a savings plan scope.
1. Sign in to the Azure portal.
1. Select **All Services** > **Savings plans** to list savings plans to which you have access.
1. Select the savings plan you want.
1. Select **Settings** > **Configuration**.
1. Change the scope.

Selectable scopes must be from Enterprise offers (MS-AZR-0017P or MS-AZR-0148P), Microsoft Customer Agreements, and Microsoft Partner Agreements.

If you aren't a billing administrator and you change from shared to single scope, you may only select a subscription where you're the owner. Only subscriptions within the same billing account/profile as the savings plan can be selected.

If all subscriptions are moved out of a management group, the scope of the savings plan is automatically changed to **Shared**.

## Change the auto-renewal setting
To learn more about modifying auto-renewal settings for a savings plan, see [change auto-renewal settings](manage-savings-plan.md#change-the-auto-renewal-setting).

## View savings plan reporting details
- To learn more about viewing savings plan utilization, see [view savings plan utilization](view-utilization.md).
- To learn more about viewing savings plan cost and usage, see [view savings plan cost and usage exports](utilization-cost-reports.md).
- To learn more about viewing savings plan transactions, see [view savings plan transactions](view-transactions.md).
- To learn more about viewing savings plan amortized costs, see [view amortized costs](../reservations/view-amortized-costs.md).

## Delegate savings plan RBAC roles
Users and groups who gain the ability to purchase, manage, or view savings plans via RBAC roles must do so from **Home** > **Savings plan**.

### Delegate the savings plan purchaser role to a specific subscription
To delegate the purchaser role to a specific subscription, and after you have elevated access:
1. Go to **Home** > **Savings plans** to see all savings plans that are in the tenant.
1. To make modifications to the savings plan, add yourself as an owner of the savings plan order by using **Access control (IAM)**.

### Delegate savings plan administrator, contributor, or reader roles to a specific savings plan
To delegate the administrator, contributor, or reader roles to a specific savings plan:
1. Go to **Home** > **Savings plans**.
1. Select the savings plan you want.
1. Select **Access control (IAM)** on the leftmost pane.
1. Select **Add**, and then select **Add role assignment** from the top navigation bar.

### Delegate savings plan administrator, contributor, or reader roles to all savings plans
[User Access administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) rights are required to grant RBAC roles at the tenant level. To get User Access administrator rights, follow the steps in [Elevate access steps](../../role-based-access-control/elevate-access-global-admin.md).

### Delegate the administrator, contributor, or reader role to all savings plans in a tenant
1. Go to **Home** > **Savings plans**.
1. Select **Role assignment** from the top navigation bar.

## Cancellations, exchanges and trade-ins
Unlike reservations, you can't cancel or exchange savings plans. You can trade-in select compute reservations for a savings plan. To learn more, visit [reservation trade-in](reservation-trade-in.md).

## Change Billing subscription
Currently, the billing subscription used for monthly payments of a savings plan cannot be changed.

## Transfer a savings plan
Although you can't cancel, exchange, or refund a savings plan, you can transfer it from one supported agreement to another. For more information about supported transfers, see [Azure product transfer hub](../manage/subscription-transfer.md#product-transfer-support).

## Savings plan notifications
Depending on how you pay for your Azure subscription, savings plan-related email notifications are sent to the following users in your organization. Savings plan notifications are sent for the following events:
- Purchase
- Scope change
- Upcoming expiration: 30 days before
- Expiration
- Renewal
- Cancellation

For customers with Enterprise Agreement subscriptions:
- Notifications are sent to Enterprise Agreement administrators and Enterprise Agreement notification contacts.
- The Azure RBAC owner of the savings plan receives all notifications.

For customers with Microsoft Customer Agreement subscriptions:
- The purchaser receives a purchase notification.
- The Azure RBAC owner of the savings plan receives all notifications.

For Microsoft Partner Agreement partners:
- Notifications are sent to the partner.

## Need help?
If you have Azure savings plan for compute questions, contact your account team or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide answers to expert support requests in English for questions about Azure savings plan for compute.

## Next steps

To learn more about Azure savings plans, see:

- [View savings plan utilization](utilization-cost-reports.md)
- [Cancellation policy](cancel-savings-plan.md)
- [Renew a savings plan](renew-savings-plan.md)
