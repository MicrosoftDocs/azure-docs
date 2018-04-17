---
title:  Create an Azure Media Services account with CLI 2.0 | Microsoft Docs
description: Follow the steps of this quickstart to create an Azure Media Services account.
services: media-services
documentationcenter: ''
author: Juliako
manager: cflower
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 03/27/2018
ms.author: juliako
---

# Create an Azure Media Services account

When creating a Media Services account, you need to supply the name of an Azure Storage account resource. The specified storage account is attached to your Media Services account. This storage account resource has to be located in the same geographic region as the Media Services account.  

This topic describes steps for creating a new Azure Media Services account using CLI 2.0.  

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Log in to Azure

Log in to the [Azure portal](http://portal.azure.com) and launch **CloudShell** to execute CLI commands, as shown in the next steps.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the CLI locally, this topic requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Set the Azure subscription

In the following command, provide the Azure subscription ID that you want to use for the Media Services account. You can see a list of subscriptions that you have access to by navigating to [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).

```azurecli-interactive
az account set --subscription mySubscriptionId
```

## Create an Azure Resource Group

The following command creates a resource group in which you want to have the Storage and Media Services account. Substitute *amsResourceGroup* with the name you want to use for your resource group.

```azurecli-interactive
az group create -n amsResourceGroup -l westus2
```

## Create an Azure Storage account

When creating a Media Services account, you need to supply the ID of an Azure Storage account resource. The specified storage account is attached to your Media Services account. 

You must have one **Primary** storage account and you can have  any number of **Secondary** storage accounts associated with your Media Services account. Media Services supports **General-purpose v2** (GPv2) or **General-purpose v1** (GPv1) accounts. Blob only accounts are not allowed as **Primary**. If you want to learn more about storage accounts, see [Azure Storage account options](../../storage/common/storage-account-options.md). 

The following command creates the Storage account that is going to be associated with the Media Services Account. In the script below, you can substitute *storageaccountforams*.  

```azurecli-interactive
az storage account create -n storageaccountforams -g amsResourceGroup
```

## Create an Azure Media Services account

Below you can find the Azure CLI command that creates a new Media Services account. You can replace the following values:

* *amsaccount*
* *amsResourceGroup*
* *storageaccountforams*

```azurecli-interactive
az ams account create -n amsaccount -g amsResourceGroup --storage-account storageaccountforams
```

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)
