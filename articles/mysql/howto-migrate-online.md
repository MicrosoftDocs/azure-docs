---
title: Minimal-downtime migration - Azure Database for MySQL
description: This article describes how to perform a minimal-downtime migration of a MySQL database to Azure Database for MySQL.
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: how-to
ms.date: 10/30/2020
---

# Minimal-downtime migration to Azure Database for MySQL
[!INCLUDE[applies-to-single-flexible-server](includes/applies-to-single-flexible-server.md)]

You can perform MySQL migrations to Azure Database for MySQL with minimal downtime by using data-in replication. This functionality limits the amount of downtime that is incurred by the application.

You can also refer to [Database Migration Guide](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide) for detailed information and use cases about migrating databases to Azure Database for MySQL. This guide provides guidance that will lead the successful planning and execution of a MySQL migration to Azure.

## Overview
For minimal downtime migrations, data-in replication, which relies on binlog based replication can be leveraged. Data-in replication is preferred for minimal downtime migrations by hands-on experts looking for control over migration. See [data-in replication](concepts-data-in-replication.md) for details.

## Next steps
- For more information about migrating databases to Azure Database for MySQL, see the [Database Migration Guide](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide).
- View the video [Easily migrate MySQL/PostgreSQL apps to Azure managed service](https://medius.studios.ms/Embed/Video/THR2201?sid=THR2201), which contains a demo showing how to migrate MySQL apps to Azure Database for MySQL.
- See the tutorial [Migrate MySQL to Azure Database for MySQL offline using DMS](../dms/tutorial-mysql-azure-mysql-offline-portal.md).