---
title: View your organization's Azure pricing | Microsoft Docs
description: Learn how to view and download pricing or estimate costs with your organization's pricing.
services: ''
documentationcenter: ''
author: adpick
manager: jureid
editor: ''
tags: billing

ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/22/2019
ms.author: banders
ms.custom: seodec18

---
# View your organization's Azure pricing

Azure customers with an Enterprise Agreement (EA) or [Microsoft Customer Agreement](#check-your-access-to-a-microsoft-customer-agreement) may view and download their pricing from the Azure portal. If you have a Microsoft Customer Agreement, see [View and download pricing for your billing profile](#View-and-download-pricing-for-your-billing-profile).

## View and download EA pricing

Depending on the policies set for your organization by the Enterprise Admin, only certain administrative roles provide access to your organization's EA pricing information. For more information, see [Understand Azure Enterprise Agreement administrative roles in Azure](billing-understand-ea-roles.md).

1. As an Enterprise Admin, sign in to the [Azure portal](https://portal.azure.com/).
1. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-ea-pricing/portal-cm-billing-search.png)

1. Under the billing account, select **Usage + charges**.

   ![Screenshot that shows usage and charges under Billing](./media/billing-ea-pricing/ea-pricing-usage-charges-nav.png)

1. Select ![Screenshot that shows Azure portal search](./media/billing-ea-pricing/download-icon.png) **Download** for the month.
1. Under **Price Sheet**, select **Download csv**.

   ![Screenshot that shows the price sheet download csv button](./media/billing-ea-pricing/download-ea-price-sheet.png)

## View and download pricing for your billing profile

You must be the Owner, Contributor, Reader, or Invoice manager of the billing profile to view and download pricing.

<!-- Not available for GA ### Download price sheets for the current billing period

1. Search on **Cost Management + Billing**.
2. Select a billing profile.
3. In the **Overview** blade, find the download links beneath the month-to-date charges.
4. If you want to see prices for the resources you're using this billing period, select **Invoice price sheet**.
5. If you want to see prices for all Azure services this billing period, select **Azure price sheet**. -->

<!--  ### Download price sheets for billed charges -->

1. Search on **Cost Management + Billing**.
2. Select a billing profile.
3. Select **Invoices**.
4. In the invoice grid, find the row of the invoice corresponding to the price sheet you want to download.
5. Click on the ellipsis at the end of the row.
6. If you want to see prices for the services in the selected invoice, select **Invoice price sheet**.
7. If you want to see prices for all Azure services for the given billing period, select **Azure price sheet**.

## Estimate costs with the Azure pricing calculator

<!-- ### Estimate costs for your Enterprise Agreement -->

If you're an EA customer, you may also use your organization’s EA pricing to estimate costs with the Azure pricing calculator.

1. Go to the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).
1. On the top right, select **Sign in**.
1. Under **Programs and Offer** > **Licensing Program**, select **Enterprise Agreement (EA)**.
1. Under **Programs and Offer** > **Selected agreement**, select **None selected**.

    ![Screenshot that shows the price sheet download csv button](./media/billing-ea-pricing/ea-pricing-calculator-estimate.png)

1. Choose the organization.
1. Select **Apply**.
1. Search and add products to your estimate.
1. Estimated prices shown are based on pricing for the organization you selected.

<!-- ### Estimate costs for your billing profile -->

## Check your access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Next steps

If you're an EA customer, see:

- [Manage access to your EA billing information for Azure](billing-manage-access.md)
- [How to get your Azure billing invoice and daily usage data](billing-download-azure-invoice-daily-usage-date.md)
- [Understand your bill for Enterprise Agreement customers](billing-understand-your-bill-ea.md)

If you have a Microsoft Customer Agreement, see:

<!-- - [Understand roles for Microsoft customer Agreement](get link for Amber's doc) -->

- [How to get your Azure billing invoice and daily usage data](billing-download-azure-invoice-daily-usage-date.md)
- [View and download tax documents for your billing profile](billing-download-tax-document-mca.md)
- [Understand the charges on your billing profile's invoice](billing-understand-your-bill-mca.md)
