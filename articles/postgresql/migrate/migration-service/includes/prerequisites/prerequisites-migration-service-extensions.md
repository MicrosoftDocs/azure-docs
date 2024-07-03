---
title: "Prerequisites for the migration service enable extensions in Azure Database for PostgreSQL"
description: Providing prerequisite information for enabling extensions for the migration service in Azure Database for PostgreSQL
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: postgresql
ms.topic: include
---

To ensure a successful migration with the migration service in Azure Database for PostgreSQL, you might need to verify extensions to your source PostgreSQL instance. Extensions provide additional functionality and features that might be required for your application. Make sure to verify the extensions on the source PostgreSQL instance before initiating the migration process. 

Enable supported extensions identified in the source PostgreSQL instance on the target Azure Database for PostgreSQL flexible server.

For more information about extensions, visit [Extensions in Azure Database for PostgreSQL](../../../../flexible-server/concepts-extensions.md#how-to-use-postgresql-extensions).

> [!NOTE]
> A restart is required when there are any changes to the `shared_preload_libraries` parameter.