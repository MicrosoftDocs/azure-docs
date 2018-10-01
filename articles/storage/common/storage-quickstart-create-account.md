---
title: "Quickstart: Create a storage account - Azure Storage"
description: In this quickstart, you learn to create a storage account using the Azure portal, Azure PowerShell, or the Azure CLI. An Azure storage account provides a unique namespace in Microsoft Azure to store and access the data objects that you create in Azure Storage.
services: storage
author: tamram
ms.custom: mvc

ms.service: storage
ms.topic: quickstart
ms.date: 09/18/2018
ms.author: tamram
ms.component: common
---

# Create a storage account

In this quickstart, you learn to create a storage account using the [Azure portal](https://portal.azure.com/), [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview), or [Azure CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest).  

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

You can also install and use the Azure CLI locally. This quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

---

## Log in to Azure

# [Portal](#tab/portal)

Log in to the [Azure portal](https://portal.azure.com).

# [PowerShell](#tab/powershell)

Log in to your Azure subscription with the `Connect-AzureRmAccount` command and follow the on-screen directions to authenticate.

```powershell
Connect-AzureRmAccount
```

# [Azure CLI](#tab/azure-cli)

To launch Azure Cloud Shell, log in to the [Azure portal](https://portal.azure.com).

To log into your local installation of the CLI, run the login command:

```cli
az login
```

---

## Create a storage account

Now you are ready to create your storage account.

Every storage account must belong to an Azure resource group. A resource group is a logical container for grouping your Azure services. When you create a storage account, you have the option to either create a new resource group, or use an existing resource group. This quickstart shows how to create a new resource group. 

A **general-purpose v2** storage account provides access to all of the Azure Storage services: blobs, files, queues, tables, and disks. The quickstart creates a general-purpose v2 storage account, but the steps to create any type of storage account are similar.   

# [Portal](#tab/portal)

[!INCLUDE [storage-create-account-portal-include](../../../includes/storage-create-account-portal-include.md)]

# [PowerShell](#tab/powershell)

First, create a new resource group with PowerShell using the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command: 

```powershell
# put resource group in a variable so you can use the same group name going forward,
# without hardcoding it repeatedly
$resourceGroup = "storage-quickstart-resource-group"
New-AzureRmResourceGroup -Name $resourceGroup -Location $location 
```

If you're not sure which region to specify for the `-Location` parameter, you can retrieve a list of supported regions for your subscription with the [Get-AzureRmLocation](/powershell/module/azurerm.resources/get-azurermlocation) command:

```powershell
Get-AzureRmLocation | select Location 
$location = "westus"
```

Next, create a general-purpose v2 storage account with locally-redundant storage (LRS). Use the [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/New-AzureRmStorageAccount) command: 

```powershell
New-AzureRmStorageAccount -ResourceGroupName $resourceGroup `
  -Name "storagequickstart" `
  -Location $location `
  -SkuName Standard_LRS `
  -Kind StorageV2 
```

To create a general-purpose v2 storage account with zone-redundant storage (ZRS) (preview), geo-redundant storage (GRS), or read-access geo-redundant storage (RA-GRS), substitute the desired value in the table below for the **SkuName** parameter. 

|Replication option  |SkuName parameter  |
|---------|---------|
|Locally-redundant storage (LRS)     |Standard_LRS         |
|Zone-redundant storage (ZRS)     |Standard_ZRS         |
|Geo-redundant storage (GRS)     |Standard_GRS         |
|Read-access geo-redundant storage (GRS)     |Standard_RAGRS         |

# [Azure CLI](#tab/azure-cli)

First, create a new resource group with Azure CLI using the [az group create](/cli/azure/group#az_group_create) command. 

```azurecli-interactive
az group create \
    --name storage-quickstart-resource-group \
    --location westus
```

If you're not sure which region to specify for the `--location` parameter, you can retrieve a list of supported regions for your subscription with the [az account list-locations](/cli/azure/account#az_account_list) command.

```azurecli-interactive
az account list-locations \
    --query "[].{Region:name}" \
    --out table
```

Next, create a general-purpose v2 storage account with locally-redundant storage. Use the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command:

```azurecli-interactive
az storage account create \
    --name storagequickstart \
    --resource-group storage-quickstart-resource-group \
    --location westus \
    --sku Standard_LRS \
    --kind StorageV2
```

To create a general-purpose v2 storage account with zone-redundant storage (ZRS Preview), geo-redundant storage (GRS), or read-access geo-redundant storage (RA-GRS), substitute the desired value in the table below for the **sku** parameter. 

|Replication option  |sku parameter  |
|---------|---------|
|Locally-redundant storage (LRS)     |Standard_LRS         |
|Zone-redundant storage (ZRS)     |Standard_ZRS         |
|Geo-redundant storage (GRS)     |Standard_GRS         |
|Read-access geo-redundant storage (GRS)     |Standard_RAGRS         |

---

For more information about available replication options, see [Storage replication options](storage-redundancy.md).

## Clean up resources

If you wish to clean up the resources created by this quickstart, you can simply delete the resource group. Deleting the resource group also deletes the associated storage account, and any other resources associated with the resource group.

# [Portal](#tab/portal)

To remove a resource group using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups** to display the list of your resource groups.
2. Locate the resource group to delete, and right-click the **More** button (**...**) on the right side of the listing.
3. Select **Delete resource group**, and confirm.

# [PowerShell](#tab/powershell)

To remove the resource group and its associated resources, including the new storage account, use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command: 

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroup
```

# [Azure CLI](#tab/azure-cli)

To remove the resource group and its associated resources, including the new storage account, use the [az group delete](/cli/azure/group#az_group_delete) command.

```azurecli-interactive
az group delete --name myResourceGroup
```

---

## Next steps

In this quick start, you've created a general-purpose standard storage account. To learn how to upload and download blobs to and from your storage account, continue to the Blob storage quickstart.

# [Portal](#tab/portal)

> [!div class="nextstepaction"]
> [Work with blobs using the Azure portal](../blobs/storage-quickstart-blobs-portal.md)

# [PowerShell](#tab/powershell)

> [!div class="nextstepaction"]
> [Work with blobs using PowerShell](../blobs/storage-quickstart-blobs-powershell.md)

# [Azure CLI](#tab/azure-cli)

> [!div class="nextstepaction"]
> [Work with blobs storage using the Azure CLI](../blobs/storage-quickstart-blobs-cli.md)

---
