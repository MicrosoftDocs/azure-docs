---
title: Troubleshoot Azure payment issues
description: Resolving an issue when updating payment information account in the Azure portal.
author: bandersmsft
ms.reviewer: lishepar
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: troubleshooting
ms.date: 03/21/2024
ms.author: banders
---

# Troubleshoot Azure payment issues

You may experience an issue or error when you try to update the payment information account in the Microsoft Azure portal.

To resolve your issue, select the subject below which most closely resembles your error.

## My credit card was declined when I tried to sign up for Azure

To troubleshoot issues regarding a declined card, see [Troubleshoot a declined card at Azure sign-up](troubleshoot-declined-card.md).

## Unable to see subscriptions under my account to update the payment method

You might be using an email ID that differs from the one that is used for the subscriptions.

To troubleshoot this issue, see [No subscriptions found sign-in error for Azure portal](../troubleshoot-subscription/no-subscriptions-found.md).

## Unable to use a virtual or prepaid credit as a payment method.

Virtual or prepaid credit cards aren't accepted as payment for Azure subscriptions.

For more information, see [Troubleshoot a declined card at Azure sign-up](troubleshoot-declined-card.md).

## Unable to remove a credit card from a saved billing payment method

By design, you can't remove a credit card from the active subscription.

If an existing card has to be deleted, one of the following actions is required:

- A new card must be added to the subscription so that the old payment instrument can be successfully deleted.
- You can cancel the subscription to delete the subscription permanently and then remove the card.

## Unable to delete an old payment method after adding a new payment method

The new payment instrument might not be associated with the subscription. To help associate the payment instrument with the subscription, see [Add, update, or remove a credit card for Azure](../manage/change-credit-card.md).

## Unable to delete a payment method because of `Cannot delete payment method` error

The error occurs because of an outstanding balance. Clear any outstanding balances before you delete the payment method.

## Unable to make payment for a subscription

If you receive the error message: `Payment is past due. There is a problem with your payment method` or `We're sorry, the information cannot be saved. Close the browser and try again.`, then there's a pending payment on the card because the card was denied by your financial institution.

Verify that the credit card has a sufficient balance to make a payment. If it doesn't, use another card to make the payment, or reach out to your financial institution to resolve the issue.

Check with your bank for the following issues:

- International transactions aren't enabled.
- The card has a credit limit, and the balance must be settled.
- A recurring payment is enabled on the card.

## Unable to change payment method because of browser issues (browser doesn't respond, doesn't load, and so on)

Sign out of all active Azure sessions, and then follow the steps in the [Browse InPrivate in Microsoft Edge article](https://support.microsoft.com/help/4026200/microsoft-edge-browse-inprivate)  to start an InPrivate session within Microsoft Edge or Internet Explorer.

In the private session, follow the steps at [How to change a credit card](../manage/change-credit-card.md) to update or change the credit card information.

You can also try to do the following actions:

- Refresh your browser
- Use another browser
- Delete cached cookies

## My subscription is still disabled after updating the payment method.

The issue occurs because of an outstanding balance. Clear any outstanding balances before you delete the payment method.

## Unable to change payment method because of an XML error response page

You receive the message if you're using [the Azure portal](https://portal.azure.com/) to add a new credit card.

To add card details, sign-in to the Azure Account portal by using the account administrator's email address.

## Why does my invoice appear as unpaid when I've paid it?

- The invoice number on the remittance wasn't specified.
- You made one payment for multiple invoices.

Best practices:

- Submit one wire transfer payment per invoice.
- Specify the invoice number on the remittance.
- Send proof of payment, identification, and remittance details.

## Other help resources

Other troubleshooting articles for Azure Billing and Subscriptions

- [Declined card](troubleshoot-declined-card.md)
- [Subscription sign-in issues](../troubleshoot-subscription/troubleshoot-sign-in-issue.md)
- [No subscriptions found](../troubleshoot-subscription/no-subscriptions-found.md)
- [Enterprise cost view disabled](enterprise-mgmt-grp-troubleshoot-cost-view.md)

## Contact us for help

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- [Azure Billing documentation](../index.yml)