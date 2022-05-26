---
title: Generate an on-demand report from a query in the Audit dashboard in CloudKnox Permissions Management 
description: How to generate an on-demand report from a query in the **Audit** dashboard in CloudKnox Permissions Management.
services: active-directory
author: kenwith
manager: rkarlin
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/23/2022
ms.author: kenwith
---

# Generate an on-demand report from a query

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how you can generate an on-demand report from a query in the **Audit** dashboard in CloudKnox Permissions Management (CloudKnox). You can:

- Run a report on-demand.
- Schedule and run a report as often as you want.
- Share a report with other members of your team and management.

## Generate a custom report on-demand

1. In the CloudKnox home page, select the **Audit** tab.

    CloudKnox displays the query options available to you.
1. In the **Audit** dashboard, select **Search** to run the query.
1. Select **Export**.

    CloudKnox generates the report and exports it in comma-separated values (**CSV**) format, portable document format (**PDF**), or Microsoft Excel Open XML Spreadsheet (**XLSX**) format.

<!---
## Create a schedule to automatically generate and share a report

1. In the **Audit** tab, load the query you want to use to generate your report.
2. Select **Settings** (the gear icon).
3. In **Repeat on**, select on which days of the week you want the report to run.
4. In **Date**, select the date when you want the query to run.
5. In **hh mm** (time), select the time when you want the query to run.
6. In **Request file format**, select the file format you want for your report.
7. In **Share report with people**, enter email addresses for people to whom you want to send the report.
8. Select **Schedule**.

    CloudKnox generates the report as set in Steps 3 to 6, and emails it to the recipients you specified in Step 7.


## Delete the schedule for a report

1. In the **Audit** tab, load the query whose report schedule you want to delete.
2. Select the ellipses menu **(…)** on the far right, and then select **Delete schedule**.

    CloudKnox deletes the schedule for running the query. The query itself isn't deleted.
--->


## Next steps

- For information on how to view how users access information, see [Use queries to see how users access information](cloudknox-ui-audit-trail.md).
- For information on how to filter and view user activity, see [Filter and query user activity](cloudknox-product-audit-trail.md).
- For information on how to create a query,see [Create a custom query](cloudknox-howto-create-custom-queries.md).
