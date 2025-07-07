---
author: v-amallick
ms.service: azure-backup
ms.custom:
  - ignite-2024
ms.topic: include
ms.date: 10/19/2020
ms.author: v-amallick
---

## Conventions used in reports

To analyze the report, check the following conventions used in report:

- Filters work from left to right and top to bottom on each tab. That is, any filter only applies to all those widgets that are positioned either to the right of that filter or below that filter.
- Selecting a colored tile filters the widgets below the tile for records that pertain to the value of that tile. For example, selecting the **Protection Stopped** tile on the **Backup Items** tab filters the grids and charts below to show data for backup items in the Protection Stopped state.
- Tiles that aren't colored aren't selectable.
- Data for the current partial day isn't shown in the reports. So, when the selected value of **Time Range** is **Last 7 days**, the report shows records for the last seven completed days. The current day isn't included.
- The report shows details of jobs (apart from log jobs) that were *triggered* in the selected time range.
- The values shown for **Cloud Storage** and **Protected Instances** are at the *end* of the selected time range.
- The Backup items displayed in the reports are those items that exist at the *end* of the selected time range. Backup items that were deleted in the middle of the selected time range aren't displayed. The same convention applies for Backup policies as well.
- If the selected time range spans a period of 30 days or less, charts are rendered in daily view, where there is one data point for every day. If the time range spans a period greater than 30 days and less than (or equal to) 90 days, charts are rendered in weekly view. For larger time ranges, charts are rendered in monthly view. Aggregating data weekly or monthly helps in better performance of queries and easier readability of data in charts.
- The Policy Adherence grids also follow a similar aggregation logic as described above. However, there are a couple of minor differences. The first difference is that for items with weekly backup policy, there is no daily view (only weekly and monthly views are available). Further more, in the grids for items with weekly backup policy, a 'month' is considered as a 4-week period (28 days), and not 30 days, to eliminate partial weeks from consideration.
