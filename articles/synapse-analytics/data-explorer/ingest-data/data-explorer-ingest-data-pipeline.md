---
title: 'Quickstart: Get started ingesting data with pipelines (Preview)'
description: In this quickstart, you'll learn to ingest data to Data Explorer pools using Azure Synapse Pipelines.
ms.topic: quickstart
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.reviewer: tzgitlin
ms.service: synapse-analytics
ms.subservice: data-explorer
ms.custom: mode-other
---

# Quickstart: Ingest data using Azure Synapse Pipelines (Preview)

In this quickstart, you learn how to load data from a data source into Azure Synapse Data Explorer pool.

## Prerequisites

[!INCLUDE [data-explorer-ingest-prerequisites](../includes/data-explorer-ingest-prerequisites.md)]

- Create a table
    [!INCLUDE [data-explorer-ingest-prerequisites](../includes/data-explorer-create-table-studio.md)]

    ```Kusto
    .create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)
    ```

    > [!TIP]
    > Verify that the table was successfully created. On the left-side pane, select **Data**, select the *contosodataexplorer* more menu, and then select **Refresh**. Under *contosodataexplorer*, expand **Tables** and make sure that the *StormEvents* table appears in the list.

- Get the Query and Data Ingestion endpoints. You'll need the query endpoint to configure your linked service.
    [!INCLUDE [data-explorer-get-endpoint](../includes/data-explorer-get-endpoint.md)]

## Create a linked service

In Azure Synapse Analytics, a linked service is where you define your connection information to other services. In this section, you'll create a linked service for Azure Data Explorer.

1. In Synapse Studio, on the left-side pane, select **Manage** > **Linked services**.
1. Select **&plus; New**.

    :::image type="content" source="../media/ingest-data-pipeline/add-new-data-explorer-linked-service.png" alt-text="Screenshot of the Linked services screen, showing the list of existing services and highlighting the add new button.":::

1. Select the **Azure Data Explorer** service from the gallery, and then select **Continue**.

    :::image type="content" source="../media/ingest-data-pipeline/select-new-data-explorer-linked-service.png" alt-text="Screenshot of the new Linked services pane, showing the list of available services and highlighting the add new Azure Data Explorer service.":::

1. In the New Linked Services page, use the following information:

    | Setting | Suggested value | Description |
    |--|--|--|
    | Name | *contosodataexplorerlinkedservice* | The name for the new Azure Data Explorer linked service. |
    | Authentication method | *Managed Identity* | The authentication method for the new service. |
    | Account selection method | *Enter manually* | The method for specifying the Query endpoint. |
    | Endpoint | *https:\/\/contosodataexplorer.contosoanalytics.dev.kusto.windows.net* | The Query endpoint you made a [note of earlier](#prerequisites). |
    | Database | *TestDatabase* | The database where you want to ingest data. |

    :::image type="content" source="../media/ingest-data-pipeline/create-new-data-explorer-linked-service.png" alt-text="Screenshot of the new Linked services details pane, showing the fields that need to be completed for the new service.":::

1. Select **Test connection** to validate the settings, and then select **Create**.

## Create a pipeline to ingest data

A pipeline contains the logical flow for an execution of a set of activities. In this section, you'll create a pipeline containing a copy activity that ingests data from your preferred source into a Data Explorer pool.

1. In Synapse Studio, on the left-side pane, select **Integrate**.

1. Select **&plus;** > **Pipeline**. On the right-side pane, you can name your pipeline.

    :::image type="content" source="../media/ingest-data-pipeline/add-new-data-explorer-pipeline.png" alt-text="Screenshot showing the selection for creating a new pipeline.":::

1. Under **Activities** > **Move & transform**, drag **Copy data** onto the pipeline canvas.
1. Select the copy activity and go to the **Source** tab. Select or create a new source dataset as the source to copy data from.
1. Go to the **Sink** tab. Select **New** to create a new sink dataset.

    :::image type="content" source="../media/ingest-data-pipeline/add-data-explorer-pipeline-copy-sink.png" alt-text="Screenshot of the pipeline copy activity, showing the selection for creating a new sink.":::

1. Select the **Azure Data Explorer** dataset from the gallery, and then select **Continue**.
1. In the **Set properties** pane, use the following information, and then select **OK**.

    | Setting | Suggested value | Description |
    |--|--|--|
    | Name | *AzureDataExplorerTable* | The name for the new pipeline. |
    | Linked service | *contosodataexplorerlinkedservice* | The linked service you created earlier. |
    | Table | *StormEvents* | The table you created earlier. |

    :::image type="content" source="../media/ingest-data-pipeline/add-data-explorer-pipeline-copy-sink-set-properties.png" alt-text="Screenshot of the pipeline copy activity set properties pane, showing the fields that need to be completed for the new sink.":::

1. To validate the pipeline, select **Validate** on the toolbar. You see the result of the Pipeline validation output on the right side of the page.

## Debug and publish the pipeline

Once you've finished configuring your pipeline, you can execute a debug run before you publish your artifacts to verify everything is correct.

1. Select **Debug** on the toolbar. You see the status of the pipeline run in the **Output** tab at the bottom of the window.

1. Once the pipeline run succeeds, in the top toolbar, select **Publish all**. This action publishes entities (datasets and pipelines) you created to the Synapse Analytics service.
1. Wait until you see the **Successfully published** message. To see notification messages, select the bell button in the top-right.

## Trigger and monitor the pipeline

In this section, you manually trigger the pipeline published in the previous step.

1. Select **Add Trigger** on the toolbar, and then select **Trigger Now**. On the **Pipeline Run** page, select **OK**.

1. Go to the **Monitor** tab located in the left sidebar. You see a pipeline run that is triggered by a manual trigger.
1. When the pipeline run completes successfully, select the link under the **Pipeline name** column to view activity run details or to rerun the pipeline. In this example, there's only one activity, so you see only one entry in the list.
1. For details about the copy operation, select the **Details** link (eyeglasses icon) under the **Activity name** column. You can monitor details like the volume of data copied from the source to the sink, data throughput, execution steps with corresponding duration, and used configurations.
1. To switch back to the pipeline runs view, select the **All pipeline runs** link at the top. Select **Refresh** to refresh the list.
1. Verify your data is correctly written in the Data Explorer pool.

## Next steps

- [Analyze with Data Explorer](../../get-started-analyze-data-explorer.md)
- [Monitor Data Explorer pools](../data-explorer-monitor-pools.md)
