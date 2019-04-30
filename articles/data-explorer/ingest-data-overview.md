---
title: 'Azure Data Explorer data ingestion'
description: 'Learn about the different ways you can ingest (load) data in Azure Data Explorer'
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 02/18/2019
---

# Azure Data Explorer data ingestion

Data ingestion is the process used to load data records from one or more sources to create or update a table in Azure Data Explorer. Once ingested, the data becomes available for query. The diagram below shows the end-to-end flow for working in Azure Data Explorer, including data ingestion.

![Data flow](media/ingest-data-overview/data-flow.png)

The Azure Data Explorer data management service, which is responsible for data ingestion, provides the following functionality:

1. **Data pull**: Pull data from external sources (Event Hubs) or read ingestion requests from an Azure Queue.

1. **Batching**: Batch data flowing to the same database and table to optimize ingestion throughput.

1. **Validation**: Preliminary validation and format conversion if necessary.

1. **Data manipulation**: Matching schema, organizing, indexing, encoding and compressing the data.

1. **Persistence point in the ingestion flow**: Manage ingestion load on the engine and handle retries upon transient failures.

1. **Commit the data ingest**: Makes the data available for query.

## Ingestion methods

Azure Data Explorer supports several ingestion methods, each with its own target scenarios, advantages, and disadvantages. Azure Data Explorer offers pipelines and connectors to common services, programmatic ingestion using SDKs, and direct access to the engine for exploration purposes.

### Ingestion using pipelines, connectors, and plugins

Azure Data Explorer currently supports:

* Event Grid pipeline, which can be managed using the management wizard in the Azure portal. For more information, see [Ingest Azure Blobs into Azure Data Explorer](ingest-data-event-grid.md).

* Event Hub pipeline, which can be managed using the management wizard in the Azure portal. For more information, see [Ingest data from Event Hub into Azure Data Explorer](ingest-data-event-hub.md).

* Logstash plugin, see [Ingest data from Logstash to Azure Data Explorer](ingest-data-logstash.md).

* Kafka connector, see [Ingest data from Kafka into Azure Data Explorer](ingest-data-kafka.md).

### Ingestion using integration services

* Azure Data Factory (ADF), a fully managed data integration service for analytic workloads in Azure, to copy data to and from Azure Data Explorer using [supported data stores and formats](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats). For more information, see [Copy data from Azure Data Factory to Azure Data Explorer](/azure/data-explorer/data-factory-load-data).

### Programmatic ingestion

Azure Data Explorer provides SDKs that can be used for query and data ingestion. Programmatic ingestion is optimized for reducing ingestion costs (COGs), by minimizing storage transactions during and following the ingestion process.

**Available SDKs and open-source projects**:

Kusto offers client SDK that can be used to ingest and query data with:

* [Python SDK](/azure/kusto/api/python/kusto-python-client-library)

* [.NET SDK](/azure/kusto/api/netfx/about-the-sdk)

* [Java SDK](/azure/kusto/api/java/kusto-java-client-library)

* [Node SDK](/azure/kusto/api/node/kusto-node-client-library)

* [REST API](/azure/kusto/api/netfx/kusto-ingest-client-rest)

**Programmatic ingestion techniques**:

* Ingesting data through the Azure Data Explorer data management service (high-throughput and reliable ingestion):

    [**Batch ingestion**](/azure/kusto/api/netfx/kusto-ingest-queued-ingest-sample) (provided by SDK): the client uploads the data to Azure Blob storage (designated by the Azure Data Explorer data management service) and posts a notification to an Azure Queue. Batch ingestion is the recommended technique for high-volume, reliable, and cheap data ingestion.

* Ingesting data directly into the Azure Data Explorer engine (most appropriate for exploration and prototyping):

  * **Inline ingestion**: control command (.ingest inline) containing in-band data is intended for ad hoc testing purposes.

  * **Ingest from query**: control command (.set, .set-or-append, .set-or-replace) that points to query results is used for generating reports or small temporary tables.

  * **Ingest from storage**: control command (.ingest into) with data stored externally (for example, Azure Blob Storage) allows efficient bulk ingestion of data.

**Latency of different methods**:

| Method | Latency |
| --- | --- |
| **Inline ingestion** | Immediate |
| **Ingest from query** | Query time + processing time |
| **Ingest from storage** | Download time + processing time |
| **Queued ingestion** | Batching time + processing time |
| |

Processing time depends on the data size, less than a few seconds. Batching time defaults to 5 minutes.

## Choosing the most appropriate ingestion method

Before you start to ingest data, you should ask yourself the following questions.

* Where does my data reside? ​
* What is the data format, and can it be changed? ​
* What are the required fields to be queried? ​
* What is the expected data volume and velocity? ​
* How many event types are expected (reflected as the number of tables)? ​
* How often is the event schema expected to change? ​
* How many nodes will generate the data? ​
* What is the source OS? ​
* What are the latency requirements? ​
* Can one of the existing managed ingestion pipelines be used? ​

For organizations with an existing infrastructure that are based on a messaging service like Event Hub, using a connector is likely the most appropriate solution. Queued ingestion is appropriate for large data volumes.

## Supported data formats

For all ingestion methods other than ingest from query, format the data so that Azure Data Explorer can parse it. The supported data formats are:

* CSV, TSV, PSV, SCSV, SOH​
* JSON (line-separated, multi-line), Avro​
* ZIP and GZIP 

> [!NOTE]
> When data is being ingested, data types are inferred based on the target table columns. If a record is incomplete or a field cannot be parsed as the required data type, the corresponding table columns will be populated with null values.

## Ingestion recommendations and limitations

* The effective retention policy of ingested data is derived from the database's retention policy. See [retention policy](/azure/kusto/concepts/retentionpolicy) for details. Ingesting data requires **Table ingestor** or **Database ingestor** permissions.
* Ingestion supports a maximum file size of 5 GB. The recommendation is to ingest files between 100 MB and 1 GB.

## Schema mapping

Schema mapping helps bind source data fields to destination table columns.

* [CSV Mapping](/azure/kusto/management/mappings?branch=master#csv-mapping) (optional) works with all ordinal-based formats. It can be performed using the ingest command parameter or [pre-created on the table](/azure/kusto/management/tables?branch=master#create-ingestion-mapping) and referenced from the ingest command parameter.
* [JSON Mapping](/azure/kusto/management/mappings?branch=master#json-mapping) (mandatory) and [Avro mapping](/azure/kusto/management/mappings?branch=master#avro-mapping) (mandatory) can be performed using the ingest command parameter. They can also be [pre-created on the table](/azure/kusto/management/tables#create-ingestion-mapping) and referenced from the ingest command parameter.

## Next steps

> [!div class="nextstepaction"]
> [Ingest data from Event Hub into Azure Data Explorer](ingest-data-event-hub.md)

> [!div class="nextstepaction"]
> [Ingest data using Event Grid subscription into Azure Data Explorer](ingest-data-event-grid.md)

> [!div class="nextstepaction"]
> [Ingest data from Kafka into Azure Data Explorer](ingest-data-kafka.md)

> [!div class="nextstepaction"]
> [Ingest data using the Azure Data Explorer Python library](python-ingest-data.md)

> [!div class="nextstepaction"]
> [Ingest data using the Azure Data Explorer Node library](node-ingest-data.md)

> [!div class="nextstepaction"]
> [Ingest data using the Azure Data Explorer .NET Standard SDK (Preview)](net-standard-ingest-data.md)

> [!div class="nextstepaction"]
> [Ingest data from Logstash to Azure Data Explorer](ingest-data-logstash.md)
