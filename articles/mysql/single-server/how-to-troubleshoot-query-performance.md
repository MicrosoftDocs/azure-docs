---
title: Profile query performance - Azure Database for MySQL 
description: Learn how to profile query performance in Azure Database for MySQL by using EXPLAIN.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.topic: troubleshooting
ms.date: 10/20/2023
---

# Profile query performance in Azure Database for MySQL using EXPLAIN

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

**EXPLAIN** is a handy tool that can help you optimize queries. You can use an EXPLAIN statement to get information about how SQL statements are run. The following shows example output from running an EXPLAIN statement.

```sql
mysql> EXPLAIN SELECT * FROM tb1 WHERE id=100\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: tb1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 995789
     filtered: 10.00
        Extra: Using where
```

In this example, the value of *key* is NULL, which means that MySQL can't locate any indexes optimized for the query. As a result, it performs a full table scan. Let's optimize this query by adding an index on the **ID** column, and then run the EXPLAIN statement again.

```sql
mysql> ALTER TABLE tb1 ADD KEY (id);
mysql> EXPLAIN SELECT * FROM tb1 WHERE id=100\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: tb1
   partitions: NULL
         type: ref
possible_keys: id
          key: id
      key_len: 4
          ref: const
         rows: 1
     filtered: 100.00
        Extra: NULL
```

Now, the output shows that MySQL uses an index to limit the number of rows to 1, which dramatically shortens the search time.

## Covering index

A covering index includes of all columns of a query, which reduces value retrieval from data tables. The following **GROUP BY** statement and related output illustrates this.

```sql
mysql> EXPLAIN SELECT MAX(c1), c2 FROM tb1 WHERE c2 LIKE '%100' GROUP BY c1\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: tb1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 995789
     filtered: 11.11
        Extra: Using where; Using temporary; Using filesort
```

The output shows that MySQL doesn't use any indexes, because proper indexes are unavailable. The output also shows *Using temporary; Using filesort*, which indicates that MySQL creates a temporary table to satisfy the **GROUP BY** clause.

Creating an index only on column **c2** makes no difference, and MySQL still needs to create a temporary table:

```sql
mysql> ALTER TABLE tb1 ADD KEY (c2);
mysql> EXPLAIN SELECT MAX(c1), c2 FROM tb1 WHERE c2 LIKE '%100' GROUP BY c1\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: tb1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 995789
     filtered: 11.11
        Extra: Using where; Using temporary; Using filesort
```

In this case, you can create a **covered index** on both **c1** and **c2** by adding the value of **c2**" directly in the index, which will eliminate further data lookup.

```sql
mysql> ALTER TABLE tb1 ADD KEY covered(c1,c2);
mysql> EXPLAIN SELECT MAX(c1), c2 FROM tb1 WHERE c2 LIKE '%100' GROUP BY c1\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: tb1
   partitions: NULL
         type: index
possible_keys: covered
          key: covered
      key_len: 108
          ref: NULL
         rows: 995789
     filtered: 11.11
        Extra: Using where; Using index
```

As the output of the EXPLAIN above shows, MySQL now uses the covered index and avoids having to creating a temporary table.

## Combined index

A combined index consists values from multiple columns and can be considered an array of rows that are sorted by concatenating values of the indexed columns. This method can be useful in a **GROUP BY** statement.

```sql
mysql> EXPLAIN SELECT c1, c2 from tb1 WHERE c2 LIKE '%100' ORDER BY c1 DESC LIMIT 10\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: tb1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 995789
     filtered: 11.11
        Extra: Using where; Using filesort
```

MySQL performs a *file sort* operation that is fairly slow, especially when it has to sort many rows. To optimize this query, create a combined index on both of the columns that are being sorted.

```sql
mysql> ALTER TABLE tb1 ADD KEY my_sort2 (c1, c2);
mysql> EXPLAIN SELECT c1, c2 from tb1 WHERE c2 LIKE '%100' ORDER BY c1 DESC LIMIT 10\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: tb1
   partitions: NULL
         type: index
possible_keys: NULL
          key: my_sort2
      key_len: 108
          ref: NULL
         rows: 10
     filtered: 11.11
        Extra: Using where; Using index
```

The output of the EXPLAIN statement now shows that MySQL uses a combined index to avoid additional sorting as the index is already sorted.

## Conclusion

You can increase performance significantly by using EXPLAIN together with different types of indexes. Having an index on a table doesn't necessarily mean that MySQL can use it for your queries. Always validate your assumptions by using EXPLAIN and optimize your queries using indexes.

## Next steps

- To find peer answers to your most important questions or to post or answer a question, visit [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-database-mysql).
