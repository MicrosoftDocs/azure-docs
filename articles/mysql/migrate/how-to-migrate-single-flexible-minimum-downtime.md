---
title: "Tutorial: Migrate Azure Database for MySQL – Single Server to Azure Database for MySQL – Flexible Server with open-source tools"
description: This article describes how to perform a minimal-downtime migration of Azure Database for MySQL – Single Server to Azure Database for MySQL – Flexible Server.
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 05/03/2023
ms.service: mysql
ms.subservice: single-server
ms.custom: devx-track-linux
ms.topic: how-to
---

# Migrate Azure Database for MySQL - Single Server to Azure Database for MySQL - Flexible Server with open-source tools

You can migrate an instance of Azure Database for MySQL - Single Server to Azure Database for MySQL - Flexible Server with minimum downtime to your applications by using a combination of open-source tools such as mydumper/myloader and Data-in replication.

> [!NOTE]
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

Data-in replication is a technique that replicates data changes from the source server to the destination server based on the binary log file position method. In this scenario, the MySQL instance operating as the source (on which the database changes originate) writes updates and changes as "events" to the binary log. The information in the binary log is stored in different logging formats according to the database changes being recorded. Replicas are configured to read the binary log from the source and to execute the events in the binary sign in the replica's local database.

If you set up Data-in replication to synchronize data from one instance of Azure Database for MySQL to another, you can do a selective cutover of your applications from the primary (or source database) to the replica (or target database).

In this tutorial, you'll use mydumper/myloader and Data-in replication to migrate a sample database ([classicmodels](https://www.mysqltutorial.org/mysql-sample-database.aspx)) from an instance of Azure Database for MySQL - Single Server to an instance of Azure Database for MySQL - Flexible Server, and then synchronize data.

In this tutorial, you learn how to:

- Configure Network Settings for Data-in replication for different scenarios.
- Configure Data-in replication between the primary and replica.
- Test the replication.
- Cutover to complete the migration.

## Prerequisites

To complete this tutorial, you need:

- An instance of Azure Database for MySQL Single Server running version 5.7 or 8.0.

    > [!Note]
    > If you're running Azure Database for MySQL Single Server version 5.6, upgrade your instance to 5.7 and then configure data in replication. To learn more, see [Major version upgrade in Azure Database for MySQL - Single Server](../single-server/how-to-major-version-upgrade.md).

- An instance of Azure Database for MySQL Flexible Server. For more information, see the article [Create an instance in Azure Database for MySQL Flexible Server](../flexible-server/quickstart-create-server-portal.md).

    > [!Note]
    > Configuring Data-in replication for zone redundant high availability servers is not supported. If you would like to have zone redundant HA for your target server, then perform these steps:
    >
    > 1. Create the server with Zone redundant HA enabled
    > 2. Disable HA
    > 3. Follow the article to setup data-in replication
    > 4. Post cutover remove the Data-in replication configuration
    > 5. Enable HA
    >
    > *Make sure that **[GTID_Mode](../flexible-server/concepts-read-replicas.md#global-transaction-identifier-gtid)** has the same setting on the source and target servers.*

- To connect and create a database using MySQL Workbench. For more information, see the article [Use MySQL Workbench to connect and query data](../flexible-server/connect-workbench.md).
- To ensure that you have an Azure VM running Linux in same region (or on the same VNet, with private access) that hosts your source and target databases.
- To install mysql client or MySQL Workbench (the client tools) on your Azure VM. Ensure that you can connect to both the primary and replica server. For the purposes of this article, mysql client is installed.
- To install mydumper/myloader on your Azure VM. For more information, see the article [mydumper/myloader](concepts-migrate-mydumper-myloader.md).
- To download and run the sample database script for the [classicmodels](https://www.mysqltutorial.org/wp-content/uploads/2018/03/mysqlsampledatabase.zip) database on the source server.
- Configure [binlog_expire_logs_seconds](../flexible-server/concepts-server-parameters.md#binlog_expire_logs_seconds) on the source server to ensure that binlogs aren’t purged before the replica commits the changes. Post successful cut over you can reset the value.

## Configure networking requirements

To configure the Data-in replication, you need to ensure that the target can connect to the source over port 3306. Based on the type of endpoint set up on the source, perform the appropriate following steps.

- If a public endpoint is enabled on the source, then ensure that the target can connect to the source by enabling “Allow access to Azure services” in the firewall rule. To learn more, see [Firewall rules - Azure Database for MySQL](../single-server/concepts-firewall-rules.md#connecting-from-azure).
- If a private endpoint and *[Deny public access](../single-server/concepts-data-access-security-private-link.md#deny-public-access-for-azure-database-for-mysql)* is enabled on the source, then install the private link in the same VNet that hosts the target. To learn more, see [Private Link - Azure Database for MySQL](../single-server/concepts-data-access-security-private-link.md).

## Configure Data-in replication

To configure Data in replication, perform the following steps:

1. Sign in to the Azure VM on which you installed the mysql client tool.

2. Connect to the source and target using the mysql client tool.

3. Use the mysql client tool to determine whether log_bin is enabled on the source by running the following command:

    ```sql
    SHOW VARIABLES LIKE 'log_bin';
    ```

    > [!Note]
    > With Azure Database for MySQL Single Server with the large storage, which supports up to 16TB, this enabled by default.

    > [!Tip]
    > With Azure Database for MySQL Single Server, which supports up to 4TB, this is not enabled by default. However, if you promote a [read replica](../single-server/how-to-read-replicas-portal.md) for the source server and then delete read replica, the parameter will be set to ON.

4. Based on the SSL enforcement for the source server, create a user in the source server with the replication permission by running the appropriate command.

    If you're using SSL, run the following command:

    ```sql
    CREATE USER 'syncuser'@'%' IDENTIFIED BY 'yourpassword';
    GRANT REPLICATION SLAVE ON *.* TO ' syncuser'@'%' REQUIRE SSL;
    ```

    If you're not using SSL, run the following command:

    ```sql
    CREATE USER 'syncuser'@'%' IDENTIFIED BY 'yourpassword';
    GRANT REPLICATION SLAVE ON *.* TO ' syncuser'@'%';
    ```

5. To back up the database using mydumper, run the following command on the Azure VM where we installed the mydumper\myloader:

    ```bash
    mydumper --host=<primary_server>.mysql.database.azure.com --user=<username>@<primary_server> --password=<Password> --outputdir=./backup --rows=100000 -G -E -R -z --trx-consistency-only --compress --build-empty-files --threads=16 --compress-protocol --ssl  --regex '^(classicmodels\.)' -L mydumper-logs.txt
    ```

    > [!TIP]
    > The option **--trx-consistency-only** is a required for transactional consistency while we take backup.
    >
    > - The mydumper equivalent of mysqldump's --single-transaction.
    > - Useful if all your tables are InnoDB.
    > - The "main" thread only needs to hold the global lock until the "dump" threads can start a transaction.
    > - Offers the shortest duration of global locking

    The "main" thread only needs to hold the global lock until the "dump" threads can start a transaction.

    The variables in this command are explained below:

    HOW-TO-MANAGE-FIREWALL-PORTAL **--host:** Name of the primary server
    - **--user:** Name of a user (in the format username@servername since the primary server is running Azure Database for MySQL - Single Server). You can use server admin or a user having SELECT and RELOAD permissions.
    - **--Password:** Password of the user above

   For more information about using mydumper, see [mydumper/myloader](../single-server/concepts-migrate-mydumper-myloader.md)

6. Read the metadata file to determine the binary log file name and offset by running the following command:

    ```bash
    cat ./backup/metadata 
    ```

    In this command, **./backup** refers to the output directory used in the command in the previous step.

    The results should appear as shown in the following image:

    :::image type="content" source="./media/how-to-migrate-single-flexible-minimum-downtime/metadata.png" alt-text="Continuous sync with the Azure Database Migration Service":::

    Make sure to note the binary file name for use in later steps.

7. Restore the database using myloader by running the following command:

    ```bash
    myloader --host=<servername>.mysql.database.azure.com --user=<username> --password=<Password> --directory=./backup --queries-per-transaction=100 --threads=16 --compress-protocol --ssl --verbose=3 -e 2>myloader-logs.txt
    ```

    The variables in this command are explained below:

    - **--host:** Name of the replica server
    - **--user:** Name of a user. You can use server admin or a user with read\write permission capable of restoring the schemas and data to the database
    - **--Password:** Password for the user above

8. Depending on the SSL enforcement on the primary server, connect to the replica server using the mysql client tool and perform the following the steps.

    - If SSL enforcement is enabled, then:

        i. Download the certificate needed to communicate over SSL with your Azure Database for MySQL server from [here](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem).

        ii. Open the file in notepad and paste the contents to the section “PLACE YOUR PUBLIC KEY CERTIFICATE'S CONTEXT HERE“.

        ```sql
        SET @cert = '-----BEGIN CERTIFICATE-----
        PLACE YOUR PUBLIC KEY CERTIFICATE'S CONTEXT HERE 
        -----END CERTIFICATE-----'
        ```

        iii. To configure Data in replication, run the following command:

        ```sql
        CALL mysql.az_replication_change_master('<Primary_server>.mysql.database.azure.com', '<username>@<primary_server>', '<Password>', 3306, '<File_Name>', <Position>, @cert);
        ```

        > [!Note]
        > Determine the position and file name from the information obtained in step 6.

    - If SSL enforcement isn't enabled, then run the following command:

        ```sql
        CALL mysql.az_replication_change_master('<Primary_server>.mysql.database.azure.com', '<username>@<primary_server>', '<Password>', 3306, '<File_Name>', <Position>, ‘’);
        ```

9. To start replication from the replica server, call the below stored procedure.

    ```sql
    call  mysql.az_replication_start;
    ```

10. To check the replication status, on the replica server, run the following command:

     ```sql
     show slave status \G; 
     ```

    > [!Note]
    > If you're using MySQL Workbench the \G modifier is not required.

    If the state of *Slave_IO_Running* and *Slave_SQL_Running* are Yes and the value of *Seconds_Behind_Master* is 0, then replication is working well. Seconds_Behind_Master indicates how late the replica is. If the value is something other than 0, then  the replica is processing updates.

## Testing the replication (optional)

To confirm that Data-in replication is working properly, you can verify that the changes to the tables in primary were replicated to the replica.

1. Identify a table to use for testing, for example, the Customers table, and then confirm that the number of entries it contains is the same on the primary and replica servers by running the following command on each:

    ```sql
    select count(*) from customers;
    ```

2. Make a note of the entry count for later comparison.

    To test replication, try adding some data to the customer tables on the primary server and see then verify that the new data is replicated. In this case, you’ll add two rows to a table on the primary server and then confirm that they're replicated on the replica server.

3. In the Customers table on the primary server, insert rows by running the following command:

    ```sql
    insert  into `customers`(`customerNumber`,`customerName`,`contactLastName`,`contactFirstName`,`phone`,`addressLine1`,`addressLine2`,`city`,`state`,`postalCode`,`country`,`salesRepEmployeeNumber`,`creditLimit`) values 
    (<ID>,'name1','name2','name3 ','11.22.5555','54, Add',NULL,'Add1',NULL,'44000','country',1370,'21000.00');
    ```

4. To check the replication status, call the *show slave status \G* to confirm that replication is working as expected.

5. To confirm that the count is the same, on the replica server, run the following command:

    ```sql
    select count(*) from customers;
    ```

## Ensure a successful cutover

To ensure a successful cutover, perform the following tasks:

1. Configure the appropriate server-level firewall and virtual network rules to connect to target Server. You can compare the firewall rules for the source and [target](../flexible-server/how-to-manage-firewall-portal.md#create-a-firewall-rule-when-creating-a-server) from the portal.
2. Configure appropriate logins and database level permissions in the target server. You can run *SELECT FROM mysql.user;* on the source and target servers to compare.
3. Make sure that all the incoming connections to Azure Database for MySQL Single Server are stopped.
    > [!Tip]
    > You can set the Azure Database for MySQL Single Server to read only.
4. Ensure that the replica has caught up with the primary by running *show slave status \G* and confirming that the value for the *Seconds_Behind_Master* parameter is 0.
5. Redirect clients and client applications to the target instance of Azure Database for MySQL Flexible Server.
6. Perform the final cutover by running the mysql.az_replication_stop stored procedure, which will stop replication from the replica server.
7. *Call mysql.az_replication_remove_master* to remove the Data-in replication configuration.

At this point, your applications are connected to the new Azure Database for MySQL Flexible server and changes in the source will no longer replicate to the target.
[Create and manage Azure Database for MySQL firewall rules by using the Azure portal](../single-server/how-to-manage-firewall-using-portal.md)

## Next steps

- Learn more about Data-in replication [Replicate data into Azure Database for MySQL Flexible Server](../flexible-server/concepts-data-in-replication.md) and [Configure Azure Database for MySQL Flexible Server Data-in replication](../flexible-server/how-to-data-in-replication.md)
- Learn more about [troubleshooting common errors in Azure Database for MySQL](../single-server/how-to-troubleshoot-common-errors.md).
- Learn more about [migrating MySQL to Azure Database for MySQL offline using Azure Database Migration Service](../../dms/tutorial-mysql-azure-mysql-offline-portal.md).
