---
title: Quickstart - Explore Azure costs with cost analysis
description: This quickstart helps you use cost analysis to explore and analyze your Azure organizational costs.
author: bandersmsft
ms.author: banders
ms.date: 03/22/2022
ms.topic: quickstart
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: micflan
ms.custom: contperf-fy22q2, mode-other
---
# Quickstart: Explore and analyze costs with cost analysis

Before you can properly control and optimize your Azure costs, you need to understand where costs originated within your organization. It's also useful to know how much money your services cost, and in support of which environments and systems. Visibility into the full spectrum of costs is critical to accurately understand organizational spending patterns. You can use spending patterns to enforce cost control mechanisms, like budgets.

In this quickstart, you use cost analysis to explore and analyze your organizational costs. You can view aggregated costs by organization to understand where costs occur over time and identify spending trends. You can view accumulated costs over time to estimate monthly, quarterly, or even yearly cost trends against a budget. You can use budgets to get notified as cost exceeds specific thresholds.

In this quickstart, you learn how to:

- Get started in cost analysis
- Select a cost view
- Select a date range
- View costs
- Group costs
- Switch between actual and amortized costs
- View costs in table format

## Prerequisites

Cost analysis supports different kinds of Azure account types. To view the full list of supported account types, see [Understand Cost Management data](understand-cost-mgt-data.md). To view cost data, you need at least read access for your Azure account.

If you have a new subscription, you can't immediately use Cost Management features. It might take up to 48 hours before you can use all Cost Management features.

## Sign in to Azure

- Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/costanalysis).

## Get started in Cost analysis

To review your costs in cost analysis, open the scope in the Azure portal and select **Cost analysis** in the menu. For example, go to **Subscriptions**, select a subscription from the list, and then select **Cost analysis** in the menu.

Use the **Scope** pill to switch to a different scope in cost analysis.

The scope you select is used throughout Cost Management to provide data consolidation and control access to cost information. When you use scopes, you don't multi-select them. Instead, you select a larger scope, which others roll up to, and then filter down to the nested scopes you need. This approach is important to understand because some people may not have access to a single parent scope, which covers multiple nested scopes.

>[!VIDEO https://www.youtube.com/embed/mfxysF-kTFA]

The initial cost analysis view includes the following areas:

**Currently selected view**: Represents the predefined cost analysis view configuration. Each view includes date range, granularity, group by, and filter settings. The default view shows accumulated costs for the current billing period, but you can change to other built-in views.

**Cost**: Shows the total usage and purchase costs for the current month, as they're accrued and will show on your bill.

**Forecast**: Shows the total forecasted costs for time period you choose.

**Budget (if selected)**: Shows the planned spending limit for the selected scope, if available.

**Accumulated granularity**: Shows the total aggregate daily costs, from the beginning of the billing period. After you create a budget for your billing account or subscription, you can quickly see your spending trend against the budget. Hover over a date to view the accumulated cost for that day.

**Pivot (donut) charts**: Provide dynamic pivots, breaking down the total cost by a common set of standard properties. They show the largest to smallest costs for the current month. 

![Initial view of cost analysis in the Azure portal](./media/quick-acm-cost-analysis/cost-analysis-01.png)

### Understand forecast

Based on your recent usage, cost forecasts show a projection of your estimated costs for the selected time period. If a budget is set up in Cost analysis, you can view when forecasted spend is likely to exceed budget threshold. The forecast model can predict future costs for up to a year. Select filters to view the granular forecasted cost for your selected dimension.

## Select a cost view

Cost analysis has four built-in views, optimized for the most common goals:

View | Answer questions like
--- | ---
Accumulated cost | How much have I spent so far this month? Will I stay within my budget?
Daily cost | Have there been any increases in the costs per day for the last 30 days?
Cost by service | How has my monthly usage vary over the past three invoices?
Cost by resource | Which resources cost the most so far this month?
Invoice details | What charges did I have on my last invoice?

The cost by resource view is only available for subscription and resource group scopes.

![View selector showing an example selection for this month](./media/quick-acm-cost-analysis/view-selector.png)

## Select a date range 

There are many cases where you need deeper analysis. Customization starts at the top of the page, with the date selection.

Cost analysis shows data for the current month by default. Use the date selector to switch to common date ranges quickly. Examples include the last seven days, the last month, the current year, or a custom date range. Pay-as-you-go subscriptions also include date ranges based on your billing period, which isn't bound to the calendar month, like the current billing period or last invoice.

![Date selector showing an example selection for this month](./media/quick-acm-cost-analysis/date-selector.png)

## View costs

Cost analysis shows **accumulated** costs by default. Accumulated costs include all costs for each day plus the previous days, for a constantly growing view of your daily aggregate costs. This view is optimized to show how you're trending against a budget for the selected time range.

Use the forecast chart view to identify potential budget breaches. When there's a potential budget breach, projected overspending is shown in red. An indicator symbol is also shown in the chart. Hovering over the symbol shows the estimated date of the budget breach.

![Example showing potential budget breach](./media/quick-acm-cost-analysis/budget-breach.png)

There's also the **daily** view that shows costs for each day. The daily view doesn't show a growth trend. The view is designed to show irregularities as cost spikes or dips from day to day. If you've selected a budget, the daily view also shows an estimate of your daily budget.

Here's a daily view of recent spending with spending forecast turned on.
![Daily view showing example daily costs for the current month](./media/quick-acm-cost-analysis/daily-view.png)

When turn off the spending forecast, you don't see projected spending for future dates. Also, when you look at costs for past time periods, cost forecast doesn't show costs.

Generally, you can expect to see data or notifications for consumed resources within 8 to 12 hours.

## Group costs

**Group by** common properties to break down costs and identify top contributors. To group by resource tags, for example, select the tag key you want to group by. Costs are broken down by each tag value, with an extra segment for resources that don't have that tag applied.

Most Azure resources support tagging. However, some tags aren't available in Cost Management and billing. Additionally, resource group tags aren't supported. Support for tags applies to usage reported *after* the tag was applied to the resource. Tags aren't applied retroactively for cost rollups.

Here's a view of Azure service costs for the current month, grouped by Service name.

![Grouped daily accumulated view showing example Azure service costs for last month](./media/quick-acm-cost-analysis/grouped-daily-accum-view.png)

The following image shows resource group names. You can group by tag to view total costs per tag or use the **Cost by resource** view to see all tags for a particular resource.

![Full data for current view showing resource group names](./media/quick-acm-cost-analysis/full-data-set.png)

When you're grouping costs by a specific attribute, the top 10-cost contributors are shown from highest to lowest. If there are more than 10, the top nine cost contributors are shown with an **Others** group that represents all remaining groups combined. When you're grouping by tags, an **Untagged** group appears for costs that don't have the tag key applied. **Untagged** is always last, even if untagged costs are higher than tagged costs. Untagged costs will be part of **Others**, if 10 or more tag values exist. Switch to the table view and change granularity to **None** to see all values ranked from highest to lowest cost.

Classic virtual machines, networking, and storage resources don't share detailed billing data. They're merged as **Classic services** when grouping costs.

Pivot charts under the main chart show different groupings, which give you a broader picture of your overall costs for the selected time period and filters. Select a property or tag to view aggregated costs by any dimension.

![Example showing pivot charts](./media/quick-acm-cost-analysis/pivot-charts.png)

## Switch between actual and amortized cost

By default, cost analysis shows all usage and purchase costs as they're accrued and will show on your invoice, also known as **Actual cost**. Viewing actual cost is ideal for reconciling your invoice. However, purchase spikes in cost can be alarming when you're keeping an eye out for spending anomalies and other changes in cost. To flatten out spikes caused by reservation purchase costs, switch to **Amortized cost**.

![Change between actual and amortized cost to see reservation purchases spread across the term and allocated to the resources that used the reservation](./media/quick-acm-cost-analysis/metric-picker.png)

Amortized cost breaks down reservation purchases into daily chunks and spreads them over the duration of the reservation term. Most reservation terms are one or three years. Let's look at a one-year reservation example. Instead of seeing a $365 purchase on January 1, you'll see a $1.00 purchase every day from January 1 to December 31. In addition to basic amortization, these costs are also reallocated and associated by using the specific resources that used the reservation. For example, if that $1.00 daily charge was split between two virtual machines, you'd see two $0.50 charges for the day. If part of the reservation isn't utilized for the day, you'd see one $0.50 charge associated with the applicable virtual machine and another $0.50 charge with a charge type of `UnusedReservation`. Unused reservation costs can be seen only when viewing amortized cost.

If you buy a one-year reservation on May 26 with an upfront payment, the amortized cost is divided by 365 (assuming it's not a leap year) and spread from May 26 through May 25 of the next year. If you pay monthly, the monthly fee is divided by the number of days in that month and spread evenly across May 26 through June 25, with the next month's fee spread across June 26 through July 25.

Because of the change in how costs are represented, it's important to note that actual cost and amortized cost views will show different total numbers. In general, the total cost of months with a reservation purchase will decrease when viewing amortized costs, and months following a reservation purchase will increase. Amortization is available only for reservation purchases and doesn't apply to Azure Marketplace purchases at this time.

## View costs in table format

You can view the full dataset for any view. Whichever selections or filters that you apply affect the data presented. To see the full dataset, select the **chart type** list and then select **Table** view.

![Data for current view in a table view](./media/quick-acm-cost-analysis/chart-type-table-view.png)

## Next steps

Advance to the first tutorial to learn how to create and manage budgets.

> [!div class="nextstepaction"]
> [Create and manage budgets](tutorial-acm-create-budgets.md)
