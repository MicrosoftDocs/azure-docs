---
title: TLS configuration - Azure portal - Azure Database for MySQL
description: Learn how to set TLS configuration using Azure portal for your Azure Database for MySQL 
author: kummanish
ms.author: manishku
ms.service: mysql
ms.topic: conceptual
ms.date: 06/02/2020
---

# Configuring TLS settings in Azure Database for MySQL using Azure portal

This article describes how you can configure an Azure Database for MySQL server to enforce minimum TLS version allowed for connections to go through and deny all connections with lower TLS version than configured minimum TLS version thereby enhancing the network security.

You can enforce TLS version for connecting to their Azure Database for MySQL. Customers now have a choice to set the minimum TLS version for their database server. For example, setting this Minimum TLS version to 1.0 means you shall allow clients connecting using TLS 1.0,1.1 and 1.2. Alternatively, setting this to 1.2 means that you only allow clients connecting using TLS 1.2+ and all incoming connections with TLS 1.0 and TLS 1.1 will be rejected.

## Prerequisites

To complete this how-to guide, you need:

* An [Azure Database for MySQL](quickstart-create-mysql-server-database-using-azure-portal.md)

## Set TLS configurations for Azure Database for MySQL

Follow these steps to set MySQL server minimum TLS version:

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MySQL server.

1. On the MySQL server page, under **Settings**, click **Connection security** to open the connection security configuration page.

1. In **Minimum TLS version**, select **1.2** to deny connections with TLS version less than TLS 1.2 for your MySQL server.

    ![Azure Database for MySQL TLS configuration](./media/howto-tls-configurations/setting-tls-value.png)

1. Click **Save** to save the changes.

1. A notification will confirm that connection security setting was successfully enabled.

    ![Azure Database for MySQL TLS configuration success](./media/howto-tls-configurations/setting-tls-value-success.png)

## Next steps

- Learn about [how to create alerts on metrics](howto-alert-on-metric.md)