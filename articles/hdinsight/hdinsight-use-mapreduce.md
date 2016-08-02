<properties
   pageTitle="MapReduce with Hadoop on HDInsight | Microsoft Azure"
   description="Learn how to run MapReduce jobs on Hadoop in HDInsight clusters. You'll run a basic word count operation implemented as a Java MapReduce job."
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
   ms.date="06/06/2016"
   ms.author="larryfr"/>

# Use MapReduce in Hadoop on HDInsight

[AZURE.INCLUDE [mapreduce-selector](../../includes/hdinsight-selector-use-mapreduce.md)]

In this article, you will learn how to run MapReduce jobs on Hadoop in HDInsight clusters. We run a basic word count operation implemented as a Java MapReduce job.

##<a id="whatis"></a>What is MapReduce?

Hadoop MapReduce is a software framework for writing jobs that process vast amounts of data. Input data is split into independent chunks, which are then processed in parallel across the nodes in your cluster. A MapReduce job consist of two functions:

* **Mapper**: Consumes input data, analyzes it (usually with filter and sorting operations), and emits tuples (key-value pairs)
* **Reducer**: Consumes tuples emitted by the Mapper and performs a summary operation that creates a smaller, combined result from the Mapper data

A basic word count MapReduce job example is illustrated in the following diagram:

![HDI.WordCountDiagram][image-hdi-wordcountdiagram]

The output of this job is a count of how many times each word occurred in the text that was analyzed.

* The mapper takes each line from the input text as an input and breaks it into words. It emits a key/value pair each time a word occurs of the word is followed by a 1. The output is sorted before sending it to reducer.

* The reducer sums these individual counts for each word and emits a single key/value pair that contains the word followed by the sum of its occurrences.

MapReduce can be implemented in a variety of languages. Java is the most common implementation, and is used for demonstration purposes in this document.

### Hadoop Streaming

Languages or frameworks that are based on Java and the Java Virtual Machine (for example, Scalding or Cascading,) can be ran directly as a MapReduce job, similar to a Java application. Others, such as C# or Python, or standalone executables, must use Hadoop streaming.

Hadoop streaming communicates with the mapper and reducer over STDIN and STDOUT - the mapper and reducer read data a line at a time from STDIN, and write the output to STDOUT. Each line read or emitted by the mapper and reducer must be in the format of a key/value pair, delimited by a tab charaacter:

    [key]/t[value]

For more information, see [Hadoop Streaming](http://hadoop.apache.org/docs/r1.2.1/streaming.html).

For examples of using Hadoop streaming with HDInsight, see the following:

* [Develop Python MapReduce jobs](hdinsight-hadoop-streaming-python.md)

##<a id="data"></a>About the sample data

In this example, for sample data, you will use the notebooks of Leonardo Da Vinci, which are provided as a text document in your HDInsight cluster.

The sample data is stored in Azure Blob storage, which HDInsight uses as the default file system for Hadoop clusters. HDInsight can access files stored in Blob storage by using the **wasb** prefix. For example, to access the sample.log file, you would use the following syntax:

	wasbs:///example/data/gutenberg/davinci.txt

Because Azure Blob storage is the default storage for HDInsight, you can also access the file by using **/example/data/gutenberg/davinci.txt**.

> [AZURE.NOTE] In the previous syntax, **wasbs:///** is used to access files that are stored in the default storage container for your HDInsight cluster. If you specified additional storage accounts when you provisioned your cluster, and you want to access files stored in these accounts, you can access the data by specifying the container name and storage account address. For example, **wasbs://mycontainer@mystorage.blob.core.windows.net/example/data/gutenberg/davinci.txt**.

##<a id="job"></a>About the example MapReduce

The MapReduce job that is used in this example is located at **wasbs://example/jars/hadoop-mapreduce-examples.jar**, and it is provided with your HDInsight cluster. This contains a word count example that you will run against **davinci.txt**.

> [AZURE.NOTE] On HDInsight 2.1 clusters, the file location is **wasbs:///example/jars/hadoop-examples.jar**.

For reference, the following is the Java code for the word count MapReduce job:

	package org.apache.hadoop.examples;

	import java.io.IOException;
	import java.util.StringTokenizer;

	import org.apache.hadoop.conf.Configuration;
	import org.apache.hadoop.fs.Path;
	import org.apache.hadoop.io.IntWritable;
	import org.apache.hadoop.io.Text;
	import org.apache.hadoop.mapreduce.Job;
	import org.apache.hadoop.mapreduce.Mapper;
	import org.apache.hadoop.mapreduce.Reducer;
	import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
	import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
	import org.apache.hadoop.util.GenericOptionsParser;

	public class WordCount {

	  public static class TokenizerMapper
	       extends Mapper<Object, Text, Text, IntWritable>{

	    private final static IntWritable one = new IntWritable(1);
	    private Text word = new Text();

	    public void map(Object key, Text value, Context context
	                    ) throws IOException, InterruptedException {
	      StringTokenizer itr = new StringTokenizer(value.toString());
	      while (itr.hasMoreTokens()) {
	        word.set(itr.nextToken());
	        context.write(word, one);
	      }
	    }
	  }

	  public static class IntSumReducer
	       extends Reducer<Text,IntWritable,Text,IntWritable> {
	    private IntWritable result = new IntWritable();

	    public void reduce(Text key, Iterable<IntWritable> values,
	                       Context context
	                       ) throws IOException, InterruptedException {
	      int sum = 0;
	      for (IntWritable val : values) {
	        sum += val.get();
	      }
	      result.set(sum);
	      context.write(key, result);
	    }
	  }

	  public static void main(String[] args) throws Exception {
	    Configuration conf = new Configuration();
	    String[] otherArgs = new GenericOptionsParser(conf, args).getRemainingArgs();
	    if (otherArgs.length != 2) {
	      System.err.println("Usage: wordcount <in> <out>");
	      System.exit(2);
	    }
	    Job job = new Job(conf, "word count");
	    job.setJarByClass(WordCount.class);
	    job.setMapperClass(TokenizerMapper.class);
	    job.setCombinerClass(IntSumReducer.class);
	    job.setReducerClass(IntSumReducer.class);
	    job.setOutputKeyClass(Text.class);
	    job.setOutputValueClass(IntWritable.class);
	    FileInputFormat.addInputPath(job, new Path(otherArgs[0]));
	    FileOutputFormat.setOutputPath(job, new Path(otherArgs[1]));
	    System.exit(job.waitForCompletion(true) ? 0 : 1);
	  }
	}

For instructions to write your own MapReduce job, see [Develop Java MapReduce programs for HDInsight](hdinsight-develop-deploy-java-mapreduce-linux.md).

##<a id="run"></a>Run the MapReduce

HDInsight can run HiveQL jobs by using a variety of methods. Use the following table to decide which method is right for you, then follow the link for a walkthrough.

| **Use this**...                                                    | **...to do this**                                       | ...with this **cluster operating system** | ...from this **client operating system** |
|:-------------------------------------------------------------------|:--------------------------------------------------------|:------------------------------------------|:-----------------------------------------|
| [SSH](hdinsight-hadoop-use-mapreduce-ssh.md)                       | Use the Hadoop command through **SSH**                  | Linux                                     | Linux, Unix, Mac OS X, or Windows        |
| [Curl](hdinsight-hadoop-use-mapreduce-curl.md)                     | Submit the job remotely by using **REST**               | Linux or Windows                          | Linux, Unix, Mac OS X, or Windows        |
| [Windows PowerShell](hdinsight-hadoop-use-mapreduce-powershell.md) | Submit the job remotely by using **Windows PowerShell** | Linux or Windows                          | Windows                                  |
| [Remote Desktop](hdinsight-hadoop-use-mapreduce-remote-desktop)    | Use the Hadoop command through **Remote Desktop**       | Windows                                   | Windows                                  |

##<a id="nextsteps"></a>Next steps

Although MapReduce provides powerful diagnostic abilities, it can be a bit challenging to master. There are several Java-based frameworks that make it easier to define MapReduce applications, as well as technologies such as Pig and Hive, which provide an easier way to work with data in HDInsight. To learn more, see the following articles:

* [Develop Java MapReduce programs for HDInsight](hdinsight-develop-deploy-java-mapreduce-linux.md)

* [Develop Python streaming MapReduce programs for HDInsight](hdinsight-hadoop-streaming-python.md)

* [Develop Scalding MapReduce jobs with Apache Hadoop on HDInsight](hdinsight-hadoop-mapreduce-scalding.md)

* [Use Hive with HDInsight][hdinsight-use-hive]

* [Use Pig with HDInsight][hdinsight-use-pig]

* [Run the HDInsight Samples][hdinsight-samples]


[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md
[hdinsight-develop-mapreduce-jobs]: hdinsight-develop-deploy-java-mapreduce-linux.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-samples]: hdinsight-run-samples.md
[hdinsight-provision]: hdinsight-provision-clusters.md

[powershell-install-configure]: ../powershell-install-configure.md

[image-hdi-wordcountdiagram]: ./media/hdinsight-use-mapreduce/HDI.WordCountDiagram.gif
