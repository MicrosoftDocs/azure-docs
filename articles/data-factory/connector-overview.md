---
title: Azure Data Factory connector overview 
description: Learn the supported connectors in Data Factory.
services: data-factory
author: linda33wj
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 12/10/2019
ms.author: jingwang
ms.reviewer: craigg
---

# Azure Data Factory connector overview

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Azure Data Factory support the following data stores and formats via Copy, Data Flow, Look-up, Get Metadata, and Delete activities. Click each data store to learn the supported capabilities and the corresponding configurations in details.

## Supported data stores

[!INCLUDE [Connector overview](../../includes/data-factory-v2-connector-overview.md)]

## Supported file formats

Azure Data Factory supports the following file formats. Refer to each article for format-based settings.

- [Avro format](../articles/data-factory/format-avro.md)
- [Binary format](../articles/data-factory/format-binary.md)
- [Common Data Model format](../articles/data-factory/format-common-data-model.md)
- [Delimited text format](../articles/data-factory/format-delimited-text.md)
- [Excel format](../articles/data-factory/format-excel.md)
- [JSON format](../articles/data-factory/format-json.md)
- [ORC format](../articles/data-factory/format-orc.md)
- [Parquet format](../articles/data-factory/format-parquet.md)

## Next steps

- [Copy activity](copy-activity-overview.md)
- [Mapping Data Flow](concepts-data-flow-overview.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Delete Activity](delete-activity.md)
