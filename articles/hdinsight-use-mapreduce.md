<properties
   pageTitle="MapReduce with Hadoop on HDInsight"
   description="Learn how to use MapReduce with Hadoop on HDInsight."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang=""
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="02/20/2015"
   ms.author="larryfr"/>

# Use MapReduce in Hadoop on HDInsight

[AZURE.INCLUDE [mapreduce-selector](../includes/hdinsight-selector-use-mapreduce.md)]

In this document, you will learn how to run MapReduce jobs on Hadoop on HDInsight clusters by running a basic word count operation implemented as a Java MapReduce job.

##<a id="whatis"></a>What is MapReduce?

Hadoop MapReduce is a software framework for writing jobs which process vast amounts of data. Input data is split into independent chunks, which are then processed in parallel across the nodes in your cluster. A MapReduce job consist of two functions.

* **Mapper** - Consumes input data, analyzes it (usually filter and sorting operations,) and emits tuples (key-value pairs)
* **Reducer** - Consumes tuples emitted by the Mapper and performs a summary operation that creates a smaller, combined result from the Mapper data

For example, a basic word count MapReduce job is illustrated in the following diagram.

![HDI.WordCountDiagram][image-hdi-wordcountdiagram]

The output of this job is a count of how many times each word occurred in the text that was analyzed.

* The mapper takes each line from the input text as an input and breaks it into words. It emits a key/value pair each time a work occurs of the word followed by a 1. The output will be sorted before sending to reducer. 

* The reducer then sums these individual counts for each word and emits a single key/value pair containing the word followed by the sum of its occurrences.


##<a id="data"></a>About the sample data

For sample data, you will use the notebooks of Leonardo Da Vinci, which are provided as a text document on your HDInsight cluster.

The sample data is stored in Azure Blob storage, which HDInsight uses as the default file system for Hadoop clusters. HDInsight can access files stored in blob storage using the **wasb** prefix. For example, to access the sample.log file, you would use the following syntax:

	wasb:///example/data/gutenberg/davinci.txt

Since WASB is the default storage for HDInsight, you can also access the file using **/example/data/gutenberg/davinci.txt**.

> [AZURE.NOTE] The above syntax, **wasb:///**, is used to access files stored on the default storage container for your HDInsight cluster. If you specified additional storage accounts when you provisioned your cluster, and want to access files stored on these accounts, you can access the data by specifying the container name and storage account address. For example, **wasb://mycontainer@mystorage.blob.core.windows.net/example/data/gutenberg/davinci.txt**.

##<a id="job"></a>About the example MapReduce

The example MapReduce job used in this example is included in the **wasb://example/jars/hadoop-mapreduce-examples.jar** provided with your HDInsight cluster. This contains a word count example that will be ran against **davinci.txt**.

> [AZURE.NOTE] On HDInsight 2.1 clusters, the file location is **wasb:///example/jars/hadoop-examples.jar**

For reference, the following is the Java code for the word count MapReduce job.
 
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

For instructions on writing your own MapReduce job, see [Develop Java MapReduce programs for HDInsight][hdinsight-develop-MapReduce-jobs].

##<a id="run"></a>Run the MapReduce

HDInsight can run HiveQL jobs using a variety of methods. Use the following table to decide which method is right for you, then follow the link for a walkthrough.

|**Use this**... | **to do this** | with this **Cluster OS** | from this **client OS**|
----------------------------------- | ------------------------ | ---------------- | ------------
<a href="../hdinsight-hadoop-use-mapreduce-ssh/" target="_blank">SSH</a> | use the Hadoop command through **SSH** | Linux | Linux, Unix, Mac OS X, or Windows
<a href="../hdinsight-hadoop-use-mapreduce-curl/" target="_blank">Curl</a> | submit the job remotely using **REST** | Linux or Windows | Linux, Unix, Mac OS X, or Windows
<a href="../hdinsight-hadoop-use-mapreduce-powershell/" target="_blank">PowerShell</a> | submit the job remotely using **PowerShell**| Linux or Windows | Windows
<a href="../hdinsight-hadoop-use-mapreduce-remote-desktop/" target="_blank">Remote Desktop</a> |use the Hadoop command through **Remote Desktop** | Windows | Windows

	
##<a id="nextsteps"></a>Next steps
While MapReduce provides powerful diagnostic abilities, it can be a bit challenging to master. Other languages such as Pig and Hive provide an easier way to work with data in HDInsight. To learn more, see the following articles:

* [Get Started with Azure HDInsight][hdinsight-get-started]
* [Develop Java MapReduce programs for HDInsight][hdinsight-develop-MapReduce-jobs]
* [Develop Python streaming MapReduce programs for HDInsight](../hdinsight-hadoop-streaming-python)
* [Develop C# Hadoop streaming MapReduce programs for HDInsight][hdinsight-develop-streaming]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Pig with HDInsight][hdinsight-use-pig] 
* [Run the HDInsight Samples][hdinsight-samples]


[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-develop-mapreduce-jobs]: ../hdinsight-develop-deploy-java-mapreduce/
[hdinsight-develop-streaming]: ../hdinsight-hadoop-develop-deploy-streaming-jobs/
[hdinsight-use-hive]: ../hdinsight-use-hive/
[hdinsight-use-pig]: ../hdinsight-use-pig/
[hdinsight-samples]: ../hdinsight-run-samples/
[hdinsight-provision]: ../hdinsight-provision-clusters/

[powershell-install-configure]: ../install-and-configure-powershell/

[image-hdi-wordcountdiagram]: ./media/hdinsight-use-mapreduce/HDI.WordCountDiagram.gif





