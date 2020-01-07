---
title: View and Download Azure usage and charges
description: Describes how to download or view your Azure daily usage and charges.
keywords: billing usage, usage charges, usage download, view usage, azure invoice, azure usage
author: bandersmsft
ms.author: banders
tags: billing
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 01/03/2020
---

# View and download your Azure usage and charges

You can download a daily breakdown of your Azure usage and charges in the Azure portal. Only certain roles have permission to get Azure usage information, like the Account Administrator or Enterprise Administrator. To learn more about getting access to billing information, see [Manage access to Azure billing using roles](../manage/manage-billing-access.md).

If you have a Microsoft Customer Agreement (MCA), you must be a billing profile Owner, Contributor, Reader, or Invoice manager to view your Azure usage and charges.  If you have a Microsoft Partner Agreement (MPA), only the Global Admin and Admin Agent role in the partner organization Microsoft can view and download Azure usage and charges. [Check your billing account type in the Azure portal](#check-your-billing-account-type).

## Download usage from the Azure portal (.csv)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.

    ![Screenshot that shows Azure portal search](./media/download-azure-daily-usage/portal-cm-billing-search.png)

1. Depending on your access, you might need to select a Billing account or Billing profile.
1. In the left menu, select **Invoices** under **Billing**.
1. In the invoice grid, find the row of the billing period corresponding to the usage you want to download.
1. Select the **download icon** or the ellipsis (`...`) on the right.
1. The Download pane opens on the right. Select **Download** from the **Usage Details** section.

## Download usage for EA customers

To view and download usage data as a EA customer, you must be an Enterprise Administrator, Account Owner, or Department Admin with the view charges policy enabled.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.

    ![Screenshot that shows Azure portal search](./media/download-azure-daily-usage/portal-cm-billing-search.png)

1. Select **Usage + charges**.
1. For the month you want to download, select **Download**.

## Download usage for pending charges

If you have a Microsoft Customer Agreement, you can download month-to-date usage for the current billing period. These usage charges that have not been billed yet.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for *Cost Management + Billing*.
3. Select a billing profile. Depending on your access, you might need to select a billing account first.
4. In the **Overview** area, find the download links beneath the month-to-date charges.
5. Select **Azure usage and charges**.

    ![Screenshot that shows download from Overview](./media/download-azure-daily-usage/open-usage01.png)

## Check your billing account type
[!INCLUDE [billing-check-account-type](../../../includes/billing-check-account-type.md)]

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about your invoice and usage charges, see:

- [Understand terms on your Microsoft Azure detailed usage](understand-usage.md)
- [Understand your bill for Microsoft Azure](review-individual-bill.md)
- [View and download your Microsoft Azure invoice](download-azure-invoice.md)
- [View and download your organization's Azure pricing](../manage/ea-pricing.md)

If you have a Microsoft Customer Agreement, see:

- [Understand terms on your Microsoft Customer Agreement Azure detailed usage](mca-understand-your-usage.md)
- [Understand the charges on your Microsoft Customer Agreement invoice](review-customer-agreement-bill.md)
- [View and download your Microsoft Azure invoice](download-azure-invoice.md)
- [View and download tax documents for your Microsoft Customer Agreement](mca-download-tax-document.md)
- [View and download your organization's Azure pricing](../manage/ea-pricing.md)
