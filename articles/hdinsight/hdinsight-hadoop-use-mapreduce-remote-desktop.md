<properties
   pageTitle="MapReduce and Remote Desktop with Hadoop in HDInsight | Microsoft Azure"
   description="Learn how to use Remote Desktop to connect to Hadoop on HDInsight and run MapReduce jobs."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"
	tags="azure-portal"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="07/12/2016"
   ms.author="larryfr"/>

# Use MapReduce in Hadoop on HDInsight with Remote Desktop

[AZURE.INCLUDE [mapreduce-selector](../../includes/hdinsight-selector-use-mapreduce.md)]

In this article, you will learn how to connect to a Hadoop on HDInsight cluster by using Remote Desktop and then run MapReduce jobs by using the Hadoop command.

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following:

* A Windows-based HDInsight (Hadoop on HDInsight) cluster

* A client computer running Windows 10, Windows 8, or Windows 7

##<a id="connect"></a>Connect with Remote Desktop

Enable Remote Desktop for the HDInsight cluster, then connect to it by following the instructions at [Connect to HDInsight clusters using RDP](hdinsight-administer-use-management-portal.md#rdp).

##<a id="hadoop"></a>Use the Hadoop command

When you are connected to the desktop for the HDInsight cluster, use the following steps to run a MapReduce job by using the Hadoop command:

1. From the HDInsight desktop, start the **Hadoop Command Line**. This opens a new command prompt in the **c:\apps\dist\hadoop-&lt;version number>** directory.

	> [AZURE.NOTE] The version number changes as Hadoop is updated. The **HADOOP_HOME** environment variable can be used to find the path. For example, `cd %HADOOP_HOME%` changes directories to the Hadoop directory, without requiring you to know the version number.

2. To use the **Hadoop** command to run an example MapReduce job, use the following command:

		hadoop jar hadoop-mapreduce-examples.jar wordcount wasbs:///example/data/gutenberg/davinci.txt wasbs:///example/data/WordCountOutput

	This starts the **wordcount** class, which is contained in the **hadoop-mapreduce-examples.jar** file in the current directory. As input, it uses the **wasbs://example/data/gutenberg/davinci.txt** document, and output is stored at: **wasbs:///example/data/WordCountOutput**.

	> [AZURE.NOTE] for more information about this MapReduce job and the example data, see <a href="hdinsight-use-mapreduce.md">Use MapReduce in HDInsight Hadoop</a>.

2. The job emits details as it is processed, and it returns information similar to the following when the job is complete:

		File Input Format Counters
        Bytes Read=1395666
		File Output Format Counters
        Bytes Written=337623

3. When the job is complete, use the following command to list the output files stored at **wasbs://example/data/WordCountOutput**:

		hadoop fs -ls wasbs:///example/data/WordCountOutput

	This should display two files, **_SUCCESS** and **part-r-00000**. The **part-r-00000** file contains the output for this job.

	> [AZURE.NOTE] Some MapReduce jobs may split the results across multiple **part-r-#####** files. If so, use the ##### suffix to indicate the order of the files.

4. To view the output, use the following command:

		hadoop fs -cat wasbs:///example/data/WordCountOutput/part-r-00000

	This displays a list of the words that are contained in the **wasbs://example/data/gutenberg/davinci.txt** file, along with the number of times each word occured. The following is an example of the data that will be contained in the file:

		wreathed        3
		wreathing       1
		wreaths 		1
		wrecked 		3
		wrenching       1
		wretched        6
		wriggling       1

##<a id="summary"></a>Summary

As you can see, the Hadoop command provides an easy way to run MapReduce jobs on an HDInsight cluster and then view the job output.

##<a id="nextsteps"></a>Next steps

For general information about MapReduce jobs in HDInsight:

* [Use MapReduce on HDInsight Hadoop](hdinsight-use-mapreduce.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
