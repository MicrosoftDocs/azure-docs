---
title: An overview of Workbooks
description: This article provides information on how workbooks provide a flexible canvas for data analysis and the creation of rich visual reports.
ms.service: update-management-center
ms.date: 01/16/2023
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# About Workbooks

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

Workbooks help you to create visual reports that help in data analysis. This article describes the various features that Workbooks offer in Update management center (preview). 

## Key benefits
- Provides a canvas for data analysis and creation of visual reports
- Access specific metrics from within the reports
- Create interactive reports with various kinds of visualizations.
- Create, share, and pin workbooks to the dashboard.
- Combine text, log queries, metrics, and parameters to make rich visual reports. 

## The gallery

The gallery lists all the saved workbooks and templates for your workspace. You can easily organize, sort, and manage workbooks of all types.

   :::image type="content" source="./media/workbooks/workbooks-gallery.png" alt-text="Screenshot of workbooks gallery.":::

- It comprises of the following four tabs that help you organize workbook types:

   | Tab              | Description                                       |
   |------------------|---------------------------------------------------|
   | All | Shows the top four items for workbooks, public templates, and my templates. Workbooks are sorted by modified date, so you'll see the most recent eight modified workbooks.|
   | Workbooks | Shows the list of all the available workbooks that you created or are shared with you. |
   | Public Templates | Shows the list of all the available ready to use, get started functional workbook templates published by Microsoft. Grouped by category. |
   | My Templates | Shows the list of all the available deployed workbook templates that you created or are shared with you. Grouped by category. |

- In the **Quick start** tile, you can create new workbooks.
  :::image type="content" source="./media/workbooks/quickstart-workbooks.png" alt-text="Screenshot of creating a new workbook using Quick start.":::

- In the **Recently modified** tile, you can view and edit the workbooks.

- In the **Update management center** tile, you can view the following summary:
  :::image type="content" source="./media/workbooks/workbooks-summary-inline.png" alt-text="Screenshot of workbook summary." lightbox="./media/workbooks/workbooks-summary-expanded.png":::
 

   - **Machines overall status and configurations** - provides the status of all machines in a specific subscription.

   :::image type="content" source="./media/workbooks/workbooks-machine-overall-status-inline.png" alt-text="Screenshot of the overall status and configuration of machines." lightbox="./media/workbooks/workbooks-machine-overall-status-expanded.png":::

   - **Updates data overview** - provides a summary of machines that have no updates, assessments and reboot needed including the pending Windows and Linux updates by classification and by machine count.

  :::image type="content" source="./media/workbooks/workbooks-machines-updates-status-inline.png" alt-text="Screenshot of summary of machines that no updates, and assessments." lightbox="./media/workbooks/workbooks-machines-updates-status-expanded.png":::
      
   - **Schedules/maintenance configurations** - provides a summary of schedules, maintenance configurations and list of machines attached to the schedule. You can also access the maintenance configuration overview page from this section.
   
   :::image type="content" source="./media/workbooks/workbooks-schedules-maintenance-inline.png" alt-text="Screenshot of summary of schedules and maintenance configurations." lightbox="./media/workbooks/workbooks-schedules-maintenance-expanded.png":::

   - **History of installation runs** - provides a history of machines and maintenance runs.
    :::image type="content" source="./media/workbooks/workbooks-history-installation-inline.png" alt-text="Screenshot of history of installation runs." lightbox="./media/workbooks/workbooks-history-installation-expanded.png":::

For information on how to use the workbooks for customized reporting, see [Edit a workbook](manage-workbooks.md#edit-a-workbook).

## Next steps

 Learn about deploying updates to your machines to maintain security compliance by reading [deploy updates](deploy-updates.md)