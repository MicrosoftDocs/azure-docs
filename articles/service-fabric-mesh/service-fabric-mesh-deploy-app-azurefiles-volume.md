---
title: Deploy an application that uses an Azure Files volume to Service Fabric Mesh | Microsoft Docs
description: Learn how to deploy an application that uses the Azure Files volume to Service Fabric Mesh using the Azure CLI.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: azure-cli
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/26/2018
ms.author: ryanwi
ms.custom: mvc, devcenter
---

# Deploy an application that uses the Azure Files volume
This sample illustrates the use of storage volumes in a container running in Azure Service Fabric Mesh. As a part of this sample:

- Create a file share with [Azure Files](/azure/storage/files/storage-files-introduction) 
- Reference that share as a volume for a container instnace that we'll deploy
  - When the container starts, it mounts that share as a specific location within the container
- The code running inside the container writes a text file to that location
- Verify the file is written correctly in the share that backs the volume

## Example JSON templates

Linux: [https://seabreezequickstart.blob.core.windows.net/templates/azurefiles-volume/sbz_rp.linux.json](https://seabreezequickstart.blob.core.windows.net/templates/azurefiles-volume/sbz_rp.linux.json)

Windows: [https://seabreezequickstart.blob.core.windows.net/templates/azurefiles-volume/sbz_rp.windows.json](https://seabreezequickstart.blob.core.windows.net/templates/azurefiles-volume/sbz_rp.windows.json)

## Create the Azure Files file share
Follow the instructions in the [Azure Files documentation](/azure/storage/files/storage-how-to-create-file-share) to create a file share for the application to use.

## Setup Service Fabric Mesh CLI
[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete these steps. If you choose to install and use the CLI locally, you must install the Azure CLI version 2.0.35 or later. Run `az --version` to find the version. To install or upgrade to the latest version of the CLI, see [Install Azure CLI 2.0][azure-cli-install].

Install the Azure Service Fabric Mesh CLI extension module. For the preview, Azure Service Fabric Mesh CLI is written as an extension to Azure CLI.

```azurecli-interactive
az extension add --source https://meshcli.blob.core.windows.net/cli/mesh-0.7.0-py2.py3-none-any.whl
```

## Log in to Azure
Log in to Azure and set your subscription.

```azurecli-interactive
az login
az account set --subscription "<subscriptionName>"
```

## Create resource group
Create a resource group (RG) to deploy this example or you can use an existing resource group and skip this step. The preview is available only in `eastus` location.

```azurecli-interactive
az group create --name <resourceGroupName> --location eastus
```

## Deploy the template
Create the application and related resources using one of the following commands.

For Linux:

```azurecli-interactive
az mesh deployment create --resource-group <resourceGroupName> --template-uri https://seabreezequickstart.blob.core.windows.net/templates/azurefiles-volume/sbz_rp.linux.json
```

For Windows:

```azurecli-interactive
az mesh deployment create --resource-group <resourceGroupName> --template-uri https://seabreezequickstart.blob.core.windows.net/templates/azurefiles-volume/sbz_rp.windows.json
```

Follow the prompts to enter the file share name, account name, and account key for the Azure File share that provides the volume. In a minute or so, your command should return with `"provisioningState": "Succeeded"`.

The password parameter in the template is of `string` type for ease of use. It will be displayed on the screen in clear-text and in the deployment status.

## Verify that the application is able to use the volume
The application creates a file named _data.txt_ in the file share (if it does not exist already). The content of this file is a number that is incremented every 30 seconds by the application. To verify that the example works correctly, open the _data.txt_ file periodically and verify that the number is being updated.

The file may be downloaded using any tool that enables browsing an Azure Files file share. The [Microsoft Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) is an example of such a tool.

## Next steps

For more information, see [Service Fabric resources](service-fabric-mesh-service-fabric-resources.md)