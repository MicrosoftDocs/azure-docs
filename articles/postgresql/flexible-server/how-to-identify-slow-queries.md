---
title: Identify Slow Running Query for Azure Database for PostgreSQL - Flexible Server
description: Troubleshooting guide for identifying slow running queries in Azure Database for PostgreSQL - Flexible Server
author: sarat0681
ms.author: sbalijepalli
ms.reviewer: maghan
ms.date: 10/26/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---
# Troubleshoot and identify slow-running queries in Azure Database for PostgreSQL - Flexible Server

This article shows you how to troubleshoot and identify slow-running queries using [Azure Database for PostgreSQL - Flexible Server](overview.md).

In a high CPU utilization scenario, in this article, you learn how to:

- Identify slow-running queries.

- Identify a slow-running procedure along with it. Identify a slow query among a list of queries that belong to the same slow-running stored procedure.

## High CPU scenario - Identify slow query

### Prerequisites

One must enable troubleshooting guides and auto_explain extension on the Azure Database for PostgreSQL – Flexible Server. To enable troubleshooting guides, follow the steps mentioned [here](how-to-troubleshooting-guides.md).

To enable auto_explain extension, follow the steps below:

1. Add auto_explain extension to the shared preload libraries as shown below from the server parameters page on the Flexible Server portal

   
   :::image type="content" source="./media/how-to-identify-slow-queries/shared-preload-library.png" alt-text="Screenshot of server parameters page with shared preload libraries parameter." lightbox="./media/how-to-identify-slow-queries/shared-preload-library.png":::

> [!NOTE]  
> Making this change will require a server restart.

2. After the auto_explain extension is added to shared preload libraries and the server has restarted, change the below highlighted auto_explain server parameters to `ON` from the server parameters page on the Flexible Server portal and leave the remaining ones
   with default values as shown below.

   :::image type="content" source="./media/how-to-identify-slow-queries/auto-explain-parameters.png" alt-text="Screenshot of server parameters page with auto_explain parameters." lightbox="./media/how-to-identify-slow-queries/auto-explain-parameters.png":::

> [!NOTE]  
> Updating `auto_explain.log_min_duration` parameter to 0 will start logging all queries being executed on the server. This may impact performance of the database. Proper due diligence must be made to come to a value which is considered slow on the server. Example if 30 seconds is considered threshold and all queries being run below 30 seconds is acceptable for application then it is advised to update the parameter to 30000 milliseconds. This would then log any query which is executed more than 30 seconds on the server.

### Scenario - Identify slow-running query

With troubleshooting guides and auto_explain extension in place, we explain the scenario with the help of an example.

We have a scenario where CPU utilization has spiked to 90% and would like to know the root cause of the spike. To debug the scenario, follow the steps mentioned below.

1. As soon as you're alerted by a CPU scenario, go to the troubleshooting guides available under the Help tab on the Flexible server portal overview page.

      :::image type="content" source="./media/how-to-identify-slow-queries/troubleshooting-guides-blade.png" alt-text="Screenshot of troubleshooting guides menu." lightbox="./media/how-to-identify-slow-queries/troubleshooting-guides-blade.png":::

2. Select the High CPU Usage tab from the page opened. The high CPU Utilization troubleshooting guide opens.

      :::image type="content" source="./media/how-to-identify-slow-queries/high-cpu-troubleshooting-guide.png" alt-text="Screenshot of troubleshooting guides menu - tabs. " lightbox="./media/how-to-identify-slow-queries/high-cpu-troubleshooting-guide.png":::

3. Select the time range of the reported CPU spike using the time range dropdown list.

      :::image type="content" source="./media/how-to-identify-slow-queries/high-cpu-timerange.png" alt-text="Screenshot of troubleshooting guides menu - CPU tab." lightbox="./media/how-to-identify-slow-queries/high-cpu-timerange.png":::

4. Select Top CPU Consuming Queries tab.

      The tab shares details of all the queries that ran in the interval where 90% CPU utilization was seen. From the snapshot, it looks like the query with the slowest average execution time during the time interval was ~2.6 minutes, and the query ran 22 times during the interval. This is most likely the cause of CPU spikes.

      :::image type="content" source="./media/how-to-identify-slow-queries/high-cpu-query.png" alt-text="Screenshot of troubleshooting guides menu - Top CPU consuming queries tab." lightbox="./media/how-to-identify-slow-queries/high-cpu-query.png":::

5. Connect to azure_sys database and execute the query to retrieve actual query text using the script below

```sql
    psql -h ServerName.postgres.database.azure.com -U AdminUsername -d azure_sys

     SELECT query_sql_text
     FROM query_store.query_texts_view
     WHERE query_text_id = <add query id identified>;
```

6. In the example considered, the query that was found slow was the following:

```sql
SELECT  c_id, SUM(c_balance) AS total_balance
FROM customer
GROUP BY c_w_id,c_id
order by c_w_id;
```

7. To understand what exact explain plan was generated, use Postgres logs. Auto explain extension would have logged an entry in the logs every time the query execution was completed during the interval. Select Logs section from the `Monitoring` tab from the Flexible server portal overview page.

    :::image type="content" source="./media/how-to-identify-slow-queries/log-analytics-tab.png" alt-text="Screenshot of troubleshooting guides menu - Logs." lightbox="./media/how-to-identify-slow-queries/log-analytics-tab.png":::
 

8. Select the time range where 90% CPU Utilization was found.
   
   :::image type="content" source="./media/how-to-identify-slow-queries/log-analytics-timerange.png" alt-text="Screenshot of troubleshooting guides menu - Logs Timerange." lightbox="./media/how-to-identify-slow-queries/log-analytics-timerange.png":::

9. Execute the below query to retrieve the explain analyze output of the query identified.

```sql
AzureDiagnostics
| where Category contains  'PostgreSQLLogs'
| where Message contains "<add snippet of SQL text identified or add table name involved in the query>"
| project TimeGenerated, Message
```

The message column will store the execution plan as shown below:

```sql
2023-10-10 19:56:46 UTC-6525a8e7.2e3d-LOG: duration: 150692.864 ms plan:

Query Text: SELECT c_id, SUM(c_balance) AS total_balance
FROM customer
GROUP BY c_w_id,c_id
order by c_w_id;
GroupAggregate (cost=1906820.83..2131820.83 rows=10000000 width=40) (actual time=70930.833..129231.950 rows=10000000 loops=1)
Output: c_id, sum(c_balance), c_w_id
Group Key: customer.c_w_id, customer.c_id
Buffers: shared hit=44639 read=355362, temp read=77521 written=77701
-> Sort (cost=1906820.83..1931820.83 rows=10000000 width=13) (actual time=70930.821..81898.430 rows=10000000 loops=1)
Output: c_id, c_w_id, c_balance
Sort Key: customer.c_w_id, customer.c_id
Sort Method: external merge Disk: 225104kB
Buffers: shared hit=44639 read=355362, temp read=77521 written=77701
-> Seq Scan on public.customer (cost=0.00..500001.00 rows=10000000 width=13) (actual time=0.021..22997.697 rows=10000000 loops=1)
Output: c_id, c_w_id, c_balance
```

The query ran for ~2.5 minutes, as shown in troubleshooting guides, and is confirmed by the `duration` value of 150692.864 ms from the execution plan output fetched. Use the explain analyze output to troubleshoot further and tune the query.

> [!NOTE]  
> Note that the query ran 22 times during the interval, and the logs shown above are one such entry captured during the interval.

## High CPU scenario - Identify slow-running procedure and slow queries associated with the procedure

In the second scenario, a stored procedure execution time is found to be slow, and the goal is to identify and tune the slow-running query that is part of the stored procedure.

### Prerequisites

One must enable troubleshooting guides and auto_explain extension on the Azure Database for PostgreSQL – Flexible Server as a prerequisite. To enable troubleshooting guides, follow the steps mentioned [here](how-to-troubleshooting-guides.md).

To enable auto_explain extension, follow the steps below:

1. Add auto_explain extension to the shared preload libraries as shown below from the server parameters page on the Flexible Server portal

   :::image type="content" source="./media/how-to-identify-slow-queries/shared-preload-library.png" alt-text="Screenshot of server parameters page with shared preload libraries parameter - Procedure." lightbox="./media/how-to-identify-slow-queries/shared-preload-library.png":::

> [!NOTE]  
> Making this change will require a server restart.

2. After the auto_explain extension is added to shared preload libraries and the server has restarted, change the below highlighted auto_explain server parameters to `ON` from the server parameters page on  the Flexible Server portal and leave the remaining ones
   with default values as shown below.

   :::image type="content" source="./media/how-to-identify-slow-queries/auto-explain-procedure-parameters.png" alt-text="Screenshot of server parameters blade with auto_explain parameters - Procedure." lightbox="./media/how-to-identify-slow-queries/auto-explain-procedure-parameters.png":::

> [!NOTE]
>-    Updating `auto_explain.log_min_duration` parameter to 0 will start logging all queries being executed on the server. This may impact performance of the database. Proper due diligence must be made to come to a value which is considered slow on the server. Example if 30 seconds is considered threshold and all queries being run below 30 seconds is acceptable for application then it is advised to update the parameter to 30000 milliseconds. This would then log any query which is executed more than 30 seconds on the server.
>-    The parameter `auto_explain.log_nested_statements` causes nested statements (statements executed inside a function or procedure) to be considered for logging. When it is off, only top-level query plans are logged.  

### Scenario - Identify slow-running query in a stored procedure

With troubleshooting guides and auto_explain extension in place, we explain the scenario with the help of an example.

We have a scenario where CPU utilization has spiked to 90% and would like to know the root cause of the spike. To debug the scenario, follow the steps mentioned below.

1. As soon as you're alerted by a CPU scenario, go to the troubleshooting guides available under the Help tab on the Flexible server portal overview page.

      :::image type="content" source="./media/how-to-identify-slow-queries/troubleshooting-guides-blade.png" alt-text="Screenshot of troubleshooting guides menu." lightbox="./media/how-to-identify-slow-queries/troubleshooting-guides-blade.png":::

2. Select the High CPU Usage tab from the page opened. The high CPU Utilization troubleshooting guide opens.

      :::image type="content" source="./media/how-to-identify-slow-queries/high-cpu-troubleshooting-guide.png" alt-text="Screenshot of troubleshooting guides tabs." lightbox="./media/how-to-identify-slow-queries/high-cpu-troubleshooting-guide.png":::

3. Select the time range of the reported CPU spike using the time range dropdown list.

      :::image type="content" source="./media/how-to-identify-slow-queries/high-cpu-procedure-timerange.png" alt-text="Screenshot of troubleshooting guides - CPU tab." lightbox="./media/how-to-identify-slow-queries/high-cpu-procedure-timerange.png":::

4. Select the Top CPU Consuming Queries tab.

      The tab shares details of all the queries that ran in the interval where 90% CPU utilization was seen. From the snapshot, it looks like the query with the slowest average execution time during the time interval was ~6.3 minutes, and the query ran 35 times during the interval. This is most likely the cause of CPU spikes.

      :::image type="content" source="./media/how-to-identify-slow-queries/high-cpu-procedure.png" alt-text="Screenshot of troubleshooting guides - CPU tab - queries." lightbox="./media/how-to-identify-slow-queries/high-cpu-procedure.png":::

      It's important to note from the snapshot below that the query type as highlighted below is `Utility``. Generally, a utility can be a stored procedure or function running during the interval.

5.    Connect to azure_sys database and execute the query to retrieve actual query text using the below script. 

```sql
    psql -h ServerName.postgres.database.azure.com -U AdminUsername -d azure_sys

     SELECT query_sql_text
     FROM query_store.query_texts_view
     WHERE query_text_id = <add query id identified>;
```

6. In the example considered, the query that was found slow was a stored procedure as mentioned below:

```sql
    call autoexplain_test ();
```

7. To understand what exact explanations are generated for the queries that are part of the stored procedure, use Postgres logs. Auto explain extension would have logged an entry in the logs every time the query execution was completed during the interval. Select the Logs section from the `Monitoring` tab from the Flexible server portal overview page.

    :::image type="content" source="./media/how-to-identify-slow-queries/log-analytics-tab.png" alt-text="Screenshot of troubleshooting guides menu - Logs." lightbox="./media/how-to-identify-slow-queries/log-analytics-tab.png":::

8. Select the time range where 90% CPU Utilization was found.

   :::image type="content" source="./media/how-to-identify-slow-queries/log-analytics-timerange.png" alt-text="Screenshot of troubleshooting guides menu - Logs Time range." lightbox="./media/how-to-identify-slow-queries/log-analytics-timerange.png":::

9. Execute the query below to retrieve the explained analyze output of the identified query.

```sql
AzureDiagnostics
| where Category contains  'PostgreSQLLogs'
| where Message contains "<add a snippet of SQL text identified or add table name involved in the queries related to stored procedure>"
| project TimeGenerated, Message
```

The procedure has multiple queries, which are highlighted below. The explain analyze output of every query used in the stored procedure is logged in to analyze further and troubleshoot. The execution time of the queries logged can be used to identify the slowest queries that are part of the stored procedure.

```sql
2023-10-11 17:52:45 UTC-6526d7f0.7f67-LOG: duration: 38459.176 ms plan:

Query Text: insert into customer_balance SELECT c_id, SUM(c_balance) AS total_balance FROM customer GROUP BY c_w_id,c_id order by c_w_id
Insert on public.customer_balance (cost=1906820.83..2231820.83 rows=0 width=0) (actual time=38459.173..38459.174 rows=0 loops=1)Buffers: shared hit=10108203 read=454055 dirtied=54058, temp read=77521 written=77701 WAL: records=10000000 fpi=1 bytes=640002197
    -> Subquery Scan on "*SELECT*" (cost=1906820.83..2231820.83 rows=10000000 width=36) (actual time=20415.738..29514.742 rows=10000000 loops=1)
        Output: "*SELECT*".c_id, "*SELECT*".total_balance Buffers: shared hit=1 read=400000, temp read=77521 written=77701
            -> GroupAggregate (cost=1906820.83..2131820.83 rows=10000000 width=40) (actual time=20415.737..28574.266 rows=10000000 loops=1)
                Output: customer.c_id, sum(customer.c_balance), customer.c_w_id Group Key: customer.c_w_id, customer.c_id Buffers: shared hit=1 read=400000, temp read=77521 written=77701
                -> Sort (cost=1906820.83..1931820.83 rows=10000000 width=13) (actual time=20415.723..22023.515 rows=10000000 loops=1)
                    Output: customer.c_id, customer.c_w_id, customer.c_balance Sort Key: customer.c_w_id, customer.c_id Sort Method: external merge Disk: 225104kB Buffers: shared hit=1 read=400000, temp read=77521 written=77701
                     -> Seq Scan on public.customer (cost=0.00..500001.00 rows=10000000 width=13) (actual time=0.310..15061.471 rows=10000000 loops=1) Output: customer.c_id, customer.c_w_id, customer.c_balance Buffers: shared hit=1 read=400000

2023-10-11 17:52:07 UTC-6526d7f0.7f67-LOG: duration: 61939.529 ms plan:
Query Text: delete from customer_balance
Delete on public.customer_balance (cost=0.00..799173.51 rows=0 width=0) (actual time=61939.525..61939.526 rows=0 loops=1) Buffers: shared hit=50027707 read=620942 dirtied=295462 written=71785 WAL: records=50026565 fpi=34 bytes=2711252160
    -> Seq Scan on public.customer_balance (cost=0.00..799173.51 rows=15052451 width=6) (actual time=3185.519..35234.061 rows=50000000 loops=1)
        Output: ctid Buffers: shared hit=27707 read=620942 dirtied=26565 written=71785 WAL: records=26565 fpi=34 bytes=11252160


2023-10-11 17:51:05 UTC-6526d7f0.7f67-LOG: duration: 10387.322 ms plan:
Query Text: select max(c_id) from customer
Finalize Aggregate (cost=180185.84..180185.85 rows=1 width=4) (actual time=10387.220..10387.319 rows=1 loops=1) Output: max(c_id) Buffers: shared hit=37148 read=1204 written=69
    -> Gather (cost=180185.63..180185.84 rows=2 width=4) (actual time=10387.214..10387.314 rows=1 loops=1)
        Output: (PARTIAL max(c_id)) Workers Planned: 2 Workers Launched: 0 Buffers: shared hit=37148 read=1204 written=69
        -> Partial Aggregate (cost=179185.63..179185.64 rows=1 width=4) (actual time=10387.012..10387.013 rows=1 loops=1) Output: PARTIAL max(c_id) Buffers: shared hit=37148 read=1204 written=69
            -> Parallel Index Only Scan using customer_i1 on public.customer (cost=0.43..168768.96 rows=4166667 width=4) (actual time=0.446..7676.356 rows=10000000 loops=1)
               Output: c_w_id, c_d_id, c_id Heap Fetches: 24 Buffers: shared hit=37148 read=1204 written=69
```

> [!NOTE]  
> please note for demonstration purpose explain analyze output of only few queries used in the procedure are shared. The idea is one can gather explain analyze output of all queries from the logs, and then identify the slowest of those and try to tune them.

## Related content

- [High CPU Utilization](how-to-high-cpu-utilization.md)
- [Autovacuum Tuning](how-to-autovacuum-tuning.md)