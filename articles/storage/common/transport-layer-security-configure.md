---
title: Configure Transport Layer Security (TLS)
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

# Configure Transport Layer Security (TLS) for a storage account



## Configure the minimum TLS version

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

## Check the minimum TLS version

# [Azure CLI](#tab/azure-cli)

To check the minimum TLS version for a storage account using Azure CLI, call the **az resource show** command and query for the **minimumTlsVersion** property:

```azurecli-interactive
az resource show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --resource-type Microsoft.Storage/storageAccounts \
    --query properties.minimumTlsVersion \
    --output tsv
```

# [Azure Resource Graph Explorer](#tab/graph-explorer)

To check the minimum TLS version across a set of storage accounts with optimal performance, you can use the Azure Resource Graph Explorer in the Azure portal. To learn more about using the Resource Graph Explorer, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](/azure/governance/resource-graph/first-query-portal).

Running the following query in the Resource Graph Explorer returns a list of storage accounts and displays the minimum TLS version for each account:

```msgraph-interactive
resources
| where type =~ 'Microsoft.Storage/storageAccounts'
| extend minimumTlsVersion = parse_json(properties).minimumTlsVersion
| project subscriptionId, resourceGroup, name, minimumTlsVersion
```

---

## Test the minimum TLS version from a client

When a client accesses a storage account using a TLS version that does not meet the minimum TLS version configured for the account, Azure Storage returns error code 400 error (Not Found) and a message indicating that the TLS version of the connection is not permitted on this storage account.

The following example assumes that the minimum TLS version for the storage account has been set to 1.2. When the PowerShell client is configured to use TLS 1.1, then calls to read and write data will fail.  

```powershell
# Set the TLS version used by the PowerShell client to TLS 1.1.
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls11;

# Attempt to create a new container.
$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context
New-AzStorageContainer -Name "sample-container" -Context $ctx
```

> [!NOTE]
> After you update the minimum TLS version for the storage account, it may take up to 30 seconds before the change is fully propagated.

## Next steps

