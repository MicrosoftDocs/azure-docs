---
title: Usage dashboard in Microsoft commercial marketplace analytics
description: Learn how to access all VM offers usage and metered billing metrics. Go to the Usage dashboard in Partner Center under Commercial Marketplace.
author: dsindona
ms.author: dsindona
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 12/11/2019
---

# Usage dashboard in Microsoft commercial marketplace analytics

This article provides information on the usage dashboard in Partner Center. This dashboard displays all VM offers usage and metered billing metrics in two separate tabs: VM usage and metered billing usage.

To access the usage dashboard, open the **[Analyze](https://partner.microsoft.com/dashboard/commercial-marketplace/analytics/summary)** dashboard under **Commercial Marketplace**.

>[!NOTE]
> For detailed definitions of analytics terminology, see [Frequently asked questions and terminology for commercial marketplace analytics](./faq-terminology.md).

## Usage dashboard

The usage dashboard represents the metrics for all Virtual Machine (VM) offers usage and metered billing usage. These metrics are found in two separate tabs: VM usage and metered billing usage.

In the VM usage tab, there are graphical representations of the following items:

- [Usage summary](#usage-summary)
- [Usage by geography](#usage-by-geography)
- [Usage by offers](#usage-by-offers)
- [Usage trend by offers and SKUs](#usage-trend-by-offers-and-skus)
- [Usage by offer type](#usage-by-offer-type)
- [Usage by VM size](#usage-by-vm-size)
- [Usage by sales channel](#usage-by-sales-channel)
- [Detailed usage data](#detailed-usage-data)

> [!NOTE]
> Analytics reports display differently in Cloud Partner Portal (CPP) and Partner Center. **Seller insights** in CPP has an orders and usage tab, which displays data for both usage-based offers and non-usage-based offers. In Partner Center, the usage metrics are displayed on a separate page.

### Usage summary

The usage summary table displays the customer usage hours for all offers they have purchased.

- Normalized usage hours are defined as the usage hours normalized to account for the number of VM cores ([number of VM cores] x [hours of raw usage]). VMs designated as "SHAREDCORE" use 1/6 (or 0.1666) as the [number of VM cores] multiplier.
- Raw usage hours are defined as the number of time VMs have been running in terms of hours.
- The percentage value represents usage growth change for the selected date range ([last month usage – first month usage])/ first month usage).
- Green triangles pointing upward indicate a growth change.
- Red triangle pointing downward indicates a negative growth change relative to the previous month.
- Micro bar graphs represent monthly values. You can display the value for each month by hovering over the columns within the chart.

### Usage by geography

The **normalized usage by geography** heatmap displays usage hours mapped according to the customer country/region. Country/region color variation represents normalized usage concentration. Revert to the original view by pressing the **home** button on the map.

### Usage by offers

- The **normalized usage by offers** pie chart displays a breakdown of normalized usage hours by offers according to the selected date range. The top five offers are displayed in graph, while the rest are grouped in the **rest all** category.
- The bar chart depicts a month-by-month growth trend for the selected date range. The month columns represent usage hours from the offers with the highest usage hours for the respective month. The line chart depicts the growth percentage trend plotted on the secondary Y-axis.
- Use the slider at the top of the chart to scroll right to left along the x-axis and/or focus on specific data points.

### Usage trend by offers and SKUs

This chart displays the trend of normalized usage for the selected SKUs of an offer. The offer leaderboard displays the top 50 offers with the highest usage, sorted by usage hours. The SKU leaderboard displays the top 50 SKUs with the highest usage for the selected offer.

### Usage by offer type

- The **usage by offer type** pie chart organizes usage according to the offer type.
- The top offers are displayed in the chart and the rest of the offers are grouped as 'Rest All.'
- The **trend** chart displays month-by-month growth trends. The month column represents the usage by top offer types in that month.

### Usage by VM size

This chart represents the usage trend for selected VM Sizes (max 5) of all your offers/SKUs. The column chart is stacked with the usage hours of the selected VM Sizes.

The leaderboard displays the top 50 VM sizes with highest usage and sorted by usage hours.

### Usage by sales channel

- The usage by sales channel pie chart organizes usage according to the sales channel
- The top sales channel with highest usage are displayed in the chart and the rest of the sales channel are grouped as 'Rest All'.
- The month column represents the usage by top sales channel in that month.
- Features of this chart are the same as the 'Usage by Offers' chart

### Detailed usage data

The **usage details table** displays a numbered list of the top 1000 usage records sorted by usage.

- Each column in the grid is sortable.
- The data can be extracted to a CSV file if the count of the records is less than 1000.
- If records count is over 1000, export data will be asynchronously placed in a downloads page that will be available for the next 30 days.
- Filters can be applied to the **detailed usage data** to display only the data that you are interested in. Data can be filtered by country/region, sales channel, Marketplace license type, usage type, offer name, offer type, free trials, Marketplace subscription ID, customer ID, and company name.

> [!NOTE]
> Select the **Usage type** in the page filter to view charts on the page in either "Normalized view" or "Raw view." The default view for these charts is "Normalized view."

The **Usage page filters** are applied at the page level. You can select multiple filters to render the chart for the criteria you choose to view, and the data you want displayed in the "detailed usage data" grid/export. Filters are applied on the data extracted for the data range you have selected on the top-right corner of the orders page.

- **Offer types** and **Offer names** are listed only for the offers you have acquired during the selected date range. Offer names in the list are displayed for offer types that are selected from the list.
- The default selection is "All" for each of the filter options, except for **Usage type**. The default selection for **Usage type** is normalized usage. To display raw usage in the charts, select "raw usage."
- Applied filters show the count selection for the filter selections that were made. Applied filters are not displayed for the default selections.

> [!NOTE]
> A detailed definition of each of the fields in "detailed order data" grid, page filters, and all possible selections are defined in the data dictionary section of the [FAQs and terminology](link needed) article.

The **Metered billing usage** tab presents usage info for offer types where usage is measured by per meter dimension. SaaS offer type overage is presented currently. The tab presents graphical representations of overage trends for SaaS metered billing usage:

- **Overage trend by meter dimension**: Displays the monthly overage trend for the selected meter dimension of an offer. The X-Axis represents the month and the Y-Axis represents the usage quantity. The unit of measurement of the custom meter is also displayed on the Y-Axis.
- **Overage trend by SKU**: Represents the trend of usage quantity of the selected meter dimension by SKUs. The SKUs displayed will represent the top 5 SKUs with the highest amount of usage for the offer selected.
- **Overage trend by Top 50 Customers**: The top 50 offers with the highest usage hours are displayed on a ***leader board*** and are ranked by the highest usage of the custom meter. Select a customer in the leaderboard to view the usage trend of a selected meter dimension.
- **Overage trend by top customers**: Presents top customer percentile(s) that contribute to the % of overall usage. The top customer percentile is displayed along the X-axis and is determined by the customer's usage quantity. The Y-axis displays the usage quantity. You can display details by hovering over points along the line chart.

> [!NOTE]
> The usage details and all charts on this page are displayed for whichever meter dimension is selected for the page filter.

## Next Steps

- For an overview of analytics reports available in the Partner Center commercial marketplace, see [Analytics for the commercial marketplace in Partner Center](./analytics.md).
- For graphs, trends, and values of aggregate data that summarize marketplace activity for your offer, see [Summary Dashboard in commercial marketplace analytics](./summary-dashboard.md).
- For information about your orders in a graphical and downloadable format, see [Orders Dashboard in commercial marketplace analytics](./orders-dashboard.md).
- For detailed information about your customers, including growth trends, see [Customer Dashboard in commercial marketplace analytics](./customer-dashboard.md).
- For a list of your download requests over the last 30 days, see [Downloads Dashboard in commercial marketplace analytics](./downloads-dashboard.md).
- To see a consolidated view of customer feedback for offers on Microsoft AppSource and Azure Marketplace, see [Ratings and reviews dashboard in commercial marketplace analytics](./ratings-reviews.md).
- For frequently asked questions about commercial marketplace analytics and for a comprehensive dictionary of data terms, see [Frequently asked questions and terminology for commercial marketplace analytics](./faq-terminology.md).
