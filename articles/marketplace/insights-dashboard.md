---
title: Marketplace Insights dashboard in commercial marketplace analytics
description: Access a summary of marketplace web analytics in Partner Center, which enables you to measure customer engagement in Microsoft AppSource and Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
ms.date: 11/06/2020
author: mingshen-ms
ms.author: mingshen
---

# Marketplace Insights dashboard in commercial marketplace analytics

This article provides information on the Marketplace Insights dashboard in Partner Center. This dashboard displays a summary of commercial marketplace web analytics that enables publishers to measure customer engagement for their respective product detail pages listed in the commercial marketplace online stores: Microsoft AppSource and Azure Marketplace.

To access the **Marketplace Insights** dashboard in Partner Center, under Commercial Marketplace, select **[Analyze](https://partner.microsoft.com/dashboard/commercial-marketplace/analytics/summary)** > **Marketplace Insights**.

For detailed definitions of analytics terminology, see [Commercial marketplace analytics terminology and common questions](./partner-center-portal/faq-terminology.md).

## Marketplace Insights dashboard

The Marketplace Insights dashboard presents an overview of the Azure Marketplace and AppSource offers’ business performance. This dashboard provides a broad overview of the following:

- Page visits trend
- Call to actions trend
- Page visits and Call to actions against offers, referral domains, and campaign ids
- Marketplace Insights by geography
- Marketplace Insights details table

The Marketplace Insights dashboard provides clickstream data, which shouldn't be correlated with leads generated in the lead destination endpoint.

> [!NOTE]
> The maximum latency between users visiting offers on Azure Marketplace or AppSource and reporting in Partner Center is 48 hours.

## Elements of the Marketplace Insights dashboard

The Marketplace Insights dashboard displays web telemetry details for Azure Marketplace and AppSource in two separate tabs. The following sections describe how to use the Marketplace Insights dashboard and how to read the data.

### Month range

You can find a month range selection at the top-right corner of each page. Customize the output of the **Marketplace Insights** page graphs by selecting a month range based on the past 6, or 12 months, or by selecting a custom month range with a maximum duration of 12 months. The default month range (computation period) is six months.

:::image type="content" source="./media/insights-dashboard/month-filters.png" alt-text="Illustrates the month filters on the Marketplace Insights dashboard.":::

> [!NOTE]
> All metrics in the visualization widgets and export reports honor the computation period selected by the user.

### Page visits trends

The Marketplace Insights **Visitors** chart displays a count of _Page visits_ and _Unique visitors_ for the selected computation period.

**Page visits**: This number represents the count of distinct user sessions on the offer listing page (product detail page) for a selected computation period. The red and green percentage indicators represent the growth percentage of page visits. The trend chart represents the month-to-month count of page visits.

**Unique visitors**: This number represents the distinct visitor count during the selected computation period for the offer(s) in Azure Marketplace and AppSource. A visitor who has visited one or more product detail pages will be counted as one unique visitor.

:::image type="content" source="./media/insights-dashboard/visitors.png" alt-text="Illustrates the Visitors chart on the Marketplace Insights dashboard.":::

### Call to actions trend

This number represents the count of **Call to Action** button clicks completed on the offer listing page (product detail page). _Calls to action_ are counted when users select the **Get It Now**, **Free Trial**, **Contact Me**, or **Test Drive** buttons.

:::image type="content" source="./media/insights-dashboard/call-to-actions-trend.png" alt-text="Illustrates the Call to action chart on the Marketplace Insights dashboard.":::

### Page visits and Call to actions against offers, Referral domains, and Campaign IDs

**Referral Domains**: Selecting a specific referral domain shows the monthly trend of page visits and calls to action on the chart to the right.

:::image type="content" source="./media/insights-dashboard/referral-domain.png" alt-text="Illustrates the Referral domain chart on the Marketplace Insights dashboard.":::

**Offers**: Select a specific offer, to see the monthly trend of page visits and calls to action on the chart to the right.

:::image type="content" source="./media/insights-dashboard/offer-alias.png" alt-text="Illustrates the offer alias chart on the Marketplace Insights dashboard.":::

**Campaign IDs**: By selecting a specific campaign ID, you should be able to understand the success of the campaign. For each campaign, you should be able to see the monthly trend of page visits and calls to action on the chart to the right.

:::image type="content" source="./media/insights-dashboard/campaign.png" alt-text="Illustrates the campaign chart on the Marketplace Insights dashboard.":::

### Marketplace Insights by geography

For the selected computation period, the heatmap displays the count of page visits, unique visitors, and calls to action (CTA). The light to dark color on the map represents the low to high value of the unique visitors. Select a record in the table to zoom in on a country/region.

:::image type="content" source="./media/insights-dashboard/geographical-spread.png" alt-text="Illustrates the geographical spread chart on the Marketplace Insights dashboard.":::

Note the following:

- You can move the map to view the exact location.
- You can zoom into a specific location.
- The heatmap has a supplementary grid to view the details of customer count, order count, and normalized usage hours in the specific location.
- You can search and select a country/region in the grid to zoom to the location in the map. Revert to the original view by selecting the **Home** button in the map.

### Marketplace Insights details table

This table provides a list view of the page visits and the calls to action of your selected offers' pages sorted by date.

- The data can be extracted to a .TSV or .CSV file if the count of records is less than 1,000.
- If the count of records is over 1,000, exported data will be asynchronously placed in a downloads page for the next 30 days.
- Filter data by Offer names and Campaign names to display the data you are interested in.

> [!TIP]
> You can use the download icon in the upper-right corner of any widget to download the data. You can provide feedback on each of the widgets by clicking on the “thumbs up” or “thumbs down” icon.

## Next steps

- For an overview of analytics reports available in the commercial marketplace, see [Access analytic reports for the commercial marketplace in Partner Center](./partner-center-portal/analytics.md).
- For information about your orders in a graphical and downloadable format, see [Orders dashboard in commercial marketplace analytics](./orders-dashboard.md).
- For virtual machine (VM) offers usage and metered billing metrics, see [Usage dashboard in commercial marketplace analytics](./usage-dashboard.md).
- For detailed information about your customers, including growth trends, see [Customer dashboard in commercial marketplace analytics](./customer-dashboard.md).
- For a list of your download requests over the last 30 days, see [Downloads dashboard in commercial marketplace analytics](./partner-center-portal/downloads-dashboard.md).
- To see a consolidated view of customer feedback for offers on Azure Marketplace and AppSource, see [Ratings & Reviews analytics dashboard in Partner Center](./partner-center-portal/ratings-reviews.md).
- For frequently asked questions about commercial marketplace analytics and for a comprehensive dictionary of data terms, see [Commercial marketplace analytics terminology and common questions](./partner-center-portal/faq-terminology.md).
