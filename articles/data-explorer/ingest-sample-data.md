---
title: Ingest sample data into Azure Data Explorer
description: Learn about how to ingest (load) weather-related sample data into Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 09/24/2018
---

# Ingest sample data into Azure Data Explorer

This article shows you how to ingest (load) sample data into an Azure Data Explorer database. There are [several ways to ingest data](ingest-data-overview.md); this article focuses on a basic approach that is suitable for testing purposes.

> [!NOTE]
> You already have this data if you completed [Quickstart: Ingest data using the Azure Data Explorer Python library](python-ingest-data.md).

## Prerequisites

[A test cluster and database](create-cluster-database-portal.md)

## Ingest data

The **StormEvents** sample data set contains weather-related data from the [National Centers for Environmental Information](https://www.ncdc.noaa.gov/stormevents/).

1. Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com).

1. In the upper-left of the application, select **Add cluster**.

1. In the **Add cluster** dialog box, enter your cluster URL in the form `https://<ClusterName>.<Region>.kusto.windows.net/`, then select **Add**.

1. Paste in the following command, and select **Run**.

    ```Kusto
    .create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)

    .ingest into table StormEvents h'https://kustosamplefiles.blob.core.windows.net/samplefiles/StormEvents.csv?st=2018-08-31T22%3A02%3A25Z&se=2020-09-01T22%3A02%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=LQIbomcKI8Ooz425hWtjeq6d61uEaq21UVX7YrM61N4%3D' with (ignoreFirstRecord=true)
    ```

1. After ingestion completes, paste in the following query, select the query in the window, and select **Run**.

    ```Kusto
    StormEvents
    | sort by StartTime desc
    | take 10
    ```
    The query returns the following results from the ingested sample data.

    ![Query results](media/ingest-sample-data/query-results.png)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Query data in Azure Data Explorer](web-query-data.md)

> [!div class="nextstepaction"]
> [Write queries](write-queries.md)

> [!div class="nextstepaction"]
> [Azure Data Explorer data ingestion](ingest-data-overview.md)