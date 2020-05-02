---
title: Spark operations supported by Hive Warehouse Connector - Azure HDInsight
description: Learn about the different capabilities of Hive Warehouse Connector on Azure HDInsight.
author: nis-goel
ms.author: nisgoel
ms.reviewer: hrasheed
ms.service: hdinsight
ms.topic: conceptual
ms.date: 01/05/2020
---

# Spark operations supported by Hive Warehouse Connector on Azure HDInsight

The article shows different spark based operations supported by HWC. All examples shown below will be executed through spark-shell.

## Creating Spark DataFrames using Hive queries

The results of all queries using the HWC library are returned as a DataFrame. The following examples demonstrate how to create a basic hive query.

```scala
hive.setDatabase("default")
val df = hive.executeQuery("select * from hivesampletable")
df.filter("state = 'Colorado'").show()
```

The results of the query are Spark DataFrames, which can be used with Spark libraries like MLIB and SparkSQL.

## Writing out Spark DataFrames to Hive tables

Spark doesn't natively support writing to Hive's managed ACID tables. However,using HWC, you can write out any DataFrame to a Hive table. You can see this functionality at work in the following example:

1. Create a table called `sampletable_colorado` and specify its columns using the following command:

    ```scala
    hive.createTable("sampletable_colorado").column("clientid","string").column("querytime","string").column("market","string").column("deviceplatform","string").column("devicemake","string").column("devicemodel","string").column("state","string").column("country","string").column("querydwelltime","double").column("sessionid","bigint").column("sessionpagevieworder","bigint").create()
    ```

1. Filter the table `hivesampletable` where the column `state` equals `Colorado`. This hive query returns a Spark DataFrame ans sis saved in the Hive table `sampletable_colorado` using the `write` function.

    ```scala
    hive.table("hivesampletable").filter("state = 'Colorado'").write.format(HiveWarehouseSession.HIVE_WAREHOUSE_CONNECTOR).option("table","sampletable_colorado").save()
    ```

1. View the results with the following command:

    ```scala
    hive.table("sampletable_colorado").show()
    ```
    
    ![hive warehouse connector show hive table](./media/apache-hive-warehouse-connector/hive-warehouse-connector-show-hive-table.png)

## Structured streaming writes

Using Hive Warehouse Connector, you can use Spark streaming to write data into Hive tables.

Follow the steps below to create a Hive Warehouse Connector example that ingests data from a Spark stream on localhost port 9999 into a Hive table.

1. Follow the steps under [Connecting and running queries](./apache-hive-warehouse-connector.md#connecting-and-running-queries) to trigger the spark-shell.

1. Begin the spark stream with the following command:

    ```scala
    val lines = spark.readStream.format("socket").option("host", "localhost").option("port",9999).load()
    ```

1. Generate data for the Spark stream that you created, by doing the following steps:
    1. Open a second SSH session on the same Spark cluster.
    1. At the command prompt, type `nc -lk 9999`. This command uses the netcat utility to send data from the command line to the specified port.

1. Return to the first SSH session and create a new Hive table to hold the streaming data. At the spark-shell, enter the following command:

    ```scala
    hive.createTable("stream_table").column("value","string").create()
    ```

1. Then write the streaming data to the newly created table using the following command:

    ```scala
    lines.filter("value = 'HiveSpark'").writeStream.format(HiveWarehouseSession.STREAM_TO_STREAM).option("database", "default").option("table","stream_table").option("metastoreUri",spark.conf.get("spark.datasource.hive.warehouse.metastoreUri")).option("checkpointLocation","/tmp/checkpoint1").start()
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

Use **Ctrl + C** to stop netcat on the second SSH session. Use `:q` to exit spark-shell on the first SSH session.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).