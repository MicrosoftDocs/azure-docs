---
title: Troubleshoot Azure payment issues
description: Resolving an issue when updating payment information account in the Microsoft Azure portal or account center.
services: azure
author: v-miegge
manager: dcscontentpm
editor: v-jesits
tags: billing
ms.service: cost-management-billing
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/12/2019
ms.author: jaserano
---

# Troubleshoot Azure payment issues

You may experience an issue or error when you try to update the payment information account in either the Microsoft Azure portal, or the Azure account center.

To resolve your issue, select the topic below which most closely resembles your error.

## Unable to remove a credit card from a saved billing payment method

By design you cannot remove a credit card from the Active subscription.

If an existing card has to be deleted, either a new card must be added to the subscription so that the old payment instrument can be successfully deleted, or you must cancel the subscription. This deletes the subscription permanently and removes the card.

## Unable to delete an old payment method after adding a new payment method

The new payment instrument might not be associated with the subscription. To help associate the payment instrument with the subscription, see [Add, update, or remove a credit or debit card for Azure](change-credit-card.md).

To troubleshoot issues regarding a declined card, see [How to troubleshoot a declined card at Azure sign-up](troubleshoot-declined-card.md).

## Unable to delete a payment method because of *Cannot delete payment method* error

This occurs because of an outstanding balance. Clear any outstanding balances before you delete the payment method.

## Unable to see subscriptions under my account to update the payment method

You might be using an email ID that differs from the one that is used for the subscriptions.

To troubleshoot this issue, see [No subscriptions found sign-in error for Azure portal or Azure account center](no-subscriptions-found.md).

## Unable to make payment for a subscription

If you receive the error message: *Payment is past due. There is a problem with your payment method* or *We're sorry, the information cannot be saved. Close the browser and try again.*, then there is a pending payment on the card because the card was denied by your financial institution.

Verify that the credit card has a sufficient balance to make a payment. If it does not, use another card to make the payment, or reach out to your financial institution to resolve the issue.

Please check with your bank for the following issues:

- International transactions are not enabled.
- The card has a credit limit, and the balance must be settled.
- A recurring payment is enabled on the card.

## Unable to change payment method because of browser issues (browser does not respond, does not load, and so on)

Log out of all active Azure sessions, and then follow the steps in the [Browse InPrivate in Microsoft Edge article](https://support.microsoft.com/help/4026200/microsoft-edge-browse-inprivate)  to start an InPrivate session within Microsoft Edge or Internet Explorer.

In the private session, follow the steps at [How to change a credit card](change-credit-card.md) to update or change the credit card information.

You can also try to do the following:

- Refresh your browser
- Use another browser
- Delete cached cookies

## My subscription is still disabled after updating the payment method.

This issue occurs because of an outstanding balance. Clear any outstanding balances before you delete the payment method.

## Unable to change payment method because of an XML error response page

You receive this message if you are using [the Azure portal](https://portal.azure.com/) to add a new credit card.

To add card details, sign-in to the Azure Account portal by using the account administrator's email address.

## Additional help resources

Other troubleshooting articles for Azure Billing and Subscriptions

- [Declined card](troubleshoot-declined-card.md)
- [Subscription sign-in issues](troubleshoot-sign-in-issue.md)
- [No subscriptions found](no-subscriptions-found.md)
- [Enterprise cost view disabled](enterprise-mgmt-grp-troubleshoot-cost-view.md)

## Contact us for help

If you have questions or need help, [create a support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- [Azure Billing documentation](../../billing/index.md)
