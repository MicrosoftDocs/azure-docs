---
title: An overview of workbooks
description: This article provides information on how workbooks provide a flexible canvas for data analysis and the creation of rich visual reports.
ms.service: azure-update-manager
ms.date: 09/18/2023
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# About workbooks

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

Workbooks help you to create visual reports that help in data analysis. This article describes the various features that workbooks offer in Azure Update Manager.

## Key benefits

- Use as a canvas for data analysis and creation of visual reports.
- Access specific metrics from within the reports.
- Create interactive reports with various kinds of visualizations.
- Create, share, and pin workbooks to the dashboard.
- Combine text, log queries, metrics, and parameters to make rich visual reports.

## The gallery

The gallery lists all the saved workbooks and templates for your workspace. You can easily organize, sort, and manage workbooks of all types.

   :::image type="content" source="./media/workbooks/workbooks-gallery.png" alt-text="Screenshot that shows the workbooks gallery.":::

The following four tabs help you organize workbook types.

   | Tab              | Description                                       |
   |------------------|---------------------------------------------------|
   | **All** | Shows the top four items for **Workbooks**, **Public Templates**, and **My Templates**. Workbooks are sorted by modified date, so you see the most recent eight modified workbooks.|
   | **Workbooks** | Shows the list of all the available workbooks that you created or are shared with you. |
   | **Public Templates** | Shows the list of all the available ready-to-use, get-started functional workbook templates published by Microsoft. Grouped by category. |
   | **My Templates** | Shows the list of all the available deployed workbook templates that you created or are shared with you. Grouped by category. |

- On the **Quick start** tile, you can create new workbooks.

  :::image type="content" source="./media/workbooks/quickstart-workbooks.png" alt-text="Screenshot that shows creating a new workbook by using Quick start.":::

- On the **Azure Update Manager** tile, you can view the following summary.
- 
  :::image type="content" source="./media/workbooks/workbooks-summary-inline.png" alt-text="Screenshot that shows a workbook summary." lightbox="./media/workbooks/workbooks-summary-expanded.png":::
 
   - **Machines overall status and configurations**: Provides the status of all machines in a specific subscription.

     :::image type="content" source="./media/workbooks/workbooks-machine-overall-status-inline.png" alt-text="Screenshot that shows the overall status and configuration of machines." lightbox="./media/workbooks/workbooks-machine-overall-status-expanded.png":::

   - **Updates data overview**: Provides a summary of machines that have no updates, assessments, and reboot needed, including the pending Windows and Linux updates by classification and by machine count.

     :::image type="content" source="./media/workbooks/workbooks-machines-updates-status-inline.png" alt-text="Screenshot that shows a summary of machines that have no updates and assessments needed." lightbox="./media/workbooks/workbooks-machines-updates-status-expanded.png":::
      
   - **Schedules/Maintenance configurations**: Provides a summary of schedules, maintenance configurations, and a list of machines attached to the schedule. You can also access the maintenance configuration overview page from this section.
   
     :::image type="content" source="./media/workbooks/workbooks-schedules-maintenance-inline.png" alt-text="Screenshot that shows a summary of schedules and maintenance configurations." lightbox="./media/workbooks/workbooks-schedules-maintenance-expanded.png":::

   - **History of installation runs**: Provides a history of machines and maintenance runs.

     :::image type="content" source="./media/workbooks/workbooks-history-installation-inline.png" alt-text="Screenshot that shows a history of installation runs." lightbox="./media/workbooks/workbooks-history-installation-expanded.png":::

For information on how to use the workbooks for customized reporting, see [Edit a workbook](manage-workbooks.md#edit-a-workbook).

## Next steps

 To learn how to deploy updates to your machines to maintain security compliance, see [Deploy updates](deploy-updates.md).
