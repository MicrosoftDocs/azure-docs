---
title: "include file"
description: "include file"
services: storage
author: roygara
ms.service: storage
ms.topic: "include"
ms.date: 08/27/2020
ms.author: rogarana
ms.custom: "include file"
---
- If the majority of your requests are metadata centric, then the latency will be worse when compared to open/close operations.
- Encryption-in-transit is not currently available
- Must create a new storage account in order to create an NFS share.
- Does not currently support storage explorer, Data Box, or AzCopy.
- Only available for Linux clients.

Also, the following Azure Files features are not available with NFS shares:

- Azure File Sync
- Identity-based authentication
- Azure Backup support
- Snapshots
- Soft delete