---
title: An overview of Workbooks
description: This article provides information on how workbooks provide a flexible canvas for data analysis and the creation of rich visual reports.
ms.service: update-management-center
ms.date: 04/21/2022
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# About Workbooks

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

Workbooks help you to create visual reports that help in data analysis. This article describes the various features of that Workbooks offer in Update management center (preview). 

## Key benefits
- Provides a canvas for data analysis and creation of visual reports
- Access specific metrics from within the reports
- Create interactive reports with various kinds of visualizations.
- Create, share, and pin workbooks to the dashboard.
- Combine text, log queries, metrics, and parameters to make rich visual reports. 

## The gallery

The gallery lists all the saved workbooks and templates for your workspace. You can easily organize, sort, and manage workbooks of all types.

   :::image type="content" source="./media/workbooks/workbooks-gallery.png" alt-text="Screenshot of workbooks gallery":::

- It comprises of the following four tabs that help you organize workbook types:

   | Tab              | Description                                       |
   |------------------|---------------------------------------------------|
   | All | Shows the top four items for workbooks, public templates, and my templates. Workbooks are sorted by modified date, so you'll see the most recent eight modified workbooks.|
   | Workbooks | Shows the list of all the available workbooks that you created or are shared with you. |
   | Public Templates | Shows the list of all the available ready to use, get started functional workbook templates published by Microsoft. Grouped by category. |
   | My Templates | Shows the list of all the available deployed workbook templates that you created or are shared with you. Grouped by category. |

- In the **Quick start** tile, you can create new workbooks.
- In the **Recently modified** tile, you can view and edit the workbooks.
- In the **Update management center** tile, you can view the following summary:
   - **Machines overall status and configurations** - provides the status of all machines in a specific subscription
   - **Updates data overview** - provides a summary of machines that have no updates, assessments and reboot needed including the pending Windows and Linux updates by classification and by machine count.
   - **Schedules/maintenance configurations** - provides a summary of schedules, maintenance configurations and list of machines attached to the schedule. You can also access the maintenance configuration overview page from this section.
   - **History of installation runs** - provides a history of machines and maintenance runs.
    
     :::image type="content" source="./media/workbooks/workbooks-summary-inline.png" alt-text="Screenshot of workbook summary." lightbox="./media/workbooks/workbooks-summary-expanded.png":::


## Next steps

 Learn about deploying updates to your machines to maintain security compliance by reading [deploy updates](deploy-updates.md)