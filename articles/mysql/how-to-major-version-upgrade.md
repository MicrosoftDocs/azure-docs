---
title: Major version upgrade - Azure portal - Azure Database for MySQL - Single Server
description: This article describes how you can upgrade major version for Azure Database for MySQL - Single Server using Azure portal
author: ambhatna
ms.author: ambhatna
ms.service: mysql
ms.topic: how-to
ms.date: 11/16/2020
---
# Major version upgrade in Azure Database for MySQL Single Server using the Azure portal

> [!IMPORTANT]
> Major version upgrade for Azure database for MySQL Single Server is in public preview.

This article describes how you can upgrade your MySQL major version in-place in Azure Database for MySQL single server.

This feature will enable customers to perform in-place upgrades of their MySQL 5.6 servers to MySQL 5.7 with a click of button without any data movement or the need of any application connection string changes.

> [!Note]
> * Major version upgrade is only available for major version upgrade from MySQL 5.6 to MySQL 5.7<br>
> * Major version upgrade is not supported on replica server yet.

## Prerequisites
To complete this how-to guide, you need:
- An [Azure Database for MySQL Single Server](quickstart-create-mysql-server-database-using-azure-portal.md)

## Perform major version upgrade from MySQL 5.6 to MySQL 5.7

Follow these steps to perform major version upgrade for your Azure Database of MySQL 5.6 server

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MySQL 5.6 server.

2. From the **Overview** page, click the **Upgrade** button in the toolbar.

3. In the **Upgrade** section, select **OK** to upgrade Azure database for MySQL 5.6 server to 5.7 server.

    :::image type="content" source="./media/how-to-major-version-upgrade-portal/upgrade.png" alt-text="Azure Database for MySQL - overview - upgrade":::

4. A notification will confirm that upgrade is successful.

## Next steps

Learn about [Azure Database for MySQL versioning policy](concepts-version-policy.md).