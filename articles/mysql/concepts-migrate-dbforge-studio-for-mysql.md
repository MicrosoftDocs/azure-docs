---
title: Connect to Azure Database for MySQL using dbForge Studio for MySQL
description: The article demonstrates how to connect to Azure Database for MySQL Server via dbForge Studio for MySQL.
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: conceptual
ms.date: 03/03/2021
---

# Connect to Azure Database for MySQL using dbForge Studio for MySQL

To connect to Azure Database for MySQL using [dbForge Studio for MySQL](https://www.devart.com/dbforge/mysql/studio/):

1. On the Database menu, select New Connection.

2. Provide a host name and login credentials.

3. Select the Test Connection button to check the configuration.

:::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/azure-connection-1.png" alt-text="Azure Connection":::

## Migrate a database using the Backup and Restore functionality

The Studio allows migrating databases to Azure in many ways, the choice of which depends solely on your needs. If you need to move the entire database, it's best to use the Backup and Restore functionality. In this example, we migrate the *sakila* database that resides on MySQL server to Azure Database for MySQL. The logic behind the migration process using the Backup and Restore functionality of dbForge Studio for MySQL is to create a backup of the MySQL database and then restore it in Azure Database for MySQL.

### Back up the database

1. On the Database menu, point to Back up and Restore, and then select Backup Database. The Database Backup Wizard appears.

2. On the Backup content tab of the Database Backup Wizard, select database objects you want to back up.

3. On the Options tab, configure the backup process to fit your requirements.

    :::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/back-up-wizard-options.png" alt-text="Back up Wizard options":::

4. Next, specify errors processing behavior and logging options.

5. Select Backup.

### Restore the database

1. Connect to Azure for Database for MySQL as described above.

2. Right-click the Database Explorer body, point to Back up and Restore, and then select Restore Database.

3. In the Database Restore Wizard that opens, select a file with a database backup.

    :::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/restore-step-1.png" alt-text="Restore step":::

4. Select Restore.

5. Check the result.

## Migrate a database using the Copy Databases functionality

The Copy Databases functionality is similar to the Backup and Restore, except that with it you do not need two steps to migrate a database. And what is more, the feature allows transferring two or more databases in one go. The Copy Databases functionality is only available in the Enterprise edition of dbForge Studio for MySQL.
In this example, we migrate the *world_x* database from MySQL server to Azure Database for MySQL.
To migrate a database using the Copy Databases functionality:

1. On the Database menu, select Copy Databases. 

2. In the Copy Databases tab that appears, specify the source and target connection and select the database(s) to be migrated. We enter Azure MySQL connection and select the *world_x* database. Select the green arrow to initiate the process.

3. Check the result.

As a result of our database migration efforts, the *world_x* database has successfully appeared in Azure MySQL.

:::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/copy-databases-result.png" alt-text="Copy Databases result":::

## Migrate a database using Schema and Data Compare tools

dbForge Studio for MySQL incorporates a few tools that allow migrating MySQL databases, MySQL schemas and\or data to Azure. The choice of functionality depends on your needs and the requirements of your project. If you need to selectively move a database, that is, migrate certain MySQL tables to Azure, it's best to use Schema and Data Compare functionality.
In this example, we migrate the *world* database that resides on MySQL server to Azure Database for MySQL. The logic behind the migration process using Schema and Data Compare functionality of dbForge Studio for MySQL is to create an empty database in Azure Database for MySQL, synchronize it with the required MySQL database first using Schema Compare tool and then using Data Compare tool. This way MySQL schemas and data are accurately moved to Azure.

### Connect to Azure Database for MySQL and create an empty database

Connect to an Azure Database for MySQL and create an empty database.

### Step 2. Schema synchronization

1. On the Comparison menu, select New Schema Comparison.
The New Schema Comparison Wizard appears.

2. Select the Source and the Target, then specify the schema comparison options. Select Compare.

3. In the comparison results grid that appears, select objects for synchronization. Select the green arrow button to open the Schema Synchronization Wizard.

4. Walk through the steps of the wizard configuring synchronization. Select Synchronize to deploy the changes.

    :::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/schema-sync-wizard.png" alt-text="Schema sync wizard":::

### Data Comparison

1. On the Comparison menu, select New Data Comparison. The New Data Comparison Wizard appears.

2. Select the Source and the Target, then specify the data comparison options and change mappings if necessary. Select Compare.

3. In the comparison results grid that appears, select objects for synchronization. Select the green arrow button to open the Data Synchronization Wizard.

    :::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/data-comp-result.png" alt-text="Data comp result":::

4. Walk through the steps of the wizard configuring synchronization. Select Synchronize to deploy the changes.

5. Check the result.

    :::image type="content" source="media/concepts-migrate-dbforge-studio-for-mysql/data-sync-result.png" alt-text="Data sync result":::

## Summary

Nowadays more businesses move their databases to Azure Database for MySQL, as this database service is easy to set up, manage, and scale. That migration doesn't need to be painful. dbForge Studio for MySQL boasts immaculate migration tools that can significantly facilitate the process. The Studio allows database transfer to be easily configured, saved, edited, automated, and scheduled.

## Next steps
- [MySQL overview](overview.md)
