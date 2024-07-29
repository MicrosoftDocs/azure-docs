---
title: work_mem server parameter
description: work_mem server parameter for Azure Database for PostgreSQL - Flexible Server.
author: AlicjaKucharczyk
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
ms.date: 05/15/2024
ms.author: alkuchar
zone_pivot_groups: postgresql-server-version
---
#### Description

The `work_mem` parameter in PostgreSQL controls the amount of memory allocated for certain internal operations within each database session's private memory area. Examples of these operations are sorting and hashing.

Unlike shared buffers, which are in the shared memory area, `work_mem` is allocated in a per-session or per-query private memory space. By setting an adequate `work_mem` size, you can significantly improve the efficiency of these operations and reduce the need to write temporary data to disk.

#### Key points

* **Private connection memory**: `work_mem` is part of the private memory that each database session uses. This memory is distinct from the shared memory area that `shared_buffers` uses.
* **Query-specific usage**: Not all sessions or queries use `work_mem`. Simple queries like `SELECT 1` are unlikely to require `work_mem`. However, complex queries that involve operations like sorting or hashing can consume one or multiple chunks of `work_mem`.
* **Parallel operations**: For queries that span multiple parallel back ends, each back end could potentially use one or multiple chunks of `work_mem`.

#### Monitoring and adjusting work_mem

It's essential to continuously monitor your system's performance and adjust `work_mem` as necessary, primarily if query execution times related to sorting or hashing operations are slow. Here are ways to monitor performance by using tools available in the Azure portal:

* [Query performance insight](../concepts-query-performance-insight.md): Check the **Top queries by temporary files** tab to identify queries that are generating temporary files. This situation suggests a potential need to increase `work_mem`.
* [Troubleshooting guides](../concepts-troubleshooting-guides.md): Use the **High temporary files** tab in the troubleshooting guides to identify problematic queries.

##### Granular adjustment

While you're managing the `work_mem` parameter, it's often more efficient to adopt a granular adjustment approach rather than setting a global value. This approach ensures that you allocate memory judiciously based on the specific needs of processes and users. It also minimizes the risk of encountering out-of-memory issues. Here's how you can go about it:

* **User level**: If a specific user is primarily involved in aggregation or reporting tasks, which are memory intensive, consider customizing the `work_mem` value for that user. Use the `ALTER ROLE` command to enhance the performance of the user's operations.

* **Function/procedure level**: If specific functions or procedures are generating substantial temporary files, increasing the `work_mem` value at the specific function or procedure level can be beneficial. Use the `ALTER FUNCTION` or `ALTER PROCEDURE` command to specifically allocate more memory to these operations.

* **Database level**: Alter `work_mem` at the database level if only specific databases are generating high numbers of temporary files.

* **Global level**: If an analysis of your system reveals that most queries are generating small temporary files, while only a few are creating large ones, it might be prudent to globally increase the `work_mem` value. This action facilitates most queries to process in memory, so you can avoid disk-based operations and improve efficiency. However, always be cautious and monitor the memory utilization on your server to ensure that it can handle the increased `work_mem` value.

##### Determining the minimum work_mem value for sorting operations

To find the minimum `work_mem` value for a specific query, especially one that generates temporary disk files during the sorting process, start by considering the temporary file size generated during the query execution. For instance, if a query is generating a 20-MB temporary file:

1. Connect to your database by using psql or your preferred PostgreSQL client.
2. Set an initial `work_mem` value slightly higher than 20 MB to account for additional headers when processing in memory. Use a command such as: `SET work_mem TO '25MB'`.
3. Run `EXPLAIN ANALYZE` on the problematic query in the same session.
4. Review the output for `"Sort Method: quicksort Memory: xkB"`. If it indicates `"external merge Disk: xkB"`, raise the `work_mem` value incrementally and retest until `"quicksort Memory"` appears. The appearance of `"quicksort Memory"` signals that the query is now operating in memory.
5. After you determine the value through this method, you can apply it  either globally or on more granular levels (as described earlier) to suit your operational needs.