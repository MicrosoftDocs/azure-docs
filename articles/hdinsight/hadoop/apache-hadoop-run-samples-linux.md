---
title: Run Apache Hadoop MapReduce examples on HDInsight - Azure 
description: Get started using MapReduce samples in jar files included in HDInsight. Use SSH to connect to the cluster, and then use the Hadoop command to run sample jobs.
keywords: hadoop example jar,hadoop examples jar,hadoop mapreduce examples,mapreduce examples
author: hrasheed-msft
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 04/25/2019
ms.author: hrasheed
---

# Run the MapReduce examples included in HDInsight

[!INCLUDE [samples-selector](../../../includes/hdinsight-run-samples-selector.md)]

Learn how to run the MapReduce examples included with Apache Hadoop on HDInsight.

## Prerequisites

* An Apache Hadoop cluster on HDInsight. See [Get Started with HDInsight on Linux](./apache-hadoop-linux-tutorial-get-started.md).

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

## The MapReduce examples

**Location**: The samples are located on the HDInsight cluster at `/usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar`.

**Contents**: The following samples are contained in this archive:

* `aggregatewordcount`: An Aggregate based mapreduce program that counts the words in the input files.
* `aggregatewordhist`: An Aggregate based mapreduce program that computes the histogram of the words in the input files.
* `bbp`: A mapreduce program that uses Bailey-Borwein-Plouffe to compute exact digits of Pi.
* `dbcount`: An example job that counts the pageview logs stored in a database.
* `distbbp`: A mapreduce program that uses a BBP-type formula to compute exact bits of Pi.
* `grep`: A mapreduce program that counts the matches of a regex in the input.
* `join`: A job that performs a join over sorted, equally partitioned datasets.
* `multifilewc`: A job that counts words from several files.
* `pentomino`: A mapreduce tile laying program to find solutions to pentomino problems.
* `pi`: A mapreduce program that estimates Pi using a quasi-Monte Carlo method.
* `randomtextwriter`: A mapreduce program that writes 10 GB of random textual data per node.
* `randomwriter`: A mapreduce program that writes 10 GB of random data per node.
* `secondarysort`: An example defining a secondary sort to the reduce phase.
* `sort`: A mapreduce program that sorts the data written by the random writer.
* `sudoku`: A sudoku solver.
* `teragen`: Generate data for the terasort.
* `terasort`: Run the terasort.
* `teravalidate`: Checking results of terasort.
* `wordcount`: A mapreduce program that counts the words in the input files.
* `wordmean`: A mapreduce program that counts the average length of the words in the input files.
* `wordmedian`: A mapreduce program that counts the median length of the words in the input files.
* `wordstandarddeviation`: A mapreduce program that counts the standard deviation of the length of the words in the input files.

**Source code**: Source code for these samples is included on the HDInsight cluster at `/usr/hdp/current/hadoop-client/src/hadoop-mapreduce-project/hadoop-mapreduce-examples`.

## Run the wordcount example

1. Connect to HDInsight using SSH. Replace `CLUSTER` with the name of your cluster and then enter the following command:

    ```cmd
    ssh sshuser@CLUSTER-ssh.azurehdinsight.net
    ```

2. From the `username@#######:~$` prompt, use the following command to list the samples:

    ```bash
    yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar
    ```

    This command generates the list of sample from the previous section of this document.

3. Use the following command to get help on a specific sample. In this case, the **wordcount** sample:

    ```bash
    yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar wordcount
    ```

    You receive the following message:

        Usage: wordcount <in> [<in>...] <out>

    This message indicates that you can provide several input paths for the source documents. The final path is where the output (count of words in the source documents) is stored.

4. Use the following to count all words in the Notebooks of Leonardo da Vinci, which are provided as sample data with your cluster:

    ```bash
    yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar wordcount /example/data/gutenberg/davinci.txt /example/data/davinciwordcount
    ```

    Input for this job is read from `/example/data/gutenberg/davinci.txt`. Output for this example is stored in `/example/data/davinciwordcount`. Both paths are located on default storage for the cluster, not the local file system.

   > [!NOTE]  
   > As noted in the help for the wordcount sample, you could also specify multiple input files. For example, `hadoop jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar wordcount /example/data/gutenberg/davinci.txt /example/data/gutenberg/ulysses.txt /example/data/twowordcount` would count words in both davinci.txt and ulysses.txt.

5. Once the job completes, use the following command to view the output:

    ```bash
    hdfs dfs -cat /example/data/davinciwordcount/*
    ```

    This command concatenates all the output files produced by the job. It displays the output to the console. The output is similar to the following text:

        zum     1
        zur     1
        zwanzig 1
        zweite  1

    Each line represents a word and how many times it occurred in the input data.

## The Sudoku example

[Sudoku](https://en.wikipedia.org/wiki/Sudoku) is a logic puzzle made up of nine 3x3 grids. Some cells in the grid have numbers, while others are blank, and the goal is to solve for the blank cells. The previous link has more information on the puzzle, but the purpose of this sample is to solve for the blank cells. So our input should be a file that is in the following format:

* Nine rows of nine columns
* Each column can contain either a number or `?` (which indicates a blank cell)
* Cells are separated by a space

There is a certain way to construct Sudoku puzzles; you can't repeat a number in a column or row. There's an example on the HDInsight cluster that is properly constructed. It is located at `/usr/hdp/*/hadoop/src/hadoop-mapreduce-project/hadoop-mapreduce-examples/src/main/java/org/apache/hadoop/examples/dancing/puzzle1.dta` and contains the following text:

    8 5 ? 3 9 ? ? ? ?
    ? ? 2 ? ? ? ? ? ?
    ? ? 6 ? 1 ? ? ? 2
    ? ? 4 ? ? 3 ? 5 9
    ? ? 8 9 ? 1 4 ? ?
    3 2 ? 4 ? ? 8 ? ?
    9 ? ? ? 8 ? 5 ? ?
    ? ? ? ? ? ? 2 ? ?
    ? ? ? ? 4 5 ? 7 8

To run this example problem through the Sudoku example, use the following command:

```bash
yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar sudoku /usr/hdp/*/hadoop/src/hadoop-mapreduce-project/hadoop-mapreduce-examples/src/main/java/org/apache/hadoop/examples/dancing/puzzle1.dta
```

The results appear similar to the following text:

    8 5 1 3 9 2 6 4 7
    4 3 2 6 7 8 1 9 5
    7 9 6 5 1 4 3 8 2
    6 1 4 8 2 3 7 5 9
    5 7 8 9 6 1 4 2 3
    3 2 9 4 5 7 8 1 6
    9 4 7 2 8 6 5 3 1
    1 8 5 7 3 9 2 6 4
    2 6 3 1 4 5 9 7 8

## Pi (π) example

The pi sample uses a statistical (quasi-Monte Carlo) method to estimate the value of pi. Points are placed at random in a unit square. The square also contains a circle. The probability that the points fall within the circle are equal to the area of the circle, pi/4. The value of pi can be estimated from the value of 4R. R is the ratio of the number of points that are inside the circle to the total number of points that are within the square. The larger the sample of points used, the better the estimate is.

Use the following command to run this sample. This command uses 16 maps with 10,000,000 samples each to estimate the value of pi:

```bash
yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar pi 16 10000000
```

The value returned by this command is similar to **3.14159155000000000000**. For references, the first 10 decimal places of pi are 3.1415926535.

## 10 GB GraySort example

GraySort is a benchmark sort. The metric is the sort rate (TB/minute) that is achieved while sorting large amounts of data, usually a 100 TB minimum.

This sample uses a modest 10 GB of data so that it can be run relatively quickly. It uses the MapReduce applications developed by Owen O'Malley and Arun Murthy. These applications won the annual general-purpose ("Daytona") terabyte sort benchmark in 2009, with a rate of 0.578 TB/min (100 TB in 173 minutes). For more information on this and other sorting benchmarks, see the [Sort Benchmark](https://sortbenchmark.org/) site.

This sample uses three sets of MapReduce programs:

* **TeraGen**: A MapReduce program that generates rows of data to sort

* **TeraSort**: Samples the input data and uses MapReduce to sort the data into a total order

    TeraSort is a standard MapReduce sort, except for a custom partitioner. The partitioner uses a sorted list of N-1 sampled keys that define the key range for each reduce. In particular, all keys such that sample[i-1] <= key < sample[i] are sent to reduce i. This partitioner guarantees that the outputs of reduce i are all less than the output of reduce i+1.

* **TeraValidate**: A MapReduce program that validates that the output is globally sorted

    It creates one map per file in the output directory, and each map ensures that each key is less than or equal to the previous one. The map function generates records of the first and last keys of each file. The reduce function ensures that the first key of file i is greater than the last key of file i-1. Any problems are reported as an output of the reduce phase, with the keys that are out of order.

Use the following steps to generate data, sort, and then validate the output:

1. Generate 10 GB of data, which is stored to the HDInsight cluster's default storage at `/example/data/10GB-sort-input`:

    ```bash
    yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar teragen -Dmapred.map.tasks=50 100000000 /example/data/10GB-sort-input
    ```

    The `-Dmapred.map.tasks` tells Hadoop how many map tasks to use for this job. The final two parameters instruct the job to create 10 GB of data and to store it at `/example/data/10GB-sort-input`.

2. Use the following command to sort the data:

    ```bash
    yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar terasort -Dmapred.map.tasks=50 -Dmapred.reduce.tasks=25 /example/data/10GB-sort-input /example/data/10GB-sort-output
    ```

    The `-Dmapred.reduce.tasks` tells Hadoop how many reduce tasks to use for the job. The final two parameters are just the input and output locations for data.

3. Use the following to validate the data generated by the sort:

    ```bash
    yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-mapreduce-examples.jar teravalidate -Dmapred.map.tasks=50 -Dmapred.reduce.tasks=25 /example/data/10GB-sort-output /example/data/10GB-sort-validate
    ```

## Next steps

From this article, you learned how to run the samples included with the Linux-based HDInsight clusters. For tutorials about using Pig, Hive, and MapReduce with HDInsight, see the following topics:

* [Use Apache Pig with Apache Hadoop on HDInsight](hdinsight-use-pig.md)
* [Use Apache Hive with Apache Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use MapReduce with Apache Hadoop on HDInsight](hdinsight-use-mapreduce.md)