---
title: "include file"
description: "include file"
services: storage
author: roygara
ms.service: storage
ms.topic: "include"
ms.date: 06/04/2021
ms.author: rogarana
ms.custom: "include file"
---
While in preview, NFS has the following limitations:

- AzCopy is not currently supported.
- Only available for the premium tier.
- NFS shares only accept numeric UID/GID. To avoid your clients sending alphanumeric UID/GID, you should disable ID mapping.

### Azure Files features not yet supported

Also, the following Azure Files features are not available with NFS shares:

- Identity-based authentication
- Azure Backup support
- Snapshots
- Soft delete
- Full encryption-in-transit support (for details see [NFS security](../articles/storage/files/files-nfs-protocol.md#security))
- Azure File Sync (only available for Windows clients, which NFS 4.1 does not support)
