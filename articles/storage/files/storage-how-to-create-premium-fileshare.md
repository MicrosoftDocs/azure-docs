---
title: Create a premium Azure file share
description: Learn how to create an Azure premium file share using the Azure portal, Azure PowerShell module, or the Azure CLI.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 08/26/2020
ms.author: rogarana
ms.subservice: files 
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# How to create an Azure premium file share

Premium file shares are offered on solid-state disk (SSD) storage media and are useful for IO-intensive workloads, including hosting databases and high-performance computing (HPC). Premium file shares are hosted in a special purpose storage account kind, called a FileStorage account. Premium file shares are designed for high performance and enterprise scale applications, providing consistent low latency, high IOPS, and high throughput shares.

This article shows you how to create this new account type using the [Azure portal](https://portal.azure.com/), Azure PowerShell module, and the Azure CLI.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- If you intend to use the Azure CLI, [install the latest version](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).
- If you intend to use the Azure PowerShell module, [install the latest version](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-4.6.0).

## Create a FileStorage storage account

Every storage account must belong to an Azure resource group. A resource group is a logical container for grouping your Azure services. When you create a storage account, you have the option to either create a new resource group, or use an existing resource group. Premium file shares require a FileStorage account.

# [Portal](#tab/azure-portal)

### Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/).

Now you're ready to create your storage account.

1. In the Azure portal, select **Storage Accounts** on the left menu.

    ![Azure portal main page select storage account](media/storage-how-to-create-premium-fileshare/azure-portal-storage-accounts.png)

1. On the **Storage Accounts** window that appears, choose **Add**.
1. Select the subscription in which to create the storage account.
1. Under the **Resource group** field, select **Create new**. Enter a name for your new resource group, as shown in the following image.

1. Next, enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length, and can include numbers and lowercase letters only.
1. Select a location for your storage account, or use the default location.
1. For **Performance** select **Premium**.

    You must select **Premium** for **FileStorage** to be an available option in the **Account kind** dropdown.

1. Select **Account kind** and choose **FileStorage**.
1. Leave **Replication** set to its default value of **Locally-redundant storage (LRS)**.

    ![How to create a storage account for a premium file share](media/storage-how-to-create-premium-fileshare/create-filestorage-account.png)

1. Select **Review + Create** to review your storage account settings and create the account.
1. Select **Create**.

Once your storage account resource has been created, navigate to it.

# [PowerShell](#tab/azure-powershell)

### Sign in to Azure

Use the `Connect-AzAccount` command and follow the on-screen directions to authenticate.

```powershell
Connect-AzAccount
```

### Create a resource group

To create a new resource group with PowerShell, use the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command:

```powershell
# put resource group in a variable so you can use the same group name going forward,
# without hardcoding it repeatedly
$resourceGroup = "storage-how-to-resource-group"
$location = "westus2"
New-AzResourceGroup -Name $resourceGroup -Location $location
```

### Create a FileStorage storage account

To create a FileStorage storage account from PowerShell, use the [New-AzStorageAccount](/powershell/module/az.storage/New-azStorageAccount) command:

```powershell
$storageAcct = New-AzStorageAccount -ResourceGroupName $resourceGroup -Name "fileshowto" -SkuName "Premium_LRS" -Location "westus2" -Kind "FileStorage"
```

# [Azure CLI](#tab/azure-cli)

To start Azure Cloud Shell, sign in to the [Azure portal](https://portal.azure.com).

If you want to log into your local installation of the CLI, make sure you have the latest version, then sign in:

```azurecli
az login
```

### Create a resource group

To create a new resource group with Azure CLI, use the [az group create](/cli/azure/group) command.

```azurecli-interactive
az group create `
    --name files-howto-resource-group `
    --location westus2
```

### Create a FileStorage storage account

To create a FileStorage storage account from the Azure CLI, use the [az storage account create](/cli/azure/storage/account) command.

```azurecli-interactive
az storage account create `
    --name fileshowto `
    --resource-group files-howto-resource-group `
    --location westus `
    --sku Premium_LRS `
    --kind FileStorage
```

### Get the storage account key

Storage account keys control access to resources in a storage account, in this article, we use the key in order to create a premium file share. The keys are automatically created when you create a storage account. You can get the storage account keys for your storage account by using the [az storage account keys list](/cli/azure/storage/account/keys) command:

```azurecli-interactive
STORAGEKEY=$(az storage account keys list \
    --resource-group "myResourceGroup" \
    --account-name $STORAGEACCT \
    --query "[0].value" | tr -d '"')
```
---

## Create a premium file share

Now that you've created a FileStorage account, you can create a premium file share within that storage account.

# [Portal](#tab/azure-portal)

1. In the left menu for the storage account, scroll to the **File service** section, then select **Files**.
1. Select **File share** to create a premium file share.
1. Enter a name and a desired quota for your file share, then select **Create**.

> [!NOTE]
> Provisioned share sizes is specified by the share quota, file shares are billed on the provisioned size. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

   ![Create a premium file share](media/storage-how-to-create-premium-fileshare/create-premium-file-share.png)

# [PowerShell](#tab/azure-powershell)

To create a premium file share with the Azure PowerShell module, use the [New-AzStorageShare](/powershell/module/az.storage/New-AzStorageShare) cmdlet.

> [!NOTE]
> Provisioned share sizes is specified by the share quota, file shares are billed on the provisioned size. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

```powershell
New-AzStorageShare `
   -Name myshare `
   -EnabledProtocol SMB `
   -Context $storageAcct.Context
```

# [Azure CLI](#tab/azure-cli)

To create a premium file share with the Azure CLI, use the [az storage share create](/cli/azure/storage/share) command.

> [!NOTE]
> Provisioned share sizes is specified by the share quota, file shares are billed on the provisioned size. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

```azurecli-interactive
az storage share create \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --enabled-protocol SMB \
    --name "myshare" 
```
---

## Clean up resources

# [Portal](#tab/azure-portal)

If you would like to clean up the resources created in this article, delete the resource group. Deleting the resource group also deletes the associated storage account as well as any other resources associated with the resource group.

# [PowerShell](#tab/azure-powershell)

If you would like to clean up the resources created in this article, delete the resource group. Deleting the resource group also deletes the associated storage account as well as any other resources associated with the resource group.

To remove the resource group and its associated resources, including the new storage account, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command: 

```powershell
Remove-AzResourceGroup -Name $resourceGroup
```

# [Azure CLI](#tab/azure-cli)

If you would like to clean up the resources created in this article, delete the resource group. Deleting the resource group also deletes the associated storage account as well as any other resources associated with the resource group.

To remove the resource group and its associated resources, including the new storage account, use the [az group delete](/cli/azure/group) command.

```azurecli-interactive
az group delete --name myResourceGroup
```
---

## Next steps

In this article, you've created a premium file share. To learn about the performance this account offers, continue to the performance tier section of the planning guide.

> [!div class="nextstepaction"]
> [File share tiers](storage-files-planning.md#storage-tiers)
