---
title: Version support policy - Azure Database for MySQL - Single Server and Flexible Server
description: Describes the policy around MySQL major and minor versions in Azure Database for MySQL
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 08/09/2024
ms.service: azure-database-mysql
ms.subservice: flexible-server
ms.topic: conceptual
ms.custom:
  - fasttrack-edit
---

# Azure Database for MySQL version support policy

[!INCLUDE [applies-to-mysql-flexible-server](includes/applies-to-mysql-flexible-server.md)]

[!INCLUDE [Azure-database-for-mysql-single-server-deprecation](~/reusable-content/ce-skilling/azure/includes/mysql/includes/azure-database-for-mysql-single-server-deprecation.md)]

## Supported MySQL versions

Azure Database for MySQL was developed from the [MySQL Community Edition](https://www.mysql.com/products/community/), using the InnoDB storage engine. The service supports the community's current major versions, namely MySQL 5.7 and 8.0. MySQL uses the X.Y.Z. naming scheme where X is the major version, Y is the minor version, and Z is the bug fix release. For more information about the scheme, see the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/which-version.html).

Azure Database for MySQL currently supports the following major and minor versions of MySQL:

| Version | [Flexible Server](flexible-server/overview.md)<br />Current minor version |
| :--- | :--- |
| MySQL Version 5.7 | [5.7.44](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-44.html) |
| MySQL Version 8.0 | [8.0.37](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-37.html) |

Read the version support policy for retired versions in [version support policy documentation.](concepts-version-policy.md#retired-mysql-engine-versions-not-supported-in-azure-database-for-mysql)

## Major version support

Azure Database for MySQL supports each major version of MySQL from the date Azure begins supporting it until the MySQL community retires it, as provided in the [versioning policy](https://www.mysql.com/support/eol-notice.html).

## Minor version support

Azure Database for MySQL automatically performs minor version upgrades to the Azure-preferred version as part of periodic maintenance.

## Major version retirement policy

The retirement details for MySQL major versions are listed in the following table. Dates shown follow the [MySQL versioning policy](https://www.mysql.com/support/eol-notice.html).

| Version | What's New | Azure support start date | Azure support end date | Community Retirement date
| --- | --- | --- | --- | --- |
| [MySQL 5.7](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/) | [Features](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-31.html) | March 20, 2018 | September 2025 | October 2023 |
| [MySQL 8](https://mysqlserverteam.com/whats-new-in-mysql-8-0-generally-available/) | [Features](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-21.html) | December 11, 2019 | NA | April 2026 |

## What happens to Azure Database for MySQL service after the MySQL community version is retired in October 2023?

In line with Oracle's announcement regarding the end-of-life of [MySQL Community Version v5.7 in __October 2023__](https://www.oracle.com/us/support/library/lsp-tech-chart-069290.pdf) (Page 23), we at Azure are actively preparing for this critical transition. This development impacts explicitly customers utilizing Version 5.7 of Azure Database for MySQL - Single Server and Flexible Server.

In response to the customer's requests, Microsoft decided to prolong the support for Azure Database for MySQL beyond __October 2023__. During the extended support period, which lasts until __September 2025__, Microsoft prioritizes the service's availability, reliability, and security. While there are no guarantees regarding minor version upgrades, we implement essential modifications to ensure the service remains accessible, dependable, and protected. Our plan includes:

- Extended support for v5.7 on Azure Database for MySQL- Flexible Servers until __September 2025__, offering ample time for customers to plan and execute their upgrades to MySQL v8.0.

- Extended support for v5.7 on Azure Database for MySQL- Single Servers until they're retired on __September 2024__. This extended support provides Azure Database for MySQL -Single Server customers ample time to migrate to Azure Database for MySQL - Flexible Server version 5.7 and later upgrade to 8.0.

Before we end our support of Azure Database for MySQL 5.7, you should pay attention to several important timelines.

__Azure MySQL 5.7 Deprecation Timelines__

| Timelines | Azure MySQL 5.7 Flexible 
| --- | --- | --- 
| Creation of new servers using the Azure portal. | To Be Decided | 
| Creation of new servers using the Command Line Interface (CLI). | To Be Decided |
| Creation of replica servers for existing servers. | September 2025 |
| Creation of servers using restore workflow for the existing servers | September 2025 | 
| Creation of new servers for migrating from Azure Database for MySQL - Single Server to Azure Database for MySQL - Flexible Server. | NA | 
| Creation of new servers for migrating from Azure Database for MariaDB to Azure Database for MySQL - Flexible Server. | September 2025 | 
| Extended support for Azure Database for MySQL v5.7 | September 2025 |

> [!NOTE]  
> We initially planned to stop the creation of a new Azure Database for MySQL version 5.7 instances via CLI and Portal after April 2024. However, after further review and customer feedback, we have decided to delay this action. The date for discontinuing the creation of new MySQL 5.7 instances is currently under review and remains 'To Be Decided'. This change reflects our commitment to accommodating customer needs and providing flexibility during the transition. Don't hesitate to let us know if you have any concerns about the Azure Database For MySQL Flexible Server extended support for MySQL 5.7 by emailing us at [Ask Azure DB For MySQL](mailto:AskAzureDBforMySQL@service.microsoft.com); we value your feedback and encourage ongoing communication as we navigate these changes.

### FAQs

__Q: What is the process for upgrading the Azure database for MySQL - Flexible server from version v5.7 to v8.0?__

A: Starting May 2023, Azure Database for MySQL - Flexible Server enables you to carry out an in-place upgrade from MySQL v5.7 to v8.0 utilizing the Major Version Upgrade (MVU) feature. Consult the [Major version upgrade](flexible-server/how-to-upgrade.md) document for more detailed information.

__Q: I'm currently using the Azure Database for MySQL - Single Server version 5.7; how should I plan my upgrade?__

A: Azure Database for MySQL - Single Server doesn't offer built-in support for major version upgrades from v5.7 to v8.0. As Azure Database for MySQL - Single Server is on the deprecation path, no investments are planned to support major version upgrades from v5.7 to v8.0. The recommended path to upgrade from v5.7 of Azure Database for MySQL - Single Server to v8.0 is to first [migrate your v5.7 Azure Database for MySQL - Single Server to v5.7 of Azure Database for MySQL - Flexible Server](single-server/whats-happening-to-mysql-single-server.md#migrate-from-single-server-to-flexible-server). After the migration is completed and server is stabilized on Flexible Server, you can proceed with performing a [major version upgrade](flexible-server/how-to-upgrade.md) on the migrated Azure Database for MySQL - Flexible Server from v5.7 to v8.0. The extended support for v5.7 on Flexible Server will allow you to run on v5.7 longer and plan your upgrade to v8.0 on Flexible Server later after migration from Single Server.

__Q: Are there any expected downtime or performance impacts during the upgrade process?__

A: Yes, it's expected that there will be some downtime during the upgrade process. The specific duration varies depending on factors such as the size and complexity of the database. We advise conducting a test upgrade on a nonproduction environment to assess the expected downtime and evaluate the potential performance. Suppose you minimize downtime for your applications during the upgrade. In that case, you can explore the option of [perform minimal downtime major version upgrade from MySQL 5.7 to MySQL 8.0 using read replica](flexible-server/how-to-upgrade.md#perform-minimal-downtime-major-version-upgrade-from-mysql-57-to-mysql-80-using-read-replicas).

__Q: Can I roll back to MySQL v5.7 after upgrading to v8.0?__

A: While it's not recommended to downgrade from MySQL v8.0 to v5.7, as the latter is nearing its End of Life status, we acknowledge that there might be specific scenarios where this flexibility becomes necessary. To ensure a smooth upgrade process and alleviate any potential concerns, it's advised to adhere to best practices by performing a comprehensive [on-demand backup](flexible-server/how-to-trigger-on-demand-backup.md) before proceeding with the upgrade to MySQL v8.0. This backup serves as a precautionary measure, allowing you to [restore your database](flexible-server/how-to-restore-server-portal.md) to its previous version on to another new Azure Database for MySQL - Flexible Server for any unexpected issues or complications with MySQL v8.0.

__Q: What are the main advantages of upgrading to MySQL v8.0?__

A: MySQL v8.0 comes with a host of improvements, including a more efficient data dictionary, enhanced security, and other features like common table expressions and window functions. For details, refer to [MySQL 8.0 release notes](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-32.html)

__Q: Are there any compatibility issues to be aware of when upgrading to MySQL v8.0?__

A: Changes in MySQL v8.0 might cause some compatibility issues. It's important to test your applications with MySQL v8.0 before upgrading the production database. Check [MySQL's official documentation](https://dev.mysql.com/doc/refman/8.0/en/upgrading-from-previous-series.html) for a detailed list of compatibility issues.

__Q: What support is available if I encounter issues during the upgrade process?__

A: If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/microsoft-azure-mysql-qa). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

__Q: What will happen to my data during the upgrade?__

A: While your data will remain unaffected during the upgrade process, it's highly advisable to create a backup before proceeding with the upgrade. This precautionary measure helps mitigate the risk of potential data loss due to any unforeseen complications.

__Q: What will happen to the server 5.7 after Sep 2025?__

A: You refer to our [retired MySQL version support policy](concepts-version-policy.md#retired-mysql-engine-versions-not-supported-in-azure-database-for-mysql) to learn what will happen after Azure Database for MySQL 5.7 end of support

__Q: I have an Azure Database for MariaDB or an Azure database for MySQL -Single server; how can I create the server in 5.7 post April 2024 for migrating to Azure Database for MySQL - Flexible Server?__

A: If there's a MariaDB server in your subscription, this subscription is still permitted to create Azure Database for MySQL – Flexible Server v5.7 to migrate to Azure Database for MySQL – Flexible Server.

## Retired MySQL engine versions not supported in Azure Database for MySQL

After the retirement date for each MySQL database version, if you continue running the retired version, note the following restrictions:

As the community won't release any further bug fixes or security fixes, Azure Database for MySQL won't patch the retired database engine for any bugs or security issues or otherwise take security measures regarding it. However, Azure continues performing periodic maintenance and patching for the host, OS, containers, and other service-related components.
- If any support issue you might experience relates to the MySQL database, we might be unable to assist you. In such cases, you must upgrade your database for us to provide you with any support.
- You won't be able to create new database servers for the retired version. However, you can perform point-in-time recoveries and create read replicas for your existing servers.
- New service capabilities developed by Azure Database for MySQL might only be available to supported database server versions.
- Uptime S.L.A.s apply solely to Azure Database for MySQL service-related issues and not to any downtime caused by database engine-related bugs.
In the extreme event of a serious threat to the service caused by the MySQL database engine vulnerability identified in the retired database version, Azure might choose to stop the compute node of your database server from securing the service first. You're asked to upgrade the server before bringing it online. During the upgrade process, your data is always protected using automatic backups performed on the service, which can be used to restore to the older version if desired.

## Next step

> [!div class="nextstepaction"]
> [dump and restore](single-server/concepts-migrate-dump-restore.md)
