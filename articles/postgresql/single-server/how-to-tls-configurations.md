---
title: TLS configuration - Azure portal - Azure Database for PostgreSQL - Single server
description: Learn how to set TLS configuration using Azure portal for your Azure Database for PostgreSQL Single server 
ms.service: postgresql
ms.subservice: single-server
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.topic: how-to
ms.date: 06/24/2022
---

# Configuring TLS settings in Azure Database for PostgreSQL Single - server using Azure portal

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This article describes how you can configure an Azure Database for PostgreSQL to enforce minimum TLS version allowed for connections and deny all connections with lower TLS version than configured minimum TLS version thereby enhancing the network security.

You can enforce TLS version for connecting to their Azure Database for PostgreSQL. Customers now have a choice to set the minimum TLS version for their database server. For example, setting the minimum TLS setting version to TLS 1.0 means your server will allow connections from clients using TLS 1.0, 1.1, and 1.2+. Instead, setting minimum tls version to 1.2+ means you only allow connections from clients using TLS 1.2 and all connections with TLS 1.0 and TLS 1.1 will be rejected.

## Prerequisites

To complete this how-to guide, you need:

* An [Azure Database for PostgreSQL](quickstart-create-server-database-portal.md)

## Set TLS configurations for Azure Database for PostgreSQL - Single server

Follow these steps to set PostgreSQL minimum TLS version:

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for PostgreSQL.

1.  On the Azure Database for PostgreSQL - Single server page, under **Settings**, select **Connection security** to open the connection security configuration page.

1. In **Minimum TLS version**, select **1.2** to deny connections with TLS version less than TLS 1.2 for your PostgreSQL Single server.

    :::image type="content" source="./media/how-to-tls-configurations/setting-tls-value.png" alt-text="Azure Database for PostgreSQL Single - server TLS configuration":::

1. Select **Save** to save the changes.

1. A notification will confirm that connection security setting was successfully enabled.

    :::image type="content" source="./media/how-to-tls-configurations/setting-tls-value-success.png" alt-text="Azure Database for PostgreSQL - Single server TLS configuration success":::

## Next steps

Learn about [how to create alerts on metrics](how-to-alert-on-metric.md)
