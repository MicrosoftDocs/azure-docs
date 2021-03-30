---
title: Supported versions - Azure Database for MySQL
description: Learn which versions of the MySQL server are supported in the Azure Database for MySQL service.
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: conceptual
ms.date: 6/3/2020
---
# Supported Azure Database for MySQL server versions

Azure Database for MySQL has been developed from [MySQL Community Edition](https://www.mysql.com/products/community/), using the InnoDB storage engine. The service supports all the current major version supported by the community namely MySQL 5.6, 5.7 and 8.0. MySQL uses the X.Y.Z naming scheme where X is the major version, Y is the minor version, and Z is the bug fix release. For more information about the scheme, see the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/which-version.html).



## Connect to a gateway node that is running a specific MySQL version

In the Single Server deployment option, a gateway is used to redirect the connections to server instances. After the connection is established, the MySQL client displays the version of MySQL set in the gateway, not the actual version running on your MySQL server instance. To determine the version of your MySQL server instance, use the `SELECT VERSION();` command at the MySQL prompt. Review [Connectivity architecture](https://docs.microsoft.com/azure/mysql/concepts-connectivity-architecture#connectivity-architecture) to learn more about gateways in Azure Database for MySQL service architecture.

As Azure Database for MySQL supports major version v5.6, v5.7 and v8.0, the default port 3306 to connect to Azure Database for MySQL runs MySQL client version 5.6 (least common denominator) to support connections to servers of all 3 supported major versions. However, if your application has a requirement to connect to specific major version say v5.7 or v8.0, you can do so by changing the port in your server connection string.

In Azure Database for MySQL service, gateway nodes listens on port 3308 for v5.7 clients and port 3309 for v8.0 clients. In other words, if you would like to connect to v5.7 gateway client, you should use your fully qualified server name and port 3308 to connect to your server from client application. Similarly, if you would like to connect to v8.0 gateway client, you can use your fully qualified server name and port 3309 to connect to your server. Check the following example for further clarity.

:::image type="content" source="./media/concepts-supported-versions/concepts-supported-versions-gateway.png" alt-text="Example connecting via different gateway mysql versions":::


## Azure Database for MySQL currently supports the following major and minor versions of MySQL:


| Version | Single Server <br/> Current minor version |Flexible Server (Preview) <br/> Current minor version  |
|:-------------------|:-------------------------------------------|:---------------------------------------------|
|MySQL Version 5.6 |  [5.6.47](https://dev.mysql.com/doc/relnotes/mysql/5.6/en/news-5-6-47.html) (Retired) | Not supported|
|MySQL Version 5.7 | [5.7.29](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-29.html) | [5.7.29](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-29.html)|
|MySQL Version 8.0 | [8.0.15](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-15.html) | [8.0.21](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-21.html)|

Read the version support policy for retired versions in [version support policy documentation.](concepts-version-policy.md#retired-mysql-engine-versions-not-supported-in-azure-database-for-mysql)

## Managing updates and upgrades
The service automatically manages patching for bug fix version updates. For example, 5.7.20 to 5.7.21.  

Major version upgrade is currently supported by service for upgrades from MySQL v5.6 to v5.7. For more details, refer [how to perform major version upgrades](how-to-major-version-upgrade.md). If you'd like to upgrade from 5.7 to 8.0, we recommend you perform [dump and restore](./concepts-migrate-dump-restore.md) to a server that was created with the new engine version.

## Next steps

- For details around Azure Database for MySQL versioning policy, see [this document](concepts-version-policy.md).
- For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](./concepts-pricing-tiers.md)