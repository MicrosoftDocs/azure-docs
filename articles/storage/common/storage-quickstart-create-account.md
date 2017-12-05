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

## Log in to Azure

# [Portal](#tab/portal)

Log in to the [Azure portal](https://portal.azure.com).

# [PowerShell](#tab/powershell)

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions to authenticate.

```powershell
Login-AzureRmAccount
```

# [Azure CLI](#tab/azure-cli)

You can try this quickstart using the Azure CLI in one of two ways:

- You can run CLI commands from within the Azure portal, in Azure Cloud Shell 
- You can install the CLI and run CLI commands locally  

### Use Azure Cloud Shell

Log in to the [Azure portal](https://portal.azure.com) to launch Azure Cloud Shell.

Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account. Click the **Cloud Shell** button on the menu in the upper-right of the Azure portal:

[![Cloud Shell](./media/storage-quickstart-create-account/cloud-shell-menu.png)](https://portal.azure.com)

The button launches an interactive shell that you can use to run the steps in this quickstart:

[![Screenshot showing the Cloud Shell window in the portal](./media/storage-quickstart-create-account/cloud-shell.png)](https://portal.azure.com)

### Install the CLI locally

You can also install and use the Azure CLI locally. This quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

To log into your local installation of the CLI, run the login command:

```cli
az login
```

---

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed. 

# [Portal](#tab/portal)

xxx

# [PowerShell](#tab/powershell)

Create a resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). 

```powershell
# put resource group in a variable so you can use the same group name going forward,
# without hardcoding it repeatedly
$resourceGroup = "myResourceGroup"
New-AzureRmResourceGroup -Name $resourceGroup -Location $location 
```

# [Azure CLI](#tab/azure-cli)

Create a resource group with the [az group create](/cli/azure/group#create) command. 

```azurecli-interactive
az group create \
    --name myResourceGroup \
    --location eastus
```

If you're unsure which region to specify for the `--location` parameter, you can retrieve a list of supported regions for your subscription with the [az account list-locations](/cli/azure/account#list) command.

```azurecli-interactive
az account list-locations \
    --query "[].{Region:name}" \
    --out table
```

---

# Create a general-purpose storage account





   > [!NOTE]
   > Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
   > 
   > Your storage account name must be unique within Azure. The Azure portal will indicate if the storage account name you select is already in use.
   > 
   > 


# [Portal](#tab/portal)


2. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **More Services**. Then, scroll down to **Storage**, and choose **Storage accounts**. On the **Storage Accounts** window that appears, choose **Add**.
3. Enter a name for your storage account. See [Storage account endpoints](#storage-account-endpoints) for details about how the storage account name will be used to address your objects in Azure Storage.
   
4. Specify the deployment model to be used: **Resource Manager** or **Classic**. **Resource Manager** is the recommended deployment model. For more information, see [Understanding Resource Manager deployment and classic deployment](../../azure-resource-manager/resource-manager-deployment-model.md).
   
   > [!NOTE]
   > Blob storage accounts can only be created using the Resource Manager deployment model.

5. Select the type of storage account: **General purpose** or **Blob storage**. **General purpose** is the default.
   
    If **General purpose** was selected, then specify the performance tier: **Standard** or **Premium**. The default is **Standard**. For more details on standard and premium storage accounts, see [Introduction to Microsoft Azure Storage](storage-introduction.md) and [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../../virtual-machines/windows/premium-storage.md).
   
    If **Blob Storage** was selected, then specify the access tier: **Hot** or **Cool**. The default is **Hot**. See [Azure Blob Storage: Cool and Hot tiers](../blobs/storage-blob-storage-tiers.md) for more details.
6. Select the replication option for the storage account: **LRS**, **GRS**, **RA-GRS**, or **ZRS**. The default is **RA-GRS**. For more details on Azure Storage replication options, see [Azure Storage replication](storage-redundancy.md).
7. Select the subscription in which you want to create the new storage account.
8. Specify a new resource group or select an existing resource group. For more information on resource groups, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).
9. Select the geographic location for your storage account. See [Azure Regions](https://azure.microsoft.com/regions/#services) for more information about what services are available in which region.
10. Click **Create** to create the storage account.


# [PowerShell](#tab/powershell)
ps


# [Azure CLI](#tab/azure-cli)
cli

---

Any objects contained in a given storage account are billed together as a group. By default, the data in your account is available only to you, the account owner.


[!INCLUDE [storage-table-cosmos-db-tip-include](../../../includes/storage-table-cosmos-db-tip-include.md)]
