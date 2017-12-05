---
title: Azure Quickstart - Create a storage account | Microsoft Docs
description: Quickly learn to create a new storage account using the Azure portal, Azure PowerShell, or the Azure CLI.
services: storage
documentationcenter: na
author: tamram
manager: timlt
editor: tysonn

ms.assetid:
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 12/04/2017
ms.author: tamram
---

# Create a new storage account

An Azure storage account provides a unique namespace in the cloud to store and access your data objects in Azure Storage. A storage account contains any blobs, files, queues, tables, and disks that you create under that account. 

To get started with Azure Storage, you first need to create a new storage account. You can create an Azure storage account using the [Azure portal](https://portal.azure.com/), [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview), or [Azure CLI](https://docs.microsoft.com/cli/azure/overview?view=azure-cli-latest). This quickstart shows how to use each of these options to create your new storage account. 


## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

# [Portal](#tab/portal)

Log in to the [Azure portal](https://portal.azure.com).

# [PowerShell](#tab/powershell)

This quick start requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

If you don't know which location you want to use, you can list the available locations. After the list is displayed, find the one you want to use. This example will use **eastus**. Store this in a variable and use the variable so you can change it in one place.

```powershell
Get-AzureRmLocation | select Location 
$location = "eastus"
```

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 





Any objects contained in a given storage account are billed together as a group. By default, the data in your account is available only to you, the account owner.


[!INCLUDE [storage-table-cosmos-db-tip-include](../../../includes/storage-table-cosmos-db-tip-include.md)]
