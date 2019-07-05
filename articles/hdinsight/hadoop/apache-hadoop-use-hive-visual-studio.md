---
title: Apache Hive with Data Lake (Apache Hadoop) tools for Visual Studio - Azure HDInsight 
description: Learn how to use the Data Lake tools for Visual Studio to run Apache Hive queries with Apache Hadoop on Azure HDInsight.
author: hrasheed-msft
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/14/2019
ms.author: hrasheed
---

# Run Apache Hive queries using the Data Lake tools for Visual Studio

Learn how to use the Data Lake tools for Visual Studio to query Apache Hive. The Data Lake tools allow you to easily create, submit, and monitor Hive queries to Apache Hadoop on Azure HDInsight.

## <a id="prereq"></a>Prerequisites

* An Apache Hadoop cluster on HDInsight. See [Get Started with HDInsight on Linux](./apache-hadoop-linux-tutorial-get-started.md).

* Visual Studio (one of the following versions):

    * Visual Studio 2015, 2017 (any edition)
    * Visual Studio 2013 Community/Professional/Premium/Ultimate with Update 4

* HDInsight tools for Visual Studio or Azure Data Lake tools for Visual Studio. See [Get started using Visual Studio Hadoop tools for HDInsight](apache-hadoop-visual-studio-tools-get-started.md) for information on installing and configuring the tools.

## <a id="run"></a> Run Apache Hive queries using the Visual Studio

You have two options for creating and running Hive queries:

* Create ad hoc queries
* Create a Hive application

### Ad hoc

Ad hoc queries can be executed in either **Batch** or **Interactive** mode.

1. Open **Visual Studio**.

2. From **Server Explorer**, navigate to **Azure** > **HDInsight**.

3. Expand **HDInsight**, and right-click the cluster where you want to run the query, and then select **Write a Hive Query**.

4. Enter the following hive query:

    ```hql
    SELECT * FROM hivesampletable;
    ```

5. Select **Execute**. Note that the execution mode is defaulted to **Interactive**.

    ![Screenshot of Execute Interactive Hive queries](./media/apache-hadoop-use-hive-visual-studio/vs-execute-hive-query.png)

6. To run the same query in **Batch** mode, toggle the drop-down list from **Interactive** to **Batch**. Note that the execution button changes from **Execute** to **Submit**.

    ![Screenshot of submit a hive query](./media/apache-hadoop-use-hive-visual-studio/vs-batch-query.png)

    The Hive editor supports IntelliSense. Data Lake Tools for Visual Studio supports loading remote metadata when you edit your Hive script. For example, if you type `SELECT * FROM`, IntelliSense lists all the suggested table names. When a table name is specified, IntelliSense lists the column names. The tools support most Hive DML statements, subqueries, and built-in UDFs. IntelliSense suggests only the metadata of the cluster that is selected in the HDInsight toolbar.

    ![Screenshot of an HDInsight Visual Studio Tools IntelliSense example 1](./media/apache-hadoop-use-hive-visual-studio/vs-intellisense-table-name.png "U-SQL IntelliSense")
   
    ![Screenshot of an HDInsight Visual Studio Tools IntelliSense example 2](./media/apache-hadoop-use-hive-visual-studio/vs-intellisense-column-name.png "U-SQL IntelliSense")

7. Select **Submit** or **Submit (Advanced)**.

   If you select the advanced submit option, configure **Job Name**, **Arguments**, **Additional Configurations**, and **Status Directory** for the script:

    ![Screenshot of an HDInsight Hadoop Hive query](./media/apache-hadoop-use-hive-visual-studio/hdinsight.visual.studio.tools.submit.jobs.advanced.png "Submit queries")

### Hive application

1. Open **Visual Studio**.

2. From the menu bar, navigate to **File** > **New** > **Project**.

3. From the **New Project** window, navigate to **Templates** > **Azure Data Lake** > **HIVE (HDInsight)** > **Hive Application**. 

4. Provide a name for this project and then select **OK**.

5. Open the **Script.hql** file that is created with this project, and paste in the following HiveQL statements:

    ```hiveql
    set hive.execution.engine=tez;
    DROP TABLE log4jLogs;
    CREATE EXTERNAL TABLE log4jLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
    STORED AS TEXTFILE LOCATION '/example/data/';
    SELECT t4 AS sev, COUNT(*) AS count FROM log4jLogs WHERE t4 = '[ERROR]' AND  INPUT__FILE__NAME LIKE '%.log' GROUP BY t4;
    ```

    These statements perform the following actions:

   * `DROP TABLE`: If the table exists, this statement deletes it.

   * `CREATE EXTERNAL TABLE`: Creates a new 'external' table in Hive. External tables only store the table definition in Hive (the data is left in the original location).

     > [!NOTE]  
     > External tables should be used when you expect the underlying data to be updated by an external source. For example, a MapReduce job or Azure service.
     >
     > Dropping an external table does **not** delete the data, only the table definition.

   * `ROW FORMAT`: Tells Hive how the data is formatted. In this case, the fields in each log are separated by a space.

   * `STORED AS TEXTFILE LOCATION`: Tells Hive that the data is stored in the example/data directory, and that it is stored as text.

   * `SELECT`: Select a count of all rows where column `t4` contains the value `[ERROR]`. This statement returns a value of `3` because there are three rows that contain this value.

   * `INPUT__FILE__NAME LIKE '%.log'` - Tells Hive that we should only return data from files ending in .log. This clause restricts the search to the sample.log file that contains the data.

6. From the toolbar, select the **HDInsight Cluster** that you want to use for this query. Select **Submit** to run the statements as a Hive job.

   ![Submit bar](./media/apache-hadoop-use-hive-visual-studio/toolbar.png)

7. The **Hive Job Summary** appears and displays information about the running job. Use the **Refresh** link to refresh the job information, until the **Job Status** changes to **Completed**.

   ![job summary displaying a completed job](./media/apache-hadoop-use-hive-visual-studio/jobsummary.png)

8. Use the **Job Output** link to view the output of this job. It displays `[ERROR] 3`, which is the value returned by this query.

### Additional example

This example relies on the `log4jLogs` table created in the prior step.

1. From **Server Explorer**, right-click your cluster and select **Write a Hive Query**.

2. Enter the following hive query:

    ```hql
    set hive.execution.engine=tez;
    CREATE TABLE IF NOT EXISTS errorLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) STORED AS ORC;
    INSERT OVERWRITE TABLE errorLogs SELECT t1, t2, t3, t4, t5, t6, t7 FROM log4jLogs WHERE t4 = '[ERROR]' AND INPUT__FILE__NAME LIKE '%.log';
    ```

    These statements perform the following actions:

    * `CREATE TABLE IF NOT EXISTS`: Creates a table if it does not already exist. Because the `EXTERNAL` keyword is not used, this statement creates an internal table. Internal tables are stored in the Hive data warehouse and are managed by Hive.
    
    > [!NOTE]  
    > Unlike `EXTERNAL` tables, dropping an internal table also deletes the underlying data.

    * `STORED AS ORC`: Stores the data in optimized row columnar (ORC) format. ORC is a highly optimized and efficient format for storing Hive data.
    
    * `INSERT OVERWRITE ... SELECT`: Selects rows from the `log4jLogs` table that contain `[ERROR]`, then inserts the data into the `errorLogs` table.

3. Execute the query in **Batch** mode.

4. To verify that the job created the table, use **Server Explorer** and expand **Azure** > **HDInsight** > your HDInsight cluster > **Hive Databases** > **default**. The **errorLogs** table and the **log4jLogs** table are listed.

## <a id="nextsteps"></a>Next steps

As you can see, the HDInsight tools for Visual Studio provide an easy way to work with Hive queries on HDInsight.

For general information about Hive in HDInsight:

* [Use Apache Hive with Apache Hadoop on HDInsight](hdinsight-use-hive.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Apache Pig with Apache Hadoop on HDInsight](hdinsight-use-pig.md)

* [Use MapReduce with Apache Hadoop on HDInsight](hdinsight-use-mapreduce.md)

For more information about the HDInsight tools for Visual Studio:

* [Getting started with HDInsight tools for Visual Studio](apache-hadoop-visual-studio-tools-get-started.md)