---
ms.topic: include
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.service: synapse-analytics
ms.subservice: data-explorer
---
|**Property** | **Property description**|
|---|---|
| `rawSizeBytes` | Size of the raw (uncompressed) data. For Avro/ORC/Parquet, that is the size before format-specific compression is applied. Provide the original data size by setting this property to the uncompressed data size in bytes.|
| `kustoTable` |  Name of the existing target table. Overrides the `Table` set on the `Data Connection` blade. |
| `kustoDataFormat` |  Data format. Overrides the `Data format` set on the `Data Connection` blade. |
| `kustoIngestionMappingReference` |  Name of the existing ingestion mapping to be used. Overrides the `Column mapping` set on the `Data Connection` blade.|
| `kustoIgnoreFirstRecord` | If set to `true`, Kusto ignores the first row of the blob. Use in tabular format data (CSV, TSV, or similar) to ignore headers. |
| `kustoExtentTags` | String representing [tags](/azure/data-explorer/kusto/management/extents-overview?context=/azure/synapse-analytics/context/context) that will be attached to resulting extent. |
| `kustoCreationTime` |  Overrides [$IngestionTime](/azure/data-explorer/kusto/query/ingestiontimefunction?context=/azure/synapse-analytics/context/context?pivots=azuredataexplorer) for the blob, formatted as an ISO 8601 string. Use for backfilling. |
