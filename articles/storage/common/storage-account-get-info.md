---
title: Get storage account configuration information
titleSuffix: Azure Storage
description: Use the Azure portal, PowerShell, or Azure CLI to retrieve storage account configuration properties, including the Azure Resource Manager resource ID, account location, account type, or replication SKU.
services: storage
author: akashdubey-ms

ms.author: akashdubey
ms.date: 12/12/2022
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.custom: engagement-fy23, devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
---

# Get storage account configuration information

This article shows how to get configuration information and properties for an Azure Storage account by using the Azure portal, PowerShell, or Azure CLI.

## Get the resource ID for a storage account

Every Azure Resource Manager resource has an associated resource ID that uniquely identifies it. Certain operations require that you provide the resource ID. You can get the resource ID for a storage account by using the Azure portal, PowerShell, or Azure CLI.

# [Azure portal](#tab/portal)

To display the Azure Resource Manager resource ID for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. On the **Overview** page, in the **Essentials** section, select the **JSON View** link.
1. The resource ID for the storage account is displayed at the top of the page.

    :::image type="content" source="media/storage-account-get-info/resource-id-portal.png" alt-text="Screenshot showing how to copy the resource ID for the storage account from the portal":::

# [PowerShell](#tab/powershell)

To return the Azure Resource Manager resource ID for a storage account with PowerShell, make sure you have installed the [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage) module. Next, call the [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount) command to return the storage account and get its resource ID:

```azurepowershell
(Get-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account>).Id
```

# [Azure CLI](#tab/azure-cli)

To return the Azure Resource Manager resource ID for a storage account with Azure CLI, call the [az storage account show](/cli/azure/storage/account#az-storage-account-show) command and query the resource ID:

```azurecli
az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query id \
    --output tsv
```

---

You can also get the resource ID for a storage account by calling the [Storage Accounts - Get Properties](/rest/api/storagerp/storage-accounts/get-properties) operation in the REST API.

For more information about types of resources managed by Azure Resource Manager, see [Resource providers and resource types](../../azure-resource-manager/management/resource-providers-and-types.md).

## Get the account type, location, or replication SKU for a storage account

The account type, location, and replication SKU are some of the properties available on a storage account. You can use the Azure portal, PowerShell, or Azure CLI to view these values.

# [Azure portal](#tab/portal)

To view the account type, location, or replication SKU for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Locate these properties on the **Overview** page, in the **Essentials** section

    :::image type="content" source="media/storage-account-get-info/account-configuration-portal.png" alt-text="Screenshot showing account configuration in the portal":::

# [PowerShell](#tab/powershell)

To view the account type, location, or replication SKU for a storage account with PowerShell, call the [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount) command to return the storage account, then check the properties:

```azurepowershell
$account = Get-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account>
$account.Location
$account.Sku
$account.Kind
```

# [Azure CLI](#tab/azure-cli)

To view the account type, location, or replication SKU for a storage account with PowerShell, call the [az storage account show](/cli/azure/storage/account#az-storage-account-show) command and query the properties:

```azurecli
az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query '[location,sku,kind]' \
    --output tsv
```

---

## Get service endpoints for the storage account

The service endpoints for a storage account provide the base URL for any blob, queue, table, or file object in Azure Storage. Use this base URL to construct the address for any given resource.

# [Azure portal](#tab/portal)

To get the service endpoints for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. In the **Settings** section, locate the **Endpoints** setting.
1. On the **Endpoints** page, you'll see the service endpoint for each Azure Storage service, as well as the resource ID.

    :::image type="content" source="media/storage-account-get-info/service-endpoints-portal-sml.png" alt-text="Screenshot showing how to retrieve service endpoints for a storage account." lightbox="media/storage-account-get-info/service-endpoints-portal-lrg.png":::

If the storage account is geo-replicated, the secondary endpoints will also appear on this page.

# [PowerShell](#tab/powershell)

To get the service endpoints for a storage account with PowerShell, call [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount) and return the `PrimaryEndpoints` property. If the storage account is geo-replicated, then the `SecondaryEndpoints` property returns the secondary endpoints.

```azurepowershell
(Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName).PrimaryEndpoints
(Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName).SecondaryEndpoints
```

# [Azure CLI](#tab/azure-cli)

To get the service endpoints for a storage account with Azure CLI, call [az storage account show](/cli/azure/storage/account#az-storage-account-show) and return the `primaryEndpoints` property. If the storage account is geo-replicated, then the `secondaryEndpoints` property returns the secondary endpoints.

```azurecli
az storage account show \
    --resource-group <resource-group> \
    --name <account-name> \
    --query '[primaryEndpoints, secondaryEndpoints]'
```

---

## Get a connection string for the storage account

You can use a connection string to authorize access to Azure Storage with the account access keys (Shared Key authorization). To learn more about connection strings, see [Configure Azure Storage connection strings](storage-configure-connection-string.md).

> [!IMPORTANT]
> Your storage account access keys are similar to a root password for your storage account. Always be careful to protect your access keys. Use Azure Key Vault to manage and rotate your keys securely. Avoid distributing access keys to other users, hard-coding them, or saving them anywhere in plain text that is accessible to others. Rotate your keys if you believe they may have been compromised.
>
> Microsoft recommends using Azure Active Directory (Azure AD) to authorize requests against blob and queue data if possible, rather than using the account keys (Shared Key authorization). Authorization with Azure AD provides superior security and ease of use over Shared Key authorization. For more information, see [Authorize access to data in Azure Storage](authorize-data-access.md).

# [Portal](#tab/portal)

To get a connection string in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. In the **Security + networking** section, locate the **Access keys** setting.
1. To display the account keys and associated connection strings, select the **Show keys** button at the top of the page.
1. To copy a connection string to the clipboard, select the **Copy** button to the right of the connection string.

# [PowerShell](#tab/powershell)

To get a connection string with PowerShell, first get a `StorageAccountContext` object, then retrieve the `ConnectionString` property.

```azurepowershell
$rgName = "<resource-group>"
$accountName = "storagesamplesdnszone2"

(Get-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account>).Context.ConnectionString
```

# [Azure CLI](#tab/azure-cli)

To get a connection string with Azure CLI, call the [az storage account show-connection-string](/cli/azure/storage/account#az-storage-account-show-connection-string) command.

```azurecli
az storage account show-connection-string --resource-group <resource-group> --name <storage-account>
```

---

## Get the creation time of the account access keys for a storage account

If the **keyCreationTime** property of one or both of the account access keys for a storage account is null, then you will need to rotate the keys before you can configure a key expiration policy or a SAS expiration policy. You can check the **keyCreationTime** for a storage account by using the Azure portal, PowerShell, or Azure CLI.

# [Azure portal](#tab/portal)

To display the creation time of the account access keys for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. On the **Overview** page, in the **Essentials** section, select the **JSON View** link.
1. On the **Resource JSON** page, select the most recent **API version**.
1. In the JSON under *properties* you will see the *keyCreationTime* for *key1* and *key2*.

    :::image type="content" source="media/storage-account-get-info/key-creation-time-portal.png" alt-text="Screenshot of the JSON View of a storage account showing one account access key with null values and another with a date and time stamp." lightbox="media/storage-account-get-info/key-creation-time-portal.png":::

# [PowerShell](#tab/powershell)

To return the creation time of the account access keys for a storage account with PowerShell, make sure you have installed the [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage) module. Next, call the [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount) command to get the **keyCreationTime** property, which includes the creation time for both keys. In the sample code below we get the **keyCreationTime** for both keys and test whether each value is null:

```azurepowershell
$rgName      = <resource-group>
$accountName = <storage-account>

# Get the keyCreationTime property of the storage account
$keyCreationTime = (Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName).keyCreationTime
# Display the value for both keys
$keyCreationTime
# Check both properties for null values
Write-Host 'keyCreationTime.key1 is null = ' ($keyCreationTime.key1 -eq $null)
Write-Host 'keyCreationTime.key2 is null = ' ($keyCreationTime.key2 -eq $null)

```

# [Azure CLI](#tab/azure-cli)

To return the creation time of the account access keys for a storage account with Azure CLI, call the [az storage account show](/cli/azure/storage/account#az-storage-account-show) command and query the **keyCreationTime**:

```azurecli
az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query keyCreationTime
```

---

You can also get the keyCreationTime for a storage account by calling the [Storage Accounts - Get Properties](/rest/api/storagerp/storage-accounts/get-properties) operation in the REST API.

## Next steps

- [Storage account overview](storage-account-overview.md)
- [Create a storage account](storage-account-create.md)
