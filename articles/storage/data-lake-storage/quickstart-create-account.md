---
title: Create a Azure Data Lake Storage Gen2 account
description: Quickly learn to create a new Azure Data Lake Storage Gen2 account using the Azure portal, Azure PowerShell, or the Azure CLI.
services: storage
author: jamesbak
manager: jahogg

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 06/27/2018
ms.author: jamesbak
---

# Quickstart: Create a Azure Data Lake Storage Gen2 account

Azure Data Lake Storage Gen2 accounts [support an Hierarchical Namespace Service](introduction.md) which provides a native directory-based file sytem tailored to work with the Hadoop Distributed File System (HNS). Access to Azure Data Lake Storage data from the HNS is available through the [ABFS driver](introduction.md).

** todo ** add link for survey

To enable Azure Data Lake Storage Gen2 capabilities on your storage account, fill out this survey to request access once the account is created.

This quickstart demonstrates how to create a Data Lake Storage account using the [Azure portal](https://portal.azure.com/), [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview), or via the [Azure CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Portal

None.

### PowerShell

This quickstart requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find your current version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

### Azure CLI

You can log in to Azure and run Azure CLI commands in one of two ways:

- You can run CLI commands from within the Azure portal, in Azure Cloud Shell 
- You can install the CLI and run CLI commands locally  

#### Use Azure Cloud Shell

Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account. Click the **Cloud Shell** button on the menu in the upper-right of the Azure portal:

[![Cloud Shell](./media/quickstart-create-account/cloud-shell-menu.png)](https://portal.azure.com)

The button launches an interactive shell that you can use to run the steps in this quickstart:

[![Screenshot showing the Cloud Shell window in the portal](./media/quickstart-create-account/cloud-shell.png)](https://portal.azure.com)

#### Install the CLI locally

You can also install and use the Azure CLI locally. This quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 


## Log in to Azure

### Portal

Log in to the [Azure portal](https://portal.azure.com).

### PowerShell

Log in to your Azure subscription with the `Connect-AzureRmAccount` command and follow the on-screen directions to authenticate.

```powershell
Connect-AzureRmAccount
```

### Azure CLI

To launch Azure Cloud Shell, log in to the [Azure portal](https://portal.azure.com).

To log into your local installation of the CLI, run the login command:

```cli
az login
```

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed. For more information on resource groups, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).

### Portal

To create a resource group in the Azure portal, follow these steps:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups**.
2. Click the **Add** button to add a new resource group.
3. Enter a name for the new resource group.
4. Select the subscription in which to create the new resource group.
5. Choose the location for the resource group.
6. Click the **Create** button.  

![Screen shot showing resource group creation in the Azure portal](./media/quickstart-create-account/create-resource-group.png)

### PowerShell

To create a new resource group with PowerShell, use the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command: 

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

### Azure CLI

To create a new resource group with Azure CLI, use the [az group create](/cli/azure/group#az_group_create) command. 

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

---

## Create a general-purpose storage account

A general-purpose storage account provides access to all of the Azure Storage services: blobs, files, queues, and tables. A general-purpose storage account can be created in either a standard or a premium tier. The examples in this article show how to create a general-purpose storage account in the standard tier (the default).

Azure Storage offers two types of general-purpose storage accounts:

- General-purpose v2 accounts 
- General-purpose v1 accounts. 

> [!NOTE]
> It's recommended that you create new storage accounts as **general-purpose v2 accounts**, to take advantage of newer features available to those accounts.  

For more information about storage account types, see [Azure Storage account options](../common/storage-account-options.md).

When naming your storage account, keep these rules in mind:

- Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
- Your storage account name must be unique within Azure. No two storage accounts can have the same name.

### Portal

To create a general-purpose v2 storage account in the Azure portal, follow these steps:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **All services**. Then, scroll down to **Storage**, and choose **Storage accounts**. On the **Storage Accounts** window that appears, choose **Add**.
2. Enter a name for your storage account.
3. Set the **Account kind** field to **StorageV2 (general-purpose v2)**.
4. Leave the **Replication** field set to **Locally-redundant storage (LRS)**. Alternately, you can chooose **Zone-redundant storage (ZRS Preview)**, **Geo-redundant storage (GRS)**, or **Read-access geo-redundant storage (RA-GRS)**.
5. Leave these fields set to their defaults: **Deployment model**, **Performance**, **Secure transfer required**.
6. Choose the subscription in which you want to create the storage account.
7. In the **Resource group** section, select **Use existing**, then choose the resource group you created in the previous section.
8. Choose the location for your new storage account.
9. Click **Create** to create the storage account.

![Screen shot showing storage account creation in the Azure portal](./media/quickstart-create-account/create-account-portal.png)

### PowerShell

To create a general-purpose v2 storage account from PowerShell with locally-redundant storage (LRS), use the [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/New-AzureRmStorageAccount) command: 

```powershell
New-AzureRmStorageAccount -ResourceGroupName $resourceGroup `
  -Name "storagequickstart" `
  -Location $location `
  -SkuName Standard_LRS `
  -Kind StorageV2 
  -IsHnsEnabled $True
```

To create a general-purpose v2 storage account with zone-redundant storage (ZRS Preview), geo-redundant storage (GRS), or read-access geo-redundant storage (RA-GRS), substitute the desired value in the table below for the **SkuName** parameter. 

|Replication option  |SkuName parameter  |
|---------|---------|
|Locally-redundant storage (LRS)     |Standard_LRS         |
|Zone-redundant storage (ZRS)     |Standard_ZRS         |
|Geo-redundant storage (GRS)     |Standard_GRS         |
|Read-access geo-redundant storage (GRS)     |Standard_RAGRS         |

### Azure CLI

To create a general-purpose v2 storage account from the Azure CLI with locally-redundant storage, use the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command.

```azurecli-interactive
az storage account create \
    --name storagequickstart \
    --resource-group storage-quickstart-resource-group \
    --location westus \
    --sku Standard_LRS \
    --kind StorageV2 \
    --is-hns-enabled true
```

To create a general-purpose v2 storage account with zone-redundant storage (ZRS Preview), geo-redundant storage (GRS), or read-access geo-redundant storage (RA-GRS), substitute the desired value in the table below for the **sku** parameter. 

|Replication option  |sku parameter  |
|---------|---------|
|Locally-redundant storage (LRS)     |Standard_LRS         |
|Zone-redundant storage (ZRS)     |Standard_ZRS         |
|Geo-redundant storage (GRS)     |Standard_GRS         |
|Read-access geo-redundant storage (GRS)     |Standard_RAGRS         |

---

> [!NOTE]
> [Zone-redundant storage](https://azure.microsoft.com/blog/announcing-public-preview-of-azure-zone-redundant-storage/preview/) is currently in preview, and is available only in the following locations:
>    - US East 2
>    - US Central
>    - France Central (This region is currently in preview. See [Microsoft Azure preview with Azure Availability Zones now open in France](https://azure.microsoft.com/blog/microsoft-azure-preview-with-azure-availability-zones-now-open-in-france) to request access.)
    
For more information about the different types of replication available, see [Storage replication options](../common/storage-redundancy.md).

## Clean up resources

If you wish to clean up the resources created by this quickstart, you can simply delete the resource group. Deleting the resource group also deletes the associated storage account, and any other resources associated with the resource group.

### Portal

To remove a resource group using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups** to display the list of your resource groups.
2. Locate the resource group to delete, and right-click the **More** button (**...**) on the right side of the listing.
3. Select **Delete resource group**, and confirm.

### PowerShell

To remove the resource group and its associated resources, including the new storage account, use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command: 

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroup
```

### Azure CLI

To remove the resource group and its associated resources, including the new storage account, use the [az group delete](/cli/azure/group#az_group_delete) command.

```azurecli-interactive
az group delete --name myResourceGroup
```

---

## Next steps

In this quick start, you've created a general-purpose standard storage account. To learn how to upload and download blobs to and from your storage account, continue to the Blob storage quickstart.

* [Transfer objects to/from Azure Blob storage using the Azure portal](../blobs/storage-quickstart-blobs-portal.md)
* [Transfer objects to/from Azure Blob storage using PowerShell](../blobs/storage-quickstart-blobs-powershell.md)
* [Transfer objects to and from Azure Blob storage using the Azure CLI](../blobs/storage-quickstart-blobs-cli.md)