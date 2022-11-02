---
title: View your Azure usage summary details and download reports for direct EA enrollments
description: This article explains how enterprise administrators of direct Enterprise Agreement (EA) enrollments can view a summary of their usage data, Azure Prepayment consumed, and charges associated with other usage in the Azure portal.
author: bandersmsft
ms.author: banders
ms.date: 08/29/2022
ms.topic: how-to
ms.service: cost-management-billing
ms.subservice: enterprise
ms.reviewer: sapnakeshari
---

# View your usage summary details and download reports for direct EA enrollments

This article explains how enterprise administrators of direct Enterprise Agreement (EA) enrollments can view a summary of their usage data, Azure Prepayment consumed, and charges associated with other usage in the Azure portal. Charges are presented at the summary level across all accounts and subscriptions of the enrollment.

> [!NOTE]
> We recommend that direct EA Azure customers use Cost Management + Billing in the Azure portal to manage their enrollment and billing instead of using the EA portal. For more information about enrollment management in the Azure portal, see [Get started with the Azure portal for direct Enterprise Agreement customers](ea-direct-portal-get-started.md).
>
> As of October 10, 2022 direct EA customers won’t be able to manage their billing account in the EA portal. Instead, they must use the Azure portal. 
> 
> This change doesn’t affect direct Azure Government EA enrollments or indirect EA (an indirect EA is one where a customer signs an agreement with a Microsoft partner) enrollments. Both continue using the EA portal to manage their enrollment.

Check out the [EA admin manage consumption and invoices](https://www.youtube.com/watch?v=bO8V9eLfQHY) video. It's part of the [Direct Enterprise Customer Billing Experience in the Azure portal](https://www.youtube.com/playlist?list=PLeZrVF6SXmsoHSnAgrDDzL0W5j8KevFIm) series of videos.

>[!VIDEO https://www.youtube.com/embed/bO8V9eLfQHY]

## Prerequisites

To review and verify the charges on your invoice, you must be an Enterprise Administrator. For more information, see [Understand Azure Enterprise Agreement administrative roles in Azure](understand-ea-roles.md). If you don't know who the Enterprise Administrator is for your organization, create a support request in the Azure portal.

## Review usage charges

To view detailed usage for specific accounts, download the usage detail report:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing** and then select it.
1. Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
1. In the navigation menu, select **Usage + Charges**.  
    :::image type="content" source="./media/direct-ea-azure-usage-charges-invoices/navigation-usage-charges.png" alt-text="Screenshot showing the Usage + charges page." lightbox="./media/direct-ea-azure-usage-charges-invoices/navigation-usage-charges.png" :::
1. To view details from previous years, select a **Timespan**.

The following table lists the terms and descriptions shown on the Usage + Charges page in the Azure portal. Charges shown in the Azure portal are in USD currency.

| **Term** | **Description** |
| --- | --- |
| Month | The Usage month |
| Charges against Credits | The credit applied during that specific period. |
| Service Overage | Your organization's usage charges exceed your credit balance |
| Billed Separately | The services your organization used aren't covered by the credit. |
| Azure Marketplace | Azure Marketplace purchases and usage aren't covered by your organization's credit and are billed separately |
| Total Charges | Charges against credits + Service Overage + Billed Separately + Azure Marketplace |

## Download usage charges CSV file

Enterprise administrators use the Download Usage + Charges page to download the following reports as CSV files.

- **Usage Details** - Depending on your selection, the CSV file provides all charges (usage and purchases) including RI (reservation) purchases. Or, amortized charges (usage and purchases) including reservation purchases.
- **Marketplace Store Charge** - The Marketplace Store Charge CSV file contains the usage-based Marketplace charges breakdown by day for the specified billing period.
- **Price sheet** - The Price Sheet CSV file contains the applicable rate for each meter for the given Enrollment and Billing Period.
- **Balance and Summary** - The Balance and Summary CSV file contains a monthly summary of information for balances, new purchases, Marketplace service charges, adjustments, and overage charges.

1. Select the **Download** symbol next to the month's report.  
:::image type="content" source="./media/direct-ea-azure-usage-charges-invoices/download-usage-charges-csv.png" alt-text="Screenshot showing the Download option." :::
1. On the Download Usage + Charges page, select **Prepare document** for the report that you want to download.  
    :::image type="content" source="./media/direct-ea-azure-usage-charges-invoices/prepare-document.png" alt-text="Screenshot showing the Prepare document page." lightbox="./media/direct-ea-azure-usage-charges-invoices/prepare-document.png" :::
1. It could take a while for Azure to prepare your download, depending on your monthly usage. When it's ready for download, select **Download csv**.

Enterprise administrators can also view an overall summary of the charges for the selected Timespan at the bottom of the Usage + charges page.

:::image type="content" source="./media/direct-ea-azure-usage-charges-invoices/usage-charges-summary.png" alt-text="Screenshot showing a summary of usage charges." lightbox="./media/direct-ea-azure-usage-charges-invoices/prepare-document.png":::

## Download or view your Azure billing invoice

An EA administrator can download the invoice from the [Azure portal](https://portal.azure.com) or have it sent in email. Invoices are sent to whoever is set up to receive invoices for the enrollment. If someone other than an EA administrator needs an email copy of the invoice, an EA administrator can send them a copy.

Only an Enterprise Administrator has permission to view and download the billing invoice. To learn more about getting access to billing information, see [Manage access to Azure billing using roles](manage-billing-access.md).

You receive an Azure invoice when any of the following events occur during your billing cycle:

- **Service overage** - Your organization's usage charges exceed your credit balance.
- **Charges billed separately** - The services your organization used aren't covered by the credit. You're invoiced for the following services despite your credit balance:
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
- **Marketplace charges** - Azure Marketplace purchases and usage aren't covered by your organization's credit. So, you're invoiced for Marketplace charges despite your credit balance. In the Azure portal, an Enterprise Administrator can enable and disable Marketplace purchases.

Your invoice displays Azure usage charges with costs associated to them first, followed by any Marketplace charges. If you have a credit balance, it's applied to Azure usage. Your invoice will display Azure usage and Marketplace usage without any cost last.

### Download your Azure invoices (.pdf)

For most subscriptions, you can download your invoice in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing** and select it.
1. Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
1. In the navigation menu, select **Invoices**. The Invoices page shows all the invoices and credit memos generated for the last 12 months.  
    :::image type="content" source="./media/direct-ea-azure-usage-charges-invoices/invoices-page.png" alt-text="Screenshot showing the Invoices page." lightbox="./media/direct-ea-azure-usage-charges-invoices/invoices-page.png" :::
    
1. On the invoice page, find the row of the invoice that you want to download. To the right of the row, select the ellipsis (**…**) symbol.
1. In the context menu, select **Download**.  
    :::image type="content" source="./media/direct-ea-azure-usage-charges-invoices/download-context-menu.png" alt-text="Screenshot showing the Download context menu."  :::

You can select a Timespan to view up to the last three years of invoice details.

If the invoice has multiple line items that exceed 40 pages for a PDF file, it gets split into multiple document numbers.

The following table lists the terms and descriptions shown on the Invoices page:

| **Term** | **Description** |
| --- | --- |
| Document date | Date that the invoice or credit memo was generated. |
| Document number | Invoice or credit memo number. |
| Billing Period | Billing period that the invoice or credit memo. |
| PO number | PO number for the invoice or credit memo. |
| Total Amount | Total amount of the invoice or credit. |

## Update a PO number for an upcoming overage invoice

In the Azure portal, a direct enterprise administrator can update the purchase order (PO) for upcoming invoices. The PO number can get updated anytime before the invoice is created during the current billing period.

For a new enrollment, the default PO number is the enrollment number.

If you don’t change the PO number, then the same PO number is used for all upcoming invoices.

The EA admin receives an invoice notification email after the end of billing period to update PO number. You can update the PO number up to seven days after receiving email notification.

If you want to update the PO number after your invoice is generated, then contact Azure support in the Azure portal.

Check out the [Manage purchase order number in the Azure portal](https://www.youtube.com/watch?v=26aanfQfjaY) video.
>[!VIDEO https://www.youtube.com/embed/26aanfQfjaY]

To update the PO number for a billing account:

1. Sign in to the  [Azure portal](https://portal.azure.com).
1. Search for  **Cost Management + Billing** and then select  **Billing scopes**.
1. Select your billing scope, and then in the left menu under  **Settings**, select  **Properties**.
1. Select  **Update PO number**.
1. Enter a PO number and then select  **Update**.

Or you can update the PO number from Invoice blade for the upcoming invoice:

1. Sign in to the  [Azure portal](https://portal.azure.com).
1. Search for  **Cost Management + Billing** and then select  **Billing scopes**.
1. Select your billing scope, then in the left menu under  **Billing**, select  **Invoices**.
1. Select  **Update PO number**.
1. Enter a PO number and then select  **Update**.

## Review credit charges

The information in this section describes how you can view the starting balance, ending balance, and credit adjustments for your Azure Prepayment (previously called monetary commitment).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing** and select it.
1. Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
1. In the navigation menu, select **Credits + Commitments**.
1. The Credits tab shows a breakdown of your credits and a graph showing your balance over time.  
    :::image type="content" source="./media/direct-ea-azure-usage-charges-invoices/credits-tab.png" alt-text="Screenshot showing the Credits tab." lightbox="./media/direct-ea-azure-usage-charges-invoices/credits-tab.png" :::

The following table lists the terms and descriptions shown on the Credits tab.

| **Term** | **Description** |
| --- | --- |
| Month | Month of the credit |
| Starting credit | Starting credit for that month |
| New credit | New credits added |
| Adjustments | Adjustments made in the month |
| Credit applied toward charges | Total amount of the invoice or credit generated |
| Ending credit | Credit end balance |

Below are the Accounting codes and description for the adjustments. 

| **Accounting Code** | **Description** |
| --- | --- |
| F2 | Contractual Credit |
| F3 | Strategic Investment Credit: Future Utilization Credit |
| O1 | Offer Conversion Credit |
| O2 | Pricing or Billing Credit |
| O3 | Deployment Credit |
| O4 | Offset Service Credit |
| O5 | Coverage Gap Credit |
| O6 | Subscription Interrupt Credit |
| O7 | Technical Concession Credit |
| O8 | Usage Emission Credit |
| O9 | Fraud False Positive Credit |
| O10 | Pricing Alignment Credit |
| O11 | Sponsorship Continuity Credit |
| O12 | Exchange Rate Reconciliation Credit |
| O13 | Microsoft Internal Credit |
| O14 | Supporting Documentation Credit |
| O15 | Support Troubleshooting Credit |
| O16 | Data Center Credit |
| O17 | Backdated Pricing Credit |
| O18 | Strategic Investment Credit: Offset of Past Utilization |
| O19 | Licensing Benefit Credit |
| O20 | Return of Reservation Credit |
| O21 | Service Level Agreement Credit |
| P1 | Custom Billing Credit |
| P2 | Strategic Investment Credit: Planned Usage Credit |
| T1 | Contractual Fund Transfer |
| T2 | Strategic Investment Credit: Transfer of Funds |
| T3 | Volume Licensing Reconciliation Credit |
| T4 | Separate Channel Balance Transfer |
| T5 | Exchange adjustment for Azure reservation |
| U1 | Latent Onboarding Credit |
| U2 | Funding Transfer |
| U3 | Contract Term Transfer |
| U4 | Strategic Investment Credit: Transfer of Utilization |

## Review reservation transaction details

You can view all the reservations placed for an Enterprise Agreement in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing** and select it.
1. Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.
1. In the navigation menu, select **Reservation transactions**. Prices shown in the following image are examples.  
    :::image type="content" source="./media/direct-ea-azure-usage-charges-invoices/reservation-transactions.png" alt-text="Screenshot showing the Reservation transactions page." lightbox="./media/direct-ea-azure-usage-charges-invoices/reservation-transactions.png" :::

The following table lists the terms and descriptions shown on the Reservation transactions page.

| **Term** | **Description** |
| --- | --- |
| Date | Date that the reservation was made |
| Name | Name of the reservation |
| Description | Description of the reservation |
| Purchasing Subscription | Subscription under which the reservation made |
| Purchasing account | The purchasing account under which account the reservation made |
| Billing frequency | Billing frequency of the reservation |
| Type | Type of the transaction. For example, Purchase or Refund. |
| Purchase Month | Month of the Purchase |
| MC (USD) | Indicates the Monetary Commitment value |
| Overage (USD) | Indicates the Service Overage value |
| Quantity | Reservation quantity that was purchased |
| Amount (USD) | Reservation cost |

> [!NOTE]
> The newly added column Purchase Month will help identify in which month the refunds are updated and helps to reconcile the RI refunds. 

## CSV report formatting issues

When you view CSV reports in Excel and your billing currency is Euros, you might have formatting issues that involve commas and periods.

The costs shown are examples.

For example, you might see:

| **ServiceResource** | **ResourceQtyConsumed** | **ResourceRate** | **ExtendedCost** |
|---|--- | ---|---|
| Hours | 24 | 0,0535960591133005 | 12,863,054,187,192,100,000,000 |

However, you *should* see:

| **ServiceResource** | **ResourceQtyConsumed** | **ResourceRate** | **ExtendedCost** |
| --- | --- | --- | --- |
| Hours | 24 | 0,0535960591133005 | 1,2863054187192120000000 |

The formatting issue occurs because of default settings in Excel's import functionality. Excel imports all fields as *General* text and assumes that a number is separated in the mathematical standard. For example: *1,000.00*.

If your currency uses a period (**.**) for the thousandth place separator and a comma (**,**) for the decimal place separator, it will display incorrectly. For example: *1.000,00*. The import results may vary depending on your regional language setting.

To import the CSV file without formatting issues:

1. In Microsoft Excel, go to **File** > **Open**. The Text Import Wizard appears.
1. Under **Original Data Type**, choose **delimited**. Default is **Fixed Width**.
1. Select **Next**.
1. Under **Delimiters**, select the box for **Comma**. Clear **Tab** if it's selected.
1. Select **Next**.
1. Scroll over to the **ResourceRate** and **ExtendedCost** columns.
1. Select the **ResourceRate** column. It appears highlighted in black.
1. Under the **Column Data Format** section, select **Text** instead of **General**. The column header will change from **General** to **Text**.
1. Repeat steps 8 and 9 for the **Extended Cost** column, and then select **Finish**.

> [!TIP]
> If you have set CSV files to automatically open in Excel, you must use the **Open** function in Excel instead. In Excel, go to **File** > **Open**.

## Next steps

- To learn about common tasks that a direct enterprise administrator accomplishes in the Azure portal, see [Azure direct EA administration](direct-ea-administration.md).
