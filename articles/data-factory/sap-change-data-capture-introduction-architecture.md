---
title: Overview and architecture of the SAP CDC solution (preview)
titleSuffix: Azure Data Factory
description: Learn about the SAP change data capture (CDC) solution (preview) in Azure Data Factory and understand its architecture.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Overview and architecture of the SAP CDC solution (preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Learn about the SAP change data capture (CDC) solution (preview) in Azure Data Factory and understand its architecture.

Azure Data Factory is an ETL and ELT data integration platform as a service (PaaS). For SAP data integration, Data Factory currently offers six general availability connectors:

:::image type="content" source="media/sap-change-data-capture-solution/sap-supported-cdc-connectors.png" alt-text="Screenshot of the six general availability connectors for SAP systems in Data Factory.":::

## Data extraction needs

The SAP connectors in Data Factory extract SAP source data only in batches. Each batch processes existing and new data the same. In data extraction in batch mode, changes between existing and new datasets aren't identified. This type of extraction mode isn’t optimal when you have large datasets like tables that have millions or billions of records that change often.

You can keep your copy of SAP data fresh and up-to-date by frequently extracting the full dataset, but this approach is expensive and inefficient. You also can use a manual, limited workaround to extract mostly new or updated records. In a process called *watermarking*, extraction requires using a timestamp column, monotonously increasing values, and continuously tracking the highest value since the last extraction. But some tables don't have a column that you can use for watermarking. This process also doesn't identify a deleted record as a change in the dataset.

## The SAP CDC solution

Microsoft customers indicate that they need a connector that can extract only the delta between two sets of data. In data, a *delta* is any change in a dataset that's the result of an update, insert, or deletion in the dataset. A delta extraction connector uses the [SAP change data capture (CDC) feature](https://help.sap.com/docs/SAP_DATA_SERVICES/ec06fadc50b64b6184f835e4f0e1f52f/1752bddf523c45f18ce305ac3bcd7e08.html?q=change%20data%20capture) that exists in most SAP systems to determine the delta in a dataset. The SAP CDC solution in Data Factory uses the SAP Operational Data Provisioning (ODP) framework to replicate the delta in an SAP source dataset.

This article provides a high-level architecture of the SAP CDC solution in Azure Data Factory. Get more information about the SAP CDC solution:

- [Prerequisites and setup](sap-change-data-capture-prerequisites-configuration.md)
- [Set up a self-hosted integration runtime](sap-change-data-capture-shir-preparation.md)
- [Set up a linked service and source dataset](sap-change-data-capture-prepare-linked-service-source-dataset.md)
- [Use the SAP data extraction template](sap-change-data-capture-data-replication-template.md)
- [Use the SAP data partition template](sap-change-data-capture-data-partitioning-template.md)
- [Manage your solution](sap-change-data-capture-management.md)

## How to use the SAP CDC solution

The SAP CDC solution is a connector that you access through an SAP ODP (preview) linked service, an SAP ODP (preview) source dataset, and the SAP data replication template or the SAP data partitioning template. Choose your template when you set up a new pipeline in Azure Data Factory Studio. To access preview templates, you must [enable the preview experience in Azure Data Factory Studio](how-to-manage-studio-preview-exp.md#how-to-enabledisable-preview-experience).

The SAP CDC solution connects to all SAP systems that support ODP, including SAP R/3, SAP ECC, SAP S/4HANA, SAP BW, and SAP BW/4HANA. The solution works either directly at the application layer or indirectly via an SAP Landscape Transformation Replication Server (SLT) as a proxy. The solution doesn't rely on watermarking to extract SAP data either fully or incrementally. The data the SAP CDC solution extracts includes not only physical tables but also logical objects that are created by using the tables. An example of a table-based object is an SAP Advanced Business Application Programming (ABAP) Core Data Services (CDS) view.

Use the SAP CDC solution with Data Factory features like copy activities and data flow activities, pipeline templates, and tumbling window triggers for a low-latency SAP CDC replication solution in a self-managed pipeline.

## The SAP CDC solution architecture

The SAP CDC solution in Azure Data Factory is a connector between SAP and Azure. The SAP side includes the SAP ODP connector that invokes the ODP API over standard Remote Function Call (RFC) modules to extract full and delta raw SAP data.

The Azure side includes the Data Factory copy activity that loads the raw SAP data into a storage destination like Azure Blob Storage or Azure Data Lake Storage Gen2. The data is saved in CSV or Parquet format, essentially archiving or preserving all historical changes.

The Azure side also might include a Data Factory data flow activity that transforms the raw SAP data, merges all changes, and loads the results in a destination like Azure SQL Database or Azure Synapse Analytics, essentially replicating the SAP data. The Data Factory data flow activity also can load the results in Data Lake Storage Gen2 in delta format. You can use the open source Delta Lake Time Travel feature to produce snapshots of SAP data for a specific period.

In Azure Data Factory Studio, the SAP template that you use to auto-generate a Data Factory pipeline connects SAP with Azure. You can run the pipeline frequently by using a Data Factory tumbling window trigger to replicate SAP data in Azure with low latency and without using watermarking.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-architecture-diagram.png" border="false" alt-text="Diagram of the architecture of the SAP CDC solution.":::

To get started, create a Data Factory copy activity by using an SAP ODP linked service, an SAP ODP source dataset, and an SAP data replication template or SAP data partitioning template. The copy activity runs on a self-hosted integration runtime that you install on an on-premises computer or on a virtual machine (VM). An on-premises computer has a line of sight to your SAP source systems and to the SLT. The Data Factory data flow activity runs on a serverless Azure Databricks or Apache Spark cluster, or on an Azure integration runtime.

The SAP CDC solution uses ODP to extract various data source types, including:

- SAP extractors, originally built to extract data from ECC and load it into BW
- ABAP CDS views, the new data extraction standard for S/4HANA
- InfoProviders and InfoObjects datasets in BW and BW/4HANA
- SAP application tables, when you use an SLT replication server as a proxy

In this process, the SAP data sources are *providers*. The providers run on SAP systems to produce either full or incremental data in an operational delta queue (ODQ). The Data Factory copy activity is a *subscriber* of the ODQ. The copy activity consumes the ODQ through the SAP CDC solution in the Data Factory pipeline.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-shir-architecture-diagram.png" border="false" alt-text="Diagram of the architecture of the SAP ODP framework through a self-hosted integration runtime.":::

Because ODP completely decouples providers from subscribers, any SAP documentation that offers provider configurations are applicable to Data Factory as a subscriber. For more information about ODP, see [Introduction to operational data provisioning](https://wiki.scn.sap.com/wiki/display/BI/Introduction+to+Operational+Data+Provisioning).

## Next steps

[Prerequisites and setup for the SAP CDC solution](sap-change-data-capture-prerequisites-configuration.md)
