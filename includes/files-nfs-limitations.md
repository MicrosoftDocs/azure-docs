---
title: "include file"
description: "include file"
services: storage
author: roygara
ms.service: storage
ms.topic: "include"
ms.date: 09/09/2020
ms.author: rogarana
ms.custom: "include file"
---
While in preview, NFS has the following limitations:

- NFS 4.1 currently only supports the mandatory features from the [protocol specification](https://tools.ietf.org/html/rfc5661). Optional features such as  delegations and callback of all kinds, lock upgrades and downgrades, and Kerberos authentication and encryption are not supported.
- If the majority of your requests are metadata centric, then the latency will be worse when compared to open/close operations.
- Must create a new storage account in order to create an NFS share.
- Does not currently support storage explorer, Data Box, or AzCopy.
- Only available for Linux clients.
- Only available for the premium tier.

### Azure Storage features not yet supported

Also, the following Azure Files features are not available with NFS shares:

- Azure File Sync
- Identity-based authentication
- Azure Backup support
- Snapshots
- Soft delete
- Full encryption-in-transit (for details see [NFS security](../articles/storage/files/storage-files-compare-protocols.md#security))