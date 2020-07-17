---
title: Configuration options – Hyperscale (Hyperscale (Citus)) - Azure Database for PostgreSQL
description: Functions the in Hyperscale (Citus) SQL API
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: reference
ms.date: 07/17/2020
---

# Configuration Reference

There are various configuration parameters that affect the behavior of
Hyperscale (Citus). These include both standard PostgreSQL parameters, and
Hyperscale (Citus) specific parameters. To learn more about PostgreSQL
configuration parameters, you can visit the [run time
configuration](http://www.postgresql.org/docs/current/static/runtime-config.html)
section of PostgreSQL documentation.

The rest of this reference aims at discussing Hyperscale (Citus) specific
configuration parameters. These parameters can be set similar to PostgreSQL
parameters by modifying postgresql.conf or [by using the SET
command](http://www.postgresql.org/docs/current/static/config-setting.html).

As an example you can update a setting with:

```postgresql
ALTER DATABASE citus SET citus.multi_task_query_log_level = 'log';
```

## General configuration

### citus.max\_worker\_nodes\_tracked (integer)

Hyperscale (Citus) tracks worker nodes' locations and their membership in a
shared hash table on the coordinator node. This configuration value limits the
size of the hash table, and consequently the number of worker nodes that can be
tracked. The default for this setting is 2048. This parameter can only be set
at server start and is effective on the coordinator node.

### citus.use\_secondary\_nodes (enum)

Sets the policy to use when choosing nodes for SELECT queries. If this
is set to 'always', then the planner will query only nodes which are
marked as 'secondary' noderole in
`pg_dist_node <pg_dist_node>`{.interpreted-text role="ref"}.

The supported values for this enum are:

-   **never:** (default) All reads happen on primary nodes.
-   **always:** Reads run against secondary nodes instead, and
    insert/update statements are disabled.

### citus.cluster\_name (text)

Informs the coordinator node planner which cluster it coordinates. Once
cluster\_name is set, the planner will query worker nodes in that
cluster alone.

### citus.enable\_version\_checks (boolean) {#enable_version_checks}

Upgrading Hyperscale (Citus) version requires a server restart (to pick up the
new shared-library), as well as running an ALTER EXTENSION UPDATE command.  The
failure to execute both steps could potentially cause errors or crashes.
Hyperscale (Citus) thus validates the version of the code and that of the
extension match, and errors out if they don\'t.

This value defaults to true, and is effective on the coordinator. In
rare cases, complex upgrade processes may require setting this parameter
to false, thus disabling the check.

### citus.log\_distributed\_deadlock\_detection (boolean)

Whether to log distributed deadlock detection related processing in the
server log. It defaults to false.

### citus.distributed\_deadlock\_detection\_factor (floating point)

Sets the time to wait before checking for distributed deadlocks. In
particular the time to wait will be this value multiplied by
PostgreSQL\'s
[deadlock\_timeout](https://www.postgresql.org/docs/current/static/runtime-config-locks.html)
setting. The default value is `2`. A value of `-1` disables distributed
deadlock detection.

### citus.node\_connection\_timeout (integer) {#node_connection_timeout}

The `citus.node_connection_timeout` GUC sets the maximum duration (in
milliseconds) to wait for connection establishment. Hyperscale (Citus) raises
an error if the timeout elapses before at least one worker connection is
established. This GUC affects connections from the coordinator to workers, and
workers to each other.

-   Default: five seconds
-   Minimum: ten milliseconds
-   Maximum: one hour

```postgresql
-- set to 30 seconds
ALTER DATABASE foo
SET citus.node_connection_timeout = 30000;
```

### citus.node\_conninfo (text) {#node_conninfo}

The `citus.node_conninfo` GUC sets non-sensitive [libpq connection
parameters](https://www.postgresql.org/docs/current/static/libpq-connect.html#LIBPQ-PARAMKEYWORDS)
used for all inter-node connections.

```postgresql
-- key=value pairs separated by spaces.
-- For example, ssl options:

ALTER DATABASE foo
SET citus.node_conninfo =
  'sslrootcert=/path/to/citus.crt sslmode=verify-full';
```

Hyperscale (Citus) honors only a whitelisted subset of the options, namely:

-   application\_name
-   connect\_timeout
-   gsslib†
-   keepalives
-   keepalives\_count
-   keepalives\_idle
-   keepalives\_interval
-   krbsrvname†
-   sslcompression
-   sslcrl
-   sslmode (defaults to \"require\")
-   sslrootcert

*(† = subject to the runtime presence of optional PostgreSQL features)*

The `node_conninfo` setting takes effect only on newly opened
connections. To force all connections to use the new settings, make sure
to reload the postgres configuration:

```postgresql
SELECT pg_reload_conf();
```

## Query Statistics

### citus.stat\_statements\_purge\_interval (integer)

Sets the frequency at which the maintenance daemon removes records from
`citus_stat_statements <citus_stat_statements>`{.interpreted-text
role="ref"} that are unmatched in `pg_stat_statements`. This
configuration value sets the time interval between purges in seconds,
with a default value of 10. A value of 0 disables the purges.

```psql
SET citus.stat_statements_purge_interval TO 5;
```

This parameter is effective on the coordinator and can be changed at
runtime.

### citus.stat\_statements\_max (integer)

The maximum number of rows to store in
`citus_stat_statements <citus_stat_statements>`{.interpreted-text
role="ref"}. Defaults to 50000, and may be changed to any value in the
range 1000 - 10000000. Note that each row requires 140 bytes of storage,
so setting stat\_statements\_max to its maximum value of 10M would
consume 1.4GB of memory.

Changing this GUC will not take effect until PostgreSQL is restarted.

## Data Loading

### citus.multi\_shard\_commit\_protocol (enum)

Sets the commit protocol to use when performing COPY on a hash
distributed table. On each individual shard placement, the COPY is
performed in a transaction block to ensure that no data is ingested if
an error occurs during the COPY. However, there is a particular failure
case in which the COPY succeeds on all placements, but a (hardware)
failure occurs before all transactions commit. This parameter can be
used to prevent data loss in that case by choosing between the following
commit protocols:

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

### citus.shard\_replication\_factor (integer) {#replication_factor}

Sets the replication factor for shards i.e. the number of nodes on which
shards will be placed and defaults to 1. This parameter can be set at
run-time and is effective on the coordinator. The ideal value for this
parameter depends on the size of the cluster and rate of node failure.
For example, you may want to increase this replication factor if you run
large clusters and observe node failures on a more frequent basis.

### citus.shard\_count (integer)

Sets the shard count for hash-partitioned tables and defaults to 32.
This value is used by the
`create_distributed_table <create_distributed_table>`{.interpreted-text
role="ref"} UDF when creating hash-partitioned tables. This parameter
can be set at run-time and is effective on the coordinator.

### citus.shard\_max\_size (integer)

Sets the maximum size to which a shard will grow before it gets split
and defaults to 1GB. When the source file\'s size (which is used for
staging) for one shard exceeds this configuration value, the database
ensures that a new shard gets created. This parameter can be set at
run-time and is effective on the coordinator.

### citus.replicate\_reference\_tables\_on\_activate (boolean) {#replicate_reference_tables_on_activate}

Reference table shards must be placed on all nodes which have
distributed tables. By default, reference table shards are copied to a
node at node activation time, that is, when such functions as
`master_add_node`{.interpreted-text role="ref"} or
`master_activate_node`{.interpreted-text role="ref"} are called. However
node activation might be an inconvenient time to copy the placements,
because it can take a long time when there are large reference tables.

You can defer reference table replication by setting the
`citus.replicate_reference_tables_on_activate` GUC to \'off\'. Reference
table replication will then happen we create new shards on the node. For
instance, when calling `create_distributed_table`{.interpreted-text
role="ref"}, `create_reference_table`{.interpreted-text role="ref"},
`upgrade_to_reference_table`{.interpreted-text role="ref"}, or when the
shard rebalancer moves shards to the new node.

The default value for this GUC is \'on\'.

## Planner Configuration

### citus.limit\_clause\_row\_fetch\_count (integer)

Sets the number of rows to fetch per task for limit clause optimization.
In some cases, select queries with limit clauses may need to fetch all
rows from each task to generate results. In those cases, and where an
approximation would produce meaningful results, this configuration value
sets the number of rows to fetch from each shard. Limit approximations
are disabled by default and this parameter is set to -1. This value can
be set at run-time and is effective on the coordinator.

### citus.count\_distinct\_error\_rate (floating point)

Hyperscale (Citus) can calculate count(distinct) approximates using the
postgresql-hll extension. This configuration entry sets the desired
error rate when calculating count(distinct). 0.0, which is the default,
disables approximations for count(distinct); and 1.0 provides no
guarantees about the accuracy of results. We recommend setting this
parameter to 0.005 for best results. This value can be set at run-time
and is effective on the coordinator.

### citus.task\_assignment\_policy (enum)

> [!NOTE]
> This GUC is applicable only when `shard_replication_factor
> <replication_factor>`{.interpreted-text role="ref"} is greater than one, or
> for queries against `reference_tables`{.interpreted-text role="ref"}.

Sets the policy to use when assigning tasks to workers. The coordinator
assigns tasks to workers based on shard locations. This configuration
value specifies the policy to use when making these assignments.
Currently, there are three possible task assignment policies which can
be used.

-   **greedy:** The greedy policy is the default and aims to evenly
    distribute tasks across workers.
-   **round-robin:** The round-robin policy assigns tasks to workers in
    a round-robin fashion alternating between different replicas. This
    enables much better cluster utilization when the shard count for a
    table is low compared to the number of workers.
-   **first-replica:** The first-replica policy assigns tasks on the
    basis of the insertion order of placements (replicas) for the
    shards. In other words, the fragment query for a shard is simply
    assigned to the worker which has the first replica of that shard.
    This method allows you to have strong guarantees about which shards
    will be used on which nodes (i.e. stronger memory residency
    guarantees).

This parameter can be set at run-time and is effective on the
coordinator.

## Intermediate Data Transfer

### citus.binary\_worker\_copy\_format (boolean)

Use the binary copy format to transfer intermediate data between
workers. During large table joins, Hyperscale (Citus) may have to dynamically
repartition and shuffle data between different workers. By default, this
data is transferred in text format. Enabling this parameter instructs
the database to use PostgreSQL's binary serialization format to transfer
this data. This parameter is effective on the workers and needs to be
changed in the postgresql.conf file. After editing the config file,
users can send a SIGHUP signal or restart the server for this change to
take effect.

### citus.binary\_master\_copy\_format (boolean)

Use the binary copy format to transfer data between coordinator and the
workers. When running distributed queries, the workers transfer their
intermediate results to the coordinator for final aggregation. By
default, this data is transferred in text format. Enabling this
parameter instructs the database to use PostgreSQL's binary
serialization format to transfer this data. This parameter can be set at
runtime and is effective on the coordinator.

### citus.max\_intermediate\_result\_size (integer)

The maximum size in KB of intermediate results for CTEs that are unable
to be pushed down to worker nodes for execution, and for complex
subqueries. The default is 1GB, and a value of -1 means no limit.
Queries exceeding the limit will be canceled and produce an error
message.

## DDL

### citus.enable\_ddl\_propagation (boolean) {#enable_ddl_prop}

Specifies whether to automatically propagate DDL changes from the coordinator
to all workers. The default value is true. Because some schema changes require
an access exclusive lock on tables and because the automatic propagation
applies to all workers sequentially it can make a Hyperscale (Citus) cluster
temporarily less responsive. You may choose to disable this setting and
propagate changes manually.

> [!NOTE]
> For a list of DDL propagation support, see
> `ddl_prop_support`{.interpreted-text role="ref"}.

## Executor Configuration

### General

#### citus.all\_modifications\_commutative

Hyperscale (Citus) enforces commutativity rules and acquires appropriate locks
for modify operations in order to guarantee correctness of behavior. For
example, it assumes that an INSERT statement commutes with another INSERT
statement, but not with an UPDATE or DELETE statement. Similarly, it assumes
that an UPDATE or DELETE statement does not commute with another UPDATE or
DELETE statement. This means that UPDATEs and DELETEs require Hyperscale
(Citus) to acquire stronger locks.

If you have UPDATE statements that are commutative with your INSERTs or
other UPDATEs, then you can relax these commutativity assumptions by
setting this parameter to true. When this parameter is set to true, all
commands are considered commutative and claim a shared lock, which can
improve overall throughput. This parameter can be set at runtime and is
effective on the coordinator.

#### citus.max\_task\_string\_size (integer)

Sets the maximum size (in bytes) of a worker task call string. Changing
this value requires a server restart, it cannot be changed at runtime.

Active worker tasks are tracked in a shared hash table on the master
node. This configuration value limits the maximum size of an individual
worker task, and affects the size of pre-allocated shared memory.

Minimum: 8192, Maximum 65536, Default 12288

#### citus.remote\_task\_check\_interval (integer)

Sets the frequency at which Hyperscale (Citus) checks for statuses of jobs managed by
the task tracker executor. It defaults to 10ms. The coordinator assigns
tasks to workers, and then regularly checks with them about each task\'s
progress. This configuration value sets the time interval between two
consequent checks. This parameter is effective on the coordinator and
can be set at runtime.

#### citus.task\_executor\_type (enum)

Hyperscale (Citus) has three executor types for running distributed SELECT queries.
The desired executor can be selected by setting this configuration
parameter. The accepted values for this parameter are:

-   **adaptive:** The default. It is optimal for fast responses to
    queries that involve aggregations and co-located joins spanning
    across multiple shards.
-   **task-tracker:** The task-tracker executor is well suited for long
    running, complex queries which require shuffling of data across
    worker nodes and efficient resource management.
-   **real-time:** (deprecated) Serves a similar purpose as the adaptive
    executor, but is less flexible and can cause more connection
    pressure on worker nodes.

This parameter can be set at run-time and is effective on the
coordinator. For more details about the executors, you can visit the
`distributed_query_executor`{.interpreted-text role="ref"} section of
our documentation.

#### citus.multi\_task\_query\_log\_level (enum) {#multi_task_logging}

Sets a log-level for any query which generates more than one task (i.e.
which hits more than one shard). This is useful during a multi-tenant
application migration, as you can choose to error or warn for such
queries, to find them and add a tenant\_id filter to them. This
parameter can be set at runtime and is effective on the coordinator. The
default value for this parameter is \'off\'.

The supported values for this enum are:

-   **off:** Turn off logging any queries which generate multiple tasks
    (i.e. span multiple shards)
-   **debug:** Logs statement at DEBUG severity level.
-   **log:** Logs statement at LOG severity level. The log line will
    include the SQL query that was run.
-   **notice:** Logs statement at NOTICE severity level.
-   **warning:** Logs statement at WARNING severity level.
-   **error:** Logs statement at ERROR severity level.

Note that it may be useful to use `error` during development testing,
and a lower log-level like `log` during actual production deployment.
Choosing `log` will cause multi-task queries to appear in the database
logs with the query itself shown after \"STATEMENT.\"

```
LOG:  multi-task query about to be executed
HINT:  Queries are split to multiple tasks if they have to be split into several queries on the workers.
STATEMENT:  select * from foo;
```

#### citus.propagate\_set\_commands (enum)

Determines which SET commands are propagated from the coordinator to
workers. The default value for this parameter is \'none\'.

The supported values are:

-   **none:** no SET commands are propagated.
-   **local:** only SET LOCAL commands are propagated.

#### citus.enable\_repartition\_joins (boolean)

Ordinarily, attempting to perform `repartition_joins`{.interpreted-text
role="ref"} with the adaptive executor will fail with an error message.
However setting `citus.enable_repartition_joins` to true allows Hyperscale (Citus) to
temporarily switch into the task-tracker executor to perform the join.
The default value is false.

#### citus.enable\_repartitioned\_insert\_select (boolean) {#enable_repartitioned_insert_select}

By default, an INSERT INTO ... SELECT statement that cannot be pushed
down will attempt to repartition rows from the SELECT statement and
transfer them between workers for insertion. However, if the target
table has too many shards then repartitioning will probably not perform
well. The overhead of processing the shard intervals when determining
how to partition the results is too great. Repartitioning can be
disabled manually by setting `citus.enable_repartitioned_insert_select`
to false.

### Adaptive executor configuration

#### citus.max\_shared\_pool\_size (integer) {#max_shared_pool_size}

Specifies the maximum number of connections that the coordinator node,
across all simultaneous sessions, is allowed to make per worker node.
PostgreSQL must allocate fixed resources for every connection and this
GUC helps ease connection pressure on workers.

Without connection throttling, every multi-shard query creates
connections on each worker proportional to the number of shards it
accesses (in particular, up to \#shards/\#workers). Running dozens of
multi-shard queries at once can easily hit worker nodes\'
`max_connections` limit, causing queries to fail.

By default, the value is automatically set equal to the coordinator\'s
own `max_connections`, which isn\'t guaranteed to match that of the
workers (see the note below). The value -1 disables throttling.

> [!NOTE]
> There are certain operations that do not obey citus.max\_shared\_pool\_size,
> most importantly COPY and repartition joins. That\'s why it can be prudent to
> increase the max\_connections on the workers a bit higher than
> max\_connections on the coordinator. This gives extra space for connections
> required for COPY and repartition queries on the workers.

#### citus.max\_adaptive\_executor\_pool\_size (integer)

Whereas `max_shared_pool_size`{.interpreted-text role="ref"} limits
worker connections across all sessions,
`max_adaptive_executor_pool_size` limits worker connections from just
the *current* session. This GUC is useful for:

-   Preventing a single backend from getting all the worker resources
-   Providing priority management: designate low priority sessions with
    low max\_adaptive\_executor\_pool\_size, and high priority sessions
    with higher values

The default value is 16.

#### citus.executor\_slow\_start\_interval (integer)

Time to wait in milliseconds between opening connections to the same
worker node.

When the individual tasks of a multi-shard query take very little time,
they can often be finished over a single (often already cached)
connection. To avoid redundantly opening additional connections, the
executor waits between connection attempts for the configured number of
milliseconds. At the end of the interval, it increases the number of
connections it is allowed to open next time.

For long queries (those taking \>500ms), slow start might add latency,
but for short queries it\'s faster. The default value is 10ms.

#### citus.max\_cached\_conns\_per\_worker (integer)

Each backend opens connections to the workers to query the shards. At
the end of the transaction, the configured number of connections is kept
open to speed up subsequent commands. Increasing this value will reduce
the latency of multi-shard queries, but will also increase overhead on
the workers.

The default value is 1. A larger value such as 2 might be helpful for
clusters that use a small number of concurrent sessions, but it\'s not
wise to go much further (e.g. 16 would be too high).

#### citus.force\_max\_query\_parallelization (boolean)

Simulates the deprecated real-time executor. This is used to open as
many connections as possible to maximize query parallelization.

When this GUC is enabled, Hyperscale (Citus) will force the adaptive executor to use
as many connections as possible while executing a parallel distributed
query. If not enabled, the executor might choose to use fewer
connections to optimize overall query execution throughput. Internally,
setting this true will end up using one connection per task.

Once place where this is useful is in a transaction whose first query is
lightweight and requires few connections, while a subsequent query would
benefit from more connections. Hyperscale (Citus) decides how many connections to use
in a transaction based on the first statement, which can throttle other
queries unless we use the GUC to provide a hint.

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

### Task tracker executor configuration

#### citus.task\_tracker\_delay (integer)

This sets the task tracker sleep time between task management rounds and
defaults to 200ms. The task tracker process wakes up regularly, walks
over all tasks assigned to it, and schedules and executes these tasks.
Then, the task tracker sleeps for a time period before walking over
these tasks again. This configuration value determines the length of
that sleeping period. This parameter is effective on the workers and
needs to be changed in the postgresql.conf file. After editing the
config file, users can send a SIGHUP signal or restart the server for
the change to take effect.

This parameter can be decreased to trim the delay caused due to the task
tracker executor by reducing the time gap between the management rounds.
This is useful in cases when the shard queries are very short and hence
update their status very regularly.

#### citus.max\_tracked\_tasks\_per\_node (integer)

Sets the maximum number of tracked tasks per node and defaults to 1024.
This configuration value limits the size of the hash table which is used
for tracking assigned tasks, and therefore the maximum number of tasks
that can be tracked at any given time. This value can be set only at
server start time and is effective on the workers.

This parameter would need to be increased if you want each worker node to be
able to track more tasks. If this value is lower than what is required,
Hyperscale (Citus) errors out on the worker node saying it is out of shared
memory and also gives a hint indicating that increasing this parameter may
help.

#### citus.max\_assign\_task\_batch\_size (integer)

The task tracker executor on the coordinator synchronously assigns tasks
in batches to the deamon on the workers. This parameter sets the maximum
number of tasks to assign in a single batch. Choosing a larger batch
size allows for faster task assignment. However, if the number of
workers is large, then it may take longer for all workers to get tasks.
This parameter can be set at runtime and is effective on the
coordinator.

#### citus.max\_running\_tasks\_per\_node (integer)

The task tracker process schedules and executes the tasks assigned to it
as appropriate. This configuration value sets the maximum number of
tasks to execute concurrently on one node at any given time and defaults
to 8. This parameter is effective on the worker nodes and needs to be
changed in the postgresql.conf file. After editing the config file,
users can send a SIGHUP signal or restart the server for the change to
take effect.

This configuration entry ensures that you don\'t have many tasks hitting
disk at the same time and helps in avoiding disk I/O contention. If your
queries are served from memory or SSDs, you can increase
max\_running\_tasks\_per\_node without much concern.

#### citus.partition\_buffer\_size (integer)

Sets the buffer size to use for partition operations and defaults to 8MB.
Hyperscale (Citus) allows for table data to be re-partitioned into multiple
files when two large tables are being joined. After this partition buffer fills
up, the repartitioned data is flushed into files on disk.  This configuration
entry can be set at run-time and is effective on the workers.

### Real-time executor configuration (deprecated)

The Hyperscale (Citus) query planner first prunes away the shards unrelated to
a query and then hands the plan over to the real-time executor. For executing
the plan, the real-time executor opens one connection and uses two file
descriptors per unpruned shard. If the query hits a high number of shards, then
the executor may need to open more connections than max\_connections or use
more file descriptors than max\_files\_per\_process.

In such cases, the real-time executor will begin throttling tasks to
prevent overwhelming the worker resources. Since this throttling can
reduce query performance, the real-time executor will issue an
appropriate warning suggesting that increasing these parameters might be
required to maintain the desired performance. These parameters are
discussed in brief below.

#### max\_connections (integer)

Sets the maximum number of concurrent connections to the database
server. The default is typically 100 connections, but might be less if
your kernel settings will not support it (as determined during initdb).
The real time executor maintains an open connection for each shard to
which it sends queries. Increasing this configuration parameter will
allow the executor to have more concurrent connections and hence handle
more shards in parallel. This parameter has to be changed on the workers
as well as the coordinator, and can be done only during server start.

#### max\_files\_per\_process (integer)

Sets the maximum number of simultaneously open files for each server
process and defaults to 1000. The real-time executor requires two file
descriptors for each shard it sends queries to. Increasing this
configuration parameter will allow the executor to have more open file
descriptors, and hence handle more shards in parallel. This change has
to be made on the workers as well as the coordinator, and can be done
only during server start.

> [!NOTE]
> Along with max\_files\_per\_process, one may also have to increase the
> kernel limit for open file descriptors per process using the ulimit
> command.

### Explain output

#### citus.explain\_all\_tasks (boolean)

By default, Hyperscale (Citus) shows the output of a single, arbitrary
task when running
[EXPLAIN](http://www.postgresql.org/docs/current/static/sql-explain.html)
on a distributed query. In most cases, the explain output will be
similar across tasks. Occasionally, some of the tasks will be planned
differently or have much higher execution times. In those cases, it can
be useful to enable this parameter, after which the EXPLAIN output will
include all tasks. This may cause the EXPLAIN to take longer.
