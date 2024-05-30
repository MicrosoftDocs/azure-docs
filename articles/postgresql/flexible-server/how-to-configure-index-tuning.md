---
title: How to configure index tuning
description: This article describes how to configure the index tuning feature in Azure Database for PostgreSQL - Flexible Server.
author: nachoalonsoportillo
ms.author: ialonso
ms.reviewer: maghan
ms.date: 05/20/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - build-2024
ms.topic: how-to
# customer intent: As a user, I want to learn about how to enable, disable and configure the index tuning feature in Azure Database for PostgreSQL - Flexible Server.
---
# Configure index tuning in Azure Database for PostgreSQL - Flexible Server (Preview)

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Index tuning can be enabled, disabled and configured through a [set of parameters](#configuration-options) that control its behavior, such as how often a tuning session can run.

## Enable index tuning

Index tuning depends on [Monitor performance with Query Store](concepts-query-store.md). We don't recommend enabling Query Store on the Burstable pricing tier for the performance implications it might have. For the same reason, index tuning isn't recommended for servers on the Burstable tier.

Index tuning is an opt-in feature that isn't enabled by default on a server. It can be enabled or disabled globally for all databases on a given server and can't be turned on or off per database.

### Enable index tuning in the Azure portal (via Server parameters)

1. Sign in to the Azure portal and select your Azure Database for the PostgreSQL flexible server instance.
1. Select **Server parameters** in the **Settings** section of the menu.
1. Search for the `pg_qs.query_capture_mode` parameter.
1. Set the value to `TOP` or `ALL`, depending on whether you want to track top-level or nested queries. Nested queries are those queries executed inside a function or procedure. To see the highest benefit of index tuning, setting this parameter to `ALL` is recommended.

   :::image type="content" source="media/how-to-configure-index-tuning/set-pg-qs-query-capture-mode-parameter-to-all.png" alt-text="Screenshot that shows how to set the value of the pg_qs.query_capture_mode server parameter." lightbox="media/how-to-configure-index-tuning/set-pg-qs-query-capture-mode-parameter-to-all.png":::

1. Search for the `index_tuning.mode` parameter and set its value to `REPORT`.

   :::image type="content" source="media/how-to-configure-index-tuning/set-index-tuning-mode-parameter-to-report.png" alt-text="Screenshot that shows how to set the value of the index_tuning.mode server parameter to REPORT." lightbox="media/how-to-configure-index-tuning/set-index-tuning-mode-parameter-to-report.png":::

1. Select on **Save**.

   :::image type="content" source="media/how-to-configure-index-tuning/save-parameters.png" alt-text="Screenshot that shows how to save the modified parameters so that they take effect." lightbox="media/how-to-configure-index-tuning/save-parameters.png":::

1. Wait for the deployment to be completed successfully before considering the enabled feature.

   :::image type="content" source="media/how-to-configure-index-tuning/wait-for-save-parameters-deployment.png" alt-text="Screenshot that shows the deployment initiated to save modified server parameters when it completes successfully." lightbox="media/how-to-configure-index-tuning/wait-for-save-parameters-deployment.png":::

### Enable index tuning in Azure portal (via Index tuning)

1. Sign in to the Azure portal and select your Azure Database for the PostgreSQL flexible server instance.
1. Select **Index tuning (preview)** in the **Intelligent Performance** section of the menu.
1. If either `pg_qs.query_capture_mode` is set to `NONE` or `index_tuning.mode` is set to `OFF`, the index tuning page will give you the option to enable index tuning.
1. Select on either of the two **Enable index tuning** buttons to enable index tuning feature and its required Query Store dependency, provided Query Store is disabled.

   :::image type="content" source="media/how-to-configure-index-tuning/enable-index-tuning-via-page.png" alt-text="Screenshot that shows how to enable index tuning through the Index tuning (preview) page." lightbox="media/how-to-configure-index-tuning/enable-index-tuning-via-page.png":::

1. After enabling index tuning, allow 12 hours for the index tuning engine to analyze the workload collected by Query Store during that time and eventually produce create or drop index recommendations.

> [!IMPORTANT]  
> When index tuning is enabled through the **Enable index tuning** button, if `pg_qs.query_capture_mode` is set to `NONE`, it will be set to `ALL`. If it was already set to either `TOP` or `ALL`, it will be left in its current state.

## Disable index tuning

Disabling index tuning can also be achieved either changing the corresponding server parameter or leveraging the **Index tuning (preview)** page.

### Disable index tuning in Azure portal (via Server parameters)

1. Sign in to the Azure portal and select your Azure Database for PostgreSQL flexible server instance.
1. Select **Server parameters** in the **Settings** section of the menu.
1. Search for the `index_tuning.mode` parameter and set its value to `OFF`.

   :::image type="content" source="media/how-to-configure-index-tuning/set-index-tuning-mode-parameter-to-off.png" alt-text="Screenshot that shows how to set the value of the index_tuning.mode server parameter to OFF." lightbox="media/how-to-configure-index-tuning/set-index-tuning-mode-parameter-to-off.png":::

1. Disabling index tuning doesn't automatically disables Query Store. Assess whether you want to continue using [Monitor performance with Query Store](concepts-query-store.md) to monitor the performance of your workload and leave it enabled or, if you want to disable it, set `pg_qs.query_capture_mode` to `NONE`.
1. Select on **Save**.

   :::image type="content" source="media/how-to-configure-index-tuning/save-parameters.png" alt-text="Screenshot that shows how to save the modified parameters so that they take effect." lightbox="media/how-to-configure-index-tuning/save-parameters.png":::

1. Wait for the deployment to complete successfully before considering the feature disabled.

   :::image type="content" source="media/how-to-configure-index-tuning/wait-for-save-parameters-deployment.png" alt-text="Screenshot that shows the deployment initiated to save modified server parameters when it completes successfully." lightbox="media/how-to-configure-index-tuning/wait-for-save-parameters-deployment.png":::

### Disable index tuning in the Azure portal (via Index tuning)

1. Sign in to the Azure portal and select your Azure Database for the PostgreSQL flexible server instance.
1. Select **Index tuning (preview)** in the **Query Performance Insight** section of the menu.
1. Select on the **Disable index tuning** button to disable the feature.

   :::image type="content" source="media/how-to-configure-index-tuning/disable-index-tuning-via-page.png" alt-text="Screenshot that shows how to disable index tuning through the Index tuning (preview) page." lightbox="media/how-to-configure-index-tuning/disable-index-tuning-via-page.png":::

1. Assess whether you want to continue using [Monitor performance with Query Store](concepts-query-store.md) to monitor the performance of your workload and leave it enabled or, if you want to disable it, set `pg_qs.query_capture_mode` to `NONE`.

> [!IMPORTANT]  
> When index tuning is disabled through the **Disable index tuning** button, server parameter `pg_qs.query_capture_mode` is left intact.

## Configuration options

When index tuning is enabled, it wakes up with a frequency configured in the `index_tuning.analysis_interval` server parameter (defaults to 720 minutes or 12 hours) and starts analyzing the workload recorded by Query Store during that period.

Notice that if you change the value for `index_tuning.analysis_interval`, it only is observed after the next scheduled execution completes. So, for example, if you enable index tuning one day at 10:00AM, because default value for `index_tuning.analysis_interval` is 720 minutes, the first execution will be scheduled to start at 10:00PM that same day. Any changes you make to the value of `index_tuning.analysis_interval` between 10:00AM and 10:00PM will not affect that initial schedule. Only when the scheduled run completes, it will read current value set for `index_tuning.analysis_interval` and will schedule next execution according to that value.

The following options are available for configuring index tuning parameters:

| **Parameter** | **Description** | **Default** | **Range** | **Units** |
| --- | --- | --- | --- | --- |
| `index_tuning.analysis_interval` | Sets the frequency at which each index optimization session is triggered when index_tuning.mode is set to `REPORT`. | `720` | `60 - 10080` | minutes |
| `index_tuning.max_columns_per_index` | Maximum number of columns that can be part of the index key for any recommended index. | `2` | `1 - 10` | |
| `index_tuning.max_index_count` | Maximum indexes recommended for each database during one optimization session. | `10` | `1 - 25` | |
| `index_tuning.max_indexes_per_table` | Maximum number of indexes that can be recommended for each table. | `10` | `1 - 25` | |
| `index_tuning.max_queries_per_database` | Number of slowest queries per database for which indexes can be recommended. | `25` | `5 - 100` | |
| `index_tuning.max_regression_factor` | Acceptable regression introduced by a recommended index on any of the queries analyzed during one optimization session. | `0.1` | `0.05 - 0.2` | percentage |
| `index_tuning.max_total_size_factor` | Maximum total size, in percentage of total disk space, that all recommended indexes for any given database can use. | `0.1` | `0 - 1` | percentage |
| `index_tuning.min_improvement_factor` | Cost improvement that a recommended index must provide to at least one of the queries analyzed during one optimization session. | `0.2` | `0 - 20` | percentage |
| `index_tuning.mode` | Configures index optimization as disabled (`OFF`) or enabled to only emit recommendation. Requires Query Store to be enabled by setting `pg_qs.query_capture_mode` to `TOP` or `ALL`. | `OFF` | `OFF, REPORT` | |
| `index_tuning.unused_dml_per_table` | Minimum number of daily average DML operations affecting the table, so their unused indexes are considered for dropping. | `1000` | `0 - 9999999` | |
| `index_tuning.unused_min_period` | Minimum number of days the index hasn't been used, based on system statistics, so it's considered for dropping. | `35` | `30 - 70` | |
| `index_tuning.unused_reads_per_table` | Minimum number of daily average read operations affecting the table so that their unused indexes are considered for dropping. | `1000` | `0 - 9999999` | |

## Related content

- [Index tuning in Azure Database for PostgreSQL - Flexible Server (Preview)](concepts-index-tuning.md)
- [Using index recommendations produced by index tuning in Azure Database for PostgreSQL - Flexible Server (Preview)](how-to-get-and-apply-recommendations-from-index-tuning.md)
- [Monitor performance with Query Store](concepts-query-store.md)
- [Usage scenarios for Query Store - Azure Database for PostgreSQL - Flexible Server](concepts-query-store-scenarios.md)
- [Best practices for Query Store - Azure Database for PostgreSQL - Flexible Server](concepts-query-store-best-practices.md)
- [Query Performance Insight for Azure Database for PostgreSQL - Flexible Server](concepts-query-performance-insight.md)
