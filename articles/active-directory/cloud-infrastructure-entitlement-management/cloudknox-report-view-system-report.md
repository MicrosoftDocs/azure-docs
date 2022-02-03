---
title: Generate and view a system report in CloudKnox Permissions Management
description: How to generate and view a system report in the CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# Generate and view a system report

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how to generate and view a system report in CloudKnox Permissions Management (CloudKnox).

## Generate a system report  

1. In the CloudKnox home page, select the **Reports** tab, and then select the **Systems reports** subtab.
    The **Systems Reports** subtab displays the following options in the **Reports** table:

    - **Report Name**: The name of the report.
    - **Category**: The type of report: **Permission** or **Compliance**.
    - **Authorization System**: The authorization system in which you can view the report: Amazon Web Services (AWS), Microsoft Azure (Azure), and Google Cloud Platform (GCP).
    - **Format**: The format of the report.

1. In the **Report Name** column, find the report you want, and then select the down arrow to the right of the report name to download the report.

    The following message displays: **Successfully started to generate on demand report.**

    > [!NOTE]
    > If you select one authorization system, the report includes a summary. If you select more than one authorization system, the report does not include a summary.

1. To download a report, from the ellipses **(...)** menu, select **Download**.
1. To refresh the list of reports, select **Reload**.

## Search for a system report 

1. On the **Systems Reports** tab, select **Search**.
2. In the **Search** box, enter the name of the report you want.

    The **Systems Reports** tab displays a list of reports that match your search criteria. 
3. Select a report from the **Report Name** column.
4. To download a report, from the ellipses **(...)** menu, select **Download**.
5. To refresh the list of reports, select **Reload**.


## Next steps

- For a brief overview of available system reports, see [View an overview of available system report types](cloudknox-product-reports.md).
- For a detailed overview of available system reports, see [View a list and description of system reports](cloudknox-all-reports.md).
- For information about how to create and view a custom report, see [Generate and view a custom report](cloudknox-report-create-custom-report.md).
- For information about how to create and view the Permissions analytics report, see [Generate and download the Permissions analytics report](cloudknox-product-permissions-analytics-reports.md).