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

Mapping data flows are visually designed data transformations in Azure Data Factory. Data flows allow data engineers to develop graphical data transformation logic without writing code. The resulting data flows are executed as activities within Azure Data Factory pipelines that use scaled-out Spark clusters. Data flow activities can be operationalized via existing Data Factory scheduling, control, flow, and monitoring capabilities.

Mapping data flows provide a fully visual experience with no coding required. Your data flows will run on your own execution cluster for scaled-out data processing. Azure Data Factory handles all the code translation, path optimization, and execution of your data flow jobs.

## Getting started

To create a data flow, select the plus sign under **Factory resources**. 

![New data flow](media/data-flow/newdataflow2.png "new data flow")

This takes you to the data flow canvas where you can create your transformation logic. Select **Add source** to start configuring your source transformation. For more information, see [Source transformation](data-flow-source.md).

## Data flow canvas

The data flow canvas is separated into three parts: the top bar, the graph, and the configuration panel. 

![Canvas](media/data-flow/canvas1.png "Canvas")

### Graph

The graph displays the transformation stream. It shows the lineage of source data as it flows into one or more sinks. To add a new source, select **Add source**. To add a new transformation, select the plus sign on the lower right of an existing transformation.

![Canvas](media/data-flow/canvas2.png "Canvas")

### Configuration panel

The configuration panel shows the settings specific to the currently selected transformation. If no transformation is selected, it shows the data flow. In the overall data flow configuration, you can edit the name and description under the **General** tab or add parameters via the **Parameters** tab. For more information, see [Mapping data flow parameters](parameters-data-flow.md).

Each transformation has at least four configuration tabs.

#### Transformation settings

The first tab in each transformation's configuration pane contains the settings specific to that transformation. For more information, see that transformation's documentation page.

![Source settings tab](media/data-flow/source1.png "Source settings tab")

#### Optimize

The **Optimize** tab contains settings to configure partitioning schemes.

![Optimize](media/data-flow/optimize1.png "Optimize")

The default setting is **Use current partitioning**, which instructs Azure Data Factory to use the partitioning scheme native to data flows running on Spark. In most scenarios, we recommend this setting.

There are instances where you might want to adjust the partitioning. For instance, if you want to output your transformations to a single file in the lake, select **Single partition** in a sink transformation.

Another case where you might want to control the partitioning schemes is optimizing performance. Adjusting the partitioning provides control over the distribution of your data across compute nodes and data locality optimizations that can have both positive and negative effects on your overall data flow performance. For more information, see the [Data flow performance guide](concepts-data-flow-performance.md).

To change the partitioning on any transformation, select the **Optimize** tab and select the **Set partitioning** radio button. You'll then be presented with a series of options for partitioning. The best method of partitioning will differ based on your data volumes, candidate keys, null values, and cardinality. 

A best practice is to start with default partitioning and then try different partitioning options. You can test by using pipeline debug runs, and view execution time and partition usage in each transformation grouping from the monitoring view. For more information, see [Monitoring data flows](concepts-data-flow-monitoring.md).

Below are the available partitioning options.

##### Round robin 

Round robin is a simple partition that automatically distributes data equally across partitions. Use round robin when you don't have good key candidates to implement a solid, smart partitioning strategy. You can set the number of physical partitions.

##### Hash

Azure Data Factory will produce a hash of columns to produce uniform partitions such that rows with similar values will fall in the same partition. When you use the Hash option, test for possible partition skew. You can set the number of physical partitions.

##### Dynamic range

Dynamic range will use Spark dynamic ranges based on the columns or expressions that you provide. You can set the number of physical partitions. 

##### Fixed range

Build an expression that provides a fixed range for values within your partitioned data columns. To avoid partition skew, you should have a good understanding of your data before you use this option. The values you enter for the expression will be used as part of a partition function. You can set the number of physical partitions.

##### Key

If you have a good understanding of the cardinality of your data, key partitioning might be a good strategy. Key partitioning will create partitions for each unique value in your column. You can't set the number of partitions because the number will be based on unique values in the data.

#### Inspect

The **Inspect** tab provides a view into the metadata of the data stream that you're transforming. You can see the column counts, columns changed, columns added, data types, column ordering, and column references. **Inspect** is a read-only view of your metadata. You don't need to have debug mode enabled to see metadata in the **Inspect** pane.

![Inspect](media/data-flow/inspect1.png "Inspect")

As you change the shape of your data through transformations, you'll see the metadata changes flow in the **Inspect** pane. If there isn't a defined schema in your source transformation, then metadata won't be visible in the **Inspect** pane. Lack of metadata is common in schema drift scenarios.

#### Data preview

If debug mode is on, the **Data preview** tab gives you an interactive snapshot of the data at each transform. For more information, see [Data preview in debug mode](concepts-data-flow-debug-mode.md#data-preview).

### Top bar

The top bar contains actions that affect the whole data flow, such as saving and validation. You can also toggle between graph and configuration modes by using the **Show graph** and **Hide graph** buttons.

![Hide graph](media/data-flow/hideg.png "Hide graph")

If you hide your graph, you can browse through your transformation nodes laterally via the **Previous** and **Next** buttons.

![Previous and next buttons](media/data-flow/showhide.png "previous and next buttons")

## Next steps

* Learn how to create a [source transformation](data-flow-source.md).
* Learn how to build your data flows in [debug mode](concepts-data-flow-debug-mode.md).
