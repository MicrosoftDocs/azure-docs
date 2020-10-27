---
title: Create an Azure file share
titleSuffix: Azure Files
description: How to create an Azure file share by using the Azure portal, PowerShell, or the Azure CLI.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 2/22/2020
ms.author: rogarana
ms.subservice: files 
ms.custom: devx-track-azurecli, references_regions
---

# Create an Azure file share
To create an Azure file share, you need to answer three questions about how you will use it:

- **What are the performance requirements for your Azure file share?**  
    Azure Files offers standard file shares (including transaction optimized, hot, and cool file shares), which are hosted on hard disk-based (HDD-based) hardware, and premium file shares, which are hosted on solid-state disk-based (SSD-based) hardware.

- **What size file share do you need?**  
    Standard file shares can span up to 100 TiB, however this feature is not enabled by default; if you need a file share that is larger than 5 TiB, you will need to enable the large file share feature for your storage account. Premium file shares can span up to 100 TiB without any special setting, however premium file shares are provisioned, rather than pay as you go like standard file shares. This means that provisioning a file share much larger than what you need will increase the total cost of storage.

- **What are your redundancy requirements for your Azure file share?**  
    Standard file shares offer locally-redundant (LRS), zone redundant (ZRS), geo-redundant (GRS), or geo-zone-redundant (GZRS) storage, however the large file share feature is only supported on locally redundant and zone redundant file shares. Premium file shares do not support any form of geo-redundancy.

    Premium file shares are available with locally redundancy in most regions that offer storage accounts and with zone redundancy in a smaller subset of regions. To find out if premium file shares are currently available in your region, see the [products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage) page for Azure. For information about regions that support ZRS, see [Azure Storage redundancy](../common/storage-redundancy.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

For more information on these three choices, see [Planning for an Azure Files deployment](storage-files-planning.md).

## Prerequisites
- This article assumes that you have already created an Azure subscription. If you don't already have a subscription, then create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- If you intend to use Azure PowerShell, [install the latest version](https://docs.microsoft.com/powershell/azure/install-az-ps).
- If you intend to use the Azure CLI, [install the latest version](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest&preserve-view=true).

## Create a storage account
Azure file shares are deployed into *storage accounts*, which are top-level objects that represent a shared pool of storage. This pool of storage can be used to deploy multiple file shares. 

Azure supports multiple types of storage accounts for different storage scenarios customers may have, but there are two main types of storage accounts for Azure Files. Which storage account type you need to create depends on whether you want to create a standard file share or a premium file share: 

- **General purpose version 2 (GPv2) storage accounts**: GPv2 storage accounts allow you to deploy Azure file shares on standard/hard disk-based (HDD-based) hardware. In addition to storing Azure file shares, GPv2 storage accounts can store other storage resources such as blob containers, queues, or tables. File shares can be deployed into the transaction optimized (default), hot, or cool tiers.

- **FileStorage storage accounts**: FileStorage storage accounts allow you to deploy Azure file shares on premium/solid-state disk-based (SSD-based) hardware. FileStorage accounts can only be used to store Azure file shares; no other storage resources (blob containers, queues, tables, etc.) can be deployed in a FileStorage account.

# [Portal](#tab/azure-portal)
To create a storage account via the Azure portal, select **+ Create a resource** from the dashboard. In the resulting Azure Marketplace search window, search for **storage account** and select the resulting search result. This will lead to an overview page for storage accounts; select **Create** to proceed with the storage account creation wizard.

![A screenshot of the storage account quick create option in a browser](media/storage-how-to-create-file-share/create-storage-account-0.png)

#### The Basics section
The first section to complete to create a storage account is labeled **Basics**. This contains all of the required fields to create a storage account. To create a GPv2 storage account, ensure the **Performance** radio button is set to *Standard* and the **Account kind** drop-down list is selected to *StorageV2 (general purpose v2)*.

![A screenshot of the Performance radio button with Standard selected and Account kind with StorageV2 selected](media/storage-how-to-create-file-share/create-storage-account-1.png)

To create a FileStorage storage account, ensure the **Performance** radio button is set to *Premium* and the **Account kind** drop-down list is selected to *FileStorage*.

![A screenshot of the Performance radio button with Premium selected and Account kind with FileStorage selected](media/storage-how-to-create-file-share/create-storage-account-2.png)

The other basics fields are independent from the choice of storage account:
- **Subscription**: The subscription for the storage account to be deployed into. 
- **Resource group**: The resource group for the storage account to be deployed into. You may either create a new resource group or use an existing resource group. A resource group is a logical container for grouping your Azure services. When you create a storage account, you have the option to either create a new resource group, or use an existing resource group.
- **Storage account name**: The name of the storage account resource to be created. This name must be globally unique, but otherwise can any name you desire. The storage account name will be used as the server name when you mount an Azure file share via SMB.
- **Location**: The region for the storage account to be deployed into. This can be the region associated with the resource group, or any other available region.
- **Replication**: Although this is labeled replication, this field actually means **redundancy**; this is the desired redundancy level: locally redundancy (LRS), zone redundancy (ZRS), geo-redundancy (GRS), and geo-zone-redundancy. This drop-down list also contains read-access geo-redundancy (RA-GRS) and read-access geo-zone redundancy (RA-GZRS), which do not apply to Azure file shares; any file share created in a storage account with these selected will actually be either geo-redundant or geo-zone-redundant, respectively. Depending on your region or selected storage account type, some redundancy options may not be allowed.
- **Blob access tier**: This field does not apply to Azure Files, so you can choose either one of the radio buttons. 

> [!Important]  
> Selecting the blob access tier does not affect the tier of the file share.

#### The Networking blade
The networking section allows you to configure networking options. These settings are optional for the creation of the storage account and can be configured later if desired. For more information on these options, see [Azure Files networking considerations](storage-files-networking-overview.md).

#### The Advanced blade
The advanced section contains several important settings for Azure file shares:

- **Secure transfer required**: This field indicates whether the storage account requires encryption in transit for communication to the storage account. We recommend this is left enabled, however, if you require SMB 2.1 support, you must disable this. We recommend if you disable encryption that you constrain your storage account access to a virtual network with service endpoints and/or private endpoints.
- **Large file shares**: This field enables the storage account for file shares spanning up to 100 TiB. Enabling this feature will limit your storage account to only locally redundant and zone redundant storage options. Once a GPv2 storage account has been enabled for large file shares, you cannot disable the large file share capability. FileStorage storage accounts (storage accounts for premium file shares) do not have this option, as all premium file shares can scale up to 100 TiB. 

![A screenshot of the important advanced settings that apply to Azure Files](media/storage-how-to-create-file-share/create-storage-account-3.png)

The other settings that are available in the advanced tab (blob soft-delete, hierarchical namespace for Azure Data Lake storage gen 2, and NFSv3 for blob storage) do not apply to Azure Files.

#### Tags
Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups. These are optional and can be applied after storage account creation.

#### Review + create
The final step to create the storage account is to select the **Create** button on the **Review + create** tab. This button won't be available if all of the required fields for a storage account are not filled.

# [PowerShell](#tab/azure-powershell)
To create a storage account using PowerShell, we will use the `New-AzStorageAccount` cmdlet. This cmdlet has many options; only the required options are shown. To learn more about advanced options, see the [`New-AzStorageAccount` cmdlet documentation](/powershell/module/az.storage/new-azstorageaccount).

To simplify the creation of the storage account and subsequent file share, we will store several parameters in variables. You may replace the variable contents with whatever values you wish, however note that the storage account name must be globally unique.

```powershell
$resourceGroupName = "myResourceGroup"
$storageAccountName = "mystorageacct$(Get-Random)"
$region = "westus2"
```

To create a storage account capable of storing standard Azure file shares, we will use the following command. The `-SkuName` parameter relates to the type of redundancy desired; if you desire a geo-redundant or geo-zone-redundant storage account, you must also remove the `-EnableLargeFileShare` parameter.

```powershell
$storAcct = New-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName `
    -SkuName Standard_LRS `
    -Location $region `
    -Kind StorageV2 `
    -EnableLargeFileShare
```

To create a storage account capable of storing premium Azure file shares, we will use the following command. Note that the `-SkuName` parameter has changed to include both `Premium` and the desired redundancy level of locally redundant (`LRS`). The `-Kind` parameter is `FileStorage` instead of `StorageV2` because premium file shares must be created in a FileStorage storage account instead of a GPv2 storage account.

```powershell
$storAcct = New-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName `
    -SkuName Premium_LRS `
    -Location $region `
    -Kind FileStorage 
```

# [Azure CLI](#tab/azure-cli)
To create a storage account using the Azure CLI, we will use the az storage account create command. This command has many options; only the required options are shown. To learn more about the advanced options, see the [`az storage account create` command documentation](/cli/azure/storage/account).

To simplify the creation of the storage account and subsequent file share, we will store several parameters in variables. You may replace the variable contents with whatever values you wish, however note that the storage account name must be globally unique.

```bash
resourceGroupName="myResourceGroup"
storageAccountName="mystorageacct$RANDOM"
region="westus2"
```

To create a storage account capable of storing standard Azure file shares, we will use the following command. The `--sku` parameter relates to the type of redundancy desired; if you desire a geo-redundant or geo-zone-redundant storage account, you must also remove the `--enable-large-file-share` parameter.

```bash
az storage account create \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --kind StorageV2 \
    --sku Standard_ZRS \
    --enable-large-file-share \
    --output none
```

To create a storage account capable of storing premium Azure file shares, we will use the following command. Note that the `--sku` parameter has changed to include both `Premium` and the desired redundancy level of locally redundant (`LRS`). The `--kind` parameter is `FileStorage` instead of `StorageV2` because premium file shares must be created in a FileStorage storage account instead of a GPv2 storage account.

```bash
az storage account create \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --kind FileStorage \
    --sku Premium_LRS \
    --output none
```

---

## Create file share
Once you've created your storage account, all that is left is to create your file share. This process is mostly the same regardless of whether you're using a premium file share or a standard file share. You should consider the following differences.

Standard file shares may be deployed into one of the standard tiers: transaction optimized (default), hot, or cool. This is a per file share tier that is not affected by the **blob access tier** of the storage account (this property only relates to Azure Blob storage - it does not relate to Azure Files at all). You can change the tier of the share at any time after it has been deployed. Premium file shares cannot be directly converted to standard file shares in any standard tier.

> [!Important]  
> You can move file shares between tiers within GPv2 storage account types (transaction optimized, hot, and cool). Share moves between tiers incur transactions: moving from a hotter tier to a cooler tier will incur the cooler tier's write transaction charge for each file in the share, while a move from a cooler tier to a hotter tier will incur the cool tier's read transaction charge for each file the share.

The **quota** property means something slightly different between premium and standard file shares:

- For standard file shares, it's an upper boundary of the Azure file share, beyond which end-users cannot go. The primary purpose for quota for a standard file share is budgetary: "I don't want this file share to grow beyond this point". If a quota is not specified, standard file share can span up to 100 TiB (or 5 TiB if the large file shares property is not set for a storage account).

- For premium file shares, quota is overloaded to mean **provisioned size**. The provisioned size is the amount that you will be billed for, regardless of actual usage. When you provision a premium file share, you want to consider two factors: 1) the future growth of the share from a space utilization perspective and 2) the IOPS required for your workload. Every provisioned GiB entitles you to additional  reserved and burst IOPS. For more information on how to plan for a premium file share, see [provisioning premium file shares](storage-files-planning.md#understanding-provisioning-for-premium-file-shares).

# [Portal](#tab/azure-portal)
If you just created your storage account, you can navigate to it from the deployment screen by selecting **Go to resource**. If you have previously created the storage account, you can navigate to it via the resource group containing it. Once in the storage account, select the tile labeled **File shares** (you can also navigate to **File shares** via the table of contents for the storage account).

![A screenshot of the File shares tile](media/storage-how-to-create-file-share/create-file-share-1.png)

In the file share listing, you should see any file shares you have previously created in this storage account; an empty table if no file shares have been created yet. Select **+ File share** to create a new file share.

The new file share blade should appear on the screen. Complete the fields in the new file share blade to create a file share:

- **Name**: the name of the file share to be created.
- **Quota**: the quota of the file share for standard file shares; the provisioned size of the file share for premium file shares.
- **Tiers**: the selected tier for a file share. This field is only available in a **general purpose (GPv2) storage account**. You can choose transaction optimized, hot, or cool. The share's tier can be changed at any time. We recommend picking the highest tier possible during a migration, to minimize transaction expenses, and then switching to a lower tier if desired after the migration is complete.

Select **Create** to finishing creating the new share. Note that if your storage account is in a virtual network, you will not be able to successfully create an Azure file share unless your client is also in the virtual network. You can also work around this point-in-time limitation by using the Azure PowerShell `New-AzRmStorageShare` cmdlet.

# [PowerShell](#tab/azure-powershell)
You can create an Azure file share with the [`New-AzRmStorageShare`](/powershell/module/az.storage/New-AzRmStorageShare) cmdlet. The following PowerShell commands assume you have set the variables `$resourceGroupName` and `$storageAccountName` as defined above in the creating a storage account with Azure PowerShell section. 

The following example shows creating a file share with an explicit tier using the `-AccessTier` parameter. This requires using the preview Az.Storage module as indicated in the example. If a tier is not specified, either because you are using the GA Az.Storage module, or because you did not include this command, the default tier for standard file shares is transaction optimized.

> [!Important]  
> For premium file shares, the `-QuotaGiB` parameter refers to the provisioned size of the file share. The provisioned size of the file share is the amount you will be billed for, regardless of usage. Standard file shares are billed based on usage rather than provisioned size.

```powershell
# Update the Azure storage module to use the preview version. You may need to close and 
# reopen PowerShell before running this command. If you are running PowerShell 5.1, ensure 
# the following:
# - Run the below cmdlets as an administrator.
# - Have PowerShellGet 2.2.3 or later. Uncomment the following line to check.
# Get-Module -ListAvailable -Name PowerShellGet
Remove-Module -Name Az.Storage -ErrorAction SilentlyContinue
Uninstall-Module -Name Az.Storage
Install-Module -Name Az.Storage -RequiredVersion "2.1.1-preview" -AllowClobber -AllowPrerelease 

# Assuming $resourceGroupName and $storageAccountName from earlier in this document have already
# been populated. The access tier parameter may be TransactionOptimized, Hot, or Cool for GPv2 
# storage accounts. Standard tiers are only available in standard storage accounts. 
$shareName = "myshare"

New-AzRmStorageShare `
        -ResourceGroupName $resourceGroupName `
        -StorageAccountName $storageAccountName `
        -Name $shareName `
        -AccessTier TransactionOptimized `
        -QuotaGiB 1024 | `
    Out-Null
```

> [!Note]  
> The ability to set and change tiers via PowerShell is provided in the preview Az.Storage PowerShell module. These cmdlets or their output may change before being released in the generally available Az.Storage PowerShell module, so create scripts with this in mind.

# [Azure CLI](#tab/azure-cli)
You can create an Azure file share with the [`az storage share-rm create`](https://docs.microsoft.com/cli/azure/storage/share-rm?view=azure-cli-latest&preserve-view=true#az_storage_share_rm_create) command. The following Azure CLI commands assume you have set the variables `$resourceGroupName` and `$storageAccountName` as defined above in the creating a storage account with Azure CLI section.

The functionality to create or move a file share to a specific tier is available in the latest Azure CLI update. Updating Azure CLI is specific to the operating system/Linux distribution your are using. For instructions on how to update Azure CLI on your system, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest&preserve-view=true).

> [!Important]  
> For premium file shares, the `--quota` parameter refers to the provisioned size of the file share. The provisioned size of the file share is the amount you will be billed for, regardless of usage. Standard file shares are billed based on usage rather than provisioned size.

```bash
shareName="myshare"

az storage share-rm create \
    --resource-group $resourceGroupName \
    --storage-account $storageAccountName \
    --name $shareName \
    --access-tier "TransactionOptimized" \
    --quota 1024 \
    --output none
```

> [!Note]  
> The ability to set a tier with the `--access-tier` parameter is provided a preview in the latest Azure CLI package. This command or its output may change before being marked as generally available, so create scripts with this in mind.

---

> [!Note]  
> The name of your file share must be all lowercase. For complete details about naming file shares and files, see [Naming and referencing shares, directories, files, and metadata](https://msdn.microsoft.com/library/azure/dn167011.aspx).

### Changing the tier of an Azure file share
File shares deployed in **general purpose v2 (GPv2) storage account** can be in the transaction optimized, hot, or cool tiers. You can change the tier of the Azure file share at any time, subject to transaction costs as described above.

# [Portal](#tab/azure-portal)
On the main storage account page, select **File shares**  select the tile labeled **File shares** (you can also navigate to **File shares** via the table of contents for the storage account).

![A screenshot of the File shares tile](media/storage-how-to-create-file-share/create-file-share-1.png)

In the table list of file shares, select the file share for which you would like to change the tier. On the file share overview page, select **Change tier** from the menu.

![A screenshot of the file share overview page with the change tier button highlighted](media/storage-how-to-create-file-share/change-tier-0.png)

On the resulting dialog, select the desired tier: transaction optimized, hot, or cool.

![A screenshot of the change tier dialog](media/storage-how-to-create-file-share/change-tier-1.png)

# [PowerShell](#tab/azure-powershell)
The following PowerShell cmdlet assumes that you have set the `$resourceGroupName`, `$storageAccountName`, `$shareName` variables as described in the earlier sections of this document.

```PowerShell
# This cmdlet requires Az.Storage version 2.1.1-preview, which is installed
# in the earlier example.
Update-AzRmStorageShare `
    -ResourceGroupName $resourceGroupName `
    -StorageAccountName $storageAccountName `
    -Name $shareName `
    -AccessTier Cool
```

# [Azure CLI](#tab/azure-cli)
The following Azure CLI command assumes that you have set the `$resourceGroupName`, `$storageAccountName`, and `$shareName` variables as described in the earlier sections of this document.

```bash
az storage share-rm update \
    --resource-group $resourceGroupName \
    --storage-account $storageAccountName \
    --name $shareName \
    --access-tier "Cool"
```

---

## Next steps
- [Plan for a deployment of Azure Files](storage-files-planning.md) or [Plan for a deployment of Azure File Sync](storage-sync-files-planning.md). 
- [Networking overview](storage-files-networking-overview.md).
- Connect and mount a file share on [Windows](storage-how-to-use-files-windows.md), [macOS](storage-how-to-use-files-mac.md), and [Linux](storage-how-to-use-files-linux.md).