---
title: View and download the Permissions Analytics Report in Permissions Management
description: How to view and download the Permissions Analytics Report in Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 10/04/2023
ms.author: jfields
---

# View and download the Permissions analytics report

This article describes how to view and download the **Permissions analytics report** in Permissions Management for AWS, Azure, and GPC authorization systems.

>[!NOTE]
>The Permissions analytics report can be downloaded in Excel and PDF formats.

## View the Permissions Analytics Report in the Permissions Management UI

You can view the Permissions Analytics Report information directly in the Permissions Management UI.

1. In Permissions Management, select **Reports** in the navigation menu.
2. Locate the **Permissions Analytics Report** in the list, then select it.
3. View detailed report information from the list of categories that are displayed.
   >[!NOTE]
   > Categories will vary depending on which Authorization System you are viewing.

4. To view more detailed information into each category, select the drop-down arrow next to the category name.


## Download the Permissions Analytics Report in Excel format

1. From the Permissions Management home page, select the **Reports** tab, then select the **Systems Reports** subtab.
    
    The **Systems Reports** subtab displays a list of report names in the **Reports** table.
2. Locate the **Permissions Analytics Report** in the list.
3. To download the report in Excel format, click on the ellipses **(...)**, the select **Generate & Download**.
    
    The Permissions Analytics Report screen is displayed.
4. Click on **Report Format** and make sure that **XLSX** is selected.
5. Click on **Schedule** and, if you want to download this report regularly, select the frequency for which you want it downloaded. You can also leave this at the default setting of **None**.
6. Click on **Authorization Systems** and select which system you want to download the report for (AWS, Azure, or GCP).
   >[!NOTE]
   > To download a report for all Authorization Systems, check the **Collate** box. This will combine all selected Authorization Systems into one report.
7. Click **Save**

    The following message displays: **Report has been created**.

    Once the Excel file is generated, the report is automatically sent to your email.

## Download the Permissions Analytics Report in PDF format

1. From the Permissions Management home page, select the **Reports** tab, then select the **Systems Reports** subtab.
    
    The **Systems Reports** subtab displays a list of reports names in the **Reports** table.
2. Locate the **Permissions Analytics Report** in the list, then select it.
3. Select which Authorization System you want to generate the PDF download for (AWS, Azure, or GCP).
   >[!NOTE]
   > (Preview) You can download a PDF report for up to 10 authorization systems at one time. The authorization systems must be part of the same cloud environment (for example, 1- 10 authorization systems that are all on Amazon Web Service (AWS)). 
    
    The following message displays: **Successfully started to generate PDF report**. 
    
    Once the PDF is generated, the report(s) is automatically sent to your email.


<!---## Add and remove tags in the Permissions analytics report

1. Select **Tags**.
1. Select one of the categories from the **Permissions Analytics Report**.
1. Select the identity name to which you want to add a tag. Then, select the checkbox at the top to select all identities.
1. Select **Add Tag**.
1. In the **Tag** column:
    - To select from the available options from the list, select **Select a Tag**.
    - To search for a tag, enter the tag name.
    - To create a new custom tag, select  **New Custom Tag**.
    - To create a new tag, enter a name for the tag and select **Create**.
    - To remove a tag, select **Delete**.

1. In the **Value (optional)** box, enter a value, if necessary.
1. Select **Save**.--->

## Next steps

- For information on how to view system reports in the **Reports** dashboard, see [View system reports in the Reports dashboard](product-reports.md).
- For a detailed overview of available system reports, see [View a list and description of system reports](all-reports.md).
- For information about how to generate and view a system report, see [Generate and view a system report](report-view-system-report.md).
- For information about how to create, view, and share a system report, see [Create, view, and share a custom report](report-view-system-report.md).
