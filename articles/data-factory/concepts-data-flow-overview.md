---
title: Mapping data flows in Azure Data Factory | Microsoft Docs
description: An overview of mapping data flows in Azure Data Factory
author: kromerm
ms.author: makromer
ms.reviewer: daperlov
ms.service: data-factory
ms.topic: conceptual
ms.date: 10/7/2019
---

# What are mapping data flows?

Mapping Data Flows are visually designed data transformations in Azure Data Factory. Data flows allow data engineers to develop graphical data transformation logic without writing code. The resulting data flows are executed as activities within Azure Data Factory Pipelines using scaled-out Spark clusters. Data flow activities can be operationalized via existing Data Factory scheduling, control, flow and monitoring capabilities.

Mapping Data Flows provide a fully visual experience with no coding required. Your data flows will execute on your own execution cluster for scaled-out data processing. Azure Data Factory handles all of the code translation, path optimization, and execution of your data flow jobs.

## Getting started

To create a data flow, click the plus sign in under Factory Resources. 

![new data flow](media/data-flow/newdataflow2.png "new data flow")

This takes you to the data flow canvas where you can create your transformation logic. Click the 'Add source' box to start configuring your Source transformation. For more information, see [Source Transformation](data-flow-source.md).

## Data flow canvas

The Data Flow canvas is separated into three parts: the top bar, the graph, and the configuration panel. 

![Canvas](media/data-flow/canvas1.png "Canvas")

### Graph

The graph displays the transformation stream. It shows the lineage of source data as it flows into one or more sinks. To add a new source, click the 'Add source' box. To add a new transformation, click on the plus sign on the bottom right of an existing transformation.

![Canvas](media/data-flow/canvas2.png "Canvas")

### Configuration panel

The configuration panel shows the settings specific to the currently selected transformation or, if no transformation is selected, the data flow. In the overall data flow configuration, you can edit the name and description under the **General** tab or add parameters via the **Parameters** tab. For more information, see [Mapping Data Flow parameters](parameters-data-flow.md).

Each transformation has at least four configuration tabs:

#### Transformation settings

The first tab in each transformation's configuration pane contains the settings specific to that transformation. For more information, please refer to that transformation's documentation page.

![Source settings tab](media/data-flow/source1.png "Source settings tab")

#### Optimize

The _Optimize_ tab contains settings to configure partitioning schemes.

![Optimize](media/data-flow/optimize1.png "Optimize")

The default setting is "Use current partitioning," which instructs Azure Data Factory to use the partitioning scheme native to Data Flows running on Spark. In most scenarios, this setting is the recommended approach.

There are instances where you may wish to adjust the partitioning. For instance, if you want to output your transformations to a single file in the lake, choose "Single partition" in a Sink transformation.

Another case where you may wish to control the partitioning schemes is optimizing performance. Adjusting the partitioning provides control over the distribution of your data across compute nodes and data locality optimizations that can have both positive and negative effects on your overall data flow performance. For more information, see the [data Flow performance guide](concepts-data-flow-performance.md).

To change the partitioning on any transformation, click the Optimize tab and select the "Set partitioning" radio button. You'll then be presented with a series of options for partitioning. The best method of partitioning will differ based on your data volumes, candidate keys, null values, and cardinality. A best practice is to start with default partitioning and then try different partitioning options. You can test using pipeline debug runs and view execution time and partition usage in each transformation grouping from the Monitoring view. For more information, see [monitoring data flows](concepts-data-flow-monitoring.md).

Below are the available partitioning options.

##### Round Robin 

Round Robin is simple partition that automatically distributes data equally across partitions. Use Round Robin when you don't have good key candidates to implement a solid, smart partitioning strategy. You can set the number of physical partitions.

##### Hash

Azure Data Factory will produce a hash of columns to produce uniform partitions such that rows with similar values will fall in the same partition. When using the Hash option, test for possible partition skew. You can set the number of physical partitions.

##### Dynamic Range

Dynamic Range will use Spark dynamic ranges based on the columns or expressions that you provide. You can set the number of physical partitions. 

##### Fixed Range

Build an expression that provides a fixed range for values within your partitioned data columns. You should have a good understanding of your data before using this option to avoid partition skew. The values you enter for the expression will be used as part of a partition function. You can set the number of physical partitions.

##### Key

If you have a good understanding of the cardinality of your data, key partitioning may be a good partition strategy. Key partitioning will create partitions for each unique value in your column. You can't set the number of partitions because the number will be based on unique values in the data.

#### Inspect

The _Inspect_ tab provides a view into the metadata of the data stream that you're transforming. You can see the column counts, columns changed, columns added, data types, column ordering, and column references. Inspect is a read-only view of your metadata. You don't need to have Debug mode enabled to see metadata in the Inspect Pane.

![Inspect](media/data-flow/inspect1.png "Inspect")

As you change the shape of your data through transformations, you'll see the metadata changes flow through the Inspect Pane. If there isn't a defined schema in your Source transformation, then metadata won't be visible in the Inspect Pane. Lack of metadata is common in Schema Drift scenarios.

#### Data Preview

If debug mode is on, the _Data Preview_ tab gives you an interactive snapshot of the data at each transform. For more information, see [data preview in debug mode](concepts-data-flow-debug-mode.md#data-preview).

### Top bar

The top bar contains actions that affect the whole data flow such as saving and validation. You can also toggle between graph and configuration modes using the **Show graph** and **Hide graph** buttons.

![Hide graph](media/data-flow/hideg.png "Hide Graph")

If you hide your graph, you can navigate through your transformation nodes laterally via the **previous** and **next** buttons.

![Navigate](media/data-flow/showhide.png "navigate")

## Next steps

* Learn how to create a [Source Transformation](data-flow-source.md)
* Learn how to build your data flows in [Debug mode](concepts-data-flow-debug-mode.md)
