---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-storage
 ms.topic: include
 ms.date: 06/06/2023
 ms.author: kendownie
 ms.custom: include file
---
Currently, standard file shares with **large file shares** enabled (up to 100 TiB capacity) have certain limitations.

- Only locally redundant storage (LRS) and zone redundant storage (ZRS) accounts are supported.
- Once you enable **large file shares** on a storage account, you can't convert the storage account to use geo-redundant storage (GRS) or geo-zone-redundant storage (GZRS).
- Once you enable **large file shares**, you can't disable it.

If you want to use GRS or GZRS with standard SMB Azure file shares, see [Azure Files geo-redundancy for large file shares preview](../articles/storage/files/geo-redundant-storage-for-large-file-shares.md).