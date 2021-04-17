---
title: Columnar table storage preview - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Compressing data using columnar storage (preview)
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 04/07/2021
---

# Columnar table storage (preview)

> [!IMPORTANT]
> Columnar table storage in Hyperscale (Citus) is currently in preview. This
> preview version is provided without a service level agreement, and it's not
> recommended for production workloads. Certain features might not be supported
> or might have constrained capabilities.
>
> You can see a complete list of other new features in [preview features for
> Hyperscale (Citus)](hyperscale-preview-features.md).

Azure Database for PostgreSQL - Hyperscale (Citus) supports append-only
columnar table storage for analytic and data warehousing workloads. When
columns (rather than rows) are stored contiguously on disk, data becomes more
compressible, and queries can request a subset of columns more quickly.

To use columnar storage, specify `USING columnar` when creating a table:

```postgresql
CREATE TABLE contestant (
    handle TEXT,
    birthdate DATE,
    rating INT,
    percentile FLOAT,
    country CHAR(3),
    achievements TEXT[]
) USING columnar;
```

Hyperscale (Citus) converts rows to columnar storage in "stripes" during
insertion. Each stripe holds one transaction's worth of data, or 150000 rows,
whichever is less.  (The stripe size and other parameters of a columnar table
can be changed with the
[alter_columnar_table_set](reference-hyperscale-functions.md#alter_columnar_table_set)
function.)

For example, the following statement puts all five rows into the same stripe,
because all values are inserted in a single transaction:

```postgresql
-- insert these values into a single columnar stripe

INSERT INTO contestant VALUES
  ('a','1990-01-10',2090,97.1,'XA','{a}'),
  ('b','1990-11-01',2203,98.1,'XA','{a,b}'),
  ('c','1988-11-01',2907,99.4,'XB','{w,y}'),
  ('d','1985-05-05',2314,98.3,'XB','{}'),
  ('e','1995-05-05',2236,98.2,'XC','{a}');
```

It's best to make large stripes when possible, because Hyperscale (Citus)
compresses columnar data separately per stripe. We can see facts about our
columnar table like compression rate, number of stripes, and average rows per
stripe by using `VACUUM VERBOSE`:

```postgresql
VACUUM VERBOSE contestant;
```
```
INFO:  statistics for "contestant":
storage id: 10000000000
total file size: 24576, total data size: 248
compression rate: 1.31x
total row count: 5, stripe count: 1, average rows per stripe: 5
chunk count: 6, containing data for dropped columns: 0, zstd compressed: 6
```

The output shows that Hyperscale (Citus) used the zstd compression algorithm to
obtain 1.31x data compression. The compression rate compares a) the size of
inserted data as it was staged in memory against b) the size of that data
compressed in its eventual stripe.

Because of how it's measured, the compression rate may or may not match the
size difference between row and columnar storage for a table. The only way
to truly find that difference is to construct a row and columnar table that
contain the same data, and compare:

```postgresql
CREATE TABLE contestant_row AS
    SELECT * FROM contestant;

SELECT pg_total_relation_size('contestant_row') as row_size,
       pg_total_relation_size('contestant') as columnar_size;
```
```
 row_size | columnar_size
----------+---------------
    16384 |         24576
```

For our tiny table, the columnar storage actually uses more space, but as the
data grows, compression will win.

## Example

Columnar storage works well with table partitioning. For an example, see the
Citus Engine community documentation, [archiving with columnar
storage](https://docs.citusdata.com/en/stable/use_cases/timeseries.html#archiving-with-columnar-storage).

## Gotchas

* Columnar storage compresses per stripe. Stripes are created per transaction,
  so inserting one row per transaction will put single rows into their own
  stripes. Compression and performance of single row stripes will be worse than
  a row table. Always insert in bulk to a columnar table.
* If you mess up and columnarize a bunch of tiny stripes, you're stuck.
  The only fix is to create a new columnar table and copy
  data from the original in one transaction:
  ```postgresql
  BEGIN;
  CREATE TABLE foo_compacted (LIKE foo) USING columnar;
  INSERT INTO foo_compacted SELECT * FROM foo;
  DROP TABLE foo;
  ALTER TABLE foo_compacted RENAME TO foo;
  COMMIT;
  ```
* Fundamentally non-compressible data can be a problem, although columnar
  storage is still useful when selecting specific columns. It doesn't need
  to load the other columns into memory.
* On a partitioned table with a mix of row and column partitions, updates must
  be carefully targeted. Filter them to hit only the row partitions.
   * If the operation is targeted at a specific row partition (for example,
     `UPDATE p2 SET i = i + 1`), it will succeed; if targeted at a specified columnar
     partition (for example, `UPDATE p1 SET i = i + 1`), it will fail.
   * If the operation is targeted at the partitioned table and has a WHERE
     clause that excludes all columnar partitions (for example
     `UPDATE parent SET i = i + 1 WHERE timestamp = '2020-03-15'`),
     it will succeed.
   * If the operation is targeted at the partitioned table, but does not
     filter on the partition key columns, it will fail. Even if there are
     WHERE clauses that match rows in only columnar partitions, it's not
     enough--the partition key must also be filtered.

## Limitations

This feature still has a number of significant limitations. See [Hyperscale
(Citus) limits and limitations](concepts-hyperscale-limits.md#columnar-storage).

## Next steps

* See an example of columnar storage in a Citus [timeseries
  tutorial](https://docs.citusdata.com/en/stable/use_cases/timeseries.html#archiving-with-columnar-storage)
  (external link).
