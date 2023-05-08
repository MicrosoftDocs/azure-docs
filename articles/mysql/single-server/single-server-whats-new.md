---
title: What's new in Azure Database for MySQL single server
description: Learn about recent updates to Azure Database for MySQL - Single Server, a relational database service in the Microsoft cloud based on the MySQL Community Edition.
author: hjtoland3
ms.service: mysql
ms.subservice: single-server
ms.author: jtoland
ms.custom: mvc
ms.topic: conceptual
ms.date: 06/20/2022
---

# What's new in Azure Database for MySQL - Single Server?

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Azure Database for MySQL is a relational database service in the Microsoft cloud. The service is based on the [MySQL Community Edition](https://www.mysql.com/products/community/) (available under the GPLv2 license) database engine and supports versions 5.6(retired), 5.7, and 8.0. [Azure Database for MySQL - Single Server](./overview.md#azure-database-for-mysql---single-server) is a deployment mode that provides a fully managed database service with minimal requirements for customizations of database. The Single Server platform is designed to handle most database management functions such as patching, backups, high availability, and security, all with minimal user configuration and control.

This article summarizes new releases and features in Azure Database for MySQL - Single Server beginning in January 2021. Listings appear in reverse chronological order, with the most recent updates first.

## September 2022

Clients’ devices using SSL to connect to Azure Database for MySQL – Single Server instances must have their CA certificates updated. To address compliance requirements, starting October 2022 the CA certificates were changed from BaltimoreCyberTrustRoot to DigiCertGlobalRootG2.
To avoid interruption of your application's availability as a result of certificates being unexpectedly revoked, or to update a certificate that has been revoked, use the steps explained in the [article](./concepts-certificate-rotation.md#create-a-combined-ca-certificate), to maintain connectivity.  
Use the steps mentioned to [create a combined certificate](./concepts-certificate-rotation.md#create-a-combined-ca-certificate) and connect to your server but do not remove BaltimoreCyberTrustRoot certificate until we send a communication to remove it.

## May 2022

Enabled the ability to change the server parameter innodb_ft_server_stopword_table from Portal/CLI.
Users can now change the value of the innodb_ft_server_stopword_table parameter using the Azure portal and CLI. This parameter helps to configure your own InnoDB FULLTEXT index stopword list for all InnoDB tables. For more information, see [innodb_ft_server_stopword_table](https://dev.mysql.com/doc/refman/5.7/en/innodb-parameters.html#sysvar_innodb_ft_server_stopword_table).

**Known Issues**

Customers using PHP driver with [enableRedirect](./how-to-redirection.md) can no longer connect to the Azure Database for MySQL single server, as the CA certificates of the host servers were changed from BaltimoreCyberTrustRoot to DigiCertGlobalRootG2 to address compliance requirements. For successful connections to your database using PHP driver with enableRedirect please visit this [link](./concepts-certificate-rotation.md#do-i-need-to-make-any-changes-on-my-client-to-maintain-connectivity).

## March 2022

This release of Azure Database for MySQL - Single Server includes the following updates.

**Bug Fixes**

The MySQL 8.0.27 client and newer versions are now compatible with Azure Database for MySQL - Single Server.

## February 2022

This release of Azure Database for MySQL - Single Server includes the following updates.

**Known Issues**

Customers in Japan,East US received two Maintenance Notification emails for this month. The Email notification send for *05-Feb 2022* was send by mistake and no changes will be done to the service on this date. You can safely ignore them. We apologize for the inconvenience. 

## December 2021

This release of Azure Database for MySQL - Single Server includes the following updates:

- **Query Text removed in Query Performance Insights to avoid unauthorized access** 

Starting December 2021, you will not be able to see the query text of the queries in Query performance insight blade in Azure portal. The query text is removed to avoid unauthorized access to the query text or underlying schema which can pose a security risk. The recommended steps to view the query text is shared below:

- Identify the query_id of the top queries from the Query Performance Insight blade in Azure portal
- Login to your Azure Database for MySQL server from MySQL Workbench or mysql.exe client or your preferred query tool and execute the following queries

     ```sql
    SELECT * FROM mysql.query_store where query_id = '<insert query id from Query performance insight blade in Azure portal';  // for queries in Query Store
    SELECT * FROM mysql.query_store_wait_stats where query_id = '<insert query id from Query performance insight blade in Azure portal';  // for wait statistics 
    ```

- You can browse the query_digest_text column to identify the query text for the corresponding query_id

The above steps will ensure only authenticated and authorized users can have secure access to the query text.

## October 2021

- **Known Issues**

The MySQL 8.0.27 client is incompatible with Azure Database for MySQL - Single Server. All connections from the MySQL 8.0.27 client created either via mysql.exe or workbench will fail. As a workaround, consider using an earlier version of the client (prior to MySQL 8.0.27) or creating an instance of [Azure Database for MySQL - Flexible Server](../flexible-server/overview.md) instead.

## June 2021
  
This release of Azure Database for MySQL - Single Server includes the following updates.

- **Enabled the ability to change the server parameter `activate_all_roles_on_login` from Portal/CLI for MySQL 8.0**

  Users can now change the value of the activate_all_roles_on_login parameter using the Azure portal and CLI. This parameter helps to configure whether to enable automatic activation of all granted roles when users sign in to the server. For more information, see  [Server System Variables](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html).

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

- **Enabled the parameter `redirect_enabled` by default**

  With this release, the parameter `redirect_enabled` will be enabled by default. Redirection aims to reduce network latency between client applications and MySQL servers by allowing applications to connect directly to backend server nodes. Support for redirection in PHP applications is available through the [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) extension, developed by Microsoft. For more information, see the article [Connect to Azure Database for MySQL with redirection](how-to-redirection.md).

>[!NOTE]
> * Redirection does not work with Private link setup. If you are using Private link for Azure Database for MySQL, you might encounter connection issue. To resolve the issue, make sure the parameter redirect_enabled is set to “OFF” and the client application is restarted.</br>
> * If you have a PHP application that uses the mysqlnd_azure redirection driver to connect to Azure Database for MySQL (with redirection enabled by default), you might face a data encoding issue that impacts your insert transactions..</br>
> To resolve this issue, either:
>    - In Azure portal, disable the redirection by setting the redirect_enabled parameter to “OFF”, and restart the PHP application to clear the driver cache after the change.
>     - Explicitly set the charset related parameters at the session level, based on your settings after the connection is established (for example “set names utf8mb4”).

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
- To fix an issue with your account, file a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/d365community/forum/47b1e71d-ee24-ec11-b6e6-000d3a4f0da0).

## Next steps

- Learn more about [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/server/).
- Browse the [public documentation](./index.yml) for Azure Database for MySQL – Single Server.
- Review details on [troubleshooting common errors](./how-to-troubleshoot-common-errors.md).
