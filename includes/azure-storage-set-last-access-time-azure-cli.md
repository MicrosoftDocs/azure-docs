---
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 05/02/2024
 ms.author: normesta
---

To enable last access time tracking with Azure CLI, call the [az storage account blob-service-properties update](/cli/azure/storage/account/blob-service-properties#az-storage-account-blob-service-properties-update) command, as shown in the following example. Remember to replace placeholder values in angle brackets with your own values:

```azurecli
az storage account blob-service-properties update \
    --resource-group <resource-group> \
    --account-name <storage-account> \
    --enable-last-access-tracking true
```