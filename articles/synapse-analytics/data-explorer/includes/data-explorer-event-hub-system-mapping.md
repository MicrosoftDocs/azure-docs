---
ms.topic: include
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.service: synapse-analytics
ms.subservice: data-explorer
---
> [!NOTE]
> * System properties are supported for `json` and tabular formats (`csv`, `tsv` etc.) and aren't supported on compressed data. When using a non-supported format, the data will still be ingested, but the properties will be ignored.
> * For tabular data, system properties are supported only for single-record event messages.
> * For JSON data, system properties are also supported for multiple-record event messages. In such cases, the system properties are added only to the first record of the event message. 
> * For `csv` mapping, properties are added at the beginning of the record in the order listed in the [System properties](../ingest-data/data-explorer-ingest-event-hub-overview.md#system-properties) table.
> * For `json` mapping, properties are added according to property names in the [System properties](../ingest-data/data-explorer-ingest-event-hub-overview.md#system-properties) table.
