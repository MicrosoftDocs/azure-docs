---
title: Use Azure Blob Storage for model conversion
description: Describes common steps to set up and use blob storage for model conversion.
author: jakrams
ms.author: jakras
ms.date: 02/04/2020
ms.topic: how-to
---

# Use Azure Blob Storage for model conversion

The [model conversion](model-conversion.md) service requires access to Azure Blob Storage so it can retrieve input data and store output data. This article describes how to do the most common steps.

## Prepare Azure Storage accounts

- Create a storage account (StorageV2)
- Create an input blob container in the storage account (for example named "arrinput")
- Create an output blob container in the storage account (for example named "arroutput")

> [!TIP]
> For step-by-step instructions how to set up your storage account, have a look at [Quickstart: Convert a model for rendering](../../quickstarts/convert-model.md)

The creation of the storage account and the blob containers can be done with one of the following tools:

- [Azure portal](https://portal.azure.com)
- [az command line](/cli/azure/install-azure-cli)
- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
- SDKs (C#, Python ... )

## Ensure Azure Remote Rendering can access your storage account

Azure Remote Rending needs to retrieve model data from your storage account and write data back to it.

You can grant Azure Remote Rendering access to your storage account in the following two ways:

### Connect your Azure Storage account with your Azure Remote Rendering Account

Follow the steps given in the [Create an Account](../create-an-account.md#link-storage-accounts) section.

### Retrieve SAS for the storage containers

Stored access signatures (SAS) are used to grant read access for input, and write access for output. We recommend generating new URIs each time a model is converted. Since URIs expire after some time, persisting them for a longer duration may risk breaking your application unexpectedly.

Details about SAS can be found at the [SAS documentation](../../../storage/common/storage-sas-overview.md).

A SAS URI can be generated using one of:

- Az PowerShell module
  - see the [example PowerShell scripts](../../samples/powershell-example-scripts.md)
- [az command line](/cli/azure/install-azure-cli)
- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
  - right click on container "Get Shared Access Signature" (read, list access for input container, write access for output container)
- SDKs (C#, Python ... )

An example of using Shared Access Signatures in asset conversion is shown in Conversion.ps1 of the [PowerShell Example Scripts](../../samples/powershell-example-scripts.md#script-conversionps1).

## Upload an input model

To start converting a model, you need to upload it, using one of the following options:

- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) - a convenient UI to upload/download/manage files on Azure blob storage
- [Azure command line](../../../storage/blobs/storage-quickstart-blobs-cli.md)
- [Azure PowerShell module](/powershell/azure/install-azure-powershell)
  - see the [Example PowerShell scripts](../../samples/powershell-example-scripts.md)
- [Using a storage SDK (Python, C# ... )](../../../storage/index.yml)
- [Using the Azure Storage REST APIs](/rest/api/storageservices/blob-service-rest-api)
- [Using the Azure Remote Rendering Toolkit (ARRT)](../../samples/azure-remote-rendering-asset-tool.md)

For an example of how to upload data for conversion refer to Conversion.ps1 of the [PowerShell Example Scripts](../../samples/powershell-example-scripts.md#script-conversionps1).

> [!NOTE]
>
> When uploading an input model take care to avoid long file names and/or folder structures in order to avoid [Windows path length limit](/windows/win32/fileio/maximum-file-path-limitation) issues on the service. 

## Get a SAS URI for the converted model

This step is similar to [retrieving SAS for the storage containers](#retrieve-sas-for-the-storage-containers). However, this time you need to retrieve a SAS URI for the model file, that was written to the output container.

For example, to retrieve a SAS URI via the [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), right-click on the model file and select "Get Shared Access Signature".

A Shared Access Signature (SAS) to load models is needed if you haven't connected your storage account to your Azure Remote Rendering account. You can learn how to connect your account in [Create an Account](../create-an-account.md#link-storage-accounts).

## Next steps

- [Configuring the model conversion](configure-model-conversion.md)
- [The model conversion REST API](conversion-rest-api.md)
