---
title: Minimal-downtime migration to Azure Database for PostgreSQL - Single Server
description: This article describes how to perform a minimal-downtime migration of a PostgreSQL database to Azure Database for PostgreSQL - Single Server by using the Azure Database Migration Service.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 5/6/2019
---

# Minimal-downtime migration to Azure Database for PostgreSQL - Single Server
You can perform PostgreSQL migrations to Azure Database for PostgreSQL with minimal downtime by using the newly introduced **continuous sync capability** for the [Azure Database Migration Service](https://aka.ms/get-dms) (DMS). This functionality limits the amount of downtime that is incurred by the application.

## Overview
Azure DMS performs an initial load of your on-premises to Azure Database for PostgreSQL, and then continuously syncs any new transactions to Azure while the application remains running. After the data catches up on the target Azure side, you stop the application for a brief moment (minimum downtime), wait for the last batch of data (from the time you stop the application until the application is effectively unavailable to take any new traffic) to catch up in the target, and then update your connection string to point to Azure. When you are finished, your application will be live on Azure!

![Continuous sync with the Azure Database Migration Service](./media/howto-migrate-online/ContinuousSync.png)

## Next steps
- View the video [App Modernization with Microsoft Azure](https://medius.studios.ms/Embed/Video/BRK2102?sid=BRK2102), which contains a demo showing how to migrate PostgreSQL apps to Azure Database for PostgreSQL.
- See the tutorial [Migrate PostgreSQL to Azure Database for PostgreSQL online using DMS](https://docs.microsoft.com/azure/dms/tutorial-postgresql-azure-postgresql-online).
