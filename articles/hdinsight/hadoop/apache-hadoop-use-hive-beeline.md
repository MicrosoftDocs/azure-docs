---
title: Use Apache Beeline with Apache Hive - Azure HDInsight 
description: Learn how to use the Beeline client to run Hive queries with Hadoop on HDInsight. Beeline is a utility for working with HiveServer2 over JDBC.
author: hrasheed-msft
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 04/03/2019
ms.author: hrasheed
---

# Use the Apache Beeline client with Apache Hive

Learn how to use [Apache Beeline](https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Clients#HiveServer2Clients-Beeline–NewCommandLineShell) to run Apache Hive queries on HDInsight.

Beeline is a Hive client that is included on the head nodes of your HDInsight cluster. Beeline uses JDBC to connect to HiveServer2, a service hosted on your HDInsight cluster. You can also use Beeline to access Hive on HDInsight remotely over the internet. The following examples provide the most common connection strings used to connect to HDInsight from Beeline:

## Types of connections

### From an SSH session

When connecting from an SSH session to a cluster headnode, you can then connect to the `headnodehost` address on port `10001`:

```bash
beeline -u 'jdbc:hive2://headnodehost:10001/;transportMode=http'
```

---

### Over an Azure Virtual Network

When connecting from a client to HDInsight over an Azure Virtual Network, you must provide the fully qualified domain name (FQDN) of a cluster head node. Since this connection is made directly to the cluster nodes, the connection uses port `10001`:

```bash
beeline -u 'jdbc:hive2://<headnode-FQDN>:10001/;transportMode=http'
```

Replace `<headnode-FQDN>` with the fully qualified domain name of a cluster headnode. To find the fully qualified domain name of a headnode, use the information in the [Manage HDInsight using the Apache Ambari REST API](../hdinsight-hadoop-manage-ambari-rest-api.md#example-get-the-fqdn-of-cluster-nodes) document.

---

### To HDInsight Enterprise Security Package (ESP) cluster

When connecting from a client to an Enterprise Security Package (ESP) cluster joined to Azure Active Directory (AAD), you must also specify the domain name `<AAD-Domain>` and the name of a domain user account with permissions to access the cluster `<username>`:

```bash
kinit <username>
beeline -u 'jdbc:hive2://<headnode-FQDN>:10001/default;principal=hive/_HOST@<AAD-Domain>;auth-kerberos;transportMode=http' -n <username>
```

Replace `<username>` with the name of an account on the domain with permissions to access the cluster. Replace `<AAD-DOMAIN>` with the name of the Azure Active Directory (AAD) that the cluster is joined to. Use an uppercase string for the `<AAD-DOMAIN>` value, otherwise the credential won't be found. Check `/etc/krb5.conf` for the realm names if needed.

---

### Over public internet

When connecting over the public internet, you must provide the cluster login account name (default `admin`) and password. For example, using Beeline from a client system to connect to the `<clustername>.azurehdinsight.net` address. This connection is made over port `443`, and is encrypted using SSL:

```bash
beeline -u 'jdbc:hive2://clustername.azurehdinsight.net:443/;ssl=true;transportMode=http;httpPath=/hive2' -n admin -p password
```

Replace `clustername` with the name of your HDInsight cluster. Replace `admin` with the cluster login account for your cluster. Replace `password` with the password for the cluster login account.

---

### <a id="sparksql"></a>Use Beeline with Apache Spark

Apache Spark provides its own implementation of HiveServer2, which is sometimes referred to as the Spark Thrift server. This service uses Spark SQL to resolve queries instead of Hive, and may provide better performance depending on your query.

#### Over public internet with Apache Spark

The connection string used when connecting over the internet is slightly different. Instead of containing `httpPath=/hive2` it is `httpPath/sparkhive2`:

```bash 
beeline -u 'jdbc:hive2://clustername.azurehdinsight.net:443/;ssl=true;transportMode=http;httpPath=/sparkhive2' -n admin -p password
```

---

#### From cluster head or inside Azure Virtual Network with Apache Spark

When connecting directly from the cluster head node, or from a resource inside the same Azure Virtual Network as the HDInsight cluster, port `10002` should be used for Spark Thrift server instead of `10001`. The following example shows how to connect directly to the head node:

```bash
beeline -u 'jdbc:hive2://headnodehost:10002/;transportMode=http'
```

---

## <a id="prereq"></a>Prerequisites

* A Hadoop cluster on HDInsight. See [Get Started with HDInsight on Linux](./apache-hadoop-linux-tutorial-get-started.md).

* Notice the [URI scheme](../hdinsight-hadoop-linux-information.md#URI-and-scheme) for your cluster's primary storage. For example,  `wasb://` for Azure Storage, `abfs://` for Azure Data Lake Storage Gen2, or `adl://` for Azure Data Lake Storage Gen1. If secure transfer is enabled for Azure Storage or Data Lake Storage Gen2, the URI is `wasbs://` or `abfss://`, respectively. For more information, see [secure transfer](../../storage/common/storage-require-secure-transfer.md).


* Option 1: An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md). Most of the steps in this document assume that you are using Beeline from an SSH session to the cluster.

* Option 2:  A local Beeline client.


## <a id="beeline"></a>Run a Hive query

This example is based on using the Beeline client from an SSH connection.

1. Open an SSH connection to the cluster with the code below. Replace `sshuser` with the SSH user for your cluster, and replace `CLUSTERNAME` with the name of your cluster. When prompted, enter the password for the SSH user account.

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

2. Connect to HiveServer2 with your Beeline client from your open SSH session by entering the following command:

    ```bash
    beeline -u 'jdbc:hive2://headnodehost:10001/;transportMode=http'
    ```

3. Beeline commands begin with a `!` character, for example `!help` displays help. However the `!` can be omitted for some commands. For example, `help` also works.

    There is a `!sql`, which is used to execute HiveQL statements. However, HiveQL is so commonly used that you can omit the preceding `!sql`. The following two statements are equivalent:

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

    This information describes the columns in the table.

5. Enter the following statements to create a table named **log4jLogs** by using sample data provided with the HDInsight cluster: (Revise as needed based on your [URI scheme](../hdinsight-hadoop-linux-information.md#URI-and-scheme).)

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

    These statements perform the following actions:

    * `DROP TABLE` - If the table exists, it is deleted.

    * `CREATE EXTERNAL TABLE` - Creates an **external** table in Hive. External tables only store the table definition in Hive. The data is left in the original location.

    * `ROW FORMAT` - How the data is formatted. In this case, the fields in each log are separated by a space.

    * `STORED AS TEXTFILE LOCATION` - Where the data is stored and in what file format.

    * `SELECT` - Selects a count of all rows where column **t4** contains the value **[ERROR]**. This query returns a value of **3** as there are three rows that contain this value.

    * `INPUT__FILE__NAME LIKE '%.log'` - Hive attempts to apply the schema to all files in the directory. In this case, the directory contains files that do not match the schema. To prevent garbage data in the results, this statement tells Hive that it should only return data from files ending in .log.

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

6. To exit Beeline, use `!exit`.

## <a id="file"></a>Run a HiveQL file

This is a continuation from the prior example. Use the following steps to create a file, then run it using Beeline.

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

4. Use the following to run the file using Beeline:

    ```bash
    beeline -u 'jdbc:hive2://headnodehost:10001/;transportMode=http' -i query.hql
    ```

    > [!NOTE]  
    > The `-i` parameter starts Beeline and runs the statements in the `query.hql` file. Once the query completes, you arrive at the `jdbc:hive2://headnodehost:10001/>` prompt. You can also run a file using the `-f` parameter, which exits Beeline after the query completes.

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




## <a id="summary"></a><a id="nextsteps"></a>Next steps

For more general information on Hive in HDInsight, see the following document:

* [Use Apache Hive with Apache Hadoop on HDInsight](hdinsight-use-hive.md)

For more information on other ways you can work with Hadoop on HDInsight, see the following documents:

* [Use Apache Pig with Apache Hadoop on HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with Apache Hadoop on HDInsight](hdinsight-use-mapreduce.md)

[azure-purchase-options]: https://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: https://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: https://azure.microsoft.com/pricing/free-trial/

[apache-tez]: https://tez.apache.org
[apache-hive]: https://hive.apache.org/
[apache-log4j]: https://en.wikipedia.org/wiki/Log4j
[hive-on-tez-wiki]: https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez
[import-to-excel]: https://azure.microsoft.com/documentation/articles/hdinsight-connect-excel-power-query/


[hdinsight-use-oozie]: hdinsight-use-oozie-linux-mac.md

[putty]: https://www.chiark.greenend.org.uk/~sgtatham/putty/download.html


[hdinsight-provision]: hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-submit-jobs]:submit-apache-hadoop-jobs-programmatically.md
[hdinsight-upload-data]: hdinsight-upload-data.md


[powershell-here-strings]: https://technet.microsoft.com/library/ee692792.aspx
