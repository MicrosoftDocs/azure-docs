---
title: Quickstart - Explore Azure costs with Cost analysis | Microsoft Docs
description: This quickstart helps you use cost analysis to explore and analyze your Azure organizational costs.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 11/09/2018
ms.topic: quickstart
ms.service: cost-management
manager: dougeby
ms.custom:
---
# Quickstart: Explore and analyze costs with Cost analysis

Before you can properly control and optimize your Azure costs, you need to understand where costs originated within your organization. It's also useful to know how much money your services cost, and in support of what environments and systems. Visibility into the full spectrum of costs is critical to accurately understand organizational spending patterns. Spending patterns can be used to enforce cost control mechanisms, like budgets.

In this quickstart, you use cost analysis to explore and analyze your organizational costs. You can view aggregated costs by organization to understand where costs occur over time and identify spending trends. You can view accumulated costs over time to estimate monthly, quarterly, or even yearly cost trends against a budget. A budget helps to provide adherence to financial constraints. And a budget is used to view daily or monthly costs to isolate spending irregularities. And, you can download the current report's data for further analysis or to use in an external system.

In this quickstart, you learn how to:

- Review costs in cost analysis
- Customize cost views
- Download cost analysis data


## Prerequisites

Cost analysis is available to all [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/) customers. You must have at least read access to one or more of the following scopes to view cost data. For more information about assigning access to Cost Management data, see [Assign access to data](assign-access-acm-data.md).

- Billing account
- Department
- Enrollment account
- Management group
- Subscription
- Resource group

## Sign in to Azure

- Sign in to the Azure portal at http://portal.azure.com.

## Review costs in cost analysis

To review your costs with cost analysis, in the Azure portal, navigate to **Cost Management + Billing** &gt; **Cost Management** &gt; **Change scope**, choose a scope, and then click **Select**.

The scope that you select is used throughout Cost Management to provide data consolidation and to control access to cost information. When you use scopes, you don't multi-select them. Instead, you select a larger scope that others roll-up to and then you filter-down to what you want. This is important to understand because some people should not have access to a parent scope that child scopes roll up to.

Click **Open Cost analysis**.

The initial cost analysis view includes the following areas:

**Total** – Shows the total costs for the current month.

**Budget** – Shows the planned spending limit for the selected scope, if available.

**Accumulated cost** – Shows the total accrued daily spending, starting from the beginning of the month. After you [create a budget](tutorial-acm-create-budgets.md) for your billing account or subscription, you can quickly see your spending trend against the budget. Hover over a date to view the accumulated cost for that day.

**Pivot (donut) charts** – Provide dynamic pivots, breaking down the total cost by a common set of standard properties. They show the most to least cost accrued for the current month. You can change pivot charts at any time by selecting a different pivot. Costs are categorized by: service (meter category), location (region), and child scope by default. For example, enrollment accounts under billing accounts, resource groups under subscriptions, and resources under resource groups.

![Initial view of cost analysis](./media/quick-acm-cost-analysis/cost-analysis-01.png)

## Customize cost views

The default view provides quick answers to common questions like:

- How much did I spend?
- Will I stay within my budget?

However, there are many cases where you need deeper analysis. Customization starts at the top of the page, with the date selection.

Cost analysis shows data for the current month by default. Use the date selector to quickly switch to: the last month, this month, this calendar quarter, this calendar year, or a custom date range of your choice. Selecting the last month is the quickest way to analyze your latest Azure invoice and easily reconcile charges. The current quarter and year options help track costs against longer-term budgets. You can also select a different date range. For example, you can select a single day, the last seven days, or anything as far back as a year before the current month.

![Date selector](./media/quick-acm-cost-analysis/date-selector.png)

Cost analysis shows **accumulated** costs by default. Accumulated costs include all costs for each day plus the previous days, for a constantly growing view of your daily accrued costs. This view is optimized to show how you're trending against a budget for the selected time range.

There's also the **daily** view showing costs for each day. The daily view doesn't show a growth trend. The view is designed to show irregularities as cost spikes or dips from day to day. If you've selected a budget, the daily view also shows an estimate of what your daily budget might look like. When your daily costs are consistently above the estimated daily budget, then you can expect you'll surpass your monthly budget. The estimated daily budget is simply a means to help you visualize your budget at a lower level. When you have fluctuations in daily costs, then the estimated daily budget comparison to your monthly budget is less precise.

![Daily view](./media/quick-acm-cost-analysis/daily-view.png)

You can **Group by** to select a group category to change data displayed in the top total area graph. Grouping lets you quickly see how your spending is categorized by common resource and usage properties, like resource group or resource tags. To group by tags, select the tag key you want to group by and you'll see costs broken down by each value for that tag, with an extra segment for resources which don't have that tag applied. Note Cost Management only supports resource tags from the date the tags are applied directly to the resource. Resource group tags are not supported today. Here's a view of Azure service costs for a view of the last month.

![Grouped daily accumulated view](./media/quick-acm-cost-analysis/grouped-daily-accum-view.png)

Pivot charts under the main chart show different groupings to give you a broader picture of your overall costs for the selected time period and filters. Select a property or tag to view aggregated costs by any dimension. The full set of data for total view is at the bottom of the screen by expanding the **Data** drawer or by selecting **Export > Download CSV** at the top of the screen. Here's an example of the data drawer for resource groups.

![Full data for current view](./media/quick-acm-cost-analysis/full-data-set.png)

The preceding image shows resource group names. While you can group by tag to view total costs per tag, viewing all tags per resource or resource group isn't available in any of the cost analysis views.

When grouping costs by a specific attribute, the top ten cost contributors are shown from highest to lowest. If there are more than ten groups, the top nine cost contributors are shown as well as an **Others** group, which covers all remaining groups together. When grouping by tags, you may also see an **Untagged** group for costs which do not have the tag key applied. **Untagged** is always last, even if there are more untagged costs than tagged costs. If there are 10 or more tag values, untagged costs will be part of **Others**.

*Classic* (Azure Service Management or ASM) virtual machines, networking, and storage resources do not share detailed billing data. They are merged as **Classic services** when grouping costs.


## Download cost analysis data

You can **Download** information from cost analysis to generate a CSV file for all data currently shown in the Azure portal. Any filters or grouping that you apply are included in the file. Underlying data for the top Total chart that isn't actively displayed is included in the CSV file.

## Next steps

Advance to the first tutorial to learn how to create and manage budgets.

> [!div class="nextstepaction"]
> [Create and manage budgets](tutorial-acm-create-budgets.md)
