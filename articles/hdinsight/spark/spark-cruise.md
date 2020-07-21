---
title: Apache Spark Cruise on Azure HDInsight
description: This article provides an introduction to Spark in HDInsight and the different scenarios in which you can use Spark cluster in HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: how-to
ms.date: 07/27/2020

#customer intent: .
---
# SparkCruise on Azure HDInsight

This document discusses the Azure HDInsight feature *SparkCruise*, which automatically reuses Apache Spark computations to increase query efficiency.

## Overview

The queries that you run on an analytics platform such as Apache Spark, are usually decomposed into a query plan that contains smaller sub-queries. These sub-queries may show up repeatedly in the query plan for various larger queries. Each time they occur, they are re-executed in order to return the results. Re-executing the same query, however, can be inefficient and lead to unnecessary computation costs.

*SparkCruise* is a workload optimization platform that can reuse common computations, decreasing overall query execution time and data transfer costs.

## Setup and installation

SparkCruise is available on all HDInsight 4.0 clusters with Spark 2.3 or 2.4. The SparkCruise library files are installed in the `/opt/peregrine/` directory on your HDInsight cluster. 

To complete configuration on your cluster, set following Spark configuration properties:

* `spark.sql.queryExecutionListeners=com.microsoft.peregrine.spark.listeners.PlanLogListener` to enable logging of query plans 
* `spark.sql.extensions=com.microsoft.peregrine.spark.extensions.SparkExtensionsHdi` to enable the optimizer rules for online materialization and reuse

## Computation Reuse in Spark SQL

First, open `spark-shell` and run the first round of this sample query workload - 
```
spark.sql("select count(*) from hivesampletable").collect
spark.sql("select count(*) from hivesampletable").collect
spark.sql("select distinct market from hivesampletable where querytime like '11%'").show
spark.sql("select distinct state, country from hivesampletable where querytime like '11%'").show
:quit
```

Now, we can analyze the plans of above queries from existing Spark application logs - 
```
$ sudo /opt/peregrine/analyze/peregrine.sh analyze
```
The above analysis parses the query plans, identifies common subplan expressions, and selects interesting subplan expressions for future materialization and reuse. The output is a feedback file containing annotations for future Spark SQL queries. The contents of the feedback file can be listed using the following command - 
```
$ /opt/peregrine/analyze/peregrine.sh show
```
The feedback file contains records in the following format -
```
subplan-identifier [Materialize|Reuse] input/path/to/action
e.g., 18446744072264439276 Materialize /peregrine/views/18446744072264439276
```
For our sample workload, the feedback file will contain two unique signatures representing the first two repeated queries (signature: 18446744072264439276) and the filter predicate in last two queries (signature: 7829769082957813160). With this feedback file, the following queries when submitted using `spark-shell` will now automatically materialize and reuse common subplans - 
```
spark.sql("select count(*) from hivesampletable").collect
spark.sql("select count(*) from hivesampletable").collect
spark.sql("select distinct state, country from hivesampletable where querytime like '12%'").show
spark.sql("select distinct market from hivesampletable where querytime like '12%'").show
```

An astute reader might have noticed that we have changed the literal values in the second round of workload. Though computation reuse in Peregrine relies on past workload being a strong indicator of future reuse opportunities, it can still handle the time-varying changes in workload like evolution of literal values and dataset versions. In case of major changes in the workload, no materialization or reuse will be performed as no subplan match will be detected in the query plans. In this case, we can re-run the analysis to find new reuse opportunities.

Behind the scenes, Peregrine triggers a subquery for materializing the selected subplan from the first query that contains it. Then, the subsequent queries can directly read the materialized subplans instead of recomputing them. In this workload, the subplans will be materialized in an online fashion by the first and third queries. We can see the plan change of queries after the common subplans are materialized - 
```
spark.sql("select count(*) from hivesampletable").explain(true)
spark.sql("select distinct market from hivesampletable where querytime like '12%'").explain(true)
```

The feedback files, materialized subplans, and query logs are persisted across Spark sessions. To remove these files, run - 
```
$ sudo /opt/peregrine/analyze/peregrine.sh clean
```

More details of computation reuse in Peregrine are in our [demonstration presented in VLDB 2019](https://people.cs.umass.edu/~aroy/sparkcruise-vldb19.pdf).

## Next Steps

In this overview, you get some basic understanding of Apache Spark in Azure HDInsight. Learn how to create an HDInsight Spark cluster and run some Spark SQL queries:

* [Create an Apache Spark cluster in HDInsight](./apache-spark-jupyter-spark-sql-use-portal.md)
