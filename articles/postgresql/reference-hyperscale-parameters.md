---
title: Server parameters – Hyperscale (Citus) - Azure Database for PostgreSQL
description: Parameters in the Hyperscale (Citus) SQL API
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: reference
ms.date: 08/10/2020
---

# Server parameters

There are various server parameters that affect the behavior of Hyperscale
(Citus), both from standard PostgreSQL, and specific to Hyperscale (Citus).
These parameters can be set in the Azure portal for a Hyperscale (Citus) server
group. Under the **Settings** category, choose **Worker node parameters** or
**Coordinator node parameters**. These pages allow you to set parameters for
all worker nodes, or just for the coordinator node.

## Hyperscale (Citus) parameters

> [!NOTE]
>
> Hyperscale (Citus) server groups running older versions of the Citus Engine may not
> offer all the parameters listed below.

### General configuration

#### citus.use\_secondary\_nodes (enum)

Sets the policy to use when choosing nodes for SELECT queries. If it
is set to 'always', then the planner will query only nodes that are
marked as 'secondary' noderole in
[pg_dist_node](reference-hyperscale-metadata.md#worker-node-table).

The supported values for this enum are:

-   **never:** (default) All reads happen on primary nodes.
-   **always:** Reads run against secondary nodes instead, and
    insert/update statements are disabled.

#### citus.cluster\_name (text)

Informs the coordinator node planner which cluster it coordinates. Once
cluster\_name is set, the planner will query worker nodes in that
cluster alone.

#### citus.enable\_version\_checks (boolean)

Upgrading Hyperscale (Citus) version requires a server restart (to pick up the
new shared-library), followed by the ALTER EXTENSION UPDATE command.  The
failure to execute both steps could potentially cause errors or crashes.
Hyperscale (Citus) thus validates the version of the code and that of the
extension match, and errors out if they don\'t.

This value defaults to true, and is effective on the coordinator. In
rare cases, complex upgrade processes may require setting this parameter
to false, thus disabling the check.

#### citus.log\_distributed\_deadlock\_detection (boolean)

Whether to log distributed deadlock detection-related processing in the
server log. It defaults to false.

#### citus.distributed\_deadlock\_detection\_factor (floating point)

Sets the time to wait before checking for distributed deadlocks. In particular
the time to wait will be this value multiplied by PostgreSQL\'s
[deadlock\_timeout](https://www.postgresql.org/docs/current/static/runtime-config-locks.html)
setting. The default value is `2`. A value of `-1` disables distributed
deadlock detection.

#### citus.node\_connection\_timeout (integer)

The `citus.node_connection_timeout` GUC sets the maximum duration (in
milliseconds) to wait for connection establishment. Hyperscale (Citus) raises
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

### Query Statistics

#### citus.stat\_statements\_purge\_interval (integer)

Sets the frequency at which the maintenance daemon removes records from
[citus_stat_statements](reference-hyperscale-metadata.md#query-statistics-table)
that are unmatched in `pg_stat_statements`. This configuration value sets the
time interval between purges in seconds, with a default value of 10. A value of
0 disables the purges.

```psql
SET citus.stat_statements_purge_interval TO 5;
```

This parameter is effective on the coordinator and can be changed at
runtime.

### Data Loading

#### citus.multi\_shard\_commit\_protocol (enum)

Sets the commit protocol to use when performing COPY on a hash distributed
table. On each individual shard placement, the COPY is performed in a
transaction block to ensure that no data is ingested if an error occurs during
the COPY. However, there is a particular failure case in which the COPY
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
    placements is committed in a single round. Data may be lost if a
    commit fails after COPY succeeds on all placements (rare).

#### citus.shard\_replication\_factor (integer)

Sets the replication factor for shards that is, the number of nodes on which
shards will be placed, and defaults to 1. This parameter can be set at run-time
and is effective on the coordinator. The ideal value for this parameter depends
on the size of the cluster and rate of node failure.  For example, you may want
to increase this replication factor if you run large clusters and observe node
failures on a more frequent basis.

#### citus.shard\_count (integer)

Sets the shard count for hash-partitioned tables and defaults to 32.  This
value is used by the
[create_distributed_table](reference-hyperscale-functions.md#create_distributed_table)
UDF when creating hash-partitioned tables. This parameter can be set at
run-time and is effective on the coordinator.

#### citus.shard\_max\_size (integer)

Sets the maximum size to which a shard will grow before it gets split
and defaults to 1 GB. When the source file\'s size (which is used for
staging) for one shard exceeds this configuration value, the database
ensures that a new shard gets created. This parameter can be set at
run-time and is effective on the coordinator.

### Planner Configuration

#### citus.limit\_clause\_row\_fetch\_count (integer)

Sets the number of rows to fetch per task for limit clause optimization.
In some cases, select queries with limit clauses may need to fetch all
rows from each task to generate results. In those cases, and where an
approximation would produce meaningful results, this configuration value
sets the number of rows to fetch from each shard. Limit approximations
are disabled by default and this parameter is set to -1. This value can
be set at run-time and is effective on the coordinator.

#### citus.count\_distinct\_error\_rate (floating point)

Hyperscale (Citus) can calculate count(distinct) approximates using the
postgresql-hll extension. This configuration entry sets the desired
error rate when calculating count(distinct). 0.0, which is the default,
disables approximations for count(distinct); and 1.0 provides no
guarantees about the accuracy of results. We recommend setting this
parameter to 0.005 for best results. This value can be set at run-time
and is effective on the coordinator.

#### citus.task\_assignment\_policy (enum)

> [!NOTE]
> This GUC is applicable only when
> [shard_replication_factor](reference-hyperscale-parameters.md#citusshard_replication_factor-integer)
> is greater than one, or for queries against
> [reference_tables](concepts-hyperscale-distributed-data.md#type-2-reference-tables).

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
-   **first-replica:** The first-replica policy assigns tasks on the
    basis of the insertion order of placements (replicas) for the
    shards. In other words, the fragment query for a shard is assigned to the worker that has the first replica of that shard.
    This method allows you to have strong guarantees about which shards
    will be used on which nodes (that is, stronger memory residency
    guarantees).

This parameter can be set at run-time and is effective on the
coordinator.

### Intermediate Data Transfer

#### citus.binary\_worker\_copy\_format (boolean)

Use the binary copy format to transfer intermediate data between workers.
During large table joins, Hyperscale (Citus) may have to dynamically
repartition and shuffle data between different workers. By default, this data
is transferred in text format. Enabling this parameter instructs the database
to use PostgreSQL's binary serialization format to transfer this data. This
parameter is effective on the workers and needs to be changed in the
postgresql.conf file. After editing the config file, users can send a SIGHUP
signal or restart the server for this change to take effect.

#### citus.binary\_master\_copy\_format (boolean)

Use the binary copy format to transfer data between coordinator and the
workers. When running distributed queries, the workers transfer their
intermediate results to the coordinator for final aggregation. By default, this
data is transferred in text format. Enabling this parameter instructs the
database to use PostgreSQL's binary serialization format to transfer this data.
This parameter can be set at runtime and is effective on the coordinator.

#### citus.max\_intermediate\_result\_size (integer)

The maximum size in KB of intermediate results for CTEs that are unable
to be pushed down to worker nodes for execution, and for complex
subqueries. The default is 1 GB, and a value of -1 means no limit.
Queries exceeding the limit will be canceled and produce an error
message.

### DDL

#### citus.enable\_ddl\_propagation (boolean)

Specifies whether to automatically propagate DDL changes from the coordinator
to all workers. The default value is true. Because some schema changes require
an access exclusive lock on tables, and because the automatic propagation
applies to all workers sequentially, it can make a Hyperscale (Citus) cluster
temporarily less responsive. You may choose to disable this setting and
propagate changes manually.

### Executor Configuration

#### General

##### citus.all\_modifications\_commutative

Hyperscale (Citus) enforces commutativity rules and acquires appropriate locks
for modify operations in order to guarantee correctness of behavior. For
example, it assumes that an INSERT statement commutes with another INSERT
statement, but not with an UPDATE or DELETE statement. Similarly, it assumes
that an UPDATE or DELETE statement does not commute with another UPDATE or
DELETE statement. This precaution means that UPDATEs and DELETEs require
Hyperscale (Citus) to acquire stronger locks.

If you have UPDATE statements that are commutative with your INSERTs or
other UPDATEs, then you can relax these commutativity assumptions by
setting this parameter to true. When this parameter is set to true, all
commands are considered commutative and claim a shared lock, which can
improve overall throughput. This parameter can be set at runtime and is
effective on the coordinator.

##### citus.remote\_task\_check\_interval (integer)

Sets the frequency at which Hyperscale (Citus) checks for statuses of jobs
managed by the task tracker executor. It defaults to 10 ms. The coordinator
assigns tasks to workers, and then regularly checks with them about each
task\'s progress. This configuration value sets the time interval between two
consequent checks. This parameter is effective on the coordinator and can be
set at runtime.

##### citus.task\_executor\_type (enum)

Hyperscale (Citus) has three executor types for running distributed SELECT
queries.  The desired executor can be selected by setting this configuration
parameter. The accepted values for this parameter are:

-   **adaptive:** The default. It is optimal for fast responses to
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
which hits more than one shard). Logging is useful during a multi-tenant
application migration, as you can choose to error or warn for such queries, to
find them and add a tenant\_id filter to them. This parameter can be set at
runtime and is effective on the coordinator. The default value for this
parameter is \'off\'.

The supported values for this enum are:

-   **off:** Turn off logging any queries that generate multiple tasks
    (that is, span multiple shards)
-   **debug:** Logs statement at DEBUG severity level.
-   **log:** Logs statement at LOG severity level. The log line will
    include the SQL query that was run.
-   **notice:** Logs statement at NOTICE severity level.
-   **warning:** Logs statement at WARNING severity level.
-   **error:** Logs statement at ERROR severity level.

It may be useful to use `error` during development testing,
and a lower log-level like `log` during actual production deployment.
Choosing `log` will cause multi-task queries to appear in the database
logs with the query itself shown after \"STATEMENT.\"

```
LOG:  multi-task query about to be executed
HINT:  Queries are split to multiple tasks if they have to be split into several queries on the workers.
STATEMENT:  select * from foo;
```

##### citus.enable\_repartition\_joins (boolean)

Ordinarily, attempting to perform repartition joins with the adaptive executor
will fail with an error message.  However setting
`citus.enable_repartition_joins` to true allows Hyperscale (Citus) to
temporarily switch into the task-tracker executor to perform the join.  The
default value is false.

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
faster task assignment. However, if the number of workers is large, then it may
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
Hyperscale (Citus) allows for table data to be repartitioned into multiple
files when two large tables are being joined. After this partition buffer fills
up, the repartitioned data is flushed into files on disk.  This configuration
entry can be set at run-time and is effective on the workers.

#### Explain output

##### citus.explain\_all\_tasks (boolean)

By default, Hyperscale (Citus) shows the output of a single, arbitrary task
when running
[EXPLAIN](http://www.postgresql.org/docs/current/static/sql-explain.html) on a
distributed query. In most cases, the explain output will be similar across
tasks. Occasionally, some of the tasks will be planned differently or have much
higher execution times. In those cases, it can be useful to enable this
parameter, after which the EXPLAIN output will include all tasks. Explaining
all tasks may cause the EXPLAIN to take longer.

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
* [cursor_tuple_fraction](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-CURSOR-TUPLE-FRACTION) - Sets the planner's estimate of the fraction of a cursor's rows that will be retrieved
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
* [from_collapse_limit](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-FROM-COLLAPSE-LIMIT) - Sets the FROM-list size beyond which subqueries are not collapsed
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
* [join_collapse_limit](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-JOIN-COLLAPSE-LIMIT) - Sets the FROM-list size beyond which JOIN constructs are not flattened
* [lc_monetary](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LC-MONETARY) - Sets the locale for formatting monetary amounts
* [lc_numeric](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LC-NUMERIC) - Sets the locale for formatting numbers
* [lo_compat_privileges](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-LO-COMPAT-PRIVILEGES) - Enables backward compatibility mode for privilege checks on large objects
* [lock_timeout](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LOCK-TIMEOUT) - Sets the maximum allowed duration (in milliseconds) of any wait for a lock. 0 turns this off
* [log_autovacuum_min_duration](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html#) - Sets the minimum execution time above which autovacuum actions will be logged
* [log_checkpoints](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-CHECKPOINTS) - Logs each checkpoint
* [log_connections](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-CONNECTIONS) - Logs each successful connection
* [log_destination](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-DESTINATION) - Sets the destination for server log output
* [log_disconnections](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-DISCONNECTIONS) - Logs end of a session, including duration
* [log_duration](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-DURATION) - Logs the duration of each completed SQL statement
* [log_error_verbosity](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-ERROR-VERBOSITY) - Sets the verbosity of logged messages
* [log_lock_waits](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-LOCK-WAITS) - Logs long lock waits
* [log_min_duration_statement](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-MIN-DURATION-STATEMENT) - Sets the minimum execution time (in milliseconds) above which statements will be logged. -1 disables logging statement durations
* [log_min_error_statement](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-MIN-ERROR-STATEMENT) - Causes all statements generating error at or above this level to be logged
* [log_min_messages](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-MIN-MESSAGES) - Sets the message levels that are logged
* [log_replication_commands](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-REPLICATION-COMMANDS) - Logs each replication command
* [log_statement](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-STATEMENT) - Sets the type of statements logged
* [log_statement_stats](https://www.postgresql.org/docs/current/runtime-config-statistics.html#id-1.6.6.12.3.2.1.1.3) - For each query, writes cumulative performance statistics to the server log
* [log_temp_files](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-TEMP-FILES) - Logs the use of temporary files larger than this number of kilobytes
* [maintenance_work_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM) - Sets the maximum memory to be used for maintenance operations
* [max_parallel_workers](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-WORKERS) - Sets the maximum number of parallel workers than can be active at one time
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
* [parallel_tuple_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-PARALLEL-TUPLE-COST) - Sets the planner's estimate of the cost of passing each tuple (row) from worker to master backend
* [pg_stat_statements.save](https://www.postgresql.org/docs/current/pgstatstatements.html#id-1.11.7.38.8) - Saves pg_stat_statements statistics across server shutdowns
* [pg_stat_statements.track](https://www.postgresql.org/docs/current/pgstatstatements.html#id-1.11.7.38.8) - Selects which statements are tracked by pg_stat_statements
* [pg_stat_statements.track_utility](https://www.postgresql.org/docs/current/pgstatstatements.html#id-1.11.7.38.8) - Selects whether utility commands are tracked by pg_stat_statements
* [quote_all_identifiers](https://www.postgresql.org/docs/current/runtime-config-compatible.html#GUC-QUOTE-ALL-IDENTIFIERS) - When generating SQL fragments, quotes all identifiers
* [random_page_cost](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-RANDOM-PAGE-COST) - Sets the planner's estimate of the cost of a nonsequentially fetched disk page
* [row_security](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-ROW-SECURITY) - Enables row security
* [search_path](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SEARCH-PATH) - Sets the schema search order for names that are not schema-qualified
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

* Another form of configuration, besides server parameters, are the resource [configuration options](concepts-hyperscale-configuration-options.md) in a Hyperscale (Citus) server group.
* The underlying PostgreSQL data base also has [configuration parameters](http://www.postgresql.org/docs/current/static/runtime-config.html).
