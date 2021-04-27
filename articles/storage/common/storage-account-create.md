---
title: Create a storage account
titleSuffix: Azure Storage
description: Learn to create a storage account to store blobs, files, queues, and tables. An Azure storage account provides a unique namespace in Microsoft Azure for reading and writing your data.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 04/19/2021
ms.author: tamram
ms.subservice: common 
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Create a storage account

An Azure storage account contains all of your Azure Storage data objects: blobs, files, queues, and tables. The storage account provides a unique namespace for your Azure Storage data that is accessible from anywhere in the world over HTTP or HTTPS. For more information about Azure storage accounts, see [Storage account overview](storage-account-overview.md).

In this how-to article, you learn to create a storage account using the [Azure portal](https://portal.azure.com/), [Azure PowerShell](/powershell/azure/), [Azure CLI](/cli/azure), or an [Azure Resource Manager template](../../azure-resource-manager/management/overview.md).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

# [Portal](#tab/azure-portal)

None.

# [PowerShell](#tab/azure-powershell)

To create an Azure storage account with PowerShell, make sure you have installed the [Az PowerShell module](https://www.powershellgallery.com/packages/Az), version 0.7 or later. For more information, see [Introducing the Azure PowerShell Az module](/powershell/azure/new-azureps-module-az).

To find your current version, run the following command:

```powershell
Get-InstalledModule -Name "Az"
```

To install or upgrade Azure PowerShell, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

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

You can also install and use the Azure CLI locally. The examples in this article require Azure CLI version 2.0.4 or later. Run `az --version` to find your installed version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

# [Template](#tab/template)

None.

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

To log into your local installation of the CLI, run the [az login](/cli/azure/reference-index#az_login) command:

```azurecli-interactive
az login
```

# [Template](#tab/template)

N/A

---

## Create a storage account

A storage account is an Azure Resource Manager resource. Resource Manager is the deployment and management service for Azure. For more information, see [Azure Resource Manager overview](../../azure-resource-manager/management/overview.md).

Every Resource Manager resource, including an Azure storage account, must belong to an Azure resource group. A resource group is a logical container for grouping your Azure services. When you create a storage account, you have the option to either create a new resource group, or use an existing resource group. This how-to shows how to create a new resource group.

# [Portal](#tab/azure-portal)

To create an Azure storage account with the Azure portal, follow these steps:

1. From the left portal menu, select **Storage accounts** to display a list of your storage accounts.
1. On the **Storage accounts** page, select **New**.

Options for your new storage account are organized into tabs in the **Create a storage account** page. The following sections describe each of the tabs and their options.

### Basics tab

On the **Basics** tab, provide the essential information for your storage account. After you complete the **Basics** tab, you can choose to further customize your new storage account by setting options on the other tabs, or you can select **Review + create** to accept the default options and proceed to validate and create the account.

The following table describes the fields on the **Basics** tab.

| Section | Field | Required or optional | Description |
|--|--|--|--|
| Project details | Subscription | Required | Select the subscription for the new storage account. |
| Project details | Resource group | Required | Create a new resource group for this storage account, or select an existing one. For more information, see [Resource groups](../../azure-resource-manager/management/overview.md#resource-groups). |
| Instance details | Storage account name | Required | Choose a unique name for your storage account. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. |
| Instance details | Region | Required | Select the appropriate region for your storage account. For more information, see [Regions and Availability Zones in Azure](../../availability-zones/az-overview.md).<br /><br />Not all regions are supported for all types of storage accounts or redundancy configurations. For more information, see [Azure Storage redundancy](storage-redundancy.md).<br /><br />The choice of region can have a billing impact. For more information, see [Storage account billing](storage-account-overview.md#storage-account-billing). |
| Instance details | Performance | Required | Select **Standard** performance for general-purpose v2 storage accounts (default). This type of account is recommended by Microsoft for most scenarios. For more information, see [Types of storage accounts](storage-account-overview.md#types-of-storage-accounts).<br /><br />Select **Premium** for scenarios requiring low latency. After selecting **Premium**, select the type of premium storage account to create. The following types of premium storage accounts are available: <ul><li>[Block blobs](../blobs/storage-blob-performance-tiers.md)</li><li>[File shares](../files/storage-files-planning.md#management-concepts)</li><li>[Page blobs](../blobs/storage-blob-pageblob-overview.md)</li></ul> |
| Instance details | Redundancy | Required | Select your desired redundancy configuration. Not all redundancy options are available for all types of storage accounts in all regions. For more information about redundancy configurations, see [Azure Storage redundancy](storage-redundancy.md).<br /><br />If you select a geo-redundant configuration (GRS or GZRS), your data is replicated to a data center in a different region. For read access to data in the secondary region, select **Make read access to data available in the event of regional unavailability**. |

The following image shows a standard configuration for a new storage account.

:::image type="content" source="media/storage-account-create/create-account-basics-tab.png" alt-text="Screenshot showing a standard configuration for a new storage account - Basics tab":::

### Advanced tab

On the **Advanced** tab, you can configure additional options and modify default settings for your new storage account. Some of these options can also be configured after the storage account is created, while others must be configured at the time of creation.

The following table describes the fields on the **Advanced** tab.

| Section | Field | Required or optional | Description |
|--|--|--|--|
| Security | Enable secure transfer | Optional | Enable secure transfer to require that incoming requests to this storage account are made only via HTTPS (default). Recommended for optimal security. For more information, see [Require secure transfer to ensure secure connections](storage-require-secure-transfer.md). |
| Security | Enable infrastructure encryption | Optional | By default, infrastructure encryption is not enabled. Enable infrastructure encryption to encrypt your data at both the service level and the infrastructure level. For more information, see [Create a storage account with infrastructure encryption enabled for double encryption of data](infrastructure-encryption-enable.md). |
| Security | Enable blob public access | Optional | When enabled, this setting allows a user with the appropriate permissions to enable anonymous public access to a container in the storage account (default). Disabling this setting prevents all anonymous public access to the storage account. For more information, see [Prevent anonymous public read access to containers and blobs](../blobs/anonymous-read-access-prevent.md).<br> <br> Enabling blob public access does not make blob data available for public access unless the user takes the additional step to explicitly configure the container's public access setting. |
| Security | Enable storage account key access (preview) | Optional | When enabled, this setting allows clients to authorize requests to the storage account using either the account access keys or an Azure Active Directory (Azure AD) account (default). Disabling this setting prevents authorization with the account access keys. For more information, see [Prevent Shared Key authorization for an Azure Storage account (preview)](shared-key-authorization-prevent.md). |
| Security | Minimum TLS version | Required | Select the minimum version of Transport Layer Security (TLS) for incoming requests to the storage account. The default value is TLS version 1.2. When set to the default value, incoming requests made using TLS 1.0 or TLS 1.1 are rejected. For more information, see [Enforce a minimum required version of Transport Layer Security (TLS) for requests to a storage account](transport-layer-security-configure-minimum-version.md). |
| Data Lake Storage Gen2 | Enable hierarchical namespace | Optional | To use this storage account for Azure Data Lake Storage Gen2 workloads, configure a hierarchical namespace. For more information, see [Introduction to Azure Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md). |
| Blob storage | Enable network file share (NFS) v3 (preview) | Optional | NFS v3 provides Linux file system compatibility at object storage scale enables Linux clients to mount a container in Blob storage from an Azure Virtual Machine (VM) or a computer on-premises. For more information, see [Network File System (NFS) 3.0 protocol support in Azure Blob storage (preview)](../blobs/network-file-system-protocol-support.md). |
| Blob storage | Access tier | Required | Blob access tiers enable you to store blob data in the most cost-effective manner, based on usage. Select the hot tier (default) for frequently accessed data. Select the cool tier for infrequently accessed data. For more information, see [Access tiers for Azure Blob Storage - hot, cool, and archive](../blobs/storage-blob-storage-tiers.md). |
| Azure Files | Enable large file shares | Optional | Available only for premium storage accounts for file shares. For more information, see [Enable standard file shares to span up to 100 TiB](../files/storage-files-planning.md#enable-standard-file-shares-to-span-up-to-100-tib). |
| Tables and queues | Enable support for customer-managed keys | Optional | To enable support for customer-managed keys for tables and queues, you must select this setting at the time that you create the storage account. For more information, see [Create an account that supports customer-managed keys for tables and queues](account-encryption-key-create.md). |

### Networking tab

On the **Networking** tab, you can configure network connectivity and routing preference settings for your new storage account. These options can also be configured after the storage account is created.

The following table describes the fields on the **Networking** tab.

| Section | Field | Required or optional | Description |
|--|--|--|--|
| Network connectivity | Connectivity method | Required | By default, incoming network traffic is routed to the public endpoint for your storage account. You can specify that traffic must be routed to the public endpoint through an Azure virtual network. You can also configure private endpoints for your storage account. For more information, see [Use private endpoints for Azure Storage](storage-private-endpoints.md). |
| Network routing | Routing preference | Required | The network routing preference specifies how network traffic is routed to the public endpoint of your storage account from clients over the internet. By default, a new storage account uses Microsoft network routing. You can also choose to route network traffic through the POP closest to the storage account, which may lower networking costs. For more information, see [Network routing preference for Azure Storage](network-routing-preference.md). |

### Data protection tab

On the **Data protection** tab, you can configure data protection options for blob data in your new storage account.  These options can also be configured after the storage account is created. For an overview of data protection options in Azure Storage, see [Data protection overview](../blobs/data-protection-overview.md).

The following table describes the fields on the **Data protection** tab.

| Section | Field | Required or optional | Description |
|--|--|--|--|
| Recovery | Enable point-in-time restore for containers | Optional | Point-in-time restore provides protection against accidental deletion or corruption by enabling you to restore block blob data to an earlier state. For more information, see [Point-in-time restore for block blobs](../blobs/point-in-time-restore-overview.md).<br /><br />Enabling point-in-time restore also enables blob versioning, blob soft delete, and blob change feed. These prerequisite features may have a cost impact. For more information, see [Pricing and billing](../blobs/point-in-time-restore-overview.md#pricing-and-billing) for point-in-time restore. |
| Recovery | Enable soft delete for blobs | Optional | Blob soft delete protects an individual blob, snapshot, or version from accidental deletes or overwrites by maintaining the deleted data in the system for a specified retention period. During the retention period, you can restore a soft-deleted object to its state at the time it was deleted. For more information, see [Soft delete for blobs](../blobs/soft-delete-blob-overview.md).<br /><br />Microsoft recommends enabling blob soft delete for your storage accounts and setting a minimum retention period of seven days. |
| Recovery | Enable soft delete for containers (preview) | Optional | Container soft delete protects a container and its contents from accidental deletes by maintaining the deleted data in the system for a specified retention period. During the retention period, you can restore a soft-deleted container to its state at the time it was deleted. For more information, see [Soft delete for containers (preview)](../blobs/soft-delete-container-overview.md).<br /><br />Microsoft recommends enabling container soft delete for your storage accounts and setting a minimum retention period of seven days. |
| Recovery | Enable soft delete for file shares | Optional | Soft delete for file shares protects a file share and its contents from accidental deletes by maintaining the deleted data in the system for a specified retention period. During the retention period, you can restore a soft-deleted file share to its state at the time it was deleted. For more information, see [Prevent accidental deletion of Azure file shares](../files/storage-files-prevent-file-share-deletion.md).<br /><br />Microsoft recommends enabling soft delete for file shares for Azure Files workloads and setting a minimum retention period of seven days. |
| Tracking | Enable versioning for blobs | Optional | Blob versioning automatically saves the state of a blob in a previous version when the blob is overwritten. For more information, see [Blob versioning](../blobs/versioning-overview.md).<br /><br />Microsoft recommends enabling blob versioning for optimal data protection for the storage account. |
| Tracking | Enable blob change feed | Optional | The blob change feed provides transaction logs of all changes to all blobs in your storage account, as well as to their metadata. For more information, see [Change feed support in Azure Blob Storage](../blobs/storage-blob-change-feed.md). |

### Tags tab

On the **Tags** tab, you can specify Resource Manager tags to help organize your Azure resources. For more information, see [Tag resources, resource groups, and subscriptions for logical organization](../../azure-resource-manager/management/tag-resources.md).

### Review + create tab

When you navigate to the **Review + create** tab, Azure runs validation on the storage account settings that you have chosen. If validation passes, you can proceed to create the storage account.

If validation fails, then the portal indicates which settings need to be modified.

# [PowerShell](#tab/azure-powershell)

To create a general-purpose v2 storage account with PowerShell, first create a new resource group by calling the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command:

```azurepowershell-interactive
$resourceGroup = "<resource-group>"
$location = "<location>"
New-AzResourceGroup -Name $resourceGroup -Location $location
```

If you're not sure which region to specify for the `-Location` parameter, you can retrieve a list of supported regions for your subscription with the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command:

```azurepowershell-interactive
Get-AzLocation | select Location
```

Next, create a standard general-purpose v2 storage account with read-access geo-redundant storage (RA-GRS) by using the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command. Remember that the name of your storage account must be unique across Azure, so replace the placeholder value in brackets with your own unique value:

```azurepowershell-interactive
New-AzStorageAccount -ResourceGroupName $resourceGroup `
  -Name <account-name> `
  -Location $location `
  -SkuName Standard_RAGRS `
  -Kind StorageV2
```

To enable a hierarchical namespace for the storage account to use [Azure Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/), include the `-EnableHierarchicalNamespace $True` parameter on the call to the **New-AzStorageAccount** command.

The following table shows which values to use for the `-SkuName` and `-Kind` parameters to create a particular type of storage account with the desired redundancy configuration.

| Type of storage account | Supported redundancy configurations | Value for the -Kind parameter | Possible values for the -SkuName parameter | Supports hierarchical namespace |
|--|--|--|--|--|
| Standard general-purpose v2 | LRS / GRS / RA-GRS / ZRS / GZRS / RA-GZRS | StorageV2 | Standard_LRS / Standard_GRS / Standard_RAGRS/ Standard_ZRS / Standard_GZRS / Standard_RAGZRS | Yes |
| Premium block blobs | LRS / ZRS | BlockBlobStorage | Premium_LRS / Premium_ZRS | Yes |
| Premium file shares | LRS / ZRS | FileStorage | Premium_LRS / Premium_ZRS | No |
| Premium page blobs | LRS | StorageV2 | Premium_LRS | No |
| Legacy standard general-purpose v1 | LRS / GRS / RA-GRS | Storage | Standard_LRS / Standard_GRS / Standard_RAGRS | No |
| Legacy blob storage | LRS / GRS / RA-GRS | BlobStorage | Standard_LRS / Standard_GRS / Standard_RAGRS | No |

# [Azure CLI](#tab/azure-cli)

To create a general-purpose v2 storage account with Azure CLI, first create a new resource group by calling the [az group create](/cli/azure/group#az_group_create) command.

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

Next, create a standard general-purpose v2 storage account with read-access geo-redundant storage by using the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command. Remember that the name of your storage account must be unique across Azure, so replace the placeholder value in brackets with your own unique value:

```azurecli-interactive
az storage account create \
  --name <account-name> \
  --resource-group storage-resource-group \
  --location westus \
  --sku Standard_RAGRS \
  --kind StorageV2
```

To enable a hierarchical namespace for the storage account to use [Azure Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/), include the `--enable-hierarchical-namespace true` parameter on the call to the **az storage account create** command. Creating a hierarchical namespace requires Azure CLI version 2.0.79 or later.

The following table shows which values to use for the `-sku` and `-kind` parameters to create a particular type of storage account with the desired redundancy configuration.

| Type of storage account | Supported redundancy configurations | Value for the -kind parameter | Possible values for the -sku parameter | Supports hierarchical namespace |
|--|--|--|--|--|
| Standard general-purpose v2 | LRS / GRS / RA-GRS / ZRS / GZRS / RA-GZRS | StorageV2 | Standard_LRS / Standard_GRS / Standard_RAGRS/ Standard_ZRS / Standard_GZRS / Standard_RAGZRS | Yes |
| Premium block blobs | LRS / ZRS | BlockBlobStorage | Premium_LRS / Premium_ZRS | Yes |
| Premium file shares | LRS / ZRS | FileStorage | Premium_LRS / Premium_ZRS | No |
| Premium page blobs | LRS | StorageV2 | Premium_LRS | No |
| Legacy standard general-purpose v1 | LRS / GRS / RA-GRS | Storage | Standard_LRS / Standard_GRS / Standard_RAGRS | No |
| Legacy blob storage | LRS / GRS / RA-GRS | BlobStorage | Standard_LRS / Standard_GRS / Standard_RAGRS | No |

# [Template](#tab/template)

You can use either Azure PowerShell or Azure CLI to deploy a Resource Manager template to create a storage account. The template used in this how-to article is from [Azure Resource Manager quickstart templates](https://azure.microsoft.com/resources/templates/101-storage-account-create/). To run the scripts, select **Try it** to open the Azure Cloud Shell. To paste the script, right-click the shell, and then select **Paste**.

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
az deployment group create --resource-group $resourceGroupName --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json"
```

> [!NOTE]
> This template serves only as an example. There are many storage account settings that aren't configured as part of this template. For example, if you want to use [Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/), you would modify this template by setting the `isHnsEnabledad` property of the `StorageAccountPropertiesCreateParameters` object to `true`.

To learn how to modify this template or create new ones, see:

- [Azure Resource Manager documentation](../../azure-resource-manager/index.yml).
- [Storage account template reference](/azure/templates/microsoft.storage/allversions).
- [Additional storage account template samples](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Storage).

---

## Delete a storage account

Deleting a storage account deletes the entire account, including all data in the account, and cannot be undone.

# [Portal](#tab/azure-portal)

1. Navigate to the storage account in the [Azure portal](https://portal.azure.com).
1. Click **Delete**.

# [PowerShell](#tab/azure-powershell)

To delete the storage account, use the [Remove-AzStorageAccount](/powershell/module/az.storage/remove-azstorageaccount) command:

```powershell
Remove-AzStorageAccount -Name <storage-account> -ResourceGroupName <resource-group>
```

# [Azure CLI](#tab/azure-cli)

To delete the storage account, use the [az storage account delete](/cli/azure/storage/account#az_storage_account_delete) command:

```azurecli-interactive
az storage account delete --name <storage-account> --resource-group <resource-group>
```

# [Template](#tab/template)

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

---

Alternately, you can delete the resource group, which deletes the storage account and any other resources in that resource group. For more information about deleting a resource group, see [Delete resource group and resources](../../azure-resource-manager/management/delete-resource-group.md).

> [!WARNING]
> It's not possible to restore a deleted storage account or retrieve any of the content that it contained before deletion. Be sure to back up anything you want to save before you delete the account. This also holds true for any resources in the account—once you delete a blob, table, queue, or file, it is permanently deleted.
>
> If you try to delete a storage account associated with an Azure virtual machine, you may get an error about the storage account still being in use. For help troubleshooting this error, see [Troubleshoot errors when you delete storage accounts](/troubleshoot/azure/virtual-machines/welcome-virtual-machines).

## Next steps

- [Storage account overview](storage-account-overview.md)
- [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md)
- [Move a storage account to another region](storage-account-move.md)
- [Recover a deleted storage account](storage-account-recover.md)