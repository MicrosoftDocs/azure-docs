---
title: Configure intelligent tuning - Azure Database for PostgreSQL - Flexible Server - portal
description: This article describes how to configure intelligent tuning in Azure Database for PostgreSQL Flexible Server through the Azure portal.
ms.author: alkuchar
author: AwdotiaRomanowna
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 06/05/2023
---

# Configure intelligent tuning for Azure Database for PostgreSQL - Flexible Server by using the Azure portal

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article provides a step-by-step procedure to configure intelligent tuning in Azure Database for PostgreSQL - Flexible Server by using the Azure portal.

To learn more about intelligent tuning, see the [overview](concepts-intelligent-tuning.md).

> [!IMPORTANT]
> Autovacuum tuning is currently supported for the General Purpose and Memory Optimized server compute tiers that have four or more vCores. The Burstable server compute tier is not supported.

## Steps to enable intelligent tuning on your flexible server

1. Visit the [Azure portal](https://portal.azure.com/) and select the flexible server on which you want to enable intelligent tuning.

2. On the left pane, select **Server parameters** and then search for **intelligent tuning**.

   :::image type="content" source="media/how-to-intelligent-tuning-portal/enable-intelligent-tuning.png" alt-text="Screenshot of the pane for server parameters with a search for intelligent tuning.":::

3. The pane shows two parameters: `intelligent_tuning` and `intelligent_tuning.metric_targets`. To activate intelligent tuning, change `intelligent_tuning` to **ON**. You have the option to select one, multiple, or all available tuning targets in `intelligent_tuning.metric_targets`. Select the **Save** button to apply these changes.

   :::image type="content" source="media/how-to-intelligent-tuning-portal/choose-tuning-targets.png" alt-text="Screenshot of Server Parameter blade with tuning targets options.":::

> [!NOTE]
> Both `intelligent_tuning` and `intelligent_tuning.metric_targets` server parameters are dynamic. That is, no server restart is required when their values are changed.

### Considerations for selecting values for tuning targets

When you're choosing values from the `intelligent_tuning.metric_targets` server parameter, take the following considerations into account:

* The `NONE` value takes precedence over all other values. If you choose `NONE` alongside any combination of other values, the parameter will be perceived as set to `NONE`. This is equivalent to `intelligent_tuning = OFF`, so no tuning will occur.

* The `ALL` value takes precedence over all other values, with the exception of `NONE`. If you choose `ALL` with any combination, barring `NONE`, all the listed parameters will undergo tuning.

* The `ALL` value encompasses all existing metric targets. This value will also automatically apply to any new metric targets that you might add in the future. This allows for comprehensive and future-proof tuning of your PostgreSQL server.

## Next steps

- [Perform intelligent tuning in Azure Database for PostgreSQL - Flexible Server](concepts-intelligent-tuning.md)
