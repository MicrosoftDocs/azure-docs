<properties
   pageTitle="Hash distribution and its effect on query performance in SQL Data Warehouse | Microsoft Azure"
   description="Learn about hash distributed tables and how they affect query performance in Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/26/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Hash distribution and its effect on query performance in SQL Data Warehouse

Making smart hash distribution decisions is one of the most important ways to improve query performance.  

There are in fact three major factors:

1. Minimize Data Movement
2. Avoid Data Skew
3. Provide Balanced Execution

## Minimize data movement
Data Movement most commonly arises when tables are joined together or aggregations on tables are performed. Hash distributing tables on a shared key is one of the most effective methods for minimizing this movement.

However, for the hash distribution to be effective in minimizing the movement the following criteria must all be true:

1. Both tables need to be hash distributed and be joined on the shared distribution key
2. The data types of both columns need to match
3. The joining columns need to be equi-join (i.e. the values in the left table's column need to equal the values in the right table's column)
4. The join is **not** a `CROSS JOIN`

> [AZURE.NOTE] Columns used in `JOIN`, `GROUP BY`, `DISTINCT` and `HAVING` clauses all make for good HASH column candidates. On the other hand columns in the `WHERE` clause do **not** make for good hash column candidates. See the section on balanced execution below.

Data movement may also arise from query syntax (`COUNT DISTINCT` and the `OVER` clause both being great examples) when used with columns that do not include the hash distribution key.

> [AZURE.NOTE] Round-Robin tables typically generate data movement. The data in the table has been allocated in a non-deterministic fashion and so the data must first be moved prior to most queries being completed.

## Avoid data skew
In order for hash distribution to be effective it is important that the column chosen exhibits the following properties:

1. The column contains a significant number of distinct values.
2. The column does not suffer from **data skew**.

Each distinct value will be allocated to a distribution. Consequently, the data will require a reasonable number of distinct values to ensure enough unique hash values are generated. Otherwise we might get a poor quality hash. If the number of distributions exceeds the number of distinct values for example then some distributions will be left empty. This would hurt performance.

Similarly, if all of the rows for the hashed column contained the same value then the data is said to be **skewed**. In this extreme case only one hash value would have been created resulting in all rows ending up inside a single distribution. Ideally, each distinct value in the hashed column would have the same number of rows.

> [AZURE.NOTE] Round-robin tables do not exhibit signs of skew. This is because the data is stored evenly across the distributions.

## Provide balanced execution
Balanced execution is achieved when each distribution has the same amount of work to perform. Massively Parallel Processing (MPP) is a team game; everyone has to cross the line before anyone can be declared the winner. If every distribution has the same amount of work (i.e. data to process) then all of the queries will finish at about the same time. This is known as balanced execution.

As has been seen, data skew can affect balanced execution. However, so can the choice of hash distribution key. If a column has been chosen that appears in the `WHERE` clause of a query then it is quite likely that the query will not be balanced.  

> [AZURE.NOTE] The `WHERE` clause typically helps identify columns that are best used for partitioning.

A good example of a column that appears in the `WHERE` clause would be a date field.  Date fields are a classic examples of great partitioning columns but often poor hash distribution columns. Typically, data warehouse queries are over a specified time period such as day, week or month. Hash distributing by date may have actually limited our scalablity and hurt our performance. If for example the date range specified was for a week i.e. 7 days then the maximum number of hashes would be 7 - one for each day. This means that only 7 of our distributions would contain data. The remaining distributions would not have any data. This would result in an unbalanced query execution as only 7 distributions are processing data.

> [AZURE.NOTE] Round-robin tables typically provide balanced execution. This is because the data is stored evenly across the distributions.

## Recommendations
To maximize your performance and overall query throughput try and ensure that your hash distributed tables follow this pattern as much as possible:

Hash distribution key:

1. Is used in `JOIN`, `GROUP BY`, `DISTINCT`, or `HAVING` clauses in your queries.
2. Is not used in `WHERE` clauses
3. Has lots of different values, at least 1000.
4. Does not have a disproportionately large number of rows that will hash to a small number of distributions.
5. Is defined as NOT NULL. NULL rows will congregate in one distribution.

## Summary

Hash distribution can be summarized as follows:

- The hash function is deterministic. The same value is always assigned to the same distribution.
- One column is used as the distribution column. The hash function uses the nominated column to compute the row assignments to distributions.
- The hash function is based on the type of the column not on the values themselves
- Hash distributing a table can sometimes result in a skewed table
- Hash distributed tables generally require less data movement when resolving queries, and therefore improve query performance for large fact tables.
- Observe the recommendations for hash distributed column selection to enhance query throughput.

> [AZURE.NOTE] In SQL Data Warehouse data type consistency matters! Make sure that the existing schema is consistently using the same type for a column. This is especially important for the distribution key. If the distribution key data types are not synchronized and the tables are joined then needless data movement will occur. This could be costly if the tables are large and would result in reduced throughput  and performance.


## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other Web references-->
