---
title: View and download your organization's Azure pricing
description: Learn how to view and download pricing or estimate costs with your organization's pricing.
author: bandersmsft
manager: jureid
tags: billing
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/01/2019
ms.author: banders
ms.custom: seodec18
---

# View and download your organization's Azure pricing

Azure customers with an Azure Enterprise Agreement (EA) or [Microsoft Customer Agreement](#check-your-access-to-a-microsoft-customer-agreement) may view and download their pricing in the Azure portal.

## EA pricing

Depending on the policies set for your organization by the Enterprise Admin, only certain administrative roles provide access to your organization's EA pricing information. For more information, see [Understand Azure Enterprise Agreement administrative roles in Azure](billing-understand-ea-roles.md).

1. As an Enterprise Admin, sign-in to the [Azure portal](https://portal.azure.com/).
1. Search for *Cost Management + Billing*.

   ![Screenshot that shows Azure portal search](./media/billing-ea-pricing/portal-cm-billing-search.png)

1. Under the billing account, select **Usage + charges**.

   ![Screenshot that shows usage and charges under Billing](./media/billing-ea-pricing/ea-pricing-usage-charges-nav.png)

1. Select ![Screenshot that shows Azure portal search](./media/billing-ea-pricing/download-icon.png) **Download** for the month.

1. Under **Price Sheet**, select **Download csv**.

   ![Screenshot that shows the price sheet download csv button](./media/billing-ea-pricing/download-ea-price-sheet.png)

## Microsoft Customer Agreement pricing

You must be the billing profile owner, contributor, reader, or invoice manager to view and download pricing. To learn more about billing roles for Microsoft Customer Agreements, see [Billing profile roles and tasks](billing-understand-mca-roles.md#billing-profile-roles-and-tasks).

### Download price sheets for the current billing period

1. Sign-in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.
1. Select a billing profile. Depending on your access, you might need to select a billing account first.
1. In the **Overview** area, find the download links beneath the month-to-date charges.
1. Select **Azure price sheet**.
![Screenshot that shows download from Overview](./media/billing-ea-pricing/open-pricing.png)

### Download price sheets for billed charges

1. Sign-in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.
1. Select a billing profile. Depending on your access, you might need to select a billing account first.
1. Select **Invoices**.
1. In the invoice grid, find the row of the invoice corresponding to the price sheet you want to download.
1. Click the ellipsis (`...`) at the end of the row.
![Screenshot that shows the ellipsis selected](./media/billing-ea-pricing/billingprofile-invoicegrid.png)

1. If you want to see prices for the services in the selected invoice, select **Invoice price sheet**.
1. If you want to see prices for all Azure services for the given billing period, select **Azure price sheet**.

![Screenshot that shows context menu with price sheets](./media/billing-ea-pricing/contextmenu-pricesheet.png)

## Estimate costs with the Azure pricing calculator

You may also use your organization’s pricing to estimate costs with the Azure pricing calculator.

1. Go to the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).
1. On the top right, select **Sign in**.
1. Under **Programs and Offer** > **Licensing Program**, select **Enterprise Agreement (EA)**.
1. Under **Programs and Offer** > **Selected agreement**, select **None selected**.

    ![Screenshot that shows the price sheet download csv button](./media/billing-ea-pricing/ea-pricing-calculator-estimate.png)

1. Choose the organization.
1. Select **Apply**.
1. Search for and then add products to your estimate.
1. Estimated prices shown are based on pricing for the organization you selected.

## Check your access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Next steps

If you're an EA customer, see:

- [Manage access to your EA billing information for Azure](billing-manage-access.md)
- [View and download your Microsoft Azure invoice](billing-download-azure-invoice.md)
- [View and download your Microsoft Azure usage and charges](billing-download-azure-daily-usage.md)
- [Understand your bill for Enterprise Agreement customers](billing-understand-your-bill-ea.md)

If you have a Microsoft Customer Agreement, see:

- [Understand the terms in your price sheet for a Microsoft Customer Agreement](billing-mca-understand-pricesheet.md)
- [View and download your Microsoft Azure invoice](billing-download-azure-invoice.md)
- [View and download your Microsoft Azure usage and charges](billing-download-azure-daily-usage.md)
- [View and download tax documents for your billing profile](billing-mca-download-tax-document.md)
- [Understand the charges on your billing profile's invoice](billing-mca-understand-your-bill.md)
