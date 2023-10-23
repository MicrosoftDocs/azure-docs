---
title: Azure Database for MySQL managing updates and upgrades
description: Learn which versions of the MySQL server are supported in the Azure Database for MySQL Service.
author: SudheeshGH
ms.author: sunaray
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
ms.custom: 
ms.date: 06/20/2022
---

#  Connect to a gateway node to a specific MySQL version 

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

In the Single Server deployment option, a gateway is used to redirect the connections to server instances. After the connection is established, the MySQL client displays the version of MySQL set in the gateway, not the actual version running on your MySQL server instance. To determine the version of your MySQL server instance, use the `SELECT VERSION();` command at the MySQL prompt. Review [Connectivity architecture](./concepts-connectivity-architecture.md#connectivity-architecture) to learn more about gateways in Azure Database for MySQL Service architecture.

As Azure Database for MySQL supports major version v5.7 and v8.0, the default port 3306 to connect to Azure Database for MySQL runs MySQL client version 5.6 (least common denominator) to support connections to servers of all 2 supported major versions. However, if your application has a requirement to connect to specific major version say v5.7 or v8.0, you can do so by changing the port in your server connection string.

In Azure Database for MySQL Service, gateway nodes listens on port 3308 for v5.7 clients and port 3309 for v8.0 clients. In other words, if you would like to connect to v5.7 gateway client, you should use your fully qualified server name and port 3308 to connect to your server from client application. Similarly, if you would like to connect to v8.0 gateway client, you can use your fully qualified server name and port 3309 to connect to your server. Check the following example for further clarity.

:::image type="content" source="./media/concepts-supported-versions/concepts-supported-versions-gateway.png" alt-text="Example connecting via different gateway mysql versions":::

> [!NOTE]
> Connecting to Azure Database for MySQL via ports 3308 and 3309 are only supported for public connectivity, Private Link and VNet service endpoints can only be used with port 3306.

Read the version support policy for retired versions in [version support policy documentation.](concepts-version-policy.md#retired-mysql-engine-versions-not-supported-in-azure-database-for-mysql)

## Managing updates and upgrades

The service automatically manages patching for bug fix version updates. For example, 5.7.20 to 5.7.21.  

Major version upgrade is currently supported by service for upgrades from MySQL v5.6 to v5.7. For more details, refer [how to perform major version upgrades](how-to-major-version-upgrade.md). If you'd like to upgrade from 5.7 to 8.0, we recommend you perform [dump and restore](./concepts-migrate-dump-restore.md) to a server that was created with the new engine version.

## Next steps

- To see supported versions, visit [Azure Database for MySQL version support policy](../concepts-version-policy.md)
- For details around Azure Database for MySQL versioning policy, see [this document](concepts-version-policy.md).
- For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](./concepts-pricing-tiers.md)
