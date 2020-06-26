---
title: Azure EA portal administration
description: This article explains the common tasks that an administrator accomplishes in the Azure EA portal.
author: bandersmsft
ms.author: banders
ms.date: 06/01/2020
ms.topic: conceptual
ms.service: cost-management-billing
ms.reviewer: boalcsva
---

# Azure EA portal administration

This article explains the common tasks that an administrator accomplishes in the Azure EA portal (https://ea.azure.com). The Azure EA portal is an online management portal that helps customers manage the cost of their Azure EA services. For introductory information about the Azure EA portal, see the [Get started with the Azure EA portal](ea-portal-get-started.md) article.

## Associate an account to a department

Enterprise Administrators can associate existing accounts to Departments under the enrollment.

### To associate an account to a department

1. Sign in to the Azure EA Portal as an enterprise administrator.
1. Select **Manage** on the left navigation.
1. Select **Department**.
1. Hover over the row with the account and select the pencil icon on the right.
1. Select the department from the drop-down menu.
1. Select **Save**.

## Department spending quotas

EA customers can set or change spending quotas for each department under an enrollment. The spending quota amount is set for the current commitment term. At the end of the current commitment term, the system will extend the existing spending quota to the next commitment term unless the values are updated.

The department administrator can view the spending quota but only the enterprise administrator can update the quota amount. The enterprise administrator and the department administrator and will receive notifications once quota has reached 50%, 75%, 90%, and 100%.

### Enterprise administrator to set the quota:

 1. Open the Azure EA Portal.
 1. Select **Manage** on the left navigation.
 1. Select the **Department** Tab.
 1. Select the Department.
 1. Select the pencil symbol on the Department Details section, or select the **+ Add Department** symbol to add a spending quota along with a new department.
 1. Under Department Details, enter a spending quota amount in the enrollment's currency in the Spending Quota $ box (must be greater than 0).
    - The Department Name and Cost Center can also be edited at this time.
 1. Select **Save**.

The department spending quota will now be visible in the Department List view under the Department tab. At the end of the current commitment, the Azure EA Portal will maintain the spending quotas for the next commitment term.

The department quota amount is independent of the current monetary commitment, and the quota amount and alerts apply only to first party usage. The department spending quota is for informational purposes only and doesn't enforce spending limits.

### Department administrator to view the quota:

1. Open the Azure EA Portal.
1. Select **Manage** on the left navigation.
1. Select the **Department** tab and view the Department List view with spending quotas.

If you're an indirect customer, cost features must be enabled by your channel partner.

## Enterprise user roles

The Azure EA portal helps you to administer your Azure EA costs and usage. There are three main roles in the Azure EA portal:

- EA admin
- Department administrator
- Account owner

Each role has a different level of access and authority.

For more information about user roles, see [Enterprise user roles](https://docs.microsoft.com/azure/billing/billing-ea-portal-get-started#enterprise-user-roles).

## Add an Azure EA account

The Azure EA account is an organizational unit in the Azure EA portal. It's used to administer subscriptions and it's also used for reporting. To access and use Azure services, you need to create an account or have one created for you.

For more information about Azure accounts, see [Add an account](https://docs.microsoft.com/azure/cost-management-billing/manage/ea-portal-get-started#add-an-account).

## Enterprise Dev/Test Offer

As an Azure enterprise administrator, you can enable account owners in your organization to create subscriptions based on the EA Dev/Test offer. To do so, select the Dev/Test box for the account owner in the Azure EA Portal.

Once you've checked the Dev/Test box, let the account owner know so that they can set up the EA Dev/Test subscriptions needed for their teams of Dev/Test subscribers.

The offer enables active Visual Studio subscribers to run development and testing workloads on Azure at special Dev/Test rates. It provides access to the full gallery of Dev/Test images including Windows 8.1 and Windows 10.

### To set up the Enterprise Dev/Test offer:

1. Sign in as the enterprise administrator.
1. Select **Manage** on the left navigation.
1. Select the **Account** tab.
1. Select the row for the account where you would like to enable Dev/Test access.
1. Select the pencil symbol to the right of the row.
1. Select the Dev/Test checkbox.
1. Select **Save**.

When a user is added as an account owner through the Azure EA Portal, any Azure subscriptions associated with the account owner that are based on either the PAYG Dev/Test offer or the monthly credit offers for Visual Studio subscribers will be converted to the EA Dev/Test offer. Subscriptions based on other offer types, such as PAYG, associated with the Account Owner will be converted to Microsoft Azure Enterprise offers.

The Dev/Test Offer isn't applicable to Azure Gov customers at this time.

## Delete subscription

To delete a subscription where you're the account owner:

1. Sign in to the Azure portal with the credentials associated to your account.
1. On the Hub menu, select **Subscriptions**.
1. In the subscriptions tab in the upper left corner of the page, select the subscription you want to cancel and select **Cancel Sub** to launch the cancel tab.
1. Enter the subscription name and choose a cancellation reason and select the **Cancel Sub** button.

Only account administrators can cancel subscriptions.

For more information, see [What happens after I cancel my subscription?](cancel-azure-subscription.md#what-happens-after-i-cancel-my-subscription).

## Delete an account

Account removal can only be completed for active accounts with no active subscriptions.

1. In the Enterprise portal, select **Manage** on the left navigation.
1. Select the **Account** tab.
1. From the Accounts table, select the Account you would like to delete.
1. Select the X symbol at the right of the Account row.
1. Once there are no active subscriptions under the account, select **Yes** under the Account row to confirm the Account removal.

## Update notification settings

Enterprise Administrators are automatically enrolled to receive usage notifications associated to their enrollment. Each Enterprise Administrator can change the interval of the individual notifications or can turn them off completely.

Notification contacts are shown in the Azure EA portal in the **Notification Contact** section. Managing your notification contacts makes sure that the right people in your organization get Azure EA notifications.

To View current notifications settings:

1. In the Azure EA portal, navigate to **Manage** > **Notification Contact**.
2. Email Address – The email address associated with the Enterprise Administrator's Microsoft Account, Work, or School Account that receives the notifications.
3. Unbilled Balance Notification Frequency – The frequency that notifications are set to send to each individual Enterprise Administrator.

To add a contact:

1. Select **+Add Contact**.
2. Enter the email address and then confirm it.
3. Select **Save**.

The new notification contact is displayed in the **Notification Contact** section. To change the notification frequency, select the notification contact and select the pencil symbol to the right of the selected row. Set the frequency to **daily**, **weekly**, **monthly**, or **none**.

You can suppress _approaching coverage period end date_ and _disable and de-provision date approaching_ lifecycle notifications. Disabling lifecycle notifications suppresses notifications about the coverage period and agreement end date.

## Azure sponsorship offer

The Azure sponsorship offer is a limited sponsored Microsoft Azure account. It's available by e-mail invitation only to limited customers selected by Microsoft. If you're entitled to the Microsoft Azure sponsorship offer, you'll receive an e-mail invitation to your account ID.

For more information, create a [support request for sponsorship activation](https://aka.ms/azrsponsorship).

## Conversion to work or school account authentication

Azure Enterprise users can convert from a Microsoft Account (MSA or Live ID) to a Work or School Account (which uses Active Directory in Azure) authentication type.

To begin:

1. Add the work or school account to the Azure EA Portal in the role(s) needed.
1. If you get errors, the account may not be valid in the active directory.  Azure uses User Principal Name (UPN), which isn't always identical to the email address.
1. Authenticate to the Azure EA portal using the work or school account.

### To convert subscriptions from Microsoft accounts to work or school accounts:

1. Sign in to the management portal using the Microsoft account that owns the subscriptions.
1. Use account ownership transfer to move to the new account.
1. Now the Microsoft account should be free from any active subscriptions and can be deleted.
1. Any deleted account will remain in view in the portal in an inactive status for historic billing reasons.  You can filter it out of the view by selecting a check box to show only active accounts.

## Account subscription ownership FAQ

This document answers commonly asked questions relating to account subscription ownership.

### How many Azure account owners can you have per subscription?

Only one account owner is permitted per subscription.  Additional roles can be added using Role-Based Access or (Access Control (IAM)) in the subscription tab in the upper left corner of the page on [portal.azure.com]](https://portal.azure.com).

### Can an Azure account owner be listed under more than one department?

No, an account owner can only be associated to a single department. The policy helps ensure accurate monitoring and apportioning of costs and spending associated to the department it's aligned with under the EA enrollment in the Azure EA Portal.

### Can an Azure account owner be listed as a security group?

No, a subscription owner must be a unique Microsoft account (MSA) or Azure active directory (AAD) authentication. To account for succession within your organization, you may consider creating generic accounts and using AAD to manage subscription access.

### Can an individual user own multiple subscriptions?

An Azure account owner can create and manage an unlimited number of subscriptions.

### How can I access/view all my organization's subscriptions?

Today this must be done by policy; meaning you would need to require that for every subscription created, your account is added to a subscription role using role-based access.

### Where do I go to create a subscription?

Before you can create an enterprise Azure (EA) offer subscription, your account must be added to the role of account owner by your EA enrollment's administrator in the Azure EA Portal. You'll then need to sign in to the Azure EA Portal to obtain your entitlement to create EA offer type subscriptions. We recommend that your first EA subscription is created from the '+ Add Subscription' link in the subscription tab on the EA Portal.  However, once your account is entitled it may be easier to create subscriptions in portal.azure.com in the subscription tab in the upper left corner of the page, where you can both create and rename your subscription in a single step.

### Who can create a subscription?

To create an enterprise Azure offer type subscription, you must be entitled in the role of account owner on the [EA portal](https://ea.azure.com).

## Next steps

- Read about how [virtual machine reservations](ea-portal-vm-reservations.md) can help save you money.
- If you need help with troubleshooting Azure EA portal issues, see [Troubleshoot Azure EA portal access](ea-portal-troubleshoot.md).
