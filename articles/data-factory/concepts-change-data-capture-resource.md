---
title: Change Data Capture Resource
titleSuffix: Azure Data Factory
description: Learn more about the change data capture resource in Azure Data Factory.
author: n0elleli
ms.author: noelleli
ms.reviewer:
ms.service: data-factory
ms.subservice: data-movement
ms.custom:
ms.topic: conceptual
ms.date: 08/08/2023
---

# Change data capture resource overview
[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Adapting to the cloud-first big data world can be incredibly challenging for data engineers who are responsible for building complex data integration and ETL pipelines. 

Azure Data Factory is introducing a new mechanism to make the life of a data engineer easier. 

By automatically detecting data changes at the source without requiring complex designing or coding, ADF is making it a breeze to scale these processes. Change Data Capture will now exist as a **new native top-level resource** in the Azure Data Factory studio where data engineers can quickly configure continuously running jobs to process big data at scale with extreme efficiency. 

The new Change Data Capture resource in ADF allows for full fidelity change data capture that continuously runs in near real-time through a guided configuration experience. 

:::image type="content" source="media/adf-cdc/change-data-capture-resource-1.png" alt-text="Screenshot of new top-level resource in Factory Resources panel.":::

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE5geIG]

## Supported data sources

* Avro
* Azure Cosmos DB (SQL API)
* Azure SQL Database
* Azure SQL Managed Instance
* Delimited Text
* JSON
* ORC
* Parquet
* SQL Server
* XML
* Snowflake

## Supported targets

* Avro
* Azure SQL Database
* SQL Managed Instance
* Delimited Text
* Delta
* JSON
* ORC
* Parquet

## Known limitations
* Currently, when creating source/target mappings, each source and target is only allowed to be used once. 
* Complex types are currently unsupported.
* Self-hosted integration runtime (SHIR) is currently unsupported.

For more information on known limitations and troubleshooting assistance, please reference [this troubleshooting guide](change-data-capture-troubleshoot.md).


## Next steps
- [Learn how to set up a change data capture resource](how-to-change-data-capture-resource.md).
