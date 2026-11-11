---
title: Create a classic file share
titleSuffix: Azure Files
description: Learn how to create a storage account and an Azure classic file share by using the Azure portal, Azure PowerShell, or Azure CLI.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 10/26/2026
ms.author: kendownie
ms.custom: devx-track-azurecli, references_regions, devx-track-azurepowershell
---

# Create an Azure classic file share
:heavy_check_mark: **Applies to:** Classic SMB and NFS file shares created with the Microsoft.Storage resource provider

:heavy_multiplication_x: **Doesn't apply to:** File shares created with the Microsoft.FileShares resource provider

> [!TIP]
> **Creating an NFS file share? Use Microsoft.FileShares.** Classic file shares support NFS, but use the Microsoft.FileShares resource provider for new NFS deployments. To create an NFS file share with Microsoft.FileShares, see [Create an Azure file share with Microsoft.FileShares](create-file-share.md). For the differences between the resource providers, see [Azure Files management concepts](files-management-concepts.md).

This article describes how to create a storage account and a classic file share in it. Before you create a classic file share, decide on these properties:

- **Media tier**: SSD file shares provide consistent high performance and low latency. HDD file shares provide cost-effective storage for general-purpose use.
- **Protocol**: SMB file shares are available on both media tiers. NFS file shares require the SSD media tier.
- **Redundancy**: HDD file shares support locally redundant storage (LRS), zone-redundant storage (ZRS), geo-redundant storage (GRS), and geo-zone-redundant storage (GZRS). SSD file shares support LRS and ZRS. For more information, see [Azure Files data redundancy](files-redundancy.md).

For more information, see [Plan an Azure Files deployment](storage-files-planning.md).

## Prerequisites
- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- To use Azure PowerShell, [install the latest version](/powershell/azure/install-azure-powershell).
- To use Azure CLI, [install the latest version](/cli/azure/install-azure-cli).

## Create a storage account for classic file shares
You deploy classic file shares into a *storage account*. A storage account is a top-level resource that represents a shared pool of storage, IOPS, and throughput. You can deploy multiple file shares in one storage account. If you already have a storage account that you want to use, go to [Create a classic file share](#create-a-classic-file-share).

Two storage account properties, *kind* and *SKU*, determine the billing model, media tier, and redundancy of the file shares in the storage account. Azure Files supports these combinations:

| Media tier | Billing model | Storage account kind | Storage account SKUs |
|-|-|-|-|
| SSD and HDD | [Provisioned v2](./understanding-billing.md#provisioned-v2-model) | FileStorage | <ul><li>PremiumV2_LRS</li><li>PremiumV2_ZRS</li><li>StandardV2_LRS</li><li>StandardV2_ZRS</li><li>StandardV2_GRS</li><li>StandardV2_GZRS</li></ul> |
| SSD | [Provisioned v1](./understanding-billing.md#provisioned-v1-model) | FileStorage | <ul><li>Premium_LRS</li><li>Premium_ZRS</li></ul> |
| HDD | [Pay-as-you-go](./understanding-billing.md#pay-as-you-go-model) | StorageV2 | <ul><li>Standard_LRS</li><li>Standard_ZRS</li><li>Standard_GRS</li><li>Standard_GZRS</li></ul> |

Use the provisioned v2 billing model for all new file share deployments. The provisioned v1 and pay-as-you-go billing models remain fully supported for new and existing deployments. Provisioned v2 file shares are available in most regions. For more information, see [Provisioned v2 availability](./understanding-billing.md#provisioned-v2-availability).

# [Portal](#tab/azure-portal)
To create a storage account in the Azure portal, search for **storage accounts** in the search box at the top of the portal. Under **Services**, select **Storage accounts**.

:::image type="content" source="media/storage-how-to-create-file-share/search-storage-accounts.png" alt-text="Screenshot of the Azure portal search results for storage accounts, with Storage accounts under Services highlighted.":::

Select **+ Create** to open the **Create a storage account** page.

:::image type="content" source="media/storage-how-to-create-file-share/storage-accounts-create.png" alt-text="Screenshot of the storage accounts list toolbar, with the Create button highlighted.":::

The **Create a storage account** page has a tab for each group of settings. The following sections describe the settings that apply to Azure Files.

### Basics
The **Basics** tab contains the required settings for the storage account.

:::image type="content" source="media/storage-how-to-create-file-share/basics-instance-details.png" alt-text="Screenshot of the instance details section of the Basics tab, with Azure Files, SSD, and provisioned v2 selected.":::

| Field | Values | Description |
|-|-|-|
| Subscription | *Available Azure subscriptions* | The subscription for the storage account. |
| Resource group | *Resource groups in the subscription* | The resource group for the storage account. |
| Storage account name | Text | A globally unique name for the storage account. The name must be 3 to 24 characters long and contain only numbers and lowercase letters. |
| Region | *Available Azure regions* | The region for the storage account. |
| Primary service | <ul><li>Azure Blob Storage or Azure Data Lake Storage</li><li>Azure Files</li><li>Other (tables and queues)</li></ul> | Select **Azure Files**. The provisioned v2 billing model is available only when you select Azure Files. |
| Media tier | <ul><li>HDD (standard)</li><li>SSD (premium)</li></ul> | The media tier for the file shares in the storage account. |
| File share billing | <ul><li>HDD: **Pay-as-you-go file shares** or **Provisioned v2**</li><li>SSD: **Provisioned v1** or **Provisioned v2**</li></ul> | We recommend **Provisioned v2** for all new deployments. |
| Redundancy | <ul><li>HDD: LRS, GRS, ZRS, or GZRS</li><li>SSD: LRS or ZRS</li></ul> | For more information, see [Azure Files data redundancy](files-redundancy.md). |
| Make read access to data available in the event of regional unavailability | Checkbox | Appears only for HDD pay-as-you-go storage accounts with GRS or GZRS. This setting doesn't apply to Azure Files. Azure Files doesn't support read access to the secondary region without a failover. |
| Zone options | <ul><li>None</li><li>Self-selected zone</li><li>Azure-selected zone</li></ul> | Appears for SSD storage accounts with LRS. To place the storage account in a specific availability zone, see [Use zonal placement for Azure file shares](zonal-placement.md). |

### Advanced
The **Advanced** tab has a section for Azure Blob Storage and a section for Azure Files. Settings in the **Azure Blob Storage** section don't apply to Azure Files.

:::image type="content" source="media/storage-how-to-create-file-share/advanced-azure-files.png" alt-text="Screenshot of the Azure Files section of the Advanced tab.":::

For SSD storage accounts, the portal enables SMB Multichannel by default. You can disable it after you create the storage account. For more information, see [Improve performance for SMB Azure file shares](smb-performance.md).

| Field | Default | Description |
|-|-|-|
| Enable Managed Identity for SMB | Not selected | Lets applications and virtual machines access SMB file shares with a managed identity. For more information, see [Access SMB Azure file shares by using managed identities with Microsoft Entra ID](files-managed-identities.md). |
| Require Encryption in Transit for SMB | Selected | Requires encryption for SMB access to the file shares in the storage account. |
| Require Encryption in Transit for NFS | Selected | Requires encryption for NFS access to the file shares in the storage account. Appears only for SSD storage accounts. |

The portal saves each **Require Encryption in Transit** setting as enabled or disabled, so these settings control SMB and NFS encryption whether or not you select them. The **Require secure transfer for REST API operations** setting on the **Security** tab applies only to FileREST (HTTPS) traffic. For more information, see [Configure encryption in transit for Azure Files](files-encryption-in-transit.md).

### Networking
The networking settings are optional when you create the storage account. You can configure them later.

| Field | Default | Description |
|-|-|-|
| Public network access | Enable | **Enable**, **Disable**, or **Secure by perimeter**. Controls access to the storage account's public endpoint. |
| Public network access scope | Enable from all networks | To allow access only from specific networks, select **Enable from selected virtual networks and IP addresses**. |
| Virtual networks | None | Appears when you select **Enable from selected virtual networks and IP addresses**. Allows access from the selected subnets through the `Microsoft.Storage` service endpoint. |
| IPv4 Addresses | None | Appears when you select **Enable from selected virtual networks and IP addresses**. Allows access from public IPv4 addresses or ranges. IP address rules don't grant NFS access. |

For more information, see [Azure Files networking considerations](storage-files-networking-overview.md) and [Restrict access to the public endpoint to specific networks](storage-files-networking-endpoints.md#restrict-access-to-the-public-endpoint-to-specific-networks).

### Data protection
The **Data protection** tab has a section for Azure Blob Storage and a section for Azure Files. Settings in the **Azure Blob Storage** section don't apply to Azure Files.

:::image type="content" source="media/storage-how-to-create-file-share/data-protection-azure-files.png" alt-text="Screenshot of the Azure Files section of the Data protection tab, with soft delete enabled for 7 days.":::

| Field | Default | Description |
|-|-|-|
| Enable soft delete for classic file shares | Selected | Protects file shares against accidental deletion. For more information, see [Azure file share soft delete](storage-files-prevent-file-share-deletion.md). |
| Days to retain deleted classic file shares | 7 | The number of days that Azure Files keeps a deleted file share before it purges the file share. You're billed for the used capacity of soft-deleted file shares, including provisioned file shares. A longer retention period can increase your costs. |

### Security
The **Security** tab combines settings for all storage services. The following table shows which settings apply to Azure Files.

:::image type="content" source="media/storage-how-to-create-file-share/security-tab.png" alt-text="Screenshot of the settings on the Security tab.":::

| Field | Applies to Azure Files | Description |
|-|-|-|
| Require secure transfer for REST API operations | Yes | Requires HTTPS for FileREST requests. The **Require Encryption in Transit** settings on the **Advanced** tab control SMB and NFS encryption. |
| Allow enabling anonymous access on individual containers | No | Applies only to Blob Storage. |
| Enable storage account key access | Yes | Controls whether clients can use the storage account keys to mount SMB file shares or to authorize FileREST requests. |
| Default to Microsoft Entra authorization in the Azure portal | Yes | Controls whether the Azure portal uses your Microsoft Entra identity, instead of the storage account key, when you browse file shares. |
| Minimum TLS version | Yes | The minimum TLS version for FileREST requests. SMB doesn't use TLS. For NFS, the AzNFS mount helper uses TLS 1.2 or TLS 1.3. For more information, see [FileREST](files-encryption-in-transit.md#filerest). |
| Permitted scope for copy operations (Preview) | Yes | Limits which storage accounts can be the source of FileREST copy operations into this storage account. Tools such as AzCopy use these operations. |

### Encryption
The **Encryption** tab controls encryption at rest. For more information, see [Encryption at rest for Azure Files](files-encryption-at-rest.md).

:::image type="content" source="media/storage-how-to-create-file-share/encryption-tab.png" alt-text="Screenshot of the Encryption tab with Microsoft-managed keys selected.":::

| Field | Applies to Azure Files | Description |
|-|-|-|
| Encryption type | Yes | **Microsoft-managed keys (MMK)** or **Customer-managed keys (CMK)**. For the steps to use customer-managed keys, see [Configure encryption at rest with customer-managed keys for Azure Files](customer-managed-keys.md). |
| Enable support for customer-managed keys | No | All classic file shares support customer-managed keys, regardless of this setting. |
| Enable infrastructure encryption | Yes | Adds a second layer of encryption. You can enable infrastructure encryption only when you create the storage account. For more information, see [Infrastructure encryption](files-encryption-at-rest.md#infrastructure-encryption). |

### Tags
Tags are name/value pairs that you use to categorize resources and to view consolidated billing. Tags are optional, and you can add them after you create the storage account.

### Review + create
1. Select **Review and create**.
2. Check the settings on the **Review + create** tab, and then select **Create**.

# [PowerShell](#tab/azure-powershell)
### Create the storage account (PowerShell)
To create a storage account, use the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet. The following `New-AzStorageAccount` parameters set the storage account settings that apply to Azure Files. If you omit a parameter, the storage account uses the default.

| Portal setting | Parameter | Values |
|-|-|-|
| Resource group | `ResourceGroupName` | Required. The name of an existing resource group. |
| Storage account name | `Name` | Required. A globally unique name, 3 to 24 characters long, with only numbers and lowercase letters. |
| Region | `Location` | Required. For example, `westus2`. |
| Media tier, File share billing, Redundancy | `Kind`, `SkuName` | See the table at the start of this section. |
| Zone options | `Zone` or `ZonePlacementPolicy` | SSD storage accounts with LRS only. See [Use zonal placement for Azure file shares](zonal-placement.md). |
| Enable Managed Identity for SMB | `EnableSmbOAuth` | `$true` or `$false`. The default is `$false`. |
| Public network access | `PublicNetworkAccess` | `Enabled` (default), `Disabled`, or `SecuredByPerimeter`. |
| Public network access scope | `NetworkRuleSet`, `defaultAction` key | `Allow` (default) or `Deny`. To allow access only from the virtual networks and IP addresses in the network rules, use `Deny`. |
| Virtual networks | `NetworkRuleSet`, `virtualNetworkRules` key | Subnet resource IDs. Each subnet must have the `Microsoft.Storage` service endpoint. |
| IPv4 Addresses | `NetworkRuleSet`, `ipRules` key | Public IPv4 addresses or CIDR ranges. IP address rules don't grant NFS access. |
| Exceptions (not in the create wizard) | `NetworkRuleSet`, `bypass` key | `AzureServices` (default) or `None`. `AzureServices` allows trusted Azure services to access the storage account. The create wizard always uses `AzureServices`. |
| Require secure transfer for REST API operations | `EnableHttpsTrafficOnly` | `$true` (default) or `$false`. |
| Enable storage account key access | `AllowSharedKeyAccess` | `$true` (default) or `$false`. |
| Default to Microsoft Entra authorization in the Azure portal | None | Azure PowerShell doesn't have a parameter for this setting. Use the Azure portal or Azure CLI. |
| Minimum TLS version | `MinimumTlsVersion` | `TLS1_2`, which is the default and the lowest TLS version that Azure Files accepts. |
| Permitted scope for copy operations | `AllowedCopyScope` | `AAD` (same Microsoft Entra tenant) or `PrivateLink` (private endpoint to the same virtual network). If you omit it, copies from any storage account are allowed. |
| Encryption type | Several | See [Configure encryption at rest with customer-managed keys for Azure Files](customer-managed-keys.md). |
| Enable infrastructure encryption | `RequireInfrastructureEncryption` | Include the switch to enable it. You can enable infrastructure encryption only when you create the storage account. |
| Tags | `Tag` | A hashtable, for example `@{ environment = "test" }`. |

The following example creates an SSD provisioned v2 storage account. For a different media tier, billing model, or redundancy, change `Kind` and `SkuName` to a combination from the table at the start of this section. Replace `<resource-group>`, `<storage-account-name>`, and `<region>` with your own values.

```azurepowershell
$resourceGroupName = "<resource-group>"
$storageAccountName = "<storage-account-name>"

$params = @{
    ResourceGroupName = $resourceGroupName
    Name = $storageAccountName
    Location = "<region>"
    Kind = "FileStorage"
    SkuName = "PremiumV2_LRS"
    EnableHttpsTrafficOnly = $true
    MinimumTlsVersion = "TLS1_2"
    AllowSharedKeyAccess = $true
}
New-AzStorageAccount @params
```

To allow access only from specific networks, add a `NetworkRuleSet` entry to `$params` in the previous example. Replace `<subnet-resource-id>` and `<public-ip-address-or-range>` with your own values. For more information, see [Restrict access to the public endpoint to specific networks](storage-files-networking-endpoints.md#restrict-access-to-the-public-endpoint-to-specific-networks).

```azurepowershell
NetworkRuleSet = @{
    defaultAction = "Deny"
    bypass = "AzureServices"
    virtualNetworkRules = @(@{ VirtualNetworkResourceId = "<subnet-resource-id>" })
    ipRules = @(@{ IPAddressOrRange = "<public-ip-address-or-range>" })
}
```

### Configure file service settings (PowerShell)
The encryption in transit, SMB Multichannel, and soft delete settings belong to the storage account's file service. To configure them, use the [Update-AzStorageFileServiceProperty](/powershell/module/az.storage/update-azstoragefileserviceproperty) cmdlet after you create the storage account.

A storage account that you create with PowerShell starts with soft delete enabled for 7 days. On SSD storage accounts, SMB Multichannel is enabled. Both **Require Encryption in Transit** settings start as not configured, so **Require secure transfer for REST API operations** controls SMB and NFS encryption until you configure them. For more information, see [Encryption in transit settings](files-encryption-in-transit.md#encryption-in-transit-settings).

The following `Update-AzStorageFileServiceProperty` parameters set the file service settings:

| Portal setting | Parameter | Values |
|-|-|-|
| Require Encryption in Transit for SMB | `SmbEncryptionInTransitRequired` | `$true` or `$false`. |
| Require Encryption in Transit for NFS | `NfsEncryptionInTransitRequired` | `$true` or `$false`. Applies to NFS file shares, which require SSD. |
| SMB Multichannel | `EnableSmbMultichannel` | `$true` or `$false`. SSD storage accounts only. |
| Enable soft delete for classic file shares | `EnableShareDeleteRetentionPolicy` | `$true` (default) or `$false`. |
| Days to retain deleted classic file shares | `ShareRetentionDays` | 1 to 365. The default is 7. |

The following example configures the same settings that the Azure portal uses by default:

```azurepowershell
$params = @{
    ResourceGroupName = $resourceGroupName
    StorageAccountName = $storageAccountName
    SmbEncryptionInTransitRequired = $true
    NfsEncryptionInTransitRequired = $true
    EnableShareDeleteRetentionPolicy = $true
    ShareRetentionDays = 7
}
Update-AzStorageFileServiceProperty @params
```

The same cmdlet also configures the SMB protocol versions, authentication methods, and encryption algorithms. For more information, see [SMB security settings](files-smb-protocol.md#smb-security-settings).

For a provisioned v2 storage account, you can view the provisioning limits and usage with the [Get-AzStorageFileServiceUsage](/powershell/module/az.storage/get-azstoragefileserviceusage) cmdlet:

```azurepowershell
$params = @{
    ResourceGroupName = $resourceGroupName
    StorageAccountName = $storageAccountName
}
Get-AzStorageFileServiceUsage @params
```

# [Azure CLI](#tab/azure-cli)
### Create the storage account (Azure CLI)
To create a storage account, use the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command. The following `az storage account create` parameters set the storage account settings that apply to Azure Files. If you omit a parameter, the storage account uses the default.

| Portal setting | Parameter | Values |
|-|-|-|
| Resource group | `--resource-group` | Required. The name of an existing resource group. |
| Storage account name | `--name` | Required. A globally unique name, 3 to 24 characters long, with only numbers and lowercase letters. |
| Region | `--location` | For example, `westus2`. If you omit it, the storage account uses the region of the resource group. |
| Media tier, File share billing, Redundancy | `--kind`, `--sku` | See the table at the start of this section. |
| Zone options | `--zones` or `--zone-placement-policy` | SSD storage accounts with LRS only. See [Use zonal placement for Azure file shares](zonal-placement.md). |
| Enable Managed Identity for SMB | `--enable-smb-oauth` | `true` or `false`. The default is `false`. |
| Public network access | `--public-network-access` | `Enabled` (default), `Disabled`, or `SecuredByPerimeter`. |
| Public network access scope | `--default-action` | `Allow` (default) or `Deny`. To allow access only from the virtual networks and IP addresses in the network rules, use `Deny`. |
| Virtual networks | `--vnet-name` and `--subnet` | One subnet. The subnet must have the `Microsoft.Storage` service endpoint. To add more subnets after you create the storage account, use `az storage account network-rule add`. |
| IPv4 Addresses | None | `az storage account create` doesn't have a parameter for IP address rules. After you create the storage account, use `az storage account network-rule add` with `--ip-address`. IP address rules don't grant NFS access. |
| Exceptions (not in the create wizard) | `--bypass` | `AzureServices` (default) or `None`. `AzureServices` allows trusted Azure services to access the storage account. The create wizard always uses `AzureServices`. |
| Require secure transfer for REST API operations | `--https-only` | `true` (default) or `false`. |
| Enable storage account key access | `--allow-shared-key-access` | `true` (default) or `false`. |
| Default to Microsoft Entra authorization in the Azure portal | None | `az storage account create` doesn't have a parameter for this setting. After you create the storage account, run `az storage account update` with `--set defaultToOAuthAuthentication=true`. |
| Minimum TLS version | `--min-tls-version` | `TLS1_2`, which is the default and the lowest TLS version that Azure Files accepts. |
| Permitted scope for copy operations | `--allowed-copy-scope` | `AAD` (same Microsoft Entra tenant) or `PrivateLink` (private endpoint to the same virtual network). If you omit it, copies from any storage account are allowed. |
| Encryption type | Several | See [Configure encryption at rest with customer-managed keys for Azure Files](customer-managed-keys.md). |
| Enable infrastructure encryption | `--require-infrastructure-encryption` | Include the parameter to enable it. You can enable infrastructure encryption only when you create the storage account. |
| Tags | `--tags` | Space-separated `key=value` pairs, for example `environment=test`. |

The following example creates an SSD provisioned v2 storage account. For a different media tier, billing model, or redundancy, change `--kind` and `--sku` to a combination from the table at the start of this section. Replace `<resource-group>`, `<storage-account-name>`, and `<region>` with your own values.

```azurecli
resourceGroupName="<resource-group>"
storageAccountName="<storage-account-name>"

az storage account create \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --location "<region>" \
    --kind FileStorage \
    --sku PremiumV2_LRS \
    --https-only true \
    --min-tls-version TLS1_2 \
    --allow-shared-key-access true \
    --output none
```

To allow access only from specific networks, add `--default-action Deny`, `--bypass AzureServices`, `--vnet-name`, and `--subnet` to the previous command. To add an IP address rule, run [az storage account network-rule add](/cli/azure/storage/account/network-rule#az-storage-account-network-rule-add) after you create the storage account. Replace `<public-ip-address-or-range>` with your own value. For more information, see [Restrict access to the public endpoint to specific networks](storage-files-networking-endpoints.md#restrict-access-to-the-public-endpoint-to-specific-networks).

```azurecli
az storage account network-rule add \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --ip-address "<public-ip-address-or-range>" \
    --output none
```

### Configure file service settings (Azure CLI)
The encryption in transit, SMB Multichannel, and soft delete settings belong to the storage account's file service. To configure them, use the [az storage account file-service-properties update](/cli/azure/storage/account/file-service-properties#az-storage-account-file-service-properties-update) command after you create the storage account.

A storage account that you create with Azure CLI starts with soft delete enabled for 7 days. On SSD storage accounts, SMB Multichannel is enabled. Both **Require Encryption in Transit** settings start as not configured, so **Require secure transfer for REST API operations** controls SMB and NFS encryption until you configure them. For more information, see [Encryption in transit settings](files-encryption-in-transit.md#encryption-in-transit-settings).

The following `az storage account file-service-properties update` parameters set the file service settings:

| Portal setting | Parameter | Values |
|-|-|-|
| Require Encryption in Transit for SMB | `--require-smb-encryption-in-transit` | `true` or `false`. |
| Require Encryption in Transit for NFS | `--require-nfs-encryption-in-transit` | `true` or `false`. Applies to NFS file shares, which require SSD. |
| SMB Multichannel | `--enable-smb-multichannel` | `true` or `false`. SSD storage accounts only. |
| Enable soft delete for classic file shares | `--enable-delete-retention` | `true` (default) or `false`. |
| Days to retain deleted classic file shares | `--delete-retention-days` | 1 to 365. The default is 7. |

The following example configures the same settings that the Azure portal uses by default:

```azurecli
az storage account file-service-properties update \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --require-smb-encryption-in-transit true \
    --require-nfs-encryption-in-transit true \
    --enable-delete-retention true \
    --delete-retention-days 7 \
    --output none
```

The same command also configures the SMB protocol versions, authentication methods, and encryption algorithms. For more information, see [SMB security settings](files-smb-protocol.md#smb-security-settings).

For a provisioned v2 storage account, you can view the provisioning limits and usage with the [az storage account file-service-usage](/cli/azure/storage/account#az-storage-account-file-service-usage) command:

```azurecli
az storage account file-service-usage \
    --account-name $storageAccountName \
    --resource-group $resourceGroupName
```

---

## Create a classic file share
The steps to create a classic file share depend on the billing model of the storage account. Provisioned file shares require a `FileStorage` storage account. Pay-as-you-go file shares require a `StorageV2` storage account.

To check the billing model of a storage account, go to the storage account's **Overview** page. Under **Essentials**, check **Account kind** and **File share billing**.

A file share name can contain only lowercase letters, numbers, and single hyphens. It must start and end with a lowercase letter or number, and it can't contain two consecutive hyphens. For more information, see [Naming and referencing shares, directories, files, and metadata](/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

### Create a provisioned v2 classic file share
For a provisioned v2 file share, you provision storage, IOPS, and throughput. Your bill depends on the amount of each that you provision. Azure Files recommends IOPS and throughput based on the provisioned storage. You can use the recommendation, or specify your own values. For more information, see [Provisioned v2 model](./understanding-billing.md#provisioned-v2-model).

# [Portal](#tab/azure-portal)
1. Go to your storage account. From the service menu, under **Data storage**, select **Classic file shares**.
2. Select **+ Classic file share**.
3. On the **Basics** tab of the **New classic file share** page, complete these fields:

   - **Name**: The name of the file share.
   - **Provisioned storage (GiB)**: The amount of storage to provision. You're billed for the provisioned storage, regardless of how much you use.
   - **Provisioned IOPS and throughput**: Select **Recommended provisioning** to use the recommended IOPS and throughput, or select **Manually specify IOPS and throughput**. If you don't know your IOPS and throughput requirements, use the recommendation and adjust it later.
   - **IOPS** and **Throughput (MiB/sec)**: If you selected **Manually specify IOPS and throughput**, enter the values to provision. The range for each value appears under the field.
   - **Protocol**: Select **SMB** or **NFS**. **NFS** is available only in SSD storage accounts. For an NFS file share, you can also set **Root Squash**. For more information, see [Configure root squash for Azure Files](nfs-root-squash.md).

   :::image type="content" source="media/storage-how-to-create-file-share/new-share-provisioned-v2.png" alt-text="Screenshot of the Basics tab of the New classic file share page for a provisioned v2 storage account.":::

4. Select the **Backup** tab. For an SMB file share, [Azure Backup](../../backup/backup-azure-files.md) is enabled by default. To disable it, clear **Enable backup**. To keep it, use the default vault and policy, or create a new Recovery Services vault or backup policy. Azure Backup isn't available for NFS file shares.
5. Select **Review + create**, and then select **Create**.

# [PowerShell](#tab/azure-powershell)
To create a provisioned v2 classic file share, use the [New-AzRmStorageShare](/powershell/module/az.storage/new-azrmstorageshare) cmdlet. The commands use the `$resourceGroupName` and `$storageAccountName` variables from [Create the storage account](#create-the-storage-account-powershell). Replace `<file-share-name>` with your own value.

```azurepowershell
# QuotaGiB is the provisioned storage in GiB. The valid range is 32 to 262,144.
# EnabledProtocol is "SMB" or "NFS". NFS requires an SSD storage account.
$params = @{
    ResourceGroupName = $resourceGroupName
    StorageAccountName = $storageAccountName
    Name = "<file-share-name>"
    QuotaGiB = 1024
    EnabledProtocol = "SMB"
}
New-AzRmStorageShare @params
```

The command provisions the recommended IOPS and throughput. To provision your own values, add `ProvisionedIops` and `ProvisionedBandwidthMibps` to the parameters, for example `ProvisionedIops = 3000` and `ProvisionedBandwidthMibps = 130`.

# [Azure CLI](#tab/azure-cli)
To create a provisioned v2 classic file share, use the [az storage share-rm create](/cli/azure/storage/share-rm#az-storage-share-rm-create) command. The commands use the `resourceGroupName` and `storageAccountName` variables from [Create the storage account](#create-the-storage-account-azure-cli). Replace `<file-share-name>` with your own value.

```azurecli
# --quota is the provisioned storage in GiB. The valid range is 32 to 262,144.
# --enabled-protocols is SMB or NFS. NFS requires an SSD storage account.
az storage share-rm create \
    --resource-group $resourceGroupName \
    --storage-account $storageAccountName \
    --name "<file-share-name>" \
    --quota 1024 \
    --enabled-protocols SMB \
    --output none
```

The command provisions the recommended IOPS and throughput. To provision your own values, add the `--provisioned-iops` and `--provisioned-bandwidth-mibps` parameters, for example `--provisioned-iops 3000 --provisioned-bandwidth-mibps 130`.

---

### Create an SSD provisioned v1 classic file share
For a provisioned v1 file share, you provision storage. Azure Files sets the IOPS and throughput based on the provisioned storage. To get more IOPS or throughput, provision more storage. For more information, see [Provisioned v1 model](./understanding-billing.md#provisioned-v1-model).

# [Portal](#tab/azure-portal)
1. Go to your storage account. From the service menu, under **Data storage**, select **Classic file shares**.
2. Select **+ Classic file share**.
3. On the **Basics** tab of the **New classic file share** page, complete these fields:

   - **Name**: The name of the file share.
   - **Provisioned storage (GiB)**: The amount of storage to provision. The minimum is 100 GiB. You're billed for the provisioned storage, regardless of how much you use. Under **Performance**, the page shows the IOPS, burst IOPS, and throughput for the provisioned storage.
   - **Protocol**: Select **SMB** or **NFS**. For an NFS file share, you can also set **Root Squash**. For more information, see [Configure root squash for Azure Files](nfs-root-squash.md).

   :::image type="content" source="media/storage-how-to-create-file-share/new-share-provisioned-v1.png" alt-text="Screenshot of the Basics tab of the New classic file share page for a provisioned v1 storage account.":::

4. Select the **Backup** tab. For an SMB file share, [Azure Backup](../../backup/backup-azure-files.md) is enabled by default. To disable it, clear **Enable backup**. To keep it, use the default vault and policy, or create a new Recovery Services vault or backup policy. Azure Backup isn't available for NFS file shares.
5. Select **Review + create**, and then select **Create**.

# [PowerShell](#tab/azure-powershell)
To create a provisioned v1 classic file share, use the [New-AzRmStorageShare](/powershell/module/az.storage/new-azrmstorageshare) cmdlet. The commands use the `$resourceGroupName` and `$storageAccountName` variables from [Create the storage account](#create-the-storage-account-powershell). Replace `<file-share-name>` with your own value.

```azurepowershell
# QuotaGiB is the provisioned storage in GiB. The valid range is 100 to 102,400.
# EnabledProtocol is "SMB" or "NFS".
$params = @{
    ResourceGroupName = $resourceGroupName
    StorageAccountName = $storageAccountName
    Name = "<file-share-name>"
    QuotaGiB = 1024
    EnabledProtocol = "SMB"
}
New-AzRmStorageShare @params
```

# [Azure CLI](#tab/azure-cli)
To create a provisioned v1 classic file share, use the [az storage share-rm create](/cli/azure/storage/share-rm#az-storage-share-rm-create) command. The commands use the `resourceGroupName` and `storageAccountName` variables from [Create the storage account](#create-the-storage-account-azure-cli). Replace `<file-share-name>` with your own value.

```azurecli
# --quota is the provisioned storage in GiB. The valid range is 100 to 102,400.
# --enabled-protocols is SMB or NFS.
az storage share-rm create \
    --resource-group $resourceGroupName \
    --storage-account $storageAccountName \
    --name "<file-share-name>" \
    --quota 1024 \
    --enabled-protocols SMB \
    --output none
```

---

### Create an HDD pay-as-you-go classic file share
Pay-as-you-go file shares support only SMB. Each pay-as-you-go file share has an *access tier*: transaction optimized, hot, or cool. All three access tiers use the same HDD hardware. Cooler tiers have lower storage prices and higher transaction prices. For more information, see [Differences in access tiers](./understanding-billing.md#differences-in-access-tiers).

# [Portal](#tab/azure-portal)
1. Go to your storage account. From the service menu, under **Data storage**, select **Classic file shares**.
2. Select **+ Classic file share**.
3. On the **Basics** tab of the **New classic file share** page, complete these fields:

   - **Name**: The name of the file share.
   - **Access tier**: The access tier of the file share. The default is **Transaction optimized**. During a migration, use the transaction optimized tier to minimize transaction costs. After the migration, you can change to a cooler tier.

   :::image type="content" source="media/storage-how-to-create-file-share/new-share-pay-as-you-go.png" alt-text="Screenshot of the Basics tab of the New classic file share page for a pay-as-you-go storage account.":::

4. Select the **Backup** tab. [Azure Backup](../../backup/backup-azure-files.md) is enabled by default. To disable it, clear **Enable backup**. To keep it, use the default vault and policy, or create a new Recovery Services vault or backup policy.
5. Select **Review + create**, and then select **Create**.

# [PowerShell](#tab/azure-powershell)
To create a pay-as-you-go classic file share, use the [New-AzRmStorageShare](/powershell/module/az.storage/new-azrmstorageshare) cmdlet. The commands use the `$resourceGroupName` and `$storageAccountName` variables from [Create the storage account](#create-the-storage-account-powershell). Replace `<file-share-name>` with your own value.

```azurepowershell
# Valid values for AccessTier are "TransactionOptimized", "Hot", and "Cool".
$params = @{
    ResourceGroupName = $resourceGroupName
    StorageAccountName = $storageAccountName
    Name = "<file-share-name>"
    AccessTier = "TransactionOptimized"
}
New-AzRmStorageShare @params
```

# [Azure CLI](#tab/azure-cli)
To create a pay-as-you-go classic file share, use the [az storage share-rm create](/cli/azure/storage/share-rm#az-storage-share-rm-create) command. The commands use the `resourceGroupName` and `storageAccountName` variables from [Create the storage account](#create-the-storage-account-azure-cli). Replace `<file-share-name>` with your own value.

```azurecli
# Valid values for --access-tier are TransactionOptimized, Hot, and Cool.
az storage share-rm create \
    --resource-group $resourceGroupName \
    --storage-account $storageAccountName \
    --name "<file-share-name>" \
    --access-tier TransactionOptimized \
    --output none
```

---

## Set up networking for classic file shares
SMB file shares don't require network configuration. NFS file shares require it, because NFS uses network-based access control. Clients can access an NFS file share only from a virtual network, through a private endpoint or a service endpoint.

- A **private endpoint** gives the storage account a private IP address in your virtual network. Clients in peered virtual networks and on-premises networks can use it. [Data processing charges](https://azure.microsoft.com/pricing/details/private-link/) apply.
- A **service endpoint** lets clients in specific subnets use the public endpoint. The subnets can be in a different subscription or Microsoft Entra tenant. Service endpoints don't have extra charges.

For more information, see [Azure Files networking considerations](storage-files-networking-overview.md).

> [!IMPORTANT]
> NFS uses TCP port 2049. Ensure that your clients can send traffic on port 2049, and that the network security groups of the virtual network don't block inbound traffic on port 2049.

### Set up a private endpoint or service endpoint
The following steps create a private endpoint for an NFS file share in the Azure portal. To configure a service endpoint, or to use PowerShell or Azure CLI, see [Configure network endpoints for Azure file shares](storage-files-networking-endpoints.md).

1. Go to your storage account. From the service menu, under **Data storage**, select **Classic file shares**, and then select your NFS file share.
2. On the **Connect from Linux** tab, under **Network configuration**, select **Review options**. The **Configure network security** tab opens.

   :::image type="content" source="media/storage-how-to-create-file-share/network-security-options.png" alt-text="Screenshot of the network security options for an NFS classic file share, with the private endpoint and service endpoint options.":::

3. Select **Setup a private endpoint**. The **Private endpoint connections** tab of the storage account's networking page opens.
4. Select **+ Private endpoint**.
5. On the **Basics** tab, enter a **Name** for the private endpoint. The portal fills in **Network Interface Name**. Set **Region** to the region of your virtual network, and then select **Next : Resource**.
6. On the **Resource** tab, make sure that **Target sub-resource** is **file**, and then select **Next : Virtual Network**.
7. On the **Virtual Network** tab, select your **Virtual network** and **Subnet**. The portal might select a different virtual network by default. Leave **Dynamically allocate IP address** selected, and then select **Next : DNS**.

   :::image type="content" source="media/storage-how-to-create-file-share/private-endpoint-virtual-network.png" alt-text="Screenshot of the Virtual Network tab of the Create a private endpoint page.":::

8. On the **DNS** tab, leave **Integrate with private DNS zone** set to **Yes**. Make sure that the subscription and resource group are correct, and then select **Next : Tags**.
9. Optionally, add tags, and then select **Next : Review + create**.
10. After validation passes, select **Create**.

### Enable hybrid access through VPN or ExpressRoute (optional)
To access an NFS file share from an on-premises network, connect the network to your virtual network with a VPN or Azure ExpressRoute, and configure DNS for the private endpoint. For the steps, see [Connect from on-premises](storage-files-networking-overview.md#connect-from-on-premises).

## Related content
- [Mount SMB Azure file share on Windows](storage-how-to-use-files-windows.md)
- [Mount NFS Azure file shares on Linux](storage-files-how-to-mount-nfs-shares.md)
- [Modify an Azure file share](modify-file-share.md)
