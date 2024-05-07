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
- Update savings plan scope
- Change auto-renewal settings
- View savings plan details and utilization
- Delegate savings plan RBAC roles
Except for auto-renewal, none of the changes cause a new commercial transaction or change the end date of the savings plan.

You can't make the following types of changes after purchase:
- Hourly commitment
- Term length
- Billing frequency

To learn more, visit [savings plan permissions](permission-view-manage.md).
_Permission needed to manage a savings plan is separate from subscription permission._


## Change the savings plan scope
Your hourly savings plan benefit is automatically to usage from savings plan-eligible resources that run in the savings plan's benefit scope. To learn more, visit [savings plan scopes](scope-savings-plan.md).
Changing a savings plan's benefit scope doesn't alter the savings plan's term.

To update a savings plan scope as a billing administrator:
1. Sign in to the Azure portal and navigate to **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're an MCA billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
2. In the left menu, select **Products + services** > **Savings plans**. The list of savings plans for your EA enrollment or billing profile is shown.
3. Select the desired savings plan.
4. Select **Settings** > **Configuration**.
5. Change the scope.

If you purchased a savings plan, have been added to a savings plan, or have been assigned one or more savings plan RBAC roles, use the following steps to update a savings plan scope:
1. Sign in to the Azure portal.
2. Select All Services > Savings plans to list savings plans that you have access to.
3. Select the desired savings plan.
4. Select **Settings** > **Configuration**.
5. Change the scope.

Selectable scopes must be from Enterprise offers (MS-AZR-0017P or MS-AZR-0148P),  Microsoft Customer Agreements, and Microsoft Partner Agreements.
If you are not a billing administrator and you change from shared to single scope, you may only select a subscription where you're the owner. Only subscriptions within the same billing account/profile as the savings plan can be selected. 
If all subscriptions are moved out of a management group, the scope of the savings plan is automatically changed to **Shared**.


## Change auto-renewal setting
To update auto-renewal setting as a billing administrator:
1. Sign in to the Azure portal and navigate to **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're an MCA billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
2. In the left menu, select **Products + services** > **Savings plans**. The list of savings plans for your EA enrollment or billing profile is shown.
3. Select the desired savings plan.
4. Select **Settings** > **Renewal**.

If you purchased a savings plan, have been added to a savings plan, or have been assigned one or more savings plan RBAC roles, use the following steps to update auto-renewal setting:
1. Sign in to the Azure portal.
2. Select All Services > Savings plans to list savings plans that you have access to.
3. Select the desired savings plan.
4. Select **Settings** > **Renewal**.


## View savings plan details and utilization
To view as a billing administrator:
If you're a billing administrator, use following steps to view and manage all savings plans and savings plan orders in the Azure portal:
1. Sign in to the Azure portal and navigate to **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're an MCA billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
2. In the left menu, select **Products + services** > **Savings plans**. The list of savings plans for your EA enrollment or billing profile is shown.
3. Select the desired savings plan.
4. To rename the savings plan, click "Rename". To view payment history or upcoming payments, click the link to the right of "Billing frequency".

If you purchased a savings plan, have been added to a savings plan, or have been assigned one or more savings plan RBAC roles, use the following steps to view savings plan details and utilization:
1. Sign in to the Azure portal.
2. Select All Services > Savings plans to list savings plans that you have access to.
3. Select the desired savings plan.
4. To rename the savings plan, click "Rename". To view payment history or upcoming payments, click the link to the right of "Billing frequency".


## Delegate savings plan RBAC roles 
Users and groups who gain the ability to purchase, manage, or view savings plans via RBAC roles, must do so from **Home** > **Savings plan**.
### Delegate Savings plan Purchaser role to specific subscription
To delegate the Purchaser role to a specific subscription:
1.	Navigate to **Home** > **Subscriptions**
2.	Select the desired subscription
3.	Select **Access control (IAM)** from the left navigation bar
4.	Click **Add**, then **Add role assignment** from the top navigation bar

### Delegate Savings plan Administrator, Contributor or Reader role to a specific savings plan
To delegate the Administrator, Contributor, or Reader role to a specific savings plan:
1.	Navigate to **Home** > **Savings plans**
2.	Select the desired savings plan
3.	Select **Access control (IAM)** from the left navigation bar
4.	Click **Add**, then **Add role assignment** from the top navigation bar

### Delegate Savings plan Administrator, Contributor or Reader role to all savings plans
[User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) rights are required to grant RBAC roles at the tenant level. To get User Access Administrator rights, follow [Elevate access steps](../../role-based-access-control/elevate-access-global-admin.md).

After you have elevated access:
1. Navigate to **Home** > **Savings plans** to see all savings plans that are in the tenant.
2. To make modifications to the savings plan, add yourself as an owner of the savings plan order using Access control (IAM).


## Cancel, exchange, or refund
You can't cancel, exchange, or refund savings plans. 

## Transfer savings plan
Although you can't cancel, exchange, or refund a savings plan, you can transfer it from one supported agreement to another. For more information about supported transfers, see [Azure product transfer hub](../manage/subscription-transfer.md#product-transfer-support).


## Need help? Contact us.
If you have Azure savings plan for compute questions, contact your account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

To learn more about Azure Savings plan, see the following articles:
- [View saving plan utilization](utilization-cost-reports.md)
- [Cancellation policy](cancel-savings-plan.md)
- [Renew a savings plan](renew-savings-plan.md)
