---
title: Auto grow storage - Azure portal - Azure Database for PostgreSQL - Single Server
description: This article describes how you can configure storage auto-grow using the Azure portal in Azure Database for PostgreSQL - Single Server
ms.service: postgresql
ms.subservice: single-server
ms.topic: how-to
ms.author: sunila
author: sunilagarwal 
ms.date: 06/24/2022
---

# Auto grow storage using the Azure portal in Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This article describes how you can configure an Azure Database for PostgreSQL server storage to grow without impacting the workload.

When a server reaches the allocated storage limit, the server is marked as read-only. However, if you enable storage auto grow, the server storage increases to accommodate the growing data. For servers with less than 100 GB provisioned storage, the provisioned storage size is increased by 5 GB as soon as the free storage is below the greater of 1 GB or 10% of the provisioned storage. For servers with more than 100 GB of provisioned storage, the provisioned storage size is increased by 5% when the free storage space is below 10GB of the provisioned storage size. Maximum storage limits as specified [here](./concepts-pricing-tiers.md#storage) apply.

## Prerequisites

To complete this how-to guide, you need:
- An [Azure Database for PostgreSQL server](quickstart-create-server-database-portal.md)

## Enable storage auto grow

Follow these steps to set PostgreSQL server storage auto grow:

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for PostgreSQL server.

2. On the PostgreSQL server page, under **Settings**, select **Pricing tier** to open the pricing tier page.

3. In the **Auto-growth** section, select **Yes** to enable storage auto grow.

    :::image type="content" source="./media/how-to-auto-grow-storage-portal/3-auto-grow.png" alt-text="Azure Database for PostgreSQL - Settings_Pricing_tier - Auto-growth":::

4. Select **OK** to save the changes.

5. A notification will confirm that auto grow was successfully enabled.

    :::image type="content" source="./media/how-to-auto-grow-storage-portal/5-auto-grow-successful.png" alt-text="Azure Database for PostgreSQL - auto-growth success":::

## Next steps

Learn about [how to create alerts on metrics](how-to-alert-on-metric.md).
