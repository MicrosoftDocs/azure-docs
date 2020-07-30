---
title: Server parameters – Hyperscale (Hyperscale (Citus) - Azure Database for PostgreSQL
description: Functions the in Hyperscale (Citus) SQL API
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: reference
ms.date: 07/28/2020
---

# Server parameters

There are various server parameters that affect the behavior of Hyperscale
(Citus). These include both standard PostgreSQL parameters, and Hyperscale
(Citus) specific parameters. To learn more about PostgreSQL configuration
parameters, you can visit the [run time
configuration](http://www.postgresql.org/docs/current/static/runtime-config.html)
section of PostgreSQL documentation.

The rest of this reference aims at discussing Hyperscale (Citus) specific
configuration parameters. These parameters can be set in the Azure portal under
**Worker node parameters** under **Settings** for a Hyperscale (Citus) server
group.

## General configuration

### citus.use\_secondary\_nodes (enum)

Sets the policy to use when choosing nodes for SELECT queries. If this
is set to 'always', then the planner will query only nodes which are
marked as 'secondary' noderole in
[pg_dist_node](reference-hyperscale-metadata.md#worker-node-table).

The supported values for this enum are:

-   **never:** (default) All reads happen on primary nodes.
-   **always:** Reads run against secondary nodes instead, and
    insert/update statements are disabled.

### citus.cluster\_name (text)

Informs the coordinator node planner which cluster it coordinates. Once
cluster\_name is set, the planner will query worker nodes in that
cluster alone.

### citus.enable\_version\_checks (boolean)

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

### citus.node\_connection\_timeout (integer)

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

## Query Statistics

### citus.stat\_statements\_purge\_interval (integer)

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

### citus.shard\_replication\_factor (integer)

Sets the replication factor for shards i.e. the number of nodes on which
shards will be placed and defaults to 1. This parameter can be set at
run-time and is effective on the coordinator. The ideal value for this
parameter depends on the size of the cluster and rate of node failure.
For example, you may want to increase this replication factor if you run
large clusters and observe node failures on a more frequent basis.

### citus.shard\_count (integer)

Sets the shard count for hash-partitioned tables and defaults to 32.  This
value is used by the
[create_distributed_table](reference-hyperscale-udf.md#create_distributed_table)
UDF when creating hash-partitioned tables. This parameter can be set at
run-time and is effective on the coordinator.

### citus.shard\_max\_size (integer)

Sets the maximum size to which a shard will grow before it gets split
and defaults to 1GB. When the source file\'s size (which is used for
staging) for one shard exceeds this configuration value, the database
ensures that a new shard gets created. This parameter can be set at
run-time and is effective on the coordinator.

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
> This GUC is applicable only when
> [shard_replication_factor](reference-hyperscale-guc.md#citusshard_replication_factor-integer)
> is greater than one, or for queries against
> [reference_tables](concepts-hyperscale-distributed-data.md#type-2-reference-tables).

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

### citus.enable\_ddl\_propagation (boolean)

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

This parameter can be set at run-time and is effective on the coordinator.

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

#### citus.enable\_repartition\_joins (boolean)

Ordinarily, attempting to perform repartition joins with the adaptive executor
will fail with an error message.  However setting
`citus.enable_repartition_joins` to true allows Hyperscale (Citus) to
temporarily switch into the task-tracker executor to perform the join.  The
default value is false.

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
