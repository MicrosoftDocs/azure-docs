---
ms.topic: include
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.service: synapse-analytics
ms.subservice: data-explorer
---
1. In Synapse Studio, on the left-side pane, select **Manage** > **Data Explorer pools**.
1. Select the Data Explorer pool you want to use to view its details.

    :::image type="content" source="../media/ingest-data-pipeline/select-data-explorer-pool.png" alt-text="Screenshot of the Data Explorer pools screen, showing the list of existing pools.":::

1. Make a note of the Query and Data Ingestion endpoints. Use the Query endpoint as the cluster when configuring connections to your Data Explorer pool. When configuring SDKs for data ingestion, use the data ingestion endpoint.

    :::image type="content" source="../media/ingest-data-pipeline/select-data-explorer-pool-properties-endpoints.png" alt-text="Screenshot of the Data Explorer pools properties pane, showing the Query and Data Ingestion URI addresses.":::
