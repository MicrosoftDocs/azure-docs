---
title: Server parameters - Azure Database for PostgreSQL - Flexible Server
description: Describes the server parameters in Azure Database for PostgreSQL - Flexible Server
author: AlicjaKucharczyk
ms.author: alkuchar
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 01/30/2024
---

# Server parameters in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL provides a subset of configurable parameters for each server. For more information on
Postgres parameters, see the [PostgreSQL documentation](https://www.postgresql.org/docs/current/runtime-config.html).

## An overview of PostgreSQL parameters

Azure Database for PostgreSQL - Flexible Server comes preconfigured with optimal default settings for each parameter. Parameters are categorized into one of the following types:

* **Static parameters**: Parameters of this type require a server restart to implement any changes.
* **Dynamic parameters**: Parameters in this category can be altered without needing to restart the server instance;
  however, changes will only apply to new connections established after the modification.
* **Read-only parameters**: Parameters within this grouping aren't user-configurable due to their critical role in
  maintaining the reliability, security, or other operational aspects of the service.

To determine the category to which a parameter belongs, you can check the Azure portal under the **Server parameters** blade, where they're grouped into respective tabs for easy identification.

### Modification of server parameters

Various methods and levels are available to customize your parameters according to your specific needs.

#### Global - server level

For altering settings globally at the instance or server level, navigate to the **Server parameters** blade in the Azure portal, or use other available tools such as Azure CLI, REST API, ARM templates, and third-party tools.

> [!NOTE]
> Since Azure Database for PostgreSQL is a managed database service, users are not provided host or operating system access to view or modify configuration files such as `postgresql.conf`. The content of the file is automatically updated based on parameter changes made using one of the methods described above.

:::image type="content" source="./media/concepts-server-parameters/server-parameters-portal.png" alt-text="Screenshot of server parameters blade in the Azure portal.":::

#### Granular levels

You can adjust parameters at more granular levels, thereby overriding globally set values. The scope and duration of
these modifications depend on the level at which they're made:

* **Database level**: Utilize the `ALTER DATABASE` command for database-specific configurations.
* **Role or user level**: Use the `ALTER USER` command for user-centric settings.
* **Function, procedure level**: When defining a function or procedure, you can specify or alter the configuration parameters that will be set when the function is called.
* **Table level**: As an example, you can modify parameters related to autovacuum at this level.
* **Session level**: For the duration of an individual database session, you can adjust specific parameters. PostgreSQL facilitates this with the following SQL commands:
    * The `SET` command lets you make session-specific adjustments. These changes serve as the default settings during the current session. Access to these changes may require specific `SET` privileges, and the limitations about modifiable and read-only parameters described above do apply. The corresponding SQL function is `set_config(setting_name, new_value, is_local)`.
    * The `SHOW` command allows you to examine existing parameter settings. Its SQL function equivalent is `current_setting(setting_name text)`.

Here's the list of some of the parameters.

## Memory

### shared_buffers

| Attribute            |                                                                                      Value |
|:---------------------|-------------------------------------------------------------------------------------------:|
| Default value        |                                                                           25% of total RAM |
| Allowed value        |                                                                        10-75% of total RAM |
| Type                 |                                                                                     Static |
| Level                |                                                                                     Global |
| Azure-Specific Notes | The `shared_buffers` setting scales linearly (approximately) as vCores increase in a tier. |

#### Description

The `shared_buffers` configuration parameter determines the amount of system memory allocated to the PostgreSQL database for buffering data. It serves as a centralized memory pool that's accessible to all database processes. When data is needed, the database process first checks the shared buffer. If the required data is present, it's quickly retrieved,  thereby bypassing a more time-consuming disk read. By serving as an intermediary between the database processes and the disk, `shared_buffers` effectively reduces the number of required I/O operations.

### huge_pages

| Attribute            |                                                                                                                                                                                                                                                                                                                 Value |
|:---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| Default value        |                                                                                                                                                                                                                                                                                                                   TRY |
| Allowed value        |                                                                                                                                                                                                                                                                                                          TRY, ON, OFF |
| Type                 |                                                                                                                                                                                                                                                                                                                Static |
| Level                |                                                                                                                                                                                                                                                                                                                Global |
| Azure-Specific Notes | For servers with 4 or more vCores, huge pages are automatically allocated from the underlying operating system. Feature isn't available for servers with fewer than 4 vCores. The number of huge pages is automatically adjusted if any shared memory settings are changed, including alterations to `shared_buffers`. |

#### Description

Huge pages are a feature that allows for memory to be managed in larger blocks - typically 2 MB, as opposed to the "classic" 4 KB pages. Utilizing huge pages can offer performance advantages in several ways: they reduce the overhead associated with memory management tasks like fewer Translation Lookaside Buffer (TLB) misses and shorten the time needed for memory management, effectively offloading the CPU. Specifically, in PostgreSQL, huge pages can only be utilized for the shared memory area, a significant part of which is allocated for shared buffers. Another advantage is that huge pages prevent the swapping of the shared memory area out to disk, further stabilizing performance.

#### Recommendations

* For servers with significant memory resources, it's advisable to avoid disabling huge pages, as doing so could compromise performance.
* If you start with a smaller server that doesn't support huge pages but anticipate scaling up to a server that does, keeping the `huge_pages` setting at `TRY` is recommended for seamless transition and optimal performance.

### work_mem

| Attribute     |               Value |
|:--------------|--------------------:|
| Default value |                 4MB |
| Allowed value |             4MB-2GB |
| Type          |             Dynamic |
| Level         | Global and granular |

#### Description

The `work_mem` parameter in PostgreSQL controls the amount of memory allocated for certain internal operations, such as sorting and hashing, within each database session's private memory area. Unlike shared buffers, which are in the shared memory area, `work_mem` is allocated in a per-session or per-query private memory space. By setting an adequate `work_mem` size, you can significantly improve the efficiency of these operations, reducing the need to write temporary data to disk.

#### Key points

* **Private connection memory**: `work_mem` is part of the private memory used by each database session, distinct from the shared memory area used by `shared_buffers`.
* **Query-specific usage**: Not all sessions or queries use `work_mem`. Simple queries like `SELECT 1` are unlikely to require any `work_mem`. However, more complex queries involving operations like sorting or hashing can consume one or multiple chunks of `work_mem`.
* **Parallel operations**: For queries that span multiple parallel backends, each backend could potentially utilize one or multiple chunks of `work_mem`.

#### Monitoring and adjusting `work_mem`

It's essential to continuously monitor your system's performance and adjust `work_mem` as necessary, primarily if slow query execution times related to sorting or hashing operations occur. Here are ways you can monitor it using tools available in the Azure portal:

* **[Query performance insight](concepts-query-performance-insight.md)**: Check the **Top queries by temporary files** tab to identify queries that are generating temporary files, suggesting a potential need to increase the `work_mem`.
* **[Troubleshooting guides](concepts-troubleshooting-guides.md)**: Utilize the **High temporary files** tab in the troubleshooting guides to identify problematic queries.

##### Granular adjustment
While managing the `work_mem` parameter, it's often more efficient to adopt a granular adjustment approach rather than setting a global value. This approach not only ensures that you allocate memory judiciously based on the specific needs of different processes and users but also minimizes the risk of encountering out-of-memory issues. Here’s how you can go about it:

* **User-Level**: If a specific user is primarily involved in aggregation or reporting tasks, which are memory-intensive, consider customizing the `work_mem` value for that user using the `ALTER ROLE` command to enhance the performance of their operations.

* **Function/Procedure Level**: In cases where specific functions or procedures are generating substantial temporary files, increasing the `work_mem` at the specific function or procedure level can be beneficial. This can be done using the `ALTER FUNCTION` or `ALTER PROCEDURE` command to specifically allocate more memory to these operations.

* **Database Level**: Alter `work_mem` at the database level if only specific databases are generating high amounts of temporary files.

* **Global Level**: If an analysis of your system reveals that most queries are generating small temporary files, while only a few are creating large ones, it may be prudent to globally increase the `work_mem` value. This would facilitate most queries to process in memory, thus avoiding disk-based operations and improving efficiency. However, always be cautious and monitor the memory utilization on your server to ensure it can handle the increased `work_mem`.

##### Determining the minimum `work_mem` value for sorting operations

To find the minimum `work_mem` value for a specific query, especially one generating temporary disk files during the sorting process, you would start by considering the temporary file size generated during the query execution. For instance, if a query is generating a 20 MB temporary file:

1. Connect to your database using psql or your preferred PostgreSQL client.
2. Set an initial `work_mem` value slightly higher than 20 MB to account for additional headers when processing in memory, using a command such as: `SET work_mem TO '25MB'`.
3. Execute `EXPLAIN ANALYZE` on the problematic query on the same session.
4. Review the output for `“Sort Method: quicksort Memory: xkB"`. If it indicates `"external merge Disk: xkB"`, raise the `work_mem` value incrementally and retest until `"quicksort Memory"` appears, signaling that the query is now operating in memory.
5. After determining the value through this method, it can be applied either globally or on more granular levels as described above to suit your operational needs.


### maintenance_work_mem

| Attribute            |               Value |
|:---------------------|--------------------:|
| Default value        |               Dependent on server memory |
| Allowed value        |             1MB-2GB |
| Type                 |             Dynamic |
| Level         | Global and granular |
| Azure-Specific Notes |                     |

#### Description
`maintenance_work_mem` is a configuration parameter in PostgreSQL that governs the amount of memory allocated for maintenance operations, such as `VACUUM`, `CREATE INDEX`, and `ALTER TABLE`. Unlike `work_mem`, which affects memory allocation for query operations, `maintenance_work_mem` is reserved for tasks that maintain and optimize the database structure.

#### Key points

* **Vacuum memory cap**: If you intend to speed up the cleanup of dead tuples by increasing `maintenance_work_mem`, be aware that VACUUM has a built-in limitation for collecting dead tuple identifiers, with the ability to use only up to 1GB of memory for this process.
* **Separation of memory for autovacuum**: The `autovacuum_work_mem` setting allows you to control the memory used by autovacuum operations independently. It acts as a subset of the `maintenance_work_mem`, meaning that you can decide how much memory autovacuum uses without affecting the memory allocation for other maintenance tasks and data definition operations.


## Next steps

For information on supported PostgreSQL extensions, see [the extensions document](concepts-extensions.md).
