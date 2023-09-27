---
title: Apache Spark operations supported by Hive Warehouse Connector in Azure HDInsight
description: Learn about the different capabilities of Hive Warehouse Connector on Azure HDInsight.
author: apurbasroy
ms.author: apsinhar
ms.service: hdinsight
ms.topic: how-to
ms.date: 08/21/2023
---

# Apache Spark operations supported by Hive Warehouse Connector in Azure HDInsight

This article shows spark-based operations supported by Hive Warehouse Connector (HWC). All examples shown below will be executed through the Apache Spark shell.

## Prerequisite

Complete the [Hive Warehouse Connector setup](./apache-hive-warehouse-connector.md#hive-warehouse-connector-setup) steps.

## Getting started

To start a spark-shell session, do the following steps:

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your Apache Spark cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. From your ssh session, execute the following command to note the `hive-warehouse-connector-assembly` version:

    ```bash
    ls /usr/hdp/current/hive_warehouse_connector
    ```

1. Edit the code below with the `hive-warehouse-connector-assembly` version identified above. Then execute the command to start the spark shell:

    ```bash
    spark-shell --master yarn \
    --jars /usr/hdp/current/hive_warehouse_connector/hive-warehouse-connector-assembly-<STACK_VERSION>.jar \
    --conf spark.security.credentials.hiveserver2.enabled=false
    ```

1. After starting the spark-shell, a Hive Warehouse Connector instance can be started using the following commands:

    ```scala
    import com.hortonworks.hwc.HiveWarehouseSession
    val hive = HiveWarehouseSession.session(spark).build()
    ```

## Creating Spark DataFrames using Hive queries

The results of all queries using the HWC library are returned as a DataFrame. The following examples demonstrate how to create a basic hive query.

```scala
hive.setDatabase("default")
val df = hive.executeQuery("select * from hivesampletable")
df.filter("state = 'Colorado'").show()
```

The results of the query are Spark DataFrames, which can be used with Spark libraries like MLIB and SparkSQL.

## Writing out Spark DataFrames to Hive tables

Spark doesn't natively support writing to Hive's managed ACID tables. However, using HWC, you can write out any DataFrame to a Hive table. You can see this functionality at work in the following example:

1. Create a table called `sampletable_colorado` and specify its columns using the following command:

    ```scala
    hive.createTable("sampletable_colorado").column("clientid","string").column("querytime","string").column("market","string").column("deviceplatform","string").column("devicemake","string").column("devicemodel","string").column("state","string").column("country","string").column("querydwelltime","double").column("sessionid","bigint").column("sessionpagevieworder","bigint").create()
    ```

1. Filter the table `hivesampletable` where the column `state` equals `Colorado`. This hive query returns a Spark DataFrame and result is saved in the Hive table `sampletable_colorado` using the `write` function.

    ```scala
    hive.table("hivesampletable").filter("state = 'Colorado'").write.format("com.hortonworks.spark.sql.hive.llap.HiveWarehouseConnector").mode("append").option("table","sampletable_colorado").save()
    ```

1. View the results with the following command:

    ```scala
    hive.table("sampletable_colorado").show()
    ```
    
    :::image type="content" source="./media/apache-hive-warehouse-connector/hive-warehouse-connector-show-hive-table.png" alt-text="hive warehouse connector show hive table" border="true":::


## Structured streaming writes

Using Hive Warehouse Connector, you can use Spark streaming to write data into Hive tables.

> [!IMPORTANT]
> Structured streaming writes are not supported in ESP enabled Spark 4.0 clusters.

Follow the steps below to ingest data from a Spark stream on localhost port 9999 into a Hive table via. Hive Warehouse Connector.

1. From your open Spark shell, begin a spark stream with the following command:

    ```scala
    val lines = spark.readStream.format("socket").option("host", "localhost").option("port",9999).load()
    ```

1. Generate data for the Spark stream that you created, by doing the following steps:
    1. Open a second SSH session on the same Spark cluster.
    1. At the command prompt, type `nc -lk 9999`. This command uses the `netcat` utility to send data from the command line to the specified port.

1. Return to the first SSH session and create a new Hive table to hold the streaming data. At the spark-shell, enter the following command:

    ```scala
    hive.createTable("stream_table").column("value","string").create()
    ```

1. Then write the streaming data to the newly created table using the following command:

    ```scala
    lines.filter("value = 'HiveSpark'").writeStream.format("com.hortonworks.spark.sql.hive.llap.streaming.HiveStreamingDataSource").option("database", "default").option("table","stream_table").option("metastoreUri",spark.conf.get("spark.datasource.hive.warehouse.metastoreUri")).option("checkpointLocation","/tmp/checkpoint1").start()
    ```

    >[!Important]
    > The `metastoreUri` and `database` options must currently be set manually due to a known issue in Apache Spark. For more information about this issue, see [SPARK-25460](https://issues.apache.org/jira/browse/SPARK-25460).

1. Return to the second SSH session and enter the following values:

    ```bash
    foo
    HiveSpark
    bar
    ```

1. Return to the first SSH session and note the brief activity. Use the following command to view the data:

    ```scala
    hive.table("stream_table").show()
    ```

Use **Ctrl + C** to stop `netcat` on the second SSH session. Use `:q` to exit spark-shell on the first SSH session.

## Next steps

* [HWC integration with Apache Spark and Apache Hive](./apache-hive-warehouse-connector.md)
* [Use Interactive Query with HDInsight](./apache-interactive-query-get-started.md)
* [HWC integration with Apache Zeppelin](./apache-hive-warehouse-connector-zeppelin.md)
* [HWC supported APIs](./hive-warehouse-connector-apis.md)
