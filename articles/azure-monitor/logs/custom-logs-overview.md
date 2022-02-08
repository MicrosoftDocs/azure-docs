---
title: Send custom logs to Azure Monitor Logs with REST API
description: Sending log data to Azure Monitor using custom logs API.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/06/2022

---

# Send custom logs to Azure Monitor Logs with REST API
With the DCR based custom logs API in Azure Monitor, you can send data to a Log Analytics workspace from any REST API client. This article describes the 

> [!NOTE]
> Logs direct ingestion API replaces the [data collector API](data-collector-api.md).


## Basic operation
The payload of your API call includes the source data formatted in JSON. Your call connects to a [data collection endpoint](../essentials/data-collection-endpoint-overview.md) and specifies a [data collection rule](../essentials/data-collection-rule-overview.md). The data collection rule understands the format of the source data, potentially filters it and transforms it for the target table, and then sends it to a specific table in a specific workspace. You can modify the target table and workspace by modifying the data collection rule without any change to the REST API call or source data.

:::image type="content" source="media/direct-ingestion/direct-ingestion-overview.png" alt-text="Overview diagram for direct ingestion" lightbox="media/direct-ingestion/direct-ingestion-overview.png":::

## Authentication
Authentication for direct log ingestion is performed at the data collection endpoint which uses standard Azure Resource Manager authentication. A common strategy is to use an Application ID and Application Key as described in [Direct log ingestion walkthrough](direct-ingestion-walkthrough.md).

## Tables
The target table must exist before you can send data to it. Direct ingestion can send data to a custom table that you create or an existing table provided by Microsoft. If the table doesn't already exist, you can create it and edit its columns in the Azure portal from **Tables (preview)** in the **Log Analytics workspaces menu**. You can also a REST API call to send the configuration of the table.

## Source data
The source data is formatted in JSON and must match the structure expected by the data collection rule. It doesn't necessarily need to match the structure of the target table since the DCR can use a transform to convert the data to match the table's structure.

## Data collection rule
[Data collection rules](../essentials/data-collection-rule-overview.md) define data collected by Azure Monitor and specify how and where that data should be sent or stored. The REST API call must specify a DCR to use. A single DCE can support multiple DCRs, so you can specify a different DCR for different sources and target tables.

The DCR must understand the structure of the input data and the structure of the target table. If the two don't match, it can use a transform to convert the source data to match the target table. You may also use the transform to filter source data and perform any other calculations or conversions.


## Next steps