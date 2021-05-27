---
title: What's new in Azure Database for MySQL Single Server
description: Learn about recent updates to Azure Database for MySQL - Single server, a relational database service in the Microsoft cloud based on the MySQL Community Edition.
author: hjtoland3
ms.service: mysql
ms.author: jtoland
ms.custom: mvc
ms.topic: conceptual
ms.date: 05/05/2021
---
# What's new in Azure Database for MySQL - Single Server?

Azure Database for MySQL is a relational database service in the Microsoft cloud. The service is based on the [MySQL Community Edition](https://www.mysql.com/products/community/) (available under the GPLv2 license) database engine and supports versions 5.6, 5.7, and 8.0. [Azure Database for MySQL - Single Server](https://docs.microsoft.com/azure/mysql/overview#azure-database-for-mysql---single-server) is a deployment mode that provides a fully managed database service with minimal requirements for customizations of database. The Single Server platform is designed to handle most database management functions such as patching, backups, high availability, and security, all with minimal user configuration and control.

This article summarizes new releases and features in Azure Database for MySQL - Single Server beginning in January 2021. Listings appear in reverse chronological order, with the most recent updates first.

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
- Browse the [public documentation](https://docs.microsoft.com/azure/mysql/single-server/) for Azure Database for MySQL – Single Server.
- Review details on [troubleshooting common errors](https://docs.microsoft.com/azure/mysql/howto-troubleshoot-common-errors).
