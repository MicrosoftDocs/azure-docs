---
title: Using Azure Blob Storage for model conversion
description: Describes common steps to set up and use blob storage for model conversion.
author: jakrams
ms.author: jakras
ms.date: 02/04/2020
ms.topic: how-to
---

# Using Azure Blob Storage for model conversion

The [model conversion](model-conversion.md) service requires you to store input data and retrieve output data through Azure blob storage. This article describes how to do the most common steps.

## Preparing Azure Storage accounts

- Create a storage account (StorageV2)
- Create an input blob container in the storage account (for example named "arrinput")
- Create an output blob container in the storage account (for example named "arroutput")
- Retrieve a stored access signature with read & list access for your input storage container
- Retrieve a stored access signature with write access for your output storage container
- Upload your model to the input container

The creation of the storage account and the blob containers can be done with one of the following tools:

- [Azure portal](https://portal.azure.com)
- [az command line](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
- SDKs (C#, Python ... )

## Retrieving SAS for the storage containers

Stored access signatures (SAS) are used to grant read access for input, and write access for output. We recommend generating new URIs each time a model is converted. Since URIs expire after some time, persisting them for a longer duration may risk breaking your application unexpectedly.

Details about SAS can be found at the [SAS documentation](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1).

A SAS URI can be generated using one of:

- az powershell module
  - see the [example PowerShell scripts](../../samples/powershell-example-scripts-for-frontend.md)
- [az command line](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
  - right click on container "Get Shared Access Signature" (read, list access for input container, write access for output container)
- SDKs (C#, Python ... )

## Uploading an input model

To start converting a model, you need to upload it, using one of the following options:

- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) - a convenient UI to upload/download/manage files on azure blob storage
- [Azure command line](https://docs.microsoft.com/azure/storage/common/storage-azure-cli)
- [Azure powershell module](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-2.2.0)
  - see the [Example PowerShell scripts](../../samples/powershell-example-scripts-for-frontend.md)
- [Using a storage SDK (Python, C# ... )](https://docs.microsoft.com/azure/storage/)
- [Using the Azure Storage REST APIs](https://docs.microsoft.com/rest/api/storageservices/blob-service-rest-api)

## Getting a SAS URI for the converted model

This step is similar to [Retrieving Stored Access Signatures for the storage containers](#retrieving-stored-access-signatures-for-the-storage-containers). However, this time you need to retrieve a SAS URI for the model file, that was written to the output container.

For example, to retrieve a SAS URI via the [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), right-click on the model file and select "Get Shared Access Signature".

## Next steps

- [Configuring the model conversion](configure-model-conversion.md)
- [The model conversion REST API](conversion-rest-api.md)
