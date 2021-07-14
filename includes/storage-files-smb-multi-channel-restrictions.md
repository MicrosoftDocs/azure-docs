---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 07/06/2021
 ms.author: rogarana
 ms.custom: include file
---
SMB Multichannel for Azure file shares currently has the following restrictions:
- Only supported for Windows clients. 
- Maximum number of channels is four, for details see [here](../articles/storage/files/storage-troubleshooting-files-performance.md#cause-4-number-of-smb-channels-exceeds-four).
- SMB Direct is not supported.
- Private endpoints for storage accounts are not supported.
