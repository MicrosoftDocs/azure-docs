---
title: Quickstart - Create an Azure Media Services account with Azure CLI| Microsoft Docs
description: Follow the steps of this quickstart to create an Azure Media Services account.
services: media-services
documentationcenter: ''
author: Juliako
manager: cflower
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: quickstart
ms.custom: mvc
ms.date: 03/27/2018
ms.author: juliako
#Customer intent: Whether you are a developer or a media content creator, to store, encrypt, encode, manage, and stream media content in Azure, you need to create a Media Services account.
---

# Quickstart: Create an Azure Media Services account

> [!NOTE]
> The latest version of Azure Media Services (2018-03-30) is in preview. This version is also called v3. 

Whether you are a developer or a media content creator, to store, encrypt, encode, manage, and stream media content in Azure, you need to create a Media Services account. When creating a Media Services account, you need to supply the ID of an Azure Storage account resource. The specified storage account is attached to your Media Services account. This storage account resource has to be located in the same geographic region as the Media Services account.  

This quickstart describes steps for creating a new Azure Media Services account using the Azure CLI.  

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Log in to Azure

Log in to the [Azure portal](http://portal.azure.com) and launch **CloudShell** to execute CLI commands, as shown in the next steps.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the CLI locally, this topic requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

## Set the Azure subscription

In the following command, provide the Azure subscription ID that you want to use for the Media Services account. You can see a list of subscriptions that you have access to by navigating to [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).

```azurecli-interactive
az account set --subscription <mySubscriptionId>
```

## Create an Azure Resource Group

The following command creates a resource group in which you want to have the Storage and Media Services account. Substitute the *myresourcegroup* placeholder with the name you want to use for your resource group.

```azurecli-interactive
az group create -n <myresourcegroup> -l westus2
```

## Create an Azure Storage account

When creating a Media Services account, you need to supply the ID of an Azure Storage account resource. The specified storage account is attached to your Media Services account. 

You must have one **Primary** storage account and you can have any number of **Secondary** storage accounts associated with your Media Services account. Media Services supports **general-purpose v2** or **general-purpose v1** accounts. Blob storage accounts are not allowed as **Primary**. For more information about storage accounts, see [Azure storage account overview](../../storage/common/storage-account-overview.md). 

The following command creates the Storage account that is going to be associated with the Media Services Account (primary). In the script below, substitute the *storageaccountforams* placeholder. Ther 'account_name' must have length less than 24.

```azurecli-interactive
az storage account create -n <storageaccountforams> -g <myresourcegroup>
```

## Create an Azure Media Services account

Below you can find the Azure CLI commands that creates a new Media Services account. You just need to replace the following highlighted values:

* *myamsaccountname*
* *myresourcegroup*
* *storageaccountforams*

```azurecli-interactive
az ams create -n <myamsaccountname> -g <myresourcegroup> --storage-account <storageaccountforams>
```

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services account you created in this Quickstart, delete the resource group.

In the **CloudShell**, execute the following command:

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)
