---
title: Troubleshoot a declined card
description: Resolve declined credit card problems in the Azure portal.
author: bandersmsft
ms.reviewer: lishepar
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: troubleshooting 
ms.date: 04/26/2023
ms.author: banders
---

# Troubleshoot a declined card

You may experience an issue or error in which a card is declined at Azure sign-up or after you've started using your Azure subscription.

To resolve your issue, select one of the following topics that most closely resembles your error.

## The card is not accepted for your country/region

When you choose a card, Azure displays the card options that are valid in the country/region that you select. Contact your bank or card issuer to verify that your credit card is enabled for international transactions. For more information about supported countries/regions and currencies, see the [Azure Purchase FAQ](https://azure.microsoft.com/pricing/faq/).

> [!Note]
> - American Express credit cards are not currently supported as a payment instrument in India. We have no time frame as to when it may be an accepted form of payment.
> - Credit cards are accepted and debit cards are accepted by most countries or regions.
>    - Hong Kong Special Administrative Region and Brazil only support credit cards.
>    - India supports debit and credit cards through Visa and Mastercard.

## You're using a virtual or prepaid card

Prepaid and virtual cards are not accepted as payment for Azure subscriptions.

## Your credit information is inaccurate or incomplete

The name, address, and CVV code that you enter must match exactly what's printed on the card.

## The card is inactive or blocked

Contact your bank to make sure that your card is active.

You may be experiencing other sign-up issues

For more information about how to troubleshoot Azure sign-up issues, see the following article:

[You can't sign-up for Azure in the Azure portal](troubleshoot-azure-sign-up.md)

## You represent a business that doesn't want to pay by card

If you represent a business, you can use the invoice payment method (wire transfer) to pay for your Azure subscription. After you set up the account to pay by invoice, you can't change to another payment option, unless you have a Microsoft Customer Agreement and signed up for Azure through the Azure website.

For more information about how to pay by invoice, see [Submit a request to pay Azure subscription by invoice](pay-by-invoice.md).

## Your card information is outdated

For information about how to manage your card information, including changing or removing a card, see [Add, update, or remove a credit for Azure](change-credit-card.md).

## Card not authorized for service consumption (threshold billing)

A billing threshold is a level of spending that, when met, triggers an authorization to the primary payment method associated to your Azure account. If the service consumption surpasses the billing threshold, Microsoft may attempt an authorization on the primary payment method. If the bank approves the authorization, it will be immediately reversed. There will be no settlement record on your bank statement. 

However, if the authorization on the card is declined, you're asked to update the primary payment method in order to continue using the services. For information about how to manage your card information, including changing or removing a card, see [Add, update, or remove a credit card](change-credit-card.md).

For more information about threshold billing, see [Troubleshoot threshold billing](troubleshoot-threshold-billing.md).

## Other help resources

Other troubleshooting articles for Azure Billing and Subscriptions

- [Sign-up issues](troubleshoot-azure-sign-up.md)
- [Subscription sign-in issues](troubleshoot-sign-in-issue.md)
- [No subscriptions found](no-subscriptions-found.md)
- [Enterprise cost view disabled](enterprise-mgmt-grp-troubleshoot-cost-view.md)

## Contact us for help

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- [Azure Billing documentation](../index.yml)