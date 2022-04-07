---
title: Use one-click ingestion to ingest data from Event Hub into Azure Synapse Data Explorer (Preview)
description: Learn how to use one-click to ingest (load) data into Azure Synapse Data Explorer from Event Hub.
ms.topic: how-to
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.reviewer: tzgitlin
ms.service: synapse-analytics
ms.subservice: data-explorer
---
# Use one-click ingestion to create an Event Hub data connection for Azure Synapse Data Explorer (Preview)

> [!div class="op_single_selector"]
> * [Portal](data-explorer-ingest-event-hub-portal.md)
> * [One-click](data-explorer-ingest-event-hub-one-click.md)
> * [C\#](data-explorer-ingest-event-hub-csharp.md)
> * [Python](data-explorer-ingest-event-hub-python.md)
> * [Azure Resource Manager template](data-explorer-ingest-event-hub-resource-manager.md)

Azure Synapse Data Explorer offers ingestion (data loading) from Event Hubs, a big data streaming platform and event ingestion service. [Event Hubs](../../../event-hubs/event-hubs-about.md) can process millions of events per second in near real-time. In this article, you connect an Event Hub to a table in Azure Synapse Data Explorer using the [one-click ingestion](data-explorer-ingest-data-one-click.md) experience.

## Prerequisites

[!INCLUDE [data-explorer-ingest-prerequisites](../includes/data-explorer-ingest-prerequisites.md)]

- [Event Hub with data for ingestion](data-explorer-ingest-event-hub-portal.md#create-an-event-hub).

> [!NOTE]
> Ingesting data from an Event Hub into Data Explorer pools will not work if your Synapse workspace uses a managed virtual network with data exfiltration protection enabled.

## Ingest new data

1. In Synapse Studio, on the left-side pane, select **Data**.

1. Under **Data Explorer Databases**, right-click the relevant database, and then select **Open in Azure Data Explorer**.

    :::image type="content" source="../media/ingest-data-one-click/open-azure-data-explorer-synapse.png" alt-text="Screenshot of Azure Synapse Studio, showing opening Azure Data Explorer in the context of a specific pool.":::

1. In the left menu of the Web UI, select the **Data** tab. 

    :::image type="content" source="../media/ingest-data-event-hub/one-click-ingestion-event-hub.png" alt-text="Select one-click ingest data from Event Hub in the web UI.":::

1. In the **Ingest data from Event Hub** card, select **Ingest**. 

The **Ingest new data** window opens with the **Destination** tab selected.

### Destination tab

:::image type="content" source="../media/ingest-data-one-click/select-azure-data-explorer-ingest-destination-table.png" alt-text="Screenshot of destination tab. Cluster, Database, and Table fields must be filled out before proceeding to Next-Source.":::

1. The **Cluster** and **Database** fields are auto-populated. You may select a different cluster or database from the drop-down menus.

1. Under **Table**, select **Create new table** and enter a name for the new table. Alternatively, use an existing table. 

    > [!NOTE]
    > Table names must be between 1 and 1024 characters. You can use alphanumeric, hyphens, and underscores. Special characters aren't supported.

1. Select **Next: Source**.

### Source tab

1. Under **Source type**, select **Event Hub**. 

1. Under **Data Connection**, fill in the following fields:

    :::image type="content" source="../media/ingest-data-one-click/select-azure-data-explorer-ingest-event-hub-details.png" alt-text="Screenshot of source tab with project details fields to be filled in - ingest new data to Azure Synapse Data Explorer with Event Hub in the one click experience.":::

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Data connection name | *ContosoDataConnection*  | The name that identifies your data connection.
    | Subscription |      | The subscription ID where the Event Hub resource is located.  |
    | Event Hub namespace |  | The name that identifies your namespace. |
    | Event Hub |  | The Event Hub you wish to use. |
    | Consumer group |  | The consumer group defined in your Event Hub. |
    | Event system properties | Select relevant properties | The [Event Hub system properties](../../../service-bus-messaging/service-bus-amqp-protocol-guide.md#message-annotations). If there are multiple records per event message, the system properties will be added to the first one. When adding system properties, [create](/azure/data-explorer/kusto/management/create-table-command?context=/azure/synapse-analytics/context/context) or [update](/azure/data-explorer/kusto/management/alter-table-command?context=/azure/synapse-analytics/context/context) table schema and [mapping](/azure/data-explorer/kusto/management/mappings?context=/azure/synapse-analytics/context/context) to include the selected properties. |

1. Select **Next: Schema**.

## Schema tab

Data is read from the Event Hub in form of [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) objects. Supported formats are CSV, JSON, PSV, SCsv, SOHsv TSV, TXT, and TSVE.

<!-- For information on schema mapping with JSON-formatted data, see [Edit the schema](one-click-ingestion-existing-table.md#edit-the-schema).
For information on schema mapping with CSV-formatted data, see [Edit the schema](one-click-ingestion-new-table.md#edit-the-schema). -->

:::image type="content" source="../media/ingest-data-event-hub/schema-tab.png" alt-text="Screenshot of schema tab in ingest new data to Azure Synapse Data Explorer with Event Hub in the one click experience.":::

1. If the data you see in the preview window is not complete, you may need more data to create a table with all necessary data fields. Use the following commands to fetch new data from your Event Hub:
    * **Discard and fetch new data**: discards the data presented and searches for new events.
    * **Fetch more data**: Searches for more events in addition to the events already found. 
    
    > [!NOTE]
    > To see a preview of your data, your Event Hub must be sending events.
        
1. Select **Next: Summary**.

## Continuous ingestion from Event Hub

In the **Continuous ingestion from Event Hub established** window, all steps will be marked with green check marks when establishment finishes successfully. The cards below these steps give you options to explore your data with **Quick queries**, undo changes made using **Tools**, or **Monitor** the Event Hub connections and data.

:::image type="content" source="../media/ingest-data-event-hub/data-ingestion-completed.png" alt-text="Screenshot of final screen in ingestion to Azure Synapse Data Explorer from Event Hub with the one click experience.":::

## Next steps

- [Analyze with Data Explorer](../../get-started-analyze-data-explorer.md)
- [Monitor Data Explorer pools](../data-explorer-monitor-pools.md)