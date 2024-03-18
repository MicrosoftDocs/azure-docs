---
title: View and download your organization's Azure pricing
description: Learn how to view and download pricing or estimate costs with your organization's pricing.
author: bandersmsft
ms.reviewer: paagraw
ms.service: cost-management-billing
ms.subservice: enterprise
ms.topic: conceptual
ms.date: 12/08/2023
ms.author: banders
---

# View and download your organization's Azure pricing

Azure customers with an Azure Enterprise Agreement (EA), Microsoft Customer Agreement (MCA), or Microsoft Partner Agreement (MPA) can view and download their pricing in the Azure portal. [Learn how to check your billing account type](#check-your-billing-account-type).

## Download pricing for an Enterprise Agreement

Depending on the policies set for your organization by the Enterprise Admin, only certain administrative roles provide access to your organization's EA pricing information. For more information, see [Understand Azure Enterprise Agreement administrative roles in Azure](understand-ea-roles.md).

1. As an Enterprise Admin, sign-in to the [Azure portal](https://portal.azure.com/).
1. Search for *Cost Management + Billing*.  
    :::image type="content" source="./media/ea-pricing/portal-cm-billing-search.png" alt-text="Screenshot that shows Azure portal search." lightbox="./media/ea-pricing/portal-cm-billing-search.png" :::
1. Select a billing profile. Depending on your access, you might need to select a billing account first.
1. Select **Usage + Charges** from the navigation menu.  
    :::image type="content" source="./media/ea-pricing/ea-pricing-usage-charges-nav.png" alt-text="Screenshot that shows usage and charges under Billing." lightbox="./media/ea-pricing/ea-pricing-usage-charges-nav.png" :::
1. Select :::image type="content" border="true" source="./media/ea-pricing/download-icon.png" alt-text="Screenshot of the Download symbol."::: **Download** for the month.
1. On the Download Usage + Charges page, under Price Sheet, select **Prepare document**. It could take a while to prepare your file.  
    :::image type="content" source="./media/ea-pricing/download-enterprise-agreement-price-sheet-01.png" alt-text="Screenshot shows the Download Usage + Charges options." lightbox="./media/ea-pricing/download-enterprise-agreement-price-sheet-01.png":::
1. When the file is ready to download, select **Download Azure price sheet**.

For billing periods January 2023 onwards, a new version of the Azure price sheet is available for download. The new version features a new schema. It's a .ZIP file to support large amounts of data.

Azure reservation pricing is available in the Azure Price Sheet for the current billing period. If you want to maintain an ongoing record of Azure reservation pricing, we recommend that you download your Azure Price Sheet for each billing period.

## Download pricing for an MCA or MPA account

If you have an MCA, you must be the billing profile owner, contributor, reader, or invoice manager to view and download pricing. If you have an MPA, you must have the Global Admin and Admin Agent role in the partner organization to view and download pricing.

### Download price sheets for billed charges

1. Sign-in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.
1. Select a billing profile. Depending on your access, you might need to select a billing account first.
1. Select **Invoices**.
1. In the invoice grid, find the row of the invoice corresponding to the price sheet you want to download.
1. Select the ellipsis (`...`) at the end of the row.  
    :::image type="content" source="./media/ea-pricing/billingprofile-invoicegrid-new.png" alt-text="Screenshot that shows the ellipsis selected." lightbox="./media/ea-pricing/billingprofile-invoicegrid-new.png" :::
1. If you want to see prices for the services in the selected invoice, select **Invoice price sheet**.
1. If you want to see prices for all Azure services for the given billing period, select **Azure price sheet**.  
    :::image type="content" source="./media/ea-pricing/contextmenu-pricesheet01.png" alt-text="Screenshot that shows context menu with price sheets." lightbox="./media/ea-pricing/contextmenu-pricesheet01.png" :::
1. Azure prepares the price sheet. When the file is ready, it downloads automatically.

### Download usage and price sheet for the current billing period

If you have an MCA, you can download pricing for the current billing period at the billing profile scope.

1. Sign-in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.
1. Select a billing profile. Depending on your access, you might need to select a billing account first.
1. In the left navigation menu, select **Billing profiles**.
1. On the Billing profiles page, select a billing profile.
1. At the bottom of the page under **Shortcuts**, select **Download usage and prices**.
1. On the Downloads page, select **Download Azure price sheet for *Month* *Year***.  
    :::image type="content" source="./media/ea-pricing/download-price-sheet-month-year.png" alt-text="Screenshot that shows navigation to Download price sheet." lightbox="./media/ea-pricing/download-price-sheet-month-year.png":::
1. Azure prepares the price sheet. When the file is ready, it downloads automatically.

## Estimate costs with the Azure pricing calculator

You can also use your organization’s pricing to estimate costs with the Azure pricing calculator.

1. Go to the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).
1. On the top right, select **Sign in**.
1. Under **Programs and Offer** > **Licensing Program**, select **Enterprise Agreement (EA)**.
1. Under **Programs and Offer** > **Selected agreement**, select **None selected**.  
    :::image type="content" source="./media/ea-pricing/ea-pricing-calculator-estimate.png" alt-text="Screenshot showing the Programs and Offers available." lightbox="./media/ea-pricing/ea-pricing-calculator-estimate.png" :::
1. Choose the organization.
1. Select **Apply**.
1. Search for and then add products to your estimate.
1. Estimated prices shown are based on pricing for the organization you selected.

## Check your billing account type
[!INCLUDE [billing-check-account-type](../../../includes/billing-check-account-type.md)]

## Next steps

If you're an EA customer, see:

- [Manage access to your EA billing information for Azure](manage-billing-access.md)
- [View and download your Microsoft Azure invoice](../understand/download-azure-invoice.md)
- [View and download your Microsoft Azure usage and charges](../understand/download-azure-daily-usage.md)
- [Understand your bill for Enterprise Agreement customers](../understand/review-enterprise-agreement-bill.md)

If you have a Microsoft Customer Agreement, see:

- [Understand the terms in your price sheet for a Microsoft Customer Agreement](mca-understand-pricesheet.md)
- [View and download your Microsoft Azure invoice](../understand/download-azure-invoice.md)
- [View and download your Microsoft Azure usage and charges](../understand/download-azure-daily-usage.md)
- [View and download tax documents for your billing profile](../understand/mca-download-tax-document.md)
- [Understand the charges on your billing profile's invoice](../understand/review-customer-agreement-bill.md)
