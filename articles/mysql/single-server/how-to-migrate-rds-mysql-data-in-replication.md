---
title: Migrate Amazon RDS for MySQL to Azure Database for MySQL using Data-in Replication
description: This article describes how to migrate Amazon RDS for MySQL to Azure Database for MySQL by using Data-in Replication.
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 11/22/2022
ms.service: mysql
ms.subservice: single-server
ms.topic: how-to
---

# Migrate Amazon RDS for MySQL to Azure Database for MySQL using Data-in Replication

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[Azure-database-for-mysql-single-server-deprecation](../includes/Azure-database-for-mysql-single-server-deprecation.md)]

> [!NOTE]  
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

You can use methods such as MySQL dump and restore, MySQL Workbench Export and Import, or Azure Database Migration Service to migrate your MySQL databases to Azure Database for MySQL. You can migrate your workloads with minimum downtime by using a combination of open-source tools such as mysqldump or mydumper and myloader with Data-in Replication.

Data-in Replication is a technique that replicates data changes from the source server to the destination server based on the binary log file position method. In this scenario, the MySQL instance operating as the source (on which the database changes originate) writes updates and changes as *events* to the binary log. The information in the binary log is stored in different logging formats according to the database changes being recorded. Replicas are configured to read the binary log from the source and execute the events in the binary log on the replica's local database.

Set up [Data-in Replication](../flexible-server/concepts-data-in-replication.md) to synchronize data from a source MySQL server to a target MySQL server. You can do a selective cutover of your applications from the primary (or source database) to the replica (or target database).

In this tutorial, you'll learn how to set up Data-in Replication between a source server that runs Amazon Relational Database Service (RDS) for MySQL and a target server that runs Azure Database for MySQL.

## Performance considerations

Before you begin this tutorial, consider the performance implications of the location, and capacity of the client computer you'll use to perform the operation.

### Client location

Perform dump or restore operations from a client computer that's launched in the same location as the database server:

- For Azure Database for MySQL servers, the client machine should be in the same virtual network and availability zone as the target database server.
- For source Amazon RDS database instances, the client instance should exist in the same Amazon Virtual Private Cloud and availability zone as the source database server.
In the preceding case, you can move dump files between client machines by using file transfer protocols like FTP or SFTP or upload them to Azure Blob Storage. To reduce the total migration time, compress files before you transfer them.

### Client capacity

No matter where the client computer is located, it requires adequate computing, I/O, and network capacity to perform the requested operations. The general recommendations are:

- If the dump or restore involves real-time processing of data, for example, compression or decompression, choose an instance class with at least one CPU core per dump or restore thread.
- Ensure there's enough network bandwidth available to the client instance. Use instance types that support the accelerated networking feature. For more information, see the "Accelerated Networking" section in the [Azure Virtual Machine Networking Guide](../../virtual-network/create-vm-accelerated-networking-cli.md).
- Ensure that the client machine's storage layer provides the expected read/write capacity. We recommend that you use an Azure virtual machine with Premium SSD storage.

## Prerequisites

To complete this tutorial, you need to:

- Install the [mysqlclient](https://dev.mysql.com/downloads/) on your client computer to create a dump, and perform a restore operation on your target Azure Database for MySQL server.
- For larger databases, install [mydumper and myloader](https://centminmod.com/mydumper.html) for parallel dumping and restoring of databases.

    > [!NOTE]  
    > Mydumper can only run on Linux distributions. For more information, see [How to install mydumper](https://github.com/maxbube/mydumper#how-to-install-mydumpermyloader).

- Create an instance of Azure Database for MySQL server that runs version 5.7 or 8.0.

    > [!IMPORTANT]  
    > If your target is Azure Database for MySQL Flexible Server with zone-redundant high availability (HA), note that Data-in Replication isn't supported for this configuration. As a workaround, during server creation set up zone-redundant HA:
    >
    > 1. Create the server with zone-redundant HA enabled.
    > 1. Disable HA.
    > 1. Follow the article to set up Data-in Replication.
    > 1. Post-cutover, remove the Data-in Replication configuration.
    > 1. Enable HA.

Ensure that several parameters and features are configured and set up properly, as described:

- For compatibility reasons, have the source and target database servers on the same MySQL version.
- Have a primary key in each table. A lack of primary keys on tables can slow the replication process.
- Make sure the character set of the source and the target database are the same.
- Set the `wait_timeout` parameter to a reasonable time. The time depends on the amount of data or workload you want to import or migrate.
- Verify that all your tables use InnoDB. The Azure Database for MySQL server only supports the InnoDB storage engine.
- For tables with many secondary indexes or large tables, performance overhead effects are visible during restore. Modify the dump files so that the `CREATE TABLE` statements don't include secondary key definitions. After you import the data, re-create secondary indexes to avoid the performance penalty during the restore process.

Finally, to prepare for Data-in Replication:

- Verify that the target Azure Database for MySQL server can connect to the source Amazon RDS for MySQL server over port 3306.
- Ensure that the source Amazon RDS for MySQL server allows both inbound and outbound traffic on port 3306.
- Make sure you provide [site-to-site connectivity](../../vpn-gateway/tutorial-site-to-site-portal.md) to your source server by using either [Azure ExpressRoute](../../expressroute/expressroute-introduction.md) or [Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md). For more information about creating a virtual network, see the [Azure Virtual Network documentation](../../virtual-network/index.yml). Also see the quickstart articles with step-by-step details.
- Configure your source database server's network security groups to allow the target Azure Database for MySQL's server IP address.

> [!IMPORTANT]  
> If the source Amazon RDS for MySQL instance has GTID_mode set to ON, the target instance of Azure Database for MySQL Flexible Server must also have GTID_mode set to ON.

## Configure the target instance of Azure Database for MySQL

To configure the target instance of Azure Database for MySQL, which is the target for Data-in Replication:

1. Set the `max_allowed_packet` parameter value to the maximum of **1073741824**, which is 1 GB. This value prevents any overflow issues related to long rows.
1. Set the `slow_query_log`, `general_log`, `audit_log_enabled`, and `query_store_capture_mode` parameters to **OFF** during the migration to help eliminate any overhead related to query logging.
1. Scale up the compute size of the target Azure Database for MySQL server to the maximum of 64 vCores. This size provides more compute resources when restoring the source server's database dump.

    You can always scale back the compute to meet your application demands after the migration is complete.

1. Scale up the storage size to get more IOPS during the migration or increase the maximum IOPS for the migration.

   > [!NOTE]  
   > Available maximum IOPS are determined by compute size. For more information, see the IOPS section in [Compute and storage options in Azure Database for MySQL - Flexible Server](../flexible-server/concepts-compute-storage.md#iops).

## Configure the source Amazon RDS for MySQL server

To prepare and configure the MySQL server hosted in Amazon RDS, which is the *source* for Data-in Replication:

1. Confirm that binary logging is enabled on the source Amazon RDS for MySQL server. Check that automated backups are enabled, or ensure a read replica exists for the source Amazon RDS for MySQL server.

1. Ensure that the binary log files on the source server are retained until after the changes are applied on the target instance of Azure Database for MySQL.

    With Data-in Replication, Azure Database for MySQL doesn't manage the replication process.

1. To check the binary log retention on the source Amazon RDS server to determine the number of hours the binary logs are retained, call the `mysql.rds_show_configuration` stored procedure:

    ```
    mysql> call mysql.rds_show_configuration;
    +------------------------+-------+-----------------------------------------------------------------------------------------------------------+
    | name | value | description |
    +------------------------+-------+-----------------------------------------------------------------------------------------------------------+
    | binlog retention hours | 24 | binlog retention hours specifies the duration in hours before binary logs are automatically deleted. |
    | source delay | 0 | source delay specifies replication delay in seconds between current instance and its master. |
    | target delay | 0 | target delay specifies replication delay in seconds between current instance and its future read-replica. |
    +------------------------+-------            +-----------------------------------------------------------------------------------------------------------+
    3 rows in set (0.00 sec)
    ```
1. To configure the binary log retention period, run the `rds_set_configuration` stored procedure to ensure that the binary logs are retained on the source server for the desired time. For example:

    ```
    Mysql> Call mysql.rds_set_configuration(‘binlog retention hours', 96);
    ```

    If you're creating a dump and restoring, the preceding command helps you catch up with the delta changes quickly.

   > [!NOTE]  
   > Ensure ample disk space to store the binary logs on the source server based on the defined retention period.

There are two ways to capture a dump of data from the source Amazon RDS for MySQL server. One approach involves capturing a dump of data directly from the source server. The other approach involves capturing a dump from an Amazon RDS for MySQL read replica.

- To capture a dump of data directly from the source server:

    1. Ensure that you stop the writes from the application for a few minutes to get a transactionally consistent dump of data.

       You can also temporarily set the `read_only` parameter to a value of **1** so that writes aren't processed when you're capturing a dump of data.

    1. After you stop the writes on the source server, collect the binary log file name and offset by running the command `Mysql> Show master status;`.
    1. Save these values to start replication from your Azure Database for MySQL server.
    1. To create a dump of the data, execute `mysqldump` by running the following command:

        ```
        $ mysqldump -h hostname -u username -p –single-transaction –databases dbnames –order-by-primary> dumpname.sql
        ```

- If stopping writes on the source server isn't an option or the performance of dumping data isn't acceptable on the source server, capture a dump on a replica server:

    1. Create an Amazon MySQL read replica with the same configuration as the source server. Then create the dump there.
    1. Let the Amazon RDS for MySQL read replica catch up with the source Amazon RDS for MySQL server.
    1. When the replica lag reaches **0** on the read replica, stop replication by calling the stored procedure `mysql.rds_stop_replication`.

        ```
        Mysql> call mysql.rds_stop_replication;
        ```

    1. With replication stopped, connect to the replica. Then run the `SHOW SLAVE STATUS` command to retrieve the current binary log file name from the **Relay_Master_Log_File** field and the log file position from the **Exec_Master_Log_Pos** field.
    1. Save these values to start replication from your Azure Database for MySQL server.
    1. To create a dump of the data from the Amazon RDS for MySQL read replica, execute `mysqldump` by running the following command:

        ```
        $ mysqldump -h hostname -u username -p –single-transaction –databases dbnames –order-by-primary> dumpname.sql
        ```

    > [!NOTE]  
    > You can also use mydumper for capturing a parallelized dump of your data from your source Amazon RDS for MySQL database. For more information, see [Migrate large databases to Azure Database for MySQL using mydumper/myloader](concepts-migrate-mydumper-myloader.md).

## Link source and replica servers to start Data-in Replication

1. To restore the database by using mysql native restore, run the following command:

    ```
    $ mysql -h <target_server> -u <targetuser> -p < dumpname.sql
    ```

   > [!NOTE]  
   > If you're instead using myloader, see [Migrate large databases to Azure Database for MySQL using mydumper/myloader](concepts-migrate-mydumper-myloader.md).

1. Sign in to the source Amazon RDS for MySQL server, and set up a replication user. Then grant the necessary privileges to this user.

    - If you're using SSL, run the following commands:

        ```
        Mysql> CREATE USER 'syncuser'@'%' IDENTIFIED BY 'userpassword';
        Mysql> GRANT REPLICATION SLAVE, REPLICATION CLIENT on *.* to 'syncuser'@'%' REQUIRE SSL;
        Mysql> SHOW GRANTS FOR syncuser@'%';
        ```

    - If you're not using SSL, run the following commands:

        ```
        Mysql> CREATE USER 'syncuser'@'%' IDENTIFIED BY 'userpassword';
        Mysql> GRANT REPLICATION SLAVE, REPLICATION CLIENT on *.* to 'syncuser'@'%';
        Mysql> SHOW GRANTS FOR syncuser@'%';
        ```

    Stored procedures do all Data-in Replication functions. For information about all procedures, see [Data-in Replication stored procedures](../single-server/reference-stored-procedures.md#data-in-replication-stored-procedures). You can run these stored procedures in the MySQL shell or MySQL Workbench.

1. To link the Amazon RDS for MySQL source server and the Azure Database for MySQL target server, sign in to the target Azure Database for MySQL server. Set the Amazon RDS for MySQL server as the source server by running the following command:

    ```
    CALL mysql.az_replication_change_master('source_server','replication_user_name','replication_user_password',3306,'<master_bin_log_file>',master_bin_log_position,'<master_ssl_ca>');
    ```

1. To start replication between the source Amazon RDS for MySQL server and the target Azure Database for MySQL server, run the following command:

    ```
    Mysql> CALL mysql.az_replication_start;
    ```

1. To check the status of the replication on the replica server, run the following command:

    ```
    Mysql> show slave status\G
    ```

    If the state of the `Slave_IO_Running` and `Slave_SQL_Running` parameters is **Yes**, replication has started and is in a running state.

1. Check the value of the `Seconds_Behind_Master` parameter to determine how delayed the target server is.

    If the value is **0**, the target has processed all updates from the source server. If the value is anything other than **0**, the target server is still processing updates.

## Ensure a successful cutover

To ensure a successful cutover:

1. Configure the appropriate logins and database-level permissions in the target Azure Database for MySQL server.
1. Stop writes to the source Amazon RDS for MySQL server.
1. Ensure that the target Azure Database for MySQL server has caught up with the source server and that the `Seconds_Behind_Master` value is **0** from `show slave status`.
1. Call the stored procedure `mysql.az_replication_stop` to stop the replication because all changes have been replicated to the target Azure Database for MySQL server.
1. Call `mysql.az_replication_remove_master` to remove the Data-in Replication configuration.
1. Redirect clients and client applications to the target Azure Database for MySQL server.

At this point, the migration is complete. Your applications are connected to the server running Azure Database for MySQL.

## Next steps

- For more information about migrating databases to Azure Database for MySQL, see the [Database Migration Guide](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide).
- View the video [Easily migrate MySQL/PostgreSQL apps to Azure managed service](https://medius.studios.ms/Embed/Video/THR2201?sid=THR2201). It contains a demo that shows how to migrate MySQL apps to Azure Database for MySQL.
