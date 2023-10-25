---
title: Use dbForge Studio for MySQL to migrate a MySQL database to Azure Database for MySQL
description: The article demonstrates how to migrate to Azure Database for MySQL by using dbForge Studio for MySQL.
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: aditivgupta
ms.author: adig
ms.date: 06/20/2022
---

# Migrate data to Azure Database for MySQL with dbForge Studio for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Looking to move your MySQL databases to Azure Database for MySQL? Consider using the migration tools in dbForge Studio for MySQL. With it, database transfer can be configured, saved, edited, automated, and scheduled.

To complete the examples in this article, you'll need to download and install [dbForge Studio for MySQL](https://www.devart.com/dbforge/mysql/studio/).

## Connect to Azure Database for MySQL

1. In dbForge Studio for MySQL, select **New Connection** from the **Database** menu.

1. Provide a host name and sign-in credentials.

1. Select **Test Connection** to check the configuration.

:::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/azure-connection-1.png" alt-text="Screenshot showing a successful connection test to Azure Database for MySQL." lightbox="media/concepts-migrate-dbforge-studio-for-mysql/azure-connection-1.png":::

## Migrate with the Backup and Restore functionality

You can choose from many options when using dbForge Studio for MySQL to migrate databases to Azure. If you need to move the entire database, it's best to use the **Backup and Restore** functionality.

In this example, we migrate the *sakila* database from MySQL server to Azure Database for MySQL. The logic behind using the **Backup and Restore** functionality is to create a backup of the MySQL database and then restore it in Azure Database for MySQL.

### Back up the database

1. In dbForge Studio for MySQL, select **Backup Database** from the **Backup and Restore** menu. The **Database Backup Wizard** appears.

1. On the **Backup content** tab of the **Database Backup Wizard**, select database objects you want to back up.

1. On the **Options** tab, configure the backup process to fit your requirements.

    :::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/back-up-wizard-options.png" alt-text="Screenshot showing the options pane of the Backup wizard." lightbox="media/concepts-migrate-dbforge-studio-for-mysql/back-up-wizard-options.png":::

1. Select **Next**, and then specify error processing behavior and logging options.

1. Select **Backup**.

### Restore the database

1.  In dbForge Studio for MySQL, connect to Azure Database for MySQL. [Refer to the instructions](#connect-to-azure-database-for-mysql).

1. Select **Restore Database** from the **Backup and Restore** menu. The **Database Restore Wizard** appears.

1. In the **Database Restore Wizard**, select a file with a database backup.

    :::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/restore-step-1.png" alt-text="Screenshot showing the Restore step of the Database Restore wizard." lightbox="media/concepts-migrate-dbforge-studio-for-mysql/restore-step-1.png":::

1. Select **Restore**.

1. Check the result.

## Migrate with the Copy Databases functionality

The **Copy Databases** functionality in dbForge Studio for MySQL is similar to  **Backup and Restore**, except that it doesn't require two steps to migrate a database. It also lets you transfer two or more databases at once.

>[!NOTE]
> The **Copy Databases** functionality is only available in the Enterprise edition of dbForge Studio for MySQL.

In this example, we migrate the *world_x* database from MySQL server to Azure Database for MySQL.

To migrate a database using the Copy Databases functionality:

1. In dbForge Studio for MySQL, select **Copy Databases** from the **Database** menu. 

1. On the **Copy Databases** tab, specify the source and target connection. Also select the databases to be migrated. 

   We enter the Azure MySQL connection and select the *world_x* database. Select the green arrow to start the process.

1. Check the result.

You'll see that the *world_x* database has successfully appeared in Azure MySQL.

:::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/copy-databases-result.png" alt-text="Screenshot showing the results of the Copy Databases function." lightbox="media/concepts-migrate-dbforge-studio-for-mysql/copy-databases-result.png":::

## Migrate a database with schema and data comparison

You can choose from many options when using dbForge Studio for MySQL to migrate databases, schemas, and/or data to Azure. If you need to move selective tables from a MySQL database to Azure, it's best to use the **Schema Comparison** and the **Data Comparison** functionality.

In this example, we migrate the *world* database from MySQL server to Azure Database for MySQL. 

The logic behind using the **Backup and Restore** functionality is to create a backup of the MySQL database and then restore it in Azure Database for MySQL.

The logic behind this approach is to create an empty database in Azure Database for MySQL and synchronize it with the source MySQL database. We first use the **Schema Comparison** tool, and next we use the **Data Comparison** functionality. These steps ensure that the MySQL schemas and data are accurately moved to Azure.

To complete this exercise, you'll first need to [connect to Azure Database for MySQL](#connect-to-azure-database-for-mysql) and create an empty database.

### Schema synchronization

1. On the **Comparison** menu, select **New Schema Comparison**. The **New Schema Comparison Wizard** appears.

1. Choose your source and target, and then specify the schema comparison options. Select **Compare**.

1. In the comparison results grid that appears, select objects for synchronization. Select the green arrow button to open the **Schema Synchronization Wizard**.

1. Walk through the steps of the wizard to configure synchronization. Select **Synchronize** to deploy the changes.

    :::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/schema-sync-wizard.png" alt-text="Screenshot showing the schema synchronization wizard." lightbox="media/concepts-migrate-dbforge-studio-for-mysql/schema-sync-wizard.png":::

### Data Comparison

1. On the **Comparison** menu, select **New Data Comparison**. The **New Data Comparison Wizard** appears.

1. Choose your source and target, and then specify the data comparison options. Change mappings if necessary, and then select **Compare**.

1. In the comparison results grid that appears, select objects for synchronization. Select the green arrow button to open the **Data Synchronization Wizard**.

    :::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/data-comp-result.png" alt-text="Screenshot showing the results of the data comparison." lightbox="media/concepts-migrate-dbforge-studio-for-mysql/data-comp-result.png":::

1. Walk through the steps of the wizard configuring synchronization. Select **Synchronize** to deploy the changes.

1. Check the result.

    :::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/data-sync-result.png" alt-text="Screenshot showing the results of the Data Synchronization wizard." lightbox="media/concepts-migrate-dbforge-studio-for-mysql/data-sync-result.png":::

## Next steps
- [MySQL overview](overview.md)
