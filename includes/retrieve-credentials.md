---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: azure-storage
ms.topic: include
ms.date: 02/25/2022
ms.author: alexwolf
ms.custom: include file
---

### [Azure portal](#tab/roles-azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Locate your storage account.
1. In the storage account menu pane, under **Security + networking**, select **Access keys**. Here, you can view the account access keys and the complete connection string for each key. 
1. In the **Access keys** pane, select **Show keys**.
1. In the **key1** section, locate the **Connection string** value. Select the **Copy to clipboard** icon to copy the connection string. You'll add the connection string value to an environment variable in the next section.

    ![Screenshot showing how to copy a connection string from the Azure portal.](../articles/storage/blobs/media/storage-quickstart-blobs-dotnet/portal-connection-string.png)

### [Azure CLI](#tab/roles-azure-cli)

You can see the connection string for your storage account using the [az storage account show-connection-string](/cli/azure/storage/account) command.

```azurecli
az storage account show-connection-string --name "<your-storage-account-name>"
```

### [PowerShell](#tab/roles-powershell)

You can assemble a connection string with PowerShell using the [Get-AzStorageAccount](/powershell/module/az.storage/Get-azStorageAccount) and [Get-AzStorageAccountKey](/powershell/module/az.Storage/Get-azStorageAccountKey) commands.

```powershell
$saName = "yourStorageAccountName"
$rgName = "yourResourceGroupName"
$sa = Get-AzStorageAccount -StorageAccountName $saName -ResourceGroupName $rgName

$saKey = (Get-AzStorageAccountKey -ResourceGroupName $rgName -Name $saName)[0].Value

'DefaultEndpointsProtocol=https;AccountName=' + $saName + ';AccountKey=' + $saKey + ';EndpointSuffix=core.windows.net'
```