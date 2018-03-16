---
title: 'Getting Started with Azure Database for MySQL Data-in Replication | Microsoft Docs'
description: 'This topic introduces how to set up data-in replication step by step.'
services: mysql
author: mswutao
ms.author: wuta
manager: Jason.M.Anderson
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 01/02/2018
---
# Getting Started with Azure Database for MySQL Data-in Replication
In this article, you will learn how to set up Azure Database for MySQL Data-in replication by configuring primary and replica servers and link them for synchronization.

This article assumes that you have at least some prior experience with MySQL Server and Database.

For an overview of Azure Database for MySQL data-in replication, see [Data-in replication concept](./concepts-data-in.md).

## Step 1 – Create a New MySQL Server for Data-in Replication

### Create a new MySQL server
Create a new MySQL server - replica.mysql.database.azure.com. Refer to [Create an Azure Database for MySQL server by using the Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md) for server creation. This server is the "replica (slave)" server in Data-in Replication.

### Create same user accounts and corresponding privileges
Since user accounts are not replicated from primary server to replica server, you need to manually create all accounts and corresponding privileges on this newly created MySQL server.

## Step 2 – Config Primary Server

### Primary server settings
MySQL Data-in Replication requires parameter *lower_case_table_names* to be consistent between the primary and replica servers. This parameter is 1 in default on Azure Database for MySQL. Assume the server name is companya.com.

```sql
SET GLOBAL lower_case_table_names = 1;
```

### Set the primary server to read-only mode and restart
Before starts to dump out database, the server needs to be locked. Evaluate the impact to your business and schedule the maintenance window in off-peak time.

```sql
FLUSH TABLES WITH READ LOCK;
SET GLOBAL read_only = ON;
```

### Get binary log file name and offset 
Run the "show master status" command to ascertain the current binary log file name and offset.

```sql
show master status;
```

The results should be like following:

![show master status results](./media/howto-data-in/show-master-status-results.png)

## Step 3 – Dump and Restore Database

### Dump all databases from primary server
You can use mysqldump to dump databases from your primary – the existing server. For details, refer to [Dump & Restore](./concepts-migrate-dump-restore.md).

Please note: it is unnecessary to dump MySQL library and test library.

### Set primary server to read/write mode
Once the database has been dumped, change the primary MySQL server setting back to read/write mode.

```sql
SET GLOBAL read_only = OFF;
UNLOCK TABLES;
```

### Create a new account and set up permission:

```sql
CREATE USER 'syncuser'@'%' IDENTIFIED BY 'yourpassword';
GRANT REPLICATION SLAVE ON *.* TO ' syncuser'@'%';
```

### Restore dump file to new server created in step 1
Refer to [Dump & Restore](./concepts-migrate-dump-restore.md) about how to restore a dump file to a MySQL server.

Please note: if the dump file is large, please upload it to virtual machine on Azure, and then restore it into the MySQL server from the virtual machine.

## Step 4 – Link Primary and Replica Server to start Data-in Replication

### Set primary server
All Data-in Replication functions are done by store procedures. You can find all procedures at [MySQL Data-in Replication Store Procedures](./reference-data-in-store-procedures.md)

To link two servers and start to replicate, you need to log on to your target replica server (replica.mysql.database.azure.com in this case), then set the external instance as primary server by using *mysql.az_replication_change_primary* procedure. The primary binary log file name and offset are the results we got in Step 2.

```sql
CALL mysql.az_replication_change_primary('primary.companya.com', 'syncuser', 'yourpassowrd', 3306, 'mysql-bin.000002', 120);
```

### Start to replicate
Call Store procedure *mysql.az_replication_start* to start the replication.

```sql
CALL mysql.az_replication_start();
```

### Check status
Call *show slave status* command on replica server to see replication status.

```sql
show slave status ();
```

If state of *SLAVE_IO_Running* and *Slave_SQL_Running* are "yes", that means the replication works well.

Congratulations! You have created a replication between primary and replica server.

## Other Store Procedures

### Stop Data-in Replication

```sql
CALL mysql.az_replication_stop ();
```

### Remove Data-in Replication
Call this procedure to remove the relationship between primary and replica server.

```sql
CALL mysql.az_replication_remove_primary ();
```

## Next steps
For more info about Azure Database for MySQL and Replication, see:

- [MySQL Data-in Replication Concept](./concepts-data-in.md)
- [Azure Database for MySQL Overview](./overview.md)
- [MySQL Data-in Replication Store Procedures](./reference-data-in-store-procedures.md)
