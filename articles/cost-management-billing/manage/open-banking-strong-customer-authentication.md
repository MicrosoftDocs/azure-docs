---
title: Open Banking (PSD2) and Strong Customer Authentication (SCA) for Azure customers
description: This article explains why multifactor authentication is required for some Azure purchases and how to complete authentication.
author: bandersmsft
ms.reviewer: lishepar
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 05/14/2024
ms.author: banders
---

# Open Banking (PSD2) and Strong Customer Authentication (SCA) for Azure customers

As of September 14, 2019, banks in the 31 countries/regions of the [European Economic Area](https://en.wikipedia.org/wiki/European_Economic_Area) are required to verify the identity of the person making an online purchase before the payment is processed. This verification requires multifactor authentication to help ensure your online purchases are secure and protected. The date for this verification requirement is delayed for some countries/regions. For more information, see the [Microsoft FAQ about PSD2](https://support.microsoft.com/account-billing/payment-services-directive-2-and-strong-customer-authentication-3527fa95-9c6a-5f6f-d8e6-f27f33aba50e).

## What PSD2 means for Azure customers

If you pay for Azure with a credit card issued by a bank in the [European Economic Area](https://en.wikipedia.org/wiki/European_Economic_Area), you might be required to complete multifactor authentication for the payment method of your account. You might be prompted to complete the multifactor authentication challenge when signing up your Azure account or upgrading your Azure account—even if you aren't making a purchase at the time. You might also be asked to provide multifactor authentication when you change the payment method of your Azure account, remove your spending cap, or make an immediate payment from the Azure portal—such as settling outstanding balances or purchasing Azure credits.

If your bank rejects your monthly Azure charges, you get a past due email from Azure with instructions to fix it. You can complete the multifactor authentication challenge and settle your outstanding charges in the Azure portal.

## Complete multifactor authentication in the Azure portal

The following sections describe how to complete multifactor authentication in the Azure portal. Use the information that applies to you.

### Change the active payment method of your Azure account

You can change the active payment method of your Azure account by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as the Account Administrator and navigate to **Cost Management + Billing**.
2. In the **Overview** page, select the corresponding subscription from the **My subscriptions** grid.
3. Under 'Billing', select **Payment methods**. You can add a new credit card or set an existing card as the active payment method for the subscription. If your bank requires multifactor authentication, you're prompted to complete an authentication challenge during the process.

For more information, see [Add, update, or remove a credit card for Azure](change-credit-card.md).

### Settle outstanding charges for Azure services

If your bank rejects the charges, your Azure account status changes to **Past due** in the Azure portal. You can check the status of your account by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as the Account Administrator.
2. Search on **Cost Management + Billing.**
3. On the **Cost Management + Billing** **Overview** page, review the status column in the **My subscriptions** grid.
4. If your subscription is labeled **Past due**, select **Settle balance**. You're prompted to complete multifactor authentication during the process.

### Settle outstanding charges for Marketplace and reservation purchases

Marketplace and reservation purchases are billed separately from Azure services. If your bank rejects the Marketplace or reservation charges, your invoice becomes past due and you get the option to **Pay now** in the Azure portal. You can pay for past due Marketplace and reservation invoices by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as the Account Administrator.
2. Search on **Cost Management + Billing.**
3. Under 'Billing', select **Invoices**.
5. In the subscription drop-down filter, select the subscription associated with your Marketplace or reservation purchase.
6. In the invoices grid, review the type column. If the type is **Azure Marketplace and Reservations**, then you have a **Pay now** link if the invoice is due or past due. If you don't see **Pay now**, it means you already paid your invoice. You get prompted to complete multifactor authentication during Pay now.

## Related content

- See [Resolve past due balance for your Azure subscription](resolve-past-due-balance.md) if you need to pay an Azure bill.
