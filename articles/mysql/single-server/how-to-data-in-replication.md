---
title: Configure Data-in Replication - Azure Database for MySQL
description: This article describes how to set up Data-in Replication for Azure Database for MySQL.
ms.service: mysql
ms.subservice: single-server
ms.custom:
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.date: 05/03/2023
---

# How to configure Azure Database for MySQL Data-in Replication

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This article describes how to set up [Data-in Replication](concepts-data-in-replication.md) in Azure Database for MySQL by configuring the source and replica servers. This article assumes that you have some prior experience with MySQL servers and databases.

> [!NOTE]
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.
>

To create a replica in the Azure Database for MySQL service, [Data-in Replication](concepts-data-in-replication.md) synchronizes data from a source MySQL server on-premises, in virtual machines (VMs), or in cloud database services. Data-in Replication is based on the binary log (binlog) file position-based or GTID-based replication native to MySQL. To learn more about binlog replication, see the [MySQL binlog replication overview](https://dev.mysql.com/doc/refman/5.7/en/binlog-replication-configuration-overview.html).

Review the [limitations and requirements](concepts-data-in-replication.md#limitations-and-considerations) of Data-in replication before performing the steps in this article.

## Create an Azure Database for MySQL single server instance to use as a replica

1. Create a new instance of Azure Database for MySQL single server (for example, `replica.mysql.database.azure.com`). Refer to [Create an Azure Database for MySQL server by using the Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md) for server creation. This server is the "replica" server for Data-in Replication.

   > [!IMPORTANT]
   > The Azure Database for MySQL server must be created in the General Purpose or Memory Optimized pricing tiers as data-in replication is only supported in these tiers.
   > GTID is supported on versions 5.7 and 8.0 and only on servers that support storage up to 16 TB (General purpose storage v2).

2. Create the same user accounts and corresponding privileges.

   User accounts aren't replicated from the source server to the replica server. If you plan on providing users with access to the replica server, you need to create all accounts and corresponding privileges manually on this newly created Azure Database for MySQL server.

3. Add the source server's IP address to the replica's firewall rules.

   Update firewall rules using the [Azure portal](how-to-manage-firewall-using-portal.md) or [Azure CLI](how-to-manage-firewall-using-cli.md).

4. **Optional** - If you wish to use [GTID-based replication](https://dev.mysql.com/doc/mysql-replication-excerpt/5.7/en/replication-gtids-concepts.html) from the source server to the Azure Database for MySQL replica server, you'll need to enable the following server parameters on the Azure Database for MySQL server as shown in the portal image below:

   :::image type="content" source="./media/how-to-data-in-replication/enable-gtid.png" alt-text="Enable GTID on Azure Database for MySQL server":::

## Configure the source MySQL server

The following steps prepare and configure the MySQL server hosted on-premises, in a virtual machine, or database service hosted by other cloud providers for Data-in Replication. This server is the "source" for Data-in replication.

1. Review the [source server requirements](concepts-data-in-replication.md#requirements) before proceeding.

2. Ensure that the source server allows both inbound and outbound traffic on port 3306, and that it has a **public IP address**, the DNS is publicly accessible, or that it has a fully qualified domain name (FQDN).

   Test connectivity to the source server by attempting to connect from a tool such as the MySQL command line hosted on another machine or from the [Azure Cloud Shell](../../cloud-shell/overview.md) available in the Azure portal.

   If your organization has strict security policies and won't allow all IP addresses on the source server to enable communication from Azure to your source server, you can potentially use the command below to determine the IP address of your MySQL server.

   1. Sign in to your Azure Database for MySQL server using a tool such as the MySQL command line.

   2. Execute the following query.

      ```sql
      mysql> SELECT @@global.redirect_server_host;
      ```

      Below is some sample output:

      ```bash
      +-----------------------------------------------------------+
      | @@global.redirect_server_host                             |
      +-----------------------------------------------------------+
      | e299ae56f000.tr1830.westus1-a.worker.database.windows.net |
       +-----------------------------------------------------------+
      ```

   3. Exit from the MySQL command line.
   4. To get the IP address, execute the following command in the ping utility:

      ```bash
      ping <output of step 2b>
      ```

      For example:

      ```cmd
      C:\Users\testuser> ping e299ae56f000.tr1830.westus1-a.worker.database.windows.net
      Pinging tr1830.westus1-a.worker.database.windows.net (**11.11.111.111**) 56(84) bytes of data.
      ```

   5. Configure your source server's firewall rules to include the previous step's outputted IP address on port 3306.

      > [!NOTE]
      > This IP address may change due to  maintenance / deployment operations. This method of connectivity is only for customers who cannot afford to allow all IP address on 3306 port.

3. Turn on binary logging.

   Check to see if binary logging has been enabled on the source by running the following command:

   ```sql
   SHOW VARIABLES LIKE 'log_bin';
   ```

   If the variable [`log_bin`](https://dev.mysql.com/doc/refman/8.0/en/replication-options-binary-log.html#sysvar_log_bin) is returned with the value "ON", binary logging is enabled on your server.

   If `log_bin` is returned with the value "OFF" and your source server is running on-premises or on virtual machines where you can access the configuration file (my.cnf), you can follow the steps below:
   1. Locate your MySQL configuration file (my.cnf) in the source server. For example: /etc/my.cnf
   2. Open the configuration file to edit it and locate **mysqld** section in the file.
   3. In the mysqld section, add following line:

       ```config
       log-bin=mysql-bin.log
       ```

   4. Restart the MySQL source server for the changes to take effect.
   5. After the server is restarted, verify that binary logging is enabled by running the same query as before:

      ```sql
      SHOW VARIABLES LIKE 'log_bin';
      ```

4. Configure the source server settings.

   Data-in Replication requires the parameter `lower_case_table_names` to be consistent between the source and replica servers. This parameter is 1 by default in Azure Database for MySQL.

   ```sql
   SET GLOBAL lower_case_table_names = 1;
   ```

   **Optional** - If you wish to use [GTID-based replication](https://dev.mysql.com/doc/mysql-replication-excerpt/5.7/en/replication-gtids-concepts.html), you'll need to check if GTID is enabled on the source server. You can execute following command against your source MySQL server to see if gtid_mode is ON.

   ```sql
   show variables like 'gtid_mode';
   ```

   >[!IMPORTANT]
   > All servers have gtid_mode set to the default value OFF. You don't need to enable GTID on the source MySQL server specifically to set up Data-in Replication. If GTID is already enabled on source server, you can optionally use GTID-based replication to set up Data-in Replication too with Azure Database for MySQL single server. You can use file-based replication to set up data-in replication for all servers regardless of the gitd_mode configuration on the source server.

5. Create a new replication role and set up permission.

   Create a user account on the source server that is configured with replication privileges. This can be done through SQL commands or a tool such as MySQL Workbench. Consider whether you plan on replicating with SSL, as this will need to be specified when creating the user. Refer to the MySQL documentation to understand how to [add user accounts](https://dev.mysql.com/doc/refman/5.7/en/user-names.html) on your source server.

   In the following commands, the new replication role created can access the source from any machine, not just the machine that hosts the source itself. This is done by specifying "syncuser@'%'" in the create user command. See the MySQL documentation to learn more about [specifying account names](https://dev.mysql.com/doc/refman/5.7/en/account-names.html).

   **SQL Command**

   *Replication with SSL*

   To require SSL for all user connections, use the following command to create a user:

   ```sql
   CREATE USER 'syncuser'@'%' IDENTIFIED BY 'yourpassword';
   GRANT REPLICATION SLAVE ON *.* TO ' syncuser'@'%' REQUIRE SSL;
   ```

   *Replication without SSL*

   If SSL isn't required for all connections, use the following command to create a user:

   ```sql
   CREATE USER 'syncuser'@'%' IDENTIFIED BY 'yourpassword';
   GRANT REPLICATION SLAVE ON *.* TO ' syncuser'@'%';
   ```

   **MySQL Workbench**

   To create the replication role in MySQL Workbench, open the **Users and Privileges** panel from the **Management** panel, and then select **Add Account**.

   :::image type="content" source="./media/how-to-data-in-replication/users-privileges.png" alt-text="Users and Privileges":::

   Type in the username into the **Login Name** field.

   :::image type="content" source="./media/how-to-data-in-replication/sync-user.png" alt-text="Sync user":::

   Select the **Administrative Roles** panel and then select **Replication Slave** from the list of **Global Privileges**. Then select **Apply** to create the replication role.

   :::image type="content" source="./media/how-to-data-in-replication/replication-slave.png" alt-text="Replication Slave":::

6. Set the source server to read-only mode.

   Before starting to dump out the database, the server needs to be placed in read-only mode. While in read-only mode, the source will be unable to process any write transactions. Evaluate the impact to your business and schedule the read-only window in an off-peak time if necessary.

   ```sql
   FLUSH TABLES WITH READ LOCK;
   SET GLOBAL read_only = ON;
   ```

7. Get binary log file name and offset.

   Run the [`show master status`](https://dev.mysql.com/doc/refman/5.7/en/show-master-status.html) command to determine the current binary log file name and offset.

   ```sql
    show master status;
   ```

   The results should appear similar to the following. Make sure to note the binary file name for use in later steps.

   :::image type="content" source="./media/how-to-data-in-replication/master-status.png" alt-text="Master Status Results":::

## Dump and restore the source server

1. Determine which databases and tables you want to replicate into Azure Database for MySQL and perform the dump from the source server.

    You can use mysqldump to dump databases from your primary server. For details, refer to [Dump & Restore](concepts-migrate-dump-restore.md). It's unnecessary to dump the MySQL library and test library.

2. **Optional** - If you wish to use [gtid-based replication](https://dev.mysql.com/doc/mysql-replication-excerpt/5.7/en/replication-gtids-concepts.html), you'll need to identify the GTID of the last transaction executed at the primary. You can use the following command to note the GTID of the last transaction executed on the master server.

   ```sql
   show global variables like 'gtid_executed';
   ```

3. Set source server to read/write mode.

   After the database has been dumped, change the source MySQL server back to read/write mode.

   ```sql
   SET GLOBAL read_only = OFF;
   UNLOCK TABLES;
   ```

4. Restore dump file to new server.

   Restore the dump file to the server created in the Azure Database for MySQL service. Refer to [Dump & Restore](concepts-migrate-dump-restore.md) for how to restore a dump file to a MySQL server. If the dump file is large, upload it to a virtual machine in Azure within the same region as your replica server. Restore it to the Azure Database for MySQL server from the virtual machine.

5. **Optional** - Note the GTID of the restored server on Azure Database for MySQL to ensure it is same as the primary server. You can use the following command to note the GTID of the GTID purged value on the Azure Database for MySQL replica server. The value of gtid_purged should be same as gtid_executed on master noted in step 2 for GTID-based replication to work.

   ```sql
   show global variables like 'gtid_purged';
   ```

## Link source and replica servers to start Data-in Replication

1. Set the source server.

   All Data-in Replication functions are done by stored procedures. You can find all procedures at [Data-in Replication Stored Procedures](./reference-stored-procedures.md). The stored procedures can be run in the MySQL shell or MySQL Workbench.

   To link two servers and start replication, login to the target replica server in the Azure Database for MySQL service and set the external instance as the source server. This is done by using the `mysql.az_replication_change_master` stored procedure on the Azure Database for MySQL server.

   ```sql
   CALL mysql.az_replication_change_master('<master_host>', '<master_user>', '<master_password>', <master_port>, '<master_log_file>', <master_log_pos>, '<master_ssl_ca>');
   ```

   **Optional** - If you wish to use [gtid-based replication](https://dev.mysql.com/doc/mysql-replication-excerpt/5.7/en/replication-gtids-concepts.html),you will need to use the following command to link the two servers

    ```sql
   call mysql.az_replication_change_master_with_gtid('<master_host>', '<master_user>', '<master_password>', <master_port>, '<master_ssl_ca>');
   ```

   - master_host: hostname of the source server
   - master_user: username for the source server
   - master_password: password for the source server
   - master_port: port number on which source server is listening for connections. (3306 is the default port on which MySQL is listening)
   - master_log_file: binary log file name from running `show master status`
   - master_log_pos: binary log position from running `show master status`
   - master_ssl_ca: CA certificate's context. If not using SSL, pass in empty string.

     It's recommended to pass this parameter in as a variable. For more information, see the following examples.

   > [!NOTE]
   > If the source server is hosted in an Azure VM, set "Allow access to Azure services" to "ON" to allow the source and replica servers to communicate with each other. This setting can be changed from the **Connection security** options. For more information, see [Manage firewall rules using the portal](how-to-manage-firewall-using-portal.md) .

   **Examples**

   *Replication with SSL*

   The variable `@cert` is created by running the following MySQL commands:

      ```sql
      SET @cert = '-----BEGIN CERTIFICATE-----
      PLACE YOUR PUBLIC KEY CERTIFICATE'`S CONTEXT HERE
      -----END CERTIFICATE-----'
      ```

   Replication with SSL is set up between a source server hosted in the domain "companya.com" and a replica server hosted in Azure Database for MySQL. This stored procedure is run on the replica.

      ```sql
      CALL mysql.az_replication_change_master('master.companya.com', 'syncuser', 'P@ssword!', 3306, 'mysql-bin.000002', 120, @cert);
      ```

   *Replication without SSL*

   Replication without SSL is set up between a source server hosted in the domain "companya.com" and a replica server hosted in Azure Database for MySQL. This stored procedure is run on the replica.

      ```sql
      CALL mysql.az_replication_change_master('master.companya.com', 'syncuser', 'P@ssword!', 3306, 'mysql-bin.000002', 120, '');
      ```

2. Set up filtering.

   If you want to skip replicating some tables from your master, update the `replicate_wild_ignore_table` server parameter on your replica server. You can provide more than one table pattern using a comma-separated list.

   Review the [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/replication-options-replica.html#option_mysqld_replicate-wild-ignore-table) to learn more about this parameter.

   To update the parameter, you can use the [Azure portal](how-to-server-parameters.md) or [Azure CLI](how-to-configure-server-parameters-using-cli.md).

3. Start replication.

   Call the `mysql.az_replication_start` stored procedure to start replication.

   ```sql
   CALL mysql.az_replication_start;
   ```

4. Check replication status.

   Call the [`show slave status`](https://dev.mysql.com/doc/refman/5.7/en/show-slave-status.html) command on the replica server to view the replication status.

   ```sql
   show slave status;
   ```

   If the state of `Slave_IO_Running` and `Slave_SQL_Running` are "yes" and the value of `Seconds_Behind_Master` is "0", replication is working well. `Seconds_Behind_Master` indicates how late the replica is. If the value isn't "0", it means that the replica is processing updates.

## Other useful stored procedures for Data-in Replication operations

### Stop replication

To stop replication between the source and replica server, use the following stored procedure:

```sql
CALL mysql.az_replication_stop;
```

### Remove replication relationship

To remove the relationship between source and replica server, use the following stored procedure:

```sql
CALL mysql.az_replication_remove_master;
```

### Skip replication error

To skip a replication error and allow replication to continue, use the following stored procedure:

```sql
CALL mysql.az_replication_skip_counter;
```

 **Optional** - If you wish to use [gtid-based replication](https://dev.mysql.com/doc/mysql-replication-excerpt/5.7/en/replication-gtids-concepts.html), use the following stored procedure to skip a transaction

```sql
call mysql. az_replication_skip_gtid_transaction(‘<transaction_gtid>’)
```

The procedure can skip the transaction for the given GTID. If the GTID format is not right or the GTID transaction has already been executed, the procedure will fail to execute. The GTID for a transaction can be determined by parsing the binary log to check the transaction events. MySQL provides a utility [mysqlbinlog](https://dev.mysql.com/doc/refman/5.7/en/mysqlbinlog.html) to parse binary logs and display their contents in text format, which can be used to identify GTID of the transaction.

>[!Important]
>This procedure can be only used to skip one transaction, and can't be used to skip gtid set or set gtid_purged.

To skip the next transaction after the current replication position, use the following command to identify the GTID of next transaction as shown below.

```sql
SHOW BINLOG EVENTS [IN 'log_name'] [FROM pos][LIMIT [offset,] row_count]
```

  :::image type="content" source="./media/how-to-data-in-replication/show-binary-log.png" alt-text="Show binary log results":::

## Next steps

- Learn more about [Data-in Replication](concepts-data-in-replication.md) for Azure Database for MySQL.
