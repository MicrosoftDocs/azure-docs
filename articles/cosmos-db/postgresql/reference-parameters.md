---
title: Server parameters – Azure Cosmos DB for PostgreSQL
description: Parameters in the Azure Cosmos DB for PostgreSQL SQL API
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 10/01/2023
---

# Azure Cosmos DB for PostgreSQL server parameters

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

There are various server parameters that affect the behavior of Azure Cosmos DB for PostgreSQL,
both from standard PostgreSQL, and specific to Azure Cosmos DB for PostgreSQL.
These parameters can be set in the Azure portal for a cluster.
Under the **Settings** category, choose **Worker node parameters** or
**Coordinator node parameters**. These pages allow you to set parameters for
all worker nodes, or just for the coordinator node.

## Azure Cosmos DB for PostgreSQL parameters

> [!NOTE]
>
> Clusters running older versions of [the Citus extension](./reference-versions.md#citus-and-other-extension-versions) might not
> offer all the parameters listed below.

### General configuration

#### citus.use\_secondary\_nodes (enum)

Sets the policy to use when choosing nodes for SELECT queries. If it's set to 'always', then the planner queries only nodes that are
marked as 'secondary' noderole in
[pg_dist_node](reference-metadata.md#worker-node-table).

The supported values for this enum are:

-   **never:** (default) All reads happen on primary nodes.
-   **always:** Reads run against secondary nodes instead, and
    insert/update statements are disabled.

#### citus.cluster\_name (text)

Informs the coordinator node planner which cluster it coordinates. Once
cluster\_name is set, the planner queries worker nodes in that
cluster alone.

#### citus.enable\_version\_checks (boolean)

Upgrading Azure Cosmos DB for PostgreSQL version requires a server restart (to pick up the
new shared-library), followed by the ALTER EXTENSION UPDATE command.  The
failure to execute both steps could potentially cause errors or crashes.
Azure Cosmos DB for PostgreSQL thus validates the version of the code and that of the
extension match, and errors out if they don\'t.

This value defaults to true, and is effective on the coordinator. In
rare cases, complex upgrade processes might require setting this parameter
to false, thus disabling the check.

#### citus.log\_distributed\_deadlock\_detection (boolean)

Whether to log distributed deadlock detection-related processing in the
server log. It defaults to false.

#### citus.distributed\_deadlock\_detection\_factor (floating point)

Sets the time to wait before checking for distributed deadlocks. In particular, 
the time to wait is this value multiplied by PostgreSQL\'s
[deadlock\_timeout](https://www.postgresql.org/docs/current/static/runtime-config-locks.html)
setting. The default value is `2`. A value of `-1` disables distributed
deadlock detection.

#### citus.node\_connection\_timeout (integer)

The `citus.node_connection_timeout` GUC sets the maximum duration (in
milliseconds) to wait for connection establishment. Azure Cosmos DB for PostgreSQL raises
an error if the timeout elapses before at least one worker connection is
established. This GUC affects connections from the coordinator to workers, and
workers to each other.

-   Default: five seconds
-   Minimum: 10 milliseconds
-   Maximum: one hour

```postgresql
-- set to 30 seconds
ALTER DATABASE foo
SET citus.node_connection_timeout = 30000;
```

#### citus.log_remote_commands (boolean)

Log all commands that the coordinator sends to worker nodes. For instance:

```postgresql
-- reveal the per-shard queries behind the scenes
SET citus.log_remote_commands TO on;

-- run a query on distributed table "github_users"
SELECT count(*) FROM github_users;
```

The output reveals several queries running on workers because of the single
`count(*)` query on the coordinator.

```
NOTICE:  issuing SELECT count(*) AS count FROM public.github_events_102040 github_events WHERE true
DETAIL:  on server citus@private-c.demo.postgres.database.azure.com:5432 connectionId: 1
NOTICE:  issuing SELECT count(*) AS count FROM public.github_events_102041 github_events WHERE true
DETAIL:  on server citus@private-c.demo.postgres.database.azure.com:5432 connectionId: 1
NOTICE:  issuing SELECT count(*) AS count FROM public.github_events_102042 github_events WHERE true
DETAIL:  on server citus@private-c.demo.postgres.database.azure.com:5432 connectionId: 1
... etc, one for each of the 32 shards
```

#### citus.show\_shards\_for\_app\_name\_prefixes (text)

By default, Azure Cosmos DB for PostgreSQL hides shards from the list of tables PostgreSQL gives to SQL
clients. It does this because there are multiple shards per distributed table,
and the shards can be distracting to the SQL client.

The `citus.show_shards_for_app_name_prefixes` GUC allows shards to be displayed
for selected clients that want to see them. Its default value is ''.

```postgresql
-- show shards to psql only (hide in other clients, like pgAdmin)

SET citus.show_shards_for_app_name_prefixes TO 'psql';

-- also accepts a comma separated list

SET citus.show_shards_for_app_name_prefixes TO 'psql,pg_dump';
```

Shard hiding can be disabled entirely using
[citus.override_table_visibility](#citusoverride_table_visibility-boolean).

#### citus.override\_table\_visibility (boolean)

Determines whether
[citus.show_shards_for_app_name_prefixes](#citusshow_shards_for_app_name_prefixes-text)
is active. The default value is 'true'. When set to 'false', shards are visible
to all client applications.

#### citus.use\_citus\_managed\_tables (boolean)

Allow new [local tables](concepts-nodes.md#type-3-local-tables) to be accessed
by queries on worker nodes. Adds all newly created tables to Citus metadata
when enabled. The default value is 'false'.

#### citus.rebalancer\_by\_disk\_size\_base\_cost (integer)

Using the by_disk_size rebalance strategy each shard group gets this cost in bytes added to its actual disk size. This value is used to avoid creating a bad balance when there’s little data in some of the shards. The assumption is that even empty shards have some cost, because of parallelism and because empty shard groups are likely to grow in the future.

The default value is `100MB`.

### Query Statistics

#### citus.stat\_statements\_purge\_interval (integer)

Sets the frequency at which the maintenance daemon removes records from
[citus_stat_statements](reference-metadata.md#query-statistics-table)
that are unmatched in `pg_stat_statements`. This configuration value sets the
time interval between purges in seconds, with a default value of 10. A value of
0 disables the purges.

```psql
SET citus.stat_statements_purge_interval TO 5;
```

This parameter is effective on the coordinator and can be changed at
runtime.

#### citus.stat_statements_max (integer)

The maximum number of rows to store in `citus_stat_statements`. Defaults to
50000, and can be changed to any value in the range 1000 - 10000000. Each row requires 140 bytes of storage, so setting `stat_statements_max` to its
maximum value of 10M would consume 1.4 GB of memory.

Changing this GUC doesn't take effect until PostgreSQL is restarted.

#### citus.stat_statements_track (enum)

Recording statistics for `citus_stat_statements` requires extra CPU resources.
When the database is experiencing load, the administrator can disable
statement tracking by setting `citus.stat_statements_track` to `none`.

* **all:** (default) Track all statements.
* **none:** Disable tracking.

#### citus.stat\_tenants\_untracked\_sample\_rate

Sampling rate for new tenants in `citus_stat_tenants`. The rate can be of range between `0.0` and `1.0`. Default is `1.0` meaning 100% of untracked tenant queries are sampled. Setting it to a lower value means that already tracked tenants have 100% queries sampled, but tenants that are currently untracked are sampled only at the provided rate.

### Data Loading

#### citus.multi\_shard\_commit\_protocol (enum)

Sets the commit protocol to use when performing COPY on a hash distributed
table. On each individual shard placement, the COPY is performed in a
transaction block to ensure that no data is ingested if an error occurs during
the COPY. However, there's a particular failure case in which the COPY
succeeds on all placements, but a (hardware) failure occurs before all
transactions commit. This parameter can be used to prevent data loss in that
case by choosing between the following commit protocols:

-   **2pc:** (default) The transactions in which COPY is performed on
    the shard placements are first prepared using PostgreSQL\'s
    [two-phase
    commit](http://www.postgresql.org/docs/current/static/sql-prepare-transaction.html)
    and then committed. Failed commits can be manually recovered or
    aborted using COMMIT PREPARED or ROLLBACK PREPARED, respectively.
    When using 2pc,
    [max\_prepared\_transactions](http://www.postgresql.org/docs/current/static/runtime-config-resource.html)
    should be increased on all the workers, typically to the same value
    as max\_connections.
-   **1pc:** The transactions in which COPY is performed on the shard
    placements is committed in a single round. Data might be lost if a
    commit fails after COPY succeeds on all placements (rare).

#### citus.shard\_replication\_factor (integer)

Sets the replication factor for shards that is, the number of nodes on which
shards are placed, and defaults to 1. This parameter can be set at run-time
and is effective on the coordinator. The ideal value for this parameter depends
on the size of the cluster and rate of node failure.  For example, you can increase this replication factor if you run large clusters and observe node
failures on a more frequent basis.

### Planner Configuration

#### citus.local_table_join_policy (enum)

This GUC determines how Azure Cosmos DB for PostgreSQL moves data when doing a join between
local and distributed tables. Customizing the join policy can help reduce the
amount of data sent between worker nodes.

Azure Cosmos DB for PostgreSQL sends either the local or distributed tables to nodes as
necessary to support the join. Copying table data is referred to as a
“conversion.” If a local table is converted, then it is sent to any
workers that need its data to perform the join. If a distributed table is
converted, then it is collected in the coordinator to support the join.
The Azure Cosmos DB for PostgreSQL planner sends only the necessary rows doing a conversion.

There are four modes available to express conversion preference:

* **auto:** (Default) Azure Cosmos DB for PostgreSQL converts either all local or all distributed
  tables to support local and distributed table joins. Azure Cosmos DB for PostgreSQL decides which to
  convert using a heuristic. It converts distributed tables if they're
  joined using a constant filter on a unique index (such as a primary key). The
  conversion ensures less data gets moved between workers.
* **never:** Azure Cosmos DB for PostgreSQL doesn't allow joins between local and distributed tables.
* **prefer-local:** Azure Cosmos DB for PostgreSQL prefers converting local tables to support local
  and distributed table joins.
* **prefer-distributed:** Azure Cosmos DB for PostgreSQL prefers converting distributed tables to
  support local and distributed table joins. If the distributed tables are
  huge, using this option might result in moving lots of data between workers.

For example, assume `citus_table` is a distributed table distributed by the
column `x`, and that `postgres_table` is a local table:

```postgresql
CREATE TABLE citus_table(x int primary key, y int);
SELECT create_distributed_table('citus_table', 'x');

CREATE TABLE postgres_table(x int, y int);

-- even though the join is on primary key, there isn't a constant filter
-- hence postgres_table will be sent to worker nodes to support the join
SELECT * FROM citus_table JOIN postgres_table USING (x);

-- there is a constant filter on a primary key, hence the filtered row
-- from the distributed table will be pulled to coordinator to support the join
SELECT * FROM citus_table JOIN postgres_table USING (x) WHERE citus_table.x = 10;

SET citus.local_table_join_policy to 'prefer-distributed';
-- since we prefer distributed tables, citus_table will be pulled to coordinator
-- to support the join. Note that citus_table can be huge.
SELECT * FROM citus_table JOIN postgres_table USING (x);

SET citus.local_table_join_policy to 'prefer-local';
-- even though there is a constant filter on primary key for citus_table
-- postgres_table will be sent to necessary workers because we are using 'prefer-local'.
SELECT * FROM citus_table JOIN postgres_table USING (x) WHERE citus_table.x = 10;
```

#### citus.limit\_clause\_row\_fetch\_count (integer)

Sets the number of rows to fetch per task for limit clause optimization.
In some cases, select queries with limit clauses might need to fetch all
rows from each task to generate results. In those cases, and where an
approximation would produce meaningful results, this configuration value
sets the number of rows to fetch from each shard. Limit approximations
are disabled by default and this parameter is set to -1. This value can
be set at run-time and is effective on the coordinator.

#### citus.count\_distinct\_error\_rate (floating point)

Azure Cosmos DB for PostgreSQL can calculate count(distinct) approximates using the
postgresql-hll extension. This configuration entry sets the desired
error rate when calculating count(distinct). 0.0, which is the default,
disables approximations for count(distinct); and 1.0 provides no
guarantees about the accuracy of results. We recommend setting this
parameter to 0.005 for best results. This value can be set at run-time
and is effective on the coordinator.

#### citus.task\_assignment\_policy (enum)

> [!NOTE]
> This GUC is applicable only when
> [shard_replication_factor](reference-parameters.md#citusshard_replication_factor-integer)
> is greater than one, or for queries against
> [reference_tables](concepts-nodes.md#type-2-reference-tables).

Sets the policy to use when assigning tasks to workers. The coordinator
assigns tasks to workers based on shard locations. This configuration
value specifies the policy to use when making these assignments.
Currently, there are three possible task assignment policies that can
be used.

-   **greedy:** The greedy policy is the default and aims to evenly
    distribute tasks across workers.
-   **round-robin:** The round-robin policy assigns tasks to workers in
    a round-robin fashion alternating between different replicas. This policy
    enables better cluster utilization when the shard count for a
    table is low compared to the number of workers.
-   **first-replica:** The first-replica policy assigns tasks based on the insertion order of placements (replicas) for the
    shards. In other words, the fragment query for a shard is assigned to the worker that has the first replica of that shard.
    This method allows you to have strong guarantees about which shards
    are used on which nodes (that is, stronger memory residency
    guarantees).

This parameter can be set at run-time and is effective on the
coordinator.

#### citus.enable\_non\_colocated\_router\_query\_pushdown (boolean)

Enables router planner for the queries that reference non-colocated distributed tables.

The router planner is only enabled for queries that reference colocated distributed tables because otherwise shards might not be on the same node. Enabling this flag allows optimization for queries that reference such tables, but the query might not work after rebalancing the shards or altering the shard count of those tables.

The default is `off`.

### Intermediate Data Transfer

#### citus.max\_intermediate\_result\_size (integer)

The maximum size in KB of intermediate results for CTEs that are unable
to be pushed down to worker nodes for execution, and for complex
subqueries. The default is 1 GB, and a value of -1 means no limit.
Queries exceeding the limit are canceled and produce an error
message.

### DDL

#### citus.enable\_schema\_based\_sharding 

With the parameter set to `ON`, all created schemas are distributed by default. Distributed schemas are automatically associated with individual colocation groups such that the tables created in those schemas are converted to colocated distributed tables without a shard key. This setting can be modified for individual sessions.

For an example of using this GUC, see [how to design for microservice](tutorial-design-database-microservices.md).

### Executor Configuration

#### General

##### citus.all\_modifications\_commutative

Azure Cosmos DB for PostgreSQL enforces commutativity rules and acquires appropriate locks
for modify operations in order to guarantee correctness of behavior. For
example, it assumes that an INSERT statement commutes with another INSERT
statement, but not with an UPDATE or DELETE statement. Similarly, it assumes
that an UPDATE or DELETE statement doesn't commute with another UPDATE or
DELETE statement. This precaution means that UPDATEs and DELETEs require
Azure Cosmos DB for PostgreSQL to acquire stronger locks.

If you have UPDATE statements that are commutative with your INSERTs or
other UPDATEs, then you can relax these commutativity assumptions by
setting this parameter to true. When this parameter is set to true, all
commands are considered commutative and claim a shared lock, which can
improve overall throughput. This parameter can be set at runtime and is
effective on the coordinator.

##### citus.remote\_task\_check\_interval (integer)

Sets the frequency at which Azure Cosmos DB for PostgreSQL checks for statuses of jobs
managed by the task tracker executor. It defaults to 10 ms. The coordinator
assigns tasks to workers, and then regularly checks with them about each
task\'s progress. This configuration value sets the time interval between two
consequent checks. This parameter is effective on the coordinator and can be
set at runtime.

##### citus.task\_executor\_type (enum)

Azure Cosmos DB for PostgreSQL has three executor types for running distributed SELECT
queries.  The desired executor can be selected by setting this configuration
parameter. The accepted values for this parameter are:

-   **adaptive:** The default. It's optimal for fast responses to
    queries that involve aggregations and colocated joins spanning
    across multiple shards.
-   **task-tracker:** The task-tracker executor is well suited for long
    running, complex queries that require shuffling of data across
    worker nodes and efficient resource management.
-   **real-time:** (deprecated) Serves a similar purpose as the adaptive
    executor, but is less flexible and can cause more connection
    pressure on worker nodes.

This parameter can be set at run-time and is effective on the coordinator.

##### citus.multi\_task\_query\_log\_level (enum) {#multi_task_logging}

Sets a log-level for any query that generates more than one task (that is,
which hits more than one shard). Logging is useful during a multitenant
application migration, as you can choose to error or warn for such queries, to
find them and add a tenant\_id filter to them. This parameter can be set at
runtime and is effective on the coordinator. The default value for this
parameter is \'off\'.

The supported values for this enum are:

-   **off:** Turn off logging any queries that generate multiple tasks
    (that is, span multiple shards)
-   **debug:** Logs statement at DEBUG severity level.
-   **log:** Logs statement at LOG severity level. The log line 
    includes the SQL query that was run.
-   **notice:** Logs statement at NOTICE severity level.
-   **warning:** Logs statement at WARNING severity level.
-   **error:** Logs statement at ERROR severity level.

It could be useful to use `error` during development testing,
and a lower log-level like `log` during actual production deployment.
Choosing `log` will cause multi-task queries to appear in the database
logs with the query itself shown after \"STATEMENT.\"

```
LOG:  multi-task query about to be executed
HINT:  Queries are split to multiple tasks if they have to be split into several queries on the workers.
STATEMENT:  select * from foo;
```

##### citus.propagate_set_commands (enum)

Determines which SET commands are propagated from the coordinator to workers.
The default value for this parameter is ‘none’.

The supported values are:

* **none:** no SET commands are propagated.
* **local:** only SET LOCAL commands are propagated.

##### citus.create\_object\_propagation (enum)

Controls the behavior of CREATE statements in transactions for supported
objects.

When objects are created in a multi-statement transaction block, Azure Cosmos DB for PostgreSQL switches
sequential mode to ensure created objects are visible to later statements on
shards. However, the switch to sequential mode is not always desirable. By
overriding this behavior, the user can trade off performance for full
transactional consistency in the creation of new objects.

The default value for this parameter is 'immediate'.

The supported values are:

* **immediate:** raises error in transactions where parallel operations like
  create\_distributed\_table happen before an attempted CREATE TYPE.
* **automatic:** defer creation of types when sharing a transaction with a
  parallel operation on distributed tables. There might be some inconsistency
  between which database objects exist on different nodes.
* **deferred:** return to pre-11.0 behavior, which is like automatic but with
  other subtle corner cases. We recommend the automatic setting over deferred,
  unless you require true backward compatibility.

For an example of this GUC in action, see [type
propagation](howto-modify-distributed-tables.md#types-and-functions).

##### citus.enable\_repartition\_joins (boolean)

Ordinarily, attempting to perform repartition joins with the adaptive executor
fails with an error message.  However setting
`citus.enable_repartition_joins` to true allows Azure Cosmos DB for PostgreSQL to
temporarily switch into the task-tracker executor to perform the join.  The
default value is false.

##### citus.enable_repartitioned_insert_select (boolean)

By default, an INSERT INTO … SELECT statement that can’t be pushed down 
attempts to repartition rows from the SELECT statement and transfer them between
workers for insertion. However, if the target table has too many shards then
repartitioning will probably not perform well. The overhead of processing the
shard intervals when determining how to partition the results is too great.
Repartitioning can be disabled manually by setting
`citus.enable_repartitioned_insert_select` to false.

##### citus.enable_binary_protocol (boolean)

Setting this parameter to true instructs the coordinator node to use
PostgreSQL’s binary serialization format (when applicable) to transfer data
with workers. Some column types don't support binary serialization.

Enabling this parameter is mostly useful when the workers must return large
amounts of data. Examples are when many rows are requested, the rows have
many columns, or they use wide types such as `hll` from the postgresql-hll
extension.

The default value is `true`. When set to `false`, all results are encoded and transferred in text format.

##### citus.max_adaptive_executor_pool_size (integer)

Max_adaptive_executor_pool_size limits worker connections from the current
session. This GUC is useful for:

* Preventing a single backend from getting all the worker resources
* Providing priority management: designate low priority sessions with low
  max_adaptive_executor_pool_size, and high priority sessions with higher
  values

The default value is 16.

##### citus.executor_slow_start_interval (integer)

Time to wait in milliseconds between opening connections to the same worker
node.

When the individual tasks of a multi-shard query take little time, they
can often be finished over a single (often already cached) connection. To avoid
redundantly opening more connections, the executor waits between
connection attempts for the configured number of milliseconds. At the end of
the interval, it increases the number of connections it's allowed to open next
time.

For long queries (those taking >500 ms), slow start might add latency, but for
short queries it’s faster. The default value is 10 ms.

##### citus.max_cached_conns_per_worker (integer)

Each backend opens connections to the workers to query the shards. At the end
of the transaction, the configured number of connections is kept open to speed
up subsequent commands. Increasing this value reduces the latency of
multi-shard queries, but also increases overhead on the workers.

The default value is 1. A larger value such as 2 might be helpful for clusters
that use a small number of concurrent sessions, but it’s not wise to go much
further (for example, 16 would be too high).

##### citus.force_max_query_parallelization (boolean)

Simulates the deprecated and now nonexistent real-time executor. This parameter is used
to open as many connections as possible to maximize query parallelization.

When this GUC is enabled, Azure Cosmos DB for PostgreSQL forces the adaptive executor to use as many
connections as possible while executing a parallel distributed query. If not
enabled, the executor might choose to use fewer connections to optimize overall
query execution throughput. Internally, setting this to `true` ends up using one
connection per task.

One place where this parameter is useful is in a transaction whose first query is
lightweight and requires few connections, while a subsequent query would
benefit from more connections. Azure Cosmos DB for PostgreSQL decides how many connections to use in a
transaction based on the first statement, which can throttle other queries
unless we use the GUC to provide a hint.

```postgresql
BEGIN;
-- add this hint
SET citus.force_max_query_parallelization TO ON;

-- a lightweight query that doesn't require many connections
SELECT count(*) FROM table WHERE filter = x;

-- a query that benefits from more connections, and can obtain
-- them since we forced max parallelization above
SELECT ... very .. complex .. SQL;
COMMIT;
```

The default value is false.

#### Task tracker executor configuration

##### citus.task\_tracker\_delay (integer)

This parameter sets the task tracker sleep time between task management rounds
and defaults to 200 ms. The task tracker process wakes up regularly, walks over
all tasks assigned to it, and schedules and executes these tasks.  Then, the
task tracker sleeps for a time period before walking over these tasks again.
This configuration value determines the length of that sleeping period. This
parameter is effective on the workers and needs to be changed in the
postgresql.conf file. After editing the config file, users can send a SIGHUP
signal or restart the server for the change to take effect.

This parameter can be decreased to trim the delay caused due to the task
tracker executor by reducing the time gap between the management rounds.
Decreasing the delay is useful in cases when the shard queries are short and
hence update their status regularly.

##### citus.max\_assign\_task\_batch\_size (integer)

The task tracker executor on the coordinator synchronously assigns tasks in
batches to the daemon on the workers. This parameter sets the maximum number of
tasks to assign in a single batch. Choosing a larger batch size allows for
faster task assignment. However, if the number of workers is large, then it might
take longer for all workers to get tasks.  This parameter can be set at runtime
and is effective on the coordinator.

##### citus.max\_running\_tasks\_per\_node (integer)

The task tracker process schedules and executes the tasks assigned to it as
appropriate. This configuration value sets the maximum number of tasks to
execute concurrently on one node at any given time and defaults to 8.

The limit ensures that you don\'t have many tasks hitting disk at the same
time, and helps in avoiding disk I/O contention. If your queries are served
from memory or SSDs, you can increase max\_running\_tasks\_per\_node without
much concern.

##### citus.partition\_buffer\_size (integer)

Sets the buffer size to use for partition operations and defaults to 8 MB.
Azure Cosmos DB for PostgreSQL allows for table data to be repartitioned into multiple
files when two large tables are being joined. After this partition buffer fills
up, the repartitioned data is flushed into files on disk.  This configuration
entry can be set at run-time and is effective on the workers.

#### Explain output

##### citus.explain\_all\_tasks (boolean)

By default, Azure Cosmos DB for PostgreSQL shows the output of a single, arbitrary task
when running
[EXPLAIN](http://www.postgresql.org/docs/current/static/sql-explain.html) on a
distributed query. In most cases, the explain output is similar across
tasks. Occasionally, some of the tasks are planned differently or have much
higher execution times. In those cases, it can be useful to enable this
parameter, after which the EXPLAIN output includes all tasks. Explaining
all tasks might cause the EXPLAIN to take longer.

##### citus.explain_analyze_sort_method (enum)

Determines the sort method of the tasks in the output of EXPLAIN ANALYZE. The
default value of `citus.explain_analyze_sort_method` is `execution-time`.

The supported values are:

* **execution-time:** sort by execution time.
* **taskId:** sort by task ID.

## Managed PgBouncer parameters
The following [managed PgBouncer](./concepts-connection-pool.md) parameters can be configured on single node or coordinator.

| Parameter Name             | Description | Default | 
|----------------------|--------|-------------|
| pgbouncer.default_pool_size | Set this parameter value to the number of connections per user/database pair.      | 295       | 
| pgbouncer.ignore_startup_parameters | Comma-separated list of parameters that PgBouncer can ignore. For example, you can let PgBouncer ignore `extra_float_digits` parameter. Some parameters are allowed, all others raise error. This ability is needed to tolerate overenthusiastic JDBC wanting to unconditionally set 'extra_float_digits=2' in startup packet. Use this option if the library you use report errors such as `pq: unsupported startup parameter: extra_float_digits`. | extra_float_digits, ssl_renegotiation_limit  |
| pgBouncer.max_client_conn | Set this parameter value to the highest number of client connections to PgBouncer that you want to support.     | 2000     | 
| pgBouncer.min_pool_size | Add more server connections to pool if below this number.    |   0 (Disabled)   |
| pgBouncer.pool_mode | Set this parameter value to TRANSACTION for transaction pooling (which is the recommended setting for most workloads).      | TRANSACTION     |
| pgbouncer.query_wait_timeout | Maximum time (in seconds) queries are allowed to spend waiting for execution. If the query isn't assigned to a server during that time, the client is disconnected. | 20s |
| pgbouncer.server_idle_timeout | If a server connection has been idle more than this many seconds, it is closed. If 0 then this timeout is disabled. | 60s |

## PostgreSQL parameters

* [DateStyle](https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-OUTPUT) - Sets the display format for date and time values
* [IntervalStyle](https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-INTERVAL-OUTPUT) - Sets the display format for interval values
* [TimeZone](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TIMEZONE) - Sets the time zone for displaying and interpreting time stamps
* [application_name](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-APPLICATION-NAME) - Sets the application name to be reported in statistics and logs
* [array_nulls](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-ARRAY-NULLS) - Enables input of NULL elements in arrays
* [autovacuum](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html#GUC-AUTOVACUUM) - Starts the autovacuum subprocess
* [autovacuum_analyze_scale_factor](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html#GUC-AUTOVACUUM-ANALYZE-SCALE-FACTOR) - Number of tuple inserts, updates, or deletes prior to analyze as a fraction of reltuples
* [autovacuum_analyze_threshold](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html#GUC-AUTOVACUUM-ANALYZE-THRESHOLD) - Minimum number of tuple inserts, updates, or deletes prior to analyze
* [autovacuum_naptime](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html#GUC-AUTOVACUUM-NAPTIME) - Time to sleep between autovacuum runs
* [autovacuum_vacuum_cost_delay](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html#GUC-AUTOVACUUM-VACUUM-COST-DELAY) - Vacuum cost delay in milliseconds, for autovacuum
* [autovacuum_vacuum_cost_limit](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html#GUC-AUTOVACUUM-VACUUM-COST-LIMIT) - Vacuum cost amount available before napping, for autovacuum
* [autovacuum_vacuum_scale_factor](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html#GUC-AUTOVACUUM-VACUUM-SCALE-FACTOR) - Number of tuple updates or deletes prior to vacuum as a fraction of reltuples
* [autovacuum_vacuum_threshold](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html#GUC-AUTOVACUUM-VACUUM-THRESHOLD) - Minimum number of tuple updates or deletes prior to vacuum
* [autovacuum_work_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-AUTOVACUUM-WORK-MEM) - Sets the maximum memory to be used by each autovacuum worker process
* [backend_flush_after](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-BACKEND-FLUSH-AFTER) - Number of pages after which previously performed writes are flushed to disk
* [backslash_quote](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-BACKSLASH-QUOTE) - Sets whether "\'" is allowed in string literals
* [bgwriter_delay](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-BGWRITER-DELAY) - Background writer sleep time between rounds
* [bgwriter_flush_after](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-BGWRITER-FLUSH-AFTER) - Number of pages after which previously performed writes are flushed to disk
* [bgwriter_lru_maxpages](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-BGWRITER-LRU-MAXPAGES) - Background writer maximum number of LRU pages to flush per round
* [bgwriter_lru_multiplier](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-BGWRITER-LRU-MULTIPLIER) - Multiple of the average buffer usage to free per round
* [bytea_output](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-BYTEA-OUTPUT) - Sets the output format for bytea
* [check_function_bodies](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-CHECK-FUNCTION-BODIES) - Checks function bodies during CREATE FUNCTION
* [checkpoint_completion_target](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-CHECKPOINT-COMPLETION-TARGET) - Time spent flushing dirty buffers during checkpoint, as fraction of checkpoint interval
* [checkpoint_timeout](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-CHECKPOINT-TIMEOUT) - Sets the maximum time between automatic WAL checkpoints
* [checkpoint_warning](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-CHECKPOINT-WARNING) - Enables warnings if checkpoint segments are filled more frequently than this
* [client_encoding](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-CLIENT-ENCODING) - Sets the client's character set encoding
* [client_min_messages](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-CLIENT-MIN-MESSAGES) - Sets the message levels that are sent to the client
* [commit_delay](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-COMMIT-DELAY) - Sets the delay in microseconds between transaction commit and flushing WAL to disk
* [commit_siblings](https://www.postgresql.org/docs/12/runtime-config-wal.html#GUC-COMMIT-SIBLINGS) - Sets the minimum concurrent open transactions before performing commit_delay
* [constraint_exclusion](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-CONSTRAINT-EXCLUSION) - Enables the planner to use constraints to optimize queries
* [cpu_index_tuple_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-CPU-INDEX-TUPLE-COST) - Sets the planner's estimate of the cost of processing each index entry during an index scan
* [cpu_operator_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-CPU-OPERATOR-COST) - Sets the planner's estimate of the cost of processing each operator or function call
* [cpu_tuple_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-CPU-TUPLE-COST) - Sets the planner's estimate of the cost of processing each tuple (row)
* [cursor_tuple_fraction](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-CURSOR-TUPLE-FRACTION) - Sets the planner's estimate of the fraction of a cursor's rows that are retrieved
* [deadlock_timeout](https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-DEADLOCK-TIMEOUT) - Sets the amount of time, in milliseconds, to wait on a lock before checking for deadlock
* [debug_pretty_print](https://www.postgresql.org/docs/current/runtime-config-logging.html#id-1.6.6.11.5.2.3.1.3) - Indents parse and plan tree displays
* [debug_print_parse](https://www.postgresql.org/docs/current/runtime-config-logging.html#id-1.6.6.11.5.2.2.1.3) - Logs each query's parse tree
* [debug_print_plan](https://www.postgresql.org/docs/current/runtime-config-logging.html#id-1.6.6.11.5.2.2.1.3) - Logs each query's execution plan
* [debug_print_rewritten](https://www.postgresql.org/docs/current/runtime-config-logging.html#id-1.6.6.11.5.2.2.1.3) - Logs each query's rewritten parse tree
* [default_statistics_target](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-DEFAULT-STATISTICS-TARGET) - Sets the default statistics target
* [default_tablespace](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TABLESPACE) - Sets the default tablespace to create tables and indexes in
* [default_text_search_config](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TEXT-SEARCH-CONFIG) - Sets default text search configuration
* [default_transaction_deferrable](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TRANSACTION-DEFERRABLE) - Sets the default deferrable status of new transactions
* [default_transaction_isolation](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TRANSACTION-ISOLATION) - Sets the transaction isolation level of each new transaction
* [default_transaction_read_only](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TRANSACTION-READ-ONLY) - Sets the default read-only status of new transactions
* default_with_oids - Creates new tables with OIDs by default
* [effective_cache_size](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-EFFECTIVE-CACHE-SIZE) - Sets the planner's assumption about the size of the disk cache
* [enable_bitmapscan](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-BITMAPSCAN) - Enables the planner's use of bitmap-scan plans
* [enable_gathermerge](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-GATHERMERGE) - Enables the planner's use of gather merge plans
* [enable_hashagg](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-HASHAGG) - Enables the planner's use of hashed aggregation plans
* [enable_hashjoin](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-HASHJOIN) - Enables the planner's use of hash join plans
* [enable_indexonlyscan](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-INDEXONLYSCAN) - Enables the planner's use of index-only-scan plans
* [enable_indexscan](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-INDEXSCAN) - Enables the planner's use of index-scan plans
* [enable_material](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-MATERIAL) - Enables the planner's use of materialization
* [enable_mergejoin](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-MERGEJOIN) - Enables the planner's use of merge join plans
* [enable_nestloop](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-NESTLOOP) - Enables the planner's use of nested loop join plans
* [enable_seqscan](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-SEQSCAN) - Enables the planner's use of sequential-scan plans
* [enable_sort](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-SORT) - Enables the planner's use of explicit sort steps
* [enable_tidscan](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-ENABLE-TIDSCAN) - Enables the planner's use of TID scan plans
* [escape_string_warning](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-ESCAPE-STRING-WARNING) - Warns about backslash escapes in ordinary string literals
* [exit_on_error](https://www.postgresql.org/docs/current/runtime-config-error-handling.html#GUC-EXIT-ON-ERROR) - Terminates session on any error
* [extra_float_digits](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-EXTRA-FLOAT-DIGITS) - Sets the number of digits displayed for floating-point values
* [force_parallel_mode](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-FORCE-PARALLEL-MODE) - Forces use of parallel query facilities
* [from_collapse_limit](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-FROM-COLLAPSE-LIMIT) - Sets the FROM-list size beyond which subqueries aren't collapsed
* [geqo](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-GEQO) - Enables genetic query optimization
* [geqo_effort](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-GEQO-EFFORT) - GEQO: effort is used to set the default for other GEQO parameters
* [geqo_generations](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-GEQO-GENERATIONS) - GEQO: number of iterations of the algorithm
* [geqo_pool_size](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-GEQO-POOL-SIZE) - GEQO: number of individuals in the population
* [geqo_seed](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-GEQO-SEED) - GEQO: seed for random path selection
* [geqo_selection_bias](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-GEQO-SELECTION-BIAS) - GEQO: selective pressure within the population
* [geqo_threshold](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-GEQO-THRESHOLD) - Sets the threshold of FROM items beyond which GEQO is used
* [gin_fuzzy_search_limit](https://www.postgresql.org/docs/current/runtime-config-client.html#id-1.6.6.14.5.2.2.1.3) - Sets the maximum allowed result for exact search by GIN
* [gin_pending_list_limit](https://www.postgresql.org/docs/current/runtime-config-client.html#id-1.6.6.14.2.2.23.1.3) - Sets the maximum size of the pending list for GIN index
* [idle_in_transaction_session_timeout](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-IDLE-IN-TRANSACTION-SESSION-TIMEOUT) - Sets the maximum allowed duration of any idling transaction
* [join_collapse_limit](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JOIN-COLLAPSE-LIMIT) - Sets the FROM-list size beyond which JOIN constructs aren't flattened
* [lc_monetary](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LC-MONETARY) - Sets the locale for formatting monetary amounts
* [lc_numeric](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LC-NUMERIC) - Sets the locale for formatting numbers
* [lo_compat_privileges](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-LO-COMPAT-PRIVILEGES) - Enables backward compatibility mode for privilege checks on large objects
* [lock_timeout](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LOCK-TIMEOUT) - Sets the maximum allowed duration (in milliseconds) of any wait for a lock. 0 turns this off
* [log_autovacuum_min_duration](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html#) - Sets the minimum execution time above which autovacuum actions are logged
* [log_checkpoints](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-CHECKPOINTS) - Logs each checkpoint
* [log_connections](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-CONNECTIONS) - Logs each successful connection
* [log_destination](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-DESTINATION) - Sets the destination for server log output
* [log_disconnections](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-DISCONNECTIONS) - Logs end of a session, including duration
* [log_duration](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-DURATION) - Logs the duration of each completed SQL statement
* [log_error_verbosity](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-ERROR-VERBOSITY) - Sets the verbosity of logged messages
* [log_lock_waits](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-LOCK-WAITS) - Logs long lock waits
* [log_min_duration_statement](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-MIN-DURATION-STATEMENT) - Sets the minimum execution time (in milliseconds) above which statements are logged. -1 disables logging statement durations
* [log_min_error_statement](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-MIN-ERROR-STATEMENT) - Causes all statements generating error at or above this level to be logged
* [log_min_messages](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-MIN-MESSAGES) - Sets the message levels that are logged
* [log_replication_commands](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-REPLICATION-COMMANDS) - Logs each replication command
* [log_statement](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-STATEMENT) - Sets the type of statements logged
* [log_statement_stats](https://www.postgresql.org/docs/current/runtime-config-statistics.html#id-1.6.6.12.3.2.1.1.3) - For each query, writes cumulative performance statistics to the server log
* [log_temp_files](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-TEMP-FILES) - Logs the use of temporary files larger than this number of kilobytes
* [maintenance_work_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM) - Sets the maximum memory to be used for maintenance operations
* [max_parallel_workers](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-WORKERS) - Sets the maximum number of parallel workers that can be active at one time
* [max_parallel_workers_per_gather](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-WORKERS-PER-GATHER) - Sets the maximum number of parallel processes per executor node
* [max_pred_locks_per_page](https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-MAX-PRED-LOCKS-PER-PAGE) - Sets the maximum number of predicate-locked tuples per page
* [max_pred_locks_per_relation](https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-MAX-PRED-LOCKS-PER-RELATION) - Sets the maximum number of predicate-locked pages and tuples per relation
* [max_standby_archive_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-ARCHIVE-DELAY) - Sets the maximum delay before canceling queries when a hot standby server is processing archived WAL data
* [max_standby_streaming_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-STREAMING-DELAY) - Sets the maximum delay before canceling queries when a hot standby server is processing streamed WAL data
* [max_sync_workers_per_subscription](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-SYNC-WORKERS-PER-SUBSCRIPTION) - Maximum number of table synchronization workers per subscription
* [max_wal_size](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-MAX-WAL-SIZE) - Sets the WAL size that triggers a checkpoint
* [min_parallel_index_scan_size](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-MIN-PARALLEL-INDEX-SCAN-SIZE) - Sets the minimum amount of index data for a parallel scan
* [min_wal_size](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-MIN-WAL-SIZE) - Sets the minimum size to shrink the WAL to
* [operator_precedence_warning](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-OPERATOR-PRECEDENCE-WARNING) - Emits a warning for constructs that changed meaning since PostgreSQL 9.4
* [parallel_setup_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-PARALLEL-SETUP-COST) - Sets the planner's estimate of the cost of starting up worker processes for parallel query
* [parallel_tuple_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-PARALLEL-TUPLE-COST) - Sets the planner's estimate of the cost of passing each tuple (row) from worker to main backend
* [pg_stat_statements.save](https://www.postgresql.org/docs/current/pgstatstatements.html#id-1.11.7.38.8) - Saves pg_stat_statements statistics across server shutdowns
* [pg_stat_statements.track](https://www.postgresql.org/docs/current/pgstatstatements.html#id-1.11.7.38.8) - Selects which statements are tracked by pg_stat_statements
* [pg_stat_statements.track_utility](https://www.postgresql.org/docs/current/pgstatstatements.html#id-1.11.7.38.8) - Selects whether utility commands are tracked by pg_stat_statements
* [quote_all_identifiers](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-QUOTE-ALL-IDENTIFIERS) - When generating SQL fragments, quotes all identifiers
* [random_page_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-RANDOM-PAGE-COST) - Sets the planner's estimate of the cost of a nonsequentially fetched disk page
* [row_security](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-ROW-SECURITY) - Enables row security
* [search_path](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SEARCH-PATH) - Sets the schema search order for names that aren't schema-qualified
* [seq_page_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-SEQ-PAGE-COST) - Sets the planner's estimate of the cost of a sequentially fetched disk page
* [session_replication_role](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SESSION-REPLICATION-ROLE) - Sets the session's behavior for triggers and rewrite rules
* [standard_conforming_strings](https://www.postgresql.org/docs/current/runtime-config-compatible.html#id-1.6.6.16.2.2.7.1.3) - Causes '...' strings to treat backslashes literally
* [statement_timeout](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-STATEMENT-TIMEOUT) - Sets the maximum allowed duration (in milliseconds) of any statement. 0 turns this off
* [synchronize_seqscans](https://www.postgresql.org/docs/current/runtime-config-compatible.html#id-1.6.6.16.2.2.8.1.3) - Enables synchronized sequential scans
* [synchronous_commit](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT) - Sets the current transaction's synchronization level
* [tcp_keepalives_count](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-TCP-KEEPALIVES-COUNT) - Maximum number of TCP keepalive retransmits
* [tcp_keepalives_idle](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-TCP-KEEPALIVES-IDLE) - Time between issuing TCP keepalives
* [tcp_keepalives_interval](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-TCP-KEEPALIVES-INTERVAL) - Time between TCP keepalive retransmits
* [temp_buffers](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-TEMP-BUFFERS) - Sets the maximum number of temporary buffers used by each database session
* [temp_tablespaces](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TEMP-TABLESPACES) - Sets the tablespace(s) to use for temporary tables and sort files
* [track_activities](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-ACTIVITIES) - Collects information about executing commands
* [track_counts](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-COUNTS) - Collects statistics on database activity
* [track_functions](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-FUNCTIONS) - Collects function-level statistics on database activity
* [track_io_timing](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-IO-TIMING) - Collects timing statistics for database I/O activity
* [transform_null_equals](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-TRANSFORM-NULL-EQUALS) - Treats "expr=NULL" as "expr IS NULL"
* [vacuum_cost_delay](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-VACUUM-COST-DELAY) - Vacuum cost delay in milliseconds
* [vacuum_cost_limit](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-VACUUM-COST-LIMIT) - Vacuum cost amount available before napping
* [vacuum_cost_page_dirty](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-VACUUM-COST-PAGE-DIRTY) - Vacuum cost for a page dirtied by vacuum
* [vacuum_cost_page_hit](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-VACUUM-COST-PAGE-HIT) - Vacuum cost for a page found in the buffer cache
* [vacuum_cost_page_miss](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-VACUUM-COST-PAGE-MISS) - Vacuum cost for a page not found in the buffer cache
* [vacuum_defer_cleanup_age](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-VACUUM-DEFER-CLEANUP-AGE) - Number of transactions by which VACUUM and HOT cleanup should be deferred, if any
* [vacuum_freeze_min_age](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-VACUUM-FREEZE-MIN-AGE) - Minimum age at which VACUUM should freeze a table row
* [vacuum_freeze_table_age](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-VACUUM-FREEZE-TABLE-AGE) - Age at which VACUUM should scan whole table to freeze tuples
* [vacuum_multixact_freeze_min_age](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-VACUUM-MULTIXACT-FREEZE-MIN-AGE) - Minimum age at which VACUUM should freeze a MultiXactId in a table row
* [vacuum_multixact_freeze_table_age](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-VACUUM-MULTIXACT-FREEZE-TABLE-AGE) - Multixact age at which VACUUM should scan whole table to freeze tuples
* [wal_receiver_status_interval](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-RECEIVER-STATUS-INTERVAL) - Sets the maximum interval between WAL receiver status reports to the primary
* [wal_writer_delay](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-WAL-WRITER-DELAY) - Time between WAL flushes performed in the WAL writer
* [wal_writer_flush_after](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-WAL-WRITER-FLUSH-AFTER) - Amount of WAL written out by WAL writer that triggers a flush
* [work_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-WORK-MEM) - Sets the amount of memory to be used by internal sort operations and hash tables before writing to temporary disk files
* [xmlbinary](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-XMLBINARY) - Sets how binary values are to be encoded in XML
* [xmloption](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-XMLOPTION) - Sets whether XML data in implicit parsing and serialization operations is to be considered as documents or content fragments

## Next steps

* Another form of configuration, besides server parameters, are the resource [configuration options](resources-compute.md) in a cluster.
* The underlying PostgreSQL data base also has [configuration parameters](http://www.postgresql.org/docs/current/static/runtime-config.html).
