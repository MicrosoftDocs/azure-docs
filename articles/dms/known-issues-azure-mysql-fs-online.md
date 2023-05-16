---
title: Known issues with migrations to Azure MySQL Database
description: Learn about known migration issues associated with migrations to Azure MySQL Database
author: karlaescobar
ms.author: karlaescobar
ms.reviewer: sanjaymi
ms.date: 10/04/2022
ms.service: dms
ms.topic: troubleshooting
ms.custom: mvc
---

# Known Issues With Migrations To Azure Database for MySQL

Known issues associated with migrations to Azure Database for MySQL are described in the following sections.

## Incompatible SQL Mode

One or more incompatible SQL modes can cause a number of different errors. Below is an example error along with server modes that should be looked at if this error occurs.``

- **Error**: An error occurred while preparing the table '{table}' in database '{database}' on server '{server}' for migration during activity '{activity}'. As a result, this table will not be migrated.

  **Limitation**: This error occurs when one of the below SQL modes is set on one server but not the other server.

  **Workaround**: 

    | NO_ZERO_DATE         | NO_AUTO_CREATE_USER |
    | ------------- | ------------- |
    | When the default value for a date on a table or the data is 0000-00-00 on the source, and the target server has the NO_ZERO_DATE SQL mode set, the schema and/or data migration will fail. There are two possible workarounds, the first is to change the default values of the columns to be NULL or a valid date. The second option, is to remove the NO_ZERO_DATE SQL mode from the global SQL mode variable. | When running migrations from MySQL source server 5.7 to MySQL target server 8.0 that are doing **schema migration of routines**, it will run into errors if no_auto_create_user SQL mode is set on MySQL source server 5.7. |

## Binlog Retention Issues

- **Error**: 
    - Binary log is not open.
    - Could not find first log file name in binary log index file.

  **Limitation**: This error occurs if binlog retention period is too short.

  **Workaround**: There are multiple variables that can be configured in this case: binlog_expire_logs_seconds determines the retention period and binlog deletion can be prevented altogether by setting binlog_expire_logs_auto_purge off. MySQL 5.7 has deprecated system variable expire_logs_days.

## Timeout Obtaining Table Locks

- **Error**: An exception occurred while attempting to acquire a read lock on the server '{server}' for consistent view creation.

  **Limitation**: This error occurs when there is a timeout while obtaining locks on all the tables when transactional consistency is enabled.

  **Workaround**: Ensure that the selected tables are not locked or that no long running transactions are running on them.

## Write More Than 4 MB of Data to Azure Storage

- **Error**: The request body is too large and exceeds the maximum permissible limit.

  **Limitation**: This error likely occurs when there are too many tables to migrate (>10k). There is a 4 MB limit for each call to the Azure Storage service.

  **Workaround**: Please reach out to support by [creating a support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview?DMC=troubleshoot) and we can provide custom scripts to access our REST APIs directly.

## Next steps

* View the tutorial [Migrate Azure Database for MySQL - Single Server to Flexible Server online using DMS via the Azure portal](tutorial-mysql-azure-single-to-flex-online-portal.md).
* View the tutorial [Migrate Azure Database for MySQL - Single Server to Flexible Server offline using DMS via the Azure portal](tutorial-mysql-azure-mysql-offline-portal.md).
