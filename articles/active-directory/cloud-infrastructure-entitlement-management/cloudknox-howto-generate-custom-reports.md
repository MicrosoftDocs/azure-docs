---
title: Microsoft CloudKnox Permissions Management Sentry - Generate custom reports in the Audit Trail dashboard 
description: Microsoft CloudKnox Permissions Management Sentry - Generate custom reports in the Audit Trail dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/28/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - Generate custom reports in the Audit Trail dashboard

This topic describes how you can use the Audit Trail dashboard to generate custom reports that you can:

- Run on demand.
- Schedule and run as often as you want.
- Share with other members of your team and management.

## Open the Audit Trail dashboard

- In CloudKnox, select the **Audit Trail** tab.

    CloudKnox displays the query options available to you.

## Generate a custom report on-demand

1. In the **Audit Trail** tab, load the query you want to use to generate a report.
2. Select **Download**.

    CloudKnox generates the report and displays it on the screen.

## Create a schedule to automatically generate and share a report

1. In the **Audit Trail** tab, load the query you want to use to generate your report.
2. Select **Settings** (the gear icon).
3. In **Repeat On**, select on which days of the week you want the report to run.
4. In **Date**, select the date when you want the query to run.
5. In **hh mm** (time), select the time when you want the query to run.
6. In **Request File Format**, select the file format you want for your report.
7. In **Share Report with People**, enter email addresses for people to whom you want to send the report.
8. Select **Schedule**.

    CloudKnox generates the report as set in Steps 3 to 6, and emails it to the recipients you specified in Step 7.

## Delete the schedule for a report

1. In the **Audit Trail** tab, load the query whose report schedule you want to delete.
2. Select the ellipses menu **(…)** on the far right, and then select **Delete Schedule**.

    CloudKnox deletes the schedule for running the query. The query itself isn't deleted.

<!---## Next steps--->
<!---Use the Audit Trail dashboard to generate create queries--->