---
title: Send data to Azure Data Explorer from a pipeline
description: Configure a pipeline destination stage to send the pipeline output to Azure Data Explorer for storage and analysis.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.date: 10/09/2023

#CustomerIntent: As an operator, I want to send data from a pipeline to Azure Data Explorer so that I can store and analyze my data in the cloud.
---

# Send data to Azure Data Explorer from a Data Processor pipeline

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the _Azure Data Explorer_ destination to write data to a table in Azure Data Explorer from a [Data Processor Preview pipeline](../process-data/overview-data-processor.md). The destination stage batches messages before it sends them to Azure Data Explorer.

## Prerequisites

To configure and use an Azure Data Explorer destination pipeline stage, you need:

- A deployed instance of Data Processor Preview.
- An [Azure Data Explorer cluster](/azure/data-explorer/create-cluster-and-database?tabs=free#create-a-cluster).
- A [database](/azure/data-explorer/create-cluster-and-database?tabs=free#create-a-database) in your Azure Data Explorer cluster.

## Set up Azure Data Explorer

Before you can write to Azure Data Explorer from a data pipeline, enable [service principal authentication](/azure/data-explorer/provision-azure-ad-app) in your database. To create a service principal with a client secret:

[!INCLUDE [data-processor-create-service-principal](../includes/data-processor-create-service-principal.md)]

To grant admin access to your Azure Data Explorer database, run the following command in your database query tab:

```kusto
.add database <DatabaseName> admins (<ApplicationId>) <Notes>
```

Data processor writes to Azure Data Explorer in batches. While you batch data in data processor before sending it, Azure Data Explorer has its own default [ingestion batching policy](/azure/data-explorer/kusto/management/batchingpolicy). Therefore, you might not see your data in Azure Data Explorer immediately after the data processor writes it to the Azure Data Explorer destination.

To view data in Azure Data Explorer as soon as the pipeline sends it, you can set the ingestion batching policy `Count` to 1. To edit the ingestion batching policy, run the following command in your database query tab:

```kusto
.alter table <DatabaseName>.<TableName> policy ingestionbatching
{
    "MaximumBatchingTimeSpan" : "00:00:30",
    "MaximumNumberOfItems" : 1,
    "MaximumRawDataSizeMB": 1024
}
```

## Configure the destination stage

The Azure Data Explorer destination stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Field | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| Display name  | String | A name to show in the Data Processor UI.  | Yes | -  | `E4K output` |
| Description | String |  A user-friendly description of what the stage does.  | No |  | `Write to topic default/topic1` |
| Cluster URL | String | The URI (This value isn't the data ingestion URI). | Yes | - | |
| Database | String | The database name.  | Yes | - | |
| Table | String |  The name of the table to write to.  | Yes | - |  |
| Batch | [Batch](../process-data/concept-configuration-patterns.md#batch) | How to [batch](../process-data/concept-configuration-patterns.md#batch) data.  | No | `60s` | `10s`  |
| Authentication<sup>1</sup> | The authentication details to connect to Azure Data Explorer.  | Service principal | Yes | - |
| Columns&nbsp;>&nbsp;Name | string | The name of the column. | Yes | | `temperature` |
| Columns&nbsp;>&nbsp;Path | [Path](../process-data/concept-configuration-patterns.md#path) | The location within each record of the data where the value of the column should be read from. | No | `.{{name}}` | `.temperature` |

Authentication<sup>1</sup>: Currently, the destination stage supports service principal based authentication when it connects to Azure Data Explorer. In your Azure Data Explorer destination, provide the following values to authenticate. You made a note of these values when you created the service principal.

| Field | Description | Required |
| --- | --- | --- |
| TenantId  | The tenant ID.  | Yes |
| ClientId | The client ID.  | Yes |
| Client secret | The client secret (This value isn't the secret ID).   | Yes |

## Related content

- [Send data to Microsoft Fabric](howto-configure-destination-fabric.md)
- [Send data to a gRPC endpoint](../process-data/howto-configure-destination-grpc.md)
- [Publish data to an MQTT broker](../process-data/howto-configure-destination-mq-broker.md)
- [Send data to the reference data store](../process-data/howto-configure-destination-reference-store.md)
