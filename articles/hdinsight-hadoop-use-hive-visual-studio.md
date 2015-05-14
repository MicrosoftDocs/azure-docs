<properties
   pageTitle="Hive query with Hadoop tools for Visual Studio | Microsoft Azure"
   description="Learn how to use Hive with HDInsight through Visual Studio."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="04/03/2015"
   ms.author="larryfr"/>

#Run Hive queries using the HDInsight tools for Visual Studio

[AZURE.INCLUDE [hive-selector](../includes/hdinsight-selector-use-hive.md)]

In this article, you will learn how to submit Hive queries to an HDInsight cluster using the HDInsight tools for Visual Studio.

> [AZURE.NOTE] This document does not provide a detailed description of what the HiveQL statements used in the examples do. For information about the HiveQL that is used in this example, see <a href="hdinsight-use-hive.md" target="_blank">Use Hive with Hadoop on HDInsight</a>.

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following.

* An Azure HDInsight (Hadoop on HDInsight) cluster (Linux or Windows-based)

* Visual Studio 2012 <a href="http://www.microsoft.com/download/details.aspx?id=39305" target="_blank">Update 4</a>, Visual Studio 2013 <a href="http://go.microsoft.com/fwlink/?LinkId=390465" target="_blank">Update 3</a>, or <a href="http://www.microsoft.com/download/details.aspx?id=40769" target="_blank">Visual Studio Express 2013</a>

##<a id="run"></a> Run Hive queries using the HDInsight tools for Visual Studio

1. Open **Visual Studio** and select **New** > **Project** > **HDInsight** > **Hive Application**. Provide a name for this project.

2. Open the **Script.hql** file that is created with this project, and paste in the following HiveQL statements:

        DROP TABLE log4jLogs;
        CREATE EXTERNAL TABLE log4jLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
        ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
        STORED AS TEXTFILE LOCATION 'wasb:///example/data/';
        SELECT t4 AS sev, COUNT(*) AS count FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;

    These statements perform the following actions:

    * **DROP TABLE**: Deletes the table and the data file if the table already exists.
    * **CREATE EXTERNAL TABLE**: Creates a new 'external' table in Hive. External tables only store the table definition in Hive (the data is left in the original location).

        > [AZURE.NOTE] External tables should be used when you expect the underlying data to be updated by an external source (such as an automated data upload process) or by another MapReduce operation, but you always want Hive queries to use the latest data.
        >
        > Dropping an external table does **not** delete the data, only the table definition.

    * **ROW FORMAT**: Tells Hive how the data is formatted. In this case, the fields in each log are separated by a space.
    * **STORED AS TEXTFILE LOCATION**: Tells Hive where the data is stored (the example/data directory) and that it is stored as text.
    * **SELECT**: Select a count of all rows where column **t4** contain the value **[ERROR]**. This should return a value of **3** because there are three rows that contain this value.

3. From the toolbar, select the **HDInsight Cluster** that you want to use for this query, and then select **Submit** to run the statements as a Hive job. The **Hive Job Summary** appears and displays information about the running job. Use the **Refresh** link to refresh the job information, until the **Job Status** changes to **Completed**.

4. Use the **Job Output** link to view the output of this job. It should display `[ERROR] 3`, which is the value returned by the SELECT statement.

5. You can also run Hive queries without creating a project. Using **Server Explorer**, expand **Azure** > **HDInsight**, right-click your HDInsight server, and then select **Write a Hive Query**.

6. In the **temp.hql** document that appears, add the following HiveQL statements:

        CREATE TABLE IF NOT EXISTS errorLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) STORED AS ORC;
        INSERT OVERWRITE TABLE errorLogs SELECT t1, t2, t3, t4, t5, t6, t7 FROM log4jLogs WHERE t4 = '[ERROR]';

    These statements perform the following actions:

    * **CREATE TABLE IF NOT EXISTS**: Creates a table if it does not already exist. Because the **EXTERNAL** keyword is not used, this is an internal table, which is stored in the Hive data warehouse and is managed completely by Hive.

        > [AZURE.NOTE] Unlike **EXTERNAL** tables, dropping an internal table also deletes the underlying data.

    * **STORED AS ORC**: Stores the data in optimized row columnar (ORC) format. This is a highly optimized and efficient format for storing Hive data.
    * **INSERT OVERWRITE ... SELECT**: Selects rows from the **log4jLogs** table that contain **[ERROR]**, then inserts the data into the **errorLogs** table.

7. From the toolbar, select **Submit** to run the job. Use the **Job Status** to determine that the job has completed successfully.

8. To verify that the job completed and created a new table, use **Server Explorer** and expand **Azure** > **HDInsight** > your HDInsight cluster > **Hive Databases** > and **default**. You should see the **errorLogs** table and the **log4jLogs** table.

##<a id="summary"></a>Summary

As you can see, the the HDInsight tools for Visual Studio provide an easy way to run Hive queries on an HDInsight cluster, monitor the job status, and retrieve the output.

##<a id="nextsteps"></a>Next steps

For general information about Hive in HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

For more information about the HDInsight tools for Visual Studio:

* [Getting started with HDInsight tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md)


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



[hdinsight-storage]: hdinsight-use-blob-storage.md

[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-get-started]: hdinsight-get-started.md

[Powershell-install-configure]: install-configure-powershell.md
[powershell-here-strings]: http://technet.microsoft.com/library/ee692792.aspx

[image-hdi-hive-powershell]: ./media/hdinsight-use-hive/HDI.HIVE.PowerShell.png
[img-hdi-hive-powershell-output]: ./media/hdinsight-use-hive/HDI.Hive.PowerShell.Output.png
[image-hdi-hive-architecture]: ./media/hdinsight-use-hive/HDI.Hive.Architecture.png
