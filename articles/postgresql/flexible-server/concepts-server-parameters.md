---
title: Server parameters in Azure Database for PostgreSQL - Flexible Server
description: Learn about the server parameters in Azure Database for PostgreSQL - Flexible Server.
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Server parameters in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL provides a subset of configurable parameters for each server. For more information on
Postgres parameters, see the [PostgreSQL documentation](https://www.postgresql.org/docs/current/runtime-config.html).

## Parameter types

Azure Database for PostgreSQL - Flexible Server comes preconfigured with optimal default settings for each parameter. Parameters are categorized into one of the following types:

* **Static**: These parameters require a server restart to implement any changes.
* **Dynamic**: These parameters can be altered without the need to restart the server instance. However, changes will apply only to new connections established after the modification.
* **Read-only**: These parameters aren't user configurable because of their critical role in maintaining reliability, security, or other operational aspects of the service.

To determine the parameter type, go to the Azure portal and open the **Server parameters** pane. The parameters are grouped into tabs for easy identification.

## Parameter customization

Various methods and levels are available to customize your parameters according to your specific needs.

### Global level

For altering settings globally at the instance or server level, go to the **Server parameters** pane in the Azure portal. You can also use other available tools such as the Azure CLI, the REST API, Azure Resource Manager templates, or partner tools.

> [!NOTE]
> Because Azure Database for PostgreSQL is a managed database service, users don't have host or operating system access to view or modify configuration files such as *postgresql.conf*. The content of the files is automatically updated based on parameter changes that you make.

:::image type="content" source="./media/concepts-server-parameters/server-parameters-portal.png" alt-text="Screenshot of the pane for server parameters in the Azure portal.":::

### Granular levels

You can adjust parameters at more granular levels. These adjustments override globally set values. Their scope and duration depend on the level at which you make them:

* **Database level**: Use the `ALTER DATABASE` command for database-specific configurations.
* **Role or user level**: Use the `ALTER USER` command for user-centric settings.
* **Function, procedure level**: When you're defining a function or procedure, you can specify or alter the configuration parameters that will be set when the function is called.
* **Table level**: As an example, you can modify parameters related to autovacuum at this level.
* **Session level**: For the duration of an individual database session, you can adjust specific parameters. PostgreSQL facilitates this adjustment with the following SQL commands:

  * Use the `SET` command to make session-specific adjustments. These changes serve as the default settings during the current session. Access to these changes might require specific `SET` privileges, and the limitations for modifiable and read-only parameters described earlier don't apply. The corresponding SQL function is `set_config(setting_name, new_value, is_local)`.
  * Use the `SHOW` command to examine existing parameter settings. Its SQL function equivalent is `current_setting(setting_name text)`.

## Important parameters

The following sections describe some of the parameters.

### shared_buffers

| Attribute            |                                                                                      Value |
|:---------------------|-------------------------------------------------------------------------------------------:|
| Default value        |                                                                           25% of total RAM |
| Allowed value        |                                                                        10-75% of total RAM |
| Type                 |                                                                                     Static |
| Level                |                                                                                     Global |
| Azure-specific notes | The `shared_buffers` setting scales linearly (approximately) as vCores increase in a tier. |

#### Description

The `shared_buffers` configuration parameter determines the amount of system memory allocated to the PostgreSQL database for buffering data. It serves as a centralized memory pool that's accessible to all database processes.

When data is needed, the database process first checks the shared buffer. If the required data is present, it's quickly retrieved and bypasses a more time-consuming disk read. By serving as an intermediary between the database processes and the disk, `shared_buffers` effectively reduces the number of required I/O operations.

### huge_pages

| Attribute            |                                                                                                                                                                                                                                                                                                                 Value |
|:---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| Default value        |                                                                                                                                                                                                                                                                                                                   `TRY` |
| Allowed value        |                                                                                                                                                                                                                                                                                                          `TRY`, `ON`, `OFF` |
| Type                 |                                                                                                                                                                                                                                                                                                                Static |
| Level                |                                                                                                                                                                                                                                                                                                                Global |
| Azure-specific notes | For servers with four or more vCores, huge pages are automatically allocated from the underlying operating system. The feature isn't available for servers with fewer than four vCores. The number of huge pages is automatically adjusted if any shared memory settings are changed, including alterations to `shared_buffers`. |

#### Description

Huge pages are a feature that allows for memory to be managed in larger blocks. You can typically manage blocks of up to 2 MB, as opposed to the standard 4-KB pages.

Using huge pages can offer performance advantages that effectively offload the CPU:

* They reduce the overhead associated with memory management tasks like fewer translation lookaside buffer (TLB) misses.
* They shorten the time needed for memory management.

Specifically, in PostgreSQL, you can use huge pages only for the shared memory area. A significant part of the shared memory area is allocated for shared buffers.

Another advantage is that huge pages prevent the swapping of the shared memory area out to disk, which further stabilizes performance.

#### Recommendations

* For servers that have significant memory resources, avoid disabling huge pages. Disabling huge pages could compromise performance.
* If you start with a smaller server that doesn't support huge pages but you anticipate scaling up to a server that does, keep the `huge_pages` setting at `TRY` for seamless transition and optimal performance.

### work_mem

| Attribute     |               Value |
|:--------------|--------------------:|
| Default value |                 `4MB` |
| Allowed value |             `4MB`-`2GB` |
| Type          |             Dynamic |
| Level         | Global and granular |

#### Description

The `work_mem` parameter in PostgreSQL controls the amount of memory allocated for certain internal operations within each database session's private memory area. Examples of these operations are sorting and hashing.

Unlike shared buffers, which are in the shared memory area, `work_mem` is allocated in a per-session or per-query private memory space. By setting an adequate `work_mem` size, you can significantly improve the efficiency of these operations and reduce the need to write temporary data to disk.

#### Key points

* **Private connection memory**: `work_mem` is part of the private memory that each database session uses. This memory is distinct from the shared memory area that `shared_buffers` uses.
* **Query-specific usage**: Not all sessions or queries use `work_mem`. Simple queries like `SELECT 1` are unlikely to require `work_mem`. However, complex queries that involve operations like sorting or hashing can consume one or multiple chunks of `work_mem`.
* **Parallel operations**: For queries that span multiple parallel back ends, each back end could potentially use one or multiple chunks of `work_mem`.

#### Monitoring and adjusting work_mem

It's essential to continuously monitor your system's performance and adjust `work_mem` as necessary, primarily if query execution times related to sorting or hashing operations are slow. Here are ways to monitor performance by using tools available in the Azure portal:

* [Query performance insight](concepts-query-performance-insight.md): Check the **Top queries by temporary files** tab to identify queries that are generating temporary files. This situation suggests a potential need to increase `work_mem`.
* [Troubleshooting guides](concepts-troubleshooting-guides.md): Use the **High temporary files** tab in the troubleshooting guides to identify problematic queries.

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

### maintenance_work_mem

| Attribute            |               Value |
|:---------------------|--------------------:|
| Default value        |               Dependent on server memory |
| Allowed value        |             `1MB`-`2GB` |
| Type                 |             Dynamic |
| Level         | Global and granular |

#### Description

`maintenance_work_mem` is a configuration parameter in PostgreSQL. It governs the amount of memory allocated for maintenance operations, such as `VACUUM`, `CREATE INDEX`, and `ALTER TABLE`. Unlike `work_mem`, which affects memory allocation for query operations, `maintenance_work_mem` is reserved for tasks that maintain and optimize the database structure.

#### Key points

* **Vacuum memory cap**: If you want to speed up the cleanup of dead tuples by increasing `maintenance_work_mem`, be aware that `VACUUM` has a built-in limitation for collecting dead tuple identifiers. It can use only up to 1 GB of memory for this process.
* **Separation of memory for autovacuum**: You can use the `autovacuum_work_mem` setting to control the memory that autovacuum operations use independently. This setting acts as a subset of `maintenance_work_mem`. You can decide how much memory autovacuum uses without affecting the memory allocation for other maintenance tasks and data definition operations.

## Next steps

For information on supported PostgreSQL extensions, see [PostgreSQL extensions in Azure Database for PostgreSQL - Flexible Server](concepts-extensions.md).
