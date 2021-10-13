---
title: 'Quickstart: Get started ingesting data with pipelines (Preview)'
description: In this quickstart, you'll learn to ingest data to Data Explorer pools using Azure Synapse Pipelines.
ms.topic: quickstart
ms.date: 09/30/2021
author: shsagir
ms.author: shsagir
ms.reviewer: tzgitlin
services: synapse-analytics
ms.service: synapse-analytics
ms.subservice: data-explorer
---

# Quickstart: Ingest data using Azure Synapse Pipelines (Preview)

In this article, you'll learn how to set up a Azure Synapse Analytics Linked service to ingest data using Sy.

## Prerequisites

Create a Data Explorer pool using [Synapse Studio](../data-explorer-create-pool-studio.md) or [the Azure portal](../data-explorer-create-pool-portal.md)

## Before you start

Use these steps to get the Query and Data Ingestion endpoints for use with external services, tools, or SDKs.

1. In Synapse Studio, on the left-side pane, select **Manage** > **Data Explorer pools**.
1. Select the Data Explorer pool you want to use to view its details.

    :::image type="content" source="../media/ingest-data-pipeline/select-data-explorer-pool-properties-endpoints.png" alt-text="Screenshot of the Data Explorer pools screen, showing the list of existing pools.":::

1. Make a note of the Query and Data Ingestion endpoints. You'll need them later.

    :::image type="content" source="../media/ingest-data-pipeline/select-data-explorer-pool-properties-endpoints.png" alt-text="Screenshot of the Data Explorer pools properties pane, showing the Query and Data Ingestion URI addresses.":::

## Create a Data Explorer database

1. In Synapse Studio, on the left-side pane, select **Data**.
1. Select **&plus;** (Add new resource) > **Data Explorer pool**, and paste the following information:


    | Setting | Suggested value | Description |
    |--|--|--|
    | Pool name | *contosodataexplorer* | The name of the Data Explorer pool to use |
    | Name | *TestDatabase* | The database name must be unique within the cluster. |
    | Default retention period | *365* | The time span (in days) for which it's guaranteed that the data is kept available to query. The time span is measured from the time that data is ingested. |
    | Default cache period | *31* | The time span (in days) for which to keep frequently queried data available in SSD storage or RAM, rather than in longer-term storage. |

1. Select **Create** to create the database. Creation typically takes less than a minute.

## Add a linked service

1. In Synapse Studio, on the left-side pane, select **Manage** > **Linked services**.
1. Select **&plus; New**.

    :::image type="content" source="../media/ingest-data-pipeline/add-new-data-explorer-linked-service.png" alt-text="Screenshot of the Linked services screen, showing the list of existing services and highlighting the add new button.":::

1. Select **Azure Data Explorer** service.

    :::image type="content" source="../media/ingest-data-pipeline/select-new-data-explorer-linked-service.png" alt-text="Screenshot of the new Linked services pane, showing the list of available services and highlighting the add new Azure Data Explorer service.":::

1. Paste the following information:

    | Setting | Suggested value | Description |
    |--|--|--|
    | Name | *contosodataexplorerlinkedservice* | The name for the new Azure Data Explorer linked service. |
    | Authentication method | *Managed Identity* | The authentication method for the new service. |
    | Account selection method | *Enter manually* | The method for specifying the Query endpoint. |
    | Endpoint | *https:\/\/contosodataexplorer.contosoanalytics.dev.kusto.windows.net* | The Query endpoint you made a [note of earlier](#before-you-start). |
    | Database | *TestDatabase* | The database where you want to ingest data. |

    :::image type="content" source="../media/ingest-data-pipeline/create-new-data-explorer-linked-service.png" alt-text="Screenshot of the new Linked services details pane, showing the fields that need to be completed for the new service.":::

1. Select **Test connection** to verify the linked service is working, and then select **Create** to finish.

## Ingest sample data and analyze with a simple query

1. In Synapse Studio, on the left-side pane, select **Develop**.
1. Under **KQL scripts**, Select **&plus;** (Add new resource) > **KQL script**. On the right-side pane, you can name your script.
1. In the **Connect to** menu, select *contosodataexplorer*.
1. In the **Use database** menu, select *TestDatabase*.
1. Paste in the following command, and select **Run** to create a StormEvents table.

    ```Kusto
    .create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)
    ```

    > [!TIP]
    > Verify that the table was successfully created. On the left-side pane, select **Data**, select the *contosodataexplorer* more menu, and then select **Refresh**. Under *contosodataexplorer*, expand **Tables** and make sure that the *StormEvents* table appears in the list.

1. Paste in the following command, and select **Run** to ingest data into StormEvents table.

    ```Kusto
    .ingest into table StormEvents 'https://kustosamplefiles.blob.core.windows.net/samplefiles/StormEvents.csv?sv=2019-12-12&ss=b&srt=o&sp=r&se=2022-09-05T02:23:52Z&st=2020-09-04T18:23:52Z&spr=https&sig=VrOfQMT1gUrHltJ8uhjYcCequEcfhjyyMX%2FSc3xsCy4%3D' with (ignoreFirstRecord=true)
    ```

1. After ingestion completes, paste in the following query, select the query in the window, and select **Run**.

    ```Kusto
    StormEvents
    | sort by StartTime desc
    | take 10
    ```

    The query returns the following results from the ingested sample data.

    :::image type="content" source="data-explorer/media/get-started-analyze-data-explorer/sample-query-results.png" alt-text="Results for query run on sample data":::

## Next steps

[Tutorial: Use KQL queries](/azure/data-explorer/kusto/query/tutorial?context=/azure/synapse-analytics/context/context&pivots=synapse)
