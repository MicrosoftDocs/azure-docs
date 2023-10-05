---
title:  Add, update, or delete a payment method
description: This article describes how to add, update, or delete a payment method used to pay for an Azure subscription.
author: bandersmsft
ms.reviewer: lishepar
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 09/13/2023
ms.author: banders
---

# Add, update, or delete a payment method

This document applies to customers who signed up for Azure online with a credit card.

In the Azure portal, you can change your default payment method to a new credit card and update your credit card details. You can also delete a payment method used to pay for an Azure subscription.

- For a Microsoft Online Service Program (pay-as-you-go) account, you must be an [Account Administrator](add-change-subscription-administrator.md#whoisaa). 
- For a Microsoft Customer Agreement, you must have the correct [MCA permissions](understand-mca-roles.md) to make these changes.

[!INCLUDE [Pay by check](../../../includes/cost-management-pay-check.md)]

The supported payment methods for Microsoft Azure are credit cards, debit cards, and wire transfer. To get approved to pay by wire transfer, see [Pay for your Azure subscription wire transfer](pay-by-invoice.md).

>[!NOTE]
> Azure doesn't support virtual or prepaid cards.
> Credit cards are accepted and debit cards are accepted by most countries or regions.
>   - Hong Kong Special Administrative Region and Brazil only support credit cards.
>   - India supports debit and credit cards through Visa and Mastercard.

With a Microsoft Customer Agreement, your payment methods are associated with billing profiles. Learn how to [check access to a Microsoft Customer Agreement](#check-the-type-of-your-account).

When you create a new subscription, you can specify a new credit card. When you do so, no other subscriptions get associated with the new credit card. However, if you later make any of the following changes, *all subscriptions* use the payment method you select.
  - Make a payment method active with the **Set active** option
  - Use the **Replace** payment option for any subscription
  - Change the default payment method

> [!NOTE]
> The Reserve Bank of India has new regulations, [Tokenisation – Card Transactions: Permitting Card-on-File Tokenisation (CoFT) Services](https://rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx?Id=12159), for storing credit card information that may affect credit card users in India. To summarize, customers in India can't store credit card information in Azure for recurring charges. Instead, they must enter their credit card information each time they want to pay for Azure services. For more information, see [Reserve Bank of India](../understand/pay-bill.md#reserve-bank-of-india).

<a id="addcard"></a>

## Manage pay-as-you-go credit cards

The following sections apply to customers who have a Microsoft Online Services Program billing account. Learn how to [check your billing account type](#check-the-type-of-your-account). If your billing account type is Microsoft Online Services Program, payment methods are associated with individual Azure subscriptions. If you get an error after you add the credit card, see [Credit card declined at Azure sign-up](./troubleshoot-declined-card.md).

### Change credit card for all subscriptions by adding a new credit card

You can change the default credit of your Azure subscription to a new credit card or previously saved credit card in the Azure portal. You must be the Account Administrator to change the credit card.

If multiple subscriptions have the same active payment method, then changing the default payment method on any of the subscriptions also updates the active payment method for the others.

You can change your subscription's default credit card to a new one by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as the Account Administrator.
1. Search for **Cost Management + Billing**.  
    :::image type="content" source="./media/change-credit-card/search.png" alt-text="Screenshot showing Search." lightbox="./media/change-credit-card/search.png" :::
1. Select the subscription you'd like to add the credit card to.
1. Select **Payment methods**.  
    :::image type="content" source="./media/change-credit-card/payment-methods-blade-x.png" alt-text="Screenshot showing Manage payment methods option selected." lightbox="./media/change-credit-card/payment-methods-blade-x.png" :::
1. In the top-left corner, select **Add payment method** to add a card. A credit card form appears.
1. Enter credit card details.  
    :::image type="content" source="./media/change-credit-card/sub-add-new-default.png" alt-text="Screenshot showing adding a new card." lightbox="./media/change-credit-card/sub-add-new-default.png" :::
1. To make this card your default payment method, select **Make this my default payment method** above the form. This card becomes the active payment instrument for all subscriptions using the same card as the selected subscription.
1. Select **Next**.

### Replace credit card for a subscription to a previously saved credit card

You can also replace a subscription's default credit card to one that is already saved to your account by following these steps. This procedure changes the credit card for all other subscriptions.

1. Sign in to the [Azure portal](https://portal.azure.com) as the Account Administrator.
1. Search for **Cost Management + Billing**.  
    :::image type="content" source="./media/change-credit-card/search.png" alt-text="Screenshot showing Search for Cost Management + Billing." lightbox="./media/change-credit-card/search.png" :::
1. Select the subscription you'd like to add the credit card to.
1. Select **Payment methods**.
    :::image type="content" source="./media/change-credit-card/payment-methods-blade-x.png" alt-text="Screenshot showing Manage payment methods option." lightbox="./media/change-credit-card/payment-methods-blade-x.png" :::
1. Select **Replace** to change the current credit card to one you select.
    :::image type="content" source="./media/change-credit-card/replace-credit-card.png" alt-text="Screenshot showing the Replace option." lightbox="./media/change-credit-card/replace-credit-card.png" :::
1. In the **Replace default payment method**, select another credit card to replace the default credit card and then select **Next**.
    :::image type="content" source="./media/change-credit-card/replace-default-payment-method.png" alt-text="Screenshot showing the Replace default payment method box." lightbox="./media/change-credit-card/replace-default-payment-method.png" :::
1. After a few moments, you'll see confirmation that your payment method was changed.

### Edit credit card details

If your credit card gets renewed and the number stays the same, update the existing credit card details like the expiration date. If your credit card number changes because the card is lost, stolen, or expired, follow the steps in the [Add a credit card as a payment method](#addcard) section. You don't need to update the CVV.

1. Sign in to the [Azure portal](https://portal.azure.com) as the Account Administrator.
1. Search for **Cost Management + Billing**.
    :::image type="content" source="./media/change-credit-card/search.png" alt-text="Screenshot of Search." lightbox="./media/change-credit-card/search.png" :::
1. Select **Payment methods**.
    :::image type="content" source="./media/change-credit-card/payment-methods-blade-x.png" alt-text="Screenshot showing Manage payment methods" lightbox="./media/change-credit-card/payment-methods-blade-x.png" :::
1. On the right side of the page, for the credit card that you want to edit, select the ellipsis (`...`) at the end of the row. Select **Edit**. 
    :::image type="content" source="./media/change-credit-card/edit-card-x.png" alt-text="Screenshot showing Edit navigation." lightbox="./media/change-credit-card/edit-card-x.png" :::
1. Update the credit card details.  
    :::image type="content" source="./media/change-credit-card/edit-payment-method.png" alt-text="Screenshot showing Edit payment method." lightbox="./media/change-credit-card/edit-payment-method.png" :::
1. Select **Next**.

## Manage Microsoft Customer Agreement credit cards

The following sections apply to customers who have a Microsoft Customer Agreement and signed up for Azure online with a credit card. You must have the correct [MCA permissions](understand-mca-roles.md). [Learn how to check if you have a Microsoft Customer Agreement](#check-the-type-of-your-account).

### Change default credit card

If you have a Microsoft Customer Agreement, your credit card is associated with a billing profile. To change the payment method for a billing profile, you must be the person who signed up for Azure and created the billing account or you must have the correct [MCA permissions](understand-mca-roles.md).

If you'd like to change your billing profile's default payment method to wire transfer, see [Pay for Azure subscriptions by invoice](pay-by-invoice.md).

To change your credit card, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search on **Cost Management + Billing**.
1. In the menu on the left, select **Billing profiles**.
1. Select a billing profile.
1. In the menu on the left, select **Payment methods**.  
    :::image type="content" source="./media/change-credit-card/payment-methods-tab-mca.png" alt-text="Screenshot showing payment methods in menu." lightbox="./media/change-credit-card/payment-methods-tab-mca.png" :::
1. In the **Default payment method** section, select **Replace**.  
    :::image type="content" source="./media/change-credit-card/change-payment-method-mca.png" alt-text="Screenshot showing Replace." lightbox="./media/change-credit-card/change-payment-method-mca.png" :::
1. In the new area on the right, either select an existing card from the drop-down, if available, or add a new one by selecting the blue **Add payment method** link.

### Add a new credit card

1. Search for **Cost Management + Billing**.  
    :::image type="content" source="./media/change-credit-card/search.png" alt-text="Screenshot showing Search." lightbox="./media/change-credit-card/search.png" :::
1. Select the subscription you'd like to add the credit card to.
1. Select **Payment methods**.  
    :::image type="content" source="./media/change-credit-card/payment-methods-blade-x.png" alt-text="Screenshot showing Manage payment methods option selected." lightbox="./media/change-credit-card/payment-methods-blade-x.png" :::
1. In the top-left corner, select **Add payment method** to add a card. A credit card form appears.
1. Enter credit card details.  
    :::image type="content" source="./media/change-credit-card/sub-add-new-card-billing-profile.png" alt-text="Screenshot showing adding a new credit card as a payment method." lightbox="./media/change-credit-card/sub-add-new-card-billing-profile.png" :::
1. To make this card your default payment method, select **Make this my default payment method** above the form. This card becomes the active payment instrument for all subscriptions using the same card as the selected subscription.
1. Select **Next**.

### Edit a credit card

You can edit credit card details (such as updating the expiration date) in the Azure portal. 

To edit a credit card, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search on **Cost Management + Billing**.
1. In the menu on the left, select **Billing profiles**.
1. Select a billing profile.
1. In the menu on the left, select **Payment methods**.  
    :::image type="content" source="./media/change-credit-card/payment-methods-tab-mca.png" alt-text="Screenshot showing the payment methods in menu." lightbox="./media/change-credit-card/payment-methods-tab-mca.png" :::
1. In the **Your credit cards**  section, find the credit card you want to edit.
1. Select the ellipsis (`...`) at the end of the row.  
    :::image type="content" source="./media/change-credit-card/edit-delete-credit-card-mca.png" alt-text="Screenshot showing the ellipsis." lightbox="./media/change-credit-card/edit-delete-credit-card-mca.png" :::
1. To edit your credit card details, select **Edit** from the context menu.

## Delete an Azure billing payment method

The following information helps you delete a payment method, like a credit card, from different types of Azure subscriptions. You can delete a payment method for:

- Microsoft Customer Agreement (MCA)
- Microsoft Online Services Program (MOSP) also referred to as pay-as-you-go

Whatever your Azure subscription type, you must cancel it so that you can delete its associated payment method.

Removing a payment method for other Azure subscription types like Microsoft Partner Agreement and Enterprise Agreement isn't supported.

### Delete an MCA payment method

Only the user who created the Microsoft Customer Agreement account can delete a payment method.

To delete a payment method for a Microsoft Customer Agreement, do the following steps.

1. Sign in to the Azure portal at https://portal.azure.com/.
1. Navigate to **Cost Management + Billing**.
1. If necessary, select a billing scope.
1. In the left menu list under **Billing**, select **Billing profiles**.  
    :::image type="content" source="./media/change-credit-card/billing-profiles.png" alt-text="Example screenshot showing Billing profiles in the Azure portal." lightbox="./media/change-credit-card/billing-profiles.png" :::
1. In the list of billing profiles, select the one where the payment method is being used.  
    :::image type="content" source="./media/change-credit-card/select-billing-profile.png" alt-text="Example screenshot showing the list of billing profiles." :::
1. In the left menu list, under **Settings**, select **Payment methods**.
1. On the payment methods page for your billing profile, a table of payment methods is shown under the **Your credit cards** section. Find the credit card that you want to delete, select the ellipsis (**…**), and then select **Delete**.  
    :::image type="content" source="./media/change-credit-card/delete-credit-card.png" alt-text="Example screenshot showing where to delete a credit card." :::
1. The Delete a payment method page appears. Azure checks if the payment method is in use.
    - When the payment method isn't being used, the **Delete** option is enabled. Select it to delete the credit card information.
    - If the payment method is being used, it must be replaced or detached. Continue reading the following sections. They explain how to **detach** the payment method that's in use by your subscription.

### Detach payment method used by an MCA billing profile

If your payment method is being used by an MCA billing profile, the following message appears.

:::image type="content" source="./media/change-credit-card/payment-method-in-use-microsoft-customer-agreement.png" alt-text="Example screenshot showing that a payment method is in use by a Microsoft Customer Agreement." :::

To detach a payment method, a list of conditions must be met. If any conditions aren't met, instructions appear explaining how to meet the condition. A link also appears that takes you to the location where you can resolve the condition.

When all the conditions are all satisfied, you can detach the payment method from the billing profile.

> [!NOTE]
> When the default payment method is detached, the billing profile is put into an _inactive_ state. Anything deleted in this process will not be able to be recovered. After a billing profile is set to inactive, you must sign up for a new Azure subscription to create new resources.

#### To detach a payment method

1. In the Delete a payment method area, select the **Detach the current payment method** link.
1. If all conditions are met, select **Detach**. Otherwise, continue to the next step.
1. If Detach is unavailable, a list of conditions is shown. Take the actions listed. Select the link shown in the Detach the default payment method area. Here's an example of a corrective action that explains the actions you need to take.  
    :::image type="content" source="./media/change-credit-card/azure-subscriptions.png" alt-text="Example screenshot showing a corrective action needed to detach a payment method for MCA." :::
1. When you select the corrective action link, you're redirected to the Azure page where you take action. Take whatever correction action is needed.
1. If necessary, complete all other corrective actions.
1. Navigate back to **Cost Management + Billing** > **Billing profiles** > **Payment methods**. Select **Detach**. At the bottom of the Detach the default payment method page, select **Detach**.

> [!NOTE]
> - After you cancel a subscription, it can take up to 90 days for the subscription to be deleted.
> - You can only delete a payment method after all previous charges for a billing profile are settled. If you are in an active billing period, you must wait until the end of the billing period to delete your payment method. **Ensure all other detach conditions are met while waiting for your billing period to end**.

### Delete a pay-as-you-go (MOSP) payment method

You must be an account administrator to delete a payment method.

If your payment method is in use by a subscription, do the following steps.

1. Sign in to the Azure portal at https://portal.azure.com/.
1. Navigate to **Cost Management + Billing**.
1. If necessary, select a billing scope.
1. In the left menu list under **Billing**, select **Payment methods**.
1. In the Payment methods area, on the row that the payment method is on, select the ellipsis (**...**) symbol and then select **Delete**.
    :::image type="content" source="./media/change-credit-card/delete-mosp-payment-method.png" alt-text="Example screenshot showing a corrective action needed to detach a payment method for MOSP." :::
1. In the Delete a payment method area, select **Delete** if all conditions are met. If Delete is unavailable, continue to the next step.
1. A list of conditions is shown. Take the actions listed. Select the link shown in the Delete a payment method area.  
    :::image type="content" source="./media/change-credit-card/payment-method-in-use-mosp.png" alt-text="Example screenshot showing that a payment method is in use by a pay-as-you-go subscription." :::
1. When you select the corrective action link, you're redirected to the Azure page where you take action. Take whatever correction action is needed.
1. If necessary, complete all other corrective actions.
1. Navigate back to **Cost Management + Billing** > **Billing profiles** > **Payment methods** and delete the payment method.

> [!NOTE]
> After you cancel a subscription, it can take up to 90 days for the subscription to be deleted.

## Troubleshooting

Azure doesn't support virtual or prepaid cards. If you're getting errors when adding or updating a valid credit card, try opening your browser in private mode.

## Frequently asked questions

The following sections answer commonly asked questions about changing your credit card information.

### Why do I keep getting a "session has expired" error message?

If you get the `Your login session has expired. Please click here to log back in` error message even if you've already logged out and back in, try again with a private browsing session.

### How do I use a different card for each subscription?

As noted previously, when you create a new subscription, you can specify a new credit card. When you do so, no other subscriptions get associated with the new credit card. You can add multiple new subscriptions, each with a unique credit card. However, if you later make any of the following changes, *all subscriptions* use the payment method you select.

- Make a payment method active with the **Set active** option
- Use the **Replace** payment option for any subscription
- Change the default payment method

### How do I make payments?

If you set up a credit card as your payment method, we automatically charge your card after each billing period. You don't need to do anything.

If you're [paying by invoice](pay-by-invoice.md), send your payment to the location listed at the bottom of your invoice.

### How do I change the tax ID?

To add or update tax ID, update your profile in the  [Azure portal](https://portal.azure.com), then select **Tax record**. This tax ID is used for tax exemption calculations and appears on your invoice.

## Check the type of your account

[!INCLUDE [billing-check-mca](../../../includes/billing-check-account-type.md)]

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- Learn about [Azure reservations](../reservations/save-compute-costs-reservations.md) to see if they can save you money.
