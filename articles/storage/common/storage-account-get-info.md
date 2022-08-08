---
title: Get storage account configuration information
titleSuffix: Azure Storage
description: Use the Azure portal, PowerShell, or Azure CLI to retrieve storage account configuration properties, including the Azure Resource Manager resource ID, account location, account type, or replication SKU.
services: storage
author: jimmart-dev

ms.author: jammart
ms.date: 05/26/2022
ms.service: storage
ms.subservice: common
ms.topic: how-to
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

[!INCLUDE [storage-account-key-note-include](../../../includes/storage-account-key-note-include.md)]

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

## Next steps

- [Storage account overview](storage-account-overview.md)
- [Create a storage account](storage-account-create.md)
