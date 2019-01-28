---
title: Optimize query time in Azure Database for PostgreSQL server by using toast table storage strategy
description: This article describes how to optimize query time with toast table storage strategy in an Azure Database for PostgreSQL server.
author: dianaputnam
ms.author: dianas
ms.service: postgresql
ms.topic: conceptual
ms.date: 10/22/2018
---

# Optimize query time with TOAST table storage strategy 
This article describes how to optimize query times with TOAST table storage strategy.

## TOAST table storage strategies
There are four different strategies to store toast-able columns on disk. They represent various combinations between compression and out-of-line storage. The strategy can be set at the level of data type and at the column level.
- **Plain** prevents either compression or out-of-line storage. It disables use of single-byte headers for varlena types. Plain is the only possible strategy for columns of non-toast-able data types.
- **Extended** allows both compression and out-of-line storage. Extended is the default for most toast-able data types. Compression is attempted first, then out-of-line storage is attempted if the row is still too large.
- **External** allows out-of-line storage but not compression. Use of External makes substring operations on wide text and bytea columns faster, at the penalty of increased storage space, because these operations are optimized to fetch only the required parts of the out-of-line value when it's not compressed.
- **Main** allows compression but not out-of-line storage. Out-of-line storage is still performed for such columns, but only as a last resort when there's no other way to make the row small enough to fit on a page.

## Use TOAST table storage strategies
If your queries access toast-able data types, consider using Main instead of the default Extended option to reduce query times. Main doesn't preclude out-of-line storage. On the other hand, if your queries don't access toast-able data types, it might be beneficial to keep the Extended option. So a larger portion of the rows of the main table will fit in the shared buffer cache, helping performance.

If you have a workload using a schema with wide tables and high character counts, consider using PostgreSQL TOAST tables. An example customer table had greater than 350  columns with several columns spanning 255 characters. Their benchmark query time reduced from 4203 seconds to 467 seconds, an 89 percent improvement, after converting the TOAST strategy of Main.

## Next steps
Review your workload for the previous characteristics. 

Review the following PostgreSQL documentation: 
- [Chapter 68, Database physical storage](https://www.postgresql.org/docs/current/storage-toast.html) 