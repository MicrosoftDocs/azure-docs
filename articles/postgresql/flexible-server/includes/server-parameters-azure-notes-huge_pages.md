---
title: huge_pages server parameter
description: huge_pages server parameter for Azure Database for PostgreSQL - Flexible Server.
author: AlicjaKucharczyk
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
ms.date: 05/15/2024
ms.author: alkuchar
zone_pivot_groups: postgresql-server-version
---
#### Description

Huge pages are a feature that allows for memory to be managed in larger blocks. You can typically manage blocks of up to 2 MB, as opposed to the standard 4-KB pages.

Using huge pages can offer performance advantages that effectively offload the CPU:

* They reduce the overhead associated with memory management tasks like fewer translation lookaside buffer (TLB) misses.
* They shorten the time needed for memory management.

Specifically, in PostgreSQL, you can use huge pages only for the shared memory area. A significant part of the shared memory area is allocated for shared buffers.

Another advantage is that huge pages prevent the swapping of the shared memory area out to disk, which further stabilizes performance.

#### Recommendations

* For servers that have significant memory resources, avoid disabling huge pages. Disabling huge pages could compromise performance.
* If you start with a smaller server that doesn't support huge pages but you anticipate scaling up to a server that does, keep the `huge_pages` setting at `TRY` for seamless transition and optimal performance.

#### Azure-specific notes
For servers with four or more vCores, huge pages are automatically allocated from the underlying operating system. The feature isn't available for servers with fewer than four vCores. The number of huge pages is automatically adjusted if any shared memory settings are changed, including alterations to `shared_buffers`.