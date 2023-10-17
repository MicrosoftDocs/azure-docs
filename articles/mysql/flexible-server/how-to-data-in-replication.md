---
title: Configure Data-in replication - Azure Database for MySQL - Flexible Server
description: This article describes how to set up Data-in replication for Azure Database for MySQL - Flexible Server.
author: VandhanaMehta
ms.author: vamehta
ms.reviewer: maghan
ms.date: 12/30/2022
ms.service: mysql
ms.subservice: flexible-server
ms.custom: devx-track-linux
ms.topic: how-to
---

# How to configure Azure Database for MySQL - Flexible Server data-in replication

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article describes how to set up [Data-in replication](concepts-data-in-replication.md) in Azure Database for MySQL - Flexible Server by configuring the source and replica servers. This article assumes that you have some prior experience with MySQL servers and databases.

> [!NOTE]  
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

To create a replica in the Azure Database for MySQL Flexible Server, [Data-in replication](concepts-data-in-replication.md) synchronizes data from a source MySQL server on-premises, in virtual machines (VMs), or in cloud database services.  Data-in replication can be configured using either binary log (binlog) file position-based replication OR GTID based replication. To learn more about binlog replication, see the [MySQL Replication](https://dev.mysql.com/doc/refman/5.7/en/replication-configuration.html).

Review the [limitations and requirements](concepts-data-in-replication.md#limitations-and-considerations) of Data-in replication before performing the steps in this article.

## Create an Azure Database for MySQL - Flexible Server instance to use as a replica

1. Create a new instance of Azure Database for MySQL - Flexible Server (for example, `replica.mysql.database.azure.com`). Refer to [Create an Azure Database for MySQL - Flexible Server server by using the Azure portal](quickstart-create-server-portal.md) for server creation. This server is the "replica" server for Data-in replication.

1. Create the same user accounts and corresponding privileges.

   User accounts aren't replicated from the source server to the replica server. If you plan on providing users with access to the replica server, you need to create all accounts and corresponding privileges manually on this newly created Azure Database for MySQL - Flexible Server.

## Configure the source MySQL server

The following steps prepare and configure the MySQL server hosted on-premises, in a virtual machine, or database service hosted by other cloud providers for Data-in replication. This server is the "source" for Data-in replication. 

1. Review the [source server requirements](concepts-data-in-replication.md#requirements) before proceeding.

1. Networking Requirements

   - Ensure that the source server allows both inbound and outbound traffic on port 3306, and that it has a **public IP address**, the DNS is publicly accessible, or that it has a fully qualified domain name (FQDN).

   - If private access is in use, make sure that you have connectivity between Source server and the Vnet in which the replica server is hosted.
   
   - Make sure we provide site-to-site connectivity to your on-premises source servers by using either  [ExpressRoute](../../expressroute/expressroute-introduction.md) or [VPN](../../vpn-gateway/vpn-gateway-about-vpngateways.md). For more information about creating a virtual network, see the [Virtual Network Documentation](../../virtual-network/index.yml), and especially the quickstart articles with step-by-step details.
   
   - If private access is used in replica server and your source is Azure VM make sure that VNet to VNet connectivity is established. VNet-Vnet peering is supported. You can also use other connectivity methods to communicate between VNets across different regions like VNet to VNet Connection. For more information you can, see [VNet-to-VNet VPN gateway](../../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md)
   
   - Ensure that your virtual network Network Security Group rules don't block the outbound port 3306 (Also inbound if the MySQL is running on Azure VM). For more detail on virtual network NSG traffic filtering, see the article [Filter network traffic with network security groups](../../virtual-network/virtual-network-vnet-plan-design-arm.md).
   
   - Configure your source server's firewall rules to allow the replica server IP address.

1. Follow appropriate steps based on if you want to use bin-log position or GTID based data-in replication.

   #### [Bin-log position-based replication](#tab/bash)

   Check to see if binary logging has been enabled on the source by running the following command:

   ```sql
   SHOW VARIABLES LIKE 'log_bin';
   ```
    
   If the variable [`log_bin`](https://dev.mysql.com/doc/refman/8.0/en/replication-options-binary-log.html#sysvar_log_bin) is returned with the value "ON", binary logging is enabled on your server.
    
   If `log_bin` is returned with the value "OFF" and your source server is running on-premises or on virtual machines where you can access the configuration file (my.cnf), you can follow the following steps:
   
   1. Locate your MySQL configuration file (my.cnf) in the source server. For example: /etc/my.cnf
   
   1. Open the configuration file to edit it and locate **mysqld** section in the file.
   
   1. In the mysqld section, add following line:
   
      ```bash
      log-bin=mysql-bin.log
      ```
    
    1. Restart the MySQL service on source server (or Restart) for the changes to take effect.
    
    1. After the server is restarted, verify that binary logging is enabled by running the same query as before:
    
    ```sql
    SHOW VARIABLES LIKE 'log_bin';
    ```

   #### [GTID based replication](#tab/shell)

   The Master server needs to be started with GTID mode enabled by setting the gtid_mode variable to ON. It's also essential that the enforce_gtid_consistency variable is enabled to make sure that only the statements, which are safe for MySQL GTIDs Replication are logged.
      
   SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = ON;
      
   SET @@GLOBAL.GTID_MODE = ON;
      
   If the master server is another Azure Database for MySQL Flexible Server, then these server parameters can also be updated from the portal by navigating to server parameter page.
   
      
1. Configure the source server settings.
      
      Data-in replication requires the parameter `lower_case_table_names` to be consistent between the source and replica servers. This parameter is 1 by default in Azure Database for MySQL - Flexible Server.
      
      ```sql
      SET GLOBAL lower_case_table_names = 1;
      ```
      
5. Create a new replication role and set up permission.
      
      Create a user account on the source server that is configured with replication privileges. This can be done through SQL commands or a tool such as MySQL Workbench. Consider whether you plan on replicating with SSL, as this will need to be specified when creating the user. Refer to the MySQL documentation to understand how to [add user accounts](https://dev.mysql.com/doc/refman/5.7/en/user-names.html) on your source server.
      
      In the following commands, the new replication role created can access the source from any machine, not just the machine that hosts the source itself. This is done by specifying "syncuser@'%'" in the create user command. See the MySQL documentation to learn more about [specifying account names](https://dev.mysql.com/doc/refman/5.7/en/account-names.html).

#### [SQL Command](#tab/command-line)

**Replication with SSL**

To require SSL for all user connections, use the following command to create a user:

```sql
CREATE USER 'syncuser'@'%' IDENTIFIED BY 'yourpassword';
GRANT REPLICATION SLAVE ON *.* TO ' syncuser'@'%' REQUIRE SSL;
```

**Replication without SSL**

If SSL isn't required for all connections, use the following command to create a user:

```sql
CREATE USER 'syncuser'@'%' IDENTIFIED BY 'yourpassword';
GRANT REPLICATION SLAVE ON *.* TO ' syncuser'@'%';
```

#### [MySQL Workbench](#tab/mysql-workbench)

To create the replication role in MySQL Workbench, open the **Users and Privileges** panel from the **Management** panel, and then select **Add Account**.

:::image type="content" source="./media/how-to-data-in-replication/users-privileges.png" alt-text="Users and Privileges":::

Type in the username into the **Login Name** field.

:::image type="content" source="./media/how-to-data-in-replication/sync-user.png" alt-text="Sync user":::

Select the **Administrative Roles** panel and then select **Replication Slave** from the list of **Global Privileges**. Then select **Apply** to create the replication role.

:::image type="content" source="./media/how-to-data-in-replication/replication-slave.png" alt-text="Replication Slave":::

1. Set the source server to read-only mode.

Before starting to dump out the database, the server needs to be placed in read-only mode. While in read-only mode, the source will be unable to process any write transactions. Evaluate the impact to your business and schedule the read-only window in an off-peak time if necessary.

```sql
FLUSH TABLES WITH READ LOCK;
SET GLOBAL read_only = ON;
```

1. Get binary log file name and offset.

   Run the [`show master status`](https://dev.mysql.com/doc/refman/5.7/en/show-master-status.html) command to determine the current binary log file name and offset.
    
   ```sql
      show master status;
   ```

The results should appear similar to the following. Make sure to note the binary file name for use in later steps.

:::image type="content" source="./media/how-to-data-in-replication/master-status.png" alt-text="Master Status Results":::

---

## Dump and restore the source server

1. Determine which databases and tables you want to replicate into Azure Database for MySQL - Flexible Server and perform the dump from the source server.

    You can use mysqldump to dump databases from your primary server. For details, refer to [Dump & Restore](../concepts-migrate-dump-restore.md). It's unnecessary to dump the MySQL library and test library.

2. Set source server to read/write mode.

   After the database has been dumped, change the source MySQL server back to read/write mode.

   ```sql
   SET GLOBAL read_only = OFF;
   UNLOCK TABLES;
   ```
[!NOTE]  
> Before the server is set back to read/write mode, you can retrieve the GTID information using global variable GTID_EXECUTED. The same will be used at the later stage to set GTID on the replica server

3. Restore dump file to new server.

   Restore the dump file to the server created in the Azure Database for MySQL - Flexible Server service. Refer to [Dump & Restore](../concepts-migrate-dump-restore.md) for how to restore a dump file to a MySQL server. If the dump file is large, upload it to a virtual machine in Azure within the same region as your replica server. Restore it to the Azure Database for MySQL - Flexible Server server from the virtual machine.

> [!NOTE]  
> If you want to avoid setting the database to read only when you dump and restore, you can use [mydumper/myloader](../concepts-migrate-mydumper-myloader.md).

## Set GTID in Replica Server

1. Skip the step if using bin-log position-based replication

2. GTID information from the dump file taken from the source is required to reset GTID history of the target (replica) server.

3.	Use this GTID information from the source to execute GTID reset on the replica server using the following CLI command:

    ```azurecli-interactive
    az mysql flexible-server gtid reset --resource-group  <resource group> --server-name <replica server name> --gtid-set <gtid set from the source server> --subscription <subscription id>
    ```

For more details refer [GTID Reset](/cli/azure/mysql/flexible-server/gtid).

> [!NOTE]  
>GTID reset can't be performed on a Geo-redundancy backup enabled server. Please disable Geo-redundancy to perform GTID reset on the server. You can enable Geo-redundancy option again after GTID reset. GTID reset action invalidates all the available backups and therefore, once Geo-redundancy is enabled again, it may take a day before geo-restore can be performed on the server



## Link source and replica servers to start Data-in replication

1. Set the source server.

   All Data-in replication functions are done by stored procedures. You can find all procedures at [Data-in replication Stored Procedures](../reference-stored-procedures.md). The stored procedures can be run in the MySQL shell or MySQL Workbench.

To link two servers and start replication, login to the target replica server in the Azure Database for MySQL service and set the external instance as the source server. This is done by using the `mysql.az_replication_change_master` or `mysql.az_replication_change_master_with_gtid` stored procedure on the Azure Database for MySQL server.

   ```sql
   CALL mysql.az_replication_change_master('<master_host>', '<master_user>', '<master_password>', <master_port>, '<master_log_file>', <master_log_pos>, '<master_ssl_ca>');
   ```

   ```sql
   CALL mysql.az_replication_change_master_with_gtid('<master_host>', '<master_user>', '<master_password>', <master_port>,'<master_ssl_ca>');
   ```

   - master_host: hostname of the source server
   - master_user: username for the source server
   - master_password: password for the source server
   - master_port: port number on which source server is listening for connections. (3306 is the default port on which MySQL is listening)
   - master_log_file: binary log file name from running `show master status`
   - master_log_pos: binary log position from running `show master status`
   - master_ssl_ca: CA certificate's context. If not using SSL, pass in empty string.

   It's recommended to pass this parameter in as a variable. For more information, visit the following examples.

   > [!NOTE]  
   > - If the source server is hosted in an Azure VM, set "Allow access to Azure services" to "ON" to allow the source and replica servers to communicate with each other. This setting can be changed from the **Connection security** options. For more information, see [Manage firewall rules using the portal](how-to-manage-firewall-portal.md).
   > - If you used mydumper/myloader to dump the database then you can get the master_log_file and master_log_pos from the */backup/metadata* file.

   **Examples**

   *Replication with SSL*

   The variable `@cert` is created by running the following MySQL commands:

   ```sql
   SET @cert = '-----BEGIN CERTIFICATE-----
   PLACE YOUR PUBLIC KEY CERTIFICATE'`S CONTEXT HERE
   -----END CERTIFICATE-----'
   ```

   Replication with SSL is set up between a source server hosted in the domain "companya.com" and a replica server hosted in Azure Database for MySQL - Flexible Server. This stored procedure is run on the replica.

   ```sql
   CALL mysql.az_replication_change_master('master.companya.com', 'syncuser', 'P@ssword!', 3306, 'mysql-bin.000002', 120, @cert);
   ```
   ```sql
   CALL mysql.az_replication_change_master_with_gtid('master.companya.com', 'syncuser', 'P@ssword!', 3306, @cert);
   ```

   *Replication without SSL*

   Replication without SSL is set up between a source server hosted in the domain "companya.com" and a replica server hosted in Azure Database for MySQL - Flexible Server. This stored procedure is run on the replica.

   ```sql
   CALL mysql.az_replication_change_master('master.companya.com', 'syncuser', 'P@ssword!', 3306, 'mysql-bin.000002', 120, '');
   ```
   ```sql
   CALL mysql.az_replication_change_master_with_gtid('master.companya.com', 'syncuser', 'P@ssword!', 3306, '');
   ```

1. Start replication.

   Call the `mysql.az_replication_start` stored procedure to start replication.

   ```sql
   CALL mysql.az_replication_start;
   ```

1. Check replication status.

   Call the [`show slave status`](https://dev.mysql.com/doc/refman/5.7/en/show-slave-status.html) command on the replica server to view the replication status.

   ```sql
   show slave status;
   ```

  To know the correct status of replication, refer to replication metrics - **Replica IO Status** and **Replica SQL Status** under monitoring page.

  If the `Seconds_Behind_Master` is "0", replication is working well. `Seconds_Behind_Master` indicates how late the replica is. If the value isn't "0", it means that the replica is processing updates.

## Other useful stored procedures for Data-in replication operations

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

   ```sql
   SHOW BINLOG EVENTS [IN 'log_name'] [FROM pos][LIMIT [offset,] row_count]
   ```

  :::image type="content" source="./media/how-to-data-in-replication/show-binary-log.png" alt-text="Show binary log results":::

## Next steps

- Learn more about [Data-in replication](concepts-data-in-replication.md) for Azure Database for MySQL - Flexible Server.
 

