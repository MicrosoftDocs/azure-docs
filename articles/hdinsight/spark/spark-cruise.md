---
title: Use SparkCruise on Azure HDInsight to speed up Apache Spark queries
description: Learn how to use the SparkCruise optimization platform to improve efficiency of Apache Spark queries.
ms.service: hdinsight
ms.topic: how-to
ms.date: 04/28/2023

# Customer intent: As an Apache Spark developer, I would like to learn about the tools and features to optimize my Spark workloads on Azure HDInsight.
---
# SparkCruise on Azure HDInsight

This document discusses the Azure HDInsight feature *SparkCruise*, which automatically reuses Apache Spark computations to increase query efficiency.

## Overview

The queries that you run on an analytics platform such as Apache Spark, are decomposed into a query plan that contains smaller subqueries. These subqueries may show up repeatedly across query plans for multiple queries. Each time they occur, they're re-executed to return the results. Re-executing the same query, however, can be inefficient and lead to unnecessary computation costs.

*SparkCruise* is a workload optimization platform that can reuse common computations, decreasing overall query execution time and data transfer costs. The platform uses the concept of a *materialized view*, which is a query whose results are stored in pre-computed form. Those results can then be reused when the query itself shows up again later, rather than recomputing the results all over again.

## Setup and installation

SparkCruise is available on all HDInsight 4.0 clusters with Spark 2.3 or 2.4. The SparkCruise library files are installed in the `/opt/peregrine/` directory on your HDInsight cluster. To work properly, *SparkCruise* requires the following configuration properties, which are set by default.

* `spark.sql.queryExecutionListeners` is set to `com.microsoft.peregrine.spark.listeners.PlanLogListener`, which enables logging of query plans.
* `spark.sql.extensions` is set to `com.microsoft.peregrine.spark.extensions.SparkExtensionsHdi`, which enables the optimizer rules for online materialization and reuse.

## Computation Reuse in Spark SQL

The following sample scenario illustrates how to use *SparkCruise* to optimize Apache Spark queries. 

1. SSH into the head node of your spark cluster.
1. Type `spark-shell`.
1. Run the following code snippet, which runs a few basic queries using sample data on the cluster.

    ```scala
    spark.sql("select count(*) from hivesampletable").collect
    spark.sql("select count(*) from hivesampletable").collect
    spark.sql("select distinct market from hivesampletable where querytime like '11%'").show
    spark.sql("select distinct state, country from hivesampletable where querytime like '11%'").show
    :quit
    ```
1. Use the *SparkCruise* query analysis tool to analyze the query plans of the previous queries, which are stored in the Spark application logs. 

    ```
    sudo /opt/peregrine/analyze/peregrine.sh analyze views
    ```

1. View the output of the analysis process, which is a feedback file. This feedback file contains annotations for future Spark SQL queries. 

    ```
    sudo /opt/peregrine/analyze/peregrine.sh show
    ```

The `analyze` command parses the query plans and creates a tabular representation of the workload. This workload table can be queried using the *WorkloadInsights* notebook included in the [HDInsight SparkCruise Samples](https://github.com/Azure-Samples/azure-sparkcruise-samples) repository. Then, the `views` command identifies common subplan expressions and selects interesting subplan expressions for future materialization and reuse. The output is a feedback file containing annotations for future Spark SQL queries. 

The `show` command displays an output like the following text:

```bash
Feedback file -->

1593761760087311271 Materialize /peregrine/views/1593761760087311271
1593761760087311271 Reuse /peregrine/views/1593761760087311271
18446744073621796959 Materialize /peregrine/views/18446744073621796959
18446744073621796959 Reuse /peregrine/views/18446744073621796959
11259615723090744908 Materialize /peregrine/views/11259615723090744908
11259615723090744908 Reuse /peregrine/views/11259615723090744908
9409467400931056980 Materialize /peregrine/views/9409467400931056980
9409467400931056980 Reuse /peregrine/views/9409467400931056980

Materialized subexpressions -->

Found 4 items
-rw-r--r--   1 sshuser sshuser     113445 2020-07-24 16:46 /peregrine/views/logical_ir.csv
-rw-r--r--   1 sshuser sshuser     169458 2020-07-24 16:46 /peregrine/views/physical_ir.csv
-rw-r--r--   1 sshuser sshuser      25730 2020-07-24 16:46 /peregrine/views/views.csv
-rw-r--r--   1 sshuser sshuser        536 2020-07-24 16:46 /peregrine/views/views.stp
```

The feedback file contains entries in the following format: `subplan-identifier [Materialize|Reuse] input/path/to/action`. In this example, there are two unique signatures: one representing the first two repeated queries and the second representing the filter predicate in last two queries. With this feedback file, the following queries when submitted again will now automatically materialize and reuse common subplans. 

To test the optimizations, execute another set of sample queries.

1. Type `spark-shell`.
1. Execute the following code snippet

    ```scala
    spark.sql("select count(*) from hivesampletable").collect
    spark.sql("select count(*) from hivesampletable").collect
    spark.sql("select distinct state, country from hivesampletable where querytime like '12%'").show
    spark.sql("select distinct market from hivesampletable where querytime like '12%'").show
    :quit
    ```

1. View the feedback file again, to see the signatures of the queries that have been reused.

    ```
    sudo /opt/peregrine/analyze/peregrine.sh show
    ```

The `show` command gives an output similar to the following text:

```bash
Feedback file -->

1593761760087311271 Materialize /peregrine/views/1593761760087311271
1593761760087311271 Reuse /peregrine/views/1593761760087311271
18446744073621796959 Materialize /peregrine/views/18446744073621796959
18446744073621796959 Reuse /peregrine/views/18446744073621796959
11259615723090744908 Materialize /peregrine/views/11259615723090744908
11259615723090744908 Reuse /peregrine/views/11259615723090744908
9409467400931056980 Materialize /peregrine/views/9409467400931056980
9409467400931056980 Reuse /peregrine/views/9409467400931056980

Materialized subexpressions -->

Found 8 items
drwxr-xr-x   - root root          0 2020-07-24 17:21 /peregrine/views/11259615723090744908
drwxr-xr-x   - root root          0 2020-07-24 17:21 /peregrine/views/1593761760087311271
drwxr-xr-x   - root root          0 2020-07-24 17:22 /peregrine/views/18446744073621796959
drwxr-xr-x   - root root          0 2020-07-24 17:21 /peregrine/views/9409467400931056980
-rw-r--r--   1 root root     113445 2020-07-24 16:46 /peregrine/views/logical_ir.csv
-rw-r--r--   1 root root     169458 2020-07-24 16:46 /peregrine/views/physical_ir.csv
-rw-r--r--   1 root root      25730 2020-07-24 16:46 /peregrine/views/views.csv
-rw-r--r--   1 root root        536 2020-07-24 16:46 /peregrine/views/views.stp

```

Although the literal value in the query has changed from `'11%'` to `'12%'`, *SparkCruise* can still match previous queries to new queries with slight variations like the evolution of literal values and dataset versions. If there are major changes to a query, you can rerun the analysis tool to identify new queries that can be reused.

Behind the scenes, *SparkCruise* triggers a subquery for materializing the selected subplan from the first query that contains it. Later queries can directly read the materialized subplans instead of recomputing them. In this workload, the subplans will be materialized in an online fashion by the first and third queries. We can see the plan change of queries after the common subplans are materialized.

You can see that there are now four new materialized subexpressions available to be reused in subsequent queries.

## Clean up

The feedback files, materialized subplans, and query logs are persisted across Spark sessions. To remove these files, run the following command:

```bash
sudo /opt/peregrine/analyze/peregrine.sh clean
```

## Next steps

* [Use the Workload Insights Notebook to Determine the Benefits of SparkCruise](https://github.com/Azure-Samples/azure-sparkcruise-samples/tree/main/SparkCruise)
* [Improve performance of Apache Spark workloads using Azure HDInsight IO Cache](apache-spark-improve-performance-iocache.md)
* [Optimize Apache Spark jobs in HDInsight](./apache-spark-perf.md)
* [SparkCruise: Handsfree Computation Reuse in Spark](https://people.cs.umass.edu/~aroy/sparkcruise-vldb19.pdf)
* [Apache Spark guidelines on Azure HDInsight](./spark-best-practices.md)
