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

None.

# [PowerShell](#tab/powershell)

This quickstart requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find your current version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

# [Azure CLI](#tab/azure-cli)

You can log in to Azure and run Azure CLI commands in one of two ways:

- You can run CLI commands from within the Azure portal, in Azure Cloud Shell 
- You can install the CLI and run CLI commands locally  

### Use Azure Cloud Shell

Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account. Click the **Cloud Shell** button on the menu in the upper-right of the Azure portal:

[![Cloud Shell](./media/storage-quickstart-create-account/cloud-shell-menu.png)](https://portal.azure.com)

The button launches an interactive shell that you can use to run the steps in this quickstart:

[![Screenshot showing the Cloud Shell window in the portal](./media/storage-quickstart-create-account/cloud-shell.png)](https://portal.azure.com)

### Install the CLI locally

You can also install and use the Azure CLI locally. This quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 


## Log in to Azure

# [Portal](#tab/portal)

Log in to the [Azure portal](https://portal.azure.com).

# [PowerShell](#tab/powershell)

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions to authenticate.

```powershell
Login-AzureRmAccount
```

# [Azure CLI](#tab/azure-cli)

To launch Azure Cloud Shell, log in to the [Azure portal](https://portal.azure.com).

To log into your local installation of the CLI, run the login command:

```cli
az login
```

---

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed. For more information on resource groups, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).

# [Portal](#tab/portal)

To create a resource group in the Azure portal, follow these steps:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups**.
2. Click the **Add** button to add a new resource group.
3. Enter a name for the new resource group.
4. Select the subscription in which to create the new resource group.
5. Choose the location for the resource group.
6. Click the **Create** button.  

# [PowerShell](#tab/powershell)

To create a new resource group with PowerShell, use the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command: 

```powershell
# put resource group in a variable so you can use the same group name going forward,
# without hardcoding it repeatedly
$resourceGroup = "myResourceGroup"
New-AzureRmResourceGroup -Name $resourceGroup -Location $location 
```

If you're not sure which region to specify for the `-Location` parameter, you can retrieve a list of supported regions for your subscription with the [Get-AzureRmLocation](/powershell/module/azurerm.resources/get-azurermlocation) command:

```powershell
Get-AzureRmLocation | select Location 
$location = "westus"
```

# [Azure CLI](#tab/azure-cli)

To create a new resource group with Azure CLI, use the [az group create](/cli/azure/group#create) command. 

```azurecli-interactive
az group create \
    --name myResourceGroup \
    --location westus
```

If you're not sure which region to specify for the `--location` parameter, you can retrieve a list of supported regions for your subscription with the [az account list-locations](/cli/azure/account#list) command.

```azurecli-interactive
az account list-locations \
    --query "[].{Region:name}" \
    --out table
```

---

# Create a general-purpose storage account

A general-purpose storage account provides access to all of the Azure Storage services: blobs, files, queues, and tables. A general-purpose storage account can be created in either a standard or a premium tier. The examples in this article show how to create a general-purpose storage account in the standard tier (the default). For information about premium general-purpose storage accounts, see [Introduction to Microsoft Azure Storage](storage-introduction.md).

When naming your storage account, keep these rules in mind:

- Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
- Your storage account name must be unique within Azure. No two storage accounts can have the same name.

# [Portal](#tab/portal)

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **More Services**. Then, scroll down to **Storage**, and choose **Storage accounts**. On the **Storage Accounts** window that appears, choose **Add**.
2. Enter a name for your storage account.
3. Leave these fields set to their defaults: **Deployment model**, **Account kind**, **Performance**, **Replication**, **Secure transfer required**.
4. Choose the subscription in which you want to create the storage account.
5. In the **Resource group** section, select **Use existing**, then choose the resource group you created in the previous section.
6. Choose the location for your new storage account.
7. Click **Create** to create the storage account.      

# [PowerShell](#tab/powershell)
ps


# [Azure CLI](#tab/azure-cli)
cli

---

Any objects contained in a given storage account are billed together as a group. By default, the data in your account is available only to you, the account owner.


[!INCLUDE [storage-table-cosmos-db-tip-include](../../../includes/storage-table-cosmos-db-tip-include.md)]
