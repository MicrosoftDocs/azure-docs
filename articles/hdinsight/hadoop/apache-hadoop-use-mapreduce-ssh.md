---
title: MapReduce and SSH connection with Hadoop in HDInsight - Azure 
description: Learn how to use SSH to run MapReduce jobs using Hadoop on HDInsight.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 04/10/2018
ms.author: jasonh

---
# Use MapReduce with Hadoop on HDInsight with SSH

[!INCLUDE [mapreduce-selector](../../../includes/hdinsight-selector-use-mapreduce.md)]

Learn how to submit MapReduce jobs from a Secure Shell (SSH) connection to HDInsight.

> [!NOTE]
> If you are already familiar with using Linux-based Hadoop servers, but you are new to HDInsight, see [Linux-based HDInsight tips](../hdinsight-hadoop-linux-information.md).

## <a id="prereq"></a>Prerequisites

* A Linux-based HDInsight (Hadoop on HDInsight) cluster

  > [!IMPORTANT]
  > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).

* An SSH client. For more information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md)

## <a id="ssh"></a>Connect with SSH

Connect to the cluster using SSH. For example, the following command connects to a cluster named **myhdinsight** as the **sshuser** account:

```bash
ssh sshuser@myhdinsight-ssh.azurehdinsight.net
```

**If you use a certificate key for SSH authentication**, you may need to specify the location of the private key on your client system, for example:

```bash
ssh -i ~/mykey.key sshuser@myhdinsight-ssh.azurehdinsight.net
```

**If you use a password for SSH authentication**, you need to provide the password when prompted.

For more information on using SSH with HDInsight, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

## <a id="hadoop"></a>Use Hadoop commands

1. After you are connected to the HDInsight cluster, use the following command to start a MapReduce job:

    ```bash
    yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar wordcount /example/data/gutenberg/davinci.txt /example/data/WordCountOutput
    ```

    This command starts the `wordcount` class, which is contained in the `hadoop-mapreduce-examples.jar` file. It uses the `/example/data/gutenberg/davinci.txt` document as input, and output is stored at `/example/data/WordCountOutput`.

    > [!NOTE]
    > For more information about this MapReduce job and the example data, see [Use MapReduce in Hadoop on HDInsight](hdinsight-use-mapreduce.md).

2. The job emits details as it processes, and it returns information similar to the following text when the job completes:

        File Input Format Counters
        Bytes Read=1395666
        File Output Format Counters
        Bytes Written=337623

3. When the job completes, use the following command to list the output files:

    ```bash
    hdfs dfs -ls /example/data/WordCountOutput
    ```

    This command display two files, `_SUCCESS` and `part-r-00000`. The `part-r-00000` file contains the output for this job.

    > [!NOTE]
    > Some MapReduce jobs may split the results across multiple **part-r-#####** files. If so, use the ##### suffix to indicate the order of the files.

4. To view the output, use the following command:

    ```bash
    hdfs dfs -cat /example/data/WordCountOutput/part-r-00000
    ```

    This command displays a list of the words that are contained in the **wasb://example/data/gutenberg/davinci.txt** file and the number of times each word occurred. The following text is an example of the data that is contained in the file:

        wreathed        3
        wreathing       1
        wreaths         1
        wrecked         3
        wrenching       1
        wretched        6
        wriggling       1

## <a id="summary"></a>Summary

As you can see, Hadoop commands provide an easy way to run MapReduce jobs in an HDInsight cluster and then view the job output.

## <a id="nextsteps"></a>Next steps

For general information about MapReduce jobs in HDInsight:

* [Use MapReduce on HDInsight Hadoop](hdinsight-use-mapreduce.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
