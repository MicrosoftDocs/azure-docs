---
title: Cancel your Azure subscription
description: Describes how to cancel your Azure subscription, like the Free Trial subscription
author: bandersmsft
ms.reviewer: amberb
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 09/08/2022
ms.author: banders
---

# Cancel your Azure subscription

You can cancel your Azure subscription in the Azure portal if you no longer need it.

Although not required, Microsoft *recommends* that you take the following actions before you cancel your subscription:

* Back up your data. For example, if you're storing data in Azure storage or SQL, download a copy. If you have a virtual machine, save an image of it locally.
* Shut down your services. Go to the [resources page in the management portal](https://portal.azure.com/?flight=1#blade/HubsExtension/Resources/resourceType/Microsoft.Resources%2Fresources), and **Stop** any running virtual machines, applications, or other services.
* Consider migrating your data. See [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
* Delete all resources and all resource groups.
* If you have any custom roles that reference this subscription in `AssignableScopes`, you should update those custom roles to remove the subscription. If you try to update a custom role after you cancel a subscription, you might get an error. For more information, see [Troubleshoot problems with custom roles](../../role-based-access-control/troubleshooting.md#custom-roles) and [Azure custom roles](../../role-based-access-control/custom-roles.md).

> [!NOTE]
> After you cancel your subscription, you'll receive a final invoice for the usage that you incurred in the last billing cycle.

If you cancel a paid Azure Support plan, you're billed for the rest of the month. Cancelling a support plan doesn't result in a prorated refund. For more information, see [Azure support plans](https://azure.microsoft.com/support/plans/).

## Who can cancel a subscription?

The table below describes the permission required to cancel a subscription.

|Subscription type     |Who can cancel  |
|---------|---------|
|Subscriptions created when you sign up for Azure through the Azure website. For example, when you sign up for an [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/), [account with pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/) or as a [Visual studio subscriber](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/). |  Service administrator and subscription owner  |
|[Microsoft Enterprise Agreement](https://azure.microsoft.com/pricing/enterprise-agreement/) and [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/)     |  Service administrator and subscription owner       |
|[Azure plan](https://azure.microsoft.com/offers/ms-azr-0017g/) and [Azure plan for DevTest](https://azure.microsoft.com/offers/ms-azr-0148g/)     |  Owners of the subscription      |

An account administrator without the service administrator or subscription owner role can’t cancel an Azure subscription. However, an account administrator can make themself the service administrator and then they can cancel a subscription. For more information, see [Change the Service Administrator](../../role-based-access-control/classic-administrators.md#change-the-service-administrator).


## Cancel subscription in the Azure portal

1. Select your subscription from the [Subscriptions page in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).
1. Select the subscription that you want to cancel.
1. Select **Overview**, and then select **Cancel subscription**.
    ![Screenshot that shows the Cancel button](./media/cancel-azure-subscription/cancel_ibiza.png)
1. Follow prompts and finish cancellation.


## Cancel a support plan

If you purchased your support plan through the Azure website, Azure portal, or if you have one under a Microsoft Customer Agreement, you can cancel a support plan. If you purchased your support plan through a Microsoft representative or partner, contact them for assistance. 

### Cancel a support plan bought from the Azure portal

1. In the Azure portal, navigate to **Cost Management + Billing**.
1. On the Overview page, find your plan and then select it.
1. On the support plan page, select **Cancel**.
1. In the Cancel support window, verify that you want to cancel and select **Yes, cancel**.  
    :::image type="content" source="./media/cancel-azure-subscription/cancel-legacy-support-plan.png" alt-text="Screenshot showing the legacy Cancel support plan page." lightbox="./media/cancel-azure-subscription/cancel-legacy-support-plan.png" :::

### Cancel a support plan for a Microsoft Customer Agreement

1. In the Azure portal, navigate to **Cost Management + Billing**.
1. Under **Billing**, select **Recurring charges**.
1. On the right-hand side for the support plan line item, select the ellipsis (**...**) and select **Turn off auto-renewal**.

## What happens after subscription cancellation?

After you cancel, billing is stopped immediately. However, it can take up to 10 minutes for the cancellation to show in the portal. If you cancel in the middle of a billing period, we send the final invoice on your typical invoice date after the period ends.

After you cancel, your services are disabled. That means your virtual machines are de-allocated, temporary IP addresses are freed, and storage is read-only. Here's an example of the cancellation window.

:::image type="content" source="./media/cancel-azure-subscription/cancel-window.png" alt-text="Screenshot showing the cancellation window." lightbox="./media/cancel-azure-subscription/cancel-window.png" :::

After your subscription is canceled, Microsoft waits 30 - 90 days before permanently deleting your data in case you need to access it, or if you change your mind. We don't charge you for keeping the data. To learn more, see [Microsoft Trust Center - How we manage your data](https://go.microsoft.com/fwLink/p/?LinkID=822930&clcid=0x409).

## Delete subscriptions

The **Delete subscription** option isn't available until at least 15 minutes after you cancel your subscription.

1. Select your subscription on the [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) page in the Azure portal.
1. Select the subscription that you want to delete.
1. Select **Overview**, and then select **Delete subscription**.

All resources in the subscription are also deleted.

## Reactivate a subscription

If you cancel your subscription with Pay-As-You-Go rates accidentally, you can [reactivate it in the Azure portal](subscription-disabled.md).

If your subscription isn't a subscription with Pay-As-You-Go rates, contact support within 90 days of cancellation to reactivate your subscription.

## Why don't I see the Cancel Subscription option on the Azure portal? 

You may not have the permissions required to cancel a subscription. See [Who can cancel a subscription?](#who-can-cancel-a-subscription) for a description of who can cancel various types of subscriptions.

## How do I delete my Azure Account?

*I need to remove my account including all my personal information. I already canceled my active (Free Trial) subscriptions. I don't have any active subscriptions, and would like to totally delete my account*.

* If you have an Azure Active Directory account via your organization, the Azure AD administrator could delete the account. After that, your services are disabled. That means your virtual machines are de-allocated, temporary IP addresses are freed, and storage is read-only. In summary, once you cancel, billing is stopped immediately.

* If you don't have an Azure AD account via your organization, you can cancel then delete your Azure subscriptions and then remove your credit card from the account. While the action doesn't delete the account, it renders it inoperable. You can go a step further and also delete the associated Microsoft account if it's not being used for any other purpose.

## How do I cancel a Visual Studio Professional account?

See the [Renewal and Cancellation](/visualstudio/subscriptions/faq/admin/renewal-cancellation) article. If you have any Visual Studio Azure subscriptions, they need to be canceled and deleted as well.

## Next steps

- If needed, you can reactivate a pay-as-you-go subscription in the [Azure portal](subscription-disabled.md).
