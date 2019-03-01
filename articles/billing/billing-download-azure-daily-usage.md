---
title: View and Download Azure daily usage data | Microsoft Docs
description: Describes how to download or view your Azure daily usage and charges.
keywords: billing usage,usage charges, usage download, view usage, azure invoice,azure usage
services: 'billing'
documentationcenter: ''
author: genlin
manager: jureid
editor: ''
tags: billing

ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/19/2019
ms.author: banders

---
# View and download your Azure daily usage data

If you're an EA customer or have a [Microsoft Customer Agreement](#check-your-access-to-a-microsoft-customer-agreement), you can download usage in the [Azure portal](https://portal.azure.com/). For other subscriptions, go to the [Azure Account Center](https://account.azure.com/Subscriptions) to download usage.

Only certain roles have permission to get Azure usage information, like the Account Administrator or Enterprise Administrator. To learn more about getting access to billing information, see [Manage access to Azure billing using roles](billing-manage-access.md).

If you have a [Microsoft Customer Agreement](#Check-your-access-to-a-Microsoft-Customer-Agreement), you must be a billing profile Owner, Contributor, Reader, or Invoice manager to view billing and usage information. To learn more about billing roles for Microsoft Customer Agreements, see [Understand billing profile tasks](billing-understand-mca-roles.md#billing-profile-tasks).

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

## Download usage from the Account Center (.csv)

1. Sign into the [Azure Account Center](https://account.windowsazure.com/subscriptions) as the Account Administrator.

2. Select the subscription for which you want the invoice and usage information.

3. Select **BILLING HISTORY**.

    ![Screenshot that shows billing history option](./media/billing-download-azure-invoice-daily-usage-date/Billinghisotry.png)

4. You can see your statements for the last six billing periods and the current unbilled period.

    ![Screenshot that shows billing periods, options to download invoice and daily usage, and total charges for each billing period](./media/billing-download-azure-invoice-daily-usage-date/billingSum.png)

5. Select **View Current Statement** to see an estimate of your charges at the time the estimate was generated. This information is only updated daily and may not include all your usage. Your monthly invoice may differ from this estimate.

    ![Screenshot that shows the View Current Statement option](./media/billing-download-azure-invoice-daily-usage-date/billingSum2.png)

    ![Screenshot that shows the estimate of current charges](./media/billing-download-azure-invoice-daily-usage-date/billingSum3.png)

6. Select **Download Usage** to download the daily usage data as a CSV file. If you see two versions available, download version 2.

    ![Screenshot that shows the Download Usage option](./media/billing-download-azure-invoice-daily-usage-date/DLusage.png)

Only the Account Administrator can access the Azure Account Center. Other billing admins, such as an Owner, can get usage information using the [Billing APIs](billing-usage-rate-card-overview.md).

For more information about your daily usage, see [Understand your bill for Microsoft Azure](billing-understand-your-bill.md). For help managing your costs, see [Prevent unexpected costs with Azure billing and cost management](billing-getting-started.md).

## Download usage for EA customers

To view and download usage data as a EA customer, you must be an Enterprise Administrator, Account Owner, or Department Admin with the view charges policy enabled.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.

    ![Screenshot that shows Azure portal search](./media/billing-download-azure-invoice-daily-usage-date/portal-cm-billing-search.png)

1. Select **Usage + charges**.
1. For the month you want to download, select **Download**.

## Download usage for your Microsoft Customer Agreement

To view and download usage data for a billing profile, you must be a billing profile Owner, Contributor, Reader, or Invoice manager.

### Download usage for billed charges

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search on **Cost Management + Billing**.
1. Select a billing profile. Depending on your access, you might need to select a billing account first.
1. Select **Invoices**.
1. In the invoice grid, find the row of the invoice corresponding to the usage you want to download.
1. Click on the ellipsis (`...`) at the end of the row.

    ![Screenshot that shows the ellipsis at the end of the row](./media/billing-download-azure-invoice/billingprofile-invoicegrid.png)

1. In the download context menu, select **Azure usage and charges**.

     ![Screenshot that shows Azure usage and charges selected](./media/billing-download-azure-usage/contextmenu-usage.png)

### Download usage for open charges

You can also download month-to-date usage for the current billing period. These usage charges that have not been billed yet.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search on **Cost Management + Billing**.
1. Select a billing profile. Depending on your access, you might need to select a billing account first.
1. In the **Overview** blade, find the download links beneath the month-to-date charges.
1. Select **Azure usage and charges**.

    ![Screenshot that shows download from Overview](./media/billing-download-azure-usage/open-usage.png)

## Check your access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

To learn more about your invoice and usage charges, see:

- [Understand terms on your Microsoft Azure detailed usage](billing-understand-your-usage.md)
- [Understand your bill for Microsoft Azure](billing-understand-your-bill.md)
- [View and download your Microsoft Azure invoice](billing-download-azure-invoice.md)
- [View and download your organization's Azure pricing](billing-ea-pricing.md)

If you have a Microsoft Customer Agreement, see:

- [Understand terms on your Microsoft Customer Agreement Azure detailed usage](billing-mca-understand-your-usage.md)
- [Understand the charges on your Microsoft Customer Agreement invoice](billing-mca-understand-your-bill.md)
- [View and download your Microsoft Azure invoice](billing-download-azure-invoice.md)
- [View and download tax documents for your Microsoft Customer Agreement](billing-mca-download-tax-document.md)
- [View and download your organization's Azure pricing](billing-ea-pricing.md)
