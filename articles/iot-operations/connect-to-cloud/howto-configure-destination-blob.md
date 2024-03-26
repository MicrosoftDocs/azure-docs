---
title: Send data to Azure Blob Storage from a pipeline
description: Configure a pipeline destination stage to send the pipeline output to Azure Blob Storage for storage and analysis.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: how-to
ms.date: 02/16/2024

#CustomerIntent: As an operator, I want to send data from a pipeline to Azure Blob Storage so that I can store and analyze my data in the cloud.
---

# Send data to Azure Blob Storage from a Data Processor pipeline

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the _Azure Blob Storage_ destination to write unstructured data to Azure Blob Storage for storage and analysis.

## Prerequisites

To configure and use this Azure Blob Storage destination pipeline stage, you need:

- A deployed instance of Data Processor.
- An Azure Blob Storage account.

## Configure the destination stage

The _Azure Blob Storage_ destination stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Field | Type | Description | Required? | Default | Example |
|--|--|--|--|--|--|
| `accountName` | string | The name the Azure Blob Storage account. | Yes |  | `myBlobStorageAccount` |
| `containerName` | string | The name of container created in the storage account to store the blobs. | Yes |  | `mycontainer` |
| `authentication` | string | Authentication information to connect to the storage account. One of `servicePrincipal`, `systemAssignedManagedIdentity`, and `accessKey`. | Yes |  | See the [sample configuration](#sample-configuration). |
| `format` | Object. | Formatting information for data. All types are supported. | Yes |  | `{"type": "json"}` |
| `blobPath` | [Templates](../process-data/concept-configuration-patterns.md#templates)| Template string that identifies the path to write files to. All the template components shown in the default are required. | No | `{{{instanceId}}}/{{{pipelineId}}}/{{{partitionId}}}/{{{YYYY}}}/{{{MM}}}/{{{DD}}}/{{{HH}}}/{{{mm}}}/{{{fileNumber}}}` | `{{{instanceId}}}/{{{pipelineId}}}/{{{partitionId}}}/{{{YYYY}}}/{{{MM}}}/{{{DD}}}/{{{HH}}}/{{{mm}}}/{{{fileNumber}}}.xyz` |
| `batch` | [Batch](../process-data/concept-configuration-patterns.md#batch) | How to batch data before writing it to Blob Storage. | No | `{"time": "60s"}` | `{"time": "60s"}` |
| `retry` | [Retry](../process-data/concept-configuration-patterns.md#retry) | The retry mechanism to use when a Blob Storage operation fails. | No | (empty) | `{"type": "fixed"}` |

## Sample configuration

The following JSON shows a sample configuration for the _Azure Blob Storage_ destination stage:

```json
{
    "displayName": "Sample blobstorage output",
    "description": "An example blobstorage output stage",
    "type": "output/blobstorage@v1",
    "accountName": "myStorageAccount",
    "containerName": "mycontainer",
    "blobPath": "{{{instanceId}}}/{{{pipelineId}}}/{{{partitionId}}}/{{{YYYY}}}/{{{MM}}}/{{{DD}}}/{{{HH}}}/{{{mm}}}/{{{fileNumber}}}",
    "authentication": {
        "type": "systemAssignedManagedIdentity"
    },
    "format": {
        "type": "json"
    },
    "batch": {
        "time": "60s",
        "path": ".payload"
    },
    "retry": {
        "type": "fixed"
    }
}
```

## Related content

- [Send data to Azure Data Explorer](howto-configure-destination-data-explorer.md)
- [Send data to Microsoft Fabric](howto-configure-destination-fabric.md)
- [Send data to a gRPC endpoint](../process-data/howto-configure-destination-grpc.md)
- [Send data to an HTTP endpoint](../process-data/howto-configure-destination-http.md)
- [Publish data to an MQTT broker](../process-data/howto-configure-destination-mq-broker.md)
- [Send data to the reference data store](../process-data/howto-configure-destination-reference-store.md)
