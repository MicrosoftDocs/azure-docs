---
title: MySQL server operational best practices - Azure Database for MySQL
description: This article describes the best practices to operate your MySQL database on Azure.
author: manishku
ms.author: kummanish
ms.service: mysql
ms.topic: conceptual
ms.date: 04/13/2020
---

# Best practice of server operations for Azure Database for MySQL

Learn about the best practices for working with Azure Database for MySQL. As we add new capabilities to the platform, we will continue to focus on refining the best practices detailed in this section.

## Azure Database for MySQL Operational Guidelines 

The following are operational guidelines that should be followed when working with your Azure Database for MySQL to improve the performance of your database: 

* Monitor your memory, CPU, and storage usage. You can [setup alerts](howto-alert-on-metric.md) to notify you when usage patterns change or when you approach the capacity of your deployment, so that you can maintain system performance and availability. 

* [Scale up your DB instance](howto-create-manage-server-portal.md) when you are approaching storage capacity limits. You should have some buffer in storage and memory to accommodate unforeseen increases in demand from your applications. You can also [enable the storage autogrow](howto-auto-grow-storage-portal.md) feature ‘ON’ just to ensure that the service automatically scales the storage as it nears the storage limits. 

* Enables [local or geo-redundant backups](howto-restore-server-portal.md#set-backup-configuration) based on the requirement of the business. Also, you can set up the retention period which ensures the backup being available for the service to recover. 

* If your database workload requires more I/O than you have provisioned, recovery or other transactional operations for your database will be slow. To increase the I/O capacity of a DB instance, do any or all of the following: 

    * Azure database for MySQL provides IOPS scaling at the rate of three IOPS per GB storage provisioned. [Increase the provisioned storage](howto-create-manage-server-portal.md#scale-storage-up) to scale the IOPS for better performance. 

    * If you are already using Provisioned IOPS storage, provision [additional throughput capacity](howto-create-manage-server-portal.md#scale-storage-up). 

* Database workload can also be limited due to CPU or memory and this can have serious impact on the transaction processing. You should make sure that the compute can be moved between [General Purpose or Memory Optimized](concepts-pricing-tiers.md) SKU options.

* If your client application is caching the Domain Name Service (DNS) data of your DB instances, set a time-to-live (TTL) value of less than 30 seconds. Because the underlying IP address of a DB instance can change after a failover, caching the DNS data for an extended time can lead to connection failures if your application tries to connect to an IP address that no longer is in service.

* Test failover for your DB instance to understand how long the process takes for your use case and to ensure that the application that accesses your DB instance can automatically connect to the new DB instance after failover.

* Make sure your tables have a primary or unique key as you operate on the Azure Database for MySQL. This helps in a lot taking backups, replica etc. and improves performance.

### Database operations 

* Make sure your tables have a primary or unique key as you operate on the Azure Database for MySQL. This helps in a lot taking backups, replica etc. and improves performance.</br> 

* While operating with Azure Database for MySQL, you should use good connection management practices, such as connection pooling. This will help in better resource utilization while we operate under the [connection limits](concepts-limits.md#maximum-connections) of the database SKU you operate on. </br> 

* Do not burst too many connections in short term, as that might lead to failed connection setup. If the application requires such high connection requirements, say during peak time, make sure your setup has a larger connection pool. </br> 

* If you are using replica, use [ProxySQL to balance off load](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/scaling-an-azure-database-for-mysql-workload-running-on/ba-p/1105847) between the primary server and the readable secondary replica server. See the setup steps here. </br> 

* When provisioning the resource, make sure you [enabled the autogrow](howto-auto-grow-storage-portal.md) for your Azure Database for MySQL. This does not add any additional cost and will protect the database from any storage bottlenecks that you might run into. </br> 

* Ensure that the client and the server are in the same Azure region to ensure that there is a good network speed for the application.

### Manage the innodb system tablespace for Azure Database for MySQL

1.	The system `tablespace` size cannot be shrink. Once the `ibdata` file size grown, it will never shrink even if you drop the data from the table, or move the table to file-per-table `tablespaces`.

2.	The Azure Database for MySQL supports the biggest 1TB in a single data file. If your database size is bigger than 1TB, you should create the table in **innodb_file_per_table** `tablespace`. If you have a single table size larger than 1TB, you should use the partition table.

3.	When the MySQL server startup or fail over, it will open every single `tablespace` file to check the LSN for recovery in sequential. So if you have a large number `tablespace` in your server, the engine startup will be very slow due to the sequential tablespace scan. 

### Best practice for using Innodb in Azure Database for MySQL

* If the total table number is less than 500, the file-per-table tablespace is preferred. You should set innodb_file_per_table = ON before you create the table. 

* If the total table number might large than 500, you should consider the table size for your individual table. 
    * For a small table, which has a size less than 5GB, you should consider using the system tablespace 

   ```sql
   CREATE TABLE tbl_name ... *TABLESPACE* = *innodb_system*;
   ```

    * For a large table, you should still consider using the file-per-table tablespace to avoid the system tablespace file hit max storage limit.

* If you have a very large table might potentially grow beyond 1TB. You should consider partitioning your table at table creation (https://dev.mysql.com/doc/refman/5.7/en/partitioning.html).

* Having more than 10000 tablets in a single MySQL server is not recommended. You should consider splitting the table into smaller MySQL servers. 

## Next steps

[Best practice for performance of Azure Database for MySQL](concept-performance-best-practices.md)
[Best practice for monitoring your Azure Database for MySQL](concept-monitoring-best-practices.md)
[Troubleshooting your existing Azure Database for MySQL](howto-troubleshoot-mysql.md)
[Get started with Azure Database for MySQL](quickstart-create-mysql-server-database-using-azure-portal.md)