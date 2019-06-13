---
title: What is Apache Hive and HiveQL - Azure HDInsight 
description: Apache Hive is a data warehouse system for Apache Hadoop. You can query data stored in Hive using HiveQL, which similar to Transact-SQL. In this document, learn how to use Hive and HiveQL with Azure HDInsight.
keywords: hiveql,what is hive,hadoop hiveql,how to use hive,learn hive,what is hive
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 06/06/2019
---

# What is Apache Hive and HiveQL on Azure HDInsight?

[Apache Hive](https://hive.apache.org/) is a data warehouse system for Apache Hadoop. Hive enables data summarization, querying, and analysis of data. Hive queries are written in HiveQL, which is a query language similar to SQL.

Hive allows you to project structure on largely unstructured data. After you define the structure, you can use HiveQL to query the data without knowledge of Java or MapReduce.

HDInsight provides several cluster types, which are tuned for specific workloads. The following cluster types are most often used for Hive queries:

* __Interactive Query__: A Hadoop cluster that provides [Low Latency Analytical Processing (LLAP)](https://cwiki.apache.org/confluence/display/Hive/LLAP) functionality to improve response times for interactive queries. For more information, see the [Start with Interactive Query in HDInsight](../interactive-query/apache-interactive-query-get-started.md) document.

* __Hadoop__: A Hadoop cluster that is tuned for batch processing workloads. For more information, see the [Start with Apache Hadoop in HDInsight](../hadoop/apache-hadoop-linux-tutorial-get-started.md) document.

* __Spark__: Apache Spark has built-in functionality for working with Hive. For more information, see the [Start with Apache Spark on HDInsight](../spark/apache-spark-jupyter-spark-sql.md) document.

* __HBase__: HiveQL can be used to query data stored in Apache HBase. For more information, see the [Start with Apache HBase on HDInsight](../hbase/apache-hbase-tutorial-get-started-linux.md) document.

## How to use Hive

Use the following table to discover the different ways to use Hive with HDInsight:

| **Use this method** if you want... | ...**interactive** queries | ...**batch** processing | ...from this **client operating system** |
|:--- |:---:|:---:|:--- |:--- |
| [HDInsight tools for Visual Studio Code](../hdinsight-for-vscode.md) |✔ |✔ | Linux, Unix, Mac OS X, or Windows |
| [HDInsight tools for Visual Studio](../hadoop/apache-hadoop-use-hive-visual-studio.md) |✔ |✔ |Windows |
| [Hive View](../hadoop/apache-hadoop-use-hive-ambari-view.md) |✔ |✔ |Any (browser based) |
| [Beeline client](../hadoop/apache-hadoop-use-hive-beeline.md) |✔ |✔ |Linux, Unix, Mac OS X, or Windows |
| [REST API](../hadoop/apache-hadoop-use-hive-curl.md) |&nbsp; |✔ |Linux, Unix, Mac OS X, or Windows |
| [Windows PowerShell](../hadoop/apache-hadoop-use-hive-powershell.md) |&nbsp; |✔ |Windows |


## HiveQL language reference

HiveQL language reference is available in the [language manual](https://cwiki.apache.org/confluence/display/Hive/LanguageManual).

## Hive and data structure

Hive understands how to work with structured and semi-structured data. For example, text files where the fields are delimited by specific characters. The following HiveQL statement creates a table over space-delimited data:

```hiveql
CREATE EXTERNAL TABLE log4jLogs (
    t1 string,
    t2 string,
    t3 string,
    t4 string,
    t5 string,
    t6 string,
    t7 string)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
STORED AS TEXTFILE LOCATION '/example/data/';
```

Hive also supports custom **serializer/deserializers (SerDe)** for complex or irregularly structured data. For more information, see the [How to use a custom JSON SerDe with HDInsight](https://web.archive.org/web/20190217104719/https://blogs.msdn.microsoft.com/bigdatasupport/2014/06/18/how-to-use-a-custom-json-serde-with-microsoft-azure-hdinsight/) document.

For more information on file formats supported by Hive, see the [Language manual (https://cwiki.apache.org/confluence/display/Hive/LanguageManual)](https://cwiki.apache.org/confluence/display/Hive/LanguageManual)

### Hive internal tables vs external tables

There are two types of tables that you can create with Hive:

* __Internal__: Data is stored in the Hive data warehouse. The data warehouse is located at `/hive/warehouse/` on the default storage for the cluster.

    Use internal tables when one of the following conditions apply:

    * Data is temporary.
    * You want Hive to manage the lifecycle of the table and data.

* __External__: Data is stored outside the data warehouse. The data can be stored on any storage accessible by the cluster.

    Use external tables when one of the following conditions apply:

    * The data is also used outside of Hive. For example, the data files are updated by another process (that does not lock the files.)
    * Data needs to remain in the underlying location, even after dropping the table.
    * You need a custom location, such as a non-default storage account.
    * A program other than hive manages the data format, location, etc.

For more information, see the [Hive Internal and External Tables Intro](https://blogs.msdn.microsoft.com/cindygross/2013/02/05/hdinsight-hive-internal-and-external-tables-intro/) blog post.

## User-defined functions (UDF)

Hive can also be extended through **user-defined functions (UDF)**. A UDF allows you to implement functionality or logic that isn't easily modeled in HiveQL. For an example of using UDFs with Hive, see the following documents:

* [Use a Java user-defined function with Apache Hive](../hadoop/apache-hadoop-hive-java-udf.md)

* [Use a Python user-defined function with Apache Hive](../hadoop/python-udf-hdinsight.md)

* [Use a C# user-defined function with Apache Hive](../hadoop/apache-hadoop-hive-pig-udf-dotnet-csharp.md)

* [How to add a custom Apache Hive user-defined function to HDInsight](https://blogs.msdn.com/b/bigdatasupport/archive/2014/01/14/how-to-add-custom-hive-udfs-to-hdinsight.aspx)

* [An example Apache Hive user-defined function to convert date/time formats to Hive timestamp](https://github.com/Azure-Samples/hdinsight-java-hive-udf)

## <a id="data"></a>Example data

Hive on HDInsight comes pre-loaded with an internal table named `hivesampletable`. HDInsight also provides example data sets that can be used with Hive. These data sets are stored in the `/example/data` and `/HdiSamples` directories. These directories exist in the default storage for your cluster.

## <a id="job"></a>Example Hive query

The following HiveQL statements project columns onto the `/example/data/sample.log` file:

```hiveql
DROP TABLE log4jLogs;
CREATE EXTERNAL TABLE log4jLogs (
    t1 string,
    t2 string,
    t3 string,
    t4 string,
    t5 string,
    t6 string,
    t7 string)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
STORED AS TEXTFILE LOCATION '/example/data/';
SELECT t4 AS sev, COUNT(*) AS count FROM log4jLogs 
    WHERE t4 = '[ERROR]' AND INPUT__FILE__NAME LIKE '%.log' 
    GROUP BY t4;
```

In the previous example, the HiveQL statements perform the following actions:


* `DROP TABLE`: If the table already exists, delete it.

* `CREATE EXTERNAL TABLE`: Creates a new **external** table in Hive. External tables only store the table definition in Hive. The data is left in the original location and in the original format.

* `ROW FORMAT`: Tells Hive how the data is formatted. In this case, the fields in each log are separated by a space.

* `STORED AS TEXTFILE LOCATION`: Tells Hive where the data is stored (the `example/data` directory) and that it is stored as text. The data can be in one file or spread across multiple files within the directory.

* `SELECT`: Selects a count of all rows where the column **t4** contains the value **[ERROR]**. This statement returns a value of **3** because there are three rows that contain this value.

* `INPUT__FILE__NAME LIKE '%.log'` - Hive attempts to apply the schema to all files in the directory. In this case, the directory contains files that do not match the schema. To prevent garbage data in the results, this statement tells Hive that we should only return data from files ending in .log.

> [!NOTE]  
> External tables should be used when you expect the underlying data to be updated by an external source. For example, an automated data upload process, or MapReduce operation.
>
> Dropping an external table does **not** delete the data, it only deletes the table definition.

To create an **internal** table instead of external, use the following HiveQL:

```hiveql
CREATE TABLE IF NOT EXISTS errorLogs (
    t1 string,
    t2 string,
    t3 string,
    t4 string,
    t5 string,
    t6 string,
    t7 string)
STORED AS ORC;
INSERT OVERWRITE TABLE errorLogs
SELECT t1, t2, t3, t4, t5, t6, t7 
    FROM log4jLogs WHERE t4 = '[ERROR]';
```

These statements perform the following actions:

* `CREATE TABLE IF NOT EXISTS`: If the table does not exist, create it. Because the **EXTERNAL** keyword is not used, this statement creates an internal table. The table is stored in the Hive data warehouse and is managed completely by Hive.

* `STORED AS ORC`: Stores the data in Optimized Row Columnar (ORC) format. ORC is a highly optimized and efficient format for storing Hive data.

* `INSERT OVERWRITE ... SELECT`: Selects rows from the **log4jLogs** table that contains **[ERROR]**, and then inserts the data into the **errorLogs** table.

> [!NOTE]  
> Unlike external tables, dropping an internal table also deletes the underlying data.

## Improve Hive query performance

### <a id="usetez"></a>Apache Tez

[Apache Tez](https://tez.apache.org) is a framework that allows data intensive applications, such as Hive, to run much more efficiently at scale. Tez is enabled by default.  The [Apache Hive on Tez design documents](https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez) contains details about the implementation choices and tuning configurations.

### Low Latency Analytical Processing (LLAP)

[LLAP](https://cwiki.apache.org/confluence/display/Hive/LLAP) (sometimes known as Live Long and Process) is a new feature in Hive 2.0 that allows in-memory caching of queries. LLAP makes Hive queries much faster, up to [26x faster than Hive 1.x in some cases](https://hortonworks.com/blog/announcing-apache-hive-2-1-25x-faster-queries-much/).

HDInsight provides LLAP in the Interactive Query cluster type. For more information, see the [Start with Interactive Query](../interactive-query/apache-interactive-query-get-started.md) document.

## Scheduling Hive queries

There are several services that can be used to run Hive queries as part of a scheduled or on-demand workflow.

### Azure Data Factory

Azure Data Factory allows you to use HDInsight as part of a Data Factory pipeline. For more information on using Hive from a pipeline, see the [Transform data using Hive activity in Azure Data Factory](../../data-factory/transform-data-using-hadoop-hive.md) document.

### Hive jobs and SQL Server Integration Services

You can use SQL Server Integration Services (SSIS) to run a Hive job. The Azure Feature Pack for SSIS provides the following components that work with Hive jobs on HDInsight.

* [Azure HDInsight Hive Task](https://docs.microsoft.com/sql/integration-services/control-flow/azure-hdinsight-hive-task)

* [Azure Subscription Connection Manager](https://docs.microsoft.com/sql/integration-services/connection-manager/azure-subscription-connection-manager)

For more information, see the [Azure Feature Pack](https://docs.microsoft.com/sql/integration-services/azure-feature-pack-for-integration-services-ssis) documentation.

### Apache Oozie

Apache Oozie is a workflow and coordination system that manages Hadoop jobs. For more information on using Oozie with Hive, see the [Use Apache Oozie to define and run a workflow](../hdinsight-use-oozie-linux-mac.md) document.

## Next steps

Now that you've learned what Hive is and how to use it with Hadoop in HDInsight, use the following links to explore other ways to work with Azure HDInsight.

* [Upload data to HDInsight](../hdinsight-upload-data.md)
* [Use Python User Defined Functions (UDF) with Apache Hive and Apache Pig in HDInsight](./python-udf-hdinsight.md)
* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)
