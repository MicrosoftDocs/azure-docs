---
title: Use Ambari Views to work with Hive on HDInsight (Hadoop) - Azure | Microsoft Docs
description: Learn how to use the Hive View from your web browser to submit Hive queries. The Hive View is part of the Ambari Web UI provided with your Linux-based HDInsight cluster.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 1abe9104-f4b2-41b9-9161-abbc43de8294
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 07/31/2017
ms.author: larryfr

---
# Use the Hive View with Hadoop in HDInsight

[!INCLUDE [hive-selector](../../includes/hdinsight-selector-use-hive.md)]

Learn how to run Hive queries using Ambari Hive View. Ambari is a management and monitoring utility provided with Linux-based HDInsight clusters. One of the features provided through Ambari is a Web UI that can be used to run Hive queries.

> [!NOTE]
> Ambari has many capabilities that are not discussed in this document. For more information, see [Manage HDInsight clusters by using the Ambari Web UI](hdinsight-hadoop-manage-ambari.md).

## Prerequisites

* A Linux-based HDInsight cluster. For information on creating cluster, see [Get started with Linux-based HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md).

> [!IMPORTANT]
> The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement).

## Open the Hive view

You can Ambari Views from the Azure portal; select your HDInsight cluster and then select **Ambari Views** from the **Quick Links** section.

![quick links section of the portal](./media/hdinsight-hadoop-use-hive-ambari-view/quicklinks.png)

From the list of views, select the __Hive View__.

![The Hive view selected](./media/hdinsight-hadoop-use-hive-ambari-view/select-hive-view.png)

> [!NOTE]
> When accessing Ambari, you are prompted to authenticate to the site. Enter the admin (default `admin`) account name and password you used when creating the cluster.

You should see a page similar to the following image:

![Image of the query worksheet for the Hive view](./media/hdinsight-hadoop-use-hive-ambari-view/ambari-hive-view.png)

## <a name="hivequery"></a>Run a query

To run a hive query, use the following steps from the Hive view.

1. From the __Query__ tab, paste the following HiveQL statements into the worksheet:

    ```hiveql
    DROP TABLE log4jLogs;
    CREATE EXTERNAL TABLE log4jLogs(t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
    STORED AS TEXTFILE LOCATION '/example/data/';
    SELECT t4 AS sev, COUNT(*) AS cnt FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;
    ```

    These statements perform the following actions:

   * `DROP TABLE` - Deletes the table and the data file, in case the table already exists.

   * `CREATE EXTERNAL TABLE` - Creates a new "external" table in Hive.
   External tables store only the table definition in Hive. The data is left in the original location.

   * `ROW FORMAT` - How the data is formatted. In this case, the fields in each log are separated by a space.

   * `STORED AS TEXTFILE LOCATION` - Where the data is stored, and that it is stored as text.

   * `SELECT` - Selects a count of all rows where column t4 contains the value [ERROR].

     > [!NOTE]
     > External tables should be used when you expect the underlying data to be updated by an external source. For example, an automated data upload process, or by another MapReduce operation. Dropping an external table does *not* delete the data, only the table definition.

    > [!IMPORTANT]
    > Leave the __Database__ selection at __default__. The examples in this document use the default database included with HDInsight.

2. To start the query, use the **Execute** button below the worksheet. It turns orange and the text changes to **Stop**.

3. Once the query has finished, The **Results** tab displays the results of the operation. The following text is the result of the query:

        sev       cnt
        [ERROR]   3

    The **Logs** tab can be used to view the logging information created by the job.

   > [!TIP]
   > The **Save results** drop-down dialog in the upper left of the **Query Process Results** section allows you to download or save results.

4. Select the first four lines of this query, then select **Execute**. Notice that there are no results when the job completes. Using the **Execute** button when part of the query is selected only runs the selected statements. In this case, the selection didn't include the final statement that retrieves rows from the table. If you select just that line and use **Execute**, you should see the expected results.

5. To add a worksheet, use the **New Worksheet** button at the bottom of the **Query Editor**. In the new worksheet, enter the following HiveQL statements:

    ```hiveql
    CREATE TABLE IF NOT EXISTS errorLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) STORED AS ORC;
    INSERT OVERWRITE TABLE errorLogs SELECT t1, t2, t3, t4, t5, t6, t7 FROM log4jLogs WHERE t4 = '[ERROR]';
    ```

  These statements perform the following actions:

   * **CREATE TABLE IF NOT EXISTS** - Creates a table, if it does not already exist. Since the **EXTERNAL** keyword is not used, an internal table is created. An internal table is stored in the Hive data warehouse and is managed completely by Hive. Unlike external tables, dropping an internal table deletes the underlying data as well.

   * **STORED AS ORC** - Stores the data in Optimized Row Columnar (ORC) format. ORC is a highly optimized and efficient format for storing Hive data.

   * **INSERT OVERWRITE ... SELECT** - Selects rows from the **log4jLogs** table that contain `[ERROR]`, and then inserts the data into the **errorLogs** table.

     Use the **Execute** button to run this query. The **Results** tab does not contain any information when the query returns zero rows. The status should show as **SUCCEEDED** once the query completes.

### Visual explain

To display a visualization of the query plan, select the **Visual Explain** tab below the worksheet.

The **Visual Explain** view of the query can be helpful in understanding the flow of complex queries. You can view a textual equivalent of this view by using the **Explain** button in the Query Editor.

### Tez UI

To display the Tez UI for the query, select the **Tez** tab below the worksheet.

> [!IMPORTANT]
> Tez is not used to resolve all queries. Many queries can be resolved without using Tez. 

If Tez was used to resolve the query, the Directed Acyclic Graph (DAG) is displayed. If you want to view the DAG for queries you've ran in the past, or debug the Tez process, use the [Tez View](hdinsight-debug-ambari-tez-view.md) instead.

## View job history

The __Jobs__ tab displays a history of Hive queries.

![Image of the job history](./media/hdinsight-hadoop-use-hive-ambari-view/job-history.png)

## Database tables

You can use the __Tables__ tab to work with tables within a Hive database.

![Image of the tables tab](./media/hdinsight-hadoop-use-hive-ambari-view/tables.png)

## Saved queries

From the Query tab, you can optionally save queries. Once saved, you can reuse the query from the __Saved Queries__ tab.

![Image of saved queries tab](./media/hdinsight-hadoop-use-hive-ambari-view/saved-queries.png)

## User-defined functions

Hive can also be extended through user-defined functions (UDF). A UDF allows you to implement functionality or logic that isn't easily modeled in HiveQL.

The UDF tab at the top of the Hive View allows you to declare and save a set of UDFs. These UDFs can be used with the **Query Editor**.

![Image of UDF tab](./media/hdinsight-hadoop-use-hive-ambari-view/user-defined-functions.png)

Once you have added a UDF to the Hive View, an **Insert udfs** button appears at the bottom of the **Query Editor**. Selecting this entry displays a drop-down list of the UDFs defined in the Hive View. Selecting a UDF adds HiveQL statements to your query to enable the UDF.

For example, if you have defined a UDF with the following properties:

* Resource name: myudfs

* Resource path: /myudfs.jar

* UDF name: myawesomeudf

* UDF class name: com.myudfs.Awesome

Using the **Insert udfs** button displays an entry named **myudfs**, with another drop-down for each UDF defined for that resource. In this case, **myawesomeudf**. Selecting this entry adds the following to the beginning of the query:

```hiveql
add jar /myudfs.jar;
create temporary function myawesomeudf as 'com.myudfs.Awesome';
```

You can then use the UDF in your query. For example, `SELECT myawesomeudf(name) FROM people;`.

For more information on using UDFs with Hive on HDInsight, see the following documents:

* [Using Python with Hive and Pig in HDInsight](hdinsight-python.md)
* [How to add a custom Hive UDF to HDInsight](http://blogs.msdn.com/b/bigdatasupport/archive/2014/01/14/how-to-add-custom-hive-udfs-to-hdinsight.aspx)

## Hive settings

Settings can be used to change various Hive settings. For example, changing the execution engine for Hive from Tez (the default) to MapReduce.

## <a id="nextsteps"></a>Next steps

For general information on Hive in HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

For information on other ways you can work with Hadoop on HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)
