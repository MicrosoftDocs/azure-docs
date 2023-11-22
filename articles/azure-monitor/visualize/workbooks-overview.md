---
title: Azure Workbooks overview
description: Learn how workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 06/21/2023
ms.reviewer: gardnerjr 
---

# Azure Workbooks

Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure and combine them into unified interactive experiences. Workbooks let you combine multiple kinds of visualizations and analyses, making them great for freeform exploration.

Workbooks combine text, [log queries](/azure/data-explorer/kusto/query/), metrics, and parameters into rich interactive reports.

Workbooks are helpful for scenarios such as:

- Exploring the usage of your virtual machine when you don't know the metrics of interest in advance. You can discover metrics for CPU utilization, disk space, memory, and network dependencies.
- Explaining to your team how a recently provisioned VM is performing. You can show metrics for key counters and other log events.
- Sharing the results of a resizing experiment of your VM with other members of your team. You can explain the goals for the experiment with text. Then you can show each usage metric and the analytics queries used to evaluate the experiment, along with clear call-outs for whether each metric was above or below target.
- Reporting the impact of an outage on the usage of your VM. You can combine data, text explanation, and a discussion of next steps to prevent outages in the future.

Watch this video to see how you can use Azure Workbooks to get insights and visualize your data.
> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE5a1su]

## The gallery

The gallery lists all the saved workbooks and templates in your current environment. Select “Browse across galleries” to see the workbooks for all your resources.

:::image type="content" source="media/workbooks-overview/workbooks-gallery.png" alt-text="Screenshot that shows the Workbooks gallery.":::

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

For more information about the supported data sources, see [Azure Workbooks data sources](workbooks-data-sources.md).

## Visualizations

Workbooks provide a rich set of capabilities for visualizing your data. Each data source and result set support visualizations that are most useful for that data. For more information about the visualizations, see [Workbook visualizations](workbooks-visualizations.md).

:::image type="content" source="./media/workbooks-overview/visualizations.png" alt-text="Screenshot that shows an example of workbook visualizations." border="false" lightbox="./media/workbooks-overview/visualizations.png":::

## Access control

Users must have the appropriate permissions to view or edit a workbook. Workbook permissions are based on the permissions the user has for the resources included in the workbooks.

Standard Azure roles that provide access to workbooks:

- [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader) includes standard `/read` privileges that would be used by monitoring tools (including workbooks) to read data from resources.
 - [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) includes general `/write` privileges used by various monitoring tools for saving items (including `workbooks/write` privilege to save shared workbooks). Workbooks Contributor adds `workbooks/write` privileges to an object to save shared workbooks.

For custom roles, you must add `microsoft.insights/workbooks/write` to the user's permissions to edit and save a workbook. For more information, see the [Workbook Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) role.

## Next steps

[Get started with Azure Workbooks](workbooks-getting-started.md)
