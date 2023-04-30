---
title: How to optimize performance when using pgvector
description: How to optimize performance when using pgvector
ms.author: adamwolk
author: mulander
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 04/30/2023
---

# How to optimize performance when using pgvector

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

This article explores the limitations and tradeoffs of [pgvector](https://github.com/pgvector/pgvector) and shows how to use partitioning, indexing and search settings to improve performance.

For more on pgvector itself, see [basics of pgvector](#). You may also want to refer to the pgvector official [README](https://github.com/pgvector/pgvector/blob/master/README.md).

## Performance

You should always start by investigating the query plan. If your query terminates reasonably fast, run `EXPALIN (ANALYZE,VERBOSE, BUFFERS)`.

```postgresql
EXPLAIN (ANALYZE, VERBOSE, BUFFERS) SELECT * FROM t_test ORDER BY embedding <-> '[1,2,3]' LIMIT 5;
```

For queries that take too long to execute, consider dropping the `ANALYZE` keyword. The result will contain less details but will be provided instantly.

```postgresql
EXPLAIN (VERBOSE, BUFFERS) SELECT * FROM t_test ORDER BY embedding <-> '[1,2,3]' LIMIT 5;
```

Third party sites, like [explain.depesz.com](https://explain.depesz.com/) can be extremely helpful in understanding query plans. Some questions that you should try to answer are:

1. [Was the query parallelized](#parallel-execution)?
1. [Was an index used?](#indexing)
1. [Did I use the same condition in the WHERE clause as in a partial index definition?](#partial-indexes)
1. [If I use partitioning, were not-needed partitions pruned?](#partitioning)

If your vectors are normalized to length 1, like in the case of OpenAI embeddings. You should consider using inner product (`<=>`) for best performance.

## Parallel execution

In the output of your explain plan look for `Workers Planned` and `Workers Launched` (latter only when `ANALYZE` keyword was used). The `max_parallel_workers_per_gather` PostgreSQL parameter defines how many background workers the database may launch for every `Gather` and `Gather Merge` plan node. Increasing this value may speed up your exact search queries without having to create indexes. Note however, that the database may not decide to run the plan in parallel even when this value is high.


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

Without indexes present, pgvector performs an exact search, which provides perfect recall at the expense of performance.

In order to perform approximate nearest neighbor search you can create indexes on your data, which trades recall for execution performance.

When possible, always load your data before indexing it. It's both faster to create the index this way and the resulting layout will be more optimal.

### Limits

1. In order to index a column it has to have dimensions defined. Attempting to index a column defined as `col vector` will result in the error: `ERROR:  column does not have dimensions`.
1. You can only index a column that has up to 2000 dimensions. Attempting to index a column with more dimensions will result in the error: `ERROR:  column cannot have more than 2000 dimensions for ivfflat index`.

While you can store vectors with more than 2000 dimensions, you won't be able to index them. You can either use dimensionality reduction of your embeddings or rely on partitioning and/or sharding with Azure Cosmos DB for PostgreSQL to achieve acceptable performance without indexing.

#### Lists & Probes

The `ivfflat` is an index for approximate nearest neighbor (ANN) search. This method uses an inverted file index to partition the dataset into multiple lists. During a search, only a subset of these lists is searched, as specified by the probes parameter. By increasing the value of the probes parameter, more lists are searched, which can improve the accuracy of the search results at the cost of slower search speed.

If the probes parameter is set to the number of lists in the index, then all lists are searched and the search becomes an exact nearest neighbor search. In this case, the planner won’t use the index because searching all lists is equivalent to performing a brute-force search on the entire dataset.

The indexing method partitions the dataset into multiple lists using the k-means clustering algorithm. Each list contains vectors that are closest to a particular cluster center. During a search, the query vector is compared to the cluster centers to determine which list (or lists) are most likely to contain the nearest neighbors. If the probes parameter is set to 1, then only the list corresponding to the closest cluster center would be searched.

Selecting the correct value for the amount of probes to perform and the sizes of the lists may have a significant impact on search performance. Good places to start are:

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

### Selecting the index type

pgvector allows you to perform three types of searches on the stored vectors. You need to select the correct access function for your index in order to have the database consider your index when executing your queries.

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



## Partitioning

## Next steps

Congratulations, you just learned the tradeoffs, limitations and best practices to achieve the best performance with pgvector.

Learn how to [build a recommendation system](#) with pgvector.

