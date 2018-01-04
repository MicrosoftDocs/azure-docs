---
title: How To Troubleshoot Query Performance in Azure Database for MySQL | Microsoft Docs
description: This article describes how to use EXPLAIN to troubleshoot query performance in Azure Database for MySQL.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 01/04/2018
---

# How to use EXPLAIN to profile query performance in Azure Database for MySQL
**EXPLAIN** is a very handy tool to optimize queries. EXPLAIN statement can be used to get information about how SQL statements are executed. The output below shows an example of the execution of an EXPLAIN statement.

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

As we can see from this example, the value of *key* is NULL. This means MySQL cannot find any indexes optimized for the query and it performs a full table scan. Let's optimize this query by adding an index on the **ID** column.

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

The new EXPLAIN shows that MySQL now uses an index to limit the number of rows to 1. This in turn dramatically shortened the search time.
 
## Covering index
A covering index consists of all columns of a query in the index to reduce value retrieval from data tables. Here's an illustration of this in the **GROUP BY** statement below.
 
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

As we can see in the output, MySQL does not use any indexes because no proper indexes are available. It also shows *Using temporary; Using filesort*, which means MySQL will create a temporary table to satisfy the **GROUP BY** clause.
 
Creating an index on column **c2** alone will make no difference, and MySQL still needs to create a temporary table:

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

In this case, we can create a **covered index** on both **c1** and **c2**, whereby adding the value of **c2**" directly in the index to eliminate further data lookup.

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

As the EXPLAIN shows above, MySQL will now use the covered index and avoid creating a temporary table. 

## Combined index
A combined index consists values from multiple columns and can be considered an array of rows that are sorted by concatenating values of the indexed columns. This can be useful in a **GROUP BY** statement.

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

MySQL performs a *filesort* operation which is fairly slow, especially if it has to sort a lot of rows. To optimize this query, we can create a combined index on both columns that are being sorted.

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

The EXPLAIN now shows that MySQL is able to use our combined index to avoid additional sorting since the index is already sorted.
 
## CONCLUSION
 
Using EXPLAIN and different type of Indexes can increase performance significantly. Just because you have an index on the table doesn’t necessarily mean MySQL would be able to use it for your queries. Always validate your assumptions using EXPLAIN and optimize your queries using indexes.


## Next steps
- To find peer answers to your most concerned questions or post a new question/answer, visit [MSDN forum](https://social.msdn.microsoft.com/forums/security/en-US/home?forum=AzureDatabaseforMySQL) or [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-database-mysql).
