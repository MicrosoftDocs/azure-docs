---
title: include file
description: include file
author: mulander
ms.author: adamwolk
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: include
ms.date: 11/03/2023
ms.custom:
  - include file
  - build-2023
  - ignite-2023
---

## Performance

You should always start by investigating the query plan. If your query terminates reasonably fast, run `EXPLAIN (ANALYZE,VERBOSE, BUFFERS)`.

```postgresql
EXPLAIN (ANALYZE, VERBOSE, BUFFERS) SELECT * FROM t_test ORDER BY embedding <-> '[1,2,3]' LIMIT 5;
```

For queries that take too long to execute, consider dropping the `ANALYZE` keyword. The result contains fewer details but is provided instantly.

```postgresql
EXPLAIN (VERBOSE, BUFFERS) SELECT * FROM t_test ORDER BY embedding <-> '[1,2,3]' LIMIT 5;
```

Third party sites, like [explain.depesz.com](https://explain.depesz.com/) can be helpful in understanding query plans. Some questions that you should try to answer are:

* [Was the query parallelized](#parallel-execution)?
* [Was an index used?](#indexing)
* [Did I use the same condition in the WHERE clause as in a partial index definition?](#partial-indexes)
* [If I use partitioning, were not-needed partitions pruned?](#partitioning)

If your vectors are normalized to length 1, like OpenAI embeddings. You should consider using inner product (`<#>`) for best performance.

## Parallel execution

In the output of your explain plan, look for `Workers Planned` and `Workers Launched` (latter only when `ANALYZE` keyword was used). The `max_parallel_workers_per_gather` PostgreSQL parameter defines how many background workers the database can launch for every `Gather` and `Gather Merge` plan node. Increasing this value might speed up your exact search queries without having to create indexes. Note however, that the database might not decide to run the plan in parallel even when this value is high.


```postgresql
EXPLAIN SELECT * FROM t_test ORDER BY embedding <-> '[1,2,3]' LIMIT 3;
```

```text
                                        QUERY PLAN
------------------------------------------------------------------------------------------
 Limit  (cost=4214.82..4215.16 rows=3 width=33)
   ->  Gather Merge  (cost=4214.82..13961.30 rows=84752 width=33)
         Workers Planned: 1
         ->  Sort  (cost=3214.81..3426.69 rows=84752 width=33)
               Sort Key: ((embedding <-> '[1,2,3]'::vector))
               ->  Parallel Seq Scan on t_test  (cost=0.00..2119.40 rows=84752 width=33)
(6 rows)
```

## Indexing

Without indexes present, the extension performs an exact search, which provides perfect recall at the expense of performance.

In order to perform approximate nearest neighbor search you can create indexes on your data, which trades recall for execution performance.

When possible, always load your data before indexing it. It's both faster to create the index this way and the resulting layout is more optimal.

There are two supported index types:
* [Inverted File with Flat Compression (IVVFlat)](#inverted-file-with-flat-compression-ivvflat)
* [Hierarchical Navigable Small Worlds (HNSW)](#hierarchical-navigable-small-worlds-hnsw)

The `IVFFlat` index has faster build times and uses less memory than `HNSW`, but has lower query performance (in terms of speed-recall tradeoff).

### Limits

* In order to index a column, it has to have dimensions defined. Attempting to index a column defined as `col vector` results in the error: `ERROR:  column does not have dimensions`.
* You can only index a column that has up to 2000 dimensions. Attempting to index a column with more dimensions results in the error: `ERROR:  column cannot have more than 2000 dimensions for INDEX_TYPE index` where `INDEX_TYPE` is either `ivfflat` or `hnsw`.

While you can store vectors with more than 2000 dimensions, you can't index them. You can use dimensionality reduction to fit within the limits. Alternatively rely on partitioning and/or sharding with Azure Cosmos DB for PostgreSQL to achieve acceptable performance without indexing.

#### Inverted File with Flat Compression (IVVFlat)

The `ivfflat` is an index for approximate nearest neighbor (ANN) search. This method uses an inverted file index to partition the dataset into multiple lists. The probes parameter controls how many lists are searched, which can improve the accuracy of the search results at the cost of slower search speed.

If the probes parameter is set to the number of lists in the index, then all lists are searched and the search becomes an exact nearest neighbor search. In this case, the planner isn't using the index because searching all lists is equivalent to performing a brute-force search on the entire dataset.

The indexing method partitions the dataset into multiple lists using the k-means clustering algorithm. Each list contains vectors that are closest to a particular cluster center. During a search, the query vector is compared to the cluster centers to determine which lists are most likely to contain the nearest neighbors. If the probes parameter is set to 1, then only the list corresponding to the closest cluster center would be searched.

##### Index options

Selecting the correct value for the number of probes to perform and the sizes of the lists might affect search performance. Good places to start are:

1. Use `lists` equal to `rows / 1000` for tables with up to 1 million rows and `sqrt(rows)` for larger datasets.
1. For `probes` start with `lists / 10` for tables up to 1 million rows and `sqrt(lists)` for larger datasets.

The amount of `lists` is defined upon index creation with the `lists` option:

```postgresql
CREATE INDEX t_test_embedding_cosine_idx ON t_test USING ivfflat (embedding vector_cosine_ops) WITH (lists = 5000);
```

The probes can be set for the whole connection or per transaction (using `SET LOCAL` within a transaction block):

```postgresql
SET ivfflat.probes = 10;
SELECT * FROM t_test ORDER BY embedding <=> '[1,2,3]' LIMIT 5; -- uses 10 probes
SELECT * FROM t_test ORDER BY embedding <=> '[1,2,3]' LIMIT 5; -- uses 10 probes
```

```postgresql
BEGIN;

SET LOCAL ivfflat.probes = 10;
SELECT * FROM t_test ORDER BY embedding <=> '[1,2,3]' LIMIT 5; -- uses 10 probes

COMMIT;

SELECT * FROM t_test ORDER BY embedding <=> '[1,2,3]' LIMIT 5; -- uses default, one probe

```

##### Indexing progress

With PostgreSQL 12 and newer, you can use `pg_stat_progress_create_index` to check indexing progress.

```postgresql
SELECT phase, round(100.0 * tuples_done / nullif(tuples_total, 0), 1) AS "%" FROM pg_stat_progress_create_index;
```

Phases for building IVFFlat indexes are:
1. `initializing`
1. `performing k-means`
1. `assigning tuples`
1. `loading tuples`

> [!NOTE]
> Progress percentage (`%`) is only populated during `loading tuples` phase.

#### Hierarchical Navigable Small Worlds (HNSW)

The `hnsw` is an index for approximate nearest neighbor (ANN) search using the Hierarchical Navigable Small Worlds algorithm. It works by creating a graph around randomly selected entry points finding their nearest neighbors, the graph is then extended with multiple layers, each lower layer containing more points. This multilayered graph when searched starts at the top, narrowing down until it hits the lowest layer that contains the nearest neighbors of the query.

Building this index takes more time and memory than IVFFlat, however it has better speed-recall tradeoff. Additionally, there's no training step like with IVFFlat, so the index can be created on an empty table.

##### Index options

When creating the index, you can tune two parameters:
1. `m` - maximum number of connections per layer (defaults to 16)
1. `ef_construction` - size of the dynamic candidate list used for graph construction (defaults to 64)

```postgresql
CREATE INDEX t_test_hnsw_l2_idx ON t_test USING hnsw (embedding vector_l2_ops) WITH (m = 16, ef_construction = 64);
```

During queries, you can specify the dynamic candidate list for search (defaults to 40).

```postgresql
```

The dynamic candidate list for search can be set for the whole connection or per transaction (using `SET LOCAL` within a transaction block):

```postgresql
SET hnsw.ef_search = 100;
SELECT * FROM t_test ORDER BY embedding <=> '[1,2,3]' LIMIT 5; -- uses 100 candidates
SELECT * FROM t_test ORDER BY embedding <=> '[1,2,3]' LIMIT 5; -- uses 100 candidates
```

```postgresql
BEGIN;

SET hnsw.ef_search = 100;
SELECT * FROM t_test ORDER BY embedding <=> '[1,2,3]' LIMIT 5; -- uses 100 candidates

COMMIT;

SELECT * FROM t_test ORDER BY embedding <=> '[1,2,3]' LIMIT 5; -- uses default, 40 candidates

```


##### Indexing progress

With PostgreSQL 12 and newer, you can use `pg_stat_progress_create_index` to check indexing progress.

```postgresql
SELECT phase, round(100.0 * blocks_done / nullif(blocks_total, 0), 1) AS "%" FROM pg_stat_progress_create_index;
```

Phases for building HNSW indexes are:
1. `initializing`
1. `loading tuples`

### Selecting the index access function

The `vector` type allows you to perform three types of searches on the stored vectors. You need to select the correct access function for your index in order to have the database consider your index when executing your queries. The examples demonstrate on `ivfflat` index types, however the same can be done for `hnsw` indexes. The `lists` option only applies to `ivfflat` indexes.

#### Cosine distance

For cosine similarity search, use the `vector_cosine_ops` access method.

```postgresql
CREATE INDEX t_test_embedding_cosine_idx ON t_test USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

To use the above index, the query needs to perform a cosine similarity search, which is done with the `<=>` operator.

```postgresql
EXPLAIN SELECT * FROM t_test ORDER BY embedding <=> '[1,2,3]' LIMIT 5;
```

```text
                                              QUERY PLAN
------------------------------------------------------------------------------------------------------
 Limit  (cost=5.02..5.23 rows=5 width=33)
   ->  Index Scan using t_test_embedding_cosine_idx on t_test  (cost=5.02..175.06 rows=4003 width=33)
         Order By: (embedding <=> '[1,2,3]'::vector)
(3 rows)
```

#### L2 distance

For L2 distance (also known as Euclidean distance), use the `vector_l2_ops` access method.

```postgresql
CREATE INDEX t_test_embedding_l2_idx ON t_test USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
```

To use the above index, the query needs to perform an L2 distance search, which is done with the `<->` operator.

```postgresql
EXPLAIN SELECT * FROM t_test ORDER BY embedding <-> '[1,2,3]' LIMIT 5;
```

```text
                                            QUERY PLAN
--------------------------------------------------------------------------------------------------
 Limit  (cost=5.02..5.23 rows=5 width=33)
   ->  Index Scan using t_test_embedding_l2_idx on t_test  (cost=5.02..175.06 rows=4003 width=33)
         Order By: (embedding <-> '[1,2,3]'::vector)
(3 rows)
```

#### Inner product

For inner product similarity, use the `vector_ip_ops` access method.

```postgresql
CREATE INDEX t_test_embedding_ip_idx ON t_test USING ivfflat (embedding vector_ip_ops) WITH (lists = 100);
```

To use the above index, the query needs to perform an inner product similarity search, which is done with the `<#>` operator.

```postgresql
EXPLAIN SELECT * FROM t_test ORDER BY embedding <#> '[1,2,3]' LIMIT 5;
```

```text
                                            QUERY PLAN
--------------------------------------------------------------------------------------------------
 Limit  (cost=5.02..5.23 rows=5 width=33)
   ->  Index Scan using t_test_embedding_ip_idx on t_test  (cost=5.02..175.06 rows=4003 width=33)
         Order By: (embedding <#> '[1,2,3]'::vector)
(3 rows)
```

## Partial indexes

In some scenarios, it's beneficial to have an index that covers only a partial set of the data. We can, for example,  build an index just for our premium users:

```postgresql
CREATE INDEX t_premium ON t_test USING ivfflat (vec vector_ip_ops) WITH (lists = 100) WHERE tier = 'premium';
```

We can now see the premium tier now uses the index:

```postgresql
explain select * from t_test where tier = 'premium' order by vec <#> '[2,2,2]';
```

```text
                                     QUERY PLAN
------------------------------------------------------------------------------------
 Index Scan using t_premium on t_test  (cost=65.57..25638.05 rows=245478 width=39)
   Order By: (vec <#> '[2,2,2]'::vector)
(2 rows)
```

While the free tier users lack the benefit:

```postgresql
explain select * from t_test where tier = 'free' order by vec <#> '[2,2,2]';
```

```
                              QUERY PLAN
-----------------------------------------------------------------------
 Sort  (cost=44019.01..44631.37 rows=244941 width=39)
   Sort Key: ((vec <#> '[2,2,2]'::vector))
   ->  Seq Scan on t_test  (cost=0.00..15395.25 rows=244941 width=39)
         Filter: (tier = 'free'::text)
(4 rows)
```

Having only a subset of data indexed, means the index takes less space on disk and is faster to search through.

PostgreSQL might fail to recognize that the index is safe to use if the form used in the `WHERE` clause of the partial index definition doesn't match the one used in your queries.
In our example dataset, we only have the exact values `'free'`, `'test'` and `'premium'` as the distinct values of the tier column. Even with a query using `tier LIKE 'premium'` PostgreSQL isn't using the index.

```postgresql
explain select * from t_test where tier like 'premium' order by vec <#> '[2,2,2]';
```

```text
                              QUERY PLAN
-----------------------------------------------------------------------
 Sort  (cost=44086.30..44700.00 rows=245478 width=39)
   Sort Key: ((vec <#> '[2,2,2]'::vector))
   ->  Seq Scan on t_test  (cost=0.00..15396.59 rows=245478 width=39)
         Filter: (tier ~~ 'premium'::text)
(4 rows)
```

## Partitioning

One way to improve performance is to split the dataset over multiple partitions. We can imagine a system when it's natural to refer to data just from the current year or maybe past two years.
In such a system, you can partition your data by a date range and then capitalize on improved performance when the system is able to read only the relevant partitions as defined by the queried year.

Let us define a partitioned table:

```postgresql
CREATE TABLE t_test_partitioned(vec vector(3), vec_date date default now()) partition by range (vec_date);
```

We can manually create partitions for every year or use the Citus utility function (available on Cosmos DB for PostgreSQL).

```postgresql
    select create_time_partitions(
      table_name         := 't_test_partitioned',
      partition_interval := '1 year',
      start_from         := '2020-01-01'::timestamptz,
      end_at             := '2024-01-01'::timestamptz
    );
```

Check the created partitions:

```postgresql
\d+ t_test_partitioned
```

```text
                                Partitioned table "public.t_test_partitioned"
  Column  |   Type    | Collation | Nullable | Default | Storage  | Compression | Stats target | Description
----------+-----------+-----------+----------+---------+----------+-------------+--------------+-------------
 vec      | vector(3) |           |          |         | extended |             |              |
 vec_date | date      |           |          | now()   | plain    |             |              |
Partition key: RANGE (vec_date)
Partitions: t_test_partitioned_p2020 FOR VALUES FROM ('2020-01-01') TO ('2021-01-01'),
            t_test_partitioned_p2021 FOR VALUES FROM ('2021-01-01') TO ('2022-01-01'),
            t_test_partitioned_p2022 FOR VALUES FROM ('2022-01-01') TO ('2023-01-01'),
            t_test_partitioned_p2023 FOR VALUES FROM ('2023-01-01') TO ('2024-01-01')
```

To manually create a partition:

```postgresql
CREATE TABLE t_test_partitioned_p2019 PARTITION OF t_test_partitioned FOR VALUES FROM ('2019-01-01') TO ('2020-01-01');
```

Then make sure that your queries actually filter down to a subset of available partitions. For example in the query below we filtered down to two partitions:

```postgresql
explain analyze select * from t_test_partitioned where vec_date between '2022-01-01' and '2024-01-01';
```

```text
                                                                  QUERY PLAN
-----------------------------------------------------------------------------------------------------------------------------------------------
 Append  (cost=0.00..58.16 rows=12 width=36) (actual time=0.014..0.018 rows=3 loops=1)
   ->  Seq Scan on t_test_partitioned_p2022 t_test_partitioned_1  (cost=0.00..29.05 rows=6 width=36) (actual time=0.013..0.014 rows=1 loops=1)
         Filter: ((vec_date >= '2022-01-01'::date) AND (vec_date <= '2024-01-01'::date))
   ->  Seq Scan on t_test_partitioned_p2023 t_test_partitioned_2  (cost=0.00..29.05 rows=6 width=36) (actual time=0.002..0.003 rows=2 loops=1)
         Filter: ((vec_date >= '2022-01-01'::date) AND (vec_date <= '2024-01-01'::date))
 Planning Time: 0.125 ms
 Execution Time: 0.036 ms
```

You can index a partitioned table.

```postgresql
CREATE INDEX ON t_test_partitioned USING ivfflat (vec vector_cosine_ops) WITH (lists = 100);
```

```postgresql
explain analyze select * from t_test_partitioned where vec_date between '2022-01-01' and '2024-01-01' order by vec <=> '[1,2,3]' limit 5;
```

```text
                                                                                         QUERY PLAN
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=4.13..12.20 rows=2 width=44) (actual time=0.040..0.042 rows=1 loops=1)
   ->  Merge Append  (cost=4.13..12.20 rows=2 width=44) (actual time=0.039..0.040 rows=1 loops=1)
         Sort Key: ((t_test_partitioned.vec <=> '[1,2,3]'::vector))
         ->  Index Scan using t_test_partitioned_p2022_vec_idx on t_test_partitioned_p2022 t_test_partitioned_1  (cost=0.04..4.06 rows=1 width=44) (actual time=0.022..0.023 rows=0 loops=1)
               Order By: (vec <=> '[1,2,3]'::vector)
               Filter: ((vec_date >= '2022-01-01'::date) AND (vec_date <= '2024-01-01'::date))
         ->  Index Scan using t_test_partitioned_p2023_vec_idx on t_test_partitioned_p2023 t_test_partitioned_2  (cost=4.08..8.11 rows=1 width=44) (actual time=0.015..0.016 rows=1 loops=1)
               Order By: (vec <=> '[1,2,3]'::vector)
               Filter: ((vec_date >= '2022-01-01'::date) AND (vec_date <= '2024-01-01'::date))
 Planning Time: 0.167 ms
 Execution Time: 0.139 ms
(11 rows)
```
