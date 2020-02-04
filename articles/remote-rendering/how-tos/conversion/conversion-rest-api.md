---
title: The model conversion REST API
description: Describes how to convert a model via the REST API
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: tutorial
ms.service: azure-remote-rendering
---

# The model conversion REST API

In order to render a model, it needs to be converted into the native remote rendering service format (arrAsset).
We call this process *ingestion*.
Ingestion is done by having your model stored under an Azure blob storage and calling our model ingestion REST API to convert it. The result will be written back to a provided Azure blob storage container. The remote rendering runtime will load the ingested model from that location.

All of the model data (input and output) is stored in the Azure blob storage provided by the user. Azure remote rendering gives you full control over your asset management.

The supported input model formats for ingestion are:

- FBX  (version 2011 and above)
- GLTF (version 1.0 and 2.0)
- GLB  (version 1.0 and 2.0)

## Overview of the model ingestion process

- [Prepare Azure blob storage containers](#prepare)
- [Upload your model to the input container](#upload)
- [Call the ingestion REST API](#rest) with the following parameters: input container stored access signature (SAS), output container SAS and path within the input container to the model file as parameters.
- [Get a SAS URI for your ingested model](#ingested) to load it in the remote rendering process using the unity API

We provide powershell scripts, which demonstrate the use of our service.
They can be found in the Scripts directory of the arrclient repo.

The script and its configuration are described here: [Example PowerShell scripts](../../samples/powershell-example-scripts-for-frontend.md)

## Accounts

If you don't have a Remote Rendering account, [create one](../create-an-account.md). Each resource is identified by an *account ID* and the *account ID* is used throughout the session APIs.

## <span id="rest">Asset conversion REST API
 
We provide two REST API endpoints to:

- start model conversion
- poll conversion progress

## Environments

| Environment | Base URL | 
|-----------|:-----------|
| Production West US 2 | https://remoterendering.westus2.mixedreality.azure.com |
| Production West Europe | https://remoterendering.westeurope.mixedreality.azure.com |

## Common request headers

- The *Authorization* header must have the value of "Bearer [token]", where [token] is the authentication token returned by the Secure Token Service, see [get a token](../tokens.md)

## Common response headers

- The *MS-CV* header can be used by the product team to trace the call within the service

### Start conversion

| Endpoint | Method |
|-----------|:-----------|
| /v1/accounts/*account ID*/models/create | POST |

Returns the ID of the created model wrapped in a JSON document. The field is "modelId"

#### Request body

- modelName (string): path to the model in the input container
- modelUrl (string): input container SAS url
- assetContainerUrl (string): output container SAS url

### Model conversion status

| Endpoint | Method |
|-----------|:-----------|
| /v1/accounts/*account ID*/models/*assetId*/status | GET |

Returns a JSON document with a "status" field that can have the following values:

- "Running"
- "Success"
- "Failure"

## <span id="prepare">Prepare Azure blob storage accounts

- create a storage account (StorageV2)
- create an input blob container in the storage account (for example named
"arrinput")
- create an output blob container in the storage account (for example named "arroutput")
- retrieve a stored access signature with read & list access for your input storage container
- retrieve a stored access signature with write access for your output storage container
- upload your model to the input container

The creation of the storage account and the blob containers can be done with one of the following:

- [Azure portal](https://portal.azure.com)
- [az commandline](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
- SDKs (C#, Python ... )

## Retrieve stored access signatures for the storage containers

Stored access signatures (SAS) are used to grant read access for input and write access for output. It is recommended to generate the URIs on the fly each time a model is ingested instead of persisting them since they will eventually expire leading to unexpected breakages.

Details about SAS can be found at the [SAS documentation](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1>)

A SAS URI can be generated using one of:

- az powershell module
  - see the [example PowerShell scripts](../../samples/powershell-example-scripts-for-frontend.md)
- [az commandline](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
- SDKS (C#, Python ... )
- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
  - right click on container "Get Shared Access Signature" (read, list access for input container, write access for output container)

## <span id="upload">Upload an input model

In order to start ingesting a model, you need to upload it using one of the following options:

- [Azure storage explorer](https://azure.microsoft.com/features/storage-explorer/) - a convenient UI to upload/download/manage files on azure blob storage
- [Azure command line](https://docs.microsoft.com/azure/storage/common/storage-azure-cli)
- [Azure powershell module](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-2.2.0)
  - see the [Example PowerShell scripts](../../samples/powershell-example-scripts-for-frontend.md)
- [Using a storage SDK (Python, C# ... )](https://docs.microsoft.com/azure/storage/)
- [Using the azure Storage REST APIs](https://docs.microsoft.com/rest/api/storageservices/blob-service-rest-api)

## <span id="ingested">Get a SAS URI for your ingested model</span>

This step is similar to the [Retrieve stored access signatures for the storage containers](#prepare) step above. But this time we need to retrieve a SAS URI for the model file that was written to the output container. 
All of the methods work for the model file as well. 

For example, to retrieve as SAS URI via the [Azure Storage explorer](https://azure.microsoft.com/features/storage-explorer/) right-click on the model file and select "Get Shared Access Signature"). Copy the URL. 

## <span id="configuringIngestion">Configuring ingestion</span>

There is a dedicated chapter about [configuring the model conversion](configure-model-conversion.md) which describes the conversion settings and makes some recommendations.
