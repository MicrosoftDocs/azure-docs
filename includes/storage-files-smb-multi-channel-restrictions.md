---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 09/16/2020
 ms.author: rogarana
 ms.custom: include file
---
SMB Multichannel for Azure file shares currently has the following restrictions:
- Can only be used with FileStorage accounts and premium SMB file shares.
- Can only use locally redundant storage as the redundancy option.
- Maximum number of channels is four.
- SMB Direct over RDMA is not supported.
- [List Handles API](https://docs.microsoft.com/rest/api/storageservices/list-handles) is not supported.
- Only supported for Windows clients.