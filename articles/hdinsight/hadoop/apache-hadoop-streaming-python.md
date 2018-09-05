---
title: Develop Python streaming MapReduce jobs with HDInsight - Azure 
description: Learn how to use Python in streaming MapReduce jobs. Hadoop provides a streaming API for MapReduce for writing in languages other than Java.
services: hdinsight
keyword: mapreduce python,python map reduce,python mapreduce
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 04/10/2018
ms.author: jasonh

---
# Develop Python streaming MapReduce programs for HDInsight

Learn how to use Python in streaming MapReduce operations. Hadoop provides a streaming API for MapReduce that enables you to write map and reduce functions in languages other than Java. The steps in this document implement the Map and Reduce components in Python.

## Prerequisites

* A Linux-based Hadoop on HDInsight cluster

  > [!IMPORTANT]
  > The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).

* A text editor

  > [!IMPORTANT]
  > The text editor must use LF as the line ending. Using a line ending of CRLF causes errors when running the MapReduce job on Linux-based HDInsight clusters.

* The `ssh` and `scp` commands, or [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-3.8.0)

## Word count

This example is a basic word count implemented in a python a mapper and reducer. The mapper breaks sentences into individual words, and the reducer aggregates the words and counts to produce the output.

The following flowchart illustrates what happens during the map and reduce phases.

![illustration of the mapreduce process](./media/apache-hadoop-streaming-python/HDI.WordCountDiagram.png)

## Streaming MapReduce

Hadoop allows you to specify a file that contains the map and reduce logic that is used by a job. The specific requirements for the map and reduce logic are:

* **Input**: The map and reduce components must read input data from STDIN.
* **Output**: The map and reduce components must write output data to STDOUT.
* **Data format**: The data consumed and produced must be a key/value pair, separated by a tab character.

Python can easily handle these requirements by using the `sys` module to read from STDIN and using `print` to print to STDOUT. The remaining task is simply formatting the data with a tab (`\t`) character between the key and value.

## Create the mapper and reducer

1. Create a file named `mapper.py` and use the following code as the content:

   ```python
   #!/usr/bin/env python

   # Use the sys module
   import sys

   # 'file' in this case is STDIN
   def read_input(file):
       # Split each line into words
       for line in file:
           yield line.split()

   def main(separator='\t'):
       # Read the data using read_input
       data = read_input(sys.stdin)
       # Process each word returned from read_input
       for words in data:
           # Process each word
           for word in words:
               # Write to STDOUT
               print '%s%s%d' % (word, separator, 1)

   if __name__ == "__main__":
       main()
   ```

2. Create a file named **reducer.py** and use the following code as the content:

   ```python
   #!/usr/bin/env python

   # import modules
   from itertools import groupby
   from operator import itemgetter
   import sys

   # 'file' in this case is STDIN
   def read_mapper_output(file, separator='\t'):
       # Go through each line
       for line in file:
           # Strip out the separator character
           yield line.rstrip().split(separator, 1)

   def main(separator='\t'):
       # Read the data using read_mapper_output
       data = read_mapper_output(sys.stdin, separator=separator)
       # Group words and counts into 'group'
       #   Since MapReduce is a distributed process, each word
       #   may have multiple counts. 'group' will have all counts
       #   which can be retrieved using the word as the key.
       for current_word, group in groupby(data, itemgetter(0)):
           try:
               # For each word, pull the count(s) for the word
               #   from 'group' and create a total count
               total_count = sum(int(count) for current_word, count in group)
               # Write to stdout
               print "%s%s%d" % (current_word, separator, total_count)
           except ValueError:
               # Count was not a number, so do nothing
               pass

   if __name__ == "__main__":
       main()
   ```

## Run using PowerShell

To ensure that your files have the right line endings, use the following PowerShell script:

[!code-powershell[main](../../../powershell_scripts/hdinsight/streaming-python/streaming-python.ps1?range=138-140)]

Use the following PowerShell script to upload the files, run the job, and view the output:

[!code-powershell[main](../../../powershell_scripts/hdinsight/streaming-python/streaming-python.ps1?range=5-134)]

## Run from an SSH session

1. From your development environment, in the same directory as `mapper.py` and `reducer.py` files, use the following command:

    ```bash
    scp mapper.py reducer.py username@clustername-ssh.azurehdinsight.net:
    ```

    Replace `username` with the SSH user name for your cluster, and `clustername` with the name of your cluster.

    This command copies the files from the local system to the head node.

    > [!NOTE]
    > If you used a password to secure your SSH account, you are prompted for the password. If you used an SSH key, you may have to use the `-i` parameter and the path to the private key. For example, `scp -i /path/to/private/key mapper.py reducer.py username@clustername-ssh.azurehdinsight.net:`.

2. Connect to the cluster by using SSH:

    ```bash
    ssh username@clustername-ssh.azurehdinsight.net`
    ```

    For more information on, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

3. To ensure the mapper.py and reducer.py have the correct line endings, use the following commands:

    ```bash
    perl -pi -e 's/\r\n/\n/g' mapper.py
    perl -pi -e 's/\r\n/\n/g' reducer.py
    ```

4. Use the following command to start the MapReduce job.

    ```bash
    yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-streaming.jar -files mapper.py,reducer.py -mapper mapper.py -reducer reducer.py -input /example/data/gutenberg/davinci.txt -output /example/wordcountout
    ```

    This command has the following parts:

   * **hadoop-streaming.jar**: Used when performing streaming MapReduce operations. It interfaces Hadoop with the external MapReduce code you provide.

   * **-files**: Adds the specified files to the MapReduce job.

   * **-mapper**: Tells Hadoop which file to use as the mapper.

   * **-reducer**: Tells Hadoop which file to use as the reducer.

   * **-input**: The input file that we should count words from.

   * **-output**: The directory that the output is written to.

    As the MapReduce job works, the process is displayed as percentages.

        15/02/05 19:01:04 INFO mapreduce.Job:  map 0% reduce 0%
        15/02/05 19:01:16 INFO mapreduce.Job:  map 100% reduce 0%
        15/02/05 19:01:27 INFO mapreduce.Job:  map 100% reduce 100%


5. To view the output, use the following command:

    ```bash
    hdfs dfs -text /example/wordcountout/part-00000
    ```

    This command displays a list of words and how many times the word occurred.

## Next steps

Now that you have learned how to use streaming MapRedcue jobs with HDInsight, use the following links to explore other ways to work with Azure HDInsight.

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)
