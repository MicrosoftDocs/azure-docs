---
title: Create a storage account
titleSuffix: Azure Storage
description: Learn to create a storage account to store blobs, files, queues, and tables. An Azure storage account provides a unique namespace in Microsoft Azure for reading and writing your data.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.topic: how-to
ms.date: 09/12/2023
ms.author: akashdubey
ms.subservice: storage-common-concepts
ms.custom: devx-track-azurecli, devx-track-azurepowershell, engagement-fy23
---

# Create a storage account

An Azure storage account contains all of your Azure Storage data objects: blobs, files, queues, and tables. The storage account provides a unique namespace for your Azure Storage data that is accessible from anywhere in the world over HTTP or HTTPS. For more information about Azure storage accounts, see [Storage account overview](storage-account-overview.md).

In this how-to article, you learn to create a storage account using the [Azure portal](https://portal.azure.com/), [Azure PowerShell](/powershell/azure/), [Azure CLI](/cli/azure), or an [Azure Resource Manager template](../../azure-resource-manager/management/overview.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

# [Portal](#tab/azure-portal)

None.

# [PowerShell](#tab/azure-powershell)

To create an Azure storage account with PowerShell, make sure you have installed the latest [Azure Az PowerShell module](https://www.powershellgallery.com/packages/Az). See [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell).

# [Azure CLI](#tab/azure-cli)

You can sign in to Azure and run Azure CLI commands in one of two ways:

- You can run CLI commands from within the Azure portal, in Azure Cloud Shell.
- You can install the CLI and run CLI commands locally.

### Use Azure Cloud Shell

Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. The Azure CLI is pre-installed and configured to use with your account. Click the **Cloud Shell** button on the menu in the upper-right section of the Azure portal:

[![Cloud Shell](./media/storage-quickstart-create-account/cloud-shell-menu.png)](https://portal.azure.com)

The button launches an interactive shell that you can use to run the steps outlined in this how-to article:

[![Screenshot showing the Cloud Shell window in the portal](./media/storage-quickstart-create-account/cloud-shell.png)](https://portal.azure.com)

### Install the Azure CLI locally

You can also install and use the Azure CLI locally. If you plan to use Azure CLI locally, make sure you have installed the latest version of the Azure CLI. See [Install the Azure CLI](/cli/azure/install-azure-cli).

# [Bicep](#tab/bicep)

None.

# [Template](#tab/template)

None.

# [Azure Developer CLI](#tab/azure-developer-cli)

The Azure Developer CLI (`azd`) requires you to be signed-in to Azure to provision and deploy resources. You can sign-in to Azure using `azd` in one of two ways:

- Use Azure Cloud Shell from within the Azure portal.
- Install `azd` locally.

> [!NOTE]
> The `azd` template includes a `.devcontainer` that already has `azd` installed, therefore you can skip the installation step if you plan to use a `devcontainer` either locally or in an environment like Codespaces.

### Use Azure Cloud Shell

Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. `azd` is pre-installed and configured to use with your account. 

Click the **Cloud Shell** button on the menu in the upper-right section of the Azure portal:

:::image type="content" source="media/storage-account-create/azd-cloudshell.png" alt-text="A screenshot showing how to launch Azure CloudShell.":::

The button launches an interactive shell that you can use to run the steps outlined in this how-to article

### Install the CLI locally

You can also [install and use `azd`](/azure/developer/azure-developer-cli/overview) locally. If you plan to use `azd` locally, make sure you have installed or updated to the latest version of the Azure CLI.

---

Next, sign in to Azure.

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

```azurecli-interactive
az login
```

# [Bicep](#tab/bicep)

N/A

# [Template](#tab/template)

N/A


# [Azure Developer CLI](#tab/azure-developer-cli)

To launch Azure Cloud Shell, sign in to the [Azure portal](https://portal.azure.com).

To log into your local installation of `azd`, run the [azd auth login](/azure/developer/azure-developer-cli/reference#azd-auth-login) command:

```azurecli-interactive
azd auth login
```

---
## Create a storage account

A storage account is an Azure Resource Manager resource. Resource Manager is the deployment and management service for Azure. For more information, see [Azure Resource Manager overview](../../azure-resource-manager/management/overview.md).

Every Resource Manager resource, including an Azure storage account, must belong to an Azure resource group. A resource group is a logical container for grouping your Azure services. When you create a storage account, you have the option to either create a new resource group, or use an existing resource group. This how-to shows how to create a new resource group.

### Storage account type parameters

When you create a storage account using PowerShell, the Azure CLI, Bicep, Azure Templates, or the Azure Developer CLI, the storage account type is specified by the `kind` parameter (for example, `StorageV2`). The performance tier and redundancy configuration are specified together by the `sku` or `SkuName` parameter (for example, `Standard_GRS`). The following table shows which values to use for the `kind` parameter and the `sku` or `SkuName` parameter to create a particular type of storage account with the desired redundancy configuration.

| Type of storage account | Supported redundancy configurations | Supported values for the kind parameter | Supported values for the sku or SkuName parameter | Supports hierarchical namespace |
|--|--|--|--|--|
| Standard general-purpose v2 | LRS / GRS / RA-GRS / ZRS / GZRS / RA-GZRS | StorageV2 | Standard_LRS / Standard_GRS / Standard_RAGRS/ Standard_ZRS / Standard_GZRS / Standard_RAGZRS | Yes |
| Premium block blobs | LRS / ZRS | BlockBlobStorage | Premium_LRS / Premium_ZRS | Yes |
| Premium file shares | LRS / ZRS | FileStorage | Premium_LRS / Premium_ZRS | No |
| Premium page blobs | LRS | StorageV2 | Premium_LRS | No |
| Legacy standard general-purpose v1 | LRS / GRS / RA-GRS | Storage | Standard_LRS / Standard_GRS / Standard_RAGRS | No |
| Legacy blob storage | LRS / GRS / RA-GRS | BlobStorage | Standard_LRS / Standard_GRS / Standard_RAGRS | No |

# [Portal](#tab/azure-portal)

To create an Azure storage account with the Azure portal, follow these steps:

1. From the left portal menu, select **Storage accounts** to display a list of your storage accounts. If the portal menu isn't visible, select the menu button to toggle it on.

    :::image type="content" source="media/storage-account-create/menu-expand-sml.png" alt-text="Image of the Azure portal homepage showing the location of the Menu button near the top left corner of the browser." lightbox="media/storage-account-create/menu-expand-lrg.png":::

1. On the **Storage accounts** page, select **Create**.

    :::image type="content" source="media/storage-account-create/create-button-sml.png" alt-text="Image showing the location of the create button within the Azure portal Storage Accounts page." lightbox="media/storage-account-create/create-button-lrg.png":::

Options for your new storage account are organized into tabs in the **Create a storage account** page. The following sections describe each of the tabs and their options.

### Basics tab

On the **Basics** tab, provide the essential information for your storage account. After you complete the **Basics** tab, you can choose to further customize your new storage account by setting options on the other tabs, or you can select **Review + create** to accept the default options and proceed to validate and create the account.

The following table describes the fields on the **Basics** tab.

| Section | Field | Required or optional | Description |
|--|--|--|--|
| Project details | Subscription | Required | Select the subscription for the new storage account. |
| Project details | Resource group | Required | Create a new resource group for this storage account, or select an existing one. For more information, see [Resource groups](../../azure-resource-manager/management/overview.md#resource-groups). |
| Instance details | Storage account name | Required | Choose a unique name for your storage account. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. |
| Instance details | Region | Required | Select the appropriate region for your storage account. For more information, see [Regions and Availability Zones in Azure](../../availability-zones/az-overview.md).<br /><br />Not all regions are supported for all types of storage accounts or redundancy configurations. For more information, see [Azure Storage redundancy](storage-redundancy.md).<br /><br />The choice of region can have a billing impact. For more information, see [Storage account billing](storage-account-overview.md#storage-account-billing).<br /><br />If your subscription supports Azure public multi-access edge zones (Azure MEC), you can deploy your storage account to an edge zone. For more information about edge zones, see [What is Azure public MEC?](../../public-multi-access-edge-compute-mec/overview.md). |
| Instance details | Performance | Required | Select **Standard** performance for general-purpose v2 storage accounts (default). This type of account is recommended by Microsoft for most scenarios. For more information, see [Types of storage accounts](storage-account-overview.md#types-of-storage-accounts).<br /><br />Select **Premium** for scenarios requiring low latency. After selecting **Premium**, select the type of premium storage account to create. The following types of premium storage accounts are available: <ul><li>[Block blobs](./storage-account-overview.md)</li><li>[File shares](../files/storage-files-planning.md#management-concepts)</li><li>[Page blobs](../blobs/storage-blob-pageblob-overview.md)</li></ul>
| Instance details | Redundancy | Required | Select your desired redundancy configuration. Not all redundancy options are available for all types of storage accounts in all regions. For more information about redundancy configurations, see [Azure Storage redundancy](storage-redundancy.md).<br /><br />If you select a geo-redundant configuration (GRS or GZRS), your data is replicated to a data center in a different region. For read access to data in the secondary region, select **Make read access to data available in the event of regional unavailability**. |

The following image shows a standard configuration of the basic properties for a new storage account.

:::image type="content" source="media/storage-account-create/create-account-basics-tab-sml.png" alt-text="Screenshot showing a standard configuration for a new storage account - Basics tab." lightbox="media/storage-account-create/create-account-basics-tab-lrg.png":::

### Advanced tab

On the **Advanced** tab, you can configure additional options and modify default settings for your new storage account. Some of these options can also be configured after the storage account is created, while others must be configured at the time of creation.

The following table describes the fields on the **Advanced** tab.

| Section | Field | Required or optional | Description |
|--|--|--|--|
| Security | Require secure transfer for REST API operations | Optional | Require secure transfer to ensure that incoming requests to this storage account are made only via HTTPS (default). Recommended for optimal security. For more information, see [Require secure transfer to ensure secure connections](storage-require-secure-transfer.md). |
| Security | Allow enabling anonymous access on individual containers | Optional | When enabled, this setting allows a user with the appropriate permissions to enable anonymous access to a container in the storage account (default). Disabling this setting prevents all anonymous access to the storage account. Microsoft recommends disabling this setting for optimal security.<br/> <br/> For more information, see [Prevent anonymous read access to containers and blobs](../blobs/anonymous-read-access-prevent.md).<br/> <br/> Enabling anonymous access does not make blob data available for anonymous access unless the user takes the additional step to explicitly configure the container's anonymous access setting. |
| Security | Enable storage account key access | Optional | When enabled, this setting allows clients to authorize requests to the storage account using either the account access keys or an Azure Active Directory (Azure AD) account (default). Disabling this setting prevents authorization with the account access keys. For more information, see [Prevent Shared Key authorization for an Azure Storage account](shared-key-authorization-prevent.md). |
| Security | Default to Azure Active Directory authorization in the Azure portal | Optional | When enabled, the Azure portal authorizes data operations with the user's Azure AD credentials by default. If the user does not have the appropriate permissions assigned via Azure role-based access control (Azure RBAC) to perform data operations, then the portal will use the account access keys for data access instead. The user can also choose to switch to using the account access keys. For more information, see [Default to Azure AD authorization in the Azure portal](../blobs/authorize-data-operations-portal.md#default-to-azure-ad-authorization-in-the-azure-portal). |
| Security | Minimum TLS version | Required | Select the minimum version of Transport Layer Security (TLS) for incoming requests to the storage account. The default value is TLS version 1.2. When set to the default value, incoming requests made using TLS 1.0 or TLS 1.1 are rejected. For more information, see [Enforce a minimum required version of Transport Layer Security (TLS) for requests to a storage account](transport-layer-security-configure-minimum-version.md). |
| Security | Permitted scope for copy operations (preview) | Required | Select the scope of storage accounts from which data can be copied to the new account. The default value is `From any storage account`. When set to the default value, users with the appropriate permissions can copy data from any storage account to the new account.<br /><br />Select `From storage accounts in the same Azure AD tenant` to only allow copy operations from storage accounts within the same Azure AD tenant.<br />Select `From storage accounts that have a private endpoint to the same virtual network` to only allow copy operations from storage accounts with private endpoints on the same virtual network.<br /><br /> For more information, see [Restrict the source of copy operations to a storage account](security-restrict-copy-operations.md). |
| Data Lake Storage Gen2 | Enable hierarchical namespace | Optional | To use this storage account for Azure Data Lake Storage Gen2 workloads, configure a hierarchical namespace. For more information, see [Introduction to Azure Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md). |
| Blob storage | Enable SFTP | Optional | Enable the use of Secure File Transfer Protocol (SFTP) to securely transfer of data over the internet. For more information, see [Secure File Transfer (SFTP) protocol support in Azure Blob Storage](../blobs/secure-file-transfer-protocol-support.md). |
| Blob storage | Enable network file system (NFS) v3 | Optional | NFS v3 provides Linux file system compatibility at object storage scale enables Linux clients to mount a container in Blob storage from an Azure Virtual Machine (VM) or a computer on-premises. For more information, see [Network File System (NFS) 3.0 protocol support in Azure Blob Storage](../blobs/network-file-system-protocol-support.md). |
| Blob storage | Allow cross-tenant replication | Required | By default, users with appropriate permissions can configure object replication across Azure AD tenants. To prevent replication across tenants, deselect this option. For more information, see [Prevent replication across Azure AD tenants](../blobs/object-replication-overview.md#prevent-replication-across-azure-ad-tenants). |
| Blob storage | Access tier | Required | Blob access tiers enable you to store blob data in the most cost-effective manner, based on usage. Select the hot tier (default) for frequently accessed data. Select the cool tier for infrequently accessed data. For more information, see [Hot, Cool, and Archive access tiers for blob data](../blobs/access-tiers-overview.md). |
| Azure Files | Enable large file shares | Optional | Available only for standard file shares with the LRS or ZRS redundancies. |

The following image shows a standard configuration of the advanced properties for a new storage account.

:::image type="content" source="media/storage-account-create/create-account-advanced-tab.png" alt-text="Screenshot showing a standard configuration for a new storage account - Advanced tab." lightbox="media/storage-account-create/create-account-advanced-tab.png":::

### Networking tab

On the **Networking** tab, you can configure network connectivity and routing preference settings for your new storage account. These options can also be configured after the storage account is created.

The following table describes the fields on the **Networking** tab.

| Section | Field | Required or optional | Description |
|--|--|--|--|
| Network connectivity | Network access | Required | By default, incoming network traffic is routed to the public endpoint for your storage account. You can specify that traffic must be routed to the public endpoint through an Azure virtual network. You can also configure private endpoints for your storage account. For more information, see [Use private endpoints for Azure Storage](storage-private-endpoints.md). |
| Network connectivity | Endpoint type | Required | Azure Storage supports two types of endpoints: [standard endpoints](storage-account-overview.md#standard-endpoints) (the default) and [Azure DNS zone endpoints](storage-account-overview.md#azure-dns-zone-endpoints-preview) (preview). Within a given subscription, you can create up to 250<sup>1</sup> accounts with standard endpoints per region, and up to 5000 accounts with Azure DNS zone endpoints per region, for a total of 5250 storage accounts. To register for the preview, see [About the preview](storage-account-overview.md#about-the-preview). |
| Network routing | Routing preference | Required | The network routing preference specifies how network traffic is routed to the public endpoint of your storage account from clients over the internet. By default, a new storage account uses Microsoft network routing. You can also choose to route network traffic through the POP closest to the storage account, which may lower networking costs. For more information, see [Network routing preference for Azure Storage](network-routing-preference.md). |

<sup>1</sup>With a quota increase, you can create up to 500 storage accounts with standard endpoints per region in a given subscription, for a total of 5500 storage accounts per region. For more information, see [Increase Azure Storage account quotas](../../quotas/storage-account-quota-requests.md).

The following image shows a standard configuration of the networking properties for a new storage account.

:::image type="content" source="media/storage-account-create/create-account-networking-tab-sml.png" alt-text="Screenshot showing a standard configuration for a new storage account - Networking tab." lightbox="media/storage-account-create/create-account-Networking-tab-lrg.png":::

> [!IMPORTANT]
> Azure DNS zone endpoints are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Data protection tab

On the **Data protection** tab, you can configure data protection options for blob data in your new storage account.  These options can also be configured after the storage account is created. For an overview of data protection options in Azure Storage, see [Data protection overview](../blobs/data-protection-overview.md).

The following table describes the fields on the **Data protection** tab.

| Section | Field | Required or optional | Description |
|--|--|--|--|
| Recovery | Enable point-in-time restore for containers | Optional | Point-in-time restore provides protection against accidental deletion or corruption by enabling you to restore block blob data to an earlier state. For more information, see [Point-in-time restore for block blobs](../blobs/point-in-time-restore-overview.md).<br /><br />Enabling point-in-time restore also enables blob versioning, blob soft delete, and blob change feed. These prerequisite features may have a cost impact. For more information, see [Pricing and billing](../blobs/point-in-time-restore-overview.md#pricing-and-billing) for point-in-time restore. |
| Recovery | Enable soft delete for blobs | Optional | Blob soft delete protects an individual blob, snapshot, or version from accidental deletes or overwrites by maintaining the deleted data in the system for a specified retention period. During the retention period, you can restore a soft-deleted object to its state at the time it was deleted. For more information, see [Soft delete for blobs](../blobs/soft-delete-blob-overview.md).<br /><br />Microsoft recommends enabling blob soft delete for your storage accounts and setting a minimum retention period of seven days. |
| Recovery | Enable soft delete for containers | Optional | Container soft delete protects a container and its contents from accidental deletes by maintaining the deleted data in the system for a specified retention period. During the retention period, you can restore a soft-deleted container to its state at the time it was deleted. For more information, see [Soft delete for containers](../blobs/soft-delete-container-overview.md).<br /><br />Microsoft recommends enabling container soft delete for your storage accounts and setting a minimum retention period of seven days. |
| Recovery | Enable soft delete for file shares | Optional | Soft delete for file shares protects a file share and its contents from accidental deletes by maintaining the deleted data in the system for a specified retention period. During the retention period, you can restore a soft-deleted file share to its state at the time it was deleted. For more information, see [Prevent accidental deletion of Azure file shares](../files/storage-files-prevent-file-share-deletion.md).<br /><br />Microsoft recommends enabling soft delete for file shares for Azure Files workloads and setting a minimum retention period of seven days. |
| Tracking | Enable versioning for blobs | Optional | Blob versioning automatically saves the state of a blob in a previous version when the blob is overwritten. For more information, see [Blob versioning](../blobs/versioning-overview.md).<br /><br />Microsoft recommends enabling blob versioning for optimal data protection for the storage account. |
| Tracking | Enable blob change feed | Optional | The blob change feed provides transaction logs of all changes to all blobs in your storage account, as well as to their metadata. For more information, see [Change feed support in Azure Blob Storage](../blobs/storage-blob-change-feed.md). |
| Access control | Enable version-level immutability support | Optional | Enable support for immutability policies that are scoped to the blob version. If this option is selected, then after you create the storage account, you can configure a default time-based retention policy for the account or for the container, which blob versions within the account or container will inherit by default. For more information, see [Enable version-level immutability support on a storage account](../blobs/immutable-policy-configure-version-scope.md#enable-version-level-immutability-support-on-a-storage-account). |

The following image shows a standard configuration of the data protection properties for a new storage account.

:::image type="content" source="media/storage-account-create/create-account-protection-tab-sml.png" alt-text="Screenshot showing a standard configuration for a new storage account - Data Protection tab." lightbox="media/storage-account-create/create-account-protection-tab-lrg.png":::

### Encryption tab

On the **Encryption** tab, you can configure options that relate to how your data is encrypted when it is persisted to the cloud. Some of these options can be configured only when you create the storage account.

| Field | Required or optional | Description |
|--|--|--|
| Encryption type| Required | By default, data in the storage account is encrypted by using Microsoft-managed keys. You can rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. For more information, see [Azure Storage encryption for data at rest](storage-service-encryption.md).  |
| Enable support for customer-managed keys | Required | By default, customer managed keys can be used to encrypt only blobs and files. Set this option to **All service types (blobs, files, tables, and queues)** to enable support for customer-managed keys for all services. You are not required to use customer-managed keys if you choose this option. For more information, see [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md). |
| Encryption key | Required if **Encryption type** field is set to **Customer-managed keys**. | If you choose **Select a key vault and key**, you are presented with the option to navigate to the key vault and key that you wish to use. If you choose **Enter key from URI**, then you are presented with a field to enter the key URI and the subscription. |
| User-assigned identity | Required if **Encryption type** field is set to **Customer-managed keys**. | If you are configuring customer-managed keys at create time for the storage account, you must provide a user-assigned identity to use for authorizing access to the key vault. |
| Enable infrastructure encryption | Optional | By default, infrastructure encryption is not enabled. Enable infrastructure encryption to encrypt your data at both the service level and the infrastructure level. For more information, see [Create a storage account with infrastructure encryption enabled for double encryption of data](infrastructure-encryption-enable.md). |

The following image shows a standard configuration of the encryption properties for a new storage account.

:::image type="content" source="media/storage-account-create/create-account-encryption-tab-sml.png" alt-text="Screenshot showing a standard configuration for a new storage account - Encryption tab." lightbox="media/storage-account-create/create-account-encryption-tab-lrg.png":::

### Tags tab

On the **Tags** tab, you can specify Resource Manager tags to help organize your Azure resources. For more information, see [Tag resources, resource groups, and subscriptions for logical organization](../../azure-resource-manager/management/tag-resources.md).

The following image shows a standard configuration of the index tag properties for a new storage account.

:::image type="content" source="media/storage-account-create/create-account-tags-tab-sml.png" alt-text="Screenshot showing a standard configuration for a new storage account - Tags tab." lightbox="media/storage-account-create/create-account-tags-tab-lrg.png":::

### Review + create tab

When you navigate to the **Review + create** tab, Azure runs validation on the storage account settings that you have chosen. If validation passes, you can proceed to create the storage account.

If validation fails, then the portal indicates which settings need to be modified.

The following image shows the **Review** tab data prior to the creation of a new storage account.

:::image type="content" source="media/storage-account-create/create-account-review-tab-sml.png" alt-text="Screenshot showing a standard configuration for a new storage account - Review tab." lightbox="media/storage-account-create/create-account-review-tab-lrg.png":::

# [PowerShell](#tab/azure-powershell)

To create a general-purpose v2 storage account with PowerShell, first create a new resource group by calling the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command:

```azurepowershell
$resourceGroup = "<resource-group>"
$location = "<location>"
New-AzResourceGroup -Name $resourceGroup -Location $location
```

If you're not sure which region to specify for the `-Location` parameter, you can retrieve a list of supported regions for your subscription with the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command:

```azurepowershell
Get-AzLocation | select Location
```

Next, create a standard general-purpose v2 storage account with read-access geo-redundant storage (RA-GRS) by using the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command. Remember that the name of your storage account must be unique across Azure, so replace the placeholder value in brackets with your own unique value:

```azurepowershell
New-AzStorageAccount -ResourceGroupName $resourceGroup `
  -Name <account-name> `
  -Location $location `
  -SkuName Standard_RAGRS `
  -Kind StorageV2 `
  -AllowBlobPublicAccess $false
```

To create an account with Azure DNS zone endpoints (preview), follow these steps:

1. Register for the preview as described in [Azure DNS zone endpoints (preview)](storage-account-overview.md#azure-dns-zone-endpoints-preview).

1. Make sure you have the latest version of PowerShellGet installed.

    ```azurepowershell
    Install-Module PowerShellGet –Repository PSGallery –Force
    ```

1. Close and reopen the PowerShell console.

1. Install version [4.4.2-preview](https://www.powershellgallery.com/packages/Az.Storage/4.4.2-preview) or later of the Az.Storage PowerShell module. You may need to uninstall other versions of the PowerShell module. For more information about installing Azure PowerShell, see [Install Azure PowerShell with PowerShellGet](/powershell/azure/install-azure-powershell).

    ```azurepowershell
    Install-Module Az.Storage -Repository PsGallery -RequiredVersion 4.4.2-preview -AllowClobber -AllowPrerelease -Force
    ```

Next, create the account, specifying `AzureDnsZone` for the `-DnsEndpointType` parameter. After the account is created, you can see the service endpoints by getting the `PrimaryEndpoints` and `SecondaryEndpoints` properties for the storage account.

```azurepowershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"

$account = New-AzStorageAccount -ResourceGroupName $rgName `
          -Name $accountName `
          -SkuName Standard_RAGRS `
          -Location <location> `
          -Kind StorageV2 `
          -AllowBlobPublicAccess $false `
          -DnsEndpointType AzureDnsZone

$account.PrimaryEndpoints
$account.SecondaryEndpoints 
```

To enable a hierarchical namespace for the storage account to use [Azure Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/), set the `EnableHierarchicalNamespace` parameter to `$True` on the call to the **New-AzStorageAccount** command.

The following table shows which values to use for the `SkuName` and `Kind` parameters to create a particular type of storage account with the desired redundancy configuration.

# [Azure CLI](#tab/azure-cli)

To create a general-purpose v2 storage account with Azure CLI, first create a new resource group by calling the [az group create](/cli/azure/group#az-group-create) command.

```azurecli-interactive
az group create \
  --name storage-resource-group \
  --location eastus
```

If you're not sure which region to specify for the `--location` parameter, you can retrieve a list of supported regions for your subscription with the [az account list-locations](/cli/azure/account#az-account-list) command.

```azurecli-interactive
az account list-locations \
  --query "[].{Region:name}" \
  --out table
```

Next, create a standard general-purpose v2 storage account with read-access geo-redundant storage by using the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command. Remember that the name of your storage account must be unique across Azure, so replace the placeholder value in brackets with your own unique value:

```azurecli-interactive
az storage account create \
  --name <account-name> \
  --resource-group storage-resource-group \
  --location eastus \
  --sku Standard_RAGRS \
  --kind StorageV2 \
  --allow-blob-public-access false
```

To create an account with Azure DNS zone endpoints (preview), first register for the preview as described in [Azure DNS zone endpoints (preview)](storage-account-overview.md#azure-dns-zone-endpoints-preview). Next, install the preview extension for the Azure CLI if it's not already installed:

```azurecli
az extension add --name storage-preview
```

Next, create the account, specifying `AzureDnsZone` for the `--dns-endpoint-type` parameter. After the account is created, you can see the service endpoints by getting the `PrimaryEndpoints` property of the storage account.

```azurecli
az storage account create \
    --name <account-name> \
    --resource-group <resource-group> \
    --location <location> \
    --dns-endpoint-type AzureDnsZone
```

After the account is created, you can return the service endpoints by getting the `primaryEndpoints` and `secondaryEndpoints` properties for the storage account.

```azurecli
az storage account show \
    --resource-group <resource-group> \
    --name <account-name> \
    --query '[primaryEndpoints, secondaryEndpoints]'
```

To enable a hierarchical namespace for the storage account to use [Azure Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/), set the `enable-hierarchical-namespace` parameter to `true` on the call to the **az storage account create** command. Creating a hierarchical namespace requires Azure CLI version 2.0.79 or later.

# [Bicep](#tab/bicep)

You can use either Azure PowerShell or Azure CLI to deploy a Bicep file to create a storage account. The Bicep file used in this how-to article is from [Azure Resource Manager quickstart templates](https://azure.microsoft.com/resources/templates/storage-account-create/). Bicep currently doesn't support deploying a remote file.  Download and save [the Bicep file](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/main.bicep) to your local computer, and then run the scripts.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile "main.bicep"
```

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
echo "Enter the location (i.e. centralus):" &&
read location &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-file "main.bicep"
```

> [!NOTE]
> This Bicep file serves only as an example. There are many storage account settings that aren't configured as part of this Bicep file. For example, if you want to use [Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/), you would modify this Bicep file by setting the `isHnsEnabled` property of the `StorageAccountPropertiesCreateParameters` object to `true`.

To learn how to modify this Bicep file or create new ones, see:

- [Azure Resource Manager documentation](../../azure-resource-manager/index.yml).
- [Storage account template reference](/azure/templates/microsoft.storage/allversions).
- [Additional storage account template samples](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Storage).

# [Template](#tab/template)

You can use either Azure PowerShell or Azure CLI to deploy a Resource Manager template to create a storage account. The template used in this how-to article is from [Azure Resource Manager quickstart templates](https://azure.microsoft.com/resources/templates/storage-account-create/). To run the scripts, select **Try it** to open the Azure Cloud Shell. To paste the script, right-click the shell, and then select **Paste**.

```azurepowershell
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json"
```

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
echo "Enter the location (i.e. centralus):" &&
read location &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json"
```

> [!NOTE]
> This template serves only as an example. There are many storage account settings that aren't configured as part of this template. For example, if you want to use [Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/), you would modify this template by setting the `isHnsEnabled` property of the `StorageAccountPropertiesCreateParameters` object to `true`.

To learn how to modify this template or create new ones, see:

- [Azure Resource Manager documentation](../../azure-resource-manager/index.yml).
- [Storage account template reference](/azure/templates/microsoft.storage/allversions).g
- [Additional storage account template samples](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Storage).

# [Azure Developer CLI](#tab/azure-developer-cli)

The Azure Developer CLI (`azd`) is designed around [`azd` templates](/azure/developer/azure-developer-cli/make-azd-compatible?pivots=azd-convert). These templates leverage Bicep files, basic configurations and automation tasks to provision and deploy resources to Azure. You can also view the source code for the template in the [create a storage account quickstart]() repository.

Initialize and run the template for this quickstart using the following steps:

1. Run the `azd init` command in a local terminal or CloudShell:

    ```dotnetcli
    azd init --template https://github.com/alexwolfmsft/azd-storage-test
    ```

1. `azd` will prompt you for an environment name, which will determine the naming of provisioned resources in Azure.  Enter the name `azdstorage` and press enter.

    :::image type="content" source="media/storage-account-create/azd-init.png" alt-text="A screenshot showing the Azure Developer CLI init command.":::

1. Next, run the `azd up` command to begin the template provisioning and deployment process.

    ```dotnetcli
    azd up
    ```

1. If you are not already authenticated to Azure, `azd` will output a message instructing you to sign-in to Azure using the `azd auth login` command.

    ```dotnetcli
    azd auth login
    ```

1. Once you are authenticated, `azd` will prompt you for the Azure location to provision the storage account to from a list of regions. Select your desired location from the list and press enter.

1. `azd` will also prompt you for a storage account sku. The sku is a custom parameter that was added to the azd template to add flexibility to the storage account provisioning. Choose `Standard_LRS` or whatever sku you would like, and then press enter.

1. `azd` will begin provisioning the storage account. The command output will provide a link to the deployment in Azure  and status details until the command finishes.

    :::image type="content" source="media/storage-account-create/azd-up.png" alt-text="A screenshot showing the output of the azd up command.":::

1. When the command finishes, click the link to open the Azure portal to the provisioned resource group and storage account.

    :::image type="content" source="media/storage-account-create/azd-resource-group.png" alt-text="A screenshot showing the deployed resource group and storage account.":::

---
## Delete a storage account

Deleting a storage account deletes the entire account, including all data in the account. Be sure to back up any data you want to save before you delete the account.

Under certain circumstances, a deleted storage account may be recovered, but recovery is not guaranteed. For more information, see [Recover a deleted storage account](storage-account-recover.md).

If you try to delete a storage account associated with an Azure virtual machine, you may get an error about the storage account still being in use. For help troubleshooting this error, see [Troubleshoot errors when you delete storage accounts](/troubleshoot/azure/virtual-machines/storage-resource-deletion-errors).

# [Portal](#tab/azure-portal)

1. Navigate to the storage account in the [Azure portal](https://portal.azure.com).
1. Select **Delete**.

# [PowerShell](#tab/azure-powershell)

To delete the storage account, use the [Remove-AzStorageAccount](/powershell/module/az.storage/remove-azstorageaccount) command:

```powershell
Remove-AzStorageAccount -Name <storage-account> -ResourceGroupName <resource-group>
```

# [Azure CLI](#tab/azure-cli)

To delete the storage account, use the [az storage account delete](/cli/azure/storage/account#az-storage-account-delete) command:

```azurecli-interactive
az storage account delete --name <storage-account> --resource-group <resource-group>
```

# [Bicep](#tab/bicep)

To delete the storage account, use either Azure PowerShell or Azure CLI.

```azurepowershell-interactive
$storageResourceGroupName = Read-Host -Prompt "Enter the resource group name"
$storageAccountName = Read-Host -Prompt "Enter the storage account name"
Remove-AzStorageAccount -Name $storageAccountName -ResourceGroupName $storageResourceGroupName
```

```azurecli-interactive
echo "Enter the resource group name:" &&
read resourceGroupName &&
echo "Enter the storage account name:" &&
read storageAccountName &&
az storage account delete --name storageAccountName --resource-group resourceGroupName
```

# [Template](#tab/template)

To delete the storage account, use either Azure PowerShell or Azure CLI.

```azurepowershell
$storageResourceGroupName = Read-Host -Prompt "Enter the resource group name"
$storageAccountName = Read-Host -Prompt "Enter the storage account name"
Remove-AzStorageAccount -Name $storageAccountName -ResourceGroupName $storageResourceGroupName
```

```azurecli-interactive
echo "Enter the resource group name:" &&
read resourceGroupName &&
echo "Enter the storage account name:" &&
read storageAccountName &&
az storage account delete --name storageAccountName --resource-group resourceGroupName
```

# [Azure Developer CLI](#tab/azure-developer-cli)

To delete the resource group and storage account created by `azd`, use the `azd down` command:

```azurecli-interactive
azd down
```

---
Alternately, you can delete the resource group, which deletes the storage account and any other resources in that resource group. For more information about deleting a resource group, see [Delete resource group and resources](../../azure-resource-manager/management/delete-resource-group.md).

## Create a general purpose v1 storage account

[!INCLUDE [GPv1 support statement](../../../includes/storage-account-gpv1-support.md)]

General purpose v1 (GPv1) storage accounts can no longer be created from the Azure portal. If you need to create a GPv1 storage account, follow the steps in section [Create a storage account](#create-a-storage-account-1) for PowerShell, the Azure CLI, Bicep, or Azure Templates. For the `kind` parameter, specify `Storage`, and choose a `sku` or `SkuName` from the [table of supported values](#storage-account-type-parameters).

## Next steps

- [Storage account overview](storage-account-overview.md)
- [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md)
- [Move a storage account to another region](storage-account-move.md)
- [Recover a deleted storage account](storage-account-recover.md)
- [Migrate a classic storage account](classic-account-migrate.md)
