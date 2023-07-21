---
title: Use Apache Beeline with Apache Hive - Azure HDInsight 
description: Learn how to use the Beeline client to run Hive queries with Hadoop on HDInsight. Beeline is a utility for working with HiveServer2 over JDBC.
ms.service: hdinsight
ms.topic: how-to
ms.date: 04/24/2023
ms.custom: contperf-fy21q1, contperf-fy21q2
---
# Use the Apache Beeline client with Apache Hive

This article describes how to use the command-line [Apache Beeline](https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Clients#HiveServer2Clients-Beeline–NewCommandLineShell) client to create and execute Apache Hive queries over an SSH connection.

## Background

Beeline is a Hive client that is included on the head nodes of your HDInsight cluster. This article describes how to use this tool through examples using [a Hive query](#run-a-hive-query) and [a HiveQL file](#run-a-hive-query).

To connect to the Beeline client installed on your HDInsight cluster, or install Beeline locally, follow our [guide to connect with, or install Apache Beeline](connect-install-beeline.md). 

Beeline uses JDBC to connect to HiveServer2, a service hosted on your HDInsight cluster. You can also use Beeline to access Hive on HDInsight remotely over the internet. The following examples provide the most common connection strings used to connect to HDInsight from Beeline.

## Prerequisites for examples

* A Hadoop cluster on Azure HDInsight. If you need a cluster, follow our [guide to create an HDInsight cluster](../hdinsight-hadoop-create-linux-clusters-portal.md).

* Notice the URI scheme for your cluster's primary storage. For example,  `wasb://` for Azure Storage, `abfs://` for Azure Data Lake Storage Gen2, or `adl://` for Azure Data Lake Storage Gen1. If secure transfer is enabled for Azure Storage, the URI is `wasbs://`. For more information, see [secure transfer](../../storage/common/storage-require-secure-transfer.md).

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md). Most of the steps in this document assume that you're using Beeline from an SSH session to the cluster. You can also use a local Beeline client, but those steps are not covered in this article.

## Run a Hive query

This example is based on using the Beeline client from [an SSH connection](../hdinsight-hadoop-linux-use-ssh-unix.md).

1. Open an SSH connection to the cluster with the code below. Replace `sshuser` with the SSH user for your cluster, and replace `CLUSTERNAME` with the name of your cluster. When prompted, enter the password for the SSH user account.

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

2. Connect to HiveServer2 with your Beeline client from your open SSH session by entering the following command:

    ```bash
    beeline -u 'jdbc:hive2://headnodehost:10001/;transportMode=http'
    ```
   > [!NOTE]  
   > Refer to "To HDInsight Enterprise Security Package (ESP) cluster using Kerberos" part in [Connect to HiveServer2 using Beeline or install Beeline locally to connect from your local](connect-install-beeline.md#to-hdinsight-enterprise-security-package-esp-cluster-using-kerberos) if you are using an Enterprise Security Package (ESP) enabled cluster
 
3. Beeline commands begin with a `!` character, for example `!help` displays help. However the `!` can be omitted for some commands. For example, `help` also works.

    There's `!sql`, which is used to execute HiveQL statements. However, HiveQL is so commonly used that you can omit the preceding `!sql`. The following two statements are equivalent:

    ```hiveql
    !sql show tables;
    show tables;
    ```

    On a new cluster, only one table is listed: **hivesampletable**.

4. Use the following command to display the schema for the hivesampletable:

    ```hiveql
    describe hivesampletable;
    ```

    This command returns the following information:

    ```output
    +-----------------------+------------+----------+--+
    |       col_name        | data_type  | comment  |
    +-----------------------+------------+----------+--+
    | clientid              | string     |          |
    | querytime             | string     |          |
    | market                | string     |          |
    | deviceplatform        | string     |          |
    | devicemake            | string     |          |
    | devicemodel           | string     |          |
    | state                 | string     |          |
    | country               | string     |          |
    | querydwelltime        | double     |          |
    | sessionid             | bigint     |          |
    | sessionpagevieworder  | bigint     |          |
    +-----------------------+------------+----------+--+
    ```

    This information describes the columns in the table.

5. Enter the following statements to create a table named **log4jLogs** by using sample data provided with the HDInsight cluster: (Revise as needed based on your URI scheme.)

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
    STORED AS TEXTFILE LOCATION 'wasbs:///example/data/';
    SELECT t4 AS sev, COUNT(*) AS count FROM log4jLogs
        WHERE t4 = '[ERROR]' AND INPUT__FILE__NAME LIKE '%.log'
        GROUP BY t4;
    ```

    These statements do the following actions:

    |Statement |Description |
    |---|---|
    |DROP TABLE|If the table exists, it's deleted.|
    |CREATE EXTERNAL TABLE|Creates an **external** table in Hive. External tables only store the table definition in Hive. The data is left in the original location.|
    |ROW FORMAT|How the data is formatted. In this case, the fields in each log are separated by a space.|
    |STORED AS TEXTFILE LOCATION|Where the data is stored and in what file format.|
    |SELECT|Selects a count of all rows where column **t4** contains the value **[ERROR]**. This query returns a value of **3** as there are three rows that contain this value.|
    |INPUT__FILE__NAME LIKE '%.log'|Hive attempts to apply the schema to all files in the directory. In this case, the directory contains files that don't match the schema. To prevent garbage data in the results, this statement tells Hive that it should only return data from files ending in .log.|

   > [!NOTE]  
   > External tables should be used when you expect the underlying data to be updated by an external source. For example, an automated data upload process or a MapReduce operation.
   >
   > Dropping an external table does **not** delete the data, only the table definition.

    The output of this command is similar to the following text:

    ```output
    INFO  : Tez session hasn't been created yet. Opening session
    INFO  :

    INFO  : Status: Running (Executing on YARN cluster with App id application_1443698635933_0001)

    INFO  : Map 1: -/-      Reducer 2: 0/1
    INFO  : Map 1: 0/1      Reducer 2: 0/1
    INFO  : Map 1: 0/1      Reducer 2: 0/1
    INFO  : Map 1: 0/1      Reducer 2: 0/1
    INFO  : Map 1: 0/1      Reducer 2: 0/1
    INFO  : Map 1: 0(+1)/1  Reducer 2: 0/1
    INFO  : Map 1: 0(+1)/1  Reducer 2: 0/1
    INFO  : Map 1: 1/1      Reducer 2: 0/1
    INFO  : Map 1: 1/1      Reducer 2: 0(+1)/1
    INFO  : Map 1: 1/1      Reducer 2: 1/1
    +----------+--------+--+
    |   sev    | count  |
    +----------+--------+--+
    | [ERROR]  | 3      |
    +----------+--------+--+
    1 row selected (47.351 seconds)
    ```

6. Exit Beeline:

    ```bash
    !exit
    ```

## Run a HiveQL file

This example is a continuation from the prior example. Use the following steps to create a file, then run it using Beeline.

1. Use the following command to create a file named **query.hql**:

    ```bash
    nano query.hql
    ```

1. Use the following text as the contents of the file. This query creates a new 'internal' table named **errorLogs**:

    ```hiveql
    CREATE TABLE IF NOT EXISTS errorLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) STORED AS ORC;
    INSERT OVERWRITE TABLE errorLogs SELECT t1, t2, t3, t4, t5, t6, t7 FROM log4jLogs WHERE t4 = '[ERROR]' AND INPUT__FILE__NAME LIKE '%.log';
    ```

    These statements do the following actions:

    |Statement |Description |
    |---|---|
    |CREATE TABLE IF NOT EXISTS|If the table doesn't already exist, it's created. Since the **EXTERNAL** keyword isn't used, this statement creates an internal table. Internal tables are stored in the Hive data warehouse and are managed completely by Hive.|
    |STORED AS ORC|Stores the data in Optimized Row Columnar (ORC) format. ORC format is a highly optimized and efficient format for storing Hive data.|
    |INSERT OVERWRITE ... SELECT|Selects rows from the **log4jLogs** table that contain **[ERROR]**, then inserts the data into the **errorLogs** table.|

    > [!NOTE]  
    > Unlike external tables, dropping an internal table deletes the underlying data as well.

1. To save the file, use **Ctrl**+**X**, then enter **Y**, and finally **Enter**.

1. Use the following to run the file using Beeline:

    ```bash
    beeline -u 'jdbc:hive2://headnodehost:10001/;transportMode=http' -i query.hql
    ```

    > [!NOTE]  
    > The `-i` parameter starts Beeline and runs the statements in the `query.hql` file. Once the query completes, you arrive at the `jdbc:hive2://headnodehost:10001/>` prompt. You can also run a file using the `-f` parameter, which exits Beeline after the query completes.

1. To verify that the **errorLogs** table was created, use the following statement to return all the rows from **errorLogs**:

    ```hiveql
    SELECT * from errorLogs;
    ```

    Three rows of data should be returned, all containing **[ERROR]** in column t4:

    ```output
    +---------------+---------------+---------------+---------------+---------------+---------------+---------------+--+
    | errorlogs.t1  | errorlogs.t2  | errorlogs.t3  | errorlogs.t4  | errorlogs.t5  | errorlogs.t6  | errorlogs.t7  |
    +---------------+---------------+---------------+---------------+---------------+---------------+---------------+--+
    | 2012-02-03    | 18:35:34      | SampleClass0  | [ERROR]       | incorrect     | id            |               |
    | 2012-02-03    | 18:55:54      | SampleClass1  | [ERROR]       | incorrect     | id            |               |
    | 2012-02-03    | 19:25:27      | SampleClass4  | [ERROR]       | incorrect     | id            |               |
    +---------------+---------------+---------------+---------------+---------------+---------------+---------------+--+
    3 rows selected (0.813 seconds)
    ```

## Next steps

* For more general information on Hive in HDInsight, see [Use Apache Hive with Apache Hadoop on HDInsight](hdinsight-use-hive.md)

* You can find the HiveQL language reference in the [language manual](https://cwiki.apache.org/confluence/display/Hive/LanguageManual)

* For more information on other ways you can work with Hadoop on HDInsight, see [Use MapReduce with Apache Hadoop on HDInsight](hdinsight-use-mapreduce.md)
