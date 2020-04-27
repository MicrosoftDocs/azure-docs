---
title: Azure Enterprise enrollment invoices
description: This article explains how to manage and act on your Azure Enterprise invoice.
author: bandersmsft
ms.author: banders
ms.date: 04/06/2020
ms.topic: conceptual
ms.service: cost-management-billing
ms.reviewer: boalcsva
---

# Azure Enterprise enrollment invoices

This article explains how to manage and act on your Azure Enterprise Agreement (Azure EA) invoice. Your invoice is a representation of your bill. Review it for accuracy. You should also get familiar with other tasks that might be needed to manage your invoice.

## Change a PO number for an overage invoice

The Azure Enterprise portal automatically generates a default purchase order (PO) number unless the enterprise administrator sets one before the invoice date. An enterprise administrator can update the PO number up to seven days after receiving an automated invoice notification email.

### To update the Azure services purchase order number:

1. From the Azure Enterprise portal, select **Report** > **Usage Summary**.
1. Select **Edit PO Numbers** in the upper-right corner.
1. Select the **Azure Services** radio button.
1. Select an **Invoice Period** from the date ranges drop-down menu.

   You can edit a PO number during a seven-day period after you get an invoice notification, but before you've paid the invoice.
1. Enter a new PO number in the **PO Number** field.
1. Select **Save** to submit your change.

### To update the Azure Marketplace purchase order number:

1. From the Azure Enterprise portal, select **Report** > **Usage Summary**.
1. Select **Edit PO Numbers** in the upper-right corner.
1. Select the **Marketplace** radio button.
1. Select an **Invoice Period** from the date ranges drop-down menu.

   You can edit a PO number during a seven-day period after you get an invoice notification, but before you've paid the invoice.
1. Enter a new PO number in the **PO Number** field.
1. Select **Save** to submit your change.

## Cadence of Azure Enterprise billing

Microsoft bills annually at the enrollment effective date for any commitment purchases of the Microsoft Azure services. For any usage exceeding the commitment amounts, Microsoft bills in arrears.

- Commitment fees are quoted based on a monthly rate and billed annually in advance.
- Overage fees are calculated each month and billed in arrears at the end of your billing period.

### Billing intervals

You billing interval depends on how you choose to make your commitment purchases. Your annual commitment is coterminous with either:

- Your enrollment anniversary date
- The effective date of your one-year Amendment Subscription.

The date you receive your overage invoice depends on your enrollment start date and set-up:

- **Direct enrollments with a start date before May 1, 2018**:
  - If you're on a direct Enterprise Agreement (EA), you're on an annual billing cycle for Azure services, excluding Azure Marketplace services. Your billing cycle is based on the anniversary date: the date when your agreement became effective.
  - If you surpass 150% of your EA monetary commitment (MC) threshold, you'll automatically be converted to a quarterly billing cycle that is based on your anniversary date. You'll also receive an Azure service overage invoice.
  - If you don't surpass 150% of your MC threshold, your enrollment will remain on an annual billing cycle. The overage invoice will be received at the end of the commitment year.

- **Direct enrollments with a start date after May 1, 2018**:
  - Your Azure consumption and charges billed separately invoices are on a monthly billing cycle.
  - Any charges not covered by your monetary commitment are due as an overage payment.  

- **Indirect enrollments with an enrollment that started before May 1, 2018**:

  If you're an indirect Enterprise Agreement (EA) customer with a start date before May 1, 2018, you're set up on a quarterly billing cycle. The channel partner (CP) invoices you directly.  

- **Indirect enrollments with a start date after May 1, 2018**:

  You're on a monthly billing cycle.  

### Increase your monetary commitment

You can increase your commitment at any time. You'll be billed for the number of months remaining in that year's commitment period. For example, if you sign up for a one-year Amendment Subscription and then increase your commitment during month six, you'll be invoiced for the remaining six months of that term. Your commitment quantities will then be updated for the last six months of your commitment term. These new quantities will be used for determining any overage charges.

### Overage

For overage, you're billed for the usage or reservations that exceed your commitment during the billing period. To view a breakdown of how the overage quantities for individual items were calculated, refer to the usage summary report or contact your channel partner.

For each item on the invoice, you'll see:

- **Extended Amount**: the total charges
- **Commitment Usage**: the amount of your commitment used to cover the charges
- **Net Amount**: the charges that exceed your commitment

Applicable taxes are computed only on the net amount that exceeds your commitment.

Overage invoicing is automated. The timing of notifications and invoices depends on your billing period end date.

- Overage notification is usually sent seven days following your billing end date.
- Overage invoices are sent seven to nine days after notification.
- You can review charges and update system-generated PO numbers during the seven days between the overage notification and invoicing.

### Azure Marketplace

Effective from the April 2019 billing cycle, customers started to receive a single Azure invoice that combines all Azure and Azure Marketplace charges into a single invoice instead of two separate invoices. This change doesn't affect customers in Australia, Japan, or Singapore.

During the transition to a combined invoice, you'll receive a partial Azure Marketplace invoice. This final separate invoice will show Azure Marketplace charges incurred before the date of your billing update. Azure Marketplace charges incurred after that date will appear on your Azure invoice. After the transition period, you'll see all Azure and Azure Marketplace charges on the combined invoice.  

## Adjust billing frequency

A customer's billing frequency is annual, quarterly, or monthly. The billing cycle is determined when a customer signs their agreement. Monthly billing is smallest billing interval.

- **Approval** from an enterprise administrator is required to change a billing cycle from annual to quarterly for direct enrollments. Approval from a partner administrator is required for indirect enrollments. The change becomes effective at the end of the current billing quarter.
- **An amendment** to the agreement is required to change a billing cycle from annual or quarterly to monthly.  Any change to the existing enrollment billing cycle requires approval of an enterprise administrator or from your "Bill to Contact".
- **Submit** your approval to [Azure Enterprise portal support](https://support.microsoft.com/supportrequestform/cf791efa-485b-95a3-6fad-3daf9cd4027c). Select the issue category: **Billing and Invoicing**.

The change becomes effective at the end of the current billing quarter.

If an Amendment M503 is signed, you can move any agreement from any frequency to monthly billing. ​

## Credits and adjustments

You can view all credits or adjustments applied to your enrollment in the **Reports** section of [the Azure Enterprise portal](https://ea.azure.com).

To view credits:

1. In [the Azure Enterprise portal](https://ea.azure.com), select the **Reports** section.
1. Select **Usage Summary**.
1. In the top-right corner, change the **M** to **C** view.
1. Extend the adjustment field in the Azure service commitment table.
1. You'll see credits applied to your enrollment and a short explanation. For example: Service Level Agreement Credit.

## Request an invoice copy

To request a copy of your invoice, contact your partner.

## Overage offset

To apply your monetary commitment to overages, you must meet the following criteria:

- You've incurred overage charges that haven't been paid and are within one year of the billed service's end date.
- Your available monetary commitment amount covers the full number of incurred charges, including all past unpaid Azure invoices.
- The billing term that you want to complete must be fully closed. Billing fully closes after the fifth day of each month.
- The billing period that you want to offset must be fully closed.
- Your Azure Commitment Discount (ACD) is based on the actual new commitment minus any funds planned for the previous consumption. This requirement applies only to overage charges incurred. It's only valid for services that consume monetary commitment, so doesn't apply to Azure Marketplace charges. Azure Marketplace charges are billed separately.

To complete an overage offset, you or the account team can open a support request. An emailed approval from your enterprise administrator or Bill to Contact is required.

## View price sheet information

Enterprise administrators can view the price list associated with their enrollment for Azure services.

To view the current price sheet:

1. In the Azure Enterprise portal, select **Reports** and then select **Price Sheet**.
2. View the price sheet or select **Download**.

![Example showing price sheet information](./media/ea-portal-enrollment-invoices/ea-create-view-price-sheet-information.png)

To download a historical price list:

1. In the Azure Enterprise portal, select **Reports** and then select **Download Usage**.
2. Download the price sheet.

![Example showing where to download an older price sheet](./media/ea-portal-enrollment-invoices/create-ea-view-price-sheet-download-historical-price-list.png)

Some reasons for differences in pricing:

- Pricing might have changed between the previous enrollment and the new enrollment. Price changes can occur because pricing is contractual for specific enrollment from the start date to end date of an agreement.
- When you transfer to new enrollment, the pricing changes to the new agreement. The pricing is defined by your price sheet, which might be higher in the new enrollment.
- If an enrollment goes into an extended term, the pricing also changes. Prices change to pay-as-you-go rates.

## Request detailed usage information

Enterprise administrators can view a summary of their usage data, monetary commitment consumed, and charges associated with additional usage in the Azure Enterprise portal. The charges are presented at the summary level across all accounts and subscriptions.

To view detailed usage in specific accounts, download the usage detail report by going to **Reports** > **Download Usage**.

> [!NOTE]
> The usage detail report doesn't include any applicable taxes. There might be a latency of up to eight hours from the time usage was incurred to when it's reflected on the report.

For indirect enrollments, your partner needs to enable the markup function before you can see any cost-related information.

## Reports

Enterprise administrators can view a summary of their usage data, monetary commitment consumed, and charges associated with additional usage in the Azure Enterprise portal. The charges are presented at the summary level across all accounts and subscriptions.

### Azure Enterprise reports

- Usage summary and graphs
- Service usage report
- Balance and charge report
- Usage detail report
- Azure Marketplace charges report
- Price sheet
- Advanced report download
- CSV report formatting

### To view the usage summary reports and graphs:

1. Go to the Azure Enterprise portal.
1. Select **Reports** on the left pane.
1. Select the **Usage Summary** tab.
1. Select the commitment term from the date ranges menu on the top left.
1. Select the period or month on the graph to view additional detail.
1. On this tab, you can:
   - View a graph of month-over-month usage with a breakdown of usage, service overcharge, charges billed separately, and Azure Marketplace charges.
   - Filter by departments, accounts, and subscriptions below the graph.
   - Toggle between **Charge-by-Services** breakdown and **Charge-by-Hierarchy** breakdown.
   - View the details of Azure services, charges billed separately, and Azure Marketplace charges.

## Service usage report

The service usage report page allows enterprise administrators to view a summary of their service usage data. Usage is presented at the summary level across all accounts and subscriptions. To view detailed usage, you can filter the report by accounts or subscriptions.

> [!NOTE]
> There may be a latency of up to five days between the incurred usage date and when that usage is reflected on this report.

### To view the report:

1. Sign in to the Azure Enterprise portal.
1. Select **Reports** on the left navigation.
1. Select the **Usage Summary** tab.
1. Select the date range.
1. Choose which accounts or subscriptions to view.
1. Optionally, you can:
   - Change the view between **Charge by Services** and **Charge by Hierarchy** to display different breakdowns.
   - View details of Service Name, Unit of Measure, Consumed Units, Effective Rate, and Extended Cost.

## Download CSV reports

The monthly report download page allows enterprise administrators to download several reports as CSV files. Downloadable reports include:

- Balance and charge report
- Usage detail report
- Azure Marketplace charges report
- Price sheet

### To download reports:

1. From the Azure Enterprise portal, select **Report**.
1. Select **Usage Download** from the top ribbon.
1. Select **Download** next to the appropriate month's report.

### CSV report formatting issues

Customers viewing the Azure Enterprise portal's CSV reports in euros might encounter formatting issues that involve commas and periods.

For example, you may see:

| **ServiceResource** | **ResourceQtyConsumed** | **ResourceRate** | **ExtendedCost** |
| --- | --- | --- | --- |
| Hours | 24 | 0,0535960591133005 | 12,863,054,187,192,100,000,000 |

You should see:

| ServiceResource | ResourceQtyConsumed | ResourceRate | ExtendedCost |
| --- | --- | --- | --- |
| Hours | 24 | 0,0535960591133005 | 1,2863054187192120000000 |

This formatting issue occurs because of default settings in Excel's import functionality. Excel imports all fields as 'General' text and assumes that a number is separated in the mathematical standard. For example: "1,000.00".

If a European currency uses a period (.) for the thousandth place separator and a comma for the decimal place separator (,), it will display incorrectly. For example: "1.000,00". The import results may vary depending on your regional language setting.

### To import the CSV file without formatting issues:

1. In Microsoft Excel, go to **File** > **Open**.
   The Text Import Wizard will appear.
1. Under **Original Data Type**, choose **delimited**.  Default is **Fixed Width**.
1. Select **Next**.
1. Under Delimiters, select the check box for **Comma**. Clear **Tab** if it's selected.
1. Select **Next**.
1. Scroll over to the **ResourceRate** and **ExtendedCost** columns.
1. Select the **ResourceRate** column. It appears  highlighted in black.
1. Under the **Column Data Format** section, select **Text** instead of **General**. The column header will change from **General** to **Text.**
1. Repeat steps 8 and 9 for the **Extended Cost** column, and then select **Finish**.

> [!TIP]
> If you have set CSV files to automatically open in Excel, you must use the **Open** function in Excel instead. In Excel, go to **File** > **Open**.

## Balance and charge report

The balance and charge report offers a monthly summary of information on balances, new purchases, Azure Marketplace service charges, adjustments, and overage charges.

All rows in the Azure Service Commitment summary table remain static month-over-month. You'll find  details for all purchases and adjustments under the **New Purchase Details** and **Adjustment Details** sections.

### Download the balance and charge report

1. Sign in to the Azure Enterprise portal as an enterprise administrator.
1. Select **Reports** on the left pane.
1. Select the **Report Download** tab.
1. Select the appropriate month under the **Balance and Charge** column and select to download the report.

## Usage detail report

The usage detail report offers a monthly summary of an enrollments consumption of services and quantities. It includes information on meter names, meter types, and consumed quantities.

### Download the usage detail report

1. Sign in to the Azure Enterprise portal as an enterprise administrator.
1. Select **Reports** on the left navigation.
1. Select the **Download Usage** tab.
1. Select the appropriate month under the **Usage Detail** column and select to download the report.

## Azure Marketplace charges in Azure Enterprise portal reports

There are two types of Azure Marketplace charges:

- **Usage-based:** Products measured in transactional units.  For example, virtual machines are charged hourly, Bing API searches are charged by number of searches.
- **Monthly fee:** Billed monthly based on usage or access.

For more information on Azure Marketplace charges, see the [Azure Marketplace FAQs](https://azure.microsoft.com/marketplace/faq/).

To view the different charges in the Azure Enterprise portal:

- **Usage summary report**: Shows **both** usage based and monthly fee Azure Marketplace charges.
- **Marketplace charges report**: Shows **only** the usage-based Azure Marketplace charges.  One-time fees aren't shown.

> [!NOTE]
> Azure Marketplace is not available for MPSA enrollments.

## Advanced report download

For reporting on specific date ranges or accounts, you can use the advanced report download. As of August 30, 2016, the format of the output file is CSV to accommodate larger record sets.

1. In the Azure Enterprise portal, select **Advanced Report Download**.
1. Select **Appropriate Date Range**.
1. Select **Appropriate Accounts**.
1. Select **Request Usage Data**.
1. Select **Refresh** button until the report status updates to **Download**.
1. Download the report.

## Reporting for non-enterprise administrators

Enterprise administrators can give department administrators (DA) and account owners (AO) permissions to view charges on an enrollment. Account owners with access are able to download CSV reports specific to their account and subscriptions. They can also view the information visually under the reporting section of the Azure Enterprise portal.

### To enable access:

 1. Sign in to the Azure Enterprise portal as an enterprise administrator.
 1. Select **Manage** on the left navigation.
 1. Select the **Enrollment** tab.
 1. Under the **Enrollment Detail** section, select the pencil icon next to **DA View Charges** or **AO View Charges**.
 1. Select **Enabled**.
 1. Select **Save**.

### To view reports:

1. Sign in to the Azure Enterprise portal as a department administrator or an account owner.
1. Select **Reports** on the left navigation.
1. Select the **Usage Summary** tab to view information on the account and subscription visually.
1. Select **Usage Download** to view the CSV reports.

Department administrators and account owners are unable to view charges when using the **Advanced Report Download** function. Costs display as $0.

Account owner permissions to view charges extend to account owners and all users who have permissions on associated subscriptions. If you're an indirect customer, cost features must be enabled by your channel partner.

## Move usage data to another enrollment

Usage data is only moved when a transfer is backdated. There are two options to move usage data from one enrollment to another:

- Account transfers from one enrollment to another enrollment
- Enrollment transfers from one enrollment to another enrollment

For either option, you must submit a [support request](https://support.microsoft.com/supportrequestform/cf791efa-485b-95a3-6fad-3daf9cd4027c) to the EA Support Team for assistance. ​

## Azure EA pricing overview

This section provides details on how usage is calculated. It answers many frequently asked questions about charges for various Azure services in an Enterprise Agreement where the calculations are more complex.

### Price protection

As a customer or a channel partner, you're guaranteed to receive prices at or below prices shown on your Customer Price Sheet (CPS) or the price in effect on the effective date of your Azure purchase. This price is referred to as the baseline price. For services introduced after your Azure purchase, you're charged the price that's in effect at the applicable level discount when the service is first introduced. This price protection applies for the duration of your commitment term - one or three years depending upon your Enterprise Agreement.

### Price changes

Microsoft may drop the current Enterprise Agreement price for individual Azure services during the term of an enrollment. We'll extend these reduced rates to existing customers while the lower price is in effect. If these rates increase later, your enrollment's price for a service won't increase beyond your price protection ceiling as defined above. However, the rate might increase relative to the prior lowered price. In either case, we will inform customers and indirect channel partners of upcoming price changes by emailing the Enterprise and Partner administrators associated with the enrollment.

### Current effective pricing

Customer and channel partners can view their current pricing for an enrollment by logging into the [Azure Enterprise portal](https://ea.azure.com/) and viewing the price sheet page for that enrollment. If you purchase Azure indirectly through one of our channel partners, you'll need to obtain your pricing updates from your channel partner unless they've enabled markup pricing to be displayed for your enrollment.

### Introduction of new Azure services

We're continually enhancing Azure and periodically add new services that are priced separately from existing services. Some preview services are automatically available, while others require customer action in the [Azure Account portal](https://account.windowsazure.com/PreviewFeatures).

Some services start out with promotional pricing in effect when first introduced which may be increased at a future date.

As services move from preview to general availability (GA), prices might increase as full performance and reliability SLAs are applied. Such an increase isn't limited by normal baseline price protection. Usage of those services is charged at the increased rate. To avoid  charges related to these new services, you'll have to opt out of using them.

### Introduction of regional pricing

In addition to the introduction of new services, services also periodically change from a single global basis to a more regional model as regional support for those services is increased.

When regionalization of a service is first introduced, baseline price protection applies for those new regions. However, if additional regions for that same service are introduced at a later time, they're considered new services and are offered at their own individual rates independent of the baseline price protection.

### Enterprise Dev/Test

Enterprise administrators can enable account owners to create subscriptions based on the Enterprise Dev/Test offer. The account owner must set up the Enterprise Dev/Test subscriptions that are needed for the underlying  subscribers. This configuration allows active Visual Studio subscribers to run development and testing workloads on Azure at special Enterprise Dev/Test rates. For more information, see [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/).

## Enterprise Agreement usage calculations

Refer to [Azure services](https://azure.microsoft.com/services/) and [Azure pricing](https://azure.microsoft.com/pricing/) for basic public pricing information, units of measure, FAQs, and usage reporting guidelines for each individual service. You can find more information about EA calculations in the following sections.

### Enterprise Agreement units of measure

The units of measure for Enterprise Agreements are often different than seen in our other programs such as the Microsoft Online Services Agreement program (MOSA). This disparity means that, for a number of services, the unit of measure is aggregated to provide the normalized pricing. The unit of measure shown in the Azure Enterprise portal's Usage Summary view is always the Enterprise measure. A full list of current units of measure and conversions for each service is provided in the [Friendly Service Names](https://azurepricing.blob.core.windows.net/supplemental/Friendly_Service_Names.xlsx) Excel file.

### Rounding rules

The Azure Enterprise portal follows the IEEE standard Banker Rounding or Gaussian Rounding logic. This logic rounds numbers to the nearest even digit for half digit values. The more typical Half Round Up rounding logic always rounds half digits up to the next highest digit. This Azure Enterprise portal method actually provides a more accurate total sum over the group when compared to the standard Excel logic.

To illustrate: when the first dropped digit is a 5 and there are no following digits or the following digits are zeros, round off to the nearest even digit. For example: both 2.315 and 2.325 rounded to the nearest 100th become 2.32.

For reference, the following table shows Excel formulas you can use to model the Azure Enterprise portal rules for rounding and conversion:

| Scenario | Banker Logic Formula |
| --- | --- |
| Rounding Usage | =MROUND({_source_}, 0.0002) |
| Rounding Pricing (2 decimals) | =MROUND({_source_}, 0.02) |
| Rounding Pricing (0 decimals) | =MROUND({_source_}, 2) |

### Conversion between usage detail report and the usage summary page

In the download usage data report, you can see raw resource usage up to six decimal places. However, usage data shown in the Azure Enterprise portal is rounded to four decimal places for commitment units and truncated to zero decimals for overage units. Raw usage data is first rounded to four digits prior to conversion to units used in the Azure Enterprise portal. Then, the converted Enterprise units are rounded again to four digits. You can only see the actual consumed hours before conversion in the download usage report and not within the Azure Enterprise portal.

For example: If 694.533404 actual SQL Server hours are reported in the usage detail report. These units are converted to 6.94533404 of 100 compute hours, and then rounded to 6.9453 and displayed in the Azure Enterprise portal.

- To determine the extended billing amount, the displayed units are multiplied by the Commitment Unit Price, and the result is truncated to two decimals. For Japanese Yen (JPY) and Korean Won (KRW), the extended amount is rounded to zero decimals.
- For overage, the billing units are truncated to six digits and then multiplied by the Overage Unit Price to determine the extended billing amount.
- For Managed Service Provider (MSP) billing, all usage associated to a department marked as MSP is truncated to zero decimals after conversion to the EA unit of measure. As a result, the sum of this usage could be lower than the sum total of all usage reported in the Azure Enterprise portal. It depends on if the MSP is within their monetary commitment balance or is in overage.

### Graduated pricing

Enterprise Agreement pricing doesn't currently include graduated pricing where the charges per unit decreases as usage increases. When you move from a MOSA program with graduated pricing to an Enterprise Agreement, your prices are set commensurate with the service's base tier minus any applicable adjustments for Enterprise Agreement discounts.

### Partial hour billing

All billed usage is based on minutes converted to partial hours and not on whole hour increments. The listed hourly Enterprise rates are applied to total hours plus partial hours.

### Average daily consumption

Some services are priced on a monthly basis, but usage is reported on daily basis. In these cases, the usage is evaluated once per day, divided by 31, and summed across the number of days in that billing month. Thus, rates are never higher than expected for any month and are slightly lower for those months with less than 31 days.

### Compute hours conversion

Before January 28, 2016, usage for A0, A2, A3, and A4 Standard and Basic Virtual Machines and Cloud Services was emitted as A1 Virtual Machine meter minutes. A0 VMs counted as fractions of A1 VM minutes while A2s, A3s, and A4s were converted to multiples. Because this policy caused some confusion for our customers, we implemented a change to assign per-minute usage to dedicated A0, A2, A3, and A4 meters.

The new metering took effect between January 27 and January 28, 2016. On the CSV download that shows usage during this transition period, you can see both:

- Usage emitted on the A1 meter
- Usage emitted on the new dedicated meter corresponding with your deployment's size.

| **Deployment size** | **Usage emitted as multiple of A1 through January 26, 2016** | **Usage emitted on dedicated meter starting January 27, 2016** |
| --- | --- | --- |
| A0 | 0.25 of A1 hour | 1 of A0 hour |
| A2 | 2 of A1 hour | 1 of A2 hour |
| A3 | 4 of A1 hour | 1 of A3 hour |
| A4 | 8 of A1 hour | 1 of A4 hour |

### Regions

For those services where zone and region affect pricing, see the following table for a map of  geographies and regions:

| Geo | Data Transfer Regions | CDN Regions |
| --- | --- | --- |
| Zone 1 | Europe North <br> Europe West <br> US West <br> US East <br> US North Central <br> US South Central <br> US East 2 <br> US Central | North America <br> Europe |
| Zone 2 | Asia Pacific East <br> Asia Pacific Southeast <br> Japan East <br> Japan West <br> Australia East <br> Australia Southeast | Asia Pacific <br> Japan <br> Latin America <br> Middle East / Africa <br> Australia East <br> Australia Southeast |
| Zone 3 | Brazil South |   |

There are no charges for data egress between services housed within the same data center. For example, Office 365 and Azure.

### Monetary commitment and unbilled usage

Azure monetary commitment is an amount paid up front for Azure services. The monetary commitment is consumed as services are used. First-party Azure services are billed against the monetary commitment. However, some charges are billed separately, and Azure Marketplace services don't consume monetary commitment.

### Charges billed separately

Some products and services provided from third-party sources don't consume Azure monetary commitment. Instead, these items are billed separately as part of the standard billing cycle's overage invoice.

We've combined all Azure and Azure Marketplace charges into a single invoice that aligns with the enrollment's billing cycle. The combined invoice doesn't apply to customers in Australia, Japan, or Singapore.

The combined invoice shows Azure usage first, followed by any Azure Marketplace charges. Customers in Australia, Japan, or Singapore see their Azure Marketplace charges on a separate invoice.

If there's no overage usage at the end of the standard billing cycle, charges billed separately are invoiced separately. This process applies to customers in Australia, Japan, and Singapore.

The following services are billed separately:

- Canonical
- Citrix XenApp Essentials
- Citrix XenDesktop Registered User
- Openlogic
- Remote Access Rights XenApp Essentials Registered User
- Ubuntu Advantage
- Visual Studio Enterprise (Monthly)
- Visual Studio Enterprise (Annual)
- Visual Studio Professional (Monthly)
- Visual Studio Professional (Annual)

## What to expect after change of channel partner

If the change of channel partner (COCP) happens in the middle of the month, a customer will receive an invoice for usage under the previous associated partner and another invoice for the usage under new partner.

The invoices will be released following the month after the billing period ends. If the billing cadence is monthly, then September's invoice will be released in October for both partners. If the billing cycle is quarterly or annually, the customer can expect an invoice for the previous associated partner for the usage under their period and rest will be to the new partner based on the billing cadence.

## Azure Marketplace for EA customers

For direct customers, Azure Marketplace charges are visible on the Azure Enterprise portal. Azure Marketplace purchases and consumption are billed outside of monetary commitment on a quarterly or monthly cadence and in arrears.

Indirect customers can find their Azure Marketplace subscriptions on the **Manage Subscriptions** page of the Azure Enterprise portal, but pricing will be hidden. Customers should contact their Licensing Solutions Provider (LSP) for information on Azure Marketplace charges.

New monthly or annually recurring Azure Marketplace purchases are billed in full during the period when Azure Marketplace items are purchased. These items will autorenew in the following period on the same day of the original purchase.

Existing, monthly recurring charges will continue to renew on the first of each calendar month. Annual charges will renew on the anniversary of the purchase date.

Some third-party reseller services available on Azure Marketplace now consume your Enterprise Agreement (EA) monetary commitment balance. Previously these services were billed outside of EA monetary commitment and were invoiced separately. EA monetary commitment for these services in Azure Marketplace helps simplify customer purchase and payment management. For a complete list of services that now consume monetary commitment, see the [March 06, 2018 update on the Azure website](https://azure.microsoft.com/updates/azure-marketplace-third-party-reseller-services-now-use-azure-monetary-commitment/).

### Partners

LSPs can download an Azure Marketplace price list from the price sheet page in the Azure Enterprise portal. Select the **Marketplace Price list** link in the upper right. Azure Marketplace price list shows all available services and their prices.

To download the price list:

1. In the Azure Enterprise portal, go to **Reports** > **Price Sheet**.
1. In the top-right corner, find the link to Azure Marketplace price list under your username.
1. Right-click the link and select **Save Target As**.
1. On the **Save** window, change the title of the document to `AzureMarketplacePricelist.zip`, which will change the file from an .xlsx to a .zip file.
1. After the download is complete, you'll have a zip file with country-specific price lists.
1. LSPs should reference the individual country file for country-specific pricing. LSPs can use the **Notifications** tab to be aware of SKUs that are net new or retired.
1. Price changes occur infrequently. LSPs get email notifications of price increases and foreign exchange (FX) changes 30 days in advance.
1. LSPs receive one invoice per enrollment, per ISV, per quarter.

### Enabling Azure Marketplace purchases

Enterprise administrators can disable or enable Azure Marketplace purchases for all Azure subscriptions under their enrollment. If the enterprise administrator disables purchases, and there are Azure subscriptions that already have Azure Marketplace subscriptions, those Azure Marketplace subscriptions won't be canceled or affected.

Although customers can convert their direct Azure subscriptions to Azure EA by associating them to their enrollment in the Azure Enterprise portal, this action doesn't automatically convert the child subscriptions.

To enable Azure Marketplace purchases:

1. Sign in to the Azure Enterprise portal as an enterprise administrator.
1. Go to **Manage**.
1. Under **Enrollment Detail**, select the pencil icon next to the **Azure Marketplace** line item.
1. Toggle **Enabled/Disabled** or Free **BYOL SKUs Only** as appropriate.
1. Select **Save**.

> [!NOTE]
> BYOL (bring your own license) and the Free Only option limits the purchase and acquisition of Azure Marketplace SKUs to BYOL and Free SKUs only.

Get more information about [Azure Marketplace charges in Azure Enterprise portal reports](#azure-marketplace-charges-in-azure-enterprise-portal-reports).

### Services billed hourly for Azure EA

The following services are billed hourly under an Enterprise Agreement instead of the monthly rate in MOSP:

- Application Delivery Network
- Web Application Firewall

### Azure RemoteApp

If you have an Enterprise Agreement, you pay for Azure RemoteApp based on your Enterprise Agreement price level. There aren't additional charges. The standard price includes an initial 40 hours. The unlimited price covers an initial 80 hours. RemoteApp stops emitting usage over 80 hours.

## Azure Marketplace FAQ

This section explains how your Azure monetary commitment might apply to some third-party reseller services in Azure Marketplace.

### What changed with Azure Marketplace services and EA monetary commitment?

As of March 1, 2018, some third-party reseller services  consume EA monetary commitment (MC). Except for Azure reserved VM instances (RIs), services were previously billed outside EA monetary commitment and were invoiced separately.

We expanded the use of MC to include some of the third party published Azure Marketplace services that are purchased most frequently. EA monetary commitment for these services in Azure Marketplace helps simplify your purchase and payment management.

### Why did we make this change?

Customers are continually looking for additional ways to leverage the upfront MC payment. This change was frequently requested by customers, and it impacted a large portion of Azure Marketplace customers.

### How do you benefit?

You get a simpler billing experience and are better able to spend your EA monetary commitment. Because these services are included in your pre-paid MC, your EA monetary commitment becomes more valuable.

### What Azure Marketplace services use EA monetary commitment, and how do I know?

When you purchase a service that uses MC, Azure Marketplace presents a disclaimer. Supported are some services published by Red Hat, SUSE, Autodesk, and Oracle. Currently, similarly named services published by other parties don't deduct from MC. A full list is available at the end of this FAQ.

### What if my EA monetary commitment runs out?

If you consume all your MC and go into overage, charges related to these services will appear on your next overage invoice along with any other consumption services. Before the March 1, 2018 change, these charges were invoiced with other Azure Marketplace services.

### Why don't all Azure Marketplaces consume EA monetary commitment?

We frequently work to deliver the best customer experience related to EA monetary commitment. This change addressed a large number of customers and a significant portion of the total spend in Azure Marketplace. Other services might be added in the future.

### How does this impact indirect enrollment and partners?

There's no impact to our indirect enrollment customers or partners. These services are subject to the same partner markup capabilities as other consumption services. The only change is that the charges appear on a different invoice, and the payment of the charges comes out of the customer's EA monetary commitment.

### Is there a list of Azure Marketplace services that consume EA monetary commitment?

Specific Azure Marketplace offers can use monetary commitment funds. See [third-party services that use monetary commitment](https://azure.microsoft.com/updates/azure-marketplace-third-party-reseller-services-now-use-azure-monetary-commitment) for a complete list of products participating in this program.

## Power BI reporting

Power BI reporting is available for EA direct, partner, and indirect customers who have access to view billing information.

### Power BI Pro

Power BI Pro is available for EA customers. With Power BI Pro, you can generate and share reports to effectively manage your cost data. It also has additional collaboration and data refresh features. Power BI Pro offers higher data capacity and data streaming limits.

<!--We plan to add new cost management features for Azure Enterprise customers.

Current Power BI (free) users who use the Microsoft Azure Consumption Insights content pack can get a 60-day free trial of Power BI Pro. After the trial is over, you can continue using Power BI Pro by adding a license.

To sign up for the free Power BI Pro trial:

1. From the gear icon in Power BI, select **Manage personal storage**.
1. Select **Try Pro for free** on the right.

See [Power BI self-service sign up](https://powerbi.microsoft.com/documentation/powerbi-service-self-service-signup-for-power-bi/#power-bi-pro-60-day-trial) for more information on the Power BI Pro free trial.

### Azure EA Power BI Pro trial terms

- **General purpose**: The extended Power BI Pro for the "Microsoft Azure Enterprise" content pack trial offer (the "Offer") is available to existing qualified users during the term of the Offer, to allow them to access certain insights related to their Azure consumption through the use of a specific Power BI content pack.
- **Eligibility**: Users under an Enterprise Agreement (EA) can participate in the Offer if they have a function related to their organization's Azure billing, service, or cost management.
- **Exclusions**:
  - Users already participating in the Extended Power BI Pro trial will continue to qualify under the pre-existing offer and can't enter into the Azure EA Power BI Pro trial offer.
  - Users participating in the Offer can only use Power BI Pro with the Microsoft Azure Enterprise content pack. Any other use of Power BI Pro is prohibited.
  - Term: The Offer began on June 1, 2017 and ended on May 31, 2018.  Acceptance can occur at any time during the 12-month period, though the offer will terminate on May 31, 2018 for all users regardless of when they accepted the Offer.
  -->

### To access Microsoft Azure Consumption Insights:

1. Go to [Microsoft Azure Consumption Insights](https://app.powerbi.com/getdata/services/azureconsumption?cpcode=MicrosoftAzureConsumptionInsights&amp;getDataForceConnect=true&amp;WT.mc_id=azurebg_email_Trans_33675_1378_Service_Notice_EA_Customer_Power_BI_EA_Content_Pack_Apr26).
1. Select **Get It Now**.
1. Provide an enrollment number and the number of months, and then select **Next**.
1. Provide your API access key to connect. You can find the key for your enrollment in the [Enterprise portal](https://ea.azure.com/?WT.mc_id=azurebg_email_Trans_33675_1378_Service_Notice_EA_Customer_Power_BI_EA_Content_Pack_Apr26).
1. Select **Sign In** to automatically start the import process.
1. When complete, a new dashboard, report, and model appear in the navigation pane. Select the dashboard to view your imported data.

> [!TIP]
>
> - To learn how to generate the API key for your enrollment, see the API Reports help file on the [Enterprise portal](https://ea.azure.com/?WT.mc_id=azurebg_email_Trans_33675_1378_Service_Notice_EA_Customer_Power_BI_EA_Content_Pack_Apr26).
> - For more information about connecting Power BI to your Azure consumption, see [Microsoft Azure Consumption Insights](/power-bi/desktop-connect-azure-cost-management).

### To access the legacy Power BI EA content pack:

1. Go to the [Power BI website](https://app.powerbi.com/getdata/services/azure-enterprise).
1. Sign in with a valid work or school account.

   The work or school account can be the same or different than what you use to access the enrollment through the Azure Enterprise portal.
1. On the dashboard of services, select **Microsoft Azure Enterprise** and select **Connect**.
1. On the **Connect to Azure Enterprise** screen, fill in the fields:
    - Azure Environment URL: [https://ea.azure.com](https://ea.azure.com/)
    - Number of Months: from 1 to 36
    - Enrollment Number: your enrollment number
1. Select **Next**.
1. In **Authentication Key Box**, enter the API key.

    You can get the API key in the Azure Enterprise portal under the **Download Usage** tab. Select **API Access Key**, and then paste the key into the **Account Key** box.
1. Data takes approximately 5-30 minutes to load in Power BI, depending on the size of the data sets.

## Reports FAQ

This section addresses common questions about reports.

### Why is my cost showing as $0?

For **direct enrollment** customers, enterprise administrators can provide account owners and department administrators with access to cost/pricing information on the usage reports. Follow these steps:

1. In the Azure Enterprise portal, select **Manage** on the left navigation.
1. Select the blue pencil next to DA (department administrator) view charges.
1. Select **Enabled** and save.
1. Select the blue pencil next to AO (account owner) view charges.
1. Select **Enabled** and save.

> [!NOTE]
> If you're an account owner or department administrator, contact your enterprise administrator to enable the pricing feature.

For **indirect enrollment** customers, contact your partner to check that they've enabled the pricing feature for you. This can only be done by the partner. After you're enabled, you can view the cost and pricing on your enrollment as an enterprise administrator.

Partners, if you want to enable the view charges feature for an account owner or a department administrator, follow the steps under **direct enrollment**.

### Why is there no SKU information on my usage detail report?

The usage detail report doesn't contain SKU information. The report does, however, contain usage information so you can download the price sheet report to obtain the SKU information.

### Why doesn't the total amount on Azure Marketplace match the reports for usage summary and detail?

The Azure Marketplace charges report shows only the usage-based charges. One-time fees aren't shown. See the usage summary page for the most up-to-date usage-based charges and one-time fees.

### Why is there no information on my API report?

API keys expire every six months. If you're having an issue, an enterprise administrator should generate a new API key. Remember to follow the steps on the API Report FAQ.

### Why isn't my Power BI report working?

For issues with Power BI, log a ticket with the [Power BI support team](https://support.powerbi.com).

### Why don't my resource tags show on my reports

Resource tags are managed on the Azure portal. You can contact the Azure subscription team in the [Azure portal](https://portal.azure.com). Follow the steps in the [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request) article.

### Why does my resource rate change every day?

The resource rate shown in the detailed usage report is a calculated value. It represents the average monthly rate that was charged for the service. The resource rate is calculated from the average of your monthly commitment and your monthly overage charges for a unit of service. The portion of usage charged against your commitment and overage rates change to the day the month closes. Thus, the listed resource rate also changes during the month. The resource rate locks on the fifth day following the end of the month.

### Glossary of processes for calculating the resource rate

- **Total RAW Units:** Consumed quantity in the detailed usage report.
- **MOCP Resource Per Unit:** The upstream usage system emits the usages for each service in different units. (Preset)
- **Consumption Per Unit:** Azure Enterprise unit of measure. (Preset)
- **Price:** Unit price from the Azure Enterprise portal.
- **Total Cost:** Extended cost from the detailed usage report, or the commitment usage plus overage from the Azure Enterprise portal.

### Charges calculations

- **Convert to consumed MOCP resources** = `ROUND(Total RAW Units * MOCP Resource Per Unit,4)`
- **Convert to consumed units** = `Consumed MOCP Resources / Consumption per Unit`
- **Calculate total cost** = `Consumed Units * Price`

### Logic in the Usage Calculation Logic

**Resource Rate** = `Total Cost /(Total RAW Units / MOCP Resource Per Unit)`

The resource rate is derived based on your charges. It might not match the actual unit price in the price sheet.

In the download usage data report, you can see raw resource usage up to six decimal places. This data is used for overage charge calculations. However, usage data shown in the Azure Enterprise portal is rounded to four decimal places for commitment units and truncated to zero decimals for overage units. Under the Azure Enterprise portal, all overage usage is charged for full units only. You might see a large difference between the unit price and the resource rate for usage that is charged as overage or in mixed months.

## Next steps

- The following Excel files provide details on Azure services and are updated on the 6th and 20th of every month:

   | Title | Description | File name |
   | --- | --- | --- |
   | [Friendly Service Names](https://azurepricing.blob.core.windows.net/supplemental/Friendly_Service_Names.xlsx) | Lists all active services and includes: <br>  <ul><li>service category</li>   <li>friendly service name</li>   <li>commitment name and part number</li> <li>consumption name and part number</li>   <li>units of measure</li>   <li>conversion factors between reported usage and displayed Enterprise portal usage</li></ul> | Friendly\_Service\_Names.xlsx |
   | [Service Download Fields](https://azurepricing.blob.core.windows.net/supplemental/Service_Download_Fields.xlsx) | This spreadsheet provides a listing of all possible combinations of the service-related fields in the Usage Download Report. | Service\_Download\_Fields.xlsx |

- For information about understanding your invoice and charges, see [Understand your Azure Enterprise Agreement bill](../understand/review-enterprise-agreement-bill.md).
- To start using the Azure Enterprise portal, see [Get started with the Azure EA portal](ea-portal-get-started.md).
