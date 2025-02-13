---
title: Account Administrator tasks in the Azure portal
description: Describes how to perform payment operations in the Azure portal
author: bandersmsft
ms.reviewer: lishepar
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 01/22/2025
ms.author: banders
---

# Account Administrator tasks in the Azure portal

This article explains how to perform the following tasks in the Azure portal:
- Manage your subscription's payment methods
- Remove your subscription's spending limit
- Add credits to your Azure in Open subscription

You must be the Account Administrator to perform any of these tasks.

## Accounts portal is retired

Accounts portal was retired December 31, 2021. The features supported in the Accounts portal were migrated to the Azure portal. This article explains how to perform some of the most common operations in the Azure portal.


## Navigate to your subscription's payment methods

> [!NOTE]
> The Reserve Bank of India has new regulations for storing credit card information that may impact credit card users in India. For more information, see [Reserve Bank of India](../understand/pay-bill.md#reserve-bank-of-india).

1. Sign in to the Azure portal as the Account Administrator.

1. Search for **Cost Management + Billing**.

    :::image type="content" border="true" source="./media/account-admin-tasks/search-bar.png" alt-text="Screenshot showing search for Cost Management + Billing.":::

1. In the **My subscriptions** list, select the subscription you'd like to add the credit card to.

   :::image type="content" border="true" source="./media/account-admin-tasks/cost-management-billing-overview-x.png" alt-text="Screenshot showing the Cost Management + Billing page where you can select a subscription.":::

   > [!NOTE]
   > If you don't see some of your subscriptions here, it might be because you changed the subscription directory at some point. For these subscriptions, you need to switch the directory to the original directory (the directory in which you initially signed up). Then, repeat step 2.

1. Select **Payment methods**.

    :::image type="content" border="true" source="./media/account-admin-tasks/subscription-payment-methods-blade.png" alt-text="Screenshot showing the Payment methods page where you can add a payment method.":::

Here you can add a new credit card, change the active payment method, edit credit card details, and delete credit cards.

### Change active payment method

You can change the active payment method by adding a new credit card or choosing one that is already saved. To change the active payment method to a new credit card:

1. In the top-left corner, select “+” to add a credit card.

    :::image type="content" border="true" source="./media/account-admin-tasks/subscription-payment-methods-plus.png" alt-text="Screenshot that shows the plus symbol.":::

1. Enter credit card details in the form on the right side of the window.

    :::image type="content" border="true" source="./media/account-admin-tasks/subscription-add-payment-method-x.png" alt-text="Screenshot that shows add credit card form.":::

1. To make this card your active payment method, check the box next to **Make this my active payment method** above the form. This card becomes the active payment instrument for all subscriptions using the same card as the selected subscription.

    :::image type="content" border="true" source="./media/account-admin-tasks/subscription-make-active-payment-method-x.png" alt-text="Screenshot that shows check box for making card active payment method.":::

1. Select **Next**.

To change the active payment method to a credit card that is already saved:

1. Select the box next to the card you'd like to make the active payment method.

    :::image type="content" border="true" source="./media/account-admin-tasks/subscription-checked-payment-method-x.png" alt-text="Screenshot that shows box checked next to credit card.":::

1. Select **Set active** in the command bar.

    :::image type="content" border="true" source="./media/account-admin-tasks/subscription-checked-payment-method-set-active.png" alt-text="Screenshot that shows set active button.":::

### Edit credit card details

To edit credit card details such as the expiration date or address, select the credit card that you'd like to edit. A credit card form appears on the right side of the window.

:::image type="content" border="true" source="./media/account-admin-tasks/subscription-edit-payment-method-x.png" alt-text="Screenshot that shows credit card selected.":::

Update the credit card details and select **Save**.

### Remove a credit card from the account

1. Select the box next to the card you'd like to delete.

    :::image type="content" border="true" source="./media/account-admin-tasks/subscription-checked-payment-method-x.png" alt-text="Screenshot that shows box checked next to credit card.":::

1. Select **Delete** in the command bar.

    :::image type="content" border="true" source="./media/account-admin-tasks/subscription-checked-payment-method-delete.png" alt-text="Screenshot that shows delete button.":::

If your credit card is the active payment method for any of your Microsoft subscriptions, you can't remove it from your Azure account. Change the active payment method for all subscriptions linked to this credit card and try again.

### Switch to invoice payment

If you're eligible to pay by invoice (wire transfer), you can switch your subscription to invoice payment (wire transfer) in the Azure portal.

1. Select **Pay by invoice** in the command bar.

    :::image type="content" border="true" source="./media/account-admin-tasks/subscription-payment-methods-pay-by-invoice.png" alt-text="Screenshot showing the Payment methods page with Pay by invoice selected.":::

1. Enter the address for the invoice payment method.
1. Select **Next**.

If you want to be approved to pay by invoice, see [learn how to pay by invoice](pay-by-invoice.md).

### Edit invoice payment address

To edit the address of your invoice payment method, select **Invoice** in the list of payment methods for your subscription. The address form opens on the right side of the window.

## Remove spending limit

The spending limit in Azure prevents spending over your credit amount. You can remove the spending limit at any time as long as there's a valid payment method associated with your Azure subscription. If you have a subscription type like Visual Studio Enterprise or Visual Studio Professional, which provides credit over several months, you can reactivate the spending limit at the start of your upcoming billing cycle.

The spending limit isn’t available for subscriptions with commitment plans or with pay-as-you-go pricing.

1. Sign in to the Azure portal as the Account Administrator.
1. Search for **Cost Management + Billing**.

    :::image type="content" border="true" source="./media/account-admin-tasks/search-bar.png" alt-text="Screenshot that shows search for Cost Management + Billing.":::

1. In the **My subscriptions** list, select your Visual Studio Enterprise subscription.

   :::image type="content" border="true" source="./media/account-admin-tasks/cost-management-overview-msdn-x.png" alt-text="Screenshot that shows the My subscriptions area where you can select your Visual Studio Enterprise subscription.":::

    > [!NOTE]
    > If you don't see some of your Visual Studio subscriptions here, it might be because you changed a subscription directory at some point. For these subscriptions, you need to switch the directory to the original directory (the directory in which you initially signed up). Then, repeat step 2.

1. In the Subscription overview, select the orange banner to remove the spending limit.

    :::image type="content" border="true" source="./media/account-admin-tasks/msdn-remove-spending-limit-banner-x.png" alt-text="Screenshot that shows the remove spending limit banner.":::

1. Choose whether you want to remove the spending limit indefinitely or for the current billing period only.

   :::image type="content" border="true" source="./media/account-admin-tasks/remove-spending-limit-blade-x.png" alt-text="Screenshot that shows the remove spending limit page and options.":::

1. Select **Select payment method** to choose a payment method for your subscription. It becomes the active payment method for your subscription.

1. Select **Finish**.

## Add credits to Azure in Open subscription

If you have an Azure in Open Licensing subscription, you can add credits to your subscription. In the Azure portal, enter a product key or buy credits directly with a credit card.

1. Sign in to the Azure portal as the Account Administrator.
1. Search for **Cost Management + Billing**.

    :::image type="content" border="true" source="./media/account-admin-tasks/search-bar.png" alt-text="Screenshot that shows search for Cost Management + Billing.":::

1. In the **My subscriptions** list, select your Azure in Open subscription.

    :::image type="content" border="true" source="./media/account-admin-tasks/cost-management-overview-aio-x.png" alt-text="Screenshot shows the My subscriptions area where you can select your Azure in Open subscription.":::

   > [!NOTE]
   > If you don't see your subscription here, it might be because you changed its directory at some point. You need to switch the subscription's directory to the original directory (the directory in which you initially signed up). Then, repeat step 2.

1. Select **Credit history**.

    :::image type="content" border="true" source="./media/account-admin-tasks/aio-credit-history-blade.png" alt-text="Screenshot that shows credit history.":::

1. In the top left corner, select "+" to add more credits.

    :::image type="content" border="true" source="./media/account-admin-tasks/aio-credit-history-plus.png" alt-text="Screenshot that shows add credits button.":::

1. Select a payment method type in the drop-down. You can either add a product key or purchase credits with a credit card.

    :::image type="content" border="true" source="./media/account-admin-tasks/add-credits-select-payment-method.png" alt-text="Screenshot that shows payment method list in add credits window.":::

1. If you chose product key:
    - Enter the product key
    - Select **Validate**

1. If you chose credit card:
    - Select **Select payment method** to add a credit card or select an existing one.
    - Specify the credit amount you want to add.

1. Select **Apply**

## Usage details files comparison

Use the following information to find the mapping between the fields available in the v1 and v2 versions of the files from the Accounts portal. It also has the latest version of the usage details file in the Azure portal.

| V1 | V2 | Azure portal |
| --- | --- | --- |
| Additional Info | Additional Info | AdditionalInfo |
| Currency | Currency | BillingCurrency |
| Billing Period | Billing Period | BillingPeriodEndDate |
| Billing Period | Billing Period | BillingPeriodStartDate |
| Service | Consumed Service | ConsumedService |
| Value | Value | Cost |
| Usage Date | Usage Date | Date |
| Name | Meter Category | MeterCategory |
| ResourceGuid | Meter Id | MeterId |
| Region | Meter Region | MeterRegion |
| Resource | Meter Name | MeterName  |
| Type | Meter Sub-category | MeterSubcategory |
| Consumed | Consumed Quantity | Quantity |
| Component | Resource Group | ResourceGroup |
|   | Instance Id | ResourceId |
| Sub Region | Resource Location | ResourceLocation |
| Service Info 1 | Service Info 1 | ServiceInfo1 |
| Service Info 2 | Service Info 2 | ServiceInfo2 |
| Subscription ID | Subscription ID | SubscriptionId |
| Subscription Name | Subscription Name | SubscriptionName |
|   | Tags | Tags |
| Unit | Unit | UnitOfMeasure |
| | Rate | UnitPrice |

For more information about the fields available in the latest usage details file, see [Understand the terms in your Azure usage and charges file](../understand/understand-usage.md).

The following fields are from v1 and v2 versions of the files from the Accounts portal. They're no longer available in the latest usage details file.

| V1 | V2 |
| --- | --- |
| Order ID | Order ID |
| Description | Description |
| Billing Date(Anniversary Date) | Billing Date(Anniversary Date) |
| Offer Name | Offer Name |
| Service Name | Service Name |
| Subs Status | Subs Status |
| Subs Extra Status | Subs Extra Status |
| Provisioning Status | Provisioning Status |
| SKU | SKU |
| Included | Included Quantity |
| Billable | Overage Quantity |
| Within Commitment | Within Commitment |
| Commitment Rate | Commitment Rate |
| Overage | Overage |
| Component |  |

## Troubleshooting
We don't support virtual or prepaid cards. If you're getting errors when adding or updating a valid credit card, try opening your browser in private mode.

## Next steps
- Learn more about [analyzing unexpected charges](../understand/analyze-unexpected-charges.md)
