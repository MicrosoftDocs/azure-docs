<properties
	pageTitle="Run an Hadoop MapReduce word count example in HDInsight | Azure"
	description="Run a MapReduce word count example on an Hadoop cluster in HDInsight. The program, written in Java, counts word occurrences in a text file."
	editor="cgronlun"
	manager="paulettm"
	services="hdinsight"
	documentationCenter=""
	authors="bradsev"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/30/2015" 
	ms.author="bradsev"/>

#Run a MapReduce word count example on a Hadoop cluster in HDInsight

This tutorial shows you how to run a MapReduce word count example on a Hadoop cluster in HDInsight. The program is written in Java. It counts word occurrences in a text file, and then outputs a new text file that contains each word paired with its frequency of occurrence. The text file analyzed in this sample is the Project Gutenberg eBook edition of The Notebooks of Leonardo Da Vinci.


**You will learn:**

* How to use Azure PowerShell to run a MapReduce program on an HDInsight cluster.
* How to write MapReduce programs in Java.


**Prerequisites**:

- You must have an Azure account. For options about signing up for an account, see the [Try out Azure for free](http://azure.microsoft.com/pricing/free-trial/) page.

- You must have provisioned an HDInsight cluster. For instructions about the various ways in which such clusters can be created, see [Get Started with Azure HDInsight][hdinsight-get-started] or [Provision HDInsight Clusters](hdinsight-provision-clusters.md).

- You must have installed Azure PowerShell, and have it configured for use with your account. For instructions about how to do this, see [Install and configure Azure PowerShell][powershell-install-configure].

<h2><a id="run-sample"></a>Run the sample by using Azure PowerShell</h2>

**To submit the MapReduce job**

1.	Open the **Azure PowerShell** console. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].

3. Set the two variables in the following commands, and then run them:

		$subscriptionName = "<SubscriptionName>"   # Azure subscription name
		$clusterName = "<ClusterName>"             # HDInsight cluster name

5. Run the following command to create a MapReduce job definition:

		# Define the MapReduce job
		$wordCountJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-mapreduce-examples.jar" -ClassName "wordcount" -Arguments "wasb:///example/data/gutenberg/davinci.txt", "wasb:///example/data/WordCountOutput"

	> [AZURE.NOTE] *hadoop-examples.jar* comes with HDInsight version 2.1 clusters. The file was renamed *hadoop-mapreduce.jar* on HDInsight version 3.0 clusters.

	The hadoop-mapreduce-examples.jar file comes with the HDInsight cluster. There are two arguments for the MapReduce job. The first one is the source file name, and the second is the output file path. The source file comes with the HDInsight cluster, and the output file path will be created at run time.

6. Run the following command to submit the MapReduce job:

		# Submit the job
		Select-AzureSubscription $subscriptionName
		$wordCountJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $wordCountJobDefinition | Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600  

	In addition to the MapReduce job definition, you also provide the HDInsight cluster name for where you want to run the MapReduce job.

8. Run the following command to check for errors with running the MapReduce job:

		# Get the job output
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $wordCountJob.JobId -StandardError

**To retrieve the results of the MapReduce job**

1. Open the **Azure PowerShell**console.
2. Set the three variables in the following commands, and then run them:

		$subscriptionName = "<SubscriptionName>"       # Azure subscription name
		$storageAccountName = "<StorageAccountName>"   # Azure storage account name
		$containerName = "<ContainerName>"			   # Blob storage container name

	The Azure Storage account is the one you created earlier in the tutorial. The storage account is used to host the blob that is used as the default HDInsight cluster file system. The Azure Blob storage container name usually shares the same name as the HDInsight cluster, unless you specify a different name when you provision the cluster.

3. Run the following commands to create an Azure storage context object:

		# Select the current subscription
		Select-AzureSubscription $subscriptionName

		# Create the storage account context object
		$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
		$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  

	**Select-AzureSubscription** is used to set the current subscription if you have multiple subscriptions, and the default subscription is not the one you want to use.

4. Run the following command to download the MapReduce job output from the blob to the workstation:

		# Download the job output to the workstation
		Get-AzureStorageBlobContent -Container $ContainerName -Blob example/data/WordCountOutput/part-r-00000 -Context $storageContext -Force

	The */example/data/WordCountOutput* folder is the output folder specified when you run the MapReduce job. *part-r-00000* is the default file name for MapReduce job output. The file will be downloaded to the same folder structure in the local folder. For example, in the following screenshot, the current folder is the C root folder. The file will be downloaded to the *C:\example\data\WordCountOutput* folder.

5. Run the following command to print the MapReduce job output file:

		cat ./example/data/WordCountOutput/part-r-00000 | findstr "there"


	The MapReduce job produces a file named *part-r-00000*, which contains words and the counts. The script uses the **findstr** command to list all of the words that contains *"there"*.

The output from the WordCount script should appear in the command window:

![Word frequency results in PowerShell from the Hadoop MapReduce word count example in HDInsight.][image-hdi-sample-wordcount-output]

Note that the output files of a MapReduce job are immutable. So if you rerun this sample, you need to change the name of the output file.

<h2><a id="java-code"></a>Java code for the WordCount MapReduce program</h2>



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



In this tutorial, you have seen how to run a MapReduce program that counts word occurrences in a text file with HDInsight by using Azure PowerShell.

<h2><a id="next-steps"></a>Next steps</h2>

For tutorials that run other samples and provide instructions about using Pig, Hive, and MapReduce jobs on Azure HDInsight with Azure PowerShell, see:

* [Get Started with Azure HDInsight][hdinsight-get-started]
* [Sample: 10GB GraySort][hdinsight-sample-10gb-graysort]
* [Sample: Pi Estimator][hdinsight-sample-pi-estimator]
* [Sample: C# Steaming][hdinsight-sample-cs-streaming]
* [Use Pig with HDInsight][hdinsight-use-pig]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Azure HDInsight SDK documentation][hdinsight-sdk-documentation]

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/library/dn479185.aspx

[hdinsight-sample-10gb-graysort]: hdinsight-sample-10gb-graysort.md
[hdinsight-sample-pi-estimator]: hdinsight-sample-pi-estimator.md
[hdinsight-sample-cs-streaming]: hdinsight-sample-csharp-streaming.md


[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md

[hdinsight-get-started]: hdinsight-get-started.md

[Powershell-install-configure]: install-configure-powershell.md

[image-hdi-sample-wordcount-output]: ./media/hdinsight-sample-wordcount/HDI.Sample.WordCount.Output.png
