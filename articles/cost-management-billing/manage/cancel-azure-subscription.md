---
title: Cancel your Azure subscription
description: Describes how to cancel your Azure subscription, like the Free Trial subscription
author: bandersmsft
ms.reviewer: sgautam
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 06/19/2023
ms.author: banders
---

# Cancel your Azure subscription

You can cancel your Azure subscription in the Azure portal if you no longer need it.

Although not required, Microsoft *recommends* that you take the following actions before you cancel your subscription:

* Back up your data. For example, if you're storing data in Azure storage or SQL, download a copy. If you have a virtual machine, save an image of it locally.
* Shut down your services. Go to the [All resources](https://portal.azure.com/?flight=1#blade/HubsExtension/Resources/resourceType/Microsoft.Resources%2Fresources) page, and **Stop** any running virtual machines, applications, or other services.
* Consider migrating your data. See [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
* Delete all resources and all resource groups.
    * To later manually delete a subscription, you must first delete all resources associated with the subscription.
    * You may be unable to delete all resources, depending on your configuration. For example, if you have immutable blobs. For more information, see [Immutable Blobs](../../storage/blobs/immutable-storage-overview.md#scenarios-with-version-level-scope).
* If you have any custom roles that reference this subscription in `AssignableScopes`, you should update those custom roles to remove the subscription. If you try to update a custom role after you cancel a subscription, you might get an error. For more information, see [Troubleshoot problems with custom roles](../../role-based-access-control/troubleshooting.md#custom-roles) and [Azure custom roles](../../role-based-access-control/custom-roles.md).

> [!NOTE]
> After you cancel your subscription, you'll receive a final invoice for the usage that you incurred in the last billing cycle.

If you cancel an Azure Support plan, you're billed for the rest of the month. Cancelling a support plan doesn't result in a prorated refund. For more information, see [Azure support plans](https://azure.microsoft.com/support/plans/).

Instead of canceling a subscription, you can remove all of its resources to [prevent unwanted charges](#prevent-unwanted-charges).

## Who can cancel a subscription?

The following table describes the permission required to cancel a subscription.

|Subscription type     |Who can cancel  |
|---------|---------|
|Subscriptions created when you sign up for Azure through the Azure website. For example, when you sign up for an [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/), [account with pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/) or as a [Visual studio subscriber](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/). |  Service administrator and subscription owner  |
|[Microsoft Enterprise Agreement](https://azure.microsoft.com/pricing/enterprise-agreement/) and [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/)     |  Service administrator and subscription owner       |
|[Azure plan](https://azure.microsoft.com/offers/ms-azr-0017g/) and [Azure plan for DevTest](https://azure.microsoft.com/offers/ms-azr-0148g/)     |  Subscription owners      |

An account administrator without the service administrator or subscription owner role can’t cancel an Azure subscription. However, an account administrator can make themself the service administrator and then they can cancel a subscription. For more information, see [Change the Service Administrator](../../role-based-access-control/classic-administrators.md#change-the-service-administrator).

## Cancel a subscription in the Azure portal

Depending on your environment, the cancel subscription experience allows you to cancel a subscription, turn off autorenewal for an associated support plan, and stop all Azure subscription resources.

If you have a support plan associated with the subscription, it's shown in the cancellation process. Otherwise, it isn't shown.

If you have any Azure resources associated with the subscription, they're shown in the cancellation process. Otherwise, they're not shown.

A subscription owner can navigate in the Azure portal to **Subscriptions** and then start at step 3.

1. In the Azure portal, navigate to **Cost Management + Billing**.
1. In the left menu, select either **Subscriptions** or **Azure subscriptions**, depending on which is available to you. If you have a support plan, it's shown in the list.
1. Select the subscription that you want to cancel.
1. At the top of page, select **Cancel**.
1. If you have any resources associated with the subscription, they're shown on the page. At the top of the page, select **Cancel subscription**.
    :::image type="content" source="./media/cancel-azure-subscription/cancel-subscription.png" alt-text="Screenshot showing the subscription properties where you select Cancel subscription." lightbox="./media/cancel-azure-subscription/cancel-subscription.png" :::
1. Select a reason for cancellation.
1. If you have a support plan and no other subscriptions use it, select **Turn off auto-renew**. If other subscriptions use the support plan, clear the option.
1. If you have any running resources associated with the subscription, you must select **Turn off resources**. Ensure that you already backed up any data that you want to keep.
1. Select **Cancel subscription**.  
    :::image type="content" source="./media/cancel-azure-subscription/cancel-subscription-final.png" alt-text="Screenshot showing the Cancel subscription window options." lightbox="./media/cancel-azure-subscription/cancel-subscription-final.png" :::

After the subscription is canceled, a notification shows that the cancellation is complete. If you have any outstanding charges that haven't been invoiced yet, their estimated charges are shown. If you have any outstanding credits that aren't yet applied to your invoice, the estimated credits that apply to your invoice are shown. For more information about data update frequency, see [Cost and usage data updates and retention](../costs/understand-cost-mgt-data.md#cost-and-usage-data-updates-and-retention).

:::image type="content" source="./media/cancel-azure-subscription/cancel-complete.png" alt-text="Screenshot showing that subscription cancellation status." lightbox="./media/cancel-azure-subscription/cancel-complete.png" :::

> [!NOTE]
> Partners can suspend or cancel a subscription if requested by a customer or in cases of nonpayment or fraud. For more information, see [Suspend or cancel a subscription](/partner-center/create-a-new-subscription#suspend-or-cancel-a-subscription).

## What happens after subscription cancellation?

After you cancel, billing is stopped immediately. However, it can take up to 10 minutes for the cancellation to show in the portal. If you cancel in the middle of a billing period, we send the final invoice on your typical invoice date after the period ends.

After you cancel, your services are disabled. That means your virtual machines are deallocated, temporary IP addresses are freed, and storage is read-only. Here's an example of the cancellation window.

:::image type="content" source="./media/cancel-azure-subscription/cancel-window.png" alt-text="Screenshot showing the cancellation window." lightbox="./media/cancel-azure-subscription/cancel-window.png" :::

After your subscription is canceled, Microsoft waits 30 - 90 days before permanently deleting your data in case you need to access it, or if you want to reactivate the subscription. We don't charge you for keeping the data. To learn more, see [Microsoft Trust Center - How we manage your data](https://go.microsoft.com/fwLink/p/?LinkID=822930&clcid=0x409).

>[!NOTE]
> You must manually cancel your SaaS subscriptions before you cancel your Azure subscription. Only pay-as-you-go SaaS subscriptions are cancelled automatically by the Azure subscription cancellation process.

## Delete subscriptions

The **Delete subscription** option isn't available until at least 15 minutes after you cancel your subscription.

Depending on your subscription type, you may not be able to delete a subscription immediately.

1. Select your subscription on the [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) page in the Azure portal.
1. Select the subscription that you want to delete.
1. At the top of the subscription page, select **Delete**.  
    :::image type="content" source="./media/cancel-azure-subscription/delete-option.png" alt-text="Screenshot showing the Delete option." lightbox="./media/cancel-azure-subscription/delete-option.png" :::
1. If necessary, type the name of the subscription and then select **Delete**.
    - When all required conditions are met, you can delete the subscription.  
    :::image type="content" source="./media/cancel-azure-subscription/type-name-delete.png" alt-text="Screenshot showing where you type the subscription name and Delete." lightbox="./media/cancel-azure-subscription/type-name-delete.png" :::
    - If you have required deletion conditions that aren't met, the following page is shown.  
      :::image type="content" source="./media/cancel-azure-subscription/manual-delete-subscription.png" alt-text="Screenshot showing the Delete your subscription page." lightbox="./media/cancel-azure-subscription/manual-delete-subscription.png" :::
      - If **Delete resources** doesn't display a green check mark, then you have resources that must be deleted in order to delete the subscription. You can select **View resources** to navigate to the Resources page to manually delete the resources. After resource deletion, you might need to wait 10 minutes for resource deletion status to update in order to delete the subscription.
      - If **Manual deletion date** doesn't display a green check mark, you must wait the required period before you can delete the subscription.  

>[!NOTE]
> - The subscription is automatically deleted 90 days after you cancel a subscription.
> - If you have deleted all resources but the Delete your subscription page shows that you still have active resources, you might have active *hidden resources*. You can't delete a subscription if you have active hidden resources. To delete them, navigate to **Subscriptions** > select the subscription > **Resources**. At the top of the page, select **Manage view** and then select **Show hidden types**. Then, delete the resources.

## Prevent unwanted charges

To prevent unwanted charges on a subscription, you can go to **Resources** menu for the subscription and select the resources that you want to delete. If don't want to have any charges for the subscription, select all of the subscription resources and then **Delete** them. The subscription essentially becomes an empty container with no charges.

:::image type="content" source="./media/cancel-azure-subscription/delete-resources.png" alt-text="Screenshot showing delete resources." lightbox="./media/cancel-azure-subscription/delete-resources.png" :::

If you have a support plan, you might continue to get charged for it. To delete a support a plan, navigate to **Cost Management + Billing** and select **Recurring charges**. Select the support plan and turn off autorenewal.

:::image type="content" source="./media/cancel-azure-subscription/change-renewal-settings.png" alt-text="Screenshot showing Change renewal settings." lightbox="./media/cancel-azure-subscription/change-renewal-settings.png" :::

## Reactivate a subscription

If you cancel your subscription with Pay-As-You-Go rates accidentally, you can [reactivate it in the Azure portal](subscription-disabled.md).

If your subscription isn't a subscription with Pay-As-You-Go rates, contact support within 90 days of cancellation to reactivate your subscription.

## Why don't I see the Cancel Subscription option on the Azure portal? 

You may not have the permissions required to cancel a subscription. See [Who can cancel a subscription?](#who-can-cancel-a-subscription) for a description of who can cancel various types of subscriptions.

## How do I delete my Azure Account?

*I need to remove my account including all my personal information. I already canceled my active (Free Trial) subscriptions. I don't have any active subscriptions, and would like to totally delete my account*.

* If you have a Microsoft Entra account via your organization, the Microsoft Entra administrator could delete the account. After that, your services are disabled. That means your virtual machines are deallocated, temporary IP addresses are freed, and storage is read-only. In summary, once you cancel, billing is stopped immediately.

* If you don't have a Microsoft Entra account via your organization, you can cancel then delete your Azure subscriptions, and then remove your credit card from the account. While the action doesn't delete the account, it renders it inoperable. You can go a step further and also delete the associated Microsoft account if it's not being used for any other purpose.

## How do I cancel a Visual Studio Professional account?

See the [Renewal and Cancellation](/visualstudio/subscriptions/faq/admin/renewal-cancellation) article. If you have any Visual Studio Azure subscriptions, they need to be canceled and deleted as well.

## Next steps

- If needed, you can reactivate a pay-as-you-go subscription in the [Azure portal](subscription-disabled.md).
