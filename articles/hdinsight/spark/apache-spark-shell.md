---
title: Use an Interactive Spark Shell in Azure HDInsight 
description: An interactive Spark Shell provides a read-execute-print process for running Spark commands one at a time and seeing the results.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 12/12/2019
---

# Run Apache Spark from the Spark Shell

An interactive [Apache Spark](https://spark.apache.org/) Shell provides a REPL (read-execute-print loop) environment for running Spark commands one at a time and seeing the results. This process is useful for development and debugging. Spark provides one shell for each of its supported languages: Scala, Python, and R.

## Run an Apache Spark Shell

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. Spark provides shells for Scala (spark-shell), and Python (pyspark). In your SSH session, enter one of the following commands:

    ```bash
    spark-shell
    pyspark
    ```

    Now you can enter Spark commands in the appropriate language.

1. A few basic example commands:

    ```scala
    // Load data
    var data = spark.read.format("csv").option("header", "true").option("inferSchema", "true").load("/HdiSamples/HdiSamples/SensorSampleData/building/building.csv")

    // Show data
    data.show()

    // Select certain columns
    data.select($"BuildingID", $"Country").show(10)

    // exit shell
    :q
    ```

## SparkSession and SparkContext instances

By default when you run the Spark Shell, instances of SparkSession and SparkContext are automatically instantiated for you.

To access the SparkSession instance, enter `spark`. To access the SparkContext instance, enter `sc`.

## Important shell parameters

The Spark Shell command (`spark-shell`, or `pyspark`) supports many command-line parameters. To see a full list of parameters, start the Spark Shell with the switch `--help`. Some of these parameters may only apply to `spark-submit`, which the Spark Shell wraps.

| switch | description | example |
| --- | --- | --- |
| --master MASTER_URL | Specifies the master URL. In HDInsight, this value is always `yarn`. | `--master yarn`|
| --jars JAR_LIST | Comma-separated list of local jars to include on the driver and executor classpaths. In HDInsight, this list is composed of paths to the default filesystem in Azure Storage or Data Lake Storage. | `--jars /path/to/examples.jar` |
| --packages MAVEN_COORDS | Comma-separated list of maven coordinates of jars to include on the driver and executor classpaths. Searches the local maven repo, then maven central, then any additional remote repositories specified with `--repositories`. The format for the coordinates is *groupId*:*artifactId*:*version*. | `--packages "com.microsoft.azure:azure-eventhubs:0.14.0"`|
| --py-files LIST | For Python only, a comma-separated list of .zip, .egg, or .py files to place on the PYTHONPATH. | `--pyfiles "samples.py"` |

## Next steps

- See [Introduction to Apache Spark on Azure HDInsight](apache-spark-overview.md) for an overview.
- See [Create an Apache Spark cluster in Azure HDInsight](apache-spark-jupyter-spark-sql.md) to work with Spark clusters and SparkSQL.
- See [What is Apache Spark Structured Streaming?](apache-spark-streaming-overview.md) to write applications that process streaming data with Spark.
