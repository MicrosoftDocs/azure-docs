---
title: 'Quickstart: Get started ingesting data with One-click (Preview)'
description: In this quickstart, you'll learn to ingest data to Data Explorer pools using One-click.
ms.topic: quickstart
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.reviewer: tzgitlin
ms.service: synapse-analytics
ms.subservice: data-explorer
ms.custom: mode-other
---

# Quickstart: Ingest data using One-click (Preview)

One-click ingestion makes the data ingestion process easy, fast, and intuitive. One-click ingestion helps you ramp-up quickly to start ingesting data, creating database tables, mapping structures. Select data from different kinds of sources in different data formats, either as a one-time or continuous ingestion process.

The following features make one-click ingestion so useful:

* Intuitive experience guided by the ingestion wizard
* Ingest data in a matter of minutes
* Ingest data from different kinds of sources: local file, blobs, and containers (up to 10,000 blobs)
* Ingest data in a variety of [formats](#file-formats)
* Ingest data into new or existing tables
* Table mapping and schema are suggested to you and easy to change
<!-- * Continue ingestion easily and quickly from a container with [Event Grid](one-click-ingestion-new-table.md#create-continuous-ingestion) -->

One-click ingestion is particularly useful when ingesting data for the first time, or when your data's schema is unfamiliar to you.

## Prerequisites

[!INCLUDE [data-explorer-ingest-prerequisites](../includes/data-explorer-ingest-prerequisites.md)]

- Create a table
    [!INCLUDE [data-explorer-ingest-prerequisites](../includes/data-explorer-create-table-studio.md)]

    ```Kusto
    .create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)
    ```

    > [!TIP]
    > Verify that the table was successfully created. On the left-side pane, select **Data**, select the *contosodataexplorer* more menu, and then select **Refresh**. Under *contosodataexplorer*, expand **Tables** and make sure that the *StormEvents* table appears in the list.

## Access the one-click wizard

The one-click ingestion wizard guides you through the one-click ingestion process.

* To access the wizard from Azure Synapse:

    1. In Synapse Studio, on the left-side pane, select **Data**.
    1. Under **Data Explorer Databases**, right-click the relevant database, and then select **Open in Azure Data Explorer**.

        :::image type="content" source="../media/ingest-data-one-click/open-azure-data-explorer-synapse.png" alt-text="Screenshot of Azure Synapse Studio, showing opening Azure Data Explorer in the context of a specific pool.":::

    1. Right-click the relevant pool, and then select **Ingest new data**.

* To access the wizard from the Azure portal:

    1. In the Azure portal, search for and select the relevant Synapse workspace.
    1. Under **Data Explorer pools**, select the relevant pool.
    1. On the **Welcome to Data Explorer pool** home screen, select **Ingest new data**.

        :::image type="content" source="../media/ingest-data-one-click/open-azure-data-explorer-portal.png" alt-text="Screenshot of the Azure portal, showing opening Azure Data Explorer in the context of a specific pool.":::


* To access the wizard from the Azure Data Explorer web ui:

    1. Before you start, use the following steps to get the Query and Data Ingestion endpoints.
        [!INCLUDE [data-explorer-get-endpoint](../includes/data-explorer-get-endpoint.md)]
    1. In the Azure Data Explorer web ui, add a connection to the *Query endpoint*.
    1. Select **Query** from the left menu, right-click on the **database** or **table**, and select **Ingest new data**.

## One-click ingestion wizard

> [!NOTE]
> This section describes the wizard using Event Hub as the data source. You can also use these steps to ingest data from a blob, file, blob container, and a ADLS Gen2 container.
>
> Replace the example values with actual values for your Synapse workspace.

1. On the **Destination** tab, choose the database and table for the ingested data.

    :::image type="content" source="../media/ingest-data-one-click/select-azure-data-explorer-ingest-destination-table.png" alt-text="Screenshot of the Azure Data Explorer one-click ingestion wizard, showing the selection of a database and table.":::

1. On the **Source** tab:
    1. Select *Event Hub* as the **Source type** for the ingestion.

        :::image type="content" source="../media/ingest-data-one-click/select-azure-data-explorer-ingest-source-type.png" alt-text="Screenshot of the Azure Data Explorer one-click ingestion wizard, showing the selection of the source type.":::

    1. Fill out the Event Hub data connection details using the following information:

        | Setting | Example value | Description |
        |--|--|--|
        | Data connection name | *ContosoDataConnection* | The name of the Event Hub data connection |
        | Subscription | *Contoso_Synapse* | The subscription where the Event Hub resides. |
        | Even Hub namespace | *contosoeventhubnamespace* | The namespace of the Event Hub. |
        | Consumer group | *contosoconsumergroup* | The name of the Even Hub consumer group. |

        :::image type="content" source="../media/ingest-data-one-click/select-azure-data-explorer-ingest-event-hub-details.png" alt-text="Screenshot of the Azure Data Explorer one-click ingestion wizard, showing the Event Hub connection details.":::

    1. Select **Next**.

### Schema mapping

The service automatically generates schema and ingestion properties, which you can change. You can use an existing mapping structure or create a new one, depending on if you're ingesting to a new or existing table.

In the **Schema** tab, do the following actions:
   1. Confirm the autogenerated compression type.
   1. Choose the [format of your data](#file-formats). Different formats will allow you to make further changes.
   1. Change mapping in the [Editor window](#editor-window).

#### File formats

One-click ingestion supports ingesting from source data in all [data formats supported by Data Explorer for ingestion](data-explorer-ingest-data-supported-formats.md).

### Editor window

In the **Editor** window of the **Schema** tab, you can adjust data table columns as necessary.

The changes you can make in a table depend on the following parameters:

* **Table** type is new or existing
* **Mapping** type is new or existing

Table type | Mapping type | Available adjustments|
|---|---|---|
|New table   | New mapping |Change data type, Rename column, New column, Delete column, Update column, Sort ascending, Sort descending  |
|Existing table  | New mapping | New column (on which you can then change data type, rename, and update),<br> Update column, Sort ascending, Sort descending  |
| | Existing mapping | Sort ascending, Sort descending

> [!NOTE]
> When adding a new column or updating a column, you can change mapping transformations. For more information, see [Mapping transformations](#mapping-transformations)

<!-- >[!NOTE]
> At any time, you can open the [command editor](one-click-ingestion-new-table.md#command-editor) above the **Editor** pane. In the command editor, you can view and copy the automatic commands generated from your inputs. -->

#### Mapping transformations

Some data format mappings (Parquet, JSON, and Avro) support simple ingest-time transformations. To apply mapping transformations, create or update a column in the [Editor window](#editor-window).

Mapping transformations can be performed on a column of **Type** string or datetime, with the **Source** having data type int or long. Supported mapping transformations are:

* DateTimeFromUnixSeconds
* DateTimeFromUnixMilliseconds
* DateTimeFromUnixMicroseconds
* DateTimeFromUnixNanoseconds

### Data ingestion

Once you have completed schema mapping and column manipulations, the ingestion wizard will start the data ingestion process.

* When ingesting data from **non-container** sources, the ingestion will take immediate effect.

* If your data source is a **container**:
    * Data Explorer's [batching policy](/azure/data-explorer/kusto/management/batchingpolicy?context=/azure/synapse-analytics/context/context) will aggregate your data.
    * After ingestion, you can download the ingestion report and review the performance of each blob that was addressed.
    <!-- * You can select **Create continuous ingestion** and set up [continuous ingestion using Event Grid](one-click-ingestion-new-table.md#create-continuous-ingestion). -->

### Initial data exploration

After ingestion, the wizard gives you options to use **Quick commands** for initial exploration of your data.

## Next steps

- [Analyze with Data Explorer](../../get-started-analyze-data-explorer.md)
- [Monitor Data Explorer pools](../data-explorer-monitor-pools.md)
