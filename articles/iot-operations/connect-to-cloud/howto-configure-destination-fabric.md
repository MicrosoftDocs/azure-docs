---
title: Send data to Microsoft Fabric from a pipeline
description: Configure a pipeline destination stage to send the pipeline output to Microsoft Fabric for storage and analysis.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.date: 10/09/2023

#CustomerIntent: As an operator, I want to send data from a pipeline to Microsoft Fabric so that I can store and analyze my data in the cloud.
---

# Send data to Microsoft Fabric from a Data Processor pipeline

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the _Fabric Lakehouse_ destination to write data to a lakehouse in Microsoft Fabric from a [Data Processor Preview pipeline](../process-data/overview-data-processor.md). The destination stage writes parquet files to a lakehouse that lets you view the data in delta tables. The destination stage batches messages before it sends them to Microsoft Fabric.

## Prerequisites

To configure and use a Microsoft Fabric destination pipeline stage, you need:

- A deployed instance of Data Processor Preview.
- A Microsoft Fabric subscription. Or, sign up for a free [Microsoft Fabric (Preview) Trial](/fabric/get-started/fabric-trial).
- A [lakehouse in Microsoft Fabric](/fabric/data-engineering/create-lakehouse).

## Set up Microsoft Fabric

Before you can write to Microsoft Fabric from a data pipeline, enable [service principal authentication](/fabric/onelake/onelake-security#authentication) in your workspace and lakehouse. To create a service principal with a client secret:

[!INCLUDE [data-processor-create-service-principal](../includes/data-processor-create-service-principal.md)]

To add the service principal to your Microsoft Fabric workspace:

1. Make a note of your workspace ID and lakehouse ID. You can find these values in the URL that you use to access your lakehouse:

    :::image type="content" source="media/fabric-workspace-id.png" alt-text="Screenshot that shows the workspace and lakehouse IDs in the URL.":::

1. In your workspace, select **Manage access**:

    :::image type="content" source="media/fabric-manage-access.png" alt-text="Screenshot that shows how to find the Manage access link.":::

1. Select **Add people or groups**:
  
    :::image type="content" source="media/fabric-add-people.png" alt-text="Screenshot that shows how to add a user.":::
  
1. Search for your service principal by name. Start typing to see a list of matching service principals. Select the service principal you created earlier:

    :::image type="content" source="media/fabric-add-service-principal.png" alt-text="Screenshot that shows how to add a service principal.":::

1. Grant your service principal admin access to the workspace.

## Configure the destination stage

The _Fabric Lakehouse_ destination stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Field | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| Display name  | String | A name to show in the Data Processor UI.  | Yes | -  | `E4K output` |
| Description | String |  A user-friendly description of what the stage does.  | No |  | `Write to topic default/topic1` |
| URL | String | The Microsoft Fabric URL | Yes | - | |
| WorkspaceId | String | The lakehouse workspace ID.  | Yes | - | |
| LakehouseId | String | The lakehouse Lakehouse ID.  | Yes | - |  |
| Table | String |  The name of the table to write to.  | Yes | - |  |
| File path<sup>1</sup> | [Template](../process-data/concept-configuration-patterns.md#templates) |  The file path for where to write the parquet file to.  | No | `{instanceId}/{pipelineId}/{partitionId}/{YYYY}/{MM}/{DD}/{HH}/{mm}/{fileNumber}` |  |
| Batch<sup>2</sup> | [Batch](../process-data/concept-configuration-patterns.md#batch) |  How to [batch](../process-data/concept-configuration-patterns.md#batch) data. | No | `60s` | `10s`  |
| Authentication<sup>3</sup> | The authentication details to connect to Microsoft Fabric.  | Service principal | Yes | - |
| Columns&nbsp;>&nbsp;Name | string | The name of the column. | Yes | | `temperature` |
| Columns&nbsp;>&nbsp;Type<sup>4</sup> | string enum | The type of data held in the column, using one of the [Delta primitive types](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#primitive-types). | Yes | | `integer` |
| Columns&nbsp;>&nbsp;Path | [Path](../process-data/concept-configuration-patterns.md#path) | The location within each record of the data from where to read the value of the column. | No | `.{{name}}` | `.temperature` |

File path<sup>1</sup>: To write files to Microsoft Fabric, you need a file path. You can use [templates](../process-data/concept-configuration-patterns.md#templates) to configure file paths. File paths must contain the following components in any order:

- `instanceId`
- `pipelineId`
- `partitionId`
- `YYYY`
- `MM`
- `DD`
- `HH`
- `mm`
- `fileNumber`

The files names are incremental integer values as indicated by `fileNumber`. Be sure to include a file extension if you want your system to recognize the file type.

Batching<sup>2</sup>: Batching is mandatory when you write data to Microsoft Fabric. The destination stage [batches](../process-data/concept-configuration-patterns.md#batch) messages over a configurable time interval.

If you don't configure a batching interval, the stage uses 60 seconds as the default.

Authentication<sup>3</sup>: Currently, the destination stage supports service principal based authentication when it connects to Microsoft Fabric. In your Azure Data Explorer destination, provide the following values to authenticate. You made a note of these values when you created the service principal.

| Field | Description | Required |
| --- | --- | --- |
| TenantId  | The tenant ID.  | Yes |
| ClientId | The client ID.  | Yes |
| Client secret | The client secret (This value isn't the secret ID).   | Yes |

Type<sup>4</sup>: The data processor writes to Microsoft Fabric by using the delta format. The data processor supports all [delta primitive data types](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#primitive-types) except for `decimal` and `timestamp without time zone`.

To ensure all dates and times are represented correctly in Microsoft Fabric, make sure the value of the property is a valid RFC 3339 string and that the data type is either `date` or `timestamp`.

## Related content

- [Send data to Azure Data Explorer](howto-configure-destination-data-explorer.md)
- [Send data to a gRPC endpoint](../process-data/howto-configure-destination-grpc.md)
- [Publish data to an MQTT broker](../process-data/howto-configure-destination-mq-broker.md)
- [Send data to the reference data store](../process-data/howto-configure-destination-reference-store.md)
