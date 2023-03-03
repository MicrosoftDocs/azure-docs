---
title: Usage dashboard in commercial marketplace analytics | Azure Marketplace
description: Learn how to access all usage and metered billing metrics for offers published to Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: saurabhsharmaa
ms.author: saurasharma
ms.date: 02/20/2023
---

# Usage dashboard in commercial marketplace analytics

This article provides information on the Usage dashboard in Partner Center.
The [Usage dashboard](https://go.microsoft.com/fwlink/?linkid=2166106) displays the insights for usage of your Virtual machines (VM), Software as a service (SaaS), Azure apps and container offers. You can view graphical representations of the following items:

- Usage trend
- Normalized usage by offers
- Normalized usage by other dimensions: VM Size, Sales Channels, and Offer Types
- Usage by geography
- Detailed usage table
- Orders page filters

> [!NOTE]
> The maximum latency between usage event generation and reporting in Partner Center is 48 hours.

>[!NOTE]
> For detailed definitions of analytics terminology, see [Commercial marketplace analytics terminology and common questions](./analytics-faq.yml).

### Usage page dashboard filters

The Usage page filters are applied at the Usage page level. You can select one or multiple filters to render the chart for the criteria you choose to view, the data you want to see in the Usage orders data grid/export. Filters are applied on the data extracted for the month range that you selected in the upper right corner of the Usage page.

- Sales Channel
- Is Free Trial
- Marketplace License Type
- Marketplace Subscription ID
- Customer ID
- Customer Company Name
- Country
- Offer Name
- VM subscription

Each filter is expandable with multiple options that you can select. Filter options are dynamic and based on the selected range.

### Selector for Usage type

You can choose to analyze usage for different offers from the dropdown picker at the top of the dashboard.

[![Screenshot of the dropdown picker on the Usage dashboard.](./media/usage-dashboard/usage-type-picker.png)](./media/usage-dashboard/usage-type-picker.png#lightbox)

- **Virtual Machine**
    - VM Normalized usage
    - VM Raw usage
- **Custom meters**
    - Metered usage
    - Metered usage anomalies
- **Containers**
    - Raw usage

### Public and private offer

You can choose to view subscription and order details of public offers, private offers, or both by selecting the **Public Offers** subtab, **Private Offers** subtab, and the **All** subtab respectively.

[ ![Screenshot of the three tabs on the Usage dashboard.](./media/usage-dashboard/usage-dashboard-tabs.png) ](./media/usage-dashboard/usage-dashboard-tabs.png#lightbox)

## Virtual Machines (VM)
In this section, you'll find information about the widgets for **VM Normalized usage** and **VM Raw usage**

> [!NOTE]
> These widgets are available in both **VM Normalized Usage** and **VM Raw Usage** dashboard. It will show Normalized usage and raw usage in respective dashboards.

### Usage trend

In this widget, you find total usage hours and trend for your VM offers that are consumed by your customers during the selected computation period. Metrics and growth trends are represented by a line chart. Show the value for each month by hovering over the line on the chart. The percentage value below the usage metrics in the widget represents the amount of growth or decline during the selected computation period.

There are two representations of usage hours: VM normalized usage and VM raw usage.
- Normalized usage hours are defined as the usage hours normalized to account for the number of VM vCPU ([number of VM vCPU] x [hours of raw usage]). VMs designated as "SHAREDCORE" use 1/6 (or 0.1666) as the [number of VM vCPU] multiplier.
- Raw usage hours are defined as the number of time VMs have been running in terms of hours.

[![Illustrates the normalized usage and raw usage data on the Usage dashboard.](./media/usage-dashboard/normalized-usage.png)](./media/usage-dashboard/normalized-usage.png#lightbox)

### Offers

This widget provides the total usage hours and trend for your usage-based offers in commercial Marketplace.

- The **Offers** stacked column chart displays a breakdown of usage hours for the top five offers according to the selected computation period. The top five offers are displayed in a graph, while the rest are grouped in the **Rest All** category.
- The stacked column chart depicts a month-by-month growth trend for the selected date range. The month columns represent usage hours from the offers with the highest usage hours for the respective month. The line chart depicts the growth percentage trend plotted on the secondary Y-axis.
- You can select specific offers in the legend to display only those offers in the graph.

:::image type="content" source="./media/usage-dashboard/normalized-usage-offers.png" alt-text="Illustrates the normalized usage offers data on the Usage dashboard.":::

You can select any offer and a maximum of three plans of that offer to view the month-over-month usage trend for the offer and the selected plans.

:::image type="content" source="./media/usage-dashboard/normalized-usage-offers-sku.png" alt-text="Illustrates the normalized usage offers and plan data on the Usage dashboard.":::

#### Usage: Other dimensions

There are three tabs for the dimensions: 
- VM size
- Sales channels
- Offer type. 

You can see the usage metrics and month-over-month trend against each of these dimensions.

:::image type="content" source="./media/usage-dashboard/normalized-usage-other-dimensions.png" alt-text="Illustrates the Normalized usage other dimensions chart on the Usage dashboard.":::

### Geographical spread

For the selected computation period, the heatmap displays the total usage against geography dimension. The light to dark color on the map represents the low to high value of the customer count. Select a record in the table to zoom in on a country/region.

## Containers
In this section, you'll find the information about widgets available for container raw usage.

### Raw usage
This widget shows usage against all the pricing options you've configured for container offers. Possible pricing options are:
- Per core
- Per every core in cluster
- Per node
- Per every node in cluster
- Per pod
- Per cluster

:::image type="content" source="./media/usage-dashboard/container-raw-usage.png" alt-text="Illustrates the Raw usage chart for containers on the Usage dashboard.":::

Chart provides month over month trend of usage for selected period.

### Offers

This widget provides the total usage hours and trend for container offers based on **Pricing** selection in top of the page

- The **Offers** stacked column chart displays a breakdown of usage hours for the top five offers according to the selected computation period. The top five offers are displayed in a graph, while the rest are grouped in the **Rest All** category.
- The stacked column chart depicts a month-by-month growth trend for the selected date range. The month columns represent usage hours from the offers with the highest usage hours for the respective month. The line chart depicts the growth percentage trend plotted on the secondary Y-axis.
- You can select specific offers in the legend to display only those offers in the graph.

You can select any offer and a maximum of three plans of that offer to view the month-over-month usage trend for the offer and the selected plans.

:::image type="content" source="./media/usage-dashboard/container-usage-offer.png" alt-text="Illustrates the container usage offers data on the Usage dashboard.":::

#### Sales channel

You can see the usage metrics and month-over-month trend for container offers against sales channel. Data in this widget is filtered based on Pricing option selected on top.

:::image type="content" source="./media/usage-dashboard/container-usage-sales-channel.png" alt-text="Illustrates the usage for sales channel chart on the Usage dashboard.":::

### Geographical spread

For the selected computation period, the heatmap displays the total usage against geography dimension. The light to dark color on the map represents the low to high value of the customer count. Select a record in the table to zoom in on a country/region. Data in this widget is filtered based on Pricing option selected on top.

### Customers

This widget shows the usage for customers based on pricing option selected. You also have the flexibility to further filter the data based on *Offers* and *Plans*.

:::image type="content" source="./media/usage-dashboard/container-customer-usage.png" alt-text="Illustrates the usage against customer for containers in usage dashboard.":::

## Usage details table

> [!IMPORTANT]
> To download the data in CSV, please use the Download data option available on top of page.

The **usage details** table displays a numbered list of the top 500 usage records sorted by usage. Note the following:

- Data in this table is displayed based on the page you've selected
- Each column in the grid is sortable.
- Apply filters to **detailed usage data** to display only the data you're interested in. Filter data by country/region, sales channel, Marketplace license type, usage type, offer name, offer type, free trials, Marketplace subscription ID, customer ID, and company name.

Click on the ellipsis (three dots '...') to copy the widget image, or download the image as a pdf for sharing purposes.

[![Illustrates the Usage details page.](./media/usage-dashboard/usage-details.png)](./media/usage-dashboard/usage-details.png#lightbox)

**Table 1: Dictionary of data terms**

| Column name in<br>user interface | Attribute name | Definition | Column name in programmatic<br>access reports |
| ------------ | ------------- | ------------- | ------------- |
| Marketplace Subscription ID | Marketplace Subscription ID | The unique identifier associated with the Azure subscription the customer used to purchase your commercial marketplace offer. ID was formerly the Azure Subscription GUID. | MarketplaceSubscriptionId |
| MonthStartDate | Month Start Date | Month Start Date represents the month of Purchase. | MonthStartDate |
| Offer Type | Offer Type | The type of commercial marketplace offering. | OfferType |
| Sales channel | Azure License Type | The type of licensing agreement used by customers to purchase Azure. Also known as the Channel. The possible values are:<ul><li>Cloud Solution Provider</li><li>Enterprise</li><li>Enterprise through Reseller</li><li>Pay as You Go</li></ul> | AzureLicenseType |
| Marketplace License Type | Marketplace License Type | The billing method of the commercial marketplace offer. The possible values are:<ul><li>Billed Through Azure</li><li>Bring Your Own License</li><li>Free</li><li>Microsoft as Reseller</li></ul> | MarketplaceLicenseType |
| Plan | SKU | The plan associated with the offer. | SKU |
| Customer Country | Customer Country/Region | The country/region name provided by the customer. Country/region could be different than the country/region in a customer's Azure subscription. | CustomerCountry |
| Is Preview SKU | Is Preview SKU | The value shows if you've tagged the plan as "preview". Value is "Yes" if the plan has been tagged accordingly, and only Azure subscriptions authorized by you can deploy and use this image. Value is "No" if the plan hasn't been identified as "preview". | IsPreviewSKU |
| SKU Billing Type | SKU Billing Type | The Billing type associated with each plan in the offer. The possible values are:<ul><li>Free</li><li>Paid</li></ul> | SKUBillingType |
| VM Size | Virtual Machine Size | For VM-based offer types, this entity signifies the size of the VM associated with the plan of the offer. | VMSize |
| Cloud Instance Name | Cloud Instance Name | The Microsoft Cloud in which a VM deployment occurred. | CloudInstanceName |
| Offer Name | Offer Name | The name of the commercial marketplace offering. | OfferName |
| Is Private Offer | Is Private Offer | Indicates whether a marketplace offer is a private or a public offer:<br><ul><li>0 value indicates false</li><li>1 value indicates true</li></ul> | IsPrivateOffer
| Customer name | Customer name | Name of the billed to customer | CustomerName |
| Customer Company Name | Customer Company Name | The company name provided by the customer. The name could be different than the name in a customer's Azure subscription. | CustomerCompanyName |
| Usage Date | Usage Date | The date of usage event generation for usage-based assets. | UsageDate |
| IsMultisolution | Is Multisolution | Signifies whether the offer is a Multisolution offer type. | IsMultisolution |
| Is New Customer | Deprecated | Deprecated | IsNewCustomer |
| Core Size | Core Size | Number of cores associated with the VM-based offer. | CoreSize |
| Usage Type | Usage Type | Signifies whether the usage event associated with the offer is one of the following:<ul><li>Normalized usage</li><li>Raw usage</li><li>Metered usage</li></ul> | UsageType |
| Trial End Date | Trial End Date | The date the trial period for this order will end or has ended. | TrialEndDate |
| Customer Currency (CC) | Customer Currency | The currency used by the customer for the commercial marketplace transaction. | CustomerCurrencyCC |
| Price (CC) | Price | Unit price of the plan shown in customer currency. | PriceCC |
| Payout Currency (PC) | Payout Currency | Publisher is paid for the usage events associated with the asset in the currency configured by the publisher. | PayoutCurrencyPC |
| Estimated Price (PC) | Estimated Price | Unit price of the plan in the currency configured by the publisher. | EstimatedPricePC |
| Usage Reference | Usage Reference | A concatenated GUID that is used to connect the Usage Report (in commercial marketplace analytics) with the Payout transaction report. Usage Reference is connected with OrderId and LineItemId in the Payout transaction report. | UsageReference |
| Usage Unit | Usage Unit | Unit of consumption associated with the plan | UsageUnit |
| Customer ID | Customer ID | The unique identifier assigned to a customer. A customer may have zero or more Azure Marketplace subscriptions. | CustomerId |
| Billing Account ID | Billing Account ID | The identifier of the account on which billing is generated. Map **Billing Account ID** to **customerID** to connect your Payout Transaction Report with the Customer, Order, and Usage Reports. | BillingAccountId |
| Usage Quantity | Usage Quantity | The total usage units consumed by the asset that is deployed by the customer.<br>This is based on Usage type item. For example, if the Usage Type is Normalized usage, then Usage Quantity is for Normalized Usage. | UsageQuantity |
| NormalizedUsage | Normalized Usage | The total normalized usage units consumed by the asset that is deployed by the customer.<br>Normalized usage hours are defined as the usage hours normalized to account for the number of VM cores ([number of VM vCPU] x [hours of raw usage]). VMs designated as "SHAREDCORE" use 1/6 (or 0.1666) as the [number of VM vCPU] multiplier. | NormalizedUsage |
| MeteredUsage | Metered Usage | The total usage units consumed by the meters that are configured with the offer that is deployed by the customer. | MeteredUsage |
| RawUsage | Raw Usage | The total raw usage units consumed by the asset that is deployed by the customer.<br>Raw usage hours are defined as the number of time VMs have been running in terms of usage units. | RawUsage |
| Estimated Extended Charge (CC) | Estimated Extended Charge in Customer Currency | Signifies the charges associated with the usage. The column is the product of Price (CC) and Usage Quantity. | EstimatedExtendedChargeCC |
| Estimated Extended Charge (PC) | Estimated Extended Charge in Payout Currency | Signifies the charges associated with the usage. The column is the product of Estimated Price (PC) and Usage Quantity. | EstimatedExtended ChargePC |
| Meter ID | Meter ID | **Applicable for offers with custom meter dimensions.**<br>Signifies the meter ID for the offer. | MeterId |
| Metered Dimension | Metered Dimension | **Applicable for offers with custom meter dimensions.**<br>Metered dimension of the custom meter. For example, user/device - billing unit | MeterDimension |
| Partner Center Detected Anomaly | Partner Center Detected Anomaly | **Applicable for offers with custom meter dimensions**.<br>Signifies whether the publisher reported overage usage for the offer’s custom meter dimension that was is flagged as an anomaly by Partner Center. The possible values are: <ul><li>0 (Not an anomaly)</li><li>1 (Anomaly)</li></ul>_If the publisher doesn’t have offers with custom meter dimensions, and exports this column through programmatic access, then the value will be null._ | PartnerCenterDetectedAnomaly |
| Publisher Marked Anomaly | Publisher Marked Anomaly | **Applicable for offers with custom meter dimensions**.<br>Signifies whether the publisher acknowledged the overage usage by the customer for the offer’s custom meter dimension as genuine or false. The possible values are:<ul><li>0 (Publisher has marked it as not an anomaly)</li><li>1 (Publisher has marked it as an anomaly)</li></ul>_If the publisher doesn’t have offers with custom meter dimensions, and exports this column through programmatic access, then the value will be null._ | PublisherMarkedAnomaly |
| New Reported Usage | New Reported Usage | **Applicable for offers with custom meter dimensions**.<br>For overage usage by the customer for the offer’s custom meter dimension identified as anomalous by the publisher. This field specifies the new overage usage reported by the publisher.<br>_If the publisher doesn’t have offers with custom meter dimensions, and exports this column through programmatic access, then the value will be null._ | NewReportedUsage |
| Action Taken At | Action Taken At | **Applicable for offers with custom meter dimensions**.<br>Specifies the time when the publisher acknowledged the overage usage by the customer for the offer’s custom meter dimension as genuine or false.<br>_If the publisher doesn’t have offers with custom meter dimensions, and exports this column through programmatic access, then the value will be null._ | ActionTakenAt |
| Action Taken By | Action Taken By | **Applicable for offers with custom meter dimensions**.<br>Specifies the person who acknowledged the overage usage by the customer for the offer’s custom meter dimension as genuine or false.<br>_If the publisher doesn’t have offers with custom meter dimensions, and exports this column through programmatic access, then the value will be null._ | ActionTakenBy |
| Estimated Financial Impact (USD) | Estimated Financial Impact in USD | **Applicable for offers with custom meter dimensions**.<br>When Partner Center flags an overage usage by the customer for the offer’s custom meter dimension as anomalous, the field specifies the estimated financial impact (in USD) of the anomalous overage usage.<br>_If the publisher doesn’t have offers with custom meter dimensions, and exports this column through programmatic means, then the value will be null._ | EstimatedFinancialImpactUSD |
| Asset ID | Asset ID | **Applicable for offers with custom meter dimensions**.<br>The unique identifier of the customer's order subscription for your commercial marketplace service. Virtual machine usage-based offers aren't associated with an order. | Asset ID |
| PlanId | PlanID | The display name of the plan entered when the offer was created in Partner Center. PlanId was originally a number. | PlanID |
| Not available | Reference ID | A key to link transactions of usage-based offers with corresponding transactions in the orders report. For SaaS offers with custom meters, this key represents the AssetId. For VM software reservations, this key can be used for linking orders and usage reports. | ReferenceId |
| Not available |	List Price(USD)	|	The publicly listed price of the offer plan in U.S dollars	|	ListPriceUSD	|
| Not available |	Discount Price(USD)	|	The discounted price of the offer plan in U.S dollars	|	DiscountPriceUSD	|
| Not available |	Is Private Plan 	|	Indicates whether an offer plan is private plan <li> 0 value indicates false </li> <li> 1 value indicates true </li>	|	IsPrivatePlan	|
| Not available |	Offer ID	|	ID to identify a marketplace offer	|	OfferId	|
| Not available |	Private Offer ID	|	ID to identify a private marketplace offer	|	PrivateOfferId	|
| Not available |	Private Offer Name	|	The name provided during private offer creation	|	PrivateOfferName	|
| Not available |	Billing ID	|	The Billing ID of the enterprise customer	|	BillingId	|


## Next steps

- For an overview of analytics reports available in the commercial marketplace, see [Access analytic reports for the commercial marketplace in Partner Center](analytics.md).
- For graphs, trends, and values of aggregate data that summarize marketplace activity for your offer, see [Summary Dashboard in commercial marketplace analytics](./summary-dashboard.md).
- For information about your orders in a graphical and downloadable format, see [Orders Dashboard in commercial marketplace analytics](./orders-dashboard.md)
- For virtual machine (VM) offers usage and metered billing metrics, see [Usage Dashboard in commercial marketplace analytics](usage-dashboard.md).
- For a list of your download requests over the last 30 days, see [Downloads dashboard in commercial marketplace analytics](downloads-dashboard.md).
- To see a consolidated view of customer feedback for offers on Azure Marketplace and the Microsoft commercial marketplace, see [Ratings & Reviews analytics dashboard in Partner Center](ratings-reviews.md).
- For frequently asked questions about commercial marketplace analytics and for a comprehensive dictionary of data terms, see [Commercial marketplace analytics terminology and common questions](./analytics-faq.yml).
