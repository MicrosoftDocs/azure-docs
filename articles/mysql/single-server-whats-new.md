---
title: What's new in Azure Database for MySQL Single Server
description: Learn about recent updates to Azure Database for MySQL - Single server, a relational database service in the Microsoft cloud based on the MySQL Community Edition.
author: hjtoland3
ms.service: mysql
ms.author: jtoland
ms.custom: mvc
ms.topic: conceptual
ms.date: 06/17/2021
---
# What's new in Azure Database for MySQL - Single Server?

[!INCLUDE[applies-to-mysql-single-server](includes/applies-to-mysql-single-server.md)]

Azure Database for MySQL is a relational database service in the Microsoft cloud. The service is based on the [MySQL Community Edition](https://www.mysql.com/products/community/) (available under the GPLv2 license) database engine and supports versions 5.6, 5.7, and 8.0. [Azure Database for MySQL - Single Server](./overview.md#azure-database-for-mysql---single-server) is a deployment mode that provides a fully managed database service with minimal requirements for customizations of database. The Single Server platform is designed to handle most database management functions such as patching, backups, high availability, and security, all with minimal user configuration and control.

This article summarizes new releases and features in Azure Database for MySQL - Single Server beginning in January 2021. Listings appear in reverse chronological order, with the most recent updates first.

## June 2021
  
This release of Azure Database for MySQL - Single Server includes the following updates.

- **Enabled the ability to change the server parameter `activate_all_roles_on_login` from Portal/CLI for MySQL 8.0**

  Users can now change the value of the activate_all_roles_on_login parameter using the Azure portal and CLI. This parameter helps to configure whether to enable automatic activation of all granted roles when users sign in to the server. For more information, see  [Server System Variables](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html).

- **Enabled the parameter `redirect_enabled` by default**

  With this release, the parameter `redirect_enabled` will be enabled by default. Redirection aims to reduce network latency between client applications and MySQL servers by allowing applications to connect directly to backend server nodes. Support for redirection in PHP applications is available through the [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) extension, developed by Microsoft. For more information, see the article [Connect to Azure Database for MySQL with redirection](howto-redirection.md).

- **Addressed MySQL Community Bugs #29596969 and #94668**

  This release addresses an issue with the default expression being ignored in a CREATE TABLE query if the field was marked as PRIMARY KEY for MySQL 8.0. (MySQL Community Bug #29596969, Bug #94668). For more information, see [MySQL Bugs: #94668: Expression Default is made NULL during CREATE TABLE query, if field is made PK](https://bugs.mysql.com/bug.php?id=94668)

- **Addressed an issue with duplicate table names in "SHOW TABLE" query**

  We've introduced a new function to give a fine-grained control of the table cache during the table operation. Because of a code defect in the new feature, the entry in the directory cache might be miss configured or added and cause the unexpected behavior like return two tables with the same name. The directory cache only works for the “SHOW TABLE” related query; it won't impact any DML or DDL queries. This issue is completely resolved in this release.

- **Increased the default value for the server parameter `max_heap_table_size` to help reduce temp table spills to disk**

  With this release, the max allowed value for the parameter `max_heap_table_size` has been changed to 8589934592 for General Purpose 64 vCore and Memory Optimize 32 vCore.

- **Addressed an issue with setting the value of the parameter `sql_require_primary_key` from the portal**

  Users can now modify the value of the parameter `sql_require_primary_key` directly from the Azure portal.

- **General Availability of planned maintenance notification**

  This release provides General Availability of planned maintenance notifications in Azure Database for MySQL - Single Server. For more information, see the article [Planned maintenance notification](concepts-planned-maintenance-notification.md).

- **Enabled the parameter redirect_enabled by default**

   With this release, the redirect_enabled parameter is enabled by default. Redirection aims to reduce network latency between client applications and MySQL servers by allowing applications to connect directly to backend server nodes. Support for redirection in PHP applications is available through the [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) extension, developed by Microsoft. For more information, see [Connect to Azure Database for MySQL with redirection](https://docs.microsoft.com/en-us/azure/mysql/howto-redirection).
             
   Note: 
   
   . Enabling redirection is not supported with private link setup , if it is already enabled , you will have connections issue and to resolve it make sure to disable the redirectiom  by setting the redirect_enabled parameter to “OFF”, and restart the PHP application. 
   
   . If you have a PHP application that uses the [mysqlnd_azure](https://docs.microsoft.com/en-us/azure/mysql/howto-redirection) redirection driver to connect to Azure Database for MySQL (with redirection enabled by default), you might face a data encoding issue that impacts your insert transactions.

   To resolve this issue, either:

  - In Azure portal, disable the redirection by setting the redirect_enabled parameter to “OFF”, and restart the PHP application to clear the driver cache after the change.
  - Explicitly set the charset related parameters at the session level, based on your settings after the connection is established (for example “set names utf8mb4”).

## February 2021

This release of Azure Database for MySQL - Single Server includes the following updates.

- Added new stored procedures to support the global transaction identifier (GTID) for data-in for the version 5.7 and 8.0 Large Storage server.
- Updated to support MySQL versions to 5.6.50 and 5.7.32.

## January 2021

This release of Azure Database for MySQL - Single Server includes the following updates.

- Enabled "reset password" to automatically fix the first admin permission.
- Exposed the `auto_increment_increment/auto_increment_offset` server parameter and `session_track_gtids`.
- Added new stored procedures for control innodb buffer pool dump/restore.
- Exposed the innodb warm up related server parameter for large storage server.

## Contacts

If you have questions about or suggestions for working with Azure Database for MySQL, contact the Azure Database for MySQL Team ([@Ask Azure DB for MySQL](mailto:AskAzureDBforMySQL@service.microsoft.com)). This email address isn't a technical support alias.

In addition, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/forums/597982-azure-database-for-mysql).

## Next steps

- Learn more about [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/server/).
- Browse the [public documentation](./single-server/index.yml) for Azure Database for MySQL – Single Server.
- Review details on [troubleshooting common errors](./howto-troubleshoot-common-errors.md).
