---
title: Analytics for the Commercial Marketplace in Partner Center
description: Learn how to access analytic reports to monitor sales, evaluate performance, and optimize your marketplace offers.
author: mattwojo 
manager: evansma
ms.author: shthota
ms.service: marketplace 
ms.topic: conceptual
ms.date: 05/31/2019
---

# Analytics for the Commercial Marketplace in Partner Center

Learn how to access analytic reports in Microsoft Partner Center to monitor sales, evaluate performance, and optimize your marketplace offers. As a partner, you can monitor your offer listings using the data visualization and insight graphs supported by Partner Center and find ways to maximize your sales. The improved analytics tools enable you to act on performance results and maintain better relationships with your customers and resellers. 

To access the Partner Center analytics tools, open the **[Analyze](https://partner.microsoft.com/dashboard/commercial-marketplace/analytics/summary)** dashboard under Commercial Marketplace.

|**Dashboard**|**Displayed content**|
|:---|:---|
|[Summary](#summary-dashboard)|Graphs, trends, and values of aggregate data that summarize marketplace activity for your offers|
|[Orders](#orders-dashboard)|Information about your orders in a graphical and downloadable format|
|[Customers](#customers-dashboard)|Information about your customers, including growth trends, presented in a  graphical and downloadable format|
|[Downloads](#downloads-dashboard)|A list of your download requests over the last 30 days|
|[Analytics](#analytics-dashboard)|A summary of your marketplace web analytics and analysis of campaign performance|

## Summary dashboard

The **Summary** dashboard presents an overview based on each offer type. **Insights** show critical information at a glance and provides a broad view of the sales activity of your offers. You can view graphical representations of the following in this dashboard: 

 - [Total orders](#totals)
 - [Total customers](#totals)
 - [Geographic location of your customers](#customers-by-geography)
 - [Trends emerging based on your customer and order information](#growth-trend-chart)
 - [Customer leaderboard with highest orders](#customer-leaderboard)
 - [Number of orders organized by offer name](#offers-by-orders)

### Date range
 
You can find a date range selection at the top right corner of each page. The output of the **Summary** page graphs can be customized by selecting a date range based on the past 3, 6, or 12 months, or by selecting a custom date range with a maximum duration of 12 months. The default date range is 6 months. 

![Partner Center Analyze dashboard](./media/analyze-dashboard.png)

### Totals

The **Totals** section displays a count of all orders created, or customers acquired, during the selected date range. 

- The percentage value next to **Total Orders** and **Total Customers** represents the amount of growth compared to the previous month. 
- A green triangle pointing upward indicates a positive growth trend. A red triangle pointing downward indicates a negative growth trend relative to the previous month. 
- Order and Customer growth trends are represented by bar graphs and will display the value for each month by hovering over the columns of the chart.

![Partner Center Analyze totals](./media/analyze-totals.png)

### Customers by geography

The **Customers by geography** heatmap displays a customer count on a world map. You can move the map to view the exact location. You can also zoom into a specific location. The heatmap has a supplementary grid to view the details of customer count and order count in the specific location. You can search and select a country in the grid to zoom to the location in the map. Revert to the original view by pressing the **Home** button in the map.

![Partner Center Analyze customer geography](./media/analyze-customer-geography.png)

### Growth trend chart

You can view trends based on the growth of your **Orders created** or **Customers acquired**, displayed month by month according to the selected date range. You can further analyze these trends by selecting links below the chart which navigate to the respective **Order** or **Customer** pages. 

![Partner Center Analyze growth trends](./media/analyze-growth-trends.png)

### Customer leaderboard

The top 50 customers with the highest number of orders are displayed on a *leader board*, sorted by highest order count and order percentage. 

- Select a customer to view their profile details, orders organized by offer, or orders organized by Azure license type and pricing channel. 
- The **Offers by orders** donut chart presents the top 4 offers (by order count) and the remaining offers grouped in as ‘Rest All’.
 
> [!NOTE]
> Customer personal information will be presented only if the customer has provided consent. You can view this information if you have logged in with the **Owner** role. Users with the **Contributor** role will not be able to view this information. [Learn more about user roles and permissions](./manage-account.md#define-user-roles-and-permissions).

![Partner Center Analyze growth trends](./media/analyze-growth-trends.png)

### Offers by orders

The **Offers by orders** chart organizes your active orders according to the Offer name. 

- You can drag over slices from the left donut chart to the right donut chart in order to display more details for the offer that you have dragged. These two charts enable you to compare a specific offer with the performance of all of your other offers ('Rest All'). 

![Partner Center Analyze offers by orders](./media/analyze-offer-by-order.png)

## Orders dashboard

The **Orders** dashboard of the **Analyze** menu displays the current orders for all of your SaaS offers. The metrics and insights in this page are displayed and pivoted according to the offer name. You can view graphical representations of:

- [Order Totals](#order-totals)
- [Orders by geography](#orders-by-geography)
- [Active orders organized by offer name](#active-orders-by-offers)
- [Trends for active and cancelled orders](#trends-for-active-and-cancelled-orders)
- [Orders organized by marketplace license type](#orders-by-marketplace-license-type)
- [Orders organized by new and existing customers](#orders-by-customer-type)
- [Order details table](#order-details-table)

> [!NOTE]
> There are differences between how analytics reports display in the Cloud Partner Portal (CPP) and the new Commercial Marketplace program in Partner Center. One specific way is that the **Seller Insights** in CPP has a **Orders & Usage** tab, which displays data for usage-based offers and non-usage-based offers. In Partner Center, the **Orders** page has a separate tab for SaaS Offers.

### Order totals

The **Totals** section of the **Orders** page displays a count of all orders created, including both **Active** and **Cancelled** orders, during the selected [date range](#date-range). 

- The percentage value next to **Total Orders** represents the amount of growth compared to the previous month. 
- A green triangle pointing upward indicates a positive growth trend. A red triangle pointing downward indicates a negative growth trend relative to the previous month. 
- Growth trends are represented by bar graphs and will display the value for each month by hovering over the columns of the chart.

### Orders by geography

The **Orders by geography** heatmap displays a count of your orders on a world map and functions the same as the **[Customers by geography heatmap](#customers-by-geography)**.

### Trends for active and cancelled orders

The **Active orders by offers** donut graph organizes all of your active orders according to their offer names. 

- The top 4 offers are displayed in the graph and the rest of the offers are grouped as ‘Rest All’.
- You can select specific offers in the legend to display only those offers in the graph. 
- Hovering over a slice in the graph will display the number of orders and percentage of that offer compared to your total number of orders across all offers.
- **Orders by offers trend** displays month-by-month growth trends.The month column represents the number of orders by offer name. The line chart displays the growth percentage trend plotted on a z-axis.
- You can use the slider on the top of the chart to scroll right and left along the x-axis and focus on specific data points.
- You can display the trend chart by selecting a specific item on the legend.
- You can also choose to display trends and data for **Cancelled orders**. The graph will function in the same way as active orders.

![Partner Center Analyze active orders](./media/analyze-active-orders.png)

### Orders by marketplace license type
<!-- This section needs review and clarification!  -->
The **Orders by marketplace license type** chart displays a month-by-month order count based on the license type and billing method of the marketplace offer. License types include:

- **Billed through Azure**: Microsoft bills customers on your behalf when you choose to [sell your offer through Microsoft](./create-new-saas-offer.md#sell-through-microsoft) with this license type. Payment types include pay-as-you-go via credit card or Enterprise invoicing.
- **Bring your own license**: Microsoft does not bill customers for their usage of this type of marketplace offer. Listed as **[Get it now (Free)](./create-new-saas-offer.md#get-it-now-free)** in the marketplace.
- **Free**: Microsoft does not bill customers for their usage of this type of marketplace offer. Listed as **[Free trial](./create-new-saas-offer.md#free-trial)** in the marketplace.
- **Microsoft as reseller**: Represents offers sold by Microsoft resellers as a part of the **[Cloud Solution Provider (CSP) program](./create-new-saas-offer.md#csp-program-opt-in)**.

![Partner Center Analyze orders by license type](./media/analyze-license-type.png)

### Orders by customer type

The **Orders by customer type** bar chart displays the number of orders divided between **New Customers** and **Existing Customers**. 

- A **New customer** has acquired one or more of your marketplace offers for the first time within the same calendar month (y-axis). An **Existing customer** has previously acquired an offer from you prior to the calendar month reported (on the y-axis). 
- An additional pie chart represents all orders created by the new or existing customer for the date range selected.
- In both charts, you can choose to view only new or only existing customers by selecting the respective legend.

![Partner Center Analyze orders by customer type](./media/analyze-order-by-customer.png)

### Order details table

The **Order details table** displays a numbered list of the 1000 top orders sorted by date of acquisition.

- Each column in the grid is sortable.
- The data can be extracted to a TSV file if the count of the records is less than 1000.
- If records number over 1000, exported data will be asynchronously placed in a downloads page for the next 30 days.
- Filters can be applied to the **Order details table** to display only the data that you are interested in. Data can be filtered by Country, Azure license type, Marketplace license type, Offer type, Order status, Free trails, Marketplace subscription ID, Customer ID, and Company name. 

![Partner Center Analyze order details](./media/analyze-order-details.png)

## Customer dashboard

The **Customer** dashboard of the **Analyze** menu displays the customers who have aquired your offers. The metrics and insights in this page are displayed and pivoted according to the offer name. You can view graphical representations of:

- [Order Totals](#order-totals)
This page presents insights pivoted by your customers, your customer base growth and their contribution to orders by different data views. This page provides graphical representations of the Customer totals, Customers by geography, Customer growth trend, Customers by orders contribution and Customers details grid.

## Downloads dashboard

## Analytics dashboard



