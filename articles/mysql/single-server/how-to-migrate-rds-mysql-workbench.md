---
title: Migrate Amazon RDS for MySQL to Azure Database for MySQL using MySQL Workbench
description: This article describes how to migrate Amazon RDS for MySQL to Azure Database for MySQL by using the MySQL Workbench Migration Wizard.
author: SudheeshGH
ms.author: sunaray
ms.service: mysql
ms.subservice: single-server
ms.topic: how-to
ms.date: 06/20/2022
---

# Migrate Amazon RDS for MySQL to Azure Database for MySQL using MySQL Workbench

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

You can use various utilities, such as MySQL Workbench Export/Import, Azure Database Migration Service (DMS), and MySQL dump and restore, to migrate Amazon RDS for MySQL to Azure Database for MySQL. However, using the MySQL Workbench Migration Wizard provides an easy and convenient way to move your Amazon RDS for MySQL databases to Azure Database for MySQL.

With the Migration Wizard, you can conveniently select which schemas and objects to migrate. It also allows you to view server logs to identify errors and bottlenecks in real time. As a result, you can edit and modify tables or database structures and objects during the migration process when an error is detected, and then resume migration without having to restart from scratch.

> [!NOTE]
> You can also use the Migration Wizard to migrate other sources, such as Microsoft SQL Server, Oracle, PostgreSQL, MariaDB, etc., which are outside the scope of this article.

## Prerequisites

Before you start the migration process, it's recommended that you ensure that several parameters and features are configured and set up properly, as described below.

- Make sure the Character set of the source and target databases are the same.
- Set the wait timeout to a reasonable time depending on the amount data or workload you want to import or migrate.
- Set the `max_allowed_packet parameter` to a reasonable amount depending on the size of the database you want to import or migrate.
- Verify that all of your tables use InnoDB, as Azure Database for MySQL Server only supports the InnoDB Storage engine.
- Remove, replace, or modify all triggers, stored procedures, and other functions containing root user or super user definers (Azure Database for MySQL doesn’t support the Super user privilege). To replace the definers with the name of the admin user that is running the import process, run the following command:

  ```
  DELIMITER; ;/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`127.0.0.1`*/ /*!50003
  DELIMITER;
  /* Modified to */
  DELIMITER;
  /*!50003 CREATE*//*!50017 DEFINER=`AdminUserName`@`ServerName`*/ /*!50003
  DELIMITER;

  ```

- If User Defined Functions (UDFs) are running on your database server, you need to delete the privilege for the mysql database. To determine if any UDFs are running on your server, use the following query:

  ```
  SELECT * FROM mysql.func;
  ```

  If you discover that UDFs are running, you can drop the UDFs by using the following query:

  ```
  DROP FUNCTION your_UDFunction;
  ```

- Make sure that the server on which the tool is running, and ultimately the export location, has ample disk space and compute power (vCores, CPU, and Memory) to perform the export operation, especially when exporting a very large database.
- Create a path between the on-premises or AWS instance and Azure Database for MySQL if the workload is behind firewalls or other network security layers.

## Begin the migration process

1. To start the migration process, sign in to MySQL Workbench, and then select the home icon.
2. In the left-hand navigation bar, select the Migration Wizard icon, as shown in the screenshot below.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/begin-the-migration.png" alt-text="MySQL Workbench start screen":::

   The **Overview** page of the Migration Wizard is displayed, as shown below.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/migration-wizard-welcome.png" alt-text="MySQL Workbench Migration Wizard welcome page":::

3. Determine if you have an ODBC driver for MySQL Server installed by selecting **Open ODBC Administrator**.

   In our case, on the **Drivers** tab, you’ll notice that there are already two MySQL Server ODBC drivers installed.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/obdc-administrator-page.png" alt-text="ODBC Data Source Administrator page":::

   If a MySQL ODBC driver isn't installed, use the MySQL Installer you used to install MySQL Workbench to install the driver. For more information about MySQL ODBC driver installation, see the following resources:

   - [MySQL :: MySQL Connector/ODBC Developer Guide :: 4.1 Installing Connector/ODBC on Windows](https://dev.mysql.com/doc/connector-odbc/en/connector-odbc-installation-binary-windows.html)
   - [ODBC Driver for MySQL: How to Install and Set up Connection (Step-by-step) – {coding}Sight (codingsight.com)](https://codingsight.com/install-and-configure-odbc-drivers-for-mysql/)

4. Close the **ODBC Data Source Administrator** dialog box, and then continue with the migration process.

## Configure source database server connection parameters

1. On the **Overview** page, select **Start Migration**.

   The **Source Selection** page appears. Use this page to provide information about the RDBMS you're migrating from and the parameters for the connection.

2. In the **Database System** field, select **MySQL**.
3. In the **Stored Connection** field, select one of the saved connection settings for that RDBMS.

   You can save connections by marking the checkbox at the bottom of the page and providing a name of your preference.

4. In the **Connection Method** field, select **Standard TCP/IP**.
5. In the **Hostname** field, specify the name of your source database server.
6. In the **Port** field, specify **3306**, and then enter the username and password for connecting to the server.
7. In the **Database** field, enter the name of the database you want to migrate if you know it; otherwise leave this field blank.
8. Select **Test Connection** to check the connection to your MySQL Server instance.

   If you’ve entered the correct parameters, a message appears indicating a successful connection attempt.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/source-connection-parameters.png" alt-text="Source database connection parameters page":::

9. Select **Next**.

## Configure target database server connection parameters

1. On the **Target Selection** page, set the parameters to connect to your target MySQL Server instance using a process similar to that for setting up the connection to the source server.
2. To verify a successful connection, select **Test Connection**.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/target-connection-parameters.png" alt-text="Target database connection parameters page":::

3. Select **Next**.

## Select the schemas to migrate

The Migration Wizard will communicate to your MySQL Server instance and fetch a list of schemas from the source server.

1. Select **Show logs** to view this operation.

   The screenshot below shows how the schemas are being retrieved from the source database server.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/retrieve-schemas.png" alt-text="Fetch schemas list page":::

2. Select **Next** to verify that all the schemas were successfully fetched.

   The screenshot below shows the list of fetched schemas.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/schemas-selection.png" alt-text="Schemas selection page":::

   You can only migrate schemas that appear in this list.

3. Select the schemas that you want to migrate, and then select **Next**.

## Object migration

Next, specify the object(s) that you want to migrate.

1. Select **Show Selection**, and then, under **Available Objects**, select and add the objects that you want to migrate.

   When you've added the objects, they'll appear under **Objects to Migrate**, as shown in the screenshot below.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/source-objects.png" alt-text="Source objects selection page":::

   In this scenario, we’ve selected all table objects.

2. Select **Next**.

## Edit data

In this section, you have the option of editing the objects that you want to migrate.

1. On the **Manual Editing** page, notice the **View** drop-down menu in the top-right corner.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/manual-editing.png" alt-text="Manual Editing selection page":::

   The **View** drop-down box includes three items:

   - **All Objects** – Displays all objects. With this option, you can manually edit the generated SQL before applying them to the target database server. To do this, select the object and select Show Code and Messages. You can see (and edit!) the generated MySQL code that corresponds to the selected object.
   - **Migration problems** – Displays any problems that occurred during the migration, which you can review and verify.
   - **Column Mapping** – Displays column mapping information. You can use this view to edit the name and change column of the target object.

2. Select **Next**.

## Create the target database

1. Select the **Create schema in target RDBMS** check box.

   You can also choose to keep already existing schemas, so they won't be modified or updated.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/create-target-database.png" alt-text="Target Creation Options page":::

   In this article, we've chosen to create the schema in target RDBMS, but you can also select the **Create a SQL script file** check box to save the file on your local computer or for other purposes.

2. Select **Next**.

## Run the MySQL script to create the database objects

Since we've elected to create schema in the target RDBMS, the migrated SQL script will be executed in the target MySQL server. You can view its progress as shown in the screenshot below:

:::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/create-schemas.png" alt-text="Create Schemas page":::

1. After the creation of the schemas and their objects completes, select **Next**.

   On the **Create Target Results** page, you’re presented with a list of the objects created and notification of any errors that were encountered while creating them, as shown in the following screenshot.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/create-target-results.png" alt-text="Create Target Results page":::

2. Review the detail on this page to verify that everything completed as intended.

   For this article, we don’t have any errors. If there's no need to address any error messages, you can edit the migration script.

3. In the **Object** box, select the object that you want to edit.
4. Under **SQL CREATE script for selected object**, modify your SQL script, and then select **Apply** to save the changes.
5. Select **Recreate Objects** to run the script including your changes.

   If the script fails, you may need to edit the generated script. You can then manually fix the SQL script and run everything again. In this article, we’re not changing anything, so we’ll leave the script as it is.

6. Select **Next**.

## Transfer data

This part of the process moves data from the source MySQL Server database instance into your newly created target MySQL database instance. Use the **Data Transfer Setup** page to configure this process.

:::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/data-transfer-setup.png" alt-text="Data Transfer Setup page":::

This page provides options for setting up the data transfer. For the purposes of this article, we’ll accept the default values.

1. To begin the actual process of transferring data, select **Next**.

   The progress of the data transfer process appears as shown in the following screenshot.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/bulk-data-transfer.png" alt-text="Bulk Data Transfer page":::

   > [!NOTE]
   > The duration of the data transfer process is directly related to the size of the database you're migrating. The larger the source database, the longer the process will take, potentially up to a few hours for larger databases.

2. After the transfer completes, select **Next**.

   The **Migration Report** page appears, providing a report summarizing the whole process, as shown on the screenshot below:

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/migration-report.png" alt-text="Migration Progress Report page":::

3. Select **Finish** to close the Migration Wizard.

   The migration is now successfully completed.

## Verify consistency of the migrated schemas and tables

1. Next, log into your MySQL target database instance to verify that the migrated schemas and tables are consistent with your MySQL source database.

   In our case, you can see that all schemas (sakila, moda, items, customer, clothes, world, and world_x) from the Amazon RDS for MySQL: **MyjolieDB** database have been successfully migrated to the Azure Database for MySQL: **azmysql** instance.

2. To verify the table and rows counts, run the following query on both instances:

      `SELECT COUNT (*) FROM sakila.actor;`

   You can see from the screenshot below that the row count for Amazon RDS MySQL is 200, which matches the Azure Database for MySQL instance.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/table-row-size-source.png" alt-text="Table and Row size source database":::

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/table-row-size-target.png" alt-text="Table and Row size target database":::

   While you can run the above query on every single schema and table, that will be quite a bit of work if you’re dealing with hundreds of thousands or even millions of tables. You can use the queries below to verify the schema (database) and table size instead.

3. To check the database size, run the following query:

    ```
   SELECT table_schema AS "Database", 
   ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS "Size (MB)" 
   FROM information_schema.TABLES 
   GROUP BY table_schema;
   ```

4. To check the table size, run the following query:

   ```
   SELECT table_name AS "Table",
   ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
   FROM information_schema.TABLES
   WHERE table_schema = "database_name"
   ORDER BY (data_length + index_length) DESC;
   ```

   You see from the screenshots below that schema (database) size from the Source Amazon RDS MySQL instance is the same as that of the target Azure Database for MySQL Instance.

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/database-size-source.png" alt-text="Database size source database":::

    :::image type="content" source="./media/how-to-migrate-rds-mysql-workbench/database-size-target.png" alt-text="Database size target database":::

   Since the schema (database) sizes are the same in both instances, it's not really necessary to check individual table sizes. In any case, you can always use the above query to check your table sizes, as necessary.

   You’ve now confirmed that your migration completed successfully.

## Next steps

- For more information about migrating databases to Azure Database for MySQL, see the [Database Migration Guide](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide).
- View the video [Easily migrate MySQL/PostgreSQL apps to Azure managed service](https://medius.studios.ms/Embed/Video/THR2201?sid=THR2201), which contains a demo showing how to migrate MySQL apps to Azure Database for MySQL.
