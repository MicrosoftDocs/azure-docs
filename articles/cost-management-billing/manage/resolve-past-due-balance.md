---
title: Resolve a past-due balance your pay-as-you-go Azure subscription
description: Learn how to make a payment if your Azure subscription has a past-due balance.
author: bandersmsft
ms.reviewer: lishepar
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 01/08/2024
ms.author: banders
ms.custom: references_regions
---

# Resolve a past-due balance for your pay-as-you-go Azure subscription

This article applies to customers who signed up for Azure online with a credit card and have a Microsoft Online Subscription Program billing account. This type of account is also called a *pay-as-you-go* account. If you're unsure of your billing account type, see [Check the type of your account](#check-the-type-of-your-account) later in this article.

If you have a Microsoft Customer Agreement billing account, see [Pay your Microsoft Customer Agreement bill](../understand/pay-bill.md) instead.

If your payment isn't received or if we can't process your payment, you get an email and see an alert in the Azure portal. Both inform you that your subscription is past due and provide a link to the **Settle balance** pane in the portal.

If your default payment method is credit card, the [account administrator](add-change-subscription-administrator.md#whoisaa) can settle the outstanding charges in the portal. If you pay by invoice (wire transfer), send your payment to the location shown at the bottom of your invoice.

> [!IMPORTANT]
> If you have multiple subscriptions that use the same credit card and they're all past due, you must pay the entire outstanding balance at once.
>
> The credit card that you use to settle the outstanding charges becomes the new default payment method for all subscriptions that used the failed payment method.

## Resolve a past-due balance in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) as the account administrator.
1. Search for and select **Cost Management + Billing**.
1. On the **Overview** pane, select the past-due subscription.
1. On the **Subscription overview** pane, select the red banner that says your account is past due. Selecting the banner opens the **Settle balance** pane.

    > [!NOTE]
    > - If you're not the account administrator, you can't settle the balance.
    > - If your account has a bill ready to be paid, you see a blue banner that also takes you to the **Settle balance** pane.
    > - If your account is in good standing, no banners appear.
1. Choose **Select payment method**.
1. In the new area on the right, select a credit card from the dropdown list, or add a new one by selecting the blue **Add new payment method** link. This credit card becomes the active payment method for all subscriptions that currently use the failed payment method.

    > [!NOTE]
    > The total outstanding balance reflects outstanding charges across all Microsoft services that use the failed payment method.
    >
    > If the selected payment method also has outstanding charges for Microsoft services, the total outstanding balance reflects these charges. You must pay those charges too.
1. Select **Pay**.

### Regional considerations

Users in the following countries/regions don't have the **Settle balance** option. Instead, they use the [Pay now](../understand/pay-bill.md#pay-now-in-the-azure-portal) option to pay their bill.

- `AT`: Austria
- `AU`: Australia
- `BE`: Belgium
- `BG`: Bulgaria
- `CA`: Canada
- `CH`: Switzerland
- `CZ`: Czech Republic
- `DE`: Germany
- `DK`: Denmark
- `EE`: Estonia
- `ES`: Spain
- `FI`: Finland
- `FR`: France
- `GB`: United Kingdom
- `GR`: Greece
- `HR`: Croatia
- `HU`: Hungary
- `IE`: Ireland
- `IT`: Italy
- `JP`: Japan
- `KR`: South Korea
- `LT`: Lithuania
- `LV`: Latvia
- `NL`: Netherlands
- `NO`: Norway
- `NZ`: New Zealand
- `PL`: Poland
- `PT`: Portugal
- `RO`: Romania
- `SE`: Sweden
- `SK`: Slovakia
- `TW`: Taiwan

## Troubleshoot a declined credit card

If your credit card charge is declined, contact your bank to resolve the problem. Check with your bank to make sure:

- International transactions are enabled on the card.
- The card has sufficient credit limit or funds to settle the balance.
- Recurring payments are enabled on the card.

## Check the type of your account

[!INCLUDE [billing-check-mca](../../../includes/billing-check-account-type.md)]

## Frequently asked questions

### Why am I not getting billing email notifications?

If you're the account administrator, [check what email address is used for notifications](change-azure-account-profile.yml). We recommend that you use an email address that you check regularly. If the email is right, check your spam folder.

### If I forget to pay, what happens?

The service is canceled and your resources are no longer available. Your Azure data is deleted 90 days after the service ends. To learn more, see [What happens to your data if you leave the service](https://go.microsoft.com/fwLink/p/?LinkID=822930&clcid=0x409) in the Microsoft Trust Center.

If you know that your payment was processed but your subscription is still disabled, contact [Azure support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
