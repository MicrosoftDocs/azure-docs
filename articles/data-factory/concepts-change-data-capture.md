---
title: Change Data Capture in Azure Data Factory & Azure Synapse Analytics
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about change data capture in Azure Data Factory and Azure Synapse Analytics.
author: kromerm
ms.author: makromer
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/26/2022
---

# Changed data capture in Azure Data Factory and Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes change data capture (CDC) in Azure Data Factory.

To learn more read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse](../synapse-analytics/overview-what-is.md).

## Overview

When performing data integration and ETL processes, your jobs can often perform much better and be more effective by only reading source data that has changed since the last time the pipeline ran, rather than always querying an entire dataset on aech run. Executing pipelines that only read the latest changed data is available in many of ADF's source connectors by simply enabling a checkbox property. Support for full-fidelity CDC, which inlcudes row markers for upserts, deletes, and updates, as well as rules for resetting the ADF-managed checkpoint are available in several connectors. Lastly, ADF supports patterns and templates for managing incremental pipelines with user-controlled checkpoints as well.

## CDC Connector support

| Connector   | Full CDC | Incremental CDC | Incremental pipeline pattern |
| :-------------------- | :--------------------------- | :--------------------------------- | :--------------------------- |
| [Azure Blob Storage](connector-azure-blob-storage.md) | &nbsp;    | ✓    | &nbsp;     |   
| [ADLS Gen1](load-azure-data-lake-store.md) | &nbsp; | ✓    | &nbsp;     |
| [ADLS Gen2](load-azure-data-lake-storage-gen2.md) | &nbsp; | ✓    | &nbsp;     |


Native connectors:
SAP CDC connectors
SQL connectors (MDF connectors watermark, CDC coming soon)
Blob store/ADLS
Cosmos DB
PostgresSQL
MySQL
CDM

ADF handles the checkpoint automatically for you

Add a section on how to reset and manage pipelines with change data



## Next steps

- [Learn how to use credentials from a user-assigned managed identity in a linked service](credentials.md).

See the following tutorials for step-by-step instructions for creating pipelines and datasets by using one of these tools or SDKs.

- [Quickstart: create a Data Factory using .NET](quickstart-create-data-factory-dot-net.md)
- [Quickstart: create a Data Factory using PowerShell](quickstart-create-data-factory-powershell.md)
- [Quickstart: create a Data Factory using REST API](quickstart-create-data-factory-rest-api.md)
- [Quickstart: create a Data Factory using Azure portal](quickstart-create-data-factory-portal.md)

