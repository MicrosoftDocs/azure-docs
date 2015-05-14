<properties
   pageTitle="Develop Python MapReduce jobs with HDInsight | Microsoft Aure"
   description="Learn how to create and run Python MapReduce jobs on Linux-based HDInsight clusters."
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

#Develop Python streaming programs for HDInsight

Hadoop provides a streaming API for MapReduce that enables you to write map and reduce functions in languages other than Java. In this article, you will learn how to use Python to perform MapReduce operations.

> [AZURE.NOTE] This article is based on information and examples published by Michael Noll at [http://www.michael-noll.com/tutorials/writing-an-hadoop-mapreduce-program-in-python/](Writing an Hadoop MapReduce Program in Python).

##Prerequisites

To complete the steps in this article, you will need the following:

* A Linux-based Hadoop on HDInsight cluster

* A text editor

* For Windows clients, PuTTY and PSCP. These utilities are available from the <a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html" target="_blank">PuTTY Download Page</a>.

##Word count

For this example, you will implement a basic word count by using a mapper and reducer. The mapper breaks sentences into individual words, and the reducer aggregates the words and counts to produce the output.

The following flowchart illustrates what happens during the map and reduce phases.

![illustration of map reduce](./media/hdinsight-hadoop-streaming-python/HDI.WordCountDiagram.png)

##Why Python?

Python is a general-purpose, high-level programming language that allows you to express concepts in fewer lines of code than many other languages. It has recently became popular with data scientists as a prototyping language because its interpreted nature, dynamic typing, and elegant syntax make it suitable for rapid application development.

Python is installed on all HDInsight clusters.

##Streaming MapReduce

Hadoop allows you to specify a file that contains the map and reduce logic that is used by a job. The specific requirements for the map and reduce logic are:

* **Input**: The map and reduce components must read input data from STDIN.

* **Output**: The map and reduce components must write output data to STDOUT.

* **Data format**: The data consumed and produced must be a key/value pair, separated by a tab character.

Python can easily handle these requirements by using the **sys** module to read from STDIN and using **print** to print to STDOUT. The remaining task is simply formatting the data with a tab (`\t`) character between the key and value.

##Create the mapper and reducer

The mapper and reducer are text files, in this case **mapper.py** and **reducer.py** (to make it clear which does what). You can create these by using the editor of your choice.

###Mapper.py

Create a new file named **mapper.py** and use the following code as the content:

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
		# Process each words returned from read_input
		for words in data:
			# Process each word
			for word in words:
				# Write to STDOUT
				print '%s%s%d' % (word, separator, 1)

	if __name__ == "__main__":
		main()

Take a moment to read through the code so you can understand what it does.

###Reducer.py

Create a new file named **reducer.py** and use the following code as the content:

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

##Upload the files

Both **mapper.py** and **reducer.py** must be on the head node of the cluster before we can run them. The easiest way to upload them is to use **scp** (**pscp** if you are using a Windows client).

From the client, in the same directory as **mapper.py** and **reducer.py**, use the following command. Replace **username** with an SSH user, and **clustername** with the name of your cluster.

	scp mapper.py reducer.py username@clustername-ssh.azurehdinsight.net:

This copies the files from the local system to the head node.

> [AZURE.NOTE] If you used a password to secure your SSH account, you will be prompted for the password. If you used an SSH key, you may have to use the `-i` parameter and the path to the private key, for example, `scp -i /path/to/private/key mapper.py reducer.py username@clustername-ssh.azurehdinsight.net:`.

##Run MapReduce

1. Connect to the cluster by using SSH:

		ssh username@clustername-ssh.azurehdinsight.net

	> [AZURE.NOTE] If you used a password to secure your SSH account, you will be prompted for the password. If you used an SSH key, you may have to use the `-i` parameter and the path to the private key, for example, `ssh -i /path/to/private/key username@clustername-ssh.azurehdinsight.net`.

2. Use the following command to start the MapReduce job.

		hadoop jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-streaming.jar -files mapper.py,reducer.py -mapper mapper.py -reducer reducer.py -input wasb:///example/data/davinci.txt -output wasb:///example/wordcountout

	This command has the following parts:

	* **hadoop-streaming.jar**: Used when performing streaming MapReduce operations. It interfaces Hadoop with the external MapReduce code you provide.
	
	* **-files**: Tells Hadoop that the specified files are needed for this MapReduce job, and they should be copied to all the worker nodes.

	* **-mapper**: Tells Hadoop which file to use as the mapper.

	* **-reducer**: Tells Hadoop which file to use as the reducer.

	* **-input**: The input file that we should count words from.

	* **-output**: The directory that the output will be written to.

		> [AZURE.NOTE] This directory will be created by the job.

You should see a bunch of **INFO** statements as the job starts, and finally see the **map** and **reduce** operation displayed as percentages.

	15/02/05 19:01:04 INFO mapreduce.Job:  map 0% reduce 0%
	15/02/05 19:01:16 INFO mapreduce.Job:  map 100% reduce 0%
	15/02/05 19:01:27 INFO mapreduce.Job:  map 100% reduce 100%

You will receive status information about the job when it completes.

##View the output

When the job is complete, use the following command to view the output:

	hadoop fs -text /example/wordcountout/part-00000

This should display a list of words and how many times the word occurred. The following is an sample of the output data:

	wrenching       1
	wretched        6
	wriggling       1
	wrinkled,       1
	wrinkles        2
	wrinkling       2

##Next steps

Now that you have learned how to use streaming MapRedcue jobs with HDInsight, use the following links to explore other ways to work with Azure HDInsight.

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)
