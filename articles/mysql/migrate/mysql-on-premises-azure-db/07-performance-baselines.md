---
title: "Migrate MySQL on-premises to Azure Database for MySQL: Performance Baselines"
description: "Understanding the existing MySQL workload is one of the best investments that can be made to ensure a successful migration."
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 05/21/2024
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
---

# Migrate MySQL on-premises to Azure Database for MySQL: Performance Baselines

[!INCLUDE [applies-to-mysql-single-flexible-server](../../includes/applies-to-mysql-single-flexible-server.md)]

## Prerequisites

[Test plans.](06-test-plans.md)

## Overview

Understanding the existing MySQL workload is one of the best investments that can be made to ensure a successful migration. Excellent system performance depends on adequate hardware and great application design. Items such as CPU, memory, disk, and networking must be sized and configured appropriately for the anticipated load. Hardware and configuration are part of the system performance equation. The developer must understand the database query load and the most expensive queries to execute. Focusing on the most expensive queries can substantially affect the overall performance metrics.

Creating query performance baselines is vital to a migration project. The performance baselines can be used to verify the Azure landing zone configuration for the migrated data workloads. Most systems are run 24/7 and have different peak load times. It's important to capture the peak workloads for the baseline. Metrics are captured several times. Later in the document, we explore the source server parameters and how they're essential to the overall performance baseline picture. The server parameters shouldn't be overlooked during a migration project.

## Tools

Below are tools used to gather server metrics and database workload information. Use the captured metrics to determine the appropriate Azure Database for the MySQL tier and the associated scaling options.

  - [MySQL Enterprise Monitor:](https://www.mysql.com/products/enterprise/monitor.html) This nonfree, enterprise edition tool can provide a sorted list of the most expensive queries, server metrics, file I/O, and topology information

  - [Percona Monitoring and Management (PMM)](https://www.percona.com/software/database-tools/percona-monitoring-and-management) : a best-of-breed open-source database monitoring solution. It helps to reduce complexity, optimize performance, and improve the security of business-critical database environments, no matter the deployed location.

## Server parameters

MySQL server default configurations might not adequately support a workload. There's a plethora of server parameters in MySQL, but in most cases, the migration team should focus on a handful. The following parameters should be evaluated in the **source** and **target** environments. Incorrect configurations can affect the speed of the migration. We revisit these parameters again when we execute the migration steps.

  - **innodb_buffer_pool_size**: A large value ensures that in-memory resources are used first before utilizing disk I/O. Typical values range from 80% to 90% of the available memory. For example, a system with 8 GB of memory should allocate 5-6 GB for the pool size.

  - **innodb_log_file_size**: The redo logs ensure fast, durable writes. This transactional backup is helpful during a system crash. Starting with innodb_log_file_size = 512M (giving 1 GB of redo logs) should give plenty of room for writes. Write-intensive applications using MySQL 5.6 or higher should start with innodb_log_file_size = 4G.

  - **max\_connections**: This parameter can help alleviate the `Too many connections` error. The default is 151 connections. Using a connection pool at the application level is preferred, but the server connection configuration might also need to increase.

  - **innodb\_file\_per\_table**: This setting tells InnoDB if it should store data and indexes in the shared tablespace or a separate.ibd file for each table. Having a file per table enables the server to reclaim space when tables are dropped, truncated, or rebuilt. Databases containing many tables shouldn't use the table per file configuration. As of MySQL 5.6, the default value is ON. Earlier database versions should set the configuration to ON prior to loading data. This setting only affects newly created tables.

  - **innodb\_flush\_log\_at\_trx\_commit**: The default setting of one means that InnoDB is fully ACID-compliant. This lower-risk transaction configuration can have a significant overhead on systems with slow disks because of the extra syncs needed to flush each change to the redo logs. Setting the parameter to 2 is a bit less reliable because committed transactions will be flushed to the redo logs only once a second. The risk can be acceptable in some master situations, and It's a good value for a replica. A value of 0 allows for better system performance, but the database server is likelier to lose some data during a failure. The bottom line is to use the 0 value for a replica only.

  - **innodb\_flush\_method**: This setting controls how data and logs are flushed to disk. Use `O_DIRECT` when in the presence of a hardware RAID controller with a battery-protected write-back cache. Use `fdatasync` (default value) for other scenarios.

  - **innodb\_log\_buffer\_size**: This setting is the buffer size for transactions that have yet to be committed. The default value (1 MB) is acceptable. Transactions with large blob/text fields can quickly fill the buffer and trigger extra I/O load. Look at the `Innodb_log_waits` status variable, and if It's not 0, increase `innodb_log_buffer_size`.

  - **query_cache_size**: The query cache is a well-known bottleneck that can be seen during moderate concurrency. The initial value should be set to 0 to disable the cache, for example, query_cache_size = 0. This is the default on MySQL 5.6 and later.

  - **log\_bin**: This setting enables binary logging. Enabling binary logging is mandatory if the server is to act as a replication master.

  - **server\_id**: This setting is unique to identity servers in replication topologies.

  - **expire\_logs\_days**: This setting controls how many days the binary logs will be automatically purged.

  - **skip\_name\_resolve**: user to perform client hostname resolution. If the DNS is slow, the connection is slow. When disabling name resolution, the GRANT statements must use IP addresses only. Any previous GRANT statements would need to be redone to use the IP.

Run the following command to export the server parameters to a file for review. Using some simple parsing, the output can reapply the same server parameters after the migration, if appropriate, to the Azure Database for MySQL server. Reference [Configure server parameters in Azure Database for MySQL using the Azure portal](../../howto-server-parameters.md).

`mysql -u root -p -A -e "SHOW GLOBAL VARIABLES;" > settings.txt`

The MySQL 5.5.60 default installed server parameters can be found in the [appendix](15-appendix.md#default-server-parameters-mysql-55-and-azure-database-for-mysql).

Before migration begins, export the source MySQL configuration settings. Compare those values to the Azure landing zone instance settings after the migration. If any settings were modified from the default in the target Azure landing zone instance, ensure these are set back after the migration. Also, the migration user should verify the server parameters can be set before the migration.

For a list of server parameters that can't be configured, reference [Nonconfigurable server parameters](../../concepts-server-parameters.md#non-configurable-server-parameters).

### Egress and Ingress

The source and target MySQL server parameters must be modified for each respective data migration tool and path to support the fastest possible egress and ingress. Depending on the tool, the parameters could be different. For example, a tool that performs a migration in parallel might need more connections between the source and the target versus a single-threaded tool.

Review any timeout parameters that might be affected by the datasets. These include:

  - [connect\_timeout](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_connect_timeout)

  - [wait\_timeout](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_wait_timeout)

Additionally, review any parameters that affect maximums:

  - [max\_allowed\_packet](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_max_allowed_packet)

> [!NOTE]  
> A common migration error is `MySQL server has gone away`. The parameters mentioned here are the typical culprits for resolving this error.

## WWI scenario

WWI reviewed their Conference database workload and determined it had a small load. Although a basic-tier server would work for them, they didn't want to perform work later to migrate to another tier. The server being deployed will eventually host the other MySQL data workloads, so they picked the `General Performance` tier.

When reviewing the MySQL database, I found that the MySQL 5.5 server runs with the default server parameters set during the initial install.

## Next step

> [!div class="nextstepaction"]
> [Data Migration](08-data-migration.md)
