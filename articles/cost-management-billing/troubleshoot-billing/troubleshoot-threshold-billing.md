---
title: Troubleshoot threshold billing
description: Resolve threshold billing problems.
author: bandersmsft
ms.reviewer: ragrover
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: troubleshooting
ms.date: 03/21/2024
ms.author: banders
---

# Troubleshoot threshold billing

A billing threshold is a level of spending that, when met, triggers an authorization to the primary payment method associated to your Azure account. If the service consumption surpasses the billing threshold, Microsoft may attempt an authorization on the primary payment method. If the bank approves the authorization, it will be immediately reversed. There will be no settlement record on your bank statement.

However, if the authorization on the card is declined, you're asked to update the primary payment method in order to continue using the services. For information about how to manage your card information, including changing or removing a card, see [Add, update, or remove a credit card](../manage/change-credit-card.md).

## How am I notified by Microsoft for a threshold billing authorization?

If the payment authorization is approved by the bank, it will immediately be reversed. You won't receive a notification. However, if the payment authorization is declined, you'll receive an email and an Azure portal notification asking you to update your payment method before your account is disabled.

## When does Microsoft release withholding funds on my credit card?

Microsoft immediately reverses all threshold billing authorizations after receiving a bank approval. Microsoft currently only charges the card when the invoice is due. If your bank doesn't release the funds immediately, the card issuer (such as Visa, MasterCard, and American Express) releases the authorization within 30 calendar days.

## Do free trial accounts that upgrade to Pay-As-You-Go receive billing thresholds?

Yes, free trial accounts that upgrade to Pay-As-You-Go will receive billing thresholds.

## Which services (when consumed) count towards my billing threshold?

All Microsoft services count towards a customer's billing threshold.

## How do I check my current consumption level?

Azure customers can view their current usage levels in Cost Management. For more information about viewing your current Azure costs, see [Start using Cost analysis](../costs/quick-acm-cost-analysis.md).

## When there are multiple payment methods (with multiple billing profiles) linked to a single billing account, which one is authorized?

Microsoft only authorizes the default payment method on the customer account.

## Contact us for help

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- If your card was declined and you need assistance with troubleshooting, see [Troubleshoot a declined card](troubleshoot-declined-card.md).