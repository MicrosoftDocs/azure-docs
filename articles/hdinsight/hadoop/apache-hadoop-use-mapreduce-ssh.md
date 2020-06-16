---
title: MapReduce and SSH connection with Apache Hadoop - Azure HDInsight
description: Learn how to use SSH to run MapReduce jobs using Apache Hadoop on HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 01/10/2020
---

# Use MapReduce with Apache Hadoop on HDInsight with SSH

[!INCLUDE [mapreduce-selector](../../../includes/hdinsight-selector-use-mapreduce.md)]

Learn how to submit MapReduce jobs from a Secure Shell (SSH) connection to HDInsight.

> [!NOTE]
> If you are already familiar with using Linux-based Apache Hadoop servers, but you are new to HDInsight, see [Linux-based HDInsight tips](../hdinsight-hadoop-linux-information.md).

## Prerequisites

An Apache Hadoop cluster on HDInsight. See [Create Apache Hadoop clusters using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md).

## Use Hadoop commands

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. After you are connected to the HDInsight cluster, use the following command to start a MapReduce job:

    ```bash
    yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar wordcount /example/data/gutenberg/davinci.txt /example/data/WordCountOutput
    ```

    This command starts the `wordcount` class, which is contained in the `hadoop-mapreduce-examples.jar` file. It uses the `/example/data/gutenberg/davinci.txt` document as input, and output is stored at `/example/data/WordCountOutput`.

    > [!NOTE]
    > For more information about this MapReduce job and the example data, see [Use MapReduce in Apache Hadoop on HDInsight](hdinsight-use-mapreduce.md).

    The job emits details as it processes, and it returns information similar to the following text when the job completes:

    ```output
    File Input Format Counters
    Bytes Read=1395666
    File Output Format Counters
    Bytes Written=337623
    ```

1. When the job completes, use the following command to list the output files:

    ```bash
    hdfs dfs -ls /example/data/WordCountOutput
    ```

    This command display two files, `_SUCCESS` and `part-r-00000`. The `part-r-00000` file contains the output for this job.

    > [!NOTE]  
    > Some MapReduce jobs may split the results across multiple **part-r-#####** files. If so, use the ##### suffix to indicate the order of the files.

1. To view the output, use the following command:

    ```bash
    hdfs dfs -cat /example/data/WordCountOutput/part-r-00000
    ```

    This command displays a list of the words that are contained in the **wasbs://example/data/gutenberg/davinci.txt** file and the number of times each word occurred. The following text is an example of the data that is contained in the file:

    ```output
    wreathed        3
    wreathing       1
    wreaths         1
    wrecked         3
    wrenching       1
    wretched        6
    wriggling       1
    ```

## Next steps

As you can see, Hadoop commands provide an easy way to run MapReduce jobs in an HDInsight cluster and then view the job output. For information about other ways you can work with Hadoop on HDInsight:

* [Use MapReduce on HDInsight Hadoop](hdinsight-use-mapreduce.md)
* [Use Apache Hive with Apache Hadoop on HDInsight](hdinsight-use-hive.md)
