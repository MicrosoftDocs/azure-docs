---
title: Convert dashboards to Azure Monitor Workbooks | Microsoft Docs
description: Learn how to review, planning and migrate your current workbooks to Azure Workbooks.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Convert dashboards to Azure Workbooks 

Dashboards in your existing SIEM will convert to [Azure Monitor Workbooks](monitor-your-data#use-built-in-workbooks.md), the Microsoft Sentinel adoption of Azure Monitor Workbooks, which provides versatility in creating custom dashboards.

This article describes how to review, plan, and convert your current workbooks to Azure Monitor Workbooks.

## Review dashboards in your current SIEM

 Consider the following when designing your migration.

- **Discover dashboards**. Gather information about your dashboards, including design, parameters, data sources, and other details. Identity the purpose or usage of each dashboard.
- **Select**. Don’t migrate all dashboards without consideration. Focus on dashboards that are critical and used regularly.
- **Consider permissions**. Consider who are the target users for workbooks. Microsoft Sentinel uses Azure Workbooks, and [access is controlled](../azure-monitor/visualize/workbooks-access-control.md) using Azure Role Based Access Control (RBAC). To create dashboards outside Azure, for example for business execs without Azure access, using a reporting tool such as PowerBI.

## Prepare for the dashboard conversion

After reviewing your dashboards, do the following to prepare for your dashboard migration:

1.	Review all of the visualizations in each dashboard. The dashboards in your current SIEM might contain several charts or panels. It is crucial to review the content of your short-listed dashboards to eliminate any unwanted visualizations or data.
2.	Capture the dashboard design and interactivity.
3.	Identify any design elements that are important to your users. For example, the layout of the dashboard, the arrangement of the charts or even the font size or color of the graphs.
4.	Capture any interactivity such as drilldown, filtering, and others that you need to carry over to Azure Monitor Workbooks. We will also discuss parameters and user inputs in the next step.
5.	Identify required parameters or user inputs. In most cases, you need to define parameters for users to perform search, filtering, or scoping the results (for example, date range, account name and others). Hence, it is crucial to capture the details around parameters. Below are some of the key points to help you with collecting the parameter requirements:
    - **Parameter type**: This represents the type of parameter for users to perform selection or input. For example. date range, text, and others.
    - **Parameter style**: Defines how the parameters are represented, such as dropdown, text box, or others.
    - **Value format**: The expected value format, for example, time, string, integer, and more.
    - **Additional properties**: Such as the default value, allow multi-select, conditional visibility, and more.

## Convert dashboards to Azure Monitor workbooks

By the time you arrive at this stage, you should have identified a list of third-party dashboards to migrate and gathered the relevant details as described above.

Perform the following tasks in Azure Workbook and Microsoft Sentinel to convert your dashboard.

#### 1. Identify data sources

Azure Monitor workbooks are [compatible with a large number of data sources](../azure-monitor/visualize/workbooks-data-sources.md). In most cases, use the Azure Monitor Logs data source and leverage Kusto Query Language (KQL) queries to visualize the underlying logs in your Microsoft Sentinel workspace.

#### 2. Construct or review KQL queries

In this step, you mainly work with KQL to visualize your data. You can construct and test your queries in the Microsoft Sentinel Logs page before converting them to Azure Monitor workbooks. Before finalizing your KQL queries, always review and tune the queries to improve query performance. Optimized queries:
- Run faster, reduce the overall duration of the query execution.
- Have a smaller chance of being throttled or rejected.

Learn how to optimize KQL queries:
- [KQL query best practices](/azure/data-explorer/kusto/query/best-practices)
- [Optimize queries in Azure Monitor Logs](/azure/azure-monitor/log-query/query-optimization)
- [Optimizing KQL performance (webinar)](https://youtu.be/jN1Cz0JcLYU) 

#### 3. Create or update the workbook

[Create](tutorial-monitor-your-data.md#create-new-workbook) a workbook, update the workbook, or clone an existing workbook so that you don’t have to start from scratch. Also, specify how the data or visualizations will be represented, arranged and [grouped](../azure-monitor/visualize/workbooks-groups.md). There are two common designs:

- Vertical workbook
- Tabbed workbook

#### 4. Create or update workbook parameters or user inputs

By the time you arrive at this stage, you should have [identified the required parameters](#prepare-for-the-dashboard-conversion). With parameters, you can to collect input from the consumers and reference the input in other parts of the workbook. This input is typically used to scope the result set, to set the correct visualization, and allows you to build interactive reports and experiences.

Workbooks allow you to control how your parameter controls are presented to consumers, for example, you select whether the controls are presented as a text box vs. drop down, single- vs. multi-select, and use values from text, JSON, KQL, or Azure Resource Graph, and more.

Review the [supported workbook parameters](../azure-monitor/visualize/workbooks-parameters.md). You can reference these parameter values in other parts of workbooks either via bindings or value expansions.

#### 5.	Create or update visualizations

Workbooks provide a rich set of capabilities for visualizing your data. Review these detailed examples of each visualization type.

- [Text](../azure-monitor/visualize/workbooks-text-visualizations.md)
- [Charts](../azure-monitor/visualize/workbooks-chart-visualizations.md)
- [Grids](../azure/azure-monitor/visualize/workbooks-grid-visualizations.md)
- [Tiles](../azure/azure-monitor/visualize/workbooks-tile-visualizations.md)
- [Trees](../azure/azure-monitor/visualize/workbooks-tree-visualizations.md)
- [Graphs](../azure/azure-monitor/visualize/workbooks-graph-visualizations.md)
- [Map](../azure/azure-monitor/visualize/workbooks-map-visualizations.md)
- [Honey comb](/azure/azure-monitor/visualize/workbooks-honey-comb.md)
- [Composite bar](/en-us/azure/azure-monitor/visualize/workbooks-composite-bar.md)

#### 6.	Preview and save the workbook

Once you have saved your workbook, specify the parameters, if any exist, and validate the results. You can also try the [auto refresh](tutorial-monitor-your-data#refresh-your-workbook-data.md) or the print feature to [save as a PDF](tutorial-monitor-your-data#print-a-workbook-or-save-as-pdf.md).