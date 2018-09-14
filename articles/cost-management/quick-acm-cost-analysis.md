---
title: Quickstart - Explore Azure costs with Cost analysis | Microsoft Docs
description: This quickstart helps you use cost analysis to explore and analyze your Azure organizational costs.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 09/14/2018
ms.topic: quickstart
ms.service: cost-management
manager: dougeby
ms.custom:
---
# Quickstart: Explore and analyze costs with Cost analysis

Before you can properly control and optimize your Azure costs, you need to understand where costs originated within your organization. It's also useful to know how much money your services cost, and in support of what environments and systems. Visibility into the full spectrum of costs is critical to accurately understand organizational spending patterns, which can be used to enforce cost control mechanisms, like budgets.

In this quickstart, you use cost analysis to explore and analyze your organizational costs. You can view aggregated costs by organization to understand where costs are accrued and identify spending trends. You can view accumulated costs over time to estimate monthly, quarterly, or even yearly cost trends against a budget. A budget helps to ensure adherence to financial constraints or view daily or monthly costs to isolate spending irregularities. And, you can download the current report's data for further analysis or to use in an external system.

In this quickstart, you learn how to

- Review costs in cost analysis
- Customize cost views
- Download cost analysis data


## Prerequisites

Cost analysis is available to all Enterprise Agreement (EA) customers. You must have read access to at least one of the following scopes to view cost data.

- Azure EA billing account (enrollment)
- Azure EA subscription
- Azure EA subscription resource group

## Sign in to Azure

- Sign in to the Azure portal at http://portal.azure.com.

## Review costs in cost analysis

To review your costs with cost analysis, open the Azure portal then then navigate to **Cost Management + Billing** &gt; **Billing accounts** &gt; select your EA billing account &gt; under Cost Management, select **Cost analysis**.

The initial cost analysis view includes the following areas:

**Total** – Shows the total costs for the current month.

**Budget** – Shows the planned spending limit for the selected scope, if available.

**Accumulated cost** – Shows the total accrued daily spending, starting from the beginning of the month. After you [create a budget](tutorial-acm-create-budgets.md) for your billing account or subscription, you can quickly see your spending trend in relation to the budget. Hover over a date to view the accumulated cost for that day.

**Pivot (donut) charts** – Provide dynamic pivots, breaking down the total cost by a common set of standard properties, from the most to least cost accrued for the current month. You can change pivot charts at any time by selecting a different pivot. By default, costs are broken down by service (meter category), location (region), and child scope (for example, enrollment accounts under billing accounts, resource groups under subscriptions, and resources under resource groups).

![Initial view of cost analysis](./media/quick-acm-cost-analysis/cost-analysis-01.png)

## Customize cost views

The default view provides quick answers to common questions like:

- How much did I spend?
- Will I stay within my budget?

However, there are many cases where you need deeper analysis. Customization starts at the top of the page, with the date selection.

By default, cost analysis shows data for the current month. Use the date selector to quickly switch to the last month, this month, this calendar quarter, this calendar year, or a custom date range of your choice. Selecting the last month is the quickest way to analyze your latest Azure invoice and easily reconcile charges. The current quarter and year options help track costs against longer-term budgets. Or, you can select a more fine-grained or broader date range, from a single day to the last seven days or anything as far back as a year before the current month.

![Date selector](./media/quick-acm-cost-analysis/date-selector.png)

Also by default, cost analysis shows **accumulated** costs. Accumulated costs include all costs for each day in addition to the previous days, for a constantly growing view of your daily, accrued costs. This view is optimized to show how you are trending against a budget for the selected time range.

There's also the **daily** view which shows costs for each day. Instead of showing a growth trend, the daily view is optimized for identifying irregularities as costs spike or dip from day to day. If you've selected a budget, the daily view also shows an estimate of what your daily budget might look like. If your daily costs are consistently above the estimated daily budget, then you can expect that you'll exceed your monthly budget. The estimated daily budget is simply a means to help you visualize your budget at a lower level. If you have fluctuations in daily costs, then the estimated daily budget comparison to your monthly budget is less accurate.

![Daily view](./media/quick-acm-cost-analysis/daily-view.png)

You can **Group by** to select a group category to change data displayed in the top total area graph. Grouping lets you quickly see how your spending is categorized by resource type. Here's a view of Azure services service costs for a last month view.

![Grouped daily accumulated view](./media/quick-acm-cost-analysis/grouped-daily-accum-view.png)

Under the top Total view are pivot chats that you can use to show views for different grouping and filtering categories. When you select any group category, the full set of data for total view is at the bottom of the view. Here's an example for resource groups.

![Full data for current view](./media/quick-acm-cost-analysis/full-data-set.png)

The preceding example image shows resource group names. Viewing tags for resources are not available in any of the cost analysis views, filters, or groupings.

## Download cost analysis data

When you **Download** information from cost analysis, a CSV file is generated for all data currently shown in the Azure portal. If you've applied any filters or grouping, then they are included in the file. Some underlying data for the top Total chart that isn't actively displayed in the portal is also included in the CSV file.

## Next steps

Advance to the first tutorial to learn how to create and manage budgets.

> [!div class="nextstepaction"]
> [Create and manage budgets](tutorial-acm-create-budgets.md)
