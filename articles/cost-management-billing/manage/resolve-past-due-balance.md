---
title: Past due balance email from Azure
description: Describes how to make payment if your Azure subscription has a past due balance
author: genlin
ms.reviewer: dcscontentpm
tags: billing
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 02/13/2020
ms.author: banders
---

# Resolve past due balance for your Azure subscription

This article applies to customers who signed up for Azure online with a credit card and have a Microsoft Online Services Program billing account. Learn how to [check your billing account type](#check-the-type-of-your-account). If you have a Microsoft Customer Agreement billing account, see [pay your bill for Microsoft Azure](../understand/pay-bill.md) instead.

If your payment isn't received or if we can't process your payment, you will get an email and see an alert in the Azure portal telling you that your subscription is past due. If your default payment method is credit card, the [Account Administrator](billing-subscription-transfer.md#whoisaa) can settle the outstanding charges in the Azure portal. If you pay by invoice (check/wire transfer), send your payment to the location listed at the bottom of your invoice.

> [!IMPORTANT]
> * If you have multiple subscriptions using the same credit card and they are all past due, you must pay the entire outstanding balance at once.
> * The credit card you use to settle the outstanding charges will become the new default payment method for all subscriptions that were using the failed payment method.

## Resolve past due balance in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) as the Account Admin.
1. Search for **Cost Management + Billing**.
1. Select the past due subscription from the **Overview** page.
1. In the **Subscription overview** page, click the red past due banner to settle the balance.
    > [!NOTE]
    > If you are not the Account Administrator, you will not be able to settle the balance.
1. In the new **Settle balance** page, click **Select payment method**.
    ![Screenshot that shows select payment method link](./media/resolve-past-due-balance/settle-balance-screen.png)

1. In the new blade on the right, select a credit card from the drop-down or add a new one by clicking the blue **Add new payment method** link. This credit card will become the active payment method for all subscriptions currently using the failed payment method.
     > [!NOTE]
     > * The total outstanding balance reflects outstanding charges across all Microsoft services using the failed payment method.
     > * If the selected payment method also has outstanding charges for Microsoft services, this will be reflected in the total outstanding balance. You must pay those outstanding charges, too.
1. Click **Pay**.

## Troubleshoot declined credit card

If your credit card charge is declined by your financial institution, please reach out to your financial institution to resolve the issue. Check with your bank to make sure:
- International transactions are enabled on the card.
- The card has sufficient credit limit or funds to settle the balance.
- Recurring payments are enabled on the card.

## Not getting billing email notifications?

If you're the Account Administrator, [check what email address is used for notifications](change-azure-account-profile.md). We recommend that you use an email address that you check regularly. If the email is right, check your spam folder.

## If I forget to pay, what happens?

The service is canceled and your resources are no longer available. Your Azure data is deleted 90 days after the service is terminated. To learn more, see [Microsoft Trust Center - How we manage your data](https://go.microsoft.com/fwLink/p/?LinkID=822930&clcid=0x409).

If you know your payment has been processed but your subscription is still disabled, contact [Azure Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Check the type of your account
[!INCLUDE [billing-check-mca](../../../includes/billing-check-account-type.md)]

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
