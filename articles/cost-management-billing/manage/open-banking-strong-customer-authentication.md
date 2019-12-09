---
title: Open Banking (PSD2) and Strong Customer Authentication (SCA) for Azure customers
description: This article explains why multi-factor authentication is required for some Azure purchases and how to complete authentication.
author: bandersmsft
manager: jureid
tags: billing
ms.service: cost-management-billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/10/2019
ms.author: banders

---
# Open Banking (PSD2) and Strong Customer Authentication (SCA) for Azure customers

As of September 14, 2019, banks in the 31 countries of the [European Economic Area](https://en.wikipedia.org/wiki/European_Economic_Area) are required to verify the identity of the person making an online purchase before the payment is processed. This verification requires multi-factor authentication to help ensure your online purchases are secure and protected. The date for this verification requirement will be delayed for some countries. For more information, see the [Microsoft FAQ about PSD2](https://support.microsoft.com/en-us/help/4517854?preview).

## What PSD2 means for Azure customers

If you pay for Azure with a credit card issued by a bank in the[European Economic Area](https://en.wikipedia.org/wiki/European_Economic_Area), you might be required to complete multi-factor authentication for the payment method of your account. You may be prompted to complete the multi-factor authentication challenge when signing up your Azure account or upgrading your Azure account—even if you are not making a purchase at the time. You may also be asked to provide multi-factor authentication when you change the payment method of your Azure account, remove your spending cap, or make an immediate payment from the Azure portal— such as settling outstanding balances or purchasing Azure credits.

If your bank rejects your monthly Azure charges, you'll get a past due email from Azure with instructions to fix it. You can complete the multi-factor authentication challenge and settle your outstanding charges in the Azure portal.

## Complete multi-factor authentication in the Azure portal

The following sections describe how to complete multi-factor authentication in the Azure portal. Use the information that applies to you.

### Change the active payment method of your Azure account

You can change the active payment method of your Azure account by following these steps:

1. Sign into the [Azure portal](https://portal.azure.com) as the Account Administrator and navigate to **Cost Management + Billing**.
2. In the **Overview** page, select the corresponding subscription from the **My subscriptions** grid.
3. Under 'Billing', select **Payment methods**. You can add a new credit card or set an existing card as the active payment method for the subscription. If your bank requires multi-factor authentication, you're prompted to complete an authentication challenge during the process.

For more details, see [Add, update, or remove a credit card for Azure](change-credit-card.md).

### Settle outstanding charges for Azure services

If your bank rejects the charges, your Azure account status will change to **Past due** in the Azure portal. You can check the status of your account by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) as the Account Administrator.
2. Search on **Cost Management + Billing.**
3. On the **Cost Management + Billing** **Overview** page, review the status column in the **My subscriptions** grid.
4. If your subscription is labeled **Past due**, click **Settle balance**. You're prompted to complete multi-factor authentication during the process.

### Settle outstanding charges for Marketplace and reservation purchases

Marketplace and reservation purchases are billed separately from Azure services. If your bank rejects the Marketplace or reservation charges, your invoice status will show as **Past due** in the Azure portal. You can check the status of your Marketplace and reservation invoices by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) as the Account Administrator.
2. Search on **Cost Management + Billing.**
3. Under 'Billing', select **Invoices**.
4. Click on the **Azure Marketplace and reservations** tab on the right.
5. Select the corresponding subscription.
6. In the invoices grid, review the status column. If the invoice is **Due** or **Past due**, click **Pay now.** You're prompted to complete multi-factor authentication during the process.

## Next steps
- See [Resolve past due balance for your Azure subscription](resolve-past-due-balance.md) if you need to pay an Azure bill.
