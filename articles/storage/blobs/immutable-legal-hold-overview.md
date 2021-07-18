---
title: Legal holds for immutable blob data 
titleSuffix: Azure Storage
description: Azure Storage offers WORM (Write Once, Read Many) support for Blob (object) storage that enables users to store data in a non-erasable, non-modifiable state for a specified interval. Learn how to create legal holds on blob data.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 07/17/2021
ms.author: tamram
ms.subservice: blobs
---

# Legal holds for immutable blob data

You can configure a legal retention policy to store data in a Write-Once, Read-Many (WORM) format for a specified interval. When a time-based retention policy is set, blobs can be created and read, but not modified or deleted. After the retention interval has expired, blobs can be deleted but not overwritten.

For more information about immutability policies for Blob Storage, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).


## Next steps

- [Store business-critical blob data with immutable storage](immutable-storage-overview.md)
- [Time-based retention policies for immutable blob data](immutable-time-based-retention-policy-overview.md)
- [Data protection overview](data-protection-overview.md)