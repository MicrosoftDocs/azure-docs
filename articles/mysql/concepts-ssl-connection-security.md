---
title: SSL connectivity for Azure Database for MySQL | Microsoft Docs
description: Information for configuring Azure Database for MySQL and associated applications to properly use SSL connections
services: mysql
author: JasonMAnderson
ms.author: janders
editor: jasonwhowell
manager: jhubbard
ms.service: mysql-database
ms.topic: article
ms.date: 05/10/2017
---

# SSL connectivity in Azure Database for MySQL
Azure Database for MySQL supports connecting your database server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application.

## Default settings
By default, the database service should be configured to require SSL connections when connecting to MySQL.  It is recommended avoid disabling the SSL option whenever possible. 

When provisioning a new Azure Database for MySQL server through the Azure portal and CLI, enforcement of SSL connections is enabled by default. 

Likewise, connection strings that are pre-defined in the "Connection Strings" settings under your server in the Azure portal include the required parameters for common languages to connect to your database server using SSL. The SSL parameter varies based on the connector, for example "ssl=true" or "sslmode=require" or "sslmode=required" and other variations.

To learn how to enable or disable SSL connection when developing application, please refer to [How to configure SSL](howto-configure-ssl.md).

## Next steps
[Connection libraries for Azure Database for MySQL](concepts-connection-libraries.md)
