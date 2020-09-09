---
title: Azure Data Factory connector overview 
description: Learn the supported connectors in Data Factory.
services: data-factory
author: linda33wj
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 08/31/2020
ms.author: jingwang
ms.reviewer: craigg
---

# Azure Data Factory connector overview

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Azure Data Factory supports the following data stores and formats via Copy, Data Flow, Look up, Get Metadata, and Delete activities. Click each data store to learn the supported capabilities and the corresponding configurations in details.

## Supported data stores

[!INCLUDE [Connector overview](../../includes/data-factory-v2-connector-overview.md)]

## Integrate with more data stores

Azure Data Factory can reach broader set of data stores than the list mentioned above. If you need to move data to/from a data store that is not in the Azure Data Factory built-in connector list, here are some extensible options:
- For database and data warehouse, usually you can find a corresponding ODBC driver, with which you can use [generic ODBC connector](connector-odbc.md).
- For SaaS applications:
    - If it provides RESTful APIs, you can use [generic REST connector](connector-rest.md).
    - If it has OData feed, you can use [generic OData connector](connector-odata.md).
    - If it provides SOAP APIs, you can use [generic HTTP connector](connector-http.md).
    - If it has ODBC driver, you can use [generic ODBC connector](connector-odbc.md).
- For others, check if you can load data to or expose data as any ADF supported data stores, e.g. Azure Blob/File/FTP/SFTP/etc, then let ADF pick up from there. You can invoke custom data loading mechanism via [Azure Function](control-flow-azure-function-activity.md), [Custom activity](transform-data-using-dotnet-custom-activity.md), [Databricks](transform-data-databricks-notebook.md)/[HDInsight](transform-data-using-hadoop-hive.md), [Web activity](control-flow-web-activity.md), etc.

## Supported file formats

Azure Data Factory supports the following file formats. Refer to each article for format-based settings.

- [Avro format](format-avro.md)
- [Binary format](format-binary.md)
- [Common Data Model format](format-common-data-model.md)
- [Delimited text format](format-delimited-text.md)
- [Delta format](format-delta.md)
- [Excel format](format-excel.md)
- [JSON format](format-json.md)
- [ORC format](format-orc.md)
- [Parquet format](format-parquet.md)
- [XML format](format-xml.md)

## Next steps

- [Copy activity](copy-activity-overview.md)
- [Mapping Data Flow](concepts-data-flow-overview.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Delete Activity](delete-activity.md)
