---
title: SSL connectivity - Azure Database for MySQL
description: Information for configuring Azure Database for MySQL and associated applications to properly use SSL connections
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 01/13/2020
---

# SSL connectivity in Azure Database for MySQL

Azure Database for MySQL supports connecting your database server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application.

## Default settings

By default, the database service should be configured to require SSL connections when connecting to MySQL.  We recommend to avoid disabling the SSL option whenever possible.

When provisioning a new Azure Database for MySQL server through the Azure portal and CLI, enforcement of SSL connections is enabled by default. 

Connection strings for various programming languages are shown in the Azure portal. Those connection strings include the required SSL parameters to connect to your database. In the Azure portal, select your server. Under the **Settings** heading, select the **Connection strings**. The SSL parameter varies based on the connector, for example "ssl=true" or "sslmode=require" or "sslmode=required" and other variations.

> [!NOTE]
> Currently the TLS version supported for Azure Database for MySQL are TLS 1.0, TLS 1.1, TLS 1.2.

To learn how to enable or disable SSL connection when developing application, refer to [How to configure SSL](howto-configure-ssl.md).

## Next steps

[Connection libraries for Azure Database for MySQL](concepts-connection-libraries.md)
