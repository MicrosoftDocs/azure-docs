---
title: Add, update, or delete a payment method
description: This article describes how to add, update, or delete a payment method for an Azure subscription.
author: bandersmsft
ms.reviewer: lishepar
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 07/31/2024
ms.author: banders
---

# Add, update, or delete a payment method

This article applies to customers who signed up for Azure online by using a credit card.

In the Azure portal, you can change your default payment method to a new credit card and update your credit card details. You can also delete a payment method that you use to pay for an Azure subscription. To make these changes, you need these credentials:

- For a Microsoft Online Subscription Program (pay-as-you-go) account, you must be an [account administrator](add-change-subscription-administrator.md#whoisaa).
- For a Microsoft Customer Agreement account, you must have the correct [Microsoft Customer Agreement permissions](understand-mca-roles.md).

The supported payment methods for Azure are credit card, debit card, and wire transfer. Azure doesn't support virtual or prepaid cards. To get approved to pay by wire transfer, see [Pay for your Azure subscription by wire transfer](pay-by-invoice.md).

> [!NOTE]
> Most countries/regions accept credit cards and debit cards. Here's some specific information:
>
> - Hong Kong Special Administrative Region and Brazil support only credit cards.
> - India supports credit and debit cards through Visa and Mastercard.
>
> The Reserve Bank of India has a [regulation for storing credit card information](https://rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx?Id=12159) that might affect credit card users in India. To summarize, customers in India can't store credit card information in Azure for recurring charges. Instead, they must enter their credit card information each time they want to pay for Azure services. For more information, see [Reserve Bank of India](../understand/pay-bill.md#reserve-bank-of-india).

If you get an error after you add a credit card, see [Troubleshoot a declined card](../troubleshoot-billing/troubleshoot-declined-card.md).

<a id="addcard"></a>

## Manage pay-as-you-go credit cards

The following sections apply to customers who have a Microsoft Online Subscription Program billing account. You can [check your billing account type](#check-the-type-of-your-account). If your billing account type is Microsoft Online Subscription Program, payment methods are associated with individual Azure subscriptions.

### Change the credit card for all subscriptions by adding a new credit card

You can change the default credit card for your Azure subscription to a new card or a previously saved card in the Azure portal. You must be the account administrator to change the credit card.

If multiple subscriptions have the same active payment method, changing the default payment method on any of the subscriptions also updates the active payment method for the others.

To change your subscription's default credit card to a new one:

1. Sign in to the [Azure portal](https://portal.azure.com) as the account administrator.
1. Search for and select **Cost Management + Billing**.  

    :::image type="content" source="./media/change-credit-card/search.png" alt-text="Screenshot that shows a search for Cost Management and Billing in the Azure portal." lightbox="./media/change-credit-card/search.png" :::
1. Select the subscription where you want to add the credit card.
1. Select **Payment methods**.  

    :::image type="content" source="./media/change-credit-card/payment-methods-blade-x.png" alt-text="Screenshot that shows the pane for managing payment methods." lightbox="./media/change-credit-card/payment-methods-blade-x.png" :::
1. In the upper-left corner, select **Add payment method**. A form for adding a credit card appears.
1. Enter details for the credit card.  

    :::image type="content" source="./media/change-credit-card/sub-add-new-default.png" alt-text="Screenshot that shows the pane for adding credit card details." lightbox="./media/change-credit-card/sub-add-new-default.png" :::
1. To make this card your default payment method, select **Make this my default payment method**. This card becomes the active payment instrument for all subscriptions that use the same card as the selected subscription.
1. Select **Next**.

### Replace the credit card for a subscription to a previously saved credit card

You can replace a subscription's default credit card to one that's already saved to your account by using the following steps. This procedure changes the credit card for all other subscriptions.

1. Sign in to the [Azure portal](https://portal.azure.com) as the account administrator.
1. Search for and select **Cost Management + Billing**.  

    :::image type="content" source="./media/change-credit-card/search.png" alt-text="Screenshot that shows a search for Cost Management and Billing." lightbox="./media/change-credit-card/search.png" :::
1. Select the subscription where you want to add the credit card.
1. Select **Payment methods**.

    :::image type="content" source="./media/change-credit-card/payment-methods-blade-x.png" alt-text="Screenshot that shows the portal pane for managing payment methods." lightbox="./media/change-credit-card/payment-methods-blade-x.png" :::
1. Select **Replace** to change the current credit card.

    :::image type="content" source="./media/change-credit-card/replace-credit-card.png" alt-text="Screenshot that shows the button for replacing a credit card." lightbox="./media/change-credit-card/replace-credit-card.png" :::
1. On the **Replace default payment method** pane, select a credit card to replace the default one, and then select **Next**.

    :::image type="content" source="./media/change-credit-card/replace-default-payment-method.png" alt-text="Screenshot that shows the pane for replacing the default payment method." lightbox="./media/change-credit-card/replace-default-payment-method.png" :::
1. After a few moments, you get a confirmation that you changed your payment method.

### Edit credit card details

If your credit card is renewed and the number stays the same, use the following steps to update the existing card details (like the expiration date). If your credit card number changes because the card is lost, stolen, or expired, follow the steps in the [Add a credit card as a payment method](#addcard) section. You don't need to update the CVV.

1. Sign in to the [Azure portal](https://portal.azure.com) as the account administrator.
1. Search for and select **Cost Management + Billing**.

    :::image type="content" source="./media/change-credit-card/search.png" alt-text="Screenshot of a search for Cost Management and Billing." lightbox="./media/change-credit-card/search.png" :::
1. Select **Payment methods**.

    :::image type="content" source="./media/change-credit-card/payment-methods-blade-x.png" alt-text="Screenshot of the pane for managing payment methods." lightbox="./media/change-credit-card/payment-methods-blade-x.png" :::
1. For the credit card that you want to edit, select the ellipsis (**...**) at the end of the row. Then select **Edit**.

    :::image type="content" source="./media/change-credit-card/edit-card-x.png" alt-text="Screenshot that shows the Edit command for a credit card." lightbox="./media/change-credit-card/edit-card-x.png" :::
1. Update the credit card details.  

    :::image type="content" source="./media/change-credit-card/edit-payment-method.png" alt-text="Screenshot of the pane for editing a payment method." lightbox="./media/change-credit-card/edit-payment-method.png" :::
1. Select **Next**.

## Manage Microsoft Customer Agreement credit cards

The following sections apply to customers who have a Microsoft Customer Agreement and who signed up for Azure online by using a credit card. To check if you have a Microsoft Customer Agreement, see [Check the type of your account](#check-the-type-of-your-account) later in this article.

If you have a Microsoft Customer Agreement, your credit card is associated with a billing profile. To change the payment method for a billing profile, one of these conditions must apply:

- You're the person who signed up for Azure and created the billing account.
- You have the correct [Microsoft Customer Agreement permissions](understand-mca-roles.md).

### Change the default credit card

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Cost Management + Billing**.
1. On the left menu, select **Billing profiles**.
1. Select a billing profile.
1. On the left menu, select **Payment methods**.  

    :::image type="content" source="./media/change-credit-card/payment-methods-tab-mca.png" alt-text="Screenshot that shows the pane for viewing payment methods in the Azure portal." lightbox="./media/change-credit-card/payment-methods-tab-mca.png" :::
1. In the **Default payment method** section, select **Replace**.  

    :::image type="content" source="./media/change-credit-card/change-payment-method-mca.png" alt-text="Screenshot that shows the Replace option." lightbox="./media/change-credit-card/change-payment-method-mca.png" :::
1. On the **Replace default payment method** pane, either select an existing card from the dropdown list or add a new one by selecting the blue **Add payment method** link.

### Add a new credit card

1. Search for and select **Cost Management + Billing**.  

    :::image type="content" source="./media/change-credit-card/search.png" alt-text="Screenshot that shows a search for Cost Management and Billing in the portal." lightbox="./media/change-credit-card/search.png" :::
1. Select the subscription where you want to add the credit card.
1. Select **Payment methods**.  

    :::image type="content" source="./media/change-credit-card/payment-methods-blade-x.png" alt-text="Screenshot that shows the pane for viewing payment methods in the portal." lightbox="./media/change-credit-card/payment-methods-blade-x.png" :::
1. In the upper-left corner, select **Add payment method**. A form for adding a credit card appears.
1. Enter details for the credit card.  

    :::image type="content" source="./media/change-credit-card/sub-add-new-card-billing-profile.png" alt-text="Screenshot that shows the pane for adding a new credit card as a payment method." lightbox="./media/change-credit-card/sub-add-new-card-billing-profile.png" :::
1. To make this card your default payment method, select **Make this my default payment method**. This card becomes the active payment instrument for all subscriptions that use the same card as the selected subscription.
1. Select **Next**.

### Edit a credit card

You can edit credit card details (such as updating the expiration date) in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Cost Management + Billing**.
1. On the left menu, select **Billing profiles**.
1. Select a billing profile.
1. On the left menu, select **Payment methods**.  

    :::image type="content" source="./media/change-credit-card/payment-methods-tab-mca.png" alt-text="Screenshot that shows the pane for viewing payment methods." lightbox="./media/change-credit-card/payment-methods-tab-mca.png" :::
1. In the **Your credit cards**  section, find the credit card that you want to edit.
1. Select the ellipsis (**...**) at the end of the row.  

    :::image type="content" source="./media/change-credit-card/edit-delete-credit-card-mca.png" alt-text="Screenshot that shows the ellipsis for actions related to a credit card." lightbox="./media/change-credit-card/edit-delete-credit-card-mca.png" :::
1. To edit your credit card details, select **Edit** from the menu.

## Delete an Azure billing payment method

The following information helps you delete a payment method, like a credit card, from these types of Azure subscriptions:

- Microsoft Customer Agreement
- Microsoft Online Subscription Program (pay-as-you-go)

Whatever your Azure subscription type, you must cancel it to delete its associated payment method.

Removing a payment method for other Azure subscription types, like Microsoft Partner Agreement and Enterprise Agreement, isn't supported.

### Delete a Microsoft Customer Agreement payment method

Only the user who created the Microsoft Customer Agreement account can delete a payment method.

To delete a payment method for a Microsoft Customer Agreement:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Cost Management + Billing**.
1. If necessary, select a billing scope.
1. On the left menu, under **Billing**, select **Billing profiles**.  

    :::image type="content" source="./media/change-credit-card/billing-profiles.png" alt-text="Example screenshot that shows selecting the resource for billing profiles in the Azure portal." lightbox="./media/change-credit-card/billing-profiles.png" :::
1. In the list of billing profiles, select the profile that's using the payment method.  

    :::image type="content" source="./media/change-credit-card/select-billing-profile.png" alt-text="Example screenshot of the pane that lists billing profiles." :::
1. On the left menu, under **Settings**, select **Payment methods**.
1. A table of payment methods appears under **Your Credit Cards**. Find the credit card that you want to delete, select the ellipsis (**...**), and then select **Delete**.  

    :::image type="content" source="./media/change-credit-card/delete-credit-card.png" alt-text="Example screenshot that shows selections for deleting a credit card." :::
1. The **Delete a payment method** pane appears. Azure checks if the payment method is in use:
    - If the payment method isn't in use, the **Delete** option is available. Select it to delete the credit card information.
    - If the payment method is in use, it must be replaced or detached. Continue reading the following sections. They explain how to detach the payment method.

### Detach a Microsoft Customer Agreement payment method

If a Microsoft Customer Agreement billing profile is using your payment method, the following message appears.

:::image type="content" source="./media/change-credit-card/payment-method-in-use-microsoft-customer-agreement.png" alt-text="Example screenshot showing that a Microsoft Customer Agreement account is using a payment method." :::

To detach a payment method, you must meet a list of conditions. If you don't meet a condition, the following information appears:

- Instructions on how to meet the condition.
- A link that takes you to the location where you can resolve the problem.

When you fully satisfy all the conditions, you can detach the payment method from the billing profile.

> [!NOTE]
> When you detach the default payment method, the billing profile enters an *inactive* state. Anything deleted in this process can't be recovered. After a billing profile becomes inactive, you must sign up for a new Azure subscription to create new resources.

#### Detach payment method errors

If you're having problems trying to detach (remove) a payment method, one of the following reasons is likely the cause.

##### Outstanding charges

Outstanding (past-due) charges prevent you from detaching your payment method.

To view your outstanding charges:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Cost Management + Billing**.
1. Select your billing account.
1. Under **Billing**, select **Invoices**.
1. In the list of invoices, view the **Status** information. You must pay invoices that have a **Past Due** status.

   :::image type="content" source="./media/change-credit-card/past-due.png" alt-text="Screenshot that shows past-due invoices." lightbox="./media/change-credit-card/past-due.png":::

After you pay outstanding charges, you can detach your payment method.

##### Recurring charges set to automatically renew

Recurring charges prevent you from detaching your payment method. Examples of recurring charges include:

- Azure support agreements.
- Active Azure subscriptions.
- Reservations set to automatically renew.
- Savings plans set to automatically renew.

To stop recurring charges from automatically renewing:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Cost Management + Billing**.
1. Select your billing account.
1. Under **Billing**, select **Recurring charges**.
1. On the **Recurring charges** pane, select a charge, select the ellipsis (**...**) on the right side of the row, and then select **Cancel**.

   :::image type="content" source="./media/change-credit-card/recurring-charges.png" alt-text="Screenshot that shows the pane for recurring charges." lightbox="./media/change-credit-card/recurring-charges.png":::

After you remove all recurring charges, you can detach your payment method.

##### Pending charges

You can't detach your payment method if there are any pending charges. Here's a typical example of pending charges:

1. A billing cycle begins on June 1.
2. You use Azure services from June 1 to June 10.
3. You cancel your subscription on June 10.
4. You pay your invoice on June 12 for the month of May and are paid in full. However, you still have pending charges for June 1 to June 10.

In this example, you aren't billed for your June usage until the following month (August). So, you can't detach your payment method until you pay the invoice for June, which isn't available until August.

To view pending charges:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Cost Management + Billing**.
1. Select your billing account.
1. Under **Billing**, select **Invoices**.
1. On the **Invoices** pane, check for charges that appear with a **Due on *date*** status. These items are pending charges.

   :::image type="content" source="./media/change-credit-card/due-on.png" alt-text="Screenshot of invoices that have pending charges." lightbox="./media/change-credit-card/due-on.png":::

After you pay all pending charges, you can detach your payment method.

#### Steps for detaching a payment method

1. In the Azure portal, go to **Cost Management + Billing** > **Billing profiles** > **Payment methods** > **Delete a payment method**. Then select the **Detach the current payment method** link.
1. If you meet all conditions, select **Detach**. Otherwise, continue to the next step.
1. If **Detach** is unavailable, a list of unmet conditions appears in the **Detach the default payment method** area, along with the actions that you need to take to correct them.

    :::image type="content" source="./media/change-credit-card/azure-subscriptions.png" alt-text="Example screenshot that shows a corrective action needed to detach a payment method for a Microsoft Customer Agreement account." :::
1. For each unmet condition, select the link. The link directs you to the Azure portal area where you can take the corrective action. Complete all corrective actions.
1. Go back to **Cost Management + Billing** > **Billing profiles** > **Payment methods**. Select **Detach**. At the bottom of the **Detach the default payment method** pane, select **Detach**.

> [!NOTE]
> You can detach a payment method only after you settle all previous charges for a billing profile. If you're in an active billing period, you must wait until the end of the billing period to detach your payment method. Ensure that you meet all other detach conditions while you wait for your billing period to end.

### Delete a Microsoft Online Subscription Program payment method

You must be an account administrator to delete a Microsoft Online Subscription Program (pay-as-you-go) payment method.

If a subscription is using your payment method, take the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Cost Management + Billing**.
1. If necessary, select a billing scope.
1. On the left menu, under **Billing**, select **Payment methods**.
1. On the **Payment methods** pane, select the ellipsis (**...**) next to the row for the payment method, and then select **Delete**.

    :::image type="content" source="./media/change-credit-card/delete-mosp-payment-method.png" alt-text="Example screenshot that shows selections for deleting a payment method for a Microsoft Online Subscription Program account." :::
1. On the **Delete a payment method** pane, select **Delete** if you meet all conditions. Otherwise, continue to the next step.
1. If **Delete** is unavailable, a list of unmet conditions appears, along with the actions that you need to take to correct them.

    :::image type="content" source="./media/change-credit-card/payment-method-in-use-mosp.png" alt-text="Example screenshot that shows that a pay-as-you-go subscription is using a payment method." :::
1. For each unmet condition, select the link. The link directs you to the Azure portal area where you can take the corrective action. Complete all corrective actions.
1. Go back to **Cost Management + Billing** > **Billing profiles** > **Payment methods** and delete the payment method.

After you cancel a subscription, it can take up to 90 days for the subscription to be deleted.

## Check the type of your account

[!INCLUDE [billing-check-mca](../../../includes/billing-check-account-type.md)]

## Frequently asked questions

The following sections answer commonly asked questions about changing your credit card information.

### Why do I keep getting a "session has expired" error message?

If you already tried signing out and back in, yet you're still getting an error message that says your session has expired, try using a private browsing session.

### How do I use a different card for each subscription?

If you specify a new credit card during the process of creating a subscription, no other subscriptions are associated with that credit card. You can add multiple new subscriptions, each with a unique credit card. However, if you later make any of the following changes, *all subscriptions* use the selected payment method:

- Make a payment method active by using the **Set active** option.
- Use the **Replace** payment option for any subscription.
- Change the default payment method.

### How do I make payments?

If you set up a credit card as your payment method, we automatically charge your card after each billing period. You don't need to do anything.

If you're [paying by invoice](pay-by-invoice.md), send your payment to the location shown at the bottom of your invoice.

### How do I change the tax ID?

To add or update a tax ID, update your profile in the [Azure portal](https://portal.azure.com), and then select **Tax record**. The tax ID is used for tax exemption calculations and appears on your invoice.

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Related content

- Learn about [Azure reservations](../reservations/save-compute-costs-reservations.md) to see if they can save you money.
