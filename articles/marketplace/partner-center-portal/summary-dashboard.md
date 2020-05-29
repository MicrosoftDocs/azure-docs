---
title: Summary dashboard for Partner Center analytics in Commercial Marketplace
description: Learn how to access graphs, trends, and values of aggregate data that summarize marketplace activity from the Summary dashboard in Partner Center.
author: dsindona
ms.author: dsindona
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 12/11/2019
---

# Summary dashboard in commercial marketplace analytics

This article provides information on the Summary dashboard in Partner Center. This dashboard displays graphs, trends, and values of aggregate data that summarize marketplace activity for your offers.

To access the Summary dashboard, open the **[Analyze dashboard](https://partner.microsoft.com/dashboard/commercial-marketplace/analytics/summary)** under Commercial Marketplace.

>[!NOTE]
> For detailed definitions of analytics terminology, see [Frequently asked questions and terminology for commercial marketplace analytics](./faq-terminology.md).

## Summary dashboard

The **Summary** dashboard presents an overview based on each offer type. **Insights** show critical information at a glance and provide a broad view of the sales activity of your offers. You can visualize these reports using the **Summary** dashboard. This article goes into more details on each of the following elements:

- [Date range](#date-range)
- [Summary section](#summary-section)
- [Customers by geography](#customers-by-geography)
- [Growth trend charts](#growth-trend-charts)
- [Customer leaderboard](#customer-leaderboard)
- [Seat count trend](#seat-count-trend)
- [Free trials SaaS orders trend](#free-trials-saas-orders-trend)

## Elements of the Summary dashboard

The following sections describe how to use the summary dashboard and how to read the data.

### Date range

You can find a date range selection at the top-right corner of each page. Customize the output of the **Summary** page graphs by selecting a date range based on the past 3, 6, or 12 months, or by selecting a custom date range with a maximum duration of 12 months. The default date range is six months.

![Partner Center Analyze dashboard](./media/analyze-dashboard.png)

### Summary section

The Summary section displays a count of all orders created, customers acquired, and usage reported during the selected date range. Partial current month will be excluded from the computation of these metrics. For example: If you have selected the 6M time frame, the usage hours are computed for the six months prior to the current month. If a custom date range is selected, a partial amount from the current month will be excluded from the computation.

![Growth trends in Summary dashboard](./media/summary-summary-section.png)

#### Reading the summary section

- **Orders**: Count of all orders purchased (excludes canceled orders) for offers you've published so far.
- **Customers**: Count of all customers who purchased your offers and have at least one non canceled order.
- **Normalized usage hours**: Defined as the usage hours normalized to account for the number of VM cores ([number of VM cores] x [hours of raw usage]). VMs designated as "SHAREDCORE" use 1/6 (or 0.1666) as the [number of VM cores] multiplier.
- **Raw usage hours**: The amount of time VMs have been running in terms of hours. The percentage value next to **total orders**, **total customers**, **normalized usage hours**, **raw usage hours**, **page visits**, and **call to actions** represent the amount of usage growth for the selected date range ([last month usage – first month usage])/ first month usage). As described above, a partial amount of the current month will be excluded from this metric.
- **Growth trends**: If you hover over the columns of the chart, bar graphs display the value for each month.
- **Green triangle pointing upward**: Indicates a positive growth trend.
- **Red triangle pointing downward**: Indicates a negative growth trend relative to the previous month.

### Customers by geography

The **Customers by geography** heatmap displays a customer count on a world map.

![Customers by geography in Summary dashboard](./media/summary-customers-by-geography.png)

- You can move the map to view the exact location.
- You can zoom into a specific location.
- The heatmap has a supplementary grid to view the details of customer count, order count, normalized usage hours in the specific location.
- You can search and select a country/region in the grid to zoom to the location in the map. Revert to the original view by pressing the **Home** button in the map.
- A **new** customer has purchased one of your offers for the first time during the month within the selected date range.

### Growth trend charts

You can view trends based on the growth of your **orders purchased** (includes canceled orders), **customers acquired** (includes lost customers), and **usage** reported, which are displayed month by month according to the selected date range. You can further analyze these trends by selecting links below the chart, which navigate to the respective **order**, **usage**, **customer**, or **Marketplace Insights** pages.

The Marketplace offer **Page visits and call to action** trend charts are displayed for Azure marketplace and AppSource on two tabs.

![Page visits and call to actions trend charts in Summary dashboard](./media/summary-page-visits-and-cta.png)

The **orders by offers** chart organizes your orders according to the Offer name.

The **orders by sales channel** pie chart organizes your orders (including orders that customers canceled) during the selected date range, by Sales channel. Sales channel is the type of licensing agreement used by customers to purchase Azure, which are Cloud Solution Provider (CSP), Enterprise, Enterprise through Reseller, GTM, and Pay As You Go.

**Usage by offers** and **usage by sales channel** pie charts present the breakdown of the usage by top offers and sales channels, respectively. The inner pie chart represents raw usage and outer pie chart represents normalized usage.

The **orders by marketplace license type** and **usage by marketplace license type** pie charts display a breakdown of orders and usage by their respective license type. License types include:

- **Billed through Azure**: Microsoft bills customers on your behalf when you choose to sell your offer through Microsoft with this license type. Payment types include pay-as-you-go via credit card or Enterprise invoicing.
- **Bring your own license**: Microsoft does not bill customers for their usage with this type of marketplace offer. This usage is listed as **Get it now (Free)** in the marketplace.
- **Free**: Microsoft does not bill customers for their usage with this type of marketplace offer. This usage is listed as **Free trial** in the marketplace.
- **Microsoft as reseller**: Represents offers sold by Microsoft resellers as a part of the **Cloud Solution Provider (CSP) program**.

### Customer leaderboard

The top 50 customers with the highest number of orders are displayed on a *leader board*, sorted by highest order count and order percentage.

- Select a customer to view their profile details, orders organized by offer, or orders organized by Azure license type and pricing channel.
- The **Offers by orders** donut chart presents the top four offers (by order count) and the remaining offers grouped in as 'Rest All'.
- The **normalized usage by offer** donut chart presents the top five offers by usage.

> [!NOTE]
> Customer personal information will be presented only if the customer has provided consent. You can view this information if you have logged in with an **Owner** role permissions-level. Users with the **Contributor** role will not be able to view this information. [Learn more about user roles and permissions](./manage-account.md#define-user-roles-and-permissions).

### Seat Count Trend

The **orders by per seat/ per site** chart presents the breakdown of all orders purchased according to pricing model. The **seat count trend** chart presents seats versus orders purchased for all your per seat Software as a Service (SaaS) offers.

### Free trials SaaS orders trend

The **Free trial SaaS orders trend** chart presents the trend of orders for free trials SaaS offers with a 30-day trial period.

## Next steps

- For an overview of analytics reports available in the Partner Center commercial marketplace, see [Analytics for the commercial marketplace in Partner Center](./analytics.md).
- For information about your orders in a graphical and downloadable format, see [Orders Dashboard in commercial marketplace analytics](./orders-dashboard.md).
- For Virtual Machine (VM) offers usage and metered billing metrics, see [Usage Dashboard in commercial marketplace analytics](./usage-dashboard.md).
- For detailed information about your customers, including growth trends, see [Customer Dashboard in commercial marketplace analytics](./customer-dashboard.md).
- For a list of your download requests over the last 30 days, see [Downloads Dashboard in commercial marketplace analytics](./downloads-dashboard.md).
- To see a consolidated view of customer feedback for offers on Azure Marketplace and AppSource, see [Ratings and reviews dashboard in commercial marketplace analytics](./ratings-reviews.md).
- For frequently asked questions about commercial marketplace analytics and for a comprehensive dictionary of data terms, see [Frequently asked questions and terminology for commercial marketplace analytics](./faq-terminology.md).
