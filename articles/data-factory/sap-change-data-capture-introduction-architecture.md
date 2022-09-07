---
title: Introduction to the SAP change data capture solution and architecture overview
titleSuffix: Azure Data Factory
description: Learn about the SAP change data capture (CDC) solution in Azure Data Factory and understand its architecture.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Overview of the SAP CDC solution in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article introduces and describes the architecture of the SAP change data capture (CDC) solution in Azure Data Factory.

Azure Data Factory is a data integration (ETL and ELT) platform as a service (PaaS). For SAP data integration, Data Factory currently offers six connectors:

:::image type="content" source="media/sap-change-data-capture-solution/sap-supported-cdc-connectors.png" alt-text="Shows a list of the supported connectors for the SAP CDC solution.":::

The SAP connectors in Azure Data Factory extract data only in batches. In batch mode, each batch processes existing and new data the same. Data changes between existing and new data aren't identified. This type of extraction mode isn’t optimal when you have large datasets like tables that have millions or billions of records that change often.

You can keep your copy of SAP data fresh and up-to-date by frequently extracting the full dataset, but this approach is expensive and inefficient. You also can use a manual, limited workaround to extract mostly new or updated records. In a process called *watermarking*, extraction requires a timestamp column, monotonously increasing values, and continuously tracking the highest value since the last extraction. Some tables don't have a column that you can use for watermarking, and this process doesn't identify deleted records as changes in the dataset.

Customers indicate that they need a connector that can extract only data changes (*deltas*). In data, a delta is any change in a dataset that's the result of an update, insert, or deletion in the data. A delta extraction connector uses the [SAP change data capture (CDC) feature](https://help.sap.com/docs/SAP_DATA_SERVICES/ec06fadc50b64b6184f835e4f0e1f52f/1752bddf523c45f18ce305ac3bcd7e08.html?q=change%20data%20capture) that exists in most SAP systems to determine the delta in a dataset. The new SAP CDC solution in Azure Data Factory uses the SAP Operational Data Provisioning (ODP) framework to replicate the delta in an SAP system.

The SAP CDC solution consists of the SAP ODP (preview) connector that you access through the SAP ODP (preview) template in Azure Data Factory Studio. The connector connects to all SAP systems that support ODP, including SAP R/3, SAP ECC, SAP S/4HANA, SAP BW, and SAP BW/4HANA. The connector works directly at the application layer or indirectly via an SAP Landscape Transformation (SLT) replication server as a proxy. Without watermarking, it can either extract fully or incrementally SAP data that includes not only physical tables, but also logical objects created on top of those tables. An example is SAP Advanced Business Application Programming (ABAP) Core Data Services (CDS) views. Combined with existing Data Factory features, such as copy and data flow activities, pipeline templates, and tumbling window triggers, Microsoft offers a low-latency SAP CDC or replication solution with a self-managed pipeline experience. Access the solution by using the SAP ODP (preview) template when you create a Data Factory pipeline.

This article provides a high-level architecture of the SAP CDC solution in Azure Data Factory. See the related preview documentation for prerequisites, step-by-step guidance to preview the connector, and the connector's current limitations.

## SAP CDC solution architecture

The high-level architecture of the SAP CDC solution in Azure Data Factory is divided into SAP and Azure. The SAP side includes the SAP CDC (preview) connector that invokes the ODP API over standard Remote Function Call (RFC) modules to extract full and delta raw SAP data.

The Azure side includes the Data Factory copy activity that loads the raw SAP data into a storage destination like Azure Blob Storage or Azure Data Lake Storage Gen2. The data is saved in CSV or Parquet format, essentially archiving or preserving all historical changes.

The Azure side also might include a Data Factory data flow activity that transforms the raw SAP data, merges all changes, and loads the results into a destination like Azure SQL Database or Azure Synapse Analytics, essentially replicating the SAP data. The Data Factory data flow activity also can load the results into Data Lake Storage Gen2 in delta format, so time travel capabilities can produce snapshots of SAP data at any specific period in the past. In Azure Data Factory Studio, the SAP side and the Azure side are combined in the SAP ODP (preview) template that you use to auto-generate a Data Factory pipeline. You can run the pipeline frequently by using a Data Factory tumbling window trigger to replicate SAP data into Azure with low latency and without watermarking.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-architecture-diagram.png" border="false" alt-text="Diagram of the architecture of SAP CDC.":::

The Data Factory copy activity with the SAP ODP (preview) template runs on a self-hosted integration runtime that you install on your on-premises computer or virtual machine (VM). The computer or VM has a line of sight to your SAP source systems and the SLT replication server. The Data Factory data flow activity runs on a serverless Azure Databricks or Apache Spark cluster, or on an Azure integration runtime. The SAP ODP (preview) connector uses ODP to extract various data source (*provider*) types, including:

- SAP extractors, originally built to extract data from ECC and load it into BW
- ABAP CDS views, the new data extraction standard for S/4HANA
- InfoProviders and InfoObjects in BW and BW/4HANA
- SAP application tables, when you use an SLT replication server as a proxy

The providers run on SAP systems to produce either full or incremental data in an operational delta queue that's consumed by the Data Factory copy activity with the SAP CDC (preview) solution in the Data Factory pipeline (*subscriber*).

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-shir-architecture-diagram.png" border="false" alt-text="Diagram of the architecture of the SAP ODP framework through a self-hosted integration runtime.":::

Because ODP completely decouples providers from subscribers, any SAP documentation that offers provider configurations are applicable to Data Factory as a subscriber. For more information about ODP, see [Introduction to operational data provisioning](https://wiki.scn.sap.com/wiki/display/BI/Introduction+to+Operational+Data+Provisioning).

## Next steps

[Prerequisites and configure the SAP CDC (preview) solution](sap-change-data-capture-prerequisites-configuration.md)
