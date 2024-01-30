---
title: Minimal-downtime migration to Azure Database for PostgreSQL - Single Server
description: This article describes how to perform a minimal-downtime migration of a PostgreSQL database to Azure Database for PostgreSQL - Single Server by using the Azure Database Migration Service.
ms.service: postgresql
ms.subservice: migration-guide
ms.custom: ignite-2022
ms.topic: how-to
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 5/6/2019
---

# Minimal-downtime migration to Azure Database for PostgreSQL 

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

You can perform PostgreSQL migrations to Azure Database for PostgreSQL with minimal downtime by using the newly introduced **continuous sync capability** for the [Azure Database Migration Service](https://aka.ms/get-dms) (DMS). This functionality limits the amount of downtime that is incurred by the application.

## Overview
Azure DMS performs an initial load of your on-premises to Azure Database for PostgreSQL, and then continuously syncs any new transactions to Azure while the application remains running. After the data catches up on the target Azure side, you stop the application for a brief moment (minimum downtime), wait for the last batch of data (from the time you stop the application until the application is effectively unavailable to take any new traffic) to catch up in the target, and then update your connection string to point to Azure. When you are finished, your application will be live on Azure!

:::image type="content" source="./media/how-to-migrate-online/continuous-sync.png" alt-text="Continuous sync with the Azure Database Migration Service":::

## Next steps
- View the video [App Modernization with Microsoft Azure](https://medius.studios.ms/Embed/Video/BRK2102?sid=BRK2102), which contains a demo showing how to migrate PostgreSQL apps to Azure Database for PostgreSQL.
- See the tutorial [Migrate PostgreSQL to Azure Database for PostgreSQL online using DMS](../../dms/tutorial-postgresql-azure-postgresql-online.md).

