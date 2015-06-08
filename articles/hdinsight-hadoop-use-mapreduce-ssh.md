<properties
   pageTitle="MapReduce and SSH connection with Hadoop in HDInsight | Microsoft Azure"
   description="Learn how to use SSH to run MapReduce jobs using Hadoop on HDInsight."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="02/18/2015"
   ms.author="larryfr"/>

# Use MapReduce with Hadoop on HDInsight with SSH

[AZURE.INCLUDE [mapreduce-selector](../includes/hdinsight-selector-use-mapreduce.md)]

In this article, you will learn how to use Secure Shell (SSH) to connect to a Hadoop on HDInsight cluster and then submit MapReduce jobs by using Hadoop commands.

> [AZURE.NOTE] If you are already familiar with using Linux-based Hadoop servers, but you are new to HDInsight, see <a href="../hdinsight-hadoop-linux-information/" target="_blank">What you need to know about Hadoop on Linux-based HDInsight</a>.

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following:

* A Linux-based HDInsight (Hadoop on HDInsight) cluster

* An SSH client. Linux, Unix, and Mac operating systems should come with an SSH client. Windows users must download a client, such as <a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html" target="_blank">PuTTY</a>.

##<a id="ssh"></a>Connect with SSH

Connect to the fully qualified domain name (FQDN) of your HDInsight cluster by using the SSH command. The FQDN will be the name you gave the cluster, followed by **.azurehdinsight.net**. For example, the following would connect to a cluster named **myhdinsight**:

	ssh admin@myhdinsight-ssh.azurehdinsight.net

**If you provided a certificate key for SSH authentication** when you created the HDInsight cluster, you may need to specify the location of the private key on your client system, for example:

	ssh admin@myhdinsight-ssh.azurehdinsight.net -i ~/mykey.key

**If you provided a password for SSH authentication** when you created the HDInsight cluster, you will need to provide the password when prompted.

###PuTTY (Windows clients)

Windows does not provide a built-in SSH client. We recommend using **PuTTY**. To downloaded PuTTY, see the <a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html" target="_blank">PuTTY Download Page</a>.

For more information about using PuTTY, see the **Use PuTTY to Connect to a Linux Machine** section of <a href="http://azure.microsoft.com/documentation/articles/virtual-machines-linux-use-ssh-key/" target="_blank">How to use SSH with Linux on Azure</a>.

> [AZURE.NOTE] If you used a certificate for SSH authentication for the HDInsight cluster, you will also need to see the **Create a PPK for PuTTY** section of <a href="http://azure.microsoft.com/documentation/articles/virtual-machines-linux-use-ssh-key/" target="_blank">How to use SSH with Linux on Azure</a>.

##<a id="hadoop"></a>Use Hadoop commands

1. After you are connected to the HDInsight cluster, use the following **Hadoop** command to start a MapReduce job:

		hadoop jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar wordcount wasb:///example/data/gutenberg/davinci.txt wasb:///example/data/WordCountOutput

	This starts the **wordcount** class, which is contained in the **hadoop-mapreduce-examples.jar** file. As input, it uses the **wasb://example/data/gutenberg/davinci.txt** document, and output is stored at **wasb:///example/data/WordCountOutput**.

	> [AZURE.NOTE] For more information about this MapReduce job and the example data, see <a href="hdinsight-use-mapreduce.md" target="_blank">Use MapReduce in Hadoop on HDInsight</a>.

2. The job emits details as it processes, and it returns information similar to the following when the job completes:

		File Input Format Counters
        Bytes Read=1395666
		File Output Format Counters
        Bytes Written=337623

3. When the job completes, use the following command to list the output files that are stored at **wasb://example/data/WordCountOutput**:

		hadoop fs -ls wasb:///example/data/WordCountOutput

	This should display two files, **_SUCCESS** and **part-r-00000**. The **part-r-00000** file contains the output for this job.

	> [AZURE.NOTE] Some MapReduce jobs may split the results across multiple **part-r-#####** files. If so, use the ##### suffix to indicate the order of the files.

4. To view the output, use the following command:

		hadoop fs -cat wasb:///example/data/WordCountOutput/part-r-00000

	This displays a list of the words that are contained in the **wasb://example/data/gutenberg/davinci.txt** file and the number of times each word occured. The following is an example of the data that will be contained in the file:

		wreathed        3
		wreathing       1
		wreaths 		1
		wrecked 		3
		wrenching       1
		wretched        6
		wriggling       1

##<a id="summary"></a>Summary

As you can see, Hadoop commands provide an easy way to run MapReduce jobs in an HDInsight cluster and then view the job output.

##<a id="nextsteps"></a>Next steps

For general information about MapReduce jobs in HDInsight:

* [Use MapReduce on HDInsight Hadoop](hdinsight-use-mapreduce.md)

For information about other ways you can work with Hadoop on HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)
