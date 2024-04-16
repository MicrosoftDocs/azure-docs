---
title: 'Quickstart: Get started analyzing with Data Explorer pools (Preview)'
description: In this quickstart, you'll learn to analyze data with Data Explorer.
ms.topic: quickstart
ms.date: 11/18/2022
author: shsagir
ms.author: shsagir
ms.reviewer: shsagir
ms.service: synapse-analytics
ms.subservice: data-explorer
ms.custom: mode-other
---

# Quickstart: Analyze with Data Explorer (Preview)

In this article, you'll learn the basic steps to load and analyze data with Data Explorer for Azure Synapse.

## Create a Data Explorer pool

1. In Synapse Studio, on the left-side pane, select **Manage** > **Data Explorer pools**.
1. Select **New**, and then enter the following details on the **Basics** tab:

    | Setting | Suggested value | Description |
    |--|--|--|
    | Data Explorer pool name | contosodataexplorer | This is the name that the Data Explorer pool will have. |
    | Workload | Compute optimized | This workload provides a higher CPU to SSD storage ratio. |
    | Node size | Small (4 cores) | Set this to the smallest size to reduce costs for this quickstart |

    > [!IMPORTANT]
    > Note that there are specific limitations for the names that Data Explorer pools can use. Names must contain lowercase letters and numbers only, must be between 4 and 15 characters, and must start with a letter.

1. Select **Review + create** > **Create**. Your Data Explorer pool will start the provisioning process.

## Create a Data Explorer database

1. In Synapse Studio, on the left-side pane, select **Data**.
1. Select **&plus;** (Add new resource) > **Data Explorer database**, and paste the following information:

    | Setting | Suggested value | Description |
    |--|--|--|
    | Pool name | *contosodataexplorer* | The name of the Data Explorer pool to use |
    | Name | *TestDatabase* | The database name must be unique within the cluster. |
    | Default retention period | *365* | The time span (in days) for which it's guaranteed that the data is kept available to query. The time span is measured from the time that data is ingested. |
    | Default cache period | *31* | The time span (in days) for which to keep frequently queried data available in SSD storage or RAM, rather than in longer-term storage. |

1. Select **Create** to create the database. Creation typically takes less than a minute.

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
    .ingest into table StormEvents 'https://kustosamples.blob.core.windows.net/samplefiles/StormEvents.csv' with (ignoreFirstRecord=true)
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

- [Tutorial: Use KQL queries](/azure/data-explorer/kusto/query/tutorial?context=/azure/synapse-analytics/context/context&pivots=synapse)
- [Monitor Data Explorer pools](data-explorer/data-explorer-monitor-pools.md)
