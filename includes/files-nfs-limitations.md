---
title: "include file"
description: "include file"
services: storage
author: roygara
ms.service: storage
ms.topic: "include"
ms.date: 09/15/2020
ms.author: rogarana
ms.custom: "include file"
---
While in preview, NFS has the following limitations:

- NFS 4.1 currently only supports the mandatory features from the [protocol specification](https://tools.ietf.org/html/rfc5661). Optional features such as delegations and callback of all kinds, lock upgrades and downgrades, and Kerberos authentication and encryption are not supported.
- If the majority of your requests are metadata-centric, then the latency will be worse when compared to read/write/update operations.
- Must create a new storage account in order to create an NFS share.
- Only the management plane REST APIs are supported. Data plane REST APIs are not available, which means that tools like Azure Storage Explorer will not work with NFS shares nor will you be able to browse NFS share data in the Azure portal.
- Only available for the premium tier.
- Currently only available with locally redundant storage (LRS).

### Azure Storage features not yet supported

Also, the following Azure Files features are not available with NFS shares:

- Identity-based authentication
- Azure Backup support
- Snapshots
- Soft delete
- Full encryption-in-transit support (for details see [NFS security](../articles/storage/files/storage-files-compare-protocols.md#security))
- Azure File Sync (only available for Windows clients, which NFS 4.1 does not support)
