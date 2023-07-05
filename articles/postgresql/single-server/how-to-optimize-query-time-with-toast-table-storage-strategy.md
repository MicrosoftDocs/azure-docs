---
title: Optimize query time by using the TOAST table storage strategy in Azure Database for PostgreSQL - Single Server
description: This article describes how to optimize query time with the TOAST table storage strategy on an Azure Database for PostgreSQL - Single Server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: how-to
ms.author: dianas
author: dianaputnam
ms.date: 06/24/2022
---

# Optimize query time with the TOAST table storage strategy

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This article describes how to optimize query times with the oversized-attribute storage technique (TOAST) table storage strategy.

## TOAST table storage strategies

Four different strategies are used to store columns on disk that can use TOAST. They represent various combinations between compression and out-of-line storage. The strategy can be set at the level of data type and at the column level.
- **Plain** prevents either compression or out-of-line storage. It disables the use of single-byte headers for varlena types. Plain is the only possible strategy for columns of data types that can't use TOAST.
- **Extended** allows both compression and out-of-line storage. Extended is the default for most data types that can use TOAST. Compression is attempted first. Out-of-line storage is attempted if the row is still too large.
- **External** allows out-of-line storage but not compression. Use of External makes substring operations on wide text and bytea columns faster. This speed comes with the penalty of increased storage space. These operations are optimized to fetch only the required parts of the out-of-line value when it's not compressed.
- **Main** allows compression but not out-of-line storage. Out-of-line storage is still performed for such columns, but only as a last resort. It occurs when there's no other way to make the row small enough to fit on a page.

## Use TOAST table storage strategies

If your queries access data types that can use TOAST, consider using the Main strategy instead of the default Extended option to reduce query times. Main doesn't rule out out-of-line storage. If your queries don't access data types that can use TOAST, it might be beneficial to keep the Extended option. A larger portion of the rows of the main table fit in the shared buffer cache, which helps performance.

If you have a workload that uses a schema with wide tables and high character counts, consider using PostgreSQL TOAST tables. An example customer table had greater than 350 columns with several columns that spanned 255 characters. After it was converted to the TOAST table Main strategy, their benchmark query time reduced from 4203 seconds to 467 seconds. That's an 89 percent improvement.

## Next steps

Review your workload for the previous characteristics.

Review the following PostgreSQL documentation: 
- [Chapter 68, Database physical storage](https://www.postgresql.org/docs/current/storage-toast.html) 
