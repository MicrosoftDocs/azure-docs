---
title: MapReduce and Remote Desktop with Hadoop in HDInsight - Azure 
description: Learn how to use Remote Desktop to connect to Hadoop on HDInsight and run MapReduce jobs.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.topic: conceptual
ms.date: 01/12/2017
ms.author: jasonh
ROBOTS: NOINDEX

---
# Use MapReduce in Hadoop on HDInsight with Remote Desktop
[!INCLUDE [mapreduce-selector](../../../includes/hdinsight-selector-use-mapreduce.md)]

In this article, you will learn how to connect to a Hadoop on HDInsight cluster by using Remote Desktop and then run MapReduce jobs by using the Hadoop command.

> [!IMPORTANT]
> Remote Desktop is only available on Windows-based HDInsight clusters. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).
>
> For HDInsight 3.4 or greater, see [Use MapReduce with SSH](apache-hadoop-use-mapreduce-ssh.md) for information on connecting to the HDInsight cluster and running MapReduce jobs.

## <a id="prereq"></a>Prerequisites
To complete the steps in this article, you will need the following:

* A Windows-based HDInsight (Hadoop on HDInsight) cluster
* A client computer running Windows 10, Windows 8, or Windows 7

## <a id="connect"></a>Connect with Remote Desktop
Enable Remote Desktop for the HDInsight cluster, then connect to it by following the instructions at [Connect to HDInsight clusters using RDP](../hdinsight-administer-use-management-portal.md#connect-to-clusters-using-rdp).

## <a id="hadoop"></a>Use the Hadoop command
When you are connected to the desktop for the HDInsight cluster, use the following steps to run a MapReduce job by using the Hadoop command:

1. From the HDInsight desktop, start the **Hadoop Command Line**. This opens a new command prompt in the **c:\apps\dist\hadoop-&lt;version number>** directory.

   > [!NOTE]
   > The version number changes as Hadoop is updated. The **HADOOP_HOME** environment variable can be used to find the path. For example, `cd %HADOOP_HOME%` changes directories to the Hadoop directory, without requiring you to know the version number.
   >
   >
2. To use the **Hadoop** command to run an example MapReduce job, use the following command:

        hadoop jar hadoop-mapreduce-examples.jar wordcount wasb:///example/data/gutenberg/davinci.txt wasb:///example/data/WordCountOutput

    This starts the **wordcount** class, which is contained in the **hadoop-mapreduce-examples.jar** file in the current directory. As input, it uses the **wasb://example/data/gutenberg/davinci.txt** document, and output is stored at: **wasb:///example/data/WordCountOutput**.

   > [!NOTE]
   > for more information about this MapReduce job and the example data, see <a href="hdinsight-use-mapreduce.md">Use MapReduce in HDInsight Hadoop</a>.
   >
   >
3. The job emits details as it is processed, and it returns information similar to the following when the job is complete:

        File Input Format Counters
        Bytes Read=1395666
        File Output Format Counters
        Bytes Written=337623
4. When the job is complete, use the following command to list the output files stored at **wasb://example/data/WordCountOutput**:

        hadoop fs -ls wasb:///example/data/WordCountOutput

    This should display two files, **_SUCCESS** and **part-r-00000**. The **part-r-00000** file contains the output for this job.

   > [!NOTE]
   > Some MapReduce jobs may split the results across multiple **part-r-#####** files. If so, use the ##### suffix to indicate the order of the files.
   >
   >
5. To view the output, use the following command:

        hadoop fs -cat wasb:///example/data/WordCountOutput/part-r-00000

    This displays a list of the words that are contained in the **wasb://example/data/gutenberg/davinci.txt** file, along with the number of times each word occured. The following is an example of the data that will be contained in the file:

        wreathed        3
        wreathing       1
        wreaths         1
        wrecked         3
        wrenching       1
        wretched        6
        wriggling       1

## <a id="summary"></a>Summary
As you can see, the Hadoop command provides an easy way to run MapReduce jobs on an HDInsight cluster and then view the job output.

## <a id="nextsteps"></a>Next steps
For general information about MapReduce jobs in HDInsight:

* [Use MapReduce on HDInsight Hadoop](hdinsight-use-mapreduce.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
