---
title: Troubleshooting guides - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: Learn how to use Troubleshooting guides for Azure Database for PostgreSQL - Flexible Server from the Azure portal.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 03/21/2023
---

# Use the Troubleshooting guides for Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this article, you'll learn how to use Troubleshooting guides for Azure Database for PostgreSQL from the Azure portal. To learn more about Troubleshooting guides, see the [overview](concepts-troubleshooting-guides.md).

## Prerequisites

To effectively troubleshoot specific issue, you need to make sure you have all the necessary data in place. 
Each troubleshooting guide requires a specific set of data, which is sourced from three separate features: [Diagnostic settings](howto-configure-and-access-logs.md), [Query Store](concepts-query-store.md), and [Enhanced Metrics](concepts-monitoring.md#enabling-enhanced-metrics).
All troubleshooting guides require logs to be sent to the Log Analytics workspace, but the specific category of logs to be captured may vary depending on the particular guide. 

Please follow the steps described in the [Configure and Access Logs in Azure Database for PostgreSQL - Flexible Server](howto-configure-and-access-logs.md) article to configure diagnostic settings and send the logs to the Log Analytics workspace.
Query Store, and Enhanced Metrics are configured via the Server Parameters. Please follow the steps described in the "Configure server parameters in Azure Database for PostgreSQL - Flexible Server" articles for [Azure portal](howto-configure-server-parameters-using-portal.md) or [Azure CLI](howto-configure-server-parameters-using-cli.md).  

The table below provides information on the required log categories for each troubleshooting guide, as well as the necessary Query Store, Enhanced Metrics and Server Parameters prerequisites.

| Troubleshooting guide | Diagnostic settings log categories                                                                                  | Query Store                                  | Enhanced Metrics                    | Server Parameters |
|:----------------------|:--------------------------------------------------------------------------------------------------------------------|----------------------------------------------|-------------------------------------|-------------------|
| Autovacuum Blockers   | PostgreSQL Sessions, PostgreSQL Database Remaining Transactions                                                     | N/A                                          | N/A                                 | N/A               |
| Autovacuum Monitoring | PostgreSQL Server Logs, PostgreSQL Tables Statistics, PostgreSQL Database Remaining Transactions                    | N/A                                          | N/A                                 | log_autovacuum_min_duration |
| High CPU Usage        | PostgreSQL Server Logs, PostgreSQL Sessions, AllMetrics                                                             | pg_qs.query_capture_mode to TOP or ALL       | metrics.collector_database_activity | N/A               |
| High IOPS Usage       | PostgreSQL Query Store Runtime, PostgreSQL Server Logs, PostgreSQL Sessions, PostgreSQL Query Store Wait Statistics | pgms_wait_sampling.query_capture_mode to ALL | metrics.collector_database_activity | track_io_timing to ON          |
| High Memory Usage     | PostgreSQL Server Logs, PostgreSQL Sessions, PostgreSQL Query Store Runtime                                         | pg_qs.query_capture_mode to TOP or ALL       | metrics.collector_database_activity | N/A               |
| High Temporary Files  | PostgreSQL Sessions, PostgreSQL Query Store Runtime, PostgreSQL Query Store Wait Statistics                         | pg_qs.query_capture_mode to TOP or ALL       | metrics.collector_database_activity | N/A               |


> [!NOTE]
> Please note that if you have recently enabled diagnostic settings, query store, enhanced metrics or server parameters, it may take some time for the data to be populated. Additionally, if there has been no activity on the database within a certain time frame, the charts might appear empty. In such cases, try changing the time range to capture relevant data. Be patient and allow the system to collect and display the necessary data before proceeding with your troubleshooting efforts.

## Using Troubleshooting guides

To use troubleshooting guides, follow these steps:

1. Open the Azure portal and find a Postgres instance that you want to examine.

2. From the left-side menu, open Help > Troubleshooting guides.

3. Navigate to the top of the page where you will find a series of tabs, each representing one of the six problems you may wish to resolve. Click on the relevant tab.

   :::image type="content" source="./media/how-to-troubleshooting-guides/portal-blade-overview.png" alt-text="Screenshot of Troubleshooting guides - tabular view.":::

4. Select the time range during which the problem occurred.

    :::image type="content" source="./media/how-to-troubleshooting-guides/time-range.png" alt-text="Screenshot of time range picker.":::

5. Follow the step-by-step instructions provided by the guide. Pay close attention to the charts and data visualizations plotted within the troubleshooting steps, as they can help you identify any inaccuracies or anomalies. Use this information to effectively diagnose and resolve the problem at hand.

### Retrieving the Query Text

Due to privacy considerations, certain information such as query text and usernames may not be displayed within the Azure portal. 
To retrieve the query text, you will need to log in to your Azure Database for PostgreSQL - Flexible Server instance. 
Access the `azure_sys` database using the PostgreSQL client of your choice, where query store data is stored. 
Once connected, query the `query_store.query_texts_view view` to retrieve the desired query text.

In the example shown below, we utilize Azure Cloud Shell and the `psql` tool to accomplish this task:

:::image type="content" source="./media/how-to-troubleshooting-guides/retrieve-query-text.png" alt-text="Screenshot of retrieving the Query Text.":::

### Retrieving the Username

For privacy reasons, the Azure portal displays the role ID from the PostgreSQL metadata (pg_catalog) rather than the actual username. 
To retrieve the username, you can query the `pg_roles` view or use the query shown below in your PostgreSQL client of choice, such as Azure Cloud Shell and the `psql` tool:

```sql
SELECT 'UserID'::regrole;
```

:::image type="content" source="./media/how-to-troubleshooting-guides/retrieve-username.png" alt-text="Screenshot of retrieving the Username.":::


## Next steps

* Learn more about [Troubleshoot high CPU utilization](how-to-high-cpu-utilization.md).
* Learn more about [High memory utilization](how-to-high-memory-utilization.md).
* Learn more about [Troubleshoot high IOPS utilization](how-to-high-io-utilization.md).
* Learn more about [Autovacuum Tuning](how-to-autovacuum-tuning.md).

[//]: # (* Learn how to [create and manage read replicas in the Azure CLI and REST API]&#40;how-to-read-replicas-cli.md&#41;.)
