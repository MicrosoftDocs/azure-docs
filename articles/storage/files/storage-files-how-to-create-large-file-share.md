---
title: Enable and create large file shares - Azure Files
description: In this article, you'll learn how to enable and create large file shares.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 11/20/2019
ms.author: rogarana
ms.subservice: files
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Enable and create large file shares

Originally, standard file shares could only scale up to 5 TiB. Now, with large file shares, they can scale up to 100 TiB. Premium file shares scale up to 100 TiB by default. 

You can scale up your standard file shares to 100 TiB by enabling your storage account to use large file shares. You can enable an existing account or create a new account.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- If you intend to use the Azure CLI, [install the latest version](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).
- If you intend to use Azure PowerShell, [install the latest version](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.0.0).

## Restrictions

For now, you can only use locally redundant storage and zone-redundant storage on large file share–enabled accounts. You can't use geo-zone-redundant storage, geo-redundant storage, or read-access geo-redundant storage.

Enabling large file shares on an account is an irreversible process. After you enable it, you won't be able to convert your account to geo-zone-redundant storage, geo-redundant storage, or read-access geo-redundant storage.

## Create a new storage account

### The Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, select **All services**. 
1. In the list of resources, enter **Storage Accounts**. As you type, the list filters based on your input. Select **Storage Accounts**.
1. On the **Storage Accounts** window that appears, select **Add**.
1. Select the subscription that you'll use to create the storage account.
1. Under the **Resource group** field, select **Create new**. Enter a name for your new resource group.

    ![Screenshot showing how to create a resource group in the portal](media/storage-files-how-to-create-large-file-share/create-large-file-share.png)

1. Next, enter a name for your storage account. The name must be unique across Azure, be between 3 and 24 characters in length, and include only numbers and lowercase letters.
1. Select a location for your storage account, and make sure it's [one of the regions supported for large file shares](storage-files-planning.md#regional-availability).
1. Set the replication to either **Locally redundant storage** or **Zone-redundant storage**.
1. Leave these fields at their default values:

   |Field  |Value  |
   |---------|---------|
   |Deployment model     |Resource Manager         |
   |Performance     |Standard         |
   |Account kind     |StorageV2 (general-purpose v2)         |
   |Access tier     |Hot         |

1. Select **Advanced**, and then select the **Enabled** option button to the right of **Large file shares**.
1. Select **Review + Create** to review your storage account settings and create the account.

    ![Screenshot with the "enabled" option button on a new storage account in the Azure portal](media/storage-files-how-to-create-large-file-share/large-file-shares-advanced-enable.png)

1. Select **Create**.

### The Azure CLI

First, [install the latest version of the CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) so that you can enable large file shares.

To create a storage account with large file shares enabled, replace `<yourStorageAccountName>`, `<yourResourceGroup>`, and `<yourDesiredRegion>` with your information in the following command:

```azurecli-interactive
## This command creates a large file share–enabled account. It will not support GZRS, GRS, or RA-GRS.
az storage account create –name <yourStorageAccountName> -g <yourResourceGroup> -l <yourDesiredRegion> –sku Standard_LRS --kind StorageV2 –enable-large-file-share
```

### PowerShell

First, [install the latest version of PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.0.0) so that you can enable large file shares.

To create a storage account with large file shares enabled, replace `<yourStorageAccountName>`, `<yourResourceGroup>`, and `<yourDesiredRegion>` with your information in the following command:

```PowerShell
## This command creates a large file share–enabled account. It will not support GZRS, GRS, or RA-GRS.
New-AzStorageAccount -ResourceGroupName <yourResourceGroup> -Name <yourStorageAccountName> -Location <yourDesiredRegion> -SkuName Standard_LRS -EnableLargeFileShare;
```

## Enable large files shares on an existing account

You can also enable large file shares on your existing accounts. If you enable large file shares, you won't be able to convert to geo-zone-redundant storage, geo-redundant storage, or read-access geo-redundant storage. Enabling large file shares is irreversible on this storage account.


### Azure portal

1. Open the [Azure portal](https://portal.azure.com), and go to the storage account where you want to enable large file shares.
1. Open the storage account and select **Configuration**.
1. Select **Enabled** on **Large file shares**, and then select **Save**.
1. Select **Overview** and select **Refresh**.

![Selecting the Enabled option button on an existing storage account in the Azure portal](media/storage-files-how-to-create-large-file-share/enable-large-file-shares-on-existing.png)

You've now enabled large file shares on your storage account.

If you receive the error message "Large file shares are not available for the account yet," your region might be in the middle of completing its rollout. Contact support if you have an urgent need for large file shares.

### The Azure CLI

To enable large file shares on your existing account, replace `<yourStorageAccountName>` and `<yourResourceGroup>` with your information in the following command:

```azurecli-interactive
az storage account update –name <yourStorageAccountName> -g <yourResourceGroup> –enable-large-file-share
```

### PowerShell

To enable large file shares on your existing account, replace `<yourStorageAccountName>` and `<yourResourceGroup>` with your information in the following command:

```PowerShell
Set-AzStorageAccount -ResourceGroupName <yourResourceGroup> -Name <yourStorageAccountName> -EnableLargeFileShare
```

## Create a large file share

After you've enabled large file shares on your storage account, you can create file shares in that account with higher quotas. 

### The Azure portal

Creating a large file share is almost identical to creating a standard file share. The main difference is that you can set a quota up to 100 TiB.

1. From your storage account, select **File shares**.
1. Select **+ File share**.
1. Enter a name for your file share. You can also set the quota size you'd like, up to 100 TiB. Then select **Create**. 

![The Azure portal UI showing the Name and Quota boxes](media/storage-files-how-to-create-large-file-share/large-file-shares-create-share.png)

### The Azure CLI

To create a large file share, replace `<yourStorageAccountName>`, `<yourStorageAccountKey>`, and `<yourFileShareName>` with your information in the following command:

```azurecli-interactive
az storage share create --account-name <yourStorageAccountName> --account-key <yourStorageAccountKey> --name <yourFileShareName>
```

### PowerShell

To create a large file share, replace `<YourStorageAccountName>`, `<YourStorageAccountKey>`, and `<YourStorageAccountFileShareName>` with your information in the following command:

```PowerShell
##Config
$storageAccountName = "<YourStorageAccountName>"
$storageAccountKey = "<YourStorageAccountKey>"
$shareName="<YourStorageAccountFileShareName>"
$ctx = New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
New-AzStorageShare -Name $shareName -Context $ctx
```

## Expand existing file shares

After you've enabled large file shares on your storage account, you can also expand existing file shares in that account to the higher quota. 

### The Azure portal

1. From your storage account, select **File shares**.
1. Select and hold (or right-click) your file share, and then select **Quota**.
1. Enter the new size that you want, and then select **OK**.

![The Azure portal UI with Quota of existing file shares](media/storage-files-how-to-create-large-file-share/update-large-file-share-quota.png)

### The Azure CLI

To set the quota to the maximum size, replace `<yourStorageAccountName>`, `<yourStorageAccountKey>`, and `<yourFileShareName>` with your information in the following command:

```azurecli-interactive
az storage share update --account-name <yourStorageAccountName> --account-key <yourStorageAccountKey> --name <yourFileShareName> --quota 102400
```

### PowerShell

To set the quota to the maximum size, replace `<YourStorageAccountName>`, `<YourStorageAccountKey>`, and `<YourStorageAccountFileShareName>` with your information in the following command:

```PowerShell
##Config
$storageAccountName = "<YourStorageAccountName>"
$storageAccountKey = "<YourStorageAccountKey>"
$shareName="<YourStorageAccountFileShareName>"
$ctx = New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
# update quota
Set-AzStorageShareQuota -ShareName $shareName -Context $ctx -Quota 102400
```

## Next steps

* [Connect and mount a file share on Windows](storage-how-to-use-files-windows.md)
* [Connect and mount a file on Linux](storage-how-to-use-files-linux.md)
* [Connect and mount a file on macOS](storage-how-to-use-files-mac.md)