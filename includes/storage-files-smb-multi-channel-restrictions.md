---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 07/14/2021
 ms.author: rogarana
 ms.custom: include file
---
SMB Multichannel for Azure file shares currently has the following restrictions:
- Only supported on [Windows](../articles/storage/files/storage-how-to-use-files-windows.md) and [Linux](../articles/storage/files/storage-how-to-use-files-linux.md) clients that are using SMB 3.1.1
- Maximum number of channels is four, for details see [here](../articles/storage/files/storage-troubleshooting-files-performance.md#cause-4-number-of-smb-channels-exceeds-four).
- SMB Direct is not supported.
- Private endpoints for storage accounts are not supported.