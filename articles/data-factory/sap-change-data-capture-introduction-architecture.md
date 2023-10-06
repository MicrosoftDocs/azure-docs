---
title: Overview and architecture of the SAP CDC capabilities
titleSuffix: Azure Data Factory
description: Learn about the SAP change data capture (CDC) capabilities in Azure Data Factory and understand its architecture.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 07/20/2023
ms.author: ulrichchrist
---

# Overview and architecture of the SAP CDC capabilities

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Learn about the SAP change data capture (CDC) capabilities in Azure Data Factory and understand the architecture.

Azure Data Factory is an ETL and ELT data integration platform as a service (PaaS). For SAP data integration, Data Factory currently offers six general availability connectors:

:::image type="content" source="media/sap-change-data-capture-solution/sap-supported-cdc-connectors.png" alt-text="Screenshot of the six general availability connectors for SAP systems in Data Factory.":::

## Data extraction needs

The SAP connectors in Data Factory extract SAP source data only in batches. Each batch processes existing and new data the same. In data extraction in batch mode, changes between existing and new datasets aren't identified. This type of extraction mode isn’t optimal when you have large datasets like tables that have millions or billions of records that change often.

You can keep your copy of SAP data fresh and up-to-date by frequently extracting the full dataset, but this approach is expensive and inefficient. You also can use a manual, limited workaround to extract mostly new or updated records. In a process called *watermarking*, extraction requires using a timestamp column, monotonically increasing values, and continuously tracking the highest value since the last extraction. But some tables don't have a column that you can use for watermarking. This process also doesn't identify a deleted record as a change in the dataset.

## SAP CDC capabilities

Microsoft customers indicate that they need a connector that can extract only the delta between two sets of data. In data, a *delta* is any change in a dataset that's the result of an update, insert, or deletion in the dataset. A delta extraction connector uses the [SAP change data capture (CDC) feature](https://help.sap.com/docs/SAP_DATA_SERVICES/ec06fadc50b64b6184f835e4f0e1f52f/1752bddf523c45f18ce305ac3bcd7e08.html?q=change%20data%20capture) that exists in most SAP systems to determine the delta in a dataset. The SAP CDC capabilities in Data Factory use the SAP Operational Data Provisioning (ODP) framework to replicate the delta in an SAP source dataset.

This article provides a high-level architecture of the SAP CDC capabilities in Azure Data Factory. Get more information about the SAP CDC capabilities:

- [Prerequisites and setup](sap-change-data-capture-prerequisites-configuration.md)
- [Set up a self-hosted integration runtime](sap-change-data-capture-shir-preparation.md)
- [Set up a linked service and source dataset](sap-change-data-capture-prepare-linked-service-source-dataset.md)
- [Manage your solution](sap-change-data-capture-management.md)

## How to use the SAP CDC capabilities

The SAP CDC connector is the core of the SAP CDC capabilities. It can connect to all SAP systems that support ODP, which includes SAP ECC, SAP S/4HANA, SAP BW, and SAP BW/4HANA. The solution works either directly at the application layer or indirectly via an SAP Landscape Transformation Replication Server (SLT) as a proxy. It doesn't rely on watermarking to extract SAP data either fully or incrementally. The data the SAP CDC connector extracts includes not only physical tables but also logical objects that are created by using the tables. An example of a table-based object is an SAP Advanced Business Application Programming (ABAP) Core Data Services (CDS) view.

Use the SAP CDC connector with Data Factory features like mapping data flow activities, and tumbling window triggers for a low-latency SAP CDC replication solution in a self-managed pipeline.

## The SAP CDC architecture

The SAP CDC solution in Azure Data Factory is a connector between SAP and Azure. The SAP side includes the SAP ODP connector that invokes the ODP API over standard Remote Function Call (RFC) modules to extract full and delta raw SAP data.

The Azure side includes the mapping data flow that can transform and load the SAP data into any data sink supported by mapping data flows. Some of these options are storage destinations like Azure Data Lake Storage Gen2 or databases like Azure SQL Database or Azure Synapse Analytics. The mapping data flow activity also can load the results in Data Lake Storage Gen2 in delta format. You can use the Delta Lake Time Travel feature to produce snapshots of SAP data for a specific period. You can run your pipeline and mapping data flows frequently by using a Data Factory tumbling window trigger to replicate SAP data in Azure with low latency and without using watermarking.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-architecture-diagram.png" border="false" alt-text="Diagram of the architecture of the SAP CDC solution.":::

To get started, create an SAP CDC linked service, an SAP CDC source dataset, and a pipeline with a mapping data flow activity in which you use the SAP CDC source dataset. To extract the data from SAP, a self-hosted integration runtime is required that you install on an on-premises computer or on a virtual machine (VM) that has a line of sight to your SAP source systems or your SLT server. The mapping data flow activity runs on a serverless Azure Databricks or Apache Spark cluster, or on an Azure integration runtime. A staging storage is required to be configured in mapping data flow activity to make your self-hosted integration runtime work seamlessly with mapping data flow integration runtime.

The SAP CDC connector uses the SAP ODP framework to extract various data source types, including:

- SAP extractors, originally built to extract data from SAP ECC and load it into SAP BW
- ABAP CDS views, the new data extraction standard for SAP S/4HANA
- InfoProviders and InfoObjects datasets in SAP BW and SAP BW/4HANA
- SAP application tables, when you use an SAP LT replication server (SLT) as a proxy

In this process, the SAP data sources are *providers*. The providers run on SAP systems to produce either full or incremental data in an operational delta queue (ODQ). The mapping data flow source is a *subscriber* of the ODQ.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-shir-architecture-diagram.png" border="false" alt-text="Diagram of the architecture of the SAP ODP framework through a self-hosted integration runtime.":::

Because ODP completely decouples providers from subscribers, any SAP documentation that offers provider configurations are applicable to Data Factory as a subscriber. For more information about ODP, see [Introduction to operational data provisioning](https://wiki.scn.sap.com/wiki/display/BI/Introduction+to+Operational+Data+Provisioning).

## Next steps

[Prerequisites and setup for the SAP CDC solution](sap-change-data-capture-prerequisites-configuration.md)
