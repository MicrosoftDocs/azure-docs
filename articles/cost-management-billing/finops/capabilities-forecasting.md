---
title: Forecasting
description: This article helps you understand the forecasting capability within the FinOps Framework and how to implement that in the Microsoft Cloud.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: finops
ms.reviewer: micflan
---


# Forecasting

This article helps you understand the forecasting capability within the FinOps Framework and how to implement that in the Microsoft Cloud.

## Definition

**Forecasting involves analyzing historical trends and future plans to predict costs, understand the impact on current budgets, and influence future budgets.**

Analyze historical usage and cost trends to identify any patterns you expect to change. Augment that with future plans to generate an informed forecast.

Periodically review forecasts against the current budgets to identify risk and initiate remediation efforts. Establish a plan to balance budgets across teams and departments and factor the learnings into future budgets.

With an accurate, detailed forecast, organizations are better prepared to adapt to future change.

## Before you begin

Before you can effectively forecast future usage and costs, you need to familiarize yourself with [how you're charged for the services you use](https://azure.microsoft.com/pricing#product-pricing). 

Understanding how changes to your usage patterns affect future costs is informed with:
- Understanding the factors that contribute to costs (for example, compute, storage, networking, and data transfer)
- How your usage of a service aligns with the various pricing models (for example, pay-as-you-go, reservations, and Azure Hybrid Benefit)

## Getting started

When you first start managing cost in the cloud, you use the native Cost analysis experience in the portal.

The simplest option is to [use Cost analysis to project future costs](../costs/cost-analysis-common-uses.md#view-forecast-costs) using the Daily costs or Accumulated costs view. If you have consistent usage with little to no anomalies or large variations, it may be all you need.

If you do see anomalies or large (possibly expected) variations in costs, you may want to customize the view to build a more accurate forecast. To do so, you need to analyze the data and filter out anything that might skew the results.

- Use Cost analysis to analyze historical trends and identify abnormalities.
  - Before you start, determine if you're interested in your costs as they're billed or if you want to forecast the effective costs after accounting for commitment-based discounts. If you want the effective cost, [change the view to use amortized cost](../costs/customize-cost-analysis-views.md#switch-between-actual-and-amortized-cost).
  - Start with the Daily costs view, then change the date range to look back as far as you're interested in looking forward. For instance, if you want to predict the next 12 months, then set the date range to the last 12 months.
  - Filter out all purchases (`Charge type = Purchase`). Make a note of them as you need to forecast them separately.
  - Group costs to identify new and old (deleted) subscriptions, resource groups, and resources.
    - If you see any deleted items, filter them out.
    - If you see any that are new, make note of them and then filter them out. You forecast them separately. Consider saving your view under a new name as one way to "remember" them for later.
    - If you have future dates included in your view, you may notice the forecast is starting to level out. It happens because the abnormalities are no longer being factored into the algorithm.
  - If you see any large spikes or dips, group the data by one of the [grouping options](../costs/group-filter.md) to identify what the cause was.
    - Try different options until you discover the cause using the same approach as you would in [finding unexpected changes in cost](../understand/analyze-unexpected-charges.md#manually-find-unexpected-cost-changes).
    - If you want to find the exact change that caused the cost spike (or dip), use tools like [Azure Monitor](../../azure-monitor/overview.md) or [Resource Graph](../../governance/resource-graph/how-to/get-resource-changes.md) in a separate window or browser tab.
    - If the change was a segregated charge and shouldn't be factored into the forecast, filter it out. Be careful not to filter out other costs as it will skew the forecast. If necessary, start by forecasting a smaller scope to minimize risk of filtering more and repeat the process per scope.
    - If the change is in a scope that shouldn't get filtered out, make note of that scope and then filter it out. You forecast them separately.
  - Consider filtering out any subscriptions, resource groups, or resources that were reconfigured during the period and may not reflect an accurate picture of future costs. Make note of them so you can forecast them separately.
  - At this point, you should have a fairly clean picture of consistent costs.
- Change the date range to look at the future period. For example, the next 12 months.
  - If interested in the total accumulated costs for the period, change the granularity to `Accumulated`.
- Make note of the forecast, then repeat this process for each of the datasets that were filtered out.
  - You may need to shorten the future date range to ensure the historical anomaly or resource change doesn't affect the forecast. If the forecast is affected, manually project the future costs based on the daily or monthly run rate.
- Next factor in any changes you plan to make to your environment.
  - This part can be a little tricky and needs to be handled separately per workload.
  - Start by filtering down to only the workload that is changing. If the planned change only impacts a single meter, like the number of uptime hours a VM may have or total data stored in a storage account, then filter down to that meter.
  - Use the [pricing calculator](https://azure.microsoft.com/pricing/calculator) to determine the difference between what you have today and what you intend to have. Then, take the difference and manually apply that to your cost projections for the intended period.
  - Repeat the process for each of the expected changes.

Whichever approach worked best for you, compare your forecast with your current budget to see where you're at today. If you filtered data down to a smaller scope or workload:

- Consider [creating a budget in Cost Management](../costs/tutorial-acm-create-budgets.md) to track that specific scope or workload. Specify filters and set alerts for both actual and forecast costs.
- [Save a view in Cost analysis](../costs/save-share-views.md) to monitor that cost and budget over time.
- Consider [subscribing to scheduled alerts](../costs/save-share-views.md#subscribe-to-scheduled-alerts) for this view to share a chart of the cost trends with stakeholders. It can help you drive accountability and awareness as costs change over time before you go over budget.
- Consider [subscribing to anomaly alerts](../understand/analyze-unexpected-charges.md#create-an-anomaly-alert) for each subscription to ensure everyone is aware of anomalies as they're identified.

Consider reviewing forecasts monthly or quarterly to ensure you remain on track with your expectations.

## Building on the basics

At this point, you have a manual process for generating a forecast. As you move beyond the basics, consider the following points:

- Expand coverage of your forecast calculations to include all costs.
- If ingesting cost data into a separate system, use or introduce a forecast capability that spans all of your cost data. Consider using [Automated Machine Learning (AutoML)](../../machine-learning/how-to-auto-train-forecast.md) to minimize your effort.
- Integrate forecast projections into internal budgeting tools.
- Automate cost variance detection and mitigation.
  - Implement automated processes to identify and address cost variances in real-time.
  - Establish workflows or mechanisms to investigate and mitigate the variances promptly, ensuring cost control and alignment with forecasted budgets.
- Build custom forecast and budget reporting against actuals that's available to all stakeholders.
- If you're [measuring unit costs](capabilities-unit-costs.md), consider establishing a forecast for your unit costs to better understand whether you're trending towards higher or lower cost vs. revenue.
- Establish and automate KPIs, such as:
  - Cost vs. forecast to measure the accuracy of the forecast algorithm.
    - It can only be performed when there are expected usage patterns and no anomalies.
    - Target \<12% variance when there are no anomalies.
  - Cost vs. forecast to measure whether costs were on target.
    - It's evaluated whether there are anomalies or not to measure the performance of the cloud solution.
    - Target 12-20% variance where \<12% would be an optimized team, project, or workload.
  - Number of unexpected anomalies during the period that caused cost to go outside the expected range.
  - Time to react to forecast alerts.

## Learn more at the FinOps Foundation

This capability is a part of the FinOps Framework by the FinOps Foundation, a non-profit organization dedicated to advancing cloud cost management and optimization. For more information about FinOps, including useful playbooks, training and certification programs, and more, see the [Forecasting capability](https://www.finops.org/framework/capabilities/forecasting) article in the FinOps Framework documentation.

## Next steps

- Budget management
- Managing commitment-based discounts
