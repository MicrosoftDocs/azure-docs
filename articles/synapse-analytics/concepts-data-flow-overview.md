---
title: Data flows
description: An overview of data flows in Azure Synapse Analytics
author: kromerm
ms.author: makromer
ms.reviewer: daperlov
ms.service: synapse-analytics
ms.subservice: pipeline
ms.topic: conceptual
ms.custom: references_regions
ms.date: 12/16/2020
---

# Data flows in Azure Synapse Analytics

## What are data flows?

Data flows are visually designed data transformations in Azure Synapse Analytics. Data flows allow data engineers to develop data transformation logic without writing code. The resulting data flows are executed as activities within Azure Synapse Analytics pipelines that use scaled-out Apache Spark clusters. Data flow activities can be operationalized using existing Azure Synapse Analytics scheduling, control, flow, and monitoring capabilities.

Data flows provide an entirely visual experience with no coding required. Your data flows run on Synapse-managed execution clusters for scaled-out data processing. Azure Synapse Analytics handles all the code translation, path optimization, and execution of your data flow jobs.

## Getting started

Data flows are created from the Develop pane in Synapse studio. To create a data flow, select the plus sign next to **Develop**, and then select **Data Flow**. 

![New data flow](media/data-flow/new-data-flow.png)

This action takes you to the data flow canvas, where you can create your transformation logic. Select **Add source** to start configuring your source transformation. For more information, see [Source transformation](../data-factory/data-flow-source.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

## Authoring data flows

Data flow has a unique authoring canvas designed to make building transformation logic easy. The data flow canvas is separated into three parts: the top bar, the graph, and the configuration panel. 

![Screenshot shows the data flow canvas with top bar, graph, and configuration panel labeled.](media/data-flow/canvas-1.png)

### Graph

The graph displays the transformation stream. It shows the lineage of source data as it flows into one or more sinks. To add a new source, select **Add source**. To add a new transformation, select the plus sign on the lower right of an existing transformation. Learn more on how to [manage the data flow graph](../data-factory/concepts-data-flow-manage-graph.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

![Screenshot shows the graph part of the canvas with a Search text box.](media/data-flow/canvas-2.png)

### Configuration panel

The configuration panel shows the settings specific to the currently selected transformation. If no transformation is selected, it shows the data flow. In the overall data flow configuration, you can add parameters via the **Parameters** tab. For more information, see [Data flow parameters](../data-factory/parameters-data-flow.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

Each transformation contains at least four configuration tabs.

#### Transformation settings

The first tab in each transformation's configuration pane contains the settings specific to that transformation. For more information, see that transformation's documentation page.

![Source settings tab](media/data-flow/source-1.png)

#### Optimize

The **Optimize** tab contains settings to configure partitioning schemes. To learn more about how to optimize your data flows, see the [mapping data flow performance guide](../data-factory/concepts-data-flow-performance.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

![Screenshot shows the Optimize tab](media/data-flow/optimize.png)

#### Inspect

The **Inspect** tab provides a view into the metadata of the data stream that you're transforming. You can see column counts, the columns changed, the columns added, data types, the column order, and column references. **Inspect** is a read-only view of your metadata. You don't need to have debug mode enabled to see metadata in the **Inspect** pane.

![Inspect tab](media/data-flow/inspect.png)

As you change the shape of your data through transformations, you'll see the metadata changes flow in the **Inspect** pane. If there isn't a defined schema in your source transformation, then metadata won't be visible in the **Inspect** pane. Lack of metadata is common in schema drift scenarios.

#### Data preview

If debug mode is on, the **Data Preview** tab gives you an interactive snapshot of the data at each transform. For more information, see [Data preview in debug mode](../data-factory/concepts-data-flow-debug-mode.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json#data-preview).

### Top bar

The top bar contains actions that affect the whole data flow, like validation and debug settings. You can view the underlying JSON code and data flow script of your transformation logic as well.

## Available transformations

View the [mapping data flow transformation overview](../data-factory/data-flow-transformation-overview.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) to get a list of available transformations.

## Data flow activity

Data flows are operationalized within Azure Synapse Analytics pipelines using the [data flow activity](../data-factory/control-flow-execute-data-flow-activity.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json). All a user has to do is specify which integration runtime to use and pass in parameter values. For more information, learn about the [Azure integration runtime](../data-factory/concepts-integration-runtime.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json#azure-integration-runtime).

## Debug mode

Debug mode allows you to interactively see the results of each transformation step while you build and debug your data flows. The debug session can be used both in when building your data flow logic and running pipeline debug runs with data flow activities. To learn more, see the [debug mode documentation](../data-factory/concepts-data-flow-debug-mode.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

## Monitoring data flows

Data flow integrates with existing Azure Synapse Analytics monitoring capabilities. To learn how to understand data flow monitoring output, see [monitoring mapping data flows](../data-factory/concepts-data-flow-monitoring.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

The Azure Synapse Analytics team has created a [performance tuning guide](../data-factory/concepts-data-flow-performance.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) to help you optimize the execution time of your data flows after building your business logic.

## Next steps

* Learn how to create a [source transformation](../data-factory/data-flow-source.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).
* Learn how to build your data flows in [debug mode](../data-factory/concepts-data-flow-debug-mode.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).
