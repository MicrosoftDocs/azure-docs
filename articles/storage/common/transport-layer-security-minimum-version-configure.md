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



## Configure the minimum TLS version for a storage account

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

To check the minimum TLS version for a storage account, call the **az resource show** command and query for the **minimumTlsVersion** property:

```azurecli-interactive
az resource show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --resource-type Microsoft.Storage/storageAccounts \
    --query properties.minimumTlsVersion \
    --output tsv
```

## Test the minimum TLS version

When a client accesses a storage account using a TLS version that does not meet the minimum TLS version configured for the account, Azure Storage returns error code 400 (Not Found). The error message is **TlsVersionNotPermitted**.

???this isn't working for me - container is created just fine???

```powershell
# Set the TLS version used by the PowerShell client to TLS 1.1.
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls11;

# Attempt to create a new container.
$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context
New-AzStorageContainer -Name "sample-container" -Context $ctx
```

## Check the minimum TLS version for a set of storage accounts

???Do we want to show both ways to do this?

### Check the minimum TLS version for a set of storage accounts with Azure CLI

???I am not seeing min TLS version returned via listing operation, even where it is set - not available in API yet???

```azurecli-interactive
az storage account list --resource-group <resource-group>
az storage account list --resource-group <resource-group> --query properties.minimumTlsVersion --output tsv
```

### Use Azure Resource Graph Explorer to check the minimum TLS version for a set of accounts

To check the minimum TLS version across a set of storage accounts with optimal performance, you can use the Azure Resource Graph Explorer in the Azure portal. To learn more about using the Resource Graph Explorer, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](/azure/governance/resource-graph/first-query-portal).

Running the following query in the Resource Graph Explorer returns a list of storage accounts and displays the minimum TLS version for each account: 

```msgraph-interactive
resources
| where type =~ 'Microsoft.Storage/storageAccounts'
| extend minimumTlsVersion = parse_json(properties).minimumTlsVersion
| project subscriptionId, resourceGroup, name, minimumTlsVersion
```

## Next steps

