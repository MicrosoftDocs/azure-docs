---
title: Enable and create large file shares - Azure Files
description: In this article, you learn how to enable and create large file shares.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 05/29/2020
ms.author: rogarana
ms.subservice: files 
ms.custom: devx-track-azurecli, devx-track-azurepowershell
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Enable and create large file shares

Your Azure file shares can scale up to 100 TiB after you enable large file shares on your storage account. When you enable large file shares it may also increase your file share's IOPS and throughput limits. You can also enable this scaling on your existing storage accounts for existing and new file shares. For details on performance differences, see [file share and file scale targets](storage-files-scale-targets.md#azure-files-scale-targets).

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- If you intend to use the Azure CLI, [install the latest version](/cli/azure/install-azure-cli).
- If you intend to use the Azure PowerShell module, [install the latest version](/powershell/azure/install-az-ps).

## Restrictions

For now, you can only use locally-redundant storage (LRS) or zone-redundant storage (ZRS) on storage accounts with large file shares enabled. You can't use geo-zone-redundant storage (GZRS), geo-redundant storage (GRS), read-access geo-redundant storage (RA-GRS), or read-access geo-zone-redundant storage (RA-GZRS).

Enabling large file shares on an account is an irreversible process. After you enable it, you won't be able to convert your account to GZRS, GRS, RA-GRS, or RA-GZRS.

## Create a new storage account

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, select **All services**. 
1. In the list of resources, enter **Storage Accounts**. As you type, the list filters based on your input. Select **Storage Accounts**.
1. On the **Storage Accounts** blade that appears, select **+ New**.
1. On the basics blade, fill out the selections as you desire.
1. Make sure that **Performance** is set to **Standard**.
1. Set **Redundancy** to either **Locally redundant storage** or **Zone-redundant storage**.
1. Select the **Advanced** blade, and then select the **Enabled** option button to the right of **Large file shares**.
1. Select **Review + Create** to review your storage account settings and create the account.
1. Select **Create**.

# [Azure CLI](#tab/azure-cli)

First, [install the latest version of the Azure CLI](/cli/azure/install-azure-cli) so that you can enable large file shares.

To create a storage account with large file shares enabled, use the following command. Replace `<yourStorageAccountName>`, `<yourResourceGroup>`, and `<yourDesiredRegion>` with your information.

```azurecli-interactive
## This command creates a large file share–enabled account. It will not support GZRS, GRS, RA-GRS, or RA-GZRS.
az storage account create --name <yourStorageAccountName> -g <yourResourceGroup> -l <yourDesiredRegion> --sku Standard_LRS --kind StorageV2 --enable-large-file-share
```

# [PowerShell](#tab/azure-powershell)

First, [install the latest version of PowerShell](/powershell/azure/install-az-ps) so that you can enable large file shares.

To create a storage account with large file shares enabled, use the following command. Replace `<yourStorageAccountName>`, `<yourResourceGroup>`, and `<yourDesiredRegion>` with your information.

```powershell
## This command creates a large file share–enabled account. It will not support GZRS, GRS, RA-GRS, or RA-GZRS.
New-AzStorageAccount -ResourceGroupName <yourResourceGroup> -Name <yourStorageAccountName> -Location <yourDesiredRegion> -SkuName Standard_LRS -EnableLargeFileShare;
```
---

## Enable large files shares on an existing account

You can also enable large file shares on your existing accounts. If you enable large file shares, you won't be able to convert to GZRS, GRS, RA-GRS, or RA-GZRS. Enabling large file shares is irreversible on this storage account.

# [Portal](#tab/azure-portal)

1. Open the [Azure portal](https://portal.azure.com), and navigate to the storage account where you want to enable large file shares.
1. Open the storage account and select **File shares**.
1. Select **Enabled** on **Large file shares**, and then select **Save**.
1. Select **Overview** and select **Refresh**.
1. Select **Share capacity** then select **100 TiB** and **Save**.

    :::image type="content" source="media/storage-files-how-to-create-large-file-share/files-enable-large-file-share-existing-account.png" alt-text="Screenshot of the azure storage account, file shares blade with 100 tib shares highlighted.":::

You've now enabled large file shares on your storage account. Next, you must [update existing share's quota](#expand-existing-file-shares) to take advantage of increased capacity and scale.

# [Azure CLI](#tab/azure-cli)

To enable large file shares on your existing account, use the following command. Replace `<yourStorageAccountName>` and `<yourResourceGroup>` with your information.

```azurecli-interactive
az storage account update --name <yourStorageAccountName> -g <yourResourceGroup> --enable-large-file-share
```

You've now enabled large file shares on your storage account. Next, you must [update existing share's quota](#expand-existing-file-shares) to take advantage of increased capacity and scale.

# [PowerShell](#tab/azure-powershell)

To enable large file shares on your existing account, use the following command. Replace `<yourStorageAccountName>` and `<yourResourceGroup>` with your information.

```powershell
Set-AzStorageAccount -ResourceGroupName <yourResourceGroup> -Name <yourStorageAccountName> -EnableLargeFileShare
```

You've now enabled large file shares on your storage account. Next, you must [update existing share's quota](#expand-existing-file-shares) to take advantage of increased capacity and scale.

---

## Create a large file share

After you've enabled large file shares on your storage account, you can create file shares in that account with higher quotas. 

# [Portal](#tab/azure-portal)

Creating a large file share is almost identical to creating a standard file share. The main difference is that you can set a quota up to 100 TiB.

1. From your storage account, select **File shares**.
1. Select **+ File share**.
1. Enter a name for your file share. You can also set the quota size you'd like, up to 100 TiB. Then select **Create**. 

![The Azure portal UI showing the Name and Quota boxes](media/storage-files-how-to-create-large-file-share/large-file-shares-create-share.png)

# [Azure CLI](#tab/azure-cli)

To create a large file share, use the following command. Replace `<yourStorageAccountName>`, `<yourStorageAccountKey>`, and `<yourFileShareName>` with your information.

```azurecli-interactive
az storage share create --account-name <yourStorageAccountName> --account-key <yourStorageAccountKey> --name <yourFileShareName>
```

# [PowerShell](#tab/azure-powershell)

To create a large file share, use the following command. Replace `<YourStorageAccountName>`, `<YourStorageAccountKey>`, and `<YourStorageAccountFileShareName>` with your information.

```powershell
##Config
$storageAccountName = "<YourStorageAccountName>"
$storageAccountKey = "<YourStorageAccountKey>"
$shareName="<YourStorageAccountFileShareName>"
$ctx = New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
New-AzStorageShare -Name $shareName -Context $ctx
```
---

## Expand existing file shares

After you've enabled large file shares on your storage account, you can also expand existing file shares in that account to the higher quota. 

# [Portal](#tab/azure-portal)

1. From your storage account, select **File shares**.
1. Right-click your file share, and then select **Quota**.
1. Enter the new size that you want, and then select **OK**.

![The Azure portal UI with Quota of existing file shares](media/storage-files-how-to-create-large-file-share/update-large-file-share-quota.png)

# [Azure CLI](#tab/azure-cli)

To set the quota to the maximum size, use the following command. Replace `<yourStorageAccountName>`, `<yourStorageAccountKey>`, and `<yourFileShareName>` with your information.

```azurecli-interactive
az storage share update --account-name <yourStorageAccountName> --account-key <yourStorageAccountKey> --name <yourFileShareName> --quota 102400
```

# [PowerShell](#tab/azure-powershell)

To set the quota to the maximum size, use the following command. Replace `<YourStorageAccountName>`, `<YourStorageAccountKey>`, and `<YourStorageAccountFileShareName>` with your information.

```powershell
##Config
$storageAccountName = "<YourStorageAccountName>"
$storageAccountKey = "<YourStorageAccountKey>"
$shareName="<YourStorageAccountFileShareName>"
$ctx = New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
# update quota
Set-AzStorageShareQuota -ShareName $shareName -Context $ctx -Quota 102400
```
---

## Next steps

* [Connect and mount a file share on Windows](storage-how-to-use-files-windows.md)
* [Connect and mount a file share on Linux](storage-how-to-use-files-linux.md)
* [Connect and mount a file share on macOS](storage-how-to-use-files-mac.md)