---
title: Disable Data Estate Insights
description: This article provides the steps to disable or enable Data Estate Insights in the Microsoft Purview governance portal.
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.topic: how-to
ms.date: 12/08/2022
---

# Disable Data Estate Insights or report refresh

Microsoft Purview Data Estate Insights automatically aggregates metrics and creates reports about your Microsoft Purview account and your data estate. When you scan registered sources and populate your Microsoft Purview Data Map, the Data Estate Insights application automatically identifies governance gaps and highlights them in its top metrics. It also provides drill-down experience that enables all stakeholders, such as data owners and data stewards, to take appropriate action to close the gaps.

These features are optional and can be enabled or disabled at any time. This article provides the specific steps required to enable or disable Microsoft Purview Data Estate Insights features.

To reschedule without disabling, see [the article to schedule Data Estate Insights reports](how-to-schedule-data-estate-insights.md).

> [!IMPORTANT]
> The Data Estate Insights application is **on** by default when you create a Microsoft Purview account.
>
> **State** is set to On.
>
> **Refresh Schedule** is set to a weekly refresh that begins 7 days after the account is created.
>
> As the Data Map is populated and curated, Insights App shows data in the reports. The reports are ready for consumption to anyone with Insights Reader role.

If you don't plan on using Data Estate Insights for a time, a **[data curator](catalog-permissions.md#roles) on the [root collection](reference-azure-purview-glossary.md#root-collection)** can disable the Data Estate Insights in one of two ways:

- [Disable the Data Estate Insights application](#disable-the-data-estate-insights-application) - this will stop billing from both report generation and report consumption.
- [Disable report refresh](#disable-report-refresh) - Insights readers have access to current reports, but reports won't be refreshed. Billing will occur for report consumption but not report generation.

Steps for both methods, and for re-enablement, are below.

For more information about billing for Data Estates Insights, see our [pricing guidelines](concept-guidelines-pricing-data-estate-insights.md).

## Disable the Data Estate Insights application

> [!NOTE]
> To be able to disable this application, you will need to have the [data curator role](catalog-permissions.md#roles) on your account's [root collection.](reference-azure-purview-glossary.md#root-collection)

Disabling Data Estate Insights will disable the entire application, including these reports:
- Stewardship
- Asset
- Glossary
- Classification
- Labeling

The application icon will still show in the menu, but insights readers won't have access to reports at all, and report generation jobs will be stopped. The Microsoft Purview account won't receive any bill for Data Estate Insights.

To disable the Data Estate Insights application, a user with the [data curator role](catalog-permissions.md#roles) at the [root collection](reference-azure-purview-glossary.md#root-collection) can follow these steps:

1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/), go to the **Management** section.

    :::image type="content" source="media/disable-data-estate-insights/locate-management.png" alt-text="Screenshot of the Microsoft Purview governance portal left menu, with the Management section highlighted and overview shown selected in the next menu." :::

1. Then select **Overview**.
1. In the **Feature options** menu, locate Data Estate Insights, and select the **State** toggle to change it to **Off**.

    :::image type="content" source="media/disable-data-estate-insights/disable-option.png" alt-text="Screenshot of the Overview window in the Management section of the Microsoft Purview governance portal with the State toggle highlighted for Data Estate Insights feature options." :::

Once you have disabled Data Estate Insights, the icon will still appear in the left hand menu, but users will receive a warning stating that the application has been disabled when attempting to access it.

:::image type="content" source="media/disable-data-estate-insights/disabled-warning.png" alt-text="Screenshot of the Data Estate Insights section with Data Estate Insights disabled, showing no reports, and a message to contact your Data Curator to reinstate the reports." :::

## Disable report refresh

> [!NOTE]
> To be able to disable or edit report refresh, you will need to have the [data curator role](catalog-permissions.md#roles) on your account's [root collection.](reference-azure-purview-glossary.md#root-collection)

You can choose to disable report refreshes instead of disabling the entire Data Estate Insights application. When you disable report refreshes, users with the [insights reader role](catalog-permissions.md#roles) will still be able view reports, but they'll see warning at the top of each report indicating that the data may not be current and the date of the last refresh.

Graphs that show data from the last 30 days will appear blank after 30 days while graphs showing snapshot of the data map will continue to show graphs and details.

:::image type="content" source="media/disable-data-estate-insights/report-warning.png" alt-text="Screenshot of the report warning popup on the Data stewardship report insights page with the Report generated on date text highlighted." :::

To disable the Data Estate Insights report refresh, a user with the [data curator role](catalog-permissions.md#roles) at the [root collection](reference-azure-purview-glossary.md#root-collection) can follow these steps:

1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/), go to the **Management** section.

    :::image type="content" source="media/disable-data-estate-insights/locate-management.png" alt-text="Screenshot of the Microsoft Purview governance portal left menu, with the Management section highlighted." :::

1. Then select **Overview**.
1. In the **Insights refresh** menu, locate Data Estate Insights and select the **Edit pencil**

    :::image type="content" source="media/disable-data-estate-insights/disable-data-estate-insights.png" alt-text="Screenshot of the Overview window in the Management section of the Microsoft Purview governance portal with the edit pencil in the Data Estate Insights row highlighted." :::

1. Select the **Off** radio button and select **Continue**. If prompted, review your edits and select **Save.**

    :::image type="content" source="media/disable-data-estate-insights/disable-recurrance.png" alt-text="Screenshot of the Data Estate Insights edit page, with the Recurring radio button highlighted and set to Off." :::

1. You can now see under the **Schedule** column, the refresh schedule reads as **Disabled**.

## Re-enable Data Estate Insights and report refresh

> [!NOTE]
> To enable Data Estate Insights, enable report refresh, or edit report refresh, you will need to have the [data curator role](catalog-permissions.md#roles) on your account's [root collection.](reference-azure-purview-glossary.md#root-collection)

If Data Estate Insights or report refresh has been disabled in your Microsoft Purview governance portal environment, a user with the [data curator role](catalog-permissions.md#roles) at the [root collection](reference-azure-purview-glossary.md#root-collection) can re-enable either at any time by following these steps:

1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/), go to the **Management** section.

    :::image type="content" source="media/disable-data-estate-insights/locate-management.png" alt-text="Screenshot of the Microsoft Purview governance portal Management section highlighted.":::

1. Then select **Overview**.
1. In the **Insights refresh** menu, locate Data Estate Insights, and select the **Edit** pencil.

    :::image type="content" source="media/disable-data-estate-insights/refresh-frequency.png" alt-text="Screenshot of the Overview window in the Management section of the Microsoft Purview governance portal with the refresh frequency dropdown highlighted for Data Estate Insights feature options." :::

1. In the **Edit** menu, select **Recurring**.

1. Then select your time zone, set your recurrence to **Month(s)** or **Weeks(s)**, select your day and time to run, specify a start time, and optionally specify an end time. For more information about the available options, see [the article to schedule Data Estate Insights reports](how-to-schedule-data-estate-insights.md).

    :::image type="content" source="media/disable-data-estate-insights/set-recurrance.png" alt-text="Screenshot of the Data Estate Insights edit page, with the Recurring radio button highlighted and set to Recurring." :::

1. Select **Continue**. If prompted, review the updates and select **Save**.
1. Now you can see your schedule is set. Selecting **More info** in the schedule columns will give you the recurrence details.

    :::image type="content" source="media/disable-data-estate-insights/schedule-set.png" alt-text="Screenshot of the management page, with the Data Estate Insights information row highlighted." :::

## Next steps

- [Learn how to use Asset insights](asset-insights.md)
- [Learn how to use Classification insights](classification-insights.md)
- [Learn how to use Glossary insights](glossary-insights.md)
- [Learn how to use Label insights](sensitivity-insights.md)
- [Schedule Data Estate Insights reports](how-to-schedule-data-estate-insights.md)