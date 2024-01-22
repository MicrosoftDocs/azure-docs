---
title: "Convert dashboards to Azure Monitor Workbooks | Microsoft Docs"
description: Learn how to review, planning and migrate your current workbooks to Azure Workbooks.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Convert dashboards to Azure Workbooks 

Dashboards in your existing SIEM will convert to [Azure Monitor Workbooks](monitor-your-data.md), the Microsoft Sentinel adoption of Azure Monitor Workbooks, which provides versatility in creating custom dashboards.

This article describes how to review, plan, and convert your current workbooks to Azure Monitor Workbooks.

## Review dashboards in your current SIEM

 Review these considerations when designing your migration.

- **Discover dashboards**. Gather information about your dashboards, including design, parameters, data sources, and other details. Identify the purpose or usage of each dashboard.
- **Select**. Don’t migrate all dashboards without consideration. Focus on dashboards that are critical and used regularly.
- **Consider permissions**. Consider who are the target users for workbooks. Microsoft Sentinel uses Azure Workbooks, and [access is controlled](../azure-monitor/visualize/workbooks-overview.md#access-control) using Azure Role Based Access Control (RBAC). To create dashboards outside Azure, for example for business execs without Azure access, using a reporting tool such as Power BI.

## Prepare for the dashboard conversion

After reviewing your dashboards, do the following to prepare for your dashboard migration:

- Review all of the visualizations in each dashboard. The dashboards in your current SIEM might contain several charts or panels. It's crucial to review the content of your short-listed dashboards to eliminate any unwanted visualizations or data.
- Capture the dashboard design and interactivity.
- Identify any design elements that are important to your users. For example, the layout of the dashboard, the arrangement of the charts or even the font size or color of the graphs.
- Capture any interactivity such as drilldown, filtering, and others that you need to carry over to Azure Monitor Workbooks. 
- Identify required parameters or user inputs. In most cases, you need to define parameters for users to perform search, filtering, or scoping the results (for example, date range, account name and others). Hence, it's crucial to capture the details around parameters. Here are some of the key points to help you with collecting the parameter requirements:
    - The type of parameter for users to perform selection or input. For example, date range, text, or others.
    - How the parameters are represented, such as drop-down, text box, or others.
    - The expected value format, for example, time, string, integer, or others.
    - Other properties, such as the default value, allow multi-select, conditional visibility, or others.

## Convert dashboards

Perform the following tasks in Azure Workbook and Microsoft Sentinel to convert your dashboard.

#### 1. Identify data sources

Azure Monitor workbooks are [compatible with a large number of data sources](../azure-monitor/visualize/workbooks-data-sources.md). In most cases, use the Azure Monitor Logs data source and use Kusto Query Language (KQL) queries to visualize the underlying logs in your Microsoft Sentinel workspace.

#### 2. Construct or review KQL queries

In this step, you mainly work with KQL to visualize your data. You can construct and test your queries in the Microsoft Sentinel Logs page before converting them to Azure Monitor workbooks. Before finalizing your KQL queries, always review and tune the queries to improve query performance. Optimized queries:
- Run faster, reduce the overall duration of the query execution.
- Have a smaller chance of being throttled or rejected.

Learn how to optimize KQL queries:
- [KQL query best practices](/azure/data-explorer/kusto/query/best-practices)
- [Optimize queries in Azure Monitor Logs](../azure-monitor/logs/query-optimization.md)
- [Optimizing KQL performance (webinar)](https://youtu.be/jN1Cz0JcLYU) 

#### 3. Create or update the workbook

[Create](tutorial-monitor-your-data.md#create-new-workbook) a workbook, update the workbook, or clone an existing workbook so that you don’t have to start from scratch. Also, specify how the data or visualizations will be represented, arranged and [grouped](../azure-monitor/visualize/workbooks-groups.md). There are two common designs:

- Vertical workbook
- Tabbed workbook

#### 4. Create or update workbook parameters or user inputs

By the time you arrive at this stage, you should have [identified the required parameters](#prepare-for-the-dashboard-conversion). With parameters, you can collect input from the consumers and reference the input in other parts of the workbook. This input is typically used to scope the result set, to set the correct visualization, and allows you to build interactive reports and experiences.

Workbooks allow you to control how your parameter controls are presented to consumers. For example, you select whether the controls are presented as a text box vs. drop down, or single- vs. multi-select. You can also select which values to use, from text, JSON, KQL, or Azure Resource Graph, and more.

Review the [supported workbook parameters](../azure-monitor/visualize/workbooks-parameters.md). You can reference these parameter values in other parts of workbooks either via bindings or value expansions.

#### 5.	Create or update visualizations

Workbooks provide a rich set of capabilities for visualizing your data. Review these detailed examples of each visualization type.

- [Text](../azure-monitor/visualize/workbooks-text-visualizations.md)
- [Charts](../azure-monitor/visualize/workbooks-chart-visualizations.md)
- [Grids](../azure-monitor/visualize/workbooks-grid-visualizations.md)
- [Tiles](../azure-monitor/visualize/workbooks-tile-visualizations.md)
- [Trees](../azure-monitor/visualize/workbooks-tree-visualizations.md)
- [Graphs](../azure-monitor/visualize/workbooks-graph-visualizations.md)
- [Map](../azure-monitor/visualize/workbooks-map-visualizations.md)
- [Honey comb](../azure-monitor/visualize/workbooks-honey-comb.md)
- [Composite bar](../azure-monitor/visualize/workbooks-composite-bar.md)

#### 6.	Preview and save the workbook

Once you've saved your workbook, specify the parameters, if any exist, and validate the results. You can also try the [auto refresh](tutorial-monitor-your-data.md#refresh-your-workbook-data) or the print feature to [save as a PDF](monitor-your-data.md#print-a-workbook-or-save-as-pdf).

## Next steps

In this article, you learned how to convert your dashboards to Azure workbooks. 

> [!div class="nextstepaction"]
> [Update SOC processes](migration-security-operations-center-processes.md)
