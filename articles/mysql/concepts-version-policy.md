---
title: Version support policy - Azure Database for MySQL - Single Server and Flexible Server
description: Describes the policy around MySQL major and minor versions in Azure Database for MySQL
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 04/27/2023
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
ms.custom: fasttrack-edit
---

# Azure Database for MySQL version support policy

[!INCLUDE [applies-to-mysql-single-flexible-server](includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE [Azure-database-for-mysql-single-server-deprecation](includes/Azure-database-for-mysql-single-server-deprecation.md)]

This page describes the Azure Database for MySQL versioning policy and applies to Azure Database for MySQL - Single Server and Azure Database for MySQL - Flexible Server (Preview) deployment modes.

## Supported MySQL versions

Azure Database for MySQL has been developed from [MySQL Community Edition](https://www.mysql.com/products/community/), using the InnoDB storage engine. The service supports the community's current major versions, namely MySQL 5.7, and 8.0. MySQL uses the X.Y.Z. naming scheme where X is the major version, Y is the minor version, and Z is the bug fix release. For more information about the scheme, see the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/which-version.html).

Azure Database for MySQL currently supports the following major and minor versions of MySQL:

| Version | [Single Server](single-server/overview.md)<br />Current minor version | [Flexible Server](flexible-server/overview.md)<br />Current minor version |
| :--- | :--- | :--- |
| MySQL Version 5.7 | [5.7.32](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-29.html) | [5.7.40](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-40.html) |
| MySQL Version 8.0 | [8.0.15](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-15.html) | [8.0.31](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-31.html) |

> [!NOTE]  
> In the Single Server deployment option, a gateway redirects the connections to server instances. After the connection is established, the MySQL client displays the version of MySQL set in the gateway, not the actual version running on your MySQL server instance. To determine the version of your MySQL server instance, use the `SELECT VERSION();` command at the MySQL prompt. If your application has a requirement to connect to a specific major version, say v5.7 or v8.0, you can do so by changing the port in your server connection string as explained in our documentation [here.](concepts-supported-versions.md#connect-to-a-gateway-node-that-is-running-a-specific-mysql-version)

Read the version support policy for retired versions in [version support policy documentation.](concepts-version-policy.md#retired-mysql-engine-versions-not-supported-in-azure-database-for-mysql)

## Major version support

Each major version of MySQL is supported by Azure Database for MySQL from the date Azure begins supporting the version until the version is retired by the MySQL community, as provided in the [versioning policy](https://www.mysql.com/support/eol-notice.html).

## Minor version support

Azure Database for MySQL automatically performs minor version upgrades to the Azure-preferred MySQL version as part of periodic maintenance.

## Major version retirement policy

The table below provides the retirement details for MySQL major versions. The dates follow the [MySQL versioning policy](https://www.mysql.com/support/eol-notice.html).

| Version | What's New | Azure support start date | Retirement date |
| --- | --- | --- | --- |
| [MySQL 5.7](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/) | [Features](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-31.html) | March 20, 2018 | October 2023
| [MySQL 8](https://mysqlserverteam.com/whats-new-in-mysql-8-0-generally-available/) | [Features](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-21.html)) | December 11, 2019 | April 2026

## What will happen to Azure MySQL 5.7 instance after EOL of MySQL 5.7?

As Oracle announced the end-of-life (EOL) for [MySQL Community Version v5.7 in October 2023](https://www.oracle.com/us/support/library/lsp-tech-chart-069290.pdf) (Page 23), we are also preparing for this significant change at Azure. This section primarily affects customers using Version 5.7 of Azure Database for MySQL - Single Server and Flexible Server.

### What's Our Plan?

Considering the customer request, Microsoft will extend the support for Azure Database for MySQL post Oct 2023. Microsoft will ensure the service is available, reliable and secure in the extended support timeline (September 2025). While there will be no commitments on the minor version upgrades, we will make necessary changes to the service to make sure it is available, reliable, and secure. We plans to: 

- Extended support for v5.7 on Azure Database for MySQL- Flexible Servers: until September 2025, offering ample time for customers to plan and execute their upgrades to MySQL v8.0.

- Extended support for v5.7 on Azure Database for MySQL- Single Servers: until they are retired on September 2024. This provides Azure Database for MySQL -Single Server customers ample time to migrate to Azure Database for MySQL - Flexible Server version 5.7 and then later upgrade to 8.0.

Before we end our support of Azure Database for MySQL 5.7, there are several important timelines that you should pay attention.

__Azure MySQL 5.7 Depreacation Timelines__

|Timelines|	5.7 Flexible end at	|5.7 Single end at|
|---|---|---|
|New server creates using Portal| 	Jan 2024|	Already ended|
|New server creates using CLI |	April 2024| 	September 2024|
|Replica server creation for the Existing servers |	September 2025|	September 2024|
|New server creates for migrating from Azure Database for MySQL – Single to Flexible server|	NA|	September 2024|
|New server creates for migrating from Azure Database for MariaDB to Azure Database for MySQL Flexible server|	September 2025|	NA|
|Support for Azure Database for MySQL v5.7|	September 2025|	September 2024|

In summary, general way of creating Azure Database for MySQL v5.7 - Flexible Server ended at April 2024, with the exception that replica/point in time recovery/migrate from Azure database for MySQL – Single/ Azure database for MariaDB to Azure database for MySQL - Flexible can still create MySQL 5.7 until the end of support date.

### FAQs

__Q: What is the process for upgrading from MySQL v5.7 to v8.0?__

A: Starting from May 2023, you can perform an in-place upgrade from MySQL v5.7 to v8.0 using the Major Version Upgrade (MVU) feature on Flexible Servers. You can refer to this [Major version upgrade](flexible-server/how-to-upgrade.md) document for more details

__Q: I'm currently using Azure MySQL 5.7 Single Sever, how should I plan my upgrade?__

A: Azure MySQL 5.7 Single Server does not support built in major version upgrade, you should first migrate your 5.7 single server to 5.7 flexible server, then perform a major version upgrade on the migrated flexible 5.7 server.

__Q: Are there any expected downtime or performance impacts during the upgrade process?__

A: During the upgrade process, some downtime can be expected. The duration will depend on the database size and complexity. We recommend performing a test upgrade on a non-production environment to estimate the downtime and understand the performance impact. 
If you don’t want your apps having a significant downtime while upgrading, you can try [perform minimal downtime major version upgrade from MySQL 5.7 to MySQL 8.0 using read replica](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/how-to-upgrade#perform-minimal-downtime-major-version-upgrade-from-mysql-57-to-mysql-80-using-read-replicas).


__Q: Can I roll back to MySQL v5.7 after upgrading to v8.0?__

A: While we do not typically recommend reverting back to MySQL v5.7 due to its approaching End of Life status, we understand that the flexibility to do so can be crucial in certain scenarios. As a best practice, and to ensure your peace of mind during the upgrade process, we strongly advocate for taking a comprehensive [on-demand backup](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/how-to-trigger-on-demand-backup) prior to initiating the upgrade to MySQL v8.0. In the event that any concerns or unexpected complications arise with MySQL v8.0, you would then be able to [restore your database](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/how-to-restore-server-portal) back to the prior version using this backup. This would allow you to revert to the state of your Azure Database for MySQL – Flexible Server as it was at the point of the backup. 

__Q: What are the main advantages of upgrading to MySQL v8.0?__

A: MySQL v8.0 comes with a host of improvements, including better performance, more efficient data dictionary, enhanced security, and additional features like common table expressions and window functions. Details please refer to [MySQL 8.0 release notes](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-32.html)

__Q: Are there any compatibility issues to be aware of when upgrading to MySQL v8.0?__

A: Some compatibility issues may arise due to changes in MySQL v8.0. It's important to test your applications with MySQL v8.0 before upgrading the production database. Check [MySQL's official documentation](https://dev.mysql.com/doc/refman/8.0/en/upgrading-from-previous-series.html) for a detailed list of compatibility issues.

__Q: What support is available if I encounter issues during the upgrade process?__

A: If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/microsoft-azure-mysql-qa). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). You can also reach out to the Azure Database for MySQL product team at AskAzureDBforMySQL@service.microsoft.com.

__Q: What will happen to my data during the upgrade?__

A: Your data will remain intact during the upgrade process. However, we recommend backing up your data before initiating the upgrade process to prevent any data loss in case of unexpected issues.

__Q: What will happen to the server 5.7 post Sep 2025__

A: You refer to our [retired MySQL version support policy](concepts-version-policy.md#retired-mysql-engine-versions-not-supported-in-azure-database-for-mysql) to learn what will happen after Azure Database for MySQL 5.7 end of support

__Q: I have a MariaDB\Single server, how can I create the server in 5.7 post September 2024__

A: If there is MariaDB\Single server in your subscription, this subscription is still allowed to create Azure Database for MySQL – Flexible Server v5.7 for the purpose of migration to Azure Database for MySQL – Flexible Server


## Retired MySQL engine versions not supported in Azure Database for MySQL

After the retirement date for each MySQL database version, if you continue running the retired version, note the following restrictions:

- As the community won't release any further bug fixes or security fixes, Azure Database for MySQL won't patch the retired database engine for any bugs, or security issues or otherwise take security measures regarding the retired database engine. However, Azure continues performing periodic maintenance and patching for the host, OS, containers, and other service-related components.
- If any support issue you may experience relates to the MySQL database, we may be unable to support you. In such cases, you have to upgrade your database for us to provide you with any support.
- You won't be able to create new database servers for the retired version. However, you can perform point-in-time recoveries and create read replicas for your existing servers.
- New service capabilities developed by Azure Database for MySQL may only be available to supported database server versions.
- Uptime S.L.A.s apply solely to Azure Database for MySQL service-related issues and not to any downtime caused by database engine-related bugs.
- In the extreme event of a serious threat to the service caused by the MySQL database engine vulnerability identified in, the retired database version, Azure may choose to stop the compute node of your database server from securing the service first. You are asked to upgrade the server before bringing the server online. During the upgrade process, your data is always protected using automatic backups performed on the service, which can be used to restore to the older version if desired.

## Next steps

- See MySQL [dump and restore](single-server/concepts-migrate-dump-restore.md) to perform upgrades.
