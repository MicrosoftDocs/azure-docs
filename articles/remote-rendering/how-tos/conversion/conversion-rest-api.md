---
title: The asset conversion REST API
description: Describes how to convert an asset via the REST API
author: florianborn71
ms.author: flborn
ms.date: 02/04/2020
ms.topic: how-to
---

# Use the model conversion REST API

The [model conversion](model-conversion.md) service is controlled through a [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer). This article describes the conversion service API details.

## Regions

See the [list of available regions](../../reference/regions.md) for the base URLs to send the requests to.

## Common headers

### Common request headers

These headers must be specified for all requests:

- The **Authorization** header must have the value of "Bearer [*TOKEN*]", where [*TOKEN*] is a [service access token](../tokens.md).

### Common response headers

All responses contain these headers:

- The **MS-CV** header contains a unique string that can be used to trace the call within the service.

## Endpoints

The conversion service provides three REST API endpoints to:

- start model conversion using a storage account linked with your Azure Remote Rendering account. 
- start model conversion using provided *Shared Access Signatures (SAS)*.
- query the conversion status

### Start conversion using a linked storage account
Your Azure Remote Rendering Account needs to have access to the provided storage account by following the steps on how to [Link storage accounts](../create-an-account.md#link-storage-accounts).

| Endpoint | Method |
|-----------|:-----------|
| /v1/accounts/**accountID**/conversions/create | POST |

Returns the ID of the ongoing conversion, wrapped in a JSON document. The field name is "conversionId".

#### Request body


```json
{
    "input":
    {
        "storageAccountname": "<the name of a connected storage account - this does not include the domain suffix (.blob.core.windows.net)>",
        "blobContainerName": "<the name of the blob container containing your input asset data>",
        "folderPath": "<optional: can be omitted or empty - a subpath in the input blob container>",
        "inputAssetPath" : "<path to the model in the input blob container relative to the folderPath (or container root if no folderPath is specified)>"
    },
    "output":
    {
        "storageAccountname": "<the name of a connected storage account - this does not include the domain suffix (.blob.core.windows.net)>",
        "blobContainerName": "<the name of the blob container where the converted asset will be copied to>",
        "folderPath": "<optional: can be omitted or empty - a subpath in the output blob container. Will contain the asset and log files>",
        "outputAssetFileName": "<optional: can be omitted or empty. The filename of the converted asset. If provided the filename needs to end in .arrAsset>"
    }
}
```
### Start conversion using provided shared access signatures
If your ARR account isn't linked to your storage account, this REST interface allows you to provide access using *Shared Access Signatures (SAS)*.

| Endpoint | Method |
|-----------|:-----------|
| /v1/accounts/**accountID**/conversions/createWithSharedAccessSignature | POST |

Returns the ID of the ongoing conversion, wrapped in a JSON document. The field name is "conversionId".

#### Request body

The request body is the same as in the create REST call above, but input and output contain *Shared Access Signatures (SAS) tokens*. 
These tokens provide access to the storage account for reading the input and writing the conversion result.

> [!NOTE]
> These SAS URI tokens are the query strings and not the full URI. 


```json
{
    "input":
    {
        "storageAccountname": "<the name of a connected storage account - this does not include the domain suffix (.blob.core.windows.net)>",
        "blobContainerName": "<the name of the blob container containing your input asset data>",
        "folderPath": "<optional: can be omitted or empty - a subpath in the input blob container>",
        "inputAssetPath" : "<path to the model in the input blob container relative to the folderPath (or container root if no folderPath is specified)>",
        "containerReadListSas" : "<a container SAS token which gives read and list access to the given input blob container>"
    },
    "output":
    {
        "storageAccountname": "<the name of a connected storage account - this does not include the domain suffix (.blob.core.windows.net)>",
        "blobContainerName": "<the name of the blob container where the converted asset will be copied to>",
        "folderPath": "<optional: can be omitted or empty - a subpath in the output blob container. Will contain the asset and log files>",
        "outputAssetFileName": "<optional: can be omitted or empty. The filename of the converted asset. If provided the filename needs to end in .arrAsset>",
        "containerWriteSas" : "<a container SAS token which gives write access to the given output blob container>"
    }
}
```

### Poll conversion status
The status of an ongoing conversion started with one of the REST calls above can be queried using the following interface:


| Endpoint | Method |
|-----------|:-----------|
| /v1/accounts/**accountID**/conversions/**conversionId** | GET |

Returns a JSON document with a "status" field that can have the following values:

- "Created"
- "Running"
- "Success"
- "Failure"

If the status is "Failure", there will be an additional "error" field with a "message" subfield containing error information. Additional logs will be uploaded to your output container.

## Next steps

- [Use Azure Blob Storage for model conversion](blob-storage.md)
- [Model conversion](model-conversion.md)
