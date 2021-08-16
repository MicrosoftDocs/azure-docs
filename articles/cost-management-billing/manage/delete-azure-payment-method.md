---
title: Delete an Azure billing payment method
description: Describes how to delete a payment method used by an Azure subscription.
author: bandersmsft
ms.reviewer: judupont
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 10/07/2020
ms.author: banders
---

# Delete an Azure billing payment method

This document provides instructions to help you delete a payment method, like a credit card, from different types of Azure subscriptions. You can delete a payment method for:

- Microsoft Customer Agreement (MCA)
- Microsoft Online Services Program (MOSP) also referred to as pay-as-you-go

Whatever your Azure subscription type, you must cancel it so that you can delete its associated payment method.

Removing a payment method for other Azure subscription types like Microsoft Partner Agreement and Enterprise Agreement isn't supported.

## Delete an MCA payment method

Only the user who created the Microsoft Customer Agreement account can delete a payment method.

To delete a payment method for a Microsoft Customer Agreement, do the following steps.

1. Sign in to the Azure portal at https://portal.azure.com/.
1. Navigate to **Cost Management + Billing**.
1. If necessary, select a billing scope.
1. In the left menu list under **Billing**, select **Billing profiles**.  
    :::image type="content" source="./media/delete-azure-payment-method/billing-profiles.png" alt-text="Example screenshot showing Billing profiles in the Azure portal" lightbox="./media/delete-azure-payment-method/billing-profiles.png" :::
1. In the list of billing profiles, select the one where the payment method is being used.  
    :::image type="content" source="./media/delete-azure-payment-method/select-billing-profile.png" alt-text="Example image showing the list of billing profiles" :::
1. In the left menu list, under **Settings**, select **Payment methods**.
1. On the payment methods page for your billing profile, a table of payment methods is shown under the **Your credit cards** section. Find the credit card that you want to delete, select the ellipsis (**…**), and then select **Delete**.  
    :::image type="content" source="./media/delete-azure-payment-method/delete-credit-card.png" alt-text="Example showing where to delete a credit card" :::
1. The Delete a payment method page appears. Azure checks if the payment method is in use.
    - When the payment method isn't being used, the **Delete** option is enabled. Select it to delete the credit card information.
    - If the payment method is being used, it must be replaced or detached. Continue reading the following sections. They explain how to **detach** the payment method that's in use by your subscription.

### Detach payment method used by an MCA billing profile

If your payment method is being used by an MCA billing profile, you'll see a message similar to the following example.

:::image type="content" source="./media/delete-azure-payment-method/payment-method-in-use-microsoft-customer-agreement.png" alt-text="Example image showing that a payment method is in use by a Microsoft Customer Agreement" :::

To detach a payment method, a list of conditions must be met. If any conditions aren't met, instructions appear explaining how to meet the condition. A link also appears that takes you to the location where you can resolve the condition.

When all the conditions are all satisfied, you can detach the payment method from the billing profile.

> [!NOTE]
> When the default payment method is detached, the billing profile is put into an _inactive_ state. Anything deleted in this process will not be able to be recovered. After a billing profile is set to inactive, you must sign up for a new Azure subscription to create new resources.

#### To detach a payment method

1. In the Delete a payment method area, select the **Detach the current payment method** link.
1. If all conditions are met, select **Detach**. Otherwise, continue to the next step.
1. If Detach is unavailable, a list of conditions is shown. Take the actions listed. Select the link shown in the Detach the default payment method area. Here's an example of a corrective action that explains the actions you need to take.  
    :::image type="content" source="./media/delete-azure-payment-method/azure-subscriptions.png" alt-text="Example showing a corrective action needed to detach a payment method for MCA" :::
1. When you select the corrective action link, you're redirected to the Azure page where you take action. Take whatever correction action is needed.
1. If necessary, complete all other corrective actions.
1. Navigate back to **Cost Management + Billing** > **Billing profiles** > **Payment methods**. Select **Detach**. At the bottom of the Detach the default payment method page, select **Detach**.

> [!NOTE]
> - After you cancel a subscription, it can take up to 90 days for the subscription to be deleted. If you want the wait shortened, open an Azure support request and ask to have the subscription deleted immediately.
> - You can only delete a payment method after all previous charges for a billing profile are settled. If you are in an active billing period, you must wait until the end of the billing period to delete your payment method. **Ensure all other detach conditions are met while waiting for your billing period to end**.

## Delete a MOSP payment method

You must be an account administrator to delete a payment method.

If your payment method is in use by an MOSP subscription, do the following steps.

1. Sign in to the Azure portal at https://portal.azure.com/.
1. Navigate to **Cost Management + Billing**.
1. If necessary, select a billing scope.
1. In the left menu list under **Billing**, select **Payment methods**.
1. In the Payment methods area, select the _line_ that your payment method is on. Don't select the payment method link. There might not be a visual indication that you've selected the payment method.
1. Select **Delete**.  
    :::image type="content" source="./media/delete-azure-payment-method/delete-mosp-payment-method.png" alt-text="Example showing a corrective action needed to detach a payment method for MOSP" :::
1. In the Delete a payment method area, select **Delete** if all conditions are met. If Delete is unavailable, continue to the next step.
1. A list of conditions is shown. Take the actions listed. Select the link shown in the Delete a payment method area.  
    :::image type="content" source="./media/delete-azure-payment-method/payment-method-in-use-mosp.png" alt-text="Example image showing that a payment method is in use by an MOSP subscription" :::
1. When you select the corrective action link, you're redirected to the Azure page where you take action. Take whatever correction action is needed.
1. If necessary, complete all other corrective actions.
1. Navigate back to **Cost Management + Billing** > **Billing profiles** > **Payment methods** and delete the payment method.

> [!NOTE]
> After you cancel a subscription, it can take up to 90 days for the subscription to be deleted. If you want the wait shortened, open an Azure support request and ask to have the subscription deleted immediately.

## Next steps

- If you need more information about canceling your Azure subscription, see [Cancel you Azure subscription](cancel-azure-subscription.md).
- For more information about adding or updating a credit card, see [Add or update a credit card for Azure](change-credit-card.md).