---
title: Azure Synapse Data Explorer data ingestion overview (Preview)
description: Learn about the different ways you can ingest (load) data in Azure Synapse Data Explorer.
ms.topic: overview
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.reviewer: tzgitlin
ms.service: synapse-analytics
ms.subservice: data-explorer
---

# Azure Synapse Data Explorer data ingestion overview (Preview)

Data ingestion is the process used to load data records from one or more sources to import data into a table in Azure Synapse Data Explorer pool. Once ingested, the data becomes available for query.

The Azure Synapse Data Explorer data management service, which is responsible for data ingestion, implements the following process:

- Pulls data in batches or streaming from an external source and reads requests from a pending Azure queue.
- Batch data flowing to the same database and table is optimized for ingestion throughput.
- Initial data is validated and the format is converted where necessary.
- Further data manipulation including matching schema, organizing, indexing, encoding, and compressing the data.
- Data is persisted in storage according to the set retention policy.
- Ingested data is committed into the engine, where it's available for query.

## Supported data formats, properties, and permissions

* **[Supported data formats](data-explorer-ingest-data-supported-formats.md)**

* **[Ingestion properties](data-explorer-ingest-data-properties.md)**: The properties that affect how the data will be ingested (for example, tagging, mapping, creation time).

* **Permissions**: To ingest data, the process requires [database ingestor level permissions](/azure/data-explorer/kusto/management/access-control/role-based-authorization?context=/azure/synapse-analytics/context/context). Other actions, such as query, may require database admin, database user, or table admin permissions.

## Batching vs streaming ingestions

* Batching ingestion does data batching and is optimized for high ingestion throughput. This method is the preferred and most performant type of ingestion. Data is batched according to ingestion properties. Small batches of data are merged and optimized for fast query results. The [ingestion batching](/azure/data-explorer/kusto/management/batchingpolicy?context=/azure/synapse-analytics/context/context) policy can be set on databases or tables. By default, the maximum batching value is 5 minutes, 1000 items, or a total size of 1 GB.  The data size limit for a batch ingestion command is 4 GB.

* [Streaming ingestion](data-explorer-ingest-data-streaming.md) is ongoing data ingestion from a streaming source. Streaming ingestion allows near real-time latency for small sets of data per table. Data is initially ingested to row store, then moved to column store extents.

## Ingestion methods and tools

Azure Synapse Data Explorer supports several ingestion methods, each with its own target scenarios. These methods include ingestion tools, connectors and plugins to diverse services, managed pipelines, programmatic ingestion using SDKs, and direct access to ingestion.

### Ingestion using managed pipelines

For organizations who wish to have management (throttling, retries, monitors, alerts, and more) done by an external service, using a connector is likely the most appropriate solution. Queued ingestion is appropriate for large data volumes. Azure Synapse Data Explorer supports the following Azure Pipelines:

<!-- * **[Event Grid](https://azure.microsoft.com/services/event-grid/)**: A pipeline that listens to Azure storage, and updates Azure Synapse Data Explorer to pull information when subscribed events occur. For more information, see [Ingest Azure Blobs into Azure Synapse Data Explorer](ingest-data-event-grid.md). -->

* **[Event Hub](https://azure.microsoft.com/services/event-hubs/)**: A pipeline that transfers events from services to Azure Synapse Data Explorer. For more information, see [Ingest data from Event Hub into Azure Synapse Data Explorer](data-explorer-ingest-event-hub-overview.md).

<!-- * **[IoT Hub](https://azure.microsoft.com/services/iot-hub/)**: A pipeline that is used for the transfer of data from supported IoT devices to Azure Synapse Data Explorer. For more information, see [Ingest from IoT Hub](ingest-data-iot-hub.md). -->

* **Synapse pipelines**: A fully managed data integration service for analytic workloads in [Synapse pipelines](../../../data-factory/copy-activity-overview.md?context=%2fazure%2fsynapse-analytics%2fcontext%2fcontext&tabs=synapse-analytics) connects with over 90 supported sources to provide efficient and resilient data transfer. Synapse pipelines prepares, transforms, and enriches data to give insights that can be monitored in different kinds of ways. This service can be used as a one-time solution, on a periodic timeline, or triggered by specific events.

<!-- ### Ingestion using connectors and plugins

* **Logstash plugin**, see [Ingest data from Logstash to Azure Synapse Data Explorer](ingest-data-logstash.md).

* **Kafka connector**, see [Ingest data from Kafka into Azure Synapse Data Explorer](ingest-data-kafka.md).

* **[:::no-loc text="Power Automate":::](https://flow.microsoft.com/)**: An automated workflow pipeline to Azure Synapse Data Explorer. :::no-loc text="Power Automate"::: can be used to execute a query and do preset actions using the query results as a trigger. See [Azure Synapse Data Explorer connector to :::no-loc text="Power Automate"::: (Preview)](flow.md).

* **Apache Spark connector**: An open-source project that can run on any Spark cluster. It implements data source and data sink for moving data across Azure Synapse Data Explorer and Spark clusters. You can build fast and scalable applications targeting data-driven scenarios. See [Azure Synapse Data Explorer Connector for Apache Spark](spark-connector.md). -->

### Programmatic ingestion using SDKs

Azure Synapse Data Explorer provides SDKs that can be used for query and data ingestion. Programmatic ingestion is optimized for reducing ingestion costs (COGs), by minimizing storage transactions during and following the ingestion process.

Before you start, use the following steps to get the Data Explorer pool endpoints for configuring programmatic ingestion.

[!INCLUDE [data-explorer-get-endpoint](../includes/data-explorer-get-endpoint.md)]

**Available SDKs and open-source projects**

* [Python SDK](/azure/data-explorer/kusto/api/python/kusto-python-client-library?context=/azure/synapse-analytics/context/context)

* [.NET SDK](/azure/data-explorer/kusto/api/netfx/about-the-sdk?context=/azure/synapse-analytics/context/context)

* [Java SDK](/azure/data-explorer/kusto/api/java/kusto-java-client-library?context=/azure/synapse-analytics/context/context)

* [Node SDK](/azure/data-explorer/kusto/api/node/kusto-node-client-library?context=/azure/synapse-analytics/context/context)

* [REST API](/azure/data-explorer/kusto/api/netfx/kusto-ingest-client-rest?context=/azure/synapse-analytics/context/context)

* [GO SDK](/azure/data-explorer/kusto/api/golang/kusto-golang-client-library?context=/azure/synapse-analytics/context/context)

### Tools

* **[One-click ingestion](data-explorer-ingest-data-one-click.md)**: Enables you to quickly ingest data by creating and adjusting tables from a wide range of source types. One-click ingestion automatically suggests tables and mapping structures based on the data source in Azure Synapse Data Explorer. One-click ingestion can be used for one-time ingestion, or to define continuous ingestion via Event Grid on the container to which the data was ingested.

<!-- * **[LightIngest](lightingest.md)**: A command-line utility for ad-hoc data ingestion into Azure Synapse Data Explorer. The utility can pull source data from a local folder or from an Azure blob storage container. -->

### Kusto Query Language ingest control commands

There are a number of methods by which data can be ingested directly to the engine by Kusto Query Language (KQL) commands. Because this method bypasses the Data Management services, it's only appropriate for exploration and prototyping. Don't use this method in production or high-volume scenarios.

  * **Inline ingestion**:  A control command [.ingest inline](/azure/data-explorer/kusto/management/data-ingestion/ingest-inline?context=/azure/synapse-analytics/context/context) is sent to the engine, with the data to be ingested being a part of the command text itself. This method is intended for improvised testing purposes.

  * **Ingest from query**: A control command [.set, .append, .set-or-append, or .set-or-replace](/azure/data-explorer/kusto/management/data-ingestion/ingest-from-query?context=/azure/synapse-analytics/context/context) is sent to the engine, with the data specified indirectly as the results of a query or a command.

  * **Ingest from storage (pull)**: A control command [.ingest into](/azure/data-explorer/kusto/management/data-ingestion/ingest-from-storage?context=/azure/synapse-analytics/context/context) is sent to the engine, with the data stored in some external storage (for example, Azure Blob Storage) accessible by the engine and pointed-to by the command.

For an example of using ingest control commands, see [Analyze with Data Explorer](../../get-started-analyze-data-explorer.md).

<!-- ## Comparing ingestion methods and tools

| Ingestion name | Data type | Maximum file size | Streaming, batching, direct | Most common scenarios | Considerations |
| --- | --- | --- | --- | --- | --- |
| [**One click ingestion**](ingest-data-one-click.md) | *sv, JSON | 1 GB uncompressed (see note)| Batching to container, local file and blob in direct ingestion | One-off, create table schema, definition of continuous ingestion with event grid, bulk ingestion with container (up to 10,000 blobs) | 10,000 blobs are randomly selected from container|
| [**LightIngest**](lightingest.md) | All formats supported | 1 GB uncompressed (see note) | Batching via DM or direct ingestion to engine |  Data migration, historical data with adjusted ingestion timestamps, bulk ingestion (no size restriction)| Case-sensitive, space-sensitive |
| [**ADX Kafka**](ingest-data-kafka.md) | | | | |
| [**ADX to Apache Spark**](spark-connector.md) | | | | |
| [**LogStash**](ingest-data-logstash.md) | | | | |
| [**Azure Data Factory (ADF)**](./data-factory-integration.md) | [Supported data formats](../../../data-factory/copy-activity-overview.md#supported-data-stores-and-formats) | unlimited *(per ADF restrictions) | Batching or per ADF trigger | Supports formats that are usually unsupported, large files, can copy from over 90 sources, from on perm to cloud | This method takes relatively more time until data is ingested. ADF uploads all data to memory and then begins ingestion. |
|[ **Power Automate**](./flow.md) | | | | Ingestion commands as part of flow| Must have high-performing response time |
| [**IoT Hub**](ingest-data-iot-hub-overview.md) | [Supported data formats](ingest-data-iot-hub-overview.md#data-format)  | N/A | Batching, streaming | IoT messages, IoT events, IoT properties | |
| [**Event Hub**](ingest-data-event-hub-overview.md) | [Supported data formats](ingest-data-event-hub-overview.md#data-format) | N/A | Batching, streaming | Messages, events | |
| [**Event Grid**](ingest-data-event-grid-overview.md) | [Supported data formats](ingest-data-event-grid-overview.md#data-format) | 1 GB uncompressed | Batching | Continuous ingestion from Azure storage, external data in Azure storage | Ingestion can be triggered by blob renaming or blob creation actions. |
| [**.NET SDK**](./net-sdk-ingest-data.md) | All formats supported | 1 GB uncompressed (see note) | Batching, streaming, direct | Write your own code according to organizational needs |
| [**Python**](python-ingest-data.md) | All formats supported | 1 GB uncompressed (see note) | Batching, streaming, direct | Write your own code according to organizational needs |
| [**Node.js**](node-ingest-data.md) | All formats supported | 1 GB uncompressed (see note | Batching, streaming, direct | Write your own code according to organizational needs |
| [**Java**](kusto/api/java/kusto-java-client-library.md) | All formats supported | 1 GB uncompressed (see note) | Batching, streaming, direct | Write your own code according to organizational needs |
| [**REST**](kusto/api/netfx/kusto-ingest-client-rest.md) | All formats supported | 1 GB uncompressed (see note) | Batching, streaming, direct| Write your own code according to organizational needs |
| [**Go**](kusto/api/golang/kusto-golang-client-library.md) | All formats supported | 1 GB uncompressed (see note) | Batching, streaming, direct | Write your own code according to organizational needs |

> [!Note]
> When referenced in the above table, ingestion supports a maximum file size of 4 GB. The recommendation is to ingest files between 100 MB and 1 GB. -->

## Ingestion process

Once you have chosen the most suitable ingestion method for your needs, do the following steps:

1. **Set retention policy**

    Data ingested into a table in Azure Synapse Data Explorer is subject to the table's effective retention policy. Unless set on a table explicitly, the effective retention policy is derived from the database's retention policy. Hot retention is a function of cluster size and your retention policy. Ingesting more data than you have available space will force the first in data to cold retention.

    Make sure that the database's retention policy is appropriate for your needs. If not, explicitly override it at the table level. For more information, see [retention policy](/azure/data-explorer/kusto/management/retentionpolicy?context=/azure/synapse-analytics/context/context).

1. **Create a table**

    In order to ingest data, a table needs to be created beforehand. Use one of the following options:

    * Create a table with a command. For an example of using the create a table command, see [Analyze with Data Explorer](../../get-started-analyze-data-explorer.md).

    * Create a table using [One-click Ingestion](data-explorer-ingest-data-one-click.md).

    > [!Note]
    > If a record is incomplete or a field cannot be parsed as the required data type, the corresponding table columns will be populated with null values.

1. **Create schema mapping**

    [Schema mapping](/azure/data-explorer/kusto/management/mappings?context=/azure/synapse-analytics/context/context) helps bind source data fields to destination table columns. Mapping allows you to take data from different sources into the same table, based on the defined attributes. Different types of mappings are supported, both row-oriented (CSV, JSON and AVRO), and column-oriented (Parquet). In most methods, mappings can also be [pre-created on the table](/azure/data-explorer/kusto/management/create-ingestion-mapping-command?context=/azure/synapse-analytics/context/context) and referenced from the ingest command parameter.

1. **Set update policy** (optional)

   Some of the data format mappings (Parquet, JSON, and Avro) support simple and useful ingest-time transformations. Where the scenario requires more complex processing at ingest time, use update policy, which allows for lightweight processing using Kusto Query Language commands. The update policy automatically runs extractions and transformations on ingested data on the original table, and ingests the resulting data into one or more destination tables. Set your [update policy](/azure/data-explorer/kusto/management/update-policy?context=/azure/synapse-analytics/context/context).



## Next steps

- [Supported data formats](data-explorer-ingest-data-supported-formats.md)
- [Supported ingestion properties](data-explorer-ingest-data-properties.md)