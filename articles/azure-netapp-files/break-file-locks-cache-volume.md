---
title: Break file locks for an Azure NetApp Files cache volume 
description: This article explains how to break file locks in an Azure NetApp Files cache volume.
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 04/10/2026
ms.author: anfdocs

---

# Break file locks for a cache volume

1. Run the following command to break file locks for a cache volume:

    ```
    POST .../caches/{cacheName}/poolChange?api-version=2026-01-01
    curl -sS -X POST \
    "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool1/caches/cache1/poolChange?api-version=2026-01-01" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "newPoolResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.NetApp/netAppAccounts/account1/capacityPools/pool2"
    }'

    ```

## Next steps

* [NFS FAQs for Azure NetApp Files](faq-nfs.md)
* [SMB FAQs for Azure NetApp Files](faq-smb.md)
