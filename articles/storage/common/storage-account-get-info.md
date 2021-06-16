---
title: Get storage account configuration information
titleSuffix: Azure Storage
description: Learn how to get Azure Storage account type and SKU name using the .NET client library.
services: storage
author: normesta

ms.author: normesta
ms.date: 06/16/2021
ms.service: storage
ms.subservice: common
ms.topic: how-to
ms.custom: devx-track-csharp
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

To return the Azure Resource Manager resource ID for a storage account with PowerShell, make sure you have installed the [Az module](https://www.powershellgallery.com/packages/Az/). Next, call the [Get-AzResource](/powershell/module/az.resources/get-azresource) command and specify the `-ResourceType` parameter to return the storage account resource, as shown in the following example:

```azurepowershell
$resource = Get-AzResource -Name storagesamples -ResourceType Microsoft.Storage/storageaccounts
$resource.ResourceId
```

# [Azure CLI](#tab/azure-cli)

To return the Azure Resource Manager resource ID for a storage account with Azure CLI, call the [az resource show](/cli/azure/resource#az_resource_show) command and specify the `--resource-type` parameter to return the storage account resource, as shown in the following example:

```azurecli
az resource show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --resource-type "Microsoft.Storage/storageaccounts" \
    --query id \
    --output tsv
```

---

For more information about types of resources managed by Azure Resource Manager, see [Resource providers and resource types](../../azure-resource-manager/management/resource-providers-and-types.md).

## About account type and SKU name

**Account type**: Valid account types include `BlobStorage`, `BlockBlobStorage`, `FileStorage`, `Storage`, and `StorageV2`. [Azure storage account overview](storage-account-overview.md) has more information, including descriptions of the various storage accounts.

**SKU name**: Valid SKU names include `Premium_LRS`, `Premium_ZRS`, `Standard_GRS`, `Standard_GZRS`, `Standard_LRS`, `Standard_RAGRS`, `Standard_RAGZRS`, and `Standard_ZRS`. SKU names are case-sensitive and are string fields in the [SkuName Class](/dotnet/api/microsoft.azure.management.storage.models.skuname).

## Retrieve account information

The following code example retrieves and displays the read-only account properties.


## Next steps

Learn about other operations you can perform on a storage account through the [Azure portal](https://portal.azure.com) and the Azure REST API.

- [Get Account Information operation (REST)](/rest/api/storageservices/get-account-information)
