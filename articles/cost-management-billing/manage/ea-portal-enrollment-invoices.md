---
title: Azure enterprise enrollment invoices
description: This article explains how to manage and act on your Azure Enterprise invoice.
keywords:
author: bandersmsft
ms.author: banders
ms.date: 01/02/2020
ms.topic: conceptual
ms.service: cost-management-billing
manager: boalcsva
---

# Azure enterprise enrollment invoices

This article explains how to manage and act on your Azure Enterprise invoice. Your invoice is a representation of your bill, so you should review it for accuracy. You should also get familiar with other tasks that might be needed to manage your invoice.

## Change a PO number for an overage invoice

The Azure EA portal automatically generates a default purchase order (PO) number unless the EA admin sets one before the invoice date. An EA admin can update the PO number up to seven days after receiving an automated invoice notification email.

### To update the Azure services purchase order number:

1. From the Azure EA Portal, click **Report** then **Usage Summary**.
1. Select **Edit PO Numbers** in the upper right corner.
1. Select the **Azure Services** radio button.
1. Select an **Invoice Period** from the date ranges drop-down menu. PO numbers can be edited for up to seven days after notification of the invoice or until the invoice is paid, whichever comes first.
1. Enter new PO number in the **PO Number** field.
1. Click **Save** to submit change.

### To update the marketplace purchase order number:

1. From the Azure EA Portal, click **Report** then **Usage Summary**.
1. Select **Edit PO Numbers** in the upper right corner
1. Select the **Marketplace** radio button
1. Select an **Invoice Period** from the date ranges drop-down menu. PO numbers can be edited for up to seven days after notification of the invoice or until the invoice is paid, whichever comes first.
1. Enter new PO number in the **PO Number** field.
1. Click **Save** to submit change.

## Cadence of Azure EA billing

### Billing Intervals

Microsoft will bill annually at the enrollment effective date for any commitment purchases of the Microsoft Azure services and in arrears for any usage in exceeding the commitment amounts. Commitment fees are quoted based on a monthly rate and billed annually in advance. Overage fees are calculated each month and billed in arrears at the end of your billing period.

Depending on how you choose to make your commitment purchases, your annual commitment will either be coterminous with your enrollment anniversary date or with the effective date of your one-year Amendment Subscription.

You'll receive your overage invoice depending on your enrollment start date and set-up.

**Direct enrollments with a start date before May 1, 2018**: Direct Enterprise Azure (EA) Customers are set up as an Annual Billing cycle for Azure Services (excluding Marketplace services). Your billing cycle is based on the Anniversary date. The Anniversary date is the date on which your agreement became effective. To receive the first Azure Service Overage invoice, you must surpass 150% of your Monetary Commitment ('MC') threshold.  Once total service consumption surpasses 150% of your MC threshold, you'll convert automatically to a Quarterly Billing cycle based on the Anniversary date.  If you don't surpass 150% of your MC threshold, the enrollment will remain on an Annual Billing cycle and the Overage invoice will be received at the end of the Commitment year.

**Direct enrollments with a start date after May 1, 2018**: The Customer’s Azure Consumption and Charges Billed Separately Invoices will be on a Monthly Billing cycle.  Any charges that aren't covered by the Azure Monetary Commitment will be due as an Overage payment.  

**Indirect enrollments with an enrollment that started before May 1, 2018**: Indirect Enterprise Azure (EA) Customers are set up as a Quarterly Billing cycle.  The Channel Partner (CP) will be invoicing the Customer directly.  

**Indirect enrollments with a start date after May 1, 2018**: Any Indirect Agreement with a start date greater than or equal to May 1, 2018 will be billed Monthly.  

### Increasing Commitment

Commitment can be increased at any time and will be billed for the number of months remaining for that year’s commitment period. For example, if you sign up for a one-year Amendment Subscription and increase your commitment during month six, you'll be invoiced for the remaining six months of that term. Your commitment quantities will then be updated for the last six months of your commitment term for determining any overage charges.

### Overage

For overage, you're billed for the usage or reservations that exceeded your commitment during the billing period. To view a breakdown of how the overage quantities for individual items were calculated, please refer to the Usage Summary Report or contact your channel partner.

For each item on the invoice, you'll see the total charges (Extended Amount), the amount of commitment used to cover the charges (Commitment Usage) and the amount of charges in exceeding commitment (Net Amount).  Applicable taxes are computed only on the net amount in exceeding of commitment.

Overage invoicing is automated.  The timing of notifications and invoices depends on the customer’s billing period end date.  Notification of overage is sent usually seven days following the customer’s billing end date, during which customers can go into the portal, review their charges, and update the system-generated PO#s (This can also be updated at any time before the overage is released).  Overage invoices will be sent 7-9 days afterwards.

### Azure Marketplace

Effective April 2019 billing cycle, customers will start to receive a single Azure invoice, as we’ve combined all Azure and Azure Marketplace charges into a single invoice instead of two separate invoices. (This change does not affect customers in Australia, Japan, or Singapore.)
During the transition to a consolidated invoice, you’ll receive a partial Marketplace invoice. This final separate invoice will show Marketplace charges prior to the date of your billing update. Marketplace charges after that date will appear on your Azure invoice. After the transition period, you’ll see all Azure and Marketplace charges on the consolidated invoice.  

### Purchase Order Numbers

The purchase order default is a system-generated Purchase Order number. Users can update their Purchase Order number in the Enterprise Portal by logging in an Enterprise Administrator and navigating to the Reports section. there's a box for PO number in the upper right-hand corner of the window that will allow the Enterprise Administrator to edit the PO number by clicking on the Pencil icon.

## Adjust billing frequency

A customer's billing frequency is annual, quarterly, or monthly. The billing cycle is determined when a customer signs their agreement. Monthly billing is smallest billing interval.

Approval from enterprise admin is required to change a billing cycle change from annual to quarterly for direct enrollments. Approval from a partner admin is required for indirect enrollments. The change becomes effective at the end of the current billing quarter.

To change a billing cycle annual or quarterly to monthly, an amendment to the agreement is required.  Any change to the existing enrollment billing cycle requires approval of an enterprise admin or from the individual identified as the _Bill to Contact_ in your agreement. You can submit your approval in the [Azure EA Portal Support](https://support.microsoft.com/supportrequestform/cf791efa-485b-95a3-6fad-3daf9cd4027c) and then select the Issue Category **Billing and Invoicing**.  The change becomes effective at the end of the current billing quarter.

If an Amendment M503 is signed, you can move any agreement from any frequency to monthly billing. ​

## Credits and adjustments

All credits or adjustments that are applied to your enrollment are visible at [https://ea.azure.com](https://ea.azure.com) in the **Reports** section.

To view the credits, follow these steps:

1. Select the **Reports** section.
1. Click on **Usage Summary**.
1. In the top-right corner, change the _M_ to _C_ view.
1. Extend the adjustment field in the Azure service commitment table.
1. In this line, you'll see the credits applied to your enrollment as well as a short explanation for example: Service Level Agreement Credit.

## Request an invoice copy

To request a copy of your invoice, contact your partner.

## Overage offset by customers

If the customer has overages that they want to use with monetary commitment, the following criteria must be met:

- The customer should have overage charges that were incurred but haven't been paid and are within one year of the billed service's end date.
- The available monetary commitment amount should cover the full number of incurred charges, including all past nonpaid Azure invoices.
- The Billing term being requested to complete must be fully closed. Billing fully closes after the fifth day of each month.
- The billing period being requested to offset must be fully closed.
- ACD discounting is based on the actual new commitment minus any funds planned for the previous consumption. This requirement applies only to overage charges incurred. This only works for services that consume monetary commitment, so you can't cover marketplace charges. Marketplace charges are billed separately.
- If a customer wants to complete an overage offset, they can open a support request. Or, the account team can open the support request. To complete the process, email approval from the Customer's EA Admin or the Bill to Contact is required.

## View price sheet information

Enterprise admins can view the price list associated with their enrollment for Azure services.

To View the current Price Sheet:

1. In the Azure EA portal, click **Reports** and then click **Price Sheet**.
2. View the price sheet or click **Download**.

![Example showing price sheet information](./media/ea-portal-enrollment-invoices/ea-create-view-price-sheet-information.png)

To download a historical price list:

1. In the Azure EA portal, click **Reports** and then click **Download usage**.
2. Download the price sheet.

![Example showing where to download an older price sheet](./media/ea-portal-enrollment-invoices/create-ea-view-price-sheet-download-historical-price-list.png)

If you have questions about why there's a discrepancy in pricing, some reasons include:

Pricing might have changed between the previous enrollment and the new enrollment. Price changes occur because pricing is contractual for specific enrollment from the start date to end date of an agreement. When an enrollment is transferred to new enrollment, it follows the pricing of a new agreement. The pricing is defined by the customer's price sheet. So, prices might be higher in the new enrollment.

If an enrollment goes into an extended term, the pricing also changes. Prices change to pay-as-you-go rates.

## Request detailed usage information

Enterprise admins can view a summary of their usage data, monetary commitment consumed, and charges associated with additional usage in the Azure EA portal. The charges are presented at the summary level across all accounts and subscriptions.

To view detailed usage in specific accounts, you can download the Usage Detail report by navigating to **Reports** > **Download Usage**. The report doesn't include any applicable taxes. There might be a latency of up to eight hours from the time when usage was incurred to when it's reflected on the report.

For indirect enrollments, your partner needs to enable the markup function before you can see any cost-related information.

## Reports

Enterprise Administrators can view a summary of their usage data, monetary commitment consumed, and charges associated with additional usage in the Enterprise Portal. The charges will be presented at the summary level across all accounts and subscriptions.

**EA Reports**

- Usage summary and graphs
- Service usage report
- Balance and charge report
- Usage detail report
- Marketplace charges report
- Price sheet
- Advanced report download
- CSV report formatting

**To view the usage summary reports and graphs**

1. From the Azure EA Portal click **Reports** on the left navigation, and view the **Usage Summary** tab.
1. Select the desired commitment term from the drop-down menu of date ranges on the top left.
1. Select the desired period or month on the graph to view additional detail.
1. View graph of month over month usage with a breakdown of utilized usage, service overcharge, charges billed separately, and marketplace charges.
1. For the selected month, filter by departments, accounts, and subscriptions below the graph.
1. Toggle between Charge by Services breakdown and Charge by Hierarchy breakdown.
1. View Azure services, charges billed separately, and Azure marketplace charges in detail.

## Service usage report

The Service Usage Report page allows enterprise administrators to view a summary of their service usage data. While usage will be presented at the summary level across all accounts and subscriptions, you can also filter the report by accounts or subscriptions to view detailed usage.

Please note that there may also be a latency of up to five days between the incurred usage date and when that usage is reflected on this report.

### To view the report:

1. Sign into the Enterprise Portal.
1. Click **Reports** on the left navigation.
1. Click the **Usage Summary** tab.
1. Click on the desired date range.
1. Choose which accounts or subscriptions to view.
1. Change the view from Charge by Services or Charge by Hierarchy to display different breakdowns.
1. View details including Service Name, Unit of Measure, Consumed Units, Effective Rate, and Extended Cost.

## Download CSV reports

The Monthly Report Download page allows enterprise administrators to download several reports as .csv files, including a Balance and Charge Report, Usage Detail Report, Marketplace Charges Report, and Price Sheet.

## To download reports:

1. From the Azure EA portal, click **Report**.
1. Select **Usage Download** from the top ribbon.
1. Select **Download** next to the appropriate month's report.



## CSV report formatting

Customers viewing the Azure EA Portal's CSV reports in euros may run into formatting issues with regards to commas and periods.

For example, you may see:

| **ServiceResource** | **ResourceQtyConsumed** | **ResourceRate** | **ExtendedCost** |
| --- | --- | --- | --- |
| Hours | 24 | 0,0535960591133005 | 12,863,054,187,192,100,000,000 |

You should see:

| ServiceResource | ResourceQtyConsumed | ResourceRate | ExtendedCost |
| --- | --- | --- | --- |
| Hours | 24 | 0,0535960591133005 | 1,2863054187192120000000 |

### Root cause

Excel imports all fields as 'General' text and assumes that a number is separated in the mathematical standard: "1,000.00".  Thus a European currency that uses a period (.) for the thousand place separator and a comma for the decimal place separator (,) – "1.000,00" will display incorrectly. This may vary depending on your regional language setting.

### When importing the CSV, use the following steps:

1.    Open Excel, and go to File > Open.
1.    The Text Import Wizard will appear.
1.    Under Original Data Type, choose _delimited_.  Default is _Fixed Width_.
1.    Hit **Next**.
1.    Under Delimiters, select the checkbox for Comma. Default is 'Tab' (uncheck).
1.    Hit **Next**.
1.    Scroll over to the 'ResourceRate' and 'ExtendedCost' columns.
1.    Select the 'ResourceRate' column (it will appear highlighted in black).
9.    Under the Column Data Format section, select 'Text' instead of 'General.'  You'll see that the column header changes from 'General' to 'Text.'
10. Repeat steps 8 and 9 for the 'Extended Cost' column. Select **Finish**.

If you have Excel associated to automatically open \*.csv files, you must use the 'open' function in Excel instead. Open excel, go to File > open.

## Balance and charge report

The Balance and Charge Report offers a monthly summary of information on balances, new purchases, Azure Marketplace service charges, adjustments, and overage charges. All rows in the Azure Service Commitment summary table will remain static month over month, while details for all purchase and adjustments will be displayed under the New Purchase Details and Adjustment Details sections.

### Download the balance and charge report

1. Sign in to the Azure EA Portal as an enterprise administrator.
1. Click on **Reports** on the left navigation.
1. Click the **Report Download** tab.
1. Select the appropriate month under the _Balance and Charge_ column and click to download the report.

## Usage detail report

The Usage Detail Report offers a monthly summary of the services and quantities being consumed by an enrollment, including information on meter names, meter types, and consumed quantities.

### Download the usage detail report

1. Sign in to the Azure EA Portal as an enterprise administrator.
1. Click on **Reports** on the left navigation.
1. Click the **Download Usage** tab.
1. Select the appropriate month under the _Usage Detail_ column and click to download the report.

## Marketplace charges in Azure EA Portal reports

Additional information on Marketplace charges can be found [here.](https://azure.microsoft.com/marketplace/faq/)

There are two types of marketplace charges:

- **Usage-based:** Products measured in transactional units.  For example, virtual machines are charged hourly, Bing API searches are charged by number of searches.
- **Monthly Fee:** Billed monthly based on usage/access.

To view the different charges in the Enterprise Portal:

1. **Usage Summary Report –** Shows **both** usage based and monthly fee marketplace charges.
1. **Marketplace Charges Report –** Shows **only** the usage-based marketplace charges.  One time fees aren't shown.

Not that Azure Marketplace is not available for MPSA enrollments.

## Advanced report download

For reporting on specific date ranges or accounts, the advanced report download can be used. As of August 30, 2016, the format of the output file is changing from .xlsx to .csv to accommodate larger record sets.

1. Select **Advanced Report Download**.
1. Select **Appropriate Date Range**.
1. Select **Appropriate Accounts**.
1. Select **Request Usage Data**.
1. Select **Refresh** button until the report status updates to 'Download'.
1. Download report.

## Reporting for non-enterprise administrators

Enterprise Administrators can enable access to view costs for Department Administrators (DA) and Account Owners (AO) on an enrollment. Once enabled, an account owner can download .csv reports specific to their account and subscriptions, and view the information visually under the reporting section of the Enterprise Portal.

### To enable access:

 1. Sign in as an enterprise administrator.
 1. Click **Manage** on the left navigation.
 1. Click the **Enrollment** tab.
 1. Under the Enrollment Detail section, select the pencil icon next to:
    - DA View Charges
    - AO View Charges
 1. Select **Enabled**.
 1. Click **Save**.

### To view reports:

1. Sign in to the Azure EA Portal as a department administrator or an account owner.
1. Click **Reports** on the left navigation.
1. Click the **Usage Summary** tab to view information on the account and subscription visually.
1. Click on **Usage Download** to view the .csv reports.

Department administrators and account owners are unable to view charges when using the _Advanced Report Download_ function. Costs display as $0.

AO View charges extends to account owners and all users who have permissions on associated subscriptions. If you're an indirect customer, cost features must be enabled by your channel partner.

## Move usage data to another enrollment

Usage data is only moved when a transfer is backdated. There are two options to move usage data from one enrollment to another:

- Account transfers from one enrollment to another enrollment
- Enrollment transfer from one enrollment to another enrollment

For either option, you must submit a [support request](https://support.microsoft.com/supportrequestform/cf791efa-485b-95a3-6fad-3daf9cd4027c) to the EA Support Team for assistance. ​

## Azure EA pricing overview

This document provides details on how usage is calculated and answers many of the more frequently asked questions regarding pricing for various Azure services in Enterprise Programs where the calculations are more complex.

### Price protection

Customers and channel partners (in the case of our indirect channels) are guaranteed to receive prices at or below those indicated in their Customer Price Sheet (CPS) or the price in effect on the effective date of their Azure purchase. This price is referred to as the Baseline price. For services introduced after that purchase, it's the price in effect at the applicable level discount when the service was first introduced. This price protection applies for the duration of the commitment term which can be one or three years depending upon the Enterprise Program.

### Price changes

Microsoft may drop the current Enterprise Program price for individual Azure services during the term of an enrollment.  We will extend these reduced rates to existing customers while the lower price is in effect.  If these rates are subsequently increased later, the enrollment's price for a service won't increase beyond the customer's price protection ceiling as defined above but may increase relative to the prior lowered price.  In either case, Microsoft will inform customers and indirect channel partners of upcoming price changes by emailing the enterprise and partner administrators associated with the enrollment.

### Current effective pricing

Customer and channel partners can view their current pricing for an enrollment by logging into the [Azure Enterprise Portal](https://ea.azure.com/) and navigating to the price sheet page for that enrollment.  If you purchase Azure indirectly through one of our channel partners, you'll need to obtain your pricing updates from your channel partner if they've not enabled markup pricing to be displayed for your enrollment.

### Introduction of new Azure services

We're continually enhancing Azure and periodically add new services that are priced separately from existing services.  Some preview services are automatically available, while others require customer action via in the [Azure Account Portal](https://account.windowsazure.com/PreviewFeatures). Note also that as services move from Preview to GA, prices may increase as full performance and reliability SLAs are applied. Lastly, some services are provided with Promotional pricing in effect when first introduced which may be increased at a future date. Any such increases moving from Preview or Promotional pricing to GA aren't constrained by normal Baseline price protection and will apply to usage of those services moving forward. Customers can avoid charges related to these services by electing to not use the new service.

### Introduction of regional pricing

In addition to the introduction of new services, services also periodically change from a single Global basis to a more Regional model as regional support for those services is increased. When regionalization of a service is first introduced, price protection applies for those new regions as compared to the prior Global price effective for the enrollment. However, additional regions introduced at a later time for that same service are considered new services and are offered at their own individual rates independent of the baseline price protection.

### Enterprise MSDN Dev/Test

Enterprise Administrators can enable Account Owners to create subscriptions based on the EA MSDN Dev/Test offer. In order for this to function correctly, the Account Owner will need to set up the EA MSDN Dev/Test subscriptions needed for the underlying MSDN subscribers. This enables active MSDN subscribers to run development and testing workloads on Azure at special dev/test rates. For more information, see [EA MSDN Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/).

### Enterprise program usage calculation guidelines

Please refer to [Azure Services](https://azure.microsoft.com/services/) and [Azure Pricing](https://azure.microsoft.com/pricing/) for basic public pricing information, units of measure, FAQs, and usage reporting guidelines for each individual service. In addition, when calculating service usage, the following Enterprise Program guidelines should be used.

### Enterprise program units of measure

The units of measure for Enterprise Programs are often different than seen in our other programs such as the Microsoft Online Services Agreement program (MOSA). This means that, for a number of services, the unit of measure is aggregated to provide the normalized pricing. The unit of measure shown within the Usage Summary view of the Enterprise Portal is always the Enterprise measure. A full list of current units of measure and conversions for each service is provided within [Friendly Service Names](https://azurepricing.blob.core.windows.net/supplemental/Friendly_Service_Names.xlsx).

### Rounding rules

Rounding done within the Enterprise Portal uses the IEEE standard Banker Rounding or Gaussian Rounding logic. This rounds to the nearest even digit for half digit values where the more typical Half Round Up rounding functions always round half digits up to the next highest digit. This method actually provides a more accurate total sum over the group when compared to the standard Excel logic.

When the first digit dropped is 5 and there are no digits following or the digits following are zeros, make the preceding digit even (i.e. round off to the nearest even digit). E.g., 2.315 and 2.325 are both 2.32 when rounded off to the nearest 100th.

For reference, when using Excel to model the rounding and conversion rules used within the Enterprise Portal, the MROUND formulas should be used as shown below.

| Scenario | Banker Logic Formula |
| --- | --- |
| Rounding Usage | =MROUND({_source_}, 0.0002) |
| Rounding Pricing (2 decimals) | =MROUND({_source_}, 0.02) |
| Rounding Pricing (0 decimals) | =MROUND({_source_}, 2) |

**Table**  **2**  **– Cloud Service and Virtual Machine Hours Conversion**

### Conversion between Download Usage File and Usage Summary Portal View

Raw resource utilization data is reported up to a maximum of six decimal places as can be seen in the download usage data report. However, the Azure Enterprise Portal rounds usage to four decimal places for commitment units and truncates to zero decimals for overage units. The Raw Usage is first rounded to four digits prior to conversion to Enterprise unit of measure, and the resulting Enterprise Units is rounded again to four digits. The actual consumed hours before conversion are shown only in the download usage report and not within the UI itself.

As an example, assume 694.533404 actual SQL Server hours are reported in the Download Usage Report. These units are then converted to 6.94533404 units of 100 Compute Hours that is then rounded to 6.9453 to be displayed in the Enterprise portal.

These units are then simply multiplied by the Commitment Unit Price, and the result is truncated to two decimals to determine the extended billing amount. For Japanese Yen (JPY) and Korean Won (KRW), the extended amount is rounded to zero decimals.

For this same example in overage, the billable units would be truncated to six and then multiplied by the Overage Unit Price to determine the extended billing amount. For Managed Service Provider (MSP) billing, all usage associated to a Department marked as MSP is truncated to zero decimals after conversion to the EA unit of measure as is done for overage reporting. As a result, the sum of this usage could be lower than the sum total of all usage reported in the UI depending on if the MSP is still within their monetary commitment balance or is already in overage.

### Graduated pricing

Enterprise Program pricing does not currently include graduated pricing (where pricing per unit decreases as utilization increases). When moving from a MOSA program with graduated pricing to an Enterprise Program, the pricing is set commensurate with the base tier for that service, after adjusting for Enterprise Program discounts, if applicable.

### Partial hour billing

All usage is billed based on minutes converted to partial hours in lieu of whole hour increments.  Enterprise rates listed as hourly are simply applied to the total hours including any partial hours.

### Average daily consumption

When a service is priced on a monthly basis but usage is reported on daily basis, this usage is evaluated once per day, divided by 31 and summed across the number of days in that billing month. This results in rates that are never higher than expected for any month and are slightly lower for those months with less than 31 days.

### Compute hours conversion

Previously, all usage for A0, A2, A3, and A4 Standard and Basic Virtual Machines and Cloud Services was emitted as fractions (for A0) or multiples (for A2, A3, and A4) of A1 Virtual Machines meter minutes. This caused some confusion for our customers, so a change is being implemented to assign per-minute usage to dedicated A0, A2, A3, and A4 meters.

The new metering will take effect between January 27 and January 28, 2016. In the .csv download for your deployment during this transition period, you'll notice two line items: One for usage emitted on the A1 meter, and another for usage emitted on the new dedicated meter corresponding with your deployment's size.

| **Deployment size** | **Usage emitted as multiple of A1 through January 26, 2016** | **Usage emitted on dedicated meter starting January 27, 2016** |
| --- | --- | --- |
| A0 | 0.25 of A1 hour | 1 of A0 hour |
| A2 | 2 of A1 hour | 1 of A2 hour |
| A3 | 4 of A1 hour | 1 of A3 hour |
| A4 | 8 of A1 hour | 1 of A4 hour |

### Regions

For those services where zone and region affect pricing, the following table shows the mapping for geographies and regions:

| Geo | Data Transfer Regions | CDN Regions |
| --- | --- | --- |
| Zone 1 | Europe North <br> Europe West <br> US West <br> US East <br> US North Central <br> US South Central <br> US East 2 <br> US Central | North America <br> Europe |
| Zone 2 | Asia Pacific East <br> Asia Pacific Southeast <br> Japan East <br> Japan West <br> Australia East <br> Australia Southeast | Asia Pacific <br> Japan <br> Latin America <br> Middle East / Africa <br> Australia East <br> Australia Southeast |
| Zone 3 | Brazil South |   |

**Table**  **4**  **– Data Transfer Regions**

There are no charges for data egress between services (e.g. O365 and Azure) housed within the same data center.

### Monetary commitment and unbilled usage

Azure monetary commitment is an amount paid up front for Azure services. The monetary commitment is consumed as services are used. First-party Azure services use the monetary commitment. However, there are exceptions for charges billed separately and marketplace services.

### Charges billed separately

Some products and services provided from third-party sources don't consume Azure monetary commitment. Instead, these items will be billed separately as part of the standard billing cycle's overage invoice.

We've combined all Azure and Marketplace charges into a single invoice that aligns with the enrollment's billing cycle. (This does not apply to customers in Australia, Japan, or Singapore.)

The consolidated invoice will first show Azure usage, followed by any Marketplace charges. Customers in Australia, Japan, or Singapore will continue to see Marketplace charges on a separate invoice.

If there's no overage usage at the end of the standard billing cycle, charges billed separately will be invoiced separately. (Applicable to customers in Australia, Japan, and Singapore)

**Services billed separately include:**

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

## Azure marketplace for EA customers

For direct customers, marketplace charges are visible on the Azure EA Portal. Marketplace purchases and consumption will be billed outside of monetary commitment and is billed quarterly/monthly and in arrears.

Indirect customers can find their Azure marketplace subscriptions on the 'Manage Subscriptions' page of the Azure EA Portal, but pricing will be hidden. Customers should contact their LSP for information on marketplace charges.

New monthly or annually recurring marketplace purchases will be billed the full amount in the period in which the marketplace items were purchased. These items will autorenew in the following period on the same day of the original purchase.

This won't affect any existing recurring marketplace charges. Monthly recurring charges will continue to renew on the first of each calendar month, and annual charges will renew on the anniversary of the purchase date.

Some third-party reseller services available on the Azure marketplace now consume your Enterprise Agreement (EA) monetary commitment balance. Previously these services were billed outside of EA monetary commitment and were invoiced separately. EA monetary commitment for these services in the Marketplace helps simplify customer purchase and payment management. For a complete list of services that now consume monetary commitment, please see the [Azure website](https://azure.microsoft.com/updates/azure-marketplace-third-party-reseller-services-now-use-azure-monetary-commitment/?WT.mc_id=azurebg_email_Trans_33771_1695_Release_Direct_Tier2_March14).

### Partners

LSPs can download a marketplace-specific price list by navigating to the price sheet in the Azure EA Portal and clicking on the **Marketplace Price list** link in the upper right-hand corner. The marketplace price list will be a reflection of all available services and their prices.

**To download the price list, please follow the following steps:**

1. Navigate to Reports > Price Sheet.
1. In the top-right corner, find the link to the Azure marketplace price list under your username.
1. Right click the link and select **Save Target As**.
1. On the Save window, change the title of the document to _AzureMarketplacePricelist.zip_, which will change the file from an xlsx to a zip file.
1. Once the download is complete, you'll have a zip file with country-specific price lists.
1. LSPs should reference the individual country file for country-specific pricing. LSPs should use the 'Notifications' tab to see SKUs that are net new to the marketplace as well as SKUs that have been removed.
1. Price changes will be infrequent but when they occur, LSPs will be notified of price increases and FX changes 30 days in advance via email.
1. LSPs will receive one invoice per enrollment, per ISV, per quarter.

### Enabling marketplace purchases

Enterprise administrators have the ability to 'disable' or 'enable' marketplace purchases for all Azure subscriptions under that enrollment. If the enterprise administrator disables purchases and there are Azure subscriptions that already have marketplace subscriptions, those marketplace subscriptions won't be canceled or impacted.

Although customers can convert their direct Azure subscriptions to EA by associating them to their enrollment in the Azure EA Portal, this action does not automatically convert the child marketplace subscriptions.

**To enable marketplace purchases:**

1. Sign in to the Azure EA portal as an enterprise administrator.
1. Navigate to _Manage_.
1. Under _Enrollment Detail,_ click the pencil icon next to the _Azure Marketplace_ line item.
1. Toggle _Enabled/Disabled_ or Free _BYOL SKU`s Only\*_ as appropriate.
1. Click **Save**.

### Marketplace charges in Azure EA Portal reports

Additional information on marketplace charges can be found [here.](https://azure.microsoft.com/marketplace/faq/)

There are two types of marketplace charges:

- **Usage based:** Products are measured in transactional units.  For example, virtual machines are charged hourly and Bing API searches are charged by the number of searches.
- **Non-Usage based:** One-time charge or recurring monthly fee that is independent of usage.

Both usage-based and non-usage-based charges will be captured in the marketplace charge report.

Please note that Azure marketplace is not available for MPSA enrollments.

\*BYOL (bring your own license) and the Free Only option would limit the purchase and acquisition of Azure Marketplace SKUs to BYOL and Free SKUs only.

### Services billed hourly for EA

Application Delivery Network and Web Application Firewall are billed hourly for EA vs. the monthly rate in MOSP.

### Remote app

EA customers pay for remote app based on their EA price level and aren't charged additionally. The standard price point includes an initial 40 hours, while the unlimited price point covers an initial 80 hours. Remote App stops emitting usage over 80 hours.

## Azure marketplace FAQ

This FAQ document reviews updates to Azure monetary commitment's applicability to some third party published services in the Azure marketplace.

### What are we changing with respect to marketplace services and Azure monetary commitment?

Apart from Azure reserved VM instances (RIs), customers receive a separate invoice for all services they purchase from the Azure marketplace. We're expanding the use of Azure monetary commitment to now include some of the third party published Azure marketplace services that are purchased most frequently by our customers.

### Why are we making this change?

Customers are continually looking for additional ways to leverage the upfront payment they've made in the form of Azure monetary commitment.  We address a frequent customer request and impact a large portion of our Azure marketplace customers by expanding MC to these services.

### What is the customer benefit?

Customers get a simpler billing experience and the ability to ensure they spend their Azure monetary commitment.  Adding this benefit to pre-paid monetary commitment and RIs using MC brings even more value to Azure monetary commitment.

### What services will deduct from Azure monetary commitment and how will my customer know?

During the Azure marketplace purchase experience, we'll distinguish each service that will use monetary commitment with a disclaimer. The currently supported publishers include certain services published by Red Hat, SUSE, Autodesk, and Oracle. Services that have similar naming conventions but are published by other parties not identified above won't deduct from monetary commitment. A full list is available at the end of this FAQ.

### What if my customer runs out of monetary commitment?

For customers who have consumed all their MC and are now in overage, charges related to these services will appear on their next overage invoice along with any other consumption services.  This is a change as previously these charges would have been invoiced on their own invoice with other Azure marketplace offers.

### Why are we not enabling Azure monetary commitment for all marketplace purchases?

We're frequently working to deliver the best customer experience related to Azure monetary commitment. This change will address a large number of customers and a significant portion of the total spend in the Azure marketplace. Other services may be added in the future.

### How does this impact indirect enrollment and partners?

There's no impact to our indirect enrollment customers or partners. These services are subject to the same partner markup capabilities as other consumption services. The only change will be the invoice they appear on and the payment of charges from Monetary Commitment.

### List of Services that will deduct from Azure monetary commitment

Specific Azure marketplace offers can use monetary commitment funds. See [Azure monetary commitment](https://azure.microsoft.com/updates/azure-marketplace-third-party-reseller-services-now-use-azure-monetary-commitment) for a complete list of products participating in this program.

## Additional information

Please see these additional sources of information for more details. These files are updated twice monthly, on the 6th and 20th of every month. Details for each file are as follows:

| Appendix Title | Description | URL Naming Convention |
| --- | --- | --- |
| [**Friendly Service Names**](https://azurepricing.blob.core.windows.net/supplemental/Friendly_Service_Names.xlsx) | Provides a listing of all active services with the service category, friendly service name, commitment name and part number, consumption name and part number, units of measure, and conversion factors between reported usage and displayed Enterprise Portal usage. | Friendly\_Service\_Names.xlsx |
| [**Service Download Fields**](https://azurepricing.blob.core.windows.net/supplemental/Service_Download_Fields.xlsx) | This spreadsheet provides a listing of all possible combinations of the service-related fields in the Usage Download Report. | Service\_Download\_Fields.xlsx |

**Table**  **5**  **– Additional Information Sources**

## Power BI reporting

### Power BI Pro

Power BI Pro is now available for EA customers. With Power BI Pro, you can generate and share reports to effectively manage your cost data, with additional collaboration and data refresh features. Power BI Pro offers higher data capacity and data streaming limits. Exciting new cost management features for Azure Enterprise customers are coming soon.

Current Power BI Free users using the Microsoft Azure Consumption Insights content pack are eligible for a 60-day free trial of Power BI Pro. If you want to continue using Power BI Pro after the free trial, you can do so with the addition of a license.

To sign up for the free trial, go to the gear icon and selecting **Manage personal storage**. Then select **Try Pro for free** on the right. See [Power BI self-service sign up](https://powerbi.microsoft.com/documentation/powerbi-service-self-service-signup-for-power-bi/#power-bi-pro-60-day-trial) for more information on the Power BI Pro free trial.

### Microsoft Azure EA Power BI Pro trial terms

- **General purpose**: The extended Power BI Pro for the "Microsoft Azure Enterprise" content pack trial offer (the "Offer") is available to existing qualified users during the term of the Offer, to allow them to access certain insights related to their Microsoft Azure consumption through the use of a specific Power BI content pack.
- **Eligibility**: Users under an Enterprise Agreement (EA) may participate in the Offer if they've a function related to their organization's Microsoft Azure billing, service, service and/or cost management.
- **Exclusions**:
  - Users already participating in the Extended Power BI Pro trial will continue to qualify under the pre-existing offer and may not enter into the Azure EA Power BI Pro trial offer.
  - Users participating in the offer may only use Power BI Pro with the Microsoft Azure Enterprise content pack. Any other use of Power BI Pro is prohibited.
  - Term: The Offer will begin on June 1, 2017 and end on May 31, 2018.  Acceptance can occur at any time during the 12-month period, though the offer will terminate on May 31, 2018 for all users regardless of when they accepted the Offer.

### To access the Microsoft Azure Consumption Insights content pack:

1. Navigate to [Microsoft Azure Consumption Insights](https://app.powerbi.com/getdata/services/azureconsumption?cpcode=MicrosoftAzureConsumptionInsights&amp;getDataForceConnect=true&amp;WT.mc_id=azurebg_email_Trans_33675_1378_Service_Notice_EA_Customer_Power_BI_EA_Content_Pack_Apr26). Click **Get It Now**.
1. Provide Enrollment Number and Number of Months. Click **Next**.
1. Provide your API access key to connect. You can find the key for your enrollment in the [Enterprise Portal](https://ea.azure.com/?WT.mc_id=azurebg_email_Trans_33675_1378_Service_Notice_EA_Customer_Power_BI_EA_Content_Pack_Apr26). Click **Sign In**.
1. The import process will begin automatically. When complete, a new dashboard, report, and model will appear in the navigation pane. Click the dashboard to view your imported data.

For more information on how to generate the API key for your enrollment, please visit the API Reports help file on the [Enterprise Portal](https://ea.azure.com/?WT.mc_id=azurebg_email_Trans_33675_1378_Service_Notice_EA_Customer_Power_BI_EA_Content_Pack_Apr26). For more information on the new content pack, please download the [Microsoft Azure Consumption Insights](https://automaticbillingspec.blob.core.windows.net/spec/Microsoft%20Azure%20Consumption%20Insights.docx?WT.mc_id=azurebg_email_Trans_33675_1378_Service_Notice_EA_Customer_Power_BI_EA_Content_Pack_Apr26) document.

### To access the legacy Power BI EA content pack:

 1. Navigate to the [Power BI Website](https://app.powerbi.com/getdata/services/azure-enterprise).
 1. Sign in with a valid work or school account.
    - The work or school account can be the same or different than what is used to access the enrollment through the Azure EA Portal.
 1. On the dashboard of services, select **Microsoft Azure Enterprise** and click **Connect**.
 1. On the "Connect to Azure Enterprise" screen, choose:
    - Azure Environment URL: [https://ea.azure.com](https://ea.azure.com/).
    - Number of Months: choose between 1 and 36.
    - Enrollment Number: enter the enrollment number.
    - Click **Next**.
 1. On Authentication Key Box, enter the API Key. You can get the API key here in the Azure Enterprise portal, under "Download Usage" tab above, click "API Access Key"
    - Copy and Paste the Key into the box for "Account Key"
 1. Data will take approximately 5 minutes -30 minutes to load in Power BI depending on the size of the datasets.

Power BI reporting is available for EA direct, partner, and indirect customers who have access to view billing information.

## Report FAQ

This section of the article answers common questions relating to interpreting reports.

### Why is my cost showing as $0?

**Direct enrollment**
If you're an account owner or department admin, please contact your EA administrator to enable pricing feature:

1. Click **Manage** on the left navigation.
1. Click the blue pencil next to DA (department administrator) view charges.
1. Select **Enabled** and save.
1. Click the blue pencil next to AO (account owner) view charges.
1. Select **Enabled** and save.

This action will provide account owners and department admins with access to cost/pricing information on the usage reports.

**Indirect enrollment**
Please check with your partner that they've enabled the pricing feature for you. This can only be done by the partner and once they've turned on the feature, you can view the cost and pricing on your enrollment as an EA administrator.

If you wish to enable the view charges feature for your account owners and department admin, please follow the steps above listed under **Direct Enrollment** above.

### There is no SKU information on the usage detail report

The usage detail report does not have SKU information; however, you'll be able to view the service information utilized in the report. You can then download the price sheet report to obtain the SKU information.

### The total amount on Marketplace does not match on usage summary and CSV report

Marketplace Charges Report shows only the usage-based marketplace charges. One time fees aren't shown. You can refer to the usage summary page for the most up-to-date usages on both usage-based charges and one-time fees.

### There is no information on my API report

API keys expire every six months. Please generate a new API key if you're facing an issue. It's also important to request your EA administrator to generate the new API Keys and follow the steps on the API Report FAQ.

### My Power BI report isn't working

For issue with Power BI, please log a technical ticket with Power BI team at [https://support.powerbi.com](https://support.powerbi.com)so that team can assist you.

### My resource tags aren't showing up on my reports

Resource tags are managed on Azure portal. You can contact the Azure Subscription team at [https://portal.azure.com](https://portal.azure.com). Please follow the steps at [this link](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request) on how to raise a support request.

### Why does my resource rate change every day?

Resource Rate in the detailed usage report is a calculated value and represents the average monthly rate charged for a service. This rate is calculated using the average of the monthly commitment and monthly overage charges for a unit of service. The portion of usage charged against commitment and overage rates will change to the day the month closes. Because of this, the resource rate will also change during the month. The resource rate locks on the fifth day following the end of the month.

### Glossary of processes for calculating the resource rate

**Total RAW Units:** Consumed Quantity within the detailed usage report.
**MOCP Resource Per Unit:** Upstream usage system emits the usages for each service in different units. (Preset)
**Consumption Per Unit:** EA Unit of Measure. (Preset)
**Price:** Unit price from the Azure EA Portal.
**Total Cost:** Extended cost from the detailed usage report or commitment usage + overage from the Azure EA Portal.


### Charges calculation

**Converting into MOCP Resource per unit** = ROUND(Total RAW Units * MOCP Resource Per Unit,4)
**Converting to units** = Units after converting into MOCP Resource per Unit / Consumption per Unit
**Total cost** = Units * Price

### Download Usage Calculation Logic

**Resource Rate** = Total Cost /(Total RAW Units / MOCP Resource Per Unit)

The resource rate is derived based on the charges and often doesn't match the actual unit price in the price sheet.

For overage charge calculations, raw resource utilization data is reported up to a maximum of six decimal places as can be seen in the download usage data report. However, the Azure EA Portal rounds usage to four decimal places for commitment units and truncates to zero decimals for overage units. That means that under the Azure EA Portal for all usage charged as an overage we charge only for the full units. There will be an extensive difference seen between the unit price and the resource rate for usage that is charged as an overage or in mixed months.

## Next steps
- For information about understanding your invoice and charges, see [Understand your Azure Enterprise Agreement bill](../understand/review-enterprise-agreement-bill.md).
- To start using the Azure EA portal, see [Get started with the Azure EA portal](ea-portal-get-started.md).
