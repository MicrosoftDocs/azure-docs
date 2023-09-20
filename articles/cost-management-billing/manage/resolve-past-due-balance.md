---
title: Past due balance email from Azure
description: Describes how to make payment if your Azure subscription has a past due balance.
author: bandersmsft
ms.reviewer: lishepar
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 03/13/2023
ms.author: banders
ms.custom: references_regions
---

# Resolve past due balance for your pay-as-you-go Azure subscription

This article applies to customers who signed up for Azure online with a credit card and have a Microsoft Online Services Program billing account, also called pay-as-you go. If you're unsure of your billing account type, see [Check your billing account type](#check-the-type-of-your-account). 

If you have a Microsoft Customer Agreement billing account, see [Pay Microsoft Customer Agreement bill](../understand/pay-bill.md) instead.

You get an email and see an alert in the Azure portal when your payment isn't received or if we can't process your payment. Both inform you that your subscription is past due. The email contains a link that takes you to the Settle balance page.

[!INCLUDE [Pay by check](../../../includes/cost-management-pay-check.md)]

If your default payment method is credit card, the [Account Administrator](add-change-subscription-administrator.md#whoisaa) can settle the outstanding charges in the Azure portal. If you pay by invoice (wire transfer), send your payment to the location listed at the bottom of your invoice.

> [!IMPORTANT]
> * If you have multiple subscriptions using the same credit card and they are all past due, you must pay the entire outstanding balance at once.
> * The credit card you use to settle the outstanding charges will become the new default payment method for all subscriptions that were using the failed payment method.

## Resolve past due balance in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) as the Account Admin.
1. Search for **Cost Management + Billing**.
1. Select the past due subscription from the **Overview** page.
1. In the **Subscription overview** page, select the red past due banner to settle the balance.
    > [!NOTE]
    > If you are not the Account Administrator, you will not be able to settle the balance.
    - If your account is in good standing, you don't see any banners.
    - If your account has a bill ready to be paid, you see a blue banner that takes you to the Settle balance page. You also receive an email that has a link to the Settle balance page.
    - If your account is past due, you see a red banner that says your account is past due that takes you to the Settle balance page. You also receive an email that has a link to the Settle balance page.
1. In the new **Settle balance** page, select **Select payment method**.
1. In the new area on the right, select a credit card from the drop-down or add a new one by selecting the blue **Add new payment method** link. This credit card becomes the active payment method for all subscriptions currently using the failed payment method.
     > [!NOTE]
     > * The total outstanding balance reflects outstanding charges across all Microsoft services using the failed payment method.
     > * If the selected payment method also has outstanding charges for Microsoft services, this will be reflected in the total outstanding balance. You must pay those outstanding charges, too.
1. Select **Pay**.

## Settle balance might be Pay now

Users in the following countries/regions don't see the **Settle balance** option. Instead, they use the [Pay now](../understand/pay-bill.md#pay-now-in-the-azure-portal) option to pay their bill.

- `AT` - Austria
- `AU` - Australia
- `BE` - Belgium
- `BG` - Bulgaria
- `CA` - Canada
- `CH` - Switzerland
- `CZ` - Czech Republic
- `DE` - Germany
- `DK` - Denmark
- `EE` - Estonia
- `ES` - Spain
- `FI` - Finland
- `FR` - France
- `GB` - United Kingdom
- `GR` - Greece
- `HR` - Croatia
- `HU` - Hungary
- `IE` - Ireland
- `IT` - Italy
- `JP` - Japan
- `KR` - South Korea
- `LT` - Lithuania
- `LV` - Latvia
- `NL` - Netherlands
- `NO` - Norway
- `NZ` - New Zealand
- `PL` - Poland
- `PT` - Portugal
- `RO` - Romania
- `SE` - Sweden
- `SK` - Slovakia
- `TW` - Taiwan

## Troubleshoot declined credit card

If your financial institution declines your credit card charge, contact your financial institution to resolve the issue. Check with your bank to make sure:
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
