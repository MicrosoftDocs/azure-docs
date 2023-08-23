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

One or more incompatible SQL modes can cause many different errors. Below is an example error along with server modes that should be looked at if this error occurs.

- **Error**: An error occurred while preparing the table '{table}' in database '{database}' on server '{server}' for migration during activity '{activity}'. As a result, this table won't be migrated.

  **Limitation**: This error occurs when one of the below SQL modes is set on one server but not the other server.

  **Workaround**: 

    | NO_ZERO_DATE         | NO_AUTO_CREATE_USER |
    | ------------- | ------------- |
    | When the default value for a date on a table or the data is 0000-00-00 on the source, and the target server has the NO_ZERO_DATE SQL mode set, the schema and/or data migration will fail. There are two possible workarounds, the first is to change the default values of the columns to be NULL or a valid date. The second option is to remove the NO_ZERO_DATE SQL mode from the global SQL mode variable. | When running migrations from MySQL source server 5.7 to MySQL target server 8.0 that are doing **schema migration of routines**, it will run into errors if no_auto_create_user SQL mode is set on MySQL source server 5.7. |

## Binlog Retention Issues

- **Error**: Fatal error reading binlog. This error may indicate that the binlog file name and/or the initial position were specified incorrectly.

  **Limitation**: This error occurs if binlog retention period is too short.

  **Workaround**: There are multiple variables that can be configured in this case: binlog_expire_logs_seconds determines the retention period and binlog deletion can be prevented altogether by setting binlog_expire_logs_auto_purge off. MySQL 5.7 has deprecated system variable expire_logs_days.

## Timeout Obtaining Table Locks

- **Error**: An exception occurred while attempting to acquire a read lock on the server '{server}' for consistent view creation.

  **Limitation**: This error occurs when there is a timeout while obtaining locks on all the tables when transactional consistency is enabled.

  **Workaround**: Ensure that the selected tables aren't locked or that no long running transactions are running on them.

## Write More Than 4 MB of Data to Azure Storage

- **Error**: The request body is too large and exceeds the maximum permissible limit.

  **Limitation**: This error likely occurs when there are too many tables to migrate (>10k). There's a 4 MB limit for each call to the Azure Storage service.

  **Workaround**: Reach out to support by [creating a support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview?DMC=troubleshoot) and we can provide custom scripts to access our REST APIs directly.

## Duplicate key entry issue

- **Error**: The error is often a symptom of timeouts, network issues or target scaling.

  **Potential error message**: A batch couldn't be written to the table '{table}' due to a SQL error raised by the target server. For context, the batch contained a subset of rows returned by the following source query.

  **Limitation**: This error can be caused by timeout or broken connection to the target, resulting in duplicate primary keys. It may also be related to multiple migrations to the target running at the same time, or the user having test workloads running on the target while the migration is running. Additionally, the target may require primary keys to be unique, even though they aren't required to be so on the source.

  **Workaround**: To resolve this issue, ensure that there are no duplicate migrations running and that the source primary keys are unique. If error persists, reach out to support by [creating a support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview?DMC=troubleshoot) and we can provide custom scripts to access our REST APIs directly.

## Replicated operation had mismatched rows error

- **Error**: Online Migration Fails to Replicate Expected Number of Changes.

  **Potential error message**: An error occurred applying records to the target server which were read from the source server's binary log. The changes started at binary log '{mysql-bin.log}' and position '{position}' and ended at binary log '{mysql-bin.log}' and position '{position}'. All records on the source server prior to position '{position}' in binary log '{mysql-bin.log}' have been committed to the target.  

  **Limitation**: On the source, there were insert and delete statements into a table, and the deletions were by an apparent unique index.

  **Workaround**: We recommend migrating the table manually.

## Table data truncated error

- **Error**: Enum column has a null value in one or more rows and the target SQL mode is set to strict.

  **Potential error message**: A batch couldn't be written to the table '{table}' due to a data truncation error. Please ensure that the data isn't too large for the data type of the MySQL table column. If the column type is an enum, make sure SQL Mode isn't set as TRADITIONAL, STRICT_TRANS_TABLES or STRICT_ALL_TABLES and is the same on source and target.  

  **Limitation**: The error occurs when historical data was written to the source server when they had certain setting, but when it's changed, data cannot move.

  **Workaround**: To resolve the issue, we recommend changing the target SQL mode to non-strict or changing all null values to be valid values.

## Creating object failure

- **Error**: An error occurred after view validation failed. 

  **Limitation**: The error occurs when trying to migrate a view and the table that the view is supposed to be referencing cannot be found.

  **Workaround**: We recommend migrating views manually.

## Unable to find table

- **Error**: An error occurred as referencing table cannot be found.

  **Potential error message**: The pipeline was unable to create the schema of object '{object}' for activity '{activity}' using strategy MySqlSchemaMigrationViewUsingTableStrategy because of a query execution.   

  **Limitation**: The error can occur when the view is referring to a table that has been deleted or renamed, or when the view was created with incorrect or incomplete information.

  **Workaround**: We recommend migrating views manually.

## All pooled connections broken

- **Error**: All connections on the source server were broken.  

  **Limitation**: The error occurs when all the connections that are acquired at the start of initial load are lost due to server restart, network issues, heavy traffic on the source server or other transient problems. This error isn't recoverable. 

  **Workaround**: The migration must be restarted, and we recommend increasing the performance of the source server. Another issue is scripts that kill long running connections, prevents these scripts from working.

## Consistent snapshot broken  

  **Limitation**: The error occurs when the customer performs DDL during the initial load of the  migration instance. 

  **Workaround**: To resolve this issue, we recommend refraining from making DDL changes during the Initial Load.

## Foreign key constraint

- **Error**: The error occurs when there is a change in the referenced foreign key type from the table.

  **Potential error message**: Referencing column '{pk column 1}' and referenced column '{fk column 1}' in foreign key constraint '{key}' are incompatible.

  **Limitation**: The error can cause schema migration of a table to fail, as the PK column in table 1 may not be compatible with the FK column in table 2.

  **Workaround**: To resolve this issue, we recommend dropping the foreign key and re-creating it after the migration process is completed.

## Next steps

* View the tutorial [Migrate Azure Database for MySQL - Single Server to Flexible Server online using DMS via the Azure portal](tutorial-mysql-azure-single-to-flex-online-portal.md).
* View the tutorial [Migrate Azure Database for MySQL - Single Server to Flexible Server offline using DMS via the Azure portal](tutorial-mysql-azure-mysql-offline-portal.md).
