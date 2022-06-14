---
title: Azure Workbooks Overview
description: Learn how workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 05/30/2022
ms.reviewer: gardnerjr 
---

# Azure Workbooks

Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure, and combine them into unified interactive experiences. Workbooks let you combine multiple kinds of visualizations and analyses, making them great for free-form exploration.

Workbooks combine text, [log queries](/azure/data-explorer/kusto/query/), metrics, and parameters into rich interactive reports. 

Workbooks are helpful for scenarios such as:

- 	Exploring the usage of your virtual machine when you don't know the metrics of interest in advance: CPU utilization, disk space, memory, network dependencies, etc.
-	Explaining to your team how a recently provisioned VM is performing, by showing metrics for key counters and other log events.
-	Sharing the results of a resizing experiment of your VM with other members of your team. You can explain the goals for the experiment with text, then show each usage metric and analytics queries used to evaluate the experiment, along with clear call-outs for whether each metric was above or below target.
-	Reporting the impact of an outage on the usage of your VM, combining data, text explanation, and a discussion of next steps to prevent outages in the future.

## The Gallery
The gallery opens listing all the saved workbooks and templates for your workspace, allowing you to easily organize, sort, and manage workbooks of all types.

:::image type="content" source="media/workbooks-overview/workbooks-gallery.png" alt-text="Screenshot of Workbooks gallery.":::
#### Gallery tabs

There are four tabs in the gallery to help organize workbook types.

| Tab              | Description                                       |
|------------------|---------------------------------------------------|
| All | Shows the top four items for each type - workbooks, public templates, and my templates. Workbooks are sorted by modified date so you will see the most recent eight modified workbooks.|
| Workbooks | Shows the list of all the available workbooks that you created or are shared with you. |
| Public Templates | Shows the list of all the available ready to use, get started functional workbook templates published by Microsoft. Grouped by category. |
| My Templates | Shows the list of all the available deployed workbook templates that you created or are shared with you. Grouped by category. |

## Data sources

Workbooks can query data from multiple Azure sources. You can transform this data to provide insights into the availability, performance, usage, and overall health of the underlying components. For example:
- You can analyze performance logs from virtual machines to identify high CPU or low memory instances and display the results as a grid in an interactive report.
- You can combine data from several different sources within a single report. This allows you to create composite resource views or joins across resources enabling richer data and insights that would otherwise be impossible.

See [this article](workbooks-data-sources.md) for detailed information about the supported data sources.
## Visualizations

Workbooks provide a rich set of capabilities for visualizing your data. Each data source and result set support visualizations that are most useful for that data. See [this article](workbooks-visualizations.md) for detailed information about the visualizations.

:::image type="content" source="./media/workbooks-overview/visualizations.png" alt-text="Example of workbook visualizations." border="false" lightbox="./media/workbooks-overview/visualizations.png":::

## Access control

Users must have the appropriate permissions to access to view or edit a workbook. Workbook permissions are based on the permissions the user has for the resources included in the workbooks.

Standard Azure roles that provide the access to workbooks are:
 
- [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader) includes standard /read privileges that would be used by monitoring tools (including workbooks) to read data from resources.

 - [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) includes general `/write` privileges used by various monitoring tools for saving items (including `workbooks/write` privilege to save shared workbooks).
“Workbooks Contributor” adds “workbooks/write” privileges to an object to save shared workbooks.

For custom roles, you must add `microsoft.insights/workbooks/write` to the user's permissions in order to be able to edit and save a workbook. For more details, see the [Workbook Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) role.

## Next steps

 - [Getting started with Azure Workbooks](workbooks-getting-started.md).