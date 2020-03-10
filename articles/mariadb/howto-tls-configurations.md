---
title: TLS configuration in Azure Database for MariaDB using Azure portal
description: Learn how to set TLS configuration using Azure portal for your Azure Database for MariaDB 
author: kummanish
ms.author: manishku
ms.service: mariadb
ms.topic: conceptual
ms.date: 03/10/2020
---

# Configuring TLS settings in Azure Database for MariaDB using Azure portal

This article describes how you can configure an Azure Database for MariaDB server to enforce connections for a minimum TLS version to go through and deny all connections with lower TLS version thereby enhancing the network security.

Security conscious customers now have the ability to enforce TLS version for connecting to their Azure Database for MariaDB. Customers now have a choice to set the minimal TLS version for their database server. For example, setting this Minimum TLS version to 1.0 means you shall allow clients connecting using TLS 1.0,1.1 and 1.2. Alternatively, setting this to 1.2 means that you only allow clients connecting using TLS 1.2 and all incoming connections with TLS 1.0 and TLS 1.1 will be rejected.

## Prerequisites

To complete this how-to guide, you need:

* An [Azure Database for MariaDB](quickstart-create-mariaDB-server-database-using-azure-portal.md)

## Set TLS configurations for Azure Database for MariaDB

Follow these steps to set MariaDB server minimum TLS version:

* In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MariaDB server.

* On the MariaDB server page, under **Settings** heading, click **Connection security** to open the connection security configuration page.

* In the **Minimum TLS version**, select **1.2** to deny connections with TLS version less than TLS 1.2 for your MariaDB server.

    ![Azure Database for MariaDB TLS configuration](./media/howto-tls-configurations/tls-configurations.png)

* Click **Save** to save the changes.

* A notification will confirm that connection security setting was successfully enabled.

    ![Azure Database for MariaDB TLS configuration success](./media/howto-tls-configurations/tls-configurations-success.png)

## Next steps

Learn about [how to create alerts on metrics](howto-alert-on-metric.md).
