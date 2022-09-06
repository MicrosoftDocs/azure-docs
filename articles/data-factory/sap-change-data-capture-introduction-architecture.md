---
title: Introduction and architecture for the SAP ODP (preview) connector
titleSuffix: Azure Data Factory
description: Learn about the SAP ODP (preview) connector in Azure Data Factory and understand its architecture.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Introduction to the SAP ODP (preview) connector in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article introduces and describes the architecture for SAP ODp (preview) connector in Azure Data Factory.

Azure Data Factory is a data integration (ETL and ELT) platform as a service (PaaS). For SAP data integration, Data Factory currently offers six connectors:

:::image type="content" source="media/sap-change-data-capture-solution/sap-supported-cdc-connectors.png" alt-text="Shows a list of the supported connectors for the SAP ODP solution.":::

The SAP connectors in Azure Data Factory can extract data only in batches. In batch mode, each batch handles existing and new data equally, without identifying data changes. This type of extraction mode isn’t optimal when you have large datasets like tables that have millions or billions of records that change often. To keep your copy of SAP data fresh and up-to-date, frequently extracting the dataset in full is expensive and inefficient. You can use a manual, limited workaround to extract mostly new or updated records. In a process called *watermarking*, extraction requires a timestamp column, monotonously increasing values, and continuously tracking the highest value since the last extraction. Some tables don't have a column that you can use for watermarking, and this process can’t handle deleted records.

Customers have indicated a need for a new connector that can extract only data changes (*deltas*). In data, a delta is any change to a dataset as a result of an update, insert, or deletion in the data. A delta extraction connector uses the [SAP changed data capture (CDC) feature](https://help.sap.com/docs/SAP_DATA_SERVICES/ec06fadc50b64b6184f835e4f0e1f52f/1752bddf523c45f18ce305ac3bcd7e08.html?q=change%20data%20capture) that exists in most SAP systems to determine the delta in a dataset. The new SAP ODP (preview) connector in Azure Data Factory uses the SAP Operational Data Provisioning (ODP) framework to replicate the delta in an SAP system.

The new connector connects to all SAP systems that support ODP, including R/3, ECC, S/4HANA, BW, and BW/4HANA. The connector works directly at the application layer or indirectly via an SAP Landscape Transformation (SLT) replication server as a proxy. It can either fully or incrementally extract SAP data that includes not only physical tables, but also logical objects created on top of those tables without watermarking. An example is SAP ABAP Core Data Services (CDS) views. Combined with existing Data Factory features, such as copy and data flow activities, pipeline templates, and tumbling window triggers, we can offer a low-latency SAP CDC or replication solution with a self-managed pipeline experience.

This article provides a high-level architecture of the SAP ODP (preview) connector in Azure Data Factory. See the related preview documentation for prerequisites, step-by-step guidelines to preview the connector, and the connector's current limitations.

## Architecture

The high-level architecture of the SAP ODP connector solution in Azure Data Factory is divided into SAP and Azure. The SAP side includes the SAP ODP connector that invokes the ODP API over standard Remote Function Call (RFC) modules to extract raw SAP data (full and delta). The Azure side includes the Data Factory copy activity that loads the raw SAP data into a storage destination like Azure Blob Storage or Azure Data Lake Storage Gen2. The data is saved in CSV or Parquet format, essentially archiving or preserving all historical changes.

The Azure side might include a Data Factory data flow activity that transforms the raw SAP data, merges all changes, and loads the result into any destination, like Azure SQL Database or Azure Synapse Analytics, essentially replicating the SAP data. The Data Factory data flow activity also can load the results into Data Lake Storage Gen2 in delta format, so a time travel capability can produce snapshots of SAP data at any specific period in the past. The SAP side and the Azure side can be combined as an SAP CDC or replication template to auto-generate a Data Factory pipeline. You can run the pipeline frequently by using a Data Factory tumbling-window trigger to replicate SAP data into Azure with low latency and without watermarking.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-architecture-diagram.png" border="false" alt-text="Diagram of the architecture of SAP CDC.":::

The Data Factory copy activity with SAP ODP connector runs on a self-hosted integration runtime that you install on your on-premises computer or virtual machine, so it has a line of sight to your SAP source systems and the SLT replication server. The Data Factory data flow activity runs on a serverless Azure Databricks or Apache Spark cluster, or on an Azure integration runtime. The SAP ODP connector via ODP can extract various data source (*provider*) types, including:

- SAP extractors, originally built to extract data from SAP ECC and load it into SAP BW
- ABAP CDS views, the new data extraction standard for SAP S/4HANA
- InfoProviders and InfoObjects in SAP BW and BW/4HANA
- SAP application tables, when using SLT replication server as a proxy

These providers run on SAP systems to produce either full or incremental data in an Operational Delta Queue that's consumed by the Data Factory copy activity with the SAP ODB connector in the Data Factory pipeline (*subscriber*).

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-shir-architecture-diagram.png" border="false" alt-text="Diagram of the architecture of SAP ODP through the self-hosted integration runtime.":::

Because ODP completely decouples providers from subscribers, any SAP documentation that offers provider configurations are applicable for Data Factory as a subscriber. For more information about ODP, see [Introduction to operational data provisioning](https://wiki.scn.sap.com/wiki/display/BI/Introduction+to+Operational+Data+Provisioning).

## Next steps

[Prerequisites and configuration of the SAP CDC solution](sap-change-data-capture-prerequisites-configuration.md)