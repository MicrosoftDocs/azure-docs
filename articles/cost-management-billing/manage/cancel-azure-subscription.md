---
title: Cancel and delete your Azure subscription
description: Describes how to cancel or deleted your Azure subscription, like the Free Trial subscription.
author: bandersmsft
ms.reviewer: tomasa
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 03/12/2024
ms.author: banders
---

# Cancel and delete your Azure subscription

You can cancel your Azure subscription in the Azure portal if you no longer need it.

Although not required, Microsoft *recommends* that you take the following actions before you cancel your subscription:

* Back up your data. For example, if you're storing data in Azure storage or SQL, download a copy. If you have a virtual machine, save an image of it locally.
* Shut down your services. Go to the [All resources](https://portal.azure.com/?flight=1#blade/HubsExtension/Resources/resourceType/Microsoft.Resources%2Fresources) page, and **Stop** any running virtual machines, applications, or other services.
* Consider migrating your data. See [Move resources to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).
* Delete all resources and all resource groups.
    * To later manually delete a subscription, you must first delete all resources associated with the subscription.
    * You might be unable to delete all resources, depending on your configuration. For example, if you have immutable blobs. For more information, see [Immutable Blobs](../../storage/blobs/immutable-storage-overview.md#scenarios-with-version-level-scope).
* If you have any custom roles that reference this subscription in `AssignableScopes`, you should update those custom roles to remove the subscription. If you try to update a custom role after you cancel a subscription, you might get an error. For more information, see [Troubleshoot problems with custom roles](../../role-based-access-control/troubleshooting.md#custom-roles) and [Azure custom roles](../../role-based-access-control/custom-roles.md).

Instead of canceling a subscription, you can remove all of its resources to [prevent unwanted charges](../understand/plan-manage-costs.md#prevent-unwanted-charges).

> [!NOTE]
> After you cancel your last Azure subscription, you can delete it after all required conditions are met.

## Final charges and last bill

After you cancel your final subscription, Azure closes your current billing cycle within 72 hours, or three calendar days. When the billing cycle ends, you receive your final invoice (bill) for the usage you incurred in the last billing cycle. In other words, you might not get your final bill on the same day that you cancel your final subscription. Instead, you could get your final bill up to three days after you cancel your subscription.

The following examples illustrate how billing periods could end:

- Enterprise Agreement (EA) subscriptions – If the billing month ends on March 31, estimated charges are updated up to 72 hours later. In this example, by midnight (UTC) April 4.
- Pay-as-you-go subscriptions – If the billing month ends on May 15, then the estimated charges might get updated up to 72 hours later. In this example, by midnight (UTC) May 19.

After your pay your final bill, keep the following points in mind.

- Azure doesn’t immediately delete your data. Data is preserved temporarily in case you decide to reactivate your subscription later. Azure doesn't charge you for data that is temporarily kept.
- Azure doesn't immediately delete the subscription.
- Azure never automatically deletes your Azure account. If you want to delete your Azure account, see [How do I delete my Azure account](#how-do-i-delete-my-azure-account).

If you cancel an Azure Support plan, you're billed for the rest of the month. Cancelling a support plan doesn't result in a prorated refund. For more information, see [Azure support plans](https://azure.microsoft.com/support/plans/).

## Who can cancel a subscription?

- If you’re not sure what type of subscription you have, see [Check your account type](view-all-accounts.md#check-the-type-of-your-account). 
- If you don’t have permission to cancel your subscription, contact the person in your organization that does have permission to cancel the subscription.

The following table describes the permission required to cancel a subscription.

|Subscription type     |Who can cancel  |
|---------|---------|
|Subscriptions created when you sign up for Azure through the Azure website. For example, when you sign up for an [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/), [account with pay-as-you-go rates](https://azure.microsoft.com/offers/ms-azr-0003p/) or as a [Visual studio subscriber](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/). |  Service administrator and subscription owner  |
|[Microsoft Enterprise Agreement](https://azure.microsoft.com/pricing/enterprise-agreement/) and [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/)     |  Service administrator and subscription owner       |
|[Azure plan](https://azure.microsoft.com/offers/ms-azr-0017g/) and [Azure plan for DevTest](https://azure.microsoft.com/offers/ms-azr-0148g/)     |  Subscription owners      |

An account administrator without the service administrator or subscription owner role can’t cancel an Azure subscription. However, an account administrator can make themself the service administrator and then they can cancel a subscription. For more information, see [Change the Service Administrator](../../role-based-access-control/classic-administrators.md#change-the-service-administrator).

## Cancel a subscription in the Azure portal

Depending on your environment, the subscription cancellation experience allows you to:

- Cancel a subscription
- Turn off autorenewal for an associated support plan
- Stop all Azure subscription resources 

If you have a support plan associated with the subscription, it appears in the cancellation process. Otherwise, it isn't shown.

If you have any Azure resources associated with the subscription, they're shown in the cancellation process. Otherwise, they're not shown.

Depending on your environment, you can cancel an Azure support plan with the following these steps:

1. Navigate to the Cost management + Billing Overview page.
1. Select the support plan that you want to cancel from the **Your subscriptions** page to open up the Support plan page.
1. Select **Cancel** to cancel your support plan.

A subscription owner can navigate in the Azure portal to **Subscriptions** and then start at step 3.

1. In the Azure portal, navigate to **Cost Management + Billing**.
1. In the left menu, select either **Subscriptions** or **Azure subscriptions**, depending on which is available to you. If you have a support plan, it appears in the list.
1. Select the subscription that you want to cancel.
1. At the top of page, select **Cancel**.
1. If you have any resources associated with the subscription, they're shown on the page. At the top of the page, select **Cancel subscription**.
    :::image type="content" source="./media/cancel-azure-subscription/cancel-subscription.png" alt-text="Screenshot showing the subscription properties where you select Cancel subscription." lightbox="./media/cancel-azure-subscription/cancel-subscription.png" :::
1. Select a reason for cancellation.
1. If you have a support plan and no other subscriptions use it, select **Turn off auto-renew**. If other subscriptions use the support plan, clear the option.
1. If you have any running resources associated with the subscription, you must select **Turn off resources**. Ensure that you already backed up any data that you want to keep.
1. Select **Cancel subscription**.  
    :::image type="content" source="./media/cancel-azure-subscription/cancel-subscription-final.png" alt-text="Screenshot showing the Cancel subscription window options." lightbox="./media/cancel-azure-subscription/cancel-subscription-final.png" :::

After the subscription is canceled, a notification shows that the cancellation is complete. 

If you have any outstanding charges that aren't invoiced yet, their estimated charges are shown. As described previously, you get a final bill at the end of your billing cycle.

If you have any outstanding credits that aren't yet applied to your invoice, the estimated credits that apply to your invoice are shown. For more information about data update frequency, see [Cost and usage data updates and retention](../costs/understand-cost-mgt-data.md#cost-and-usage-data-updates-and-retention).

The following example shows that credits were applied and pending estimated charges. In this example, the final bill is estimated at USD 50.50.

:::image type="content" source="./media/cancel-azure-subscription/cancel-complete.png" alt-text="Screenshot showing that subscription cancellation status." lightbox="./media/cancel-azure-subscription/cancel-complete.png" :::

> [!NOTE]
> Partners can suspend or cancel a subscription if requested by a customer or in cases of nonpayment or fraud. For more information, see [Suspend or cancel a subscription](/partner-center/create-a-new-subscription#suspend-or-cancel-a-subscription).

## What happens after subscription cancellation?

After you cancel, billing is stopped immediately. However, it can take up to 10 minutes for the cancellation to show in the portal. If you cancel in the middle of a billing period, we send the final invoice on your typical invoice date after the period ends.

After you cancel, your services are disabled. That means your virtual machines are deallocated, temporary IP addresses are freed, and storage is read-only. Here's an example of the cancellation window.

:::image type="content" source="./media/cancel-azure-subscription/cancel-window.png" alt-text="Screenshot showing the cancellation window." lightbox="./media/cancel-azure-subscription/cancel-window.png" :::

After you cancel a subscription, your billing stops immediately. You can delete your subscription directly using the Azure portal seven days after you cancel it, when the **Delete subscription** option becomes available. When your subscription is cancelled, Microsoft waits 30 to 90 days before permanently deleting your data in case you need to access it or recover your data. We don't charge you for retaining the data. For more information, see [Microsoft Trust Center - How we manage your data](https://go.microsoft.com/fwLink/p/?LinkID=822930).

>[!NOTE]
> You must manually cancel your SaaS subscriptions before you cancel your Azure subscription. Only pay-as-you-go SaaS subscriptions are cancelled automatically by the Azure subscription cancellation process.

## Delete subscriptions

The **Delete subscription** option isn't available until at least 15 minutes after you cancel your subscription.

Depending on your subscription type, you might not be able to delete a subscription immediately.

1. Select your subscription on the [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) page in the Azure portal.
1. Select the subscription that you want to delete.
1. At the top of the subscription page, select **Delete**.  
    :::image type="content" source="./media/cancel-azure-subscription/delete-option.png" alt-text="Screenshot showing the option to Delete." lightbox="./media/cancel-azure-subscription/delete-option.png" :::
1. If necessary, type the name of the subscription and then select **Delete**.
    - When all required conditions are met, you can delete the subscription.  
    :::image type="content" source="./media/cancel-azure-subscription/type-name-delete.png" alt-text="Screenshot showing where you type the subscription name and Delete." lightbox="./media/cancel-azure-subscription/type-name-delete.png" :::
    - If there are required deletion conditions, but they aren't met, the following page is shown.  
      :::image type="content" source="./media/cancel-azure-subscription/manual-delete-subscription.png" alt-text="Screenshot showing the Delete your subscription page." lightbox="./media/cancel-azure-subscription/manual-delete-subscription.png" :::
      - If **Delete resources** doesn't display a green check mark, then you have resources that must be deleted in order to delete the subscription. You can select **View resources** to navigate to the Resources page to manually delete the resources. After resource deletion, you might need to wait 10 minutes for resource deletion status to update in order to delete the subscription.
      - If **Manual deletion date** doesn't display a green check mark, you must wait the required period before you can delete the subscription.  

>[!NOTE]
> - The subscription is automatically deleted 90 days after you cancel a subscription.
> - You can also contact Microsoft Support to help you remove a subscription. However you must make sure that you don't need the subscription anymore because the process only allows seven days to reactivate the subscription.
> - If you have deleted all resources but the Delete your subscription page shows that you still have active resources, you might have active *hidden resources*. You can't delete a subscription if you have active hidden resources. To delete them, navigate to **Subscriptions** > select the subscription > **Resources**. At the top of the page, select **Manage view** and then select **Show hidden types**. Then, delete the resources.

## Reactivate a subscription

If you cancel your subscription with pay-as-you-go rates accidentally, you can [reactivate it in the Azure portal](subscription-disabled.md).

If your subscription isn't a subscription with pay-as-you-go rates, contact support within 90 days of cancellation to reactivate your subscription.

## Why don't I see the Cancel Subscription option on the Azure portal? 

You don't have the permissions required to cancel a subscription. See [Who can cancel a subscription](#who-can-cancel-a-subscription) for a description of who can cancel various types of subscriptions.

## How do I delete my Azure Account?

*I need to remove my account including all my personal information. I already canceled my active (Free Trial) subscriptions. I don't have any active subscriptions, and would like to totally delete my account*.

* If you have a Microsoft Entra account via your organization, the Microsoft Entra administrator could delete the account. After that, your services are disabled. That means your virtual machines are deallocated, temporary IP addresses are freed, and storage is read-only. In summary, once you cancel, billing is stopped immediately.

* If you don't have a Microsoft Entra account via your organization, you can cancel then delete your Azure subscriptions, and then remove your credit card from the account. While the action doesn't delete the account, it renders it inoperable. You can go a step further and also delete the associated Microsoft account if it's not being used for any other purpose.

## How do I cancel a Visual Studio Professional account?

See the [Renewal and Cancellation](/visualstudio/subscriptions/faq/admin/renewal-cancellation) article. If you have any Visual Studio Azure subscriptions, they need to be canceled and deleted as well.

## What data transfer fees are applied when moving all data off Azure?

Azure now offers free egress for customers leaving Azure when taking out their data via the internet to another cloud provider or an on-premises data center. Use the following these steps to submit your request for free egress.

### Create a support request

1. To signal your intent to exit Azure and allow us to accommodate your request, create an [Azure Support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) and provide:
    - Your _Subscription ID_ or _Enrollment ID_
    - The date you plan to start your transfer
    - An estimate of the amount of data you plan to egress
1. Once your request is logged with Azure Support, you have 60 days from the date you indicate as your start data transfer date to egress your data out of Azure. If you need more than 60 days to egress your data, include an overview of your migration timeline in your initial Azure support request.
1. After egressing your data, cancel all subscriptions associated with your account.
1. Contact Azure Support and create a request to claim invoice-level credit for your egress charges incurred during your exit. You can either reopen your initial support request (step 1) or create a new Azure Support request. An invoice-level credit adjustment is applied to the existing balance.

### Qualifications

- You must provide advance notice of your intention to leave Azure to Azure Support by creating a support request discussed previously [(Step 1)](#create-a-support-request).
- You must cancel all Azure subscriptions associated with your account after your data is transferred out before you can request your invoice-level credit.
- You receive credit for a maximum of 60 calendar days of egress charges starting from the date you specified as your transfer start date.
- Standard charges for Azure services and data transfer out from specialized services including Express Route, Express Route Direct, VPN, Azure Front Door, and Azure Content Delivery Network (CDN) aren't included in this credit offer. Only [egress charges](https://azure.microsoft.com/pricing/details/bandwidth/) as a result of moving Azure Storage data out of Azure are eligible for credits.
- Azure reviews your request for adherence to the requirements. If we determine the customer request doesn't follow the documented process, we might not issue the credit request.
- Azure might make changes regarding the egress credit policy in the future.
- If a customer purchases Azure services through a partner, the partner is responsible for the credit request process, transferring data, canceling the applicable subscriptions and credit issuance to the customer.

## Next steps

- If needed, you can reactivate a pay-as-you-go subscription in the [Azure portal](subscription-disabled.md).
