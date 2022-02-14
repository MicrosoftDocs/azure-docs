---
title: Learn about the Customer retention dashboard in Partner Center
description: Learn about the Customer retention dashboard in Partner Center.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: smannepalle
ms.author: smannepalle
ms.reviewer: sroy
ms.date: 02/11/2021
---

# Customer retention dashboard

This article describes the Customer retention dashboard in Partner Center. This dashboard displays information about your retained customers, including offer performance, valuable customers, and monthly cohort views, all presented in a graphical and downloadable format. It is currently only available for virtual machine offers.

This dashboard uses the 18 months of data prior to the current system date to plot different widgets and a monthly cohort view. This same information can also be downloaded.

The following illustration shows the offer usage timeline of two customers and introduces the concept of retention days (Day 0, Day 1, … Day _n_). Retention day is a normalized concept, meaning customer 1 can start their usage journey on Jan 1st (absolute date) and customer 2 can start theirs on March 1st (absolute date). Still, each specific date will be referred to as normalized "Day 0" for both customer 1 and 2. The same convention is extended to other customers. The following image illustrates customer offer usage across time:

:::image type="content" source="media/retention/usage-across-time.png" lightbox="media/retention/usage-across-time.png" alt-text="Table shows customer usage across time.":::

> [!NOTE]
> This feature is currently only available for virtual machine offers. It includes data for both trial and paid VM offers. Filters to perform retention analysis on trial and paid customers will be available in the dashboard by June 2022.

The dashboard uses the 18 months of data prior to the current system date to plot different widgets and a monthly cohort view. The raw data for these widgets can also be downloaded or accessed via programmatic API access.

## Filters for category and marketplace offer

:::image type="content" source="media/retention/category-selection.png" lightbox="media/retention/category-selection.png" alt-text="Shows the Category and Marketplace offer drop-down selection boxes.":::

Delect the **Category** for an offer from the left dropdown, then select one of your offers from the **Marketplace offer** dropdown.

> [!NOTE]
> The analysis is currently available at offer level, not at offer plan level.

## Granularity for retention analysis

:::image type="content" source="media/retention/time-range-selection.png" alt-text="Shows the selection headings of Days, Weeks, and Months.":::

Select a time range to analyze customer retention across days, weeks, and months. This analysis uses the 18 months of usage data prior to the current system date to calculate retained customers and retention scores across daily, weekly, and monthly views.

## Retained customers

This section shows the count of retained customers on a specific day (Day 0, Day 1, Day 2, …, Day *n*) after their first offer usage. Customer offer usage data is considered for a time range of 45 days to 18 months prior to the current day. View usage on specific days in the offer usage journey to understand where most customers become dormant or inactive.

#### Widget insights

- Insights capture deployed VM usage data aggregated over the billed account of customers.
- Usage data is normalized for the last 18 months on a rolling basis and updated daily.
- **Total** represents the customer count normalized at Day 45 of using the category offer.
- Hover on the line graph to display the customer count on specific days since first usage.

:::image type="content" source="media/retention/retained-customers.png" alt-text="Shows the count of retained customers on a specific day.":::

## Offer performance by category

This section shows the performance of a selected offer compared to other offers within the same selected category in the dropdown. It compares retention scores of offers at day 45 within a category and assigns a rank. Offers with higher retention scores are ranked higher than other offers. If any retention scores match, customer count at Day 0 breaks the tie.

The left portion of the widget contains information on the current rank, offer rank based on the time granularity selected (day, week, month), and change in offer rank based on the last data refresh. **Total offers** shows the count of all offers under the selected category, including offers from all partners in the marketplace with an offer listed under the selected category. **Total customers** indicates the count of all customers of these total offers.

The right portion of the widget plots a line between the offer count on the Y-axis against retention score (at day 45) separate intervals on the X-axis. The following example shows how to read offer performance by category widget.

**Example** – If you select **Contoso test offer** listed under the **Storage** category, the offer is currently ranked 125 among a total of 608 marketplace offers in the storage category. Your offer has a retention score of 0.4 calculated at day 45 of customers using **Contoso test offer**, meaning your selected offer would retain only 40% of customers who used this offer in the last 18 months. The retention score for all marketplace offers under category **Storage** has an average score of 0.19 and a median score of 0.10.

The offer rank, indicating the relative offer performance, has slipped by 9 ranks since the last data refresh happened for all partners in the marketplace. Hovering over the line graph shows the **Offer count**: the number of marketplace offers at different retention scores on the x-axis. In this example, **72 offers** have a retention score of **0.2**. The total offers (**608**) is the sum of all the offer counts (**Y-axis**) on the line graph at different retention score intervals (**X-axis**).

:::image type="content" source="media/retention/category-selection-example.png" alt-text="Shows the Category and Marketplace offer drop-down selection boxes for a sample offer.":::

:::image type="content" source="media/retention/retained-customers-example.png" alt-text="Shows the offer performance by category for a sample offer.":::

:::image type="content" source="media/retention/weekly-level-analysis-example.png" alt-text="Shows the weekly analysis for a sample offer.":::

#### Widget insights

- Retention score is defined as the ratio of retained customers at day 45 to day 0.
- Rank represents an offer's relative performance basis retention score at day 45.
- The line graph plots total offers on the Y-axis and retention scores on the X-axis.
- **Total offers** and **Total customers** values are for the selected Azure Marketplace category.
- The vertical line shows the retention score at day 45 of the selected offer and its relative performance with other offers.

:::image type="content" source="media/retention/offer-performance.png" alt-text="Shows the performance of a selected offer compared to other offers within the same selected category.":::

## Widget 5 – Daily Retention

This section shows offer retention scores at different days of customer usage and benchmarks it with the aggregated retention scores of all offers listed under the selected category. this shows how well your offer is performing and positioned among other offers:

- Good – offer retention score is above category benchmark
- Neutral – offer retention score equals category benchmark
- Bad – offer retention score is below category benchmark

The retention curve gives you an idea of major checkpoints at which a customer may stop using your offer. Use this information to help retain existing, inactive, or dormant customers.

#### Widget insights

- Table shows retention score of an offer relative to other offers in selected category across different normalized days.
- Sort based on the offer and category benchmark retention scores.
- Hover over the bar graph to view the count of retained customers for specific days.
- Hover over the line graph to view retention scores for specific days.

:::image type="content" source="media/retention/daily-retention.png" lightbox="media/retention/daily-retention.png" alt-text="Shows offer retention scores at different days of customer usage and benchmarks it with aggregated retention scores.":::

## Widget 6 – Customers

This section uses offer usage and generated revenue to identify the value of retained and dormant customers. Use this information to engage with customers dormant for longer durations to reactivate their offer usage.

#### Widget insights

- Select the **Normalized day** dropdown to check retained and dormant customers.
- Toggle between the **Retained** and **Dormant** tabs to analyze customer information.
- Revenue generated (USD) is accumulated value till the retained day selected in dropdown
- Revenue generated per day(USD) is the revenue for the specific day selected in drop down
- Sort on different columns as needed.

View additional pages of data using the page links at the bottom right. Retained customer information:

:::image type="content" source="media/retention/retained-information-day-1.png" lightbox="media/retention/retained-information-day-1.png" alt-text="Shows the use of offer usage and generated revenue to identify the value of retained and dormant customers at Day 1.":::

Dormant customer information:

:::image type="content" source="media/retention/retained-information-day-5.png" lightbox="media/retention/retained-information-day-5.png" alt-text="Shows the use of offer usage and generated revenue to identify the value of retained and dormant customers at Day 5.":::

## Widget 7 – Active customers

The active customers widget displays the total count of active or retained customers based on the number of marketplace offers used. The stacked bar graph categorizes and shows the different number of days a customer is retained by an offer.

#### Widget insights

- Active customer count is on the Y-axis and offers per customer is on the X-axis.
- The colored bar represents different buckets of active or retained customers.
- Hover over the graph to see the active customer count on different days.

:::image type="content" source="media/retention/active-customers.png" alt-text="Shows the total count of active or retained customers based on the number of marketplace offers used.":::
<!--
## Widget 8 – Potential revenue

This widget shows the revenue that could have been generated for you by retaining dormant customers. It depicts a potential upside to your existing revenue and is calculated as the revenue generated by all the customers retained the previous day but dormant for the selected normalized day.

#### Widget insights

- Potential revenue is on the Y-axis and normalized retention days is on the X-axis.
- Graph displays the additional revenue if you retained customers for the corresponding normalized day.

:::image type="content" source="media/retention/potential-revenue.png" alt-text="Shows the revenue that could have been generated for you by retaining dormant customers.":::
-->

## Widget 8 – Recommendations

:::image type="content" source="media/retention/recommendations.png" lightbox="media/retention/recommendations.png" alt-text="Shows ":::

This shows next steps. **Click here** opens the offer product description page in Azure Marketplace or Microsoft AppSource.

#### Widget insights

- **Click here** on the left opens the product description page for your offer.
- **Click here** on the right opens the customer dashboard in Marketplace Insights

## Widget 9 – Retention heat map

This section shows the retention scores of customers acquired in a cohort. The Month column denotes the first usage month (Month 0) of a customer cohort. The cohort column indicates the count of customers within a cohort, starting on a specific month. Use this information to analyze the retention rates of an offer across months and determine the offer usage behavior and engagement of customers in a cohort.

#### Widget insights

- Month column refers to the start month for the selected offer usage.
- Cohort column refers to the size of the customer cohort acquired for the specific start month.
- Successive months are shown as 0M, 1M, 2M, ... 17M after start month.
- Hover over each cell of the heatmap to view the retention score in percentages.
- Darker blue cells indicate higher retention score, lighter blue cells indicate lower retention scores.

:::image type="content" source="media/retention/retention-heat-map.png" lightbox="media/retention/retention-heat-map.png" alt-text="Shows the retention scores of customers acquired in a cohort.":::

## Widget 10 – Customer retention details section

This table lists the 500 top orders by retained date.

- Each column in the grid is sortable.
- The data can be exported to a .CSV or .TSV file if the number of records is less than 500.
- If records number over 500, exported data is regularly placed in a downloads page for the next 30 days.

:::image type="content" source="media/retention/retention-details.png" lightbox="media/retention/retention-details.png" alt-text="Shows a sample customer retention details table.":::

## Customer retention details table

| Column name in user interface | Attribute name | Definition | Column name in programmatic access reports |
| --- | --- | --- | --- |
| Category | Offer category | Azure Marketplace category for the offer | |
| Marketplace offer | Offer Name | The name of the commercial marketplace offering. | |
| NA | Product Id | Unique identifier for the offer in marketplace | |
| Offer plan | Sku | The plan associated with the offer. | |
| Sku Billing Type | Sku Billing Type | Indicates offer has a free or paid plan | |
| Customer Id | Customer Id | The unique identifier assigned to a customer. A customer may have zero or more Azure Marketplace subscriptions. | |
| Customer Name | Customer Name | Name of the customer using the offer | |
| Customer Company Name | Customer Company Name | The company name provided by the customer. The name could be different than the name in a customer's Azure subscription. | |
| Customer Country Name | Customer Country Name | The country/region name provided by the customer. Country/region could be different than the country/region in a customer's Azure subscription. | |
| Customer Country code | Customer Country code | Unique code associated with customer country | |
| Customer Currency code | Customer Currency code | Unique code associated with the currency used by the customer for the commercial marketplace transaction. | |
| First usage date | First usage date | Date when the customer first started using the offer | |
| Azure License Type | Azure License Type | The type of licensing agreement used by customers to purchase Azure. Also known as the *channel*. The possible values are: <ul><li>Cloud Solution Provider<li>Enterprise<li>Enterprise through Reseller<li>Pay as You Go</ul>| |
| Offer Type | Offer Type | Indicates the available offer types listed in marketplace | |
| Days from First Usage | Days from First Usage | Number of days since the customer first started using the offer | |
| Revenue Generated (USD) | Revenue Generated (USD) | Total revenue accumulated till the days from first usage | |
| Revenue generated Per Day (USD) | Revenue generated Per Day (USD) | Revenue generated for the specific day value in the Days from first usage column | |
|
## Next steps

- Sign in to [Partner Center](https://go.microsoft.com/fwlink/?linkid=2166002).
