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

In case you encounter (stale) file locks on NFS, SMB, or dual-protocol cache volumes that need to be cleared, Azure NetApp Files allows you to break these locks.

## Break file locks for all files in a cache volume or for a specific client

You can break file locks for all files in a cache volume or break all file locks initiated by a specified client. 

>[!NOTE]
>Breaking file locks may be disruptive.

To break file locks for a specific client connected to a cache volume, use the POST call with clientIp set to the client IP address. To break file locks for all clients connected to a volume, issue the POST call with empty body. 

```
POST
https:///management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}/breakFileLocks?api-version=2026-01-01"

Body:
{ "clientIp": "xx.xx.xx.xx" }

```

## Next steps

* [NFS FAQs for Azure NetApp Files](faq-nfs.md)
* [SMB FAQs for Azure NetApp Files](faq-smb.md)
