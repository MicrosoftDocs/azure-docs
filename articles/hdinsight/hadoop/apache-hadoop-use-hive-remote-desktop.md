---
title: Use Hadoop Hive and Remote Desktop in HDInsight - Azure 
description: Learn how to connect to Hadoop cluster in HDInsight by using Remote Desktop, and then run Hive queries by using the Hive Command-Line Interface.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.topic: conceptual
ms.date: 01/12/2017
ms.author: jasonh
ROBOTS: NOINDEX

---
# Use Hive with Hadoop on HDInsight with Remote Desktop
[!INCLUDE [hive-selector](../../../includes/hdinsight-selector-use-hive.md)]

In this article, you will learn how to connect to an HDInsight cluster by using Remote Desktop, and then run Hive queries by using the Hive Command-Line Interface (CLI).

> [!IMPORTANT]
> Remote Desktop is only available on HDInsight clusters that use Windows as the operating system. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).
>
> For HDInsight 3.4 or greater, see [Use Hive with HDInsight and Beeline](apache-hadoop-use-hive-beeline.md) for information on running Hive queries directly on the cluster from a command-line.

## <a id="prereq"></a>Prerequisites
To complete the steps in this article, you will need the following:

* A Windows-based HDInsight (Hadoop on HDInsight) cluster
* A client computer running Windows 10, Window 8, or Windows 7

## <a id="connect"></a>Connect with Remote Desktop
Enable Remote Desktop for the HDInsight cluster, then connect to it by following the instructions at [Connect to HDInsight clusters using RDP](../hdinsight-administer-use-management-portal.md#connect-to-clusters-using-rdp).

## <a id="hive"></a>Use the Hive command
When you have connected to the desktop for the HDInsight cluster, use the following steps to work with Hive:

1. From the HDInsight desktop, start the **Hadoop Command Line**.
2. Enter the following command to start the Hive CLI:

        %hive_home%\bin\hive

    When the CLI has started, you will see the Hive CLI prompt: `hive>`.
3. Using the CLI, enter the following statements to create a new table named **log4jLogs** using sample data:

        set hive.execution.engine=tez;
        DROP TABLE log4jLogs;
        CREATE EXTERNAL TABLE log4jLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
        ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
        STORED AS TEXTFILE LOCATION 'wasb:///example/data/';
        SELECT t4 AS sev, COUNT(*) AS count FROM log4jLogs WHERE t4 = '[ERROR]' AND INPUT__FILE__NAME LIKE '%.log' GROUP BY t4;

    These statements perform the following actions:

   * **DROP TABLE**: Deletes the table and the data file if the table already exists.
   * **CREATE EXTERNAL TABLE**: Creates a new 'external' table in Hive. External tables store only the table definition in Hive (the data is left in the original location).

     > [!NOTE]
     > External tables should be used when you expect the underlying data to be updated by an external source (such as an automated data upload process) or by another MapReduce operation, but you always want Hive queries to use the latest data.
     >
     > Dropping an external table does **not** delete the data, only the table definition.
     >
     >
   * **ROW FORMAT**: Tells Hive how the data is formatted. In this case, the fields in each log are separated by a space.
   * **STORED AS TEXTFILE LOCATION**: Tells Hive where the data is stored (the example/data directory) and that it is stored as text.
   * **SELECT**: Selects a count of all rows where column **t4** contains the value **[ERROR]**. This should return a value of **3** because there are three rows that contain this value.
   * **INPUT__FILE__NAME LIKE '%.log'** - Tells Hive that we should only return data from files ending in .log. This restricts the search to the sample.log file that contains the data, and keeps it from returning data from other example data files that do not match the schema we defined.
4. Use the following statements to create a new 'internal' table named **errorLogs**:

        CREATE TABLE IF NOT EXISTS errorLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) STORED AS ORC;
        INSERT OVERWRITE TABLE errorLogs SELECT t1, t2, t3, t4, t5, t6, t7 FROM log4jLogs WHERE t4 = '[ERROR]' AND INPUT__FILE__NAME LIKE '%.log';

    These statements perform the following actions:

   * **CREATE TABLE IF NOT EXISTS**: Creates a table if it does not already exist. Because the **EXTERNAL** keyword is not used, this is an internal table, which is stored in the Hive data warehouse and is managed completely by Hive.

     > [!NOTE]
     > Unlike **EXTERNAL** tables, dropping an internal table also deletes the underlying data.
     >
     >
   * **STORED AS ORC**: Stores the data in optimized row columnar (ORC) format. This is a highly optimized and efficient format for storing Hive data.
   * **INSERT OVERWRITE ... SELECT**: Selects rows from the **log4jLogs** table that contain **[ERROR]**, then inserts the data into the **errorLogs** table.

     To verify that only rows that contain **[ERROR]** in column t4 were stored to the **errorLogs** table, use the following statement to return all the rows from **errorLogs**:

       SELECT * from errorLogs;

     Three rows of data should be returned, all containing **[ERROR]** in column t4.

## <a id="summary"></a>Summary
As you can see, the Hive command provides an easy way to interactively run Hive queries on an HDInsight cluster, monitor the job status, and retrieve the output.

## <a id="nextsteps"></a>Next steps
For general information about Hive in HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

If you are using Tez with Hive, see the following documents for debugging information:

* [Use the Tez UI on Windows-based HDInsight](../hdinsight-debug-tez-ui.md)
* [Use the Ambari Tez view on Linux-based HDInsight](../hdinsight-debug-ambari-tez-view.md)

[1]:apache-hadoop-visual-studio-tools-get-started.md

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/library/dn479185.aspx

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[apache-tez]: http://tez.apache.org
[apache-hive]: http://hive.apache.org/
[apache-log4j]: http://en.wikipedia.org/wiki/Log4j
[hive-on-tez-wiki]: https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez
[import-to-excel]: http://azure.microsoft.com/documentation/articles/hdinsight-connect-excel-power-query/


[hdinsight-use-oozie]: hdinsight-use-oozie.md
[hdinsight-analyze-flight-data]: hdinsight-analyze-flight-delay-data.md





[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-submit-jobs]:submit-apache-hadoop-jobs-programmatically.md
[hdinsight-upload-data]: hdinsight-upload-data.md


[Powershell-install-configure]: /powershell/azureps-cmdlets-docs
[powershell-here-strings]: http://technet.microsoft.com/library/ee692792.aspx
