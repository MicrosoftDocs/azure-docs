---
title: Transform data from an SAP ODP source with the SAP CDC connector in Azure Data Factory or Azure Synapse Analytics
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to transform data from an SAP ODP source by using mapping data flows in Azure Data Factory or Azure Synapse Analytics.
author: ukchrist
ms.author: ulrichchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 04/14/2023
---

# Transform data from an SAP ODP source using the SAP CDC connector in Azure Data Factory or Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use mapping data flow to transform data from an SAP ODP source using the SAP CDC connector. To learn more, read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md). For an introduction to transforming data with Azure Data Factory and Azure Synapse analytics, read [mapping data flow](concepts-data-flow-overview.md) or the [tutorial on mapping data flow](tutorial-data-flow.md).

>[!TIP]
>To learn the overall support on SAP data integration scenario, see [SAP data integration using Azure Data Factory whitepaper](https://github.com/Azure/Azure-DataFactory/blob/master/whitepaper/SAP%20Data%20Integration%20using%20Azure%20Data%20Factory.pdf) with detailed introduction on each SAP connector, comparsion and guidance.

## Supported capabilities

This SAP CDC connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Mapping data flow](concepts-data-flow-overview.md) (source/-)|&#9312;, &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

This SAP CDC connector uses the SAP ODP framework to extract data from SAP source systems. For an introduction to the architecture of the solution, read [Introduction and architecture to SAP change data capture (CDC)](sap-change-data-capture-introduction-architecture.md) in our [SAP knowledge center](industry-sap-overview.md).

The SAP ODP framework is contained in all up-to-date SAP NetWeaver based systems, including SAP ECC, SAP S/4HANA, SAP BW, SAP BW/4HANA, SAP LT Replication Server (SLT). For prerequisites and minimum required releases, see [Prerequisites and configuration](sap-change-data-capture-prerequisites-configuration.md#sap-system-requirements).  

The SAP CDC connector supports basic authentication or Secure Network Communications (SNC), if SNC is configured.

## Current limitations

Here are current limitations of the SAP CDC connector in Data Factory:

- You can't reset or delete ODQ subscriptions in Data Factory (use transaction ODQMON in the connected SAP system for this purpose).
- You can't use SAP hierarchies with the solution.

## Prerequisites

To use this SAP CDC connector, refer to [Prerequisites and setup for the SAP CDC connector](sap-change-data-capture-prerequisites-configuration.md).

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service for the SAP CDC connector using UI

Follow the steps described in [Prepare the SAP CDC linked service](sap-change-data-capture-prepare-linked-service-source-dataset.md#set-up-a-linked-service) to create a linked service for the SAP CDC connector in the Azure portal UI.

## Dataset properties

To prepare an SAP CDC dataset, follow [Prepare the SAP CDC source dataset](sap-change-data-capture-prepare-linked-service-source-dataset.md#set-up-the-source-dataset).

## Transform data with the SAP CDC connector

The raw SAP ODP change feed is difficult to interpret and updating it correctly to a sink can be a challenge. For example, technical attributes associated with each row (like ODQ_CHANGEMODE) have to be understood to apply the changes to the sink correctly. Also, an extract of change data from ODP can contain multiple changes to the same key (for example, the same sales order). It's therefore important to respect the order of changes, while at the same time optimizing performance by processing the changes in parallel.
Moreover, managing a change data capture feed also requires keeping track of state, for example in order to provide built-in mechanisms for error recovery.
Azure data factory mapping data flows take care of all such aspects. Therefore, SAP CDC connectivity is part of the mapping data flow experience. Thus, users can concentrate on the required transformation logic without having to bother with the technical details of data extraction.

To get started, create a pipeline with a mapping data flow.

:::image type="content" source="media/sap-change-data-capture-solution/sap-change-data-capture-pipeline-dataflow-activity.png" alt-text="Screenshot of add data flow activity in pipeline.":::

Next, specify a staging linked service and staging folder in Azure Data Lake Gen2, which serves as an intermediate storage for data extracted from SAP.

 >[!NOTE]
   > - The staging linked service cannot use a self-hosted integration runtime.
   > - The staging folder should be considered an internal storage of the SAP CDC connector. For further optimizations of the SAP CDC runtime, implementation details, like the file format used for the staging data, might change. We therefore recommend not to use the staging folder for other purposes, e.g. as a source for other copy activities or mapping data flows.

:::image type="content" source="media/sap-change-data-capture-solution/sap-change-data-capture-staging-folder.png" alt-text="Screenshot of specify staging folder in data flow activity.":::

The **Checkpoint Key** is used by the SAP CDC runtime to store status information about the change data capture process. This, for example, allows SAP CDC mapping data flows to automatically recover from error situations, or know whether a change data capture process for a given data flow has already been established. It is therefore important to use a unique **Checkpoint Key** for each source. Otherwise status information of one source will be overwritten by another source.

>[!NOTE]
   > - To avoid conflicts, a unique id is generated as **Checkpoint Key** by default.
   > - When using parameters to leverage the same data flow for multiple sources, make sure to parametrize the **Checkpoint Key** with unique values per source.
   > - The **Checkpoint Key** property is not shown if the **Run mode** within the SAP CDC source is set to **Full on every run** (see next section), because in this case no change data capture process is established.

:::image type="content" source="media/sap-change-data-capture-solution/sap-change-data-capture-checkpoint-key.png" alt-text="Screenshot of checkpoint key property in data flow activity.":::

### Mapping data flow properties

To create a mapping data flow using the SAP CDC connector as a source, complete the following steps:

1.	In ADF Studio, go to the **Data flows** section of the **Author** hub, select the **…** button to drop down the **Data flow actions** menu, and select the **New data flow** item. Turn on debug mode by using the **Data flow debug** button in the top bar of data flow canvas.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-change-data-capture-mapping-data-flow-data-flow-debug.png" alt-text="Screenshot of the data flow debug button in mapping data flow.":::

1. In the mapping data flow editor, select **Add Source**.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-change-data-capture-mapping-data-flow-add-source.png" alt-text="Screenshot of add source in mapping data flow.":::

1. On the tab **Source settings**, select a prepared SAP CDC dataset or select the **New** button to create a new one. Alternatively, you can also select **Inline** in the **Source type** property and continue without defining an explicit dataset.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-change-data-capture-mapping-data-flow-select-dataset.png" alt-text="Screenshot of the select dataset option in source settings of mapping data flow source.":::

1. On the tab **Source options**, select the option **Full on every run** if you want to load full snapshots on every execution of your mapping data flow. Select **Full on the first run, then incremental** if you want to subscribe to a change feed from the SAP source system including an initial full data snapshot. In this case, the first run of your pipeline performs a delta initialization, which means it creates an ODP delta subscription in the source system and returns a current full data snapshot. Subsequent pipeline runs only return incremental changes since the preceding run. The option **incremental changes only** creates an ODP delta subscription without returning an initial full data snapshot in the first run. Again, subsequent runs return incremental changes since the preceding run only. Both incremental load options require to specify the keys of the ODP source object in the **Key columns** property.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-change-data-capture-mapping-data-flow-run-mode.png" alt-text="Screenshot of the run mode property in source options of mapping data flow source.":::

    :::image type="content" source="media/sap-change-data-capture-solution/sap-change-data-capture-mapping-data-flow-key-columns.png" alt-text="Screenshot of the key columns selection in source options of mapping data flow source.":::

1. For the tabs **Projection**, **Optimize** and **Inspect**, follow [mapping data flow](concepts-data-flow-overview.md).

### Optimizing performance of full or initial loads with source partitioning

If **Run mode** is set to **Full on every run** or **Full on the first run, then incremental**, the tab **Optimize** offers a selection and partitioning type called **Source**. This option allows you to specify multiple partition (that is, filter) conditions to chunk a large source data set into multiple smaller portions. For each partition, the SAP CDC connector triggers a separate extraction process in the SAP source system.

:::image type="content" source="media/sap-change-data-capture-solution/sap-change-data-capture-mapping-data-flow-optimize-partition.png" alt-text="Screenshot of the partitioning options in optimize of mapping data flow source.":::

If partitions are equally sized, source partitioning can linearly increase the throughput of data extraction. To achieve such performance improvements, sufficient resources are required in the SAP source system, the virtual machine hosting the self-hosted integration runtime, and the Azure integration runtime.

## Next steps

- [Overview and architecture of the SAP CDC capabilities](sap-change-data-capture-introduction-architecture.md)
- [Replicate multiple objects from SAP via SAP CDC](solution-template-replicate-multiple-objects-sap-cdc.md)
- [SAP CDC advanced topics](sap-change-data-capture-advanced-topics.md)