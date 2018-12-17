---
title: SSL connectivity for Azure Database for MariaDB
description: Information for configuring Azure Database for MariaDB and associated applications to properly use SSL connections
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 09/24/2018
---

# SSL connectivity in Azure Database for MariaDB
Azure Database for MariaDB supports connecting your database server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application.

## Default settings
By default, the database service should be configured to require SSL connections when connecting to MariaDB.  We recommend to avoid disabling the SSL option whenever possible.

When provisioning a new Azure Database for MariaDB server through the Azure portal and CLI, enforcement of SSL connections is enabled by default.

Connection strings for various programming languages are shown in the Azure portal. Those connection strings include the required SSL parameters to connect to your database. In the Azure portal, select your server. Under the **Settings** heading, select the **Connection strings**. The SSL parameter varies based on the connector, for example "ssl=true" or "sslmode=require" or "sslmode=required" and other variations.

To learn how to enable or disable SSL connection when developing application, refer to [How to configure SSL](howto-configure-ssl.md).

## Next steps
- Learn more about [server firewall rules](concepts-firewall-rules.md)
- Learn how to [configure SSL](howto-configure-ssl.md).
