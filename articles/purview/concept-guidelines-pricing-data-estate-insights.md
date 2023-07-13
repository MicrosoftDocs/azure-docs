---
title: Pricing guidelines for Data Estate Insights
description: This article provides a guideline to understand and strategize pricing for the Data Estate Insights components of Microsoft Purview (formerly Azure Purview).
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.topic: conceptual
ms.date: 01/24/2023
ms.custom: ignite-fall-2021
---

# Pricing for Data Estate Insights

This guide covers pricing guidelines for Data Estate Insights.

For a full pricing guideline details for Microsoft Purview (formerly Azure Purview), see the [pricing guideline overview.](concept-guidelines-pricing.md)

For specific price details, see the [Microsoft Purview (formerly Azure Purview) pricing page](https://azure.microsoft.com/pricing/details/purview/). This article will guide you through the features and factors that will affect pricing for Data Estate Insights.

## Guidelines

Data Estate Insights is billed on two dimensions:

- **Report generation** - this incorporates the job that checks for any changes in your environment and the jobs that aggregate metrics about your Microsoft Purview account that will appear in specific reports.
    - If you have [set your reports to refresh on a schedule](how-to-schedule-data-estate-insights.md), at the time of refresh there will be a job to check if any updates have been made to your environment. You'll always be billed a small amount for this check.
    - If updates have been made to your environment, you'll be billed for the jobs that aggregate metrics and generate your report.

    > [!NOTE]
    > On the [pricing page](https://azure.microsoft.com/pricing/details/purview/), you can find details for report generation pricing under Data Map Enrichment.
    > :::image type="content" source="media/concept-guidelines-pricing/data-map-enrichment.png" alt-text="Screenshot of the pricing page headers, showing Data Map Enrichment selected." :::

- **Report consumption** - This incorporates access of the report features (currently served through the UX). On the [pricing page](https://azure.microsoft.com/pricing/details/purview/), you can find details for report generation pricing under Data Estate Insights.
    :::image type="content" source="media/concept-guidelines-pricing/data-estate-insights.png" alt-text="Screenshot of the pricing page headers, showing Data Estate Insights selected." :::

> [!IMPORTANT]
> The Data Estate Insights application is **on** by default when you create a Microsoft Purview account. This means, “State” is on and “Refresh Frequency” is set to automatic*.
> 
> \* At this time automatic refresh is weekly.

If you want to reschedule or reduce how often your reports are refreshed, you can [schedule your Data Estate Insights reports](how-to-schedule-data-estate-insights.md).

If you don't plan on using Data Estate Insights for a while, a **[data curator](catalog-permissions.md#roles) on the [root collection](reference-azure-purview-glossary.md#root-collection)** can disable Data Estate Insights features in one of two ways:

- [Disable the Data Estate Insights application](#disable-the-data-estate-insights-application) - this will stop billing from both report generation and report consumption.
- [Disable report refresh](#disable-report-refresh) - [insights readers](catalog-permissions.md#roles) have access to current reports, but reports won't be refreshed. Billing will occur for report consumption but not report generation.

> [!NOTE]
> The application or report refresh can be enabled again later at any time.

A **[data curator](catalog-permissions.md#roles) on your account's [root collection](reference-azure-purview-glossary.md#root-collection)** can make these changes in the Management section of the Microsoft Purview governance portal in **Overview**, under **Feature options**. For specific steps, see the [disable Data Estates Insights article](disable-data-estate-insights.md)

:::image type="content" source="media/concept-guidelines-pricing/disable-data-estate-insights.png" alt-text="Screenshot of the Overview window in the Management section of the Microsoft Purview governance portal. Under feature options, the data estate insights option is highlighted." :::

### Schedule Report Refresh

Your reports can be scheduled to refresh daily, weekly, or monthly depending on your needs, and this will affect billing.

Firstly, on the date/time of your scheduled refresh, insights will run a job to check if any changes have been made in your environment since the last refresh. You'll always be billed for this job.

If changes have been made since the last report refresh, billing is calculated based on the amount of compute power that is used to generate the report, and is billed at the time of report generation.
For more information about specific pricing, see the [pricing page](https://azure.microsoft.com/pricing/details/purview/) **under Data Map Enrichment.**

For more information about setting your refresh schedule, see [the schedule Data Estate Insights reports article](how-to-schedule-data-estate-insights.md).

### Disable the Data Estate Insights application

Disabling Data Estate Insights will disable the entire application, including these reports:

- Stewardship
- Asset
- Glossary
- Classification
- Labeling

The application icon will still show in the menu, but insights readers won't have access to reports at all, and report generation jobs will be stopped. The Microsoft Purview account won't receive any bill for Data Estate Insights.

For steps to disable the Data Estate Insights application, see the [disable article.](disable-data-estate-insights.md#disable-the-data-estate-insights-application)

### Disable report refresh

You can choose to disable report refreshes instead of disabling the entire Data Estate Insights application.

When you disable report refreshes, insight readers will be able view reports but they'll see a banner on top of each report, warning that the report may not be current. It will also indicate the date the report was last generated.

In this case, graphs showing data from last 30 days will appear blank after 30 days. Graphs showing snapshot of the data map will continue to show graph and details. When an [insights readers](catalog-permissions.md#roles) accesses an insight report, report consumption meter will be triggered, and the Microsoft Purview account will be billed.

For steps to disable report refresh see the [disable article.](disable-data-estate-insights.md#disable-report-refresh)

## Next steps

- [Schedule Data Estate Insights reports](how-to-schedule-data-estate-insights.md)
- [Disable Data Estate Insights](disable-data-estate-insights.md)
- [Microsoft Purview, formerly Azure Purview, pricing page](https://azure.microsoft.com/pricing/details/azure-purview/)
- [Pricing guideline overview](concept-guidelines-pricing.md)
- [Pricing guideline Data Map](concept-guidelines-pricing-data-map.md)
