---
title: Custom log ingestion in Azure Monitor
description: Sending log data to Azure Monitor using custom logs API.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/06/2022

---

# Direct log ingestion in Azure Monitor
With direct ingestion, you can send data to a Log Analytics workspace from a custom application through a REST API.

The source data is formatted in JSON and sent to a Data Collection endpoint 

:::image type="content" source="media/direct-ingestion/direct-ingestion-overview.png" alt-text="Overview diagram for direct ingestion" lightbox="media/direct-ingestion/direct-ingestion-overview.png":::

## Source data


## Data collection endpoint
Data collection endpoint contains the following:

Defines the REST API endpoint to receive data from custom application. Includes the transform to apply to the source data and the workspace and table to receive it.


## Next steps