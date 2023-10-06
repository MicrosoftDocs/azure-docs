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
| MySQL Version 8.0 | [8.0.15](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-15.html) | [8.0.32](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-32.html) |

> [!NOTE]  
> In the Single Server deployment option, a gateway redirects the connections to server instances. After the connection is established, the MySQL client displays the version of MySQL set in the gateway, not the actual version running on your MySQL server instance. To determine the version of your MySQL server instance, use the `SELECT VERSION();` command at the MySQL prompt. If your application has a requirement to connect to a specific major version, say v5.7 or v8.0, you can do so by changing the port in your server connection string as explained in our documentation [here.](concepts-supported-versions.md#connect-to-a-gateway-node-that-is-running-a-specific-mysql-version)

Read the version support policy for retired versions in [version support policy documentation.](concepts-version-policy.md#retired-mysql-engine-versions-not-supported-in-azure-database-for-mysql)

## Major version support

Each major version of MySQL is supported by Azure Database for MySQL from the date Azure begins supporting the version until the version is retired by the MySQL community, as provided in the [versioning policy](https://www.mysql.com/support/eol-notice.html).

## Minor version support

Azure Database for MySQL automatically performs minor version upgrades to the Azure-preferred MySQL version as part of periodic maintenance.

## Major version retirement policy

The table below provides the retirement details for MySQL major versions. The dates follow the [MySQL versioning policy](https://www.mysql.com/support/eol-notice.html).

| Version | What's New | Azure support start date | Azure support end date | Community Retirement date
| --- | --- | --- | --- | --- | 
| [MySQL 5.7](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/) | [Features](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-31.html) | March 20, 2018 |September 2025 |October 2023|
| [MySQL 8](https://mysqlserverteam.com/whats-new-in-mysql-8-0-generally-available/) | [Features](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-21.html)) | December 11, 2019 | NA |April 2026|

## What will happen to Azure Database for MySQL service after MySQL community version is retired in October 2023?

In line with Oracle's announcement regarding the end-of-life (EOL) of [MySQL Community Version v5.7 in __October 2023__](https://www.oracle.com/us/support/library/lsp-tech-chart-069290.pdf) (Page 23), we at Azure are actively preparing for this important transition. This development specifically impacts customers who are currently utilizing Version 5.7 of Azure Database for MySQL - Single Server and Flexible Server.

In response to the customer's requests, Microsoft has decided to prolong the support for Azure Database for MySQL beyond __October 2023__. During the extended support period, which will last until __September 2025__, Microsoft prioritizes the availability, reliability, and security of the service. While there are no specific guarantees regarding minor version upgrades, we implement essential modifications to ensure that the service remains accessible, dependable, and protected. Our plan includes:

- Extended support for v5.7 on Azure Database for MySQL- Flexible Servers until __September 2025__, offering ample time for customers to plan and execute their upgrades to MySQL v8.0.

- Extended support for v5.7 on Azure Database for MySQL- Single Servers until they're retired on __September 2024__. This extended support provides Azure Database for MySQL -Single Server customers ample time to migrate to Azure Database for MySQL - Flexible Server version 5.7 and then later upgrade to 8.0.

Before we end our support of Azure Database for MySQL 5.7, there are several important timelines that you should pay attention.

__Azure MySQL 5.7 Deprecation Timelines__

|Timelines|	Azure MySQL 5.7 Flexible end at	|Azure MySQL 5.7 Single end at|
|---|---|---|
|Creation of new servers using the Azure portal.| 	Jan 2024|	Already ended as part of [Single Server deprecation](single-server/whats-happening-to-mysql-single-server.md)|
|Creation of new servers using the Command Line Interface (CLI). |	April 2024| 	September 2024| 
|Creation of replica servers for existing servers. |	September 2025|	September 2024|
|Creation of servers using restore workflow for the existing servers| September 2025|September 2024|
|Creation of new servers for migrating from Azure Database for MySQL - Single Server to Azure Database for MySQL - Flexible Server.|	NA|	September 2024|
|Creation of new servers for migrating from Azure Database for MariaDB to Azure Database for MySQL - Flexible Server.|	September 2025|	NA|
|Extended support for Azure Database for MySQL v5.7|	September 2025|	September 2024|

To summarize, creating Azure Database for MySQL v5.7 - Flexible Server will conclude in __April 2024__. However, it's important to note that certain scenarios such as replica creation, point in time recovery, and migration from Azure Database for MySQL - Single Server or Azure Database for MariaDB to Azure Database for MySQL - Flexible Server, will allow you to create MySQL version 5.7 until the end of the extended support period.

### FAQs

__Q: What is the process for upgrading Azure database for MySQL - Flexible server from version v5.7 to v8.0?__

A: Starting May 2023, Azure Database for MySQL - Flexible Server enables you to carry out an in-place upgrade from MySQL v5.7 to v8.0 utilizing the Major Version Upgrade (MVU) feature. For more detailed information, please consult the [Major version upgrade](flexible-server/how-to-upgrade.md) document.

__Q: I'm currently using Azure database for MySQL - Single Sever version 5.7, how should I plan my upgrade?__

A: Azure Database for MySQL - Single Server does not offer built-in support for major version upgrade from v5.7 to v8.0. As Azure Database for MySQL - Single Server is on deprecation path, there are no investments planned to support major version upgrade from v5.7 to v8.0. The recommended path to upgrade from v5.7 of Azure Database for MySQL - Single Server to v8.0 is to first [migrate your v5.7 Azure Database for MySQL - Single Server to v5.7 of Azure Database for MySQL - Flexible Server](single-server/whats-happening-to-mysql-single-server.md#migrate-from-single-server-to-flexible-server). Once the migration is completed and server is stabilized on Flexible Server, you can proceed with performing a [major version upgrade](flexible-server/how-to-upgrade.md) on the migrated Azure Database for MySQL - Flexible Server from v5.7 to v8.0. The extended support for v5.7 on Flexible Server will allow you to run on v5.7 longer and plan your upgrade to v8.0 on Flexible Server at a later point in time after migration from Single Server.

__Q: Are there any expected downtime or performance impacts during the upgrade process?__

A: Yes, it's expected that there will be some downtime during the upgrade process. The specific duration varies depending on factors such as the size and complexity of the database. We advise conducting a test upgrade on a nonproduction environment to assess the expected downtime and evaluate the potential performance impact. If you wish to minimize downtime for your applications during the upgrade, you can explore the option of [perform minimal downtime major version upgrade from MySQL 5.7 to MySQL 8.0 using read replica](flexible-server/how-to-upgrade.md#perform-minimal-downtime-major-version-upgrade-from-mysql-57-to-mysql-80-using-read-replicas). 


__Q: Can I roll back to MySQL v5.7 after upgrading to v8.0?__

A: While it's generally not recommended to downgrade from MySQL v8.0 to v5.7, as the latter is nearing its End of Life status, we acknowledge that there may be specific scenarios where this flexibility becomes necessary. To ensure a smooth upgrade process and alleviate any potential concerns, it's strongly advised adhering to best practices by performing a comprehensive [on-demand backup](flexible-server/how-to-trigger-on-demand-backup.md) before proceeding with the upgrade to MySQL v8.0. This backup serves as a precautionary measure, allowing you to [restore your database](flexible-server/how-to-restore-server-portal.md) to its previous version on to another new Azure Database for MySQL -Flexible server in the event of any unexpected issues or complications with MySQL v8.0.

__Q: What are the main advantages of upgrading to MySQL v8.0?__

A: MySQL v8.0 comes with a host of improvements, including more efficient data dictionary, enhanced security, and other features like common table expressions and window functions. Details please refer to [MySQL 8.0 release notes](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-32.html)

__Q: Are there any compatibility issues to be aware of when upgrading to MySQL v8.0?__

A: Some compatibility issues may arise due to changes in MySQL v8.0. It's important to test your applications with MySQL v8.0 before upgrading the production database. Check [MySQL's official documentation](https://dev.mysql.com/doc/refman/8.0/en/upgrading-from-previous-series.html) for a detailed list of compatibility issues.

__Q: What support is available if I encounter issues during the upgrade process?__

A: If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/microsoft-azure-mysql-qa). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). You can also email the [Azure Database for MySQL product team](mailto:AskAzureDBforMySQL@service.microsoft.com).

__Q: What will happen to my data during the upgrade?__

A: While your data will remain unaffected during the upgrade process, it's highly advisable to create a backup of your data before proceeding with the upgrade. This precautionary measure will help mitigate the risk of potential data loss in the event of unforeseen complications.

__Q: What will happen to the server 5.7 post Sep 2025__

A: You refer to our [retired MySQL version support policy](concepts-version-policy.md#retired-mysql-engine-versions-not-supported-in-azure-database-for-mysql) to learn what will happen after Azure Database for MySQL 5.7 end of support

__Q: I have a Azure Database for MariaDB or Azure database for MySQL -Single server, how can I create the server in 5.7 post April 2024 for migrating to Azure database for MySQL - flexible server?__

A: If there's MariaDB\Single server in your subscription, this subscription is still permitted to create Azure Database for MySQL – Flexible Server v5.7 for the purpose of migration to Azure Database for MySQL – Flexible Server


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
