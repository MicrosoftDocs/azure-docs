---
title: Configure minimum Transport Layer Security (TLS) version
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 06/12/2020
ms.author: tamram
ms.reviewer: fryu
ms.subservice: common
---

# Configure minimum Transport Layer Security (TLS) version



## Configure minimum TLS version for a storage account

To configure the minimum TLS version for a storage account using Azure CLI, first get the resource ID for your storage account by calling the [az resource show](/cli/azure/resource#az-resource-show) command. Next, call the [az resource update](/cli/azure/resource#az-resource-update) command to set the **minimumTlsVersion** property for the storage account. Valid values for **minimumTlsVersion** are `TLS1_0`, `TLS1_1` and `TLS1_2`.

The following example sets the minimum TLS version to 1.2. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
storage_account_id=$(az resource show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --resource-type Microsoft.Storage/storageAccounts \
    --query id \
    --output tsv)

az resource update \
    --ids $storage_account_id \
    --set properties.minimumTlsVersion="TLS1_2"
```

## Test the minimum TLS version

When a client accesses a storage account using a TLS version that does not meet the minimum TLS version configured for the account, Azure Storage returns error code 400 (Not Found).

???this isn't working for me???

```powershell
# Set the TLS version used by the PowerShell client to TLS 1.1.
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls11;

# Attempt to create a new container.
$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context
New-AzStorageContainer -Name "sample-container" -Context $ctx
```

## Next steps

