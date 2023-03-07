---
title: Create, view, and share a custom report a custom report in Permissions Management
description: How to create, view, and share a custom report in the Permissions Management.
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

# Create, view, and share a custom report

This article describes how to create, view, and share a custom report in Permissions Management.

## Create a custom report

1. In the Permissions Management home page, select the **Reports** tab, and then select the **Custom Reports** subtab.
1. Select **New Custom Report**.
1. In the **Report Name** box, enter a name for your report.
1. From the **Report Based on** list:
    1. To view which authorization systems the report applies to, hover over each report name.
    1. To view a description of a report, select the report.
1. Select a report you want to use as the base for your custom report, and then select **Next**.
1. In the **MyReport** box, select the **Authorization System** you want: Amazon Web Services (**AWS**), Microsoft Azure (**Azure**), or Google Cloud Platform (**GCP**).

1. To add specific accounts, select the **List** subtab, and then select **All** or the account names.
1. To add specific folders, select the **Folders** subtab, and then select **All** or the folder names.

1. Select the **Report Format** subtab, and then select the format for your report: comma-separated values (**CSV**) file, portable document format (**PDF**), or Microsoft Excel Open XML Spreadsheet (**XLSX**) file.
1. Select the **Schedule** tab, and then select the frequency for your report, from **None** up to **Monthly**.

    - For **Hourly** and **Daily** options, set the start date by choosing from the **Calendar** dropdown, and can input a specific time of the day they want to receive the report.

    In addition to date and time, the **Weekly** and **Biweekly** provide options for you to select on which day(s)of the week the report should repeat.

1. Select **Save**.

      The following message displays across the top of the screen in green if the download is successful: **Report has been created**.
The report name appears in the **Reports** table.

## View a custom report

1. In the Permissions Management home page, select the **Reports** tab, and then select the **Custom Reports** subtab.

    The **Custom Reports** tab displays the following information in the **Reports** table:

    - **Report Name**: The name of the report.
    - **Category**: The type of report: **Permission**.
    - **Authorization System**: The authorization system in which you can view the report: AWS, Azure, and GCP.
    - **Format**: The format of the report, **CSV**, **PDF**, or **XLSX** format.

1. To view a report, from the **Report Name** column, select the report you want.
1. To download a report, select the down arrow to the right of the report name, or from the ellipses **(...)** menu, select **Download**.
1. To refresh the list of reports, select **Reload**.

## Share a custom report

1. In the Permissions Management home page, select the **Reports** tab, and then select the **Custom Reports** subtab.
1. In the **Reports** table, select a report and then select the ellipses (**...**) icon.
1. In the **Report Settings** box, select **Share with**.
1. In the **Search Email to add** box, enter the name of other Permissions Management user(s).

    You can only share reports with other Permissions Management users.
1. Select **Save**.

## Search for a custom report

1. In the Permissions Management home page, select the **Reports** tab, and then select the **Custom Reports** subtab.
1. On the **Custom Reports** tab, select **Search**.
1. In the **Search** box, enter the name of the report you want.

    The **Custom Reports** tab displays a list of reports that match your search criteria.
1. Select the report you want.
1. To download a report, select the down arrow to the right of the report name, or from the ellipses **(...)** menu, select **Download**.
1. To refresh the list of reports, select **Reload**.


## Modify a saved or scheduled custom report

1. In the Permissions Management home page, select the **Reports** tab, and then select the **Custom Reports** subtab.
1. Hover over the report name on the **Custom Reports** tab.

    - To rename the report, select **Edit** (the pencil icon), and enter a new name.
    - To change the settings for your report, select **Settings** (the gear icon). Make your changes, and then select **Save**.

    - To download a copy of the report, select the **Down arrow** icon.

1. To perform other actions to the report, select the ellipses (**...**) icon:

    - **Download**: Downloads a copy of the report.

    - **Report Settings**: Displays the settings for the report, including scheduling, sharing the report, and so on.

    - **Duplicate**: Creates a duplicate of the report called **"Copy of XXX"**. Any reports not created by the current user are listed as **Duplicate**.

         When you select **Duplicate**, a box appears asking if you're sure you want to create a duplicate. Select **Confirm**.

         When the report is successfully duplicated, the following message displays: **Report generated successfully**.

    - **API Settings**: Download the report using your Application Programming Interface (API) settings.

         When this option is selected, the **API Settings** window opens and displays the **Report ID** and **Secret Key**. Select **Generate New Key**.

    - **Delete**: Select this option to delete the report.

         After selecting **Delete**, a pop-up box appears asking if the user is sure they want to delete the report. Select **Confirm**.

        **Report is deleted successfully** appears across the top of the screen in green if successfully deleted.

    - **Unsubscribe**: Unsubscribe the user from receiving scheduled reports and notifications.

         This option is only available after a report has been scheduled.


## Next steps

- For information on how to view system reports in the **Reports** dashboard, see [View system reports in the Reports dashboard](product-reports.md).
- For a detailed overview of available system reports, see [View a list and description of system reports](all-reports.md).
- For information about how to generate and view a system report, see [Generate and view a system report](report-view-system-report.md).
- For information about how to create and view the Permissions analytics report, see [Generate and download the Permissions analytics report](product-permissions-analytics-reports.md).
