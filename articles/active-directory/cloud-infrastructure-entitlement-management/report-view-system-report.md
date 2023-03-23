---
title: Generate and view a system report in Permissions Management
description: How to generate and view a system report in the Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/23/2022
ms.author: jfields
---

# Generate and view a system report

This article describes how to generate and view a system report in Permissions Management.

## Generate a system report

1. In the Permissions Management home page, select the **Reports** tab, and then select the **Systems Reports** subtab.
    The **Systems Reports** subtab displays the following options in the **Reports** table:

    - **Report Name**: The name of the report.
    - **Category**: The type of report: **Permission**.
    - **Authorization System**: The authorization system activity in the report: Amazon Web Services (AWS), Microsoft Azure (Azure), and Google Cloud Platform (GCP).
    - **Format**: The format in which the report is available: comma-separated values (**CSV**) format, portable document format (**PDF**), or Microsoft Excel Open XML Spreadsheet (**XLSX**) format.

1. In the **Report Name** column, find the report you want, and then select the down arrow to the right of the report name to download the report.

    Or, from the ellipses **(...)** menu, select **Download**.

    The following message displays: **Successfully Started To Generate On Demand Report.**

    > [!NOTE]
    > If you select one authorization system, the report includes a summary. If you select more than one authorization system, the report does not include a summary.

1. To refresh the list of reports, select **Reload**.

## Search for a system report

1. On the **Systems Reports** subtab, select **Search**.
1. In the **Search** box, enter the name of the report you want.

    The **Systems Reports** subtab displays a list of reports that match your search criteria.
1. Select a report from the **Report Name** column.
1. To download a report, select the down arrow to the right of the report name, or from the ellipses **(...)** menu, select **Download**.
1. To refresh the list of reports, select **Reload**.


## Next steps

- For information on how to view system reports in the **Reports** dashboard, see [View system reports in the Reports dashboard](product-reports.md).
- For a detailed overview of available system reports, see [View a list and description of system reports](all-reports.md).
- For information about how to create, view, and share a system report, see [Create, view, and share a custom report](report-view-system-report.md).
- For information about how to create and view the Permissions analytics report, see [Generate and download the Permissions analytics report](product-permissions-analytics-reports.md).
