---
title: Troubleshoot post migration from HDInsight 3.6 Hive workloads to HDInsight 4.0 - Azure HDInsight
description: Troubleshooting guide for post migration from HDInsight 3.6 Hive workloads to HDInsight 4.0 - Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 03/27/2023
---

# Troubleshooting guide for post migration from HDInsight 3.6 Hive workloads to HDInsight 4.0 - Azure HDInsight

This article provides answers to some of the most common issues that customers face post migrating Hive workloads from HDInsight 3.6 to HDInsight 4.0.

Other steps to be followed to fix the incorrect results and poor performance after the migration

1. **Issue:**
    Hive query gives the incorrect result. Even the select count(*) query gives the incorrect result.

    **Cause:**
    The property “hive.compute.query.using.stats” is set to true, by default. If we set it to true, then it uses the stats, which is stored in metastore to execute the query. If the stats aren't up to date, then it results in incorrect results.

    **Resolution:**
    collect the stats for the managed tables using `alter table <table_name> compute statics;` command at the table level and column level. Reference link - https://cwiki.apache.org/confluence/display/hive/statsdev#StatsDev-TableandPartitionStatistics

1. **Issue**
    Hive queries are taking long time to execute.

    **Cause:**
    If the query has a join condition then hive creates a plan whether to use map join or merge join based on the table size and join condition. If one of the tables contains a small size, then it loads that table in the memory and performs the join operation. This way the query execution is faster when compared to the merge join.

    **Resolution:**
    Make sure to set the property "hive.auto.convert.join=true" which is the default value. Setting it to false uses the merge join and may result in poor performance.
    Hive decides whether to use map join or not based on following properties, which is set in the cluster

    ```
    set hive.auto.convert.join=true;
    set hive.auto.convert.join.noconditionaltask=true;
    set hive.auto.convert.join.noconditionaltask.size=<value>;
    set hive.mapjoin.smalltable.filesize = <value>;
    ```
    Common join can convert to map join automatically, when `hive.auto.convert.join.noconditionaltask=true`, if estimated size of small table(s) is smaller than hive.`auto.convert.join.noconditionaltask.size` (default 10 5mins
    MB).
    
     If you face any issue related to OOM by setting the property `hive.auto.convert.join` to true then it's advisable to set it to false only for that particular query at the session level and not at the cluster level. This issue might occur if the stats are wrong and Hive decides to use map join based on the stats.

1. **Issue:**
    Hive query gives the incorrect result if the query has a join condition and the tables involved has null or empty values.

    **Cause:**
    Sometimes we may get an issue related to null values if the tables involved in the query have lot of null values. Hive performs the query optimization wrongly with the null values involved which results in incorrect results.

    **Resolution:**
    We recommend try setting the property `set hive.cbo.returnpath.hiveop=true` at the session level if you get any incorrect results. This config introduces not null filtering on join keys. If the tables had many null values, for optimizing the join operation between multiple tables, we can enable this config so that it considers only the not null values.

1. **Issue:**
    Hive query gives the incorrect result if the query has a multiple join conditions.

    **Cause:**
    Sometime Tez produce bad runtime plans whenever there are same joins multiple time with map-joins.

    **Resolution**
    There's a chance of getting incorrect results when we set `hive.merge.nway.joins` to false. Try setting it to true only for the query, which got affected. This helps query with multiple joins on the same condition, merge joins together into a single join operator. This method is useful if large shuffle joins to avoid a reshuffle phase.

1. **Issue:**'
    There's an increase in time of the query execution day by day when compared to the earlier runs.

    **Cause:**
    This issue might occur if there's an increase in more numbers of small files. So hive takes time in reading all the files to process the data, which results in increase in execution time.

    **Resolution:**
    Make sure to run the compaction frequently for the tables, which are managed. This step avoids the small files and improves the performance.

    Reference link: [Hive Transactions - Apache Hive - Apache Software Foundation](https://cwiki.apache.org/confluence/display/hive/hive+transactions).


1. **Issue:**
    Hive query gives incorrect result when customer is using a join condition on managed acid orc table and managed non-ACID orc table.

    **Cause:**
    From HIVE 3 onwards, it's strictly requested to keep all the managed tables as an acid table. And if we want to keep it as an acid table then the table format must be orc and this is the main criteria. But if we disable the strict managed table property “hive.strict.managed.tables” to false then we can create a managed non-ACID table. Some case customer creates an external ORC table or after the migration the table converted to an external table and they disable the strict managed table property and convert it to managed table. At this point, the table converted to non-ACID managed orc format.

    **Resolution:**
    Hive optimization goes wrong if you join table with non-ACID managed ORC table with acid managed orc table.

    If you're converting an external table to managed table,
    1. Don’t set the property “hive.strict.managed.tables” to false. If you set then you can create a non-ACID managed table but it's not requested in HIVE-3
    1. Convert the external table to managed table using the following alter command instead of `alter table <table_name> set TBLPROPERTIES ('EXTERNAL'='false');`    
    ```
    alter table rt set TBLPROPERTIES ('EXTERNAL'='false', 'transactional'='true');
    ```

## Troubleshooting guide

[HDInsight 3.6 to 4.0 troubleshooting guide for Hive workloads](./interactive-query-troubleshoot-migrate-36-to-40.md) provides answers to common issues faced when migrating Hive workloads from HDInsight 3.6 to HDInsight 4.0.

## Further reading

* [HDInsight 4.0 Announcement](../hdinsight-version-release.md)
* [HDInsight 4.0 deep dive](https://azure.microsoft.com/blog/deep-dive-into-azure-hdinsight-4-0/)

