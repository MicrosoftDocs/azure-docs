---
title: TLS configuration - Azure portal - Azure Database for PostgreSQL - Single server
description: Learn how to set TLS configuration using Azure portal for your Azure Database for PostgreSQL Single server 
author: kummanish
ms.author: manishku
ms.service: postgresql
ms.topic: conceptual
ms.date: 03/10/2020
---

# Configuring TLS settings in Azure Database for PostgreSQL - Single server using Azure portal

This article describes how you can configure an Azure Database for PostgreSQL - Single server to enforce a minimum TLS version for all incoming connections, which helps improve the network security.

Customers now have the ability to enforce TLS version for connecting to their Azure Database for PostgreSQL - Single server. Customers now have a choice to set the minimal TLS version for their database server. For example, setting the minimum TLS setting version to TLS 1.0 means your server will allow connections from clients using TLS 1.0, 1.1, and 1.2+. Alternatively, setting this to 1.2 means that you only allow connections from clients using TLS 1.2 and all connections with TLS 1.0 and TLS 1.1 will be rejected.

## Prerequisites

To complete this how-to guide, you need:

* An [Azure Database for PostgreSQL](quickstart-create-server-database-portal.md)

## Set TLS configurations for Azure Database for PostgreSQL - Single server

Follow these steps to set PostgreSQL Single server minimum TLS version:

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for PostgreSQL - Single server.

1.  On the Azure Database for PostgreSQL - Single server page, under **Settings**, click **Connection security** to open the connection security configuration page.

1. In **Minimum TLS version**, select **1.2** to deny connections with TLS version less than TLS 1.2 for your PostgreSQL Single server.

    ![Azure Database for PostgreSQL Single - server TLS configuration](./media/howto-tls-configurations/setting-tls-value.png)

1. Click **Save** to save the changes.

1. A notification will confirm that connection security setting was successfully enabled.

    ![Azure Database for PostgreSQL - Single server TLS configuration success](./media/howto-tls-configurations/setting-tls-value-success.png)

## Next steps

Learn about [how to create alerts on metrics](howto-alert-on-metric.md).
