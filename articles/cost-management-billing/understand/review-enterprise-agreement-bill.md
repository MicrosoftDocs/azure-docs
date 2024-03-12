---
title: Review your Azure Enterprise Agreement bill
description: Learn how to read and understand your usage and bill for Azure Enterprise Agreements.
author: bandersmsft
ms.reviewer: prsaini
ms.service: cost-management-billing
ms.subservice: enterprise
ms.topic: tutorial
ms.date: 03/08/2024
ms.author: banders

---
# Understand your Azure Enterprise Agreement bill

Azure customers with an Enterprise Agreement receive an invoice when they exceed the organization's credit or use services that aren't covered by the credit.

Your organization's credit includes your Azure Prepayment (previously called monetary commitment). Azure Prepayment is the amount your organization paid upfront for usage of Azure services. You can add Azure Prepayment funds to your Enterprise Agreement by contacting your Microsoft account manager or reseller.

This tutorial applies only to Azure customers with an Azure Enterprise Agreement.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Review invoiced charges
> * View price sheet information
> * View usage information
> * Download CSV reports
> * View credits

## Prerequisites

To review and verify the charges on your invoice, you must be an Enterprise Administrator. For more information, see [Understand Azure Enterprise Agreement administrative roles in Azure](../manage/understand-ea-roles.md). If you don't know who the Enterprise Administrator is for your organization, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Review invoiced charges

This section doesn't apply to Azure customers in Australia, Japan, or Singapore.

You receive an Azure invoice when any of the following events occur during your billing cycle:

- **Service overage**: Your organization's usage charges exceed your credit balance.
- **Charges billed separately**: The services your organization used aren't covered by the credit. You're invoiced for the following services despite your credit balance. The services shown are examples of charges billed separately. You can get a full list of the services where charges are billed separately by submitting a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).
    - Canonical
    - Citrix XenApp Essentials
    - Citrix XenDesktop
    - Registered User
    - Openlogic
    - Remote Access Rights XenApp Essentials Registered User
    - Ubuntu Advantage
    - Visual Studio Enterprise (Monthly)
    - Visual Studio Enterprise (Annual)
    - Visual Studio Professional (Monthly)
    - Visual Studio Professional (Annual)
- **Marketplace charges**: Azure Marketplace purchases and usage aren't covered by your organization's credit. So, you're invoiced for Marketplace charges despite your credit balance. In the Azure portal, an Enterprise Administrator can enable and disable Marketplace purchases.

Your invoice shows Azure usage charges with costs associated to them first, followed by any marketplace charges. If you have a credit balance, it gets applied to Azure usage and your invoice shows Azure usage and marketplace usage without any cost, last in the list.

Compare your combined total amount shown in the Azure portal in **Usage & Charges** with your Azure invoice. The amounts in the **Total Charges** don't include tax.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing** and then select it.
1. Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
1. In the left navigation menu, select **Billing profiles** and then select the billing profile that you want to work with.
1. In the navigation menu, select **Usage + Charges**.

:::image type="content" source="./media/review-enterprise-agreement-bill/usage-charges.png" alt-text="Screenshot of the Usage + Charges page." lightbox="./media/review-enterprise-agreement-bill/usage-charges.png" :::

## View price sheet information

Enterprise administrators can view the price list associated with their billing account for Azure services.

To view the current price sheet:

1.	As an Enterprise Administrator, sign in to the [Azure portal](https://portal.azure.com).
1.	Search for **Cost Management + Billing**.
1.	If you have access to multiple billing accounts, select the billing scope for the EA billing account for which you need the price sheet.
1.	Select **Usage + Charges** from the navigation menu.
1.	Select **Download** for the month that you want the price sheet.
1.	On the Download Usage + Charges page, under Price Sheet, select **Prepare document**. It could take a while to prepare your file.  
    :::image type="content" source="./media/review-enterprise-agreement-bill/prepare-price-sheet.png" alt-text="Screenshot of the Download Usage + Charges page." lightbox="./media/review-enterprise-agreement-bill/prepare-price-sheet.png" :::
1.	When the file is ready to download, select **Download Azure price sheet**.

For billing periods January 2023 and later, a new version of the Azure price sheet is available for download. The new version features a new schema. It's a .ZIP file to support large amounts of data.

Azure reservation pricing is available in the Azure price sheet for the current billing period. If you want to maintain an ongoing record of Azure reservation pricing, we recommend that you download your Azure price sheet for each billing period.

Some reasons for differences in pricing:

- Pricing can change between the previous enrollment and the new enrollment. Price changes can occur because pricing is contractual for specific enrollment from the start date to end date of an agreement.
- When you transfer to new enrollment, the pricing changes to the new agreement. The pricing gets defined by your price sheet, which might be higher in the new enrollment.
- If an enrollment goes into an extended term, the pricing also changes. Prices change to pay-as-you-go rates.

## View usage information

Enterprise administrators can view a summary of their usage data, Azure Prepayment consumed, and charges associated with usage in the Azure portal. The charges are presented at the summary level across all accounts and subscriptions.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing** and then select it.
1. Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
1. In the left navigation menu, select **Billing profiles** and select the billing profile that you want to work with.
1. In the navigation menu, select **Usage + Charges**.
1. In the list, select a month to view usage details along with the charges.

> [!NOTE]
> The usage detail report doesn't include any applicable taxes. There might be a latency of up to eight hours from the time usage was incurred to when it's reflected on the report.

For indirect enrollments, your partner needs to enable the markup function before you can see any cost-related information.

## Usage summary

Enterprise administrators can view a summary of their usage data, Azure Prepayment consumed, and charges associated with usage in the Azure portal. The charges are presented at the summary level across all accounts and subscriptions.

### Summary categories

- Charges against credits
- Service overage
- Billed separately
- Azure Marketplace
- Total charges
- Refunded Overage Credits

## Download CSV reports

The monthly report download page allows enterprise administrators to download several reports as CSV files. Downloadable reports include:

- Usage Details
- Marketplace Store Charge
- Price Sheet
- Balance and Summary

### To download reports

1. In the Azure portal, select **Usage + Charges**.
1. Select **Download** next to the appropriate month's report.

### CSV report formatting issues

Customers viewing the Azure Enterprise portal's CSV reports in euros might encounter formatting issues that involve commas and periods.

For example, you might see:

| **ServiceResource** | **ResourceQtyConsumed** | **ResourceRate** | **ExtendedCost** |
| --- | --- | --- | --- |
| Hours | 24 | 0,0535960591133005 | 12,863,054,187,192,100,000,000 |

You should see:

| ServiceResource | ResourceQtyConsumed | ResourceRate | ExtendedCost |
| --- | --- | --- | --- |
| Hours | 24 | 0,0535960591133005 | 1,2863054187192120000000 |

This formatting issue occurs because of default settings in Excel's import functionality. Excel imports all fields as 'General' text and assumes that a number is separated in the mathematical standard. For example: "1,000.00".

If a European currency uses a period (.) for the thousandth place separator and a comma for the decimal place separator (,), it gets displayed incorrectly. For example: "1.000,00". The import results might vary depending on your regional language setting.

### To import the CSV file without formatting issues:

1. In Microsoft Excel, go to **File** > **Open**.
   The Text Import Wizard appears.
1. Under **Original Data Type**, choose **delimited**. The default is **Fixed Width**.
1. Select **Next**.
1. Under Delimiters, select the check box for **Comma**. Clear **Tab** if selected.
1. Select **Next**.
1. Scroll over to the **ResourceRate** and **ExtendedCost** columns.
1. Select the **ResourceRate** column. It appears  highlighted in black.
1. Under the **Column Data Format** section, select **Text** instead of **General**. The column header changes from **General** to **Text.**
1. Repeat steps 8 and 9 for the **Extended Cost** column, and then select **Finish**.

> [!TIP]
> If you have set CSV files to automatically open in Excel, you must use the **Open** function in Excel instead. In Excel, go to **File** > **Open**.

## Reporting for nonenterprise administrators

Enterprise administrators can give department administrators (DA) and account owners (AO) permissions to view charges on an enrollment. Account owners with access are able to download CSV reports specific to their account and subscriptions. They can also view the information in the Azure portal.

### To enable access:

1.	Sign in to the [Azure portal](https://portal.azure.com) as an enterprise administrator.
2.	Search for **Cost Management + Billing** and then select it.
3.	Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
4.	In the navigation menu, select **Policies**.
5.	Toggle the **Department Admins can view charges** option to **On** or **Account owners can view charges** option to **On** to provide access.
6.	Select **Save**.  
    :::image type="content" source="./media/review-enterprise-agreement-bill/policies-options.png" alt-text="Screenshot of the Policies page." lightbox="./media/review-enterprise-agreement-bill/policies-options.png" :::

### To view reports:

1.	Sign in to the [Azure portal](https://portal.azure.com) as a department administrator or an account owner.
2.	Search for **Cost Management + Billing** and then select it.
3.	Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
4.	In the navigation menu, select **Usage + Charges**. Select a month to view usage details along with the charges.
5.	To view details from previous years, select a **Timespan**.
6.	Select **Download** to view the CSV reports.

Account owner permissions to view charges extend to account owners and all users who have permissions on associated subscriptions. If you're an indirect customer, cost features must get enabled by your channel partner.

For more information about usage and charges, see [Review usage charges](../manage/direct-ea-azure-usage-charges-invoices.md#review-usage-charges).

## View credits

Credits information is shown on the **Credits + Commitments** page. The page shows:

- Starting balance
- Ending balance
- New Credit
- Credit adjustments
- Credits applied towards charges
- Ending credits for your enrollment

To view credit information:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing** and select it.
1. For EA administrators, select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
1. For partner administrators, select **Billing scopes** from the navigation menu and then select the billing account that you want to work with. Navigate to **Billing profile** and select the billing profile that you want to work with.
1. In the navigation menu, select **Credits + Commitments**.
1. The Credits tab shows a breakdown of your credits and a graph showing your balance over time.

For more information, see [View your usage summary details and download reports for EA enrollments](../manage/direct-ea-azure-usage-charges-invoices.md).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Review invoiced charges
> * View price sheet information
> * View usage information
> * Download CSV reports
> * View credits

Continue to the next article to learn more about getting started with your EA billing account.

> [!div class="nextstepaction"]
> [Get started with your Enterprise Agreement billing account](../manage/ea-direct-portal-get-started.md)
