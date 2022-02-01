---
title: Generate and view a custom report in Microsoft CloudKnox Permissions Management
description: How to generate and view a custom report in the Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/31/2022
ms.author: v-ydequadros
---

# Generate and view a custom report

This article describes how to generate and view a custom report in Microsoft CloudKnox Permissions Management (CloudKnox).

## Generate a custom report 

1. In the CloudKnox home page, select the **Reports** tab, and then select the **Custom reports** subtab.
1. Select **New Custom Report**.
1. In the **New Custom Report** box, enter a name for your report.
1. From the **Report Based on** list, make a selection from the list of reports.
    1. To view which authorization systems the report applies to, hover over each report option.
    1. To view a description of the report, select a report.
1. Select **Next**.
1. In the **MyReport** box, select the **Authorization system** you want: Amazon Web Services (**AWS**), Microsoft Azure (**Azure**), or Google Cloud Platform (**GCP**).

1. To add specific accounts, select the **List** subtab, and then select **All** or the account names.
1. To add specific folders, select the **Folders** subtab, and then select **All** or the folder names.

1. Select the **Report Format** subtab and select the format for your report: comma-separated values (**CSV**) file, portable document format (**PDF**), or Microsoft Excel Open XML Spreadsheet (**XLSX**) file.
1. Select the **Schedule** tab and choose a frequency from **None** up to **Monthly**.

	- For **Hourly** and **Daily** options, set the start date by choosing from the **Calendar** dropdown, and can input a specific time of the day they want to receive the report. 

    In addition to date and time, the **Weekly** and **Biweekly** provide options for you to select on which day(s)of the week the report should repeat.

9. Select **Save**.

      The following message displays across the top of the screen in green if the download is successful: **Report has been created**.
The report name appears in the **Reports** table.


## View a custom report 

1. To view a list of custom reports, select **Reports**, and then select the **Custom Reports** tab.

    The **Custom Reports** tab displays the following options in the **Reports** table:

    - **Report Name** - The name of the report.
    - **Category** - The type of report: **Permission** or **Compliance**.
    - **Authorization System** - The authorization system in which you can view the report: Amazon Web Services (AWS), Microsoft Azure (Azure), and Google Cloud Platform (GCP).
    - **Format** - The format of the report.

2. To view a report, from the **Report Name** column, select the report you want.
3. To download a report, from the ellipses **(...)** menu, select **Download**.
4. To refresh the list of reports, select **Reload**.

## Search for a custom report 

1. On the **Custom Reports** tab, select **Search**.
2. In the **Search** box, enter the name of the report you want.

    The **Custom Reports** tab displays a list of reports that match your search criteria. 
3. Select the report you want.
4. To download a report, from the ellipses **(...)** menu, select **Download**.
5. To refresh the list of reports, select **Reload**.


## Modify a saved or scheduled custom report

1. Hover over the report name on the **Custom Reports** tab.

	- To rename the report. select the **Pencil** icon and enter a new name.

	- To update the report settings, select the **Gear** icon.

		 Select this option to return to the Report interface as described in creating a new custom report. You can make any necessary updates and save the changes.

	- To download a copy of the report, select the **Down arrow** icon.
2. To perform actions to the report and select from the following options, select the ellipses (**...**) icon:

	 Reports not created by the current user are listed as **Duplicate**.

	- **Download** - Downloads a copy of the report.

	- **Report Settings** - Displays the settings on the report, including scheduling, authorization system type, and so on.

	- **Duplicate** - Creates a duplicate of the report called **"Copy of XXX"**

		 After selecting **Duplicate**, a pop-up box appears asking if the user is sure they want to create a duplicate. Select **Confirm**.

         **Report generated successfully** appears across the top of the screen in green if successfully duplicated.

	- **API Settings** - Download the report using API.

		 When this option is selected, **API Settings** window opens and displays **Report ID** and **Secret Key**. Select **Generate New Key**.

	- **Delete** - Select this option to delete the report.

		 After selecting **Delete**, a pop-up box appears asking if the user is sure they want to delete the report. Select **Confirm**. 

        **Report is deleted successfully** appears across the top of the screen in green if successfully deleted.

	- **Unsubscribe** - Unsubscribe the user from receiving scheduled reports and notifications.

		 This option is only available after a report has been scheduled.


## Next steps

- For a brief overview of available system reports, see [View an overview of available system report types](cloudknox-product-reports.md).
- For a detailed overview of available system reports, see [View a list and description of system reports](cloudknox-all-reports.md).
- For information about how to generate and view a system report, see [Generate and view a system report](cloudknox-report-view-system-report.md).
- For information about how to create and view the Permissions analytics report, see [Generate and download the Permissions analytics report](cloudknox-product-permissions-analytics-reports.md).