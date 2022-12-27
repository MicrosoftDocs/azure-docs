---
title: Schedule Data Estate Insights report refresh
description: This article provides the steps to schedule your Data Estate Insights report refresh rate in the Microsoft Purview governance portal.
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.topic: how-to
ms.date: 12/08/2022
---

# Schedule Data Estate Insights report refresh

Microsoft Purview Data Estate Insights automatically creates reports that help you to identify governance gaps in your data estate. However, you can set the schedule for this automatic refresh to fit your reporting patterns and needs. In this article, we'll describe how you can schedule your refresh and what options are available.

If you would like to disable Data Estate Insights for a time, you can follow our article to [disable Data Estate Insights](disable-data-estate-insights.md).

> [!IMPORTANT]
> The Data Estate Insights application is **on** by default when you create a Microsoft Purview account.
>
> **Refresh Schedule** is set to a weekly refresh that begins 7 days after the account is created.
>
> As the Data Map is populated and curated, Insights App shows data in the reports. The reports are ready for consumption to anyone with Insights Reader role.

## Permissions needed

To update the report refresh schedule for Data Estate Insights, you'll need **[data curator permissions](catalog-permissions.md#roles) on the [root collection](reference-azure-purview-glossary.md#root-collection)**.

## How to update the refresh schedule

1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/), go to the **Management** section.

    :::image type="content" source="media/how-to-schedule-data-estate-insights/locate-management.png" alt-text="Screenshot of the Microsoft Purview governance portal Management section highlighted.":::

1. Then select **Overview**.
1. In the **Insights refresh** menu, locate Data Estate Insights, and select the **Edit** pencil. For more information about the insights refresh menu, see the [insights refresh menu section below](#insights-refresh-menu).

    >[!NOTE]
    >If the State is currently set to **Off** you will need to first turn it **On** before you can update the refresh schedule.

    :::image type="content" source="media/how-to-schedule-data-estate-insights/refresh-frequency.png" alt-text="Screenshot of the Overview window in the Management section of the Microsoft Purview governance portal with the refresh frequency dropdown highlighted for Data Estate Insights feature options." :::

1. In the **Edit** menu, select **Recurring**.

1. Then select your time zone, set your recurrence to **Month(s)** or **Weeks(s)**, select your day and time to run, specify a start time, and optionally specify an end time. For more information about the schedule options, see the [schedule options section below](#schedule-options).

    :::image type="content" source="media/how-to-schedule-data-estate-insights/set-recurrance.png" alt-text="Screenshot of the Data Estate Insights edit page, with the Recurring radio button highlighted and set to Recurring." :::

1. Select **Continue**. If prompted, review the updates and select **Save**.
1. Now you can see your schedule is set. Selecting **More info** in the schedule columns will give you the recurrence details.

    :::image type="content" source="media/how-to-schedule-data-estate-insights/schedule-set.png" alt-text="Screenshot of the management page, with the Data Estate Insights information row highlighted." :::

## Does the refresh schedule affect billing?

Yes. You're billed when a report is generated. For more information about billing for Data Estates Insights, see our [pricing guidelines](concept-guidelines-pricing-data-estate-insights.md).

## Schedule options

Below are listed all the schedule options currently available when you modify your refresh schedule:
    
- [Recurring or off](#recurring-or-off)
- [Time zone](#time-zone)
- [Recurrence](#recurrence)
- [Start at](#start-at)
- [End date (optional)](#specify-an-end-date)

### Recurring or off

- **Recurring** - your Data Estate Insights report will refresh on the recurrence schedule you'll specify below, based on the time zone you indicate.
- **Off** - your Data Estate Insights reports will no longer refresh information, but the current reports will remain available. For more information, see our [disable Data Estate Insights article.](disable-data-estate-insights.md#disable-report-refresh)

    :::image type="content" source="media/how-to-schedule-data-estate-insights/recurring-off.png" alt-text="Screenshot of the Edit refresh page recurrence and off options, showing recurrence selected." :::

### Time zone

Select the time zone you'd like to align your refresh schedule with. If the time zone you select observes daylight savings, your trigger will auto-adjust for the difference.

:::image type="content" source="media/how-to-schedule-data-estate-insights/time-zone.png" alt-text="Screenshot of the Edit refresh page time zone options, showing the time set to Pacific Standard." :::

### Recurrence

You can select weekly or monthly refresh recurrence.

- **Weekly recurrence** - schedule weekly recurrence by setting recurrence to every (1-5) week(s), and choosing the day of the week and time of day you would like to refresh the report. For example, the below report will refresh on Monday every two weeks, at six AM.

    :::image type="content" source="media/how-to-schedule-data-estate-insights/weekly-recurrence.png" alt-text="Screenshot of the Edit refresh page recurrence options, showing a weekly recurrence set." :::

- **Monthly recurrence** - schedule monthly recurrence by setting recurrence to every (1-5) months(s), and choosing the day of the month and time of day you would like to refresh the report. Choose **Last** to always run on the last day of the month, and **1** to always run on the first day of the month. For example, the below report will refresh on the last day of every month at five PM.

    :::image type="content" source="media/how-to-schedule-data-estate-insights/monthly-recurrence.png" alt-text="Screenshot of the Edit refresh page recurrence options, showing a monthly recurrence set." :::

Set **Scan at this time** to the time of day you'd like to begin your refresh. 

>[!TIP]
> The time you select will be the time that the report begins its refresh. Microsoft Purview will adjust compute for the amount of data being aggregated, but **schedule your recurrence a little before you will need the report** so the report has time to fully refresh and will be ready.

### Start at

The **Start at** option allows you to set when your reports will begin their refresh schedule, and is relative to the time zone you selected. Set it for the current date and time to set the schedule immediately.

:::image type="content" source="media/how-to-schedule-data-estate-insights/start-at.png" alt-text="Screenshot of the Edit refresh page start at option, showing a date and time selected." :::

### Specify an end date

If you want your reports to stop refreshing after a certain amount of time, you can enable this option by selecting the check box and providing an end date.
For example: a monthly recurrence schedule refreshing on the first of the month with the below end date would refresh on September 1 2023, and wouldn't refresh again in October.

:::image type="content" source="media/how-to-schedule-data-estate-insights/specify-an-end-date.png" alt-text="Screenshot of the Edit refresh page specify an end date option, with the option selected and the date selected." :::

## Insights refresh menu

In the management menu of the Microsoft Purview governance portal, you'll find the Insights refresh menu that lets you set your Data Estate Insights report availability.
Here's all the information you can find there:

|Feature|State|Schedule|Configuration date|Edit|
|---|---|---|---|---|
|Lists the feature your settings are for|Either **On** or **Off**. For more information about turning off reports, see our [disable Data Estate Insights article.](disable-data-estate-insights.md#disable-report-refresh)| Select **More info** to see your recurrence schedule, start time, and end time. | The day your recurrence schedule was last set. By default this will be the creation date of your Microsoft Purview account. | Allows you to update your recurrence schedule when reports are turned on. |

:::image type="content" source="media/how-to-schedule-data-estate-insights/insights-refresh-menu.png" alt-text="Screenshot of the insights refresh menu." :::

## Next steps

- [Learn how to use Asset insights](asset-insights.md)
- [Learn how to use Classification insights](classification-insights.md)
- [Learn how to use Glossary insights](glossary-insights.md)
- [Learn how to use Label insights](sensitivity-insights.md)
- [Disable Data Estate Insights](disable-data-estate-insights.md)