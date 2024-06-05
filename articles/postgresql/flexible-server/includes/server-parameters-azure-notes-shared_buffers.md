---
title: shared_buffers server parameter
description: shared_buffers server parameter for Azure Database for PostgreSQL - Flexible Server.
author: AlicjaKucharczyk
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
ms.date: 05/15/2024
ms.author: alkuchar
zone_pivot_groups: postgresql-server-version
---
#### Description

The `shared_buffers` configuration parameter determines the amount of system memory allocated to the PostgreSQL database for buffering data. It serves as a centralized memory pool that's accessible to all database processes.

When data is needed, the database process first checks the shared buffer. If the required data is present, it's quickly retrieved and bypasses a more time-consuming disk read. By serving as an intermediary between the database processes and the disk, `shared_buffers` effectively reduces the number of required I/O operations.

#### Azure-specific notes
The `shared_buffers` setting scales linearly (approximately) as vCores increase in a tier.