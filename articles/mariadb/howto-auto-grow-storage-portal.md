---
title: Auto grow storage - Azure portal - Azure Database for MariaDB
description: This article describes how you can enable auto grow storage for Azure Database for MariaDB using Azure portal
author: ambhatna
ms.author: ambhatna
ms.service: mariadb
ms.topic: conceptual
ms.date: 3/18/2020
---
# Auto grow storage in Azure Database for MariaDB using the Azure portal
This article describes how you can configure an Azure Database for MariaDB server storage to grow without impacting the workload.

When a server reaches the allocated storage limit, the server is marked as read-only. However, if you enable storage auto grow, the server storage increases to accommodate the growing data. For servers with less than 100 GB provisioned storage, the provisioned storage size is increased by 5 GB as soon as the free storage is below the greater of 1 GB or 10% of the provisioned storage. For servers with more than 100 GB of provisioned storage, the provisioned storage size is increased by 5% when the free storage space is below 5% of the provisioned storage size. Maximum storage limits as specified [here](https://docs.microsoft.com/azure/mariadb/concepts-pricing-tiers#storage) apply.

## Prerequisites
To complete this how-to guide, you need:
- An [Azure Database for MariaDB server](./quickstart-create-mariadb-server-database-using-azure-portal.md)

## Enable storage auto grow 

Follow these steps to set MariaDB server storage auto grow:

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MariaDB server.

2. On the MariaDB server page, under **Settings** heading, click **Pricing tier** to open the pricing tier page.

3. In the Auto-growth section, select **Yes** to enable storage auto grow.

    ![Azure Database for MariaDB - Settings_Pricing_tier - Auto-growth](./media/howto-auto-grow-storage-portal/3-auto-grow.png)

4. Click **OK** to save the changes.

5. A notification will confirm that auto grow was successfully enabled.

    ![Azure Database for MariaDB - auto-growth success](./media/howto-auto-grow-storage-portal/5-auto-grow-successful.png)

## Next steps

Learn about [how to create alerts on metrics](howto-alert-metric.md).
