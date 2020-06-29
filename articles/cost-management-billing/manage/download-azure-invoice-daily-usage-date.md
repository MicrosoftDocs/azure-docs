---
title: Download Azure billing invoice and daily usage data
description: Describes how to download or view your Azure billing invoice and daily usage data.
keywords: billing invoice,invoice download,azure invoice,azure usage
author: genlin
ms.reviewer: dcscontentpm
tags: billing
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 02/12/2020
ms.author: banders

---
# Download or view your Azure billing invoice and daily usage data

For most subscriptions, you can download your invoice from the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) or have it sent in email. If you're an Azure customer with an Enterprise Agreement (EA customer), you can't download your organization's invoices. Invoices are sent to whoever is set up to receive invoices for the enrollment.

If you're an EA customer or have a [Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement), you can download usage in the [Azure portal](https://portal.azure.com/).

Only certain roles have permission to get billing invoice and usage information, like the Account Administrator or Enterprise Administrator. To learn more about getting access to billing information, see [Manage access to Azure billing using roles](manage-billing-access.md).

If you have a Microsoft Customer Agreement, you must be a billing profile Owner, Contributor, Reader, or Invoice manager to view billing and usage information. To learn more about billing roles for Microsoft Customer Agreements, see [Billing profile roles and tasks](understand-mca-roles.md#billing-profile-roles-and-tasks).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

## Download your Azure invoices (.pdf)

For most subscriptions, you can download your invoice from the Azure portal. If you have a Microsoft Customer Agreement, see Download invoices for a billing profile.

### Download invoices for an individual subscription

1. Select your subscription from the [Subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal as [a user with access to invoices](manage-billing-access.md).

2. Select **Invoices**.

    ![Screenshot that shows the Billing & usage option](./media/download-azure-invoice-daily-usage-date/billingandusage.png)

3. Click the download button to download a copy of your PDF invoice and then select **Download invoice**. If it says **Not available**, see [Why don't I see an invoice for the last billing period?](#noinvoice)

    ![Screenshot that shows billing periods, the download option, and total charges for each billing period](./media/download-azure-invoice-daily-usage-date/downloadinvoice.png)

4. You can also download your a daily breakdown of consumed quantities and estimated charges by clicking **Download csv**.

    ![Screenshot that shows Download invoice and usage page](./media/download-azure-invoice-daily-usage-date/usageandinvoice.png)

For more information about your invoice, see [Understand your bill for Microsoft Azure](../understand/review-individual-bill.md). For help managing your costs, see [Prevent unexpected costs with Azure billing and cost management](getting-started.md).

### Download invoices for a Microsoft Customer Agreement

Invoices are generated for each [billing profile](../understand/mca-overview.md#billing-profiles) in the Microsoft Customer Agreement. You must be a billing profile Owner, Contributor, Reader, or Invoice manager to download invoices from the Azure portal.

1. Search for **Cost Management + Billing**.
2. Select a billing profile.
3. Select **Invoices**.
4. In the invoice grid, find the row of the invoice you want to download.
5. Click on the download button at the end of the row.
6. In the download context menu, select **Invoice**.

If you don't see an invoice for the last billing period, see **Additional information**. <!-- Fix this -->
### <a name="noinvoice"></a> Why don't I see an invoice for the last billing period?

There could be several reasons that you don't see an invoice:

- It's less than 30 days from the day you subscribed to Azure.

- The invoice isn't generated yet. Wait until the end of the billing period.

- You don't have permission to view invoices. If you have a Microsoft Customer Agreement, you must be the billing profile Owner, Contributor, Reader, or Invoice manager. For other subscriptions, you might not see old invoices if you aren't the Account Administrator. To learn more about getting access to billing information, see [Manage access to Azure billing using roles](manage-billing-access.md).

- If you have a Free Trial or a monthly credit amount with your subscription that you didn't exceed, you won't get an invoice unless you have a Microsoft Customer Agreement.

## Get your invoice in email (.pdf)

You can opt in and configure additional recipients to receive your Azure invoice in an email. This feature may not be available for certain subscriptions such as support offers, Enterprise Agreements, or Azure in Open. If you have a Microsoft Customer agreement, see Get your billing profile invoices in email.

### Get your subscription's invoices in email

1. Select your subscription from the [Subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Opt in for each subscription you own. Click **Invoices** then **Email my invoice**.

    ![Screenshot that shows the opt-in flow](./media/download-azure-invoice-daily-usage-date/invoicesdeeplink01.png)

2. Click **Opt in** and accept the terms.

    ![Screenshot that shows the opt-in flow step 2](./media/download-azure-invoice-daily-usage-date/invoicearticlestep02.png)

3. Once you've accepted the agreement, you can configure additional recipients. When a recipient is removed, the email address is no longer stored. If you change your mind, you need to re-add them.

    ![Screenshot that shows the opt-in flow step 3](./media/download-azure-invoice-daily-usage-date/invoicearticlestep03.png)

If you don't get an email after following the steps, make sure your email address is correct in the [communication preferences on your profile](https://account.windowsazure.com/profile).

### Opt out of getting your subscription's invoices in email

You can opt out of getting your invoice by email by following the steps above and clicking **Opt out of emailed invoices**. This option removes any email addresses set to receive invoices in email. You can reconfigure recipients if you opt back in.

 ![Screenshot that shows the opt-out flow](./media/download-azure-invoice-daily-usage-date/invoicearticlestep04.png)

### Get your Microsoft Customer Agreement invoices in email

If you have a Microsoft Customer Agreement, you can opt in to get your invoice in an email. All billing profile Owners, Contributors, Readers, and Invoice managers will get the invoice by email. Readers cannot update the email invoice preference.

1. Search for **Cost Management + Billing**.
1. Select a billing profile.
1. Under **Settings**, select **Properties**.
1. Under **Email Invoice**, select **Update email invoice preference**.
1. Select **Opt in**.
1. Click **Update**.

### Opt out of getting your billing profile invoices in email

You can opt out of getting your invoice by email by following the steps above and clicking **Opt out**. All Owners, Contributors, Readers, and Invoice managers will be opted out of getting the invoice by email, too. If you are a Reader, you cannot change the email invoice preference.

## Download usage in Azure portal

 For most subscriptions, follow these steps to find your daily usage:

1. Select your subscription from the [Subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal as [a user with access to invoices](manage-billing-access.md).

2. Select **Invoices**.

    ![Screenshot that shows the Billing & usage option](./media/download-azure-invoice-daily-usage-date/billingandusage.png)

3. Click the download button of a invoice period that you want to check.

4. Download a daily breakdown of consumed quantities and estimated charges by clicking **Download csv**.  This may take a few minutes to prepare the csv file.

### Download usage for EA customers

To view and download usage data as a EA customer, you must be an Enterprise Administrator, Account Owner, or Department Admin with the view charges policy enabled.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.

    ![Screenshot that shows Azure portal search](./media/download-azure-invoice-daily-usage-date/portal-cm-billing-search.png)

1. Select **Usage + charges**.
1. For the month you want to download, select **Download**.

### Download usage for your Microsoft Customer Agreement

To view and download usage data for a billing profile, you must be a billing profile Owner, Contributor, Reader, or Invoice manager.

#### Download usage for billed charges

1. Search for **Cost Management + Billing**.
2. Select a billing profile.
3. Select **Invoices**.
4. In the invoice grid, find the row of the invoice corresponding to the usage you want to download.
5. Click on the ellipsis (`...`) at the end of the row.
6. In the download context menu, select **Azure usage and charges**.

#### Download usage for open charges

You can also download month-to-date usage for the current billing period, meaning the charges have not been billed yet.

1. Search for **Cost Management + Billing**.
2. Select a billing profile.
3. In the **Overview** blade, click **Download Azure usage and charges**.

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Need help? Contact us

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about your invoice and charges, see:

- [Understand your bill for Microsoft Azure](../understand/review-individual-bill.md)
- [Understand terms on your Azure invoice](../understand/understand-invoice.md)
- [Understand terms on your Microsoft Azure detailed usage](../understand/understand-usage.md)
- [View your organization's Azure pricing](ea-pricing.md)

If you have a Microsoft Customer Agreement, see:

- [Understand the charges on the invoice for your billing profile](../understand/review-customer-agreement-bill.md)
- [Understand terms on the invoice for your billing profile](../understand/mca-understand-your-invoice.md)
- [Understand the Azure usage and charges file for your billing profile](../understand/mca-understand-your-usage.md)
- [View and download tax documents for your billing profile](../understand/mca-download-tax-document.md)
- [View your organization's Azure pricing](ea-pricing.md)
