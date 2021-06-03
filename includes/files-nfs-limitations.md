---
title: "include file"
description: "include file"
services: storage
author: roygara
ms.service: storage
ms.topic: "include"
ms.date: 12/04/2020
ms.author: rogarana
ms.custom: "include file"
---
While in preview, NFS has the following limitations:

- NFS 4.1 currently only supports most features from the [protocol specification](https://tools.ietf.org/html/rfc5661). Some features such as delegations and callback of all kinds, lock upgrades and downgrades, Kerberos authentication, and encryption are not supported.
- If the majority of your requests are metadata-centric, then the latency will be worse when compared to read/write/update operations.
- NFS Shares can only be enabled/created on new storage account/s and not the existing ones
- Only the management plane REST APIs are supported. Data plane REST APIs are not available, which means that tools like Storage Explorer will not work with NFS shares nor will you be able to browse NFS share data in the Azure portal.
- AzCopy is not currently supported.
- Only available for the premium tier.
- NFS shares only accept numeric UID/GID. To avoid your clients sending alphanumeric UID/GID, you should disable ID mapping.
- Shares can only be mounted from one storage account on an individual VM, when using private links. Attempting to mount shares from other storage accounts will fail.
- It is best to rely on the permissions assigned to primary group. Sometimes, permissions allocated to the non-primary group of the user may result in access denied due to a known bug.

### Azure Storage features not yet supported

Also, the following Azure Files features are not available with NFS shares:

- Identity-based authentication
- Azure Backup support
- Snapshots
- Soft delete
- Full encryption-in-transit support (for details see [NFS security](../articles/storage/files/storage-files-compare-protocols.md#security))
- Azure File Sync (only available for Windows clients, which NFS 4.1 does not support)
