---
title: Create an Azure Data Lake Storage Gen2 storage account | Microsoft Docs
description: Quickly learn to create a new storage account with access to Data Lake Storage Gen2 using the Azure portal, Azure PowerShell, or the Azure CLI.
services: storage
author: normesta

ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: quickstart
ms.date: 12/06/2018
ms.author: normesta
ms.reviewer: jamesbak
---

# Quickstart: Create an Azure Data Lake Storage Gen2 storage account

Azure Data Lake Storage Gen2 [supports a hierarchical namespace](data-lake-storage-introduction.md) which provides a native directory-based file system tailored to work with the Hadoop Distributed File System (HDFS). Access to Data Lake Storage Gen2 data from the HDFS is available through the [ABFS driver](data-lake-storage-abfs-driver.md).

This quickstart demonstrates how to create an account using the [Azure portal](https://portal.azure.com/), [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview), or via the [Azure CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. 

|           | Prerequisite |
|-----------|--------------|
|Portal     | None         |
|PowerShell | This quickstart requires the PowerShell module Az.Storage version **0.7** or later. To find your current version, run the `Get-Module -ListAvailable Az.Storage` command. If after you run this command, no results appear, or if a version other than **0.7** appears, then you'll have to upgrade your powershell module. See the [Upgrade your powershell module](#upgrade-your-powershell-module) section of this guide.
|CLI        | You can sign in to Azure and run Azure CLI commands in one of two ways: <ul><li>You can run CLI commands from within the Azure portal, in Azure Cloud Shell </li><li>You can install the CLI and run CLI commands locally</li></ul>|

When working on the command line you have the option of running the Azure Cloud shell or installing the CLI locally.

### Use Azure Cloud Shell

Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account. Click the **Cloud Shell** button on the menu in the upper-right of the Azure portal:

[![Cloud Shell](./media/data-lake-storage-quickstart-create-account/cloud-shell-menu.png)](https://portal.azure.com)

The button launches an interactive shell that you can use to run the steps in this quickstart:

[![Screenshot showing the Cloud Shell window in the portal](./media/data-lake-storage-quickstart-create-account/cloud-shell.png)](https://portal.azure.com)

### Install the CLI locally

You can also install and use the Azure CLI locally. This quickstart requires that you are running the Azure CLI version 2.0.38 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Create a storage account with Azure Data Lake Storage Gen2 enabled

Before you create an account, you first create a resource group that acts as a logical container to storage accounts or any other Azure resources you create. If you wish to clean up the resources created by this quickstart, you can simply delete the resource group. Deleting the resource group also deletes the associated storage account, and any other resources associated with the resource group. For more information regarding resource groups, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).

> [!NOTE]
> You must create new storage accounts as type **StorageV2 (general-purpose V2)** to take advantage of Data Lake Storage Gen2 features.  

For more information about storage accounts, see [Azure Storage account overview](../common/storage-account-overview.md).

When naming your storage account, keep these rules in mind:

- Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
- Your storage account name must be unique within Azure. No two storage accounts can have the same name.

## Create an account using the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

### Create a resource group

To create a resource group in the Azure portal, follow these steps:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups**.
2. Click the **Add** button to add a new resource group.
3. Enter a name for the new resource group.
4. Select the subscription in which to create the new resource group.
5. Choose the location for the resource group.
6. Click the **Create** button.  

   ![Screenshot showing resource group creation in the Azure portal](./media/data-lake-storage-quickstart-create-account/create-resource-group.png)

### Create a general-purpose v2 storage account

To create a general-purpose v2 storage account in the Azure portal, follow these steps:

> [!NOTE]
> The hierarchical namespace is currently available in all public regions.

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **All services**. Then, scroll down to **Storage**, and choose **Storage accounts**. On the **Storage Accounts** window that appears, choose **Add**.
2. Select your **Subscription** and the **Resource group** you created earlier.
3. Enter a name for your storage account.
4. Set **Location** to **West US 2**
5. Leave these fields set to their defaults: **Performance**, **Account kind**, **Replication**, **Access tier**.
6. Choose the subscription in which you want to create the storage account.
7. Select **Next : Advanced >**
8. Leave the values under **SECURITY** and **VIRTUAL NETWORKS** fields set to their defaults.
9. In the **Data Lake Storage Gen2** section set **Hierarchical namespace** to **Enabled**.
10. Click **Review + Create** to create the storage account.

    ![Screenshot showing storage account creation in the Azure portal](./media/data-lake-storage-quickstart-create-account/azure-data-lake-storage-account-create-advanced.png)

Your storage account is now created through the portal.

### Clean up resources

To remove a resource group using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups** to display the list of your resource groups.
2. Locate the resource group to delete, and right-click the **More** button (**...**) on the right side of the listing.
3. Select **Delete resource group**, and confirm.

## Create an account using PowerShell

First, install the latest version of the [PowerShellGet](https://docs.microsoft.com/powershell/gallery/installing-psget) module.

Then, upgrade your powershell module, sign in to your Azure subscription, create a resource group, and then create a storage account.

### Upgrade your powershell module

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

To interact with Data Lake Storage Gen2 by using PowerShell, you'll need to install module Az.Storage version **0.7** or later.

Start by opening a PowerShell session with elevated permissions.

Install the Az.Storage module

```powershell
Install-Module Az.Storage -Repository PSGallery -AllowPrerelease -AllowClobber -Force
```

### Sign in to your Azure Subscription

Use the `Login-AzAccount` command and follow the on-screen directions to authenticate.

```powershell
Login-AzAccount
```

### Create a resource group

To create a new resource group with PowerShell, use the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command: 

> [!NOTE]
> The hierarchical namespace is currently available in all public regions.

```powershell
# put resource group in a variable so you can use the same group name going forward,
# without hardcoding it repeatedly
$resourceGroup = "storage-quickstart-resource-group"
$location = "westus2"
New-AzResourceGroup -Name $resourceGroup -Location $location
```

### Create a general-purpose v2 storage account

To create a general-purpose v2 storage account from PowerShell with locally-redundant storage (LRS), use the [New-AzStorageAccount](/powershell/module/az.storage/New-azStorageAccount) command:

```powershell
$location = "westus2"

New-AzStorageAccount -ResourceGroupName $resourceGroup `
  -Name "storagequickstart" `
  -Location $location `
  -SkuName Standard_LRS `
  -Kind StorageV2 `
  -EnableHierarchicalNamespace $True
```

### Clean up resources

To remove the resource group and its associated resources, including the new storage account, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command: 

```powershell
Remove-AzResourceGroup -Name $resourceGroup
```

## Create an account using Azure CLI

To start Azure Cloud Shell, sign in to the [Azure portal](https://portal.azure.com).

If you want to sign in to your local installation of the CLI, run the login command:

```cli
az login
```

### Add the CLI extension for Azure Data Lake Gen 2

To interact with Data Lake Storage Gen2 by using the CLI, you'll have to add an extension to your shell.

To do that, enter the following command by using either the Cloud Shell or a local shell: `az extension add --name storage-preview`

### Create a resource group

To create a new resource group with Azure CLI, use the [az group create](/cli/azure/group) command.

```azurecli-interactive
az group create `
    --name storage-quickstart-resource-group `
    --location westus2
```

> [!NOTE]
> > The hierarchical namespace is currently available in all public regions.

### Create a general-purpose v2 storage account

To create a general-purpose v2 storage account from the Azure CLI with locally-redundant storage, use the [az storage account create](/cli/azure/storage/account) command.

```azurecli-interactive
az storage account create `
    --name storagequickstart `
    --resource-group storage-quickstart-resource-group `
    --location westus2 `
    --sku Standard_LRS `
    --kind StorageV2 `
    --hierarchical-namespace true
```

### Clean up resources

To remove the resource group and its associated resources, including the new storage account, use the [az group delete](/cli/azure/group) command.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you've created a storage account with Data Lake Storage Gen2 capabilities. To learn how to upload and download blobs to and from your storage account, see the following topic.

* [AzCopy V10](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
