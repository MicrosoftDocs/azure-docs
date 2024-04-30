---
title: Troubleshoot cant view invoice in the Azure portal
description: Resolving an issue when trying to view your invoice in the Azure portal.
services: cost-management-billing
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: troubleshooting
ms.date: 03/21/2024
ms.author: banders
---

# Troubleshoot issues while trying to view invoice in the Azure portal

You may experience issues when you try to view your invoice in the Azure portal. This short guide will discuss some common issues.
 
## Common issues and solutions

#### <a name="subnotfound"></a> You see the message “We can’t display the invoices for your subscription. This typically happens when you sign in with an email, which doesn’t have access to view invoices. Check you’ve signed in with the correct email address. If you are still seeing the error, see Why you might not see an invoice.”

This happens when the identity that you used to sign in does not have access to the subscription.

To resolve this issue, try one of the following options: 

**Verify that you're signed in with the correct email address:**

Only the email that has the account administrator role for the subscription can view its invoice. Verify that you've signed in with the correct email address. The email address is displayed in the email that you received when your invoice is generated.  

  :::image type="content" border="true" source="./media/troubleshoot-cant-find-invoice/invoice-email.png" alt-text="Screenshot that shows invoice email.":::

**Verify that you're signed in with the correct account:**

Some customers have two accounts with the same email address - a work or a school account and a personal account. Typically, only one of their accounts has permission to view invoices. You might have two accounts with your email address. If you sign in with the account that doesn't have permission, you would not see the invoice. To identify if you have multiple accounts and use a different account, follow the steps below:

1. Sign in to the [Azure portal](https://portal.azure.com) in an InPrivate/Incognito window.
1. If you have multiple accounts with the same email, then you'll be prompted to select either **Work or school account** or **Personal account**. Select one of the accounts then follow the [instructions here to view your invoice](../understand/download-azure-invoice.md#download-your-mosp-azure-subscription-invoice).  

    :::image type="content" border="true" source="./media/troubleshoot-cant-find-invoice/two-accounts.png" alt-text="Screenshot that shows account selection.":::

1. Try other account, if you still can't view the invoice in the Azure portal.

**Verify that you're signed in to the correct Microsoft Entra tenant:**

Your billing account and subscription is associated with a Microsoft Entra tenant. If you're signed in to an incorrect tenant, you won't see the invoice for your subscription. Try the following steps to switch tenants in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select your email address from the top-right of the page.
1. Select Switch directory.  

    :::image type="content" border="true" source="./media/troubleshoot-cant-find-invoice/select-switch-tenant.png" alt-text="Screenshot that shows selecting switch directory.":::

1. Select a tenant from the All Directories section. If you don't see All Directories section, you don't have access to multiple tenants.  

    :::image type="content" border="true" source="./media/troubleshoot-cant-find-invoice/select-another-tenant.png" alt-text="Screenshot that shows selecting another directory.":::

#### <a name="cantsearchinvoice"></a>You couldn't find the invoice that you see on your credit card statement

You find a charge on your credit card **Microsoft Gxxxxxxxxx**. You can find all other invoices in the portal but not Gxxxxxxxxx. This happens when the invoice belongs to a different subscription or billing profile. Follow the steps below to view the invoice.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for the invoice number in the Azure portal search bar.
1. Select **View your invoice**.  

    :::image type="content" border="true" source="./media/troubleshoot-cant-find-invoice/search-invoice.png" alt-text="Screenshot that shows searching for invoice.":::

## Contact us for help

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- [View and download your Azure invoice](../understand/download-azure-invoice.md)
- [View and download your Azure usage and charges](../understand/download-azure-daily-usage.md)
- [No subscriptions found sign in error for Azure portal](../troubleshoot-subscription/no-subscriptions-found.md)
