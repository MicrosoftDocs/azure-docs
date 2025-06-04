---
title: Create an SMB Azure file share
titleSuffix: Azure Files
description: How to create and delete an SMB Azure file share by using the Azure portal, Azure PowerShell, or Azure CLI.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 05/28/2025
ms.author: kendownie
ms.custom: devx-track-azurecli, references_regions, devx-track-azurepowershell
---

# Create an SMB Azure file share

Before you create an Azure file share, you need to answer two questions about how you want to use it:

- **What are the performance requirements for your Azure file share?**  
    Azure Files offers two different media tiers of storage, SSD (premium) and HDD (standard), which enable you to tailor your file shares to the performance and price requirements of your scenario. SSD file shares provide consistent high performance and low latency, within single-digit milliseconds for most IO operations. HDD file shares provide cost-effective storage for general purpose use.

- **What are the redundancy requirements for your Azure file share?**  
    Azure Files offers Local (LRS), Zone (ZRS), Geo (GRS), and GeoZone (GZRS) redundancy options for standard SMB file shares. SSD file shares are only available for the Local and Zone redundancy types. See [Azure Files redundancy](./files-redundancy.md) for more information.

For more information on these choices, see [Planning for an Azure Files deployment](storage-files-planning.md).

## Applies to

| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)|
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Prerequisites

- This article assumes that you have an Azure subscription. If you don't have an Azure subscription, then create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- If you intend to use Azure PowerShell, [install the latest version](/powershell/azure/install-azure-powershell).
- If you intend to use Azure CLI, [install the latest version](/cli/azure/install-azure-cli).

## Create a storage account

Azure file shares are deployed into *storage accounts*, which are top-level objects that represent a shared pool of storage. This pool of storage can be used to deploy multiple file shares.

Storage accounts have two properties, kind and SKU, which dictate the billing model, media tier, and redundancy of the file shares deployed in the storage account. For Azure Files, there are three main combinations of kind and SKU to consider:

| Media tier | Billing model | Storage account kind | Storage account SKUs |
|-|-|-|-|
| HDD | [Provisioned v2](./understanding-billing.md#provisioned-v2-model) | FileStorage | <ul><li>StandardV2_LRS</li><li>StandardV2_ZRS</li><li>StandardV2_GRS</li><li>StandardV2_GZRS</li></ul> |
| HDD | [Pay-as-you-go](./understanding-billing.md#pay-as-you-go-model) | StorageV2 | <ul><li>Standard_LRS</li><li>Standard_ZRS</li><li>Standard_GRS</li><li>Standard_GZRS</li></ul> |
| SSD | [Provisioned v1](./understanding-billing.md#provisioned-v1-model) | FileStorage | <ul><li>Premium_LRS</li><li>Premium_ZRS</li></ul> |

If you're creating an HDD file share, you can choose between the provisioned v2 and pay-as-you-go billing models. Both models are fully supported, however, we recommend provisioned v2 for new file share deployments. Provisioned v2 file shares are currently available in a limited subset of regions; see [provisioned v2 availability](./understanding-billing.md#provisioned-v2-availability) for more information.

# [Portal](#tab/azure-portal)
To create a storage account via the Azure portal, use the search box at the top of the Azure portal to search for **storage accounts** and select the matching result.

![A screenshot of the Azure portal search box with results for "storage accounts".](./media/storage-how-to-create-file-share/create-storage-account-0.png)

This shows a list of all existing storage accounts available in your visible subscriptions. Click **+ Create** to create a new storage account.

### Basics

The first tab to complete to create a storage account is labeled **Basics**, which contains the required fields to create a storage account.

![A screenshot of the instance details section of the basics tab.](./media/storage-how-to-create-file-share/create-storage-account-1.png)

| Field name | Input type | Values | Applicable to Azure Files | Meaning |
|-|-|-|-|-|
| Subscription | Drop-down list | *Available Azure subscriptions* | Yes | The selected subscription in which to deploy the storage account. The number of storage accounts per subscription is limited, so to deploy a new storage account into a selected subscription, if it has fewer storage accounts deployed than the subscription limit. See [storage account scale targets](./storage-files-scale-targets.md#storage-account-scale-targets) for more information. |
| Resource group | Drop-down list | *Available resource groups in selected subscription* | Yes | The resource group in which to deploy the storage account. A resource group is a logical container for organizing for Azure resources, including storage accounts. |
| Storage account name | Text box | -- | Yes | The name of the storage account resource to be created. This name must be globally unique. The storage account name is used as the server name when you mount an Azure file share via SMB. Storage account names must be between 3 and 24 characters in length. They may contain numbers and lowercase letters only. |
| Region | Drop-down list | *Available Azure regions* | Yes | The region for the storage account to be deployed into. This can be the region associated with the resource group, or any other available region. Note: HDD provisioned v2 file shares are only available in a subset of regions. See [provisioned v2 availability](./understanding-billing.md#provisioned-v2-availability) for more information. |
| Primary service | Drop-down list | <ul><li>Azure Blob Storage or Azure Data Lake Storage Gen 2</li><li>**Azure Files**</li><li>Other (tables and queues)</li></ul> | Only unpopulated and **Azure Files** | The service for which you're creating the storage account, in this case **Azure Files**. This field is optional, however, you can't select the provisioned v2 billing model unless you select **Azure Files** from the list. |
| Performance | Radio button group | <ul><li>Standard</li><li>Premium</li></ul> | Yes | The media tier of the storage account. Select **Standard** for an HDD storage account and **Premium** for an SSD storage account. |
| File share billing | Radio button group | <ul><li>Standard<ul><li>Pay-as-you-go</li><li>Provisioned v2</li></ul></li><li>Premium<ul><li>Provisioned v1</li></ul></li></ul> | Yes | The billing model desired for your scenario. For HDD file shares, we recommend provisioned v2 for new deployments, although the pay-as-you-go billing model is still supported. For SSD file shares, the provisioned v1 is the only available billing option. Note: HDD provisioned v2 file shares are only available in a subset of regions. See [provisioned v2 availability](./understanding-billing.md#provisioned-v2-availability) for more information. |
| Redundancy | Drop-down list | <ul><li>Locally-redundant storage (LRS)</li><li>Geo-redundant storage (GRS)</li><li>Zone-redundant storage (ZRS)</li><li>Geo-zone-redundant storage (GZRS)</li></ul> | Yes | The redundancy choice for the storage account. See [Azure Files redundancy](./files-redundancy.md) for more information. |
| Make read access to data available in the event of region unavailability | Checkbox | Checked/unchecked | No | This setting only appears if you select the pay-as-you-go billing model with the Geo or GeoZone redundancy types. Azure Files doesn't support read access to data in the secondary region without a failover regardless of the status of this setting. |

### Advanced

The **Advanced** tab is optional, but provides more granular settings for the storage account. The first section relates to **Security** settings.

![A screenshot of the security section of the advanced tab.](./media/storage-how-to-create-file-share/create-storage-account-2.png)

| Field name | Input type | Values | Applicable to Azure Files | Meaning |
|-|-|-|-|-|
| Require secure transfer for REST API operations | Checkbox | Checked/unchecked | Yes | This setting indicates that this applies to REST API operations, but it applies to SMB and NFS for Azure Files as well. If you plan to deploy NFS file shares in your storage account, or you have clients that need access to unencrypted SMB (such as SMB 2.1), uncheck this checkbox. |
| Allow enabling anonymous access on individual containers | Checkbox | Checked/unchecked | No | This setting controls whether Azure Blob storage containers are allowed to be accessed with anonymous access. This setting doesn't apply to Azure Files. This setting is available for FileStorage storage accounts containing provisioned v1 or provisioned v2 file shares even though it isn't possible to create Azure Blob storage containers in FileStorage storage accounts. |
| Enable storage account key access | Checkbox | Checked/unchecked | Yes | This setting controls whether the storage account keys (also referred to as shared keys) are enabled. When enabled, storage account keys can be used to mount the file share using SMB or to access the share using the FileREST API. |
| Default to Microsoft Entra authorization in the Azure portal | Checkbox | Checked/unchecked | Yes | This setting controls whether the user's Microsoft Entra (formerly Azure AD) identity is used when browsing the file share in the Azure portal. |
| Minimum TLS version | Drop-down list | *Supported TLS versions* | Yes | This setting controls the minimum allowed TLS version that's used for protocols which use TLS. For Azure Files, only the FileREST protocol uses TLS (as part of HTTPS). |
| Permitted scope for copy operations | Drop-down list | *Scopes for copy operations* | Yes | This setting controls the scope of storage account to storage account copy operations using the FileREST API, usually facilitated through tools like AzCopy. |

The **Hierarchical Namespace** section applies only to Azure Blob storage use, even in FileStorage storage accounts using the provisioned v1 or provisioned v2 billing models which can only contain Azure Files. Azure file shares support a hierarchical namespace regardless of the value of these settings.

| Field name | Input type | Values | Applicable to Azure Files | Meaning |
|-|-|-|-|-|
| Enable hierarchical namespace | Checkbox | Checked/unchecked | No | This is an Azure Blob storage only setting. This setting is disabled for FileStorage storage accounts, but is active for storage accounts using the pay-as-you-go model, even if Azure Files is selected as the primary service. |

The **Access protocols** section applies only to Azure Blob storage use, even in FileStorage storage accounts using the provisioned v1 or provisioned v2 billing models which can only contain Azure Files.

| Field name | Input type | Values | Applicable to Azure Files | Meaning |
|-|-|-|-|-|
| Enable SFTP | Checkbox | Checked/unchecked | No | This is an Azure Blob storage only setting. This setting is disabled for FileStorage storage accounts, but is active for storage accounts using the pay-as-you-go model, even if Azure Files is selected as the primary service. |
| Enable network file system v3 | Checkbox | Checked/unchecked | No | This is an Azure Blob storage only setting. This setting is disabled for FileStorage storage accounts, but is active for storage accounts using the pay-as-you-go model. SSD storage accounts can create NFS v4.1 file shares even though this setting is unchecked; in Azure Files, the file share's protocol is selected on the file share, not the storage account. |

The **Blob storage** section applies only to Azure Blob storage use, even in FileStorage storage accounts using the provisioned v1 or provisioned v2 models which can only contain Azure Files.

| Field name | Input type | Values | Applicable to Azure Files | Meaning |
|-|-|-|-|-|
| Allow cross-tenant replication | Checkbox | Checked/unchecked | No | This is an Azure Blob storage only setting. This setting is always available, even for FileStorage storage accounts which can't contain Azure Blob storage. Checking this checkbox has no impact on Azure Files. |
| Access tier | Radio button group | *Blob storage access tiers* | No | This is an Azure Blob storage only setting. This setting is always available, even for FileStorage storage accounts which can't contain Azure Blob storage. Selecting an option has no impact on Azure Files. |

> [!NOTE]
> Since all standard SMB file shares now support up to 100 TiB capacity when using the pay-as-you-go billing model and 256 TiB capacity when using the provisioned v2 billing model, the **large file shares** (LargeFileSharesState) property on storage accounts is no longer used and will be removed in the future.

### Networking

The networking section allows you to configure networking options. These settings are optional for the creation of the storage account and can be configured later if desired. For more information on these options, see [Azure Files networking considerations](storage-files-networking-overview.md).

### Data protection

The **Data protection** tab contains ability to enable or disable soft-delete. The soft-delete option for Azure Files is under the **Recovery** section.

![A screenshot of the recovery section in the data protection tab.](./media/storage-how-to-create-file-share/create-storage-account-3.png)

| Field name | Input type | Values | Applicable to Azure Files | Meaning |
|-|-|-|-|-|
| Enable point-in-time restore for containers | Checkbox | Checked/unchecked | No | This is an Azure Blob storage only setting. This setting is always available, even for FileStorage storage accounts which can't contain Azure Blob storage, although checking this box for FileStorage storage accounts does result in a validation error message. For pay-as-you-go storage accounts, the selection for this setting doesn't apply to Azure Files. |
| Maximum restore point (days ago) | Textbox | *Days (number)* | No | When *Enable point-in-time restore for containers* is selected, this textbox is available. The value chosen doesn't apply to Azure Files. |
| Enable soft delete for blobs | Checkbox | Checked/unchecked | No | This is an Azure Blob storage only setting. This setting is always available, even for FileStorage storage accounts which can't contain Azure Blob storage, although checking this box for FileStorage storage accounts does result in a validation error message. For pay-as-you-go storage accounts, the selection for this setting doesn't apply to Azure Files. |
| Days to retain deleted blobs | Textbox | *Days (number)* | No | When *Enable soft delete for blobs* is selected, this textbox is available. The value chosen doesn't apply to Azure Files. |
| Enable soft delete for containers | Checkbox | Checked/unchecked | No | This is an Azure Blob storage only setting. This setting is always available, even for FileStorage storage accounts which can't contain Azure Blob storage, although checking this box for FileStorage storage account does result in a validation error message. For pay-as-you-go storage accounts, the selection for this setting doesn't apply to Azure Files. |
| Days to retain deleted containers | Textbox | *Days (number)* | No | When *Enable soft delete for containers* is selected, this textbox is available. The value chose doesn't apply to Azure Files. |
| Enable soft delete for file shares | Checkbox | Checked/unchecked | Yes | Enable the [soft delete](./storage-files-enable-soft-delete.md) feature to protect against the accidental deletion of file shares. Soft delete is enabled by default, but you may choose to disable this setting if shares are frequently created and deleted as part of a business workflow. Soft deleted file shares are billed for their used capacity, even in provisioned models. |
| Days to retain deleted file shares | Textbox | *Days (number)* | Yes | When *Enable soft delete for file shares* is selected, this textbox is available. By default, file shares are retained for 7 days before being purged, however you may choose to increase or decrease this number depending on your requirements. Soft deleted file shares are billed for their used capacity, even in provisioned file shares, so retaining for a longer period of time can result in greater expenses due to soft-delete. |

The **Tracking** section applies only to Azure Blob storage use, even in FileStorage storage accounts using the provisioned v1 or provisioned v2 billing models which can only contain Azure Files.

| Field name | Input type | Values | Applicable to Azure Files | Meaning |
|-|-|-|-|-|
| Enable versioning for blobs | Checkbox | Checked/unchecked | No | This is an Azure Blob storage only setting. This setting is always available, even for FileStorage storage accounts which can't contain Azure Blob storage, although checking this box for FileStorage storage accounts does result in a validation error message. For pay-as-you-go storage accounts, the selection for this setting doesn't apply to Azure Files. |
| Enable blob change feed | Checkbox | Checked/unchecked | No | This is an Azure Blob storage only setting. This setting is always available, even for FileStorage storage accounts which can't contain Azure Blob storage, although checking this box for FileStorage storage accounts does result in a validation error message. For pay-as-you-go storage accounts, the selection for this setting doesn't apply to Azure Files. |

The **Access control** section applies only to Azure Blob storage use, even in FileStorage storage accounts using the provisioned v1 or provisioned v2 billing models which can only contain Azure Files.

| Field name | Input type | Values | Applicable to Azure Files | Meaning |
|-|-|-|-|-|
| Enable version-level immutability support | Checkbox | Checked/unchecked | No | This is an Azure Blob storage only setting. This setting is always available, even for FileStorage storage accounts which can't contain Azure Blob storage, although checking this box for FileStorage storage accounts does result in a validation error message. For pay-as-you-go storage accounts, the selection for this setting doesn't apply to Azure Files. |

### Encryption

The **Encryption** tab controls settings related to encryption at rest.

![A screenshot of the encryption tab.](./media/storage-how-to-create-file-share/create-storage-account-4.png)

| Field name | Input type | Values | Applicable to Azure Files | Meaning |
|-|-|-|-|-|
| Encryption type | Radio button group | <ul><li>Microsoft-managed keys</li><li>Customer-managed keys</li></ul> | Yes | This setting controls who holds the encryption key for the data placed in this storage account. See [Encryption for data at rest](../common/storage-service-encryption.md?toc=%2Fazure%2Fstorage%2Ffiles%2Ftoc.json) for more information. |
| Enable support for customer-managed keys | Radio button group | <ul><li>Blobs and files only</li><li>All service types (blobs, files, tables, and queues)</li></ul> | No | All kind/SKU combinations Azure file shares can exist in can support customer-managed keys regardless of this setting. |
| Enable infrastructure encryption | Checkbox | Checked/unchecked | Yes | Storage accounts can optionally use a secondary layer of encryption for data stored in the system to guard against one of the keys being compromised. See [Enable infrastructure encryption](../common/infrastructure-encryption-enable.md?toc=%2Fazure%2Fstorage%2Ffiles%2Ftoc.json) for more information. |

### Tags

Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups. These are optional and can be applied after storage account creation.

### Review + create

The final step to create the storage account is to select the **Create** button on the **Review + create** tab. This button isn't available until all the required fields for a storage account are completed.

# [PowerShell](#tab/azure-powershell)
### Create a provisioned v2 storage account (PowerShell)

To create a provisioned v2 storage account using PowerShell, use the `New-AzStorageAccount` cmdlet in the Az.Storage PowerShell module. This cmdlet has many options; only the required options are shown. To learn more about advanced options, see the [`New-AzStorageAccount` cmdlet documentation](/powershell/module/az.storage/new-azstorageaccount).

To create a storage account for provisioned v2 file shares, use the following command. Remember to replace the values for the variables `$resourceGroupName`, `$storageAccountName`, `$region`, and `$storageAccountSku` with the desired values for your storage account deployment.

```PowerShell
$resourceGroupName = "<my-resource-group>"
$storageAccountName = "<my-storage-account-name>"
$region = "<my-region>"
$storageAccountKind = "FileStorage"
# Valid SKUs for provisioned v2 HDD file share are 'StandardV2_LRS' (HDD Local Pv2), 'StandardV2_GRS' (HDD Geo Pv2), 'StandardV2_ZRS' (HDD Zone Pv2), 'StandardV2_GZRS' (HDD GeoZone Pv2).
$storageAccountSku = "StandardV2_LRS"

New-AzStorageAccount -ResourceGroupName $resourceGroupName -AccountName $storageAccountName -SkuName $storageAccountSku -Kind $storageAccountKind -Location $region
```

To view the settings and service usage for the Provisioned V2 storage account, use the following command. 

```powershell
Get-AzStorageFileServiceUsage -ResourceGroupName $resourceGroupName -StorageAccountName $storageAccountName
```

### Create a provisioned v1 or pay-as-you-go storage account (PowerShell)

To create a provisioned v1 or pay-as-you-go storage account using PowerShell, use the `New-AzStorageAccount` cmdlet in the Az.Storage PowerShell module. This cmdlet has many options; only the required options are shown. To learn more about advanced options, see the [`New-AzStorageAccount` cmdlet documentation](/powershell/module/az.storage/new-azstorageaccount).

To create a storage account for provisioned v1 or pay-as-you-go file shares, use the following command. Remember to replace the values for the variables `$resourceGroupName`, `$storageAccountName`, `$region`, `$storageAccountKind`, and `$storageAccountSku` with the desired values for your storage account deployment.

```powershell
$resourceGroupName = "<my-resource-group>"
$storageAccountName = "<my-storage-account-name>"
$region = "<my-region>"

# Valid storage account kinds are FileStorage (SSD provisioned v1) and StorageV2 
# (HDD pay-as-you-go). Create HDD provisioned v2 storage accounts with 
# New-AzResource.
$storageAccountKind = "FileStorage"

# Valid SKUs for FileStorage are Premium_LRS (SSD Local provisioned v1) and 
# Premium_ZRS (SSD Zone provisioned v1).
# 
# Valid SKUs for StorageV2 are Standard_LRS (HDD Local pay-as-you-go), 
# Standard_ZRS (HDD Zone pay-as-you-go), Standard_GRS (HDD Geo pay-as-you-go),
# and Standard_GZRS (HDD GeoZone pay-as-you-go).
$storageAccountSku = "Premium_LRS"

$storageAccount = New-AzStorageAccount `
        -ResourceGroupName $resourceGroupName `
        -Name $storageAccountName `
        -Location $region `
        -Kind $storageAccountKind `
        -SkuName $storageAccountSku
```

# [Azure CLI](#tab/azure-cli)
### Create a provisioned v2 storage account (Azure CLI)
To create a provisioned v2 storage account using Azure CLI, use the `az storage account create` command. This command has many options; only the required options are shown. To learn more about the advanced options, see the [`az storage account create` command documentation](/cli/azure/storage/account).

To create a storage account for provisioned v2 file shares, use the following command. Remember to replace the values for the variables `resourceGroupName`, `storageAccountName`, `region`, `storageAccountKind`, and `storageAccountSku` with the desired values for your storage account deployment.

```bash
resourceGroupName="<my-resource-group>"
storageAccountName="<my-storage-account-name>"
region="<my-region>"
storageAccountKind="FileStorage"

# Valid SKUs for provisioned v2 HDD file share are 'StandardV2_LRS' (HDD Local Pv2), 'StandardV2_GRS' (HDD Geo Pv2), 'StandardV2_ZRS' (HDD Zone Pv2), 'StandardV2_GZRS' (HDD GeoZone Pv2).
storageAccountSku="StandardV2_LRS"

az storage account create --resource-group $resourceGroupName --name $storageAccountName --location $region --kind $storageAccountKind --sku $storageAccountSku --output none
```

To view the settings and service usage for the Provisioned V2 storage account, use the following command.

```bash
az storage account file-service-usage --account-name $storageAccountName -g $resourceGroupName
```

### Create a provisioned v1 or pay-as-you-go storage account (Azure CLI)

To create a provisioned v1 or pay-as-you-go storage account using Azure CLI, use the `az storage account create` command. This command has many options; only the required options are shown. To learn more about the advanced options, see the [`az storage account create` command documentation](/cli/azure/storage/account).

To create a storage account for provisioned v1 or pay-as-you-go file shares, use the following command. Remember to replace the values for the variables `resourceGroupName`, `storageAccountName`, `region`, `storageAccountKind`, and `storageAccountSku` with the desired values for your storage account deployment.

```bash
resourceGroupName="<my-resource-group>"
storageAccountName="<my-storage-account-name>"
region="<my-region>"

# Valid storage account kinds are FileStorage (SSD provisioned v1) and StorageV2 
# (HDD pay-as-you-go). Create HDD provisioned v2 storage accounts with 
# az resource create.
storageAccountKind="FileStorage"

# Valid SKUs for FileStorage are Premium_LRS (SSD Local provisioned v1) and 
# Premium_ZRS (SSD Zone provisioned v1).
# 
# Valid SKUs for StorageV2 are Standard_LRS (HDD Local pay-as-you-go), 
# Standard_ZRS (HDD Zone pay-as-you-go), Standard_GRS (HDD Geo pay-as-you-go),
# and Standard_GZRS (HDD GeoZone pay-as-you-go).
storageAccountSku="Premium_LRS"

az storage account create \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --location $region \
    --kind $storageAccountKind \
    --sku $storageAccountSku \
    --output none
```

---

## Create a file share

After you create a storage account, you can create a file share. This process is different depending on whether you created a provisioned v2, provisioned v1, or pay-as-you-go storage account. 

> [!NOTE]
> The name of your file share must be all lower-case letters, numbers, and single hyphens, and must begin and end with a lower-case letter or number. The name can't contain two consecutive hyphens. For details about naming file shares and files, see [Naming and referencing shares, directories, files, and metadata](/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

### Create a provisioned v2 file share

When you create a file share using the provisioned v2 billing model, you specify how much storage, IOPS, and throughput your file share needs. The amount of each quantity that you provision determines your total bill. By default, when you create a new file share using the provisioned v2 model, we provide a recommendation for how many IOPS and how much throughput you need based on the amount of provisioned storage you specify. Depending on your individual file share requirements, you may find that you require more or less IOPS or throughput than our recommendations, and can optionally override these recommendations with your own values as desired. To learn more about the provisioned v2 model, see [Understanding the provisioned v2 billing model](./understanding-billing.md#provisioned-v2-model).

# [Portal](#tab/azure-portal)
Follow these instructions to create a new Azure file share using the Azure portal.

1. Go to your newly created storage account. From the service menu, under **Data storage**, select **File shares**.

    ![A screenshot of the file shares item underneath the data storage node in the table of contents for the storage account.](./media/storage-how-to-create-file-share/create-file-share-provisioned-v2-0.png)

2. In the file share listing, you should see any previously created file shares in this storage account or an empty table if no file shares exist. Select **+ File share** to create a new file share.

3. Complete the field in the **Basics** tab of the new file share blade:

    ![A screenshot of the basics tab in the new file share blade (provisioned v2).](./media/storage-how-to-create-file-share/create-file-share-provisioned-v2-1.png)

    - **Name**: The name of the file share to be created.

    - **Provisioned storage (GiB)**: The amount of storage to provision on the share. The actual provisioned storage capacity is the amount that you're billed for regardless of actual usage.

    - **Provisioned IOPS and throughput**: A radio button group that lets you select between *Recommended provisioning* and *Manually specify IOPS and throughput*. The IOPS and throughput recommendations are based on typical customer usage for that amount of provisioned storage for that media tier, so if you don't know specifically what your IOPS and throughput requirements are, we recommend you stick with the recommendations and adjust later as needed.

        - **IOPS**: If you select *Manually specify IOPS and throughput*, this textbox enables you to enter the amount of IOPS you want to provision on this file share.

        - **Throughput (MiB/sec)**: If you select *Manually specify IOPS and throughput*, this textbox enables you to enter the amount of throughput you want to provision on this file share.

4. Select the **Backup** tab. By default, [backup is enabled](../../backup/backup-azure-files.md) when you create an Azure file share using the Azure portal. If you want to disable backup for the file share, uncheck the **Enable backup** checkbox. If you want backup enabled, you can either leave the defaults or create a new Recovery Services Vault in the same region and subscription as the storage account. To create a new backup policy, select **Create a new policy**.

5. Select **Review + create** and then **Create** to create the Azure file share.

# [PowerShell](#tab/azure-powershell)
You can create a provisioned v2 Azure file share with the `New-AzRmStorageShare` cmdlet. The following PowerShell commands assume you set the variables `$resourceGroupName` and `$storageAccountName` as defined in the "Create Storage Account" section.

To create a provisioned v2 file share, use the following command. Remember to replace the values for the variables `$shareName` and `$provisionedStorageGib` with the desired selections for your file share deployment.

```powershell
$shareName = "<name-of-the-file-share>"

# The provisioned storage size of the share in GiB. Valid range is 32 to 262,144.
$provisionedStorageGib = 1024

# If you do not specify on the ProvisionedBandwidthMibps and ProvisionedIops, the deployment will use the recommended provisioning.
$provisionedIops = 3000
$provisionedThroughputMibPerSec = 130

New-AzRmStorageShare -ResourceGroupName $resourceGroupName -AccountName $storageAccountName -ShareName $shareName -QuotaGiB $provisionedStorageGib;
# -ProvisionedBandwidthMibps $provisionedThroughputMibPerSec -ProvisionedIops $provisionedIops
$f = Get-AzRmStorageShare -ResourceGroupName $resourceGroupName -AccountName $storageAccountName -ShareName $shareName;
$f | fl
```

# [Azure CLI](#tab/azure-cli)
You can create a Provisioned v2 Azure file share with [`az storage share-rm create`](/cli/azure/storage/share-rm#az-storage-share-rm-create) command. The following PowerShell commands assume you set the variables `resourceGroupName` and `storageAccountName` as defined in the creating a storage account with Azure CLI section.

To create a provisioned v2 file share, use the following command. Remember to replace the values for the variables `shareName`, `provisionedStorageGib` with the desired selections for your file share deployment.

```bash
shareName="<file-share>"

# The provisioned storage size of the share in GiB. Valid range is 32 to
# 262,144.
provisionedStorageGib=1024

# If you do not specify on the ProvisionedBandwidthMibps and ProvisionedIops, the deployment will use the recommended provisioning.
provisionedIops=3000
provisionedThroughputMibPerSec=130

az storage share-rm create --resource-group $resourceGroupName --name $shareName --storage-account $storageAccountName --quota $provisionedStorageGib
# --provisioned-iops $provisionedIops --provisioned-bandwidth-mibps $provisionedThroughputMibPerSec
```

---

### Create an SSD provisioned v1 file share

When you create a file share using the provisioned v1 billing model, you specify how much storage your share needs, and IOPS and throughput capacity are computed for you based on how much storage provisioned. Depending on your individual file share requirements, you may find that you require more IOPS or throughput than our recommendations. In this case, you need to provision more storage to get the required IOPS or throughput. To learn more about the provisioned v1 model, see [Understanding the provisioned v1 billing model](./understanding-billing.md#provisioned-v1-model).

# [Portal](#tab/azure-portal)
Follow these instructions to create a new Azure file share using the Azure portal.

1. Go to your newly created storage account. From the service menu, under **Data storage**, select **File shares**.

    ![A screenshot of the file shares item underneath the data storage node in the table of contents for the storage account.](./media/storage-how-to-create-file-share/create-file-share-provisioned-v2-0.png)

2. In the file share listing, you should see any previously created file shares in this storage account or an empty table if no file shares exist. Select **+ File share** to create a new file share.

3. Complete the fields in the **Basics** tab of new file share blade:

    ![A screenshot of the basics tab in the new file share blade (provisioned v1).](./media/storage-how-to-create-file-share/create-file-share-provisioned-v1-0.png)

    - **Name**: The name of the file share to be created.

    - **Provisioned storage (GiB)**: The amount of storage to provision on the share. The provisioned storage capacity is the amount that you're billed for regardless of actual usage. 

    - **Protocol**: The file sharing protocol to use on the share. By default, new shares use the SMB protocol. Select the NFS protocol for NFS v4.1 shares.

    - **Root Squash**: When NFS is selected as the chosen protocol, toggling the root squash behavior reduces the rights of the root user for NFS file shares.

4. Select the **Backup** tab. By default, [backup is enabled](../../backup/backup-azure-files.md) when you create an Azure file share using the Azure portal. If you want to disable backup for the file share, uncheck the **Enable backup** checkbox. If you want backup enabled, you can either leave the defaults or create a new Recovery Services Vault in the same region and subscription as the storage account. To create a new backup policy, select **Create a new policy**. NFS shares don't support Azure Backup.

5. Select **Review + create** and then **Create** to create the Azure file share.

# [PowerShell](#tab/azure-powershell)
You can create an Azure file share with the [`New-AzRmStorageShare`](/powershell/module/az.storage/New-AzRmStorageShare) cmdlet. The following PowerShell commands assume you set the variables `$resourceGroupName` and `$storageAccountName` as defined in the creating a storage account in the Azure PowerShell section. 

To create a provisioned v1 file share, use the following command. Remember to replace the values for the variables `$shareName`, `$provisionedStorageGib`, and `$protocol` with the desired selections for your file share deployment.

```powershell
$shareName = "<file-share>"

# The provisioned storage size of the share in GiB. Valid range is 100 to 
# 102,400.
$provisionedStorageGib = 1024

# The protocol chosen for the file share. Valid set contains "SMB" and "NFS".
$protocol = "SMB"

New-AzRmStorageShare `
        -ResourceGroupName $resourceGroupName `
        -StorageAccountName $storageAccountName `
        -Name $shareName `
        -QuotaGiB $provisionedStorageGib `
        -EnabledProtocol $protocol | `
    Out-Null
```

# [Azure CLI](#tab/azure-cli)
You can create an Azure file share with [`az storage share-rm create`](/cli/azure/storage/share-rm#az-storage-share-rm-create) command. The following PowerShell commands assume you set the variables `resourceGroupName` and `storageAccountName` as defined in the creating a storage account with Azure CLI section.

To create a provisioned v1 file share, use the following command. Remember to replace the values for the variables `shareName`, `provisionedStorageGib`, and `protocol` with the desired selections for your file share deployment.

```bash
shareName="<file-share>"

# The provisioned storage size of the share in GiB. Valid range is 100 to 
# 102,400.
provisionedStorageGib=1024

# The protocol chosen for the file share. Valid set contains "SMB" and "NFS".
protocol="SMB"

az storage share-rm create \
    --resource-group $resourceGroupName \
    --storage-account $storageAccountName \
    --name $shareName \
    --quota $provisionedStorageGib \
    --enabled-protocols $protocol \
    --output none
```

---

### Create an HDD pay-as-you-go file share

HDD pay-as-you-go file shares have a property called access tier. All three access tiers are stored on the exact same storage hardware. The main difference for these three access tiers is their data at-rest storage prices, which are lower in cooler tiers, and the transaction prices, which are higher in the cooler tiers. To learn more about the differences between tiers, see [differences in access tiers](./understanding-billing.md#differences-in-access-tiers). 

# [Portal](#tab/azure-portal)
Follow these instructions to create a new Azure file share using the Azure portal.

1. Go to your newly created storage account. From the service menu, under **Data storage**, select **File shares**.

    ![A screenshot of the file shares item under the data storage group in a pay-as-you-go storage account.](./media/storage-how-to-create-file-share/create-file-share-paygo-0.png)

1. In the file share listing, you should see any previously created file shares in this storage account or an empty table if no file shares exist. Select **+ File share** to create a new file share.

1. Complete the fields in the **Basics** tab of new file share blade:

    ![A screenshot of the basics tab of the new file share blade for a pay-as-you-go storage account.](./media/storage-how-to-create-file-share/create-file-share-paygo-1.png)
   
   - **Name**: The name of the file share to be created.

   - **Access tier**: The selected access tier for a pay-as-you-go file share. We recommend picking the *transaction optimized* access tier during a migration to minimize transaction expenses, and then switching to a lower tier if desired after the migration is complete.
   
1. Select the **Backup** tab. By default, [backup is enabled](../../backup/backup-azure-files.md) when you create an Azure file share using the Azure portal. If you want to disable backup for the file share, uncheck the **Enable backup** checkbox. If you want backup enabled, you can either leave the defaults or create a new Recovery Services Vault in the same region and subscription as the storage account. To create a new backup policy, select **Create a new policy**.

1. Select **Review + create** and then **Create** to create the Azure file share.

# [PowerShell](#tab/azure-powershell)
You can create an Azure file share with the [`New-AzRmStorageShare`](/powershell/module/az.storage/New-AzRmStorageShare) cmdlet. The following PowerShell commands assume you set the variables `$resourceGroupName` and `$storageAccountName` as defined in the creating a storage account with Azure PowerShell section. 

To create a pay-as-you-go file share, use the following command. Remember to replace the values for the variables `$shareName` and `$accessTier` with the desired selections for your file share deployment.

```powershell
$shareName = "<file-share>"

# The access tier of the file share. Valid set contains "TransactionOptimized",
# "Hot", "Cool"
$accessTier = "Hot"

New-AzRmStorageShare `
        -ResourceGroupName $resourceGroupName `
        -StorageAccountName $storageAccountName `
        -Name $shareName `
        -AccessTier $accessTier | `
    Out-Null
```

# [Azure CLI](#tab/azure-cli)
You can create an Azure file share with the [`az storage share-rm create`](/cli/azure/storage/share-rm#az-storage-share-rm-create) command. The following Azure CLI commands assume you set the variables `$resourceGroupName` and `$storageAccountName` as defined in the creating a storage account with Azure CLI section.

To create a pay-as-you-go file share, use the following command. Remember to replace the values for the variables `shareName` and `accessTier` with the desired selections for your file share deployment.

```bash
shareName="<file-share>"

# The access tier of the file share. Valid set contains "TransactionOptimized",
# "Hot", and "Cool".
accessTier="Hot"

az storage share-rm create \
    --resource-group $resourceGroupName \
    --storage-account $storageAccountName \
    --name $shareName \
    --access-tier $accessTier \
    --output none
```

---

## Change the cost and performance characteristics of a file share

After creating your file share, you may need to adjust the provisioning (provisioned models) or access tier (pay-as-you-go model) of the share. The following sections show you how to adjust the relevant properties for your share.

### Change the cost and performance characteristics of a provisioned v2 file share

After creating your provisioned v2 file share, you can change one or all three of the provisioned quantities of your file share.

# [Portal](#tab/azure-portal)
Follow these instructions to update the provisioning for your file share.

1. Go to your storage account. From the service menu, under **Data storage**, select **File shares**.

2. In the file share listing, select the file share for which you desire to change the provisioning.

3. In the file share overview, select **Change size and performance**.

    ![A screenshot of the "Change size and performance" button in the file share overview.](./media/storage-how-to-create-file-share/change-provisioned-v2-0.png)

4. The **Size and performance** pop out dialog has the following options:

    ![A screenshot of the "Size and performance" pop out dialog.](./media/storage-how-to-create-file-share/change-provisioned-v2-1.png)

    - **Provisioned storage (GiB)**: The amount of storage provisioned on the share.

    - **Provisioned IOPS and throughput**: A radio button group that lets you select between *Recommended provisioning* and *Manually specify IOPS and throughput*. If your share is at the recommended IOPS and throughput level for the amount of storage provisioned, *Recommended provisioning* will be selected; otherwise, *Manually specify IOPS and throughput* will be selected. You can toggle between these two options depending on your desire to change share provisioning.

        - **IOPS**: If you select *Manually specify IOPS and throughput*, this textbox enables you to change the amount of IOPS provisioned on this file share.

        - **Throughput (MiB/sec)**: If you select *Manually specify IOPS and throughput*, this textbox enables you to change the amount of throughput provisioned on this file share.

5. Select **Save** to save provisioning changes. Storage, IOPS, and throughput changes are effective within a few minutes after a provisioning change.

# [PowerShell](#tab/azure-powershell)
You can modify a provisioned v2 file share with the `Update-AzRmStorageShare` cmdlet. Remember to replace the values for the variables `$resourceGroupName`, `$storageAccountName`, `$shareName`, `$provisionedMibps`, `$provisionedIops`, and `$provisionedStorageGib` with the desired values for your file share.

```powershell
# The path to the file share resource to be modified.
$resourceGroupName = "<my-resource-group>"
$storageAccountName = "<my-storage-account-name>"
$shareName = "<name-of-the-file-share>"

# The provisioning desired on the file share. Delete the parameters if no
# change is desired.
$provisionedStorageGib = 10240
$provisionedIops = 10000
$provisionedThroughputMibPerSec = 2048

# Update the file share provisioning.
Update-AzRmStorageShare `
        -ResourceGroupName $resourceGroupName `
        -AccountName $storageAccountName `
        -ShareName $shareName `
        -QuotaGiB $provisionedStorageGib `
        -ProvisionedIops $provisionedIops `
        -ProvisionedBandwidthMibps $provisionedThroughputMibPerSec

$f = Get-AzRmStorageShare -ResourceGroupName $resourceGroupName -AccountName $storageAccountName -ShareName $shareName
$f | fl
```

# [Azure CLI](#tab/azure-cli)
You can modify a provisioned v2 file share with the `az storage share-rm update` command. Remember to replace the values for the variables `resourceGroupName`, `storageAccountName`, `fileShareName`, `provisionedStorageGib`, `provisionedIops`, and `provisionedThroughputMibPerSec` with the desired values for your file share.

```bash
# The path to the file share resource to be modified.
resourceGroupName="<resource-group>"
storageAccountName="<storage-account>"
fileShareName="<file-share>"

# The provisioning desired on the file share. Delete the parameters if no
# change is desired.
provisionedStorageGib=10240
provisionedIops=10000
provisionedThroughputMibPerSec=2048

# Update the file share provisioning.
az storage share-rm update \
        --resource-group $resourceGroupName \
        --name $shareName \
        --storage-account $storageAccountName \
        --quota $provisionedStorageGib \
        --provisioned-iops $provisionedIops \
        --provisioned-bandwidth-mibps $provisionedThroughputMibPerSec
```

---

### Change the cost and performance characteristics of a provisioned v1 file share

After creating your provisioned v1 file share, you can change the provisioned storage size of the file share. Changing the provisioned storage of the share will also change the amount of provisioned IOPS and provisioned throughput. For more information, see [provisioned v1 provisioning detail](./understanding-billing.md#provisioned-v1-provisioning-detail).

# [Portal](#tab/azure-portal)
Follow these instructions to update the provisioning for your file share.

1. Go to your storage account. From the service menu, under **Data storage**, select **File shares**.

2. In the file share listing, select the file share for which you desire to change the provisioning.

3. In the file share overview select **Change size and performance**.

    ![A screenshot of the "Change size and performance" button in the file share overview.](./media/storage-how-to-create-file-share/change-provisioned-v2-0.png)

4. The **Size and performance** pop out dialog has a single option, **Provisioned storage (GiB)**. If you require more IOPS or throughput than the given amount of provisioned storage provides, you can increase your provisioned storage capacity to get additional IOPS and throughput.

    ![A screenshot of the "Size and performance" dialog for provisioned v1 file shares.](./media/storage-how-to-create-file-share/change-provisioned-v1-0.png)

5. Select **Save** to save provisioning changes. Storage, IOPS, and throughput changes are effective within a few minutes after a provisioning change.

> [!NOTE]
> You can use PowerShell and CLI to enable/disable paid bursting if desired. Paid bursting is an advanced feature of the provisioned v1 billing model. Consult [provisioned v1 paid bursting](./understanding-billing.md#provisioned-v1-paid-bursting) before enabling paid bursting.

# [PowerShell](#tab/azure-powershell)
You can modify a provisioned v1 file share with the `Update-AzRmStorageShare` cmdlet. Remember to replace the values for the variables `$resourceGroupName`, `$storageAccountName`, and `$fileShareName` with the desired values for your file share. Set `$provisionedStorageGib`, `$paidBurstingEnabled`, `$paidBurstingMaxIops`, and `$paidBurstingMaxThroughputMibPerSec` to non-null (`$null`) values to set on the file share. Paid bursting is an advanced feature of the provisioned v1 model. Consult [provisioned v1 paid bursting](./understanding-billing.md#provisioned-v1-paid-bursting) before enabling.

```PowerShell
# The path to the file share resource to be modified.
$resourceGroupName = "<resource-group>"
$storageAccountName = "<storage-account>"
$fileShareName = "<file-share>"

# The provisioning desired on the file share. Set to $null to keep at the 
# current level of provisioning.
$provisionedStorageGib = 10240 

# Paid bursting settings.
$paidBurstingEnabled = $null # Set to $true or $false.
$paidBurstingMaxIops = $null # Set to an integer value.
$paidBurstingMaxThroughputMibPerSec = $null # Set to an integer value.

# Configure parameter object for splatting.
$params = @{
    ResourceGroupName = $resourceGroupName;
    StorageAccountName = $storageAccountName;
    Name = $fileShareName;
}

if ($null -ne $provisionedStorageGib) { 
    $params += @{ QuotaGiB = $provisionedStorageGib }
}

if ($null -ne $paidBurstingEnabled) {
    $params += @{ PaidBurstingEnabled = $paidBurstingEnabled }
}

if ($null -ne $paidBurstingMaxIops) {
    $params += @{ PaidBurstingMaxIops = $paidBurstingMaxIops }
}

if ($null -ne $paidBurstingMaxThroughputMibPerSec) {
    $params += @{ 
        PaidBurstingMaxBandwidthMibps = $paidBurstingMaxThroughputMibPerSec 
    }
}

# Update the file share provisioning.
Update-AzRmStorageShare @params
```

# [Azure CLI](#tab/azure-cli)
You can modify a provisioned v1 file share with the `az storage share-rm update` command. Remember to replace the values for the variables `resourceGroupName`, `storageAccountName`, `fileShareName`, and `provisionedStorageGib` with the desired values for your file share.

```bash
# The path to the file share resource to be modified.
resourceGroupName="<resource-group>"
storageAccountName="<storage-account>"
fileShareName="<file-share>"

# The provisioning desired on the file share.
provisionedStorageGib=10240

# Update the file share provisioning.
az storage share-rm update \
        --resource-group $resourceGroupName \
        --storage-account $storageAccountName \
        --name $fileShareName \
        --quota $provisionedStorageGib
```

To toggle paid bursting, use the `--paid-bursting-enabled` parameter. Paid bursting is an advanced feature of the provisioned v1 model. Consult [provisioned v1 paid bursting](./understanding-billing.md#provisioned-v1-paid-bursting) before enabling. You can optionally use the `--paid-bursting-max-iops` and `--paid-bursting-max-bandwidth-mibps` flags to set a restriction on the upper amount of paid bursting allowed for cost control purposes. Remember to replace the values for the variables `resourceGroupName`, `storageAccountName`, and `fileShareName` with the desired values for your file share.

```bash
resourceGroupName="<resource-group>"
storageAccountName="<storage-account>"
fileShareName="<file-share>"

az storage share-rm update \
        --resource-group $resourceGroupName \
        --storage-account $storageAccountName \
        --name $fileShareName \
        --paid-bursting-enabled true
```

---

### Change the cost and performance characteristics of a pay-as-you-go file share

After you've created your pay-as-you-go file share, there are two properties you may want to change:

- **Access tier**: The access tier of the file share dictates to the ratio of storage to IOPS/throughput costs (in the form of transactions). There are three access tiers: *transaction optimized*, *hot*, and *cool*. Changing the tier of the Azure file share results in transaction costs for the movement to the new access tier. For more information, see [switching between access tiers](./understanding-billing.md#switching-between-access-tiers).

- **Quota**: Quota is a limit on the size of the file share. The quota property is used in the provisioned v2 and provisioned v1 models to mean "provisioned storage capacity", however, in the pay-as-you-go model, quota has no direct impact on bill. The two primary reasons you might want to modify this are if you use quota to limit the growth of your file share to keep control of the used storage/transaction costs in the pay-as-you-go model, or if you have a storage account predating the introduction of the large file share feature, which enabled file shares to grow beyond 5 TiB. The maximum file share size for a pay-as-you-go file share is 100 TiB.

# [Portal](#tab/azure-portal)
Follow these instructions to update the access tier of your file share.

1. Go to your storage account. From the service menu, under **Data storage**, select **File shares**.

2. In the file share listing, select the file share for which you desire to change the access tier.

3. In the file share overview, select **Change tier**.

4. Select the desired **Access tier** from the provided drop-down list.

5. Select **Apply** to save the access tier change.

For these instructions to update the quota of your file share.

1. Go to your storage account. From the service menu, under **Data storage**, select **File shares**.

2. In the file share listing, select the file share for which you desire to change the quota.

3. In the file share overview, select **Edit quota**.

4. In the edit quota pop-out, enter the desired maximum size of the share or select **Set to maximum**. There is no cost implication of setting the share to the maximum size.

5. Select **OK** to save quota changes. The new quota is effective within a few minutes.

# [PowerShell](#tab/azure-powershell)
You can modify the access tier and quota settings of a pay-as-you-go file share with the `Update-AzRmStorageShare` cmdlet. Remember to replace the values for the variables `$resourceGroupName`, `$storageAccountName`, `$fileShareName`, `$accessTier`, and `$quotaGib` with the desired values for your file share.

```PowerShell
# The path to the file share resource to be modified.
$resourceGroupName = "<resource-group>"
$storageAccountName = "<storage-account>"
$fileShareName = "<file-share>"

# The settings to be changed on the file share. Set to $null to skip setting.
$accessTier = "Cool"
$quotaGib = $null

# Construct a parameters hash table for cmdlet splatting.
$updateParams = @{
    ResourceGroupName = $resourceGroupName
    StorageAccountName = $storageAccountName
    Name = $fileShareName
}

if ($null -ne $accessTier) { $updateParams += @{ AccessTier = $accessTier } }
if ($null -ne $quotaGib) { $updateParams += @{ QuotaGiB = $quotaGib } }

# Update the file share
Update-AzRmStorageShare @updateParams
```

# [Azure CLI](#tab/azure-cli)
You can modify the access tier and quota settings of a pay-as-you-go file share with the `az storage share-rm update` command. Remember to replace the values for the variables `resourceGroupName`, `storageAccountName`, `fileShareName`, `accessTier`, and `quotaGib` with the desired values for your file share.

```bash
# The path to the file share resource to be modified.
resourceGroupName="<resource-group>"
storageAccountName="<storage-account>"
fileShareName="<file-share>"

# The settings to be changed on the file share. Set to the empty string to skip 
# setting.
accessTier="Cool"
quotaGib=""

command="az storage share-rm update --resource-group $resourceGroupName"
command="$command --storage-account $storageAccountName --name $fileShareName"

if [ ! -z "${accessTier}" ]; then
    command="$command --access-tier $accessTier"
fi

if [ ! -z "${quotaGib}" ]; then
    command="$command --quota $quotaGib"
fi

# Update file share (command is in variable)
$command
```

---

## Use a file share

After you create a file share, you can create directories on the share and use it to store files.

### Create a directory

# [Portal](#tab/azure-portal)

To create a new directory named *myDirectory* at the root of your Azure file share:

1. On the **File share settings** page, select the **myshare** file share. The page for your file share opens, indicating *no files found*.
1. On the menu at the top of the page, select **+ Add directory**. The **New directory** page drops down.
1. Type *myDirectory* and then select **OK**.

# [PowerShell](#tab/azure-powershell)

To create a new directory named **myDirectory** at the root of your Azure file share, use the [New-AzStorageDirectory](/powershell/module/az.storage/New-AzStorageDirectory) cmdlet.

```azurepowershell-interactive
New-AzStorageDirectory `
   -Context $storageAcct.Context `
   -ShareName $shareName `
   -Path "myDirectory"
```

# [Azure CLI](#tab/azure-cli)

To create a new directory named **myDirectory** at the root of your Azure file share, use the [`az storage directory create`](/cli/azure/storage/directory) command:

> [!NOTE]
> If you don't provide credentials with your commands, Azure CLI will query for your storage account key. You can also provide your storage account key with the command by using a variable such as `--account-key $storageAccountKey` or in plain text such as `--account-key "your-storage-account-key-here"`.

```azurecli-interactive
az storage directory create \
   --account-name $storageAccountName \
   --share-name $shareName \
   --name "myDirectory" \
   --output none
```

---


### Upload a file

# [Portal](#tab/azure-portal)

First, you need to create or select a file to upload. Do this by whatever means you see fit. When you've decided on the file you'd like to upload, follow these steps:

1. Select the **myDirectory** directory. The **myDirectory** panel opens.
1. In the menu at the top, select **Upload**. The **Upload files** panel opens.  
    
    :::image type="content" source="media/storage-how-to-create-file-share/upload-file.png" alt-text="Screenshot showing the upload files panel in the Azure portal." border="true":::

1. Select the folder icon to open a window to browse your local files.
1. Select a file and then select **Open**.
1. In the **Upload files** page, verify the file name, and then select **Upload**.
1. When finished, the file should appear in the list on the **myDirectory** page.

# [PowerShell](#tab/azure-powershell)

To demonstrate how to upload a file using the [Set-AzStorageFileContent](/powershell/module/az.storage/Set-AzStorageFileContent) cmdlet, we first need to create a file inside your PowerShell Cloud Shell's scratch drive to upload.

This example puts the current date and time into a new file on your scratch drive, then uploads the file to the file share.

```azurepowershell-interactive
# this expression will put the current date and time into a new file on your scratch drive
cd "~/CloudDrive/"
Get-Date | Out-File -FilePath "SampleUpload.txt" -Force

# this expression will upload that newly created file to your Azure file share
Set-AzStorageFileContent `
   -Context $storageAcct.Context `
   -ShareName $shareName `
   -Source "SampleUpload.txt" `
   -Path "myDirectory\SampleUpload.txt"
```   

If you're running PowerShell locally, substitute `~/CloudDrive/` with a path that exists on your machine.

After uploading the file, you can use the [Get-AzStorageFile](/powershell/module/Az.Storage/Get-AzStorageFile) cmdlet to check to make sure that the file was uploaded to your Azure file share. 

```azurepowershell-interactive
Get-AzStorageFile `
    -Context $storageAcct.Context `
    -ShareName $shareName `
    -Path "myDirectory\" | Get-AzStorageFile
```


# [Azure CLI](#tab/azure-cli)

To demonstrate how to upload a file by using the [`az storage file upload`](/cli/azure/storage/file) command, first create a file to upload on the Cloud Shell scratch drive. In the following example, you create and then upload the file:

```azurecli-interactive
cd ~/clouddrive/
date > SampleUpload.txt

az storage file upload \
    --account-name $storageAccountName \
    --share-name $shareName \
    --source "SampleUpload.txt" \
    --path "myDirectory/SampleUpload.txt"
```

If you're running Azure CLI locally, substitute `~/clouddrive` with a path that exists on your machine.

After you upload the file, you can use the [`az storage file list`](/cli/azure/storage/file) command to make sure that the file was uploaded to your Azure file share:

```azurecli-interactive
az storage file list \
    --account-name $storageAccountName \
    --share-name $shareName \
    --path "myDirectory" \
    --output table
```


---

### Download a file

# [Portal](#tab/azure-portal)

You can download a copy of the file you uploaded by right-clicking on the file and selecting **Download**. The exact experience will depend on the operating system and browser you're using.

# [PowerShell](#tab/azure-powershell)

You can use the [Get-AzStorageFileContent](/powershell/module/az.storage/Get-AzStorageFilecontent) cmdlet to download a copy of the file you uploaded to the scratch drive of your Cloud Shell.

```azurepowershell-interactive
# Delete an existing file by the same name as SampleDownload.txt, if it exists because you've run this example before.
Remove-Item `
    -Path "SampleDownload.txt" `
    -Force `
    -ErrorAction SilentlyContinue

Get-AzStorageFileContent `
    -Context $storageAcct.Context `
    -ShareName $shareName `
    -Path "myDirectory\SampleUpload.txt" `
    -Destination "SampleDownload.txt"
```

After downloading the file, you can use the `Get-ChildItem` cmdlet to see that the file has been downloaded to your PowerShell Cloud Shell's scratch drive.

```azurepowershell-interactive
Get-ChildItem | Where-Object { $_.Name -eq "SampleDownload.txt" }
``` 

# [Azure CLI](#tab/azure-cli)

You can use the [`az storage file download`](/cli/azure/storage/file) command to download a copy of the file that you uploaded to the Cloud Shell scratch drive:

```azurecli-interactive
# Delete an existing file by the same name as SampleDownload.txt, if it exists, because you've run this example before
rm -f SampleDownload.txt

az storage file download \
    --account-name $storageAccountName \
    --share-name $shareName \
    --path "myDirectory/SampleUpload.txt" \
    --dest "./SampleDownload.txt" \
    --output none
```

---

## Delete a file share

Depending on your workflow, you might wish to delete unused or outdated file shares. You can use the following instructions to delete file shares. File shares in storage accounts with [soft delete enabled](storage-files-prevent-file-share-deletion.md) can be recovered within the retention period.

# [Portal](#tab/azure-portal)
Follow these instructions to delete a file share.

1. Go to your storage account. From the service menu, under **Data storage**, select **File shares**.

2. In the file share list, select the **...** for the file share you desire to delete.

3. Select **Delete share** from the context menu.

4. The **Delete** pop-out contains a survey about why you're deleting the file share. You can skip this, but we appreciate any feedback you have on Azure Files, particularly if something isn't working properly for you.

5. Enter the file share name to confirm deletion and select **Delete**.

# [PowerShell](#tab/azure-powershell)
You can delete a file share using the `Remove-AzRmStorageShare` cmdlet. Remember to replace the values for the variables `$resourceGroupName`, `$storageAccountName`, and `$fileShareName` with the desired values for your file share.

```PowerShell
# The path to the file share resource to be deleted.
$resourceGroupName = "<resource-group>"
$storageAccountName = "<storage-account>"
$fileShareName = "<file-share>"

# Remove the file share
Remove-AzRmStorageShare `
        -ResourceGroupName $resourceGroupName `
        -StorageAccountName $storageAccountName `
        -Name $fileShareName
```

# [Azure CLI](#tab/azure-cli)
You can delete a file share using the `az storage share-rm delete` command. Remember to replace the values for the variables `resourceGroupName`, `storageAccountName`, and `fileShareName` with the desired values for your file share.

```bash
resourceGroupName="<resource-group>"
storageAccountName="<storage-account>"
fileShareName="<file-share>"

az storage share-rm delete \
    --resource-group $resourceGroupName \
    --storage-account $storageAccountName \
    --name $fileShareName
```

---

## Next step

- Mount an SMB file share on [Windows](storage-how-to-use-files-windows.md), [macOS](storage-how-to-use-files-mac.md), or [Linux](storage-how-to-use-files-linux.md).
