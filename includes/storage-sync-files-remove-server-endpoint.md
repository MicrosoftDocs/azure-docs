--- 
title: "include file"
description: "include file"
services: storage
author: roygara
ms.service: storage
ms.topic: include
ms.date: 05/31/2018
ms.author: rogarana
ms.custom: include file
---
No: removing a server endpoint isn't like rebooting a server! Removing and recreating the server endpoint is almost never an appropriate solution to fixing issues with sync, cloud tiering, or other aspects of Azure File Sync. Removing a server endpoint is a destructive operation. It may result in data loss in the case that tiered files exist outside of the server endpoint namespace. See [Why do tiered files exist outside of the server endpoint namespace](../articles/storage/files/storage-files-faq.md#afs-tiered-files-out-of-endpoint) for more information. Or it may result in inaccessible files for tiered files that exist within the server endpoint namespace. These issues won't resolve when the server endpoint is recreated. Tiered files may exist within your server endpoint namespace even if you never had cloud tiering enabled. That's why we recommend that you don't remove the server endpoint unless you would like to stop using Azure File Sync with this particular folder or have been explicitly instructed to do so by a Microsoft engineer. For more information on remove server endpoints, see [Remove a server endpoint](../articles/storage/file-sync/file-sync-server-endpoint.md#remove-a-server-endpoint).    
