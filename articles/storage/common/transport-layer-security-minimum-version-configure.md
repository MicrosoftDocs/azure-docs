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

To configure the minimum TLS version for a storage account using Azure CLI, first get the resource ID for your storage account by calling the [az resource show]() command. Next, call the [az resource update]() command to set the minimum TLS version for the storage account.

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



## Next steps

