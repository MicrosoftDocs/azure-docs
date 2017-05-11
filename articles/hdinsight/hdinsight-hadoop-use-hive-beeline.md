---
title: Use Beeline to work with Hive on HDInsight (Hadoop) | Microsoft Docs
description: Learn how to use SSH to connect to a Hadoop cluster in HDInsight, and then interactively submit Hive queries by using Beeline. Beeline is a utility for working with HiveServer2 over JDBC.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 3adfb1ba-8924-4a13-98db-10a67ab24fca
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/05/2017
ms.author: larryfr

---
# Use Hive with Hadoop in HDInsight with Beeline
[!INCLUDE [hive-selector](../../includes/hdinsight-selector-use-hive.md)]

Learn how to use [Beeline](https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Clients#HiveServer2Clients-Beeline–NewCommandLineShell) to run Hive queries on HDInsight.

Beeline is a command-line tool that is included on the head nodes of your HDInsight cluster. It uses JDBC to connect to HiveServer2, a service hosted on your HDInsight cluster. The following table provides connection strings for use with Beeline:

| Where you run Beeline from | Connection string | Other parameters |
| --- | --- | --- |
| An SSH connection to a headnode | `jdbc:hive2://localhost:10001/;transportMode=http` | `-n admin` |
| An edge node | `jdbc:hive2://headnodehost:10001/;transportMode=http` | `-n admin` |
| Outside the cluster | `jdbc:hive2://clustername.azurehdinsight.net:443/;ssl=true;transportMode=http;httpPath=/hive2` | `-n admin -p password` |

> [!NOTE]
> Replace 'admin' with the cluster login account for your cluster.
>
> Replace 'password' with the password for the cluster login account.
>
> Replace `clustername` with the name of your HDInsight cluster.

## <a id="prereq"></a>Prerequisites

* A Linux-based Hadoop on HDInsight cluster.

  > [!IMPORTANT]
  > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight version 3.2 and 3.3 deprecation](hdinsight-component-versioning.md#hdi-version-33-nearing-deprecation-date).

* An SSH client. For more information on using SSH, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

## <a id="ssh"></a>Connect with SSH

Connect to your cluster using SSH using the following command:

```bash
ssh sshuser@myhdinsight-ssh.azurehdinsight.net
```

Replace `sshuser` with the SSH account for your cluster. Replace `myhdinsight` with the name of your HDInsight cluster.

**If you provided a password for SSH authentication** when you created the HDInsight cluster, you must provide the password when prompted.

**If you provided a certificate key for SSH authentication** when you created the HDInsight cluster, you may need to specify the location of the private key on your client system:

    ssh -i ~/.ssh/mykey.key ssh@myhdinsight-ssh.azurehdinsight.net

For more information on using SSH with HDInsight, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

## <a id="beeline"></a>Use the Beeline command

1. From the SSH session, use the following command to start Beeline:

    ```bash
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -n admin
    ```

    This command starts the Beeline client, and connect to the HiveServer2 on the cluster head node. The `-n` parameter is used to provide the cluster login account. The default login is `admin`. If you used a different name during cluster creation, use it instead of `admin`.

    Once the command completes, you arrive at a `jdbc:hive2://localhost:10001/>` prompt.

2. Beeline commands begin with a `!` character, for example `!help` displays help. However the `!` can be omitted for some commands. For example, `help` also works.

    There is a `!sql`, which is used to execute HiveQL statements. However, HiveQL is so commonly used that you can omit the preceding `!sql`. The following two statements are equivalent:

    ```hiveql
    !sql show tables;
    show tables;
    ```

    On a new cluster, only one table is listed: **hivesampletable**.

3. Use the following command to display the schema for the hivesampletable:

    ```bash
    describe hivesampletable;
    ```

    This command returns the following information:

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

    This information describes the columns in the table. While we could perform some queries against this data, let's instead create a brand new table to demonstrate how to load data into Hive and apply a schema.

4. Enter the following statements to create a table named **log4jLogs** by using sample data provided with the HDInsight cluster:

    ```hiveql
    DROP TABLE log4jLogs;
    CREATE EXTERNAL TABLE log4jLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
    STORED AS TEXTFILE LOCATION 'wasbs:///example/data/';
    SELECT t4 AS sev, COUNT(*) AS count FROM log4jLogs WHERE t4 = '[ERROR]' AND INPUT__FILE__NAME LIKE '%.log' GROUP BY t4;
    ```

    These statements perform the following actions:

    * **DROP TABLE** - If the table exists, it is deleted.

    * **CREATE EXTERNAL TABLE** - Creates an **external** table in Hive. External tables only store the table definition in Hive. The data is left in the original location.

    * **ROW FORMAT** - How the data is formatted. In this case, the fields in each log are separated by a space.

    * **STORED AS TEXTFILE LOCATION** - Where the data is stored and in what file format.

    * **SELECT** - Selects a count of all rows where column **t4** contains the value **[ERROR]**. This query returns a value of **3** as there are three rows that contain this value.

    * **INPUT__FILE__NAME LIKE '%.log'** - The example data file is stored with other files. This statement limits the query to data stored in files that end in .log.

  > [!NOTE]
  > External tables should be used when you expect the underlying data to be updated by an external source. For example, an automated data upload process or a MapReduce operation.
  >
  > Dropping an external table does **not** delete the data, only the table definition.

    The output of this command is similar to the following text:

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

5. To exit Beeline, use `!exit`.

## <a id="file"></a>Run a HiveQL file

Use the following steps to create a file, then run it using Beeline.

1. Use the following command to create a file named **query.hql**:

    ```bash
    nano query.hql
    ```

2. Use the following text as the contents of the file. This query creates a new 'internal' table named **errorLogs**:

    ```hiveql
    CREATE TABLE IF NOT EXISTS errorLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) STORED AS ORC;
    INSERT OVERWRITE TABLE errorLogs SELECT t1, t2, t3, t4, t5, t6, t7 FROM log4jLogs WHERE t4 = '[ERROR]' AND INPUT__FILE__NAME LIKE '%.log';
    ```

    These statements perform the following actions:

    * **CREATE TABLE IF NOT EXISTS** - If the table does not already exist, it is created. Since the **EXTERNAL** keyword is not used, this statement creates an internal table. Internal tables are stored in the Hive data warehouse and are managed completely by Hive.
    * **STORED AS ORC** - Stores the data in Optimized Row Columnar (ORC) format. ORC format is a highly optimized and efficient format for storing Hive data.
    * **INSERT OVERWRITE ... SELECT** - Selects rows from the **log4jLogs** table that contain **[ERROR]**, then inserts the data into the **errorLogs** table.

    > [!NOTE]
    > Unlike external tables, dropping an internal table deletes the underlying data as well.

3. To save the file, use **Ctrl**+**_X**, then enter **Y**, and finally **Enter**.

4. Use the following to run the file using Beeline. Replace **HOSTNAME** with the name obtained earlier for the head node, and **PASSWORD** with the password for the admin account:

    ```bash
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -n admin -i query.hql
    ```

    > [!NOTE]
    > The `-i` parameter starts Beeline, runs the statements in the query.hql file. Once the query completes, you arrive at the `jdbc:hive2://localhost:10001/>` prompt. You can also run a file using the `-f` parameter, which exits Beeline after the query completes.

5. To verify that the **errorLogs** table was created, use the following statement to return all the rows from **errorLogs**:

    ```hiveql
    SELECT * from errorLogs;
    ```

    Three rows of data should be returned, all containing **[ERROR]** in column t4:

        +---------------+---------------+---------------+---------------+---------------+---------------+---------------+--+
        | errorlogs.t1  | errorlogs.t2  | errorlogs.t3  | errorlogs.t4  | errorlogs.t5  | errorlogs.t6  | errorlogs.t7  |
        +---------------+---------------+---------------+---------------+---------------+---------------+---------------+--+
        | 2012-02-03    | 18:35:34      | SampleClass0  | [ERROR]       | incorrect     | id            |               |
        | 2012-02-03    | 18:55:54      | SampleClass1  | [ERROR]       | incorrect     | id            |               |
        | 2012-02-03    | 19:25:27      | SampleClass4  | [ERROR]       | incorrect     | id            |               |
        +---------------+---------------+---------------+---------------+---------------+---------------+---------------+--+
        3 rows selected (1.538 seconds)

## Edge nodes

If your cluster has an edge node, we recommend always using the edge node instead of the head node when connecting with SSH. To start Beeline from an SSH connection to an edge node, use the following command:

```bash
beeline -u 'jdbc:hive2://headnodehost:10001/;transportMode=http' -n admin
```

## Remote clients

If you have Beeline installed locally, or are using it through a Docker image such as [sutoiku/beeline](https://hub.docker.com/r/sutoiku/beeline/), you must use the following parameters:

* __Connection string__: `-u 'jdbc:hive2://clustername.azurehdinsight.net:443/;ssl=true;transportMode=http;httpPath=/hive2'`

* __Cluster login name__: `-n admin`

* __Cluster login password__ `-p 'password'`

Replace the `clustername` in the connection string with the name of your HDInsight cluster.

Replace `admin` with the name of your cluster login, and replace `password` with the password for your cluster login.

## <a id="summary"></a><a id="nextsteps"></a>Next steps

For more general information on Hive in HDInsight, see the following document:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

For more information on other ways you can work with Hadoop on HDInsight, see the following documents:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

If you are using Tez with Hive, see the following documents:

* [Use the Tez UI on Windows-based HDInsight](hdinsight-debug-tez-ui.md)
* [Use the Ambari Tez view on Linux-based HDInsight](hdinsight-debug-ambari-tez-view.md)

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

[putty]: http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html


[hdinsight-provision]: hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md
[hdinsight-upload-data]: hdinsight-upload-data.md


[powershell-here-strings]: http://technet.microsoft.com/library/ee692792.aspx
