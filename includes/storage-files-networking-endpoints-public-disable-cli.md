---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-storage
 ms.topic: include
 ms.date: 6/2/2020
 ms.author: kendownie
 ms.custom: include file
---
The following CLI command will deny all traffic to the storage account's public endpoint. Note that this command has the `-bypass` parameter set to `AzureServices`. This will allow trusted first party services such as Azure File Sync to access the storage account via the public endpoint.

```azurecli
# This assumes $storageAccountResourceGroupName and $storageAccountName 
# are still defined from the beginning of this guide.
az storage account update \
    --resource-group $storageAccountResourceGroupName \
    --name $storageAccountName \
    --bypass "AzureServices" \
    --default-action "Deny" \
    --output none
```