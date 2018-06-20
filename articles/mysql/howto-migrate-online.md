---
title: Minimal-downtime migration to Azure Database for MySQL
description: This article describes how to perform a minimal-downtime migration of a MySQL database to Azure Database for MySQL by using the Azure Database Migration Service.
services: mysql
author: HJToland3
ms.author: jtoland
manager: kfile
editor: jasonwhowell
ms.service: mysql
ms.topic: article
ms.date: 06/21/2018
---

# Minimal-downtime migration to Azure Database for MySQL
You can perform MySQL migrations to Azure Database for MySQL with minimal downtime by using the newly introduced continuous sync capability for the [Azure Database Migration Service](https://aka.ms/get-dms) (DMS). This functionality limits the amount of downtime that is incurred by the application. DMS performs an initial load of your on-premises to Azure Database for MySQL, and afterward continuously syncs any new transactions to Azure while the application remains running.

When the data catches up on the target Azure side, you stop the application for a brief moment (minimum downtime), wait for the last batch of data (from the time you stop the application until the application is effectively unavailable to take any new traffic) to catch up in the target, and then simply update your connection string to point to Azure. When you are finished, your application will be live on Azure!

![Continuous sync with the Azure Database Migration Service](./media/howto-migrate-online/ContinuousSync.png)

DMS migration of MySQL sources is currently in preview. If you would like to try out the service to migrate your MySQL workloads, please sign up via the Azure DMS [preview page](https://aka.ms/dms-preview) to express your interest. We would really value your feedback to help us further improve the service.

## Next steps

- View the video [Easily migrate MySQL/PostgreSQL apps to Azure managed service](https://medius.studios.ms/Embed/Video/THR2201?sid=THR2201), which contains a demo showing how to migrate MySQL apps to Azure Database for MySQL.
- Sign up for limited preview of minimal-downtime migrations of MySQL to Azure Database for MySQL via the Azure DMS [preview page](https://aka.ms/dms-preview).


For more information about the Attunity Replicate for Microsoft Migrations offering, see the following resources:
 - Go to the [Attunity Replicate for Microsoft Migrations](https://aka.ms/attunity-replicate) webpage.
 - Download [Attunity Replicate for Microsoft Migrations](http://discover.attunity.com/download-replicate-microsoft-lp6657.html).
 - Go to the [Attunity Replicate Community](https://aka.ms/attunity-community) for a Quick Start Guide, tutorials, and support.
 - For step-by-step guidance on using Attunity Replicate to migrate your MySQL database to Azure Database for MySQL, see the [Database Migration Guide](https://datamigration.microsoft.com/scenario/mysql-to-azuremysql).