---
title: Keep your Microsoft business billing account active
description: Learn about billing account dormancy and how you can keep and maintain an active billing account.
author: mijeffer
ms.reviewer: mijeffer
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: concept-article
ms.date: 07/15/2026
ms.author: mijeffer
service.tree.id: 84a24b9c-ce0c-4b4b-b837-45bc5ee4bef0
---

# Keep your Microsoft business billing account active

If a billing account is unused for a certain amount of time, it's classified as *inactive*. An inactive billing account can increase potential security risks to that account and the resources it contains. To reduce this risk, Microsoft takes measures to secure, protect, and ultimately delete inactive billing accounts, tenants, and subscriptions within them.

This article applies to the following agreements:

- Microsoft Customer Agreement (MCA)
- Microsoft Online Subscription Agreement (MOSA)
- Cloud Solution Provider (CSP)
- Enrollment for Education Solutions (EES)

## What is an inactive billing account?

A billing account is considered inactive when the following criteria are met in a minimum of a 12-month period:

- No usage within the billing account, tenant, or subscription
- No sign-in activity within the billing account, tenant, or subscription
- No open or pending support requests

When a billing account meets all these criteria, you receive a notification from Microsoft that says that your inactive billing account will be blocked in 30 days.

> [!IMPORTANT]
> If your billing account remains inactive for 30 days after the notification, we block it.

## How do I keep my billing account active?

If you use your billing account within 30 days of receiving the notification, your account returns to its active state and is no longer subject to getting blocked. The following list includes examples of activities and account usage that keep your billing account active:

- Using a product or a service
- Generating metered usage
- Creating a support ticket

## What happens if my billing account is blocked?

When your billing account is blocked, you can no longer perform certain actions, like adding new subscriptions and transferring existing subscriptions. To unblock your billing account and return it to its active state, use the following criteria to contact support for help:

- If you bought your subscription directly from Microsoft, [contact Microsoft support](/azure/azure-portal/supportability/how-to-create-azure-support-request). 
- If you're a Partner or Enterprise customer, contact your partner or account manager.

**If you have a billing account with a prepaid subscription set to auto-renew:** After your billing account is blocked, if no action is taken, you receive a notification of tenant deauthorization. This step can be avoided or reversed within the allowed timeframe specified in the notification. Subscription usage isn't affected until a lifecycle management event occurs, like when a payment method expires. At that time, subscriptions might expire and be deleted, followed by billing account expiration and deletion.

**All other customers:** After your billing account is blocked, if no action is taken, subscription suspension, tenant deauthorization, and account termination might occur. Before each step is implemented, you receive a notification that contains the details and timeframe for that specific step. Each step can be avoided or reversed within the allowed time by contacting the support channels listed in this section.

> [!WARNING]
> You can avoid account termination, but after it occurs, it's not reversible. If no action is taken within the notification period, your billing account is terminated, and any data and resources associated with the billing account are permanently deleted and can't be recovered.

## Lock, re-enable, or delete your MCA billing account

You can manage the lifecycle of your Azure billing account in the Azure portal. This feature lets you lock the account to stop new purchases, re-enable it if you change your mind, and permanently delete it when you're ready. Locking a billing account is reversible. Deleting a billing account is permanent and can't be undone. 

### Who can lock or delete a billing account

Billing account owners can lock, re-enable, or delete a billing account.

### Lock and delete eligibility 
Before you can lock or delete your billing account, it must meet specific eligibility requirements. 

#### Eligibility to lock your billing account 
You can lock your billing account if all of the following conditions are true: 

- Your account uses a direct purchase context (not a reseller, partner, or indirect relationship). 

- Your account is a business account.

- Your account isn't an Enterprise Agreement (EA) enrollment. 

- Your account doesn't have active government contracts. 

- Your account isn't affiliated with a Cloud Solution Provider (CSP) partner. 

 

The following table lists conditions that make a billing account **ineligible** to lock: 


| Scenario| Eligibility |
| -------- | -------- |
| Partner affiliation (CSP, distributor, or reseller)  | Not eligible for self-service   |
| Government contract (GCC, GCC High, DOD)  | Not eligible for self-service   |
| Enterprise Agreement (EA) enrollment | Not eligible for self-service |
| Trade restriction | Resolve trade compliance restrictions before locking |
| Non-payment suspension | Pay any outstanding invoices to remove the suspension, then lock the account |


#### Eligibility to delete your billing account 

Your billing account must be in the **Locked** state before you can delete it. In addition, all of the following conditions must be true for each billing profile associated with the account: 


| Requirement | How to resolve |
| -------- | -------- |
| No active subscriptions   | Cancel all subscriptions. In the Azure portal, go to **Subscriptions** to manage them.   |
| No outstanding invoices   | Pay all invoices with a remaining balance. Go to **Cost Management + Billing** > **Invoices** to pay.   |
| No unbilled charges | Wait for the current billing cycle to close before proceeding. |
| No payment instruments attached | Detach the default payment instrument from the billing group.|
| No reserved instances | Cancel or allow all active reservations to expire. For more information, see [Exchange and refund Azure Reservations](../reservations/exchange-and-refund-azure-reservations.md). |
| No active Azure credits | Credits must be consumed or expired before the account can be deleted. |
| No Microsoft Entra tenant assets | Transfer or remove your Microsoft Entra tenant before deleting the billing account. For more information, see [Transfer an Azure subscription to a different Microsoft Entra directory](../../role-based-access-control/transfer-subscription.md). |


> [!IMPORTANT] 
> Deleting a billing account is permanent. All billing history, payment records, and account access are removed and can't be recovered. Download any invoices you want to keep before you proceed. 

> [!WARNING] 
> If your billing account is the only billing account associated with your Microsoft Entra tenant, deleting the billing account also queues the tenant for deletion. All users who sign in with that domain lose access when the tenant is deleted. To keep the tenant, transfer your Entra subscription to another billing account before you delete this one. For more information, see [Transfer an Azure subscription to a different Microsoft Entra directory](../../role-based-access-control/transfer-subscription.md). 

 

### Lock your billing account 

 

When you lock your billing account, you block new purchases and subscription creation. Existing subscriptions stay active and keep accruing charges. You can re-enable the account any time before you request deletion.  

Billing account owners receive an email notification when the account is locked.  

**To lock your billing account:** 


1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Search for **Cost Management + Billing** and select it. 

1. In the left menu, select **Billing scopes**. 

1. Select the billing account you want to lock. 

1. On the billing account properties page, select **Lock account**. 

1. Review the information in the panel, then select **Lock account** to confirm. 


The account status changes to **Locked**. 

> [!NOTE]
> Locking your billing account doesn't cancel your existing Azure subscriptions. They remain active and continue to accrue charges until you cancel them individually. For more information, see [Cancel your Azure subscription](../manage/cancel-azure-subscription.md). 



### Re-enable your billing account 

 

You can re-enable a locked billing account any time before you request deletion. Re-enabling the account restores its active state and allows new purchases.  


**To re-enable your billing account:**  

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Search for **Cost Management + Billing** and select it. 

1. In the left menu, select **Billing scopes**. 

1. Select the locked billing account. 

1. On the billing account properties page, select **Enable account**. 

1. In the **Re-enable billing account** panel, review the account name and confirm the details, then select **Re-enable account**. 

 

The account status changes to **Active**. All purchasing capabilities are immediately restored, and your previous cancellation intent is cleared. 


### Delete your billing account 

Deleting a billing account is permanent. Before you proceed, make sure the account is locked and all eligibility requirements are met.

Before you start, we recommend that you download all invoices you want to keep. Invoices aren't accessible after the account is deleted. 
 

**To delete your billing account:** 

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Search for **Cost Management + Billing** and select it. 

1. In the left menu, select **Billing scopes**. 

1. Select the locked billing account you want to delete. 

1. On the billing account properties page, select **Delete account**. 

1. **Eligibility check**: If the check finds active billing profiles with an attached payment instrument, the experience redirects to the billing profile list to walk through the **Detach payment instrument** experience. Select the provided link to resolve it, and then return to this page. When all billing profiles are disabled, other checks include:

   1. No reserved instances or active credits 
      
   1. No Microsoft Entra tenant assets 
   
1. Select **Next**.

1. **Review actions**: Review a summary of what is removed. If this billing account is the only billing account for your Microsoft Entra tenant, a warning appears indicating that the tenant is also queued for deletion.

1. Select **Next**.

1. **Confirm deletion**: Read the confirmation statement, select the checkbox to acknowledge that this action is permanent and can't be reversed, then select **Delete account**. 


> [!IMPORTANT]
> After you confirm deletion, you can't access the billing account or any associated billing history. This action can't be reversed.

## Related content

- [Understand your Microsoft business billing account](mca-overview.md)
- [Manage your Microsoft business billing profiles](mca-overview.md#billing-profiles)

- [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request) 
