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

Using workbooks you can view:
- Machines overall status and configurations - provides the status of all machines in a specific subscription
- Updates data overview - provides a summary of machines that have no updates, assessments and reboot needed.
- Schedules/maintenance configurations - provides a summary of schedules, maintenance configurations and list of machines attached to the schedule. You can also access the maintenance configuration overview page from this section.
- History of installation runs - provides a history of machines and maintenance runs.


## The gallery

The gallery lists all the saved workbooks and templates for your workspace. You can easily organize, sort, and manage workbooks of all types.


#### Gallery tabs

There are four tabs in the gallery to help organize workbook types.

| Tab              | Description                                       |
|------------------|---------------------------------------------------|
| All | Shows the top four items for workbooks, public templates, and my templates. Workbooks are sorted by modified date, so you'll see the most recent eight modified workbooks.|
| Workbooks | Shows the list of all the available workbooks that you created or are shared with you. |
| Public Templates | Shows the list of all the available ready to use, get started functional workbook templates published by Microsoft. Grouped by category. |
| My Templates | Shows the list of all the available deployed workbook templates that you created or are shared with you. Grouped by category. |

## Data sources

Workbooks can query data from multiple Azure sources. You can transform this data to provide insights into the availability, performance, usage, and overall health of the underlying components. For example, you can:

- Analyze performance logs from virtual machines to identify high CPU or low memory instances and display the results as a grid in an interactive report.
- Combine data from several different sources within a single report. You can create composite resource views or joins across resources to gain richer data and insights that would otherwise be impossible.


## Next steps

 Learn about deploying updates to your machines to maintain security compliance by reading [deploy updates](deploy-updates.md)