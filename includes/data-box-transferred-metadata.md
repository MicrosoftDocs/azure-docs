---
author: sipastak
ms.service: databox  
ms.topic: include
ms.date: 11/18/2022
ms.author: sipastak
---

## Timestamps

The following timestamps are transferred:
- CreationTime
- LastWriteTime

The following timestamp isn't transferred:
- LastAccessTime

## File attributes

File attributes on both files and directories are transferred unless otherwise noted.

The following file attributes are transferred:
- FILE_ATTRIBUTE_READONLY (file only)
- FILE_ATTRIBUTE_HIDDEN
- FILE_ATTRIBUTE_SYSTEM
- FILE_ATTRIBUTE_DIRECTORY (directory only)
- FILE_ATTRIBUTE_ARCHIVE
- FILE_ATTRIBUTE_TEMPORARY (file only)
- FILE_ATTRIBUTE_NO_SCRUB_DATA

The following file attributes aren't transferred:
- FILE_ATTRIBUTE_OFFLINE
- FILE_ATTRIBUTE_NOT_CONTENT_INDEXED
  
Read-only attributes on directories aren't transferred.

## Alternate data streams and extended attributes

[Alternate data streams](/openspecs/windows_protocols/ms-fscc/e2b19412-a925-4360-b009-86e3b8a020c8) and extended attributes are not supported in Azure Files, page blob, or block blob storage, so they are not transferred when copying data. 