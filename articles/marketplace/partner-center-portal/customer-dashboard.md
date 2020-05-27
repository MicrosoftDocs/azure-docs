---
title: Customer dashboard in Microsoft commercial marketplace analytics on Partner Center
description: Learn how to access information about your customers, including growth trends, using the customer dashboard in commercial marketplace analytics.
author: dsindona
ms.author: dsindona
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 12/11/2019
---

# Customer Dashboard in commercial marketplace analytics

This article provides information on the **Customer dashboard** in Partner Center. This dashboard displays information about your customers, including growth trends, presented in a graphical and downloadable format.

To access the **Customer dashboard**, open the **[Analyze](https://partner.microsoft.com/dashboard/commercial-marketplace/analytics/summary)** dashboard under Commercial Marketplace.

>[!NOTE]
> For detailed definitions of analytics terminology, see [Frequently asked questions and terminology for commercial marketplace analytics](./faq-terminology.md).

## Customer dashboard

The **Customer dashboard** of the **Analyze** menu displays data for customers who have acquired your offers. You can view graphical representations of the following items:

- [Customer summary](#customer-summary)
- [Customer by geography](#customer-by-geography)
- [Customer trends](#customer-trends)
- [Customers by orders and usage](#customers-by-orders-and-usage)
- [Customers by SKUs](#customers-by-skus)
- [Orders and usage by customer type](#orders-and-usage-by-customer-type)
- [Customer details table](#customer-details-table)
- [Customer page filters](#customer-page-filters)

### Customer summary

The Customer summary section displays a count of all customers, including new, existing, and churned, during the selected date range.

- Total customers is defined as the count of all customers who have purchased your offer and have at least one order that has not been canceled.
- Customers percentage of growth compared to the previous month is indicated by the number and upward indicator in green or downward indicator in red.
- Growth trends are represented by bar graphs and will display the value for each month by hovering over the columns of the chart.

There are three **customer types**: new, existing, and churned.

- A new customer has acquired one or more of your offers for the first time within the selected month.
- An existing customer has acquired one or more of your offers prior to the month selected.
- A churned customer has canceled all offers previously purchased.

### Customer by geography

The **Customer by geography** chart shows the counts of all customers and customers acquired during the selected date range and are mapped based on the Customer Country/Region. The light to dark color on the map represents the low to high value of the customer count. Click a record in the table to zoom in on a country/region.

The heatmap displays the customer count and % by customer country/region. You can move the map to view the exact location and zoom into a specific location. This map has a supplemental grid that allows you to view the % of customers by location, as well as customers newly added to that location.

### Customer trends

The **Customer trends** chart displays a count of all customers, including new, existing, and churned, with a month-by-month growth trend.

- The line chart represents the overall customer growth percentages.
- The month column represents the count of customers stacked by new, existing, and churned customers.
- The churned customer count is displayed on the negative direction of Y Axis.
- You can select specific legend items to displayed more detailed views. For example, select new customers from the legend to only display new customers.
- You can use the slider on the top of the chart to scroll right and left on the x-axis and focus on specific data points to view in more detail.
- Hovering over a column of the chart will display details for only that month.

### Customers by orders and usage

The **Customers by orders/usage** chart has three tabs, "orders," "normalized usage," and "raw usage." The **top customer percentile** is displayed along the x-axis, as determined by their number of orders. The y-axis displays the customer's order count. The secondary y-axis (line graph) displays the cumulative percentage of the total number of orders. You can display details by hovering over points along the line chart.

As an example, see the chart below for normalized usage: The top 30th percentile of customers are contributing to 87% of the normalized usage cumulatively. The 30th percentile of customers are only contributing 1.57 million hours of usage.

### Customers by SKUs

The **Customers by SKUs/usage** charts are described below.

1. The Leader board presents details of the top 50 customers ranked by order count. After selecting a customer, the details of the customer are presented in sections 2, 3, and 4 of this leader board.
2. The Customer profile details are displayed in this space when publishers are logged in with an owner role. If publishers are logged in with a contributor role, the details in this section will not be available.
3. The Orders by SKUs donut chart displays the breakdown of orders purchased for SKUs. The top 5 SKUs with the highest order count are displayed, while the rest of the orders are grouped under 'rest all'.
4. The Seats by SKUs donut chart displays the breakdown of seats ordered for SKUs. The top 5 SKUs with the highest seats are displayed, while the rest of the orders are grouped under rest all.

### Orders and usage by customer type

The **Orders/usage by customer type** chart displays the number of orders, normalized usage, and raw usage hours split between new customers and existing customers; based on the selection of orders, normalized, and raw usage respectively in the chart.

- A new customer has acquired one or more of your offers or reported usage for the first time within the same calendar month (y-axis).
- An existing customer has previously acquired an offer from you or reported usage prior to the calendar month reported (on the y-axis).

### Customer details table

The **Customer details** table displays a numbered list of the top 1000 customers sorted by the date they first acquired one of your offers.

- Customer personal information will only be available if the customer has provided consent. You can only view this information if you have logged in with an owner role level of permissions. Learn more about user roles and permissions.
- Each column in the grid is sortable.
- The data can be extracted to a TSV file if the count of the records is less than 1000.
- If records number is over 1000, exported data will be asynchronously placed in a downloads page for the next 30 days.
- Filters can be applied to the table to display only the data that you are interested in. Data can be filtered by Company name, Customer ID, Marketplace Subscription ID, Azure License Type, Date Acquired, Date Lost, Customer Email, Customer Country/Region/State/City/Zip, Customer Language, and so on.
- When an offer is purchased by a protected customer, information in **Customer Detailed Data** will be masked (************).

### Customer page filters

The **Customers page** filters are applied at the Customers page level. You can select multiple filters to render the chart for the criteria you choose to view and the data you want to see in 'Detailed orders data' grid / export. Filters are applied on the data extracted for the data range you have selected on the top-right corner of the orders page.

>[!NOTE]
> Detailed definitions for each of the fields in Customer grid, page filters, and their possible selections are located in [Frequently asked questions and terminology for Commercial Marketplace analytics](./faq-terminology.md).

## Next steps

- For an overview of analytics reports available in the Partner Center commercial marketplace, see [Analytics for the commercial marketplace in Partner Center](./analytics.md).
- For graphs, trends, and values of aggregate data that summarize marketplace activity for your offer, see [Summary Dashboard in commercial marketplace analytics](./summary-dashboard.md).
- For information about your orders in a graphical and downloadable format, see [Orders Dashboard in commercial marketplace analytics](./orders-dashboard.md).
- For Virtual Machine (VM) offers usage and metered billing metrics, see [Usage Dashboard in commercial marketplace analytics](./usage-dashboard.md).
- For a list of your download requests over the last 30 days, see [Downloads Dashboard in commercial marketplace analytics](./downloads-dashboard.md).
- To see a consolidated view of customer feedback for offers on Azure Marketplace and AppSource, see [Ratings and reviews dashboard in commercial marketplace analytics](./ratings-reviews.md).
- For frequently asked questions about commercial marketplace analytics and for a comprehensive dictionary of data terms, see [Frequently asked questions and terminology for commercial marketplace analytics](./faq-terminology.md).
