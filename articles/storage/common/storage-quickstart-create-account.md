---
title: Create a storage account - Azure Storage
description: In this how-to article, you learn to create a storage account using the Azure portal, Azure PowerShell, or the Azure CLI. An Azure storage account provides a unique namespace in Microsoft Azure to store and access the data objects that you create in Azure Storage.
services: storage
author: tamram
ms.custom: mvc

ms.service: storage
ms.topic: article
ms.date: 05/06/2019
ms.author: tamram
ms.subservice: common
---

# Create a storage account

An Azure storage account contains all of your Azure Storage data objects: blobs, files, queues, tables, and disks. The storage account provides a unique namespace for your Azure Storage data that is accessible from anywhere in the world over HTTP or HTTPS. Data in your Azure storage account is durable and highly available, secure, and massively scalable.

In this how-to article, you learn to create a storage account using the [Azure portal](https://portal.azure.com/), [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview), [Azure CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest), or an [Azure Resource Manager template](../../azure-resource-manager/resource-group-overview.md).  

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

# [Portal](#tab/azure-portal)

None.

# [PowerShell](#tab/azure-powershell)

This how-to article requires the Azure PowerShell module Az version 0.7 or later. Run `Get-Module -ListAvailable Az` to find your current version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps).

# [Azure CLI](#tab/azure-cli)

You can sign in to Azure and run Azure CLI commands in one of two ways:

- You can run CLI commands from within the Azure portal, in Azure Cloud Shell.
- You can install the CLI and run CLI commands locally.

### Use Azure Cloud Shell

Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. The Azure CLI is pre-installed and configured to use with your account. Click the **Cloud Shell** button on the menu in the upper-right section of the Azure portal:

[![Cloud Shell](./media/storage-quickstart-create-account/cloud-shell-menu.png)](https://portal.azure.com)

The button launches an interactive shell that you can use to run the steps outlined in this how-to article:

[![Screenshot showing the Cloud Shell window in the portal](./media/storage-quickstart-create-account/cloud-shell.png)](https://portal.azure.com)

### Install the CLI locally

You can also install and use the Azure CLI locally. This how-to article requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

# [Template](#tab/template)

None.

---

## Sign in to Azure

# [Portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com).

# [PowerShell](#tab/azure-powershell)

Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions to authenticate.

```powershell
Connect-AzAccount
```

# [Azure CLI](#tab/azure-cli)

To launch Azure Cloud Shell, sign in to the [Azure portal](https://portal.azure.com).

To log into your local installation of the CLI, run the [az login](/cli/azure/reference-index#az-login) command:

```cli
az login
```

# [Template](#tab/template)

N/A

---

## Create a storage account

Now you are ready to create your storage account.

Every storage account must belong to an Azure resource group. A resource group is a logical container for grouping your Azure services. When you create a storage account, you have the option to either create a new resource group, or use an existing resource group. This article shows how to create a new resource group.

A **general-purpose v2** storage account provides access to all of the Azure Storage services: blobs, files, queues, tables, and disks. The steps outlined here create a general-purpose v2 storage account, but the steps to create any type of storage account are similar.

# [Portal](#tab/azure-portal)

[!INCLUDE [storage-create-account-portal-include](../../../includes/storage-create-account-portal-include.md)]

# [PowerShell](#tab/azure-powershell)

First, create a new resource group with PowerShell using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command:

```powershell
# put resource group in a variable so you can use the same group name going forward,
# without hard-coding it repeatedly
$resourceGroup = "storage-resource-group"
New-AzResourceGroup -Name $resourceGroup -Location $location
```

If you're not sure which region to specify for the `-Location` parameter, you can retrieve a list of supported regions for your subscription with the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command:

```powershell
Get-AzLocation | select Location
$location = "westus"
```

Next, create a general-purpose v2 storage account with read-access geo-redundant storage (RA-GRS) by using the [New-AzStorageAccount](/powershell/module/az.storage/New-azStorageAccount) command. Remember that the name of your storage account must be unique across Azure, so replace the placeholder value in brackets with your own unique value:

```powershell
New-AzStorageAccount -ResourceGroupName $resourceGroup `
  -Name <account-name> `
  -Location $location `
  -SkuName Standard_RAGRS `
  -Kind StorageV2 
```

To create a general-purpose v2 storage account with a different replication option, substitute the desired value in the table below for the **SkuName** parameter.

|Replication option  |SkuName parameter  |
|---------|---------|
|Locally redundant storage (LRS)     |Standard_LRS         |
|Zone-redundant storage (ZRS)     |Standard_ZRS         |
|Geo-redundant storage (GRS)     |Standard_GRS         |
|Read-access geo-redundant storage (GRS)     |Standard_RAGRS         |

# [Azure CLI](#tab/azure-cli)

First, create a new resource group with Azure CLI using the [az group create](/cli/azure/group#az_group_create) command.

```azurecli-interactive
az group create \
    --name storage-resource-group \
    --location westus
```

If you're not sure which region to specify for the `--location` parameter, you can retrieve a list of supported regions for your subscription with the [az account list-locations](/cli/azure/account#az_account_list) command.

```azurecli-interactive
az account list-locations \
    --query "[].{Region:name}" \
    --out table
```

Next, create a general-purpose v2 storage account with read-access geo-redundant storage by using the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command. Remember that the name of your storage account must be unique across Azure, so replace the placeholder value in brackets with your own unique value:

```azurecli-interactive
az storage account create \
    --name <account-name> \
    --resource-group storage-resource-group \
    --location westus \
    --sku Standard_RAGRS \
    --kind StorageV2
```

To create a general-purpose v2 storage account with a different replication option, substitute the desired value in the table below for the **sku** parameter.

|Replication option  |sku parameter  |
|---------|---------|
|Locally redundant storage (LRS)     |Standard_LRS         |
|Zone-redundant storage (ZRS)     |Standard_ZRS         |
|Geo-redundant storage (GRS)     |Standard_GRS         |
|Read-access geo-redundant storage (GRS)     |Standard_RAGRS         |

# [Template](#tab/template)

You can use either Azure Powershell or Azure CLI to deploy a Resource Manager template to create a storage account. The template used in this how-to article is from [Azure Resource Manager quickstart templates](https://azure.microsoft.com/resources/templates/101-storage-account-create/). To run the scripts, select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json"
```

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
echo "Enter the location (i.e. centralus):" &&
read location &&
az group create --name $resourceGroupName --location "$location" &&
az group deployment create --resource-group $resourceGroupName --template-file "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json"
```

To learn how to create templates, see:

- [Azure Resource Manager documentation](/azure/azure-resource-manager/).
- [Storage account template reference](/azure/templates/microsoft.storage/allversions).
- [Additional storage account template samples](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Storage).

---

For more information about available replication options, see [Storage replication options](storage-redundancy.md).

## Clean up resources

If you wish to clean up the resources created by this how-to article, you can delete the resource group. Deleting the resource group also deletes the associated storage account, and any other resources associated with the resource group.

# [Portal](#tab/azure-portal)

To remove a resource group using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups** to display the list of your resource groups.
2. Locate the resource group to delete, and right-click the **More** button (**...**) on the right side of the listing.
3. Select **Delete resource group**, and confirm.

# [PowerShell](#tab/azure-powershell)

To remove the resource group and its associated resources, including the new storage account, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command:

```powershell
Remove-AzResourceGroup -Name $resourceGroup
```

# [Azure CLI](#tab/azure-cli)

To remove the resource group and its associated resources, including the new storage account, use the [az group delete](/cli/azure/group#az_group_delete) command.

```azurecli-interactive
az group delete --name storage-resource-group
```

# [Template](#tab/template)

To remove the resource group and its associated resources, including the new storage account, use either Azure PowerShell or Azure CLI.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
```

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName
```

---

## Next steps

In this how-to article, you've created a general-purpose v2 standard storage account. To learn how to upload and download blobs to and from your storage account, continue to one of the Blob storage quickstarts.

# [Portal](#tab/azure-portal)

> [!div class="nextstepaction"]
> [Work with blobs using the Azure portal](../blobs/storage-quickstart-blobs-portal.md)

# [PowerShell](#tab/azure-powershell)

> [!div class="nextstepaction"]
> [Work with blobs using PowerShell](../blobs/storage-quickstart-blobs-powershell.md)

# [Azure CLI](#tab/azure-cli)

> [!div class="nextstepaction"]
> [Work with blobs using the Azure CLI](../blobs/storage-quickstart-blobs-cli.md)

# [Template](#tab/template)

> [!div class="nextstepaction"]
> [Work with blobs using the Azure portal](../blobs/storage-quickstart-blobs-portal.md)

---
