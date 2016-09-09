<properties
	pageTitle="Run Hadoop MapReduce samples on Linux-based HDInsight | Microsoft Azure"
	description="Get started using MapReduce samples with Linux-based HDInsight. Use SSH to connect to the cluster, then use the Hadoop command to run sample jobs."
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor="cgronlun"
    tags="azure-portal"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/12/2016"
	ms.author="larryfr"/>




#Run the Hadoop samples in HDInsight

[AZURE.INCLUDE [samples-selector](../../includes/hdinsight-run-samples-selector.md)]

Linux-based HDInsight clusters provide a set of MapReduce samples that can be used to familiarize yourself with running Hadoop MapReduce jobs. In this document, you will learn about the available samples and walk through running a few of them.

##Prerequisites

- **An Azure subscription**: See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/)

- **A Linux-based HDInsight cluster**: See [Get started using Hadoop with Hive in HDInsight on Linux](hdinsight-hadoop-linux-tutorial-get-started.md)

- **An SSH client**: For information on using SSH with HDInsight, see the following articles:

    - [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

    - [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

## The samples ##

**Location**: The samples are located on the HDInsight cluster at  **/usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar**

**Contents**: The following samples are contained in this archive:

- **aggregatewordcount**: An Aggregate based map/reduce program that counts the words in the input files
- **aggregatewordhist**: An Aggregate based map/reduce program that computes the histogram of the words in the input files
- **bbp**: A map/reduce program that uses Bailey-Borwein-Plouffe to compute exact digits of Pi
- **dbcount**: An example job that count the pageview counts from a database
- **distbbp**: A map/reduce program that uses a BBP-type formula to compute exact bits of Pi
- **grep**: A map/reduce program that counts the matches of a regex in the input
- **join**: A job that effects a join over sorted, equally partitioned datasets
- **multifilewc**: A job that counts words from several files
- **pentomino**: A map/reduce tile laying program to find solutions to pentomino problems
- **pi**: A map/reduce program that estimates Pi using a quasi-Monte Carlo method
- **randomtextwriter**: A map/reduce program that writes 10GB of random textual data per node
- **randomwriter**: A map/reduce program that writes 10GB of random data per node
- **secondarysort**: An example defining a secondary sort to the reduce
- **sort**: A map/reduce program that sorts the data written by the random writer
- **sudoku**: A sudoku solver
- **teragen**: Generate data for the terasort
- **terasort**: Run the terasort
- **teravalidate**: Checking results of terasort
- **wordcount**: A map/reduce program that counts the words in the input files
- **wordmean**: A map/reduce program that counts the average length of the words in the input files
- **wordmedian**: A map/reduce program that counts the median length of the words in the input files
- **wordstandarddeviation**: A map/reduce program that counts the standard deviation of the length of the words in the input files

**Source code**: Source code for these samples is included on the HDInsight cluster at **/usr/hdp/2.2.4.9-1/hadoop/src/hadoop-mapreduce-project/hadoop-mapreduce-examples**

> [AZURE.NOTE] The `2.2.4.9-1` in the path is the version of the Hortonworks Data Platform for the HDInsight cluster, and may change as HDInsight is updated.

## How to run the samples ##

1. Connect to HDInsight using SSH as described in the following articles:

    - [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

    - [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

2. From the `username@#######:~$` prompt, use the following command to list the samples:

        yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar

    This will generate the list of sample from the previous section of this document.

3. Use the following command to get help on a specific sample. In this case, the **wordcount** sample:

        yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar wordcount

    You should receive the following message:

        Usage: wordcount <in> [<in>...] <out>

    This indicates that you can provide several input paths for the source documents, and the final path is where the output (count of words in the source documents,) will be located.

4. Use the following to count all words in the Notebooks of Leonardo Da Vinci, which are provided as sample data with your cluster:

    	yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar wordcount /example/data/gutenberg/davinci.txt /example/data/davinciwordcount

    Input for this job is read from **wasbs:///example/data/gutenberg/davinci.txt**.

    Output for this example will be stored in **wasbs:///example/data/davinciwordcount**.

    > [AZURE.NOTE] As noted in the help for the wordcount sample, you could also specify multiple input files. For example, `hadoop jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar wordcount /example/data/gutenberg/davinci.txt /example/data/gutenberg/ulysses.txt /example/data/twowordcount` would count words in both davinci.txt and ulysses.txt.

5. Once the job completes, use the following command to view the output:

        hdfs dfs -cat /example/data/davinciwordcount/*

    This will concatenate all the output files produced by the job, and display them. For this basic example there is only one file, however if there were more this command would iterate over all of them.

    You will see output similar to the following from this command:

        zum     1
        zur     1
        zwanzig 1
        zweite  1

    Each line represents a word and how many times it occured in the input data.

## Sudoku

The Sudoku example has somewhat unhelpful usage instructions; "Include a puzzle on the command line."

[Sudoku](https://en.wikipedia.org/wiki/Sudoku) is a logic puzzle made up of nine 3x3 grids. Some cells in the grid have numbers, while others are blank, and the goal is to solve for the blank cells. The link above has more information on the puzzle, but the purpose of this sample is to solve for the blank cells. So our input should be a file that is in the following format:

- Nine rows of nine columns

- Each column can contain either a number or `?` (which indicates a blank cell)

- Cells are separated by a space

There is a certain way to construct Sudoku puzzles; you can't repeat a number in a column or row. There's an example on the HDInsight cluster that is properly constructed. It is located at **/usr/hdp/2.2.4.9-1/hadoop/src/hadoop-mapreduce-project/hadoop-mapreduce-examples/src/main/java/org/apache/hadoop/examples/dancing/puzzle1.dta** and contains the following:

    8 5 ? 3 9 ? ? ? ?
    ? ? 2 ? ? ? ? ? ?
    ? ? 6 ? 1 ? ? ? 2
    ? ? 4 ? ? 3 ? 5 9
    ? ? 8 9 ? 1 4 ? ?
    3 2 ? 4 ? ? 8 ? ?
    9 ? ? ? 8 ? 5 ? ?
    ? ? ? ? ? ? 2 ? ?
    ? ? ? ? 4 5 ? 7 8

> [AZURE.NOTE] The `2.2.4.9-1` portion of the path may change as updates are made to the HDInsight cluster.

To run this through the Sudoku example, use the following command:

    yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar sudoku /usr/hdp/2.2.9.1-1/hadoop/src/hadoop-mapreduce-project/hadoop-mapreduce-examples/src/main/java/org/apache/hadoop/examples/dancing/puzzle1.dta

The results should appear similar to the following:

    8 5 1 3 9 2 6 4 7
    4 3 2 6 7 8 1 9 5
    7 9 6 5 1 4 3 8 2
    6 1 4 8 2 3 7 5 9
    5 7 8 9 6 1 4 2 3
    3 2 9 4 5 7 8 1 6
    9 4 7 2 8 6 5 3 1
    1 8 5 7 3 9 2 6 4
    2 6 3 1 4 5 9 7 8

## Pi (π)

The pi sample uses a statistical (quasi-Monte Carlo) method to estimate the value of pi. Points placed at random inside of a unit square also fall within a circle inscribed within that square with a probability equal to the area of the circle, pi/4. The value of pi can be estimated from the value of 4R, where R is the ratio of the number of points that are inside the circle to the total number of points that are within the square. The larger the sample of points used, the better the estimate is.

The mapper for this sample generates a number of points at random inside of a unit square and then counts the number of those points that are inside the circle.

The reducer then accumulates points counted by the mappers and estimates the value of pi from the formula 4R, where R is the ratio of the number of points counted inside the circle to the total number of points that are within the square.

Use the following command to run this sample. This uses 16 maps with 10,000,000 samples each to estimate the value of pi:

    yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar pi 16 10000000

The value returned by this should be similar to **3.14159155000000000000**. For references, the first 10 decimal places of pi are 3.1415926535.

##10GB Greysort

GraySort is a benchmark sort whose metric is the sort rate (TB/minute) that is achieved while sorting very large amounts of data, usually a 100TB minimum.

This sample uses a modest 10GB of data so that it can be run relatively quickly. It uses the MapReduce applications developed by Owen O'Malley and Arun Murthy that won the annual general-purpose ("daytona") terabyte sort benchmark in 2009 with a rate of 0.578TB/min (100TB in 173 minutes). For more information on this and other sorting benchmarks, see the [Sortbenchmark](http://sortbenchmark.org/) site.

This sample uses three sets of MapReduce programs:

- **TeraGen**: A MapReduce program that generates rows of data to sort

- **TeraSort**: Samples the input data and uses MapReduce to sort the data into a total order

    TeraSort is a standard sort of MapReduce functions, except for a custom partitioner that uses a sorted list of N-1 sampled keys that define the key range for each reduce. In particular, all keys such that sample[i-1] <= key < sample[i] are sent to reduce i. This guarantees that the outputs of reduce i are all less than the output of reduce i+1.

- **TeraValidate**: A MapReduce program that validates that the output is globally sorted

    It creates one map per file in the output directory, and each map ensures that each key is less than or equal to the previous one. The map function also generates records of the first and last keys of each file, and the reduce function ensures that the first key of file i is greater than the last key of file i-1. Any problems are reported as an output of the reduce with the keys that are out of order.

Use the following steps to generate data, sort, and then validate the output:

1. Generate 10GB of data, which will be stored to the HDInsight cluster's default storage at **wasbs:///example/data/10GB-sort-input**:

        yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar teragen -Dmapred.map.tasks=50 100000000 /example/data/10GB-sort-input

	The `-Dmapred.map.tasks` tells Hadoop how many map tasks to use for this job. The final two parameters instruct the job to create 10GB worth of data and to store it at **wasbs:///example/data/10GB-sort-input**.

2. Use the following command to sort the data:

		yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar terasort -Dmapred.map.tasks=50 -Dmapred.reduce.tasks=25 /example/data/10GB-sort-input /example/data/10GB-sort-output

	The `-Dmapred.reduce.tasks` tells Hadoop how many reduce tasks to use for the job. The final two parameters are just the input and output locations for data.

3. Use the following to validate the data generated by the sort:

		yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar teravalidate -Dmapred.map.tasks=50 -Dmapred.reduce.tasks=25 /example/data/10GB-sort-output /example/data/10GB-sort-validate

##Next steps ##

From this article, you learned how to run the samples included with the Linux-based HDInsight clusters. For tutorials about using Pig, Hive, and MapReduce with HDInsight, see the following topics:

* [Use Pig with Hadoop on HDInsight][hdinsight-use-pig]
* [Use Hive with Hadoop on HDInsight][hdinsight-use-hive]
* [Use MapReduce with Hadoop on HDInsight] [hdinsight-use-mapreduce]



[hdinsight-errors]: hdinsight-debug-jobs.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-sdk-documentation]: https://msdn.microsoft.com/library/azure/dn479185.aspx

[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md
[hdinsight-introduction]: hdinsight-hadoop-introduction.md



[hdinsight-samples]: hdinsight-run-samples.md

[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
